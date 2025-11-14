let notificationid
async function notificationActive() {
    const form = document.querySelector('#notificationform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', notificationFormSubmitHandler)
    datasource = []
    recalldatalist()
    if(notificationid)did('notificationtatuscontainer').classList.remove('hidden')
    await fetchnotification()
}




async function fetchnotification(id,outside=false) {
    // scrollToTop('scrolldiv')
        function getparamm(){
            let paramstr = new FormData()
            paramstr.append('id', id)
            paramstr.append('notificationtatus', document.getElementById('notificationtatus').value)
            return paramstr
        }
    if(!outside){
        if(id)did('notificationtatuscontainer').classList.remove('hidden')
        if(!id)did('notificationtatuscontainer').classList.add('hidden')
        if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    }
    let request = await httpRequest2('../controllers/fetchnotifications', id ? getparamm() : null, null, 'json')
    if(request.status) {
        if(!outside){if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onnotificationTableDataSignal)
            }
        }else{
            runoptioner(document.getElementsByClassName('updater')[0])
             notificationid = request.data[0].id
            populateData(request.data[0], ['document'])
            document.getElementById('receiver').value = request.data[0].receivername +' || '+ request.data[0].receiver
            // document.getElementById('messagefrom').value = request.data[0].messagefrom +' || '+ request.data[0].messagefrom
        }}
        if(outside){
            if(request.data.length){
            if(document.getElementsByName('notification_notification').length > 0){
                document.getElementsByName('notification_notification')[0].remove()
                did('notification_badge_count').innerHTML = Number(did('notification_badge_count').textContent) - 1 
                if(Number(document.getElementById('notification_badge_count').textContent) == 0)document.getElementById('notification_badge_count').classList.add('hidden')
            }
            let element = document.createElement('div');
            element.setAttribute('name', 'notification_notification');
            element.setAttribute('class', 'qq flex cp justify-between border rounded-md p-2 mb-1');
            
            let x = `<div class="qq flex flex-col gap-2">
                <p class="qq font-semibold text-sm text-left">Notification</p>
                <p class="qq font-normal text-xs text-left">You have a messages from notification.</p>
            </div>
            <p class="qq my-auto bg-blue-500 px-1 text-xs rounded-full text-white">${request.data.length}</p>`;
            
            element.innerHTML = x;
            
            did('notification_content_holder').appendChild(element);
            
            document.getElementsByName('notification_notification')[0].addEventListener('click', e => {
                document.getElementById('notification').click();
            });
            
            did('notification_badge_count').innerHTML = Number(did('notification_badge_count').textContent) + 1;
            did('notification_badge_count').classList.remove('hidden');

            }
        }
    }
    else return notification('No records retrieved')
}
fetchnotification('', true)
setInterval(()=>{fetchnotification('', true)},30000)
async function removenotification(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this notification?");

    // If not confirmed, do nothing
    if (!confirmed) { 
        return;
    }

    function getparamm() {
        let paramstr = new FormData(); 
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removenotification', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchnotification()
    return notification(request.message);
    
}


async function onnotificationTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.sendername}</td>
        <td>${item.receivername}</td>
        <td>${item.message}</td>
        <td><select onchange="changenotificationtoggle('${item.id}', this.value)"><option ${item.notificationstatus == 'PENDING' ? 'selected' : ''}>PENDING</option><option ${item.notificationstatus == 'DELIVERED' ? 'selected' : ''}>DELIVERED</option></select></td>
        <td>${specialformatDateTime(item.created_at)}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchnotification('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removenotification('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function changenotificationtoggle(id, val){
    notification('Loading...')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        paramstr.append('notificationstatus', val)
        return paramstr
    }
    let request = await httpRequest2('../controllers/togglenotification', getparamm(), null, 'json')
    if(request.status) {
        notification('Successful')
        fetchnotification()
    }
    else return notification('No records retrieved')
}

async function notificationFormSubmitHandler() {
    if(!validateForm('notificationform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#notificationform'), notificationid ? 
    [
        ['id', notificationid],
        ['photofilename', showFileName('document')],
        ['userphotoname', getFile('document')],
        // ['sender', document.getElementById('sender').value.split('||')[1].trim()],
        ['receiver', document.getElementById('receiver').value.split('||')[1].trim()]
    ] 
    : 
     [
        ['photofilename', showFileName('document')],
        ['userphotoname', getFile('document')],
        // ['sender', document.getElementById('sender').value.split('||')[1].trim()],
        ['receiver', document.getElementById('receiver').value.split('||')[1].trim()]
     ]
    )
    let request = await httpRequest2('../controllers/notifications', payload, document.querySelector('#notificationform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#notificationform').reset();
        if(notificationid)runoptioner(document.getElementsByClassName('viewer')[0])
        notificationid = ''
        fetchnotification();
        return
    }
    document.querySelector('#notificationform').reset();
    fetchnotification();
    return notification(request.message, 0);
}


// function runAdnotificationFormValidations() {
//     let form = document.getElementById('notificationform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#notificationname'))  controls.push([form.querySelector('#notificationname'), 'notification name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }