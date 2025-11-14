let viewpurchasesid
let viewpurchasessupplier
async function viewpurchasesActive() {
    const form = document.querySelector('#viewpurchasesform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', viewpurchasesFormSubmitHandler)
    datasource = []
    fetchissuelog()
    // await fetchviewpurchases()
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

async function fetchviewpurchases(id) {
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
                viewpurchasessupplier = request.data.data
            }
    }
    else return notification('No records retrieved')
}

async function removeviewpurchases(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this viewpurchases?");

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
    // fetchviewpurchases()
    return notification(request.message);
    
}

function copytext(text){
    const textToCopy = text;
    
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            notification(`${text} copied to clipboard`);
            // You can also provide user feedback here, such as displaying a success message
        })
        .catch(err => {
            notification(`Error copying ${text}`, 0);
            // Handle any errors that might occur during copying
        });
}
async function onviewpurchasesTableDataSignal() {
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
                                                <td style="width: 20px">${formatNumber(dat.cost)}</td>
                                                <td style="width: 20px">${dat.qty}</td>
                                            </tr>
                                            `
                                            :
                                               index==3?`
                                               <tr>
                                                    <td onclick="intakemodal(${data.batchid})" style="color:green;cursor:pointer">click to view the remaining items ${data.items.length-3} ....</td>
                                                </tr>
                                                `:``
                                            )
                                        }).join('')}
                                    </table> 
                                </td>
                                <td name="pograndtotal">${formatNumber(data.items.reduce((accumulator, currentItem) => accumulator + Number(currentItem.cost), 0) * data.items.reduce((accumulator, currentItem) => accumulator + Number(currentItem.qty), 0))}</td>
                                <td> ${data.items[0].suppliername} </td>
                                <td> ${formatDate(data.items[0].transactiondate.split(' ')[0])} ${formatTime(data.items[0].tlog.split(' ')[2])}</td>
                                <td> ${data.items[0].locationname} </td>
                                <td onclick="copytext('${data.items[0].reference}')" class="badge badge-primary cp"> ${data.items[0].reference} </td>
                                <td>
                                    <div class="flex items-center h-full gap-2">
                                        <button title="Edit row entry" onclick="viewpurchasesview(${data.batchid})" class="material-symbols-outlined rounded-full bg-green-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
                                        <button title="Delete row entry"s onclick="viewpurchasesedit(${data.batchid})" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
                                    </div>
                                </td>
                            </tr>
    `
    )
    .join('')
    injectPaginatatedTable(rows)
}

function viewpurchasesedit(batchid) {
    let data = datasource.find(each => each.batchid == batchid);
    sessionStorage.setItem('viewpurchaseseditrequest', JSON.stringify(data));
    if(document.getElementById('receivepurchases'))document.getElementById('receivepurchases').click();
}

function viewpurchasesview(itemid){
    let totalqty = 0
    let totalcost = 0
    let obj = datasource.find(each => each.batchid == itemid)
    document.querySelector("#viewpurchasesmodal").classList.remove('hidden');
    console.log('obj',obj);
    document.getElementById('vpsdate').innerHTML = formatDate(obj.items[0].transactiondate.split(' ')[0]);
    document.getElementById('vpstime').innerHTML = formatTime(obj.items[0].tlog.split(' ')[2]);
    document.getElementById('vpslocation').innerHTML = obj.items[0].locationname
    document.getElementById('vpsdesc').innerHTML = obj.items[0].description
    document.getElementById('vpssupplier').innerHTML = obj.items[0].suppliername
    document.getElementById('vpsref').innerHTML = obj.items[0].reference
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
        <tr data-open="false" class="source-row-item">
            <td> Grand Total: </td>
            <td></td>
            <td></td>
            <td colspan="2" class="text-center">${formatCurrency(totalcost*totalqty)} </td>
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
    document.querySelector(".viewpurchasesmodal").classList.remove('hidden');
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

async function viewpurchasesFormSubmitHandler() {
    if(!validateForm('viewpurchasesform', [`startdate`, `enddate`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#viewpurchasesform'), viewpurchasesid ? [['id', viewpurchasesid], ['entrypoint', 'RP']] : [['entrypoint', 'RP']])
    let request = await httpRequest2('../controllers/fetchintakes', payload, document.querySelector('#viewpurchasesform #submit'))
    if(request.status) {
        notification('successfull!', 1);
        if(request.data.length) {
                datasource = combineBatchDataintakeviewreceivepurchase(request.data)
                resolvePagination(datasource, onviewpurchasesTableDataSignal)
            }
        // document.querySelector('#viewpurchasesform').reset();
        // fetchviewpurchases();
        return
    }
    // document.querySelector('#viewpurchasesform').reset();
    // fetchviewpurchases();
    return notification(request.message, 0);
} 


// function runAdviewpurchasesFormValidations() {
//     let form = document.getElementById('viewpurchasesform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#viewpurchasesname'))  controls.push([form.querySelector('#viewpurchasesname'), 'viewpurchases name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }