let viewissuelogid
let viewissuelogsupplier
async function viewissuelogActive() {
    const form = document.querySelector('#viewissuelogform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', viewissuelogFormSubmitHandler)
    datasource = []
    await fetchissuelog()
    did('issuetype').innerHTML = issuetlist
}

function combineBatchDataintakeviewreceivepurchase(data) {
  const groupedData = {};
  
  data.forEach((item) => {
    const batchId = item.batchid;
    
    if (!groupedData.hasOwnProperty(batchId)) {
      groupedData[batchId] = {
        batchid: batchId,
        items: [],
      };
    }
    
    groupedData[batchId].items.push(item);
  });
  
  return Object.values(groupedData);
}

async function fetchviewissuelog(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchsupplierscript', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
            if(request.data.data.length) {
                viewissuelogsupplier = request.data.data
            }
    }
    else return notification('No records retrieved')
}

async function removeviewissuelog(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this viewissuelog?");

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
    // fetchviewissuelog()
    return notification(request.message);
    
}


async function onviewissuelogTableDataSignal() {
    let qt = 0
    let rows = getSignaledDatasource().map((data, index) => `
    <tr data-open="false" class="source-row-item">
                                <td> ${index+1} </td>
                                <td> ${data.data[0].salespoint} </td>
                                <td> ${data.data.length} </td>
                                <td> 
                                        <table>
                                        ${data.data.map((dat, index)=>{
                                            return ( index<3 ?
                                                `
                                            <tr>
                                                <td>${dat.itemname}</td>
                                                <td style="width: 20px">${dat.qty}</td>
                                                <td style="width: 20px">${dat.typeofissue}</td>
                                            </tr>
                                            `
                                            :
                                               index==3?`
                                               <tr>
                                                    <td onclick="intakemodal(${data.data[0].ref})" style="color:green;cursor:pointer">click to view the remaining items ${data.data.length-3} ....</td>
                                                </tr>
                                                `:``
                                            )
                                        }).join('')}
                                        </table>
                                </td>
                                <td name="pograndtotal">${data.data[0].ref}</td>
                                <td>
                                    <div class="flex items-center h-full gap-2">
                                        <button title="Edit row entry" onclick="viewissuelogview(${data.data[0].ref})" class="material-symbols-outlined rounded-full bg-green-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
                                        <button title="Delete row entry"s onclick="viewissuelogedit(${data.data[0].ref})" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
                                    </div>
                                </td>
                            </tr>
    `
    )
    .join('')
    injectPaginatatedTable(rows)
}

function viewissuelogedit(ref) {
    let data = datasource.find(data => data.data[0].ref == ref)
    sessionStorage.setItem('viewissuelogeditrequest', JSON.stringify(data));
    if(document.getElementById('issuelog'))document.getElementById('issuelog').click();
}

function viewissuelogview(ref){
    let totalqty = 0
    let obj = datasource.find(data => data.data[0].ref == ref)
    document.querySelector("#viewissuelogmodal").classList.remove('hidden');
    console.log('obj',obj);
    document.getElementById('vpsdate').innerHTML = formatDate(obj.data[0].entrydate.split(' ')[0]);
    // document.getElementById('vpstime').innerHTML = formatTime(obj.data[0].tlog.split(' ')[2]);
    // document.getElementById('vpslocation').innerHTML = obj.data[0].locationname
    // document.getElementById('vpsdesc').innerHTML = obj.data[0].typeofissue
    document.getElementById('vpssupplier').innerHTML = obj.data[0].salespoint
    document.getElementById('vpsref').innerHTML = obj.data[0].ref
    document.getElementById('tabledata2').innerHTML = obj.data.map((data, index)=>{
        console.log('the data', data)
        totalqty = totalqty + Number(data.qty)
        return `
            <tr data-open="false" class="source-row-item">
                <td> ${index+1} </td>
                <td>${data.itemid}</td>
                <td>${data.itemname}</td>
                <td style="width: 20px">${data.qty}</td>
                <td>${data.typeofissue}</td>
            </tr>
        `
    }).join('');
    document.getElementById('tabledata2').innerHTML += `
        <tr data-open="false" class="source-row-item">
            <td> Total: </td>
            <td></td>
            <td></td>
            <td> ${totalqty} </td>
            <td> </td>
        </tr>
    `
    // document.getElementById("modalitemname").value= obj.itemname;
    // document.getElementById("modalquantity").value= obj.qty;
    // document.getElementById("modalcost").value= obj.cost;
    // document.getElementById("modaldescription").value= obj.description;
    // document.getElementById("modaltransactiondate").value= obj.transactiondate;
    // document.getElementById("modallocation").value= intakeHistoryLocationsout.find(each=> each.id == obj.location).location;
}

function intakemodal(itemid){
    let totalqty = 0
    let totalcost = 0
    let obj = datasource.find(each => each.batchid == itemid)
    document.querySelector(".viewissuelogmodal").classList.remove('hidden');
    console.log('obj',obj);
    document.getElementById('vpsdate').innerHTML = formatDate(obj.items[0].transactiondate.split(' ')[0]);
    document.getElementById('vpstime').innerHTML = formatDate(obj.items[0].tlog.split(' ')[2]);
    document.getElementById('vpslocation').innerHTML = obj.items[0].locationname
    document.getElementById('vpsdesc').innerHTML = obj.items[0].description
    document.getElementById('vpsdref').innerHTML = obj.items[0].reference
    document.getElementById('intakehistorytablecontentmodal').innerHTML = obj.items.map((data, index)=>{
        console.log('the data', data)
        totalqty = totalqty + Number(data.qty)
        totalcost = totalcost + Number(data.cost)
        return `
            <tr data-open="false" class="source-row-item">
                <td> ${index+1} </td>
                <td>${data.itemid}</td>
                <td>${data.itemname}</td>
                <td style="width: 20px">${data.qty}</td>
                <td>&#8358;${formatCurrency(data.cost)}</td>
            </tr>
        `
    }).join('');
    document.getElementById('tabledata2').innerHTML += `
        <tr data-open="false" class="source-row-item">
            <td> Total: </td>
            <td></td>
            <td></td>
            <td> ${totalqty} </td>
            <td>${formatCurrency(totalcost)} </td>
        </tr>
    `
    // document.getElementById("modalitemname").value= obj.itemname;
    // document.getElementById("modalquantity").value= obj.qty;
    // document.getElementById("modalcost").value= obj.cost;
    // document.getElementById("modaldescription").value= obj.description;
    // document.getElementById("modaltransactiondate").value= obj.transactiondate;
    // document.getElementById("modallocation").value= intakeHistoryLocationsout.find(each=> each.id == obj.location).location;
}

async function viewissuelogFormSubmitHandler() {
    if(!validateForm('viewissuelogform', [`startdate`, `enddate`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#viewissuelogform'), viewissuelogid ? [['id', viewissuelogid]] : null)
    let request = await httpRequest2('../controllers/fetchissuelogs', payload, document.querySelector('#viewissuelogform #submit'))
    if(request.status) {
        notification('successfull!', 1);
        if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onviewissuelogTableDataSignal)
            }
        // document.querySelector('#viewissuelogform').reset();
        // fetchviewissuelog();
        return
    }
    // document.querySelector('#viewissuelogform').reset();
    // fetchviewissuelog();
    return notification(request.message, 0);
} 


// function runAdviewissuelogFormValidations() {
//     let form = document.getElementById('viewissuelogform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#viewissuelogname'))  controls.push([form.querySelector('#viewissuelogname'), 'viewissuelog name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }