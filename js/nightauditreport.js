let nightAuditReportData = null

function normalizeNightAuditAmount(value = 0) {
    const amount = Number(value || 0)
    return Number.isFinite(amount) ? amount : 0
}

function formatNightAuditAmount(value = 0) {
    const amount = normalizeNightAuditAmount(value)
    return amount === 0 ? '' : formatNumber(amount)
}

function toTitleCase(value = '') {
    return String(value || '')
        .replace(/[_-]+/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase())
}

function prettifyNightAuditLabel(raw = '') {
    const normalized = String(raw || '').trim()
    if(!normalized) return '-'
    const monthStripped = normalized
        .replace(/month$/i, '')
        .replace(/^month/i, '')
        .trim()
    return toTitleCase(monthStripped)
}

const NIGHT_AUDIT_TAX_LABELS = {
    consumptioncharges: 'Consumption Tax',
    servicecharges: 'Service Charge 10%',
    taxcharges: 'VAT 7.5%'
}

function normalizeNightAuditKey(value = '') {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

function getNightAuditLabel(raw = '', labelMap = {}) {
    const mappedLabel = labelMap[normalizeNightAuditKey(raw)]
    return mappedLabel || prettifyNightAuditLabel(raw)
}

function extractTodayMonthAmountFromEntry(entry = {}, key = '') {
    const todayKeyDirect = key
    const monthKeySuffix = `${key}month`
    const monthKeyPrefix = `month${key}`
    const keys = Object.keys(entry || {})

    const todayAmount = normalizeNightAuditAmount(entry?.[todayKeyDirect] ?? 0)

    let monthAmount = 0
    if(Object.prototype.hasOwnProperty.call(entry, monthKeySuffix)) {
        monthAmount = normalizeNightAuditAmount(entry[monthKeySuffix])
    } else if(Object.prototype.hasOwnProperty.call(entry, monthKeyPrefix)) {
        monthAmount = normalizeNightAuditAmount(entry[monthKeyPrefix])
    } else {
        const monthKeyFound = keys.find((candidate) => {
            const c = String(candidate || '').toLowerCase()
            return c === monthKeySuffix.toLowerCase() || c === monthKeyPrefix.toLowerCase()
        })
        if(monthKeyFound) monthAmount = normalizeNightAuditAmount(entry[monthKeyFound])
    }

    return { todayAmount, monthAmount }
}

function normalizeSectionRows(sectionData, fallbackSingleLabel = '', labelMap = {}) {
    const rows = []
    if(Array.isArray(sectionData)) {
        sectionData.forEach((entry) => {
            if(!entry || typeof entry !== 'object') return
            Object.keys(entry).forEach((key) => {
                const lowered = String(key).toLowerCase()
                if(lowered === 'title') return
                if(lowered.endsWith('month') || lowered.startsWith('month')) return
                const amounts = extractTodayMonthAmountFromEntry(entry, key)
                rows.push({
                    label: getNightAuditLabel(key, labelMap),
                    todayAmount: amounts.todayAmount,
                    todayAllowance: 0,
                    todayNet: amounts.todayAmount,
                    monthAmount: amounts.monthAmount,
                    monthAllowance: 0,
                    monthNet: amounts.monthAmount
                })
            })
        })
        return rows
    }

    if(sectionData && typeof sectionData === 'object') {
        const keys = Object.keys(sectionData)
            .filter((key) => !['title'].includes(String(key).toLowerCase()))
            .filter((key) => !String(key).toLowerCase().endsWith('month'))
            .filter((key) => !String(key).toLowerCase().startsWith('month'))

        keys.forEach((key) => {
            const amounts = extractTodayMonthAmountFromEntry(sectionData, key)
            rows.push({
                label: fallbackSingleLabel || getNightAuditLabel(key, labelMap),
                todayAmount: amounts.todayAmount,
                todayAllowance: 0,
                todayNet: amounts.todayAmount,
                monthAmount: amounts.monthAmount,
                monthAllowance: 0,
                monthNet: amounts.monthAmount
            })
        })
        return rows
    }
    return rows
}

function getNightAuditPayloadSection(payload = {}, keys = []) {
    const payloadKeys = Object.keys(payload || {})
    const expectedKeys = keys.map(normalizeNightAuditKey)
    const matchedKey = payloadKeys.find((key) => expectedKeys.includes(normalizeNightAuditKey(key)))
    return matchedKey ? payload[matchedKey] : undefined
}

function buildNightAuditMainSections(payload = {}) {
    return [
        { title: 'Room Revenue', rows: normalizeSectionRows(payload.roomrevenue, 'Room Revenue') },
        { title: 'Food & Beverages', rows: normalizeSectionRows(payload.foodandbeverages) },
        { title: 'Minor Operative Div', rows: normalizeSectionRows(payload.othersectors) },
        { title: 'Miscellaneous', rows: normalizeSectionRows(payload.miscellaneous) },
        { title: 'Taxes', rows: normalizeSectionRows(payload.taxes, '', NIGHT_AUDIT_TAX_LABELS) }
    ]
}

function buildNightAuditPostRevenueSections(payload = {}) {
    const reservationAdvance = getNightAuditPayloadSection(payload, ['reservationadvance', 'reservationAdvance', 'reservation_advance'])
    const cashCollection = getNightAuditPayloadSection(payload, ['cashcollection', 'cashCollection', 'cash_collection'])
    const sections = []

    if(reservationAdvance !== undefined) {
        sections.push({ title: 'Reservation Advance', rows: normalizeSectionRows(reservationAdvance) })
    }
    if(cashCollection !== undefined) {
        sections.push({ title: 'Cash Collection', rows: normalizeSectionRows(cashCollection) })
    }

    return sections
}

function getSectionTotals(rows = []) {
    return rows.reduce((acc, row) => {
        acc.todayAmount += normalizeNightAuditAmount(row.todayAmount)
        acc.todayAllowance += normalizeNightAuditAmount(row.todayAllowance)
        acc.todayNet += normalizeNightAuditAmount(row.todayNet)
        acc.monthAmount += normalizeNightAuditAmount(row.monthAmount)
        acc.monthAllowance += normalizeNightAuditAmount(row.monthAllowance)
        acc.monthNet += normalizeNightAuditAmount(row.monthNet)
        return acc
    }, { todayAmount: 0, todayAllowance: 0, todayNet: 0, monthAmount: 0, monthAllowance: 0, monthNet: 0 })
}

function renderNightAuditReport(payload = {}) {
    const sections = buildNightAuditMainSections(payload)
    const postRevenueSections = buildNightAuditPostRevenueSections(payload)
    const grandTotals = { todayAmount: 0, todayAllowance: 0, todayNet: 0, monthAmount: 0, monthAllowance: 0, monthNet: 0 }

    const renderSection = (section, addToGrandTotal = false) => {
        const itemRows = section.rows.map((row) => `
            <tr>
                <td>${row.label}</td>
                <td class="text-left">${formatNightAuditAmount(row.todayAmount)}</td>
                <td class="text-left">${formatNightAuditAmount(row.todayAllowance)}</td>
                <td class="text-left">${formatNightAuditAmount(row.todayNet)}</td>
                <td class="text-left">${formatNightAuditAmount(row.monthAmount)}</td>
                <td class="text-left">${formatNightAuditAmount(row.monthAllowance)}</td>
                <td class="text-left">${formatNightAuditAmount(row.monthNet)}</td>
            </tr>
        `).join('')

        const subtotals = getSectionTotals(section.rows)
        if(addToGrandTotal) {
            grandTotals.todayAmount += subtotals.todayAmount
            grandTotals.todayAllowance += subtotals.todayAllowance
            grandTotals.todayNet += subtotals.todayNet
            grandTotals.monthAmount += subtotals.monthAmount
            grandTotals.monthAllowance += subtotals.monthAllowance
            grandTotals.monthNet += subtotals.monthNet
        }

        return `
            <tr class="bg-slate-100 font-semibold">
                <td colspan="7">${section.title}</td>
            </tr>
            ${itemRows || `<tr><td colspan="7" class="text-left opacity-70">No data</td></tr>`}
            <tr class="font-semibold">
                <td>Sub Total</td>
                <td class="text-left">${formatNightAuditAmount(subtotals.todayAmount)}</td>
                <td class="text-left">${formatNightAuditAmount(subtotals.todayAllowance)}</td>
                <td class="text-left">${formatNightAuditAmount(subtotals.todayNet)}</td>
                <td class="text-left">${formatNightAuditAmount(subtotals.monthAmount)}</td>
                <td class="text-left">${formatNightAuditAmount(subtotals.monthAllowance)}</td>
                <td class="text-left">${formatNightAuditAmount(subtotals.monthNet)}</td>
            </tr>
        `
    }

    const mainRows = sections.map((section) => renderSection(section, true)).join('')
    const postRevenueRows = postRevenueSections.map((section) => renderSection(section, false)).join('')
    const totalRevenueRow = `
        <tr class="font-semibold">
            <td class="text-left">TOTAL REVENUE</td>
            <td class="text-left">${formatNightAuditAmount(grandTotals.todayAmount)}</td>
            <td class="text-left">${formatNightAuditAmount(grandTotals.todayAllowance)}</td>
            <td class="text-left">${formatNightAuditAmount(grandTotals.todayNet)}</td>
            <td class="text-left">${formatNightAuditAmount(grandTotals.monthAmount)}</td>
            <td class="text-left">${formatNightAuditAmount(grandTotals.monthAllowance)}</td>
            <td class="text-left">${formatNightAuditAmount(grandTotals.monthNet)}</td>
        </tr>
    `
    const bodyRows = `${mainRows}${totalRevenueRow}${postRevenueRows}`

    did('nightauditreportcontent').innerHTML = `
        <style>
            #nightauditreportcontainer .nightaudit-table-wrapper{overflow:auto}
            #nightauditreportcontainer .nightaudit-table{
                width:100%;
                border-collapse:collapse;
                table-layout:fixed;
            }
            #nightauditreportcontainer .nightaudit-table th,
            #nightauditreportcontainer .nightaudit-table td{
                border:1px solid #cbd5e1;
                padding:6px 8px;
                font-size:13px;
                line-height:1.2;
                text-align:left;
            }
            #nightauditreportcontainer .nightaudit-table th{
                background:#f8fafc;
                font-weight:700;
                text-transform:uppercase;
            }
            #nightauditreportcontainer .nightaudit-table .group-head{
                text-align:left;
                font-size:16px;
                text-transform:none;
            }
            @media print {
                @page { size: A4 landscape; margin: 8mm; }
                #nightauditreportcontainer { padding: 0 !important; border: 0 !important; box-shadow: none !important; }
                #nightauditreportcontainer .nightaudit-table th,
                #nightauditreportcontainer .nightaudit-table td{
                    font-size:11px !important;
                    padding:4px 5px !important;
                }
            }
        </style>
        <div class="nightaudit-table-wrapper">
            <table id="nightauditreporttable" class="nightaudit-table">
                <thead>
                    <tr>
                        <th></th>
                        <th colspan="3" class="group-head">Today</th>
                        <th colspan="3" class="group-head">Month</th>
                    </tr>
                    <tr>
                        <th>Particulars</th>
                        <th>Amount</th>
                        <th>Allowance</th>
                        <th>Net</th>
                        <th>Amount</th>
                        <th>Allowance</th>
                        <th>Net</th>
                    </tr>
                </thead>
                <tbody>
                    ${bodyRows || `<tr><td colspan="7" class="text-left opacity-70">No data</td></tr>`}
                </tbody>
            </table>
        </div>
    `
}

function renderNightAuditEmpty(message = 'No records retrieved') {
    if(!did('nightauditreportcontent')) return
    did('nightauditreportcontent').innerHTML = `<div class="text-center opacity-70 py-8">${message}</div>`
}

async function fetchnightauditreport() {
    const payload = new FormData()
    const selectedDate = String(did('nightauditcurrentdate')?.value || '').trim()
    if(selectedDate) payload.append('currentdate', selectedDate)

    const request = await httpRequest2('../controllers/nightauditreport.php', payload, did('submitnightauditreportfilter'), 'json')
    if(!request || !request.status || !request.data) {
        nightAuditReportData = null
        return renderNightAuditEmpty(request?.message || 'No records retrieved')
    }

    nightAuditReportData = request.data
    renderNightAuditReport(nightAuditReportData)
}

function resetnightauditreportfilter() {
    const today = new Date().toISOString().split('T')[0]
    if(did('nightauditcurrentdate')) did('nightauditcurrentdate').value = today
    return fetchnightauditreport()
}

async function nightauditreportActive() {
    const today = new Date().toISOString().split('T')[0]
    if(did('nightauditcurrentdate') && !did('nightauditcurrentdate').value) {
        did('nightauditcurrentdate').value = today
    }

    if(did('submitnightauditreportfilter')) {
        did('submitnightauditreportfilter').onclick = () => fetchnightauditreport()
    }
    if(did('resetnightauditreportfilter')) {
        did('resetnightauditreportfilter').onclick = () => resetnightauditreportfilter()
    }

    await fetchnightauditreport()
}
