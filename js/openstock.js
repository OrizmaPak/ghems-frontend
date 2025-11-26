let openstockid
async function openstockActive() {
    recalldatalist()
    openstockFormSubmitHandler(default_department)
    if(document.querySelector('#salespointname'))document.querySelector('#salespointname').addEventListener('change', e=>openstockFormSubmitHandler())
    if(document.querySelector('#save')) document.querySelector('#save').addEventListener('click',saveopenstock, false)
    if(document.querySelector('#selectall')) document.querySelector('#selectall').addEventListener('click', e=>{
        for(let i=0;i<document.getElementsByName('itemer').length;i++){
            document.getElementsByName('itemer')[i].checked = true
        }
    })
    if(document.querySelector('#deselectall')) document.querySelector('#deselectall').addEventListener('click', e=>{
        for(let i=0;i<document.getElementsByName('itemer').length;i++){
            document.getElementsByName('itemer')[i].checked = false
        }
    })
    if(document.querySelector('#delete')) document.querySelector('#delete').addEventListener('click', e=>{
        let j = false
        for(let i=0;i<document.getElementsByName('itemer').length;i++){
            if(document.getElementsByName('itemer')[i].checked == true)j=true
        }
        if(!j)return notification('Please select atleast an item to delete', 0)
        deleteitemopenstock()
    })
    // form.querySelector('#submit').click()
    datasource = []
    // await fetchopenstocks()
}

async function fetchopenstocks(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchinventorylist', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `<tr>
                                                <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                                            </tr>`
    if(request.status) {
        const items = normalizeInventoryItems(request.data)
        if(!id){
            if(items.length) {
                datasource = items
                
                // resolvePagination(datasource, onopenstockTableDataSignal)
            }
        }else{
             openstockid = items[0]?.id
            if(items[0])populateData(items[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeopenstock(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this item?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removeitem', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchopenstocks()
    return notification(request.message);
    
}


// async function onopenstockTableDataSignal() {
//     let rows = getSignaledDatasource().map((item, index) => `
//     <tr>
//         <td>${item.index + 1 }</td>
//         <td>${item.itemname}</td>
//         <td><input value="${item.price ? Number(item.price) : ''}" type="number" name="price" id="price" class="form-control" placeholder="Enter Price"></td>
//         <td><input value="${item.price_two ? Number(item.price_two) : ''}" type="number" name="price_two" id="price_two" class="form-control" placeholder="Enter Price two"></td>
//         <td><input value="${item.beginbalance ? Number(item.beginbalance) : ''}" type="number" name="beginbalance" id="beginbalance" class="form-control" placeholder="Enter min balance"></td>
//         <td><input value="${item.balance ? Number(item.balance) : ''}" type="number" name="balance" id="balance" class="form-control" placeholder="Enter stock balance"></td>
//     </tr>`
//     )
//     .join('')
//     injectPaginatatedTable(rows)
// }

async function openstockFormSubmitHandler(store) {
    if(!did('salespointname').value && !store)return notification('Please enter a Department / Sales Point')
    did('tabledata').innerHTML = 'Loading...'
    function payload(){
        let param = new FormData()
        if(!store)param.append('salespoint', did('salespointname').value)
        if(store)param.append('salespoint', default_department)
        return param
    }
    let request = await httpRequest2('../controllers/fetchinventorybysalespoint', payload(), document.querySelector('#openstockform #save'))
    document.getElementById('tabledata').innerHTML = `<p class="text-center w-full">No records retrieved</p>`
    if(request.status) {
            if(request.data.length) {
                datasource = request.data
                document.getElementById('tabledata').innerHTML = request.data.map((item, index) => `
                <tr>
                    <input value="${item.itemid ? Number(item.itemid) : ''}" type="hidden" name="itemid" id="itemid-${index}" class="form-control comp" placeholder="Enter Price">
                    <input value="${item.id ? Number(item.id) : ''}" type="hidden" name="id" id="id-${index}" class="form-control comp" placeholder="Enter Price">
                    <td>${index + 1 }</td>
                    <td><p name="itemname">${item.itemname}</p></td>
                    <td><input type="number" name="beginbalance" id="beginbalance-${index}" class="form-control comp" placeholder="Enter min balance"></td>
                </tr>`
                )
                .join('')
                // resolvePagination(datasource, onopenstockTableDataSignal)
                return notification(request.message, 1);
            }
    }else {
                did('tabledata').innerHTML = request.message
            return notification('No records retrieved')
            }
}

async function saveopenstock() {
    // if(!validateForm('openstockform', getIdFromCls('comp'))) return
    if(!document.getElementsByName('beginbalance')[0])return notification('Nothing to save', 0)
    let m = false
    for(let l=0;l<document.getElementsByName('beginbalance').length;l++){
        if(document.getElementsByName('beginbalance')[l].value == '')document.getElementsByName('beginbalance')[l].value = 0
        if(document.getElementsByName('beginbalance')[l].value)m=true
    }
    if(!m)return notification('Please enter atleast one item quantity', 0)
    function payload(){
        let param = new FormData()
        param.append('salespoint', did('salespointname').value)
        let itemid = ''
        let itemname = ''
        let beginbalance = '' 
        for(let i=0;i<document.getElementsByName('itemid').length;i++){
            console.log(document.getElementsByName('beginbalance')[i].value)
            if(i == 0){
                itemid = document.getElementsByName('itemid')[i].value;
                itemname = document.getElementsByName('itemname')[i].innerHTML;
                beginbalance = document.getElementsByName('beginbalance')[i].value;
            }else{
                itemid = itemid+'|'+document.getElementsByName('itemid')[i].value;
                itemname = itemname+'|'+document.getElementsByName('itemname')[i].innerHTML;
                beginbalance = beginbalance+'|'+document.getElementsByName('beginbalance')[i].value;
            }
        }
            param.append('itemname', itemname)
            param.append('itemid', itemid)
            param.append('qty', beginbalance)
        return param
    }
    let request = await httpRequest2('../controllers/openingstock', payload(),  document.querySelector('#openstockform #save'))
    // document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
                did('openstock').click()
                did('salespointname').value = ''
                document.getElementById('tabledata').innerHTML = ''
                return notification(request.message, 1);
    }else{
                did('openstock').click()
                did('salespointname').value = ''
        document.getElementById('tabledata').innerHTML = `<tr>
                                                <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                                            </tr>`;
        return notification('No records retrieved')}
}

async function deleteitemopenstock() {
    function payload(){
        let param = new FormData()
        param.append('salespoint', did('salespointname').value) 
        let itemid = ''
        let id = ''
        for(let i=0;i<document.getElementsByName('itemer').length;i++){
            if(document.getElementsByName('itemer')[i].checked == true){
                    itemid = itemid+'|'+document.getElementsByName('itemid')[i].value;
                    id = id+'|'+document.getElementsByName('id')[i].value;
            }
        }
            param.append('itemid', itemid.slice(1))
            param.append('id', id.slice(1))
        return param
    }
    let request = await httpRequest2('../controllers/deleteinventoryfromupdate', payload(),  document.querySelector('#openstockform #delete'))
    if(request.status) {
                openstockFormSubmitHandler()
                return notification(request.message, 1);
    }else return notification('No records retrieved')
}


// function runAdopenstockFormValidations() {
//     let form = document.getElementById('openstockform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#openstockname'))  controls.push([form.querySelector('#openstockname'), 'openstock name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
