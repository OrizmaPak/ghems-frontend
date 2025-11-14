let viewrequisitionid
let viewrequisitionsupplier
async function viewrequisitionActive() {
    const form = document.querySelector('#viewrequisitionform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', viewrequisitionFormSubmitHandler)
    datasource = []
    // await fetchviewrequisition()
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

async function fetchviewrequisition(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchouttakes', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
            if(request.data.data.length) {
                viewrequisitionsupplier = request.data.data
            }
    }
    else return notification('No records retrieved')
}

async function removeviewrequisition(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this viewrequisition?");

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
    // fetchviewrequisition()
    return notification(request.message);
    
}


async function onviewrequisitionTableDataSignal() {
    let rows = getSignaledDatasource().map((data, index) => `
    <tr data-open="false" class="source-row-item">
                                <td> ${index+1} </td>
                                <td> ${data.items.length} </td>
                                <td> 
                                    <table>
                                        ${data.items.map((dat, index)=>{
                                            return ( index<3 ?
                                                `
                                            <tr>
                                                <td>${dat.itemname}</td>
                                                <td style="width: 20px">${formatCurrency(dat.cost)}</td>
                                                <td style="width: 20px">${dat.qty}</td>
                                            </tr>
                                            `
                                            :
                                               index==3?`
                                               <tr>
                                                    <td onclick="intakemodalviewrequisition(${data.batchid})" style="color:green;cursor:pointer">click to view the remaining items ${data.items.length-3} ....</td>
                                                </tr>
                                                `:``
                                            )
                                        }).join('')}
                                    </table> 
                                </td>
                                <td> ${data.items.reduce((accumulator, currentItem) => {return accumulator + Number(currentItem.qty)}, 0)} </td>
                                <td> ${formatCurrency(data.items.reduce((accumulator, currentItem) => {return accumulator + Number(currentItem.cost)}, 0))} </td>
                                <td> ${formatDate(data.items[0].transactiondate.split(' ')[0])} </td>
                                <td> ${formatTime(data.items[0].tlog.split(' ')[2])} </td>
                                <td> ${data.items[0].locationname} </td>
                                <td> ${data.items[0].status} </td>
                                <td>
                                    <div class="flex items-center h-full gap-2">
                                        <button title="Edit row entry" onclick="viewrequisitionview(${data.batchid})" class="material-symbols-outlined rounded-full bg-green-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
                                        <button title="Delete row entry"s onclick="viewrequisitionedit(${data.batchid})" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
                                    </div>
                                </td>
                            </tr>
    `
    )
    .join('')
    injectPaginatatedTable(rows)
}

function viewrequisitionedit(batchid) {
    let data = datasource.find(each => each.batchid == batchid);
    sessionStorage.setItem('viewrequisitioneditrequest', JSON.stringify(data));
    if(document.getElementById('requisition'))document.getElementById('requisition').click();
}

function viewrequisitionview(itemid){
    let totalqty = 0
    let totalcost = 0
    let obj = datasource.find(each => each.batchid == itemid)
    document.querySelector("#viewrequisitionmodal").classList.remove('hidden'); 
    console.log('obj',obj);
    document.getElementById('vrqdate').innerHTML = formatDate(obj.items[0].transactiondate.split(' ')[0]);
    document.getElementById('vrqtime').innerHTML = formatTime(obj.items[0].tlog.split(' ')[2]);
    document.getElementById('vrqlocation').innerHTML = obj.items[0].locationname
    document.getElementById('vrqdesc').innerHTML = obj.items[0].description
    document.getElementById('vrqsupplier').innerHTML = obj.items[0].suppliername
    document.getElementById('vrqref').innerHTML = obj.items[0].reference
    document.getElementById('tabledata2').innerHTML = obj.items.map((data, index)=>{
        console.log('the data', data)
        totalqty = totalqty + Number(data.qty)
        totalcost = totalcost + Number(data.cost)
        return `
            <tr data-open="false" class="source-row-item">
                <td> ${index+1} </td>
                <td>${data.itemid}</td>
                <td>${data.itemname}</td>
                <td style="width: 20px">${data.qty}</td>
                <td>${formatCurrency(data.cost)}</td>
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

function intakemodalviewrequisition(itemid){
    let totalqty = 0
    let totalcost = 0
    let obj = datasource.find(each => each.batchid == itemid)
    document.querySelector("#viewrequisitionmodal").classList.remove('hidden');
    console.log('obj',obj);
    document.getElementById('vrqdate').innerHTML = formatDate(obj.items[0].transactiondate.split(' ')[0]);
    document.getElementById('vrqtime').innerHTML = formatDate(obj.items[0].tlog.split(' ')[2]);
    document.getElementById('vrqlocation').innerHTML = obj.items[0].locationname
    document.getElementById('vrqdesc').innerHTML = obj.items[0].description
    document.getElementById('vrqdref').innerHTML = obj.items[0].reference
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

async function viewrequisitionFormSubmitHandler() {
    if(!validateForm('viewrequisitionform', [`startdate`, `enddate`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#viewrequisitionform'), viewrequisitionid ? [['id', viewrequisitionid]] : null)
    let request = await httpRequest2('../controllers/fetchouttakes', payload, document.querySelector('#viewrequisitionform #submit'))
    if(request.status) {
        notification('successfull!', 1);
        if(request.data.length) {
                datasource = combineBatchDataintakeviewreceivepurchase(request.data)
                resolvePagination(datasource, onviewrequisitionTableDataSignal)
            }
        // document.querySelector('#viewrequisitionform').reset();
        // fetchviewrequisition();
        return
    }
    // document.querySelector('#viewrequisitionform').reset();
    // fetchviewrequisition();
    return notification(request.message, 0);
} 


// function runAdviewrequisitionFormValidations() {
//     let form = document.getElementById('viewrequisitionform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#viewrequisitionname'))  controls.push([form.querySelector('#viewrequisitionname'), 'viewrequisition name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }