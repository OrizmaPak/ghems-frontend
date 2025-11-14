let trackid
async function trackActive() {
    // const form = document.querySelector('#trackform')
    if(document.querySelector('#submit')) document.querySelector('#submit').addEventListener('click', fetchtrack)
    // if(document.querySelector('#submittrack')) document.querySelector('#submittrack').addEventListener('click', trackFormSubmitHandler)
    datasource = []
    // await fetchtrack()
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
    document.getElementById('tabledata').innerHTML = ``
    if(request.status) {
        datasource = request.data
        // S/N	REF	ROOMS	ARRIVAL DATE	RATE	DISCOUNT	PLAN AMOUNT	PLAN DISCOUNT	AMOUNT
        let tt = 0
        let pp = 0
    //     did('tabledata').innerHTML = datasource.map((item, i)=>{
    // if(item.roomguestrow.map(dat=>dat.roomdata.roomnumber) == did('roomnumber').value)tt = tt+(Number(item.roomguestrow.roomdata.planamount)-Number(item.roomguestrow.roomdata.plandiscountamount))+(Number(item.roomguestrow.roomdata.roomrate)-Number(item.roomguestrow.roomdata.discountamount))
    //     if(item.roomguestrow.roomdata.roomnumber == did('roomnumber').value)return`
            // <tr>
            //     <td>${i+1}</td>
            //     <td>${formatNumber(item.reservations.reference)}</td>
            //     <td>${request.data.map(dat=>dat.roomguestrow.map(data=>data.roomdata.roomnumber)).join('')}</td>
            //     <td>${specialformatDateTime(item.reservations.arrivaldate)}</td>
            //     <td>${formatNumber(item.roomguestrow.roomdata.roomrate)}</td>
            //     <td>${formatNumber(item.roomguestrow.roomdata.discountamount)}</td>
            //     <td>${formatNumber(item.roomguestrow.roomdata.planamount)}</td>
            //     <td>${formatNumber(item.roomguestrow.roomdata.plandiscountamount)}</td>
            //     <td>${formatNumber((Number(item.roomguestrow.roomdata.planamount)-Number(item.roomguestrow.roomdata.plandiscountamount))+(Number(item.roomguestrow.roomdata.roomrate)-Number(item.roomguestrow.roomdata.discountamount)))}</td>
            // </tr>
    //     `}).join('')
//   let tt = 0;

for (let i = 0; i < request.data.length; i++) {
    let reservation = request.data[i].reservations;
    let roomguestrow = request.data[i].roomguestrow;

    for (let j = 0; j < roomguestrow.length; j++) {
        let roomdata = roomguestrow[j].roomdata;

        if (roomdata.roomnumber == did('roomnumber').value) {
            let planAmount = Number(roomdata.planamount);
            let planDiscountAmount = Number(roomdata.plandiscountamount);
            let roomRate = Number(roomdata.roomrate);
            let discountAmount = Number(roomdata.discountamount);

            tt += (roomRate - discountAmount);

            did('tabledata').innerHTML += `
                <tr>
                    <td class="s/n"></td>
                    <td>${reservation.reference}</td>
                    <td>${roomguestrow.map(dat => dat.roomdata.roomnumber).join(", ")}</td>
                    <td>${specialformatDateTime(reservation.arrivaldate)}</td>
                    <td>${formatNumber(roomRate)}</td>
                    <td>${formatNumber(discountAmount)}</td>
                    <td>${formatNumber(planAmount)}</td>
                    <td>${formatNumber(planDiscountAmount)}</td>
                    <td>${formatNumber((roomRate - discountAmount))}</td>
                </tr>
            `;
        }
    }
}
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
                <td>${formatNumber(tt)}</td>
            </tr>
        `
        did('totaldue').value = tt
        did('tabledata2').innerHTML = datasource.map((item, i)=>{
        pp = pp+((Number(item.roomdata.planamount)-Number(item.roomdata.plandiscountamount))+(Number(item.roomdata.roomrate)-Number(item.roomdata.discountamount)))
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
                <td>${formatNumber((Number(item.roomdata.planamount)-Number(item.roomdata.plandiscountamount))+(Number(item.roomdata.roomrate)-Number(item.roomdata.discountamount)))}</td>
            </tr>
        `}).join('')
        // did('tabledata2').innerHTML += `
        //     <tr>
        //         <td></td>
        //         <td></td>
        //         <td></td>
        //         <td></td>
        //         <td></td>
        //         <td></td>
        //         <td></td>
        //         <td>Total</td>
        //         <td>${formatNumber(pp)}</td>
        //     </tr>
        // `
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