let nightAuditReportData = null
let nightAuditReportViewMode = 'widget'

function normalizeNightAuditAmount(value = 0) {
    const amount = Number(value || 0)
    return Number.isFinite(amount) ? amount : 0
}

function formatNightAuditAmount(value = 0) {
    return formatNumber(normalizeNightAuditAmount(value))
}

function pickNumericValue(source = {}, keys = []) {
    for(let i = 0; i < keys.length; i++) {
        const key = keys[i]
        if(source?.[key] !== undefined && source?.[key] !== null && source?.[key] !== '') {
            return normalizeNightAuditAmount(source[key])
        }
    }
    return 0
}

function getNightAuditRowMatrixValues(row = {}) {
    const src = row?.raw || {}

    const todayAmount = pickNumericValue(src, ['todayamount', 'today_amount', 'today', 'amount']) || normalizeNightAuditAmount(row.amount)
    const todayAllowance = pickNumericValue(src, ['todayallowance', 'today_allowance', 'allowance'])
    const todayNett = pickNumericValue(src, ['todaynett', 'today_net', 'nett', 'net']) || Math.max(todayAmount - todayAllowance, 0)

    const monthAmount = pickNumericValue(src, ['monthamount', 'month_amount', 'monthlyamount', 'monthly_amount'])
    const monthAllowance = pickNumericValue(src, ['monthallowance', 'month_allowance', 'monthlyallowance', 'monthly_allowance'])
    const monthNett = pickNumericValue(src, ['monthnett', 'month_net', 'monthlynett', 'monthly_net']) || Math.max(monthAmount - monthAllowance, 0)

    return {
        todayAmount,
        todayAllowance,
        todayNett,
        monthAmount,
        monthAllowance,
        monthNett
    }
}

function titleFromKey(key = '') {
    const cleaned = String(key || '').replace(/[_-]+/g, ' ').trim()
    if(!cleaned) return '-'
    return cleaned.replace(/\b\w/g, (match) => match.toUpperCase())
}

function normalizeNightAuditRows(sectionData, fallbackTitle = '') {
    const rows = []
    const addRow = (label, amount, transactiondate = '') => {
        const cleanLabel = String(label || '').trim()
        if(!cleanLabel) return
        rows.push({
            label: cleanLabel,
            amount: normalizeNightAuditAmount(amount),
            transactiondate: String(transactiondate || '').trim(),
            raw: {}
        })
    }

    if(Array.isArray(sectionData)) {
        sectionData.forEach((entry) => {
            if(!entry || typeof entry !== 'object') return
            const txDate = entry.transactiondate || entry.date || entry.tlog || ''
            Object.keys(entry).forEach((key) => {
                const lowered = String(key).toLowerCase()
                if(['title', 'transactiondate', 'date', 'tlog'].includes(lowered)) return
                addRow(titleFromKey(key), entry[key], txDate)
                rows[rows.length - 1].raw = entry
            })
        })
        return rows
    }

    if(sectionData && typeof sectionData === 'object') {
        const txDate = sectionData.transactiondate || sectionData.date || sectionData.tlog || ''
        const directAmount = sectionData.roomrevenue ?? sectionData.amount
        if(directAmount !== undefined && directAmount !== null) {
            addRow(fallbackTitle || sectionData.title || 'Amount', directAmount, txDate)
            rows[rows.length - 1].raw = sectionData
        } else {
            Object.keys(sectionData).forEach((key) => {
                const lowered = String(key).toLowerCase()
                if(['title', 'transactiondate', 'date', 'tlog'].includes(lowered)) return
                addRow(titleFromKey(key), sectionData[key], txDate)
                rows[rows.length - 1].raw = sectionData
            })
        }
        return rows
    }

    if(sectionData !== undefined && sectionData !== null && sectionData !== '') {
        addRow(fallbackTitle || 'Amount', sectionData, '')
    }
    return rows
}

