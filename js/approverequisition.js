let approverequisitionid
async function approverequisitionActive() {
    // const form = document.querySelector('#approverequisitionform')
    // if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', approverequisitionFormSubmitHandler)
    document.getElementById('allapprovebox').addEventListener('change', e=>{
       approvechecker()
    })
    document.getElementById('requisitionapprovebtn').addEventListener('click', e=>{
        submitapprovedeclinerequisition('APPROVE')
    })
    document.getElementById('requisitiondeclinebtn').addEventListener('click', e=>{
        submitapprovedeclinerequisition('DECLINE')
    })
    datasource = []
    await fetchapproverequisition()
}

// TO TRIGGER NOTIFICATION
fetchapproverequisition('', true)
setInterval(()=>{fetchapproverequisition('', true)},30000)

async function submitapprovedeclinerequisition(state){
        let ids = []
        for(let i=0;i<document.getElementsByName('approvebox').length;i++){
            if(document.getElementsByName('approvebox')[i].checked){
                ids.push(document.getElementsByName('approvebox')[i].id)
            }
        }
    if(ids.length <= 0)return notification('No Item Selected')
    if(state !== 'APPROVE')return notification('Decline Not Available for now. Try Later..')
    function payload(){
        let param  = new FormData()
        param.append('rowsize', ids.length)
        for(let i=0;i<ids.length;i++){
            param.append(`id${i+1}`, ids[i])
        }
        return param
    }
     let request = await httpRequest2(`../controllers/${state == 'APPROVE' ? 'approverequisitions' : 'cancelrequisition'}`, payload(), document.getElementById('requisitionapprovebtn'))
    if(request.status) {
        notification('Selected Records Approved Successfully!', 1);
        fetchapproverequisition();
        return
    }else return notification('Something Went Wrong.. try again later', 0)
}

function approvechecker(action){
     for(let i=0;i<document.getElementsByName('approvebox').length;i++){
            if(!action)document.getElementsByName('approvebox')[i].checked = document.getElementById('allapprovebox').checked
            if(action == 'CHECK')document.getElementsByName('approvebox')[i].checked = true
            if(action == 'NOTCHECK')document.getElementsByName('approvebox')[i].checked = false
        }
}

async function fetchapproverequisition(id='', outside=false) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('location', document.getElementById('location_id').value)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchrequisitionspendingapproval', getparamm(), null, 'json')
    if(!id)if(!outside)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status){
        if(request.data.length){
            if(document.getElementsByName('notification_approvenotification').length > 0){
                document.getElementsByName('notification_approvenotification')[0].remove()
                did('notification_badge_count').innerHTML = Number(did('notification_badge_count').textContent) - 1 
                if(Number(document.getElementById('notification_badge_count').textContent) == 0)document.getElementById('notification_badge_count').classList.add('hidden')
            }
            let element = document.createElement('div');
            element.setAttribute('name', 'notification_approvenotification');
            element.setAttribute('class', 'qq flex cp justify-between border rounded-md p-2 mb-1');
            
            let x = `<div class="qq flex flex-col gap-2">
                <p class="qq font-semibold text-sm text-left">Requisition</p>
                <p class="qq font-normal text-xs">Items need approval.</p>
            </div>
            <p class="qq my-auto bg-blue-500 px-1 text-xs rounded-full text-white">${request.data.length}</p>`;
            
            element.innerHTML = x;
            
            did('notification_content_holder').appendChild(element);
            
            document.getElementsByName('notification_approvenotification')[0].addEventListener('click', e => {
                document.getElementById('approverequisition').click();
            });
            
            did('notification_badge_count').innerHTML = Number(did('notification_badge_count').textContent) + 1;
            did('notification_badge_count').classList.remove('hidden');

        }
    }
    if(!outside){if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onapproverequisitionTableDataSignal)
            }
        }else{
            //  approverequisitionid = request.data[0].id
            // populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')}
}

async function removeapproverequisition(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this approverequisition?");

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
    fetchapproverequisition()
    return notification(request.message);
    
}


async function onapproverequisitionTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td><input type="checkbox" name="approvebox" id="${item.requisition.id}" /></td>
        <td>${item.requisition.itemname}</td>
        <td>${item.requisition.category == 'OUTTAKE' ? item.requisition.salespoint : ''}</td>
        <td>${item.destination}</td>
        <td>${item.requisition.cost}</td>
        <td>${item.requisition.reference}</td>
        <td>${item.requisition.description}</td>
        <td>${formatDate(item.requisition.transactiondate)}</td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function approverequisitionFormSubmitHandler() {
    if(!validateForm('approverequisitionform', [`productname`, `productdescription`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#approverequisitionform'), approverequisitionid ? [['id', approverequisitionid]] : null)
    let request = await httpRequest2('../controllers/approverequisitioncript', payload, document.querySelector('#approverequisitionform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#approverequisitionform').reset();
        fetchapproverequisition();
        return
    }
    document.querySelector('#approverequisitionform').reset();
    fetchapproverequisition();
    return notification(request.message, 0);
}


// function runAdapproverequisitionFormValidations() {
//     let form = document.getElementById('approverequisitionform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#approverequisitionname'))  controls.push([form.querySelector('#approverequisitionname'), 'approverequisition name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }