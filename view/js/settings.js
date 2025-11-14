let settingsid
async function settingsActive() {
    const form = document.querySelector('#settingsform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', settingsFormSubmitHandler)
    if(document.getElementById('settings_basicinfo'))document.getElementById('settings_basicinfo').addEventListener('click', e=>tabsettings('settings_basicinfo'))
    if(document.getElementById('settings_defaultaccounts'))document.getElementById('settings_defaultaccounts').addEventListener('click', e=>tabsettings('settings_defaultaccounts'))
    datasource = []
    await populatesettingsselects()
    // await fetchsettings()
}

function updateImage(event) {
    const input = event.target;
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const displayImg = document.getElementById('displayimg');
            displayImg.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}


function tabsettings(state){
    if(!state)return
    document.getElementById('settings_basicinfo').classList.remove('active','border-b-2', '!border-blue-600', '!text-blue-600')
    document.getElementById('settings_defaultaccounts').classList.remove('active','border-b-2', '!border-blue-600', '!text-blue-600')
    document.getElementById('settings_basicinfo').children[0].classList.remove('!text-blue-600')
    document.getElementById('settings_defaultaccounts').children[0].classList.remove('!text-blue-600')
    // document.getElementsByName('settings_basicinfo')[0].classList.add('hidden')
    // document.getElementsByName('settings_defaultaccounts')[0].classList.add('hidden')
    if(state == 'settings_basicinfo'){
        document.getElementById('settings_basicinfo').classList.add('active','border-b-2', '!border-blue-600', '!text-blue-600')
        document.getElementById('settings_basicinfo').children[0].classList.add('!text-blue-600')
        document.getElementsByName('settings_basicinfo')[0].classList.add('w-[100%]', 'h-fit', 'visible')
        document.getElementsByName('settings_basicinfo')[0].classList.remove('w-[0%]', 'h-0', 'invisible')
        document.getElementsByName('settings_defaultaccounts')[0].classList.add('w-[0%]', 'h-0', 'invisible')
        document.getElementsByName('settings_defaultaccounts')[0].classList.remove('w-[100%]', 'h-fit', 'visible')
    }
    if(state == 'settings_defaultaccounts'){
        document.getElementById('settings_defaultaccounts').classList.add('active','border-b-2', '!border-blue-600', '!text-blue-600')
        document.getElementById('settings_defaultaccounts').children[0].classList.add('!text-blue-600')
        document.getElementsByName('settings_defaultaccounts')[0].classList.add('w-[100%]', 'h-fit', 'visible')
        document.getElementsByName('settings_defaultaccounts')[0].classList.remove('w-[0%]', 'h-0', 'invisible')
        document.getElementsByName('settings_basicinfo')[0].classList.add('w-[0%]', 'h-0', 'invisible')
        document.getElementsByName('settings_basicinfo')[0].classList.remove('w-[100%]', 'h-fit', 'visible')
    }
}

async function fetchsettings(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchorganisationscript', id ? getparamm() : null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
            populateData(request.data.data[0])
            if(request.data.data[0].logo != '-')did('displayimg').src = `../images/${request.data.data[0].logo}`;
            did('company_id').value = request.data.data[0].company_id 
    }
    else return notification('No records retrieved')
}

async function populatesettingsselects(id='') {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    } 
    let request = await httpRequest2('../controllers/fetchglbyaccounttype', id ? getparamm() : null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        for(let i=0;i<document.getElementsByClassName('populateaccounts').length;i++){
            document.getElementsByClassName('populateaccounts')[i].innerHTML += request.data.map(item=>`<option value="${item.accountnumber}">${item.description}</option>`).join('')
        }
        fetchsettings()
    }
    else return notification('No records retrieved')
}
 
async function removesettings(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this settings?");

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
    fetchsettings()
    return notification(request.message);
    
}


async function onsettingsTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchsettings('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removesettings('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function settingsFormSubmitHandler() {
    if(!validateForm('settingsform', getIdFromCls('comp'))) return notification('Please ensure all compulsory inputs has values', 0)
    
    let payload

    payload = getFormData2(document.querySelector('#settingsform'), [['photofilename', showFileName('fileInput')],['userphotoname', getFile('fileInput')]])
    let request = await httpRequest2('../controllers/organisationinfoscript', payload, document.querySelector('#settingsform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#settingsform').reset();
        fetchsettings();
        return
    }
    document.querySelector('#settingsform').reset();
    fetchsettings();
    return notification(request.message, 0);
}


// function runAdsettingsFormValidations() {
//     let form = document.getElementById('settingsform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#settingsname'))  controls.push([form.querySelector('#settingsname'), 'settings name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }