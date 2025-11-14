let productitemid
async function productitemActive() {
    const form = document.querySelector('#productitemform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', productitemFormSubmitHandler)
    datasource = []
    await fetchproductitem()
}

async function fetchproductitem(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchproductitem', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onproductitemTableDataSignal)
            }
        }else{
             productitemid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeproductitem(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this productitem?");

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
    fetchproductitem()
    return notification(request.message);
    
}


async function onproductitemTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchproductitem('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeproductitem('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function productitemFormSubmitHandler() {
    if(!validateForm('productitemform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#productitemform'), productitemid ? [['id', productitemid]] : null)
    let request = await httpRequest2('../controllers/productitemcript', payload, document.querySelector('#productitemform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#productitemform').reset();
        fetchproductitem();
        return
    }
    document.querySelector('#productitemform').reset();
    fetchproductitem();
    return notification(request.message, 0);
}


// function runAdproductitemFormValidations() {
//     let form = document.getElementById('productitemform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#productitemname'))  controls.push([form.querySelector('#productitemname'), 'productitem name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }