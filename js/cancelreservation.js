async function cancelreservationActive() {
    notification('Loading...')
    // markallcomp()
    const form = document.querySelector('#cancelreservationform')
    await checkinpopulatedl()
    await populateReceivingBankSelects()
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', e=>checkinnFormSubmitHandler('cancelreservationform'))
    if(document.querySelector('#phone')) document.querySelector('#phone').addEventListener('change', e=>handlecheckinphone('phone')) 
    if(document.querySelector('#submitguestmodal')) document.querySelector('#submitguestmodal').addEventListener('click', e=>submitguestform())
    if(document.querySelector('#submitcompany'))document.querySelector('#submitcompany').addEventListener('click', companysubmithandle)
    if(document.querySelector('#submittravel'))document.querySelector('#submittravel').addEventListener('click', travelssubmithandle) 
    if(document.querySelector('#company'))document.querySelector('#company').addEventListener('change', e=>groupcompanyres()) 
    if(document.querySelector('#company'))document.querySelector('#company').addEventListener('change', e=>groupcompanyres()) 
    if(document.querySelector('#travelagent'))document.querySelector('#travelagent').addEventListener('change', e=>grouptravelagentres())  
    if(document.querySelector('#group_id'))document.querySelector('#group_id').addEventListener('change', e=>groupres()) 
    // if(document.querySelector('#roomcategory'))document.querySelector('#roomcategory').addEventListener('change', e=>controlroomlist('roomcategory')) 
    if(document.querySelector('#submitref')) document.querySelector('#submitref').addEventListener('click', fetchdataforcancelreservation)
    if(document.querySelector('#openCancelReservationRefPicker')) document.querySelector('#openCancelReservationRefPicker').addEventListener('click', openCancelReservationRefPicker)
    if(document.querySelector('#paymentmethod')) document.querySelector('#paymentmethod').addEventListener('click', e=>checkotherbankdetails('comp22'))
    if(document.querySelector('#room-type'))document.querySelector('#room-type').addEventListener('change', e=>{
        if(!actionid)return
        did('roomcategory-'+actionid).value = did('room-type').value 
        controlroomlist(actionid, 'roomcategory')   
    })  
    // if(document.querySelector('#plandiscountperc'))document.querySelector('#plandiscountperc').addEventListener('change', e=>checkplandiscount()) 
    if(document.querySelector('#roomnumber'))document.querySelector('#roomnumber').addEventListener('click', e=>{
        if(document.querySelector('#roomnumber').getAttribute('readonly'))notification('Please Select a room category before you can select a room')
    }) 
    if(document.querySelector('#rummodalselectbtn'))document.querySelector('#rummodalselectbtn').addEventListener('click', e=>{
        if(did('room-no').value){  
            did('roomnumber').value = did('room-no').value
            did('roommodal').classList.add('hidden')
        }
    }) 
    // if(document.querySelector('#discountcoupon'))document.querySelector('#discountcoupon').addEventListener('change', e=>runcouponcalculations()) 
    datasource = []
    await fetchcheckinn('', '', 'cancelreservationformfilter') 
    await fetchtravelsres()
    await fetchcompanyres()
    await fetchgroupsres()
    did('initialroombtn').click()
    cancelcheckreservation();
}
// every functions can be found in the index.js checkin.js and oreutil.js

let cancelReservationPickerRows = []

function buildCancelReservationRefPickerModal() {
    if (did('cancelReservationRefPickerModal')) return
    document.body.insertAdjacentHTML('beforeend', `
      <div id="cancelReservationRefPickerModal" class="hidden fixed inset-0 z-[210] bg-[#00000052] p-4 overflow-auto flex items-center justify-center">
        <div class="max-w-5xl w-full bg-white rounded shadow p-4 max-h-[90vh] overflow-auto">
          <div class="flex justify-between items-center mb-3">
            <p class="font-semibold">Find Reservation To Cancel</p>
            <span class="material-symbols-outlined cp text-red-500" onclick="did('cancelReservationRefPickerModal').classList.add('hidden')">close</span>
          </div>
          <div class="flex flex-wrap gap-2 mb-3 items-end">
            <input id="cancelReservationRefPickerStartDate" type="date" class="form-control max-w-[190px]" oninput="reloadCancelReservationRefPickerRows()">
            <input id="cancelReservationRefPickerEndDate" type="date" class="form-control max-w-[190px]" oninput="reloadCancelReservationRefPickerRows()">
            <button type="button" class="btn btn-sm" onclick="reloadCancelReservationRefPickerRows()">Filter</button>
            <input id="cancelReservationRefPickerSearch" class="form-control ml-auto max-w-sm" placeholder="Filter by ref, room, guest, phone, arrival, departure" oninput="renderCancelReservationRefPickerRows()">
            <span id="cancelReservationRefPickerStatus" class="text-xs opacity-70 ml-auto">Idle</span>
          </div>
          <div class="table-content">
            <table>
              <thead>
                <tr>
                  <th>reference</th>
                  <th>room</th>
                  <th>guest</th>
                  <th>phone</th>
                  <th>arrival</th>
                  <th>departure</th>
                  <th>status</th>
                  <th>action</th>
                </tr>
              </thead>
              <tbody id="cancelReservationRefPickerRows"></tbody>
            </table>
          </div>
        </div>
      </div>
    `)
    did('cancelReservationRefPickerModal').onclick = function(event){ if(event.target.id=='cancelReservationRefPickerModal')this.classList.add('hidden') }
    const now = new Date()
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
    const monthEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()).padStart(2, '0')}`
    if(did('cancelReservationRefPickerStartDate') && !did('cancelReservationRefPickerStartDate').value) did('cancelReservationRefPickerStartDate').value = monthStart
    if(did('cancelReservationRefPickerEndDate') && !did('cancelReservationRefPickerEndDate').value) did('cancelReservationRefPickerEndDate').value = monthEnd
}

function normalizeCancelReservationPickerRows(data = []) {
    return data.map(item => {
        const reservation = item.reservations || {}
        const roomRows = item.roomguestrow || item.roomgeustrow || []
        const guests = roomRows.flatMap(row => [ ...(row.guest1 || []), ...(row.guest2 || []), ...(row.guest3 || []), ...(row.guest4 || []) ])
        return {
            reference: reservation.reference || '',
            status: reservation.status || '',
            roomnumber: roomRows.map(row => row.roomdata?.roomnumber).filter(Boolean).join(', '),
            guestname: guests.map(g => `${g.firstname || ''} ${g.lastname || ''} ${g.othernames || ''}`.trim()).filter(Boolean).join(', '),
            phone: guests.map(g => g.phone || '').filter(Boolean).join(', '),
            arrivaldate: reservation.arrivaldate || '',
            departuredate: reservation.departuredate || ''
        }
    }).filter(row => row.reference && ['OPEN', 'RESERVED'].includes(String(row.status || '').toUpperCase()))
}

async function openCancelReservationRefPicker() {
    buildCancelReservationRefPickerModal()
    did('cancelReservationRefPickerModal').classList.remove('hidden')
    did('cancelReservationRefPickerRows').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">Loading reservations...</td></tr>`
    await reloadCancelReservationRefPickerRows()
}

function setCancelReservationRefPickerStatus(message = 'Idle', tone = 'neutral'){
    const el = did('cancelReservationRefPickerStatus')
    if(!el) return
    const toneClass = tone === 'ok' ? 'text-green-600' : tone === 'error' ? 'text-red-600' : 'text-slate-500'
    el.className = `text-xs ml-auto ${toneClass}`
    el.textContent = message
}

async function reloadCancelReservationRefPickerRows(){
    setCancelReservationRefPickerStatus('Fetching...', 'neutral')
    const payload = new FormData()
    payload.append('startdate', did('cancelReservationRefPickerStartDate')?.value || '')
    payload.append('enddate', did('cancelReservationRefPickerEndDate')?.value || '')
    const request = await httpRequest2('../controllers/fetchreservationsbyfilter', payload, null, 'json')
    cancelReservationPickerRows = request?.status ? normalizeCancelReservationPickerRows(request.data || []) : []
    if(request?.status) setCancelReservationRefPickerStatus(`Loaded ${cancelReservationPickerRows.length} record(s)`, 'ok')
    else setCancelReservationRefPickerStatus(request?.message || 'Fetch failed', 'error')
    renderCancelReservationRefPickerRows()
}

function getFilteredCancelReservationPickerRows() {
    const search = (did('cancelReservationRefPickerSearch')?.value || '').toLowerCase().trim()
    const start = String(did('cancelReservationRefPickerStartDate')?.value || '').trim()
    const end = String(did('cancelReservationRefPickerEndDate')?.value || '').trim()
    return cancelReservationPickerRows.filter(item => `${item.reference} ${item.roomnumber} ${item.guestname} ${item.phone} ${item.arrivaldate} ${item.departuredate} ${item.status}`.toLowerCase().includes(search))
    .filter(item => {
        const arrivalDate = String(item.arrivaldate || '').slice(0, 10)
        if(start && arrivalDate && arrivalDate < start) return false
        if(end && arrivalDate && arrivalDate > end) return false
        return true
    })
}

function renderCancelReservationRefPickerRows() {
    if(!did('cancelReservationRefPickerRows')) return
    const rows = getFilteredCancelReservationPickerRows()
    did('cancelReservationRefPickerRows').innerHTML = rows.map((item, index) => `
      <tr>
        <td>${item.reference || '-'}</td>
        <td>${item.roomnumber || '-'}</td>
        <td>${item.guestname || '-'}</td>
        <td>${item.phone || '-'}</td>
        <td>${item.arrivaldate ? specialformatDateTime(item.arrivaldate) : '-'}</td>
        <td>${item.departuredate ? specialformatDateTime(item.departuredate) : '-'}</td>
        <td>${item.status || '-'}</td>
        <td><button type="button" class="btn btn-sm bg-blue-500 text-white" onclick="useCancelReservationRefPicker(${index})">Use</button></td>
      </tr>
    `).join('') || `<tr><td colspan="100%" class="text-center opacity-70">No cancellable reservations found</td></tr>`
}

async function useCancelReservationRefPicker(index) {
    const selected = getFilteredCancelReservationPickerRows()[index]
    if(!selected || !selected.reference)return notification('Could not load selected record', 0)
    if(did('reference')) did('reference').value = selected.reference
    did('cancelReservationRefPickerModal').classList.add('hidden')
    await fetchdataforcancelreservation()
}

function cancelcheckreservation(){
    if(sessionStorage.getItem('cancelreservation')){
        did('reference').value = sessionStorage.getItem('cancelreservation');
        sessionStorage.removeItem('cancelreservation')
        did('submitref').click()
    }
}

async function fetchdataforcancelreservation(id) {
  // Hide the main form
  did('mainform').classList.add('hidden');

  // Validate if reference is provided
  if (!did('reference').value) {
    return notification('Please enter a valid reference number', 0);
  }

  // Prepare the request parameters
  function getParam() {
    const formData = new FormData();
    formData.append('reference', did('reference').value);
    return formData;
  }

  // Make an HTTP request to fetch reservation data
  const request = await httpRequest2(
    '../controllers/fetchreservationbyref',
    getParam(),
    document.querySelector('#submitref'),
    'json'
  );

  // Handle the response
  if (request.status) {
    const reservation = request.data[0].reservations;

    // Update UI based on the response
    datasource = request.data;
    did('referencer').value = did('reference').value;
    did('mainform').classList.add('hidden');

    // Check reservation status
    if (reservation.status !== 'RESERVED' && reservation.status !== 'OPEN') {
      did('reference').value = '';
      return notification(`The guest has already ${reservation.status}`, 0);
    }

    did('mainform').classList.remove('hidden');
    checksessionstorage(reservation.id);

    // Handle further UI updates or data rendering here if needed
  } else {
    did('invoicing').click();
    return notification(request.message, 0);
  }
}

