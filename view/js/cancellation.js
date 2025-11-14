let cancellationid
async function cancellationActive() {
    // const form = document.querySelector('#cancellationform')
    // if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', cancellationFormSubmitHandler)
    datasource = []
    // await fetchcancellation()
    await fetchcancellationview()
}

async function fetchcancellationview(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('searchtext', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchcancelledreservations', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, oncancellationTableDataSignal)
            }
        }else{
            // runoptioner(document.getElementsByClassName('updater')[0])
            //  cancellationid = request.data.chechindata.id
            // populateData(request.data.chechindata)
            // populateData(request.data.guestdata)
            // populateData(request.data.reservationdata)
            document.getElementById('amountpaidoncancellation').value = 0
            document.getElementById('amountrefundedoncancellation').value = 0
            document.getElementsByName('balancedis')[0].value = request.balance
            did('balancedis').innerHTML = formatCurrency(document.getElementsByName('balancedis')[0].value)
        }
    }
    else return notification('No records retrieved')
}

async function fetchguestreceivable(id, date='') {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('reservationid', id)
        if(date)paramstr.append('departuredate', date)
        return paramstr
    }
    let request
    if(!id)request = await httpRequest2('../controllers/occupancylist', id ? getparamm() : null, null, 'json')
    if(id)request = await httpRequest2('../controllers/fetchguestreceivable', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                // datasource = request.data
                // resolvePagination(datasource, oncancellationTableDataSignal)
                
            }
        }else{
            // runoptioner(document.getElementsByClassName('updater')[0])
            //  cancellationid = request.data.chechindata.id
            // populateData(request.data.chechindata)
            // populateData(request.data.guestdata)
            // populateData(request.data.reservationdata)
            document.getElementById('amountpaidoncancellation').value = 0
            document.getElementById('amountrefundedoncancellation').value = 0
            document.getElementsByName('balancedis')[0].value = request.balance
            did('balancedis').innerHTML = formatCurrency(document.getElementsByName('balancedis')[0].value)
        }
    }
    else return notification('No records retrieved')
}

async function fetchcancellation(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request
    if(!id)request = await httpRequest2('../controllers/occupancylist', id ? getparamm() : null, null, 'json')
    if(id)request = await httpRequest2('../controllers/fetchcheckinbyid', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                // datasource = request.data
                // resolvePagination(datasource, oncancellationTableDataSignal)
                document.getElementById('tabledatar').innerHTML = request.data.map((item, index) => `
    <tr>
        <td>${index + 1 }</td>
        <td>${item.guests.firstname} ${item.guests.lastname} ${item.guests.othernames}</td>
        <td>${item.guests.nationality}</td>
        <td>${formatNumber(item.reservations.numberofnights)}</td>
        <td>${item.reservations.roomcategoryname}</td>
        <td>${formatDate(item.reservations.arrivaldate)}</td>
        <td>${formatDate(item.reservations.departuredate)}</td>
        <td>${formatDate(item.reservations.reservationdate)}</td>
        <td>${item.reservations.status}</td>
    </tr> `
    )
    .join('')
            }
        }else{
            runoptioner(document.getElementsByClassName('updater')[0])
             cancellationid = request.data.chechindata.id
            populateData(request.data.chechindata)
            populateData(request.data.guestdata)
            populateData(request.data.reservationdata)
            did('paiddis').innerHTML = formatCurrency(request.data.chechindata.amountpaid)
            did('amountdis').innerHTML = formatCurrency(document.getElementById('totalamount').value)
            if(id)fetchguestreceivable(request.data.reservationdata.id)
        }
    }
    else return notification('No records retrieved')
}

async function removecancellation(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this cancellation?");

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
    fetchcancellation()
    return notification(request.message);
    
}


// <button title="Edit row entry" onclick="handlecheckinphone('id','${item.checkin.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>

async function oncancellationTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1 }</td>
        <td>
            <div class="w-full h-full flex items-center justify-center gap-4">
                <button title="Check out" onclick="fetchcancellation('${item.checkin.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">exit_to_app</button>
            </div>
        </td>
        <td>${item.guests.firstname} ${item.guests.lastname} ${item.guests.othernames}</td>
        <td>${item.guests.nationality}</td>
        <td>${formatNumber(item.reservations.numberofnights)}</td>
        <td>${item.reservations.roomcategoryname}</td>
        <td>${formatDate(item.reservations.arrivaldate)}</td>
        <td>${formatDate(item.reservations.departuredate)}</td>
        <td>${formatDate(item.reservations.reservationdate)}</td>
        <td>${item.reservations.status}</td>
    </tr> `
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function cancellationFormSubmitHandler() {
    if(!validateForm('cancellationform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#cancellationform'), cancellationid ? [
        ['id', cancellationid],
        ['arrivaldate', document.getElementById('arrivaldate').value.replace('T', ' ')],
        ['departuredate', document.getElementById('departuredate').value.replace('T', ' ')],
        ] : [
                ['arrivaldate', document.getElementById('arrivaldate').value.replace('T', ' ')],
                ['departuredate', document.getElementById('departuredate').value.replace('T', ' ')],
            ])
    let request = await httpRequest2('../controllers/cancellation', payload, document.querySelector('#cancellationform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#cancellationform').reset();
        fetchcancellation();
        return
    }
    document.querySelector('#cancellationform').reset();
    fetchcancellation();
    return notification(request.message, 0);
}


// function runAdcancellationFormValidations() {
//     let form = document.getElementById('cancellationform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#cancellationname'))  controls.push([form.querySelector('#cancellationname'), 'cancellation name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }