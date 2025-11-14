let expensesid
async function expensesActive() {
    const form = document.querySelector('#expensesform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', expensesFormSubmitHandler)
    if(document.querySelector('#submit1')) document.querySelector('#submit1').addEventListener('click', e=>fetchexpenses())
    if(document.querySelector('#additemrowexpenses')) document.querySelector('#additemrowexpenses').addEventListener('click', e=>additemrowexpenses(e))
    datasource = []
    await fetchexpenses()
    await fetchmanagesupplierforexpense()
    await getallaccountsexpense()
} 

function additemrowexpenses(e){
    e.preventDefault();
    let id = genID();
    let el = document.createElement('tr');
    el.id = `row-${id}`;
    el.innerHTML = `<td class="text-center opacity-70 s/n"></td>
                    <td class="text-center opacity-70">
                    <label class="control-label hidden">Account</label>
                        <input name="" id="item1-${id}" list="fetchglbyaccounttype" onchange="checkdatalist(this, 'item-${id}', 'fetchglbyaccounttypeaccountnumber')" type="text" class="form-control comp" placeholder="Enter Item"/>
                        <input name="item" id="item-${id}" type="text" class="form-control item hidden" placeholder="Enter Item"/>
                    </td>
                    <td class="text-center opacity-70">
                    <label class="control-label hidden">Amount</label>
                        <input name="amount" id="amount-${id}" onchange="calculateexpenses(this)" type="number" class="form-control amount" placeholder="Enter Amount"/>
                    </td>
                    <td class="text-center opacity-70">
                        <button onclick="this.parentElement.parentElement.remove();runCount()" title="Remove item" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">remove</button>
                    </td>`
    did('tabledata1').append(el);
    runCount()
}

function calculateexpenses(el){
    if(el.value < 0)notification('Please enter a valid amount', 0);
    if(el.value < 0)return el.value = 0;
    let x = 0;
    for(let i=0;i<document.getElementsByName('amount').length;i++){
        x = x + Number(document.getElementsByName('amount')[i].value);
    }
    did('totalamount').value = x;
    did('totalamountt').innerHTML = formatNumber(x);
}

async function fetchexpenses(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr 
        if(!id)paramstr = new FormData(document.getElementById('expenseformview'))
        if(id)paramstr = new FormData()
        if(id)paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchexpenses', getparamm(), did('submit1'), 'json')
    if(!id && document.getElementById('tabledata'))document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onexpensesTableDataSignal)
            }
        }else{
                expensesid = request.data[0].id
                populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function fetchmanagesupplierforexpense() {
    let request = await httpRequest2('../controllers/fetchsupplierscript', null, null, 'json')
    if(request.status) {
        did('supplierlister').innerHTML = request.data.data.map(data=>`<option value="${data.companyname}"></option>`).join('');
        did('supplierlisterid').innerHTML = request.data.data.map(data=>`<option value="${data.companyname}">${data.id}</option>`).join('');
    }
    else return notification('No records retrieved')
}

async function getallaccountsexpense() {
    let request = await httpRequest2('../controllers/fetchglbyaccounttype', null, null, 'json')
    if(request.status) {
        did('fetchglbyaccounttype').innerHTML = request.data.map(data=>`<option value="${data.description.trim()} (${data.accounttype})"></option>`).join('');
        did('fetchglbyaccounttypeaccountnumber').innerHTML = request.data.map(data=>`<option value="${data.description.trim()} (${data.accounttype})">${data.accountnumber}</option>`).join('');
    }
    else return notification('No records retrieved')
}

async function removeexpenses(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this expenses?");

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
    fetchexpenses()
    return notification(request.message);
    
}


async function onexpensesTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1 }</td>
        <td>${formatDateT(item.expensesbatch[0].transactiondate)}</td>
        <td>${item.expensesbatch[0].applyto}</td>
        <td>${item.expensesbatch[0].description}</td>
        <td>${formatDateT(item.totalamount)}</td>
        <td>${formatDateT(item.amountpaid)}</td>
        <td>${item.expensesbatch[0].paymentmethod}</td>
        <td class="flex items-center gap-3">
            <button title="View entry" onclick="modalexpense('${item.batchid}')" class="material-symbols-outlined rounded-full bg-green-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
            <button title="Edit row entry" onclick="fetchexpenses('${item.id}')" class="hidden material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeexpenses('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function modalexpense(batchid){
    if(!batchid)return
    let data1 = datasource.filter(dat=>dat.batchid == batchid)[0];
    
            did('tableheader').innerHTML = `
               <th>s/n </th>
                <th> Account </th>
                <th> Item Name </th>
                <th> amount </th>>
            `;
            did('modaldetails').innerHTML = `
                <p class="!text-sm font-thin"><img src="../images/${did('your_companylogo').value}" class="w-[100px] h-[100px]"></p>
                <div class="col-span-2">
                    <p class="!text-sm font-semibold flex w-full justify-between">Description: <span class="uppercase !text-sm font-normal text-left w-[50%]">${data1.expensesbatch[0].description}</span></p>
                    <p class="!text-sm font-semibold flex w-full justify-between">Total Amount: <span class="uppercase !text-sm font-normal text-left" style="">${formatNumber(data1.expensesbatch[0].totalamount)}</span></p>
                    <p class="!text-sm font-semibold flex w-full justify-between">Amount Paid: <span class="uppercase !text-sm font-normal text-left" style="">${formatNumber(data1.expensesbatch[0].amountpaid)}</span></p>
                    <p class="!text-sm font-semibold flex w-full justify-between">Ref: <span class="uppercase !text-sm font-normal text-left" style="">${data1.expensesbatch[0].reference}</span></p>
                    <p class="!text-sm font-semibold flex w-full justify-between">Payment Method: <span class="uppercase !text-sm font-normal text-left" style="">${data1.expensesbatch[0].paymentmethod}</span></p>
                    <p class="!text-sm font-semibold flex w-full justify-between">Transaction Date: <span class="uppercase !text-sm font-normal text-left" style="">${specialformatDateTime(data1.expensesbatch[0].transactiondate)}</span></p>
                    <div class="w-[150px] py-2 flex justify-center mx-8 bg-white p-5 rounded mt-2 bg-blue-400 hidden">
                        <span onclick="printDomContent('SALES REPORT', 'displaydetails')" class="cp material-symbols-outlined group-hover:text-primary-g scale-[1.5] text-white" style="font-size: 20px;">print</span>
                    </div>
                </div>
            `;
                
             did('tabledata2').innerHTML = 'No expense';
             did('tabledata2').innerHTML = data1.expensesbatch.map((dat, i)=>`
                    <tr>
                        <td>${i+1}</td>
                        <td>${dat.itemid}</td>
                        <td>${dat.itemname}</td>
                        <td style="width: 20px">${formatNumber(dat.totalamount)}</td>
                    </tr>
             `).join('');
             did('tabledata2').innerHTML += `
                    <tr>
                        <td>TOTAL</td>
                        <td></td>
                        <td></td>
                        <td style="width: 20px">${formatNumber(data1.expensesbatch[0].totalamount)}</td>
                    </tr>
             `
    
     did('expensemodal').classList.remove('hidden');
}

async function expensesFormSubmitHandler() {
    if(!validateForm('expensesform', getIdFromCls('comp'))) return notification('Please enter all compulsory fields', 0)
    
    givenamebyclass('item')
    givenamebyclass('amount')
    
    if(!Number(did('paidto').value)){
        if(did('amountpaid').value != did('totalamount').value)return notification('Amount paid does not match with the total amount', 0)
    }
    
    let payload

    payload = getFormData2(document.querySelector('#expensesform'), expensesid ? [['id', expensesid], ['rowsize', document.getElementsByClassName('item').length]] : [['rowsize', document.getElementsByClassName('item').length]])
    let request = await httpRequest2('../controllers/postexpenses', payload, document.querySelector('#expensesform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#expenses').click();
        fetchexpenses();
        return
    }
    // document.querySelector('#expensesform').reset();
    fetchexpenses();
    return notification(request.message, 0);
}




// function runAdexpensesFormValidations() {
//     let form = document.getElementById('expensesform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#expensesname'))  controls.push([form.querySelector('#expensesname'), 'expenses name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }