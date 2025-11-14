let createchecklistforcleaningid
async function createchecklistforcleaningActive() {
    const form = document.querySelector('#createchecklistforcleaningform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', createchecklistforcleaningFormSubmitHandler)
    datasource = []
    await fetchcreatechecklistforcleaning()
}

async function fetchcreatechecklistforcleaning(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchchecklistitems', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, oncreatechecklistforcleaningTableDataSignal)
            }
        }else{
             createchecklistforcleaningid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removecreatechecklistforcleaning(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this createchecklistforcleaning?");

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
    fetchcreatechecklistforcleaning()
    return notification(request.message);
    
}


async function oncreatechecklistforcleaningTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.item}</td>
        <td>${item.roomtype}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchcreatechecklistforcleaning('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removecreatechecklistforcleaning('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function createchecklistforcleaningFormSubmitHandler() {
    if(!validateForm('createchecklistforcleaningform', [`roomtype`, `item`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#createchecklistforcleaningform'), createchecklistforcleaningid ? [['id', createchecklistforcleaningid]] : null)
    let request = await httpRequest2('../controllers/cleaningchecklistitems', payload, document.querySelector('#createchecklistforcleaningform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#createchecklistforcleaningform').reset();
        fetchcreatechecklistforcleaning();
        return
    }
    document.querySelector('#createchecklistforcleaningform').reset();
    fetchcreatechecklistforcleaning();
    return notification(request.message, 0);
}


// function runAdcreatechecklistforcleaningFormValidations() {
//     let form = document.getElementById('createchecklistforcleaningform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#createchecklistforcleaningname'))  controls.push([form.querySelector('#createchecklistforcleaningname'), 'createchecklistforcleaning name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }