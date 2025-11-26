let requisitionid
let requisitionitem
async function requisitionActive() {
    recalldatalist()
    const form = document.querySelector('#requisitionform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', requisitionFormSubmitHandler) 
    did('locationfrom').addEventListener('change', e=>{
        if(!did('locationfrom').value)did('tabledata').classList.add('hidden')
        if(did('locationfrom').value)did('tabledata').classList.remove('hidden')
    })
    datasource = []
    await requisititem()
    await fetchrequisition()
    setTimeout(()=>{
        if(sessionStorage.getItem('viewrequisitioneditrequest')){
           let data =  sessionStorage.getItem('viewrequisitioneditrequest')
        //   sessionStorage.removeItem('viewrequisitioneditrequest')
           data = JSON.parse(data);
           did('tabledata').classList.remove('hidden')
           requisitionid = data.batchid
        //   document.getElementById('locationfrom').value = data.items[0].locationfrom
           document.getElementById('transactiondate').value = data.items[0].transactiondate.split(' ')[0]
           document.getElementById('description').value = data.items[0].description
           document.getElementById('reference').value = data.items[0].reference
           document.getElementById('locationfrom').value = data.items[0].location
          getlocationto(data.items[0].reference)
           
          did('tabledata').classList.remove('hidden')
          did('tabledata').innerHTML = ``
          for(let i=0;i<data.items.length;i++){
              reqaddrowrequisition(i)
              document.getElementById(`supplyfrom_${i}`).innerHTML = `<option value=''>-- Select item --</option>`
                document.getElementById(`supplyfrom_${i}`).innerHTML += requisitionitem.map(data=>`<option value='${data.itemid}'>${data.itemname}</option>`).join('')
              document.getElementById(`supplyfrom_${i}`).value = data.items[i].itemid
              let dat = requisitionitem
                dat = dat.filter(item=>item.itemid==data.items[i].itemid)
                document.getElementById(`type_${i}`).innerHTML = dat[0].itemtype
                document.getElementById(`group_${i}`).innerHTML = dat[0].groupname
              reqstockbalance(data.items[i].itemid, i, data.items[i].location)
              document.getElementById(`cost_${i}`).value = Number(data.items[i].cost) 
              document.getElementById(`qty_${i}`).value = Number(data.items[i].qty)
              document.getElementById(`val_${i}`).value = Number(data.items[i].qty) * Number(data.items[i].cost)
              document.getElementById(`rowid_${i}`).value = Number(data.items[i].id) 
               
          }
        }
    },1000)
    // await reqstockbalance()
}

async function getlocationto(ref){
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('reference', ref)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchouttakelocationto', getparamm(), null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        console.log('locationto', request.data.location)
         document.getElementById('locationto').value =  request.data.location
    }
    else return notification('No records retrieved')
}

async function fetchrequisition(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchlocation', id ? getparamm() : null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
               did('locationto').innerHTML = `<option value=''>-- Select Location To --</option>`
               did('locationto').innerHTML += request.data.map(dat=>`<option value='${dat.id}'>${dat.location}</option>`)
               did('locationfrom').innerHTML =  `<option value=''>-- Select Location From --</option>`
               did('locationfrom').innerHTML += request.data.map(dat=>`<option value='${dat.id}'>${dat.location}</option>`)
            }
        }else{
             requisitionid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}
async function requisititem(id) {
    let request = await httpRequest2('../controllers/fetchinventorylist', null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
            const items = normalizeInventoryItems(request.data)
            if(items.length) {
                requisitionitem = items
                populateReqSelectrequisition()
            }
    }
    else return notification('No records retrieved')
}

function populateReqSelectrequisition(){
    for(let i=0;i<document.getElementsByName('supplyfrom').length;i++){
        if(document.getElementsByName('supplyfrom')[i].children.length < 2){
            document.getElementsByName('supplyfrom')[i].innerHTML = `<option value=''>-- Select item --</option>`
            document.getElementsByName('supplyfrom')[i].innerHTML += requisitionitem.map(data=>`<option value='${data.itemid}'>${data.itemname}</option>`).join('')
            document.getElementsByName('supplyfrom')[i].addEventListener('change', e=>{
                let val = e.target.value
                let el = e.target.id.split('_')[1]
                if(!document.getElementById('locationfrom').value){
                    notification('Supply from does not have a value')
                    document.getElementsByName(`supplyfrom_${el}`)[i].value = ''
                    return
                }
                reqstockbalance(val, el)
                
                     document.getElementById(`type_${el}`).innerHTML = ''
                document.getElementById(`group_${el}`).innerHTML = ''
                document.getElementById(`class_${el}`).innerHTML = ''
                document.getElementById(`cost_${el}`).value = ''
                document.getElementById(`qty_${el}`).value = ''
                document.getElementById(`qty_${el}`).setAttribute('placeholder', 'Enter Quantity')
                if(val){
                let data = requisitionitem
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

async function reqstockbalance (itemid, id){
     function getparamm(){
        let paramstr = new FormData()
        paramstr.append('itemid', itemid)
        paramstr.append('location', did('locationfrom').value)
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

function requisitioncal2(element){
    let el = element.id.split('_')[1]
    if(!did(`supplyfrom_${el}`).value){
        notification(`No Item Selected`, 0)
        did(`val_${el}`).value = '';
        did(`cost_${el}`).value = '';
        did(`qty_${el}`).value = '';
        return
    }
    if(Number(did(`class_${el}`).textContent)<Number(did(`qty_${el}`).value)){
        notification(`Quantity cannot exceed the stock balance`, 0)
        did(`qty_${el}`).value = ''
        return
    }
    if(did(`cost_${el}`).value && did(`qty_${el}`).value){
        did(`val_${el}`).value = Number(did(`cost_${el}`).value) * Number(did(`qty_${el}`).value)
    }else{
        did(`val_${el}`).value = '';
    }
    
}

function reqaddrowrequisition(idd=''){
    let el = document.createElement('tr')
    el.classList.add('temprow')
    let elid 
    if(idd !==  '')elid = idd
    if(idd === '')elid = genID();
    el.id = `reqrow_${elid}`
    let x = `<td class="text-center opacity-70"> 
                    <input id="rowid_${elid}" name="id" type="hidden" />
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
                    <input onchange="requisitioncal2(this)" type="number" id="cost_${elid}" name="cost" class="form-control comp" placeholder="Enter Cost">
                </td>
                <td>
                <label class="hidden">Quantity</label>
                    <input onchange="requisitioncal2(this)" type="number" id="qty_${elid}" name="qty" class="form-control comp" placeholder="Enter Quantity">
                </td>
                <td>
                <label class="hidden">Value</label>
                    <input readonly type="text" id="val_${elid}" name="value[]" class="form-control comp" placeholder="">
                </td>
                <td>
                    <div class="flex gap-4 items-center h-full w-fit py-3">
                        <button onclick="reqaddrowrequisition()" title="Edit row entry" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">add</button>
                        <button id="delbtn_${elid}" onclick="reqdelrowrequisition(this)" title="Edit row entry" class="material-symbols-outlined rounded-full bg-[red] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
                    </div>
                </td>`
    el.innerHTML = x
    did('tabledata').appendChild(el)
    setTimeout(()=>{populateReqSelectrequisition()},1000)
    
}

async function reqdelrowrequisition(element) {
    let el = element.id.split('_')[1]
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this Item?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }
    
    if(document.getElementById(`rowid_${el}`).value){
        function getparamm() {
            let paramstr = new FormData();
            paramstr.append('id', document.getElementById(`rowid_${el}`).value);
            return paramstr;
        }
    
        let request = await httpRequest2('../controllers/removeouttakebyid', getparamm(), null, 'json');
        if(request.status){
            notification('Item deleted')
            document.getElementById(`reqrow_${el}`).remove()
        }else return notification('failed to remove item')
    }else{
        document.getElementById(`reqrow_${el}`).remove()
    }

    
    // Show notification based on the result
    // fetchrequisition()
    return notification(request.message);
    
}


async function onrequisitionTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchrequisition('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removerequisition('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function requisitionFormSubmitHandler() {
    let ids = getIdFromCls('comp')
    if(!validateForm('requisitionform', ids)) return
    // let payload

    // payload = getFormData2(document.querySelector('#requisitionform'), requisitionid ? [['id', requisitionid]] : null)
    function payload(){
        let paramstr = new FormData()
          if(requisitionid)paramstr.append('batchid', requisitionid);
              paramstr.append('locationto', document.getElementById('locationto').value);
              paramstr.append('locationfrom', document.getElementById('locationfrom').value);
              paramstr.append('transactiondate', document.getElementById('transactiondate').value);
              paramstr.append('description', document.getElementById('description').value);
              paramstr.append('rowsize', document.getElementsByName('supplyfrom').length);
              for (let i = 0; i < document.getElementsByName('supplyfrom').length; i++) {
                paramstr.append(`id${i + 1}`, document.getElementsByName('id')[i].value);
                paramstr.append(`itemid${i + 1}`, document.getElementsByName('supplyfrom')[i].value);
                paramstr.append(`itemname${i + 1}`, getLabelByValue(document.getElementsByName('supplyfrom')[i].id, document.getElementsByName('supplyfrom')[i].value));
                paramstr.append(`qty${i + 1}`, document.getElementsByName('qty')[i].value);
                paramstr.append(`cost${i + 1}`, document.getElementsByName('cost')[i].value);
              }
              return paramstr
        
    }
    let request = await httpRequest2('../controllers/outtakescript', payload(), document.querySelector('#requisitionform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#requisitionform').reset();
        for(let i=0;i<document.getElementsByClassName('temprow').length;i++){
            document.getElementsByClassName('temprow')[i].remove()
        }
        // fetchrequisition();
        return
    }
    return notification(request.message, 0);
}


// function runAdrequisitionFormValidations() {
//     let form = document.getElementById('requisitionform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#requisitionname'))  controls.push([form.querySelector('#requisitionname'), 'requisition name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
