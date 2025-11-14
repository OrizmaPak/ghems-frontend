let roomcategoriesid
async function roomcategoriesActive() {
    const form = document.querySelector('#roomcategoriesform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', roomcategoriesFormSubmitHandler)
    datasource = []
    await fetchroomcategories()
    await fetchratecodes()
}

async function fetchratecodes(id) {
    let request = await httpRequest2('../controllers/fetchratecode', null, null, 'json')
    if(request.status) {
        if(request.data.length) {
            let options = request.data?.map( item => `<option value="${item.id}">${item.ratecode}</option>`).join('')
            try {
                document.getElementById('roomcategoriesform').ratecode.innerHTML = options
            } catch(e) {console.log(e)}
        }
    }
    else return notification('No records retrieved')
}

async function fetchroomcategories(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchroomcategories', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onroomcategoriesTableDataSignal)
            }
        }else{
             roomcategoriesid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeroomcategories(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this roomcategories?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removeroomcategory', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchroomcategories()
    return notification(request.message);
    
}


async function onroomcategoriesTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.category}</td>
        <td>${item.ratecode}</td>
        <td>${item.currency}</td>
        <td>${item.categorytype}</td>
        <td>${formatCurrency(item.minimumrequireddeposit)}</td>
        <td>${formatCurrency(item.price)}</td>
        <td>${formatCurrency(item.price_2)}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchroomcategories('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeroomcategories('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function roomcategoriesFormSubmitHandler() {
    if(!validateForm('roomcategoriesform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#roomcategoriesform'), roomcategoriesid ? [['id', roomcategoriesid]] : null)
    let request = await httpRequest2('../controllers/roomcategories', payload, document.querySelector('#roomcategoriesform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        roomcategoriesid = ''
        document.querySelector('#roomcategoriesform').reset();
        fetchroomcategories();
        return
    }
        roomcategoriesid = ''
    document.querySelector('#roomcategoriesform').reset();
    fetchroomcategories();
    return notification(request.message, 0);
}


// function runAdroomcategoriesFormValidations() {
//     let form = document.getElementById('roomcategoriesform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#roomcategoriesname'))  controls.push([form.querySelector('#roomcategoriesname'), 'roomcategories name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }