let allpayablesid
let allpayablesupplierdata
async function allpayablesActive() {
    const form = document.querySelector('#allpayablesform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', allpayablesFormSubmitHandler)
    datasource = []
    await allpayablesFormSubmitHandler()
}

async function fetchallpayables(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchsupplierscript', id ? getparamm() : null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
            if(request.data.data.length) {
            allpayablesupplierdata = request.data.data
               document.getElementById('supplierlistpayable').innerHTML = request.data.data.map(dat=>`<option>${dat.companyname} __${dat.id}</option>`)
            }
    }
    else notification('No records retrieved')
}

async function removeallpayables(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this allpayables?");

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
    fetchallpayables()
    return notification(request.message);
    
}


async function onallpayablesTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.companyname}</td>
        <td>${formatCurrency(item.totaldebit)}</td>
        <td>${formatCurrency(item.totalcredit)}</td>
        <td>${formatCurrency(Number(item.totalcredit)-Number(item.totaldebit))}</td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function allpayablesFormSubmitHandler() {
    // if(!validateForm('allpayablesform', [`owner`, `startdate`, 'enddate'])) return
    
    function payload(){
        let x = new FormData()
        x.append('supplierid', document.getElementById('owner').value.split('__')[1])
        x.append('startdate', document.getElementById('startdate').value)
        x.append('enddate', document.getElementById('enddate').value)
        return x
    }
    let request = await httpRequest2('../controllers/getpayables', null, document.querySelector('#allpayablesform #submit'))
    request = JSON.parse(request)
    if(request.status) {
        if(request.status) {
                datasource = request.data
                resolvePagination(datasource, onallpayablesTableDataSignal)
        return
    }
    }
    return notification(request.message, 0);
}


// function runAdallpayablesFormValidations() {
//     let form = document.getElementById('allpayablesform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#allpayablesname'))  controls.push([form.querySelector('#allpayablesname'), 'allpayables name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }