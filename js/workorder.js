let workorderid
async function workorderActive() {
    const form = document.querySelector('#workorderform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', workorderFormSubmitHandler)
    datasource = []
    await putusersvalue('requestedby')
    await populateWorkorderDepartments()
    await fetchworkorder()
}

async function populateWorkorderDepartments() {
    const datalist = did('hems_departmentlist')
    if(!datalist) return
    let request = await httpRequest2('../controllers/fetchdepartments', null, null, 'json')
    if(request?.status && Array.isArray(request.data)) {
        datalist.innerHTML = request.data.map(dep=>`<option>${dep.department} || ${dep.id}</option>`).join('')
    }
}

async function fetchworkorder(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchworkorder', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onworkorderTableDataSignal)
            }
        }else{
             workorderid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeworkorder(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this workorder?");

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
    fetchworkorder()
    return notification(request.message);
    
}


async function onworkorderTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.requestedbyname}</td>
        <td>${item.departmentname}</td>
        <td>${specialformatDateTime(item.entrydate)}</td>
        <td>${item.workneeded}</td>
        <td>${specialformatDateTime(item.dateneeded)}</td>
        <td>${item.roomnumber}</td>
        <td>${item.workstatus}</td>
        <td>${item.descriptionofstatus}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchworkorder('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeworkorder('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function workorderFormSubmitHandler() {
    if(!validateForm('workorderform', getIdFromCls('comp'))) return
    
    let payload

    const getSplitValue = (value) => {
        if(!value) return ''
        if(value.includes('||')) return value.split('||')[1].trim()
        return value.trim()
    }

    const formatDateTimeLocal = (value) => {
        if(!value) return value
        // Convert "YYYY-MM-DDTHH:MM" to "YYYY-MM-DD HH:MM:00" for backend consistency
        return value.replace('T', ' ') + (value.split(':').length === 2 ? ':00' : '')
    }

    const additional = [
        ['requestedby', getSplitValue(did('requestedby')?.value)],
        ['department', getSplitValue(did('department')?.value)],
        ['entrydate', formatDateTimeLocal(did('entrydate')?.value)],
        ['dateneeded', formatDateTimeLocal(did('dateneeded')?.value)]
    ]

    if(workorderid) additional.unshift(['id', workorderid])

    payload = getFormData2(document.querySelector('#workorderform'), additional)
    let request = await httpRequest2('../controllers/workorder', payload, document.querySelector('#workorderform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#workorderform').reset();
        fetchworkorder();
        return
    }
    document.querySelector('#workorderform').reset();
    fetchworkorder();
    return notification(request.message, 0);
}


// function runAdworkorderFormValidations() {
//     let form = document.getElementById('workorderform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#workordername'))  controls.push([form.querySelector('#workordername'), 'workorder name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
