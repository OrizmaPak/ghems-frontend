let requisitionid
let requisitionitem
async function requisitionActive() {
    // recalldatalist('STOCK')
    hemsdepartment2('STOCK')
    const form = document.querySelector('#requisitionform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', requisitionFormSubmitHandler)
    did('salespointname').addEventListener('change', e=>{
        // if(!did('salespointname').value)did('tabledata').classList.add('hidden')
        // if(did('salespointname').value)did('tabledata').classList.remove('hidden');
        requisititemrequisition()
    }) 
    datasource = []
    // if(document.querySelector('#salespointname'))document.querySelector('#salespointname').addEventListener('change', e=>())
    await requisititemrequisition('store')
    // did('tabledata').classList.remove('hidden');
    await fetchrequisition()
    setTimeout(()=>{
        if(sessionStorage.getItem('viewrequisitioneditrequest')){
           let data =  sessionStorage.getItem('viewrequisitioneditrequest')
          sessionStorage.removeItem('viewrequisitioneditrequest')
           requisitionid = data.batchid
           data = JSON.parse(data);
           document.getElementById('transactiondate').value = data.items[0].transactiondate.split(' ')[0]
           document.getElementById('description').value = data.items[0].description
           document.getElementById('reference').value = data.items[0].reference
           document.getElementById('salespointname').value = data.items[0].location
        //   did('tabledata').classList.remove('hidden')
           did('tabledata').innerHTML = ``
           for(let i=0;i<data.items.length;i++){
               reqaddrowrequisition(i)
               document.getElementById(`supplyfrom_${i}`).innerHTML = `<option value=''>-- Select item --</option>`
                document.getElementById(`supplyfrom_${i}`).innerHTML += requisitionitem.map(data=>`<option value='${data.itemid}'>${data.itemname}</option>`).join('')
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
           requisitiontotalcount()
        }
    },1000)
    // await reqstockbalance2()
}

async function fetchrequisition(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    // let request = await httpRequest2('../controllers/fetchlocation', id ? getparamm() : null, null, 'json')
    let request2 = await httpRequest2('../controllers/fetchsupplierscript', id ? getparamm() : null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    // if(request.status) {
    //     if(!id){
    //         if(request.data.length) {
    //           did('salespointname1').innerHTML = `<option value=''>-- Select Location To --</option>`
    //           did('salespointname1').innerHTML += request.data.map(dat=>`<option value='${dat.id}'>${dat.location}</option>`)
    //         }
    //     }else{
    //          requisitionid = request.data[0].id
    //         populateData(request.data[0])
    //     }
    // }
    // else notification('No records retrieved')
    if(request2.status) {
            if(request2.data.data.length) {
            supplierdataa = request2.data.data
               document.getElementById('supplierlist2').innerHTML = request2.data.data.map(dat=>`<option>${dat.companyname}</option>`)
            }
    }
    else notification('No records retrieved')
}


async function requisititemrequisition(store) {
    did('tabledata').innerHTML = 'Loading...'
     function payload(){
        let param = new FormData()
        if(!store)param.append('salespoint', did('salespointname').value)
        if(store)param.append('salespoint', default_department)
        return param 
    } 
    let request = await httpRequest2('../controllers/fetchinventorybysalespoint', payload(), document.querySelector('#updateinventoryform #save'))
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
                requisitionitem = request.data
                did('tabledata').innerHTML = `<tr id="reqrow_0">
                                                <td class="text-center opacity-70"> 
                                                <label class="hidden">Item</label>
                                                    <select name="supplyfrom" id="supplyfrom_0" class="form-control comp">
                                                        <option value=''>-- Select item --</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <p>Type: <span id="type_0"></span></p>
                                                    <p>Group: <span id="group_0"></span></p>
                                                    <p>Stock Balance: <span id="class_0"></span></p>
                                                </td>
                                                <td>
                                                    <label class="hidden">Cost</label>
                                                    <input onchange="requisitioncal2(this)" type="number" id="cost_0" name="cost" class="form-control comp" placeholder="Enter Cost">
                                                </td>
                                                <td>
                                                    <label class="hidden">Quantity</label>
                                                    <input onchange="requisitioncal2(this)" type="number" id="qty_0" name="qty" class="form-control comp" placeholder="Qty">
                                                </td>
                                                <td>
                                                    <label class="hidden">Value</label>
                                                    <input readonly type="text" id="val_0" name="value[]" class="form-control comp" placeholder="">
                                                </td>
                                                <td>
                                                    <div class="flex gap-4 items-center h-full w-fit py-3">
                                                        <button onclick="reqaddrowrequisition()" title="Edit row entry" class="hidden material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">add</button>
                                                        <button onclick="this.parentElement.parentElement.parentElement.remove()" title="Edit row entry" class="material-symbols-outlined rounded-full bg-[red] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
                                                        <!--<button onclick="reqaddrow()" title="Edit row entry" class="material-symbols-outlined rounded-full bg-[red] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>-->
                                                    </div>
                                                </td>
                                            </tr>`
                populateRequitionSelect2()
            }else{
                did('tabledata').innerHTML = request.message;
                return notification('No records retrieved')
            }
}

function populateRequitionSelect2(){
    for(let i=0;i<document.getElementsByName('supplyfrom').length;i++){
        if(document.getElementsByName('supplyfrom')[i].children.length < 2){ 
            document.getElementsByName('supplyfrom')[i].innerHTML = `<option value=''>-- Select item --</option>`
            document.getElementsByName('supplyfrom')[i].innerHTML += requisitionitem.map(data=>`<option value='${data.itemid}'>${data.itemname}</option>`).join('')
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
                document.getElementById(`qty_${el}`).setAttribute('placeholder', 'Qty')
                }else{
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

function requisitiontotalcount(){
    let totalqty = 0
    let totalcost = 0
    
    for(let i=0;i<document.getElementsByName('qty').length;i++){
        if(document.getElementsByName('qty')[i].value)totalqty = Number(document.getElementsByName('qty')[i].value) + totalqty
        if(document.getElementsByName('cost')[i].value)totalcost = Number(document.getElementsByName('cost')[i].value) + totalcost
    }
    console.log('qty:', totalqty, 'totalcost:', totalcost)
    document.getElementById('rptotalorder').textContent = formatCurrency(totalqty*totalcost)
}
  

async function reqstockbalance2 (itemid, id){
     function getparamm(){
        let paramstr = new FormData()
        paramstr.append('itemid', itemid) 
        const location = document.getElementById('salespointname') ? did('salespointname').value : ''
        paramstr.append('location', location)
        console.log('store:', store, 'default_department:', default_department, 'did(salespointname).value:', did('salespointname').value)
        if(!store)param.append('salespoint', did('salespointname').value)
        if(store)param.append('salespoint', default_department)    
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
    
    requisitiontotalcount()
    
}

function reqaddrowrequisition(idd=''){
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
                    <input onchange="requisitioncal2(this)" type="number" id="cost_${elid}" name="cost" class="form-control comp" placeholder="Enter Cost">
                </td>
                <td>
                <label class="hidden">Quantity</label>
                    <input onchange="requisitioncal2(this)" type="number" id="qty_${elid}" name="qty" class="form-control comp" placeholder="Qty">
                </td>
                <td>
                <label class="hidden">Value</label>
                    <input readonly type="text" id="val_${elid}" name="value[]" class="form-control comp" placeholder="">
                </td>
                <td>
                    <div class="flex gap-4 items-center h-full w-fit py-3">
                        <button onclick="reqaddrowrequisition()" title="Edit row entry" class="material-symbols-outlined hidden rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">add</button>
                        <button id="delbtn_${elid}" onclick="this.parentElement.parentElement.parentElement.remove()" title="Edit row entry" class="material-symbols-outlined rounded-full bg-[red] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
                    </div>
                </td>`
    el.innerHTML = x
    did('tabledata').appendChild(el)
    setTimeout(()=>{populateRequitionSelect2()},1000)
    
}

async function removerequisition(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this requisition?");

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
    fetchrequisition()
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

function getidfromdata2(value){
    return supplierdataa.filter(data=>data.companyname == value)[0].id
}

async function requisitionFormSubmitHandler() {
    if(document.getElementById('salespointname').value == document.getElementById('salespointname1').value)return notification('Source and Destination cannot be the same.', 0)
    let ids = getIdFromCls('comp')
    if(!validateForm('requisitionform', ids)) return
    // let payload

    // payload = getFormData2(document.querySelector('#requisitionform'), requisitionid ? [['id', requisitionid]] : null)
    function payload(){
        let paramstr = new FormData()
        if(requisitionid)paramstr.append('batchid', requisitionid);
              paramstr.append('locationto', document.getElementById('salespointname1').value);
              paramstr.append('locationfrom', document.getElementById('salespointname').value);
              paramstr.append('transactiondate', document.getElementById('transactiondate').value);
              paramstr.append('description', document.getElementById('description').value);
              paramstr.append('rowsize', document.getElementsByName('supplyfrom').length);
              for (let i = 0; i < document.getElementsByName('supplyfrom').length; i++) {
                // paramstr.append(`id${i + 1}`, document.getElementsByName('id')[i].value);
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
        document.getElementById('requisition').click()
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