function renderNightAuditSection(title, rows = []) {
    const total = rows.reduce((sum, row) => sum + normalizeNightAuditAmount(row.amount), 0)
    return `
        <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div class="px-4 py-3 bg-slate-900 text-white">
                <p class="font-semibold text-sm tracking-wide uppercase">${title}</p>
            </div>
            <div class="p-3">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="text-slate-500 border-b">
                            <th class="text-left py-2">Item</th>
                            <th class="text-right py-2">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.length ? rows.map((row) => `
                            <tr class="border-b last:border-b-0">
                                <td class="py-2">${row.label}</td>
                                <td class="py-2 text-right font-semibold">${formatNightAuditAmount(row.amount)}</td>
                            </tr>
                        `).join('') : `
                            <tr>
                                <td colspan="2" class="py-3 text-center text-slate-400">No data</td>
                            </tr>
                        `}
                        <tr class="bg-slate-50 font-semibold">
                            <td class="py-2">Section Total</td>
                            <td class="py-2 text-right">${formatNightAuditAmount(total)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
}

function buildNightAuditModel(payload = {}) {
    const roomRows = normalizeNightAuditRows(payload.roomrevenue, 'Room Revenue')
    const foodRows = normalizeNightAuditRows(payload.foodandbeverages, 'Food & Beverages')
    const otherRows = normalizeNightAuditRows(payload.othersectors, 'Other Sectors')
    const miscRows = normalizeNightAuditRows(payload.miscellaneous, 'Miscellaneous')
    const taxRows = normalizeNightAuditRows(payload.taxes, 'Taxes')

    const sections = [
        { key: 'roomrevenue', title: 'Room Revenue', rows: roomRows },
        { key: 'foodandbeverages', title: 'Food & Beverages', rows: foodRows },
        { key: 'othersectors', title: 'Other Sectors', rows: otherRows },
        { key: 'miscellaneous', title: 'Miscellaneous', rows: miscRows },
        { key: 'taxes', title: 'Taxes', rows: taxRows }
    ]

    const allRows = sections.flatMap((section) => section.rows.map((row) => ({
        section: section.title,
        label: row.label,
        amount: row.amount,
        transactiondate: row.transactiondate
    })))

    const allTotals = allRows
        .reduce((sum, row) => sum + normalizeNightAuditAmount(row.amount), 0)
    return { sections, allRows, allTotals }
}

function renderNightAuditWidget(model) {
    const sectionsMarkup = model.sections.map((section) => renderNightAuditSection(section.title, section.rows)).join('')
    return `
        <div class="flex flex-wrap justify-between items-center gap-3 mb-4">
            <div>
                <p class="text-xs uppercase tracking-wider text-slate-500">Generated On</p>
                <p class="text-sm font-semibold text-slate-800">${specialformatDateTime(new Date().toISOString().slice(0, 19).replace('T', ' '))}</p>
            </div>
            <div class="text-right">
                <p class="text-xs uppercase tracking-wider text-slate-500">Grand Total</p>
                <p class="text-2xl font-bold text-slate-900">${formatNightAuditAmount(allTotals)}</p>
            </div>
        </div>
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
            ${sectionsMarkup}
        </div>
    `
}

function renderNightAuditTable(model) {
    const sectionRowsMarkup = model.sections.map((section) => {
        const sectionLineRows = section.rows.map((row) => {
            const matrix = getNightAuditRowMatrixValues(row)
            return `
                <tr>
                    <td>${row.label}</td>
                    <td class="text-right">${formatNightAuditAmount(matrix.todayAmount)}</td>
                    <td class="text-right">${formatNightAuditAmount(matrix.todayAllowance)}</td>
                    <td class="text-right">${formatNightAuditAmount(matrix.todayNett)}</td>
                    <td class="text-right">${formatNightAuditAmount(matrix.monthAmount)}</td>
                    <td class="text-right">${formatNightAuditAmount(matrix.monthAllowance)}</td>
                    <td class="text-right">${formatNightAuditAmount(matrix.monthNett)}</td>
                </tr>
            `
        }).join('')

        const sectionTotals = section.rows.reduce((acc, row) => {
            const matrix = getNightAuditRowMatrixValues(row)
            acc.todayAmount += matrix.todayAmount
            acc.todayAllowance += matrix.todayAllowance
            acc.todayNett += matrix.todayNett
            acc.monthAmount += matrix.monthAmount
            acc.monthAllowance += matrix.monthAllowance
            acc.monthNett += matrix.monthNett
            return acc
        }, { todayAmount: 0, todayAllowance: 0, todayNett: 0, monthAmount: 0, monthAllowance: 0, monthNett: 0 })

        return `
            <tr class="bg-slate-100 font-semibold">
                <td colspan="7">${section.title}</td>
            </tr>
            ${sectionLineRows || `<tr><td colspan="7" class="text-center opacity-70">No data</td></tr>`}
            <tr class="font-semibold">
                <td>Sub Total</td>
                <td class="text-right">${formatNightAuditAmount(sectionTotals.todayAmount)}</td>
                <td class="text-right">${formatNightAuditAmount(sectionTotals.todayAllowance)}</td>
                <td class="text-right">${formatNightAuditAmount(sectionTotals.todayNett)}</td>
                <td class="text-right">${formatNightAuditAmount(sectionTotals.monthAmount)}</td>
                <td class="text-right">${formatNightAuditAmount(sectionTotals.monthAllowance)}</td>
                <td class="text-right">${formatNightAuditAmount(sectionTotals.monthNett)}</td>
            </tr>
        `
    }).join('')

    const grandTotals = model.sections.reduce((acc, section) => {
        section.rows.forEach((row) => {
            const matrix = getNightAuditRowMatrixValues(row)
            acc.todayAmount += matrix.todayAmount
            acc.todayAllowance += matrix.todayAllowance
            acc.todayNett += matrix.todayNett
            acc.monthAmount += matrix.monthAmount
            acc.monthAllowance += matrix.monthAllowance
            acc.monthNett += matrix.monthNett
        })
        return acc
    }, { todayAmount: 0, todayAllowance: 0, todayNett: 0, monthAmount: 0, monthAllowance: 0, monthNett: 0 })

    return `
        <div class="rounded-sm bg-white">
            <div class="px-2 pb-2 flex justify-between items-center">
                <p class="font-semibold text-sm text-slate-700">Night Audit Table</p>
                <p class="text-sm text-slate-600">Grand Total: <span class="font-bold text-slate-900">${formatNightAuditAmount(grandTotals.todayNett)}</span></p>
            </div>
            <div class="table-content">
                <table class="nightaudit-table">
                    <thead>
                        <tr>
                            <th>Particulars</th>
                            <th>Today Amount</th>
                            <th>Today Allowance</th>
                            <th>Today Nett</th>
                            <th>Month Amount</th>
                            <th>Month Allowance</th>
                            <th>Month Nett</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sectionRowsMarkup || `<tr><td colspan="7" class="text-center opacity-70">No data</td></tr>`}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td class="text-right font-semibold">TOTAL REVENUE</td>
                            <td class="text-right font-semibold">${formatNightAuditAmount(grandTotals.todayAmount)}</td>
                            <td class="text-right font-semibold">${formatNightAuditAmount(grandTotals.todayAllowance)}</td>
                            <td class="text-right font-semibold">${formatNightAuditAmount(grandTotals.todayNett)}</td>
                            <td class="text-right font-semibold">${formatNightAuditAmount(grandTotals.monthAmount)}</td>
                            <td class="text-right font-semibold">${formatNightAuditAmount(grandTotals.monthAllowance)}</td>
                            <td class="text-right font-semibold">${formatNightAuditAmount(grandTotals.monthNett)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class="table-status"></div>
        </div>
    `
}

function renderNightAuditReport(payload = {}) {
    const model = buildNightAuditModel(payload)
    const html = nightAuditReportViewMode === 'table'
        ? renderNightAuditTable(model)
        : renderNightAuditWidget(model)

    did('nightauditreportcontent').innerHTML = `
        <style>
            @media print {
                @page { size: A4 landscape; margin: 10mm; }
                #nightauditreportcontainer { padding: 0 !important; box-shadow: none !important; border: 0 !important; }
                #nightauditreportcontainer .nightaudit-table { width: 100% !important; table-layout: fixed; }
                #nightauditreportcontainer .nightaudit-table th,
                #nightauditreportcontainer .nightaudit-table td {
                    border: 1px solid #d1d5db !important;
                    font-size: 11px !important;
                    word-wrap: break-word;
                }
            }
        </style>
        ${html}
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

function setNightAuditViewMode(mode = 'widget') {
    nightAuditReportViewMode = mode === 'table' ? 'table' : 'widget'
    if(did('nightauditviewwidget')) {
        did('nightauditviewwidget').className = `inline-block p-3 rounded-t-lg border-b-2 font-semibold ${nightAuditReportViewMode === 'widget' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`
    }
    if(did('nightauditviewtable')) {
        did('nightauditviewtable').className = `inline-block p-3 rounded-t-lg border-b-2 font-semibold ${nightAuditReportViewMode === 'table' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`
    }
    if(nightAuditReportData) renderNightAuditReport(nightAuditReportData)
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
    if(did('nightauditviewwidget')) {
        did('nightauditviewwidget').onclick = () => setNightAuditViewMode('widget')
    }
    if(did('nightauditviewtable')) {
        did('nightauditviewtable').onclick = () => setNightAuditViewMode('table')
    }
    setNightAuditViewMode('widget')

    await fetchnightauditreport()
}
