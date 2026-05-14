let rumcat
let availroom
let availableroomlength
let occupiedroomlength
let receiveablelength
let payableslength
let saleslength 
let userpermission
let allratecodes
let availableRoomsRefreshInterval = null
const default_department = 'Main Store'
const personnelPayrollMainRouteMap = {
    pp_level_main: 'pp_level',
    pp_personnel_main: 'pp_personnel',
    pp_approvepersonnel_main: 'pp_approvepersonnel',
    pp_viewpersonnel_main: 'pp_viewpersonnel',
    pp_personnelhistory_main: 'pp_personnelhistory',
    pp_guarantor_main: 'pp_guarantor',
    pp_employerrecord_main: 'pp_employerrecord',
    pp_referees_main: 'pp_referees',
    pp_qualification_main: 'pp_qualification',
    pp_parentsguardians_main: 'pp_parentsguardians',
    pp_query_main: 'pp_query',
    pp_promotions_main: 'pp_promotions',
    pp_termination_main: 'pp_termination',
    pp_suspension_main: 'pp_suspension',
    pp_leave_main: 'pp_leave',
    pp_warning_main: 'pp_warning',
    pp_monitorevaluation_main: 'pp_monitorevaluation',
    pp_advance_main: 'pp_advance',
    pp_viewstaffadvance_main: 'pp_viewstaffadvance',
    pp_personalstaffsalaryrecord_main: 'pp_personalstaffsalaryrecord',
    pp_viewmonthlysalaryschedule_main: 'pp_viewmonthlysalaryschedule',
    pp_presalaryapproval_main: 'pp_presalaryapproval',
    pp_confirmsalary_main: 'pp_confirmsalary',
    pp_payrollclassa_main: 'pp_payrollclassa',
    pp_payrollclassb_main: 'pp_payrollclassb'
}

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
}

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
    window.scrollTo(0, 0)
    decorateNavigationDescriptions()
    if(currentUserIsSuperAdmin()){
        enforceSuperAdminNavigation()
        scheduleSuperAdminNavigationStabilizer()
    }
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

    Object.keys(personnelPayrollMainRouteMap).forEach(routeId => {
        const targetRoute = personnelPayrollMainRouteMap[routeId]
        if(routeId && targetRoute && document.getElementById(routeId)) {
            document.getElementById(routeId)?.addEventListener('click', () => {
                routerEvent(targetRoute)
                showActiveRoute()
            })
        }
    })

    const scriptsResource = Object.keys(routerTree).map( route => {
        return { url: routerTree[route].scriptName, controller: routerTree[route].startingFunction}
    })

    const seenScriptUrls = new Set()
    scriptsResource.filter(item => item.url !== '' && !seenScriptUrls.has(item.url) && seenScriptUrls.add(item.url)).forEach( resource => {
        loadScript(resource)
    })
    
    // NOTIFICATION FUNCTION
    // approverequisitionActive()

    const searchAvailableRoomInput = document.getElementById('searchavailableroom')
    const availableRoomContainer = document.getElementById('availableroomcontainer')

    if (searchAvailableRoomInput && availableRoomContainer) {
        const filterAvailableRooms = () => {
            const query = searchAvailableRoomInput.value.toLowerCase()
            const roomTiles = availableRoomContainer.querySelectorAll('.ar-room-tile')
            roomTiles.forEach(tile => {
                const text = String(tile.dataset.roomSearch || '').toLowerCase()
                tile.style.display = (!query || text.includes(query)) ? 'flex' : 'none'
            })
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

function decorateNavigationDescriptions(){
    const navItems = document.querySelectorAll('#navigation [title]')
    navItems.forEach(item => {
        const titleValue = item.getAttribute('title') || ''
        const label = extractNavItemLabel(item)
        const hasHtml = titleValue.trim().startsWith('<')
        const markup = hasHtml ? titleValue : buildNavDescriptionMarkup(label, titleValue)
        const plainTooltip = toPlainGuideTooltip(hasHtml ? titleValue : titleValue, label)

        item.dataset.guideHtml = markup
        item.setAttribute('title', plainTooltip)
    })
}

function extractNavItemLabel(item){
    if(item.classList.contains('navitem-title')){
        const labelWrapper = item.children[1]?.querySelector('span:first-child')
        if(labelWrapper) return labelWrapper.textContent.trim()
    }
    return (item.textContent || '').trim()
}

function showAllNavigationItems(){
    let navItems = document.querySelectorAll('#navigation .nav-item')
    navItems.forEach(item => item.classList.remove('hidden'))

    let subitems = document.getElementsByClassName('navitem-child')
    for(let i=0; i<subitems.length; i++){
        subitems[i].classList.remove('hidden')
    }

    let titles = document.getElementsByClassName('navitem-title')
    for(let i=0; i<titles.length; i++){
        titles[i].classList.remove('hidden')
    }
}

function enforceSuperAdminNavigation(){
    showAllNavigationItems()
    const navigationContainer = document.getElementById('navigationcontainer')
    if(navigationContainer) navigationContainer.style.visibility = 'visible'
}

let superAdminNavigationStabilizerScheduled = false
function scheduleSuperAdminNavigationStabilizer(){
    if(!currentUserIsSuperAdmin() || superAdminNavigationStabilizerScheduled) return
    superAdminNavigationStabilizerScheduled = true

    const stabilizationDelays = [100, 400, 1200]
    stabilizationDelays.forEach(delay => {
        setTimeout(() => {
            enforceSuperAdminNavigation()
        }, delay)
    })
}

function applyGrantedPermissionsToNavigation(grantedPermissions, permissionSwitch='ON'){
    if(grantedPermissions?.has('*')){
        showAllNavigationItems()
        return
    }

    let subitems = document.getElementsByClassName('navitem-child')
    for(let i=0; i<subitems.length; i++){
        if(grantedPermissions.has(getNavPermissionKeyFromNode(subitems[i]))){
            if(permissionSwitch === 'ON') subitems[i].classList.remove('hidden')
        }else{
            if(permissionSwitch === 'ON') subitems[i].classList.add('hidden')
        }

        if(permissionSwitch === 'OFF') subitems[i].classList.remove('hidden')
    }

    let titles = document.getElementsByClassName('navitem-title')
    for(let i=0; i<titles.length; i++){
        if(titles[i].nextElementSibling){
            let children = titles[i].nextElementSibling.children
            let hasVisibleChild = false
            for(let j=0; j<children.length; j++){
                if(!children[j].classList.contains('hidden')) hasVisibleChild = true
            }
            if(!hasVisibleChild) titles[i].classList.add('hidden')
            if(hasVisibleChild) titles[i].classList.remove('hidden')
        }
    }
}

function buildNavDescriptionMarkup(label, description){
    const safeLabel = sanitizeHTML(label)
    const safeDescription = sanitizeHTML(description)
    return `<div class='text-[13px] leading-relaxed text-slate-700'><span class='font-semibold text-primary-g text-sm block mb-1'>${safeLabel}</span><p class='text-[12px] text-slate-600 leading-relaxed mb-1'>${safeDescription}</p></div>`
}

function sanitizeHTML(value=''){
    const temp = document.createElement('div')
    temp.textContent = value
    return temp.innerHTML
}

function stripHTML(value=''){
    const temp = document.createElement('div')
    temp.innerHTML = String(value || '')
    return (temp.textContent || temp.innerText || '').trim()
}

function toPlainGuideTooltip(description='', label=''){
    const plainDescription = stripHTML(description).replace(/\s+/g, ' ').trim()
    const plainLabel = String(label || '').replace(/\s+/g, ' ').trim()
    const base = plainDescription || plainLabel || 'Click guide'
    const capped = base.length > 160 ? `${base.slice(0, 157).trimEnd()}...` : base
    return capped
}

async function runPermissions(){
    let permission_switch = 'ON' // 'ON or OFF'
    const navigationContainer = document.getElementById('navigationcontainer')
    navigationContainer.style.visibility = 'hidden'

    if(currentUserIsSuperAdmin()){
        userpermission = '*'
        enforceSuperAdminNavigation()
        scheduleSuperAdminNavigationStabilizer()
        return
    }

    let request = await fetchCurrentUserProfileCached(true)
    if(!request?.status){
        navigationContainer.style.visibility = 'visible'
        return notification('No records retrieved')
    }

    if(normalizeRoleName(request.role || getCurrentSessionRoleName()) === 'SUPERADMIN'){
        userpermission = '*'
        enforceSuperAdminNavigation()
        scheduleSuperAdminNavigationStabilizer()
        return
    }

    userpermission = request.permissions
    applyGrantedPermissionsToNavigation(
        request.grantedPermissions || buildGrantedPermissionSet(userpermission),
        permission_switch
    )
    navigationContainer.style.visibility = 'visible'
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
            occupiedroomlength = request.data.filter(room => room.roomstatus == 'OCCUPIED').length
            if(document.getElementById('dashoccupiedrooms'))document.getElementById('dashoccupiedrooms').textContent = occupiedroomlength
           
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
        if (availableRoomsRefreshInterval) clearInterval(availableRoomsRefreshInterval)
        availableRoomsRefreshInterval = setInterval(() => {
            if (availableRoomContainerOverlay.classList.contains('!left-[0%]')) runavailablerooms()
        }, 15000)
    })
}

if (availableRoomRemover && availableRoomContainerOverlay) {
    availableRoomRemover.addEventListener('click', () => {
        availableRoomContainerOverlay.classList.remove('!left-[0%]')
        if (availableRoomsRefreshInterval) {
            clearInterval(availableRoomsRefreshInterval)
            availableRoomsRefreshInterval = null
        }
    })
}

if (availableRoomContainerOverlay) {
    availableRoomContainerOverlay.addEventListener('click', e => {
        e.stopPropagation()
        if (e.target.id === 'arcontainer') {
            availableRoomContainerOverlay.classList.remove('!left-[0%]')
            if (availableRoomsRefreshInterval) {
                clearInterval(availableRoomsRefreshInterval)
                availableRoomsRefreshInterval = null
            }
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
            const statusClasses = (rawStatus = '') => {
                const status = String(rawStatus || '').trim().toUpperCase()
                if (status === 'OCCUPIED' || status === 'CHECKED IN') return 'bg-red-600 text-yellow-200'
                if (status === 'RESERVED' || status === 'OPEN') return 'bg-orange-500 text-white'
                if (status === 'AVAILABLE' || status === 'CHECKED OUT') return 'bg-green-400 text-slate-900'
                return 'bg-violet-400 text-slate-900'
            }

            const sortedRooms = [...request.data].sort((a, b) => {
                const ar = Number(String(a.roomnumber || '').replace(/\D/g, ''))
                const br = Number(String(b.roomnumber || '').replace(/\D/g, ''))
                if (!Number.isNaN(ar) && !Number.isNaN(br) && ar !== br) return ar - br
                return String(a.roomnumber || '').localeCompare(String(b.roomnumber || ''))
            })

            did('availableroomcontainer').innerHTML = `
                <div class="mb-2 rounded-md border border-slate-300 bg-white p-2">
                    <div class="grid grid-cols-3 gap-1 text-[9px] font-semibold">
                        <div class="rounded px-1 py-1 bg-green-400 text-slate-900 text-center">AVAILABLE</div>
                        <div class="rounded px-1 py-1 bg-orange-500 text-white text-center">RESERVED</div>
                        <div class="rounded px-1 py-1 bg-red-600 text-yellow-200 text-center">OCCUPIED</div>
                    </div>
                </div>
                <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-1.5 pb-8">
                    ${sortedRooms.map((data) => {
                        const searchText = `${data.roomname || ''} ${data.roomnumber || ''} ${data.roomcategory || ''} ${data.roomstatus || ''} ${data.building || ''}`.toLowerCase()
                        return `
                            <div class="ar-room-tile ${statusClasses(data.roomstatus)} border border-slate-300 rounded-md p-1 min-h-[48px] flex flex-col justify-center items-center shadow-sm transition-all hover:scale-[1.02]"
                                 data-room-search="${searchText}">
                                <div class="text-[19px] leading-none font-extrabold tracking-tight">${data.roomnumber || '-'}</div>
                                <div class="text-[8px] mt-[2px] font-semibold opacity-95">${String(data.roomstatus || '-').toUpperCase()}</div>
                            </div>
                        `
                    }).join('')}
                </div>
            `
        }
    }
    else return notification('No records for available rooms retrieved')
}

function checkotherbankdetails(comp='comp'){
    if(document.getElementById('paymentmethod')){
        if(document.getElementById('paymentmethod').value == 'TRANSFER' || document.getElementById('paymentmethod').value == 'POS'){
            document.getElementById('bankdetails').innerHTML = `<div class="form-group mt-2">
                                                     <label for="logoname" class="control-label">Bank Name</label>
                                                    <input type="text" name="bankname" id="bankname" placeholder="Enter bank name" class="form-control ${comp} bg-white" >
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
                document.getElementById('hems_roomnumber_id').innerHTML = request.data.filter(data=>data.categoryid == id).map(data=>`<option value="${data.roomnumber}">${data.roomname} | ${data.roomcategory || data.categoryid} | Floor ${data.floor || '-'} || ${data.roomnumber}</option>`).join('')
                document.getElementById('hems_roomnumber_id1').innerHTML = request.data.filter(data=>data.categoryid == id).map(data=>`<option value="${data.roomname} ${data.categoryid} || ${data.roomnumber}">${data.roomnumber}</option>`).join('')
            }else{
                document.getElementById('hems_roomnumber').innerHTML = request.data.map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid}</option>`).join('')
                document.getElementById('hems_roomnumber_id').innerHTML = request.data.map(data=>`<option value="${data.roomnumber}">${data.roomname} | ${data.roomcategory || data.categoryid} | Floor ${data.floor || '-'} || ${data.roomnumber}</option>`).join('')
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
                document.getElementById('hems_roomnumber_id').innerHTML = request.data.filter(data=>data.categoryid == id).map(data=>`<option value="${data.roomnumber}">${data.roomname} | ${data.roomcategory || data.categoryid} | Floor ${data.floor || '-'} || ${data.roomnumber}</option>`).join('')
                document.getElementById('hems_roomnumber_id1').innerHTML = request.data.filter(data=>data.categoryid == id).map(data=>`<option value="${data.roomname} ${data.categoryid} || ${data.roomnumber}">${data.roomnumber}</option>`).join('')
                document.getElementById('hems_available_roomnumber').innerHTML = request.data.filter(data=>data.categoryid == id).map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid}</option>`).join('')
                document.getElementById('hems_available_roomnumber_id').innerHTML = request.data.filter(data=>data.categoryid == id).map(data=>`<option value="${data.roomnumber}">${data.roomname} | ${data.roomcategory || data.categoryid} | Floor ${data.floor || '-'} || ${data.roomnumber}</option>`).join('')
            }else{
                document.getElementById('hems_roomnumber').innerHTML = request.data.map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid}</option>`).join('')
                document.getElementById('hems_roomnumber_id').innerHTML = request.data.map(data=>`<option value="${data.roomnumber}">${data.roomname} | ${data.roomcategory || data.categoryid} | Floor ${data.floor || '-'} || ${data.roomnumber}</option>`).join('')
                document.getElementById('hems_roomnumber_id1').innerHTML = request.data.map(data=>`<option value="${data.roomname} ${data.categoryid} || ${data.roomnumber}">${data.roomnumber}</option>`).join('')
                document.getElementById('hems_available_roomnumber').innerHTML = request.data.map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid}</option>`).join('')
                document.getElementById('hems_available_roomnumber_id').innerHTML = request.data.map(data=>`<option value="${data.roomnumber}">${data.roomname} | ${data.roomcategory || data.categoryid} | Floor ${data.floor || '-'} || ${data.roomnumber}</option>`).join('')
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
    let request = await httpRequest('../controllers/fetchroomcategorycoyandagency')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            const categories = request.data.map((item) => {
                const categorydata = item.categorydata || item
                return {
                    ...categorydata,
                    id: String(categorydata.id || item.categoryid || '').trim(),
                    categoryid: String(item.categoryid || categorydata.id || '').trim(),
                    category: categorydata.category || categorydata.categoryname || '',
                    Organisationdata: Array.isArray(item.Organisationdata) ? item.Organisationdata : []
                }
            })
            rumcat = categories
            document.getElementById('hems_roomcategories').innerHTML = categories.map(data=>`<option>${data.category} || ${data.id}</option>`).join('')
            for(let i=0;i<document.getElementsByClassName('roomcategory').length;i++){
                // console.log(document.getElementsByClassName('roomcategory')[i], document.getElementsByClassName('room-type')[i])
                if(document.getElementsByClassName('roomcategory')[i] && document.getElementsByClassName('roomcategory')[i].children.length < 2){
                    if(document.getElementsByClassName('roomcategory')[i])document.getElementsByClassName('roomcategory')[i].innerHTML = `<option value="">-- Select Room Type --</option>`
                    if(document.getElementsByClassName('roomcategory')[i])document.getElementsByClassName('roomcategory')[i].innerHTML += categories.map(data=>`<option value="${data.id}">${data.category}</option>`).join('')
                }
                if(document.getElementsByClassName('room-type')[i] && document.getElementsByClassName('room-type')[i].children.length < 2){
                    if(document.getElementsByClassName('room-type')[i])document.getElementsByClassName('room-type')[i].innerHTML = `<option value="">-- Select Room Type --</option>`
                    if(document.getElementsByClassName('room-type')[i])document.getElementsByClassName('room-type')[i].innerHTML += categories.map(data=>`<option value="${data.id}">${data.category}</option>`).join('')
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
