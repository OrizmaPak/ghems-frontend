let balancesheetid
async function balancesheetActive() {
    const form = document.querySelector('#balancesheetform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', balancesheetFormSubmitHandler)
    datasource = []
    // await fetchbalancesheet()
}

async function fetchbalancesheet(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchbalancesheet', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onbalancesheetTableDataSignal)
            }
        }else{
             balancesheetid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removebalancesheet(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this balancesheet?");

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
    fetchbalancesheet()
    return notification(request.message);
    
}


async function onbalancesheetTableDataSignal() {
    
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchbalancesheet('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removebalancesheet('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function balancesheetFormSubmitHandler() {
    if(!validateForm('balancesheetform', [`currentdate`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#balancesheetform'), balancesheetid ? [['id', balancesheetid]] : null)
    let result = await httpRequest2('../controllers/balancesheet', payload, document.querySelector('#balancesheetform #submit'))
    if(result.status) {
          if(document.getElementById('tabledata'))document.getElementById('tabledata').innerHTML = Object.keys(result.data).map((dat, index)=>{
    //                                               ${Object.values(result.data)[index].length != 0 ? Object.keys(Object.values(result.data)[index][0]).map(dat => `<th>${dat}</th>`).join('') : ''}
//                                              ${Object.values(result.data)[index].length != 0 ? Object.values(Object.values(result.data)[index]).map(dat =>dat).map(datt=>datt).map(da=>Object.values(da)).map(ee=>`<tr><td></td>${ee.map(rr=>`<td>${rr}</td>`).join('')}</tr>`).join('') : ''}
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
    document.querySelector('#balancesheetform').reset();
    // fetchbalancesheet();
    return notification(request.message, 0);
}


// function runAdbalancesheetFormValidations() {
//     let form = document.getElementById('balancesheetform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#balancesheetname'))  controls.push([form.querySelector('#balancesheetname'), 'balancesheet name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }