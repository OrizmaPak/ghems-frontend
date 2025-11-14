let costcenterid
async function costcenterActive() {
    const form = document.querySelector('#costcenterform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', costcenterFormSubmitHandler)
    datasource = []
    await fetchcostcenter()
}

async function fetchcostcenter(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchcostcenter', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, oncostcenterTableDataSignal)
            }
        }else{
             costcenterid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removecostcenter(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this costcenter?");

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
    fetchcostcenter()
    return notification(request.message);
    
}


async function oncostcenterTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1 }</td>
        <td>${item.costcenter}</td>
        <td>${item.otherdetail}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchcostcenter('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removecostcenter('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function costcenterFormSubmitHandler() {
    if(!validateForm('costcenterform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#costcenterform'), costcenterid ? [['id', costcenterid]] : null)
    let request = await httpRequest2('../controllers/costcenter', payload, document.querySelector('#costcenterform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        costcenterid = ''
        document.querySelector('#costcenter').click();
        fetchcostcenter();
        return
    }
    document.querySelector('#costcenter').click();
    fetchcostcenter();
    return notification(request.message, 0);
}


// function runAdcostcenterFormValidations() {
//     let form = document.getElementById('costcenterform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#costcentername'))  controls.push([form.querySelector('#costcentername'), 'costcenter name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }