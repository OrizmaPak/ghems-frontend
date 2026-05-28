let guestfolioReceiveablesId
let guestfolioReceiveablesFiltered = false
let guestfolioPageMode = 'guestfolio'
const guestfolioPaymentController = '../controllers/receipts'
let guestfolioGuestTomSelect = null
let guestfolioTomSelectAssetsPromise = null
let guestfolioGuestOptions = []
let orgFolioOptions = []
let guestFolioBuckets = new Map()
let guestfolioViewTab = 'receivable'

// Backward compatibility for old route/function spelling.
async function receiveablesActive(mode='receiveables') {
    return receivablesActive(mode)
}

async function guestfolioActive() {
    return receivablesActive('guestfolio')
}

async function companyfolioActive() {
    return receivablesActive('companyfolio')
}

async function agencyfolioActive() {
    return receivablesActive('agencyfolio')
}

async function groupfolioActive() {
    return receivablesActive('groupfolio')
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

function isCompanyFolioRoute(){
    return guestfolioPageMode === 'companyfolio' || getCurrentRouteName() === 'companyfolio'
}

function isAgencyFolioRoute(){
    return guestfolioPageMode === 'agencyfolio' || getCurrentRouteName() === 'agencyfolio'
}

function isGroupFolioRoute(){
    return guestfolioPageMode === 'groupfolio' || getCurrentRouteName() === 'groupfolio'
}

function isOrganisationFolioRoute(){
    return isCompanyFolioRoute() || isAgencyFolioRoute() || isGroupFolioRoute()
}

function renderReceiveablesEmptyState(message='No records retrieved'){
    const tabledata = document.getElementById('tabledata')
    if(!tabledata)return
    tabledata.innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">${message}</td></tr>`
}

function normalizeGuestFolioRows(payload = []) {
    if(!Array.isArray(payload)) return []
    const guestBuckets = new Map()

    const pickFirstDefined = (...values) => {
        for (const value of values) {
            if(value !== undefined && value !== null && String(value).trim() !== '') return value
        }
        return ''
    }

    const getReservationData = (entry = {}) => entry?.resrvationdata || entry?.reservationdata || entry?.reservations || null
    const isValidRoomNumberValue = (value = '') => {
        const text = String(value ?? '').trim()
        return Boolean(text && text !== '-' && text !== '-1' && text !== '-2' && text.toLowerCase() !== 'null' && text.toLowerCase() !== 'undefined')
    }
    const extractRoomNumberFromDescription = (description = '') => {
        const text = String(description || '')
        const roomNumberMatch = text.match(/room\s*number\s*:\s*([^|,\s]+)/i)
        if(roomNumberMatch?.[1]) return roomNumberMatch[1].trim()
        const bookingChargeMatch = text.match(/booking\s*charge\s*:\s*([^|,\s]+)/i)
        if(bookingChargeMatch?.[1]) return bookingChargeMatch[1].trim()
        return ''
    }
    const normalizeRoomNumberFromTransaction = (source = {}, tx = {}) => {
        const directRoom = pickFirstDefined(source?.roomnumber, tx?.roomnumber)
        if(isValidRoomNumberValue(directRoom)) return directRoom
        const ownerValue = pickFirstDefined(source?.ownerid, source?.owner, source?.receiptto, tx?.ownerid, tx?.owner)
        if(isValidRoomNumberValue(ownerValue)) return ownerValue
        return extractRoomNumberFromDescription(pickFirstDefined(source?.description, tx?.description))
    }

    const normalizeFolioTransaction = (tx = {}, bucket = {}) => {
        const source = tx?.saleentry || tx?.transaction || tx
        const roomNumber = normalizeRoomNumberFromTransaction(source, tx)
        return {
            ...source,
            ownerid: pickFirstDefined(source?.ownerid, source?.owner, source?.roomnumber, source?.receiptto, tx?.ownerid, tx?.roomnumber),
            roomnumber: roomNumber,
            guestid: bucket.guestid,
            folioid: bucket.folioid,
            guestname: bucket.guestname,
            reservationReference: bucket.reservationReference,
            hasHiddenCredit: Boolean(bucket.company || bucket.travelagency),
            debit: Number(source?.debit || tx?.debit || 0),
            credit: Number(source?.credit || tx?.credit || 0),
            transactiondate: pickFirstDefined(source?.transactiondate, source?.valuedate, source?.tlog, tx?.transactiondate, tx?.tlog),
            description: pickFirstDefined(source?.description, tx?.description)
        }
    }

    const ensureGuestBucket = (guest = {}, reservation = null, entryIndex = 0) => {
        const guestId = String(guest?.id || '').trim() || `guest-${genID()}`
        const guestName = [guest?.lastname, guest?.firstname, guest?.othernames].map(value => String(value || '').trim()).filter(Boolean).join(' ') || '-'
        const reservationKey = String(reservation?.id || reservation?.reference || '').trim()
        const folioId = `${guestId}__${reservationKey || `entry-${entryIndex + 1}`}`
        if(!guestBuckets.has(folioId)) {
            guestBuckets.set(folioId, {
                folioid: folioId,
                guestid: guestId,
                guestname: guestName,
                createdAt: reservation?.reservationdate || reservation?.tlog || guest?.created_at || guest?.tlog || '',
                guest,
                guestRows: [],
                reservation,
                reservationReference: String(reservation?.reference || reservation?.id || '').trim(),
                company: null,
                travelagency: null,
                groups: null,
                transactions: []
            })
        }
        return guestBuckets.get(folioId)
    }

    payload.forEach((entry, entryIndex) => {
        const guest = entry?.guest || {}
        const reservation = getReservationData(entry)
        const bucket = ensureGuestBucket(guest, reservation, entryIndex)
        if(reservation) {
            bucket.reservation = reservation
            bucket.reservationReference = String(reservation?.reference || reservation?.id || '').trim()
        }
        if(entry?.company) bucket.company = entry.company
        if(entry?.travelagency) bucket.travelagency = entry.travelagency
        if(entry?.groups) bucket.groups = entry.groups
        const roomGuestRows = Array.isArray(entry?.roomgeustrow) ? entry.roomgeustrow : (Array.isArray(entry?.roomguestrow) ? entry.roomguestrow : [])
        if(roomGuestRows.length) {
            bucket.guestRows = roomGuestRows.map(row => row?.roomdata || row).filter(Boolean)
        }
        const transactions = Array.isArray(entry?.transactions) ? entry.transactions : []

        if(transactions.length) {
            transactions.forEach((tx) => {
                bucket.transactions.push(normalizeFolioTransaction(tx, bucket))
            })
        }
    })

    // If a guest is company/travel-agency backed on any source row, hide credit for all that guest's rows.
    guestBuckets.forEach((bucket) => {
        const shouldHideCredit = Boolean(bucket.company || bucket.travelagency)
        if(!shouldHideCredit) return
        bucket.transactions = bucket.transactions.map((tx) => ({ ...tx, hasHiddenCredit: true }))
    })

    const normalized = []
    guestBuckets.forEach((bucket) => {
        if(!bucket.transactions.length) {
            normalized.push({
                id: `guest-${bucket.guestid}`,
                ownerid: '',
                roomnumber: '',
                guestid: bucket.guestid,
                folioid: bucket.folioid,
                guestname: bucket.guestname,
                reservationReference: bucket.reservationReference,
                hasHiddenCredit: Boolean(bucket.company || bucket.travelagency),
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

function normalizeOrganisationFolioRows(payload = []) {
    if(!Array.isArray(payload)) return []

    const pickFirstDefined = (...values) => {
        for (const value of values) {
            if(value !== undefined && value !== null && String(value).trim() !== '') return value
        }
        return ''
    }

    const normalized = []
    const organisationBuckets = new Map()
    const ensureOrganisationBucket = (entry = {}, entryIndex = 0) => {
        const company = entry?.company || null
        const travelagency = entry?.travelagency || null
        const groups = entry?.groups || null
        const orgType = travelagency ? 'travelagency' : company ? 'company' : groups ? 'group' : 'organisation'
        const orgId = String(
            travelagency?.id ||
            company?.id ||
            groups?.id ||
            entryIndex + 1
        ).trim()
        const bucketId = `${orgType}-${orgId || (entryIndex + 1)}`
        if(!organisationBuckets.has(bucketId)) {
            const orgName = String(
                travelagency?.agencyname ||
                travelagency?.name ||
                company?.companyname ||
                company?.name ||
                groups?.groupname ||
                groups?.name ||
                'Organisation'
            ).trim() || 'Organisation'
            organisationBuckets.set(bucketId, {
                guestid: bucketId,
                guestname: orgName,
                guest: {},
                guestRows: [],
                reservation: null,
                company,
                travelagency,
                groups,
                transactions: []
            })
        }
        return organisationBuckets.get(bucketId)
    }

    payload.forEach((entry, entryIndex) => {
        const bucket = ensureOrganisationBucket(entry, entryIndex)
        const guestRows = Array.isArray(entry?.guest) ? entry.guest : []
        if(guestRows.length) bucket.guestRows = guestRows
        if(entry?.reservations) bucket.reservation = entry.reservations
        const roomNumbers = guestRows.map((row) => String(row?.roomnumber || '').trim()).filter(Boolean)
        const roomIdentifier = roomNumbers.join(', ')
        const transactions = Array.isArray(entry?.transactions) ? entry.transactions : []

        if(!transactions.length) {
            const emptyRow = {
                id: `org-${entryIndex + 1}`,
                ownerid: roomIdentifier,
                roomnumber: roomIdentifier,
                guestid: bucket.guestid,
                guestname: bucket.guestname,
                description: 'No transactions available yet',
                debit: 0,
                credit: 0,
                transactiondate: pickFirstDefined(guestRows[0]?.tlog, ''),
                _emptyTransaction: true
            }
            normalized.push(emptyRow)
            bucket.transactions.push(emptyRow)
            return
        }

        transactions.forEach((tx, txIndex) => {
            const source = tx?.saleentry || tx?.transaction || tx
            const row = {
                ...source,
                id: pickFirstDefined(source?.id, `org-${entryIndex + 1}-${txIndex + 1}`),
                ownerid: pickFirstDefined(source?.ownerid, source?.owner, source?.roomnumber, source?.receiptto, roomIdentifier),
                roomnumber: pickFirstDefined(source?.roomnumber, roomIdentifier),
                guestid: bucket.guestid,
                guestname: bucket.guestname,
                debit: Number(source?.debit || tx?.debit || 0),
                credit: Number(source?.credit || tx?.credit || 0),
                transactiondate: pickFirstDefined(source?.transactiondate, source?.valuedate, source?.tlog, tx?.transactiondate, tx?.tlog),
                description: pickFirstDefined(source?.description, tx?.description)
            }
            normalized.push(row)
            bucket.transactions.push(row)
        })
    })

    normalized.sort((a, b) => {
        const dateA = new Date(String(a?.transactiondate || '').replace(' ', 'T')).getTime() || 0
        const dateB = new Date(String(b?.transactiondate || '').replace(' ', 'T')).getTime() || 0
        return dateB - dateA
    })

    guestFolioBuckets = organisationBuckets
    return normalized
}

function formatFolioAmount(value = 0) {
    const numeric = Math.round(Number(value || 0))
    return numeric === 0 ? '' : formatNumber(numeric)
}

function maskCreditDisplayIfNeeded(value, shouldMask = false) {
    if(shouldMask) return '***'
    const numeric = Math.round(Number(value || 0))
    return numeric === 0 ? '' : formatNumber(numeric)
}

function formatFolioAmountCell(value, shouldMask = false) {
    if(shouldMask) return '***'
    const numeric = Math.round(Number(value || 0))
    return numeric === 0 ? '' : formatNumber(numeric)
}

function getReceivableCreditValueForBalance(item = {}) {
    return item?.hasHiddenCredit ? 0 : Number(item?.credit || 0)
}

function isFolioValidRoomNumber(value = '') {
    const text = String(value ?? '').trim()
    return Boolean(text && text !== '-' && text !== '-1' && text !== '-2' && text.toLowerCase() !== 'null' && text.toLowerCase() !== 'undefined')
}

function extractFolioRoomNumberFromDescription(description = '') {
    const text = String(description || '')
    const roomNumberMatch = text.match(/room\s*number\s*:\s*([^|,\s]+)/i)
    if(roomNumberMatch?.[1]) return roomNumberMatch[1].trim()
    const bookingChargeMatch = text.match(/booking\s*charge\s*:\s*([^|,\s]+)/i)
    if(bookingChargeMatch?.[1]) return bookingChargeMatch[1].trim()
    return ''
}

function resolveGuestFolioRoomNumber(model = {}) {
    const guestRoomNumber = model?.guest?.roomnumber
    if(isFolioValidRoomNumber(guestRoomNumber)) return String(guestRoomNumber).trim()
    const primaryGuestRow = Array.isArray(model.guestRows) && model.guestRows.length ? model.guestRows[0] : {}
    if(isFolioValidRoomNumber(primaryGuestRow?.roomnumber)) return String(primaryGuestRow.roomnumber).trim()
    for(const tx of model.transactions || []) {
        const directRoom = tx?.roomnumber
        if(isFolioValidRoomNumber(directRoom)) return String(directRoom).trim()
        const ownerValue = tx?.ownerid || tx?.owner || tx?.receiptto
        if(isFolioValidRoomNumber(ownerValue)) return String(ownerValue).trim()
        const descriptionRoom = extractFolioRoomNumberFromDescription(tx?.description)
        if(isFolioValidRoomNumber(descriptionRoom)) return descriptionRoom
    }
    return ''
}

function resolveGuestFolioRackRate(primaryGuestRow = {}, reservation = {}) {
    const roomRate = Number(primaryGuestRow?.roomrate || reservation?.roomrate || 0)
    if(roomRate) return roomRate
    const totalAmount = Number(reservation?.totalamount || 0)
    const nights = Number(reservation?.numberofnights || 0)
    if(totalAmount && nights > 0) return totalAmount / nights
    return totalAmount
}

function formatGuestFolioVoucher(tx = {}, reservationReference = '') {
    const invoiceNumber = normalizeFolioText(tx?.reference || '')
    const reservationNumber = normalizeFolioText(reservationReference || tx?.reservationReference || '')
    if(invoiceNumber === '-' && reservationNumber === '-') return '-'
    return `${invoiceNumber} :: ${reservationNumber}`
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
    const text = String(formatReceivableDescription(description) || '').toLowerCase()
    if(text.includes('accommodation') || text.includes('booking')) return 'Accommodation'
    if(text.includes('discount')) return 'Tariff Discount'
    if(text.includes('restaurant') || text.includes('meal') || text.includes('food')) return 'Restaurant Bill'
    if(text.includes('laundry')) return 'Laundry'
    if(text.includes('advance') || text.includes('credit card') || text.includes('transfer') || text.includes('deposit')) return 'Advance Credit Card'
    return 'Others'
}

function getGuestFolioPrintModel(guestId = '') {
    const lookupId = String(guestId || '').trim()
    const bucket = guestFolioBuckets.get(lookupId) || Array.from(guestFolioBuckets.values()).find(row => String(row?.guestid || '') === lookupId)
    if(!bucket) return null
    const profile = getGuestFolioOrganisationProfile()
    const transactions = (Array.isArray(bucket.transactions) ? [...bucket.transactions] : []).sort((a, b) => {
        const dateA = new Date(String(a?.transactiondate || '').replace(' ', 'T')).getTime() || 0
        const dateB = new Date(String(b?.transactiondate || '').replace(' ', 'T')).getTime() || 0
        return dateA - dateB
    })
    const primaryGuestRow = Array.isArray(bucket.guestRows) && bucket.guestRows.length ? bucket.guestRows[0] : {}
    const reservation = bucket.reservation || {}
    const reservationNo = String(bucket.reservationReference || reservation?.reference || reservation?.id || primaryGuestRow?.reservationid || '').trim()
    const rackRate = resolveGuestFolioRackRate(primaryGuestRow, reservation)
    const roomNo = resolveGuestFolioRoomNumber({ guest: bucket.guest || {}, guestRows: bucket.guestRows || [], transactions })

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
        const effectiveCredit = tx?.hasHiddenCredit ? 0 : credit
        totalDebit += debit
        totalCredit += effectiveCredit
        runningBalance += debit - effectiveCredit
        row.dayDebit += debit
        row.dayCredit += effectiveCredit
        row.dayClosingBalance = runningBalance
        row.rows.push({
            ...tx,
            debit,
            credit: effectiveCredit,
            runningBalance
        })

        const summaryKey = classifyGuestFolioSummary(tx.description)
        const prev = Number(billSummary.get(summaryKey) || 0)
        billSummary.set(summaryKey, prev + (debit - effectiveCredit))
    })

    return {
        profile,
        guest: bucket.guest || {},
        guestRows: bucket.guestRows || [],
        reservation,
        hideCredit: Boolean(bucket.company || bucket.travelagency),
        stayInfo: {
            arrivalDate: reservation?.arrivaldate || primaryGuestRow?.arrivaldate || '',
            departureDate: reservation?.departuredate || primaryGuestRow?.departuredate || '',
            rackRate,
            pax: Number(primaryGuestRow?.adult || 0) + Number(primaryGuestRow?.child || 0) + Number(primaryGuestRow?.infant || 0),
            roomNo,
            reservationNo
        },
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

function buildGuestFolioPrintContent(model, containerId = '') {
    if(!model) return ''
    const isAgencyFolioPrint = isAgencyFolioRoute()
    const lastTransaction = model.transactions[model.transactions.length - 1] || {}
    const roomNo = model.stayInfo?.roomNo || '-'
    const invoiceDate = lastTransaction.transactiondate || model.reservation?.reservationdate || model.reservation?.tlog || ''
    const containerAttr = containerId ? ` id="${containerId}"` : ''
    const summaryRows = model.billSummary.map(([label, amount]) => `
        <tr>
            <td style="padding:2px 0;border:1px solid #ccc;">${label}</td>
            <td style="padding:2px 0; text-align:right;border:1px solid #ccc;">${formatFolioAmount(amount)}</td>
        </tr>
    `).join('')

    const dayRows = model.groupedDays.map((day) => {
        const txRows = day.rows.map((tx) => `
            <tr>
                <td style="border:1px solid #ccc;padding:4px 6px;">${specialformatDateTime(tx.transactiondate || '')}</td>
                <td style="border:1px solid #ccc;padding:4px 6px;">${formatGuestFolioVoucher(tx, model.stayInfo?.reservationNo)}</td>
                <td style="border:1px solid #ccc;padding:4px 6px;">${normalizeFolioText(formatReceivableDescription(tx.description))}</td>
                <td style="text-align:right;border:1px solid #ccc;padding:4px 6px;">${formatFolioAmount(tx.debit)}</td>
                <td style="text-align:right;border:1px solid #ccc;padding:4px 6px;">${model.hideCredit ? '***' : formatFolioAmount(tx.credit)}</td>
                <td style="text-align:right;border:1px solid #ccc;padding:4px 6px;">${formatFolioAmount(tx.runningBalance)}</td>
            </tr>
        `).join('')
        return `
            ${txRows}
            <tr class="day-total-row">
                <td colspan="3" style="text-align:right; font-weight:700;border:1px solid #ccc;padding:4px 6px;">Day Total</td>
                <td style="text-align:right; font-weight:700;border:1px solid #ccc;padding:4px 6px;">${formatFolioAmount(day.dayDebit)}</td>
                <td style="text-align:right; font-weight:700;border:1px solid #ccc;padding:4px 6px;">${model.hideCredit ? '***' : formatFolioAmount(day.dayCredit)}</td>
                <td style="text-align:right; font-weight:700;border:1px solid #ccc;padding:4px 6px;">${formatFolioAmount(day.dayClosingBalance)}</td>
            </tr>
        `
    }).join('')

    return `
        <div${containerAttr} class="guest-folio-print-container bg-white p-4 md:p-8" style="max-width:900px;margin:0 auto;">
            <style>
                .guest-folio-print-container{font-family:Arial,sans-serif;color:#222;font-size:12px;line-height:1.25;}
                .guest-folio-print-container .header{text-align:center;border-bottom:1px solid #bbb;padding-bottom:8px;margin-bottom:8px;}
                .guest-folio-print-container .logo{width:52px;height:52px;max-width:52px;max-height:52px;object-fit:contain;margin:0 auto 4px;display:block;}
                .guest-folio-print-container .title{font-size:18px;font-weight:700;letter-spacing:.5px;margin-top:4px;}
                .guest-folio-print-container table{width:100%;border-collapse:collapse;}
                .guest-folio-print-container .meta td{vertical-align:top;padding:2px 6px;border:1px solid #ccc;}
                .guest-folio-print-container .ledger th,.guest-folio-print-container .ledger td{border:1px solid #ccc;padding:4px 6px;}
                .guest-folio-print-container .ledger th{background:#f3f4f6;text-transform:uppercase;font-size:11px;}
                .guest-folio-print-container .day-total-row{background:#f8fafc;}
                .guest-folio-print-container .grand{margin-top:6px;font-weight:700;}
                .guest-folio-print-container .summary{margin-top:10px;max-width:360px;margin-left:auto;}
                .guest-folio-print-container .summary-title{text-align:center;font-weight:700;margin-bottom:4px;}
                .guest-folio-print-container .footer-note{margin-top:12px;border-top:1px solid #bbb;padding-top:6px;display:flex;justify-content:space-between;font-size:11px;}
                .guest-folio-print-container .signatures{margin-top:34px;display:flex;justify-content:space-between;align-items:flex-end;gap:40px;}
                .guest-folio-print-container .signature-block{width:42%;text-align:center;}
                .guest-folio-print-container .signature-line{border-bottom:1px solid #111;height:24px;}
                .guest-folio-print-container .signature-label{margin-top:6px;font-size:12px;font-weight:600;letter-spacing:.3px;}
                @media print{
                    .guest-folio-print-container{max-width:900px !important;width:900px !important;}
                    .guest-folio-print-container .logo{width:52px !important;height:52px !important;max-width:52px !important;max-height:52px !important;}
                    .guest-folio-print-container table,
                    .guest-folio-print-container td,
                    .guest-folio-print-container th{border-color:#ccc !important;border-style:solid !important;}
                }
            </style>
            <div class="header">
                ${model.profile.logoUrl ? `<img src="${model.profile.logoUrl}" alt="logo" class="logo" width="52" height="52" style="width:52px !important;height:52px !important;max-width:52px !important;max-height:52px !important;object-fit:contain;display:block;margin:0 auto 4px;">` : ''}
                <div style="font-size:20px;font-weight:700;">${normalizeFolioText(model.profile.companyName)}</div>
                <div>${normalizeFolioText(model.profile.companyAddress)}</div>
                <div>${normalizeFolioText(model.profile.companyPhone)} ${model.profile.companyEmail ? ' | ' + model.profile.companyEmail : ''}</div>
                <div class="title">GUEST INVOICE</div>
            </div>

            <table class="meta">
                <tr>
                    <td style="width:58%;border:1px solid #ccc;padding:2px 6px;vertical-align:top;">
                        ${isAgencyFolioPrint ? '' : `<div><strong>Guest:</strong> ${normalizeFolioText(model.guestname)}</div>`}
                        <div><strong>Travel Agent:</strong> ${normalizeFolioText(model.travelagency?.agencyname || model.travelagency?.name || '')}</div>
                        <div><strong>Company:</strong> ${normalizeFolioText(model.company?.companyname || model.guest?.companyname || '')}</div>
                        <div><strong>Bill Instruction:</strong> ${normalizeFolioText(model.guest?.moredata?.billinstruction || '')}</div>
                    </td>
                    <td style="border:1px solid #ccc;padding:2px 6px;vertical-align:top;">
                        <div><strong>Invoice Date:</strong> ${normalizeFolioText(invoiceDate ? specialformatDateTime(invoiceDate) : '')}</div>
                        <div><strong>Arrival Date:</strong> ${normalizeFolioText(model.stayInfo?.arrivalDate ? specialformatDateTime(model.stayInfo.arrivalDate) : '')}</div>
                        <div><strong>Departure Date:</strong> ${normalizeFolioText(model.stayInfo?.departureDate ? specialformatDateTime(model.stayInfo.departureDate) : '')}</div>
                        <div><strong>Pax:</strong> ${model.stayInfo?.pax ? model.stayInfo.pax : '-'}</div>
                        <div><strong>Room No:</strong> ${normalizeFolioText(roomNo)}</div>
                        <div><strong>Reg No:</strong> ${normalizeFolioText(model.guest?.id)}</div>
                        <div><strong>Reservation No:</strong> ${normalizeFolioText(model.stayInfo?.reservationNo)}</div>
                        <div><strong>Rack Rate:</strong> ${model.stayInfo?.rackRate ? formatFolioAmount(model.stayInfo.rackRate) : '-'}</div>
                    </td>
                </tr>
            </table>

            <table class="ledger" style="margin-top:8px;">
                <thead>
                    <tr>
                        <th style="width:18%;border:1px solid #ccc;padding:4px 6px;background:#f3f4f6;">Date</th>
                        <th style="width:22%;border:1px solid #ccc;padding:4px 6px;background:#f3f4f6;">Invoice Number / Reservation Number</th>
                        <th style="border:1px solid #ccc;padding:4px 6px;background:#f3f4f6;">Description</th>
                        <th style="width:14%;text-align:right;border:1px solid #ccc;padding:4px 6px;background:#f3f4f6;">Debit</th>
                        <th style="width:14%;text-align:right;border:1px solid #ccc;padding:4px 6px;background:#f3f4f6;">Credit</th>
                        <th style="width:14%;text-align:right;border:1px solid #ccc;padding:4px 6px;background:#f3f4f6;">Balance</th>
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
                    <td style="width:14%;text-align:right;padding-top:6px;"><strong>${model.hideCredit ? '***' : formatFolioAmount(model.totalCredit)}</strong></td>
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
                <div class="signature-block">
                    <div class="signature-line"></div>
                    <div class="signature-label">Cashier Signature</div>
                </div>
                <div class="signature-block">
                    <div class="signature-line"></div>
                    <div class="signature-label">Guest Signature</div>
                </div>
            </div>
        </div>
    `
}

function renderGuestFolioPrintTable() {
    const printWrap = did('guestFolioPrintTableBody')
    if(!printWrap) return
    const rows = Array.from(guestFolioBuckets.values()).map((bucket, index) => {
        const model = getGuestFolioPrintModel(bucket.folioid || bucket.guestid)
        if(!model) return ''
        return `
            <div class="overflow-x-auto rounded border border-slate-200 bg-white p-3">
                <div class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Folio ${index + 1}</div>
                ${buildGuestFolioPrintContent(model)}
                <div class="mt-3 flex justify-end">
                    <button onclick="openGuestFolioPrint('${bucket.folioid || bucket.guestid}')" class="btn btn-sm bg-slate-700 text-white">View/Print Folio</button>
                </div>
            </div>
        `
    }).filter(Boolean).join('')
    printWrap.innerHTML = rows || `<div class="text-center opacity-70">No records found</div>`
}

function openGuestFolioPrint(guestId = '') {
    const model = getGuestFolioPrintModel(guestId)
    if(!model) return notification('Unable to load guest folio print data', 0)
    const modalReceipt = did('modalreceipt')
    const invoiceContainer = did('invoicecontainer')
    if(!modalReceipt || !invoiceContainer) return notification('Unable to open folio print modal', 0)
    modalReceipt.className = 'fixed w-screen h-screen top-0 z-[200] left-0 flex justify-center items-center overflow-hidden p-3 md:p-6 bg-[#00000052]'
    invoiceContainer.className = 'w-[min(96vw,980px)] max-h-[92vh] mx-auto border rounded shadow bg-white overflow-hidden flex flex-col'
    invoiceContainer.innerHTML = `
        <div class="flex min-h-0 flex-1 flex-col bg-white">
            <div class="min-h-0 flex-1 overflow-auto p-3 md:p-5">
                ${buildGuestFolioPrintContent(model, 'guestfolioprintcontainer')}
            </div>
            <div class="flex shrink-0 justify-end gap-2 border-t border-slate-200 bg-white/95 p-3">
                <button type="button" class="btn" onclick="printContent('HEMS GUEST FOLIO', null, 'guestfolioprintcontainer', true)">Print</button>
                <button type="button" class="btn" onclick="did('modalreceipt').classList.add('hidden')">Close</button>
            </div>
        </div>
    `
}

async function receivablesActive(mode='') {
    guestfolioPageMode = mode || getCurrentRouteName() || 'receivables'
    // const form = document.querySelector('#receiveablesform')
    // if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', receiveablesFormSubmitHandler)
    if(document.querySelector('#submitreceiveablesfilter')) document.querySelector('#submitreceiveablesfilter').addEventListener('click', () => {
        if(isGuestFolioRoute()) fetchreceiveables('', getSelectedReceivablesGuestId())
        else if(isOrganisationFolioRoute()) fetchreceiveables('', getSelectedOrganisationId())
        else fetchreceiveables('', did('receiveablesroomnumber').value)
    })
    if(!isGuestFolioRoute() && !isOrganisationFolioRoute()) setupReceivablesRoomPicker()
    else if(did('openReceivablesRoomPicker')) did('openReceivablesRoomPicker').classList.add('hidden')
    if(document.querySelector('#resetreceiveablesfilter')) document.querySelector('#resetreceiveablesfilter').addEventListener('click', resetreceiveablesfilter)
    initGuestFolioViewTabs()
    configureReceivablesFilterMode()
    if(isGuestFolioRoute()) await initializeGuestFolioGuestPicker()
    if(isOrganisationFolioRoute()) await initializeOrganisationFolioPicker()
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
    const orgWrap = did('orgFolioOrgFilterWrap')
    const pageTitleSpan = document.querySelector('.page-title span')
    const viewTabLabel = document.querySelector('li[name="checkinview"] p')
    const showGuestMode = isGuestFolioRoute()
    const showOrganisationMode = isOrganisationFolioRoute()
    const pageTitle = isCompanyFolioRoute()
        ? 'COMPANY FOLIO'
        : isAgencyFolioRoute()
            ? 'AGENCY FOLIO'
            : isGroupFolioRoute()
                ? 'GROUP FOLIO'
                : (showGuestMode ? 'GUEST FOLIO' : 'RECEIVABLES')
    const tabTitle = isCompanyFolioRoute()
        ? 'View Company Folio'
        : isAgencyFolioRoute()
            ? 'View Agency Folio'
            : isGroupFolioRoute()
                ? 'View Group Folio'
                : (showGuestMode ? 'View Guest Folio' : 'View Receivables')

    if(pageTitleSpan) pageTitleSpan.textContent = pageTitle
    if(viewTabLabel) viewTabLabel.textContent = tabTitle
    if(roomWrap) roomWrap.classList.toggle('hidden', showGuestMode || showOrganisationMode)
    if(guestWrap) guestWrap.classList.toggle('hidden', !showGuestMode)
    if(orgWrap) orgWrap.classList.toggle('hidden', !showOrganisationMode)
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

function getOrganisationPickerController() {
    if(isCompanyFolioRoute()) return '../controllers/fetchcompanyforgroups'
    if(isAgencyFolioRoute()) return '../controllers/fetchtravelagency'
    if(isGroupFolioRoute()) return '../controllers/fetchguestgroup'
    return ''
}

function getOrganisationFolioFetchController() {
    if(isCompanyFolioRoute()) return '../controllers/fetchcompanyfolio'
    if(isAgencyFolioRoute()) return '../controllers/fetchagencyfolio'
    if(isGroupFolioRoute()) return '../controllers/fetchgroupfolio'
    return '../controllers/fetchguestfolio'
}

function getOrganisationDisplayName(row = {}) {
    return String(
        row.companyname ||
        row.agencyname ||
        row.groupname ||
        row.name ||
        row.title ||
        ''
    ).trim()
}

function getOrganisationId(row = {}) {
    return String(row.id || row.organisationid || row.organizationid || '').trim()
}

async function initializeOrganisationFolioPicker() {
    const input = did('receiveablesorgname')
    const hidden = did('receiveablesorgid')
    const list = did('receiveablesorglist')
    if(!input || !hidden || !list) return

    const controller = getOrganisationPickerController()
    if(!controller) return
    const request = await httpRequest2(controller, null, null, 'json')
    orgFolioOptions = request?.status && Array.isArray(request.data) ? request.data : []
    list.innerHTML = orgFolioOptions
        .map((row) => {
            const id = getOrganisationId(row)
            const name = getOrganisationDisplayName(row)
            if(!id || !name) return ''
            return `<option value="${name.replace(/"/g, '&quot;')}">${id}</option>`
        })
        .join('')

    input.onchange = () => {
        const selected = orgFolioOptions.find((row) => getOrganisationDisplayName(row) === String(input.value || '').trim())
        hidden.value = selected ? getOrganisationId(selected) : ''
    }
}

function getSelectedOrganisationId() {
    const hidden = did('receiveablesorgid')
    const typed = did('receiveablesorgname')
    const selectedHidden = String(hidden?.value || '').trim()
    if(selectedHidden) return selectedHidden
    const typedName = String(typed?.value || '').trim()
    if(!typedName) return ''
    const selected = orgFolioOptions.find((row) => getOrganisationDisplayName(row) === typedName)
    return selected ? getOrganisationId(selected) : ''
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
          <span id="receivablesPickerStatus" class="text-xs opacity-70 ml-auto">Idle</span>
        </div>
        <div class="table-content"><table><thead><tr><th>ref</th><th>room</th><th>guest</th><th>phone</th><th>arrival</th><th>departure</th><th>action</th></tr></thead><tbody id="receivablesPickerRows"></tbody></table></div>
      </div>
    `
    did('receivablesRoomPickerModal').onclick = function(event){ if(event.target.id=='receivablesRoomPickerModal')this.classList.add('hidden') }
    const now = new Date()
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
    const monthEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()).padStart(2, '0')}`
    if(did('receivablesPickerStartDate') && !did('receivablesPickerStartDate').value) did('receivablesPickerStartDate').value = monthStart
    if(did('receivablesPickerEndDate') && !did('receivablesPickerEndDate').value) did('receivablesPickerEndDate').value = monthEnd
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
    setGuestFolioPickerStatus('Fetching...', 'neutral')
    const startdate = did('receivablesPickerStartDate')?.value || ''
    const enddate = did('receivablesPickerEndDate')?.value || ''
    const payload = new FormData()
    payload.append('startdate', startdate)
    payload.append('enddate', enddate)
    if(guestfolioPickerTab == 'checkedin'){
        const reqCheckin = await httpRequest2('../controllers/fetchallcheckins', payload, null, 'json')
        guestfolioPickerData.checkedin = reqCheckin.status ? normalizeReceivablesPickerRows(reqCheckin.data || []) : []
        if(reqCheckin?.status) setGuestFolioPickerStatus(`Loaded ${guestfolioPickerData.checkedin.length} record(s)`, 'ok')
        else setGuestFolioPickerStatus(reqCheckin?.message || 'Fetch failed', 'error')
    }else{
        const reqRes = await httpRequest2('../controllers/fetchreservationsbyfilter', payload, null, 'json')
        guestfolioPickerData.reservations = reqRes.status ? normalizeReceivablesPickerRows(reqRes.data || []) : []
        if(reqRes?.status) setGuestFolioPickerStatus(`Loaded ${guestfolioPickerData.reservations.length} record(s)`, 'ok')
        else setGuestFolioPickerStatus(reqRes?.message || 'Fetch failed', 'error')
    }
    renderReceivablesPickerRows()
}

function setGuestFolioPickerStatus(message='Idle', tone='neutral'){
    const el = did('receivablesPickerStatus')
    if(!el) return
    const toneClass = tone === 'ok' ? 'text-green-600' : tone === 'error' ? 'text-red-600' : 'text-slate-500'
    el.className = `text-xs ml-auto ${toneClass}`
    el.textContent = message
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
    const startdate = String(did('receiveablesstartdate')?.value || '').trim()
    const enddate = String(did('receiveablesenddate')?.value || '').trim()
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
            else if(isOrganisationFolioRoute()) paramstr.append('organisationid', normalizedRoomNumber)
            else paramstr.append('roomnumber', normalizedRoomNumber)
        }
        if(startdate) paramstr.append('startdate', startdate)
        if(enddate) paramstr.append('enddate', enddate)
        return paramstr
    }
    const fetchController = isGuestFolioRoute()
        ? '../controllers/fetchguestfolio'
        : isOrganisationFolioRoute()
            ? getOrganisationFolioFetchController()
            : '../controllers/fetchreceivablesbyrooms'
    const shouldSendParams = Boolean(
        id ||
        normalizedRoomNumber ||
        startdate ||
        enddate
    )
    let request = await httpRequest2(fetchController, shouldSendParams ? getparamm() : null, document.querySelector('#submitreceiveablesfilter'), 'json')
    if(!id)renderReceiveablesEmptyState()
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = isGuestFolioRoute()
                    ? normalizeGuestFolioRows(request.data)
                    : isOrganisationFolioRoute()
                        ? normalizeOrganisationFolioRows(request.data)
                        : request.data
                resolvePagination(datasource, onreceiveablesTableDataSignal)
                if(isGuestFolioRoute() || isOrganisationFolioRoute()) renderGuestFolioPrintTable()
            }else{
                renderReceiveablesEmptyState(isPayPendingCheckoutBillsRoute() ? 'No pending checkout bills were found for this room' : 'No records retrieved')
                if((isGuestFolioRoute() || isOrganisationFolioRoute()) && did('guestFolioPrintTableBody')) {
                    did('guestFolioPrintTableBody').innerHTML = `<div class="text-center opacity-70">No records found</div>`
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
    if(guestfolioGuestTomSelect && typeof guestfolioGuestTomSelect.clear === 'function') guestfolioGuestTomSelect.clear(true)
    if(did('receiveablesguestid'))did('receiveablesguestid').value = ''
    if(did('receiveablesorgname'))did('receiveablesorgname').value = ''
    if(did('receiveablesorgid'))did('receiveablesorgid').value = ''
    if(did('receiveablesstartdate'))did('receiveablesstartdate').value = ''
    if(did('receiveablesenddate'))did('receiveablesenddate').value = ''
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
                <td>${formatFolioAmountCell(item.debit)}</td>
                <td>${maskCreditDisplayIfNeeded(item.credit || 0, item.hasHiddenCredit)}</td>
                <td><p class="text-black font-semibold">${formatFolioAmountCell(runningBalance)}</p></td>
            </tr>`)
        }).join('')
        injectPaginatatedTable(rows || `<tr><td colspan="100%" class="text-center opacity-70">No records found</td></tr>`)
        return
    }
    if(guestfolioReceiveablesFiltered || isPayPendingCheckoutBillsRoute()){
        let rows = getSignaledDatasource().map((item, index) =>{
        const result = Number(item.debit || 0) - getReceivableCreditValueForBalance(item);
        const roomIdentifier = item.ownerid || item.roomnumber || '';
        const runningBalance = getReceivableRunningBalance(item.index ?? index);
        return(`
        <tr>
            <td>${formatReceivableTransactionDate(item.transactiondate)}</td>
            <td> ROOM ${roomIdentifier}</td>
            <td>${formatReceivableDescription(item.description)}</td>
            <td>${formatFolioAmountCell(item.debit)}</td>
            <td>${formatFolioAmountCell(item.credit)}</td>
            <td><p class="text-black font-semibold">${formatFolioAmountCell(runningBalance)}</p></td>
            <td><button onclick="openreceiveablemodalbyindex('${item.index ?? index}')" class="btn btn-sm btn-primary ${result > 0 ? '' : '!hidden'}">Pay Now</button></td>
        </tr>`)}
        )
        .join('')
        injectPaginatatedTable(rows)
        return
    }

    let rows = getSignaledDatasource().map((item, index) =>{
    const result = Number(item.debit || 0) - getReceivableCreditValueForBalance(item);
    const roomIdentifier = item.ownerid || item.roomnumber || '';
    const runningBalance = getReceivableRunningBalance(item.index ?? index);
    return(`
    <tr>
        <td>${item.index + 1 }</td>
        <td> ROOM ${roomIdentifier}</td>
        <td>${formatFolioAmountCell(item.debit)}</td>
        <td>${formatFolioAmountCell(item.credit)}</td>
        <td><p class="text-black font-semibold">${formatFolioAmountCell(runningBalance)}</p></td>
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
    const text = String(value).trim()
    if(!text) return ''

    // PM suffix is appended as "||| PM - room - guest"; keep base description in folio grids/prints.
    const base = text.split('|||')[0].trim()
    const parts = base.split('|').map(part => part.trim()).filter(Boolean)
    if(parts.length >= 3 && parts[1]) return parts[1]
    return base
}

function getReceivableRunningBalance(index){
    let balance = 0
    const lastIndex = Number(index)

    for(let i = 0; i <= lastIndex && i < datasource.length; i++){
        balance += Number(datasource[i].debit || 0)
        balance -= getReceivableCreditValueForBalance(datasource[i])
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
        else if(isOrganisationFolioRoute()) fetchreceiveables('', getSelectedOrganisationId())
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


