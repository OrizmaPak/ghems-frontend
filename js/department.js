let departmentid
let departmentSearchTerm = ''
let departmentBaseDatasource = []

function renderDepartmentTable(){
    const search = String(departmentSearchTerm || '').toLowerCase().trim()
    const filtered = !search ? departmentBaseDatasource : departmentBaseDatasource.filter((item) => {
        const department = String(item?.department || '').toLowerCase()
        const category = String(item?.category || '').toLowerCase()
        const applyForSales = String(item?.applyforsales || '').toLowerCase()
        return `${department} ${category} ${applyForSales}`.includes(search)
    })

    if(!filtered.length){
        document.getElementById('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No records found</td></tr>`
        return
    }
    resolvePagination(filtered, ondepartmentTableDataSignal)
}

async function departmentActive() {
    const form = document.querySelector('#departmentform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', departmentFormSubmitHandler)
    if(did('departmenttablesearch')) did('departmenttablesearch').addEventListener('input', (event) => {
        departmentSearchTerm = event.target.value || ''
        renderDepartmentTable()
    })
    datasource = []
    departmentBaseDatasource = []
    renderUnfilteredListPrompt('tabledata')
}

async function fetchdepartment(id, options = {}) {
    const { initial = false, notifyOnEmpty = false } = options
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    const payload = id ? getparamm() : null
    if(shouldBlockUnfilteredListFetch({ id, payload, isInitialLoad: initial, notifyOnBlock: notifyOnEmpty })) {
        departmentBaseDatasource = []
        return
    }
    let request = await httpRequest2('../controllers/fetchdepartments', payload, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                departmentBaseDatasource = request.data
                renderDepartmentTable()
            }else{
                departmentBaseDatasource = []
                document.getElementById('tabledata').innerHTML = `No records retrieved`
            }
        }else{
             departmentid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removedepartment(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this department?");

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
    fetchdepartment()
    return notification(request.message);
    
}


async function ondepartmentTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.department}</td>
        <td>${item.category}</td>
        <td>${item.applyforsales}</td>
        <td class="flex items-center gap-3 ${item.department == default_department ? 'hidden' : ''}">
            <button title="Edit row entry" onclick="fetchdepartment('${item.id}')" class="material-symbols-outlined ${item.department == default_department ? 'hidden' : ''} rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removedepartment('${item.id}')" class="material-symbols-outlined ${item.department == default_department ? 'hidden' : ''} rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function departmentFormSubmitHandler() {
    if(!validateForm('departmentform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#departmentform'), departmentid ? [['id', departmentid]] : null)
    let request = await httpRequest2('../controllers/department', payload, document.querySelector('#departmentform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        departmentid = ''
        document.querySelector('#department').click();
        fetchdepartment();
        return
    }
        document.querySelector('#department').click();
    fetchdepartment();
    return notification(request.message, 0);
}


// function runAddepartmentFormValidations() {
//     let form = document.getElementById('departmentform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#departmentname'))  controls.push([form.querySelector('#departmentname'), 'department name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
