let viewmaintenancerequestid
async function viewmaintenancerequestActive() {
    const form = document.querySelector('#viewmaintenancerequestform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', viewmaintenancerequestFormSubmitHandler)
    datasource = []
    await fetchviewmaintenancerequest()
}

async function fetchviewmaintenancerequest(id) {
    if(id){
        sessionStorage.setItem('viewmaintenancerequestdata', id)
        did('maintenancerequest').click()
    }
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchmaintenancebyfilters', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onviewmaintenancerequestTableDataSignal)
            }
        }else{
             viewmaintenancerequestid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeviewmaintenancerequest(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this viewmaintenancerequest?");

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
    fetchviewmaintenancerequest()
    return notification(request.message);
    
}


async function onviewmaintenancerequestTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.roomnumber}</td>
        <td>${item.natureofcomplaint}</td>
        <td>${specialformatDateTime(item.complaintlodgedate)}</td>
        <td>${item.assignedtoname}</td>
        <td>${item.reportedbyname}</td>
        <td>${specialformatDateTime(item.completiondate)}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchviewmaintenancerequest('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeviewmaintenancerequest('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function viewmaintenancerequestFormSubmitHandler() {
    if(!validateForm('viewmaintenancerequestform', [`reportedby`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#viewmaintenancerequestform'), viewmaintenancerequestid ? [['id', viewmaintenancerequestid],['reportedby', did('reportedby').value.split('||')[1].trim()],['startdate', did('startdate').value.split('T').join(' ').toString()+':00'],['enddate', did('enddate').value.split('T').join(' ').toString()+':00']] : [['reportedby', did('reportedby').value.split('||')[1].trim()],['startdate', did('startdate').value.split('T').join(' ').toString()+':00'],['enddate', did('enddate').value.split('T').join(' ').toString()+':00']])
    let request = await httpRequest2('../controllers/fetchmaintenancebyfilters', payload, document.querySelector('#viewmaintenancerequestform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#viewmaintenancerequestform').reset();
        fetchviewmaintenancerequest();
        return
    }
    document.querySelector('#viewmaintenancerequestform').reset();
    fetchviewmaintenancerequest();
    return notification(request.message, 0);
}


// function runAdviewmaintenancerequestFormValidations() {
//     let form = document.getElementById('viewmaintenancerequestform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#viewmaintenancerequestname'))  controls.push([form.querySelector('#viewmaintenancerequestname'), 'viewmaintenancerequest name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }