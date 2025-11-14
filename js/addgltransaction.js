let addgltransactionid
let totalcreditnumber
let totaldebitnumber
async function addgltransactionActive() {
    const form = document.querySelector('#addgltransactionform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', addgltransactionFormSubmitHandler)
    if(form.querySelector('#reset')) form.querySelector('#reset').addEventListener('click', addgltransactionFormResetHandler)
    datasource = []
    await fetchaddgltransaction()
    totalcreditnumber = 0
    totaldebitnumber = 0
}


function gltaddcreditrow(){
    let id = genID()
    let element = document.createElement('div')
    element.classList.add('grid', 'grid-cols-1', 'lg:grid-cols-3', 'gap-6')
    element.setAttribute('id', `creditcontainer_${id}`)
    let x = `<div class="form-group">
                    <label for="logoname" class="control-label">Credit Account</label>
                    <input type="text" list="glaccountlist"  onchange="checkdatalist(this)" name="gltcreditaccount" id="creditaccount_${id}" class="form-control comp" placeholder="Enter Credit Account">
                </div>
                <div class="form-group">
                    <label for="logoname" class="control-label">Amount</label>
                    <input type="number" name="gltcreditamount" id="creditamount_${id}" onchange="allcreditamount()" class="form-control comp" placeholder="Enter Amount">
                </div>
                <div id="deletecredit_${id}" onclick="deletecreditglt(${id})" class="form-group flex flex-row cp items-end">
                    <div title="Add row" onclick="" onmouseover="this.nextElementSibling.classList.add('!w-[100px]');" onmouseleave="this.nextElementSibling.classList.remove('!w-[100px]');" class="mb-1 material-symbols-outlined rounded-full bg-red-700 h-8 w-8 text-white drop-shadow-md text-xs flex justify-center items-center" style="font-size: 18px;">delete</div>
                    <div class="mb-3 text-xs text-red-600 w-[0px] overflow-hidden trasition-all duration-[0.3s] h-[3]"><p class="px-1 w-[100px]">Click&nbsp;to&nbsp; Delete</p></div>
                </div>`
    element.innerHTML = x
    did('gltcreditcontainer').appendChild(element)
}

function deletecreditglt(id){
    did(`creditcontainer_${id}`).remove()
}

function gltadddebitrow(){
    let id = genID()
    let element = document.createElement('div')
    element.classList.add('grid', 'grid-cols-1', 'lg:grid-cols-3', 'gap-6')
    element.setAttribute('id', `debitcontainer_${id}`)
    let x = `<div class="form-group">
                    <label for="logoname" class="control-label">Debit Account</label>
                    <input type="text" list="glaccountlist"  onchange="checkdatalist(this)" name="gltdebitaccount" id="debitaccount_${id}" class="comp form-control" placeholder="Enter Debit Account">
                </div>
                <div class="form-group">
                    <label for="logoname" class="control-label">Amount</label>
                    <input type="number" name="gltdebitamount" id="debitamount_${id}" onchange="alldebitamount()" class="comp form-control" placeholder="Enter Amount">
                </div>
                <div id="deletedebit_${id}" onclick="deletedebitglt(${id})" class="form-group flex flex-row cp items-end">
                    <div title="Add row" onclick="" onmouseover="this.nextElementSibling.classList.add('!w-[100px]');" onmouseleave="this.nextElementSibling.classList.remove('!w-[100px]');" class="mb-1 material-symbols-outlined rounded-full bg-red-700 h-8 w-8 text-white drop-shadow-md text-xs flex justify-center items-center" style="font-size: 18px;">delete</div>
                    <div class="mb-3 text-xs text-red-600 w-[0px] overflow-hidden trasition-all duration-[0.3s] h-[3]"><p class="px-1 w-[100px]">Click&nbsp;to&nbsp; Delete</p></div>
                </div>`
    element.innerHTML = x
    did('gltdebitcontainer').appendChild(element)
}

function deletedebitglt(id){
    did(`debitcontainer_${id}`).remove()
}
	const alldebitamount=()=>{
	        let count = 0
	    for(let i=0; i<document.getElementsByName('gltdebitamount').length; i++){ 
	       // console.log(document.getElementsByName('gltdebitamount')[i].value, 'i', i); 
	        count = count + parseInt(document.getElementsByName('gltdebitamount')[i].value ? document.getElementsByName('gltdebitamount')[i].value : 0);
	   // alert(count)
	    }
	        document.getElementById('glttotaldebit').value = formatCurrency(count); 
	        totaldebitnumber = count 
	}
	
	const allcreditamount=()=>{
	        let count = 0
	    for(let i=0; i<document.getElementsByName('gltcreditamount').length; i++){
	       // console.log(document.getElementsByName('gltcreditamount')[i].value, 'i', i);
	        count = count + parseInt(document.getElementsByName('gltcreditamount')[i].value ? document.getElementsByName('gltcreditamount')[i].value : 0);
	   // alert(count)
	    }
	        document.getElementById('glttotalcredit').value = formatCurrency(count);
	        totalcreditnumber = count
	}


async function fetchaddgltransaction(id='') {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchglaccounts', id ? getparamm() : null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        did('glaccountlist').innerHTML = request.data.data.map(data=>`<option>${data.description} __${data.accountnumber}</option>`)
    }
    else return notification('No records retrieved')
}

async function removeaddgltransaction(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this addgltransaction?");

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
    fetchaddgltransaction()
    return notification(request.message);
    
}


async function onaddgltransactionTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchaddgltransaction('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeaddgltransaction('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

function addgltransactionFormResetHandler() {
    document.querySelector('#addgltransactionform').reset();
    did('gltdebitcontainer').innerHTML = ''
    did('gltcreditcontainer').innerHTML = ''
    totalcreditnumber = 0
    totaldebitnumber = 0
    document.getElementById('glttotalcredit').value = ''
    document.getElementById('glttotaldebit').value = ''
}

async function addgltransactionFormSubmitHandler() {
    if(!validateForm('addgltransactionform', getIdFromCls('comp'))) return
    if(totaldebitnumber == 0)return notification('Total Debit cannot be Zero', 0)
    if(totalcreditnumber == 0)return notification('Total Credit cannot be Zero', 0)
    if(totaldebitnumber !== totalcreditnumber)return notification('Total Credit and Debit do not balance out', 0)
    function payload(){
        let paramstr = new FormData()
		paramstr.append('description',document.getElementById('description').value);
		paramstr.append('transactiondate',document.getElementById('transactiondate').value);
		
		for(let i=0; i<document.getElementsByName('gltdebitamount').length; i++){
		    paramstr.append(`debitaccount${i}`,document.getElementsByName('gltdebitaccount')[i].value.split('__')[1]);
		    paramstr.append(`debitamount${i}`,document.getElementsByName('gltdebitamount')[i].value);
		}
		paramstr.append('debitgridsize',document.getElementsByName('gltdebitamount').length);
		
		for(let i=0; i<document.getElementsByName('gltcreditamount').length; i++){
		    paramstr.append(`creditaccount${i}`,document.getElementsByName('gltcreditaccount')[i].value.split('__')[1]);
		    paramstr.append(`creditamount${i}`,document.getElementsByName('gltcreditamount')[i].value);
		}
		paramstr.append('creditgridsize',document.getElementsByName('gltcreditamount').length);
		
		paramstr.append('debittotal',totaldebitnumber);
		paramstr.append('credittotal',totalcreditnumber);
        return paramstr
    }
    let request = await httpRequest2('../controllers/gltransactionscript', payload(), document.querySelector('#addgltransactionform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#addgltransactionform').reset();
        did('gltdebitcontainer').innerHTML = ''
        did('gltcreditcontainer').innerHTML = ''
        // fetchaddgltransaction();
        return
    }
    // document.querySelector('#addgltransactionform').reset();
    // fetchaddgltransaction();
    return notification(request.message, 0);
}


// function runAdaddgltransactionFormValidations() {
//     let form = document.getElementById('addgltransactionform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#addgltransactionname'))  controls.push([form.querySelector('#addgltransactionname'), 'addgltransaction name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }