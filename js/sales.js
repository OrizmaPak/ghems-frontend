let salesid
let saletotalamount
let salesBillDatasource = []
let salesBillFilteredDatasource = []
let salesBillRefDebounceTimer = null
let isPopulatingSalesBill = false
let salesSubmissionInFlight = false
let salesReceiptResetOnClose = true
let canDeleteBillsInView = false
let sourceSalesBillContext = null
let orderViewStatusFilter = 'ORDER'
let orderRowsIndex = new Map()
let orderEditBatchId = ''
const orderBillGenerationLocks = new Map()
let orderKitchenReceiptCache = new Map()
let pmReservationOwnerRows = []
let salesInventoryDatasource = []
let salesListingDatasource = []
const salesItemDetailCache = new Map()
const salesAuxiliaryLoadState = {
    costCenters: null,
    roomNumbers: null,
    pmOwners: null
}
const SALES_FETCH_DEBUG = false
const restrictedSalesPaymentPermissions = {
    'NO CHARGE': 'NO CHARGE POSTING',
    'CHAIRMAN DISCOUNT': 'CHAIRMAN DISCOUNT POSTING'
}
const CHAIRMAN_DISCOUNT_RATE = 0.5
const salesLazyLoadState = {
    splitBillsLoaded: false,
    splitBillsLoading: false,
    mergeBillsLoaded: false,
    mergeBillsLoading: false,
    salesViewLoaded: false,
    salesViewLoading: false,
    usersLoaded: false,
    usersLoading: null,
    tableNumbersLoaded: false,
    tableNumbersLoading: null
}

function recordSalesFetchDebug(name = '', details = {}) {
    if(!SALES_FETCH_DEBUG || !name || typeof window === 'undefined') return
    window.__salesFetchDebugCounters = window.__salesFetchDebugCounters || {}
    window.__salesFetchDebugCounters[name] = (window.__salesFetchDebugCounters[name] || 0) + 1
    const count = window.__salesFetchDebugCounters[name]
    const route = typeof getCurrentRouteName === 'function' ? getCurrentRouteName() : ''
    console.log(`[sales-fetch-debug] ${name} #${count}`, { route, ...details })
    window.printSalesFetchDebugSummary = () => console.table(window.__salesFetchDebugCounters)
}

function clearMissingOrderItemsNotice() {
    const holder = did('missingorderitemsnotice')
    if(!holder) return
    holder.classList.add('hidden')
    holder.innerHTML = ''
}

function showMissingOrderItemsNotice(missingItems = []) {
    const holder = did('missingorderitemsnotice')
    if(!holder) return
    if(!Array.isArray(missingItems) || !missingItems.length) {
        clearMissingOrderItemsNotice()
        return
    }
    holder.classList.remove('hidden')
    holder.innerHTML = `
        <p class="font-semibold mb-1">Some order items were adjusted because of stock availability:</p>
        <ul class="list-disc ml-5">
            ${missingItems.map((item) => {
                const added = Number(item.added || 0)
                const available = Number(item.available || 0)
                const action = added > 0
                    ? `reduced to ${formatNumber(added)} available unit(s)`
                    : 'not added because no stock is available'
                return `<li>${item.itemname}: requested ${formatNumber(item.requested)}, available ${formatNumber(available)}, ${action}</li>`
            }).join('')}
        </ul>
    `
}

function truncateBillItemText(value = '', max = 30) {
    const text = String(value || '').trim()
    if(!text) return '-'
    if(text.length <= max) return text
    return `${text.slice(0, max).trimEnd()}...`
}

function renderBillItemsMiniTable(items = []) {
    if(!Array.isArray(items) || !items.length) return '-'
    const previewRows = items.slice(0, 4)
    const tableRows = previewRows.map((item, idx) => `
        <tr>
            <td class="pr-2 align-top">${idx + 1}.</td>
            <td class="pr-2 align-top">${truncateBillItemText(item?.itemname || item?.item || '-')}</td>
            <td class="pr-2 text-right align-top">${formatNumber(item?.qty || 0)}</td>
            <td class="text-right align-top">${formatNumber(item?.cost || 0)}</td>
        </tr>
    `).join('')
    const remaining = items.length - previewRows.length
    const moreRow = remaining > 0
        ? `<tr><td></td><td colspan="3" class="text-slate-500">+${remaining} more</td></tr>`
        : ''
    return `
        <table class="w-full text-[11px] leading-4">
            <tbody>
                ${tableRows}
                ${moreRow}
            </tbody>
        </table>
    `
}

function findSalesBillEntryByBatchOrReference(key = '') {
    const cleaned = String(key || '').trim().toLowerCase()
    if(!cleaned) return null
    return salesBillDatasource.find((item) => {
        const batch = String(item?.batchid || '').trim().toLowerCase()
        const reference = String(item?.reference || '').trim().toLowerCase()
        return batch === cleaned || reference === cleaned
    }) || null
}

function isOrderWorkspaceMode() {
    return getCurrentRouteName() === 'order'
}

function isBillsWorkspaceMode() {
    return getCurrentRouteName() === 'bills'
}

function normalizeOrderStatusValue(value = '', mapOpenToOrder = false) {
    const cleaned = String(value || '').trim().toUpperCase()
    if(!cleaned) return ''
    if(cleaned === 'CANCELLED') return 'CANCELED'
    if(cleaned === 'FIELD') return 'FILLED'
    if(mapOpenToOrder && cleaned === 'OPEN') return 'ORDER'
    return cleaned
}

function getOrderStatusOptions(currentStatus = '') {
    const current = normalizeOrderStatusValue(currentStatus, true) || 'ORDER'
    if(current === 'CANCELED') return ['FILLED', 'ORDER']
    if(current === 'FILLED') return ['CANCELED', 'ORDER']
    return ['FILLED', 'CANCELED']
}

function getFilteredDatasourceForCurrentView() {
    if(!isOrderWorkspaceMode()) return salesListingDatasource
    return salesListingDatasource.filter((row) => normalizeOrderStatusValue(row?.saleentry?.moredata, true) === orderViewStatusFilter)
}

function renderCurrentSalesDatasource() {
    resolvePagination(getFilteredDatasourceForCurrentView(), onsalesTableDataSignal)
}

function configureOrderWorkspaceUi() {
    if(!isOrderWorkspaceMode()) return

    const title = document.querySelector('.page-title span')
    if(title) title.textContent = 'ORDER'

    const salesTab = document.querySelector("li[name='salesform'] p")
    if(salesTab) salesTab.textContent = 'Post-Order'

    const viewTab = document.querySelector("li[name='salesview'] p")
    if(viewTab) viewTab.textContent = 'View Order'

    const billsTab = document.querySelector("li[name='salesbillsview']")
    if(billsTab) billsTab.classList.add('hidden')

    const submitBtn = did('submit')
    if(submitBtn) submitBtn.classList.add('hidden')

    const billBtn = did('bill')
    if(billBtn){
        const textNode = billBtn.querySelector('span:last-child')
        if(textNode) textNode.textContent = 'Post-Order'
        billBtn.classList.remove('from-emerald-400', 'via-emerald-500')
        billBtn.classList.add('from-blue-400', 'via-blue-500')
    }

    const billRefInput = did('billreferencecode')
    if(billRefInput?.closest('.flex.items-center.gap-3.m-5.flex-wrap')){
        billRefInput.closest('.flex.items-center.gap-3.m-5.flex-wrap').classList.add('hidden')
    }

    const applyTo = did('applyto')
    if(applyTo?.closest('.form-group')) applyTo.closest('.form-group').classList.remove('hidden')

    const paymentMethod = did('paymentmethod')
    if(paymentMethod?.closest('.form-group')) paymentMethod.closest('.form-group').classList.add('hidden')
    if(paymentMethod) paymentMethod.value = ''
    if(did('bankdetails')) did('bankdetails').innerHTML = ''
    if(did('amountpaidcontainer')) did('amountpaidcontainer').classList.add('hidden')
    if(did('amountpaid')){
        did('amountpaid').value = ''
        did('amountpaid').setAttribute('disabled', 'disabled')
    }

    const ownerLabel = did('ownercontainer')?.querySelector('label')
    if(ownerLabel) ownerLabel.textContent = 'Order Details'

    const commentsLabel = did('description')?.closest('.form-group')?.querySelector('label')
    if(commentsLabel) commentsLabel.textContent = 'Comments'

    relaxOrderItemInputs()
}

function configureBillsWorkspaceUi() {
    if(!isBillsWorkspaceMode()) return

    const title = document.querySelector('.page-title span')
    if(title) title.textContent = 'BILLS'

    const salesTab = document.querySelector("li[name='salesform']")
    if(salesTab){
        salesTab.classList.remove('hidden')
        salesTab.classList.add('!text-blue-600', 'active')
        const tabText = salesTab.querySelector('p')
        if(tabText) tabText.textContent = 'Post-Bill'
    }

    const viewTab = document.querySelector("li[name='salesview']")
    if(viewTab) viewTab.classList.add('hidden')

    const billsTab = document.querySelector("li[name='salesbillsview']")
    if(billsTab){
        billsTab.classList.remove('hidden')
        billsTab.classList.remove('!text-blue-600', 'active')
        const tabText = billsTab.querySelector('p')
        if(tabText) tabText.textContent = 'View Bills'
    }

    const splitBillTab = document.querySelector("li[name='splitbillview']")
    if(splitBillTab){
        splitBillTab.classList.remove('hidden')
        splitBillTab.classList.remove('!text-blue-600', 'active')
    }

    const mergeBillTab = document.querySelector("li[name='mergebillview']")
    if(mergeBillTab){
        mergeBillTab.classList.remove('hidden')
        mergeBillTab.classList.remove('!text-blue-600', 'active')
    }

    if(did('salesform')) did('salesform').classList.remove('hidden')
    if(did('salesview')) did('salesview').classList.add('hidden')
    if(did('salesbillsview')) did('salesbillsview').classList.add('hidden')
    if(did('splitbillview')) did('splitbillview').classList.add('hidden')
    if(did('mergebillview')) did('mergebillview').classList.add('hidden')

    const paymentMethod = did('paymentmethod')
    if(paymentMethod?.closest('.form-group')) paymentMethod.closest('.form-group').classList.add('hidden')
    if(paymentMethod) paymentMethod.value = ''
    if(did('bankdetails')) did('bankdetails').innerHTML = ''

    if(did('amountpaidcontainer')) did('amountpaidcontainer').classList.add('hidden')
    if(did('amountpaid')){
        did('amountpaid').value = ''
        did('amountpaid').setAttribute('disabled', 'disabled')
    }

    const submitBtn = did('submit')
    if(submitBtn) submitBtn.classList.add('hidden')

    const billBtn = did('bill')
    if(billBtn){
        billBtn.classList.remove('hidden')
        const textNode = billBtn.querySelector('span:last-child')
        if(textNode) textNode.textContent = 'Post-Bill'
    }
}

function relaxOrderItemInputs() {
    return
}

function setSalesLoadingStatus(message = '', hide = false) {
    const loading = did('loading')
    if(!loading) return
    loading.innerHTML = message || ''
    if(hide) loading.classList.add('hidden')
    else loading.classList.remove('hidden')
}

function bindSalesEventOnce(selector, eventName, handler, key = '') {
    const element = typeof selector === 'string' ? document.querySelector(selector) : selector
    if(!element) return
    const boundKey = key || `${eventName}`
    const datasetKey = `bound${boundKey.replace(/[^a-z0-9]/gi, '')}`
    if(element.dataset[datasetKey]) return
    element.addEventListener(eventName, handler)
    element.dataset[datasetKey] = '1'
}

async function preloadSalesCoreData() {
    await Promise.allSettled([
        hemsdepartment()
    ])
}

async function ensureSalesUsersLoaded() {
    if(salesLazyLoadState.usersLoaded) return true
    if(salesLazyLoadState.usersLoading) return salesLazyLoadState.usersLoading
    salesLazyLoadState.usersLoading = getAllUsers('user', { lightweight: true })
        .then(() => {
            salesLazyLoadState.usersLoaded = true
            return true
        })
        .finally(() => {
            salesLazyLoadState.usersLoading = null
        })
    return salesLazyLoadState.usersLoading
}

async function ensureSalesTableNumbersLoaded() {
    const salespoint = String(did('salespointname')?.value || '')
    if(!isTableServiceDepartment(salespoint)) return false
    if(salesLazyLoadState.tableNumbersLoaded) return true
    if(salesLazyLoadState.tableNumbersLoading) return salesLazyLoadState.tableNumbersLoading
    salesLazyLoadState.tableNumbersLoading = fetchtablenumber({ lightweight: true })
        .then(() => {
            salesLazyLoadState.tableNumbersLoaded = true
            return true
        })
        .finally(() => {
            salesLazyLoadState.tableNumbersLoading = null
        })
    return salesLazyLoadState.tableNumbersLoading
}

async function ensureSalesViewDataLoaded() {
    if(salesLazyLoadState.salesViewLoaded || salesLazyLoadState.salesViewLoading) return
    salesLazyLoadState.salesViewLoading = true
    setSalesLoadingStatus(isOrderWorkspaceMode() ? 'Orders loading...' : 'Sales view loading...')
    try {
        await Promise.allSettled([
            ensureSalesUsersLoaded(),
            fetchsales(null, { useInitialWindow: true, quietEmpty: true, lightweight: true })
        ])
        salesLazyLoadState.salesViewLoaded = true
    } finally {
        salesLazyLoadState.salesViewLoading = false
        setSalesLoadingStatus('Form ready')
        setTimeout(() => setSalesLoadingStatus('', true), 500)
    }
}

async function runSalesDeferredLoad(pendingOrderToBillData = null) {
    const deferredTasks = []
    if(isBillsWorkspaceMode() && !pendingOrderToBillData) {
        setSalesLoadingStatus('Bills loading...')
        deferredTasks.push(resolveBillDeletePermission())
        deferredTasks.push(fetchsalesbills('', null, { useInitialWindow: true, lightweight: true }))
    }
    if(isBillsWorkspaceMode() && typeof splitbillActive === 'function') deferredTasks.push(splitbillActive())
    if(isBillsWorkspaceMode() && typeof mergebillActive === 'function') deferredTasks.push(mergebillActive())
    await Promise.allSettled(deferredTasks)
    setSalesLoadingStatus('Form ready')
    setTimeout(() => setSalesLoadingStatus('', true), 500)
}

async function salesActive() {
    configureOrderWorkspaceUi()
    configureBillsWorkspaceUi()
    await preloadSalesCoreData()
    const form = document.querySelector('#salesform')
    if(form?.querySelector('#submit') && !isOrderWorkspaceMode() && !isBillsWorkspaceMode()) bindSalesEventOnce(form.querySelector('#submit'), 'click', () => salesFormSubmitHandler('', form.querySelector('#submit')), 'submit')
    if(form?.querySelector('#bill')) bindSalesEventOnce(form.querySelector('#bill'), 'click', () => salesFormSubmitHandler(isOrderWorkspaceMode() ? 'ORDER' : 'BILL', form.querySelector('#bill')), 'bill')
    salesInventoryDatasource = []
    salesListingDatasource = []
    salesLazyLoadState.splitBillsLoaded = false
    salesLazyLoadState.splitBillsLoading = false
    salesLazyLoadState.mergeBillsLoaded = false
    salesLazyLoadState.mergeBillsLoading = false
    salesLazyLoadState.salesViewLoaded = false
    salesLazyLoadState.salesViewLoading = false
    salesLazyLoadState.usersLoaded = false
    salesLazyLoadState.usersLoading = null
    salesLazyLoadState.tableNumbersLoaded = false
    salesLazyLoadState.tableNumbersLoading = null
    removeMainStoreFromPosSalespointLists()
    syncSalesViewFilterSalespointOptions()
    syncSalesBillFilterSalespointOptions()
    bindSalesEventOnce('#salesviewsubmit', 'click', () => fetchsalesviewreport(), 'salesviewsubmit')
    bindSalesEventOnce('#ordervieworder', 'click', () => setOrderViewStatusFilter('ORDER'), 'ordervieworder')
    bindSalesEventOnce('#orderviewcanceled', 'click', () => setOrderViewStatusFilter('CANCELED'), 'orderviewcanceled')
    bindSalesEventOnce('#orderviewfilled', 'click', () => setOrderViewStatusFilter('FILLED'), 'orderviewfilled')
    document.querySelectorAll("li[name='salesview']").forEach((tab, index) => {
        bindSalesEventOnce(tab, 'click', () => ensureSalesViewDataLoaded(), `salesviewlazyload${index}`)
    })
    bindSalesEventOnce('#salespointname', 'change', () => {
        salesLazyLoadState.salesViewLoaded = false
        handlesalesdepartment()
    }, 'salespointname')
    bindSalesEventOnce('#applyto', 'change', () => handlesalesapplyto(), 'applyto')
    bindSalesEventOnce('#owner1', 'change', () => handleSalesOwnerSelectionChange(), 'owner1')
    bindSalesEventOnce('#pmownerselect', 'change', () => handleSalesOwnerSelectionChange(), 'pmownerselect')
    bindSalesEventOnce('#paymentmethod', 'click', checkotherbankdetails, 'paymentmethodclick')
    bindSalesEventOnce('#paymentmethod', 'change', () => {
        checkotherbankdetails()
        renderSalesTotalSummary(Number(did('totalamount')?.value || 0))
    }, 'paymentmethodchange')
    bindSalesEventOnce('#amountpaid', 'input', () => {
        const applyto = String(did('applyto')?.value || '').trim().toUpperCase()
        if(isOrderWorkspaceMode() || isBillsWorkspaceMode() || !applyto.includes('PM')) return
        if(Number(did('amountpaid')?.value || 0) > 0){
            did('amountpaid').value = ''
            notification('For PM, leave Amount Paid empty. Charge will go to PM folio.', 0)
        }
    }, 'amountpaid')
    bindSalesEventOnce('#billreferencecode', 'input', () => handleSalesBillReferenceInput(), 'billreferencecodeinput')
    bindSalesEventOnce('#billreferencecode', 'keydown', (event) => {
        if(event.key === 'Enter'){
            event.preventDefault()
            const reference = did('billreferencecode').value.trim()
            if(reference) fetchsalesbills(reference)
        }
    }, 'billreferencecodekeydown')
    bindSalesEventOnce('#retrievebillfromform', 'click', () => {
        const reference = (did('billreferencecode')?.value || '').trim()
        if(!reference) return notification('Enter bill reference to retrieve', 0)
        fetchsalesbills(reference)
    }, 'retrievebillfromform')
    bindSalesEventOnce('#retrievebilllist', 'click', () => fetchsalesbills(), 'retrievebilllist')
    bindSalesEventOnce('#clearbillfilters', 'click', () => clearSalesBillFilters(), 'clearbillfilters')
    bindSalesEventOnce('#billfilterreference', 'input', () => applySalesBillFilters(), 'billfilterreference')
    bindSalesEventOnce('#billfilterdatefrom', 'change', () => applySalesBillFilters(), 'billfilterdatefrom')
    bindSalesEventOnce('#billfilterdateto', 'change', () => applySalesBillFilters(), 'billfilterdateto')
    bindSalesEventOnce('#billfiltersalespoint', 'change', () => applySalesBillFilters(), 'billfiltersalespoint')
    bindSalesEventOnce("li[name='splitbillview']", 'click', async () => {
        if(!isBillsWorkspaceMode() || salesLazyLoadState.splitBillsLoaded || salesLazyLoadState.splitBillsLoading || typeof fetchSplitBills !== 'function') return
        salesLazyLoadState.splitBillsLoading = true
        try {
            const attempted = await fetchSplitBills({ useInitialWindow: true, lightweight: true, silentEmpty: true })
            if(attempted !== false) salesLazyLoadState.splitBillsLoaded = true
        } finally {
            salesLazyLoadState.splitBillsLoading = false
        }
    }, 'splitbillviewlazyload')
    bindSalesEventOnce("li[name='mergebillview']", 'click', async () => {
        if(!isBillsWorkspaceMode() || salesLazyLoadState.mergeBillsLoaded || salesLazyLoadState.mergeBillsLoading || typeof fetchMergeBills !== 'function') return
        salesLazyLoadState.mergeBillsLoading = true
        try {
            const attempted = await fetchMergeBills({ useInitialWindow: true, lightweight: true, silentEmpty: true })
            if(attempted !== false) salesLazyLoadState.mergeBillsLoaded = true
        } finally {
            salesLazyLoadState.mergeBillsLoading = false
        }
    }, 'mergebillviewlazyload')
    // if(document.querySelector('#owner1'))document.querySelector('#owner1').addEventListener('change', e=>handlesalesapplyto(/))
    const pendingOrderToBillData = sessionStorage.getItem('pendingOrderToBillData')
    setSalesLoadingStatus('Preparing sales form...')
    if(!(isBillsWorkspaceMode() && pendingOrderToBillData)) await handlesalesdepartment(default_department)
    removeMainStoreFromPosSalespointLists()
    runSalesDeferredLoad(pendingOrderToBillData)
    if(isBillsWorkspaceMode() && pendingOrderToBillData){
        sessionStorage.removeItem('pendingOrderToBillData')
        try{
            const parsed = JSON.parse(pendingOrderToBillData)
            if(parsed && typeof parsed === 'object'){
                const loaded = await composeOrderToBill(parsed)
                if(loaded) notification('Order loaded to bill with stock checks', 1)
            }
        }catch(error){
            console.error('Order to bill handoff failed:', error)
            notification('Unable to load order into bill. Please try again.', 0)
        }
    }
    const pendingSalesBillData = sessionStorage.getItem('pendingSalesBillData')
    const pendingSalesBillReference = sessionStorage.getItem('pendingSalesBillReference')
    if(!isOrderWorkspaceMode() && !isBillsWorkspaceMode() && (pendingSalesBillData || pendingSalesBillReference)){
        sessionStorage.removeItem('pendingSalesBillData')
        sessionStorage.removeItem('pendingSalesBillReference')
        let loaded = false
        if(pendingSalesBillData){
            try{
                const parsed = JSON.parse(pendingSalesBillData)
                if(parsed && typeof parsed === 'object'){
                    await loadSalesBillIntoForm(parsed)
                    loaded = true
                }
            }catch(_){}
        }
        if(!loaded && pendingSalesBillReference){
            await fetchsalesbills(pendingSalesBillReference)
        }
        openSalesFormTab()
    }
    syncPmPaymentUi()
    if(isOrderWorkspaceMode()) setOrderViewStatusFilter(orderViewStatusFilter)
    // await salesitempop()
}

function setOrderViewStatusFilter(status = 'ORDER') {
    if(!isOrderWorkspaceMode()) return
    orderViewStatusFilter = normalizeOrderStatusValue(status, true) || 'ORDER'
    const idMap = {
        ORDER: 'ordervieworder',
        CANCELED: 'orderviewcanceled',
        FILLED: 'orderviewfilled'
    }
    Object.keys(idMap).forEach((key) => {
        const button = did(idMap[key])
        if(!button) return
        const label = button.querySelector('p')
        button.classList.remove('!text-blue-600', 'active')
        if(label) label.classList.remove('!text-blue-600', 'active')
        if(key === orderViewStatusFilter){
            button.classList.add('!text-blue-600', 'active')
            if(label) label.classList.add('!text-blue-600', 'active')
        }
    })
    renderCurrentSalesDatasource()
}

async function resolveBillDeletePermission() {
    if(currentUserIsSuperAdmin()){
        canDeleteBillsInView = true
        return true
    }
    try{
        const profile = await fetchCurrentUserProfileCached()
        if(!profile?.status){
            canDeleteBillsInView = false
            return false
        }
        const granted = profile.grantedPermissions instanceof Set
            ? profile.grantedPermissions
            : buildGrantedPermissionSet(profile.permissions || '')
        canDeleteBillsInView = granted.has('*') || granted.has(normalizePermissionName('DELETE BILL'))
        return canDeleteBillsInView
    } catch (error) {
        console.log(error)
        canDeleteBillsInView = false
        return false
    }
}

async function validateRestrictedSalesPaymentPermission() {
    if(isOrderWorkspaceMode() || isBillsWorkspaceMode()) return true
    const method = String(did('paymentmethod')?.value || '').trim().toUpperCase()
    const requiredPermission = restrictedSalesPaymentPermissions[method]
    if(!requiredPermission) return true
    try{
        const profile = await fetchCurrentUserProfileCached()
        const granted = profile?.grantedPermissions instanceof Set
            ? profile.grantedPermissions
            : buildGrantedPermissionSet(profile?.permissions || '')
        if(granted.has('*') || granted.has(normalizePermissionName(requiredPermission))) return true
    }catch(error){
        console.error('Restricted sales payment permission check failed:', error)
    }
    notification(`You do not have permission for ${method} posting`, 0)
    return false
}

function syncSalesViewFilterSalespointOptions() {
    const source = did('salespointname')
    const target = did('salespointname2')
    if(!source || !target) return
    target.innerHTML = `<option value="">-- ALL --</option>${source.innerHTML}`
    removeMainStoreFromPosSalespointLists()
}

function syncSalesBillFilterSalespointOptions() {
    const source = did('salespointname')
    const target = did('billfiltersalespoint')
    if(!source || !target) return
    target.innerHTML = `<option value="">-- ALL --</option>${source.innerHTML}`
    removeMainStoreFromPosSalespointLists()
}

function getChairmanDiscountContext(grossTotal = null, paymentMethod = '') {
    const normalizedMethod = String(paymentMethod || did('paymentmethod')?.value || '').trim().toUpperCase()
    const gross = Number.isFinite(Number(grossTotal)) ? Number(grossTotal) : Number(did('totalamount')?.value || 0)
    const applies = !isOrderWorkspaceMode() && !isBillsWorkspaceMode() && normalizedMethod === 'CHAIRMAN DISCOUNT'
    const discountAmount = applies ? (gross * CHAIRMAN_DISCOUNT_RATE) : 0
    const netTotal = applies ? Math.max(gross - discountAmount, 0) : gross
    return { applies, grossTotal: gross, discountAmount, netTotal }
}

function renderSalesTotalSummary(grossTotal = 0) {
    const display = did('totalamountt')
    if(!display) return
    const context = getChairmanDiscountContext(grossTotal)
    if(context.applies) {
        display.innerHTML = `
            <div class="flex flex-col text-right leading-tight">
                <span class="text-xs text-slate-700">Gross: ${formatCurrency(context.grossTotal)}</span>
                <span class="text-xs text-rose-700">Discount (50%): -${formatCurrency(context.discountAmount)}</span>
                <span class="text-xl text-[blue] font-bold">Net: ${formatCurrency(context.netTotal)}</span>
            </div>
        `
        return
    }
    display.textContent = formatCurrency(context.grossTotal)
}

function removeMainStoreFromSelect(selectEl) {
    if(!selectEl) return
    Array.from(selectEl.querySelectorAll('option')).forEach((option) => {
        const optionValue = String(option.value || '').trim().toUpperCase()
        const optionText = String(option.textContent || '').trim().toUpperCase()
        if(optionValue === 'MAIN STORE' || optionText === 'MAIN STORE') {
            option.remove()
        }
    })
}

function removeMainStoreFromPosSalespointLists() {
    removeMainStoreFromSelect(did('salespointname'))
    removeMainStoreFromSelect(did('salespointname1'))
    removeMainStoreFromSelect(did('salespointname2'))
    removeMainStoreFromSelect(did('billfiltersalespoint'))
    removeMainStoreFromSelect(did('splitbill_salespoint'))
    removeMainStoreFromSelect(did('mergebill_salespoint'))
}

function normalizeSalesTextValue(value) {
    const text = String(value ?? '').trim()
    return text && text !== '-1' && text !== '-' && text.toLowerCase() !== 'null' && text.toLowerCase() !== 'undefined' ? text : ''
}

function resolveReceiptOwnerDisplay(rows = []) {
    const sourceRows = Array.isArray(rows) ? rows : []
    if(!sourceRows.length) return '-'
    const firstRow = sourceRows[0] || {}
    const ownerCandidates = [
        firstRow.ownerdetail,
        firstRow.owner,
        firstRow.ownerid
    ]
    sourceRows.forEach((row) => ownerCandidates.push(row?.ownerdetail, row?.owner, row?.ownerid))
    const ownerValue = ownerCandidates.map(normalizeSalesTextValue).find(Boolean) || '-'
    const applyTo = String(firstRow.applyto || '').trim().toUpperCase()
    const ttype = String(firstRow.ttype || '').trim().toUpperCase()
    const isPm = applyTo.includes('PM') || ttype.includes('PM')
    if(isPm && ownerValue !== '-') return `PM ${ownerValue}`
    return ownerValue
}

function resolveOrderDetailsValue(entry = {}, details = []) {
    const candidates = [
        entry.ownerdetail,
        entry.ownerid,
        entry.owner,
        entry.roomnumber,
        entry.room,
        entry.orderdetails,
        entry.orderdetail,
        entry.order_details,
        entry.order_detail,
        entry.ordernumber,
        entry.order_number,
        entry.invoiceto,
        entry.billto
    ]
    const sourceDetails = Array.isArray(details) ? details : []
    sourceDetails.forEach((detail) => {
        candidates.push(
            detail?.ownerdetail,
            detail?.ownerid,
            detail?.owner,
            detail?.roomnumber,
            detail?.room,
            detail?.orderdetails,
            detail?.orderdetail,
            detail?.order_details,
            detail?.order_detail,
            detail?.ordernumber,
            detail?.order_number
        )
    })
    return candidates.map(normalizeSalesTextValue).find(Boolean) || ''
}

function normalizeSalesRowsForTable(data = []) {
    if(!Array.isArray(data) || !data.length) return []
    if(data[0]?.saleentry) return data

    const grouped = new Map()
    data.forEach((row) => {
        const reference = String(row.reference || '').trim()
        if(!reference) return
        if(!grouped.has(reference)){
            grouped.set(reference, {
                saleentry: {
                    reference,
                    transactiondate: row.transactiondate || '',
                    salespoint: row.salespoint || '',
                    description: row.description || '',
                    servicecharge: Number(row.totalamount || row.servicecharge || 0),
                    paymentmethod: row.paymentmethod || '',
                    applyto: row.applyto || '',
                    ownerid: row.ownerdetail ?? row.ownerid ?? row.owner ?? -1
                },
                amountreceived: Number(row.amountpaid || row.amountreceived || 0),
                saledetail: []
            })
        }
        grouped.get(reference).saledetail.push({
            itemid: row.itemid || '',
            itemname: row.itemname || row.description || '',
            itemtype: row.itemtype || row.type || row.itemclass || '',
            qty: Number(row.qty || 0),
            cost: Number(row.cost || 0),
            salespoint: row.salespoint || ''
        })
    })
    return Array.from(grouped.values())
}

function normalizeOrdersForSalesTable(data = []) {
    if(!Array.isArray(data) || !data.length) return []
    if(data[0]?.saleentry) {
        return normalizeSalesRowsForTable(data).map((entry) => {
            const orderDetails = resolveOrderDetailsValue(entry.saleentry || {}, entry.saledetail || [])
            if(orderDetails) entry.saleentry.ownerid = orderDetails
            return entry
        })
    }

    const grouped = new Map()
    data.forEach((row) => {
        const normalizedMoredata = normalizeOrderStatusValue(row.moredata, true)
        const normalizedStatus = normalizeOrderStatusValue(row.status, false)
        const effectiveStatus = normalizedMoredata || (['ORDER', 'FILLED', 'CANCELED'].includes(normalizedStatus) ? normalizedStatus : '')
        if(!effectiveStatus) return

        const batchid = String(row.batchid || row.reference || row.id || '').trim()
        if(!batchid) return
        if(!grouped.has(batchid)){
            const owner = resolveOrderDetailsValue(row) || -1
            const normalizedOwner = (owner === '' || owner === null || owner === undefined) ? -1 : owner
            grouped.set(batchid, {
                saleentry: {
                    id: row.id || '',
                    batchid,
                    reference: String(row.reference || row.ref || row.orderref || row.id || '').trim(),
                    transactiondate: row.transactiondate || row.created_at || row.entrydate || row.datecreated || '',
                    salespoint: row.salespoint || '',
                    description: row.description || '',
                    servicecharge: Number(row.totalamount || row.amount || 0),
                    paymentmethod: row.paymentmethod || 'ORDER',
                    applyto: row.applyto || 'OTHERS',
                    moredata: effectiveStatus,
                    roomnumber: row.roomnumber || row.room || '',
                    ownerid: normalizedOwner,
                    ttype: 'ORDER'
                },
                amountreceived: Number(row.amountpaid || row.amountreceived || 0),
                saledetail: []
            })
        }

        const group = grouped.get(batchid)
        const rowOrderDetails = resolveOrderDetailsValue(row)
        if(rowOrderDetails && !normalizeSalesTextValue(group.saleentry.ownerid)){
            group.saleentry.ownerid = rowOrderDetails
        }
        group.saledetail.push({
            itemid: row.itemid || '',
            itemname: row.itemname || '',
            itemtype: row.itemtype || row.type || row.itemclass || '',
            qty: Number(row.qty || 0),
            cost: Number(row.cost || 0),
            description: row.description || '',
            salespoint: row.salespoint || ''
        })
    })

    return Array.from(grouped.values()).filter((row) => row.saleentry.reference || row.saleentry.description)
}

function setSalesActionButtonsState(disabled = false) {
    const submitBtn = did('submit')
    const billBtn = did('bill')
    ;[submitBtn, billBtn].forEach((btn) => {
        if(!btn) return
        btn.disabled = disabled
        if(disabled) btn.classList.add('opacity-70', 'cursor-not-allowed')
        else btn.classList.remove('opacity-70', 'cursor-not-allowed')
    })
}

function handleSalesBillReferenceInput() {
    if(isPopulatingSalesBill) return
    if(salesBillRefDebounceTimer) clearTimeout(salesBillRefDebounceTimer)
    salesBillRefDebounceTimer = setTimeout(() => {
        const reference = (did('billreferencecode')?.value || '').trim()
        if(reference) fetchsalesbills(reference)
    }, 600)
}

function normalizeSalesBillRows(data = []) {
    if(!Array.isArray(data) || !data.length) return []

    if(data[0]?.saleentry){
        return data.map((entry) => {
            const saleEntry = entry.saleentry || {}
            const details = Array.isArray(entry.saledetail) ? entry.saledetail : []
            const detailTotal = details.reduce((total, current) => total + (Number(current.qty || 0) * Number(current.cost || 0)), 0)
            return {
                id: saleEntry.id || '',
                batchid: saleEntry.batchid || '',
                reference: String(saleEntry.reference || '').trim(),
                transactiondate: saleEntry.transactiondate || '',
                salespoint: saleEntry.salespoint || '',
                description: saleEntry.description || (details[0]?.description || ''),
                paymentmethod: saleEntry.paymentmethod || '',
                totalamount: Number(saleEntry.totalamount || saleEntry.servicecharge || detailTotal || 0),
                amountpaid: Number(entry.amountreceived || saleEntry.amountpaid || 0),
                owner: saleEntry.ownerdetail ?? saleEntry.ownerid ?? saleEntry.owner ?? '',
                ttype: saleEntry.ttype || '',
                items: details.map((item) => ({...item}))
            }
        }).filter((entry) => entry.reference)
    }

    const grouped = doBatch(data)
    return grouped.map((batch) => {
        const rows = Array.isArray(batch.data) ? batch.data : []
        const first = rows[0] || {}
        const lineTotal = rows.reduce((total, row) => total + (Number(row.qty || 0) * Number(row.cost || 0)), 0)
        return {
            id: first.id || '',
            batchid: batch.batchid || first.batchid || '',
            reference: String(first.reference || '').trim(),
            transactiondate: first.transactiondate || '',
            salespoint: first.salespoint || '',
            description: first.description || '',
            paymentmethod: first.paymentmethod || '',
            totalamount: Number(first.totalamount || first.servicecharge || lineTotal || 0),
            amountpaid: Number(first.amountpaid || first.amountreceived || 0),
            owner: first.ownerdetail ?? first.owner ?? first.ownerid ?? '',
            ttype: first.ttype || '',
            items: rows.map((row) => ({...row}))
        }
    }).filter((entry) => entry.reference)
}

async function fetchsalesbills(reference = '', triggerButton = null, options = {}) {
    const { useInitialWindow = false, lightweight = false } = options || {}
    const cleanedReference = String(reference || '').trim()
    const startdate = String(did('billfilterdatefrom')?.value || '').trim()
    const enddate = String(did('billfilterdateto')?.value || '').trim()
    const salespoint = String(did('billfiltersalespoint')?.value || '').trim()
    let payload = null
    const initialWindowDate = new Date().toISOString().slice(0, 10)
    const initialSalespoint = String(did('salespointname')?.value || '').trim()
    if(cleanedReference || startdate || enddate || salespoint || useInitialWindow){
        payload = new FormData()
        if(cleanedReference) payload.append('reference', cleanedReference)
        if(startdate) payload.append('startdate', startdate)
        else if(useInitialWindow) payload.append('startdate', initialWindowDate)
        if(enddate) payload.append('enddate', enddate)
        else if(useInitialWindow) payload.append('enddate', initialWindowDate)
        if(salespoint) payload.append('salespoint', salespoint)
        else if(useInitialWindow && initialSalespoint) payload.append('salespoint', initialSalespoint)
    }

    recordSalesFetchDebug('fetchsalesbills', { cleanedReference, useInitialWindow, lightweight, salespoint: salespoint || initialSalespoint || '' })
    const request = await httpRequest2('../controllers/fetchsalesbillsonly.php', payload, triggerButton, 'json', { lightweight })
    if(!request.status){
        if(cleanedReference) notification(request.message || 'No bill found for supplied reference', 0)
        salesBillDatasource = cleanedReference ? [] : salesBillDatasource
        if(cleanedReference) renderSalesBillsTable([])
        return
    }

    salesBillDatasource = normalizeSalesBillRows(request.data)
    if(cleanedReference){
        const matched = salesBillDatasource.find((bill) => String(bill.reference).toLowerCase() === cleanedReference.toLowerCase())
            || salesBillDatasource[0]
        if(!matched) return notification('No bill found for supplied reference', 0)
        await loadSalesBillIntoForm(matched)
        notification('Bill loaded successfully', 1)
    }

    applySalesBillFilters()
}

function renderSalesBillsTable(rows = []) {
    const holder = did('billtabledata')
    if(!holder) return
    if(!rows.length){
        holder.innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No bills retrieved</td></tr>`
        return
    }
    const deleteActionButton = (item) => canDeleteBillsInView
        ? `<button title="Delete" type="button" onclick="removeBillEntry('${String(item.batchid || item.reference || '').replace(/'/g, "\\'")}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs">delete</button>`
        : ''
    holder.innerHTML = rows.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>
                <div class="flex items-center gap-2">
                    <button title="Edit" type="button" onclick="editBillEntryByBatch('${String(item.batchid || item.reference || '').replace(/'/g, "\\'")}')" class="material-symbols-outlined rounded-full bg-amber-500 h-8 w-8 text-white drop-shadow-md text-xs">edit</button>
                    <button title="Retrieve" type="button" onclick="retrieveBillToSalesByBatch('${String(item.batchid || item.reference || '').replace(/'/g, "\\'")}')" class="material-symbols-outlined rounded-full bg-blue-500 h-8 w-8 text-white drop-shadow-md text-xs">download</button>
                    <button title="Transfer Bill" type="button" onclick="openBillTransferModal('${String(item.reference || '').replace(/'/g, "\\'")}', '${String(item.salespoint || '').replace(/'/g, "\\'")}', 'fetchsalesbills')" class="material-symbols-outlined rounded-full bg-violet-600 h-8 w-8 text-white drop-shadow-md text-xs">swap_horiz</button>
                    <button title="Print" type="button" onclick="printBillEntryByBatch('${String(item.batchid || item.reference || '').replace(/'/g, "\\'")}')" class="material-symbols-outlined rounded-full bg-emerald-600 h-8 w-8 text-white drop-shadow-md text-xs">print</button>
                    ${deleteActionButton(item)}
                </div>
            </td>
            <td>${item.reference || ''}</td>
            <td>${item.transactiondate ? specialformatDateTime(item.transactiondate) : ''}</td>
            <td>${item.salespoint || ''}</td>
            <td>${renderBillItemsMiniTable(item.items || [])}</td>
            <td>${formatCurrency(item.totalamount || 0)}</td>
        </tr>
    `).join('')
}

async function editBillEntryByBatch(batchKey = '') {
    const bill = findSalesBillEntryByBatchOrReference(batchKey)
    if(!bill) return notification('Bill not found', 0)
    openSalesFormTab()
    await loadSalesBillIntoForm(bill)
    notification('Bill loaded in bill form for editing', 1)
}

function retrieveBillToSalesByBatch(batchKey = '') {
    const bill = findSalesBillEntryByBatchOrReference(batchKey)
    if(!bill) return notification('Bill not found', 0)
    sessionStorage.setItem('pendingSalesBillData', JSON.stringify(bill))
    sessionStorage.setItem('pendingSalesBillReference', String(bill.reference || ''))
    const salesNav = did('sales')
    if(salesNav){
        salesNav.click()
        return
    }
    window.location.href = 'index.php?r=sales'
}

function buildReceiptRowsFromBillEntry(bill = {}) {
    const details = Array.isArray(bill.items) ? bill.items : []
    const ownerValue = String(bill.ownerdetail ?? bill.owner ?? bill.ownerid ?? '').trim()
    const commentValue = String(bill.description || details.find((item) => String(item.description || '').trim())?.description || '').trim()
    const common = {
        reference: bill.reference || '',
        ownerdetail: ownerValue || '-1',
        owner: ownerValue || '-1',
        ownerid: ownerValue || '-1',
        totalamount: Number(bill.totalamount || 0),
        amountpaid: Number(bill.amountpaid || bill.amountreceived || 0),
        amountreceived: Number(bill.amountpaid || bill.amountreceived || 0),
        paymentmethod: bill.paymentmethod || '',
        transactiondate: bill.transactiondate || '',
        description: commentValue,
        comment: commentValue,
        moredata: bill.moredata || '',
        moredetails: bill.moredata || '',
        status: bill.moredata || '',
        ttype: bill.ttype || 'BILL'
    }
    if(!details.length) return [common]
    return details.map((detail) => ({
        ...common,
        itemid: detail.itemid || '',
        itemname: detail.itemname || '',
        qty: Number(detail.qty || 0),
        cost: Number(detail.cost || 0),
        description: commentValue || detail.description || '',
        comment: commentValue || detail.description || ''
    }))
}

function printBillEntryByBatch(batchKey = '') {
    const bill = findSalesBillEntryByBatchOrReference(batchKey)
    if(!bill) return notification('Bill not found', 0)
    return printsalesreceiptsales(bill.reference, '', 'fetchsalesbillsonly.php', false, true, false, buildReceiptRowsFromBillEntry(bill))
}

function applySalesBillFilters() {
    const ref = String(did('billfilterreference')?.value || '').trim().toLowerCase()
    const from = did('billfilterdatefrom')?.value || ''
    const to = did('billfilterdateto')?.value || ''
    const salespoint = String(did('billfiltersalespoint')?.value || '').trim().toLowerCase()

    salesBillFilteredDatasource = salesBillDatasource.filter((bill) => {
        const billRef = String(bill.reference || '').toLowerCase()
        const billDate = String(bill.transactiondate || '').slice(0, 10)
        const billSalesPoint = String(bill.salespoint || '').trim().toLowerCase()
        const refPass = !ref || billRef.includes(ref)
        const fromPass = !from || (billDate && billDate >= from)
        const toPass = !to || (billDate && billDate <= to)
        const salespointPass = !salespoint || billSalesPoint === salespoint
        return refPass && fromPass && toPass && salespointPass
    })

    renderSalesBillsTable(salesBillFilteredDatasource)
}

function clearSalesBillFilters() {
    if(did('billfilterreference')) did('billfilterreference').value = ''
    if(did('billfilterdatefrom')) did('billfilterdatefrom').value = ''
    if(did('billfilterdateto')) did('billfilterdateto').value = ''
    if(did('billfiltersalespoint')) did('billfiltersalespoint').value = ''
    applySalesBillFilters()
}

function openSalesFormTab() {
    const salesTabTrigger = document.querySelector("li[name='salesform']")
    if(salesTabTrigger) runoptioner(salesTabTrigger)
}

function findOrderEntryByBatchOrReference(key = '') {
    const cleaned = String(key || '').trim()
    if(!cleaned) return null
    return salesListingDatasource.find((entry) => {
        const saleEntry = entry?.saleentry || {}
        return String(saleEntry.batchid || '').trim() === cleaned
            || String(saleEntry.reference || '').trim() === cleaned
    }) || null
}

async function retrieveSalesBillToForm(reference, fromEdit = false) {
    const cleanedReference = String(reference || '').trim()
    if(!cleanedReference) return notification('Bill reference is required', 0)
    if(isBillsWorkspaceMode()){
        sessionStorage.setItem('pendingSalesBillReference', cleanedReference)
        window.location.href = 'index.php?r=sales'
        return
    }

    let bill = salesBillDatasource.find((item) => String(item.reference).toLowerCase() === cleanedReference.toLowerCase())
    if(!bill){
        await fetchsalesbills(cleanedReference)
        bill = salesBillDatasource.find((item) => String(item.reference).toLowerCase() === cleanedReference.toLowerCase())
    }
    if(!bill) return notification('Bill not found', 0)

    await loadSalesBillIntoForm(bill)
    openSalesFormTab()
    notification(fromEdit ? 'Bill loaded to sales for editing' : 'Bill loaded to sales form', 1)
}

async function loadSalesBillIntoForm(bill) {
    if(!bill) return
    isPopulatingSalesBill = true
    try {
        salesid = bill.id || ''
        sourceSalesBillContext = {
            id: bill.id || '',
            batchid: bill.batchid || '',
            reference: bill.reference || ''
        }
        if(did('billreferencecode')) did('billreferencecode').value = bill.reference || ''
        if(did('salespointname') && bill.salespoint){
            did('salespointname').value = bill.salespoint
            await handlesalesdepartment()
        }

        if(did('transactiondate')) did('transactiondate').value = String(bill.transactiondate || '').slice(0, 10)
        if(did('paymentmethod')) did('paymentmethod').value = bill.paymentmethod || ''
        if(did('amountpaid')) did('amountpaid').value = Number(bill.amountpaid || 0)

        if(did('applyto')){
            if(String(bill.ttype || '').toUpperCase() === 'ROOMS') did('applyto').value = 'ROOMS'
            else if(String(bill.ttype || '').toUpperCase().includes('COST')) did('applyto').value = 'COST CENTER'
            else if(String(bill.ttype || '').toUpperCase().includes('PM')) did('applyto').value = 'PM'
            else did('applyto').value = 'OTHERS'
            await handlesalesapplyto()
        }

        if(did('description')) did('description').value = normalizeDescriptionByApplyTo(
            bill.description || '',
            did('applyto')?.value || ''
        )

        const ownerValue = String(bill.ownerdetail ?? bill.owner ?? bill.ownerid ?? '')
        if(did('owner1')) did('owner1').value = ownerValue
        if(did('owner')) did('owner').value = ownerValue

        const items = Array.isArray(bill.items) ? bill.items : []
        did('thetabledata').innerHTML = ''
        if(!items.length){
            emptysales()
            return
        }

        const firstRowId = '1'
        did('thetabledata').innerHTML = `
            <tr id="row-${firstRowId}">
                <td class="s/n">1</td>
                <td>
                    <label for="logoname" class="control-label hidden">Item</label>
                    <input autocomplete="off" onchange="checkdatalist(this);salesitempop(this,'${firstRowId}')" onblur="salesitempop(this,'${firstRowId}')" list="hems_itemslist" name="item" id="item-${firstRowId}" class="form-control iitem comp">
                    <input autocomplete="off" class="itemmerid hidden" id="itemer-${firstRowId}">
                    <input autocomplete="off" class="hidden" id="itemclass-${firstRowId}">
                </td>
                <td>
                    <div>
                        <p class="font-bold">Type:&nbsp;<span class="font-normal" id="type-${firstRowId}"></span></p>
                        <p class="font-bold">Unit:&nbsp;<span class="font-normal" id="unit-${firstRowId}"></span></p>
                        <p class="font-bold ${isOrderWorkspaceMode() ? 'hidden' : ''}">Stock&nbsp;Balance:&nbsp;<span class="font-normal" id="balance-${firstRowId}"></span></p>
                    </div>
                </td>
                <td>
                    <label for="logoname" class="control-label hidden">Price</label>
                    <input autocomplete="off" type="number" id="price-${firstRowId}" class="form-control comp pprice" onchange="calsaleqty('${firstRowId}')" placeholder="">
                </td>
                <td>
                    <label for="logoname" class="control-label hidden">Quantity</label>
                    <input autocomplete="off" type="number" id="qty-${firstRowId}" class="form-control comp qqty" onchange="calsaleqty('${firstRowId}')" placeholder="">
                </td>
                <td>
                    <label for="logoname" class="control-label hidden">Amount</label>
                    <input autocomplete="off" type="number" disabled id="amount-${firstRowId}" class="form-control ammount" placeholder="">
                </td>
                <td>
                    <button onclick="event.preventDefault();removesalesrow('${firstRowId}')" class="material-symbols-outlined rounded-full bg-red-500 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">remove</button>
                </td>
            </tr>
        `

        items.forEach((item, index) => {
            const rowId = index === 0 ? firstRowId : `b${index + 1}`
            if(index > 0) addsalesrow(rowId)
            if(did(`item-${rowId}`)) did(`item-${rowId}`).value = item.itemname || ''
            if(did(`itemer-${rowId}`)) did(`itemer-${rowId}`).value = item.itemid || ''
            const inventoryItem = salesInventoryDatasource.find((inv) => {
                if(String(inv?.itemid || '') && String(item?.itemid || '')) return String(inv.itemid) === String(item.itemid)
                return String(inv?.itemname || '').trim().toLowerCase() === String(item?.itemname || '').trim().toLowerCase()
            }) || {}
            const rowItemClass = item.itemclass || inventoryItem.itemclass || ''
            if(did(`itemclass-${rowId}`)) did(`itemclass-${rowId}`).value = rowItemClass
            if(did(`type-${rowId}`)) did(`type-${rowId}`).textContent = item.itemtype || item.type || ''
            if(did(`unit-${rowId}`)) did(`unit-${rowId}`).textContent = item.units || item.unit || ''
            if(did(`balance-${rowId}`)) did(`balance-${rowId}`).textContent = isNonStockItemClass(rowItemClass) ? '999999999' : Math.max(Number(item.balance || inventoryItem.balance || 0), Number(item.qty || 0), 0)
            if(did(`price-${rowId}`)) did(`price-${rowId}`).value = Number(item.cost || 0)
            if(did(`qty-${rowId}`)) did(`qty-${rowId}`).value = Number(item.qty || 0)
            if(did(`amount-${rowId}`)) did(`amount-${rowId}`).value = Number(item.cost || 0) * Number(item.qty || 0)
            calsaleqty(rowId)
        })
        runCount()
    } finally {
        isPopulatingSalesBill = false
    }
}

async function markSourceSalesBillFilled(sourceBill = null) {
    const bill = sourceBill || sourceSalesBillContext || {}
    const batchid = String(bill.batchid || '').trim()
    const reference = String(bill.reference || '').trim()
    const billKey = batchid || reference
    if(!billKey) return false

    const payload = new FormData()
    payload.append('batchid', billKey)
    payload.append('status', 'FILLED')
    if(reference) payload.append('reference', reference)

    const request = await httpRequest2('../controllers/removesalesbill.php', payload, null, 'json')
    if(request?.status) {
        salesBillDatasource = salesBillDatasource.filter((item) => String(item.batchid || item.reference || '') !== billKey)
        salesBillFilteredDatasource = salesBillFilteredDatasource.filter((item) => String(item.batchid || item.reference || '') !== billKey)
        if(typeof queueUnsettledBillsRefresh === 'function') queueUnsettledBillsRefresh()
        return true
    }

    notification(request?.message || `Sale saved, but source bill ${reference || billKey} could not be marked as filled`, 0)
    return false
}

function isTableServiceDepartment(value = '') {
    const normalized = String(value || '').toUpperCase().replace(/[^A-Z]/g, '')
    return ['RESTAURANT', 'COCKTAIL', 'COCKTAILBAR', 'POOLBAR', 'POOLPOOLBAR'].includes(normalized)
}

function checkifitisrestaurant(){
    const salespoint = String(did('salespointname')?.value || '')
    if(did('tablenumber')) did('tablenumber').value = ''
    if(isTableServiceDepartment(salespoint)){
        did('tablecheck').classList.remove('hidden')
    }else{
        did('tablecheck').classList.add('hidden')
    }
}

function hidePmOwnerBalance() {
    const balanceEl = did('pmownerbalance')
    if(!balanceEl) return
    balanceEl.classList.add('hidden')
    balanceEl.textContent = ''
}

function syncPmPaymentUi() {
    if(isOrderWorkspaceMode() || isBillsWorkspaceMode()) return
    const applyto = String(did('applyto')?.value || '').trim().toUpperCase()
    const amountInput = did('amountpaid')
    const hintEl = did('pmamountpaidhint')
    const paymentMethodEl = did('paymentmethod')
    const isPm = applyto.includes('PM')
    if(hintEl) hintEl.classList.toggle('hidden', !isPm)
    if(!amountInput) return
    if(isPm) {
        amountInput.value = ''
        amountInput.setAttribute('disabled', 'disabled')
        if(paymentMethodEl) paymentMethodEl.value = ''
        if(did('bankdetails')) did('bankdetails').innerHTML = ''
        return
    }
    amountInput.removeAttribute('disabled')
}

function getPmGuestNameFromReservationRow(row = null) {
    if(!row) return 'Unknown Guest'
    const guest = row?.roomgeustrow?.[0]?.guest1?.[0]
    if(guest) {
        const fullName = `${String(guest.firstname || '').trim()} ${String(guest.lastname || '').trim()}`.trim()
        if(fullName) return fullName
    }
    return String(row?.reservations?.reference || row?.reservations?.id || 'Unknown Guest')
}

function getPmReservationOptionValue(row = null) {
    if(!row?.reservations) return ''
    const reservationId = String(row.reservations.id || '').trim()
    if(!reservationId) return ''
    const guestName = getPmGuestNameFromReservationRow(row)
    const fallbackBalance = Number(row.reservations.totalamount || 0) - Number(row.reservations.amountpaid || 0)
    const balanceText = formatNumber(Number.isFinite(fallbackBalance) ? fallbackBalance : 0)
    return `${guestName} | Bal: ${balanceText} | Ref: ${row.reservations.reference || '-'}`
}

function populatePmReservationOwnerDatalist(rows = []) {
    const list = did('hems_pm_reservation_owner')
    if(!list) return
    list.innerHTML = rows.map((row) => {
        const optionValue = getPmReservationOptionValue(row)
        const reservationId = String(row?.reservations?.id || '').trim()
        if(!optionValue || !reservationId) return ''
        return `<option value="${optionValue.replace(/"/g, '&quot;')}">${reservationId}</option>`
    }).join('')
}

function populatePmReservationOwnerSelect(rows = []) {
    const select = did('pmownerselect')
    if(!select) return
    select.innerHTML = `<option value="">-- Select Posting Master --</option>${
        rows.map((row) => {
            const reservationId = String(row?.reservations?.id || '').trim()
            if(!reservationId) return ''
            const roomNumber = String(row?.roomgeustrow?.[0]?.roomdata?.roomnumber || '').trim()
            const guestName = getPmGuestNameFromReservationRow(row)
            const label = `${roomNumber || '-'} - ${guestName}`
            return `<option value="${reservationId.replace(/"/g, '&quot;')}">${label.replace(/</g, '&lt;')}</option>`
        }).join('')
    }`
}

async function fetchPmReservationOwnerOptions() {
    if(salesAuxiliaryLoadState.pmOwners) return salesAuxiliaryLoadState.pmOwners
    salesAuxiliaryLoadState.pmOwners = (async () => {
    const payload = new FormData()
    const now = new Date()
    const previousYear = now.getFullYear() - 1
    const nextYear = now.getFullYear() + 1
    payload.append('startdate', `${previousYear}-01-01`)
    payload.append('enddate', `${nextYear}-12-31`)
    const request = await httpRequest2('../controllers/fetchpmreservationsbyfilter', payload, null, 'json', { lightweight: true })
    if(!request?.status || !Array.isArray(request.data)) {
        pmReservationOwnerRows = []
        populatePmReservationOwnerDatalist([])
        populatePmReservationOwnerSelect([])
        notification(request?.message || 'Unable to load PM owners', 0)
        return []
    }
    pmReservationOwnerRows = request.data
    populatePmReservationOwnerDatalist(pmReservationOwnerRows)
    populatePmReservationOwnerSelect(pmReservationOwnerRows)
    return pmReservationOwnerRows
    })()
    return salesAuxiliaryLoadState.pmOwners
}

function getSelectedPmReservationId() {
    const selectValue = String(did('pmownerselect')?.value || '').trim()
    if(selectValue) return selectValue
    const ownerHidden = String(did('owner')?.value || '').trim()
    if(ownerHidden && pmReservationOwnerRows.some((row) => String(row?.reservations?.id || '').trim() === ownerHidden)) return ownerHidden
    const ownerVisible = String(did('owner1')?.value || '').trim()
    if(!ownerVisible) return ''
    const list = did('hems_pm_reservation_owner')
    if(!list) return ''
    const option = Array.from(list.querySelectorAll('option')).find((entry) => String(entry.value || '').trim() === ownerVisible)
    return String(option?.textContent || '').trim()
}

function getSelectedPmReservationRow() {
    const selectedId = getSelectedPmReservationId()
    const ownerValue = String(did('owner')?.value || did('owner1')?.value || '').trim()
    return pmReservationOwnerRows.find((row) => {
        const reservationId = String(row?.reservations?.id || '').trim()
        const roomNumber = String(row?.roomgeustrow?.[0]?.roomdata?.roomnumber || '').trim()
        return (selectedId && reservationId === selectedId) || (ownerValue && roomNumber === ownerValue)
    }) || null
}

function getSelectedPmRoomNumber() {
    return String(getSelectedPmReservationRow()?.roomgeustrow?.[0]?.roomdata?.roomnumber || '').trim()
}

function buildPmDescriptionSuffix() {
    const selectedRow = getSelectedPmReservationRow()
    if(!selectedRow) return ''
    const roomNumber = String(selectedRow?.roomgeustrow?.[0]?.roomdata?.roomnumber || '').trim() || '-'
    const guestName = getPmGuestNameFromReservationRow(selectedRow) || '-'
    return `PM - ${roomNumber} - ${guestName}`
}

function normalizeDescriptionByApplyTo(baseDescription = '', applytoValue = '') {
    const normalizedApplyTo = String(applytoValue || '').trim().toUpperCase()
    const base = String(baseDescription || '').split('|||')[0].trim()
    if(normalizedApplyTo !== 'PM') return base
    const suffix = buildPmDescriptionSuffix()
    if(!suffix) return base
    return `${base} ||| ${suffix}`.trim()
}

async function fetchPmReservationBalanceByReference(reference = '') {
    const ref = String(reference || '').trim()
    if(!ref) return null
    const payload = new FormData()
    payload.append('reference', ref)
    const request = await httpRequest2('../controllers/getreservationrefbalance', payload, null, 'json')
    if(!request?.status) return null
    return Number(request.balance || request.data?.balance || 0)
}

async function showPmOwnerBalanceForSelection() {
    const balanceEl = did('pmownerbalance')
    if(!balanceEl) return
    const selectedRow = getSelectedPmReservationRow()
    if(!selectedRow?.reservations) return hidePmOwnerBalance()
    balanceEl.classList.remove('hidden')
    balanceEl.textContent = 'Loading balance...'
    const reference = String(selectedRow.reservations.reference || '').trim()
    const fetchedBalance = await fetchPmReservationBalanceByReference(reference)
    const fallbackBalance = Number(selectedRow.reservations.totalamount || 0) - Number(selectedRow.reservations.amountpaid || 0)
    const finalBalance = Number.isFinite(fetchedBalance) ? fetchedBalance : fallbackBalance
    balanceEl.textContent = `Guest: ${getPmGuestNameFromReservationRow(selectedRow)} | Balance: ${formatNumber(Number.isFinite(finalBalance) ? finalBalance : 0)}`
}

async function handleSalesOwnerSelectionChange() {
    const applyto = String(did('applyto')?.value || '').trim().toUpperCase()
    if(!applyto.includes('PM')) return
    if(did('owner')) did('owner').value = getSelectedPmRoomNumber()
    await showPmOwnerBalanceForSelection()
}

async function ensureSalesCostCentersLoaded() {
    if(salesAuxiliaryLoadState.costCenters) return salesAuxiliaryLoadState.costCenters
    salesAuxiliaryLoadState.costCenters = (async () => {
        const request = await httpRequest2('../controllers/fetchcostcenter', null, null, 'json', { lightweight: true })
        if(request?.status && Array.isArray(request.data)) {
            const list = did('hems_cost_center')
            if(list) list.innerHTML = request.data.map(data=>`<option value="${data.costcenter}">${data.id}</option>`).join('')
            return request.data
        }
        return []
    })()
    return salesAuxiliaryLoadState.costCenters
}

async function ensureSalesRoomNumbersLoaded(id="") {
    if(!id && salesAuxiliaryLoadState.roomNumbers) return salesAuxiliaryLoadState.roomNumbers
    const loadPromise = (async () => {
        const request = await httpRequest2('../controllers/fetchrooms', null, null, 'json', { lightweight: true })
        if(!request?.status || !Array.isArray(request.data)) return []
        const rows = id ? request.data.filter(data=>data.categoryid == id) : request.data
        const roomNumber = did('hems_roomnumber')
        const roomNumberId = did('hems_roomnumber_id')
        const roomNumberId1 = did('hems_roomnumber_id1')
        if(roomNumber) roomNumber.innerHTML = rows.map(data=>`<option value="${data.roomnumber}">${data.roomname} ${data.categoryid}</option>`).join('')
        if(roomNumberId) roomNumberId.innerHTML = rows.map(data=>`<option value="${data.roomnumber}">${data.roomname} | ${data.roomcategory || data.categoryid} | Floor ${data.floor || '-'} || ${data.roomnumber}</option>`).join('')
        if(roomNumberId1) roomNumberId1.innerHTML = rows.map(data=>`<option value="${data.roomname} ${data.categoryid} || ${data.roomnumber}">${data.roomnumber}</option>`).join('')
        return request.data
    })()
    if(!id) salesAuxiliaryLoadState.roomNumbers = loadPromise
    return loadPromise
}
 
async function handlesalesapplyto (){
    if(!document.getElementById('applyto').value)return
    document.getElementById('owner').value = '';
    document.getElementById('owner1').value = '';
    if(did('pmownerselect')) did('pmownerselect').value = ''
    document.getElementById('owner1').removeAttribute('list')
    document.getElementById('owner').removeAttribute('list')
    if(did('owner1')) did('owner1').classList.remove('hidden')
    if(did('pmownerselect')) did('pmownerselect').classList.add('hidden')
    if(document.getElementById('applyto').value == 'ROOMS'){
        await ensureSalesRoomNumbersLoaded()
        document.getElementById('owner1').setAttribute('list', 'hems_roomnumber_id1')
    }
    markallcomp()
    if(document.getElementById('applyto').value == 'COST CENTER'){
        await ensureSalesCostCentersLoaded()
        document.getElementById('owner1').setAttribute('list', 'hems_cost_center')
    }
    if(document.getElementById('applyto').value == 'PM'){
        if(did('owner1')) did('owner1').classList.add('hidden')
        if(did('pmownerselect')) did('pmownerselect').classList.remove('hidden')
        await fetchPmReservationOwnerOptions()
    } else {
        hidePmOwnerBalance()
    }
    syncPmPaymentUi()
    // if(document.getElementById('applyto').value == 'OTHERS')document.getElementById('owner').value = document.getElementById('owner1').value
}

function extractRoomNumberFromOwnerInput(value = '') {
    const text = String(value || '').trim()
    if(!text) return ''
    if(text.includes('||')) {
        const parts = text.split('||')
        const tail = String(parts[parts.length - 1] || '').trim()
        if(tail) return tail
    }
    return text
}

function getDatalistOptionTextByValue(listId = '', optionValue = '') {
    const list = did(listId)
    if(!list) return ''
    const normalizedValue = String(optionValue || '').trim().toLowerCase()
    if(!normalizedValue) return ''
    const options = Array.from(list.querySelectorAll('option'))
    const matchedOption = options.find((option) => String(option.value || '').trim().toLowerCase() === normalizedValue)
    return String(matchedOption?.textContent || '').trim()
}

function resolveSalesOwnerPayloadValue() {
    const applyto = String(did('applyto')?.value || '').trim().toUpperCase()
    const ownerHidden = String(did('owner')?.value || '').trim()
    const ownerVisible = String(did('owner1')?.value || '').trim()
    if(applyto.includes('ROOM')) {
        const roomNumber = ownerHidden || extractRoomNumberFromOwnerInput(ownerVisible)
        return roomNumber || '-1'
    }
    if(applyto.includes('COST')) {
        const selectedCostCenterId = getDatalistOptionTextByValue('hems_cost_center', ownerVisible)
        return selectedCostCenterId || ownerHidden || ownerVisible || '-1'
    }
    if(applyto.includes('PM')) {
        return getSelectedPmRoomNumber() || ownerHidden || ownerVisible || '-1'
    }
    return ownerVisible || ownerHidden || '-1'
}

function applySalesOwnerToInputs(ownerValue = '') {
    const normalizedOwner = String(ownerValue || '').trim()
    if(did('owner1')) did('owner1').value = normalizedOwner
    if(did('pmownerselect') && String(did('applyto')?.value || '').trim().toUpperCase().includes('PM')) {
        const selectedRow = pmReservationOwnerRows.find((row) => {
            const reservationId = String(row?.reservations?.id || '').trim()
            const roomNumber = String(row?.roomgeustrow?.[0]?.roomdata?.roomnumber || '').trim()
            return reservationId === normalizedOwner || roomNumber === normalizedOwner
        })
        did('pmownerselect').value = String(selectedRow?.reservations?.id || normalizedOwner)
    }
    if(did('owner')) {
        if(String(did('applyto')?.value || '').trim().toUpperCase().includes('PM')) {
            did('owner').value = getSelectedPmRoomNumber() || normalizedOwner
        } else if(String(did('applyto')?.value || '').trim().toUpperCase().includes('ROOM')) {
            did('owner').value = extractRoomNumberFromOwnerInput(normalizedOwner)
        } else {
            did('owner').value = normalizedOwner
        }
    }
}

function resolveRoomOwnerFromOrderEntry(orderEntry = null) {
    if(!orderEntry) return ''
    const saleentry = orderEntry.saleentry || {}
    const details = Array.isArray(orderEntry.saledetail) ? orderEntry.saledetail : []
    const roomCandidates = [
        saleentry.roomnumber,
        saleentry.room,
        saleentry.ownerdetail,
        saleentry.ownerid,
        saleentry.owner
    ]
    details.forEach((detail) => {
        roomCandidates.push(detail?.roomnumber, detail?.room, detail?.ownerdetail, detail?.ownerid, detail?.owner)
    })
    return roomCandidates.map((value) => String(value ?? '').trim()).find((value) => value && value !== '-1') || ''
}

function hidesalesterminal(hide=true){
    for(let i=0;i<document.getElementsByClassName('load').length;i++){
        if(hide)document.getElementsByClassName('load')[i].classList.add('hidden')
        if(!hide)document.getElementsByClassName('load')[i].classList.remove('hidden')
    }
}

async function handlesalesdepartment(store) {
    did('loading').classList.remove('hidden')
    did('loading').innerHTML = 'Loading...'
    // did('salesform').reset()
    checkifitisrestaurant();
    clearMissingOrderItemsNotice()
    renderSalesTotalSummary(0)
    did('totalamount').value = 0
    const itemInputMarkup = `<input autocomplete="off" onchange="checkdatalist(this);salesitempop(this,'1')" onblur="salesitempop(this,'1')" list="hems_itemslist" name="item" id="item-1" class="form-control iitem comp">`
    did('thetabledata').innerHTML = `<tr id="row-919">
                                                <td class="s/n">1</td>
                                                <td class="">  
                                                    <label for="logoname" class="control-label hidden">Item</label>
                                                    ${itemInputMarkup}
                                                    <input autocomplete="off" class="itemmerid hidden" id="itemer-1">
                                                    <input autocomplete="off" class="hidden" id="itemclass-1">
                                                </td>
                                                <td style="">
                                                    <div class="">
                                                        <p class="font-bold">Type:&nbsp;<span class="font-normal" id="type-1"></span></p>
                                                        <p class="font-bold">Unit:&nbsp;<span class="font-normal" id="unit-1"></span></p>
                                                        <p class="font-bold ${isOrderWorkspaceMode() ? 'hidden' : ''}">Stock&nbsp;Balance:&nbsp;<span class="font-normal" id="balance-1"></span></p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <label for="logoname" class="control-label hidden">Price</label>
                                                    <input autocomplete="off" type="number"  name="" id="price-1" class="form-control comp pprice" onchange="calsaleqty('1')" placeholder="">
                                                </td>
                                                <td>
                                                    <label for="logoname" class="control-label hidden">Quantity</label>
                                                    <input autocomplete="off" type="number"  name="" id="qty-1" class="form-control comp qqty" onchange="calsaleqty('1')" placeholder="">
                                                </td>
                                                <td>
                                                    <label for="logoname" class="control-label hidden">Amount</label>
                                                    <input autocomplete="off" type="number" disabled name="" id="amount-1" class="form-control ammount" placeholder="">
                                                </td>
                                                <td>
                                                    <button onclick="event.preventDefault();removesalesrow('919')" class="material-symbols-outlined rounded-full bg-red-500 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">remove</button>
                                                </td>
                                            </tr>`
    if(isOrderWorkspaceMode()) relaxOrderItemInputs()
    hidesalesterminal()
    if(!did('salespointname').value && !store)return notification('Please enter a Department / Sales Point')
    
    function payload(){
        let param = new FormData()
        if(!store)param.append('salespoint', did('salespointname').value)
        if(store)param.append('salespoint', default_department)
        return param 
    } 
    let request = await httpRequest2('../controllers/fetchinventorybysalespoint', payload(), document.querySelector('#updateinventoryform #save'))
    if(request.status) {
            if(request.data.length) {
                salesInventoryDatasource = request.data
                document.getElementById('hems_itemslist').innerHTML = request.data.map((data, index) =>`<option>${data.itemname.trim()}</option>`).join('')
                hidesalesterminal(false)
                did('loading').innerHTML = 'Form ready'
                syncSalesViewFilterSalespointOptions()
                syncSalesBillFilterSalespointOptions()
                ensureSalesTableNumbersLoaded()
                // resolvePagination(datasource, onupdateinventoryTableDataSignal)
                return notification(request.message, 1);
            }
    }else{
        syncSalesViewFilterSalespointOptions()
        syncSalesBillFilterSalespointOptions()
        did('loading').innerHTML = request.message
        return notification('No records retrieved')}
}

async function populatesalesitems(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchinventorylist', id ? getparamm() : null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        const items = normalizeInventoryItems(request.data)
        if(!id){
            if(items.length) {
                // datasource = request.data
                let x = document.getElementsByClassName('itemer')
                for(let i=0;i<x.length;i++){
                    if(x[i].children.length < 2){
                        x[i].innerHTML += items.map(data=>`<option value="${data.itemid}">${data.itemname}</option>`)
                    }
                }
            }
        }else{
             salesid = items[0]?.id
            if(items[0])populateData(items[0])
        }
    }
    else return notification('No records retrieved')
}

function clearrow(i){
     did(`type-${i}`).innerHTML = ''
        if(did(`itemclass-${i}`)) did(`itemclass-${i}`).value = ''
        did(`unit-${i}`).innerHTML = ''
        did(`balance-${i}`).innerHTML = ''
        did(`price-${i}`).value = ''
        did(`qty-${i}`).value = ''
        did(`amount-${i}`).value = ''
        did(`item-${i}`).value = ''
}

function isNonStockItemClass(itemClassValue = '') {
    const normalized = String(itemClassValue || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
    return normalized === 'NONSTOCKITEM'
}

function getSalesRowItemClass(rowId) {
    const explicitClass = String(did(`itemclass-${rowId}`)?.value || '').trim()
    if(explicitClass) return explicitClass

    const itemId = String(did(`itemer-${rowId}`)?.value || '').trim()
    const itemName = String(did(`item-${rowId}`)?.value || '').trim().toLowerCase()
    const inventoryItem = salesInventoryDatasource.find((item) => {
        if(itemId && String(item?.itemid || '') === itemId) return true
        return itemName && String(item?.itemname || '').trim().toLowerCase() === itemName
    })
    const resolvedClass = String(inventoryItem?.itemclass || '').trim()
    if(resolvedClass && did(`itemclass-${rowId}`)) did(`itemclass-${rowId}`).value = resolvedClass
    return resolvedClass
}

function calsaleqty(i){
    if(Number(did(`qty-${i}`).value)<0)did(`qty-${i}`).value = 0
    const itemClassValue = getSalesRowItemClass(i)
    const shouldCheckStockBalance = !isOrderWorkspaceMode() && !isNonStockItemClass(itemClassValue)
    if(shouldCheckStockBalance && Number(did(`balance-${i}`).textContent)<Number(did(`qty-${i}`).value)){
        let iniborder = did(`qty-${i}`).style.borderColor
        did(`qty-${i}`).value = Number(did(`balance-${i}`).textContent)
        did(`qty-${i}`).style.borderColor = 'red'
        did(`qty-${i}`).style.color = 'red'
        notification(`Quantity of ${did(`item-${i}`).value} cannot exceed the stock of balance of ${did(`balance-${i}`).textContent}`)
        setTimeout(()=>{
        did(`qty-${i}`).style.borderColor = iniborder
        did(`qty-${i}`).style.color = 'black'
        }, 2000)
    }
    did(`amount-${i}`).value = Number(did(`price-${i}`).value)*Number(did(`qty-${i}`).value)
    let x = 0
    for(let i=0;i<document.getElementsByClassName('ammount').length;i++){
        if(!document.getElementsByClassName('ammount')[i].value)document.getElementsByClassName('ammount')[i].value = 0;
        x = x + Number(document.getElementsByClassName('ammount')[i].value)
    }
    did('totalamount').value = x
    renderSalesTotalSummary(x)
    saletotalamount = x
}

function addfromsearch(){
    if(!did('searcheditem').value || did('searcheditem').value == '')return notification('Please enter a valid Item')
    if(!did('searchedqty').value)did('searchedqty').value = 0
    let x = true
    for(let i=0;i<document.getElementsByClassName('iitem').length;i++){
        if(document.getElementsByClassName('iitem')[i].value == did('searcheditem').value)x=false
    }
    if(!x)notification(`${did('searcheditem').value} is already listed`)
    if(!x)return did('searcheditem').value = ''
    if(did('thetabledata').children.length == 1 && !document.getElementsByClassName(`iitem`)[0].value){
        document.getElementById(`item-1`).value = did('searcheditem').value
        salesitempop(document.getElementById(`item-1`),`1`, did('searchedqty').value)
        notification(`${did('searcheditem').value} loaded successfully`,1)
        // calsaleqty('1')
        did('searcheditem').value = ''
        did('searchedqty').value = 1
    }else{
        let id = genID()
        addsalesrow(id)
        document.getElementById(`item-${id}`).value = did('searcheditem').value
        salesitempop(document.getElementById(`item-${id}`),`${id}`, did('searchedqty').value)
        notification(`${did('searcheditem').value} loaded successfully`,1)
        // calsaleqty(`'${id}'`)
        did('searcheditem').value = ''
        did('searchedqty').value = 1
    }
}

async function salesitempop(val,i,qty=0) {
    if(!val.value)return clearrow(i)
    let x = 0
    for(let i=0;i<document.getElementsByClassName('iitem').length;i++){
        if(document.getElementsByClassName('iitem')[i].value == val.value)x=x+1
    }
    console.log(x)
    if(x>1)notification(`${val.value} is already listed`)
    if(x>1)return clearrow(i)
    const selectedName = String(val.value || '').trim().toLowerCase()
    const sourceItems = salesInventoryDatasource
    const nameMatches = sourceItems.filter((item) => String(item?.itemname || '').trim().toLowerCase() === selectedName)
    const currentRowItemId = String(did(`itemer-${i}`)?.value || '').trim()
    const matchedByRowId = currentRowItemId
        ? nameMatches.find((item) => String(item?.itemid || '').trim() === currentRowItemId)
        : null
    const resolvedItem = matchedByRowId || nameMatches[0] || null

    let ddid = String(resolvedItem?.itemid || '').trim()
    if(!ddid) ddid = await getLabelFromValue(val.value, 'hems_itemslist_getid')
    if(did(`itemer-${i}`)) did(`itemer-${i}`).value = ddid
    console.log(val.value, ddid)
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('itemid', ddid)
        paramstr.append('salespoint', did('salespointname').value)
        return paramstr
    }
    const salespointValue = String(did('salespointname')?.value || '').trim()
    const detailCacheKey = `${ddid}::${salespointValue}`
    let request = salesItemDetailCache.get(detailCacheKey) || null
    if(!request){
        request = await httpRequest2('../controllers/fetchitemdetail', ddid ? getparamm() : null, null, 'json')
        if(request?.status) salesItemDetailCache.set(detailCacheKey, request)
    }
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status && Array.isArray(request.itemdata) && request.itemdata.length) {
        did(`type-${i}`).innerHTML = request.itemdata[0].itemtype
        if(did(`itemclass-${i}`)) did(`itemclass-${i}`).value = request.itemdata[0].itemclass || ''
        did(`unit-${i}`).innerHTML = request.itemdata[0].units
        const rowItemClass = request.itemdata[0].itemclass || ''
        did(`balance-${i}`).innerHTML = isNonStockItemClass(rowItemClass) ? '999999999' : request.balance
        did(`price-${i}`).value = request.itemdata[0].price
        did(`qty-${i}`).value = Number(qty)
        did(`amount-${i}`).value = Number(request.itemdata[0].price)*Number(did(`qty-${i}`).value)
        if(did(`qty-${i}`).value)calsaleqty(`${i}`)
        return
    }

    // Fallback to the already filtered salespoint datasource when detail lookup does not return.
    if(resolvedItem){
        did(`type-${i}`).innerHTML = resolvedItem.itemtype || ''
        if(did(`itemclass-${i}`)) did(`itemclass-${i}`).value = resolvedItem.itemclass || ''
        did(`unit-${i}`).innerHTML = resolvedItem.units || ''
        const rowItemClass = resolvedItem.itemclass || ''
        did(`balance-${i}`).innerHTML = isNonStockItemClass(rowItemClass) ? '999999999' : (resolvedItem.balance ?? '')
        did(`price-${i}`).value = Number(resolvedItem.price || 0)
        did(`qty-${i}`).value = Number(qty)
        did(`amount-${i}`).value = Number(resolvedItem.price || 0) * Number(did(`qty-${i}`).value)
        if(did(`qty-${i}`).value)calsaleqty(`${i}`)
        return
    }
    return notification('No records retrieved')
}

function addsalesrow(ii=''){
    let id 
    if(ii)id = ii
    if(!ii)id = genID()
    const itemInputMarkup = `<input autocomplete="off" onchange="checkdatalist(this);salesitempop(this,'${id}')" onblur="salesitempop(this,'${id}')" list="hems_itemslist" name="item" id="item-${id}" class="form-control iitem comp">`
    let element = document.createElement('tr')
    element.setAttribute('id', `'row-${id}'`)
    element.innerHTML = `
        <td class="s/n"></td>
        <td class="">  
            <label for="logoname" class="control-label hidden">Item</label>
            ${itemInputMarkup}
             <input autocomplete="off" class="itemmerid hidden" id="itemer-${id}">
             <input autocomplete="off" class="hidden" id="itemclass-${id}">
        </td>
        <td style="">
            <div class="">
                <p class="font-bold">Type:&nbsp;<span class="font-normal" id="type-${id}"></span></p>
                <p class="font-bold">Unit:&nbsp;<span class="font-normal" id="unit-${id}"></span></p>
                <p class="font-bold ${isOrderWorkspaceMode() ? 'hidden' : ''}">Stock&nbsp;Balance:&nbsp;<span class="font-normal" id="balance-${id}"></span></p>
            </div>
        </td>
        <td>
            <label for="logoname" class="control-label hidden">Price</label>
            <input autocomplete="off" type="number"  name="" id="price-${id}" class="form-control comp pprice" onchange="calsaleqty('${id}')" placeholder="">
        </td>
        <td>
            <label for="logoname" class="control-label hidden">Quantity</label>
            <input autocomplete="off" type="number"  name="" id="qty-${id}" class="form-control comp qqty" onchange="calsaleqty('${id}')" placeholder="">
        </td>
        <td>
            <label for="logoname" class="control-label hidden">Amount</label>
            <input autocomplete="off" type="number" disabled name="" id="amount-${id}" class="form-control ammount" placeholder="">
        </td>
        <td>
            <button onclick="event.preventDefault();removesalesrow('${id}')" class="material-symbols-outlined rounded-full bg-red-500 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">remove</button>
        </td>
    `
        did('thetabledata').appendChild(element)
        if(isOrderWorkspaceMode()) relaxOrderItemInputs()
        runCount()
}

function removesalesrow(i){
    console.log(i, document.getElementById('row-'+i))
    if(document.getElementById('row-'+i)){
        document.getElementById('row-'+i).remove();
    }else{
        did(`'row-${i}'`).remove();
    }
    runCount()
}

async function fetchsales(id, options = {}) {
    const { useInitialWindow = false, quietEmpty = false, lightweight = false } = options || {}
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    function getWindowedParamm(){
        let paramstr = new FormData()
        const today = new Date().toISOString().slice(0, 10)
        const salespoint = String(did('salespointname')?.value || '').trim()
        paramstr.append('startdate', today)
        paramstr.append('enddate', today)
        if(salespoint) paramstr.append('salespoint', salespoint)
        return paramstr
    }
    const payload = id ? getparamm() : (useInitialWindow ? getWindowedParamm() : null)
    let request = await httpRequest2(isOrderWorkspaceMode() ? '../controllers/fetchorders.php' : '../controllers/fetchsales', payload, null, 'json', { lightweight })
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                salesListingDatasource = isOrderWorkspaceMode()
                    ? normalizeOrdersForSalesTable(request.data)
                    : normalizeSalesRowsForTable(request.data)
                renderCurrentSalesDatasource()
            } else {
                salesListingDatasource = []
                renderCurrentSalesDatasource()
            }
        }else{
             salesid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else if(!quietEmpty) return notification('No records retrieved')
}

async function removesales(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this sales?");

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
    fetchsales()
    return notification(request.message);
    
}


async function onsalesTableDataSignal() {
    const orderMode = isOrderWorkspaceMode()
    if(orderMode) orderRowsIndex = new Map()
    let rows = getSignaledDatasource().map((item, index) => {
        const safeRef = String(item.saleentry.reference).replace(/'/g, "\\'")
        const safeBatch = String(item.saleentry.batchid || '').replace(/'/g, "\\'")
        if(orderMode){
            orderRowsIndex.set(String(item.saleentry.reference || '').trim(), item)
            if(item.saleentry.batchid) orderRowsIndex.set(String(item.saleentry.batchid || '').trim(), item)
        }
        const ownerDetailValue = resolveOrderDetailsValue(item.saleentry, item.saledetail)
        const ownerValue = ownerDetailValue
            ? ownerDetailValue
            : item.saleentry.reference
        const itemSummary = (item.saledetail || []).map((detail) => `${detail.itemname || '-'} (${formatNumber(detail.qty || 0)})`).join(', ') || '-'
        const itemRows = (item.saledetail || [])
        const salesItemsPreview = `
            <table class="w-full text-xs">
                <tbody>
                    ${itemRows.slice(0, 3).map((detail, detailIndex) => `
                        <tr>
                            <td class="pr-2">${detailIndex + 1}.</td>
                            <td>${detail.itemname || '-'} (${formatNumber(detail.qty || 0)})</td>
                        </tr>
                    `).join('')}
                    ${itemRows.length > 3 ? `<tr><td colspan="2"><span class="text-blue-600 text-xs cp" onclick="openSalesReportModal('${safeRef}', '', true)">click to view all products (${itemRows.length})</span></td></tr>` : ''}
                </tbody>
            </table>
        `
        if(orderMode){
            const currentStatus = normalizeOrderStatusValue(item.saleentry.moredata, true) || 'ORDER'
            const statusOptions = getOrderStatusOptions(currentStatus)
            const hasFoodItems = orderHasFoodItems(item)
            const kitchenSent = isOrderKitchenSent(item.saleentry.reference)
            const safeComment = item.saleentry.description || item.saledetail?.[0]?.description || ''
            const safeOrderDetails = (() => {
                const raw = String(resolveOrderDetailsValue(item.saleentry, item.saledetail) ?? '').trim()
                return raw && raw !== '-1' ? raw : '-'
            })()
            const renderItemLabel = (label) => {
                const raw = String(label || '-')
                if(raw.length > 30){
                    return `<span class="text-blue-600 text-xs cp" onclick="openSalesReportModal('${safeRef}', '', true)">Click to view more</span>`
                }
                return raw
            }
            const nestedItemsTable = `
                <table class="w-full text-xs">
                    <tbody>
                        ${(itemRows || []).map((detail, detailIndex) => {
                            if(detailIndex >= 3) return ''
                            return `
                                <tr>
                                    <td class="pr-2">${detailIndex + 1}.</td>
                                    <td>${renderItemLabel(detail.itemname)} (${formatNumber(detail.qty || 0)})</td>
                                </tr>
                            `
                        }).join('')}
                        ${itemRows.length > 3 ? `<tr><td colspan="2"><span class="text-blue-600 text-xs cp" onclick="openSalesReportModal('${safeRef}', '', true)">Click to view more</span></td></tr>` : ''}
                    </tbody>
                </table>
            `
            return `
                <tr>
                    <td>${specialformatDateTime(item.saleentry.transactiondate)}</td>
                    <td>${item.saleentry.salespoint || '-'}</td>
                    <td>${nestedItemsTable}</td>
                    <td>
                        <div class="text-xs leading-5">
                            <p><span class="font-semibold">Order Details:</span> ${safeOrderDetails}</p>
                            <p><span class="font-semibold">Comment:</span> ${safeComment || '-'}</p>
                        </div>
                    </td>
                    <td>
                        <select class="form-control !min-w-[150px]" onchange="if(this.value)updateOrderStatus('${String(item.saleentry.batchid || '').replace(/'/g, "\\'")}', this.value, this)">
                            <option value="">${currentStatus}</option>
                            ${statusOptions.map((opt) => `<option value="${opt}">${opt}</option>`).join('')}
                        </select>
                    </td>
                    <td class="flex items-center gap-3">
                        <button title="View Item" onclick="openSalesReportModal('${safeRef}', '', true)" class="material-symbols-outlined rounded-full bg-green-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
                        <button title="Edit Order" onclick="editOrderByBatch('${safeBatch}')" class="material-symbols-outlined rounded-full bg-blue-500 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
                        <button title="Generate Bill" onclick="composeOrderToBillByReference('${safeRef}')" class="material-symbols-outlined rounded-full bg-amber-500 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">receipt_long</button>
                        <button title="Printed" onclick="printsalesreceiptsales('${safeRef}', '', 'fetchorders.php', false, false, true)" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">print</button>
                        ${hasFoodItems ? `<button title="${kitchenSent ? 'Sent to kitchen' : 'Send food items to kitchen'}" onclick="printKitchenOrderByReference('${safeRef}')" class="material-symbols-outlined rounded-full ${kitchenSent ? 'bg-emerald-600' : 'bg-rose-500'} h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">restaurant</button>` : ''}
                    </td>
                </tr>
            `
        }
        const safeDetails = (() => {
            const raw = String(resolveOrderDetailsValue(item.saleentry, item.saledetail) ?? '').trim()
            return raw && raw !== '-1' ? raw : '-'
        })()
        const safeComment = String(item.saleentry.description || item.saledetail?.[0]?.description || '').trim()
        return `
            <tr>
                <td>${specialformatDateTime(item.saleentry.transactiondate)}</td>
                <td>${item.saleentry.salespoint || '-'}</td>
                <td>${item.saleentry.reference}</td>
                <td>${salesItemsPreview}</td>
                <td>
                    <div class="text-xs leading-5">
                        <p><span class="font-semibold">Order Details:</span> ${safeDetails}</p>
                        <p><span class="font-semibold">Comments:</span> ${safeComment || '-'}</p>
                    </div>
                </td>
                <td>${formatNumber(item.saleentry.servicecharge)}</td>
                <td>${formatNumber(item.amountreceived)}</td>
                <td>${item.saleentry.paymentmethod}</td>
                <td>${safeDetails}</td>
                <td class="flex items-center gap-3">
                    <button title="View Item" onclick="openSalesReportModal('${safeRef}', '', true)" class="material-symbols-outlined rounded-full bg-green-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
                    <button title="Print sales" onclick="printsalesreceiptsales('${safeRef}', '', 'fetchsalesbyreference', false, false, true)" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">print</button>
                </td>
            </tr>
        `
    }).join('')
    injectPaginatatedTable(rows)
}

async function openSalesReportModal(ref, room='', preferLocal=false){
    if(!ref)return
    const orderMode = isOrderWorkspaceMode()
    const localData = salesListingDatasource.find(dat=>String(dat?.saleentry?.reference || '') == String(ref)) || null
    if(preferLocal && !room && localData){
        const localOrderDetailsRaw = String(resolveOrderDetailsValue(localData.saleentry, localData.saledetail) ?? '').trim()
        const localOrderDetails = localOrderDetailsRaw && localOrderDetailsRaw !== '-1' ? localOrderDetailsRaw : '-'
        const localOrderComment = String(localData.saleentry.description || '').trim()
        did('tableheader').innerHTML = `
            <th>s/n </th>
            <th> Item ID </th>
            <th> Item Name </th>
            <th> qty </th>
            <th> PRICE </th>
            <th> TOTAL </th>
        `;
        did('modaldetails').innerHTML = `
            <p class="!text-sm font-thin"><img src="../images/${did('your_companylogo').value}" class="w-[100px] h-[100px]"></p>
            <div class="col-span-2">
                <p class="!text-sm font-semibold flex w-full justify-between">Comments: <span class="uppercase !text-sm font-normal text-left w-[50%]">${localOrderComment || '-'}</span></p>
                <p class="!text-sm font-semibold flex w-full justify-between">Order Details: <span class="uppercase !text-sm font-normal text-left">${localOrderDetails}</span></p>
                <p class="!text-sm font-semibold flex w-full justify-between">Total Amount: <span class="uppercase !text-sm font-normal text-left">${formatNumber(localData.saleentry.servicecharge || 0)}</span></p>
                <p class="!text-sm font-semibold flex w-full justify-between">Ref: <span class="uppercase !text-sm font-normal text-left">${localData.saleentry.reference || ref}</span></p>
                ${orderMode ? `<div class="!text-sm font-semibold flex w-full justify-between items-center gap-3"><span>Status:</span><span class="w-[220px]"><select class="form-control" onchange="if(this.value)updateOrderStatus('${String(localData.saleentry.batchid || '').replace(/'/g, "\\'")}', this.value, this, '${String(localData.saleentry.reference || '').replace(/'/g, "\\'")}')"><option value="">${normalizeOrderStatusValue(localData.saleentry.moredata, true) || 'ORDER'}</option>${getOrderStatusOptions(localData.saleentry.moredata).map((opt) => `<option value="${opt}">${opt}</option>`).join('')}</select></span></div>` : `<p class="!text-sm font-semibold flex w-full justify-between">Payment Method: <span class="uppercase !text-sm font-normal text-left">${localData.saleentry.paymentmethod || ''}</span></p>`}
                ${orderMode ? '' : `<p class="!text-sm font-semibold flex w-full justify-between">Amount Paid: <span class="uppercase !text-sm font-normal text-left">${formatNumber(localData.amountreceived || 0)}</span></p>`}
                <p class="!text-sm font-semibold flex w-full justify-between">Transaction Date: <span class="uppercase !text-sm font-normal text-left">${specialformatDateTime(localData.saleentry.transactiondate || '')}</span></p>
            </div>
        `;
        did('tabledata2').innerHTML = (localData.saledetail || []).length
            ? (localData.saledetail || []).map((dat, i)=>`
                <tr>
                    <td>${i+1}</td>
                    <td>${dat.itemid || ''}</td>
                    <td>${dat.itemname || ''}</td>
                    <td>${formatNumber(dat.qty || 0)}</td>
                    <td>${formatNumber(dat.cost || 0)}</td>
                    <td>${formatNumber(Number(dat.qty || 0) * Number(dat.cost || 0))}</td>
                </tr>
            `).join('')
            : `<tr><td colspan="100%" class="text-center opacity-70"> No Items set for this sales report</td></tr>`
        did('salesreportmodal').classList.remove('hidden')
        return
    }
    function getparamm() {
        let paramstr = new FormData();
        if(!room)paramstr.append('reference', ref);
        if(room)paramstr.append('roomnumber', room);
        return paramstr;
    }
    const controller = orderMode ? 'fetchorders.php' : (!room ? 'fetchsalesdetailbyref' : 'fetchroomtransactionhistory')
    let request = await httpRequest2(`../controllers/${controller}`, getparamm(), null, 'json');
    let data1 = localData || {saleentry:{}, amountreceived:0}
    if(!request.status) return notification('No records retrieved')
        const fallbackOrderDetailsRaw = String(resolveOrderDetailsValue(data1.saleentry, data1.saledetail) ?? '').trim()
    const fallbackOrderDetails = fallbackOrderDetailsRaw && fallbackOrderDetailsRaw !== '-1' ? fallbackOrderDetailsRaw : '-'
    const fallbackOrderComment = String(data1.saleentry.description || '').trim()

    did('tableheader').innerHTML = `
        <th>s/n </th>
        <th> Item ID </th>
        <th> Item Name </th>
        <th> qty </th>
        <th> PRICE </th>
        <th> TOTAL </th>
    `;
    did('modaldetails').innerHTML = `
        <p class="!text-sm font-thin"><img src="../images/${did('your_companylogo').value}" class="w-[100px] h-[100px]"></p>
        <div class="col-span-2">
            <p class="!text-sm font-semibold flex w-full justify-between">Comments: <span class="uppercase !text-sm font-normal text-left w-[50%]">${fallbackOrderComment || '-'}</span></p>
            <p class="!text-sm font-semibold flex w-full justify-between">Order Details: <span class="uppercase !text-sm font-normal text-left">${fallbackOrderDetails}</span></p>
            <p class="!text-sm font-semibold flex w-full justify-between">Total Amount: <span class="uppercase !text-sm font-normal text-left">${formatNumber(data1.saleentry.servicecharge || 0)}</span></p>
            <p class="!text-sm font-semibold flex w-full justify-between">Ref: <span class="uppercase !text-sm font-normal text-left">${data1.saleentry.reference || ref}</span></p>
            ${orderMode ? `<div class="!text-sm font-semibold flex w-full justify-between items-center gap-3"><span>Status:</span><span class="w-[220px]"><select class="form-control" onchange="if(this.value)updateOrderStatus('${String(data1.saleentry.batchid || '').replace(/'/g, "\\'")}', this.value, this, '${String(data1.saleentry.reference || '').replace(/'/g, "\\'")}')"><option value="">${normalizeOrderStatusValue(data1.saleentry.moredata, true) || 'ORDER'}</option>${getOrderStatusOptions(data1.saleentry.moredata).map((opt) => `<option value="${opt}">${opt}</option>`).join('')}</select></span></div>` : `<p class="!text-sm font-semibold flex w-full justify-between">Payment Method: <span class="uppercase !text-sm font-normal text-left">${data1.saleentry.paymentmethod || ''}</span></p>`}
            ${orderMode ? '' : `<p class="!text-sm font-semibold flex w-full justify-between">Amount Paid: <span class="uppercase !text-sm font-normal text-left">${formatNumber(data1.amountreceived || 0)}</span></p>`}
            <p class="!text-sm font-semibold flex w-full justify-between">Transaction Date: <span class="uppercase !text-sm font-normal text-left">${specialformatDateTime(data1.saleentry.transactiondate || '')}</span></p>
        </div>
    `;

    did('tabledata2').innerHTML = 'No Items set for this sales report';
    if(Array.isArray(request.data) && request.data.length > 0){
        did('tabledata2').innerHTML = request.data.map((dat, i)=>`
            <tr>
                <td>${i+1}</td>
                <td>${dat.itemid || ''}</td>
                <td>${dat.itemname || ''}</td>
                <td>${formatNumber(dat.qty || 0)}</td>
                <td>${formatNumber(dat.cost || 0)}</td>
                <td>${formatNumber(Number(dat.qty || 0) * Number(dat.cost || 0))}</td>
            </tr>
        `).join('');
    }
    did('salesreportmodal').classList.remove('hidden')
}
  
function removewhsalesviewmodal(e){
     if(e.target.classList.contains('bgwhsales'))e.target.classList.add('hidden')
}
 
function viewsaleinvoice(batchid, view){
    if(document.getElementById("whsalesviewmodalcontainer") && view == 'view')document.getElementById("whsalesviewmodalcontainer").classList.remove('hidden')
    let batchdata = salesListingDatasource.filter(dat=>dat.batchid == batchid)[0]
    console.log('batchdata', batchdata)
    if(document.getElementById("whsalesviewmodal"))document.getElementById("whsalesviewmodal").innerHTML = `
                            <div class="rounded-lg">
                        
                        		<div class="flex mb-8 justify-between">
                        			<div class="w-2/4">
                        				<div class="mb-2 md:mb-1 md:flex items-center">
                        					<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Invoice No.</label>
                        					<div class="flex-1">
                        					<input autocomplete="off" value="REF|${batchdata.data[0].reference}" id="invoiceno" readonly class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"  type="text" placeholder="eg. #INV-100001">
                        					</div>
                        				</div>
                        
                        				<div class="mb-2 md:mb-1 md:flex items-center">
                        					<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Invoice Date</label>
                        					<div class="flex-1">
                        					<input autocomplete="off" value="${formatDate(batchdata.data[0].transactiondate.split(' ')[0])}" readonly class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker" type="text" placeholder="eg. 17 Feb, 2020">
                        					</div>
                        				</div>
                        
                        				<!--<div class="mb-2 md:mb-1 md:flex items-center">-->
                        				<!--	<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Due date</label>-->
                        				<!--	<span class="mr-4 inline-block hidden md:block">:</span>-->
                        				<!--	<div class="flex-1">-->
                        				<!--	<input autocomplete="off" class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker-2" id="datepicker2" type="text" placeholder="eg. 17 Mar, 2020" x-model="invoiceDueDate" x-on:change="invoiceDueDate = document.getElementById('datepicker2').value" autocomplete="off" readonly="">-->
                        				<!--	</div>-->
                        				<!--</div>-->
                        			</div>
                        			<div>
                        				<span class="xl:w-[250px] pb-10 font-bold text-2xl text-base block py-3 pl-5 selection:bg-white uppercase font-heebo text-primary-g text-right">He<span class="text-gray-400">ms Invoice</span></span>
                        				<div class="flex justify-end">
                        				<div onclick="printContent('HEMS INVOICE', null, 'whsalesviewmodal', true)" class="relative mr-4 inline-block">
                        					<div class="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 inline-flex items-center justify-center" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false" @click="printInvoice()">
                        						<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-printer" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        							<rect x="0" y="0" width="24" height="24" stroke="none"></rect>
                        							<path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"></path>
                        							<path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"></path>
                        							<rect x="7" y="13" width="10" height="8" rx="2"></rect>
                        						</svg>				  
                        					</div>
                        					<div x-show.transition="showTooltip" class="z-40 shadow-lg text-center w-32 block absolute right-0 top-0 p-2 mt-12 rounded-lg bg-gray-800 text-white text-xs" style="display: none;">
                        						Print this invoice!
                        					</div>
                        				</div>
                        				<div onclick="did('whsalesviewmodalcontainer').classList.add('hidden')" class="relative inline-block">
                        					<div class="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 inline-flex items-center justify-center" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false" @click="printInvoice()">
                        						<span class="material-symbols-outlined text-red-500">cancel</span>	  
                        					</div>
                        					<div x-show.transition="showTooltip" class="z-40 shadow-lg text-center w-32 block absolute right-0 top-0 p-2 mt-12 rounded-lg bg-gray-800 text-white text-xs" style="display: none;">
                        						cancel
                        					</div>
                        				</div>
                        				
                        			</div>
                        			</div>
  </div>
                        
                        		<div class="flex flex-wrap justify-between mb-8">
                        			<div class="w-full md:w-1/3 mb-2 md:mb-0">
                        				<label class="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">Bill To:</label>
                        				<input autocomplete="off" id="rbillto" value="${String(batchdata.data[0].ownerdetail || batchdata.data[0].owner || '-').toUpperCase()}" readonly class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                        				<input autocomplete="off" id="rroomnumber" value="${String(batchdata.data[0].description).toUpperCase()}" readonly class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company address" >
                        				<input autocomplete="off" id="rpaymentmenthod" value="${String(batchdata.data[0].paymentmethod).toUpperCase()}" readonly class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Additional info" >
                        			</div>
                        			<div class="w-full md:w-1/3">
                        				<label class="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">From:</label>
                        				<input autocomplete="off" value="Hems Limited" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Your company name" >
                        
                        				<input autocomplete="off" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Your company address" >
                        
                        				<input autocomplete="off" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Additional info" >
                        			</div>
                                </div>
                                
                                <h3 class="text-xl font-bold"> Payment: </h3>
                                <ul class="text-md font-semibold text-grey-400 px-1">
                                    <li class="border rounded p-1 mt-1" style="display: flex;justify-content:space-between;width: 100%"><p>Date:</p> <span>${String(formatDate(batchdata.data[0].transactiondate.split(' ')[0])).toUpperCase()}</span></li>
                                    <li class="border rounded p-1 mt-1" style="display: flex;justify-content:space-between;width: 100%"><p>Total quantity:</p> <p>${String(batchdata.data[0].qty)} Item(s)</p></li>
                                    <li class="border rounded p-1 mt-1" style="display: flex;justify-content:space-between;width: 100%"><p>Total cost:</p> <p>${formatCurrency(batchdata.data.reduce((accumulator, currentValue) => accumulator + Number(currentValue.cost), 0))}</p></li>
                                    <li class="border rounded p-1 mt-1" style="display: flex;justify-content:space-between;width: 100%"><p>VAT:</p> <p>0.00</p></li>
                                    <li class="border rounded p-1 mt-1" style="display: flex;justify-content:space-between;width: 100%"><p>Total paid:</p> <p>${formatCurrency(batchdata.data[0].amountpaid)}</p></li>
                                    <li class="border rounded p-1 mt-1" style="display: flex;justify-content:space-between;width: 100%"><p>Remaining Balance:</p> <p>00.00</p></li>
                                </ul>
                                 <div class="table-content w-full">
                                <table id="tableer" class="mx-auto">
                                        <thead>
                                            <tr>
                                                 <th style="width: 20px">s/n</th>
                                                <th>ITEM</th>
                                                <th>PRICE</th>
                                                <th>QTY</th>
                                                <th class="text-left">AMOUNT</th>
                                            </tr>
                                        </thead>
                                        <tbody id="tabledata">
                                        ${(() => {
                                        let rowsHtml = '';
                                        for (let i = 0; i < batchdata.data.length; i++) {
                                            rowsHtml += `
                                                <tr>
                                                    <td>${i+1}</td>
                                                    <td>${String(batchdata.data[i].itemname).toUpperCase()}</td>
                                                    <td>${formatCurrency(batchdata.data[i].cost)}</td>
                                                    <td>${formatNumber(batchdata.data[i].qty)}</td>
                                                    <td class="text-left">${formatCurrency(Number(batchdata.data[i].qty) * Number(batchdata.data[i].cost))}</td>
                                                </tr>`;
                                        }
                                            return rowsHtml;
                                        })()}
                                        <tr style="background: #c9c6c6;">
                                        <td>SUBTOTAL<br>VAT</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>${formatCurrency(batchdata.data[0].amountpaid)}<br>-0.00</td>
                                    </tr>
                                    <tr style="background: #c9c6c6;">
                                        <td>TOTAL&nbsp;AMOUNT:</td>
                                        <td></td>
                                        <td></td>
                                        <td>${formatNumber(batchdata.data.reduce((accumulator, currentValue) => accumulator + Number(currentValue.qty), 0))}</td>
                                        <td>${formatCurrency(batchdata.data[0].amountpaid)}</td>
                                    </tr>
                                        </tbody>
                                    </table>
                        		</div>
                        		
                        
                        		<div class="py-2 ml-auto mt-5 w-full sm:w-2/4 lg:w-1/4">
                        			<div class="flex justify-between mb-4">
                        				<div class="text-sm text-gray-600 text-right flex-1">VAT</div>
                        				<div class="text-right w-40">
                        					<div id="" class="text-sm text-gray-600" >0.00</div>
                        				</div>
                        			</div>
                        		
                        			<div class="py-2 border-t border-b">
                        				<div class="flex justify-between">
                        					<div class="text-xl text-gray-600 text-right flex-1">Total&nbsp;Paid&nbsp;Amount</div>
                        					<div class="text-right w-40">
                        						<div id="rtotalpaid" class="text-xl text-gray-800 font-bold">${formatCurrency(batchdata.data[0].amountpaid)}</div>
                        					</div>
                        				</div>
                        			</div>
                                </div>
                        
                        		<div class="py-10 text-center">
                        			<p class="text-gray-600">Created by <a class="text-blue-600 hover:text-blue-500 border-b-2 border-blue-200 hover:border-blue-300" href="https://twitter.com/mithicher">Mira Technologies</a>.</p>
                                </div>
                        
                        		
                        
                        
                        
                        	</div>
    
    
    
    
    `
    if(document.getElementById("whsalesviewmodalprint"))document.getElementById("whsalesviewmodalprint").innerHTML = `
        <h1>INVOICE</h1> 
         <div class="receipt" style="padding: 40px">
                    <div class="reciept-header">
                        <div>
                            <span class="xl:w-[250px] font-bold text-base block py-3 pl-5 selection:bg-white uppercase font-heebo text-primary-g">He<span class="text-gray-400">ms</span></span>
                            <span>
                                 <h1>HEMS limited</h1>
                                <span>address</span>
                            </span>
                        </div>
                        <div>
                            <span> Invoice#: <span>REF|${batchdata ? batchdata.data[0].reference : ''} </span></span>
                            issue date: ${batchdata.data[0].transactiondate.split(' ')[0]}
                        </div>
                    </div>
                    <div class="billing">
                        <div>
                            <h3> Invoice / Reciept To:</h3>
                             <ul>
                                <li style="display: flex;justify-content:space-between;width: 150%"><p>Sales Person:</p> <p>${batchdata.data[0].user.toUpperCase()}</p> </li>
                                <li style="display: flex;justify-content:space-between;width: 150%"><p>Invoice / Reciept To</p> <p>${String(batchdata.data[0].ownerdetail || batchdata.data[0].owner || '-').toUpperCase()}</p> </li>
                                <li style="display: flex;justify-content:space-between;width: 150%"><p>Payment Method:</p> <p>${String(batchdata.data[0].paymentmethod).toUpperCase()}</p> </li>
                                <li style="display: flex;justify-content:space-between;width: 150%"><p>Description:</p> <p>${String(batchdata.data[0].description).toUpperCase()}</p> </li>
                                <li style="display: flex;justify-content:space-between;width: 150%"><p>Reference Number:</p> <p>${String(batchdata.data[0].reference).toUpperCase()}</p> </li>
                            </ul>
                        </div>
                        <div>
                            <h3> Payment: </h3>
                            <ul>
                                <li style="display: flex;justify-content:space-between;width: 150%"><p>Date:</p> <span>${String(formatDate(batchdata.data[0].transactiondate.split(' ')[0])).toUpperCase()}</span></li>
                                <li style="display: flex;justify-content:space-between;width: 150%"><p>Total quantity:</p> <p>${String(batchdata.data[0].qty)} Item(s)</p></li>
                                <li style="display: flex;justify-content:space-between;width: 150%"><p>Total cost:</p> <p>${formatCurrency(batchdata.data.reduce((accumulator, currentValue) => accumulator + Number(currentValue.cost), 0))}</p></li>
                                <li style="display: flex;justify-content:space-between;width: 150%"><p>VAT:</p> <p>0.00</p></li>
                                <li style="display: flex;justify-content:space-between;width: 150%"><p>Total paid:</p> <p>${formatCurrency(batchdata.data[0].amountpaid)}</p></li>
                                <li style="display: flex;justify-content:space-between;width: 150%"><p>Remaining Balance:</p> <p>00.00</p></li>
                            </ul>
                        </div>
                    </div>
                    <div class="items">
                        <table>
                            <thead>
                                <tr style="background: #c9c6c6;">
                                    <th>ITEM</th>
                                    <th>PRICE</th>
                                    <th>QTY</th>
                                    <th>AMOUNT</th>
                                </tr>
                            </thead>
                            <tbody>
                                                ${(() => {
                                        let rowsHtml = '';
                                        for (let i = 0; i < batchdata.data.length; i++) {
                                            rowsHtml += `
                                                <tr>
                                                    <td>${String(batchdata.data[i].itemname).toUpperCase()}</td>
                                                    <td>${formatCurrency(batchdata.data[i].cost)}</td>
                                                    <td>${formatCurrency(batchdata.data[i].qty)}</td>
                                                    <td>${formatCurrency(Number(batchdata.data[i].qty) * Number(batchdata.data[i].cost))}</td>
                                                </tr>`;
                                        }
                                        return rowsHtml;
                                    })()}
                                    <tr style="background: #c9c6c6;">
                                        <td>SUBTOTAL<br>VAT</td>
                                        <td></td>
                                        <td></td>
                                        <td>${formatCurrency(batchdata.data[0].amountpaid)}<br>0.00</td>
                                    </tr>
                                    <tr style="background: #c9c6c6;">
                                        <td>TOTAL AMOUNT:</td>
                                        <td></td>
                                        <td>${formatCurrency(batchdata.data.reduce((accumulator, currentValue) => accumulator + Number(currentValue.qty), 0))}</td>
                                        <td>${formatCurrency(batchdata.data[0].amountpaid)}</td>
                                    </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="notice">
                        <div>
                            <div>We appreciate you doing business with us <br>
                                <span>THANK YOU</span>
                            </div>
                            <div>Sender: Signature & Date&nbsp;&nbsp;&nbsp;</div>
                            <div>Receiver: Signature & Date:&nbsp;&nbsp;&nbsp;</div>
                        </div>
                    </div>
                </div>
                
    `
    
}

function preparesalesvalues(){
    const itemIdControls = document.getElementsByClassName('itemmerid')
    for(let i=0;i<itemIdControls.length;i++){
        const control = itemIdControls[i]
        const itemName = String(control.previousElementSibling?.value || '').trim()
        const existingItemId = String(control.value || '').trim()
        const datalistItemId = String(getLabelFromValue(itemName, 'hems_itemslist_getid') || '').trim()
        const inventoryMatch = salesInventoryDatasource.find((item) => {
            if(existingItemId && String(item?.itemid || '').trim() === existingItemId) return true
            return itemName && String(item?.itemname || '').trim().toLowerCase() === itemName.toLowerCase()
        })
        const resolvedItemId = datalistItemId || String(inventoryMatch?.itemid || '').trim() || existingItemId
        control.value = resolvedItemId
    }
    givenamebyclass('iitem', 'itemname')
    givenamebyclass('itemmerid', 'itemid')
    givenamebyclass('qqty', 'qty')
    givenamebyclass('pprice', 'cost')
}

async function loadOrderIntoForm(orderEntry = null) {
    if(!orderEntry?.saleentry || !Array.isArray(orderEntry?.saledetail)) {
        notification('Invalid order data', 0)
        return false
    }
    const batchid = String(orderEntry.saleentry.batchid || '').trim()
    if(!batchid) {
        notification('Order batch id is missing', 0)
        return false
    }

    const salespoint = String(orderEntry.saleentry.salespoint || orderEntry.saledetail?.find((item) => item?.salespoint)?.salespoint || '').trim()
    if(!salespoint) {
        notification('Order salespoint is missing', 0)
        return false
    }

    openSalesFormTab()
    clearMissingOrderItemsNotice()
    salesid = ''

    if(did('salespointname')) {
        did('salespointname').value = salespoint
        try{
            await handlesalesdepartment()
        }catch(error){
            console.error('Unable to load salespoint inventory before editing order:', error)
        }
    }
    hidesalesterminal(false)
    if(!did('item-1')) emptysales()
    orderEditBatchId = batchid

    if(did('applyto')) {
        const applyto = String(orderEntry.saleentry.applyto || 'OTHERS').toUpperCase()
        if(applyto.includes('ROOM')) did('applyto').value = 'ROOMS'
        else if(applyto.includes('COST')) did('applyto').value = 'COST CENTER'
        else if(applyto.includes('PM')) did('applyto').value = 'PM'
        else did('applyto').value = 'OTHERS'
        await handlesalesapplyto()
    }

    const ownerValue = resolveOrderDetailsValue(orderEntry.saleentry, orderEntry.saledetail)
    applySalesOwnerToInputs(ownerValue)
    if(did('description')) did('description').value = normalizeDescriptionByApplyTo(
        String(orderEntry.saleentry.description || '').trim(),
        did('applyto')?.value || ''
    )
    if(did('transactiondate')) did('transactiondate').value = String(orderEntry.saleentry.transactiondate || '').slice(0, 10) || new Date().toISOString().split('T')[0]
    if(did('moredata')) did('moredata').value = normalizeOrderStatusValue(orderEntry.saleentry.moredata, true) || 'ORDER'
    if(did('billreferencecode')) did('billreferencecode').value = ''

    const details = orderEntry.saledetail.filter((item) => Number(item?.qty || 0) > 0)
    did('thetabledata').innerHTML = ''
    details.forEach((source, index) => {
        const rowId = index === 0 ? '1' : `ordedit${index + 1}`
        if(index === 0) {
            did('thetabledata').innerHTML = `
                <tr id="row-${rowId}">
                    <td class="s/n">1</td>
                    <td>
                        <label for="logoname" class="control-label hidden">Item</label>
                        <input autocomplete="off" onchange="checkdatalist(this);salesitempop(this,'${rowId}')" onblur="salesitempop(this,'${rowId}')" list="hems_itemslist" name="item" id="item-${rowId}" class="form-control iitem comp">
                        <input autocomplete="off" class="itemmerid hidden" id="itemer-${rowId}">
                        <input autocomplete="off" class="hidden" id="itemclass-${rowId}">
                    </td>
                    <td>
                        <div>
                            <p class="font-bold">Type:&nbsp;<span class="font-normal" id="type-${rowId}"></span></p>
                            <p class="font-bold">Unit:&nbsp;<span class="font-normal" id="unit-${rowId}"></span></p>
                            <p class="font-bold ${isOrderWorkspaceMode() ? 'hidden' : ''}">Stock&nbsp;Balance:&nbsp;<span class="font-normal" id="balance-${rowId}"></span></p>
                        </div>
                    </td>
                    <td>
                        <label for="logoname" class="control-label hidden">Price</label>
                    <input autocomplete="off" type="number" id="price-${rowId}" class="form-control comp pprice" onchange="calsaleqty('${rowId}')" placeholder="">
                    </td>
                    <td>
                        <label for="logoname" class="control-label hidden">Quantity</label>
                        <input autocomplete="off" type="number" id="qty-${rowId}" class="form-control comp qqty" onchange="calsaleqty('${rowId}')" placeholder="">
                    </td>
                    <td>
                        <label for="logoname" class="control-label hidden">Amount</label>
                        <input autocomplete="off" type="number" disabled id="amount-${rowId}" class="form-control ammount" placeholder="">
                    </td>
                    <td>
                        <button onclick="event.preventDefault();removesalesrow('${rowId}')" class="material-symbols-outlined rounded-full bg-red-500 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">remove</button>
                    </td>
                </tr>
            `
        } else {
            addsalesrow(rowId)
        }

        const inventoryItem = salesInventoryDatasource.find((inv) => {
            if(String(inv?.itemid || '') && String(source?.itemid || '')) return String(inv.itemid) === String(source.itemid)
            return String(inv?.itemname || '').trim().toLowerCase() === String(source?.itemname || '').trim().toLowerCase()
        }) || {}

        const qty = Number(source.qty || 0)
        const cost = Number(source.cost || inventoryItem.price || 0)
        const rowItemClass = source.itemclass || inventoryItem.itemclass || ''
        if(did(`item-${rowId}`)) did(`item-${rowId}`).value = String(source.itemname || inventoryItem.itemname || '').trim()
        if(did(`itemer-${rowId}`)) did(`itemer-${rowId}`).value = String(source.itemid || inventoryItem.itemid || '').trim()
        if(did(`itemclass-${rowId}`)) did(`itemclass-${rowId}`).value = rowItemClass
        if(did(`type-${rowId}`)) did(`type-${rowId}`).textContent = source.itemtype || source.type || inventoryItem.itemtype || ''
        if(did(`unit-${rowId}`)) did(`unit-${rowId}`).textContent = source.units || source.unit || inventoryItem.units || ''
        if(did(`balance-${rowId}`)) did(`balance-${rowId}`).textContent = isNonStockItemClass(rowItemClass) ? '999999999' : (inventoryItem.balance ?? source.balance ?? '')
        if(did(`price-${rowId}`)) did(`price-${rowId}`).value = cost
        if(did(`qty-${rowId}`)) did(`qty-${rowId}`).value = qty
        if(did(`amount-${rowId}`)) did(`amount-${rowId}`).value = cost * qty
        calsaleqty(rowId)
    })

    if(!details.length) emptysales()
    runCount()
    notification('Order loaded for editing', 1)
    return true
}

async function composeOrderToBill(orderEntry = null) {
    if(!orderEntry?.saleentry || !Array.isArray(orderEntry?.saledetail)) {
        notification('Invalid order data', 0)
        return false
    }

    const salespoint = String(orderEntry.saleentry.salespoint || orderEntry.saledetail?.find((item) => item?.salespoint)?.salespoint || '').trim()
    if(!salespoint) {
        notification('Order salespoint is missing', 0)
        return false
    }

    openSalesFormTab()
    clearMissingOrderItemsNotice()
    salesid = ''

    if(did('salespointname')) {
        did('salespointname').value = salespoint
        try{
            await handlesalesdepartment()
        }catch(error){
            console.error('Unable to load salespoint inventory before composing bill:', error)
        }
    }
    hidesalesterminal(false)
    if(!did('item-1')) emptysales()

    if(did('applyto')) {
        const applyto = String(orderEntry.saleentry.applyto || 'OTHERS').toUpperCase()
        if(applyto.includes('ROOM')) did('applyto').value = 'ROOMS'
        else if(applyto.includes('COST')) did('applyto').value = 'COST CENTER'
        else if(applyto.includes('PM')) did('applyto').value = 'PM'
        else did('applyto').value = 'OTHERS'
        await handlesalesapplyto()
    }

    const ownerValue = resolveOrderDetailsValue(orderEntry.saleentry, orderEntry.saledetail)
    applySalesOwnerToInputs(ownerValue)
    if(String(did('applyto')?.value || '').toUpperCase().includes('ROOM') && !String(did('owner')?.value || '').trim()) {
        const roomOwner = resolveRoomOwnerFromOrderEntry(orderEntry)
        if(roomOwner) applySalesOwnerToInputs(roomOwner)
    }
    if(did('description')) {
        const existingDescription = String(orderEntry.saleentry.description || '').trim()
        const orderRef = String(orderEntry.saleentry.reference || '').trim()
        const refTag = orderRef ? `Order Ref ${orderRef}` : ''
        const hasRefAlready = refTag && existingDescription.toLowerCase().includes(refTag.toLowerCase())
        const composedDescription = hasRefAlready
            ? existingDescription
            : [existingDescription, refTag].filter(Boolean).join(' | ')
        did('description').value = normalizeDescriptionByApplyTo(composedDescription, did('applyto')?.value || '')
    }
    if(did('transactiondate')) did('transactiondate').value = new Date().toISOString().split('T')[0]
    if(did('billreferencecode')) did('billreferencecode').value = ''
    const missingItems = []
    let loadedRows = 0

    for (let idx = 0; idx < orderEntry.saledetail.length; idx++) {
        const source = orderEntry.saledetail[idx] || {}
        const requestedQty = Number(source.qty || 0)
        if(requestedQty <= 0) continue

        const rowId = loadedRows === 0 ? '1' : `ord${loadedRows + 1}`
        if(loadedRows > 0) addsalesrow(rowId)

        const rowItemInput = did(`item-${rowId}`)
        if(!rowItemInput){
            missingItems.push({
                itemname: source.itemname || 'Unknown Item',
                requested: requestedQty,
                available: 0,
                missing: requestedQty
            })
            continue
        }

        const inventoryPool = salesInventoryDatasource
        const inventoryItem = inventoryPool.find((inv) => {
            if(String(inv?.itemid || '') && String(source?.itemid || '')){
                return String(inv.itemid) === String(source.itemid)
            }
            return String(inv?.itemname || '').trim().toLowerCase() === String(source?.itemname || '').trim().toLowerCase()
        }) || null

        const resolvedName = String(inventoryItem?.itemname || source.itemname || 'Unknown Item').trim() || 'Unknown Item'
        const resolvedItemId = String(inventoryItem?.itemid || source.itemid || '').trim()
        const resolvedType = String(inventoryItem?.itemtype || source.itemtype || source.type || '').trim()
        const resolvedItemClass = String(inventoryItem?.itemclass || source.itemclass || '').trim()
        const resolvedUnit = String(inventoryItem?.units || source.units || source.unit || '').trim()
        const resolvedPrice = Number(inventoryItem?.price || source.cost || 0)
        const availableQtyRaw = Number(inventoryItem ? (
            inventoryItem.balance ??
            inventoryItem.quantity ??
            inventoryItem.qty ??
            inventoryItem.stockbalance ??
            inventoryItem.instock ??
            0
        ) : 0)
        const availableQty = Math.max(availableQtyRaw, 0)
        const enforceStock = !isNonStockItemClass(resolvedItemClass)
        const finalQty = enforceStock ? Math.min(requestedQty, availableQty) : requestedQty

        if(did(`item-${rowId}`)) did(`item-${rowId}`).value = resolvedName
        if(did(`itemer-${rowId}`)) did(`itemer-${rowId}`).value = resolvedItemId
        if(did(`itemclass-${rowId}`)) did(`itemclass-${rowId}`).value = resolvedItemClass
        if(did(`type-${rowId}`)) did(`type-${rowId}`).textContent = resolvedType
        if(did(`unit-${rowId}`)) did(`unit-${rowId}`).textContent = resolvedUnit
        if(did(`balance-${rowId}`)) did(`balance-${rowId}`).textContent = enforceStock ? availableQty : '999999999'
        if(did(`price-${rowId}`)) did(`price-${rowId}`).value = resolvedPrice
        if(did(`qty-${rowId}`)) did(`qty-${rowId}`).value = finalQty
        if(did(`amount-${rowId}`)) did(`amount-${rowId}`).value = Number(resolvedPrice || 0) * Number(finalQty || 0)
        calsaleqty(rowId)

        if(finalQty <= 0){
            missingItems.push({
                itemname: resolvedName,
                requested: requestedQty,
                available: 0,
                added: 0,
                missing: requestedQty
            })
            if(loadedRows > 0) removesalesrow(rowId)
            else clearrow(rowId)
            continue
        }

        if(enforceStock && finalQty < requestedQty){
            missingItems.push({
                itemname: resolvedName,
                requested: requestedQty,
                available: availableQty,
                added: finalQty,
                missing: requestedQty - finalQty
            })
        }

        loadedRows++
    }

    if(loadedRows < 1){
        emptysales()
        showMissingOrderItemsNotice(missingItems)
        notification('No billable item from this order based on current stock', 0)
        return false
    }

    runCount()
    showMissingOrderItemsNotice(missingItems)
    if(missingItems.length) {
        const skipped = missingItems.filter((item) => Number(item.added || 0) <= 0).length
        const reduced = missingItems.length - skipped
        notification(`${missingItems.length} order item(s) adjusted by stock availability${skipped ? `; ${skipped} not added` : ''}${reduced ? `; ${reduced} reduced` : ''}.`, 0)
    }
    return true
}

async function composeOrderToBillByReference(reference = '') {
    const cleaned = String(reference || '').trim()
    if(!cleaned) return notification('Order reference is required', 0)
    if(orderBillGenerationLocks.get(cleaned)) return notification('Generate Bill already in progress for this order', 0)

    const orderEntry = orderRowsIndex.get(cleaned)
        || salesListingDatasource.find((entry) => String(entry?.saleentry?.reference || '') === cleaned)
    if(!orderEntry) return notification('Order not found in current list', 0)

    const batchid = String(orderEntry?.saleentry?.batchid || '').trim()
    if(!batchid) return notification('Order batch id is missing; unable to generate bill', 0)

    orderBillGenerationLocks.set(cleaned, true)
    try{
        const statusUpdated = await updateOrderStatusInternal(batchid, 'FILLED', null, { silent: true, suppressRender: true })
        if(!statusUpdated){
            notification('Unable to update order status to FILLED. Bill generation stopped.', 0)
            return
        }

        const refreshedOrderEntry = orderRowsIndex.get(cleaned)
            || salesListingDatasource.find((entry) => String(entry?.saleentry?.reference || '') === cleaned)
            || orderEntry
        sessionStorage.setItem('pendingOrderToBillData', JSON.stringify(refreshedOrderEntry))
        renderCurrentSalesDatasource()

        const billsNav = did('bills')
        if(billsNav){
            billsNav.click()
            return
        }
        window.location.href = 'index.php?r=bills'
    } finally {
        orderBillGenerationLocks.delete(cleaned)
    }
}

async function editOrderByBatch(batchid = '') {
    const cleanedBatchId = String(batchid || '').trim()
    if(!cleanedBatchId) return notification('Order batch id is required for edit', 0)
    const orderEntry = orderRowsIndex.get(cleanedBatchId) || findOrderEntryByBatchOrReference(cleanedBatchId)
    if(!orderEntry) return notification('Order not found in current list', 0)
    await loadOrderIntoForm(orderEntry)
}

function normalizeOrderItemType(value = '') {
    return String(value || '').trim().toUpperCase()
}

function isFoodOrderItem(item = {}) {
    return normalizeOrderItemType(item.itemtype || item.type || item.itemclass) === 'FOOD'
}

function getOrderKitchenStorageKey(reference = '') {
    const cleaned = String(reference || '').trim()
    return cleaned ? `orderKitchenSent:${cleaned}` : ''
}

function isOrderKitchenSent(reference = '') {
    const key = getOrderKitchenStorageKey(reference)
    return !!(key && localStorage.getItem(key) === '1')
}

function markOrderKitchenSent(reference = '') {
    const key = getOrderKitchenStorageKey(reference)
    if(key) localStorage.setItem(key, '1')
}

function getOrderFoodItems(orderEntry = {}) {
    return (Array.isArray(orderEntry?.saledetail) ? orderEntry.saledetail : []).filter(isFoodOrderItem)
}

function orderHasFoodItems(orderEntry = {}) {
    return getOrderFoodItems(orderEntry).length > 0
}

function buildKitchenRowsFromReceiptRows(rows = []) {
    const foodRows = (Array.isArray(rows) ? rows : []).filter(isFoodOrderItem)
    if(!foodRows.length) return []
    const kitchenTotal = foodRows.reduce((sum, row) => sum + (Number(row.qty || 0) * Number(row.cost || 0)), 0)
    return foodRows.map((row) => ({
        ...row,
        totalamount: kitchenTotal,
        moredata: 'ORDER',
        moredetails: 'ORDER',
        status: 'ORDER',
        kitchenprint: '1'
    }))
}

function buildKitchenRowsFromOrderEntry(orderEntry = {}) {
    const saleEntry = orderEntry.saleentry || {}
    const rows = getOrderFoodItems(orderEntry).map((detail) => ({
        reference: saleEntry.reference || '',
        ownerdetail: saleEntry.ownerdetail ?? saleEntry.ownerid,
        owner: saleEntry.ownerid,
        ownerid: saleEntry.ownerid,
        totalamount: saleEntry.servicecharge || 0,
        amountpaid: orderEntry.amountreceived || 0,
        amountreceived: orderEntry.amountreceived || 0,
        paymentmethod: saleEntry.paymentmethod || '',
        transactiondate: saleEntry.transactiondate || '',
        moredata: 'ORDER',
        moredetails: 'ORDER',
        status: 'ORDER',
        ttype: saleEntry.ttype || 'ORDER',
        description: saleEntry.description || detail.description || '',
        comment: saleEntry.description || detail.description || '',
        itemid: detail.itemid || '',
        itemname: detail.itemname || '',
        itemtype: detail.itemtype || detail.type || '',
        qty: Number(detail.qty || 0),
        cost: Number(detail.cost || 0)
    }))
    return buildKitchenRowsFromReceiptRows(rows)
}

function printFullOrderByReference(reference = '') {
    const cleaned = String(reference || '').trim()
    if(!cleaned) return notification('Order reference is required', 0)
    const cachedRows = orderKitchenReceiptCache.get(cleaned) || []
    if(Array.isArray(cachedRows) && cachedRows.length) {
        return printsalesreceiptsales(cleaned, '', 'fetchorders.php', false, false, false, cachedRows)
    }
    const orderEntry = orderRowsIndex.get(cleaned)
        || salesListingDatasource.find((entry) => String(entry?.saleentry?.reference || '') === cleaned || String(entry?.saleentry?.batchid || '') === cleaned)
    if(orderEntry) {
        const saleEntry = orderEntry.saleentry || {}
        const rows = (Array.isArray(orderEntry.saledetail) ? orderEntry.saledetail : []).map((detail) => ({
            reference: saleEntry.reference || cleaned,
            ownerdetail: saleEntry.ownerdetail ?? saleEntry.ownerid,
            owner: saleEntry.ownerid,
            ownerid: saleEntry.ownerid,
            totalamount: saleEntry.servicecharge || saleEntry.totalamount || 0,
            amountpaid: orderEntry.amountreceived || saleEntry.amountpaid || 0,
            amountreceived: orderEntry.amountreceived || saleEntry.amountpaid || 0,
            paymentmethod: saleEntry.paymentmethod || '',
            transactiondate: saleEntry.transactiondate || '',
            moredata: 'ORDER',
            moredetails: 'ORDER',
            status: 'ORDER',
            ttype: saleEntry.ttype || 'ORDER',
            description: saleEntry.description || detail.description || '',
            comment: saleEntry.description || detail.description || '',
            itemid: detail.itemid || '',
            itemname: detail.itemname || '',
            itemtype: detail.itemtype || detail.type || '',
            qty: Number(detail.qty || 0),
            cost: Number(detail.cost || 0)
        }))
        if(rows.length) return printsalesreceiptsales(cleaned, '', 'fetchorders.php', false, false, false, rows)
    }
    return printsalesreceiptsales(cleaned, '', 'fetchorders.php', false, false)
}

function printKitchenOrderByReference(reference = '') {
    const cleaned = String(reference || '').trim()
    if(!cleaned) return notification('Order reference is required', 0)
    const orderEntry = orderRowsIndex.get(cleaned)
        || salesListingDatasource.find((entry) => String(entry?.saleentry?.reference || '') === cleaned || String(entry?.saleentry?.batchid || '') === cleaned)
    const kitchenRows = orderEntry
        ? buildKitchenRowsFromOrderEntry(orderEntry)
        : buildKitchenRowsFromReceiptRows(orderKitchenReceiptCache.get(cleaned) || [])
    if(!kitchenRows.length) return notification('No food item found for this order', 0)
    markOrderKitchenSent(kitchenRows[0].reference || cleaned)
    renderCurrentSalesDatasource()
    return printsalesreceiptsales(kitchenRows[0].reference || cleaned, '', 'fetchorders.php', false, false, false, kitchenRows)
}

function buildReceiptRowsFromForm(reference = '', ttype = '') {
    const rows = []
    const tableRows = did('thetabledata')?.querySelectorAll('tr') || []
    const ownerValue = String(resolveSalesOwnerPayloadValue() || '').trim()
    const totalAmountValue = Number(did('totalamount')?.value || did('totalamountt')?.textContent || 0)
    const amountPaidValue = Number(did('amountpaid')?.value || 0)
    const paymentMethodValue = String(did('paymentmethod')?.value || '').trim()
    const transactionDateValue = String(did('transactiondate')?.value || new Date().toISOString().slice(0, 10))
    const moreDataValue = String(did('moredata')?.value || did('status')?.value || ttype || '').trim()
    const descriptionValue = String(did('description')?.value || '').trim()
    const discountContext = getChairmanDiscountContext(totalAmountValue, paymentMethodValue)
    const effectiveTotalAmount = discountContext.applies ? discountContext.netTotal : totalAmountValue

    tableRows.forEach((row) => {
        const itemInput = row.querySelector('.iitem')
        const itemIdInput = row.querySelector('.itemmerid')
        const qtyInput = row.querySelector('.qqty')
        const costInput = row.querySelector('.pprice')
        const itemName = String(itemInput?.value || '').trim()
        const itemType = String(row.querySelector('[id^="type-"]')?.textContent || row.querySelector('[id^="itemclass-"]')?.value || '').trim()
        const qty = Number(qtyInput?.value || 0)
        const cost = Number(costInput?.value || 0)
        if(!itemName || qty <= 0) return
        rows.push({
            reference: String(reference || '').trim(),
            ownerdetail: ownerValue || '-1',
            owner: ownerValue || '-1',
            ownerid: ownerValue || '-1',
            totalamount: Number.isFinite(effectiveTotalAmount) ? effectiveTotalAmount : 0,
            grosstotal: discountContext.applies ? discountContext.grossTotal : 0,
            discountamount: discountContext.applies ? discountContext.discountAmount : 0,
            amountpaid: Number.isFinite(amountPaidValue) ? amountPaidValue : 0,
            amountreceived: Number.isFinite(amountPaidValue) ? amountPaidValue : 0,
            paymentmethod: paymentMethodValue,
            transactiondate: transactionDateValue,
            moredata: moreDataValue,
            moredetails: moreDataValue,
            status: moreDataValue,
            ttype: ttype || '',
            description: descriptionValue,
            comment: descriptionValue,
            itemid: String(itemIdInput?.value || '').trim(),
            itemname: itemName,
            itemtype: itemType,
            qty,
            cost
        })
    })
    return rows
}

async function salesFormSubmitHandler(ttype = '', triggerButton = null) {
    if(salesSubmissionInFlight) return notification('Processing previous request, please wait...', 0)
    salesSubmissionInFlight = true
    setSalesActionButtonsState(true)
    try {
        const requiredFields = getIdFromCls('comp').filter(id => !['amountpaid', 'paymentmethod'].includes(id))
        if(!validateForm('salesform', requiredFields))return notification('Please Ensure all compulsory fields are filled', 0)
        if(!isOrderWorkspaceMode() && !isBillsWorkspaceMode() && !validatePaymentMethodForAmount()) return
        if(!await validateRestrictedSalesPaymentPermission()) return
        let t = true
        for(let i=0;i<document.getElementsByClassName('qqty').length;i++){
            if(document.getElementsByClassName('qqty')[i].value < 1)t = false;
        }
        if(!t)return notification('Please one or more quantity values are invalid', 0)
        
        preparesalesvalues()

        const applyto = String(did('applyto')?.value || '').trim().toUpperCase()
        if(!isOrderWorkspaceMode() && !isBillsWorkspaceMode() && applyto.includes('PM') && Number(did('amountpaid')?.value || 0) > 0){
            if(did('amountpaid')) did('amountpaid').value = ''
            return notification('Amount Paid is not allowed for PM. Leave it empty to deduct from PM folio.', 0)
        }
        if(did('description')){
            did('description').value = normalizeDescriptionByApplyTo(did('description').value, applyto)
        }
        
        const ownerPayloadValue = resolveSalesOwnerPayloadValue()
        if(did('owner')) did('owner').value = ownerPayloadValue
        let payload
        payload = getFormData2(document.querySelector('#salesform'), salesid ? [['id', salesid], ['rowsize', document.getElementsByClassName('pprice').length]] : [['rowsize', document.getElementsByClassName('pprice').length]])
        payload.set('ownerdetail', ownerPayloadValue || '-1')
        payload.set('owner', ownerPayloadValue || '-1')
        const sourceBillForSale = (!isOrderWorkspaceMode() && !isBillsWorkspaceMode() && ttype !== 'ORDER' && ttype !== 'BILL')
            ? {
                ...(sourceSalesBillContext || {}),
                reference: sourceSalesBillContext?.reference || String(did('billreferencecode')?.value || '').trim()
            }
            : null
        if(sourceBillForSale?.reference) payload.set('sourcebillreference', sourceBillForSale.reference)
        if(sourceBillForSale?.batchid) payload.set('sourcebillbatchid', sourceBillForSale.batchid)
        if(sourceBillForSale?.id) payload.set('sourcebillid', sourceBillForSale.id)
        if(ttype)payload.set('ttype', ttype)
        if((isOrderWorkspaceMode() || ttype === 'ORDER') && orderEditBatchId) payload.set('batchid', orderEditBatchId)
        if(!isOrderWorkspaceMode() && !isBillsWorkspaceMode() && ttype !== 'ORDER' && ttype !== 'BILL') appendReceivingBankMoreData(payload)
        if(isOrderWorkspaceMode() || ttype === 'ORDER' || isBillsWorkspaceMode() || ttype === 'BILL'){
            payload.delete('amountpaid')
            payload.delete('paymentmethod')
        } else {
            const salesDiscountContext = getChairmanDiscountContext(Number(did('totalamount')?.value || 0), did('paymentmethod')?.value || '')
            if(salesDiscountContext.applies) {
                payload.set('totalamount', salesDiscountContext.netTotal)
            }
        }
        let request = await httpRequest2('../controllers/salescript', payload, triggerButton || document.querySelector('#salesform #submit'))
        if(request.status) {
            clearMissingOrderItemsNotice()
            notification(`${ttype == 'BILL' ? 'Bill' : ttype == 'ORDER' ? 'Order' : 'Record'} saved successfully!`, 1);
            if(ttype === 'BILL') {
                printsalesreceiptsales(request.reference, '', 'fetchsalesbillsonly.php', true, true)
                if(typeof queueUnsettledBillsRefresh === 'function') queueUnsettledBillsRefresh()
            }
            else if(ttype === 'ORDER'){
                const orderReceiptRows = buildReceiptRowsFromForm(request.reference, 'ORDER')
                printsalesreceiptsales(request.reference, '', 'fetchorders.php', true, true, false, orderReceiptRows)
            }
            else {
                if(sourceBillForSale?.batchid || sourceBillForSale?.reference) await markSourceSalesBillFilled(sourceBillForSale)
                printsalesreceiptsales(request.reference, '', 'fetchsalesbyreference', true, false)
            }
            if(isBillsWorkspaceMode()) fetchsalesbills()
            if(isOrderWorkspaceMode()) {
                orderEditBatchId = ''
                fetchsales()
            }
            return
        }
        fetchsales();
        return notification(request.message, 0);
    } finally {
        salesSubmissionInFlight = false
        setSalesActionButtonsState(false)
    }
}

function emptysales(){
    orderEditBatchId = ''
    sourceSalesBillContext = null
    const itemInputMarkup = `<input autocomplete="off" onchange="checkdatalist(this);salesitempop(this,'1')" onblur="salesitempop(this,'1')" list="hems_itemslist" name="item" id="item-1" class="form-control iitem comp">`
    did('thetabledata').innerHTML = `
                                            <tr id="row-919">
                                                <td class="s/n">1</td>
                                                <td class="">  
                                                    <label for="logoname" class="control-label hidden">Item</label>
                                                    ${itemInputMarkup}
                                                    <input autocomplete="off" class="itemmerid hidden" id="itemer-1">
                                                    <input autocomplete="off" class="hidden" id="itemclass-1">
                                                </td>
                                                <td style="">
                                                    <div class="">
                                                        <p class="font-bold">Type:&nbsp;<span class="font-normal" id="type-1"></span></p>
                                                        <p class="font-bold">Unit:&nbsp;<span class="font-normal" id="unit-1"></span></p>
                                                        <p class="font-bold ${isOrderWorkspaceMode() ? 'hidden' : ''}">Stock&nbsp;Balance:&nbsp;<span class="font-normal" id="balance-1"></span></p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <label for="logoname" class="control-label hidden">Price</label>
                                                    <input autocomplete="off" type="number"  name="" id="price-1" class="form-control comp pprice" onchange="calsaleqty('1')" placeholder="">
                                                </td>
                                                <td>
                                                    <label for="logoname" class="control-label hidden">Quantity</label>
                                                    <input autocomplete="off" type="number"  name="" id="qty-1" class="form-control comp qqty" onchange="calsaleqty('1')" placeholder="">
                                                </td>
                                                <td>
                                                    <label for="logoname" class="control-label hidden">Amount</label>
                                                    <input autocomplete="off" type="number" disabled name="" id="amount-1" class="form-control ammount" placeholder="">
                                                </td>
                                                <td>
                                                    <button onclick="event.preventDefault();removesalesrow('919')" class="material-symbols-outlined rounded-full bg-red-500 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">remove</button>
                                                </td>
                                            </tr>
                                        `
    if(isOrderWorkspaceMode()) relaxOrderItemInputs()
    did('owner1').value = '';
    did('owner').value = '';
    did('description').value = '';
    did('amountpaid').value = '';
    renderSalesTotalSummary(0);
    clearMissingOrderItemsNotice()
    if(did('billreferencecode')) did('billreferencecode').value = ''
}

async function fetchsalesviewreport() {
    const filterForm = did('salesviewfilterform')
    const submitButton = did('salesviewsubmit')
    const payload = filterForm ? new FormData(filterForm) : null
    if(payload && isOrderWorkspaceMode()) payload.append('ttype', 'ORDER')

    let request = await httpRequest2(isOrderWorkspaceMode() ? '../controllers/fetchorders.php' : '../controllers/fetchsales', payload, submitButton, 'json')
    document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(request.data.length) {
            salesListingDatasource = isOrderWorkspaceMode()
                ? normalizeOrdersForSalesTable(request.data)
                : normalizeSalesRowsForTable(request.data)
            renderCurrentSalesDatasource()
            return notification(request.message || 'Records retrieved', 1)
        }
    }
    salesListingDatasource = []
    renderCurrentSalesDatasource()
    return notification('No records retrieved')
}

async function updateOrderStatusInternal(batchid = '', newStatus = '', control = null, options = {}) {
    const cleanedBatchId = String(batchid || '').trim()
    const statusValue = normalizeOrderStatusValue(newStatus, true)
    if(!cleanedBatchId || !statusValue) return false

    const payload = new FormData()
    payload.append('batchid', cleanedBatchId)
    payload.append('status', statusValue)
    const request = await httpRequest2('../controllers/salescript', payload, control, 'json', { lightweight: !!options.lightweight })
    if(!request.status){
        if(!options.silent) notification(request.message || 'Unable to update status', 0)
        if(control) control.value = ''
        return false
    }

    salesListingDatasource = salesListingDatasource.map((entry) => {
        if(String(entry?.saleentry?.batchid || '') !== cleanedBatchId) return entry
        const updatedEntry = {
            ...entry,
            saleentry: {
                ...entry.saleentry,
                moredata: statusValue
            }
        }
        const refKey = String(updatedEntry?.saleentry?.reference || '').trim()
        if(refKey) orderRowsIndex.set(refKey, updatedEntry)
        orderRowsIndex.set(cleanedBatchId, updatedEntry)
        return updatedEntry
    })

    return true
}

async function updateOrderStatus(batchid = '', newStatus = '', control = null, reopenReference = '') {
    const statusUpdated = await updateOrderStatusInternal(batchid, newStatus, control, { silent: false })
    if(!statusUpdated) return

    renderCurrentSalesDatasource()
    if(reopenReference){
        openSalesReportModal(reopenReference, '', true)
    }
    notification('Order status updated successfully', 1)
}

function removeSalesEntryPending(reference = '') {
    return notification(`Delete controller pending for sales reference ${reference || ''}`, 0)
}

function openSalesBillDetails(reference = '') {
    const cleanedReference = String(reference || '').trim()
    if(!cleanedReference) return notification('Bill reference is required', 0)
    return printsalesreceiptsales(cleanedReference, '', 'fetchsalesbillsonly.php', false, true)
}

async function removeBillEntry(batchid = '') {
    const cleanedBatchId = String(batchid || '').trim()
    if(!cleanedBatchId) return notification('Unable to delete: bill batch id is missing', 0)
    let confirmed = false
    if(typeof Swal !== 'undefined'){
        const response = await Swal.fire({
            title: 'Delete Bill?',
            html: `<p style="font-size:13px;color:#475569;">This action will permanently remove the selected bill record.</p>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'swal-bill-delete-confirm',
                cancelButton: 'swal-bill-delete-cancel'
            },
            reverseButtons: true,
            focusCancel: true,
            didOpen: () => {
                const confirmBtn = document.querySelector('.swal-bill-delete-confirm')
                const cancelBtn = document.querySelector('.swal-bill-delete-cancel')
                if(confirmBtn){
                    confirmBtn.style.setProperty('background-color', '#dc2626', 'important')
                    confirmBtn.style.setProperty('color', '#ffffff', 'important')
                    confirmBtn.style.setProperty('border', 'none', 'important')
                    confirmBtn.style.setProperty('padding', '10px 16px', 'important')
                    confirmBtn.style.setProperty('border-radius', '8px', 'important')
                }
                if(cancelBtn){
                    cancelBtn.style.setProperty('background-color', '#64748b', 'important')
                    cancelBtn.style.setProperty('color', '#ffffff', 'important')
                    cancelBtn.style.setProperty('border', 'none', 'important')
                    cancelBtn.style.setProperty('padding', '10px 16px', 'important')
                    cancelBtn.style.setProperty('border-radius', '8px', 'important')
                    cancelBtn.style.setProperty('margin-right', '8px', 'important')
                }
            }
        })
        confirmed = !!response.isConfirmed
    } else {
        confirmed = window.confirm('Are you sure you want to delete this bill?')
    }
    if(!confirmed) return

    const payload = new FormData()
    payload.append('batchid', cleanedBatchId)
    payload.append('status', 'DELETED')
    const request = await httpRequest2('../controllers/removesalesbill.php', payload, null, 'json')
    if(request.status){
        notification(request.message || 'Bill deleted successfully', 1)
        fetchsalesbills()
        fetchsales()
        if(typeof queueUnsettledBillsRefresh === 'function') queueUnsettledBillsRefresh()
        return
    }
    return notification(request.message || 'Unable to delete bill', 0)
}

function resetSalesAfterReceipt() {
    salesid = null
    const form = did('salesform')
    if(form) form.reset()
    emptysales()
    if(did('salespointname') && typeof default_department !== 'undefined' && default_department) did('salespointname').value = default_department
    handlesalesdepartment(default_department || did('salespointname')?.value || '')
    fetchsales()
    if(isBillsWorkspaceMode()) fetchsalesbills()
}

function resetOrderFormAfterModalClose() {
    if(!isOrderWorkspaceMode()) return
    const form = did('salesform')
    if(form) form.reset()
    emptysales()
    if(did('salespointname') && typeof default_department !== 'undefined' && default_department) {
        did('salespointname').value = default_department
    }
    handlesalesdepartment(default_department || did('salespointname')?.value || '')
}

function closeSalesReportModal() {
    if(did('salesreportmodal')) did('salesreportmodal').classList.add('hidden')
    resetOrderFormAfterModalClose()
}

function closeSalesReceiptModal() {
    if(did('receiptsalesmodal')) did('receiptsalesmodal').classList.add('hidden')
    if(salesReceiptResetOnClose) resetSalesAfterReceipt()
    else resetOrderFormAfterModalClose()
    salesReceiptResetOnClose = true
}


async function printsalesreceiptsales(ref, room='', salesFetchController='fetchsalesbyreference', resetOnClose=true, showSignatures=false, preferLocal=false, rowsOverride=null){
    let rm = false
    if(room)rm = true
    if(!ref)return
    salesReceiptResetOnClose = !!resetOnClose
    let tt = 0;
    let rows = Array.isArray(rowsOverride) && rowsOverride.length ? rowsOverride : null
    if(preferLocal && !room){
        const localData = salesListingDatasource.find(dat=>String(dat?.saleentry?.reference || '') == String(ref))
        if(localData){
            rows = (localData.saledetail || []).map((detail) => ({
                reference: localData.saleentry.reference || ref,
                ownerdetail: localData.saleentry.ownerdetail ?? localData.saleentry.ownerid,
                owner: localData.saleentry.ownerid,
                ownerid: localData.saleentry.ownerid,
                totalamount: localData.saleentry.servicecharge || 0,
                amountpaid: localData.amountreceived || 0,
                amountreceived: localData.amountreceived || 0,
                paymentmethod: localData.saleentry.paymentmethod || '',
                transactiondate: localData.saleentry.transactiondate || '',
                moredata: localData.saleentry.moredata || '',
                moredetails: localData.saleentry.moredata || '',
                status: localData.saleentry.moredata || '',
                ttype: localData.saleentry.ttype || '',
                description: localData.saleentry.description || detail.description || '',
                comment: localData.saleentry.description || detail.description || '',
                itemid: detail.itemid || '',
                itemname: detail.itemname || '',
                itemtype: detail.itemtype || detail.type || '',
                qty: Number(detail.qty || 0),
                cost: Number(detail.cost || 0)
            }))
            if(!rows.length){
                rows = [{
                    reference: localData.saleentry.reference || ref,
                    ownerdetail: localData.saleentry.ownerdetail ?? localData.saleentry.ownerid,
                    owner: localData.saleentry.ownerid,
                    ownerid: localData.saleentry.ownerid,
                    totalamount: localData.saleentry.servicecharge || 0,
                    amountpaid: localData.amountreceived || 0,
                    amountreceived: localData.amountreceived || 0,
                    paymentmethod: localData.saleentry.paymentmethod || '',
                    transactiondate: localData.saleentry.transactiondate || '',
                    moredata: localData.saleentry.moredata || '',
                    moredetails: localData.saleentry.moredata || '',
                    status: localData.saleentry.moredata || '',
                    ttype: localData.saleentry.ttype || '',
                    description: localData.saleentry.description || '',
                    comment: localData.saleentry.description || ''
                }]
            }
        }
    }
        function getparamm() {
            let paramstr = new FormData();
            if(!room)paramstr.append('reference', ref);
            return paramstr;
        }
        if(!rows){
            let request = await httpRequest2(`../controllers/${!room ? salesFetchController : 'fetchroomtransactionhistory'}`, getparamm(), null, 'json');
            if(!request.status) return
            rows = request.data || []
        }
        if(rows && rows.length){
            const firstRow = rows[0] || {}
            const orderPrintMode = salesFetchController === 'fetchorders.php'
                || String(firstRow.moredata || firstRow.moredetails || '').toUpperCase() === 'ORDER'
            const kitchenPrintMode = String(firstRow.kitchenprint || '') === '1'
            const documentTypeLabel = kitchenPrintMode ? 'KITCHEN ORDER' : (orderPrintMode ? 'ORDER' : 'BILL')
            const ownerText = resolveReceiptOwnerDisplay(rows)
            const shouldShowOwner = true
            if(orderPrintMode && !kitchenPrintMode) {
                orderKitchenReceiptCache.set(String(ref || firstRow.reference || '').trim(), rows)
            }
            const effectiveReference = String(ref || firstRow.reference || '').trim()
            const hasKitchenRows = buildKitchenRowsFromReceiptRows(rows).length > 0
            const shouldShowKitchenButton = orderPrintMode && hasKitchenRows
            const shouldShowFullOrderButton = orderPrintMode
            const receiptDescription = String(
                firstRow.description
                || firstRow.comment
                || rows.find((row) => String(row.description || row.comment || '').trim())?.description
                || rows.find((row) => String(row.description || row.comment || '').trim())?.comment
                || ''
            ).trim()
            const chairmanDiscountMode = !orderPrintMode && String(firstRow.paymentmethod || '').trim().toUpperCase() === 'CHAIRMAN DISCOUNT'
            const chairmanNetTotal = Number(firstRow.totalamount || 0)
            const chairmanGrossTotal = chairmanDiscountMode
                ? Number(firstRow.grosstotal || (chairmanNetTotal / (1 - CHAIRMAN_DISCOUNT_RATE)))
                : 0
            const chairmanDiscountAmount = chairmanDiscountMode
                ? Number(firstRow.discountamount || (chairmanGrossTotal * CHAIRMAN_DISCOUNT_RATE))
                : 0
            const shouldShowSignatures = !orderPrintMode && !!showSignatures
            did('displaydetails').innerHTML = `<img src="../images/${did('your_companylogo').value}" alt="chippz" style="width: 70px" class="mx-auto w-16 py-4" />
                                    <div class="flex flex-col justify-center items-center gap-2">
                                        <h4 class="font-semibold">${did('your_companyname').value}</h4>
                                        <p class="text-xs">${did('your_companyaddress').value}</p>
                                        <p class="text-[11px] font-bold tracking-[0.2em] uppercase border border-slate-300 px-3 py-1 rounded">${documentTypeLabel}</p>
                                        ${orderPrintMode ? `<div class="mt-1 flex flex-wrap items-center justify-center gap-2">
                                            ${shouldShowFullOrderButton ? `<button type="button" onclick="printFullOrderByReference('${effectiveReference.replace(/'/g, "\\'")}')" class="rounded bg-blue-600 px-3 py-1 text-[11px] font-semibold text-white shadow">Print Full Order</button>` : ''}
                                            ${shouldShowKitchenButton ? `<button type="button" onclick="printKitchenOrderByReference('${effectiveReference.replace(/'/g, "\\'")}')" class="rounded bg-rose-600 px-3 py-1 text-[11px] font-semibold text-white shadow">Print Kitchen Order</button>` : ''}
                                        </div>` : ''}
                                    </div>
                                    <div class="flex flex-col gap-3 border-b py-6 text-xs">
                                      <p class="flex justify-between">
                                        <span class="text-gray-400">${orderPrintMode ? 'Order Ref.:' : 'Receipt No.:'}</span>
                                        <span>${rows[0].reference}</span>
                                      </p>
                                      ${shouldShowOwner ? `<p class="flex justify-between">
                                        <span class="text-gray-400">${orderPrintMode ? 'Order Details:' : 'Invoice / Receipt To:'}</span>
                                        <span>${ownerText}</span>
                                      </p>` : ''}
                                      ${chairmanDiscountMode ? `
                                      <p class="flex justify-between">
                                        <span class="text-gray-400">Gross Total:</span>
                                        <span>${formatNumber(chairmanGrossTotal || 0)}</span>
                                      </p>
                                      <p class="flex justify-between">
                                        <span class="text-gray-400">Discount (50%):</span>
                                        <span>-${formatNumber(chairmanDiscountAmount || 0)}</span>
                                      </p>
                                      <p class="flex justify-between">
                                        <span class="text-gray-400">Final Total:</span>
                                        <span class="">${formatNumber(chairmanNetTotal || 0)}</span>
                                      </p>
                                      ` : `
                                      <p class="flex justify-between">
                                        <span class="text-gray-400">Total Amount:</span>
                                        <span class="">${formatNumber(rows[0].totalamount || 0)}</span>
                                      </p>
                                      `}
                                      ${orderPrintMode ? '' : `<p class="flex justify-between">
                                        <span class="text-gray-400">Amount Paid:</span>
                                        <span>${formatNumber(rows[0].amountpaid || rows[0].amountreceived || 0)}</span>
                                      </p>`}
                                      <p class="flex justify-between">
                                        <span class="text-gray-400">${orderPrintMode ? 'Status:' : 'Payment Method:'}</span>
                                        <span>${orderPrintMode ? (rows[0].moredata || rows[0].moredetails || rows[0].status || '') : (rows[0].paymentmethod || '')}${chairmanDiscountMode ? ' | 50% discount was applied' : ''}</span>
                                      </p>
                                      <p class="flex justify-between">
                                        <span class="text-gray-400">Transaction Date:</span>
                                        <span>${specialformatDateTime(rows[0].transactiondate)}</span>
                                      </p>
                                      <p class="flex justify-between gap-3 items-start">
                                        <span class="text-gray-400">Comments:</span>
                                        <span class="text-right break-words max-w-[65%]">${receiptDescription || '-'}</span>
                                      </p>
                                    </div>
                                    <div class="flex flex-col gap-3 pb-6 pt-2 text-[10px] w-full overflow-x-auto">
                                      <table class="w-full text-left border-collapse" style="font-size: 10px;">
                                        <thead>
                                          ${!rm ? `<tr class="border-b">
                                            <th class="py-1 px-1 text-center" style="min-width: 36px; max-width: 42px;">s/n</th>
                                            <th class="py-1 px-1 text-left" style="min-width: 80px; max-width: 120px;">Product</th>
                                            <th class="py-1 px-1 text-right" style="min-width: 35px; max-width: 45px;">QTY</th>
                                            <th class="py-1 px-1 text-right" style="min-width: 50px; max-width: 70px;">Price</th>
                                            <th class="py-1 px-1 text-right" style="min-width: 60px; max-width: 80px;">Total</th>
                                          </tr>` : `<tr class="border-b">
                                                <th class="py-1 px-1 text-left" style="font-size: 10px;">item</th>
                                                <th class="py-1 px-1 text-right" style="font-size: 10px;">debit</th>
                                                <th class="py-1 px-1 text-right" style="font-size: 10px;">credit</th>
                                                <th class="py-1 px-1 text-right" style="font-size: 10px;">balance</th>
                                          </tr>`}
                                        </thead>
                                        <tbody>
                                            ${!rm && rows.length > 0 && rows[0].ttype != 'ROOMS' 
                                              ? rows.map((dat, i) => {tt=tt+(Number(dat.qty) * Number(dat.cost)); return`
                                                  <tr class="border-b">
                                                      <td class="py-1 px-1 text-center" style="font-size: 10px; min-width: 36px; max-width: 42px;">${i+1}</td>
                                                      <td class="py-1 px-1" style="font-size: 10px; word-break: break-word; max-width: 120px;">${dat.itemname || ''}</td> 
                                                      <td class="py-1 px-1 text-right" style="font-size: 10px;">${formatNumber(dat.qty || 0)}</td>
                                                      <td class="py-1 px-1 text-right" style="font-size: 10px;">${formatNumber(dat.cost || 0)}</td>
                                                      <td class="py-1 px-1 text-right" style="font-size: 10px;">${formatNumber(Number(dat.qty || 0) * Number(dat.cost || 0))}</td>
                                                  </tr>
                                                `}).join('') 
                                              : ''}
                                            
                                            ${!rm && rows.length > 0 && rows[0].ttype != 'ROOMS'
                                              ? `
                                                  <tr class="border-t-2 border-gray-800 font-bold">
                                                      <td class="py-1 px-1" style="font-size: 10px;">TOTAL</td>
                                                      <td class="py-1 px-1" style="font-size: 10px;"></td>
                                                      <td class="py-1 px-1" style="font-size: 10px;"></td>
                                                      <td class="py-1 px-1" style="font-size: 10px;"></td>
                                                      <td class="py-1 px-1 text-right aftertotal" style="font-size: 10px;"></td>
                                                  </tr>
                                                `
                                              : ''}

                                        </tbody>
                                      </table>
                                      <div class=" border-b border border-dashed"></div>
                                      ${shouldShowSignatures ? `<div class="pt-5 pb-3 text-xs">
                                        <div class="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                                          <p class="text-[11px] tracking-[0.2em] text-slate-500 uppercase mb-3 font-semibold">Authorization Signatures</p>
                                          <div class="grid grid-cols-2 gap-6">
                                            <div class="flex flex-col gap-1">
                                              <p class="text-slate-600 font-medium">Customer Signature</p>
                                              <div class="h-10 border-b-2 border-slate-400"></div>
                                              <p class="text-[10px] text-slate-400">Name / Date</p>
                                            </div>
                                            <div class="flex flex-col gap-1">
                                              <p class="text-slate-600 font-medium">Salesperson Signature</p>
                                              <div class="h-10 border-b-2 border-slate-400"></div>
                                              <p class="text-[10px] text-slate-400">Name / Date</p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>` : ``}
                                      <div class="py-4 justify-center items-center flex flex-col gap-2">
                                        <p class="flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21.3 12.23h-3.48c-.98 0-1.85.54-2.29 1.42l-.84 1.66c-.2.4-.6.65-1.04.65h-3.28c-.31 0-.75-.07-1.04-.65l-.84-1.65a2.567 2.567 0 0 0-2.29-1.42H2.7c-.39 0-.7.31-.7.7v3.26C2 19.83 4.18 22 7.82 22h8.38c3.43 0 5.54-1.88 5.8-5.22v-3.85c0-.38-.31-.7-.7-.7ZM12.75 2c0-.41-.34-.75-.75-.75s-.75.34-.75.75v2h1.5V2Z" fill="#000"></path><path d="M22 9.81v1.04a2.06 2.06 0 0 0-.7-.12h-3.48c-1.55 0-2.94.86-3.63 2.24l-.75 1.48h-2.86l-.75-1.47a4.026 4.026 0 0 0-3.63-2.25H2.7c-.24 0-.48.04-.7.12V9.81C2 6.17 4.17 4 7.81 4h3.44v3.19l-.72-.72a.754.754 0 0 0-1.06 0c-.29.29-.29.77 0 1.06l2 2c.01.01.02.01.02.02a.753.753 0 0 0 .51.2c.1 0 .19-.02.28-.06.09-.03.18-.09.25-.16l2-2c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-.72.72V4h3.44C19.83 4 22 6.17 22 9.81Z" fill="#000"></path></svg>${did('your_companyemail').value}</p>
                                        <p class="flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path fill="#000" d="M11.05 14.95L9.2 16.8c-.39.39-1.01.39-1.41.01-.11-.11-.22-.21-.33-.32a28.414 28.414 0 01-2.79-3.27c-.82-1.14-1.48-2.28-1.96-3.41C2.24 8.67 2 7.58 2 6.54c0-.68.12-1.33.36-1.93.24-.61.62-1.17 1.15-1.67C4.15 2.31 4.85 2 5.59 2c.28 0 .56.06.81.18.26.12.49.3.67.56l2.32 3.27c.18.25.31.48.4.7.09.21.14.42.14.61 0 .24-.07.48-.21.71-.13.23-.32.47-.56.71l-.76.79c-.11.11-.16.24-.16.4 0 .08.01.15.03.23.03.08.06.14.08.2.18.33.49.76.93 1.28.45.52.93 1.05 1.45 1.58.1.1.21.2.31.3.4.39.41 1.03.01 1.43zM21.97 18.33a2.54 2.54 0 01-.25 1.09c-.17.36-.39.7-.68 1.02-.49.54-1.03.93-1.64 1.18-.01 0-.02.01-.03.01-.59.24-1.23.37-1.92.37-1.02 0-2.11-.24-3.26-.73s-2.3-1.15-3.44-1.98c-.39-.29-.78-.58-1.15-.89l3.27-3.27c.28.21.53.37.74.48.05.02.11.05.18.08.08.03.16.04.25.04.17 0 .3-.06.41-.17l.76-.75c.25-.25.49-.44.72-.56.23-.14.46-.21.71-.21.19 0 .39.04.61.13.22.09.45.22.7.39l3.31 2.35c.26.18.44.39.55.64.1.25.16.5.16.78z"></path></svg>${did('your_companyphone').value}</p>
                                      </div>
                                    </div>`
        let y = document.getElementsByClassName('aftertotal')
        if(y.length > 0)for(let i=0;i<y.length;i++){
            y[i].innerHTML = formatNumber(tt)
        }
        did('receiptsalesmodal').classList.remove('hidden')
        }
       
    // }else{
        
    // }
}

// function runAdsalesFormValidations() {
//     let form = document.getElementById('salesform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#salesname'))  controls.push([form.querySelector('#salesname'), 'sales name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
