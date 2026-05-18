let nightAuditReportData = null
let nightAuditReportViewMode = 'widget'

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
    const addRow = (label, amount, transactiondate = '') => {
        const cleanLabel = String(label || '').trim()
        if(!cleanLabel) return
        rows.push({
            label: cleanLabel,
            amount: normalizeNightAuditAmount(amount),
            transactiondate: String(transactiondate || '').trim()
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
            })
        })
        return rows
    }

    if(sectionData && typeof sectionData === 'object') {
        const txDate = sectionData.transactiondate || sectionData.date || sectionData.tlog || ''
        const directAmount = sectionData.roomrevenue ?? sectionData.amount
        if(directAmount !== undefined && directAmount !== null) {
            addRow(fallbackTitle || sectionData.title || 'Amount', directAmount, txDate)
        } else {
            Object.keys(sectionData).forEach((key) => {
                const lowered = String(key).toLowerCase()
                if(['title', 'transactiondate', 'date', 'tlog'].includes(lowered)) return
                addRow(titleFromKey(key), sectionData[key], txDate)
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
    return `
        <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div class="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
                <p class="font-semibold text-sm tracking-wide uppercase">Night Audit Table</p>
                <p class="text-xs">Grand Total: <span class="font-bold">${formatNightAuditAmount(model.allTotals)}</span></p>
            </div>
            <div class="overflow-auto">
                <table class="w-full text-sm nightaudit-table">
                    <thead>
                        <tr class="text-slate-500 border-b bg-slate-50">
                            <th class="text-left py-2 px-3">S/N</th>
                            <th class="text-left py-2 px-3">Section</th>
                            <th class="text-left py-2 px-3">Item</th>
                            <th class="text-left py-2 px-3">Transaction Date</th>
                            <th class="text-right py-2 px-3">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${model.allRows.length ? model.allRows.map((row, index) => `
                            <tr class="border-b">
                                <td class="py-2 px-3">${index + 1}</td>
                                <td class="py-2 px-3">${row.section}</td>
                                <td class="py-2 px-3">${row.label}</td>
                                <td class="py-2 px-3">${row.transactiondate ? specialformatDateTime(row.transactiondate) : '-'}</td>
                                <td class="py-2 px-3 text-right font-semibold">${formatNightAuditAmount(row.amount)}</td>
                            </tr>
                        `).join('') : `
                            <tr><td colspan="5" class="py-4 text-center text-slate-400">No data</td></tr>
                        `}
                    </tbody>
                    <tfoot>
                        <tr class="bg-slate-50 font-semibold">
                            <td colspan="4" class="py-2 px-3 text-right">Grand Total</td>
                            <td class="py-2 px-3 text-right">${formatNightAuditAmount(model.allTotals)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
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
        did('nightauditviewwidget').classList.toggle('!bg-slate-900', nightAuditReportViewMode === 'widget')
        did('nightauditviewwidget').classList.toggle('!text-white', nightAuditReportViewMode === 'widget')
    }
    if(did('nightauditviewtable')) {
        did('nightauditviewtable').classList.toggle('!bg-slate-900', nightAuditReportViewMode === 'table')
        did('nightauditviewtable').classList.toggle('!text-white', nightAuditReportViewMode === 'table')
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
