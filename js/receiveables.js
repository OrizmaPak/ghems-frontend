let receiveablesid
let receiveablesFiltered = false
async function receiveablesActive() {
    // const form = document.querySelector('#receiveablesform')
    // if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', receiveablesFormSubmitHandler)
    if(document.querySelector('#submitreceiveablesfilter')) document.querySelector('#submitreceiveablesfilter').addEventListener('click', () => fetchreceiveables('', did('receiveablesroomnumber').value))
    if(document.querySelector('#resetreceiveablesfilter')) document.querySelector('#resetreceiveablesfilter').addEventListener('click', resetreceiveablesfilter)
    datasource = []
    await fetchreceiveables()
}

async function fetchreceiveables(id='', roomnumber='') {
    receiveablesFiltered = Boolean(roomnumber)
    setreceiveablesTableHeader()
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        if(id)paramstr.append('id', id)
        if(roomnumber)paramstr.append('roomnumber', roomnumber)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchreceivablesbyrooms', (id || roomnumber) ? getparamm() : null, document.querySelector('#submitreceiveablesfilter'), 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onreceiveablesTableDataSignal)
            }
        }else{
             receiveablesid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

function resetreceiveablesfilter(){
    if(did('receiveablesroomnumber'))did('receiveablesroomnumber').value = ''
    fetchreceiveables()
}

async function removereceiveables(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this receiveables?");

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
    fetchreceiveables()
    return notification(request.message);
    
}

        // <td class="flex items-center gap-3">
        //     <button title="Edit row entry" onclick="fetchreceiveables('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
        //     <button title="Delete row entry"s onclick="removereceiveables('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        // </td>

async function onreceiveablesTableDataSignal() {
    setreceiveablesTableHeader()
    if(receiveablesFiltered){
        let rows = getSignaledDatasource().map((item, index) =>{
        const result = Number(item.debit) - Number(item.credit);
        const roomIdentifier = item.ownerid || item.roomnumber || '';
        const runningBalance = getReceivableRunningBalance(item.index ?? index);
        return(`
        <tr>
            <td>${formatReceivableTransactionDate(item.transactiondate)}</td>
            <td> ROOM ${roomIdentifier}</td>
            <td>${formatReceivableDescription(item.description)}</td>
            <td>${formatNumber(item.debit)}</td>
            <td>${formatNumber(item.credit)}</td>
            <td><p class="text-black font-semibold">${formatNumber(runningBalance)}</p></td>
            <td><button onclick="openreceiveablemodal('${item.debit}','${item.credit}','${roomIdentifier}')" class="btn btn-sm btn-primary ${result > 0 ? '' : '!hidden'}">Pay Now</button></td>
        </tr>`)}
        )
        .join('')
        injectPaginatatedTable(rows)
        return
    }

    let rows = getSignaledDatasource().map((item, index) =>{
    const result = Number(item.debit) - Number(item.credit);
    const roomIdentifier = item.ownerid || item.roomnumber || '';
    const runningBalance = getReceivableRunningBalance(item.index ?? index);
    return(`
    <tr>
        <td>${item.index + 1 }</td>
        <td> ROOM ${roomIdentifier}</td>
        <td>${formatNumber(item.debit)}</td>
        <td>${formatNumber(item.credit)}</td>
        <td><p class="text-black font-semibold">${formatNumber(runningBalance)}</p></td>
        <td><button onclick="openreceiveablemodal('${item.debit}','${item.credit}','${roomIdentifier}')" class="btn btn-sm btn-primary ${result > 0 ? '' : '!hidden'}">Pay Now</button></td>
    </tr>`)}
    )
    .join('')
    injectPaginatatedTable(rows)
}

function setreceiveablesTableHeader(){
    const tableHead = document.getElementById('receiveables-table-head')
    if(!tableHead)return

    tableHead.innerHTML = receiveablesFiltered ? `
        <th>transaction&nbsp;date</th>
        <th>room&nbsp;number</th>
        <th>description</th>
        <th>debit</th>
        <th>credit</th>
        <th>balance</th>
        <th>ACTION</th>
    ` : `
        <th style="width: 20px">s/n</th>
        <th>room&nbsp;number</th>
        <th>debit</th>
        <th>credit</th>
        <th>balance</th>
        <th>ACTION</th>
    `
}

function formatReceivableTransactionDate(value){
    if(!value)return ''

    const parsedDate = new Date(String(value).replace(' ', 'T'))
    if(Number.isNaN(parsedDate.getTime()))return value

    const day = parsedDate.getDate()
    const suffix = day % 10 == 1 && day % 100 != 11 ? 'st' : day % 10 == 2 && day % 100 != 12 ? 'nd' : day % 10 == 3 && day % 100 != 13 ? 'rd' : 'th'
    const month = parsedDate.toLocaleString('en-US', { month: 'long' })
    const year = parsedDate.getFullYear()
    const hours = parsedDate.getHours() % 12 || 12
    const minutes = String(parsedDate.getMinutes()).padStart(2, '0')
    const period = parsedDate.getHours() < 12 ? 'a.m.' : 'p.m.'

    return `${day}${suffix} of ${month} ${year} ${hours}:${minutes} ${period}`
}

function formatReceivableDescription(value){
    if(!value)return ''

    const parts = String(value).split('|').map(part => part.trim())
    if(parts.length >= 3 && parts[1])return parts[1]

    return value
}

function getReceivableRunningBalance(index){
    let balance = 0
    const lastIndex = Number(index)

    for(let i = 0; i <= lastIndex && i < datasource.length; i++){
        balance += Number(datasource[i].credit || 0)
        balance -= Number(datasource[i].debit || 0)
    }

    return balance
}

function openreceiveablemodal(dbt, cdt, rn){
    document.getElementById('modalreceipt').classList.remove('hidden')
    function getTodaysDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

    let data = {debit: dbt,credit:cdt,roomnumber:rn}
    did('invoicecontainer').innerHTML = `
                            <div class="rounded-lg">
                        
                        		<div class="flex mb-8 justify-between">
                        			<div class="w-2/4">
                        
                        				<div class="mb-2 md:mb-1 md:flex items-center">
                        					<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Invoice Date</label>
                        					<div class="flex-1">
                        					<input value="${formatDate(getTodaysDate())}" readonly class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker" type="text" placeholder="eg. 17 Feb, 2020">
                        					</div>
                        				</div>
                        
                        				<!--<div class="mb-2 md:mb-1 md:flex items-center">-->
                        				<!--	<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Due date</label>-->
                        				<!--	<span class="mr-4 inline-block hidden md:block">:</span>-->
                        				<!--	<div class="flex-1">-->
                        				<!--	<input class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker-2" id="datepicker2" type="text" placeholder="eg. 17 Mar, 2020" x-model="invoiceDueDate" x-on:change="invoiceDueDate = document.getElementById('datepicker2').value" autocomplete="off" readonly="">-->
                        				<!--	</div>-->
                        				<!--</div>-->
                        			</div>
                        			<div>
                        				<span class="xl:w-[250px] pb-10 font-bold text-2xl text-base block py-3 pl-5 selection:bg-white uppercase font-heebo text-primary-g text-right">He<span class="text-gray-400">ms Invoice</span></span>
                        				<div class="flex justify-end">
                        				<div onclick="printContent('HEMS INVOICE', null, 'invoicecontainer', true)" class="relative mr-4 inline-block">
                        					<div class="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 inline-flex items-center justify-center" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false" @click="printInvoice()">
                        						<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-printer" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        							<rect x="0" y="0" width="24" height="24" stroke="none"></rect>
                        							<path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"></path>
                        							<path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"></path>
                        							<rect x="7" y="13" width="10" height="8" rx="2"></rect>
                        						</svg>				  
                        					</div>
                        					<div x-show.transition="showTooltip" class="z-40 shadow-lg text-center w-32 block absolute right-0 top-0 p-2 mt-12 rounded-lg bg-gray-800 text-white text-xs" style="display: none;">
                        						Print this invoice!
                        					</div>
                        				</div>
                        				<div onclick="did('modalreceipt').classList.add('hidden')" class="relative inline-block">
                        					<div class="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 inline-flex items-center justify-center" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false" @click="printInvoice()">
                        						<span class="material-symbols-outlined text-red-500">cancel</span>	  
                        					</div>
                        					<div x-show.transition="showTooltip" class="z-40 shadow-lg text-center w-32 block absolute right-0 top-0 p-2 mt-12 rounded-lg bg-gray-800 text-white text-xs" style="display: none;">
                        						cancel
                        					</div>
                        				</div>
                        				
                        			</div>
                        			</div>
  </div>
                        
                        		<div class="flex flex-wrap justify-between mb-8">
                        			<div class="w-full md:w-1/3 mb-2 md:mb-0">
                        				<label class="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">Bill To Room:</label>
                        				<input id="rbillto" value="${data.roomnumber}" readonly class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                        				<input id="rroomnumber" readonly class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" >
                        				<input id="rpaymentmenthod" readonly class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Additional info" >
                        			</div>
                        			<div class="w-full md:w-1/3">
                        				<label class="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">From:</label>
                        				<input value="Hems Limited" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Your company name" >
                        
                        				<input class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Your company address" >
                        
                        				<input class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Additional info" >
                        			</div>
                                </div>
                                
                                <h3 class="text-xl font-bold"> Payment: </h3>
                                <ul class="text-md font-semibold text-grey-400 px-1">
                                    <li class="border rounded p-1 mt-1" style="display: flex;justify-content:space-between;width: 100%"><p>Date:</p> <span>${String(formatDate(getTodaysDate()))}</span></li>
                                    <li class="border rounded p-1 mt-1" style="display: flex;justify-content:space-between;width: 100%"><p>Debit:</p> <p>${formatCurrency(data.debit)}</p></li>
                                    <li class="border rounded p-1 mt-1" style="display: flex;justify-content:space-between;width: 100%"><p>Credit:</p> <p>${formatCurrency(data.credit)}</p></li>
                                    <li class="border rounded p-1 mt-1" style="display: flex;justify-content:space-between;width: 100%"><p>Balance:</p> <p>${formatCurrency(Number(data.debit) - Number(data.credit))}</p></li>
                                </ul>
                                
                        		
                        
                        		<div class="py-2 ml-auto mt-5 w-full sm:w-2/4 lg:w-1/4">
                        			<div class="flex justify-between mb-4">
                        				<div class="text-sm text-gray-600 text-right flex-1">VAT</div>
                        				<div class="text-right w-40">
                        					<div id="" class="text-sm text-gray-600" >0.00</div>
                        				</div>
                        			</div>
                        		
                        			<div class="py-2 border-t border-b">
                        				<div class="flex justify-between">
                        					<div class="text-xl text-gray-600 text-right flex-1">Total&nbsp;Balance</div>
                        					<div class="text-right w-40">
                        						<div id="rtotalpaid" class="text-xl text-gray-800 font-bold">${formatCurrency(Number(data.debit) - Number(data.credit))}</div>
                        					</div>
                        				</div>
                        			</div>
                                </div>
                        
                        		<div class="py-10 text-center">
                        			<p class="text-gray-600">Created by <a class="text-blue-600 hover:text-blue-500 border-b-2 border-blue-200 hover:border-blue-300" href="https://twitter.com/mithicher">Mira Technologies</a>.</p>
                                </div>
                        
                        		
                        
                        
                        
                        	</div>
    
    
    
    
    `
}

async function receiveablesFormSubmitHandler() {
    if(!validateForm('receiveablesform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#receiveablesform'), receiveablesid ? [['id', receiveablesid]] : null)
    let request = await httpRequest2('../controllers/receiveablescript', payload, document.querySelector('#receiveablesform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#receiveablesform').reset();
        fetchreceiveables();
        return
    }
    document.querySelector('#receiveablesform').reset();
    fetchreceiveables();
    return notification(request.message, 0);
}


// function runAdreceiveablesFormValidations() {
//     let form = document.getElementById('receiveablesform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#receiveablesname'))  controls.push([form.querySelector('#receiveablesname'), 'receiveables name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
