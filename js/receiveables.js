let receiveablesid
let receiveablesFiltered = false
let receiveablesPageMode = 'receiveables'
const receivablesPaymentController = '../controllers/receipts'

function isPayPendingCheckoutBillsRoute(){
    return receiveablesPageMode === 'paypendingcheckoutbills' || getCurrentRouteName() === 'paypendingcheckoutbills'
}

function renderReceiveablesEmptyState(message='No records retrieved'){
    const tabledata = document.getElementById('tabledata')
    if(!tabledata)return
    tabledata.innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">${message}</td></tr>`
}

async function receiveablesActive(mode='receiveables') {
    receiveablesPageMode = mode
    // const form = document.querySelector('#receiveablesform')
    // if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', receiveablesFormSubmitHandler)
    if(document.querySelector('#submitreceiveablesfilter')) document.querySelector('#submitreceiveablesfilter').addEventListener('click', () => fetchreceiveables('', did('receiveablesroomnumber').value))
    if(document.querySelector('#resetreceiveablesfilter')) document.querySelector('#resetreceiveablesfilter').addEventListener('click', resetreceiveablesfilter)
    datasource = []
    receiveablesFiltered = false
    setreceiveablesTableHeader()
    if(isPayPendingCheckoutBillsRoute()){
        renderReceiveablesEmptyState('Enter a room number to load pending checkout bills')
        return
    }
    await fetchreceiveables()
}

async function fetchreceiveables(id='', roomnumber='') {
    const normalizedRoomNumber = String(roomnumber || '').trim()
    if(isPayPendingCheckoutBillsRoute() && !id && !normalizedRoomNumber){
        receiveablesFiltered = false
        setreceiveablesTableHeader()
        renderReceiveablesEmptyState('Enter a room number to load pending checkout bills')
        return notification('Please enter a room number', 0)
    }

    receiveablesFiltered = Boolean(normalizedRoomNumber)
    setreceiveablesTableHeader()
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        if(id)paramstr.append('id', id)
        if(normalizedRoomNumber)paramstr.append('roomnumber', normalizedRoomNumber)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchreceivablesbyrooms', (id || normalizedRoomNumber) ? getparamm() : null, document.querySelector('#submitreceiveablesfilter'), 'json')
    if(!id)renderReceiveablesEmptyState()
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onreceiveablesTableDataSignal)
            }else{
                renderReceiveablesEmptyState(isPayPendingCheckoutBillsRoute() ? 'No pending checkout bills were found for this room' : 'No records retrieved')
            }
        }else{
             receiveablesid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

function resetreceiveablesfilter(){
    if(did('receiveablesroomnumber'))did('receiveablesroomnumber').value = ''
    if(isPayPendingCheckoutBillsRoute()){
        datasource = []
        receiveablesFiltered = false
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
    if(receiveablesFiltered || isPayPendingCheckoutBillsRoute()){
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
            <td><button onclick="openreceiveablemodal('${item.debit}','${item.credit}','${roomIdentifier}','${item.currency || 'NGN'}')" class="btn btn-sm btn-primary ${result > 0 ? '' : '!hidden'}">Pay Now</button></td>
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
        <td><button onclick="openreceiveablemodal('${item.debit}','${item.credit}','${roomIdentifier}','${item.currency || 'NGN'}')" class="btn btn-sm btn-primary ${result > 0 ? '' : '!hidden'}">Pay Now</button></td>
    </tr>`)}
    )
    .join('')
    injectPaginatatedTable(rows)
}

function setreceiveablesTableHeader(){
    const tableHead = document.getElementById('receiveables-table-head')
    if(!tableHead)return
    const useDetailedHeader = receiveablesFiltered || isPayPendingCheckoutBillsRoute()

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
    const request = await httpRequest2(receivablesPaymentController, payload, submitBtn)
    if(request.status){
        notification('Payment received successfully', 1)
        did('modalreceipt').classList.add('hidden')
        fetchreceiveables('', did('receiveablesroomnumber')?.value || '')
        return
    }

    return notification(request.message || 'Payment failed', 0)
}

async function receiveablesFormSubmitHandler() {
    if(!validateForm('receiveablesform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#receiveablesform'), receiveablesid ? [['id', receiveablesid]] : null)
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
