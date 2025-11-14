let buildid
async function buildActive() {
    recalldatalist()
    let form = document.querySelector('#buildform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', buildFormSubmitHandler)
    if(document.querySelector('#salespointname'))document.querySelector('#salespointname').addEventListener('change', e=>handlebuilddepartment())
    datasource = []
    await handlebuilddepartment(default_department)
    // await fetchbuild()
}

async function handlebuilddepartment(store) {
    hidesalesterminal()
    did('loading').classList.remove('hidden')
    did('loading').innerHTML = 'Loading...'
   
    if(!did('salespointname').value && !store)return notification('Please enter a Department / Sales Point')
     
    function payload(){
        let param = new FormData()
        if(!store)param.append('salespoint', did('salespointname').value)
        if(store)param.append('salespoint', default_department)
        return param 
    } 
    let request = await httpRequest2('../controllers/fetchinventorybysalespoint', payload(), null)
    if(request.status) {
             if(request.data.length) {
                datasource = request.data
                if(request.data.filter(data=>data.composite == 'YES').length < 1)return did('loading').innerHTML = 'No Composite Item can be found for this department';
                did('item').innerHTML = `<option value=''>-- Select Item --</option>`
                did('item').innerHTML += request.data.map(data=>{
                    if(data.composite == 'YES')return `<option value='${data.itemid}'>${data.itemname}</option>`
                }).join('')
                did('loading').classList.add('hidden')
                hidesalesterminal(false)
                return notification(request.message, 1);
            }
    }else{
        did('loading').innerHTML = request.message
        return notification('No records retrieved')}
}

async function fetchbuild(id) {
    // scrollToTop('scrolldiv')
    return
    // function getparamm(){
    //     let paramstr = new FormData()
    //     paramstr.append('id', id)
    //     return paramstr
    // }
    // let request = await httpRequest2('../controllers/fetchinventorylist', id ? getparamm() : null, null, 'json')
    // // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    // if(request.status) {
    //         if(request.data.length) {
    //             datasource = request.data
    //             did('itembuild').innerHTML = `<option value=''>-- Select Item To Build --</option>`
    //             did('itembuild').innerHTML += request.data.map(data=>{
    //                 if(data.composite == 'YES')return `<option value='${data.itemid}'>${data.itemname}</option>`
    //             }).join('')
    //             did('item').innerHTML = `<option value=''>-- Select Item --</option>`
    //             did('item').innerHTML += request.data.map(data=>{
    //                 if(data.composite == 'NO')return `<option value='${data.itemid}'>${data.itemname}</option>`
    //             }).join('')
    //         }
    // }
    // else return notification('No records retrieved')
}

function addbuilditem () {
    if(!validateForm('buildform', ['item', 'quantity']))return
    
    let element = document.createElement('tr')
    let x = `<td class="opacity-70 w-3 sn">  </td>
                <td class="opacity-70" name="itemid"> ${document.getElementById('item').value} </td>
                <td class="opacity-70"> ${getLabelByValue('item', document.getElementById('item').value)} </td>
                <td class="opacity-70"> <input type="number" value='${document.getElementById('quantity').value}' name="qty" id="${generateUID()}" class="form-control verify" placeholder="Enter Quantity of Item"> </td>
                <td class="flex items-center gap-3">
                    <button title="Delete item" onclick="removebuilditem(this, ${document.getElementById('item').value})" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">remove</button>
                </td>`
    element.innerHTML = x;
    hideOptionByValue('item', document.getElementById('item').value)
    did('tabledata').appendChild(element)
    runCount('datatable', 'sn')
    did('item').value = ''
    did('quantity').value = ''
}

function removebuilditem (element, value) {
    element.parentElement.parentElement.remove()
    hideOptionByValue('item', value, false)
    runCount('datatable', 'sn')
}

async function removebuild(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this build?");

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
    fetchbuild()
    return notification(request.message);
    
}


async function onbuildTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchbuild('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removebuild('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function buildFormSubmitHandler() {
    if(!validateForm('buildform', getIdFromCls('verify'))) return notification('Please ensure all compulsory fields are filled', 0)
    // if(!validateForm('buildform', ['itembuild'])) return notification('Item to build was not selected', 0)
    if(!document.getElementById('tabledata').children[0])return notification('No items selected to build with', 0)
    
    // let payload

    // payload = getFormData2(document.querySelector('#buildform'), buildid ? [['id', buildid]] : null)
    function payload (){
        let param = new FormData()
        param.append('salespoint', document.getElementById('salespointname').value)
        param.append('builddate', document.getElementById('builddate').value)
        // param.append('itemtobuildid', document.getElementById('itembuild').value)
        for(let i=0;i<document.getElementsByName('qty').length;i++){
            param.append(`itemtobuildid${i+1}`, document.getElementsByName('itemid')[i].textContent.trim())
            param.append(`qty${i+1}`, document.getElementsByName('qty')[i].value)
        }
        param.append('gridsize', document.getElementsByName('qty').length)
        return param
    }
    let request = await httpRequest2('../controllers/buildrecipes', payload(), document.querySelector('#buildform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#build').click();
        return
    }
    document.querySelector('#build').click();
    return notification(request.message, 0);
}

