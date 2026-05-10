let guestfolioReceiveablesId
let guestfolioReceiveablesFiltered = false
let guestfolioPageMode = 'guestfolio'
const guestfolioPaymentController = '../controllers/receipts'
let guestfolioGuestTomSelect = null
let guestfolioTomSelectAssetsPromise = null
let guestfolioGuestOptions = []
let guestFolioBuckets = new Map()
let guestfolioViewTab = 'receivable'

// Backward compatibility for old route/function spelling.
async function receiveablesActive(mode='receiveables') {
    return receivablesActive(mode)
}

async function guestfolioActive() {
    return receivablesActive('guestfolio')
}

function initGuestFolioViewTabs() {
    const receivableBtn = did('guestFolioTabReceivable')
    const printableBtn = did('guestFolioTabPrintable')
    if(!receivableBtn || !printableBtn) return
    receivableBtn.onclick = () => switchGuestFolioViewTab('receivable')
    printableBtn.onclick = () => switchGuestFolioViewTab('printable')
    switchGuestFolioViewTab(guestfolioViewTab)
}

function switchGuestFolioViewTab(tab = 'receivable') {
    guestfolioViewTab = tab === 'printable' ? 'printable' : 'receivable'
    const receivableBtn = did('guestFolioTabReceivable')
    const printableBtn = did('guestFolioTabPrintable')
    const receivableWrap = did('guestFolioReceivableTableWrap')
    const printableWrap = did('guestFolioPrintTableWrap')
    if(receivableBtn) receivableBtn.className = `inline-block p-3 rounded-t-lg border-b-2 font-semibold ${guestfolioViewTab === 'receivable' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`
    if(printableBtn) printableBtn.className = `inline-block p-3 rounded-t-lg border-b-2 font-semibold ${guestfolioViewTab === 'printable' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`
    if(receivableWrap) receivableWrap.classList.toggle('hidden', guestfolioViewTab !== 'receivable')
    if(printableWrap) printableWrap.classList.toggle('hidden', guestfolioViewTab !== 'printable')
}

function isPayPendingCheckoutBillsRoute(){
    return guestfolioPageMode === 'paypendingcheckoutbills' || getCurrentRouteName() === 'paypendingcheckoutbills'
}

function isGuestFolioRoute(){
    return guestfolioPageMode === 'guestfolio' || getCurrentRouteName() === 'guestfolio'
}

function renderReceiveablesEmptyState(message='No records retrieved'){
    const tabledata = document.getElementById('tabledata')
    if(!tabledata)return
    tabledata.innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">${message}</td></tr>`
}

function normalizeGuestFolioRows(payload = []) {
    if(!Array.isArray(payload)) return []
    const guestBuckets = new Map()

    const ensureGuestBucket = (guest = {}) => {
        const guestId = String(guest?.id || '').trim() || `guest-${genID()}`
        const guestName = [guest?.lastname, guest?.firstname, guest?.othernames].map(value => String(value || '').trim()).filter(Boolean).join(' ') || '-'
        if(!guestBuckets.has(guestId)) {
            guestBuckets.set(guestId, {
                guestid: guestId,
                guestname: guestName,
                createdAt: guest?.created_at || guest?.tlog || '',
                guest,
                company: null,
                travelagency: null,
                groups: null,
                transactions: []
            })
        }
        return guestBuckets.get(guestId)
    }

    payload.forEach((entry) => {
        const guest = entry?.guest || {}
        const bucket = ensureGuestBucket(guest)
        bucket.company = entry?.company || null
        bucket.travelagency = entry?.travelagency || null
        bucket.groups = entry?.groups || null
        const transactions = Array.isArray(entry?.transactions) ? entry.transactions : []

        if(transactions.length) {
            transactions.forEach((tx) => {
                bucket.transactions.push({
                    ...tx,
                    ownerid: tx?.ownerid || tx?.roomnumber || '',
                    guestid: bucket.guestid,
                    guestname: bucket.guestname,
                    debit: Number(tx?.debit || 0),
                    credit: Number(tx?.credit || 0),
                    transactiondate: tx?.transactiondate || tx?.tlog || ''
                })
            })
        }
    })

    const normalized = []
    guestBuckets.forEach((bucket) => {
        if(!bucket.transactions.length) {
            normalized.push({
                id: `guest-${bucket.guestid}`,
                ownerid: '',
                guestid: bucket.guestid,
                guestname: bucket.guestname,
                description: 'No transactions available yet',
                debit: 0,
                credit: 0,
                transactiondate: bucket.createdAt || '',
                _emptyTransaction: true
            })
            return
        }
        normalized.push(...bucket.transactions)
    })

    const seen = new Set()
    const deduped = normalized.filter((row) => {
        const dedupeKey = `${row.id || ''}|${row.guestid || ''}|${row.transactiondate || ''}|${row.debit || 0}|${row.credit || 0}|${row.description || ''}`
        if(seen.has(dedupeKey)) return false
        seen.add(dedupeKey)
        return true
    })

    deduped.sort((a, b) => {
        const dateA = new Date(String(a?.transactiondate || '').replace(' ', 'T')).getTime() || 0
        const dateB = new Date(String(b?.transactiondate || '').replace(' ', 'T')).getTime() || 0
        return dateB - dateA
    })

    guestFolioBuckets = guestBuckets
    return deduped
}

function formatFolioAmount(value = 0) {
    const numeric = Number(value || 0)
    return numeric.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function normalizeFolioText(value = '') {
    const text = String(value ?? '').trim()
    if(!text || text === '-' || text.toLowerCase() === 'null' || text.toLowerCase() === 'undefined') return '-'
    return text
}

function getGuestFolioOrganisationProfile() {
    const companyName = did('your_companyname')?.value || 'HEMS'
    const companyAddress = did('your_companyaddress')?.value || ''
    const companyPhone = did('your_companyphone')?.value || ''
    const companyEmail = did('your_companyemail')?.value || ''
    const logoValue = did('your_companylogo')?.value || ''
    const logoUrl = logoValue && logoValue !== '-' ? `../images/${logoValue}` : ''
    return { companyName, companyAddress, companyPhone, companyEmail, logoUrl }
}

function classifyGuestFolioSummary(description = '') {
    const text = String(description || '').toLowerCase()
    if(text.includes('accommodation') || text.includes('booking')) return 'Accommodation'
    if(text.includes('discount')) return 'Tariff Discount'
    if(text.includes('restaurant') || text.includes('meal') || text.includes('food')) return 'Restaurant Bill'
    if(text.includes('laundry')) return 'Laundry'
    if(text.includes('advance') || text.includes('credit card') || text.includes('transfer') || text.includes('deposit')) return 'Advance Credit Card'
    return 'Others'
}

function getGuestFolioPrintModel(guestId = '') {
    const bucket = guestFolioBuckets.get(String(guestId || '').trim())
    if(!bucket) return null
    const profile = getGuestFolioOrganisationProfile()
    const transactions = (Array.isArray(bucket.transactions) ? [...bucket.transactions] : []).sort((a, b) => {
        const dateA = new Date(String(a?.transactiondate || '').replace(' ', 'T')).getTime() || 0
        const dateB = new Date(String(b?.transactiondate || '').replace(' ', 'T')).getTime() || 0
        return dateA - dateB
    })

    const groupedDays = []
    const dayMap = new Map()
    let runningBalance = 0
    let totalDebit = 0
    let totalCredit = 0
    const billSummary = new Map()

    transactions.forEach((tx) => {
        const date = String(tx.transactiondate || '').slice(0, 10)
        const dayKey = date || 'Unknown Date'
        if(!dayMap.has(dayKey)) {
            const row = { dayKey, rows: [], dayDebit: 0, dayCredit: 0, dayClosingBalance: 0 }
            dayMap.set(dayKey, row)
            groupedDays.push(row)
        }
        const row = dayMap.get(dayKey)
        const debit = Number(tx.debit || 0)
        const credit = Number(tx.credit || 0)
        totalDebit += debit
        totalCredit += credit
        runningBalance += debit - credit
        row.dayDebit += debit
        row.dayCredit += credit
        row.dayClosingBalance = runningBalance
        row.rows.push({
            ...tx,
            debit,
            credit,
            runningBalance
        })

        const summaryKey = classifyGuestFolioSummary(tx.description)
        const prev = Number(billSummary.get(summaryKey) || 0)
        billSummary.set(summaryKey, prev + (debit - credit))
    })

    return {
        profile,
        guest: bucket.guest || {},
        company: bucket.company,
        travelagency: bucket.travelagency,
        groups: bucket.groups,
        guestname: bucket.guestname,
        groupedDays,
        totalDebit,
        totalCredit,
        finalBalance: runningBalance,
        billSummary: Array.from(billSummary.entries()),
        transactions
    }
}

function renderGuestFolioPrintTable() {
    const tableBody = did('guestFolioPrintTableBody')
    if(!tableBody) return
    const rows = Array.from(guestFolioBuckets.values()).map((bucket, index) => {
        const model = getGuestFolioPrintModel(bucket.guestid)
        if(!model) return ''
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${normalizeFolioText(model.guestname)}</td>
                <td>${formatFolioAmount(model.totalDebit)}</td>
                <td>${formatFolioAmount(model.totalCredit)}</td>
                <td>${formatFolioAmount(model.finalBalance)}</td>
                <td><button onclick="openGuestFolioPrint('${bucket.guestid}')" class="btn btn-sm bg-slate-700 text-white">View/Print Folio</button></td>
            </tr>
        `
    }).filter(Boolean).join('')
    tableBody.innerHTML = rows || `<tr><td colspan="100%" class="text-center opacity-70">No records found</td></tr>`
}

function openGuestFolioPrint(guestId = '') {
    const model = getGuestFolioPrintModel(guestId)
    if(!model) return notification('Unable to load guest folio print data', 0)
    did('modalreceipt').classList.remove('hidden')

    const firstTransaction = model.transactions[0] || {}
    const lastTransaction = model.transactions[model.transactions.length - 1] || {}
    const roomNo = model.transactions.map(tx => String(tx.ownerid || '').trim()).filter(v => v && v !== '-2').join(', ') || '-'
    const summaryRows = model.billSummary.map(([label, amount]) => `
        <tr>
            <td style="padding:2px 0;">${label}</td>
            <td style="padding:2px 0; text-align:right;">${formatFolioAmount(amount)}</td>
        </tr>
    `).join('')

    const dayRows = model.groupedDays.map((day) => {
        const txRows = day.rows.map((tx) => `
            <tr>
                <td>${specialformatDateTime(tx.transactiondate || '')}</td>
                <td>${normalizeFolioText(tx.reference)}</td>
                <td>${normalizeFolioText(tx.description)}</td>
                <td style="text-align:right;">${formatFolioAmount(tx.debit)}</td>
                <td style="text-align:right;">${formatFolioAmount(tx.credit)}</td>
                <td style="text-align:right;">${formatFolioAmount(tx.runningBalance)}</td>
            </tr>
        `).join('')
        return `
            ${txRows}
            <tr class="day-total-row">
                <td colspan="3" style="text-align:right; font-weight:700;">Day Total</td>
                <td style="text-align:right; font-weight:700;">${formatFolioAmount(day.dayDebit)}</td>
                <td style="text-align:right; font-weight:700;">${formatFolioAmount(day.dayCredit)}</td>
                <td style="text-align:right; font-weight:700;">${formatFolioAmount(day.dayClosingBalance)}</td>
            </tr>
        `
    }).join('')

    did('invoicecontainer').innerHTML = `
        <div id="guestfolioprintcontainer" class="bg-white p-4 md:p-8" style="max-width:900px;margin:0 auto;">
            <style>
                #guestfolioprintcontainer{font-family:Arial,sans-serif;color:#222;font-size:12px;line-height:1.25;}
                #guestfolioprintcontainer .header{text-align:center;border-bottom:1px solid #bbb;padding-bottom:8px;margin-bottom:8px;}
                #guestfolioprintcontainer .logo{width:52px;height:52px;max-width:52px;max-height:52px;object-fit:contain;margin:0 auto 4px;display:block;}
                #guestfolioprintcontainer .title{font-size:18px;font-weight:700;letter-spacing:.5px;margin-top:4px;}
                #guestfolioprintcontainer table{width:100%;border-collapse:collapse;}
                #guestfolioprintcontainer .meta td{vertical-align:top;padding:2px 6px;border:1px solid #ccc;}
                #guestfolioprintcontainer .ledger th,#guestfolioprintcontainer .ledger td{border:1px solid #ccc;padding:4px 6px;}
                #guestfolioprintcontainer .ledger th{background:#f3f4f6;text-transform:uppercase;font-size:11px;}
                #guestfolioprintcontainer .day-total-row{background:#f8fafc;}
                #guestfolioprintcontainer .grand{margin-top:6px;font-weight:700;}
                #guestfolioprintcontainer .summary{margin-top:10px;max-width:360px;margin-left:auto;}
                #guestfolioprintcontainer .summary-title{text-align:center;font-weight:700;margin-bottom:4px;}
                #guestfolioprintcontainer .footer-note{margin-top:12px;border-top:1px solid #bbb;padding-top:6px;display:flex;justify-content:space-between;font-size:11px;}
                #guestfolioprintcontainer .signatures{margin-top:24px;display:flex;justify-content:space-between;font-size:12px;}
                @media print{
                    #guestfolioprintcontainer .logo{width:52px !important;height:52px !important;max-width:52px !important;max-height:52px !important;}
                }
            </style>
            <div class="header">
                ${model.profile.logoUrl ? `<img src="${model.profile.logoUrl}" alt="logo" class="logo">` : ''}
                <div style="font-size:20px;font-weight:700;">${normalizeFolioText(model.profile.companyName)}</div>
                <div>${normalizeFolioText(model.profile.companyAddress)}</div>
                <div>${normalizeFolioText(model.profile.companyPhone)} ${model.profile.companyEmail ? ' | ' + model.profile.companyEmail : ''}</div>
                <div class="title">GUEST INVOICE</div>
            </div>

            <table class="meta">
                <tr>
                    <td style="width:58%;">
                        <div><strong>Guest:</strong> ${normalizeFolioText(model.guestname)}</div>
                        <div><strong>Travel Agent:</strong> ${normalizeFolioText(model.travelagency?.agencyname || model.travelagency?.name || '')}</div>
                        <div><strong>Company:</strong> ${normalizeFolioText(model.company?.companyname || model.guest?.companyname || '')}</div>
                        <div><strong>Bill Instruction:</strong> ${normalizeFolioText(model.guest?.moredata?.billinstruction || '')}</div>
                    </td>
                    <td>
                        <div><strong>Invoice No:</strong> ${normalizeFolioText(lastTransaction.reference)}</div>
                        <div><strong>Invoice Date:</strong> ${normalizeFolioText(lastTransaction.transactiondate ? specialformatDateTime(lastTransaction.transactiondate) : '')}</div>
                        <div><strong>Arrival Date:</strong> -</div>
                        <div><strong>Departure Date:</strong> -</div>
                        <div><strong>Pax:</strong> -</div>
                        <div><strong>Room No:</strong> ${normalizeFolioText(roomNo)}</div>
                        <div><strong>Reg No:</strong> ${normalizeFolioText(model.guest?.id)}</div>
                        <div><strong>Reservation No:</strong> ${normalizeFolioText(firstTransaction.reference)}</div>
                        <div><strong>Rack Rate:</strong> -</div>
                    </td>
                </tr>
            </table>

            <table class="ledger" style="margin-top:8px;">
                <thead>
                    <tr>
                        <th style="width:18%;">Date</th>
                        <th style="width:17%;">Voucher</th>
                        <th>Description</th>
                        <th style="width:14%;text-align:right;">Debit</th>
                        <th style="width:14%;text-align:right;">Credit</th>
                        <th style="width:14%;text-align:right;">Balance</th>
                    </tr>
                </thead>
                <tbody>
                    ${dayRows || '<tr><td colspan="6" style="text-align:center;">No transactions</td></tr>'}
                </tbody>
            </table>

            <table class="grand">
                <tr>
                    <td style="text-align:right;padding-top:6px;"><strong>Grand Total:</strong></td>
                    <td style="width:14%;text-align:right;padding-top:6px;"><strong>${formatFolioAmount(model.totalDebit)}</strong></td>
                    <td style="width:14%;text-align:right;padding-top:6px;"><strong>${formatFolioAmount(model.totalCredit)}</strong></td>
                    <td style="width:14%;text-align:right;padding-top:6px;"><strong>${formatFolioAmount(model.finalBalance)}</strong></td>
                </tr>
            </table>

            <div class="summary">
                <div class="summary-title">--- Bill Summary ---</div>
                <table>
                    <tbody>
                        ${summaryRows || '<tr><td>Others</td><td style="text-align:right;">0.00</td></tr>'}
                        <tr>
                            <td style="padding-top:4px;font-weight:700;">Total</td>
                            <td style="padding-top:4px;text-align:right;font-weight:700;">${formatFolioAmount(model.finalBalance)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="footer-note">
                <span>WE HOPE YOU ENJOYED YOUR STAY AND WOULD LIKE TO WELCOME YOU BACK</span>
                <span>Please Deposit Your Room Key</span>
            </div>

            <div class="signatures">
                <span>Cashier Signature</span>
                <span>Reprint Bill (1)</span>
                <span>Guest Signature</span>
            </div>
        </div>

        <div class="flex justify-end mt-3 gap-2">
            <button type="button" class="btn" onclick="printContent('HEMS GUEST FOLIO', null, 'guestfolioprintcontainer', true)">Print</button>
            <button type="button" class="btn" onclick="did('modalreceipt').classList.add('hidden')">Close</button>
        </div>
    `
}

async function receivablesActive(mode='') {
    guestfolioPageMode = mode || getCurrentRouteName() || 'receivables'
    // const form = document.querySelector('#receiveablesform')
    // if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', receiveablesFormSubmitHandler)
    if(document.querySelector('#submitreceiveablesfilter')) document.querySelector('#submitreceiveablesfilter').addEventListener('click', () => {
        if(isGuestFolioRoute()) fetchreceiveables('', getSelectedReceivablesGuestId())
        else fetchreceiveables('', did('receiveablesroomnumber').value)
    })
    if(!isGuestFolioRoute()) setupReceivablesRoomPicker()
    else if(did('openReceivablesRoomPicker')) did('openReceivablesRoomPicker').classList.add('hidden')
    if(document.querySelector('#resetreceiveablesfilter')) document.querySelector('#resetreceiveablesfilter').addEventListener('click', resetreceiveablesfilter)
    initGuestFolioViewTabs()
    configureReceivablesFilterMode()
    if(isGuestFolioRoute()) await initializeGuestFolioGuestPicker()
    datasource = []
    guestfolioReceiveablesFiltered = false
    setreceiveablesTableHeader()
    if(isPayPendingCheckoutBillsRoute()){
        renderReceiveablesEmptyState('Enter a room number to load pending checkout bills')
        return
    }
    await fetchreceiveables()
}

function normalizeGuestDisplayName(item = {}) {
    const lastName = String(item.lastname || '').trim()
    const firstName = String(item.firstname || '').trim()
    const otherNames = String(item.othernames || '').trim()
    return [lastName, firstName, otherNames].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()
}

function configureReceivablesFilterMode() {
    const roomWrap = did('receivablesRoomFilterWrap')
    const guestWrap = did('guestFolioGuestFilterWrap')
    const guestExtraFilters = did('guestFolioNameFilters')
    const pageTitleSpan = document.querySelector('.page-title span')
    const viewTabLabel = document.querySelector('li[name="checkinview"] p')
    const showGuestMode = isGuestFolioRoute()

    if(pageTitleSpan) pageTitleSpan.textContent = showGuestMode ? 'GUEST FOLIO' : 'RECEIVABLES'
    if(viewTabLabel) viewTabLabel.textContent = showGuestMode ? 'View Guest Folio' : 'View Receivables'
    if(roomWrap) roomWrap.classList.toggle('hidden', showGuestMode)
    if(guestWrap) guestWrap.classList.toggle('hidden', !showGuestMode)
    if(guestExtraFilters) guestExtraFilters.classList.toggle('hidden', !showGuestMode)
}

function receivablesEnsureTomSelectAssets() {
    if (window.TomSelect) return Promise.resolve()
    if (guestfolioTomSelectAssetsPromise) return guestfolioTomSelectAssetsPromise
    guestfolioTomSelectAssetsPromise = new Promise((resolve, reject) => {
        if (!document.querySelector('link[data-receivables-tom-select]')) {
            const css = document.createElement('link')
            css.rel = 'stylesheet'
            css.href = 'https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/css/tom-select.css'
            css.dataset.receivablesTomSelect = '1'
            document.head.appendChild(css)
        }
        const existingScript = document.querySelector('script[data-receivables-tom-select]')
        if (existingScript) {
            if (window.TomSelect) resolve()
            else existingScript.addEventListener('load', () => resolve(), { once: true })
            return
        }
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/js/tom-select.complete.min.js'
        script.dataset.receivablesTomSelect = '1'
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Unable to load Tom Select'))
        document.head.appendChild(script)
    })
    return guestfolioTomSelectAssetsPromise
}

async function initializeGuestFolioGuestPicker() {
    const guestControl = did('receiveablesguestid')
    if(!guestControl) return
    await receivablesEnsureTomSelectAssets()
    const request = await httpRequest2('../controllers/fetchguestbyfilter', null, null, 'json')
    guestfolioGuestOptions = request?.status && Array.isArray(request.data) ? request.data : []
    guestControl.innerHTML = '<option value="">Select guest name</option>'
    guestfolioGuestOptions.forEach(item => {
        const id = String(item.id || '').trim()
        if(!id) return
        const name = normalizeGuestDisplayName(item) || `Guest ${id}`
        guestControl.insertAdjacentHTML('beforeend', `<option value="${id}">${name}</option>`)
    })
    if(guestfolioGuestTomSelect) {
        guestfolioGuestTomSelect.destroy()
        guestfolioGuestTomSelect = null
    }
    if(window.TomSelect) {
        guestfolioGuestTomSelect = new window.TomSelect(guestControl, {
            create: false,
            persist: false,
            placeholder: 'Select guest name',
            maxOptions: 1000
        })
    }
}

function getSelectedReceivablesGuestId() {
    if(guestfolioGuestTomSelect && typeof guestfolioGuestTomSelect.getValue === 'function') {
        return String(guestfolioGuestTomSelect.getValue() || '').trim()
    }
    return String(did('receiveablesguestid')?.value || '').trim()
}

let guestfolioPickerData = { checkedin: [], reservations: [] }
let guestfolioPickerTab = 'checkedin'
let guestfolioPickerViewRows = []

function setupReceivablesRoomPicker(){
    const submitBtn = did('submitreceiveablesfilter')
    if(!submitBtn)return
    if(!did('openReceivablesRoomPicker')) submitBtn.insertAdjacentHTML('afterend', `<button id="openReceivablesRoomPicker" type="button" class="btn"><span>Find</span></button>`)
    buildReceivablesPickerModal()
    did('openReceivablesRoomPicker').onclick = openReceivablesRoomPicker
}

function buildReceivablesPickerModal(){
    if(!did('receivablesRoomPickerModal')) document.body.insertAdjacentHTML('beforeend', `<div id="receivablesRoomPickerModal" class="hidden fixed inset-0 z-[210] bg-[#00000052] p-4 overflow-auto flex items-center justify-center"></div>`)
    did('receivablesRoomPickerModal').className = 'hidden fixed inset-0 z-[210] bg-[#00000052] p-4 overflow-auto flex items-center justify-center'
    did('receivablesRoomPickerModal').innerHTML = `
      <div class="max-w-5xl w-full bg-white rounded shadow p-4 max-h-[90vh] overflow-auto">
        <div class="flex justify-between items-center mb-3">
          <p class="font-semibold">Select Checked-In / Reservation</p>
          <span class="material-symbols-outlined cp text-red-500" onclick="did('receivablesRoomPickerModal').classList.add('hidden')">close</span>
        </div>
        <div class="flex flex-wrap gap-2 mb-3 items-end">
          <button type="button" id="receivablesPickerTabCheckedin" class="inline-block p-3 border-b-2 border-blue-500 text-blue-600 font-semibold" onclick="switchReceivablesPickerTab('checkedin')">All Checked In</button>
          <button type="button" id="receivablesPickerTabReservations" class="inline-block p-3 border-b-2 border-transparent text-gray-500 font-semibold" onclick="switchReceivablesPickerTab('reservations')">All Reservations</button>
          <div class="ml-auto grid grid-cols-1 md:grid-cols-3 gap-2 w-full md:w-auto">
            <input id="receivablesPickerStartDate" type="date" class="form-control">
            <input id="receivablesPickerEndDate" type="date" class="form-control">
            <button type="button" class="btn btn-sm" onclick="reloadReceivablesPickerTabData()">Filter</button>
          </div>
          <input id="receivablesPickerSearch" class="form-control ml-auto max-w-sm" placeholder="Filter room, guest, ref, phone" oninput="renderReceivablesPickerRows()">
        </div>
        <div class="table-content"><table><thead><tr><th>ref</th><th>room</th><th>guest</th><th>phone</th><th>arrival</th><th>departure</th><th>action</th></tr></thead><tbody id="receivablesPickerRows"></tbody></table></div>
      </div>
    `
    did('receivablesRoomPickerModal').onclick = function(event){ if(event.target.id=='receivablesRoomPickerModal')this.classList.add('hidden') }
    const year = new Date().getFullYear()
    if(did('receivablesPickerStartDate') && !did('receivablesPickerStartDate').value) did('receivablesPickerStartDate').value = `${year}-01-01`
    if(did('receivablesPickerEndDate') && !did('receivablesPickerEndDate').value) did('receivablesPickerEndDate').value = `${year + 1}-12-31`
}

async function openReceivablesRoomPicker(){
    did('receivablesRoomPickerModal').classList.remove('hidden')
    await reloadReceivablesPickerTabData()
    renderReceivablesPickerRows()
}

function switchReceivablesPickerTab(tab){
    guestfolioPickerTab = tab
    did('receivablesPickerTabCheckedin').className = `inline-block p-3 border-b-2 font-semibold ${tab=='checkedin' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`
    did('receivablesPickerTabReservations').className = `inline-block p-3 border-b-2 font-semibold ${tab=='reservations' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`
    reloadReceivablesPickerTabData()
}

async function reloadReceivablesPickerTabData(){
    const startdate = did('receivablesPickerStartDate')?.value || ''
    const enddate = did('receivablesPickerEndDate')?.value || ''
    const payload = new FormData()
    payload.append('startdate', startdate)
    payload.append('enddate', enddate)
    if(guestfolioPickerTab == 'checkedin'){
        const reqCheckin = await httpRequest2('../controllers/fetchallcheckins', payload, null, 'json')
        guestfolioPickerData.checkedin = reqCheckin.status ? normalizeReceivablesPickerRows(reqCheckin.data || []) : []
    }else{
        const reqRes = await httpRequest2('../controllers/fetchreservationsbyfilter', payload, null, 'json')
        guestfolioPickerData.reservations = reqRes.status ? normalizeReceivablesPickerRows(reqRes.data || []) : []
    }
    renderReceivablesPickerRows()
}

function normalizeReceivablesPickerRows(data){
    return data.map(item => {
        const res = item.reservations || item
        const rows = item.roomguestrow || item.roomgeustrow || []
        const rooms = rows.map(r => r.roomdata?.roomnumber).filter(Boolean).join(', ')
        const guests = rows.flatMap(r => [ ...(r.guest1 || []), ...(r.guest2 || []), ...(r.guest3 || []), ...(r.guest4 || []) ])
        const guestname = guests.map(g => `${g.firstname || ''} ${g.lastname || ''}`.trim()).filter(Boolean).join(', ')
        const phone = guests.map(g => g.phone || '').filter(Boolean).join(', ')
        return { reference: res.reference || '', roomnumber: rooms, guestname, phone, arrivaldate: res.arrivaldate || '', departuredate: res.departuredate || '' }
    }).filter(x => x.reference || x.roomnumber)
}

function renderReceivablesPickerRows(){
    const search = (did('receivablesPickerSearch')?.value || '').toLowerCase().trim()
    const source = guestfolioPickerTab == 'checkedin' ? guestfolioPickerData.checkedin : guestfolioPickerData.reservations
    const rows = source.filter(item => `${item.reference} ${item.roomnumber} ${item.guestname} ${item.phone}`.toLowerCase().includes(search))
    guestfolioPickerViewRows = rows
    did('receivablesPickerRows').innerHTML = rows.map((item, idx) => `
        <tr>
            <td>${item.reference || '-'}</td><td>${item.roomnumber || '-'}</td><td>${item.guestname || '-'}</td><td>${item.phone || '-'}</td>
            <td>${item.arrivaldate ? specialformatDateTime(item.arrivaldate) : '-'}</td>
            <td>${item.departuredate ? specialformatDateTime(item.departuredate) : '-'}</td>
            <td><button type="button" class="btn btn-sm bg-blue-500 text-white" onclick='useReceivablesRoomPicker(${idx})'>Use</button></td>
        </tr>
    `).join('') || `<tr><td colspan="100%" class="text-center opacity-70">No records found</td></tr>`
}

function useReceivablesRoomPicker(rowIndex){
    const item = guestfolioPickerViewRows[rowIndex]
    if(!item)return
    const room = (item.roomnumber || '').split(',')[0].trim()
    if(did('receiveablesroomnumber'))did('receiveablesroomnumber').value = room
    did('receivablesRoomPickerModal').classList.add('hidden')
    fetchreceiveables('', room)
}

async function fetchreceiveables(id='', roomnumber='') {
    const normalizedRoomNumber = String(roomnumber || '').trim()
    const firstNameFilter = String(did('receiveablesfirstname')?.value || '').trim()
    const lastNameFilter = String(did('receiveableslastname')?.value || '').trim()
    const otherNamesFilter = String(did('receiveablesothernames')?.value || '').trim()
    if(isPayPendingCheckoutBillsRoute() && !id && !normalizedRoomNumber){
        guestfolioReceiveablesFiltered = false
        setreceiveablesTableHeader()
        renderReceiveablesEmptyState('Enter a room number to load pending checkout bills')
        return notification('Please enter a room number', 0)
    }

    guestfolioReceiveablesFiltered = Boolean(normalizedRoomNumber)
    setreceiveablesTableHeader()
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        if(id)paramstr.append('id', id)
        if(normalizedRoomNumber){
            if(isGuestFolioRoute()) paramstr.append('guestid', normalizedRoomNumber)
            else paramstr.append('roomnumber', normalizedRoomNumber)
        }
        if(isGuestFolioRoute()){
            if(firstNameFilter) paramstr.append('firstname', firstNameFilter)
            if(lastNameFilter) paramstr.append('lastname', lastNameFilter)
            if(otherNamesFilter) paramstr.append('othernames', otherNamesFilter)
        }
        return paramstr
    }
    const fetchController = isGuestFolioRoute() ? '../controllers/fetchguestfolio' : '../controllers/fetchreceivablesbyrooms'
    const shouldSendParams = Boolean(
        id ||
        normalizedRoomNumber ||
        (isGuestFolioRoute() && (firstNameFilter || lastNameFilter || otherNamesFilter))
    )
    let request = await httpRequest2(fetchController, shouldSendParams ? getparamm() : null, document.querySelector('#submitreceiveablesfilter'), 'json')
    if(!id)renderReceiveablesEmptyState()
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = isGuestFolioRoute() ? normalizeGuestFolioRows(request.data) : request.data
                resolvePagination(datasource, onreceiveablesTableDataSignal)
                if(isGuestFolioRoute()) renderGuestFolioPrintTable()
            }else{
                renderReceiveablesEmptyState(isPayPendingCheckoutBillsRoute() ? 'No pending checkout bills were found for this room' : 'No records retrieved')
                if(isGuestFolioRoute() && did('guestFolioPrintTableBody')) {
                    did('guestFolioPrintTableBody').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No records found</td></tr>`
                }
            }
        }else{
             guestfolioReceiveablesId = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

function resetreceiveablesfilter(){
    if(did('receiveablesroomnumber'))did('receiveablesroomnumber').value = ''
    if(did('receiveablesfirstname'))did('receiveablesfirstname').value = ''
    if(did('receiveableslastname'))did('receiveableslastname').value = ''
    if(did('receiveablesothernames'))did('receiveablesothernames').value = ''
    if(guestfolioGuestTomSelect && typeof guestfolioGuestTomSelect.clear === 'function') guestfolioGuestTomSelect.clear(true)
    if(did('receiveablesguestid'))did('receiveablesguestid').value = ''
    if(isPayPendingCheckoutBillsRoute()){
        datasource = []
        guestfolioReceiveablesFiltered = false
        setreceiveablesTableHeader()
        renderReceiveablesEmptyState('Enter a room number to load pending checkout bills')
        return
    }
    fetchreceiveables()
}

async function removereceiveables(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this receivable?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removevisacountries', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchreceiveables()
    return notification(request.message);
    
}

        // <td class="flex items-center gap-3">
        //     <button title="Edit row entry" onclick="fetchreceiveables('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
        //     <button title="Delete row entry"s onclick="removereceiveables('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        // </td>

async function onreceiveablesTableDataSignal() {
    setreceiveablesTableHeader()
    if(isGuestFolioRoute()){
        const rows = getSignaledDatasource().map((item) =>{
            const runningBalance = getReceivableRunningBalance(item.index)
            return(`
            <tr>
                <td>${formatReceivableTransactionDate(item.transactiondate)}</td>
                <td>${item.guestname || '-'}</td>
                <td>${formatReceivableDescription(item.description || (item._emptyTransaction ? 'No transactions available yet' : ''))}</td>
                <td>${formatNumber(item.debit || 0)}</td>
                <td>${formatNumber(item.credit || 0)}</td>
                <td><p class="text-black font-semibold">${formatNumber(runningBalance)}</p></td>
                <td class="flex gap-1 items-center">
                    ${item._emptyTransaction ? '' : `<button onclick="openreceiveablemodalbyindex('${item.index ?? 0}')" class="btn btn-sm btn-primary ${(Number(item.debit || 0) - Number(item.credit || 0)) > 0 ? '' : '!hidden'}">Pay Now</button>`}
                </td>
            </tr>`)
        }).join('')
        injectPaginatatedTable(rows || `<tr><td colspan="100%" class="text-center opacity-70">No records found</td></tr>`)
        return
    }
    if(guestfolioReceiveablesFiltered || isPayPendingCheckoutBillsRoute()){
        let rows = getSignaledDatasource().map((item, index) =>{
        const result = Number(item.debit) - Number(item.credit);
        const roomIdentifier = item.ownerid || item.roomnumber || '';
        const runningBalance = getReceivableRunningBalance(item.index ?? index);
        return(`
        <tr>
            <td>${formatReceivableTransactionDate(item.transactiondate)}</td>
            <td> ROOM ${roomIdentifier}</td>
            <td>${formatReceivableDescription(item.description)}</td>
            <td>${formatNumber(item.debit)}</td>
            <td>${formatNumber(item.credit)}</td>
            <td><p class="text-black font-semibold">${formatNumber(runningBalance)}</p></td>
            <td><button onclick="openreceiveablemodalbyindex('${item.index ?? index}')" class="btn btn-sm btn-primary ${result > 0 ? '' : '!hidden'}">Pay Now</button></td>
        </tr>`)}
        )
        .join('')
        injectPaginatatedTable(rows)
        return
    }

    let rows = getSignaledDatasource().map((item, index) =>{
    const result = Number(item.debit) - Number(item.credit);
    const roomIdentifier = item.ownerid || item.roomnumber || '';
    const runningBalance = getReceivableRunningBalance(item.index ?? index);
    return(`
    <tr>
        <td>${item.index + 1 }</td>
        <td> ROOM ${roomIdentifier}</td>
        <td>${formatNumber(item.debit)}</td>
        <td>${formatNumber(item.credit)}</td>
        <td><p class="text-black font-semibold">${formatNumber(runningBalance)}</p></td>
        <td><button onclick="openreceiveablemodalbyindex('${item.index ?? index}')" class="btn btn-sm btn-primary ${result > 0 ? '' : '!hidden'}">Pay Now</button></td>
    </tr>`)}
    )
    .join('')
    injectPaginatatedTable(rows)
}

function setreceiveablesTableHeader(){
    const tableHead = document.getElementById('receiveables-table-head')
    if(!tableHead)return
    if(isGuestFolioRoute()){
        tableHead.innerHTML = `
            <th>transaction&nbsp;date</th>
            <th>guest&nbsp;name</th>
            <th>description</th>
            <th>debit</th>
            <th>credit</th>
            <th>balance</th>
            <th>ACTION</th>
        `
        return
    }

    const useDetailedHeader = guestfolioReceiveablesFiltered || isPayPendingCheckoutBillsRoute()

    tableHead.innerHTML = useDetailedHeader ? `
        <th>transaction&nbsp;date</th>
        <th>room&nbsp;number</th>
        <th>description</th>
        <th>debit</th>
        <th>credit</th>
        <th>balance</th>
        <th>ACTION</th>
    ` : `
        <th style="width: 20px">s/n</th>
        <th>room&nbsp;number</th>
        <th>debit</th>
        <th>credit</th>
        <th>balance</th>
        <th>ACTION</th>
    `
}

function formatReceivableTransactionDate(value){
    if(!value)return ''

    const parsedDate = new Date(String(value).replace(' ', 'T'))
    if(Number.isNaN(parsedDate.getTime()))return value

    const day = parsedDate.getDate()
    const suffix = day % 10 == 1 && day % 100 != 11 ? 'st' : day % 10 == 2 && day % 100 != 12 ? 'nd' : day % 10 == 3 && day % 100 != 13 ? 'rd' : 'th'
    const month = parsedDate.toLocaleString('en-US', { month: 'long' })
    const year = parsedDate.getFullYear()
    const hours = parsedDate.getHours() % 12 || 12
    const minutes = String(parsedDate.getMinutes()).padStart(2, '0')
    const period = parsedDate.getHours() < 12 ? 'a.m.' : 'p.m.'

    return `${day}${suffix} of ${month} ${year} ${hours}:${minutes} ${period}`
}

function formatReceivableDescription(value){
    if(!value)return ''

    const parts = String(value).split('|').map(part => part.trim())
    if(parts.length >= 3 && parts[1])return parts[1]

    return value
}

function getReceivableRunningBalance(index){
    let balance = 0
    const lastIndex = Number(index)

    for(let i = 0; i <= lastIndex && i < datasource.length; i++){
        balance += Number(datasource[i].debit || 0)
        balance -= Number(datasource[i].credit || 0)
    }

    return balance
}

function openreceiveablemodalbyindex(rowIndex){
    const numericIndex = Number(rowIndex)
    const rowItem = datasource.find(item => Number(item.index) === numericIndex) || datasource[numericIndex] || null
    if(!rowItem)return notification('Unable to load receivable row', 0)

    const roomIdentifier = rowItem.ownerid || rowItem.roomnumber || ''
    openreceiveablemodal(rowItem.debit, rowItem.credit, roomIdentifier, rowItem.currency || 'NGN')
}

function openreceiveablemodal(dbt, cdt, rn, ccy='NGN'){
    document.getElementById('modalreceipt').classList.remove('hidden')
    let data = {debit: dbt,credit:cdt,roomnumber:rn,currency:ccy}
    const payableAmount = Number(data.debit || 0)
    const currency = String(data.currency || 'NGN').toUpperCase()

    did('invoicecontainer').innerHTML = `
        <div class="rounded-lg w-[640px] max-w-full">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold">Receivables Payment</h3>
                <button type="button" onclick="did('modalreceipt').classList.add('hidden')" class="text-red-600 font-semibold">Close</button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="text-sm font-semibold block mb-1">Apply To</label>
                    <input id="receivable-applyto" type="text" value="ROOMS" readonly class="bg-gray-100 border rounded w-full py-2 px-3">
                </div>
                <div>
                    <label class="text-sm font-semibold block mb-1">Receipt To (Room Number)</label>
                    <input id="receivable-receiptto" type="text" value="${data.roomnumber}" readonly class="bg-gray-100 border rounded w-full py-2 px-3">
                </div>
                <div>
                    <label class="text-sm font-semibold block mb-1">Currency</label>
                    <input id="receivable-currency" type="text" value="${currency}" readonly class="bg-gray-100 border rounded w-full py-2 px-3">
                </div>
                <div>
                    <label class="text-sm font-semibold block mb-1">Total Amount</label>
                    <input type="text" value="${formatCurrency(payableAmount)}" readonly class="bg-gray-100 border rounded w-full py-2 px-3 text-blue-700 font-semibold">
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="text-sm font-semibold block mb-1">Payment Method</label>
                    <select id="receivable-paymentmethod" class="border rounded w-full py-2 px-3" onchange="toggleReceivableBankNameField()">
                        <option value="CASH">CASH</option>
                        <option value="TRANSFER">TRANSFER</option>
                        <option value="POS">POS</option>
                    </select>
                </div>
                <div>
                    <label class="text-sm font-semibold block mb-1">Amount Paid</label>
                    <input id="receivable-amountpaid" type="text" inputmode="decimal" placeholder="Enter amount paid" class="border rounded w-full py-2 px-3">
                </div>
                <div>
                    <label class="text-sm font-semibold block mb-1">Bank Name</label>
                    <input id="receivable-bankname" type="text" placeholder="Enter bank name" class="border rounded w-full py-2 px-3">
                </div>
                <div>
                    <label class="text-sm font-semibold block mb-1">Other Detail</label>
                    <input id="receivable-otherdetail" type="text" placeholder="Additional detail" class="border rounded w-full py-2 px-3">
                </div>
            </div>

            <div class="flex items-center justify-end gap-3">
                <button type="button" class="btn" onclick="did('modalreceipt').classList.add('hidden')">Cancel</button>
                <button id="receivable-pay-submit" type="button" class="btn" onclick="submitReceivablePayment()">Pay Now</button>
            </div>
        </div>
    `

    toggleReceivableBankNameField()
}

function toggleReceivableBankNameField(){
    const methodControl = did('receivable-paymentmethod')
    const bankNameControl = did('receivable-bankname')
    if(!methodControl || !bankNameControl)return

    const method = String(methodControl.value || '').toUpperCase()
    bankNameControl.placeholder = method === 'CASH' ? 'Optional for cash' : 'Enter bank name'
}

async function submitReceivablePayment(){
    const applyto = 'ROOMS'
    const receiptto = did('receivable-receiptto')?.value ? String(did('receivable-receiptto').value).trim() : ''
    const paymentmethod = did('receivable-paymentmethod')?.value ? String(did('receivable-paymentmethod').value).trim().toUpperCase() : ''
    const currency = did('receivable-currency')?.value ? String(did('receivable-currency').value).trim().toUpperCase() : 'NGN'
    const amountpaidRaw = did('receivable-amountpaid')?.value ? String(did('receivable-amountpaid').value).trim() : ''
    const bankname = did('receivable-bankname')?.value ? String(did('receivable-bankname').value).trim() : ''
    const otherdetail = did('receivable-otherdetail')?.value ? String(did('receivable-otherdetail').value).trim() : ''

    if(!receiptto)return notification('Room number is required', 0)
    if(!paymentmethod)return notification('Payment method is required', 0)
    if(!amountpaidRaw)return notification('Amount paid is required', 0)

    const normalizedAmount = amountpaidRaw.replace(/,/g, '')
    if(Number.isNaN(Number(normalizedAmount)) || Number(normalizedAmount) <= 0){
        return notification('Enter a valid amount paid', 0)
    }

    if(paymentmethod !== 'CASH' && !bankname){
        return notification('Enter bank name', 0)
    }

    const payload = new FormData()
    payload.append('applyto', applyto)
    payload.append('receiptto', receiptto)
    payload.append('paymentmethod', paymentmethod)
    payload.append('currency', currency)
    payload.append('amountpaid', normalizedAmount)
    payload.append('bankname', bankname)
    payload.append('otherdetail', otherdetail)

    const submitBtn = did('receivable-pay-submit')
    const request = await httpRequest2(guestfolioPaymentController, payload, submitBtn)
    if(request.status){
        notification('Payment received successfully', 1)
        did('modalreceipt').classList.add('hidden')
        if(isGuestFolioRoute()) fetchreceiveables('', getSelectedReceivablesGuestId())
        else fetchreceiveables('', did('receiveablesroomnumber')?.value || '')
        return
    }

    return notification(request.message || 'Payment failed', 0)
}

async function receiveablesFormSubmitHandler() {
    if(!validateForm('receiveablesform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#receiveablesform'), guestfolioReceiveablesId ? [['id', guestfolioReceiveablesId]] : null)
    let request = await httpRequest2('../controllers/receiveablescript', payload, document.querySelector('#receiveablesform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#receiveablesform').reset();
        fetchreceiveables();
        return
    }
    document.querySelector('#receiveablesform').reset();
    fetchreceiveables();
    return notification(request.message, 0);
}


// function runAdreceiveablesFormValidations() {
//     let form = document.getElementById('receiveablesform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#receiveablesname'))  controls.push([form.querySelector('#receiveablesname'), 'receiveables name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }


