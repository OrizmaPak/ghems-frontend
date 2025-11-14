let changepasswordid
async function changepasswordActive() {
    const form = document.querySelector('#changepasswordform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', changepasswordFormSubmitHandler)
    datasource = []
    // await fetchchangepassword()
}

async function fetchchangepassword(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchchangepassword', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onchangepasswordTableDataSignal)
            }
        }else{
             changepasswordid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removechangepassword(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this changepassword?");

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
    fetchchangepassword()
    return notification(request.message);
    
}


async function onchangepasswordTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchchangepassword('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removechangepassword('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function changepasswordFormSubmitHandler() {
    if(!validateForm('changepasswordform', getIdFromCls('comp'))) return
    
    if(did('newpassword').value !== did('confirmpassword').value)return notification('New password and Current password does not match', 0)
    
    let payload

    payload = getFormData2(document.querySelector('#changepasswordform'), changepasswordid ? [['id', changepasswordid]] : null)
    let request = await httpRequest2('../controllers/resetpassword', payload, document.querySelector('#changepasswordform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#changepasswordform').reset();
        // fetchchangepassword();
        return
    }
    document.querySelector('#changepasswordform').reset();
    // fetchchangepassword();
    return notification(request.message, 0);
}


// function runAdchangepasswordFormValidations() {
//     let form = document.getElementById('changepasswordform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#changepasswordname'))  controls.push([form.querySelector('#changepasswordname'), 'changepassword name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }