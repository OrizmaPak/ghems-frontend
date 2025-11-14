let dailyassignmentsheetid
let dailyassignmentsheetitem
async function dailyassignmentsheetActive() {
    dailyassignmentsheetid = ''
    runCount('s/n')
    const form = document.querySelector('#dailyassignmentsheetform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', dailyassignmentsheetFormSubmitHandler)
    datasource = []
    recalldatalist()
    await runpopulateitemassignment()
    if(sessionStorage.getItem('viewdailyassignmensheetdata')){
        let x = sessionStorage.getItem('viewdailyassignmensheetdata')
        dailyassignmentsheetid = x
        await fetchdailyassignmentsheet(sessionStorage.getItem('viewdailyassignmensheetdata'))
    }
}

function addassignmentrow(){
    let id = genID()
    let element = document.createElement('tr')
    element.setAttribute('id', `assignmentrow_${id}`)
    let x = `<td><p class="s/n">1</p></td>
               <td><label class="hidden">Item</label><input list="assignmentitems" name="" id="itemer_${id}" placeholder="Select Item" onchange="checkdatalist(this)" class="form-control itemer comp"></td>
               <td><label class="hidden">Quantity</label><input type="number" name="" id="qtyer_${id}" class="form-control qtyer comp" placeholder="Enter Quantity"></td>
               <td class="flex gap-4">
                    <div title="Add row" onclick="addassignmentrow()" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs flex justify-center items-center" style="font-size: 18px;">add</div>
                    <div title="Delete row entry's" onclick="document.getElementById('assignmentrow_${id}').remove()" class="material-symbols-outlined rounded-full flex justify-center items-center bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">remove</div>
               </td>`
    element.innerHTML = x
    document.getElementById('tabledata').appendChild(element)
    runCount('s/n')
}

async function runpopulateitemassignment(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchinventorylist', id ? getparamm() : null, null, 'json')
    if(request.status) {
            if(request.data.length) {
                did('assignmentitems').innerHTML = request.data.filter(data=>data.applyto == 'NOT FOR SALE').map(dat=>`<option>${dat.itemname} || ${dat.itemid}</option>`).join('')
            }
    }
    else return notification('No records retrieved')
}



async function fetchdailyassignmentsheet(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchassignmentsheets', id ? getparamm() : null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, ondailyassignmentsheetTableDataSignal)
            }
        }else{
            //  dailyassignmentsheetid = request.data[0].id
            populateData(request.data.assignmentsheet[0])
            for(let i=0;i<request.data.items.length;i++){
                if(i!==0)addassignmentrow()
                document.getElementsByClassName('itemer')[i].value = request.data.items[i].itemname + ' || ' +  request.data.items[i].itemid
                document.getElementsByClassName('qtyer')[i].value = Number(request.data.items[i].qty)
            }
            
        }
    }
    else return notification('No records retrieved')
}

async function removedailyassignmentsheet(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this dailyassignmentsheet?");

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
    fetchdailyassignmentsheet()
    return notification(request.message);
    
}


async function ondailyassignmentsheetTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchdailyassignmentsheet('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removedailyassignmentsheet('${item.id}')" name="removerow" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function dailyassignmentsheetFormSubmitHandler() {
    if(!validateForm('dailyassignmentsheetform', getIdFromCls('comp'))) return
    
    givenamebyclass('itemer', 'itemid')
    givenamebyclass('qtyer', 'qty')
    
    
    function payload(){
        let param = new FormData(document.querySelector('#dailyassignmentsheetform'))
        if(dailyassignmentsheetid)param.set('id',dailyassignmentsheetid)
        param.set('timein', `${document.getElementById('timein').value.split('T').join(' ').toString()}:00`)
        param.set('timeout', `${document.getElementById('timeout').value.split('T').join(' ').toString()}:00`)
        param.set('rowsize', document.getElementsByClassName('itemer').length)
        for(let i=0;i<document.getElementsByClassName('itemer').length;i++){
            param.set(`itemid${i+1}`, document.getElementsByClassName('itemer')[i].value.split('||')[1].trim())
        }
        return param
    }
    
    
    let request = await httpRequest2('../controllers/assignmentsheet', payload(), document.querySelector('#dailyassignmentsheetform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#dailyassignmentsheetform').reset();
        // fetchdailyassignmentsheet();
        for(let i=0;i<document.getElementsByName('removerow').length;i++){
            document.getElementsByName('removerow')[i].click()
        }
        return
    }
    // document.querySelector('#dailyassignmentsheetform').reset();
        // for(let i=0;i<document.getElementsByName('removerow').length;i++){
        //     document.getElementsByName('removerow')[i].click()
        // }
    // fetchdailyassignmentsheet();
    return notification(request.message, 0);
}


// function runAddailyassignmentsheetFormValidations() {
//     let form = document.getElementById('dailyassignmentsheetform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#dailyassignmentsheetname'))  controls.push([form.querySelector('#dailyassignmentsheetname'), 'dailyassignmentsheet name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }