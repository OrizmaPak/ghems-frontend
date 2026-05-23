let expectedcheckoutsid

async function expectedcheckoutsActive() {
    const form = did('expectedcheckoutsform')
    const submitBtn = form?.querySelector('#submit')
    if(submitBtn) submitBtn.addEventListener('click', () => fetchexpectedcheckoutss())
    datasource = []
    await fetchexpectedcheckoutss()
}

function normalizeExpectedCheckoutRows(records = []) {
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
        const statusRaw = String(reservation.status || '').trim()
        const normalizedStatus = statusRaw === 'OPEN' ? 'RESERVED' : statusRaw
        const actionHtml = reservation.id
            ? `<button title="View" onclick="openExpectedCheckoutSummary('${String(reservation.id).replace(/'/g, "\\'")}')" class="material-symbols-outlined rounded-full bg-gray-100 h-8 w-8 text-green-500 drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>`
            : '-'

        return {
            sn: index + 1,
            action: actionHtml,
            rooms: roomsDisplay,
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

async function fetchexpectedcheckoutss() {
    const form = did('expectedcheckoutsform')
    const submitBtn = form?.querySelector('#submit')
    const payload = new FormData()
    payload.append('departuredate', did('departuredateert')?.value || '')

    const request = await httpRequest2('../controllers/expectedcheckouts', payload, submitBtn, 'json')
    did('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">Table is empty</td></tr>`

    if(!request || !request.status) return notification(request?.message || 'No records retrieved', 0)
    if(!Array.isArray(request.data) || !request.data.length) return notification(request.message || 'No records retrieved', 0)

    datasource = request.data
    resolvePagination(datasource, onexpectedcheckoutsTableDataSignal)
}

async function onexpectedcheckoutsTableDataSignal() {
    const sourceRows = getSignaledDatasource()
    const rowsData = normalizeExpectedCheckoutRows(sourceRows)
    const rows = rowsData.map((row) => `
        <tr>
            <td>${row.sn}</td>
            <td>${row.action}</td>
            <td>${row.rooms}</td>
            <td>${row.guest}</td>
            <td>${row.nights}</td>
            <td>${row.totalRate}</td>
            <td>${row.reservationType}</td>
            <td>${row.arrivalDate}</td>
            <td>${row.departureDate}</td>
            <td>${row.billingInfo}</td>
            <td>${row.paymentMethod}</td>
            <td>${row.reservationDate}</td>
            <td>${row.reference}</td>
            <td>${row.timeline}</td>
            <td>${row.status}</td>
        </tr>
    `).join('')

    injectPaginatatedTable(rows || `<tr><td colspan="100%" class="text-center opacity-70">Table is empty</td></tr>`)
}

function openExpectedCheckoutSummary(id = '') {
    const reservationId = String(id || '').trim()
    if(!reservationId) return
    const data = Array.isArray(datasource) ? datasource.find((item) => String(item?.reservations?.id || '') === reservationId) : null
    if(!data) return
    const reservation = data.reservations || {}
    const body = `
        <div class="max-w-2xl mx-auto bg-white rounded-md shadow p-4">
            <h3 class="text-lg font-semibold mb-3">Expected Departure</h3>
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
