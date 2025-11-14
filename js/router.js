/* 
    Object key is the id of the  menu selector
    template: is the html template name.
    startingFunction: function to call when page opens 

*/

const routerTree = {

    profile: {
        template: 'profile',
        startingFunction: 'profileActive',
        scriptName: './js/profile.js'
    },
    useractivity: {
        template: 'useractivity',
        startingFunction: 'useractivityActive',
        scriptName: './js/useractivity.js'
    },
    accesscontrol: {
        template: 'accesscontrol',
        startingFunction: 'accesscontrolActive',
        scriptName: './js/accesscontrol.js'
    },
    password: {
        template: 'password',
        startingFunction: 'passwordActive',
        scriptName: './js/password.js'
    },
    createinventory: {
        template: 'createinventory',
        startingFunction: 'createinventoryActive',
        scriptName: './js/createinventory.js'
    },
    viewinventory: {
        template: 'viewinventory',
        startingFunction: 'viewinventoryActive',
        scriptName: './js/viewinventory.js'
    },
    warehousestorage: {
        template: 'warehousestorage',
        startingFunction: 'warehousestorageActive',
        scriptName: './js/warehousestorage.js'
    },
    requisition: {
        template: 'requisition',
        startingFunction: 'requisitionActive',
        scriptName: './js/requisition.js'
    },
    viewrequisition: {
        template: 'viewrequisition',
        startingFunction: 'viewrequisitionActive',
        scriptName: './js/viewrequisition.js'
    },
    recipe: {
        template: 'recipe',
        startingFunction: 'recipeActive',
        scriptName: './js/recipe.js'
    },
    viewrecipe: {
        template: 'viewrecipe',
        startingFunction: 'viewrecipeActive',
        scriptName: './js/viewrecipe.js'
    },
    managesupplier: {
        template: 'managesupplier',
        startingFunction: 'managesupplierActive',
        scriptName: './js/managesupplier.js'
    },
    purchaseorder: {
        template: 'purchaseorder',
        startingFunction: 'purchaseorderActive',
        scriptName: './js/purchaseorder.js'
    },
    viewpurchaseorder: {
        template: 'viewpurchaseorder',
        startingFunction: 'viewpurchaseorderActive',
        scriptName: './js/viewpurchaseorder.js'
    },
    receivepurchases: {
        template: 'receivepurchases',
        startingFunction: 'receivepurchasesActive',
        scriptName: './js/receivepurchases.js'
    },
    viewpurchases: {
        template: 'viewpurchases',
        startingFunction: 'viewpurchasesActive',
        scriptName: './js/viewpurchases.js'
    },
    approverequisition: {
        template: 'approverequisition',
        startingFunction: 'approverequisitionActive',
        scriptName: './js/approverequisition.js'
    },
    settings: {
        template: 'settings',
        startingFunction: 'settingsActive',
        scriptName: './js/settings.js'
    },
    payables: {
        template: 'payables',
        startingFunction: 'payablesActive',
        scriptName: './js/payables.js'
    },
    addglaccount: {
        template: 'addglaccount',
        startingFunction: 'addglaccountActive',
        scriptName: './js/addglaccount.js'
    },
    viewglaccount: {
        template: 'viewglaccount',
        startingFunction: 'viewglaccountActive',
        scriptName: './js/viewglaccount.js'
    },
    addgltransaction: {
        template: 'addgltransaction',
        startingFunction: 'addgltransactionActive',
        scriptName: './js/addgltransaction.js'
    },
    gltransactionhistory: {
        template: 'gltransactionhistory',
        startingFunction: 'gltransactionhistoryActive',
        scriptName: './js/gltransactionhistory.js'
    },
    trialbalance: {
        template: 'trialbalance',
        startingFunction: 'trialbalanceActive',
        scriptName: './js/trialbalance.js'
    },
    incomestatement: {
        template: 'incomestatement',
        startingFunction: 'incomestatementActive',
        scriptName: './js/incomestatement.js'
    },
    balancesheet: {
        template: 'balancesheet',
        startingFunction: 'balancesheetActive',
        scriptName: './js/balancesheet.js'
    },
    allpayables: {
        template: 'allpayables',
        startingFunction: 'allpayablesActive',
        scriptName: './js/allpayables.js'
    },
    addroom: {
        template: 'addroom',
        startingFunction: 'addroomActive',
        scriptName: './js/addroom.js'
    },
    roomcategories: {
        template: 'roomcategories',
        startingFunction: 'roomcategoriesActive',
        scriptName: './js/roomcategories.js'
    },
    dashboard: {
        template: 'dashboard',
        startingFunction: 'dashboardActive',
        scriptName: './js/dashboard.js'
    },
    userspage: {
        template: 'userspage',
        startingFunction: 'userspageActive',
        scriptName: './js/userspage.js'
    },
    dailyassignmentsheet: {
        template: 'dailyassignmentsheet',
        startingFunction: 'dailyassignmentsheetActive',
        scriptName: './js/dailyassignmentsheet.js'
    },
    maintenancerequest: {
        template: 'maintenancerequest',
        startingFunction: 'maintenancerequestActive',
        scriptName: './js/maintenancerequest.js'
    },
    workorder: {
        template: 'workorder',
        startingFunction: 'workorderActive',
        scriptName: './js/workorder.js'
    },
    createchecklistforcleaning: {
        template: 'createchecklistforcleaning',
        startingFunction: 'createchecklistforcleaningActive',
        scriptName: './js/createchecklistforcleaning.js'
    },
    roomcleaningchecklist: {
        template: 'roomcleaningchecklist',
        startingFunction: 'roomcleaningchecklistActive',
        scriptName: './js/roomcleaningchecklist.js'
    },
    lostfoundregister: {
        template: 'lostfoundregister',
        startingFunction: 'lostfoundregisterActive',
        scriptName: './js/lostfoundregister.js'
    },
    viewdailyassignmentsheet: {
        template: 'viewdailyassignmentsheet',
        startingFunction: 'viewdailyassignmentsheetActive',
        scriptName: './js/viewdailyassignmentsheet.js'
    },
    viewmaintenancerequest: {
        template: 'viewmaintenancerequest',
        startingFunction: 'viewmaintenancerequestActive',
        scriptName: './js/viewmaintenancerequest.js'
    },
    guestsreservations: {
        template: 'guestsreservations',
        startingFunction: 'guestsreservationsActive',
        scriptName: './js/guestsreservations.js'
    },
    searcharrivals: {
        template: 'searcharrivals',
        startingFunction: 'searcharrivalsActive',
        scriptName: './js/searcharrivals.js'
    },
    checkin: {
        template: 'checkin',
        startingFunction: 'checkinActive',
        scriptName: './js/checkin.js'
    },
    messages: {
        template: 'messages',
        startingFunction: 'messagesActive',
        scriptName: './js/messages.js'
    },
    notification: {
        template: 'notification',
        startingFunction: 'notificationActive',
        scriptName: './js/notification.js'
    },
    department: {
        template: 'department',
        startingFunction: 'departmentActive',
        scriptName: './js/department.js'
    },
    roomstatus: {
        template: 'roomstatus',
        startingFunction: 'roomstatusActive',
        scriptName: './js/roomstatus.js'
    },
    checkout: {
        template: 'checkout',
        startingFunction: 'checkoutActive',
        scriptName: './js/checkout.js'
    },
    cancellation: {
        template: 'cancellation',
        startingFunction: 'cancellationActive',
        scriptName: './js/cancellation.js'
    },
    receiveables: {
        template: 'receiveables',
        startingFunction: 'receiveablesActive',
        scriptName: './js/receiveables.js'
    },
    reassignrooms: {
        template: 'reassignrooms',
        startingFunction: 'reassignroomsActive',
        scriptName: './js/reassignrooms.js'
    },
    sales: {
        template: 'sales',
        startingFunction: 'salesActive',
        scriptName: './js/sales.js'
    },
    receipts: {
        template: 'receipts',
        startingFunction: 'receiptsActive',
        scriptName: './js/receipts.js'
    },
    changepassword: {
        template: 'changepassword',
        startingFunction: 'changepasswordActive',
        scriptName: './js/changepassword.js'
    },
    updateinventory: {
        template: 'updateinventory',
        startingFunction: 'updateinventoryActive',
        scriptName: './js/updateinventory.js'
    },
    openstock: {
        template: 'openstock',
        startingFunction: 'openstockActive',
        scriptName: './js/openstock.js'
    },
    reviews: {
        template: 'reviews',
        startingFunction: 'reviewsActive',
        scriptName: './js/reviews.js'
    },
    stockhistory: {
        template: 'stockhistory',
        startingFunction: 'stockhistoryActive',
        scriptName: './js/stockhistory.js'
    },
    stockvaluation: {
        template: 'stockvaluation',
        startingFunction: 'stockvaluationActive',
        scriptName: './js/stockvaluation.js'
    },
    issuetypelist: {
        template: 'issuetypelist',
        startingFunction: 'issuetypelistActive',
        scriptName: './js/issuetypelist.js'
    },
    issuelog: {
        template: 'issuelog',
        startingFunction: 'issuelogActive',
        scriptName: './js/issuelog.js'
    },
    viewissuelog: {
        template: 'viewissuelog',
        startingFunction: 'viewissuelogActive',
        scriptName: './js/viewissuelog.js'
    },
    returns: {
        template: 'returns',
        startingFunction: 'returnsActive',
        scriptName: './js/returns.js'
    },
    viewreturns: {
        template: 'viewreturns',
        startingFunction: 'viewreturnsActive',
        scriptName: './js/viewreturns.js'
    },
    groupofguests: {
        template: 'groupofguests',
        startingFunction: 'groupofguestsActive',
        scriptName: './js/groupofguests.js'
    },
    costcenter: {
        template: 'costcenter',
        startingFunction: 'costcenterActive',
        scriptName: './js/costcenter.js'
    },
    discountcouponp: {
        template: 'discountcouponp',
        startingFunction: 'discountcouponActive',
        scriptName: './js/discountcouponp.js'
    },
    bookplan: {
        template: 'bookplan',
        startingFunction: 'bookplanActive',
        scriptName: './js/bookplan.js'
    },
    ratecode: {
        template: 'ratecode',
        startingFunction: 'ratecodeActive',
        scriptName: './js/ratecode.js'
    },
    groupreservations: {
        template: 'groupreservations',
        startingFunction: 'groupreservationsActive',
        scriptName: './js/groupreservations.js'
    },
    printregistrationcard: {
        template: 'printregistrationcard',
        startingFunction: 'printregistrationcardActive',
        scriptName: './js/printregistrationcard.js'
    },
    reservationcheckin: {
        template: 'reservationcheckin',
        startingFunction: 'reservationcheckinActive',
        scriptName: './js/reservationcheckin.js'
    },
    groupcheckin: {
        template: 'groupcheckin',
        startingFunction: 'groupcheckinActive',
        scriptName: './js/groupcheckin.js'
    },
    invoicing: {
        template: 'invoicing',
        startingFunction: 'invoicingActive',
        scriptName: './js/invoicing.js'
    },
    track: {
        template: 'track',
        startingFunction: 'trackActive',
        scriptName: './js/track.js'
    },
    cancelreservation: {
        template: 'cancelreservation',
        startingFunction: 'cancelreservationActive',
        scriptName: './js/cancelreservation.js'
    },
    extendstay: {
        template: 'extendstay',
        startingFunction: 'extendstayActive',
        scriptName: './js/extendstay.js'
    },
    expectedarrivals: {
        template: 'expectedarrivals',
        startingFunction: 'expectedarrivalsActive',
        scriptName: './js/expectedarrivals.js'
    },
    occupancylist: {
        template: 'occupancylist',
        startingFunction: 'occupancylistActive',
        scriptName: './js/occupancylist.js'
    },
    build: {
        template: 'build',
        startingFunction: 'buildActive',
        scriptName: './js/build.js'
    },
    viewbuild: {
        template: 'viewbuild',
        startingFunction: 'viewbuildActive',
        scriptName: './js/viewbuild.js'
    },
    salesreport: {
        template: 'salesreport',
        startingFunction: 'salesreportActive',
        scriptName: './js/salesreport.js'
    },
    salesreportpos: {
        template: 'salesreportpos',
        startingFunction: 'salesreportposActive',
        scriptName: './js/salesreportpos.js'
    },
    posreceipt: {
        template: 'posreceipt',
        startingFunction: 'posreceiptActive',
        scriptName: './js/posreceipt.js'
    },
    expenses: {
        template: 'expenses',
        startingFunction: 'expensesActive',
        scriptName: './js/expenses.js'
    },
    payment: {
        template: 'payment',
        startingFunction: 'paymentActive',
        scriptName: './js/payment.js'
    },
    payment: {
        template: 'payment',
        startingFunction: 'paymentActive',
        scriptName: './js/payment.js'
    },
    reversal: { 
        template: 'reversal',
        startingFunction: 'reversalActive',
        scriptName: './js/reversal.js'
    },
    viewreversal: { 
        template: 'viewreversal',
        startingFunction: 'viewreversalActive',
        scriptName: './js/viewreversal.js'
    },
    reversals: { 
        template: 'reversals',
        startingFunction: 'reversalsActive',
        scriptName: './js/reversals.js'
    },
    viewreversals: { 
        template: 'viewreversals',
        startingFunction: 'viewreversalsActive',
        scriptName: './js/viewreversals.js'
    },
    updateroomstatus: { 
        template: 'updateroomstatus',
        startingFunction: 'updateroomstatusActive',
        scriptName: './js/updateroomstatus.js'
    },
    expectedcheckouts: { 
        template: 'expectedcheckouts',
        startingFunction: 'expectedcheckoutsActive',
        scriptName: './js/expectedcheckouts.js'
    },
    generalreport: { 
        template: 'generalreport',
        startingFunction: 'generalreportActive',
        scriptName: './js/generalreport.js'
    },
    noshow: { 
        template: 'noshow',
        startingFunction: 'noshowActive',
        scriptName: './js/noshow.js'
    },
    hotelguest: { 
        template: 'hotelguest',
        startingFunction: 'hotelguestActive',
        scriptName: './js/hotelguest.js'
    },
    generalaccountreport: { 
        template: 'generalaccountreport',
        startingFunction: 'generalaccountreportActive',
        scriptName: './js/generalaccountreport.js'
    },
    diningtable: { 
        template: 'diningtable',
        startingFunction: 'diningtableActive',
        scriptName: './js/diningtable.js'
    },
    reservetable: {
        template: 'reservetable',
        startingFunction: 'reservetableActive',
        scriptName: './js/reservetable.js'
    },
}

const ext = '.php'

function routerEvent(route) {
    if(route) {
        let queryParams = `?r=${route}`
        window.history.pushState(queryParams, undefined, `${window.origin.concat(window.location.pathname, queryParams)}`)
        resolveUrlPage()
        if(!isDeviceMobile()) toggleNavigation()
    }
}


function resolveUrlPage() {
    let searchParams = new URLSearchParams(window.location.search)
    if(searchParams.has('r')) {
        let page = routerTree[searchParams.get('r').trim()].template
        openRoute(page+ext)
    }
    else {
        // open home default page
        let queryParams = `?r=profile`
        window.history.pushState(queryParams, undefined, `${window.origin.concat(window.location.pathname, queryParams)}`)
        openRoute('profile'+ext)
    }
    showActiveRoute()
}

function showActiveRoute() {

    let searchParams = new URLSearchParams(window.location.search)
    let page = searchParams.get('r')
    let menu = document.getElementById(page)
    document.querySelectorAll('#navigation .active').forEach( item => item.classList.remove('active'))
    document.querySelectorAll('#navigation .navitem-child-active').forEach( item => item.classList.remove('navitem-child-active'))
    if(menu?.classList.contains('navitem-child')) {
        menu.classList.add('navitem-child-active')
        menu.parentElement.previousElementSibling.classList.add('active')
    }
    else menu?.classList.add('active')
    
}


async function openRoute(url) {
    try {

        document.getElementById('workspace').innerHTML = `
            <div class="w-full h-full flex mt-20">
                <div class="loader m-auto"></div>
            </div>
        `
        document.getElementById('workspace').innerHTML = await httpRequest(url)
         // Get the search parameters from the URL
                let searchParams = new URLSearchParams(window.location.search);
                let page = searchParams.get('r');
                
                // Ensure `page` is not null and the element exists
                if (page) {
                    let pageElement = document.getElementById(page);
                    if (pageElement) {
                        // Create a new div element for the alert
                        let el = document.createElement('div');
                        el.classList.add('p-4', 'mb-4', 'text-sm', 'text-blue-800', 'rounded-lg', 'bg-blue-50');
                        el.setAttribute('role', 'alert');
                        
                        // Get the title attribute of the page element, if it exists
                        let title = pageElement.getAttribute('title');
                        if (title) {
                            el.innerHTML = `<div class="flex flex-col lg:flex-row items-center gap-2 justify-between p-3">
                                                <p class="font-medium">Note!<br/></p> 
                                                <div class="flex-1 text-sm">
                                                    ${title}
                                                </div>  
                                                <button onclick="document.getElementById('${page}').click()" type="button" class="btn !bg-red-400 text-white ml-auto flex items-center justify-center rounded-full w-9 h-9 shadow-sm hover:shadow-md transition-all duration-150">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                        <polyline points="1 4 1 10 7 10"></polyline>
                                                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                                                    </svg>
                                                </button>
                                            </div>`;
                        } else {
                            el.innerHTML = `<div class="flex flex-col lg:flex-row items-center gap-2 justify-between p-3">
                                                <p class="font-medium">Note!<br/></p>
                                                <div class="flex-1 text-sm">
                                                    Title attribute is missing.
                                                </div>
                                                <button onclick="document.getElementById('${page}').click()" type="button" class="btn !bg-red-400 text-white ml-auto flex items-center justify-center rounded-full w-9 h-9 shadow-sm hover:shadow-md transition-all duration-150">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                        <polyline points="1 4 1 10 7 10"></polyline>
                                                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                                                    </svg>
                                                </button>
                                            </div>`;
                        }
                
                        // Prepend the alert element to the workspace
                        document.getElementById('workspace').prepend(el);
                    } else {
                        console.error(`Element with ID '${page}' not found.`);
                    }
                } else {
                    console.error('Parameter "r" is missing from the URL.');
                }
        intializePageJavascript()
    } catch (error) {
        console.log(error)
    }
}

let timer;

function intializePageJavascript() {
    let searchParams = new URLSearchParams(window.location.search)
    let startingFunction = routerTree[searchParams.get('r').trim()].startingFunction
    try {
        clearInterval(timer)
        timer = null;
        timer = setTimeout(() => window?.[startingFunction]?.(), 1000)
    }
    catch(e) {}
}

Object.freeze(routerTree)
