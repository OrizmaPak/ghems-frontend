let viewrecipeid
async function viewrecipeActive() {
    const form = document.querySelector('#viewrecipeform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', e=>fetchviewrecipe())
    datasource = []
    await fetchviewrecipe()
}

async function fetchviewrecipe(id='') {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData(did('viewrecipeform'))
        if(id)paramstr.append('id', id) 
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchcompositeitemscript', getparamm(), document.querySelector('#viewrecipeform #submit'), 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onviewrecipeTableDataSignal)
            }
        }else{
             viewrecipeid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeviewrecipe(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this viewrecipe?");

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
    fetchviewrecipe()
    return notification(request.message);
    
}


async function onviewrecipeTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.compositeitemdetail.salespoint}</td>
        <td>${item.compositeitemdetail.itemname}</td>
        <td>${formatNumber(item.compositeitemdetail.cost)}</td>
        <td>${formatNumber(item.compositeitemdetail.price)}</td>
        <td> 
           ${item.compositememberitems.length > 0 ? `<table>
                ${item.compositememberitems.map((dat, index)=>{
                    return ( index<3 ?
                        `
                    <tr>
                        <td>${dat.itemname}</td>
                        <td style="width: 20px">${dat.qty}</td>
                    </tr>
                    `
                    :
                       index==3?`
                       <tr>
                            <td onclick="modalviewrecipe('${item.compositeitemdetail.id}')" style="color:green;cursor:pointer">click to view the remaining items ${item.compositeitemdetail.length-3} ....</td>
                        </tr>
                        `:``
                    )
                }).join('')}
            </table>` : 'No Item found in this build' }
        </td>
        <td>${item.compositeitemdetail.units}</td>
        <td>${item.compositeitemdetail.groupname}</td>
        <td>${item.compositeitemdetail.description}</td>
        <td class="flex items-center gap-3">
            <button title="View Item" onclick="modalviewrecipe('${item.compositeitemdetail.id}')" class="material-symbols-outlined rounded-full bg-green-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
            <button title="Edit row entry" onclick="sessionStorage.setItem('recipeid','${item.compositeitemdetail.id}');did('recipe').click()" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeviewrecipe('${item.compositeitem}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

function modalviewrecipe (id){
    if(!id)return
    let data = datasource.filter(dat=>dat.compositeitemdetail.id == id)[0]
    did('modaldetails').innerHTML = `
        <p class="!text-sm font-thin"><img src="../images/${data.compositeitemdetail.imageurl}" class="w-[100px] h-[100px]"></p>
        <div>
        <p class="!text-sm font-thin">Composite Item Name: <span class="uppercase !text-sm font-semibold" style="">${data.compositeitemdetail.itemname}</span></p>
        <p class="!text-sm font-thin">Composite Cost: <span class="uppercase !text-sm font-semibold" style="">${formatNumber(data.compositeitemdetail.cost)}</span></p>
        <p class="!text-sm font-thin">Composite Price: <span class="uppercase !text-sm font-semibold" style="">${formatNumber(data.compositeitemdetail.price)}</span></p>
        <p class="!text-sm font-thin">Composite units: <span class="uppercase !text-sm font-semibold" style="">${data.compositeitemdetail.units}</span></p>
        <p class="!text-sm font-thin">Composite group name: <span class="uppercase !text-sm font-semibold" style="">${data.compositeitemdetail.groupname}</span></p>
        <p class="!text-sm font-thin">Composite description: <span class="uppercase !text-sm font-semibold" style="">${data.compositeitemdetail.description}</span></p>
        </div>
    `;
     did('tabledata2').innerHTML = 'No Items set for this composite item'
     if(data.compositememberitems.length > 0)did('tabledata2').innerHTML = data.compositememberitems.map((dat, i)=>`
            <tr>
                <td>${i+1}</td>
                <td>${dat.itemid}</td>
                <td>${dat.itemname}</td>
                <td style="width: 20px">${formatNumber(dat.qty)}</td>
            </tr> 
     `);
     did('viewrecipemodal').classList.remove('hidden')
}
 
async function viewrecipeFormSubmitHandler() {
    if(!validateForm('viewrecipeform', [`productname`, `productdescription`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#viewrecipeform'), viewrecipeid ? [['id', viewrecipeid]] : null)
    let request = await httpRequest2('../controllers/viewrecipecript', payload, document.querySelector('#viewrecipeform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#viewrecipeform').reset();
        fetchviewrecipe();
        return
    }
    document.querySelector('#viewrecipeform').reset();
    fetchviewrecipe();
    return notification(request.message, 0);
}


// function runAdviewrecipeFormValidations() {
//     let form = document.getElementById('viewrecipeform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#viewrecipename'))  controls.push([form.querySelector('#viewrecipename'), 'viewrecipe name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }