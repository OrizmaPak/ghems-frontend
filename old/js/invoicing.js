let invoicingid
async function invoicingActive() {
    // const form = document.querySelector('#invoicingform')
    if(document.querySelector('#submit')) document.querySelector('#submit').addEventListener('click', fetchinvoicing)
    if(document.querySelector('#submitinvoice')) document.querySelector('#submitinvoice').addEventListener('click', invoicingFormSubmitHandler)
    if(document.querySelector('#paymentmethod')) document.querySelector('#paymentmethod').addEventListener('click', checkotherbankdetails)
    datasource = []
    // await fetchinvoicing()
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
        datasource = request.data[0].roomguestrow
        // S/N	ROOM	RATE	DISCOUNT	TOTAL RATE	PLAN AMOUNT	PLAN DISCOUNT	PLAN TOTAL	AMOUNT
        let tt = 0
        let pp = 0
        did('tabledata').innerHTML = datasource.map((item, i)=>{
        tt = tt+(Number(item.roomdata.planamount)-Number(item.roomdata.plandiscountamount))+(Number(item.roomdata.roomrate)-Number(item.roomdata.discountamount))
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
                <td>${formatNumber(Number(item.roomdata.roomrate)-Number(item.roomdata.discountamount))}</td>
            </tr>
        `}).join('')
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
        did('tabledata2').innerHTML = datasource.map((item, i)=>{
        pp = pp+((Number(item.roomdata.roomrate)-Number(item.roomdata.discountamount)))
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
                <td>${formatNumber((Number(item.roomdata.roomrate)-Number(item.roomdata.discountamount)))}</td>
            </tr>
        `}).join('')
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