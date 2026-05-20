async function reducestayActive() {
    notification('Loading...')
    const form = document.querySelector('#extendstayform')
    await checkinpopulatedl()
    buildReduceStayRefPickerModal()
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', e=>{
        if(!validateReduceStayDates())return
        checkinnFormSubmitHandler('extendstayform')
    })
    if(document.querySelector('#phone')) document.querySelector('#phone').addEventListener('change', e=>handlecheckinphone('phone')) 
    if(document.querySelector('#submitguestmodal')) document.querySelector('#submitguestmodal').addEventListener('click', e=>submitguestform())
    if(document.querySelector('#submitcompany'))document.querySelector('#submitcompany').addEventListener('click', companysubmithandle)
    if(document.querySelector('#submittravel'))document.querySelector('#submittravel').addEventListener('click', travelssubmithandle) 
    if(document.querySelector('#company'))document.querySelector('#company').addEventListener('change', e=>groupcompanyres()) 
    if(document.querySelector('#travelagent'))document.querySelector('#travelagent').addEventListener('change', e=>grouptravelagentres())  
    if(document.querySelector('#group_id'))document.querySelector('#group_id').addEventListener('change', e=>groupres()) 
    if(document.querySelector('#submitref')) document.querySelector('#submitref').addEventListener('click', fetchdataforreducestay)
    if(document.querySelector('#openReduceStayRefPicker')) document.querySelector('#openReduceStayRefPicker').addEventListener('click', openReduceStayRefPicker)
    if(document.querySelector('#room-type'))document.querySelector('#room-type').addEventListener('change', e=>{
        if(!actionid)return
        did('roomcategory-'+actionid).value = did('room-type').value 
        controlroomlist(actionid, 'roomcategory')   
    })  
    if(document.querySelector('#roomnumber'))document.querySelector('#roomnumber').addEventListener('click', e=>{
        if(document.querySelector('#roomnumber').getAttribute('readonly'))notification('Please Select a room category before you can select a room')
    }) 
    if(document.querySelector('#rummodalselectbtn'))document.querySelector('#rummodalselectbtn').addEventListener('click', e=>{
        if(did('room-no').value){  
            did('roomnumber').value = did('room-no').value
            did('roommodal').classList.add('hidden')
        }
    }) 
    datasource = []
    await fetchtravelsres()
    await fetchcompanyres()
    await fetchgroupsres()
    did('initialroombtn').click()
}

let reduceStayPickerRows = []

function buildReduceStayRefPickerModal() {
    if (did('reduceStayRefPickerModal')) return
    document.body.insertAdjacentHTML('beforeend', `
      <div id="reduceStayRefPickerModal" class="hidden fixed inset-0 z-[210] bg-[#00000052] p-4 overflow-auto flex items-center justify-center">
        <div class="max-w-5xl w-full bg-white rounded shadow p-4 max-h-[90vh] overflow-auto">
          <div class="flex justify-between items-center mb-3">
            <p class="font-semibold">Find Checked-In Reservation</p>
            <span class="material-symbols-outlined cp text-red-500" onclick="did('reduceStayRefPickerModal').classList.add('hidden')">close</span>
          </div>
          <div class="flex flex-wrap gap-2 mb-3 items-end">
            <input id="reduceStayRefPickerStartDate" type="date" class="form-control max-w-[190px]" oninput="reloadReduceStayRefPickerRows()">
            <input id="reduceStayRefPickerEndDate" type="date" class="form-control max-w-[190px]" oninput="reloadReduceStayRefPickerRows()">
            <button type="button" class="btn btn-sm" onclick="reloadReduceStayRefPickerRows()">Filter</button>
            <input id="reduceStayRefPickerSearch" class="form-control ml-auto max-w-sm" placeholder="Filter by ref, room, guest, phone, arrival, departure" oninput="renderReduceStayRefPickerRows()">
            <span id="reduceStayRefPickerStatus" class="text-xs opacity-70 ml-auto">Idle</span>
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
                  <th>action</th>
                </tr>
              </thead>
              <tbody id="reduceStayRefPickerRows"></tbody>
            </table>
          </div>
        </div>
      </div>
    `)
    did('reduceStayRefPickerModal').onclick = function(event){ if(event.target.id=='reduceStayRefPickerModal')this.classList.add('hidden') }
    const now = new Date()
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
    const monthEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()).padStart(2, '0')}`
    if(did('reduceStayRefPickerStartDate') && !did('reduceStayRefPickerStartDate').value) did('reduceStayRefPickerStartDate').value = monthStart
    if(did('reduceStayRefPickerEndDate') && !did('reduceStayRefPickerEndDate').value) did('reduceStayRefPickerEndDate').value = monthEnd
}

async function openReduceStayRefPicker() {
    did('reduceStayRefPickerModal').classList.remove('hidden')
    did('reduceStayRefPickerRows').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">Loading checked-ins...</td></tr>`
    await reloadReduceStayRefPickerRows()
}

function setReduceStayRefPickerStatus(message = 'Idle', tone = 'neutral'){
    const el = did('reduceStayRefPickerStatus')
    if(!el) return
    const toneClass = tone === 'ok' ? 'text-green-600' : tone === 'error' ? 'text-red-600' : 'text-slate-500'
    el.className = `text-xs ml-auto ${toneClass}`
    el.textContent = message
}

async function reloadReduceStayRefPickerRows(){
    setReduceStayRefPickerStatus('Fetching...', 'neutral')
    const payload = new FormData()
    payload.append('startdate', did('reduceStayRefPickerStartDate')?.value || '')
    payload.append('enddate', did('reduceStayRefPickerEndDate')?.value || '')
    const request = await httpRequest2('../controllers/fetchallcheckins', payload, null, 'json')
    reduceStayPickerRows = request?.status ? normalizeReduceStayPickerRows(request.data || []) : []
    if(request?.status) setReduceStayRefPickerStatus(`Loaded ${reduceStayPickerRows.length} record(s)`, 'ok')
    else setReduceStayRefPickerStatus(request?.message || 'Fetch failed', 'error')
    renderReduceStayRefPickerRows()
}

function normalizeReduceStayPickerRows(data = []) {
    return data.map(item => {
        const reservation = item.reservations || {}
        const roomRows = item.roomguestrow || item.roomgeustrow || []
        const rooms = roomRows.map(row => row.roomdata?.roomnumber).filter(Boolean).join(', ')
        const guests = roomRows.flatMap(row => [ ...(row.guest1 || []), ...(row.guest2 || []), ...(row.guest3 || []), ...(row.guest4 || []) ])
        const guestname = guests.map(g => `${g.firstname || ''} ${g.lastname || ''} ${g.othernames || ''}`.trim()).filter(Boolean).join(', ')
        const phone = guests.map(g => g.phone || '').filter(Boolean).join(', ')
        return {
            reference: reservation.reference || '',
            roomnumber: rooms,
            guestname,
            phone,
            arrivaldate: reservation.arrivaldate || '',
            departuredate: reservation.departuredate || ''
        }
    }).filter(row => row.reference)
}

function renderReduceStayRefPickerRows() {
    if(!did('reduceStayRefPickerRows')) return
    const rows = getFilteredReduceStayRefPickerRows()
    did('reduceStayRefPickerRows').innerHTML = rows.map((item, index) => `
      <tr>
        <td>${item.reference || '-'}</td>
        <td>${item.roomnumber || '-'}</td>
        <td>${item.guestname || '-'}</td>
        <td>${item.phone || '-'}</td>
        <td>${item.arrivaldate ? specialformatDateTime(item.arrivaldate) : '-'}</td>
        <td>${item.departuredate ? specialformatDateTime(item.departuredate) : '-'}</td>
        <td><button type="button" class="btn btn-sm bg-blue-500 text-white" onclick="useReduceStayRefPicker(${index})">Use</button></td>
      </tr>
    `).join('') || `<tr><td colspan="100%" class="text-center opacity-70">No checked-ins found</td></tr>`
}

function getDateOnlyFromDateTimeString(value = '') {
    return String(value || '').slice(0, 10)
}

function getFilteredReduceStayRefPickerRows() {
    const search = (did('reduceStayRefPickerSearch')?.value || '').toLowerCase().trim()
    const start = String(did('reduceStayRefPickerStartDate')?.value || '').trim()
    const end = String(did('reduceStayRefPickerEndDate')?.value || '').trim()
    return reduceStayPickerRows.filter(item => {
        const hay = `${item.reference} ${item.roomnumber} ${item.guestname} ${item.phone} ${item.arrivaldate} ${item.departuredate}`.toLowerCase()
        if(search && !hay.includes(search)) return false
        const arrivalDate = getDateOnlyFromDateTimeString(item.arrivaldate)
        if(start && arrivalDate && arrivalDate < start) return false
        if(end && arrivalDate && arrivalDate > end) return false
        return true
    })
}

async function useReduceStayRefPicker(index) {
    const filteredRows = getFilteredReduceStayRefPickerRows()
    const selected = filteredRows[index]
    if(!selected || !selected.reference)return notification('Could not load selected record', 0)
    if(did('reference')) did('reference').value = selected.reference
    did('reduceStayRefPickerModal').classList.add('hidden')
    await fetchdataforreducestay()
}

function normalizeDateTimeLocalValue(value = '') {
    if(!value)return ''
    return String(value).replace(' ', 'T').slice(0, 16)
}

function applyReduceStayDateBounds(arrivalValue = '', departureValue = '') {
    const departureInput = did('departuredate')
    if(!departureInput)return
    const normalizedArrival = normalizeDateTimeLocalValue(arrivalValue || '')
    const normalizedDeparture = normalizeDateTimeLocalValue(departureValue || '')
    departureInput.min = normalizedArrival || ''
    departureInput.max = normalizedDeparture || ''
}

function validateReduceStayDates() {
    const originalDeparture = did('originaldeparturedate')?.value || ''
    const arrivalValue = did('arrivaldate')?.value || ''
    const departureValue = did('departuredate')?.value || ''
    if(!originalDeparture){ notification('Please load a reservation before reducing the stay.', 0); return false }
    if(!arrivalValue || !departureValue){ notification('Please enter arrival and reduced departure dates.', 0); return false }

    const originalDate = new Date(normalizeDateTimeLocalValue(originalDeparture))
    const arrivalDate = new Date(arrivalValue)
    const newDepartureDate = new Date(departureValue)
    if(Number.isNaN(originalDate.getTime()) || Number.isNaN(arrivalDate.getTime()) || Number.isNaN(newDepartureDate.getTime())){ notification('Please enter valid stay dates.', 0); return false }
    if(newDepartureDate >= originalDate){ notification('Reduce Stay requires a departure date earlier than the current departure date.', 0); return false }
    if(newDepartureDate <= arrivalDate){ notification('Reduced departure date must be after the arrival date.', 0); return false }
    return true
}

async function fetchdataforreducestay(id) {
    did('mainform').classList.add('hidden')
    if(!did('reference').value)return notification('Please enter a valid reference number', 0)
    function getparamm(){ 
        let paramstr = new FormData()
        paramstr.append('reference', did('reference').value)
        return paramstr
    } 
    let request = await httpRequest2('../controllers/fetchreservationbyref', getparamm(), document.querySelector('#submitref'), 'json')
    if(request.status) {
        datasource = request.data
        const reservation = request.data[0]?.reservations || {}
        did('referencer').value = did('reference').value
        did('originaldeparturedate').value = normalizeDateTimeLocalValue(reservation.departuredate || '')
        did('mainform').classList.remove('hidden')
        await fetchcheckinn(reservation.id)

        const originalDeparture = normalizeDateTimeLocalValue(reservation.departuredate || did('departuredate').value)
        did('originaldeparturedate').value = originalDeparture
        if(did('departuredate')){
            applyReduceStayDateBounds(did('arrivaldate')?.value, originalDeparture)
            did('departuredate').addEventListener('change', validateReduceStayDates)
        }
        notification('Reservation loaded. Select an earlier departure date to reduce the stay.', 1)
    }
    else{
        did('reducestay').click()
        return notification(request.message, 0)
    }
}
