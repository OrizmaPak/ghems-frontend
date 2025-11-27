let rumcat
let availroom
let availableroomlength
let occupiedroomlength
let receiveablelength
let payableslength
let saleslength
let userpermission
let allratecodes
const default_department = 'Main Store'

function formatCurrency(amount) {
  // Use the Intl.NumberFormat object for currency formatting
  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  });

  // Format the amount using the formatter
  const formattedCurrency = formatter.format(amount);

  return formattedCurrency;
}

async function getAllUsers(id='user') {
    try {
        let request = await httpRequest2('../controllers/fetchusers', null, null, 'json');
        if (request.status) {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = `<option value="">--ALL USERS--</option>`;
                element.innerHTML += request.data.map(data => 
                    `<option value="${data.email ?? ''}"> ${data.firstname ?? ''} ${data.lastname ?? ''} ${data.othernames ?? ''}</option>`
                ).join('');
            }
        } else {
            notification(request.message, 0);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        notification('Failed to fetch users', 0);
    }
}

window.onload = function() {
    runPermissions()
    rundashboard()
    runavailablerooms()
    resolveUrlPage() 
    entername()
    recalldatalist()
    checkAccountForVerification()
    syncHeaderHeight()
    runpermissioncheck('state')
    window.addEventListener('popstate', resolveUrlPage);
    window.addEventListener('resize', syncHeaderHeight);

    const toggler = document.getElementById('toggler')
    if(toggler) toggler.addEventListener('click', toggleNavigation)

    if(!isDeviceMobile()) {
        const navigation =  document.getElementById('navigation')
        navigation.classList.add('show')
    }

    Array.from(document.querySelectorAll('#navigation .nav-item > span')).forEach( nav => {
        nav.addEventListener('click', () => {
            if(nav.nextElementSibling?.tagName.toLocaleLowerCase() == 'ul') {
                const isCurrentlyExpanded = nav.parentElement.classList.contains('expand');
                
                // Collapse all other expanded dropdowns
                document.querySelectorAll('#navigation .nav-item.expand').forEach( expandedNav => {
                    if(expandedNav !== nav.parentElement) {
                        expandedNav.style.maxHeight = '36px';
                        expandedNav.classList.remove('expand');
                        const expandedNavSpan = expandedNav.querySelector('span');
                        if(expandedNavSpan && expandedNavSpan.querySelectorAll('.material-symbols-outlined')[1]) {
                            expandedNavSpan.querySelectorAll('.material-symbols-outlined')[1].style.transform = 'rotate(0deg)';
                        }
                    }
                });
                
                // Toggle the clicked dropdown
                if(isCurrentlyExpanded) {
                    nav.parentElement.style.maxHeight = '36px';
                    nav.parentElement.classList.remove('expand')
                    nav.querySelectorAll('.material-symbols-outlined')[1].style.transform = 'rotate(0deg)'
                }
                else {
                    nav.parentElement.style.maxHeight = '1000px';
                    nav.parentElement.classList.add('expand')
                    nav.querySelectorAll('.material-symbols-outlined')[1].style.transform = 'rotate(90deg)'
                }
            }
        })
    })

    Object.keys(routerTree).forEach( route => {
        if(route && !!document.getElementById(route)) {
            document.getElementById(route)?.addEventListener('click', () => {
                routerEvent(route)
                showActiveRoute()
            })
        }
    })

    const scriptsResource = Object.keys(routerTree).map( route => {
        return { url: routerTree[route].scriptName, controller: routerTree[route].startingFunction}
    })

    scriptsResource.filter( item => item.url !== '').forEach( resource => {
        loadScript(resource)
    })
    
    // NOTIFICATION FUNCTION
    // approverequisitionActive()

    const searchAvailableRoomInput = document.getElementById('searchavailableroom')
    const availableRoomContainer = document.getElementById('availableroomcontainer')

    if (searchAvailableRoomInput && availableRoomContainer) {
        const filterAvailableRooms = () => {
            const query = searchAvailableRoomInput.value.toLowerCase()
            const children = availableRoomContainer.children

            for (let i = 0; i < children.length; i++) {
                const label = children[i].querySelector('label')
                const text = label ? label.textContent.trim().toLowerCase() : ''

                if (!query || text.includes(query)) {
                    children[i].style.display = 'block'
                } else {
                    children[i].style.display = 'none'
                }
            }
        }

        searchAvailableRoomInput.addEventListener('keyup', filterAvailableRooms)
        searchAvailableRoomInput.addEventListener('change', filterAvailableRooms)

        const searchButton = document.querySelector('.search-box .btn-search')
        if (searchButton) {
            searchButton.addEventListener('click', e => {
                e.preventDefault()
                filterAvailableRooms()
            })
        }
    }

}

async function runPermissions(){
    let permission_switch = 'ON' // 'ON or OFF'
    document.getElementById('navigationcontainer').style.visibility = 'hidden';
    function param(){
        let para = new FormData()
        para.append('email', document.getElementById('your_email').value)
        return para
    }
    let request = await httpRequest2('../controllers/fetchuserprofile', param(), null, 'json')
    if(request.status) {
        userpermission = request.permissions
        let subitems = document.getElementsByClassName('navitem-child')
        if(request.role == 'SUPERADMIN'){ 
            for(i=0; i<subitems.length; i++){
                    subitems[i].classList.remove('hidden');
            }}
        if(request.role != 'SUPERADMIN'){ 
            for(i=0; i<subitems.length; i++){
              if(userpermission.split('|').includes(subitems[i].textContent.toUpperCase().trim())){
                    if(permission_switch === 'ON')subitems[i].classList.remove('hidden');
                }else{
                    if(permission_switch === 'ON')subitems[i].classList.add('hidden');
                }  
                    if(permission_switch === 'OFF')subitems[i].classList.remove('hidden');
            }
            let x =  document.getElementsByClassName('navitem-title')
            for(let i=0;i<x.length;i++){
                if(x[i].nextElementSibling){
                    let y = x[i].nextElementSibling.children
                    let m = false
                    for(let j=0;j<y.length;j++){
                        if(!y[j].classList.contains('hidden'))m = true
                    }
                    if(!m)x[i].classList.add('hidden')
                    if(m)x[i].classList.remove('hidden')
                }
            }
        }
        document.getElementById('navigationcontainer').style.visibility = 'visible';
    }
    else return notification('No records retrieved')
}


function rundashboard(){
    getoccupiedroom()
    gettotalsales()
    getreceiveable()
    getinventory()
    getpayabless()
}


async function gettotalsales() {
    let request = await httpRequest2('../controllers/gettotalsalesfortheday', null, null, 'json')
    if(request.status) {
        saleslength = formatCurrency(request.totalsalesfortoday)
        if(document.getElementById('dashsales'))document.getElementById('dashsales').textContent = saleslength
    }
    else return notification('No records retrieved')
}

async function getpayabless() {
    let request = await httpRequest2('../controllers/getpayables', null, null, 'json')
    if(request.status) {
        payableslength = formatNumber(request.data.length)
        if(document.getElementById('dashpayables'))document.getElementById('dashpayables').textContent = payableslength
    }
    else return notification('No records retrieved')
}

async function getinventory() {
    let request = await httpRequest2('../controllers/fetchinventorylist', null, null, 'json')
    if(request.status) {
        const items = normalizeInventoryItems(request.data)
        receiveablelength = formatNumber(items.length)
        if(document.getElementById('dashinventory'))document.getElementById('dashinventory').textContent = receiveablelength
    }
    else return notification('No records retrieved')
}

async function getreceiveable() {
    let request = await httpRequest2('../controllers/fetchreceivablesbyrooms', null, null, 'json')
    if(request.status) {
        receiveablelength = formatCurrency(request.data.reduce((accumulator, currentValue) => accumulator + (Number(currentValue.debit) - Number(currentValue.credit)), 0))
        if(document.getElementById('dashreceiveable'))document.getElementById('dashreceiveable').textContent = receiveablelength
    }
    else return notification('No records retrieved')
}

async function getoccupiedroom(){
    function param(){
        let par = new FormData()
        par.append('roomstatus', 'OCCUPIED')
        return par
    }
     let request = await httpRequest2('../controllers/getallroomstatus', param(), null, 'json')
    // request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) { 
            occupiedroomlength = request.data.length
            if(document.getElementById('dashoccupiedrooms'))document.getElementById('dashoccupiedrooms').textContent = request.data.length
           
        }
    }
    else return notification('No records for available rooms retrieved')
}

const availableRoomOpener = document.getElementById('aropener')
const availableRoomRemover = document.getElementById('arremover')
const availableRoomContainerOverlay = document.getElementById('arcontainer')

if (availableRoomOpener && availableRoomContainerOverlay) {
    availableRoomOpener.addEventListener('click', () => {
        availableRoomContainerOverlay.classList.add('!left-[0%]')
        runavailablerooms()
    })
}

if (availableRoomRemover && availableRoomContainerOverlay) {
    availableRoomRemover.addEventListener('click', () => {
        availableRoomContainerOverlay.classList.remove('!left-[0%]')
    })
}

if (availableRoomContainerOverlay) {
    availableRoomContainerOverlay.addEventListener('click', e => {
        e.stopPropagation()
        if (e.target.id === 'arcontainer') {
            availableRoomContainerOverlay.classList.remove('!left-[0%]')
        }
    })
}

function recalldatalist(stock=''){
    hemsuserlist()
    hemsdepartment(stock)
    hemsroomcategories()
    hemsroomnumber()
    hemsavailableroomnumber()
    hemsitemslist()
    hemscostcenter()
    hemsratecode()
}

async function runavailablerooms(){
     let request = await httpRequest('../controllers/getallroomstatus')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) { 
            availableroomlength = request.data.length
            if(document.getElementById('dashavailablerooms'))document.getElementById('dashavailablerooms').textContent = request.data.length
            did('availableroomcontainer').innerHTML = request.data.map((data, i)=>`
                <div x-data="{ open: false }" class="my-1 min-h-fit flex flex-col bg-transparent items-center justify-center relative overflow-hidden ">
                  <div  @click="open = ! open" class="p-2 !bg-[#64748b] cp w-full rounded rounded-b-none flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-[white]">meeting_room</span>
                        <h4 class="font-normal text-xs text-white">${data.roomnumber} ${data.roomname}</h4>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div x-show="open" @click.outside="open = false"  x-transition:enter="transition ease-out duration-300"
                        x-transition:enter-start="opacity-0 translate-y-0"
                        x-transition:enter-end="opacity-100 translate-y-0"
                        x-transition:leave="transition ease-in duration-300"
                        x-transition:leave-start="opacity-100 translate-y-10"
                        x-transition:leave-end="opacity-0 translate-y-0" class="w-full">
                    <h4 class="text-sm text-slate-400">
                         <div class="table-content !w-full">
                                    <label class="hidden">${data.roomname} ${data.roomnumber} ${data.roomcategory} ${data.roomstatus} ${data.building}</label>
                                    <table class="flex">
                                        <tbody id="">
                                           <tr class="flex flex-col !bg-[#64748b] text-white items-start ">
                                                <td class="opacity-90"> Room&nbsp;Name</td>
                                                <td class="opacity-90"> Room&nbsp;Number</td>
                                                <td class="opacity-90"> Building</td>
                                                <td class="opacity-90"> Room&nbsp;Category</td>
                                                <td class="opacity-90"> Room&nbsp;Status</td>
                                                <td class="opacity-90"> Status&nbsp;Desc.</td>
                                            </tr>
                                        </tbody>
                                        <tbody id="">
                                           <tr class="flex flex-col bg-white text-black w-[135%]">
                                                <td class="opacity-90"> ${data.roomname.toUpperCase()} </td>
                                                <td class="opacity-90"> ${data.roomnumber} </td>
                                                <td class="opacity-90"> ${data.building} </td>
                                                <td class="opacity-90"> ${data.roomcategory} </td>
                                                <td class="opacity-90"> ${data.roomstatus} </td>
                                                <td class="opacity-90"> ${data.roomstatusdescription} </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <img class="w-full" src="../images/${data.imageurl1}" />
                                    <img class="w-full" src="../images/${data.imageurl1}" />
                                    <button class="!bg-[#64748b] p-1 text-xs text-white hidden rounded mt-4">More Info</button>
                                </div>
                    </h4>
                    
                  </div>
                </div>
            `).join('')
        }
    }
    else return notification('No records for available rooms retrieved')
}

function checkotherbankdetails(comp='comp'){
    if(document.getElementById('paymentmethod')){
        if(document.getElementById('paymentmethod').value == 'TRANSFER' || document.getElementById('paymentmethod').value == 'POS'){
            document.getElementById('bankdetails').innerHTML = `<div class="form-group mt-2">
                                                     <label for="logoname" class="control-label">Bank Name</label>
                                                    <input type="number" name="bankname" id="bankname" placeholder="Enter bank name" class="form-control ${comp} bg-white" >
                                                </div>
                                                <div class="form-group mt-2">
                                                    <label for="logoname" class="control-label">Other Details</label>
                                                    <textarea type="number" name="otherdetails" id="otherdetails" placeholder="Enter account name, transaction reference and other relevant details" class="form-control ${comp} bg-white"></textarea>
                                                </div>`
        }else{
            document.getElementById('bankdetails').innerHTML = '';
        }
    }
    
}

async function hemscostcenter(id="") {
    let request = await httpRequest('../controllers/fetchcostcenter')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
                document.getElementById('hems_cost_center').innerHTML = request.data.map(data=>`<option value="${data.costcenter}">${data.id}</option>`).join('')
        }
    }
    else return notification('No records retrieved')
}
async function hemsratecode(id="") {
    let request = await httpRequest('../controllers/fetchratecode')
    request = JSON.parse(request)
    if(request.status) {
            allratecodes = request.data;
        if(request.data.length) {
                document.getElementById('hems_rate_code').innerHTML = request.data.map(data=>`<option value="${data.ratecode}"></option>`).join('')
                document.getElementById('hems_rate_code_id').innerHTML = request.data.map(data=>`<option value="${data.ratecode}">${data.id}</option>`).join('')
        }
    }
    else return notification('No records retrieved')
}
async function hemsroomnumber(id="") {
    let request = await httpRequest('../controllers/fetchrooms')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            if(id){
                document.getElementById('hems_roomnumber').innerHTML = request.data.filter(data=>data.categoryid == id).map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid}</option>`).join('')
                document.getElementById('hems_roomnumber_id').innerHTML = request.data.filter(data=>data.categoryid == id).map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid} || ${data.roomnumber}</option>`).join('')
                document.getElementById('hems_roomnumber_id1').innerHTML = request.data.filter(data=>data.categoryid == id).map(data=>`<option value="${data.roomname} ${data.categoryid} || ${data.roomnumber}">${data.roomnumber}</option>`).join('')
            }else{
                document.getElementById('hems_roomnumber').innerHTML = request.data.map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid}</option>`).join('')
                document.getElementById('hems_roomnumber_id').innerHTML = request.data.map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid} || ${data.roomnumber}</option>`).join('')
                document.getElementById('hems_roomnumber_id1').innerHTML = request.data.map(data=>`<option value="${data.roomname} ${data.categoryid} || ${data.roomnumber}">${data.roomnumber}</option>`).join('')
            }
        }
    }
    else return notification('No records retrieved')
}
async function hemsavailableroomnumber(id="") {
    let request = await httpRequest('../controllers/getallroomstatus')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            availroom = request.data
            if(id){
                document.getElementById('hems_roomnumber').innerHTML = request.data.filter(data=>data.categoryid == id).map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid}</option>`).join('')
                document.getElementById('hems_roomnumber_id').innerHTML = request.data.filter(data=>data.categoryid == id).map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid} || ${data.roomnumber}</option>`).join('')
                document.getElementById('hems_roomnumber_id1').innerHTML = request.data.filter(data=>data.categoryid == id).map(data=>`<option value="${data.roomname} ${data.categoryid} || ${data.roomnumber}">${data.roomnumber}</option>`).join('')
                document.getElementById('hems_available_roomnumber').innerHTML = request.data.filter(data=>data.categoryid == id).map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid}</option>`).join('')
                document.getElementById('hems_available_roomnumber_id').innerHTML = request.data.filter(data=>data.categoryid == id).map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid} || ${data.roomnumber}</option>`).join('')
            }else{
                document.getElementById('hems_roomnumber').innerHTML = request.data.map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid}</option>`).join('')
                document.getElementById('hems_roomnumber_id').innerHTML = request.data.map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid} || ${data.roomnumber}</option>`).join('')
                document.getElementById('hems_roomnumber_id1').innerHTML = request.data.map(data=>`<option value="${data.roomname} ${data.categoryid} || ${data.roomnumber}">${data.roomnumber}</option>`).join('')
                document.getElementById('hems_available_roomnumber').innerHTML = request.data.map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid}</option>`).join('')
                document.getElementById('hems_available_roomnumber_id').innerHTML = request.data.map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid} || ${data.roomnumber}</option>`).join('')
            }
        }
    }
    else return notification('No records retrieved')
}
async function hemsuserlist() {
    let request = await httpRequest('../controllers/fetchusers')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            document.getElementById('hems_userlist_id').innerHTML = request.data.map(data=>`<option>${data.firstname} ${data.lastname} || ${data.id}</option>`).join('')
            document.getElementById('hems_userlist_email').innerHTML = request.data.map(data=>`<option>${data.firstname} ${data.lastname} || ${data.email}</option>`).join('')
        }
    }
    else return notification('No records retrieved')
}

// async function hemsdepartment() {
//     let request = await httpRequest('../controllers/fetchlocation')
//     request = JSON.parse(request)
//     if(request.status) {
//         if(request.data.length) {
//             document.getElementById('hems_departmentlist').innerHTML = request.data.filter(data=>data.locationtype == 'DEPARTMENT').map(data=>`<option>${data.location} || ${data.id}</option>`).join('')
//         }
//     }
//     else return notification('No records retrieved')
// }
async function hemsroomcategories() {
    let request = await httpRequest('../controllers/fetchroomcategories')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            rumcat = request.data
            document.getElementById('hems_roomcategories').innerHTML = request.data.map(data=>`<option>${data.category} || ${data.id}</option>`).join('')
            for(let i=0;i<document.getElementsByClassName('roomcategory').length;i++){
                // console.log(document.getElementsByClassName('roomcategory')[i], document.getElementsByClassName('room-type')[i])
                if(document.getElementsByClassName('roomcategory')[i] && document.getElementsByClassName('roomcategory')[i].children.length < 2){
                    if(document.getElementsByClassName('roomcategory')[i])document.getElementsByClassName('roomcategory')[i].innerHTML = `<option value="">-- Select Room Type --</option>`
                    if(document.getElementsByClassName('roomcategory')[i])document.getElementsByClassName('roomcategory')[i].innerHTML += request.data.map(data=>`<option value="${data.id}">${data.category}</option>`).join('')
                }
                if(document.getElementsByClassName('room-type')[i] && document.getElementsByClassName('room-type')[i].children.length < 2){
                    if(document.getElementsByClassName('room-type')[i])document.getElementsByClassName('room-type')[i].innerHTML = `<option value="">-- Select Room Type --</option>`
                    if(document.getElementsByClassName('room-type')[i])document.getElementsByClassName('room-type')[i].innerHTML += request.data.map(data=>`<option value="${data.id}">${data.category}</option>`).join('')
                }
            }
        }
    }
    else return notification('No records retrieved')
}
async function hemsitemslist() {
    let request = await httpRequest('../controllers/fetchinventorylist')
    request = JSON.parse(request)
    if(request.status) {
        const items = normalizeInventoryItems(request.data)
        if(items.length) {
            document.getElementById('hems_itemslist').innerHTML = items.map(data=>`<option>${data.itemname.trim()}</option>`).join('')
            document.getElementById('hems_itemslist_getid').innerHTML = items.map(data=>`<option value="${data.itemname.trim()}">${data.itemid.trim()}</option>`).join('')
            document.getElementById('hems_itemslist_getname').innerHTML = items.map(data=>`<option value="${data.itemid.trim()}">${data.itemname.trim()}</option>`).join('')
        }
    }
    else return notification('No records retrieved')
}
async function hemsdepartment(stock='stock') {
    let request = await httpRequest('../controllers/fetchdepartments')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            // rumcat = request.data
            let res
            // if(stock)res= request.data.filter(dat=>dat.applyforsales == 'STOCK' || dat.applysales == 'NON STOCK')
            // if(!stock)res= request.data 
            res= request.data
            document.getElementById('hems_department').innerHTML = res.map(data=>`<option value="${data.department}">${data.id}</option>`).join('')
            if(document.getElementById('salespointname'))document.getElementById('salespointname').innerHTML = `<option value="">-- Select Sales Point --</option>`
            if(document.getElementById('salespointname'))document.getElementById('salespointname').innerHTML += res.filter(dat=>dat.applyforsales == 'NON STOCK' || dat.applyforsales == 'STOCK').map(data=>`<option ${data.department == default_department ? 'selected' : ''}>${data.department == 'FRONT-DESK/BOOKING' ? 'Booking/Reservation' : data.department}</option>`).join('')
            if(document.getElementById('salespointname1'))document.getElementById('salespointname1').innerHTML = `<option value="">-- Select Sales Point --</option>`
            if(document.getElementById('salespointname1'))document.getElementById('salespointname1').innerHTML += res.filter(dat=>dat.applyforsales == 'NON STOCK' || dat.applyforsales == 'STOCK').map(data=>`<option>${data.department == 'FRONT-DESK/BOOKING' ? 'Booking/Reservation' : data.department}</option>`).join('')
            if(document.getElementById('salespointname2'))document.getElementById('salespointname2').innerHTML = `<option value="">-- Select Sales Point --</option><option>ALL</option><option>Booking/Reservation</option>`
            if(document.getElementById('salespointname2'))document.getElementById('salespointname2').innerHTML += res.filter(dat=>dat.applyforsales == 'NON STOCK' || dat.applyforsales == 'STOCK').map(data=>`<option>${data.department == 'FRONT-DESK/BOOKING' ? 'Booking/Reservation' : data.department}</option>`).join('')
            if(document.getElementById('salespointnamemainstore'))document.getElementById('salespointnamemainstore').innerHTML = res.filter(dat=>dat.department == default_department).map(data=>`<option>${data.department == 'FRONT-DESK/BOOKING' ? 'Booking/Reservation' : data.department}</option>`).join('')
        }
    }
    else return notification('No records retrieved')
}
async function hemsdepartment2(stock='') {
    let request = await httpRequest('../controllers/fetchdepartments')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            // rumcat = request.data
            let res
            // if(stock)res= request.data.filter(dat=>dat.applyforsales == 'STOCK' || dat.applysales == 'NON STOCK')
            // if(!stock)res= request.data 
            res= request.data
            document.getElementById('hems_department').innerHTML = res.map(data=>`<option value="${data.department}">${data.id}</option>`).join('')
            if(stock == 'STOCK'){
                if(document.getElementById('salespointname'))document.getElementById('salespointname').innerHTML = `<option value="">-- Select Sales Point --</option>`
                if(document.getElementById('salespointname'))document.getElementById('salespointname').innerHTML += res.filter(dat=>dat.applyforsales == 'STOCK').map(data=>`<option ${data.department == default_department ? 'selected' : ''}>${data.department}</option>`).join('')
                if(document.getElementById('salespointname1'))document.getElementById('salespointname1').innerHTML = `<option value="">-- Select Sales Point --</option>`
                if(document.getElementById('salespointname1'))document.getElementById('salespointname1').innerHTML += res.filter(dat=>dat.applyforsales == 'STOCK').map(data=>`<option>${data.department}</option>`).join('')
            }
            if(stock == 'NON STOCK'){
                if(document.getElementById('salespointname'))document.getElementById('salespointname').innerHTML = `<option value="">-- Select Sales Point --</option>`
                if(document.getElementById('salespointname'))document.getElementById('salespointname').innerHTML += res.filter(dat=>dat.applyforsales == 'NON STOCK').map(data=>`<option ${data.department == default_department ? 'selected' : ''}>${data.department}</option>`).join('')
                if(document.getElementById('salespointname1'))document.getElementById('salespointname1').innerHTML = `<option value="">-- Select Sales Point --</option>`
                if(document.getElementById('salespointname1'))document.getElementById('salespointname1').innerHTML += res.filter(dat=>dat.applyforsales == 'NON STOCK').map(data=>`<option>${data.department}</option>`).join('')
            }
            if(stock == ''){
                if(document.getElementById('salespointname'))document.getElementById('salespointname').innerHTML = `<option value="">-- Select Sales Point --</option>`
                if(document.getElementById('salespointname'))document.getElementById('salespointname').innerHTML += res.map(data=>`<option ${data.department == default_department ? 'selected' : ''}>${data.department}</option>`).join('')
                if(document.getElementById('salespointname1'))document.getElementById('salespointname1').innerHTML = `<option value="">-- Select Sales Point --</option>`
                if(document.getElementById('salespointname1'))document.getElementById('salespointname1').innerHTML += res.map(data=>`<option>${data.department}</option>`).join('')
            }
        }
    }
    else return notification('No records retrieved')
}


function entername(){
    if(!sessionStorage.getItem('user'))return window.location.href = './login.php'
    let x = JSON.parse(sessionStorage.getItem('user'))
    for(let i=0;i<document.getElementsByName('user_name').length;i++){
        if(document.getElementsByName('user_name')[i])document.getElementsByName('user_name')[i].innerHTML = `<span class="capitalize">${x.firstname}&nbsp;${x.lastname}</span>`
        if(document.getElementsByName('user_role')[i])document.getElementsByName('user_role')[i].innerHTML = `<span>${x.role}</span>`
    }
}

async function verifyemail() {
    let request = await httpRequest2('../../framework/controllers/verifyemail', null, null, 'json')
    if(request.status) {
        return notification('Email sent!', 1);
        
    }
    return notification(request.message, 0);
}

function getLabelFromValue(selectedValue, id) {
  const datalist = document.getElementById(id);
  const options = datalist.querySelectorAll('option');
  
  for (const option of options) {
    if (option.value == selectedValue) {
        console.log('value option', option.textContent)
      return option.textContent;
    }
  }
  
  return ''; // Return null if value not found
}


function checkAccountForVerification() {
    let user = JSON.parse(sessionStorage.getItem('user'))
    if(user?.status === 'NOT VERIFIED') {
        let div = document.createElement('div')
        div.className = 'bg-rose-400 text-white/90 text-xs p-1.5 px-5 flex items-center gap-3 font-heebo animate__animated animate__fadeInDown'
        div.innerHTML = `<span>Your account is not verified.</span><button onclick="verifyemail()" class="cursor-pointer underline underline-offset-4 hover:no-underline">Click to verify</button>`
        
        let domElement = document.querySelector('main')
        domElement.firstElementChild.insertBefore(div, domElement.firstElementChild.firstElementChild)
    }
}

function syncHeaderHeight() {
    const header = document.querySelector('header')
    if (!header) return

    // Include any banners inserted before the header by using offsetTop plus its own height
    const totalHeight = Math.max(header.offsetTop + header.offsetHeight, 72)
    document.documentElement.style.setProperty('--header-height', `${totalHeight}px`)
}

function toggleNavigation() {
    const navigation = document.getElementById('navigation')
    if (navigation) {
        const isDesktop = isDeviceMobile()
        const isCollapsed = navigation.classList.contains('show')

        if (isDesktop) {
            // Desktop: keep layout width, slide sidebar in/out
            if (isCollapsed) {
                navigation.style.transform = 'translateX(0)'
            } else {
                navigation.style.transform = 'translateX(-100%)'
            }
            navigation.classList.toggle('show')
        } else {
            // Mobile / tablet: use width for slide-in menu
            if (isCollapsed) {
                navigation.style.width = (80 / 100 * screen.availWidth) + 'px'
            } else {
                navigation.style.width = '0'
            }
            navigation.classList.toggle('show')
        }
    }
}

function isDeviceMobile() {
    let matches = window.matchMedia('(min-width: 1280px)').matches
    return matches
}


function notificationpanel(action){
        if(!action)document.getElementById('notificationpanel').classList.toggle('!h-[0px]')
        if(action == 'OPEN')document.getElementById('notificationpanel').classList.remove('!h-[0px]')
        if(action == 'CLOSE')document.getElementById('notificationpanel').classList.add('!h-[0px]')
}


window.addEventListener('click', e=>{
    if(!e.target.classList.contains('qq'))notificationpanel('CLOSE')
})
