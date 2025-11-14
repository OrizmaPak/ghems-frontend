let gltransactionhistoryid
async function gltransactionhistoryActive() {
    const form = document.querySelector('#gltransactionhistoryform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', gltransactionhistoryFormSubmitHandler)
    datasource = []
    await fetchgltransactionhistory()
}

async function fetchgltransactionhistory(id) { 
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchglaccounts', id ? getparamm() : null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        did('gltransactionhistorylist').innerHTML = request.data.data.map(data=>`<option>${data.description} __${data.accountnumber}</option>`)
    }
    else return notification('No records retrieved')
}

async function removegltransactionhistory(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this gltransactionhistory?");

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
    fetchgltransactionhistory()
    return notification(request.message);
    
}


async function ongltransactionhistoryTableDataSignal() {
    let rows = getSignaledDatasource().map((data, index) => `
    <tr>
         <td> ${index+1} </td>
         <td> ${data.accountnumber} </td>
         <td> ${data.accountname} </td>
        <td> ${data.credittotal} </td>
        <td> ${data.debittotal} </td>
        <td> ${data.description} </td>
        <td> ${data.paymentmethod} </td>
        <td> ${data.reference} </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function gltransactionhistoryFormSubmitHandler() {
    if(!validateForm('gltransactionhistoryform', [`accountnumber`, `startdate`, 'enddate'])) return
    
    function payload(){
        	var paramstr = new FormData();
		
		paramstr.append('accountnumber', document.getElementById('accountnumber').value.split('__')[1]);
		paramstr.append('startdate', document.getElementById('startdate').value);
		paramstr.append('enddate', document.getElementById('enddate').value);
		
	    return paramstr;
    }
    let request = await httpRequest2('../controllers/fetchgltransactions', payload(), document.querySelector('#gltransactionhistoryform #submit'))
    if(request.status) {
         if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, ongltransactionhistoryTableDataSignal)
            }
        document.querySelector('#gltransactionhistoryform').reset();
        fetchgltransactionhistory();
        return
    }
    document.querySelector('#gltransactionhistoryform').reset();
    fetchgltransactionhistory();
    return notification(request.message, 0);
}


// function runAdgltransactionhistoryFormValidations() {
//     let form = document.getElementById('gltransactionhistoryform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#gltransactionhistoryname'))  controls.push([form.querySelector('#gltransactionhistoryname'), 'gltransactionhistory name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }