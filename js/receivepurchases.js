let receivepurchasesid
let receivepurchasesitem
async function receivepurchasesActive() {
    recalldatalist()
    const form = document.querySelector('#receivepurchasesform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', receivepurchasesFormSubmitHandler)
    if(document.querySelector('#paymentmethod')) document.querySelector('#paymentmethod').addEventListener('click', checkotherbankdetails)
    did('reference').addEventListener('change', e=>checkreferenceforreceivepurchase())
    datasource = [] 
    await requisititemviewpurchases()
    await fetchreceivepurchases()
    setTimeout(()=>{
        if(sessionStorage.getItem('viewpurchaseseditrequest')){
           let data =  sessionStorage.getItem('viewpurchaseseditrequest')
          sessionStorage.removeItem('viewpurchaseseditrequest')
           receivepurchasesid = data.batchid
           data = JSON.parse(data);
           document.getElementById('owner').value = data.items[0].suppliername
           document.getElementById('transactiondate').value = data.items[0].transactiondate.split(' ')[0]
           document.getElementById('description').value = data.items[0].description
           document.getElementById('reference').value = data.items[0].reference
           document.getElementById('salespointnamemainstore').value = data.items[0].location
           did('tabledata').classList.remove('hidden')
           did('tabledata').innerHTML = ``
           for(let i=0;i<data.items.length;i++){
               reqaddrowreceivepurchases(i)
               document.getElementById(`supplyfrom_${i}`).innerHTML = `<option value=''>-- Select item --</option>`
                document.getElementById(`supplyfrom_${i}`).innerHTML += receivepurchasesitem.map(data=>`<option value='${data.itemid}'>${data.itemname}</option>`).join('')
               document.getElementById(`supplyfrom_${i}`).value = data.items[i].itemid
               let dat = purchaseorderitem
                dat = dat.filter(item=>item.itemid==data.items[i].itemid)
                document.getElementById(`type_${i}`).innerHTML = dat[0].itemtype
                document.getElementById(`group_${i}`).innerHTML = dat[0].groupname
               reqstockbalance(data.items[i].itemid, i, data.items[i].location)
               document.getElementById(`cost_${i}`).value = Number(data.items[i].cost)
               document.getElementById(`qty_${i}`).value = Number(data.items[i].qty)
               document.getElementById(`val_${i}`).value = Number(data.items[i].qty) * Number(data.items[i].cost)
               
           }
           receivepurchasestotalcount()
        }
    },1000)
    // await reqstockbalance2()
}

async function checkreferenceforreceivepurchase(){
    if(!did('reference').value)return;
    let param = new FormData()
    param.append('invoicenumber', did('reference').value)
    param.append('entrypoint', 'PO')
    let request = await httpRequest2('../controllers/fetchintakes', param, null, 'json')
    if(request.status){
        did('owner').value = request.data[0].suppliername
        did('tabledata').innerHTML = request.data.map((dat, elid)=>{
            let datt = receivepurchasesitem
            datt = datt.filter(item=>item.itemid==dat.itemid)
        return`
            <tr id="reqrow_${elid}">
                <td class="text-center opacity-70"> 
                    <label class="hidden">Item</label>
                    <select name="supplyfrom" id="supplyfrom_${elid}" class="form-control comp">
                        <option value=''>-- Select item --</option>
                        ${receivepurchasesitem.map(data=>`<option ${dat.itemid == data.itemid ? 'selected' : ''} value='${data.itemid}'>${data.itemname}</option>`).join('')}
                    </select>
                </td>
                <td>
                    <p>Type: <span id="type_${elid}">${datt[0].itemtype}</span></p>
                    <p>Group: <span id="group_${elid}">${datt[0].groupname}</span></p>
                    <p>Stock Balance: <span id="class_${elid}">${reqstockbalance2(dat.itemid, elid, true)}</span></p>
                </td>
                <td>
                <label class="hidden">Cost</label>
                    <input onchange="rpreqcal(this)" type="number" id="cost_${elid}" name="cost" value="${dat.cost}" class="form-control comp" placeholder="Enter Cost">
                </td>
                <td>
                <label class="hidden">Quantity</label>
                    <input onchange="rpreqcal(this)" type="number" id="qty_${elid}" name="qty" value="${dat.qty}" class="form-control comp" placeholder="Enter Quantity">
                </td>
                <td>
                <label class="hidden">Value</label>
                    <input readonly type="text" id="val_${elid}" value="${Number(dat.qty)*Number(dat.cost)}" name="value[]" class="form-control comp" placeholder="">
                </td>
                <td>
                    <div class="flex gap-4 items-center h-full w-fit py-3">
                        <button onclick="reqaddrow()" title="Edit row entry" class="hidden material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">add</button>
                        <button id="delbtn_${elid}" onclick="this.parentElement.parentElement.parentElement.remove();receivepurchasestotalcount()" title="Edit row entry" class="material-symbols-outlined rounded-full bg-[red] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
                    </div>
                </td>
            </tr>
        `})
        setTimeout(()=>{populateReqSelect2()}, 3000)
        
    }else return
}

async function fetchreceivepurchases(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchlocation', id ? getparamm() : null, null, 'json')
    let request2 = await httpRequest2('../controllers/fetchsupplierscript', id ? getparamm() : null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
            //   did('salespointnamemainstore').innerHTML = `<option value=''>-- Select Location To --</option>`
            //   did('salespointnamemainstore').innerHTML += request.data.map(dat=>`<option value='${dat.id}'>${dat.location}</option>`)
            }
        }else{
             receivepurchasesid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else notification('No records retrieved')
    if(request2.status) {
            if(request2.data.data.length) {
            supplierdataa = request2.data.data
               document.getElementById('supplierlist2').innerHTML = request2.data.data.map(dat=>`<option>${dat.companyname}</option>`)
            }
    }
    else notification('No records retrieved')
}


async function requisititemviewpurchases(id) {
    let request = await httpRequest2('../controllers/fetchinventorylist', null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
            const items = normalizeInventoryItems(request.data)
            if(items.length) {
                receivepurchasesitem = items
                populateReqSelect2()
            }
    }
    else return notification('No records retrieved')
}

function populateReqSelect2(){
    for(let i=0;i<document.getElementsByName('supplyfrom').length;i++){
        if(document.getElementsByName('supplyfrom')[i].children.length < 2){
            document.getElementsByName('supplyfrom')[i].innerHTML = `<option value=''>-- Select item --</option>`
            document.getElementsByName('supplyfrom')[i].innerHTML += receivepurchasesitem.map(data=>`<option value='${data.itemid}'>${data.itemname}</option>`).join('')
            document.getElementsByName('supplyfrom')[i].addEventListener('change', e=>{
                let val = e.target.value
                 // THIS IS TO MAKE SURE THAT ITEM SELECTED CANNOT BE SELECTED AGAIN
                let m = true
                for(let i=0;i<document.getElementsByName('supplyfrom').length;i++){
                    if(document.getElementsByName('supplyfrom')[i] != e.target && document.getElementsByName('supplyfrom')[i].value == e.target.value)m = false
                }
                if(!m){
                    e.target.value = '';
                    return notification('The item selected has already been select before please select another item', 0)
                }
                let el = e.target.id.split('_')[1]
                    if(document.getElementById('salespointname1')){
                    if(!document.getElementById('salespointname1').value){
                    notification('Please ensure destination has value before saving.')
                    // document.getElementsByName(`supplyfrom_${el}`)[i].value = ''
                    }}
                reqstockbalance2(val, el)
                if(!val){
                     document.getElementById(`type_${el}`).innerHTML = ''
                document.getElementById(`group_${el}`).innerHTML = ''
                document.getElementById(`class_${el}`).innerHTML = ''
                document.getElementById(`cost_${el}`).value = ''
                document.getElementById(`qty_${el}`).setAttribute('placeholder', 'Enter Quantity')
                }else{
                let data = receivepurchasesitem
                data = data.filter(item=>item.itemid==val)
                document.getElementById(`type_${el}`).innerHTML = data[0].itemtype
                document.getElementById(`group_${el}`).innerHTML = data[0].groupname
                document.getElementById(`qty_${el}`).setAttribute('placeholder', data[0].units)
                document.getElementById(`cost_${el}`).value = Number(data[0].price)
                }
                // document.getElementById(`cost_${el}`).innerHTML = 0
            })
            
        }
    }
}


function receivepurchasestotalcount(){
    let totalqty = 0
    let totalcost = 0
    
    for(let i=0;i<document.getElementsByName('qty').length;i++){
        if(document.getElementsByName('qty')[i].value)totalqty = Number(document.getElementsByName('qty')[i].value) + totalqty
        if(document.getElementsByName('cost')[i].value)totalcost = Number(document.getElementsByName('cost')[i].value) + totalcost
    }
    console.log('qty:', totalqty, 'totalcost:', totalcost)
    document.getElementById('rptotalorder').textContent = formatCurrency(totalqty*totalcost)
}


async function reqstockbalance2 (itemid, id, direct=false){
     function getparamm(){
        let paramstr = new FormData()
        paramstr.append('itemid', itemid)
        const location = document.getElementById('salespointnamemainstore') ? did('salespointnamemainstore').value : ''
        if(!location){
            notification('Please select a location before choosing items.', 0)
            return null
        }
        paramstr.append('location', location)
        return paramstr
    }
    const params = getparamm()
    if(!params)return
    let request = await httpRequest2('../controllers/fetchitembalanceinlocation', params, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
            // if(request.data.length) {
                document.getElementById(`class_${id}`).innerHTML = request.balance
               if(direct)return request.balance
            // }
        }
    else return notification('No records retrieved')
}

function rpreqcal(element){
    let el = element.id.split('_')[1]
    if(!did(`supplyfrom_${el}`).value){
        notification(`No Item Selected`, 0)
        did(`val_${el}`).value = '';
        did(`cost_${el}`).value = '';
        did(`qty_${el}`).value = '';
        return
    }
    // if(Number(did(`class_${el}`).textContent)<Number(did(`qty_${el}`).value)){
    //     notification(`Quantity cannot exceed the stock balance`, 0)
    //     did(`qty_${el}`).value = ''
    //     return
    // }
    if(did(`cost_${el}`).value && did(`qty_${el}`).value){
        did(`val_${el}`).value = Number(did(`cost_${el}`).value) * Number(did(`qty_${el}`).value)
    }else{
        did(`val_${el}`).value = '';
    }
    
    receivepurchasestotalcount()
    
}

function reqaddrowreceivepurchases(idd=''){
    let el = document.createElement('tr')
    el.classList.add('temprow')
    let elid 
    if(idd !==  '')elid = idd
    if(idd === '')elid = genID();
    el.id = `reqrow_${elid}`
    let x = `<td class="text-center opacity-70"> 
                    <label class="hidden">Item</label>
                    <select name="supplyfrom" id="supplyfrom_${elid}" class="form-control comp">
                        <option value=''>-- Select item --</option>
                        
                    </select>
                </td>
                <td>
                    <p>Type: <span id="type_${elid}"></span></p>
                    <p>Group: <span id="group_${elid}"></span></p>
                    <p>Stock Balance: <span id="class_${elid}"></span></p>
                </td>
                <td>
                <label class="hidden">Cost</label>
                    <input onchange="rpreqcal(this)" type="number" id="cost_${elid}" name="cost" class="form-control comp" placeholder="Enter Cost">
                </td>
                <td>
                <label class="hidden">Quantity</label>
                    <input onchange="rpreqcal(this)" type="number" id="qty_${elid}" name="qty" class="form-control comp" placeholder="Enter Quantity">
                </td>
                <td>
                <label class="hidden">Value</label>
                    <input readonly type="text" id="val_${elid}" name="value[]" class="form-control comp" placeholder="">
                </td>
                <td>
                    <div class="flex gap-4 items-center h-full w-fit py-3">
                        <button onclick="reqaddrow()" title="Edit row entry" class="hidden material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">add</button>
                        <button id="delbtn_${elid}" onclick="this.parentElement.parentElement.parentElement.remove();receivepurchasestotalcount()" title="Edit row entry" class="material-symbols-outlined rounded-full bg-[red] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
                    </div>
                </td>`
    el.innerHTML = x
    did('tabledata').appendChild(el)
    setTimeout(()=>{populateReqSelect2()},1000)
    
}

async function removereceivepurchases(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this receivepurchases?");

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
    fetchreceivepurchases()
    return notification(request.message);
    
}


async function onreceivepurchasesTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchreceivepurchases('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removereceivepurchases('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

function getidfromdata2(value){
    return supplierdataa.filter(data=>data.companyname == value)[0].id
}

async function receivepurchasesFormSubmitHandler() {
    let ids = getIdFromCls('comp')
    if(!validateForm('receivepurchasesform', ids)) return
    // let payload

    // payload = getFormData2(document.querySelector('#receivepurchasesform'), receivepurchasesid ? [['id', receivepurchasesid]] : null)
    function payload(){
        let paramstr = new FormData()
        //   if(batchid)paramstr.append('batchid', updatebatchidout);
              paramstr.append('owner', getidfromdata2(document.getElementById('owner').value));
              paramstr.append('salespointnamemainstore', document.getElementById('salespointnamemainstore').value);
              paramstr.append('transactiondate', document.getElementById('transactiondate').value);
              paramstr.append('description', document.getElementById('description').value);
              paramstr.append('reference', document.getElementById('reference').value);
              paramstr.append('amountpaid', document.getElementById('amountpaid').value);
              paramstr.append('paymentmethod', document.getElementById('paymentmethod').value);
              paramstr.append('entrypoint', 'RP');
              paramstr.append('rowsize', document.getElementsByName('supplyfrom').length);
              for (let i = 0; i < document.getElementsByName('supplyfrom').length; i++) {
                paramstr.append(`itemid${i + 1}`, document.getElementsByName('supplyfrom')[i].value);
                paramstr.append(`itemname${i + 1}`, getLabelByValue(document.getElementsByName('supplyfrom')[i].id, document.getElementsByName('supplyfrom')[i].value));
                paramstr.append(`qty${i + 1}`, document.getElementsByName('qty')[i].value);
                paramstr.append(`cost${i + 1}`, document.getElementsByName('cost')[i].value);
              }
              return paramstr
        
    }
    let request = await httpRequest2('../controllers/intakescript', payload(), document.querySelector('#receivepurchasesform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        location.reload()
        // fetchreceivepurchases();
        return
    }
    return notification(request.message, 0);
}


// function runAdreceivepurchasesFormValidations() {
//     let form = document.getElementById('receivepurchasesform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#receivepurchasesname'))  controls.push([form.querySelector('#receivepurchasesname'), 'receivepurchases name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
