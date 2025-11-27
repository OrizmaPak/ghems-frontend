let purchaseorderid
let purchaseorderitem
let supplierdataa
async function purchaseorderActive() {
    const form = document.querySelector('#purchaseorderform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', purchaseorderFormSubmitHandler)
    datasource = []
    await requisititempurchaseorder()
    await fetchpurchaseorder()
    setTimeout(()=>{ 
        if(sessionStorage.getItem('purchaseordereditrequest')){
       let data =  sessionStorage.getItem('purchaseordereditrequest')
      sessionStorage.removeItem('purchaseordereditrequest')
       data = JSON.parse(data);
       purchaseorderid = data.items[0].batchid
       document.getElementById('owner').value = data.items[0].suppliername
       document.getElementById('transactiondate').value = data.items[0].transactiondate.split(' ')[0]
       document.getElementById('description').value = data.items[0].description
       document.getElementById('reference').value = data.items[0].reference
       did('tabledata').innerHTML = ``
       for(let i=0;i<data.items.length;i++){
           reqaddrowpurchaseorder(i)
           document.getElementById(`supplyfrom_${i}`).innerHTML = `<option value=''>-- Select item --</option>`
            document.getElementById(`supplyfrom_${i}`).innerHTML += purchaseorderitem.map(data=>`<option value='${data.itemid}'>${data.itemname}</option>`).join('')
           document.getElementById(`supplyfrom_${i}`).value = data.items[i].itemid;
           let dat = purchaseorderitem
            dat = dat.filter(item=>item.itemid==data.items[i].itemid)
            document.getElementById(`type_${i}`).innerHTML = dat[0].itemtype
            document.getElementById(`group_${i}`).innerHTML = dat[0].groupname
           reqstockbalance(data.items[i].itemid, i, data.items[i].location)
           document.getElementById(`cost_${i}`).value = Number(data.items[i].cost)
           document.getElementById(`qty_${i}`).value = Number(data.items[i].qty)
           document.getElementById(`val_${i}`).value = Number(data.items[i].qty) * Number(data.items[i].cost)
       }
       purchaseordertotalcount()
    }
    },1000)
    
    // await reqstockbalance()
} 

async function fetchpurchaseorder(id) {
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
            supplierdataa = request.data.data
               document.getElementById('supplierlist').innerHTML = request.data.data.map(dat=>`<option>${dat.companyname}</option>`)
            }
    }
    else return notification('No records retrieved')
}
async function requisititempurchaseorder(id) {
    let request = await httpRequest2('../controllers/fetchinventorylist', null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
            const items = normalizeInventoryItems(request.data)
            if(items.length) {
                purchaseorderitem = items
                populateReqSelect()
            }
    }
    else return notification('No records retrieved')
}

function populateReqSelect(){
    for(let i=0;i<document.getElementsByName('supplyfrom').length;i++){
        if(document.getElementsByName('supplyfrom')[i].children.length < 2){
            document.getElementsByName('supplyfrom')[i].innerHTML = `<option value=''>-- Select item --</option>`
            document.getElementsByName('supplyfrom')[i].innerHTML += purchaseorderitem.map(data=>`<option value='${data.itemid}'>${data.itemname}</option>`).join('')
            document.getElementsByName('supplyfrom')[i].addEventListener('change', e=>{
                let val = e.target.value
                let el = e.target.id.split('_')[1]
                reqstockbalance(val, el)
                if(!val){
                     document.getElementById(`type_${el}`).innerHTML = ''
                document.getElementById(`group_${el}`).innerHTML = ''
                document.getElementById(`class_${el}`).innerHTML = ''
                document.getElementById(`cost_${el}`).value = ''
                document.getElementById(`qty_${el}`).setAttribute('placeholder', 'Enter Quantity')
                }else{
                let data = purchaseorderitem
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

async function reqstockbalance (itemid, id, location=''){
     function getparamm(){
        let paramstr = new FormData()
        paramstr.append('itemid', itemid)
        const resolvedLocation = location || (typeof default_department !== 'undefined' ? default_department : '')
        paramstr.append('location', resolvedLocation)
        paramstr.append('salespoint', resolvedLocation)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchitembalanceinlocation', getparamm(), null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
            // if(request.data.length) {
                document.getElementById(`class_${id}`).innerHTML = request.balance
                
            // }
        }
    else return notification('No records retrieved')
}

function poreqcal(element){
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
    
    purchaseordertotalcount()
}

function purchaseordertotalcount(){
    let totalqty = 0
    let totalcost = 0
    
    for(let i=0;i<document.getElementsByName('qty').length;i++){
        if(document.getElementsByName('qty')[i].value)totalqty = Number(document.getElementsByName('qty')[i].value) + totalqty
        if(document.getElementsByName('cost')[i].value)totalcost = Number(document.getElementsByName('cost')[i].value) + totalcost
    }
    console.log('qty:', totalqty, 'totalcost:', totalcost)
    document.getElementById('totalorder').textContent = formatCurrency(totalqty*totalcost)
}

function reqaddrowpurchaseorder(idd=''){
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
                    <input onchange="poreqcal(this)" type="number" id="cost_${elid}" name="cost" class="form-control comp" placeholder="Enter Cost">
                </td>
                <td>
                <label class="hidden">Quantity</label>
                    <input onchange="poreqcal(this)" type="number" id="qty_${elid}" name="qty" class="form-control comp" placeholder="Enter Quantity">
                </td>
                <td>
                <label class="hidden">Value</label>
                    <input readonly type="text" id="val_${elid}" name="value[]" class="form-control comp" placeholder="">
                </td>
                <td>
                    <div class="flex gap-4 items-center h-full w-fit py-3">
                        <button onclick="reqaddrowpurchaseorder()" title="Edit row entry" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">add</button>
                        <button id="delbtn_${elid}" onclick="this.parentElement.parentElement.parentElement.remove()" title="Edit row entry" class="material-symbols-outlined rounded-full bg-[red] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
                    </div>
                </td>`
    el.innerHTML = x
    did('tabledata').appendChild(el)
    setTimeout(()=>{populateReqSelect()},1000)
    
}

async function removepurchaseorder(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this purchaseorder?");

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
    fetchpurchaseorder()
    return notification(request.message);
    
}


async function onpurchaseorderTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchpurchaseorder('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removepurchaseorder('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

function getidfromdata(value){
    return supplierdataa.filter(data=>data.companyname == value)[0].id
}

async function purchaseorderFormSubmitHandler() {
    let ids = getIdFromCls('comp')
    if(!validateForm('purchaseorderform', ids)) return
    // let payload

    // payload = getFormData2(document.querySelepurchaseorderidorderform'), purchaseorderid ? [['id', purchaseorderid]] : null)
    function payload(){
        let paramstr = new FormData()
    console.log(purchaseorderid)
          if(purchaseorderid)paramstr.append('batchid', purchaseorderid);
              paramstr.append('owner', getidfromdata(document.getElementById('owner').value));
              paramstr.append('transactiondate', document.getElementById('transactiondate').value);
              paramstr.append('description', document.getElementById('description').value);
              paramstr.append('reference', document.getElementById('reference').value);
              paramstr.append('entrypoint', 'PO');
              paramstr.append('rowsize', document.getElementsByName('supplyfrom').length);
              for (let i = 0; i < document.getElementsByName('supplyfrom').length; i++) {
                paramstr.append(`itemid${i + 1}`, document.getElementsByName('supplyfrom')[i].value);
                paramstr.append(`itemname${i + 1}`, getLabelByValue(document.getElementsByName('supplyfrom')[i].id, document.getElementsByName('supplyfrom')[i].value));
                paramstr.append(`qty${i + 1}`, document.getElementsByName('qty')[i].value);
                paramstr.append(`cost${i + 1}`, document.getElementsByName('cost')[i].value);
              }
              return paramstr
        
    }
    let request = await httpRequest2('../controllers/intakescript', payload(), document.querySelector('#purchaseorderform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#purchaseorder').click();
        // for(let i=0;i<document.getElementsByClassName('temprow').length;i++){
        //     document.getElementsByClassName('temprow')[i].remove()
        // }
        // fetchpurchaseorder();
        return
    }
    return notification(request.message, 0);
}


// function runAdpurchaseorderFormValidations() {
//     let form = document.getElementById('purchaseorderform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#purchaseordername'))  controls.push([form.querySelector('#purchaseordername'), 'purchaseorder name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
