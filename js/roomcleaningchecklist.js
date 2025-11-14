let roomcleaningchecklistid
let roomcleaningchecklistitem
async function roomcleaningchecklistActive() {
    runCount('s/n')
    const form = document.querySelector('#roomcleaningchecklistform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', roomcleaningchecklistFormSubmitHandler)
    document.getElementById('normalsavebtn').addEventListener('click', roomcleaningsavechecklistformsubmithandler)
    datasource = []
    await fetchroomcleaningchecklist()
    await populatechecklister()
    // await runpopulateitemroomcleaning()
}

async function populatechecklister(id=''){
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchchecklistitems', id ? getparamm() : null, null, 'json')
    if(request.status) {
            if(request.data.length) {
                did('checklistitemscontainer').innerHTML = request.data.map(dat=>`<div id="cont_${dat.id}" class="flex w-full items-center cp ps-4 h-fit border pr-3 border-gray-200 rounded w-fit">
                                                    <input id="bordered-checkbox-${dat.id}" onchange="checklistaction('${dat.id}', '${dat.item}')" type="checkbox" value=""  class="cp bordered-checkboxxa w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded ">
                                                    <label for="bordered-checkbox-${dat.id}" name="${dat.item}" class="w-full py-4 ms-2 cp text-sm font-medium text-black">${dat.item}</label>
                                                </div>`).join('')
            }
    }
    else return notification('No records retrieved')
}

function checklistaction(id, item, action='NO'){
    if(did(`bordered-checkbox-${id}`).checked){
        did(`cont_${id}`).classList.add('!hidden')
        let element = document.createElement('tr')
        element.innerHTML = ` <td id="row_${id}" class="s/n"></td>
                                        <input type="text" value="${item}" class="itemer hidden" />
                                        <td>${item}</td>
                                        <td >
                                            <div class="flex items-center my-3">
                                                 <span class="ms-3 text-sm font-medium text-red-900 mr-2">No</span>
                                                <label class="relative inline-flex items-center cursor-pointer">
                                                  <input type="checkbox" id="item_${item}" name="${item}_name" ${action == 'YES' ? 'checked' : ''} value=""  class="sr-only peer answerer">
                                                  <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                  <span class="ms-3 text-sm font-medium text-green-900">Yes</span>
                                                </label>
                                            </div>
                                        </td>
                                        <td class="flex gap-4">
                                            <div title="Remove Item" onclick="document.getElementById('row_${id}').parentElement.remove();did('cont_${id}').classList.remove('!hidden');did('bordered-checkbox-${id}').checked = false;runCount()" class="material-symbols-outlined removethechecklist rounded-full flex justify-center items-center bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">remove</div>
                                       </td>`
        document.getElementById('tabledat').appendChild(element)
        runCount()
    }else{
        
    }
}

function addroomcleaningrow(){
    let id = genID()
    let element = document.createElement('tr')
    element.setAttribute('id', `roomcleaningrow_${id}`)
    let x = `<td><p class="s/n">1</p></td>
               <td><label class="hidden">Item</label><input list="roomcleaningitems" name="" placeholder="Select Item" onchange="checkdatalist(this)" class="form-control comp"></td>
               <td><label class="hidden">Quantity</label><input type="text" name="lostandfounditems" id="lostandfounditems" class="form-control comp" placeholder="Enter Address"></td>
               <td class="flex gap-4">
                    <div title="Add row" onclick="addroomcleaningrow()" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs flex justify-center items-center" style="font-size: 18px;">add</div>
                    <div title="Delete row entry's" onclick="document.getElementById('roomcleaningrow_${id}').remove()" class="material-symbols-outlined rounded-full flex justify-center items-center bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">remove</div>
               </td>`
    element.innerHTML = x
    document.getElementById('tabledata').appendChild(element)
    runCount('s/n')
}

// async function runpopulateitemroomcleaning(id) {
//     // scrollToTop('scrolldiv')
//     function getparamm(){
//         let paramstr = new FormData()
//         paramstr.append('id', id)
//         return paramstr
//     }
//     let request = await httpRequest2('../controllers/fetchinventorylist', id ? getparamm() : null, null, 'json')
//     if(request.status) {
//             if(request.data.length) {
//                 did('roomcleaningitems').innerHTML = request.data.map(dat=>`<option>${dat.itemname} || ${dat.itemid}</option>`).join('')
//             }
//     }
//     else return notification('No records retrieved')
// }



async function fetchroomcleaningchecklist(id='') {
    if(id){
        const item = datasource.filter(item => item.id == id)[0];
        let x = JSON.parse(item.items);
        console.log(x)
        did('rccupdatechecklist').click()
        did('checklistitemscontainer').innerHTML = 'Loading...'
        did('tabledat').innerHTML = ''
        await populatechecklister()
        for(let i=0;i<x.length;i++){
            document.getElementsByName(`${x[i].item}`)[0].previousElementSibling.click()
            if(x[i].answer == 'YES')document.getElementsByName(`${x[i].item}_name`)[0].click()
        }
    }
    
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchroomcleaningchecklist', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onroomcleaningchecklistTableDataSignal)
            }
        }else{
             roomcleaningchecklistid = request.data[0].id
            populateData(request.data[0])
            did('supervisor').value = request.data[0].supervisorname + ' || '+ request.data[0].supervisor
        }
    }
    else return notification('No records retrieved')
}

async function removeroomcleaningchecklist(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this roomcleaningchecklist?");

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
    fetchroomcleaningchecklist()
    return notification(request.message);
    
}


async function onroomcleaningchecklistTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.supervisorname}</td>
        <td>${item.roomnumber}</td>
        <td>
            <table>
                <tbody>
                    ${JSON.parse(item.items).map((data, i)=>{
                    if(i<3)return(`
                            <tr>
                                <td>${i+1}</td>
                                <td>${data.item}</td>
                                <td>${data.answer}</td>
                            </tr>
                    `)
                    if(i==3)return(`
                            <tr>
                                <td colspan="2"  onclick="fetchroomcleaningchecklistview('${item.id}')"  class="text-xs text-[green]">Click to view the remaining ${JSON.parse(item.items).length-3}</td>
                            </tr>
                    `)
                        
                    }).join('')
                    }
                </tbody>
            </table>
        </td>
        <td>${specialformatDateTime(item.entrydate)}</td>
        <td>${item.shift}</td>
        <td>
        <div class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchroomcleaningchecklistview('${item.id}')" class="material-symbols-outlined rounded-full bg-[green] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">view_list</button>
            <button title="Edit row entry" onclick="fetchroomcleaningchecklist('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeroomcleaningchecklist('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </div>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
} 

function fetchroomcleaningchecklistview(id){
    did('roomcleaningchecklistmodal').classList.remove('hidden')
    const item = datasource.filter(item => item.id == id)[0];
    let y = item;
    let x = JSON.parse(item.items);
    console.log(x)
    document.getElementById('tabledatarcc').innerHTML = `${x.map((item, i)=>{
        return ` <tr><td id="rowrcc_${id}" class="">${i+1}</td>
                                        <input type="text" value="${item.item}" class="itemer1 hidden" />
                                        <td>${item.item}</td>
                                        <td >
                                            <div class="flex items-center my-3">
                                                 <span class="ms-3 text-sm font-medium text-red-900 mr-2">No</span>
                                                <label class="relative inline-flex items-center cursor-pointer">
                                                  <input type="checkbox" id="itemrcc_${i}" ${item.answer == 'YES' ? 'checked' : ''} class="sr-only peer answerer1">
                                                  <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                  <span class="ms-3 text-sm font-medium text-green-900">Yes</span>
                                                </label>
                                            </div>
                                        </td></tr>`
    }).join('')}`
    did('rccsupervisor').innerHTML = y.supervisorname
    did('rccroomnumber').innerHTML = y.roomnumber
    did('rccentrydate').innerHTML = specialformatDateTime(y.entrydate)
    did('rccshift').innerHTML = y.shift
    did('rcccsupervisor').value = y.supervisor
    did('rcccroomnumber').value = y.roomnumber
    did('rcccentrydate').value = y.entrydate
    did('rcccshift').value = y.shift
    roomcleaningchecklistid = y.id
}

async function roomcleaningsavechecklistformsubmithandler() {
    if(document.getElementById('tabledatarcc').children.length <1)return notification('No checklist item was selected', 0)
    did('checklistitemscontainer').innerHTML = ``
    
    givenamebyclass('itemer1', 'item')
    givenamebyclass('answerer1', 'answer')
    
    function payload(){
        let param = new FormData(document.querySelector('#modalcleanform'))
        if(roomcleaningchecklistid)param.append('id', roomcleaningchecklistid)
        param.append('rowsize', document.getElementsByClassName('itemer1').length)
        // param.set('supervisor', document.getElementById('supervisor').value.split('||')[1].trim())
        for(let i=0;i<document.getElementsByClassName('answerer1').length;i++){
            // console.log(document.getElementsByName(`answer${i+1}`)[0])
            param.set(`answer${i+1}`, document.getElementsByName(`answer${i+1}`)[0].checked ? 'YES' : 'NO')
        }
        roomcleaningchecklistid=''
        return param
    }

    // payload = getFormData2(, roomcleaningchecklistid ? [['id', roomcleaningchecklistid]] : null)
    let request = await httpRequest2('../controllers/roomcleaningchecklist', payload(), document.querySelector('#normalsavebtn'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#roomcleaningchecklistform').reset();
        document.getElementById('roomcleaningchecklist').click()
        fetchroomcleaningchecklist();
        return
    }
    // document.querySelector('#roomcleaningchecklistform').reset();
    fetchroomcleaningchecklist();
    return notification(request.message, 0);
}


async function roomcleaningchecklistFormSubmitHandler() {
    if(!validateForm('roomcleaningchecklistform', getIdFromCls('comp'))) return
    if(document.getElementById('tabledat').children.length <1)return notification('No checklist item was selected', 0)
    
    givenamebyclass('itemer', 'item')
    givenamebyclass('answerer', 'answer')
    
    function payload(){
        let param = new FormData(document.querySelector('#roomcleaningchecklistform'))
        if(roomcleaningchecklistid)param.append('id', roomcleaningchecklistid)
        param.append('rowsize', document.getElementsByClassName('itemer').length)
        param.set('supervisor', document.getElementById('supervisor').value.split('||')[1].trim())
        for(let i=0;i<document.getElementById('tabledat').children.length;i++){
            // alert(document.getElementsByName(`answer${i+1}`)[0].getAttribute('checked') ? 'YES' : 'NO')
            param.set(`answer${i+1}`, document.getElementsByName(`answer${i+1}`)[0].checked ? 'YES' : 'NO')
        }
        roomcleaningchecklistid=''
        return param
    }

    // payload = getFormData2(, roomcleaningchecklistid ? [['id', roomcleaningchecklistid]] : null)
    let request = await httpRequest2('../controllers/roomcleaningchecklist', payload(), document.querySelector('#roomcleaningchecklistform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#roomcleaningchecklistform').reset();
        document.getElementById('roomcleaningchecklist').click()
        fetchroomcleaningchecklist();
        return
    }
    // document.querySelector('#roomcleaningchecklistform').reset();
    fetchroomcleaningchecklist();
    return notification(request.message, 0);
}


// function runAdroomcleaningchecklistFormValidations() {
//     let form = document.getElementById('roomcleaningchecklistform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#roomcleaningchecklistname'))  controls.push([form.querySelector('#roomcleaningchecklistname'), 'roomcleaningchecklist name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }