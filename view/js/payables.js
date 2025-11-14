let payablesid
let payablesupplierdata
async function payablesActive() {
    const form = document.querySelector('#payablesform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', payablesFormSubmitHandler)
    datasource = []
    await fetchpayables()
}

async function fetchpayables(id) {
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
            payablesupplierdata = request.data.data
               document.getElementById('supplierlistpayable').innerHTML = request.data.data.map(dat=>`<option>${dat.companyname} __${dat.id}</option>`)
            }
    }
    else notification('No records retrieved')
}

async function removepayables(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this payables?");

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
    fetchpayables()
    return notification(request.message);
    
}


async function onpayablesTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${formatDate(item.transactiondate.split(' ')[0])}</td>
        <td>${item.reference}</td>
        <td>${item.description}</td>
        <td>${formatCurrency(item.debit)}</td>
        <td>${formatCurrency(item.credit)}</td>
        <td>${formatCurrency(Number(item.credit)-Number(item.debit))}</td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}
 
async function payablesFormSubmitHandler() {  
    if(!validateForm('payablesform', [`owner`, `startdate`, 'enddate'])) return 
    
    function payload(){
        let x = new FormData()
        x.append('supplierid', document.getElementById('owner').value.split('__')[1])
        x.append('startdate', document.getElementById('startdate').value)
        x.append('enddate', document.getElementById('enddate').value)
        return x
    }
    let request = await httpRequest2('../controllers/getpayables', payload(), document.querySelector('#payablesform #submit'))
    if(request.status) {
                datasource = request.data.payables
                did('bbf').innerHTML = formatCurrency(request.data.balancebroughtforward)
                resolvePagination(datasource, onpayablesTableDataSignal)
        return
    }
    return notification(request.message, 0);
}


// function runAdpayablesFormValidations() {
//     let form = document.getElementById('payablesform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#payablesname'))  controls.push([form.querySelector('#payablesname'), 'payables name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }