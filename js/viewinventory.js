let viewinventoryid
async function viewinventoryActive() {
    const form = document.querySelector('#viewinventoryform')
    const form2 = document.querySelector('#viewinventoryeditform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', e=>viewinventoryFormSubmitHandler())
    if(form2.querySelector('#submit')) form2.querySelector('#submit').addEventListener('click', e=>viewinventoryFormEditHandler())
    form.querySelector('#submit').click()
    datasource = []
    // await fetchviewinventorys()
}

async function fetchviewinventorys(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchinventorylist', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onviewinventoryTableDataSignal)
            }
        }else{
             viewinventoryid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeviewinventory(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this item?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('itemid', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removeitem', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchviewinventorys()
    return notification(request.message);
    
}


async function onviewinventoryTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.itemname}</td>
        <td>${item.cost}</td>
        <td>${item.price}</td>
        <td>${item.units}</td>
        <td>${item.groupname}</td>
        <td>${item.description}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="viewinventoryFormSubmitHandler('${item.itemid}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeviewinventory('${item.itemid}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function viewinventoryFormSubmitHandler(itemid='') {
    did('imagePreview').innerHTML = ''
    // if(!validateForm('viewinventoryform', [`productname`, `productdescription`])) return
    if(itemid){
        did('modalform').classList.remove('hidden')
    }
    
    // let payload

    // payload = getFormData2(document.querySelector('#viewinventoryform'), viewinventoryid ? [['id', viewinventoryid]] : null)
    function payload(){
        let param = new FormData()
        param.append('itemname', did('itemname1').value)
        return param
    }
    let request = await httpRequest2('../controllers/fetchinventorylist', payload(), document.querySelector('#viewinventoryform #submit'))
    if(!itemid)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!itemid){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onviewinventoryTableDataSignal)
                did('modalform').classList.add('hidden')
                return notification(request.message, 1);
            }
        }else{
             viewinventoryid = itemid
            //  console.log(request.data.filter(data=>data.id==id))
            populateData(request.data.filter(data=>data.itemid==itemid)[0], ['imageurl'])
        }
    }
    else return notification('No records retrieved')
}
async function viewinventoryFormEditHandler(id='') {
    // if(!validateForm('viewinventoryform', [`productname`, `productdescription`])) return
    // if(id){
    //     did('modalform').classList.remove('hidden')
    // }
    
    let payload

    payload = getFormData2(document.querySelector('#viewinventoryeditform'), viewinventoryid ? [['itemid', viewinventoryid],['photofilename', showFileName('imageurl')],['userphotoname', getFile('imageurl')]] : null)
    let request = await httpRequest2('../controllers/editinventory', payload, document.querySelector('#viewinventoryeditform #submit'))
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    viewinventoryFormSubmitHandler()
    if(request.status) {
        if(!id){
            if(request.data.length) {
                // resolvePagination(datasource, onviewinventoryTableDataSignal)
                // datasource = request.data
                document.getElementById('modalform').classList.remove('hidden')
                viewinventoryActive()
                return notification(request.message, 1);
            }
        }else{
             viewinventoryid = request.data[0].itemid
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}


// function runAdviewinventoryFormValidations() {
//     let form = document.getElementById('viewinventoryform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#viewinventoryname'))  controls.push([form.querySelector('#viewinventoryname'), 'viewinventory name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }