let expectedarrivalsid

const EXPECTED_ARRIVAL_COLUMNS = [
    { key: 'sn', label: 's/n', always: true },
    { key: 'action', label: 'action', always: true },
    { key: 'rooms', label: 'rooms' },
    { key: 'initialDeposit', label: 'initial deposit' },
    { key: 'guest', label: 'guest' },
    { key: 'nights', label: 'no. of nights' },
    { key: 'totalRate', label: 'total rate' },
    { key: 'reservationType', label: 'reservation type' },
    { key: 'arrivalDate', label: 'arrival date' },
    { key: 'departureDate', label: 'departure date' },
    { key: 'billingInfo', label: 'billing info' },
    { key: 'paymentMethod', label: 'payment method' },
    { key: 'reservationDate', label: 'reservation date' },
    { key: 'reference', label: 'reference' },
    { key: 'timeline', label: 'timeline' },
    { key: 'status', label: 'status' }
]

async function expectedarrivalsActive() {
    const form = did('expectedarrivalsform')
    const submitBtn = form?.querySelector('#submit')
    if(submitBtn) submitBtn.addEventListener('click', () => fetchexpectedarrivalss())
    datasource = []
    await fetchexpectedarrivalss()
}

function formatExpectedArrivalAmount(value = '') {
    const amount = Number(value || 0)
    if(!Number.isFinite(amount) || amount <= 0) return '-'
    return formatNumber(amount)
}

function normalizeExpectedArrivalRows(records = []) {
    return records.map((item, index) => {
        const reservation = item?.reservations || {}
        const bookingRows = Array.isArray(item?.roomgeustrow) ? item.roomgeustrow : (Array.isArray(item?.roomguestrow) ? item.roomguestrow : [])

        let guestCount = 0
        let totalRate = 0
        const roomNumbers = []

        bookingRows.forEach((row) => {
            const roomData = row?.roomdata || {}
            const roomNo = String(roomData.roomnumber || '').trim()
            if(roomNo) roomNumbers.push(roomNo)
            totalRate += Number(roomData.roomrate || 0)
            if(Array.isArray(row?.guest1) && row.guest1.length) guestCount += 1
            if(Array.isArray(row?.guest2) && row.guest2.length) guestCount += 1
            if(Array.isArray(row?.guest3) && row.guest3.length) guestCount += 1
            if(Array.isArray(row?.guest4) && row.guest4.length) guestCount += 1
        })

        const roomsDisplay = roomNumbers.length ? roomNumbers.join(', ') : `${bookingRows.length || 0} Room(s)`
        const status = String(reservation.status || '').trim()
        const normalizedStatus = status === 'OPEN' ? 'RESERVED' : status
        const actionHtml = reservation.id
            ? `<button title="View" onclick="openExpectedArrivalSummary('${reservation.id}')" class="material-symbols-outlined rounded-full bg-gray-100 h-8 w-8 text-green-500 drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>`
            : '-'

        return {
            sn: index + 1,
            action: actionHtml,
            rooms: roomsDisplay,
            initialDeposit: formatExpectedArrivalAmount(reservation.amountpaid),
            guest: guestCount ? `${guestCount} Guest(s)` : '-',
            nights: reservation.numberofnights ? `${formatNumber(reservation.numberofnights)} Night(s)` : '-',
            totalRate: formatNumber(totalRate),
            reservationType: reservation.reservationtype || '-',
            arrivalDate: reservation.arrivaldate ? formatDate(reservation.arrivaldate) : '-',
            departureDate: reservation.departuredate ? formatDate(reservation.departuredate) : '-',
            billingInfo: reservation.billinginfo || '-',
            paymentMethod: reservation.paymentmethod || '-',
            reservationDate: reservation.reservationdate ? formatDate(reservation.reservationdate) : '-',
            reference: reservation.reference || '-',
            timeline: reservation.timeline || '-',
            status: normalizedStatus || '-'
        }
    })
}

function expectedArrivalCellHasValue(value = '') {
    const text = String(value ?? '').replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').trim()
    return !!text && text !== '-' && text !== '--'
}

function getVisibleExpectedArrivalColumns(rows = []) {
    return EXPECTED_ARRIVAL_COLUMNS.filter((column) => {
        if(column.always) return true
        return rows.some((row) => expectedArrivalCellHasValue(row[column.key]))
    })
}

function renderExpectedArrivalsHeaders(columns = []) {
    const theadRow = document.querySelector('#tableer thead tr')
    if(!theadRow) return
    theadRow.innerHTML = columns.map((column) => `<th>${column.label}</th>`).join('')
}

async function fetchexpectedarrivalss() {
    const form = did('expectedarrivalsform')
    const submitBtn = form?.querySelector('#submit')
    const payload = new FormData(form)
    const request = await httpRequest2('../controllers/expectedarrivals', payload, submitBtn, 'json')
    did('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">Table is empty</td></tr>`

    if(!request || !request.status) return notification(request?.message || 'No records retrieved', 0)
    if(!Array.isArray(request.data) || !request.data.length) return notification(request.message || 'No records retrieved', 0)

    datasource = request.data
    resolvePagination(datasource, onexpectedarrivalsTableDataSignal)
}

async function onexpectedarrivalsTableDataSignal() {
    const sourceRows = getSignaledDatasource()
    const normalizedRows = normalizeExpectedArrivalRows(sourceRows)
    const columns = getVisibleExpectedArrivalColumns(normalizedRows)
    renderExpectedArrivalsHeaders(columns)

    const rows = normalizedRows.map((row) => `
        <tr>
            ${columns.map((column) => `<td>${row[column.key] ?? '-'}</td>`).join('')}
        </tr>
    `).join('')

    injectPaginatatedTable(rows || `<tr><td colspan="100%" class="text-center opacity-70">Table is empty</td></tr>`)
}

function openExpectedArrivalSummary(id = '') {
    const reservationId = String(id || '').trim()
    if(!reservationId) return
    const data = Array.isArray(datasource) ? datasource.find((item) => String(item?.reservations?.id || '') === reservationId) : null
    if(!data) return
    const reservation = data.reservations || {}
    const body = `
        <div class="max-w-2xl mx-auto bg-white rounded-md shadow p-4">
            <h3 class="text-lg font-semibold mb-3">Expected Arrival</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div><span class="font-semibold">Reference:</span> ${reservation.reference || '-'}</div>
                <div><span class="font-semibold">Status:</span> ${reservation.status === 'OPEN' ? 'RESERVED' : (reservation.status || '-')}</div>
                <div><span class="font-semibold">Arrival:</span> ${reservation.arrivaldate ? formatDate(reservation.arrivaldate) : '-'}</div>
                <div><span class="font-semibold">Departure:</span> ${reservation.departuredate ? formatDate(reservation.departuredate) : '-'}</div>
                <div><span class="font-semibold">Reservation Type:</span> ${reservation.reservationtype || '-'}</div>
                <div><span class="font-semibold">Payment Method:</span> ${reservation.paymentmethod || '-'}</div>
            </div>
            <div class="mt-4 text-right">
                <button type="button" class="btn" onclick="did('modalreceipt').classList.add('hidden')">Close</button>
            </div>
        </div>
    `
    did('modalreceipt').innerHTML = body
    did('modalreceipt').classList.remove('hidden')
}
