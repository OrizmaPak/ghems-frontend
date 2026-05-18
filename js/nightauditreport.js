let nightAuditReportData = null

function normalizeNightAuditAmount(value = 0) {
    const amount = Number(value || 0)
    return Number.isFinite(amount) ? amount : 0
}

function formatNightAuditAmount(value = 0) {
    return formatNumber(normalizeNightAuditAmount(value))
}

function titleFromKey(key = '') {
    const cleaned = String(key || '').replace(/[_-]+/g, ' ').trim()
    if(!cleaned) return '-'
    return cleaned.replace(/\b\w/g, (match) => match.toUpperCase())
}

function normalizeNightAuditRows(sectionData, fallbackTitle = '') {
    const rows = []
    const addRow = (label, amount) => {
        const cleanLabel = String(label || '').trim()
        if(!cleanLabel) return
        rows.push({
            label: cleanLabel,
            amount: normalizeNightAuditAmount(amount)
        })
    }

    if(Array.isArray(sectionData)) {
        sectionData.forEach((entry) => {
            if(!entry || typeof entry !== 'object') return
            Object.keys(entry).forEach((key) => {
                const lowered = String(key).toLowerCase()
                if(lowered === 'title') return
                addRow(titleFromKey(key), entry[key])
            })
        })
        return rows
    }

    if(sectionData && typeof sectionData === 'object') {
        const directAmount = sectionData.roomrevenue ?? sectionData.amount
        if(directAmount !== undefined && directAmount !== null) {
            addRow(fallbackTitle || sectionData.title || 'Amount', directAmount)
        } else {
            Object.keys(sectionData).forEach((key) => {
                const lowered = String(key).toLowerCase()
                if(lowered === 'title') return
                addRow(titleFromKey(key), sectionData[key])
            })
        }
        return rows
    }

    if(sectionData !== undefined && sectionData !== null && sectionData !== '') {
        addRow(fallbackTitle || 'Amount', sectionData)
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

function renderNightAuditReport(payload = {}) {
    const roomRows = normalizeNightAuditRows(payload.roomrevenue, 'Room Revenue')
    const foodRows = normalizeNightAuditRows(payload.foodandbeverages, 'Food & Beverages')
    const otherRows = normalizeNightAuditRows(payload.othersectors, 'Other Sectors')
    const miscRows = normalizeNightAuditRows(payload.miscellaneous, 'Miscellaneous')
    const taxRows = normalizeNightAuditRows(payload.taxes, 'Taxes')

    const allTotals = [roomRows, foodRows, otherRows, miscRows, taxRows]
        .flat()
        .reduce((sum, row) => sum + normalizeNightAuditAmount(row.amount), 0)

    did('nightauditreportcontent').innerHTML = `
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
            ${renderNightAuditSection('Room Revenue', roomRows)}
            ${renderNightAuditSection('Food & Beverages', foodRows)}
            ${renderNightAuditSection('Other Sectors', otherRows)}
            ${renderNightAuditSection('Miscellaneous', miscRows)}
            ${renderNightAuditSection('Taxes', taxRows)}
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
