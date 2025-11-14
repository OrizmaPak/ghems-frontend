let ratecodeid; 
async function ratecodeActive() {
    const form = document.querySelector('#ratecodeform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', ratecodeFormSubmitHandler)
    
    if(form.plan) form.plan.addEventListener('change', resolvePlanChanges)
    
    datasource = []
    await fetchratecode()
    await fetchbookplans()
}

function resolvePlanChanges() {
   const form = document.querySelector('#ratecodeform')
   const selectedPlanId = +form.plan.value
   const selectedPlan = bookingplanslist.find(item => selectedPlanId == +item.id)
    try {
        form.adultplan.value = selectedPlan.adultamount
        form.childplan.value = selectedPlan.childamount
    } catch(e) {console.log(e)}
   
   
}

async function fetchbookplans(id) {
    let request = await httpRequest2('../controllers/fetchbookingplan', null, null, 'json')
    if(request.status) {
        if(request.data.length) {
            bookingplanslist = request.data;
            let options = request.data?.map( item => `<option value="${item.id}">${item.planname}</option>`).join('')
            try {
                document.getElementById('ratecodeform').plan.innerHTML = '<option value=""> --Select Plan -- </option>' + options
            } catch(e) {console.log(e)}
        }
    }
    else return notification('No records retrieved')
}

async function fetchratecode(id) {
    if(id)document.getElementsByClassName('updater')[0].click()
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchratecode', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onratecodeTableDataSignal)
            }
        }else{
             ratecodeid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeratecode(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this ratecode?");

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
    fetchratecode()
    return notification(request.message);
    
}


async function onratecodeTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1 }</td>
        <td>${item.ratecode}</td>
        <td>${item.adult1}</td>
        <td>${item.adult2}</td>
        <td>${item.adult3}</td>
        <td>${item.adult4}</td>
        <td>${item.extadult}</td>
        <td>${item.extchild}</td>
        <td>${item.aditchild}</td>
        <td>${item.planname}</td>
        <td>${item.childplan}</td>
        <td>${item.currency}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchratecode('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeratecode('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function ratecodeFormSubmitHandler() {
    if(!validateForm('ratecodeform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#ratecodeform'), ratecodeid ? [['id', ratecodeid]] : null)
    let request = await httpRequest2('../controllers/ratecode', payload, document.querySelector('#ratecodeform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        ratecodeid = ''
        document.querySelector('#ratecode').click();
        fetchratecode();
        return
    }
        document.querySelector('#ratecode').click();
    fetchratecode();
    return notification(request.message, 0);
}


// function runAdratecodeFormValidations() {
//     let form = document.getElementById('ratecodeform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#ratecodename'))  controls.push([form.querySelector('#ratecodename'), 'ratecode name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }