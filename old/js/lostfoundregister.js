let lostfoundregisterid
async function lostfoundregisterActive() {
    const form = document.querySelector('#lostfoundregisterform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', lostfoundregisterFormSubmitHandler)
    datasource = []
    await fetchlostfoundregister()
}

async function fetchlostfoundregister(id='') {
    if(id)document.getElementsByClassName('updater')[0].click(id)
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchlostandfounditems', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onlostfoundregisterTableDataSignal)
            }
        }else{
             lostfoundregisterid = request.data[0].id
            populateData(request.data[0])
            document.getElementById('foundby').value = request.data[0].foundbyname+' || '+request.data[0].foundby
        }
    }
    else return notification('No records retrieved')
}

async function removelostfoundregister(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this lostfoundregister?");

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
    fetchlostfoundregister()
    return notification(request.message);
    
}


async function onlostfoundregisterTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.roomnumber}</td>
        <td>${item.item}</td>
        <td>${item.description}</td>
        <td>${item.foundbyname}</td>
        <td>${specialformatDateTime(item.datetimefound)}</td>
        <td>${item.itemcollectedby}</td>
        <td>${specialformatDateTime(item.collectiondate)}</td>
        <td>${item.collectoraddress}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchlostfoundregister('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removelostfoundregister('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function lostfoundregisterFormSubmitHandler() {
    if(!validateForm('lostfoundregisterform', getIdFromCls('comp'))) return
    
    function payload(){
        let param = new FormData(document.querySelector('#lostfoundregisterform'))
        if(lostfoundregisterid)param.append('id', lostfoundregisterid)
        param.append('foundby', document.getElementById('foundby').value ? document.getElementById('foundby').value.split('||')[1].trim() : '')
        return param
    }
    // let payload
    // payload = getFormData2(, lostfoundregisterid ? [['id', lostfoundregisterid]] : null)
    let request = await httpRequest2('../controllers/lostandfounditems', payload(), document.querySelector('#lostfoundregisterform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#lostfoundregisterform').reset();
        document.getElementsByClassName('viewer')[0].click()
        fetchlostfoundregister();
        return
    }
    document.querySelector('#lostfoundregisterform').reset();
    fetchlostfoundregister();
    return notification(request.message, 0);
}


// function runAdlostfoundregisterFormValidations() {
//     let form = document.getElementById('lostfoundregisterform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#lostfoundregistername'))  controls.push([form.querySelector('#lostfoundregistername'), 'lostfoundregister name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }