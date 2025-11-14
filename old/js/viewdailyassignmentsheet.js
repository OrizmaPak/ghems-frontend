let viewdailyassignmentsheetid
async function viewdailyassignmentsheetActive() {
    const form = document.querySelector('#viewdailyassignmentsheetform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', viewdailyassignmentsheetFormSubmitHandler)
    datasource = []
    form.querySelector('#submit').click()
    // await fetchviewdailyassignmentsheet()
}

async function fetchviewdailyassignmentsheet(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchviewdailyassignmentsheet', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onviewdailyassignmentsheetTableDataSignal)
            }
        }else{
             viewdailyassignmentsheetid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeviewdailyassignmentsheet(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this viewdailyassignmentsheet?");

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
    fetchviewdailyassignmentsheet()
    return notification(request.message);
    
}


async function onviewdailyassignmentsheetTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1 }</td>
        <td>${item.assignmentsheet.guestname}</td>
        <td>${item.assignmentsheet.noofpersons}</td>
        <td>${item.assignmentsheet.roomnumber}</td>
        <td>${specialformatDateTime(item.assignmentsheet.arrivaldate)}</td>
        <td>${specialformatDateTime(item.assignmentsheet.departuredate)}</td>
        <td>${specialformatDateTime(item.assignmentsheet.timein)}</td>
        <td>${specialformatDateTime(item.assignmentsheet.timeout)}</td>
        <td>
        <table>
                                        ${item.items.map((dat, indexx)=>{
                                            return ( indexx<3 ?
                                                `
                                            <tr>
                                                <td>${index+1}</td>
                                                <td>${dat.itemid}</td>
                                                <td>${dat.itemname}</td>
                                                <td style="width: 20px">${dat.qty}</td>
                                            </tr>
                                            `
                                            :
                                               index==3?`
                                               <tr>
                                                    <td onclick="viewdailyassignmentsheetview(${index})" style="color:green;cursor:pointer">click to view the remaining items ${data.items.length-3} ....</td>
                                                </tr>
                                                `:``
                                            )
                                        }).join('')}
                                    </table> 
        </td>
        <td>
            <div class="flex items-center h-full gap-2">
            <button title="Edit row entry" onclick="viewdailyassignmentsheetview('${index}')" class="material-symbols-outlined rounded-full bg-green-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
            <button title="Edit row entry" onclick="gotoeditviewdailyassignmentsheet('${item.assignmentsheet.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeviewdailyassignmentsheet()" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
            </div>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

function gotoeditviewdailyassignmentsheet(id){
    sessionStorage.setItem('viewdailyassignmensheetdata', id)
    did('dailyassignmentsheet').click()
}

function viewdailyassignmentsheetview(idd){
    let totalqty = 0
    let totalcost = 0
    let obj = datasource[idd]
    document.querySelector("#viewdailyassignmentsheetmodal").classList.remove('hidden');
    console.log('obj',obj);
    document.getElementById('vasarrivaldate').innerHTML = specialformatDateTime(obj.assignmentsheet.arrivaldate)
    document.getElementById('vasdeparturedate').innerHTML = specialformatDateTime(obj.assignmentsheet.departuredate)
    document.getElementById('vasguestname').innerHTML = obj.assignmentsheet.guestname
    document.getElementById('vaslostandfounditems').innerHTML = obj.assignmentsheet.lostandfounditems
    document.getElementById('vasnoofpersons').innerHTML = obj.assignmentsheet.noofpersons
    document.getElementById('vasrequests').innerHTML = obj.assignmentsheet.requests
    document.getElementById('vasroomnumber').innerHTML = obj.assignmentsheet.roomnumber
    document.getElementById('vasshift').innerHTML = obj.assignmentsheet.shift
    document.getElementById('vasstatusafterservice').innerHTML = obj.assignmentsheet.statusafterservice
    document.getElementById('vasstatusbeforeservice').innerHTML = obj.assignmentsheet.statusbeforeservice
    document.getElementById('vastimein').innerHTML = specialformatDateTime(obj.assignmentsheet.timein)
    document.getElementById('vastimeout').innerHTML = specialformatDateTime(obj.assignmentsheet.timeout)
    document.getElementById('tabledata22').innerHTML = obj.items.map((data, index)=>{
        console.log('the data', data)
        totalqty = totalqty + Number(data.qty)
        return `
            <tr data-open="false" class="source-row-item">
                <td> ${index+1} </td>
                <td>${data.itemid}</td>
                <td>${data.itemname}</td>
                <td style="width: 20px">${formatNumber(data.qty)}</td>
            </tr>
        `
    }).join('');
    document.getElementById('tabledata22').innerHTML += `
        <tr data-open="false" class="source-row-item">
            <td> Total: </td>
            <td></td>
            <td></td>
            <td> ${formatNumber(totalqty)} </td>
        </tr>
    `
    // document.getElementById("modalitemname").value= obj.itemname;
    // document.getElementById("modalquantity").value= obj.qty;
    // document.getElementById("modalcost").value= obj.cost;
    // document.getElementById("modaldescription").value= obj.description;
    // document.getElementById("modaltransactiondate").value= obj.transactiondate;
    // document.getElementById("modallocation").value= intakeHistoryLocationsout.find(each=> each.id == obj.location).location;
}

async function viewdailyassignmentsheetFormSubmitHandler() {
    // if(!validateForm('viewdailyassignmentsheetform', [`productname`, `productdescription`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#viewdailyassignmentsheetform'), viewdailyassignmentsheetid ? [['id', viewdailyassignmentsheetid]] : null)
    let request = await httpRequest2('../controllers/fetchassignmentsheetbyfilters', payload, document.querySelector('#viewdailyassignmentsheetform #submit'))
    if(request.status) {
      if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onviewdailyassignmentsheetTableDataSignal)
            }
        return
    }
    document.querySelector('#viewdailyassignmentsheetform').reset();
    // fetchviewdailyassignmentsheet();
    return notification(request.message, 0);
}


// function runAdviewdailyassignmentsheetFormValidations() {
//     let form = document.getElementById('viewdailyassignmentsheetform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#viewdailyassignmentsheetname'))  controls.push([form.querySelector('#viewdailyassignmentsheetname'), 'viewdailyassignmentsheet name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }