let managesupplierid
async function managesupplierActive() {
    const form = document.querySelector('#managesupplierform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', managesupplierFormSubmitHandler)
    datasource = []
    await fetchmanagesupplier()
}

async function fetchmanagesupplier(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchsupplierscript', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
                // console.log(request.data.data)
            if(request.data.data.length) {
                // console.log(request.data.data)
                datasource = request.data.data
                resolvePagination(datasource, onmanagesupplierTableDataSignal)
            }
        }else{
             managesupplierid = id
            populateData(request.data.data.filter(data=>data.id==id)[0])
            // Scroll to the top of the form when edit button is clicked
            scrollToTop()
            document.querySelector('#managesupplierform').scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }
    else return notification('No records retrieved')
}

async function removemanagesupplier(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this managesupplier?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removelocation', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchmanagesupplier()
    return notification(request.message);
    
}

function resetManageSupplierFormFields() {
    const form = document.querySelector('#managesupplierform')
    if(!form) return
    form.querySelectorAll('input, select, textarea').forEach(control => {
        if(control.tagName === 'SELECT') control.selectedIndex = 0
        else if(['checkbox', 'radio'].includes(control.type)) control.checked = false
        else control.value = ''
    })
    form.querySelectorAll('.control-error')?.forEach(node => node.remove())
    managesupplierid = ''
}

function resetManageSupplierView() {
    resetManageSupplierFormFields()
    const manageNavItem = document.getElementById('managesupplier')
    if(manageNavItem) {
        manageNavItem.click()
        return
    }
    fetchmanagesupplier()
}


async function onmanagesupplierTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.companyname}</td>
        <td>${item.ttype}</td>
        <td>${item.contactperson}</td>
        <td>${item.nationality}</td>
        <td>${item.state}</td>
        <td>${item.officeaddress}</td>
        <td>${item.phonenumber}</td>
        <td>${item.supplierbank}</td>
        <td>${item.supplieraccount}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchmanagesupplier('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removemanagesupplier('${item.id}')" class="hidden material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function managesupplierFormSubmitHandler() {
    if(!validateForm('managesupplierform', [`ttype`, `companyname`, 'contactperson', 'phonenumber', 'officeaddress', `nationality`, 'state', 'typeofsupplier', 'supplierbank', 'supplieraccount'])) return
    
    let payload

    payload = getFormData2(document.querySelector('#managesupplierform'), managesupplierid ? [['id', managesupplierid]] : null)
    let request = await httpRequest2('../controllers/supplierscript', payload, document.querySelector('#managesupplierform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        resetManageSupplierView()
        return
    }
    resetManageSupplierView()
    return notification(request.message, 0);
}


// function runAdmanagesupplierFormValidations() {
//     let form = document.getElementById('managesupplierform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#managesuppliername'))  controls.push([form.querySelector('#managesuppliername'), 'managesupplier name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
