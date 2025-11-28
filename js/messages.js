let messagesid
async function messagesActive() {
    const form = document.querySelector('#messagesform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', messagesFormSubmitHandler)
    datasource = []
    recalldatalist()
    await fetchmessages()
}

async function fetchmessages(id) {
    if(id)did('messagestatuscontainer').classList.remove('hidden')
    if(!id)did('messagestatuscontainer').classList.add('hidden')
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchmessages', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onmessagesTableDataSignal)
            }
        }else{
            runoptioner(document.getElementsByClassName('updater')[0])
             messagesid = request.data[0].id
            populateData(request.data[0], ['document'])
            document.getElementById('messagefrom').value = request.data[0].messagefrom || ''
        }
    }
    else return notification('No records retrieved')
}

async function removemessages(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this messages?");

    // If not confirmed, do nothing
    if (!confirmed) { 
        return;
    }

    function getparamm() {
        let paramstr = new FormData(); 
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removemessage', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchmessages()
    return notification(request.message);
    
}


async function onmessagesTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.roomnumber}</td>
        <td>${item.message}</td>
        <td>${item.messagefrom}</td>
        <td>${item.sendasemail}</td>
        <td><select onchange="changemessagetoggle('${item.id}', this.value)"><option ${item.messagestatus == 'PENDING' ? 'selected' : ''}>PENDING</option><option ${item.messagestatus == 'DELIVERED' ? 'selected' : ''}>DELIVERED</option></select></td>
        <td>${specialformatDateTime(item.created_at)}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchmessages('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removemessages('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function changemessagetoggle(id, val){
    notification('Loading...')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        paramstr.append('messagestatus', val)
        return paramstr
    }
    let request = await httpRequest2('../controllers/togglemessagestatus', getparamm(), null, 'json')
    if(request.status) {
        notification('Successful')
        fetchmessages()
    }
    else return notification('No records retrieved')
}

async function messagesFormSubmitHandler() {
    if(!validateForm('messagesform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#messagesform'), messagesid ? 
    [
        ['id', messagesid],
        ['photofilename', showFileName('document')],
        ['userphotoname', getFile('document')],
        ['messagefrom', document.getElementById('messagefrom').value]
    ] 
    : 
     [
        ['photofilename', showFileName('document')],
        ['userphotoname', getFile('document')],
        ['messagefrom', document.getElementById('messagefrom').value]
     ]
    )
    let request = await httpRequest2('../controllers/messages', payload, document.querySelector('#messagesform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#messagesform').reset();
        if(messagesid)runoptioner(document.getElementsByClassName('viewer')[0])
        messagesid = ''
        fetchmessages();
        return
    }
    document.querySelector('#messagesform').reset();
    fetchmessages();
    return notification(request.message, 0);
}


// function runAdmessagesFormValidations() {
//     let form = document.getElementById('messagesform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#messagesname'))  controls.push([form.querySelector('#messagesname'), 'messages name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }