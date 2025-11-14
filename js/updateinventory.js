let updateinventoryid
async function updateinventoryActive() {
    recalldatalist()
    updateinventoryFormSubmitHandler(default_department)
    if(document.querySelector('#salespointname'))document.querySelector('#salespointname').addEventListener('change', e=>updateinventoryFormSubmitHandler())
    if(document.querySelector('#save')) document.querySelector('#save').addEventListener('click', e=>saveupdatedprices())
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
        deleteitemupdateinventory()
    })
    // form.querySelector('#submit').click()
    datasource = []
    // await fetchupdateinventorys()
}

async function fetchupdateinventorys(id) {
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
        if(!id){
            if(request.data.length) {
                datasource = request.data
                
                // resolvePagination(datasource, onupdateinventoryTableDataSignal)
            }
        }else{
             updateinventoryid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeupdateinventory(id) {
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
    fetchupdateinventorys()
    return notification(request.message);
    
}


// async function onupdateinventoryTableDataSignal() {
//     let rows = getSignaledDatasource().map((item, index) => `
//     <tr>
//         <td>${item.index + 1 }</td>
//         <td>${item.itemname}</td>
//         <td><input value="${item.price ? Number(item.price) : ''}" type="number" name="price" id="price" class="form-control" placeholder="Enter Price"></td>
//         <td><input value="${item.price_two ? Number(item.price_two) : ''}" type="number" name="price_two" id="price_two" class="form-control" placeholder="Enter Price two"></td>
//         <td><input value="${item.minbalance ? Number(item.minbalance) : ''}" type="number" name="minbalance" id="minbalance" class="form-control" placeholder="Enter min balance"></td>
//         <td><input value="${item.balance ? Number(item.balance) : ''}" type="number" name="balance" id="balance" class="form-control" placeholder="Enter stock balance"></td>
//     </tr>`
//     )
//     .join('')
//     injectPaginatatedTable(rows)
// }

async function updateinventoryFormSubmitHandler(store) {
    if(!did('salespointname').value && !store)return notification('Please enter a Department / Sales Point')
    function payload(){
        let param = new FormData()
        if(!store)param.append('salespoint', did('salespointname').value)
        if(store)param.append('salespoint', default_department)
        return param
    }
    let request = await httpRequest2('../controllers/fetchinventorybysalespoint', payload(), document.querySelector('#updateinventoryform #save'))
    document.getElementById('tabledata').innerHTML = `<p class="text-center w-full">No records retrieved</p>`
    if(request.status) {
            if(request.data.length) {
                datasource = request.data
                document.getElementById('tabledata').innerHTML = request.data.map((item, index) => `
                <tr>
                    <input value="${item.itemid ? Number(item.itemid) : ''}" type="hidden" name="itemid" id="itemid-${index}" class="form-control comp" placeholder="Enter Price">
                    <input value="${item.id ? Number(item.id) : ''}" type="hidden" name="id" id="id-${index}" class="form-control comp" placeholder="Enter Price">
                    <td>${index + 1 }</td>
                    <td><input type="checkbox" id="${item.itemid}" name="itemer"/></td>
                    <td>${item.itemname}</td>
                    <td><input value="${item.price ? Number(item.price) : ''}" type="number" name="price" id="price-${index}" class="form-control comp" placeholder="Enter Price"></td>
                    <td><input value="${item.price_two ? Number(item.price_two) : ''}" type="number" name="price_two" id="price_two-${index}" class="form-control comp" placeholder="Enter Price two"></td>
                    <td><input value="${item.minbalance ? Number(item.minbalance) : ''}" type="number" name="minbalance" id="minbalance-${index}" class="form-control comp" placeholder="Enter min balance"></td>
                    <td>${item.balance}</td>
                </tr>`
                )
                .join('')
                // resolvePagination(datasource, onupdateinventoryTableDataSignal)
                return notification(request.message, 1);
            }
    }else return notification('No records retrieved')
}

async function saveupdatedprices() {
    if(!validateForm('updateinventoryform', getIdFromCls('comp'))) return
    function payload(){
        let param = new FormData()
        param.append('salespoint', did('salespointname').value)
        let itemid = ''
        let price = ''
        let price_two = ''
        let minbalance = ''
        for(let i=0;i<document.getElementsByName('itemid').length;i++){
            if(i == 0){
                itemid = document.getElementsByName('itemid')[i].value;
                price = document.getElementsByName('price')[i].value;
                price_two = document.getElementsByName('price_two')[i].value;
                minbalance = document.getElementsByName('minbalance')[i].value;
            }else{
                itemid = itemid+'|'+document.getElementsByName('itemid')[i].value;
                price = price+'|'+document.getElementsByName('price')[i].value;
                price_two = price_two+'|'+document.getElementsByName('price_two')[i].value;
                minbalance = minbalance+'|'+document.getElementsByName('minbalance')[i].value;
            }
        }
            param.append('itemid', itemid)
            param.append('price', price)
            param.append('price_two', price_two)
            param.append('minbalance', minbalance)
        return param
    }
    let request = await httpRequest2('../controllers/inventoryupdate', payload(),  document.querySelector('#updateinventoryform #save'))
    // document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
                return notification(request.message, 1);
    }else{
                did('updateinventory').click()
                did('salespointname').value = ''
        document.getElementById('tabledata').innerHTML = `<tr>
                                                <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                                            </tr>`;
        return notification('No records retrieved')}
}

async function deleteitemupdateinventory() {
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
    let request = await httpRequest2('../controllers/deleteinventoryfromupdate', payload(),  document.querySelector('#updateinventoryform #delete'))
    if(request.status) {
                updateinventoryFormSubmitHandler()
                return notification(request.message, 1);
    }else return notification('No records retrieved')
}


// function runAdupdateinventoryFormValidations() {
//     let form = document.getElementById('updateinventoryform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#updateinventoryname'))  controls.push([form.querySelector('#updateinventoryname'), 'updateinventory name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }