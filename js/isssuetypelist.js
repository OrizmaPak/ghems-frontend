let issuetypelistid
async function issuetypelistActive() {
    const form = document.querySelector('#issuetypelistform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', issuetypelistFormSubmitHandler)
    datasource = []
    await fetchissuetypelist()
}

async function fetchissuetypelist(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr 
    }
    let request = await httpRequest2('../controllers/fetchissuetypelists', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onissuetypelistTableDataSignal)
            }
        }else{
             issuetypelistid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeissuetypelist(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this issuetypelist?");

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
    fetchissuetypelist()
    return notification(request.message);
    
}


async function onissuetypelistTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.issuetypelist}</td>
        <td class="flex items-center gap-3 ${item.issuetypelist == default_issuetypelist ? 'hidden' : ''}">
            <button title="Edit row entry" onclick="fetchissuetypelist('${item.id}')" class="material-symbols-outlined ${item.issuetypelist == default_issuetypelist ? 'hidden' : ''} rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeissuetypelist('${item.id}')" class="material-symbols-outlined ${item.issuetypelist == default_issuetypelist ? 'hidden' : ''} rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function issuetypelistFormSubmitHandler() {
    if(!validateForm('issuetypelistform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#issuetypelistform'), issuetypelistid ? [['id', issuetypelistid]] : null)
    let request = await httpRequest2('../controllers/issuetypelist', payload, document.querySelector('#issuetypelistform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        issuetypelistid = '' 
        document.getElementById('issuetypelist').click();  
        alert()
        fetchissuetypelist();
        return
    }
    document.getElementById('issuetypelist').click();
    fetchissuetypelist();
    return notification(request.message, 0);
}


// function runAdissuetypelistFormValidations() {
//     let form = document.getElementById('issuetypelistform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#issuetypelistname'))  controls.push([form.querySelector('#issuetypelistname'), 'issuetypelist name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }