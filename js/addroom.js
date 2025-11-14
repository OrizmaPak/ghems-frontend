let addroomid
async function addroomActive() {
    const form = document.querySelector('#addroomform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', addroomFormSubmitHandler)
    datasource = []
    await fetcroomcategory()
    await fetchaddroom()
}

async function fetcroomcategory(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchroomcategories', id ? getparamm() : null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
            if(request.data.length) {
                did('categoryid').innerHTML += request.data.map(dat=>`<option value="${dat.id}">${dat.category}</option>`).join('')
            }
    }
    else return notification('No records retrieved')
}

async function fetchaddroom(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchrooms', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onaddroomTableDataSignal)
            }
        }else{
             addroomid = request.data[0].id
            populateData(request.data[0], ['imageurl1', 'imageurl2'])
        }
    }
    else return notification('No records retrieved')
}

async function removeaddroom(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this addroom?");

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
    fetchaddroom()
    return notification(request.message);
    
}


async function onaddroomTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td><img src="../images/${item.imageurl1}" alt="${item.imageurl1}" style="width: 250px; height: 250px; object-fit: cover;"></td>
    <td><img src="../images/${item.imageurl2}" alt="${item.imageurl2}" style="width: 250px; height: 250px; object-fit: cover;"></td>
        <td>${item.roomname}</td>
        <td>${item.roomnumber}</td>
        <td>${item.roomcategory}</td>
        <td>${item.building}</td>
        <td>${item.floor}</td>
        <td>${item.description}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchaddroom('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeaddroom('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function addroomFormSubmitHandler() {
    if(!validateForm('addroomform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#addroomform'), addroomid ? [['id', addroomid],['photofilename', showFileName('imageurl1')],['userphotoname', getFile('imageurl1')],['photofilename2', showFileName('imageurl2')],['userphotoname2', getFile('imageurl2')]] : [['photofilename', showFileName('imageurl1')],['userphotoname', getFile('imageurl1')],['photofilename2', showFileName('imageurl2')],['userphotoname2', getFile('imageurl2')]])
    let request = await httpRequest2('../controllers/rooms', payload, document.querySelector('#addroomform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#addroomform').reset();
        did('imagePreview').innerHTML = ''
        did('imagePreview2').innerHTML = ''
        fetchaddroom();
        return
    }
    document.querySelector('#addroomform').reset();
    fetchaddroom();
    return notification(request.message, 0);
}


// function runAdaddroomFormValidations() {
//     let form = document.getElementById('addroomform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#addroomname'))  controls.push([form.querySelector('#addroomname'), 'addroom name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }