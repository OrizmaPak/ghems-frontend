let incomestatementid
async function incomestatementActive() {
    const form = document.querySelector('#incomestatementform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', incomestatementFormSubmitHandler)
    datasource = []
    // await fetchincomestatement()
}

async function fetchincomestatement(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchincomestatement', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onincomestatementTableDataSignal)
            }
        }else{
             incomestatementid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeincomestatement(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this incomestatement?");

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
    fetchincomestatement()
    return notification(request.message);
    
}


async function onincomestatementTableDataSignal() {
    
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchincomestatement('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeincomestatement('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function incomestatementFormSubmitHandler() {
    if(!validateForm('incomestatementform', [`startdate`, 'enddate'])) return
    
    let payload

    payload = getFormData2(document.querySelector('#incomestatementform'), incomestatementid ? [['id', incomestatementid]] : null)
    let result = await httpRequest2('../controllers/incomestatement', payload, document.querySelector('#incomestatementform #submit'))
    if(result.status) {
         if(document.getElementById('tabledata'))document.getElementById('tabledata').innerHTML = Object.keys(result.data).map((dat, index)=>{
    let m
        return `
                <tr>
                        <td colspan="3" style="text-align: left;font-weight: bold">${dat.toUpperCase()}</td>
                </tr>
                        ${Object.values(result.data)[index].length != 0 ? Object.values(Object.values(result.data)[index]).map(dat =>dat).map(datt=>datt).map(da=>Object.values(da)).map(ee=>`<tr>${ee.map((rr, index)=>index < 3 ?`<td>${rr}</td>` : `<p class="hidden">${m=rr}</p>`).join('')}</tr>`).join('') : ''}
                   <tr>
                        <td style="text-align: right;font-weight: bold">${dat} sub total</td>
                        <td>${m}</td>
                   </tr>     
                   <tr>
                   <td colspan="3"></td>
                   </tr>     
                   <tr>
                   <td colspan="3"></td>
                   </tr>     
                
                `
    }).join('');
        return
    }
    document.querySelector('#incomestatementform').reset();
    // fetchincomestatement();
    return notification(request.message, 0);
}


// function runAdincomestatementFormValidations() {
//     let form = document.getElementById('incomestatementform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#incomestatementname'))  controls.push([form.querySelector('#incomestatementname'), 'incomestatement name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }