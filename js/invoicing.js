let invoicingid
async function invoicingActive() {
    // const form = document.querySelector('#invoicingform')
    if(document.querySelector('#submit')) document.querySelector('#submit').addEventListener('click', fetchinvoicing)
    if(document.querySelector('#submitinvoice')) document.querySelector('#submitinvoice').addEventListener('click', invoicingFormSubmitHandler)
    if(document.querySelector('#paymentmethod')) document.querySelector('#paymentmethod').addEventListener('click', checkotherbankdetails)
    if(document.querySelector('#paymentmethod')) document.querySelector('#paymentmethod').addEventListener('change', checkotherbankdetails)
    setupInvoicingReferencePicker()
    datasource = []
    // await fetchinvoicing()
}

let invoicingPickerData = { checkedin: [], reservations: [] }
let invoicingPickerTab = 'checkedin'
let invoicingPickerViewRows = []

function setupInvoicingReferencePicker(){
    const submitBtn = did('submit')
    if(!submitBtn)return
    if(!did('openInvoicingReferencePicker')) submitBtn.insertAdjacentHTML('afterend', `
        <button id="openInvoicingReferencePicker" type="button" class="w-full h-[40px] md:w-max bg-white text-sm capitalize text-blue-400 px-4 py-1 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-2">Find</button>
    `)
    submitBtn.parentElement.classList.add('gap-2')
    buildInvoicingPickerModal()
    did('openInvoicingReferencePicker').onclick = openInvoicingReferencePicker
}

function buildInvoicingPickerModal(){
    if(!did('invoicingReferencePickerModal')) document.body.insertAdjacentHTML('beforeend', `<div id="invoicingReferencePickerModal" class="hidden fixed inset-0 z-[210] bg-[#00000052] p-4 overflow-auto flex items-center justify-center"></div>`)
    did('invoicingReferencePickerModal').className = 'hidden fixed inset-0 z-[210] bg-[#00000052] p-4 overflow-auto flex items-center justify-center'
    did('invoicingReferencePickerModal').innerHTML = `
      <div class="max-w-5xl w-full bg-white rounded shadow p-4 max-h-[90vh] overflow-auto">
        <div class="flex justify-between items-center mb-3">
          <p class="font-semibold">Select Checked-In / Reservation</p>
          <span class="material-symbols-outlined cp text-red-500" onclick="did('invoicingReferencePickerModal').classList.add('hidden')">close</span>
        </div>
        <div class="flex flex-wrap gap-2 mb-3 items-end">
          <button type="button" id="invoicingPickerTabCheckedin" class="inline-block p-3 border-b-2 border-blue-500 text-blue-600 font-semibold" onclick="switchInvoicingPickerTab('checkedin')">All Checked In</button>
          <button type="button" id="invoicingPickerTabReservations" class="inline-block p-3 border-b-2 border-transparent text-gray-500 font-semibold" onclick="switchInvoicingPickerTab('reservations')">All Reservations</button>
          <div class="ml-auto grid grid-cols-1 md:grid-cols-3 gap-2 w-full md:w-auto">
            <input id="invoicingPickerStartDate" type="date" class="form-control">
            <input id="invoicingPickerEndDate" type="date" class="form-control">
            <button type="button" class="btn btn-sm" onclick="reloadInvoicingPickerTabData()">Filter</button>
          </div>
          <input id="invoicingPickerSearch" class="form-control ml-auto max-w-sm" placeholder="Filter room, guest, ref, phone" oninput="renderInvoicingPickerRows()">
          <span id="invoicingPickerStatus" class="text-xs opacity-70 ml-auto">Idle</span>
        </div>
        <div class="table-content"><table><thead><tr><th>ref</th><th>room</th><th>guest</th><th>phone</th><th>arrival</th><th>departure</th><th>action</th></tr></thead><tbody id="invoicingPickerRows"></tbody></table></div>
      </div>
    `
    did('invoicingReferencePickerModal').onclick = function(event){ if(event.target.id=='invoicingReferencePickerModal')this.classList.add('hidden') }
    const now = new Date()
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
    const monthEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()).padStart(2, '0')}`
    if(did('invoicingPickerStartDate') && !did('invoicingPickerStartDate').value) did('invoicingPickerStartDate').value = monthStart
    if(did('invoicingPickerEndDate') && !did('invoicingPickerEndDate').value) did('invoicingPickerEndDate').value = monthEnd
}

async function openInvoicingReferencePicker(){
    did('invoicingReferencePickerModal').classList.remove('hidden')
    await reloadInvoicingPickerTabData()
    renderInvoicingPickerRows()
}

function switchInvoicingPickerTab(tab){
    invoicingPickerTab = tab
    did('invoicingPickerTabCheckedin').className = `inline-block p-3 border-b-2 font-semibold ${tab=='checkedin' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`
    did('invoicingPickerTabReservations').className = `inline-block p-3 border-b-2 font-semibold ${tab=='reservations' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`
    reloadInvoicingPickerTabData()
}

async function reloadInvoicingPickerTabData(){
    setInvoicingPickerStatus('Fetching...', 'neutral')
    const startdate = did('invoicingPickerStartDate')?.value || ''
    const enddate = did('invoicingPickerEndDate')?.value || ''
    const payload = new FormData()
    payload.append('startdate', startdate)
    payload.append('enddate', enddate)
    if(invoicingPickerTab == 'checkedin'){
        const reqCheckin = await httpRequest2('../controllers/fetchallcheckins', payload, null, 'json')
        invoicingPickerData.checkedin = reqCheckin.status ? normalizeInvoicingPickerRows(reqCheckin.data || []) : []
        if(reqCheckin?.status) setInvoicingPickerStatus(`Loaded ${invoicingPickerData.checkedin.length} record(s)`, 'ok')
        else setInvoicingPickerStatus(reqCheckin?.message || 'Fetch failed', 'error')
    }else{
        const reqRes = await httpRequest2('../controllers/fetchreservationsbyfilter', payload, null, 'json')
        invoicingPickerData.reservations = reqRes.status ? normalizeInvoicingPickerRows(reqRes.data || []) : []
        if(reqRes?.status) setInvoicingPickerStatus(`Loaded ${invoicingPickerData.reservations.length} record(s)`, 'ok')
        else setInvoicingPickerStatus(reqRes?.message || 'Fetch failed', 'error')
    }
    renderInvoicingPickerRows()
}

function setInvoicingPickerStatus(message='Idle', tone='neutral'){
    const el = did('invoicingPickerStatus')
    if(!el) return
    const toneClass = tone === 'ok' ? 'text-green-600' : tone === 'error' ? 'text-red-600' : 'text-slate-500'
    el.className = `text-xs ml-auto ${toneClass}`
    el.textContent = message
}

function normalizeInvoicingPickerRows(data){
    return data.map(item => {
        const res = item.reservations || item
        const rows = item.roomguestrow || item.roomgeustrow || []
        const rooms = rows.map(r => r.roomdata?.roomnumber).filter(Boolean).join(', ')
        const guests = rows.flatMap(r => [ ...(r.guest1 || []), ...(r.guest2 || []), ...(r.guest3 || []), ...(r.guest4 || []) ])
        const guestname = guests.map(g => `${g.firstname || ''} ${g.lastname || ''}`.trim()).filter(Boolean).join(', ')
        const phone = guests.map(g => g.phone || '').filter(Boolean).join(', ')
        return { reference: res.reference || '', roomnumber: rooms, guestname, phone, arrivaldate: res.arrivaldate || '', departuredate: res.departuredate || '' }
    }).filter(x => x.reference)
}

function renderInvoicingPickerRows(){
    const search = (did('invoicingPickerSearch')?.value || '').toLowerCase().trim()
    const source = invoicingPickerTab == 'checkedin' ? invoicingPickerData.checkedin : invoicingPickerData.reservations
    const rows = source.filter(item => `${item.reference} ${item.roomnumber} ${item.guestname} ${item.phone}`.toLowerCase().includes(search))
    invoicingPickerViewRows = rows
    did('invoicingPickerRows').innerHTML = rows.map((item, idx) => `
        <tr>
            <td>${item.reference || '-'}</td><td>${item.roomnumber || '-'}</td><td>${item.guestname || '-'}</td><td>${item.phone || '-'}</td>
            <td>${item.arrivaldate ? specialformatDateTime(item.arrivaldate) : '-'}</td>
            <td>${item.departuredate ? specialformatDateTime(item.departuredate) : '-'}</td>
            <td><button type="button" class="btn btn-sm bg-blue-500 text-white" onclick='useInvoicingReferencePicker(${idx})'>Use</button></td>
        </tr>
    `).join('') || `<tr><td colspan="100%" class="text-center opacity-70">No records found</td></tr>`
}

function useInvoicingReferencePicker(rowIndex){
    const item = invoicingPickerViewRows[rowIndex]
    if(!item)return
    if(did('reference'))did('reference').value = item.reference
    did('invoicingReferencePickerModal').classList.add('hidden')
    fetchinvoicing()
}

async function fetchinvoicing() {
    notification('Loading...')
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('reference', did('reference').value)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchreservationbyref', getparamm(), null, 'json')
    document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        const payload = request.data?.[0] || {}
        const roomRows = Array.isArray(payload.roomguestrow) ? payload.roomguestrow : []
        const posRows = Array.isArray(payload.posdata) ? payload.posdata : []
        datasource = roomRows
        // S/N	ROOM	RATE	DISCOUNT	TOTAL RATE	PLAN AMOUNT	PLAN DISCOUNT	PLAN TOTAL	AMOUNT
        let tt = 0
        let pp = 0
        const roomMarkup = roomRows.map((item, i)=>{
        // Invoicing total due is rate-only (no plan addition).
        const roomRate = Number(item.roomdata.roomrate || 0)
        const discountAmount = Number(item.roomdata.discountamount || 0)
        const planAmount = Number(item.roomdata.planamount || 0)
        const planDiscount = Number(item.roomdata.plandiscountamount || 0)
        tt += roomRate
        return`
            <tr>
                <td>${i+1}</td>
                <td>${item.roomdata.roomnumber}</td>
                <td>${formatNumber(roomRate)}</td>
                <td>${formatNumber(discountAmount)}</td>
                <td>${formatNumber(roomRate-discountAmount)}</td>
                <td>${formatNumber(planAmount)}</td>
                <td>${formatNumber(planDiscount)}</td>
                <td>${formatNumber(planAmount-planDiscount)}</td>
                <td>${formatNumber(roomRate)}</td>
            </tr>
        `}).join('')
        const posMarkup = posRows.map((item, i)=>{
            const debit = Number(item.debit || 0)
            const credit = Number(item.credit || 0)
            const amount = debit - credit
            tt += amount
            return `
            <tr>
                <td>${roomRows.length + i + 1}</td>
                <td>${item.ownerid || '-'}</td>
                <td>${formatNumber(debit)}</td>
                <td>${formatNumber(credit)}</td>
                <td>${formatNumber(amount)}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>${formatNumber(amount)}</td>
            </tr>
            `
        }).join('')
        did('tabledata').innerHTML = roomMarkup + posMarkup
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
                <td>${formatNumber(tt)}</td>
            </tr>
        `
        did('totaldue').value = tt
        did('tabledata2').innerHTML = roomRows.map((item, i)=>{
        pp = pp+Number(item.roomdata.roomrate || 0)
        return`
            <tr>
                <td>${i+1}</td>
                <td>${item.roomdata.roomnumber}</td>
                <td>${formatNumber(item.roomdata.roomrate)}</td>
                <td>${formatNumber(item.roomdata.discountamount)}</td>
                <td>${Number(item.roomdata.roomrate)-Number(item.roomdata.discountamount)}</td>
                <td>${formatNumber(item.roomdata.planamount)}</td>
                <td>${formatNumber(item.roomdata.plandiscountamount)}</td>
                <td>${formatNumber(Number(item.roomdata.planamount)-Number(item.roomdata.plandiscountamount))}</td>
                <td>${formatNumber(Number(item.roomdata.roomrate))}</td>
            </tr>
        `}).join('')
        did('tabledata2').innerHTML += posRows.map((item, i)=>{
            const debit = Number(item.debit || 0)
            const credit = Number(item.credit || 0)
            const amount = debit - credit
            pp += amount
            return `
            <tr>
                <td>${roomRows.length + i + 1}</td>
                <td>${item.ownerid || '-'}</td>
                <td>${formatNumber(debit)}</td>
                <td>${formatNumber(credit)}</td>
                <td>${formatNumber(amount)}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>${formatNumber(amount)}</td>
            </tr>
            `
        }).join('')
        did('tabledata2').innerHTML += `
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>Total</td>
                <td>${formatNumber(pp)}</td>
            </tr>
        `
        did('invoiceno').value = did('reference').value
        console.log('document.getElemenvalue', document.getElementById('amountpaid').value)
        document.getElementById('invoiceamountpaid').value = formatNumber(document.getElementById('invoiceamountpaid').value)
        did('resdate').setAttribute('value', specialformatDateTime(request.data[0].reservations.reservationdate))
        did('arrdate').setAttribute('value', specialformatDateTime(request.data[0].reservations.arrivaldate))
        did('depedate').setAttribute('value', specialformatDateTime(request.data[0].reservations.departuredate))
        did('pmethod').setAttribute('value', request.data[0].reservations.paymentmethod)
        did('comppname').innerHTML = did('your_companyname').value
        did('compinfo').innerHTML = `
                                            <div class="text-gray-700">${did('your_companyphone').value}</div>
                                            <div class="text-gray-700 mb-2">${did('your_companyaddress').value}</div>
                                            <div class="text-gray-700 mb-2">${did('your_companyemail').value}</div>
        `
        did('invoicedate').setAttribute('value', gettoddaayyddaayye())
        
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
    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    
    return `${formattedDate} ${formattedTime}`;
}




async function removeinvoicing(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this invoicing?");

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
    fetchinvoicing()
    return notification(request.message);
    
}


async function oninvoicingTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchinvoicing('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeinvoicing('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function invoicingFormSubmitHandler() {
    if(!validateForm('invoicingform', getIdFromCls('comp'))) return
    if(!validatePaymentMethodForAmount()) return
    if(!did('amountpaid').value)return notification('Please enter amount paid...', 0)
    if(!did('reference').value)return notification('Please enter reference...', 0)
    if(document.getElementById('bankname')){
        if(!document.getElementById('bankname').value)return notification('Please enter bank name')
    }
    if(document.getElementById('otherdetails')){
        if(!document.getElementById('otherdetails').value)return notification('Please other details of the transaction')
    }

    function payload(){
        let p = new FormData();
        p.append('reference', did('reference').value)
        p.append('paymentmethod', did('paymentmethod').value)
        p.append('totaldue', did('totaldue').value)
        p.append('amountpaid', did('amountpaid').value)
        p.append('distribute', did('distribute').checked ? 'YES' : 'NO')
        if(document.getElementById('bankname'))p.append('bankname', did('bankname').value)
        if(document.getElementById('otherdetails'))p.append('otherdetails', did('otherdetails').value)
        appendReceivingBankMoreData(p)
        // p.append('distribute', 'NO')
        return p
    }
    let request = await httpRequest2('../controllers/invoicing', payload(), document.querySelector('#submitinvoice'))
    if(request.status) {
        notification(request.message, 1);
        did('modalreceipt').classList.remove('hidden')
        // document.querySelector('#invoicing').click();
        return
    }
    // document.querySelector('#invoicing').click();
    return notification(request.message, 0);
}


// function runAdinvoicingFormValidations() {
//     let form = document.getElementById('invoicingform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#invoicingname'))  controls.push([form.querySelector('#invoicingname'), 'invoicing name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
