let issuelogid
let issuelogitem
let issuetlist
async function issuelogActive() {
    recalldatalist()
    const form = document.querySelector('#issuelogform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', issuelogFormSubmitHandler)
    did('salespointname').addEventListener('change', e=>{
        // if(!did('salespointname').value)did('tabledata').classList.add('hidden')
        // if(did('salespointname').value)did('tabledata').classList.remove('hidden');
        requisititemissuelog()
    }) 
    datasource = []
    // if(document.querySelector('#salespointname'))document.querySelector('#salespointname').addEventListener('change', e=>())
    await fetchissuelog()
    checkissuelogedit()
    
    // did('tabledata').classList.remove('hidden');
    // await issuelogstockbalance2()
}
  async  function checkissuelogedit(){
        if(sessionStorage.getItem('viewissuelogeditrequest')){
           let data =  sessionStorage.getItem('viewissuelogeditrequest')
          sessionStorage.removeItem('viewissuelogeditrequest')
           data = JSON.parse(data);
           issuelogid = data.data[0].ref
           document.getElementById('entrydate').value = data.data[0].entrydate.split(' ')[0]
        //   document.getElementById('description').value = data.data[0].description
        //   document.getElementById('reference').value = data.data[0].reference
          await  requisititemissuelog(data.data[0].salespoint)
           document.getElementById('salespointname').value = data.data[0].salespoint
            // alert()
        //  await  requisititemissuelog()
        //   did('tabledata').classList.remove('hidden')
           did('tabledata').innerHTML = ``
           console.log(data.data)
          for(let i=0;i<data.data.length;i++){
              reqaddrowissuelog(i)
            //   document.getElementById(`supplyfrom_${i}`).innerHTML = issuelogitem;
              document.getElementById(`supplyfrom_${i}`).value = data.data[i].itemid
              document.getElementById(`supplyfrom_${i}`).setAttribute('value', data.data[i].itemid)
              let dat = issuelogitem
                dat = dat.filter(item=>item.itemid==data.data[i].itemid)
                document.getElementById(`type_${i}`).innerHTML = dat[0].itemtype
                document.getElementById(`group_${i}`).innerHTML = dat[0].groupname
              reqstockbalance(data.data[i].itemid, i, data.data[i].location)
            //   document.getElementById(`cost_${i}`).value = Number(data.data[i].cost)
              document.getElementById(`qty_${i}`).value = Number(data.data[i].qty)
              document.getElementById(`issuetype_${i}`).value = data.data[i].typeofissue
           document.getElementById('salespointname').value = data.data[0].salespoint
               
          }
           setTimeout(()=>{document.getElementById('salespointname').value = data.data[0].salespoint},4000)
        //   issuelogtotalcount()
        }else await requisititemissuelog(default_department)
    }

async function fetchissuelog(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchsupplierscript', null, null, 'json')
    let request2 = await httpRequest2('../controllers/fetchissuetypelists', id ? getparamm() : null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
              if(did('supplier'))did('supplier').innerHTML = `<option value=''>-- Select Supplier --</option>`
              if(did('supplier'))did('supplier').innerHTML += request.data.data.map(dat=>`<option value='${dat.id}'>${dat.companyname}</option>`).join('')
    }
    else notification(request.message,0)
    if(request2.status) {
            // supplierdataa = request2.data.data
               issuetlist =`<option value="">-- SELECT ISSUE TYPE --</option>`
               issuetlist += request2.data.map(dat=>`<option>${dat.issuetype}</option>`).join('');
    }
    else notification(request2.message, 0)
}


async function requisititemissuelog(store='') {
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
                issuelogitem = request.data
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
                                                    <input onchange="issuelogcal2(this)" type="number" id="qty_0" name="qty" class="form-control comp" placeholder="Qty">
                                                </td>
                                                <td>
                                                    <label class="hidden">Issue Type</label>
                                                    <select type="text" id="issuetype_0" name="issuetype" class="form-control comp">
                                                        ${issuetlist}
                                                    </select>
                                                </td>
                                                <td>
                                                    <div class="flex gap-4 items-center h-full w-fit py-3">
                                                        <button onclick="reqaddrowissuelog()" title="Edit row entry" class="hidden material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">add</button>
                                                        <button onclick="this.parentElement.parentElement.parentElement.remove()" title="Edit row entry" class="material-symbols-outlined rounded-full bg-[red] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
                                                        <!--<button onclick="reqaddrow()" title="Edit row entry" class="material-symbols-outlined rounded-full bg-[red] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>-->
                                                    </div>
                                                </td>
                                            </tr>`
                populateIssuelogSelect2()
            }else{
                did('tabledata').innerHTML = request.message;
                return notification('No records retrieved')
            }
}

function populateIssuelogSelect2(){
    for(let i=0;i<document.getElementsByName('supplyfrom').length;i++){
        if(document.getElementsByName('supplyfrom')[i].children.length < 2){ 
                document.getElementsByName('supplyfrom')[i].innerHTML = `<option value=''>-- Select item --</option>`
                document.getElementsByName('supplyfrom')[i].innerHTML += issuelogitem.map(data=>`<option value='${data.itemid}'>${data.itemname}</option>`).join('')

            
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
                issuelogstockbalance2(val, el)
                if(!val){
                document.getElementById(`type_${el}`).innerHTML = ''
                document.getElementById(`group_${el}`).innerHTML = ''
                document.getElementById(`class_${el}`).innerHTML = ''
                // document.getElementById(`cost_${el}`).value = ''
                document.getElementById(`qty_${el}`).setAttribute('placeholder', 'Qty')
                }else{
                let data = issuelogitem
                data = data.filter(item=>item.itemid==val)
                document.getElementById(`type_${el}`).innerHTML = data[0].itemtype
                document.getElementById(`group_${el}`).innerHTML = data[0].groupname
                document.getElementById(`qty_${el}`).setAttribute('placeholder', data[0].units)
                document.getElementById(`issuetype_${el}`).value = data[0].typeofissue
                }
                // document.getElementById(`cost_${el}`).innerHTML = 0
            })
            
        }
    }
}

function issuelogtotalcount(){
    let totalqty = 0
    let totalcost = 0
    
    for(let i=0;i<document.getElementsByName('qty').length;i++){
        if(document.getElementsByName('qty')[i].value)totalqty = Number(document.getElementsByName('qty')[i].value) + totalqty
        // if(document.getElementsByName('cost')[i].value)totalcost = Number(document.getElementsByName('cost')[i].value) + totalcost
    }
    // console.log('qty:', totalqty, 'totalcost:', totalcost)
    // document.getElementById('rptotalorder').textContent = formatCurrency(totalqty*totalcost)
}


async function issuelogstockbalance2 (itemid, id){
     function getparamm(){
        let paramstr = new FormData()
        paramstr.append('itemid', itemid)
        const location = document.getElementById('salespointname') ? did('salespointname').value : ''
        if(!location){
            notification('Please select a store / salespoint before choosing items.', 0)
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
                
            // }
        }
    else return notification('No records retrieved')
}

function issuelogcal2(element){
    let el = element.id.split('_')[1]
    if(!did(`supplyfrom_${el}`).value){
        notification(`No Item Selected`, 0)
        did(`issuetype_${el}`).value = '';
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
    //     did(`issuetype_${el}`).value = Number(did(`cost_${el}`).value) * Number(did(`qty_${el}`).value)
    // }else{
    //     did(`issuetype_${el}`).value = '';
    // }
    
    // issuelogtotalcount()
    
}

function reqaddrowissuelog(idd=''){
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
                    <input onchange="issuelogcal2(this)" type="number" id="qty_${elid}" name="qty" class="form-control comp" placeholder="Qty">
                </td>
                <td>
                <label class="hidden">Issue Type</label>
                    <select type="text" id="issuetype_${elid}" name="issuetype" class="form-control comp">
                        ${issuetlist}
                    </select>
                </td>
                <td>
                    <div class="flex gap-4 items-center h-full w-fit py-3">
                        <button onclick="reqaddrowissuelog()" title="Edit row entry" class="material-symbols-outlined hidden rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">add</button>
                        <button id="delbtn_${elid}" onclick="this.parentElement.parentElement.parentElement.remove()" title="Edit row entry" class="material-symbols-outlined rounded-full bg-[red] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
                    </div>
                </td>`
    el.innerHTML = x
    did('tabledata').appendChild(el)
    populateIssuelogSelect2()
    
}

async function removeissuelog(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this issuelog?");

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
    fetchissuelog()
    return notification(request.message);
    
}


async function onissuelogTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchissuelog('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeissuelog('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

function getidfromdata2(value){
    return supplierdataa.filter(data=>data.companyname == value)[0].id
}

async function issuelogFormSubmitHandler() {
    // if(document.getElementById('salespointname').value == document.getElementById('salespointname1').value)return notification('Source and Destination cannot be the same.', 0)
    let ids = getIdFromCls('comp')
    if(!validateForm('issuelogform', ids)) return notification('Please ensure all compulsory fields are filled', 0)
    // let payload

    // payload = getFormData2(document.querySelector('#issuelogform'), issuelogid ? [['id', issuelogid]] : null)
    function payload(){
        let paramstr = new FormData()
        if(issuelogid)paramstr.append('ref', issuelogid);
              paramstr.append('salespoint', document.getElementById('salespointname').value);
              paramstr.append('entrydate', document.getElementById('entrydate').value);
            //   paramstr.append('Intakeinvoicenumber', document.getElementById('Intakeinvoicenumber').value);
            //   paramstr.append('supplierid', document.getElementById('supplier').value);
              paramstr.append('rowsize', document.getElementsByName('supplyfrom').length);
              for (let i = 0; i < document.getElementsByName('supplyfrom').length; i++) {
                // paramstr.append(`id${i + 1}`, document.getElementsByName('id')[i].value);
                paramstr.append(`itemid${i + 1}`, document.getElementsByName('supplyfrom')[i].value);
                paramstr.append(`itemname${i + 1}`, getLabelByValue(document.getElementsByName('supplyfrom')[i].id, document.getElementsByName('supplyfrom')[i].value));
                paramstr.append(`qty${i + 1}`, document.getElementsByName('qty')[i].value);
                paramstr.append(`typeofissue${i + 1}`, document.getElementsByName('issuetype')[i].value);
                // paramstr.append(`cost${i + 1}`, document.getElementsByName('cost')[i].value);
              }
              return paramstr
        
    }
    let request = await httpRequest2('../controllers/issuelogs', payload(), document.querySelector('#issuelogform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        did('issuelog').click()
        // fetchissuelog();
        return
    }
    return notification(request.message, 0);
}


// function runAdissuelogFormValidations() {
//     let form = document.getElementById('issuelogform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#issuelogname'))  controls.push([form.querySelector('#issuelogname'), 'issuelog name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
