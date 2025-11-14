let accesscontrolid

const accessctrl_administration = [
    'PROFILE',
    'CHANGE PASSWORD',
    'ACTIVITY PANEL',
    'DEPARTMENT',
    'ACCESS CONTROL',
    'USERS',
    'RATE CODE',
    'BOOKING PLAN',
    'DISCOUNT COUPON',
    'COST CENTER',
    'SETTINGS',
    'UPDATE OTHER USERS PROFILE',
    'REVERSE PAYMENT',
    'REVERSE SALES',
    'REVERSE RECEIPT',
    'REVERSE RECEIVE PURCHASES'
];

const accessctrl_inventory = [
    'CREATE INVENTORY',
    'OPENING STOCK',
    'UPDATE INVENTORY',
    'VIEW INVENTORY',
    'REQUISITION',
    'VIEW REQUISITION',
    'APPROVE REQUISITION',
    'ISSUE TYPE LIST',
    'ISSUE LOG',
    'VIEW ISSUE LOG',
    'RETURN ITEM',
    'VIEW RETURNED ITEM',
    'STOCK LEDGER',
    'STOCK VALUATION',
    `APPROVE REQUISITION`,
    `DELETE ISSUE TYPE`, 
    `DELETE INVENTORY`,
    `UPDATE INVENTORY`,
    `DELETE STORAGE/WAREHOUSE`,
    `DELETE ROOM CATEGORIES`,
];


const accessctrl_recipe = [
    `RECIPE`,
    `VIEW RECIPE`,
    `BUILD`,
    `VIEW BUILD`,
    `DINING TABLE`,
    `RESERVE TABLE`,
    'REVERSE TABLE RESERVATION'
]


const accessctrl_accounts = ['ADD GL ACCOUNT', 'VIEW GL ACCOUNTS', 'ADD GL TRANSACTION', 'GL TRANSACTION HISTORY', 'TRIAL BALANCE', 'INCOME STATEMENT', 'BALANCE SHEET', 'GENERAL SALES REPORT']


const accessctrl_maintenace = ['MAINTENANCE REQUEST', 'VIEW MAINTENANCE REQUEST', 'WORK ORDER']


const accessctrl_housekeeping = ['ROOM CATEGORIES', 'ROOMS', 'UPDATE ROOM STATUS', 'DAILY ASSIGNMENT SHEET', 'VIEW DAILY ASSIGNMENT SHEET', 'CREATE CHECKLIST FOR CLEANING', 'ROOM CLEANING CHECKLIST', 'LOST & FOUND REGISTER']



const accessctrl_frontdesk = [
    'SEARCH ARRIVALS',
    'GROUPS',
    'GUESTS & RESERVATIONS',
    'RESERVATION CHECK IN',
    'DIRECT CHECK IN',
    'GROUP RESERVATIONS',
    'GROUP CHECK IN',
    'PRINT REGISTRATION CARD',
    'EXPECTED ARRIVALS',
    'EXTEND STAY',
    'CHECK OUT',
    'CANCEL RESERVATION',
    'RE-ASSIGN ROOMS',
    'ROOM STATUS',
    'MESSAGES',
    'NOTIFICATIONS',
    'RECEIVABLES',
    'REVIEWS',
    'REVERSE RESERVATION',
    'NO POSTING',
    'DELETE GUEST'
];


const accessctrl_sales = ['SALES', 'VIEW ALL USER SALES']

const accessctrl_purchases = ['MANAGE SUPPLIER', 'PURCHASE ORDER', 'VIEW PURCHASE ORDER', 'RECEIVE PURCHASES', 'VIEW PURCHASES', 'PAYABLES', 'ALL PAYABLES']

const accessctrl_cashier = [
    'TRACK',
    'INVOICING',
    'RECEIPTS'
]


const access_array = [
                        ['accessctrl_administration', 'ADMINISTRATION', accessctrl_administration], 
                        ['accessctrl_inventory', 'INVENTORY', accessctrl_inventory], 
                        ['accessctrl_frontdesk', 'FRONT DESK', accessctrl_frontdesk],
                        ['accessctrl_cashier', 'CASHIER', accessctrl_cashier],
                        ['accessctrl_sales', 'POINT OF SALES', accessctrl_sales],
                        ['accessctrl_recipe', 'FOOD & BEVERAGE', accessctrl_recipe],
                        ['accessctrl_purchases', 'PURCHASES', accessctrl_purchases],
                        ['accessctrl_housekeeping', 'HOUSE KEEPING', accessctrl_housekeeping],
                        ['accessctrl_maintenace', 'MAINTENACE', accessctrl_maintenace],
                        ['accessctrl_accounts', 'ACCOUNTS', accessctrl_accounts],
                    ]

async function accesscontrolActive() {
    const form = document.querySelector('#accesscontrolsform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', accesscontrolFormSubmitHandler)
    if(document.getElementById('accesssave'))document.getElementById('accesssave').addEventListener('click', submitaccesssettings)
    let request = await httpRequest2('../controllers/fetchlocation', null, null, 'json')
    if(request.status) {
            if(request.data.length) {
                did('departmentlist').innerHTML = `${request.data.map(dat=>`<option>${dat.location} || ${dat.id}</option>`)}`
            }
    } else return notification('No records retrieved')
    let request2 = await httpRequest2('../controllers/fetchusers', null, null, 'json')
    if(request2.status) {
            if(request2.data.length) {
                did('userslist').innerHTML = `${request2.data.map(dat=>`<option>${dat.firstname} ${dat.lastname} || ${dat.email}</option>`)}`
            }
    } else return notification('No records retrieved')
    datasource = []
    // await fetchaccesscontrols()
}

async function submitaccesssettings(){
        if(!validateForm('accesscontrolsform', [`email`, 'role'])) return
    function payload(){
        let param = new FormData()
        param.append('email', document.getElementById('email').value.split('||')[1].trim())
        param.append('role', document.getElementById('role').value)
        let accessstring = ''
        for(let i=0;i<document.getElementsByClassName('accesscontroller').length;i++){
            if(document.getElementsByClassName('accesscontroller')[i].checked)accessstring += `${document.getElementsByClassName('accesscontroller')[i].name}||` 
        }
        param.append('permissions', accessstring)
        return param
    }
    let request = await httpRequest2('../controllers/updatepermissions', payload(), document.querySelector('#accesscontrolsform #accesssave'))
    if(request.status) {
        notification('Record saved successfully!', 1);
         did('email').value = ''
         did('role').value = ''
        did('department').value = ''
        did('accesssave').classList.add('hidden')
        did('accessctrl_container').innerHTML = ''
        fetchaccesscontrols();
        return
    }
    document.querySelector('#accesscontrolform').reset();
    fetchaccesscontrols();
    return notification(request.message, 0);
}
 
function accessboard(element){
    if(!element.value){
        did('role').value = ''
        did('department').value = ''
        did('accesssave').classList.add('hidden')
        did('accessctrl_container').innerHTML = ''}
}

function accessappendboard(res){
    for(let i=0;i<access_array.length;i++){
        let element = document.createElement('div')
        element.setAttribute('id', access_array[i][0])
        element.classList.add('flex', 'flex-col', 'border-r', 'mr-3', 'pr-3', 'border-b', 'mb-3', 'pb-3', 'W-[200px]')
        did('accessctrl_container').appendChild(element)
        document.getElementById(`${access_array[i][0]}`).innerHTML = `<p class="page-title">
                                <span>${access_array[i][1]}</span>
                            </p>`;
        document.getElementById(`${access_array[i][0]}`).innerHTML += access_array[i][2].map(data=>`<label class="bg-[#1d68e305] p-2 pl-1 mb-[1px] relative inline-flex items-center cursor-pointer">
                                          <input type="checkbox" name="${data}" ${res.permissions.split('||').includes(data) ? 'checked' : ''} class="sr-only peer accesscontroller">
                                          <div class="scale-[0.8] w-11 h-6 bg-gray-400 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                          <span class="ms-2 text-xs font-medium text-blue-900">${data}</span>
                                        </label>`).join('')
    }
    
}

function populateaccesscontrolboard(result){
    accessappendboard(result);
    did('role').value =  result.role
    did('department').value = `${result.location_name} || ${result.location_id}`
    did('accesssave').classList.remove('hidden')
    
}

async function fetchaccesscontrols(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchaccesscontrols', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onaccesscontrolTableDataSignal)
            }
        }else{
             accesscontrolid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeaccesscontrol(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this accesscontrol?");

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
    fetchaccesscontrols()
    return notification(request.message);
    
}


async function onaccesscontrolTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchaccesscontrols('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeaccesscontrol('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function accesscontrolFormSubmitHandler() {
    if(!validateForm('accesscontrolsform', [`email`])) return
    
    function payload(){
        let params = new FormData()
        params.append('email', document.getElementById('email').value.split('||')[1].trim())
        return params
    }
    
    let request = await httpRequest2('../controllers/fetchuserprofile', payload(), document.querySelector('#accesscontrolsform #submit'), 'json')
    if(request.status) {
        populateaccesscontrolboard(request)
        return
    }
    document.querySelector('#accesscontrolform').reset();
    // fetchaccesscontrols();
    return notification(request.message, 0);
}

// async function accesscontrolFormSubmitHandler() {
    // if(!validateForm('accesscontrolsform', [`productname`, `productdescription`])) return
    
    // let payload

    // payload = getFormData2(document.querySelector('#accesscontrolsform'), accesscontrolid ? [['id', accesscontrolid]] : null)
    // let request = await httpRequest2('../controllers/fetchuserprofile', payload, document.querySelector('#accesscontrolsform #submit'))
    // if(request.status) {
    //     notification('Record saved successfully!', 1);
    //     document.querySelector('#accesscontrolsform').reset();
    //     fetchaccesscontrols();
    //     return
    // }
    // document.querySelector('#accesscontrolform').reset();
    // fetchaccesscontrols();
    // return notification(request.message, 0);
// }


// function runAdaccesscontrolFormValidations() {
//     let form = document.getElementById('accesscontrolsform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#accesscontrolname'))  controls.push([form.querySelector('#accesscontrolname'), 'accesscontrol name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }