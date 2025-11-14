let warehousestorageid
async function warehousestorageActive() {
    const form = document.querySelector('#warehousestorageform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', warehousestorageFormSubmitHandler)
    datasource = []
    await fetchwarehousestorage()
}

async function fetchwarehousestorage(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchlocation', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onwarehousestorageTableDataSignal)
            }
        }else{
             warehousestorageid = id
            populateData(request.data.filter(data=>data.id==id)[0])
        }
    }
    else return notification('No records retrieved')
}

async function removewarehousestorage(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this warehousestorage?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removelocation', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchwarehousestorage()
    return notification(request.message);
    
}


async function onwarehousestorageTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.location}</td>
        <td>${item.state}</td>
        <td>${item.locationtype}</td>
        <td>${item.description}</td>
        <td>${item.address}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchwarehousestorage('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removewarehousestorage('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function warehousestorageFormSubmitHandler() {
    if(!validateForm('warehousestorageform', [`location`, `state`, 'locationtype', 'description', 'address'])) return
    
    let payload

    payload = getFormData2(document.querySelector('#warehousestorageform'), warehousestorageid ? [['id', warehousestorageid]] : null)
    let request = await httpRequest2('../controllers/locationscript', payload, document.querySelector('#warehousestorageform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#warehousestorageform').reset();
        fetchwarehousestorage();
        warehousestorageid =''
        return
    }
    document.querySelector('#warehousestorageform').reset();
    fetchwarehousestorage();
    return notification(request.message, 0);
}


// function runAdwarehousestorageFormValidations() {
//     let form = document.getElementById('warehousestorageform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#warehousestoragename'))  controls.push([form.querySelector('#warehousestoragename'), 'warehousestorage name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }