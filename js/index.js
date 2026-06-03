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
let availableRoomsLastUpdatedAt = null
let availableRoomsRefreshClockInterval = null
let availableRoomsLastHash = ''
let availableRoomsDetail = null
let unsettledBillsData = []
let unsettledBillsLastUpdatedAt = null
let unsettledBillsPollingTimer = null
let unsettledBillsHash = ''
let unsettledBillsInFlight = false
let unsettledBillsRefreshDebounce = null
let unsettledBillsPaginationLimit = 50
let unsettledBillsActiveDetailKey = ''
const unsettledBillsState = {
    search: '',
    salespoint: 'ALL',
    status: 'ALL'
}
const availableRoomsState = {
    search: '',
    status: 'ALL',
    building: 'ALL',
    floor: 'ALL',
    category: 'ALL',
    autoRefresh: true,
    layout: 'compact'
}
let availableRoomsDataset = []
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

function getWindowStartupRouteName() {
    try {
        return new URL(window.location.href).searchParams.get('r') || ''
    } catch (_) {
        return ''
    }
}

function shouldSkipGlobalWarmupsForCurrentRoute() {
    return ['sales', 'bills', 'order', 'splitbill', 'mergebill'].includes(getWindowStartupRouteName())
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

async function getAllUsers(id='user', options={}) {
    try {
        let request = await httpRequest2('../controllers/fetchusers', null, null, 'json', options);
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
    const skipGlobalWarmups = shouldSkipGlobalWarmupsForCurrentRoute()
    if(!skipGlobalWarmups) {
        rundashboard()
        runavailablerooms()
    }
    resolveUrlPage() 
    entername()
    if(!skipGlobalWarmups) recalldatalist()
    checkAccountForVerification()
    fetchUnsettledBills({ lightweight: true })
    startUnsettledBillsPolling()
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

function syncNavGroupVisibility(navItem, grantedPermissions){
    if(!navItem) return

    const title = navItem.querySelector(':scope > .navitem-title')
    const childrenWrap = navItem.querySelector(':scope > ul')
    const children = childrenWrap ? Array.from(childrenWrap.children).filter(child => child.classList.contains('navitem-child')) : []

    if(children.length < 1){
        navItem.classList.remove('hidden')
        if(title) title.classList.remove('hidden')
        return
    }

    let hasVisibleChild = false
    children.forEach(child => {
        const isGranted = grantedPermissions.has(getNavPermissionKeyFromNode(child))
        if(isGranted){
            child.classList.remove('hidden')
            hasVisibleChild = true
        } else {
            child.classList.add('hidden')
        }
    })

    if(title){
        if(hasVisibleChild) title.classList.remove('hidden')
        else title.classList.add('hidden')
    }
    if(hasVisibleChild) navItem.classList.remove('hidden')
    else navItem.classList.add('hidden')
}

function applyGrantedPermissionsToNavigation(grantedPermissions, permissionSwitch='ON'){
    if(grantedPermissions?.has('*')){
        showAllNavigationItems()
        return
    }

    if(permissionSwitch === 'OFF'){
        showAllNavigationItems()
        return
    }

    const navItems = document.querySelectorAll('#navigation .nav-item')
    navItems.forEach(item => syncNavGroupVisibility(item, grantedPermissions))
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
const unsettledBillsOpener = document.getElementById('unsettledbillsopener')
const unsettledBillsRemover = document.getElementById('unsettledbillsremover')
const unsettledBillsOverlay = document.getElementById('unsettledbillscontainer')

if (availableRoomOpener && availableRoomContainerOverlay) {
    availableRoomOpener.addEventListener('click', () => {
        availableRoomContainerOverlay.classList.add('!left-[0%]')
        ensureAvailableRoomSliderEventsBound()
        runavailablerooms()
        if (availableRoomsRefreshInterval) clearInterval(availableRoomsRefreshInterval)
        availableRoomsRefreshInterval = setInterval(() => {
            if (availableRoomContainerOverlay.classList.contains('!left-[0%]') && availableRoomsState.autoRefresh) runavailablerooms()
        }, 15000)
        if (availableRoomsRefreshClockInterval) clearInterval(availableRoomsRefreshClockInterval)
        availableRoomsRefreshClockInterval = setInterval(updateAvailableRoomsRefreshAge, 1000)
    })
}

if (availableRoomRemover && availableRoomContainerOverlay) {
    availableRoomRemover.addEventListener('click', () => {
        availableRoomContainerOverlay.classList.remove('!left-[0%]')
        if (availableRoomsRefreshInterval) {
            clearInterval(availableRoomsRefreshInterval)
            availableRoomsRefreshInterval = null
        }
        if (availableRoomsRefreshClockInterval) {
            clearInterval(availableRoomsRefreshClockInterval)
            availableRoomsRefreshClockInterval = null
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
            if (availableRoomsRefreshClockInterval) {
                clearInterval(availableRoomsRefreshClockInterval)
                availableRoomsRefreshClockInterval = null
            }
        }
    })
}

function normalizeUnsettledBillRows(data = []){
    if(!Array.isArray(data) || !data.length) return []
    if(data[0]?.saleentry){
        return data.map((entry) => {
            const saleEntry = entry.saleentry || {}
            const reference = String(saleEntry.reference || '').trim()
            const totalamount = Number(saleEntry.totalamount || saleEntry.servicecharge || 0)
            const amountpaid = Number(entry.amountreceived || saleEntry.amountpaid || 0)
            const details = Array.isArray(entry.saledetail) ? entry.saledetail : []
            return {
                id: saleEntry.id || '',
                batchid: saleEntry.batchid || '',
                reference,
                transactiondate: saleEntry.transactiondate || '',
                salespoint: saleEntry.salespoint || '',
                applyto: saleEntry.applyto || '',
                owner: saleEntry.owner ?? saleEntry.ownerid ?? '',
                ownerdetail: saleEntry.ownerdetail ?? '',
                paymentmethod: saleEntry.paymentmethod || '',
                description: saleEntry.description || '',
                items: details.map((item) => ({ ...item })),
                totalamount: Number.isFinite(totalamount) ? totalamount : 0,
                amountpaid: Number.isFinite(amountpaid) ? amountpaid : 0
            }
        }).filter((entry) => entry.reference || entry.batchid)
    }
    const grouped = doBatch(data)
    return grouped.map((batch) => {
        const rows = Array.isArray(batch.data) ? batch.data : []
        const first = (Array.isArray(batch.data) ? batch.data[0] : {}) || {}
        const reference = String(first.reference || '').trim()
        return {
            id: first.id || '',
            batchid: batch.batchid || first.batchid || '',
            reference,
            transactiondate: first.transactiondate || '',
            salespoint: first.salespoint || '',
            applyto: first.applyto || '',
            owner: first.owner ?? first.ownerid ?? '',
            ownerdetail: first.ownerdetail ?? '',
            paymentmethod: first.paymentmethod || '',
            description: first.description || '',
            items: rows.map((item) => ({ ...item })),
            totalamount: Number(first.totalamount || first.servicecharge || 0),
            amountpaid: Number(first.amountpaid || first.amountreceived || 0)
        }
    }).filter((entry) => entry.reference || entry.batchid)
}

function buildUnsettledBillsHash(rows = []){
    return rows.map((row) => `${row.reference}|${row.batchid}|${row.totalamount}|${row.amountpaid}|${row.transactiondate}|${row.salespoint}|${row.applyto}|${row.owner}|${row.ownerdetail}`).join('::')
}

function getUnsettledStatus(row = {}){
    const total = Number(row.totalamount || 0)
    const paid = Number(row.amountpaid || 0)
    const balance = Math.max(total - paid, 0)
    if(paid <= 0) return { chip: 'UNPAID', balance }
    return { chip: 'PARTIAL', balance }
}

function getUnsettledBadgeBreakdown(){
    let unpaid = 0
    let partial = 0
    unsettledBillsData.forEach((row) => {
        const status = getUnsettledStatus(row)
        if(status.balance <= 0) return
        if(status.chip === 'UNPAID') unpaid++
        else partial++
    })
    return { unpaid, partial, total: unpaid + partial }
}

function renderUnsettledBillsBadge(){
    const badge = did('unsettledbillsbadge')
    if(!badge) return
    const count = getUnsettledBadgeBreakdown()
    badge.textContent = String(count.total || 0)
    badge.classList.toggle('hidden', !count.total)
    const opener = did('unsettledbillsopener')
    if(opener) opener.title = `Unsettled Bills (${count.unpaid} unpaid / ${count.partial} partial)`
}

function getFilteredUnsettledBills(){
    return unsettledBillsData.filter((row) => {
        const ref = String(row.reference || '').toLowerCase()
        const salespoint = String(row.salespoint || '').trim()
        const owner = String(resolveUnsettledBillOwner(row) || '').toLowerCase()
        const applyto = String(row.applyto || '').toLowerCase()
        const search = unsettledBillsState.search.toLowerCase()
        const status = getUnsettledStatus(row)
        if(status.balance <= 0) return false
        if(unsettledBillsState.salespoint !== 'ALL' && salespoint !== unsettledBillsState.salespoint) return false
        if(unsettledBillsState.status !== 'ALL' && status.chip !== unsettledBillsState.status) return false
        if(search && !(`${ref} ${owner} ${salespoint} ${applyto}`.includes(search))) return false
        return true
    })
}

function normalizeUnsettledTextValue(value = ''){
    const cleaned = String(value ?? '').trim()
    if(!cleaned || cleaned.toLowerCase() === 'null' || cleaned === '-' || cleaned === '-1') return ''
    return cleaned
}

function resolveUnsettledBillOwner(row = {}){
    const owner = normalizeUnsettledTextValue(row.owner)
    if(owner) return owner
    const ownerDetail = normalizeUnsettledTextValue(row.ownerdetail)
    return ownerDetail || ''
}

function getUnsettledBillDetailKey(row = {}){
    return String(row.batchid || row.reference || '')
}

function getUnsettledBillByKey(key = ''){
    const cleaned = String(key || '').trim()
    if(!cleaned) return null
    return unsettledBillsData.find((row) => getUnsettledBillDetailKey(row) === cleaned) || null
}

function openUnsettledBillDetail(key = ''){
    unsettledBillsActiveDetailKey = String(key || '').trim()
    renderUnsettledBillsDrawer(true)
}

function closeUnsettledBillDetail(){
    unsettledBillsActiveDetailKey = ''
    renderUnsettledBillsDrawer(true)
}

function renderUnsettledBillItemRows(row = {}){
    const items = Array.isArray(row.items) ? row.items : []
    if(!items.length) return `<tr><td colspan="5" class="text-center text-slate-500 py-2">No bill items</td></tr>`
    return items.map((item, idx) => {
        const qty = Number(item.qty || 0)
        const cost = Number(item.cost || 0)
        const amount = qty * cost
        return `<tr class="border-t">
            <td>${idx + 1}</td>
            <td>${item.itemname || item.item || '-'}</td>
            <td>${formatNumber(qty)}</td>
            <td>${formatCurrency(cost)}</td>
            <td>${formatCurrency(amount)}</td>
        </tr>`
    }).join('')
}

function escapeUnsettledBillHtml(value = ''){
    const div = document.createElement('div')
    div.textContent = String(value ?? '')
    return div.innerHTML
}

function buildUnsettledBillPrintMarkup(row = {}){
    const items = Array.isArray(row.items) ? row.items : []
    const status = getUnsettledStatus(row)
    const owner = resolveUnsettledBillOwner(row)
    const companyLogo = did('your_companylogo')?.value || ''
    const companyName = did('your_companyname')?.value || ''
    const companyAddress = did('your_companyaddress')?.value || ''
    const companyPhone = did('your_companyphone')?.value || ''
    const companyEmail = did('your_companyemail')?.value || ''
    const itemRows = items.map((item, idx) => {
        const qty = Number(item.qty || 0)
        const cost = Number(item.cost || 0)
        return `
            <tr>
                <td>${idx + 1}</td>
                <td>${escapeUnsettledBillHtml(item.itemname || item.item || '-')}</td>
                <td class="num">${formatNumber(qty)}</td>
                <td class="num">${formatCurrency(cost)}</td>
                <td class="num">${formatCurrency(qty * cost)}</td>
            </tr>
        `
    }).join('')

    return `
        <style>
            .unsettled-print-receipt{width:310px;margin:0 auto;padding:14px 12px;color:#111827;font-family:Arial,sans-serif;font-size:11px;line-height:1.35;background:#fff;}
            .unsettled-print-receipt .logo{width:54px;height:54px;object-fit:contain;display:block;margin:0 auto 6px;}
            .unsettled-print-receipt .center{text-align:center;}
            .unsettled-print-receipt .name{font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;}
            .unsettled-print-receipt .muted{color:#64748b;}
            .unsettled-print-receipt .title{margin:10px 0 8px;padding:5px 0;border-top:1px dashed #94a3b8;border-bottom:1px dashed #94a3b8;text-align:center;font-weight:800;letter-spacing:.18em;}
            .unsettled-print-receipt .line{display:flex;justify-content:space-between;gap:10px;margin:4px 0;}
            .unsettled-print-receipt .line span:last-child{text-align:right;font-weight:700;}
            .unsettled-print-receipt table{width:100%;border-collapse:collapse;margin-top:8px;}
            .unsettled-print-receipt th,.unsettled-print-receipt td{border-bottom:1px solid #e5e7eb;padding:5px 2px;vertical-align:top;}
            .unsettled-print-receipt th{text-align:left;font-size:10px;text-transform:uppercase;color:#475569;}
            .unsettled-print-receipt .num{text-align:right;white-space:nowrap;}
            .unsettled-print-receipt .totalbox{margin-top:9px;border-top:1px dashed #94a3b8;border-bottom:1px dashed #94a3b8;padding:6px 0;}
            .unsettled-print-receipt .balance span:last-child{font-size:13px;}
            .unsettled-print-receipt .footer{margin-top:12px;text-align:center;font-size:10px;color:#64748b;}
        </style>
        <div class="unsettled-print-receipt">
            ${companyLogo ? `<img src="./images/${escapeUnsettledBillHtml(companyLogo)}" alt="logo" class="logo">` : ''}
            <div class="center">
                <div class="name">${escapeUnsettledBillHtml(companyName)}</div>
                <div class="muted">${escapeUnsettledBillHtml(companyAddress)}</div>
                <div class="muted">${escapeUnsettledBillHtml(companyPhone)}${companyEmail ? ` | ${escapeUnsettledBillHtml(companyEmail)}` : ''}</div>
            </div>
            <div class="title">BILL</div>
            <div class="line"><small>Reference</small><span>${escapeUnsettledBillHtml(row.reference || '-')}</span></div>
            <div class="line"><small>Date</small><span>${row.transactiondate ? specialformatDateTime(row.transactiondate) : '-'}</span></div>
            <div class="line"><small>Salespoint</small><span>${escapeUnsettledBillHtml(row.salespoint || '-')}</span></div>
            <div class="line"><small>Apply To</small><span>${escapeUnsettledBillHtml(row.applyto || '-')}</span></div>
            <div class="line"><small>Owner</small><span>${escapeUnsettledBillHtml(owner || '-')}</span></div>
            <table>
                <thead>
                    <tr><th>#</th><th>Item</th><th class="num">Qty</th><th class="num">Price</th><th class="num">Total</th></tr>
                </thead>
                <tbody>${itemRows || '<tr><td colspan="5" class="center muted">No bill items</td></tr>'}</tbody>
            </table>
            <div class="totalbox">
                <div class="line"><small>Total</small><span>${formatCurrency(Number(row.totalamount || 0))}</span></div>
                <div class="line"><small>Paid</small><span>${formatCurrency(Number(row.amountpaid || 0))}</span></div>
                <div class="line balance"><small>Balance</small><span>${formatCurrency(Number(status.balance || 0))}</span></div>
                <div class="line"><small>Status</small><span>${escapeUnsettledBillHtml(status.chip || '')}</span></div>
            </div>
            ${row.description ? `<div class="footer">${escapeUnsettledBillHtml(row.description)}</div>` : ''}
            <div class="footer">Thank you</div>
        </div>
    `
}

function printUnsettledBillFromLoadedData(key = ''){
    const row = getUnsettledBillByKey(key) || getUnsettledBillByKey(unsettledBillsActiveDetailKey)
    if(!row) return notification('Bill not found in loaded slider data', 0)
    let printHost = did('unsettled-bill-print-host')
    if(!printHost){
        printHost = document.createElement('div')
        printHost.id = 'unsettled-bill-print-host'
        printHost.className = 'hidden'
        document.body.appendChild(printHost)
    }
    printHost.innerHTML = buildUnsettledBillPrintMarkup(row)
    printDomContent('BILL', 'unsettled-bill-print-host', '<script src="https://cdn.tailwindcss.com"></script>')
}

function renderUnsettledBillDetailPanel(row = {}){
    const status = getUnsettledStatus(row)
    const owner = resolveUnsettledBillOwner(row)
    const chipClass = status.chip === 'UNPAID' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
    const billKey = getUnsettledBillDetailKey(row)
    return `
        <div class="h-full border-l border-slate-200 bg-white text-slate-800 p-3 overflow-auto">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                    <p class="font-semibold text-slate-900 tracking-wide">Bill Details</p>
                </div>
                <button type="button" id="unsettled-close-detail" class="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50">Back</button>
            </div>
            <div class="mt-2 flex items-center gap-2">
                <button type="button" data-unsettled-print="${billKey}" class="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100">Print</button>
                <button type="button" data-unsettled-load="${billKey}" class="rounded border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100">Load To Sales</button>
            </div>
            <div class="mt-3 grid grid-cols-2 gap-2 text-xs rounded border border-slate-200 bg-slate-50 p-2">
                <p class="font-semibold text-slate-600">Reference:</p><p>${row.reference || '-'}</p>
                <p class="font-semibold text-slate-600">Apply To:</p><p>${row.applyto || '-'}</p>
                <p class="font-semibold text-slate-600">Owner:</p><p>${owner || ''}</p>
                <p class="font-semibold text-slate-600">Date:</p><p>${row.transactiondate ? specialformatDateTime(row.transactiondate) : '-'}</p>
                <p class="font-semibold text-slate-600">Salespoint:</p><p>${row.salespoint || '-'}</p>
                <p class="font-semibold text-slate-600">Payment Method:</p><p>${row.paymentmethod || '-'}</p>
                <p class="font-semibold text-slate-600">Total:</p><p>${formatCurrency(Number(row.totalamount || 0))}</p>
                <p class="font-semibold text-slate-600">Paid:</p><p>${formatCurrency(Number(row.amountpaid || 0))}</p>
                <p class="font-semibold text-slate-600">Balance:</p><p>${formatCurrency(Number(status.balance || 0))}</p>
                <p class="font-semibold text-slate-600">Status:</p><p><span class="px-2 py-1 rounded text-[10px] font-semibold ${chipClass}">${status.chip}</span></p>
            </div>
            <div class="mt-3">
                <p class="font-semibold text-xs mb-2 text-slate-700">Description</p>
                <p class="text-xs text-slate-600 rounded border border-slate-200 bg-white p-2">${row.description || '-'}</p>
            </div>
            <div class="mt-3">
                <p class="font-semibold text-xs mb-2 text-slate-700">Items</p>
                <div class="overflow-auto rounded border border-slate-200 bg-white">
                    <table class="w-full text-xs">
                        <thead><tr class="text-left text-slate-600 bg-slate-50"><th>#</th><th>Item</th><th>Qty</th><th>Cost</th><th>Amount</th></tr></thead>
                        <tbody>${renderUnsettledBillItemRows(row)}</tbody>
                    </table>
                </div>
            </div>
        </div>
    `
}

function renderUnsettledBillsDrawer(force = false){
    const host = did('unsettledbillscontent')
    if(!host) return
    const rows = getFilteredUnsettledBills()
    const count = getUnsettledBadgeBreakdown()
    const currentHash = `${buildUnsettledBillsHash(rows)}|${unsettledBillsState.search}|${unsettledBillsState.salespoint}|${unsettledBillsState.status}|${unsettledBillsPaginationLimit}|${unsettledBillsActiveDetailKey}`
    if(!force && host.dataset.hash === currentHash) return
    host.dataset.hash = currentHash
    const salespoints = Array.from(new Set(unsettledBillsData.map((item) => String(item.salespoint || '').trim()).filter(Boolean))).sort()
    const slice = rows.slice(0, unsettledBillsPaginationLimit)
    const activeDetail = getUnsettledBillByKey(unsettledBillsActiveDetailKey)
    host.innerHTML = `
        <div class="h-full flex flex-col bg-white rounded border border-slate-200">
            <div class="p-3 border-b border-slate-200">
                <div class="flex items-center justify-between gap-2">
                    <p class="font-semibold text-slate-800">Unsettled Bills</p>
                    <p class="text-xs text-slate-500">${count.unpaid} unpaid / ${count.partial} partial</p>
                </div>
                <div class="mt-2 grid grid-cols-1 md:grid-cols-4 gap-2">
                    <input id="unsettled-search" value="${unsettledBillsState.search}" placeholder="Search apply to/owner/reference" class="form-control !text-xs">
                    <select id="unsettled-salespoint" class="form-control !text-xs">
                        <option value="ALL">All Salespoints</option>
                        ${salespoints.map((sp) => `<option value="${sp}" ${unsettledBillsState.salespoint === sp ? 'selected' : ''}>${sp}</option>`).join('')}
                    </select>
                    <select id="unsettled-status" class="form-control !text-xs">
                        <option value="ALL" ${unsettledBillsState.status === 'ALL' ? 'selected' : ''}>All Status</option>
                        <option value="UNPAID" ${unsettledBillsState.status === 'UNPAID' ? 'selected' : ''}>Unpaid</option>
                        <option value="PARTIAL" ${unsettledBillsState.status === 'PARTIAL' ? 'selected' : ''}>Partial</option>
                    </select>
                    <button type="button" id="unsettled-refresh" class="rounded bg-blue-600 text-white text-xs px-3 py-2">Refresh</button>
                </div>
                <p class="mt-2 text-[11px] text-slate-500">Last updated: ${unsettledBillsLastUpdatedAt ? specialformatDateTime(new Date(unsettledBillsLastUpdatedAt).toISOString().slice(0, 19).replace('T', ' ')) : 'Not yet'}</p>
            </div>
            <div class="flex-1 min-h-0 grid ${activeDetail ? 'grid-cols-1 lg:grid-cols-[1.45fr_1fr]' : 'grid-cols-1'}">
                <div class="overflow-auto p-2">
                ${slice.length ? `
                    <table class="w-full text-xs">
                        <thead><tr class="text-left"><th>#</th><th>Date</th><th>Salespoint</th><th>Apply To</th><th>Owner</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Action</th></tr></thead>
                        <tbody>
                        ${slice.map((row, idx) => {
                            const status = getUnsettledStatus(row)
                            const owner = resolveUnsettledBillOwner(row)
                            const chipClass = status.chip === 'UNPAID' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                            return `<tr class="border-t">
                                <td>${idx + 1}</td>
                                <td>${row.transactiondate ? specialformatDateTime(row.transactiondate) : '-'}</td>
                                <td>${row.salespoint || '-'}</td>
                                <td>${row.applyto || '-'}</td>
                                <td>${owner || ''}</td>
                                <td>${formatCurrency(Number(row.totalamount || 0))}</td>
                                <td>${formatCurrency(Number(row.amountpaid || 0))}</td>
                                <td>${formatCurrency(Number(status.balance || 0))}</td>
                                <td><span class="px-2 py-1 rounded text-[10px] font-semibold ${chipClass}">${status.chip}</span></td>
                                <td><button type="button" title="View Bill" data-unsettled-view="${getUnsettledBillDetailKey(row)}" class="material-symbols-outlined inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow text-[18px] hover:bg-blue-700">visibility</button></td>
                            </tr>`
                        }).join('')}
                        </tbody>
                    </table>
                ` : `<p class="text-center text-slate-500 py-10">No unsettled bills found</p>`}
                </div>
                ${activeDetail ? renderUnsettledBillDetailPanel(activeDetail) : ''}
            </div>
            <div class="p-2 border-t border-slate-200 flex items-center justify-between">
                <p class="text-[11px] text-slate-500">Showing ${Math.min(slice.length, rows.length)} of ${rows.length}</p>
                <button type="button" id="unsettled-loadmore" class="rounded border px-3 py-1 text-xs ${rows.length > unsettledBillsPaginationLimit ? '' : 'hidden'}">Load more</button>
            </div>
        </div>
    `
    bindUnsettledBillsUiHandlers()
}

function renderUnsettledBillsLoading(message = 'Loading unsettled bills...'){
    const host = did('unsettledbillscontent')
    if(!host) return
    host.innerHTML = `
        <div class="h-full flex items-center justify-center bg-white rounded border border-slate-200">
            <div class="text-center">
                <p class="font-semibold text-slate-800">${message}</p>
                <p class="text-xs text-slate-500 mt-1">Please wait</p>
            </div>
        </div>
    `
}

function bindUnsettledBillsUiHandlers(){
    const searchEl = did('unsettled-search')
    const salespointEl = did('unsettled-salespoint')
    const statusEl = did('unsettled-status')
    const refreshEl = did('unsettled-refresh')
    const loadMoreEl = did('unsettled-loadmore')
    const closeDetailEl = did('unsettled-close-detail')
    const viewButtons = document.querySelectorAll('[data-unsettled-view]')
    const printButtons = document.querySelectorAll('[data-unsettled-print]')
    const loadButtons = document.querySelectorAll('[data-unsettled-load]')
    if(searchEl && searchEl.dataset.bound !== '1'){
        searchEl.dataset.bound = '1'
        searchEl.addEventListener('input', (event) => {
            unsettledBillsState.search = String(event.target.value || '')
            unsettledBillsPaginationLimit = 50
            renderUnsettledBillsDrawer(true)
        })
    }
    if(salespointEl && salespointEl.dataset.bound !== '1'){
        salespointEl.dataset.bound = '1'
        salespointEl.addEventListener('change', (event) => {
            unsettledBillsState.salespoint = String(event.target.value || 'ALL')
            unsettledBillsPaginationLimit = 50
            renderUnsettledBillsDrawer(true)
        })
    }
    if(statusEl && statusEl.dataset.bound !== '1'){
        statusEl.dataset.bound = '1'
        statusEl.addEventListener('change', (event) => {
            unsettledBillsState.status = String(event.target.value || 'ALL')
            unsettledBillsPaginationLimit = 50
            renderUnsettledBillsDrawer(true)
        })
    }
    if(refreshEl && refreshEl.dataset.bound !== '1'){
        refreshEl.dataset.bound = '1'
        refreshEl.addEventListener('click', () => fetchUnsettledBills({ forceRender: true, lightweight: true }))
    }
    if(loadMoreEl && loadMoreEl.dataset.bound !== '1'){
        loadMoreEl.dataset.bound = '1'
        loadMoreEl.addEventListener('click', () => {
            unsettledBillsPaginationLimit += 50
            renderUnsettledBillsDrawer(true)
        })
    }
    viewButtons.forEach((button) => {
        if(button.dataset.bound === '1') return
        button.dataset.bound = '1'
        button.addEventListener('click', () => openUnsettledBillDetail(button.dataset.unsettledView || ''))
    })
    printButtons.forEach((button) => {
        if(button.dataset.bound === '1') return
        button.dataset.bound = '1'
        button.addEventListener('click', () => {
            const key = String(button.dataset.unsettledPrint || '')
            return printUnsettledBillFromLoadedData(key)
        })
    })
    loadButtons.forEach((button) => {
        if(button.dataset.bound === '1') return
        button.dataset.bound = '1'
        button.addEventListener('click', () => {
            const key = String(button.dataset.unsettledLoad || '')
            if(typeof retrieveBillToSalesByBatch === 'function') return retrieveBillToSalesByBatch(key)
            const row = getUnsettledBillByKey(key)
            if(row?.reference){
                sessionStorage.setItem('pendingSalesBillReference', row.reference)
                window.location.href = 'index?r=sales'
                return
            }
            notification('Load to sales is unavailable', 0)
        })
    })
    if(closeDetailEl && closeDetailEl.dataset.bound !== '1'){
        closeDetailEl.dataset.bound = '1'
        closeDetailEl.addEventListener('click', () => closeUnsettledBillDetail())
    }
}

async function fetchUnsettledBills(options = {}){
    const { forceRender = false, lightweight = true } = options || {}
    if(unsettledBillsInFlight) {
        if(forceRender && !did('unsettledbillscontent')?.innerHTML) renderUnsettledBillsLoading()
        return
    }
    unsettledBillsInFlight = true
    if(forceRender && !unsettledBillsData.length) renderUnsettledBillsLoading()
    try{
        const request = await httpRequest2('../controllers/fetchsalesbillsonly.php', null, null, 'json', { lightweight })
        if(!request?.status) {
            if(forceRender || (unsettledBillsOverlay && unsettledBillsOverlay.classList.contains('!left-[0%]'))) {
                unsettledBillsData = []
                unsettledBillsHash = ''
                renderUnsettledBillsBadge()
                renderUnsettledBillsDrawer(true)
            }
            return
        }
        const normalized = normalizeUnsettledBillRows(request.data).map((row) => {
            const total = Number(row.totalamount || 0)
            const paid = Number(row.amountpaid || 0)
            return {
                ...row,
                totalamount: Number.isFinite(total) ? total : 0,
                amountpaid: Number.isFinite(paid) ? paid : 0
            }
        }).filter((row) => Math.max(Number(row.totalamount || 0) - Number(row.amountpaid || 0), 0) > 0)
        const nextHash = buildUnsettledBillsHash(normalized)
        const changed = unsettledBillsHash !== nextHash
        unsettledBillsData = normalized
        unsettledBillsLastUpdatedAt = Date.now()
        unsettledBillsHash = nextHash
        renderUnsettledBillsBadge()
        if(forceRender || changed || (unsettledBillsOverlay && unsettledBillsOverlay.classList.contains('!left-[0%]'))){
            renderUnsettledBillsDrawer(true)
        }
    } catch (error) {
        console.error('Unable to load unsettled bills:', error)
        if(forceRender || (unsettledBillsOverlay && unsettledBillsOverlay.classList.contains('!left-[0%]'))) {
            unsettledBillsData = []
            unsettledBillsHash = ''
            renderUnsettledBillsBadge()
            renderUnsettledBillsDrawer(true)
        }
    } finally {
        unsettledBillsInFlight = false
    }
}

function queueUnsettledBillsRefresh(delay = 600){
    if(unsettledBillsRefreshDebounce) clearTimeout(unsettledBillsRefreshDebounce)
    unsettledBillsRefreshDebounce = setTimeout(() => {
        unsettledBillsRefreshDebounce = null
        fetchUnsettledBills({ lightweight: true })
    }, Math.max(Number(delay) || 0, 0))
}

function startUnsettledBillsPolling(){
    if(unsettledBillsPollingTimer) clearInterval(unsettledBillsPollingTimer)
    unsettledBillsPollingTimer = setInterval(() => {
        if(document.hidden) return
        fetchUnsettledBills({ lightweight: true })
    }, 60000)
}

if (unsettledBillsOpener && unsettledBillsOverlay) {
    unsettledBillsOpener.addEventListener('click', () => {
        unsettledBillsOverlay.classList.add('!left-[0%]')
        unsettledBillsPaginationLimit = 50
        unsettledBillsActiveDetailKey = ''
        renderUnsettledBillsDrawer(true)
        fetchUnsettledBills({ forceRender: true, lightweight: true })
    })
}

if (unsettledBillsRemover && unsettledBillsOverlay) {
    unsettledBillsRemover.addEventListener('click', () => {
        unsettledBillsOverlay.classList.remove('!left-[0%]')
        unsettledBillsActiveDetailKey = ''
    })
}

if (unsettledBillsOverlay) {
    unsettledBillsOverlay.addEventListener('click', (event) => {
        if(event.target.id === 'unsettledbillscontainer'){
            unsettledBillsOverlay.classList.remove('!left-[0%]')
            unsettledBillsActiveDetailKey = ''
        }
    })
}

document.addEventListener('visibilitychange', () => {
    if(!document.hidden) fetchUnsettledBills({ lightweight: true })
})

function normalizeRoomStatus(rawStatus=''){
    const status = String(rawStatus || '').trim().toUpperCase()
    if (status === 'CHECKED IN' || status === 'OCCUPIED') return 'OCCUPIED'
    if (status === 'OPEN' || status === 'RESERVED') return 'RESERVED'
    if (status === 'AVAILABLE' || status === 'CHECKED OUT') return 'AVAILABLE'
    return 'OTHER'
}

function getAvailableRoomStatusClass(rawStatus=''){
    const status = normalizeRoomStatus(rawStatus)
    if(status === 'OCCUPIED') return 'bg-white text-slate-950 border-rose-200 hover:border-rose-400'
    if(status === 'RESERVED') return 'bg-white text-slate-950 border-amber-200 hover:border-amber-400'
    if(status === 'AVAILABLE') return 'bg-white text-slate-950 border-emerald-200 hover:border-emerald-400'
    return 'bg-white text-slate-950 border-indigo-200 hover:border-indigo-400'
}

function getAvailableRoomAccentClass(rawStatus=''){
    const status = normalizeRoomStatus(rawStatus)
    if(status === 'OCCUPIED') return 'bg-rose-600'
    if(status === 'RESERVED') return 'bg-amber-500'
    if(status === 'AVAILABLE') return 'bg-emerald-500'
    return 'bg-indigo-500'
}

function getAvailableRoomStatusPillClass(rawStatus=''){
    const status = normalizeRoomStatus(rawStatus)
    if(status === 'OCCUPIED') return 'bg-rose-50 text-rose-800 ring-rose-200'
    if(status === 'RESERVED') return 'bg-amber-50 text-amber-800 ring-amber-200'
    if(status === 'AVAILABLE') return 'bg-emerald-50 text-emerald-800 ring-emerald-200'
    return 'bg-indigo-50 text-indigo-800 ring-indigo-200'
}

function getAvailableRoomCompactTileClass(rawStatus=''){
    const status = normalizeRoomStatus(rawStatus)
    if(status === 'OCCUPIED') return 'bg-gradient-to-br from-red-500 to-red-700 text-white border-red-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_5px_10px_rgba(185,28,28,0.22)]'
    if(status === 'RESERVED') return 'bg-gradient-to-br from-amber-300 to-amber-500 text-slate-950 border-amber-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_5px_10px_rgba(217,119,6,0.18)]'
    if(status === 'AVAILABLE') return 'bg-gradient-to-br from-emerald-300 to-emerald-500 text-slate-950 border-emerald-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.34),0_5px_10px_rgba(5,150,105,0.18)]'
    return 'bg-gradient-to-br from-sky-400 to-sky-600 text-white border-sky-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_5px_10px_rgba(3,105,161,0.2)]'
}

function getAvailableRoomStatusDescription(room={}){
    const value = String(room.roomstatusdescription || '').trim()
    if(!value || value === '-') return ''
    return value
}

function getAvailableRoomStatusLabel(rawStatus=''){
    return normalizeRoomStatus(rawStatus)
}

function getAvailableRoomCategoryLabel(room={}){
    return String(room.roomcategory || room.category || 'UNCATEGORIZED').trim().toUpperCase()
}

function getAvailableRoomsRefreshText(){
    if(!availableRoomsLastUpdatedAt) return 'not updated yet'
    const elapsed = Math.max(Math.floor((Date.now() - availableRoomsLastUpdatedAt) / 1000), 0)
    if(elapsed < 5) return 'updated just now'
    if(elapsed < 60) return `updated ${elapsed}s ago`
    const mins = Math.floor(elapsed / 60)
    return `updated ${mins}m ago`
}

function updateAvailableRoomsRefreshAge(){
    if(did('ar-last-updated')) did('ar-last-updated').textContent = getAvailableRoomsRefreshText()
}

function buildAvailableRoomsHash(list=[]){
    return list.map(item => `${item.roomnumber}|${item.roomstatus}|${item.roomstatusdescription}|${item.roomcategory}|${item.building}|${item.floor}`).join('::')
}

function getAvailableRoomsFilterOptions(){
    const buildings = Array.from(new Set(availableRoomsDataset.map(item => String(item.building || '').trim()).filter(Boolean))).sort()
    const floors = Array.from(new Set(availableRoomsDataset.map(item => String(item.floor || '').trim()).filter(Boolean))).sort((a, b) => Number(a) - Number(b))
    const categories = Array.from(new Set(availableRoomsDataset.map(item => String(item.roomcategory || '').trim()).filter(Boolean))).sort()
    return { buildings, floors, categories }
}

function getAvailableRoomCategoryCounts(){
    return availableRoomsDataset.reduce((counts, room)=>{
        const category = String(room.roomcategory || '').trim()
        if(!category) return counts
        counts[category] = (counts[category] || 0) + 1
        return counts
    }, {})
}

function filterAvailableRoomsData(){
    return availableRoomsDataset.filter((room)=>{
        const normalizedStatus = normalizeRoomStatus(room.roomstatus)
        const statusOk = availableRoomsState.status === 'ALL' || normalizedStatus === availableRoomsState.status
        const buildingOk = availableRoomsState.building === 'ALL' || String(room.building || '').trim() === availableRoomsState.building
        const floorOk = availableRoomsState.floor === 'ALL' || String(room.floor || '').trim() === availableRoomsState.floor
        const categoryOk = availableRoomsState.category === 'ALL' || String(room.roomcategory || '').trim() === availableRoomsState.category
        const haystack = `${room.roomname || ''} ${room.roomnumber || ''} ${room.roomcategory || ''} ${room.roomstatus || ''} ${room.building || ''} ${room.floor || ''}`.toLowerCase()
        const searchOk = !availableRoomsState.search || haystack.includes(availableRoomsState.search.toLowerCase())
        return statusOk && buildingOk && floorOk && categoryOk && searchOk
    })
}

function getFloorSortValue(floor=''){
    const normalized = String(floor || '').trim()
    if(!normalized) return Number.MAX_SAFE_INTEGER
    const numeric = Number(normalized)
    if(!Number.isNaN(numeric)) return numeric
    const extracted = Number((normalized.match(/\d+/) || [''])[0])
    if(!Number.isNaN(extracted)) return extracted
    return Number.MAX_SAFE_INTEGER - 1
}

function groupAvailableRoomsByFloor(rooms=[]){
    const grouped = new Map()
    rooms.forEach((room)=>{
        const floorKey = String(room.floor || '').trim() || 'UNSPECIFIED'
        if(!grouped.has(floorKey)) grouped.set(floorKey, [])
        grouped.get(floorKey).push(room)
    })
    return Array.from(grouped.entries())
        .sort((a, b)=>{
            const aSort = getFloorSortValue(a[0])
            const bSort = getFloorSortValue(b[0])
            if(aSort !== bSort) return aSort - bSort
            return String(a[0]).localeCompare(String(b[0]))
        })
}

function groupAvailableRoomsByCategory(rooms=[]){
    const grouped = new Map()
    rooms.forEach((room)=>{
        const categoryKey = String(room.roomcategory || room.category || '').trim() || 'UNCATEGORIZED'
        if(!grouped.has(categoryKey)) grouped.set(categoryKey, [])
        grouped.get(categoryKey).push(room)
    })
    return Array.from(grouped.entries()).sort((a, b)=>String(a[0]).localeCompare(String(b[0])))
}

function groupAvailableRoomsByStatus(rooms=[]){
    const order = ['AVAILABLE', 'RESERVED', 'OCCUPIED', 'OTHER']
    const grouped = new Map(order.map(status => [status, []]))
    rooms.forEach((room)=>{
        const status = normalizeRoomStatus(room.roomstatus)
        if(!grouped.has(status)) grouped.set(status, [])
        grouped.get(status).push(room)
    })
    return order.map(status => [status, grouped.get(status) || []])
}

function clearAvailableRoomFilters(){
    availableRoomsState.search = ''
    availableRoomsState.status = 'ALL'
    availableRoomsState.building = 'ALL'
    availableRoomsState.floor = 'ALL'
    availableRoomsState.category = 'ALL'
    renderAvailableRoomsBoard()
}

function openAvailableRoomDetails(roomNumber=''){
    const selected = availableRoomsDataset.find(item => String(item.roomnumber || '').trim() === String(roomNumber || '').trim())
    if(!selected) return
    availableRoomsDetail = selected
    renderAvailableRoomsBoard()
}

function closeAvailableRoomDetails(){
    availableRoomsDetail = null
    renderAvailableRoomsBoard()
}

function copyAvailableRoomNumber(roomNumber=''){
    const value = String(roomNumber || '').trim()
    if(!value) return notification('Room number unavailable', 0)
    if(navigator.clipboard?.writeText){
        navigator.clipboard.writeText(value)
            .then(()=>notification(`Room ${value} copied`, 1))
            .catch(()=>notification('Could not copy room number', 0))
        return
    }
    notification('Clipboard access not available', 0)
}

function openRoomStatusFromAvailableRoom(){
    did('roomstatus')?.click()
}

function openCheckinFromAvailableRoom(room){
    if(!room) return
    const payload = {
        roomnumber: String(room.roomnumber || '').trim(),
        categoryid: String(room.categoryid || room.roomcategoryid || '').trim(),
        roomcategory: String(room.roomcategory || room.category || '').trim(),
        roomname: String(room.roomname || '').trim(),
        floor: String(room.floor || '').trim(),
        building: String(room.building || '').trim(),
        source: 'available_rooms_slider'
    }
    sessionStorage.setItem('available_room_checkin_prefill', JSON.stringify(payload))
    sessionStorage.setItem('roomsetting', `${payload.categoryid}_${payload.roomnumber}`)
    did('checkin')?.click()
}

function openReservationFromAvailableRoom(room){
    if(!room) return
    const payload = {
        roomnumber: String(room.roomnumber || '').trim(),
        categoryid: String(room.categoryid || room.roomcategoryid || '').trim(),
        roomcategory: String(room.roomcategory || room.category || '').trim(),
        roomname: String(room.roomname || '').trim(),
        floor: String(room.floor || '').trim(),
        building: String(room.building || '').trim(),
        source: 'available_rooms_slider'
    }
    sessionStorage.setItem('available_room_reservation_prefill', JSON.stringify(payload))
    did('guestsreservations')?.click()
}

function setAvailableRoomsAutoRefresh(enabled){
    availableRoomsState.autoRefresh = !!enabled
    renderAvailableRoomsBoard()
}

function renderAvailableRoomCompactButton(data = {}, extraClass = ''){
    return `
        <button data-ar-action="open-details" data-room-number="${data.roomnumber || ''}" title="Room ${data.roomnumber || '-'} - ${getAvailableRoomStatusLabel(data.roomstatus)}${getAvailableRoomStatusDescription(data) ? ' - ' + getAvailableRoomStatusDescription(data) : ''}" class="relative h-[30px] min-w-0 rounded-md border px-1 text-[11px] font-black leading-none ${getAvailableRoomCompactTileClass(data.roomstatus)} ${extraClass} transition hover:-translate-y-[1px] hover:scale-[1.04] hover:ring-2 hover:ring-slate-900/20 focus:outline-none focus:ring-2 focus:ring-slate-900/30">
            <span class="block truncate">${data.roomnumber || '-'}</span>
        </button>
    `
}

function renderAvailableRoomCardButton(data = {}){
    return `
        <button data-ar-action="open-details" data-room-number="${data.roomnumber || ''}" class="ar-room-tile ${getAvailableRoomStatusClass(data.roomstatus)} group relative overflow-hidden border rounded-xl min-h-[88px] p-0 shadow-[0_10px_24px_rgba(15,23,42,0.10)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(15,23,42,0.16)] focus:outline-none focus:ring-2 focus:ring-slate-900/10">
            <span class="absolute inset-x-0 top-0 h-[3px] ${getAvailableRoomAccentClass(data.roomstatus)}"></span>
            <span class="absolute -right-7 -top-8 h-16 w-16 rounded-full ${getAvailableRoomAccentClass(data.roomstatus)} opacity-10"></span>
            <div class="relative flex h-full min-h-[88px] flex-col justify-between p-2">
                <div class="flex items-start justify-between gap-1">
                    <span class="max-w-[76%] truncate rounded-full px-2 py-[2px] text-[8px] font-black uppercase tracking-wide ring-1 ${getAvailableRoomStatusPillClass(data.roomstatus)}">${getAvailableRoomStatusLabel(data.roomstatus)}</span>
                    <span class="mt-1 h-2.5 w-2.5 rounded-full ${getAvailableRoomAccentClass(data.roomstatus)} shadow-[0_0_0_3px_rgba(255,255,255,0.95)]"></span>
                </div>
                <div class="text-left">
                    <div class="flex items-end gap-1">
                        <span class="text-[26px] leading-none font-black tracking-[-0.04em] text-slate-950">${data.roomnumber || '-'}</span>
                        <span class="material-symbols-outlined mb-0.5 text-slate-300 transition-colors group-hover:text-slate-500" style="font-size:15px;">door_front</span>
                    </div>
                    ${getAvailableRoomStatusDescription(data) ? `<div class="mt-1 max-w-full truncate text-[9px] font-semibold text-slate-500">${getAvailableRoomStatusDescription(data)}</div>` : ''}
                </div>
                <div class="border-t border-slate-100 pt-1">
                    <div class="w-full truncate text-left text-[8px] font-black uppercase tracking-wide text-slate-600">${getAvailableRoomCategoryLabel(data)}</div>
                </div>
            </div>
        </button>
    `
}

function renderAvailableRoomsLayout(filtered = [], groupedByFloor = [], groupedByCategory = []){
    const layout = availableRoomsState.layout || 'compact'
    if(!filtered.length) return `<div class="h-full w-full flex items-center justify-center text-sm text-slate-500">No rooms match current filters</div>`

    if(layout === 'status') {
        return `
            <div class="grid h-full grid-cols-2 xl:grid-cols-4 gap-2">
                ${groupAvailableRoomsByStatus(filtered).map(([status, rooms]) => `
                    <section class="min-h-0 rounded-md border border-slate-200 bg-slate-50 p-2 flex flex-col">
                        <div class="mb-2 flex items-center justify-between">
                            <span class="inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-black uppercase ring-1 ${getAvailableRoomStatusPillClass(status)}">
                                <span class="h-2 w-2 rounded-full ${getAvailableRoomAccentClass(status)}"></span>
                                ${status}
                            </span>
                            <span class="text-[10px] font-bold text-slate-500">${rooms.length}</span>
                        </div>
                        <div class="grid gap-1 overflow-hidden" style="grid-template-columns:repeat(auto-fill,minmax(42px,1fr));">
                            ${rooms.map(room => renderAvailableRoomCompactButton(room)).join('') || `<div class="col-span-full text-center text-[11px] text-slate-400 py-4">No rooms</div>`}
                        </div>
                    </section>
                `).join('')}
            </div>
        `
    }

    if(layout === 'floor') {
        return groupedByFloor.map(([floorLabel, floorRooms]) => `
            <section class="mb-2 rounded-md border border-slate-200 bg-white p-2">
                <div class="mb-2 flex items-center justify-between bg-slate-950 text-white rounded px-2 py-1 text-[10px] font-black uppercase">
                    <span>Floor ${floorLabel === 'UNSPECIFIED' ? 'Unspecified' : floorLabel}</span>
                    <span class="text-white/70">${floorRooms.length}</span>
                </div>
                <div class="flex flex-wrap gap-1">
                    ${floorRooms.map(room => renderAvailableRoomCompactButton(room, 'flex-none w-[46px]')).join('')}
                </div>
            </section>
        `).join('')
    }

    if(layout === 'category') {
        return groupedByCategory.map(([categoryLabel, categoryRooms]) => `
            <section class="mb-2 rounded-md border border-slate-200 bg-white p-2">
                <div class="mb-2 flex items-center justify-between bg-slate-950 text-white rounded px-2 py-1 text-[10px] font-black uppercase">
                    <span>${categoryLabel === 'UNCATEGORIZED' ? 'Uncategorized' : categoryLabel}</span>
                    <span class="text-white/70">${categoryRooms.length}</span>
                </div>
                <div class="flex flex-wrap gap-1">
                    ${categoryRooms.map(room => renderAvailableRoomCompactButton(room, 'flex-none w-[46px]')).join('')}
                </div>
            </section>
        `).join('')
    }

    const isCompactLayout = layout === 'compact'
    return groupedByFloor.map(([floorLabel, floorRooms]) => `
        <section class="${isCompactLayout ? 'mb-1' : 'mb-3'}">
            <div class="${isCompactLayout ? 'flex items-center justify-between bg-slate-900 text-white rounded px-1.5 py-[2px] text-[9px] font-black uppercase' : 'sticky top-0 z-10 bg-slate-100 border border-slate-200 rounded px-2 py-1 text-[11px] font-bold text-slate-700 mb-1'}">
                <span>Floor ${floorLabel === 'UNSPECIFIED' ? 'Unspecified' : floorLabel}</span>
                <span class="${isCompactLayout ? 'text-white/70' : 'font-medium text-slate-500'}">(${floorRooms.length})</span>
            </div>
            <div class="${isCompactLayout ? 'grid gap-1 mt-1' : 'grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2'}" ${isCompactLayout ? 'style="grid-template-columns:repeat(auto-fill,minmax(42px,1fr));"' : ''}>
                ${floorRooms.map((data) => isCompactLayout ? renderAvailableRoomCompactButton(data) : renderAvailableRoomCardButton(data)).join('')}
            </div>
        </section>
    `).join('')
}

function ensureAvailableRoomSliderEventsBound(){
    if(!did('arshadow') || did('arshadow').dataset.boundSliderEvents === '1') return
    did('arshadow').dataset.boundSliderEvents = '1'
    did('arshadow').addEventListener('input', (event)=>{
        if(event.target.id === 'searchavailableroom'){
            availableRoomsState.search = event.target.value || ''
            renderAvailableRoomsBoard()
        }
        if(event.target.id === 'ar-filter-building'){
            availableRoomsState.building = event.target.value || 'ALL'
            renderAvailableRoomsBoard()
        }
        if(event.target.id === 'ar-filter-floor'){
            availableRoomsState.floor = event.target.value || 'ALL'
            renderAvailableRoomsBoard()
        }
        if(event.target.id === 'ar-filter-category'){
            availableRoomsState.category = event.target.value || 'ALL'
            renderAvailableRoomsBoard()
        }
    })
    did('arshadow').addEventListener('change', (event)=>{
        if(event.target.id === 'ar-auto-refresh'){
            setAvailableRoomsAutoRefresh(event.target.checked)
        }
        if(event.target.id === 'ar-filter-building'){
            availableRoomsState.building = event.target.value || 'ALL'
            renderAvailableRoomsBoard()
        }
        if(event.target.id === 'ar-filter-floor'){
            availableRoomsState.floor = event.target.value || 'ALL'
            renderAvailableRoomsBoard()
        }
        if(event.target.id === 'ar-filter-category'){
            availableRoomsState.category = event.target.value || 'ALL'
            renderAvailableRoomsBoard()
        }
    })
    did('arshadow').addEventListener('click', (event)=>{
        const statusButton = event.target.closest('[data-ar-status]')
        if(statusButton){
            availableRoomsState.status = statusButton.getAttribute('data-ar-status') || 'ALL'
            renderAvailableRoomsBoard()
            return
        }
        const layoutButton = event.target.closest('[data-ar-layout]')
        if(layoutButton){
            availableRoomsState.layout = layoutButton.getAttribute('data-ar-layout') || 'compact'
            renderAvailableRoomsBoard()
            return
        }
        const actionButton = event.target.closest('[data-ar-action]')
        if(!actionButton) return
        const action = actionButton.getAttribute('data-ar-action')
        const roomNo = actionButton.getAttribute('data-room-number') || ''
        if(action === 'open-details') openAvailableRoomDetails(roomNo)
        if(action === 'close-details') closeAvailableRoomDetails()
        if(action === 'clear-filters') clearAvailableRoomFilters()
        if(action === 'refresh-now') runavailablerooms()
        if(action === 'copy-room') copyAvailableRoomNumber(roomNo)
        if(action === 'open-room-status') openRoomStatusFromAvailableRoom()
        if(action === 'open-checkin'){
            const selected = availableRoomsDataset.find(item => String(item.roomnumber || '').trim() === String(roomNo).trim())
            openCheckinFromAvailableRoom(selected)
        }
        if(action === 'open-reservation'){
            const selected = availableRoomsDataset.find(item => String(item.roomnumber || '').trim() === String(roomNo).trim())
            openReservationFromAvailableRoom(selected)
        }
    })
}

function renderAvailableRoomsBoard(){
    const host = did('availableroomcontainer')
    if(!host) return
    const { buildings, floors, categories } = getAvailableRoomsFilterOptions()
    const filtered = filterAvailableRoomsData()
    const groupedByFloor = groupAvailableRoomsByFloor(filtered)
    const groupedByCategory = groupAvailableRoomsByCategory(filtered)
    const summary = {
        total: availableRoomsDataset.length,
        available: availableRoomsDataset.filter(item => normalizeRoomStatus(item.roomstatus) === 'AVAILABLE').length,
        reserved: availableRoomsDataset.filter(item => normalizeRoomStatus(item.roomstatus) === 'RESERVED').length,
        occupied: availableRoomsDataset.filter(item => normalizeRoomStatus(item.roomstatus) === 'OCCUPIED').length
    }
    const pills = [
        { key: 'ALL', label: 'All' },
        { key: 'AVAILABLE', label: 'Available' },
        { key: 'RESERVED', label: 'Reserved' },
        { key: 'OCCUPIED', label: 'Occupied' },
        { key: 'OTHER', label: 'Other' }
    ]

    const validDetail = availableRoomsDetail && availableRoomsDataset.find(item => String(item.roomnumber || '') === String(availableRoomsDetail.roomnumber || ''))
    if(!validDetail) availableRoomsDetail = null
    const currentLayout = availableRoomsState.layout || 'compact'

    host.innerHTML = `
        <div class="h-full overflow-hidden flex flex-col gap-2">
            <div class="sticky top-0 z-20 bg-white/95 border border-slate-200 rounded-md p-2 shadow-sm">
                <div class="flex items-center justify-between gap-2">
                    <div>
                        <p class="text-sm font-bold text-slate-800">Room Operations Board</p>
                        <p id="ar-last-updated" class="text-[11px] text-slate-500">${getAvailableRoomsRefreshText()}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button data-ar-action="refresh-now" class="material-symbols-outlined text-slate-600 hover:text-slate-900" style="font-size:18px;" title="Refresh now">refresh</button>
                        <label class="text-[11px] flex items-center gap-1 text-slate-700">
                            <input id="ar-auto-refresh" type="checkbox" ${availableRoomsState.autoRefresh ? 'checked' : ''}>
                            Auto-refresh
                        </label>
                    </div>
                </div>
                <div class="grid grid-cols-4 gap-1 mt-2 text-[10px] font-semibold">
                    <div class="rounded bg-slate-100 p-1 text-center">Total<br>${summary.total}</div>
                    <div class="rounded bg-green-100 text-green-700 p-1 text-center">Available<br>${summary.available}</div>
                    <div class="rounded bg-orange-100 text-orange-700 p-1 text-center">Reserved<br>${summary.reserved}</div>
                    <div class="rounded bg-red-100 text-red-700 p-1 text-center">Occupied<br>${summary.occupied}</div>
                </div>
            </div>
            <div class="sticky top-[104px] z-20 bg-white/95 border border-slate-200 rounded-md p-2 shadow-sm">
                <div class="flex flex-wrap gap-1 mb-2">
                    ${pills.map(pill => `<button data-ar-status="${pill.key}" class="px-2 py-1 text-[10px] rounded border ${availableRoomsState.status === pill.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300'}">${pill.label}</button>`).join('')}
                    <button data-ar-layout="compact" class="ml-auto inline-flex items-center justify-center gap-1 px-2 py-1 text-[10px] rounded border ${currentLayout === 'compact' ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-600 border-slate-300'}" title="Compact layout">
                        <span class="material-symbols-outlined" style="font-size:14px;">grid_view</span>
                        Compact
                    </button>
                    <button data-ar-layout="floor" class="inline-flex items-center justify-center gap-1 px-2 py-1 text-[10px] rounded border ${currentLayout === 'floor' ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-600 border-slate-300'}" title="Floor map layout">
                        <span class="material-symbols-outlined" style="font-size:14px;">view_stream</span>
                        Floor Map
                    </button>
                    <button data-ar-layout="category" class="inline-flex items-center justify-center gap-1 px-2 py-1 text-[10px] rounded border ${currentLayout === 'category' ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-600 border-slate-300'}" title="Category layout">
                        <span class="material-symbols-outlined" style="font-size:14px;">category</span>
                        Category
                    </button>
                    <button data-ar-layout="status" class="inline-flex items-center justify-center gap-1 px-2 py-1 text-[10px] rounded border ${currentLayout === 'status' ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-600 border-slate-300'}" title="Status columns layout">
                        <span class="material-symbols-outlined" style="font-size:14px;">view_column</span>
                        Status
                    </button>
                    <button data-ar-layout="cards" class="inline-flex items-center justify-center gap-1 px-2 py-1 text-[10px] rounded border ${currentLayout === 'cards' ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-600 border-slate-300'}" title="Card layout">
                        <span class="material-symbols-outlined" style="font-size:14px;">dashboard</span>
                        Cards
                    </button>
                    <button data-ar-action="clear-filters" class="px-2 py-1 text-[10px] rounded border border-slate-300 text-slate-600">Clear</button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-1">
                    <input id="searchavailableroom" value="${availableRoomsState.search}" class="form-control !p-2 text-xs" placeholder="Search room, category, building">
                    <select id="ar-filter-building" class="form-control !p-2 text-xs">
                        <option value="ALL">All buildings</option>
                        ${buildings.map(value => `<option ${availableRoomsState.building === value ? 'selected' : ''} value="${value}">${value}</option>`).join('')}
                    </select>
                    <select id="ar-filter-floor" class="form-control !p-2 text-xs">
                        <option value="ALL">All floors</option>
                        ${floors.map(value => `<option ${availableRoomsState.floor === value ? 'selected' : ''} value="${value}">${value}</option>`).join('')}
                    </select>
                    <select id="ar-filter-category" class="form-control !p-2 text-xs">
                        <option value="ALL">All categories</option>
                        ${categories.map(value => `<option ${availableRoomsState.category === value ? 'selected' : ''} value="${value}">${value}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="flex-1 min-h-0 grid ${availableRoomsDetail ? 'grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px]' : 'grid-cols-1'} gap-2 overflow-hidden">
                <div class="border border-slate-200 rounded-md p-2 ${currentLayout === 'compact' || currentLayout === 'status' ? 'overflow-hidden' : 'overflow-y-auto'} bg-white">
                    ${renderAvailableRoomsLayout(filtered, groupedByFloor, groupedByCategory)}
                </div>
                ${availableRoomsDetail ? `
                    <div class="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-[0_16px_36px_rgba(15,23,42,0.12)] overflow-y-auto">
                        <span class="absolute inset-x-0 top-0 h-1 ${getAvailableRoomAccentClass(availableRoomsDetail.roomstatus)}"></span>
                        <div class="p-3">
                            <div class="flex items-start justify-between gap-2">
                                <div>
                                    <span class="inline-flex rounded-full px-2 py-[3px] text-[9px] font-black uppercase tracking-wide ring-1 ${getAvailableRoomStatusPillClass(availableRoomsDetail.roomstatus)}">${getAvailableRoomStatusLabel(availableRoomsDetail.roomstatus)}</span>
                                    <p class="mt-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Room</p>
                                    <p class="text-[34px] font-black leading-none tracking-[-0.05em] text-slate-950">${availableRoomsDetail.roomnumber || '-'}</p>
                                </div>
                                <button data-ar-action="close-details" class="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600" title="Close">
                                    <span class="material-symbols-outlined" style="font-size:18px;">close</span>
                                </button>
                            </div>

                            <div class="mt-3 rounded-xl bg-slate-950 p-3 text-white shadow-inner">
                                <p class="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">Category</p>
                                <p class="mt-1 text-sm font-black leading-snug break-words">${availableRoomsDetail.roomcategory || '-'}</p>
                            </div>

                            ${getAvailableRoomStatusDescription(availableRoomsDetail) ? `
                                <div class="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-600">
                                    <div class="flex gap-2">
                                        <span class="material-symbols-outlined mt-[1px] text-slate-400" style="font-size:15px;">chat_bubble</span>
                                        <span>${getAvailableRoomStatusDescription(availableRoomsDetail)}</span>
                                    </div>
                                </div>
                            ` : ''}

                            <div class="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                                <div class="rounded-xl border border-slate-100 bg-slate-50 p-2">
                                    <p class="font-black uppercase tracking-wide text-slate-400">Name</p>
                                    <p class="mt-1 font-bold leading-snug text-slate-800 break-words">${availableRoomsDetail.roomname || '-'}</p>
                                </div>
                                <div class="rounded-xl border border-slate-100 bg-slate-50 p-2">
                                    <p class="font-black uppercase tracking-wide text-slate-400">Building</p>
                                    <p class="mt-1 font-bold leading-snug text-slate-800 break-words">${availableRoomsDetail.building || '-'}</p>
                                </div>
                                <div class="rounded-xl border border-slate-100 bg-slate-50 p-2">
                                    <p class="font-black uppercase tracking-wide text-slate-400">Floor</p>
                                    <p class="mt-1 font-bold leading-snug text-slate-800 break-words">${availableRoomsDetail.floor || '-'}</p>
                                </div>
                                <div class="rounded-xl border border-slate-100 bg-slate-50 p-2">
                                    <p class="font-black uppercase tracking-wide text-slate-400">Status</p>
                                    <p class="mt-1 font-bold leading-snug text-slate-800 break-words">${String(availableRoomsDetail.roomstatus || '-').toUpperCase()}</p>
                                </div>
                            </div>

                            <div class="mt-3 grid grid-cols-1 gap-2">
                                <button data-ar-action="copy-room" data-room-number="${availableRoomsDetail.roomnumber || ''}" class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-black text-slate-700 transition hover:bg-slate-50">
                                    <span class="material-symbols-outlined" style="font-size:15px;">content_copy</span>
                                    Copy Room Number
                                </button>
                                <button data-ar-action="open-checkin" data-room-number="${availableRoomsDetail.roomnumber || ''}" class="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-[11px] font-black text-white transition hover:bg-slate-800">
                                    <span class="material-symbols-outlined" style="font-size:15px;">login</span>
                                    Go To Check-In
                                </button>
                                <button data-ar-action="open-reservation" data-room-number="${availableRoomsDetail.roomnumber || ''}" class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-[11px] font-black text-white transition hover:bg-blue-700">
                                    <span class="material-symbols-outlined" style="font-size:15px;">event_available</span>
                                    Make Reservation
                                </button>
                                <button data-ar-action="open-room-status" data-room-number="${availableRoomsDetail.roomnumber || ''}" class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-black text-slate-700 transition hover:bg-slate-50" title="Open Room Status">
                                    <span class="material-symbols-outlined" style="font-size:17px;">fact_check</span>
                                    Room Status
                                </button>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `
    updateAvailableRoomsRefreshAge()
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
    const host = did('availableroomcontainer')
    if(host && !availableRoomsDataset.length){
        host.innerHTML = `<div class="h-full rounded-md border border-slate-200 bg-white p-3">
            <div class="animate-pulse space-y-2">
                <div class="h-4 bg-slate-200 rounded w-1/2"></div>
                <div class="grid grid-cols-5 gap-2">
                    ${Array.from({length: 20}).map(()=>`<div class="h-12 bg-slate-200 rounded"></div>`).join('')}
                </div>
            </div>
        </div>`
    }
    let request = await httpRequest('../controllers/getallroomstatus')
    request = JSON.parse(request)
    if(request.status && Array.isArray(request.data)) {
        const sortedRooms = [...request.data].sort((a, b) => {
            const ar = Number(String(a.roomnumber || '').replace(/\D/g, ''))
            const br = Number(String(b.roomnumber || '').replace(/\D/g, ''))
            if (!Number.isNaN(ar) && !Number.isNaN(br) && ar !== br) return ar - br
            return String(a.roomnumber || '').localeCompare(String(b.roomnumber || ''))
        })
        availableroomlength = sortedRooms.length
        if(document.getElementById('dashavailablerooms'))document.getElementById('dashavailablerooms').textContent = sortedRooms.length
        const freshHash = buildAvailableRoomsHash(sortedRooms)
        if(freshHash === availableRoomsLastHash && availableRoomsDataset.length){
            availableRoomsLastUpdatedAt = Date.now()
            updateAvailableRoomsRefreshAge()
            return
        }
        availableRoomsLastHash = freshHash
        availableRoomsDataset = sortedRooms
        availableRoomsLastUpdatedAt = Date.now()
        renderAvailableRoomsBoard()
        return
    }
    if(host){
        host.innerHTML = `<div class="h-full rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 flex items-center justify-center">Unable to load room status right now.</div>`
    }
    return notification('No records for available rooms retrieved')
}

let receivingBanksCache = null
let receivingBanksPromise = null

function escapeReceivingBankOption(value = '') {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[char])
}

function getReceivingBankFieldMarkup(comp = 'comp', id = 'receivingbank', name = 'moredata') {
    return `<div class="form-group mt-2">
        <label for="${id}" class="control-label">Receiving Bank</label>
        <select name="${name}" id="${id}" class="form-control ${comp} bg-white receiving-bank-select">
            <option value="">-- Select Receiving Bank --</option>
        </select>
    </div>`
}

async function fetchReceivingBanks() {
    if (Array.isArray(receivingBanksCache)) return receivingBanksCache
    if (receivingBanksPromise) return receivingBanksPromise
    receivingBanksPromise = httpRequest2('../controllers/fetchbanks.php', null, null, 'json')
        .then((request) => {
            const rows = Array.isArray(request?.data)
                ? request.data
                : (Array.isArray(request?.data?.data) ? request.data.data : [])
            receivingBanksCache = request?.status ? rows : []
            return receivingBanksCache
        })
        .catch(() => {
            receivingBanksCache = []
            return receivingBanksCache
        })
        .finally(() => {
            receivingBanksPromise = null
        })
    return receivingBanksPromise
}

async function populateReceivingBankSelects(root = document) {
    const selects = Array.from((root || document).querySelectorAll('.receiving-bank-select'))
    if (!selects.length) return
    const banks = await fetchReceivingBanks()
    const options = `<option value="">-- Select Receiving Bank --</option>` + banks.map((bank) => {
        const label = [bank.bankname, bank.accountnumber].filter(Boolean).join(' - ')
        return `<option value="${escapeReceivingBankOption(bank.id)}">${escapeReceivingBankOption(label || bank.bankname || bank.id)}</option>`
    }).join('')
    selects.forEach((select) => {
        const currentValue = select.value
        select.innerHTML = options
        if (currentValue) select.value = currentValue
    })
}

function getReceivingBankValue(id = 'receivingbank') {
    return String(did(id)?.value || document.querySelector('.receiving-bank-select')?.value || '').trim()
}

function appendReceivingBankMoreData(payload, id = 'receivingbank') {
    if (!payload) return payload
    const value = getReceivingBankValue(id)
    if (value || did(id) || document.querySelector('.receiving-bank-select')) payload.set('moredata', value)
    return payload
}

function validatePaymentMethodForAmount(amountId = 'amountpaid', paymentMethodId = 'paymentmethod') {
    const amount = Number(String(did(amountId)?.value || '').replace(/,/g, ''))
    if (amount > 0 && !String(did(paymentMethodId)?.value || '').trim()) {
        notification('Please select a payment method for the amount paid.', 0)
        return false
    }
    return true
}

function checkotherbankdetails(comp='comp'){
    if(document.getElementById('paymentmethod')){
        const method = String(document.getElementById('paymentmethod').value || '').trim().toUpperCase()
        if(method.includes('TRANSFER') || method == 'POS' || method == 'BANK CARD'){
            document.getElementById('bankdetails').innerHTML = `<div class="form-group mt-2">
                                                     <label for="logoname" class="control-label">Sender Bank Name</label>
                                                    <input type="text" name="bankname" id="bankname" placeholder="Enter sender bank name (optional)" class="form-control ${comp} bg-white" >
                                                </div>
                                                <div class="form-group mt-2">
                                                    <label for="logoname" class="control-label">Other Details</label>
                                                    <textarea type="number" name="otherdetails" id="otherdetails" placeholder="Enter account name, transaction reference and other relevant details" class="form-control ${comp} bg-white"></textarea>
                                                </div>
                                                ${getReceivingBankFieldMarkup(comp)}`
            populateReceivingBankSelects(document.getElementById('bankdetails'))
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
    if(!sessionStorage.getItem('user'))return window.location.href = './login'
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
