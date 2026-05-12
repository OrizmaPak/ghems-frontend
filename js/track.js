let trackid
async function trackActive() {
    // const form = document.querySelector('#trackform')
    if(document.querySelector('#submit')) document.querySelector('#submit').addEventListener('click', fetchtrack)
    setupTrackRoomPicker()
    // if(document.querySelector('#submittrack')) document.querySelector('#submittrack').addEventListener('click', trackFormSubmitHandler)
    datasource = []
    // await fetchtrack()
}

let trackPickerData = { checkedin: [], reservations: [] }
let trackPickerTab = 'checkedin'
let trackPickerViewRows = []

function setupTrackRoomPicker(){
    const submitBtn = did('submit')
    if(!submitBtn)return
    if(!did('openTrackRoomPicker')) submitBtn.insertAdjacentHTML('afterend', `
        <button id="openTrackRoomPicker" type="button" class="w-full h-[40px] md:w-max bg-white text-sm capitalize text-blue-400 px-4 py-1 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-2">Find</button>
    `)
    submitBtn.parentElement.classList.add('gap-2')
    initTrackRoomPickerModal()
    did('openTrackRoomPicker').onclick = openTrackRoomPicker
}

function initTrackRoomPickerModal(){
    if(!did('trackRoomPickerModal')) document.body.insertAdjacentHTML('beforeend', `<div id="trackRoomPickerModal" class="hidden fixed inset-0 z-[210] bg-[#00000052] p-4 overflow-auto flex items-center justify-center"></div>`)
    did('trackRoomPickerModal').className = 'hidden fixed inset-0 z-[210] bg-[#00000052] p-4 overflow-auto flex items-center justify-center'
    did('trackRoomPickerModal').innerHTML = `
      <div class="max-w-5xl w-full bg-white rounded shadow p-4 max-h-[90vh] overflow-auto">
        <div class="flex justify-between items-center mb-3">
          <p class="font-semibold">Select Checked-In / Reservation</p>
          <span class="material-symbols-outlined cp text-red-500" onclick="did('trackRoomPickerModal').classList.add('hidden')">close</span>
        </div>
        <div class="flex flex-wrap gap-2 mb-3 items-end">
          <button type="button" id="trackPickerTabCheckedin" class="inline-block p-3 border-b-2 border-blue-500 text-blue-600 font-semibold" onclick="switchTrackPickerTab('checkedin')">All Checked In</button>
          <button type="button" id="trackPickerTabReservations" class="inline-block p-3 border-b-2 border-transparent text-gray-500 font-semibold" onclick="switchTrackPickerTab('reservations')">All Reservations</button>
          <div class="ml-auto grid grid-cols-1 md:grid-cols-3 gap-2 w-full md:w-auto">
            <input id="trackPickerStartDate" type="date" class="form-control">
            <input id="trackPickerEndDate" type="date" class="form-control">
            <button type="button" class="btn btn-sm" onclick="reloadTrackPickerTabData()">Filter</button>
          </div>
          <input id="trackPickerSearch" class="form-control ml-auto max-w-sm" placeholder="Filter room, guest, ref, phone" oninput="renderTrackPickerRows()">
        </div>
        <div class="table-content"><table><thead><tr><th>ref</th><th>room</th><th>guest</th><th>phone</th><th>arrival</th><th>departure</th><th>action</th></tr></thead><tbody id="trackPickerRows"></tbody></table></div>
      </div>
    `
    did('trackRoomPickerModal').onclick = function(event){ if(event.target.id=='trackRoomPickerModal')this.classList.add('hidden') }
    const year = new Date().getFullYear()
    if(did('trackPickerStartDate') && !did('trackPickerStartDate').value) did('trackPickerStartDate').value = `${year}-01-01`
    if(did('trackPickerEndDate') && !did('trackPickerEndDate').value) did('trackPickerEndDate').value = `${year + 1}-12-31`
}

async function openTrackRoomPicker(){
    did('trackRoomPickerModal').classList.remove('hidden')
    await reloadTrackPickerTabData()
    renderTrackPickerRows()
}

function switchTrackPickerTab(tab){
    trackPickerTab = tab
    did('trackPickerTabCheckedin').className = `inline-block p-3 border-b-2 font-semibold ${tab=='checkedin' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`
    did('trackPickerTabReservations').className = `inline-block p-3 border-b-2 font-semibold ${tab=='reservations' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`
    reloadTrackPickerTabData()
}

async function reloadTrackPickerTabData(){
    const startdate = did('trackPickerStartDate')?.value || ''
    const enddate = did('trackPickerEndDate')?.value || ''
    const payload = new FormData()
    payload.append('startdate', startdate)
    payload.append('enddate', enddate)
    if(trackPickerTab == 'checkedin'){
        const reqCheckin = await httpRequest2('../controllers/fetchallcheckins', payload, null, 'json')
        trackPickerData.checkedin = reqCheckin.status ? normalizeTrackPickerCheckins(reqCheckin.data || []) : []
    }else{
        const reqRes = await httpRequest2('../controllers/fetchreservationsbyfilter', payload, null, 'json')
        trackPickerData.reservations = reqRes.status ? normalizeTrackPickerReservations(reqRes.data || []) : []
    }
    renderTrackPickerRows()
}

function normalizeTrackPickerCheckins(data){
    return data.map(item => {
        const res = item.reservations || {}
        const rows = item.roomguestrow || item.roomgeustrow || []
        const rooms = rows.map(r => r.roomdata?.roomnumber).filter(Boolean).join(', ')
        const guests = rows.flatMap(r => [ ...(r.guest1 || []), ...(r.guest2 || []), ...(r.guest3 || []), ...(r.guest4 || []) ])
        const guestName = guests.map(g => `${g.firstname || ''} ${g.lastname || ''}`.trim()).filter(Boolean).join(', ')
        const phone = guests.map(g => g.phone || '').filter(Boolean).join(', ')
        return { reference: res.reference || '', roomnumber: rooms, guestname: guestName, phone, arrivaldate: res.arrivaldate || '', departuredate: res.departuredate || '' }
    }).filter(x => x.reference || x.roomnumber)
}

function normalizeTrackPickerReservations(data){
    return data.map(item => {
        const res = item.reservations || item
        const rows = item.roomguestrow || item.roomgeustrow || []
        const rooms = rows.map(r => r.roomdata?.roomnumber).filter(Boolean).join(', ')
        const guests = rows.flatMap(r => [ ...(r.guest1 || []), ...(r.guest2 || []), ...(r.guest3 || []), ...(r.guest4 || []) ])
        const guestName = guests.map(g => `${g.firstname || ''} ${g.lastname || ''}`.trim()).filter(Boolean).join(', ')
        const phone = guests.map(g => g.phone || '').filter(Boolean).join(', ')
        return { reference: res.reference || '', roomnumber: rooms, guestname: guestName, phone, arrivaldate: res.arrivaldate || '', departuredate: res.departuredate || '' }
    }).filter(x => x.reference || x.roomnumber)
}

function renderTrackPickerRows(){
    const search = (did('trackPickerSearch')?.value || '').toLowerCase().trim()
    const source = trackPickerTab == 'checkedin' ? trackPickerData.checkedin : trackPickerData.reservations
    const rows = source.filter(item => `${item.reference} ${item.roomnumber} ${item.guestname} ${item.phone}`.toLowerCase().includes(search))
    trackPickerViewRows = rows
    did('trackPickerRows').innerHTML = rows.map((item, idx) => `
        <tr>
            <td>${item.reference || '-'}</td><td>${item.roomnumber || '-'}</td><td>${item.guestname || '-'}</td><td>${item.phone || '-'}</td>
            <td>${item.arrivaldate ? specialformatDateTime(item.arrivaldate) : '-'}</td>
            <td>${item.departuredate ? specialformatDateTime(item.departuredate) : '-'}</td>
            <td><button type="button" class="btn btn-sm bg-blue-500 text-white" onclick='useTrackRoomPicker(${idx})'>Use</button></td>
        </tr>
    `).join('') || `<tr><td colspan="100%" class="text-center opacity-70">No records found</td></tr>`
}

function useTrackRoomPicker(rowIndex){
    const item = trackPickerViewRows[rowIndex]
    if(!item)return
    const room = (item.roomnumber || '').split(',')[0].trim()
    if(did('roomnumber'))did('roomnumber').value = room
    did('trackRoomPickerModal').classList.add('hidden')
    fetchtrack()
}

async function fetchtrack() {
    // notification('Loading...')
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('roomnumber', did('roomnumber').value)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchreservationbyroomtrack', getparamm(), did('submit'), 'json')
    did('tabledata').innerHTML = ``
    if(request.status) {
        datasource = request.data
        const roomNumber = String(did('roomnumber').value || '').trim()
        const toNumber = (value) => {
            const numeric = Number(value || 0)
            return Number.isFinite(numeric) ? numeric : 0
        }

        let totalDue = 0
        let rowsMarkup = ''

        for (let i = 0; i < request.data.length; i++) {
            const reservation = request.data[i]?.reservations || {}
            const roomguestrow = Array.isArray(request.data[i]?.roomguestrow) ? request.data[i].roomguestrow : []
            const posdata = Array.isArray(request.data[i]?.posdata) ? request.data[i].posdata : []
            const allRooms = roomguestrow.map(dat => dat?.roomdata?.roomnumber).filter(Boolean).join(", ")

            for (let j = 0; j < roomguestrow.length; j++) {
                const roomdata = roomguestrow[j]?.roomdata || {}
                if (String(roomdata.roomnumber || '').trim() !== roomNumber) continue

                const planAmount = toNumber(roomdata.planamount)
                const planDiscountAmount = toNumber(roomdata.plandiscountamount)
                const roomRate = toNumber(roomdata.roomrate)
                const discountAmount = toNumber(roomdata.discountamount)
                const rowTotal = roomRate

                totalDue += rowTotal
                rowsMarkup += `
                    <tr>
                        <td class="s/n"></td>
                        <td>${reservation.reference || '-'}</td>
                        <td>${allRooms || '-'}</td>
                        <td>${reservation.arrivaldate ? specialformatDateTime(reservation.arrivaldate) : '-'}</td>
                        <td>${formatNumber(roomRate)}</td>
                        <td>${formatNumber(discountAmount)}</td>
                        <td>${formatNumber(planAmount)}</td>
                        <td>${formatNumber(planDiscountAmount)}</td>
                        <td>${formatNumber(rowTotal)}</td>
                    </tr>
                `
            }

            for (let k = 0; k < posdata.length; k++) {
                const pos = posdata[k] || {}
                if (String(pos.ownerid || '').trim() !== roomNumber) continue

                const debit = toNumber(pos.debit)
                const credit = toNumber(pos.credit)
                const rowTotal = debit - credit
                totalDue += rowTotal

                rowsMarkup += `
                    <tr>
                        <td class="s/n"></td>
                        <td>${pos.reference || reservation.reference || '-'}</td>
                        <td>${roomNumber}</td>
                        <td>${pos.transactiondate ? specialformatDateTime(pos.transactiondate) : '-'}</td>
                        <td>${formatNumber(debit)}</td>
                        <td>${formatNumber(credit)}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>${formatNumber(rowTotal)}</td>
                    </tr>
                `
            }
        }

        did('tabledata').innerHTML = rowsMarkup || `<tr><td colspan="100%" class="text-center opacity-70">No records retrieved</td></tr>`
        if(rowsMarkup){
            runCount()
            did('tabledata').innerHTML += `
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>Total</td>
                    <td>${formatNumber(totalDue)}</td>
                </tr>
            `
        }
        if(did('totaldue')) did('totaldue').value = totalDue
        // did('trackno').value = did('reference').value
        // did('resdate').setAttribute('value', specialformatDateTime(request.data[0].reservations.reservationdate))
        // did('arrdate').setAttribute('value', specialformatDateTime(request.data[0].reservations.arrivaldate))
        // did('depedate').setAttribute('value', specialformatDateTime(request.data[0].reservations.departuredate))
        // did('pmethod').setAttribute('value', request.data[0].reservations.paymentmethod)
        // did('trackdate').setAttribute('value', gettoddaayyddaayye())
        // did('comppname').innerHTML = did('your_companyname').value
        // did('compinfo').innerHTML = `
        //                                     <div class="text-gray-700">${did('your_companyphone').value}</div>
        //                                     <div class="text-gray-700 mb-2">${did('your_companyaddress').value}</div>
        //                                     <div class="text-gray-700 mb-2">${did('your_companyemail').value}</div>
        // `
    }
    else return notification(request.message)
}

function gettoddaayyddaayye() {
    const now = new Date();
    
    // Get date components
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = now.getFullYear();
    
    // Get time components
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // Format date and time
    const formattedDate = `'${day}'-'${month}'-'${year}'`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    
    return `${formattedDate} ${formattedTime}`;
}




async function removetrack(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this track?");

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
    fetchtrack()
    return notification(request.message);
    
}


async function ontrackTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchtrack('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removetrack('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function trackFormSubmitHandler() {
    // if(!validateForm('trackform', getIdFromCls('comp'))) return
    if(!did('amountpaid').value)return notification('Please enter amount paid...', 0)
    if(!did('reference').value)return notification('Please enter reference...', 0)

    function payload(){
        let p = new FormData();
        p.append('reference', did('reference').value)
        p.append('paymentmethod', did('paymentmethod').value)
        p.append('totaldue', did('totaldue').value)
        p.append('amountpaid', did('amountpaid').value)
        // p.append('distribute', did('distribute').checked ? 'YES' : 'NO')
        p.append('distribute', 'NO')
        return p
    }
    let request = await httpRequest2('../controllers/track', payload(), document.querySelector('#submittrack'))
    if(request.status) {
        notification(request.message, 1);
        did('modalreceipt').classList.remove('hidden')
        // document.querySelector('#track').click();
        return
    }
    // document.querySelector('#track').click();
    return notification(request.message, 0);
}


// function runAdtrackFormValidations() {
//     let form = document.getElementById('trackform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#trackname'))  controls.push([form.querySelector('#trackname'), 'track name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
