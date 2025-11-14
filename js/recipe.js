let recipeid
async function recipeActive() {
    recalldatalist()
    let form = document.querySelector('#recipeform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', recipeFormSubmitHandler)
    if(document.querySelector('#salespointname'))document.querySelector('#salespointname').addEventListener('change', e=>handlerecipedepartment())
    datasource = []
    await handlerecipedepartment(default_department)
    // await fetchrecipe()
    if(sessionStorage.getItem('recipeid')){
        recipeid = sessionStorage.getItem('recipeid')
        sessionStorage.removeItem('recipeid')
        await fetchrecipe(recipeid)
    }
}

async function handlerecipedepartment(store) {
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
                if(request.data.filter(data=>data.composite == 'YES').length < 1)return did('loading').innerHTML = 'No Composite Item can be found for this department'
                if(request.data.filter(data=>data.composite == 'NO').length < 1)return did('loading').innerHTML = 'No Non-Composite Item can be found for this department'
                did('itembuild').innerHTML = `<option value=''>-- Select Item To Build --</option>`
                did('itembuild').innerHTML += request.data.map(data=>{
                    if(data.composite == 'YES')return `<option value='${data.itemid}'>${data.itemname}</option>`
                }).join('')
                did('item').innerHTML = `<option value=''>-- Select Item --</option>`
                did('item').innerHTML += request.data.map(data=>{
                    if(data.composite == 'NO')return `<option value='${data.itemid}'>${data.itemname}</option>`
                }).join('')
                did('loading').classList.add('hidden')
                hidesalesterminal(false)
                return notification(request.message, 1);
            }
    }else{
        did('loading').innerHTML = request.message
        return notification('No records retrieved')}
}

async function fetchrecipe(id) {
    // scrollToTop('scrolldiv')
    if(!id)return
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchcompositeitemscript', getparamm(), null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        let thedata = request.data.filter(dat=>dat.compositeitemdetail.id == id)[0]
        console.log('thedata', thedata)
    }
    else return notification('No records retrieved')
}

function addrecipeitem () {
    if(!validateForm('recipeform', ['item', 'quantity']))return
    
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

async function removerecipe(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this recipe?");

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
    fetchrecipe()
    return notification(request.message);
    
}


async function onrecipeTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchrecipe('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removerecipe('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function recipeFormSubmitHandler() {
    if(!validateForm('recipeform', getIdFromCls('verify'))) return notification('Please ensure all compulsory fields are filled', 0)
    if(!validateForm('recipeform', ['itembuild'])) return notification('Item to build was not selected', 0)
    if(!document.getElementById('tabledata').children[0])return notification('No items selected to build with', 0)
    
    // let payload

    // payload = getFormData2(document.querySelector('#recipeform'), recipeid ? [['id', recipeid]] : null)
    function payload (){
        let param = new FormData()
        param.append('salespoint', document.getElementById('salespointname').value)
        param.append('itemtobuildid', document.getElementById('itembuild').value)
        for(let i=0;i<document.getElementsByName('qty').length;i++){
            if(document.getElementsByName('qty')[i].value)
            param.append(`itemid${i+1}`, document.getElementsByName('itemid')[i].textContent)
            param.append(`qty${i+1}`, document.getElementsByName('qty')[i].value)
        }
        param.append('gridsize', document.getElementsByName('qty').length)
        return param
    }
    let request = await httpRequest2('../controllers/builditemscript', payload(), document.querySelector('#recipeform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#recipe').click();
        return
    }
    document.querySelector('#recipe').click();
    return notification(request.message, 0);
}

