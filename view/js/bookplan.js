let bookplanid
async function bookplanActive() {
    const form = document.querySelector('#bookplanform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', bookplanFormSubmitHandler)
    datasource = []
    await fetchbookplan()
}

async function fetchbookplan(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchbookingplan', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onbookplanTableDataSignal)
            }
        }else{
             bookplanid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removebookplan(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this bookplan?");

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
    fetchbookplan()
    return notification(request.message);
    
}


async function onbookplanTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1 }</td>
        <td>${item.plancode}</td>
        <td>${item.planname}</td>
        <td>${formatNumber(item.adultamount)}</td>
        <td>${formatNumber(item.childamount)}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchbookplan('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removebookplan('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function bookplanFormSubmitHandler() {
    if(!validateForm('bookplanform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#bookplanform'), bookplanid ? [['id', bookplanid]] : null)
    let request = await httpRequest2('../controllers/bookingplan', payload, document.querySelector('#bookplanform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        bookplanid = ''
        document.querySelector('#bookplanform').reset();
        fetchbookplan();
        return
    }
    document.querySelector('#bookplanform').reset();
    fetchbookplan();
    return notification(request.message, 0);
}


// function runAdbookplanFormValidations() {
//     let form = document.getElementById('bookplanform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#bookplanname'))  controls.push([form.querySelector('#bookplanname'), 'bookplan name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }