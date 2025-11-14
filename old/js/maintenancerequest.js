let maintenancerequestid
async function maintenancerequestActive() {
    const form = document.querySelector('#maintenancerequestform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', maintenancerequestFormSubmitHandler)
    datasource = []
    await putuservalue()
    if(sessionStorage.getItem('viewmaintenancerequestdata')){
        let x = sessionStorage.getItem('viewmaintenancerequestdata')
        sessionStorage.removeItem('viewmaintenancerequestdata')
        maintenancerequestid = x
        await fetchmaintenancerequest(x)
    }
}

function putuservalue(){
    if(sessionStorage.getItem('user')){
        let x = JSON.parse(sessionStorage.getItem('user'))
        if(document.getElementById('reportedby'))document.getElementById('reportedby').value = `${x.firstname} ${x.lastname} || ${x.id}`
    }
}

async function fetchmaintenancerequest(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchmaintenance', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onmaintenancerequestTableDataSignal)
            }
        }else{
             maintenancerequestid = request.data[0].id
            populateData(request.data[0])
                document.getElementById('reportedby').value = request.data[0].reportedbyname + ' || ' + request.data[0].reportedby
                document.getElementById('assignedto').value = request.data[0].assignedtoname + ' || ' + request.data[0].assignedto
        }
    }
    else return notification('No records retrieved')
}

async function removemaintenancerequest(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this maintenancerequest?");

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
    fetchmaintenancerequest()
    return notification(request.message);
    
}


async function onmaintenancerequestTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchmaintenancerequest('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removemaintenancerequest('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function maintenancerequestFormSubmitHandler() {
    if(!validateForm('maintenancerequestform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#maintenancerequestform'), maintenancerequestid ? [['id', maintenancerequestid],['complaintlodgedate', did('complaintlodgedate').value.split('T').join(' ').toString()+':00'],['completiondate', did('completiondate').value.split('T').join(' ').toString()+':00'],['reportedby', did('reportedby').value.split('||')[1].trim()],['assignedto', did('assignedto').value.split('||')[1].trim()]] : [['complaintlodgedate', did('complaintlodgedate').value.split('T').join(' ').toString()+':00'],['completiondate', did('completiondate').value.split('T').join(' ').toString()+':00'],['reportedby', did('reportedby').value.split('||')[1].trim()],['assignedto', did('assignedto').value.split('||')[1].trim()]])
    let request = await httpRequest2('../controllers/maintenancerequest', payload, document.querySelector('#maintenancerequestform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#maintenancerequestform').reset();
        // fetchmaintenancerequest();
        return
    }
    document.querySelector('#maintenancerequestform').reset();
    // fetchmaintenancerequest();
    return notification(request.message, 0);
}


// function runAdmaintenancerequestFormValidations() {
//     let form = document.getElementById('maintenancerequestform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#maintenancerequestname'))  controls.push([form.querySelector('#maintenancerequestname'), 'maintenancerequest name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }