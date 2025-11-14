let addglaccountid
async function addglaccountActive() {
    const form = document.querySelector('#addglaccountform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', addglaccountFormSubmitHandler)
    datasource = []
    addglaccountid = ''
    // await fetchaddglaccount()
    await populateaddglaccountselects()
}

function addglaccountrunEdit(){
    document.querySelector('#addglaccountform #submit').textContent = 'Submit'
    did('deleteglaccountsubmit').classList.add('hidden')
    if(!sessionStorage.getItem('viewglaccountedit'))return
    let x = JSON.parse(sessionStorage.getItem('viewglaccountedit'))
    sessionStorage.removeItem('viewglaccountedit')
    populateData(x[0])
    addglaccountid = x[0].id
    did('deleteglaccountsubmit').classList.remove('hidden')
    document.querySelector('#addglaccountform #submit').textContent = 'Update'
}

async function populateaddglaccountselects(id='') {
            return addglaccountrunEdit()
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    } 
    let request = await httpRequest2('../controllers/fetchglbyaccounttype', id ? getparamm() : null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
            document.getElementById('accounttype').innerHTML += request.data.map(item=>`<option>${item.accounttype}</option>`).join('')
    }
    else return notification('No records retrieved')
}

async function fetchaddglaccount(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchaddglaccount', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onaddglaccountTableDataSignal)
            }
        }else{
             addglaccountid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeaddglaccount(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this addglaccount?");

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
    fetchaddglaccount()
    return notification(request.message);
    
}


async function onaddglaccountTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchaddglaccount('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeaddglaccount('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function addglaccountFormSubmitHandler() {
    if(!validateForm('addglaccountform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#addglaccountform'), addglaccountid ? [['id', addglaccountid]] : null)
    let request = await httpRequest2('../controllers/glaccountscript', payload, document.querySelector('#addglaccountform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#addglaccountform').reset();
        if(document.querySelector('#addglaccountform #submit').textContent == 'Update')document.querySelector('#viewglaccount').click() 
        return
    }
    document.querySelector('#addglaccountform').reset();
    // fetchaddglaccount();
    return notification(request.message, 0);
}


// function runAdaddglaccountFormValidations() {
//     let form = document.getElementById('addglaccountform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#addglaccountname'))  controls.push([form.querySelector('#addglaccountname'), 'addglaccount name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }