let returnsid
let returnsitem
let returntlist
async function returnsActive() {
    recalldatalist('STOCK')
    const form = document.querySelector('#returnsform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', returnsFormSubmitHandler)
    did('salespointname').addEventListener('change', e=>{
        // if(!did('salespointname').value)did('tabledata').classList.add('hidden')
        // if(did('salespointname').value)did('tabledata').classList.remove('hidden');
        requisititemreturns()
    })
    datasource = []
    // if(document.querySelector('#salespointname'))document.querySelector('#salespointname').addEventListener('change', e=>())
    await fetchreturns()
    checkreturnsedit()
    
    // did('tabledata').classList.remove('hidden');
    // await returnsstockbalance2()
}
  async  function checkreturnsedit(){
        if(sessionStorage.getItem('viewreturnseditrequest')){
           let data =  sessionStorage.getItem('viewreturnseditrequest')
          sessionStorage.removeItem('viewreturnseditrequest')
           data = JSON.parse(data);
           returnsid = data.data[0].ref
           document.getElementById('entrydate').value = data.data[0].entrydate.split(' ')[0]
        //   document.getElementById('description').value = data.data[0].description
        //   document.getElementById('reference').value = data.data[0].reference
          await  requisititemreturns(data.data[0].salespoint)
           document.getElementById('salespointname').value = data.data[0].salespoint
            // alert()
        //  await  requisititemreturns()
        //   did('tabledata').classList.remove('hidden')
           did('tabledata').innerHTML = ``
           console.log(data.data)
          for(let i=0;i<data.data.length;i++){
              reqaddrowreturns(i)
            //   document.getElementById(`supplyfrom_${i}`).innerHTML = returnsitem;
              document.getElementById(`supplyfrom_${i}`).value = data.data[i].itemid
              document.getElementById(`supplyfrom_${i}`).setAttribute('value', data.data[i].itemid)
              let dat = returnsitem
                dat = dat.filter(item=>item.itemid==data.data[i].itemid)
                document.getElementById(`type_${i}`).innerHTML = dat[0].itemtype
                document.getElementById(`group_${i}`).innerHTML = dat[0].groupname
              reqstockbalance(data.data[i].itemid, i, data.data[i].location)
            //   document.getElementById(`cost_${i}`).value = Number(data.data[i].cost)
              document.getElementById(`qty_${i}`).value = Number(data.data[i].qty)
              document.getElementById(`reason_${i}`).value = data.data[i].reason
           document.getElementById('salespointname').value = data.data[0].salespoint
               
          }
           setTimeout(()=>{document.getElementById('salespointname').value = data.data[0].salespoint},4000)
        //   returnstotalcount()
        }else await requisititemreturns(default_department)
    }

async function fetchreturns(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchsupplierscript', null, null, 'json')
    // let request2 = await httpRequest2('../controllers/fetchreturntypelists', id ? getparamm() : null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
              if(did('supplier'))did('supplier').innerHTML = `<option value=''>-- Select Supplier --</option>`
              if(did('supplier'))did('supplier').innerHTML += request.data.data.map(dat=>`<option value='${dat.id}'>${dat.companyname}</option>`).join('')
    }
    else notification(request.message,0)
    // if(request2.status) {
    //         // supplierdataa = request2.data.data
    //           returntlist =`<option value="">-- SELECT return TYPE --</option>`
    //           returntlist += request2.data.map(dat=>`<option>${dat.returntype}</option>`).join('');
    // }
    // else notification(request2.message, 0)
}


async function requisititemreturns(store='') {
    did('tabledata').innerHTML = 'Loading...'
     function payload(){
        let param = new FormData()
        if(!store)param.append('salespoint', did('salespointname').value)
        if(store)param.append('salespoint', store)
        return param 
    } 
    let request = await httpRequest2('../controllers/fetchinventorybysalespoint', payload(), document.querySelector('#updateinventoryform #save'))
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
                returnsitem = request.data
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
                                                    <label class="hidden">Quantity</label>
                                                    <input onchange="returnscal2(this)" type="number" id="qty_0" name="qty" class="form-control comp" placeholder="Qty">
                                                </td>
                                                <td>
                                                    <label class="hidden">return Type</label>
                                                    <input type="text" id="reason_0" name="returntype" class="form-control comp">
                                                </td>
                                                <td>
                                                    <div class="flex gap-4 items-center h-full w-fit py-3">
                                                        <button onclick="reqaddrowreturns()" title="Edit row entry" class="hidden material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">add</button>
                                                        <button onclick="this.parentElement.parentElement.parentElement.remove()" title="Edit row entry" class="material-symbols-outlined rounded-full bg-[red] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
                                                        <!--<button onclick="reqaddrow()" title="Edit row entry" class="material-symbols-outlined rounded-full bg-[red] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>-->
                                                    </div>
                                                </td>
                                            </tr>`
                populatereturnsSelect2()
            }else{
                did('tabledata').innerHTML = request.message;
                return notification('No records retrieved')
            }
}

function populatereturnsSelect2(){
    for(let i=0;i<document.getElementsByName('supplyfrom').length;i++){
        if(document.getElementsByName('supplyfrom')[i].children.length < 2){ 
                document.getElementsByName('supplyfrom')[i].innerHTML = `<option value=''>-- Select item --</option>`
                document.getElementsByName('supplyfrom')[i].innerHTML += returnsitem.map(data=>`<option value='${data.itemid}'>${data.itemname}</option>`).join('')

            
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
                    // if(document.getElementById('salespointname1')){
                    // if(!document.getElementById('salespointname1').value){
                    // notification('Please ensure destination has value before saving.')
                    // // document.getElementsByName(`supplyfrom_${el}`)[i].value = ''
                    // }}
                returnsstockbalance2(val, el)
                if(!val){
                document.getElementById(`type_${el}`).innerHTML = ''
                document.getElementById(`group_${el}`).innerHTML = ''
                document.getElementById(`class_${el}`).innerHTML = ''
                // document.getElementById(`cost_${el}`).value = ''
                document.getElementById(`qty_${el}`).setAttribute('placeholder', 'Qty')
                }else{
                let data = returnsitem
                data = data.filter(item=>item.itemid==val)
                document.getElementById(`type_${el}`).innerHTML = data[0].itemtype
                document.getElementById(`group_${el}`).innerHTML = data[0].groupname
                document.getElementById(`qty_${el}`).setAttribute('placeholder', data[0].units)
                // document.getElementById(`reason_${el}`).value = data[0].reason
                }
                // document.getElementById(`cost_${el}`).innerHTML = 0
            })
            
        }
    }
}

function returnstotalcount(){
    let totalqty = 0
    let totalcost = 0
    
    for(let i=0;i<document.getElementsByName('qty').length;i++){
        if(document.getElementsByName('qty')[i].value)totalqty = Number(document.getElementsByName('qty')[i].value) + totalqty
        // if(document.getElementsByName('cost')[i].value)totalcost = Number(document.getElementsByName('cost')[i].value) + totalcost
    }
    // console.log('qty:', totalqty, 'totalcost:', totalcost)
    // document.getElementById('rptotalorder').textContent = formatCurrency(totalqty*totalcost)
}


async function returnsstockbalance2 (itemid, id){
     function getparamm(){
        let paramstr = new FormData()
        paramstr.append('itemid', itemid)
        paramstr.append('location', document.getElementById('salespointname') ? did('salespointname').value : '')
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

function returnscal2(element){
    let el = element.id.split('_')[1]
    if(!did(`supplyfrom_${el}`).value){
        notification(`No Item Selected`, 0)
        did(`reason_${el}`).value = '';
        // did(`cost_${el}`).value = '';
        did(`qty_${el}`).value = '';
        return
    }
    if(Number(did(`class_${el}`).textContent)<Number(did(`qty_${el}`).value)){
        notification(`Quantity cannot exceed the stock balance`, 0)
        did(`qty_${el}`).value = ''
        return
    }
    // if(did(`cost_${el}`).value && did(`qty_${el}`).value){
    //     did(`reason_${el}`).value = Number(did(`cost_${el}`).value) * Number(did(`qty_${el}`).value)
    // }else{
    //     did(`reason_${el}`).value = '';
    // }
    
    // returnstotalcount()
    
}

function reqaddrowreturns(idd=''){
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
                <label class="hidden">Quantity</label>
                    <input onchange="returnscal2(this)" type="number" id="qty_${elid}" name="qty" class="form-control comp" placeholder="Qty">
                </td>
                <td>
                <label class="hidden">return Type</label>
                    <input type="text" id="reason_${elid}" name="returntype" class="form-control comp">
                </td>
                <td>
                    <div class="flex gap-4 items-center h-full w-fit py-3">
                        <button onclick="reqaddrowreturns()" title="Edit row entry" class="material-symbols-outlined hidden rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">add</button>
                        <button id="delbtn_${elid}" onclick="this.parentElement.parentElement.parentElement.remove()" title="Edit row entry" class="material-symbols-outlined rounded-full bg-[red] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
                    </div>
                </td>`
    el.innerHTML = x
    did('tabledata').appendChild(el)
    populatereturnsSelect2()
    
}

async function removereturns(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this returns?");

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
    fetchreturns()
    return notification(request.message);
    
}


async function onreturnsTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchreturns('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removereturns('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

function getidfromdata2(value){
    return supplierdataa.filter(data=>data.companyname == value)[0].id
}

async function returnsFormSubmitHandler() {
    // if(document.getElementById('salespointname').value == document.getElementById('salespointname1').value)return notification('Source and Destination cannot be the same.', 0)
    let ids = getIdFromCls('comp')
    if(!validateForm('returnsform', ids)) return notification('Please ensure all compulsory fields are filled', 0)
    // let payload

    // payload = getFormData2(document.querySelector('#returnsform'), returnsid ? [['id', returnsid]] : null)
    function payload(){
        let paramstr = new FormData()
        if(returnsid)paramstr.append('ref', returnsid);
              paramstr.append('salespoint', document.getElementById('salespointname').value);
              paramstr.append('entrydate', document.getElementById('entrydate').value);
              paramstr.append('intakeinvoicenumber', document.getElementById('intakeinvoicenumber').value);
              paramstr.append('supplierid', document.getElementById('supplier').value);
              paramstr.append('rowsize', document.getElementsByName('supplyfrom').length);
              for (let i = 0; i < document.getElementsByName('supplyfrom').length; i++) {
                // paramstr.append(`id${i + 1}`, document.getElementsByName('id')[i].value);
                paramstr.append(`itemid${i + 1}`, document.getElementsByName('supplyfrom')[i].value);
                paramstr.append(`itemname${i + 1}`, getLabelByValue(document.getElementsByName('supplyfrom')[i].id, document.getElementsByName('supplyfrom')[i].value));
                paramstr.append(`qty${i + 1}`, document.getElementsByName('qty')[i].value);
                paramstr.append(`reason${i + 1}`, document.getElementsByName('returntype')[i].value);
                // paramstr.append(`cost${i + 1}`, document.getElementsByName('cost')[i].value);
              }
              return paramstr
        
    }
    let request = await httpRequest2('../controllers/returnitems', payload(), document.querySelector('#returnsform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        did('returns').click()
        // fetchreturns();
        return
    }
    return notification(request.message, 0);
}


// function runAdreturnsFormValidations() {
//     let form = document.getElementById('returnsform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#returnsname'))  controls.push([form.querySelector('#returnsname'), 'returns name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }