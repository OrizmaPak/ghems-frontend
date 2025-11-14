let viewbuildid
async function viewbuildActive() {
    const form = document.querySelector('#viewbuildform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', e=>fetchviewbuild())
    datasource = []
    await fetchviewbuild()
}

async function fetchviewbuild(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData(did('viewbuildform'))
        if(id)paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchbuiltrecipes', getparamm(), document.querySelector('#viewbuildform #submit'), 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onviewbuildTableDataSignal)
            }
        }else{
             viewbuildid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeviewbuild(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this viewbuild?");

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
    fetchviewbuild()
    return notification(request.message);
    
}


async function onviewbuildTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.itembuiltdetail.salespoint}</td>
        <td>${item.itembuiltdetail.itemname}</td>
        <td>  
           ${item.itembuiltmemberitems.length > 0 ? `<table>
                ${item.itembuiltmemberitems.map((dat, index)=>{
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
                            <td onclick="modalviewbuild('${item.itembuiltdetail.id}')" style="color:green;cursor:pointer">click to view the remaining items ${item.itembuiltdetail.length-3} ....</td>
                        </tr>
                        `:``
                    )
                }).join('')}
            </table>` : 'No Item found in this build' }
        </td>
        <td>${specialformatDateTime(item.itembuiltdetail.builddate)}</td>
        <td class="flex items-center gap-3">
            <button title="View Item" onclick="modalviewbuild('${item.itembuiltdetail.id}')" class="material-symbols-outlined rounded-full bg-green-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
            <button title="Edit row entry" onclick="sessionStorage.setItem('recipeid','${item.itembuiltdetail.id}');did('recipe').click()" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeviewbuild('${item.compositeitem}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

function modalviewbuild (id){
    if(!id)return
    let data = datasource.filter(dat=>dat.itembuiltdetail.id == id)[0]
    did('modaldetails').innerHTML = `
        <p class="!text-sm font-thin"><img src="../images/${data.itembuiltdetail.imageurl}" class="w-[100px] h-[100px]"></p>
        <div>
        <p class="!text-sm font-thin">Composite Item Name: <span class="uppercase !text-sm font-semibold" style="">${data.itembuiltdetail.itemname}</span></p>
        <p class="!text-sm font-thin">Build Date: <span class="uppercase !text-sm font-semibold" style="">${specialformatDateTime(data.itembuiltdetail.builddate)}</span></p>
        </div>
    `;
     did('tabledata2').innerHTML = 'No Items set for this composite item'
     if(data.itembuiltmemberitems.length > 0)did('tabledata2').innerHTML = data.itembuiltmemberitems.map((dat, i)=>`
            <tr>
                <td>${i+1}</td>
                <td>${dat.itemid}</td>
                <td>${dat.itemname}</td>
                <td style="width: 20px">${formatNumber(dat.qty)}</td>
            </tr>
     `);
     did('viewbuildmodal').classList.remove('hidden')
}

async function viewbuildFormSubmitHandler() {
    if(!validateForm('viewbuildform', [`productname`, `productdescription`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#viewbuildform'), viewbuildid ? [['id', viewbuildid]] : null)
    let request = await httpRequest2('../controllers/viewbuildcript', payload, document.querySelector('#viewbuildform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#viewbuildform').reset();
        fetchviewbuild();
        return
    }
    document.querySelector('#viewbuildform').reset();
    fetchviewbuild();
    return notification(request.message, 0);
}


// function runAdviewbuildFormValidations() {
//     let form = document.getElementById('viewbuildform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#viewbuildname'))  controls.push([form.querySelector('#viewbuildname'), 'viewbuild name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }