let salesid
let saletotalamount
let salesBillDatasource = []
let salesBillFilteredDatasource = []
let salesBillRefDebounceTimer = null
let isPopulatingSalesBill = false
let salesSubmissionInFlight = false
let salesReceiptResetOnClose = true
let canDeleteBillsInView = false

function isOrderWorkspaceMode() {
    return getCurrentRouteName() === 'order'
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
}

async function salesActive() {
    configureOrderWorkspaceUi()
    recalldatalist()
    await resolveBillDeletePermission()
    const form = document.querySelector('#salesform')
    if(form.querySelector('#submit') && !isOrderWorkspaceMode()) form.querySelector('#submit').addEventListener('click', () => salesFormSubmitHandler('', form.querySelector('#submit')))
    if(form.querySelector('#bill')) form.querySelector('#bill').addEventListener('click', () => salesFormSubmitHandler(isOrderWorkspaceMode() ? 'ORDER' : 'BILL', form.querySelector('#bill')))
    datasource = []
    await fetchsales()
    await getAllUsers()
    syncSalesViewFilterSalespointOptions()
    if(did('salesviewsubmit')) did('salesviewsubmit').addEventListener('click', () => fetchsalesviewreport())
    if(document.querySelector('#salespointname'))document.querySelector('#salespointname').addEventListener('change', e=>handlesalesdepartment())
    if(document.querySelector('#applyto'))document.querySelector('#applyto').addEventListener('change', e=>handlesalesapplyto())
    if(document.querySelector('#paymentmethod')) document.querySelector('#paymentmethod').addEventListener('click', checkotherbankdetails)
    if(document.querySelector('#paymentmethod')) document.querySelector('#paymentmethod').addEventListener('change', checkotherbankdetails)
    if(did('billreferencecode')) did('billreferencecode').addEventListener('input', () => handleSalesBillReferenceInput())
    if(did('billreferencecode')) did('billreferencecode').addEventListener('keydown', (event) => {
        if(event.key === 'Enter'){
            event.preventDefault()
            const reference = did('billreferencecode').value.trim()
            if(reference) fetchsalesbills(reference)
        }
    })
    if(did('retrievebillfromform')) did('retrievebillfromform').addEventListener('click', () => {
        const reference = (did('billreferencecode')?.value || '').trim()
        if(!reference) return notification('Enter bill reference to retrieve', 0)
        fetchsalesbills(reference)
    })
    if(did('retrievebilllist')) did('retrievebilllist').addEventListener('click', () => fetchsalesbills())
    if(did('clearbillfilters')) did('clearbillfilters').addEventListener('click', () => clearSalesBillFilters())
    if(did('billfilterreference')) did('billfilterreference').addEventListener('input', () => applySalesBillFilters())
    if(did('billfilterdatefrom')) did('billfilterdatefrom').addEventListener('change', () => applySalesBillFilters())
    if(did('billfilterdateto')) did('billfilterdateto').addEventListener('change', () => applySalesBillFilters())
    // if(document.querySelector('#owner1'))document.querySelector('#owner1').addEventListener('change', e=>handlesalesapplyto(/))
    handlesalesdepartment(default_department)
    await fetchtablenumber()
    if(!isOrderWorkspaceMode()) await fetchsalesbills()
    // await salesitempop()
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

function syncSalesViewFilterSalespointOptions() {
    const source = did('salespointname')
    const target = did('salespointname2')
    if(!source || !target) return
    target.innerHTML = `<option value="">-- ALL --</option>${source.innerHTML}`
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
                    description: row.description || '',
                    servicecharge: Number(row.totalamount || row.servicecharge || 0),
                    paymentmethod: row.paymentmethod || '',
                    ownerid: row.ownerid ?? row.owner ?? -1
                },
                amountreceived: Number(row.amountpaid || row.amountreceived || 0),
                saledetail: []
            })
        }
        grouped.get(reference).saledetail.push({
            itemid: row.itemid || '',
            itemname: row.itemname || row.description || '',
            qty: Number(row.qty || 0),
            cost: Number(row.cost || 0)
        })
    })
    return Array.from(grouped.values())
}

function normalizeOrdersForSalesTable(data = []) {
    if(!Array.isArray(data) || !data.length) return []
    if(data[0]?.saleentry) return normalizeSalesRowsForTable(data)

    return data.map((row) => {
        const owner = row.ownerid ?? row.owner ?? row.roomnumber ?? -1
        const normalizedOwner = (owner === '' || owner === null || owner === undefined) ? -1 : owner
        return {
            saleentry: {
                reference: String(row.reference || row.ref || row.orderref || row.id || '').trim(),
                transactiondate: row.transactiondate || row.created_at || row.entrydate || row.datecreated || '',
                description: row.description || '',
                servicecharge: Number(row.totalamount || row.amount || 0),
                paymentmethod: row.paymentmethod || 'ORDER',
                ownerid: normalizedOwner,
                ttype: 'ORDER'
            },
            amountreceived: Number(row.amountpaid || row.amountreceived || 0),
            saledetail: Array.isArray(row.saledetail) && row.saledetail.length
                ? row.saledetail
                : [{
                    description: row.description || '',
                    itemname: row.description || 'ORDER',
                    qty: Number(row.qty || 1),
                    cost: Number(row.cost || row.amount || 0)
                }]
        }
    }).filter((row) => row.saleentry.reference || row.saleentry.description)
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
                owner: saleEntry.ownerid ?? saleEntry.owner ?? '',
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
            owner: first.owner ?? first.ownerid ?? '',
            ttype: first.ttype || '',
            items: rows.map((row) => ({...row}))
        }
    }).filter((entry) => entry.reference)
}

async function fetchsalesbills(reference = '', triggerButton = null) {
    const cleanedReference = String(reference || '').trim()
    const startdate = String(did('billfilterdatefrom')?.value || '').trim()
    const enddate = String(did('billfilterdateto')?.value || '').trim()
    let payload = null
    if(cleanedReference || startdate || enddate){
        payload = new FormData()
        if(cleanedReference) payload.append('reference', cleanedReference)
        if(startdate) payload.append('startdate', startdate)
        if(enddate) payload.append('enddate', enddate)
    }

    const request = await httpRequest2('../controllers/fetchsalesbillsonly.php', payload, triggerButton, 'json')
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
        ? `<button title="Delete" type="button" onclick="removeBillEntry('${String(item.id || '').replace(/'/g, "\\'")}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs">delete</button>`
        : ''
    holder.innerHTML = rows.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>
                <div class="flex items-center gap-2">
                    <button title="Retrieve" type="button" onclick="retrieveSalesBillToForm('${String(item.reference).replace(/'/g, "\\'")}')" class="material-symbols-outlined rounded-full bg-blue-500 h-8 w-8 text-white drop-shadow-md text-xs">download</button>
                    <button title="Print" type="button" onclick="printsalesreceiptsales('${String(item.reference).replace(/'/g, "\\'")}', '', 'fetchsalesbillsonly.php', false, true)" class="material-symbols-outlined rounded-full bg-emerald-600 h-8 w-8 text-white drop-shadow-md text-xs">print</button>
                    ${deleteActionButton(item)}
                </div>
            </td>
            <td>${item.reference || ''}</td>
            <td>${item.transactiondate ? specialformatDateTime(item.transactiondate) : ''}</td>
            <td>${item.salespoint || ''}</td>
            <td>${item.description || ''}</td>
            <td>${formatCurrency(item.totalamount || 0)}</td>
            <td>${formatCurrency(item.amountpaid || 0)}</td>
            <td>${item.paymentmethod || ''}</td>
        </tr>
    `).join('')
}

function applySalesBillFilters() {
    const ref = String(did('billfilterreference')?.value || '').trim().toLowerCase()
    const from = did('billfilterdatefrom')?.value || ''
    const to = did('billfilterdateto')?.value || ''

    salesBillFilteredDatasource = salesBillDatasource.filter((bill) => {
        const billRef = String(bill.reference || '').toLowerCase()
        const billDate = String(bill.transactiondate || '').slice(0, 10)
        const refPass = !ref || billRef.includes(ref)
        const fromPass = !from || (billDate && billDate >= from)
        const toPass = !to || (billDate && billDate <= to)
        return refPass && fromPass && toPass
    })

    renderSalesBillsTable(salesBillFilteredDatasource)
}

function clearSalesBillFilters() {
    if(did('billfilterreference')) did('billfilterreference').value = ''
    if(did('billfilterdatefrom')) did('billfilterdatefrom').value = ''
    if(did('billfilterdateto')) did('billfilterdateto').value = ''
    applySalesBillFilters()
}

function openSalesFormTab() {
    const salesTabTrigger = document.querySelector("li[name='salesform']")
    if(salesTabTrigger) runoptioner(salesTabTrigger)
}

async function retrieveSalesBillToForm(reference) {
    const cleanedReference = String(reference || '').trim()
    if(!cleanedReference) return notification('Bill reference is required', 0)

    let bill = salesBillDatasource.find((item) => String(item.reference).toLowerCase() === cleanedReference.toLowerCase())
    if(!bill){
        await fetchsalesbills(cleanedReference)
        bill = salesBillDatasource.find((item) => String(item.reference).toLowerCase() === cleanedReference.toLowerCase())
    }
    if(!bill) return notification('Bill not found', 0)

    await loadSalesBillIntoForm(bill)
    openSalesFormTab()
    notification('Bill loaded to sales form', 1)
}

async function loadSalesBillIntoForm(bill) {
    if(!bill) return
    isPopulatingSalesBill = true
    try {
        salesid = bill.id || ''
        if(did('billreferencecode')) did('billreferencecode').value = bill.reference || ''
        if(did('salespointname') && bill.salespoint){
            did('salespointname').value = bill.salespoint
            await handlesalesdepartment()
        }

        if(did('transactiondate')) did('transactiondate').value = String(bill.transactiondate || '').slice(0, 10)
        if(did('description')) did('description').value = bill.description || ''
        if(did('paymentmethod')) did('paymentmethod').value = bill.paymentmethod || ''
        if(did('amountpaid')) did('amountpaid').value = Number(bill.amountpaid || 0)

        if(did('applyto')){
            if(String(bill.ttype || '').toUpperCase() === 'ROOMS') did('applyto').value = 'ROOMS'
            else if(String(bill.ttype || '').toUpperCase().includes('COST')) did('applyto').value = 'COST CENTER'
            else did('applyto').value = 'OTHERS'
            handlesalesapplyto()
        }

        const ownerValue = bill.owner !== null && bill.owner !== undefined ? String(bill.owner) : ''
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
                </td>
                <td>
                    <div>
                        <p class="font-bold">Type:&nbsp;<span class="font-normal" id="type-${firstRowId}"></span></p>
                        <p class="font-bold">Unit:&nbsp;<span class="font-normal" id="unit-${firstRowId}"></span></p>
                        <p class="font-bold">Stock&nbsp;Balance:&nbsp;<span class="font-normal" id="balance-${firstRowId}"></span></p>
                    </div>
                </td>
                <td>
                    <label for="logoname" class="control-label hidden">Price</label>
                    <input autocomplete="off" type="number" id="price-${firstRowId}" class="form-control comp pprice" placeholder="">
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
            if(did(`type-${rowId}`)) did(`type-${rowId}`).textContent = item.itemtype || item.type || ''
            if(did(`unit-${rowId}`)) did(`unit-${rowId}`).textContent = item.units || item.unit || ''
            if(did(`balance-${rowId}`)) did(`balance-${rowId}`).textContent = Math.max(Number(item.balance || 0), Number(item.qty || 0), 0)
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

function checkifitisrestaurant(){
        did('tablenumber').value = ''
    if(did('salespointname').value == 'Restaurant'){
        did('tablecheck').classList.remove('hidden')
    }else{
        did('tablecheck').classList.add('hidden')
    }
}
 
function handlesalesapplyto (){
    if(!document.getElementById('applyto').value)return
    document.getElementById('owner').value = '';
    document.getElementById('owner1').value = '';
    document.getElementById('owner').removeAttribute('list')
    if(document.getElementById('applyto').value == 'ROOMS'){
        document.getElementById('owner1').setAttribute('list', 'hems_roomnumber_id1')
    }
    markallcomp()
    if(document.getElementById('applyto').value == 'COST CENTER'){
        document.getElementById('owner1').setAttribute('list', 'hems_cost_center')
    }
    // if(document.getElementById('applyto').value == 'OTHERS')document.getElementById('owner').value = document.getElementById('owner1').value
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
    did('totalamountt').innerHTML = 0
    did('totalamount').value = 0
    did('thetabledata').innerHTML = `<tr id="row-919">
                                                <td class="s/n">1</td>
                                                <td class="">  
                                                    <label for="logoname" class="control-label hidden">Item</label>
                                                    <input autocomplete="off" onchange="checkdatalist(this);salesitempop(this,'1')" onblur="salesitempop(this,'1')" list="hems_itemslist" name="item" id="item-1" class="form-control iitem comp">
                                                    <input autocomplete="off" class="itemmerid hidden" id="itemer-1">
                                                </td>
                                                <td style="">
                                                    <div class="">
                                                        <p class="font-bold">Type:&nbsp;<span class="font-normal" id="type-1"></span></p>
                                                        <p class="font-bold">Unit:&nbsp;<span class="font-normal" id="unit-1"></span></p>
                                                        <p class="font-bold">Stock&nbsp;Balance:&nbsp;<span class="font-normal" id="balance-1"></span></p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <label for="logoname" class="control-label hidden">Price</label>
                                                    <input autocomplete="off" type="number"  name="" id="price-1" class="form-control comp pprice" placeholder="">
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
                datasource = request.data
                document.getElementById('hems_itemslist').innerHTML = request.data.map((data, index) =>`<option>${data.itemname.trim()}</option>`).join('')
                hidesalesterminal(false)
                did('loading').classList.add('hidden')
                syncSalesViewFilterSalespointOptions()
                // resolvePagination(datasource, onupdateinventoryTableDataSignal)
                return notification(request.message, 1);
            }
    }else{
        syncSalesViewFilterSalespointOptions()
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
        did(`unit-${i}`).innerHTML = ''
        did(`balance-${i}`).innerHTML = ''
        did(`price-${i}`).value = ''
        did(`qty-${i}`).value = ''
        did(`amount-${i}`).value = ''
        did(`item-${i}`).value = ''
}

function calsaleqty(i){
    if(Number(did(`qty-${i}`).value)<0)did(`qty-${i}`).value = 0
    if(Number(did(`balance-${i}`).textContent)<Number(did(`qty-${i}`).value)){
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
    did('totalamountt').textContent = formatCurrency(x)
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
    let ddid = await getLabelFromValue(val.value, 'hems_itemslist_getid');
    console.log(val.value, ddid)
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('itemid', ddid)
        paramstr.append('salespoint', did('salespointname').value)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchitemdetail', ddid ? getparamm() : null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        did(`type-${i}`).innerHTML = request.itemdata[0].itemtype
        did(`unit-${i}`).innerHTML = request.itemdata[0].units
        did(`balance-${i}`).innerHTML = request.balance
        did(`price-${i}`).value = request.itemdata[0].price
        did(`qty-${i}`).value = Number(qty)
        did(`amount-${i}`).value = Number(request.itemdata[0].price)*Number(did(`qty-${i}`).value)
        if(did(`qty-${i}`).value)calsaleqty(`${i}`)
    }
    else return notification('No records retrieved')
}

function addsalesrow(ii=''){
    let id 
    if(ii)id = ii
    if(!ii)id = genID()
    let element = document.createElement('tr')
    element.setAttribute('id', `'row-${id}'`)
    element.innerHTML = `
        <td class="s/n"></td>
        <td class="">  
            <label for="logoname" class="control-label hidden">Item</label>
            <input autocomplete="off" onchange="checkdatalist(this);salesitempop(this,'${id}')" onblur="salesitempop(this,'${id}')" list="hems_itemslist" name="item" id="item-${id}" class="form-control iitem comp">
             <input autocomplete="off" class="itemmerid hidden" id="itemer-${id}">
        </td>
        <td style="">
            <div class="">
                <p class="font-bold">Type:&nbsp;<span class="font-normal" id="type-${id}"></span></p>
                <p class="font-bold">Unit:&nbsp;<span class="font-normal" id="unit-${id}"></span></p>
                <p class="font-bold">Stock&nbsp;Balance:&nbsp;<span class="font-normal" id="balance-${id}"></span></p>
            </div>
        </td>
        <td>
            <label for="logoname" class="control-label hidden">Price</label>
            <input autocomplete="off" type="number"  name="" id="price-${id}" class="form-control comp pprice" placeholder="">
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

async function fetchsales(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2(isOrderWorkspaceMode() ? '../controllers/fetchorders.php' : '../controllers/fetchsales', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = isOrderWorkspaceMode()
                    ? normalizeOrdersForSalesTable(request.data)
                    : normalizeSalesRowsForTable(request.data)
                resolvePagination(datasource, onsalesTableDataSignal)
            }
        }else{
             salesid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
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
    let rows = getSignaledDatasource().map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${specialformatDateTime(item.saleentry.transactiondate)}</td>
            <td>${item.saleentry.reference}</td>
            <td>${item.saleentry.ownerid < 0 ? (item.saledetail?.[0]?.description || item.saleentry.description || '') : item.saleentry.description}</td>
            <td>${formatNumber(item.saleentry.servicecharge)}</td>
            <td>${formatNumber(item.amountreceived)}</td>
            <td>${item.saleentry.paymentmethod}</td>
            <td>${item.saleentry.ownerid < 0 ? '-' : item.saleentry.ownerid}</td>
            <td class="flex items-center gap-3">
                <button title="View Item" onclick="openSalesReportModal('${String(item.saleentry.reference).replace(/'/g, "\\'")}', '${item.saleentry.ownerid < 0 ? '' : String(item.saleentry.ownerid).replace(/'/g, "\\'")}')" class="material-symbols-outlined rounded-full bg-green-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
                <button title="Print sales" onclick="printsalesreceiptsales('${String(item.saleentry.reference).replace(/'/g, "\\'")}', '', 'fetchsalesbyreference', false)" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">print</button>
            </td>
        </tr>
    `).join('')
    injectPaginatatedTable(rows)
}

async function openSalesReportModal(ref, room=''){
    if(!ref)return
    function getparamm() {
        let paramstr = new FormData();
        if(!room)paramstr.append('reference', ref);
        if(room)paramstr.append('roomnumber', room);
        return paramstr;
    }
    let request = await httpRequest2(`../controllers/${!room ? 'fetchsalesdetailbyref' : 'fetchroomtransactionhistory'}`, getparamm(), null, 'json');
    let data1 = datasource.find(dat=>String(dat?.saleentry?.reference || '') == String(ref)) || {saleentry:{}, amountreceived:0}
    if(!request.status) return notification('No records retrieved')

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
            <p class="!text-sm font-semibold flex w-full justify-between">Description: <span class="uppercase !text-sm font-normal text-left w-[50%]">${data1.saleentry.description || ''}</span></p>
            ${data1.saleentry.ownerid < 0 ? '' : `<p class="!text-sm font-semibold flex w-full justify-between">Room / CC: <span class="uppercase !text-sm font-normal text-left">${data1.saleentry.ownerid || ''}</span></p>`}
            <p class="!text-sm font-semibold flex w-full justify-between">Total Amount: <span class="uppercase !text-sm font-normal text-left">${formatNumber(data1.saleentry.servicecharge || 0)}</span></p>
            <p class="!text-sm font-semibold flex w-full justify-between">Amount Paid: <span class="uppercase !text-sm font-normal text-left">${formatNumber(data1.amountreceived || 0)}</span></p>
            <p class="!text-sm font-semibold flex w-full justify-between">Ref: <span class="uppercase !text-sm font-normal text-left">${data1.saleentry.reference || ref}</span></p>
            <p class="!text-sm font-semibold flex w-full justify-between">Payment Method: <span class="uppercase !text-sm font-normal text-left">${data1.saleentry.paymentmethod || ''}</span></p>
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
    let batchdata = datasource.filter(dat=>dat.batchid == batchid)[0]
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
                        				<input autocomplete="off" id="rbillto" value="${batchdata.data[0].owner.toUpperCase()}" readonly class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
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
                                <li style="display: flex;justify-content:space-between;width: 150%"><p>Invoice / Reciept To</p> <p>${batchdata.data[0].owner.toUpperCase()}</p> </li>
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
    for(let i=0;i<document.getElementsByClassName('itemmerid').length;i++){
        document.getElementsByClassName('itemmerid')[i].value = getLabelFromValue(document.getElementsByClassName('itemmerid')[i].previousElementSibling.value, 'hems_itemslist_getid');
    }
    givenamebyclass('iitem', 'itemname')
    givenamebyclass('itemmerid', 'itemid')
    givenamebyclass('qqty', 'qty')
    givenamebyclass('pprice', 'cost')
}

async function salesFormSubmitHandler(ttype = '', triggerButton = null) {
    if(salesSubmissionInFlight) return notification('Processing previous request, please wait...', 0)
    salesSubmissionInFlight = true
    setSalesActionButtonsState(true)
    try {
        const requiredFields = getIdFromCls('comp').filter(id => !['amountpaid', 'paymentmethod'].includes(id))
        if(!validateForm('salesform', requiredFields))return notification('Please Ensure all compulsory fields are filled', 0)
        let t = true
        for(let i=0;i<document.getElementsByClassName('qqty').length;i++){
            if(document.getElementsByClassName('qqty')[i].value < 1)t = false;
        }
        if(!t)return notification('Please one or more quantity values are invalid', 0)
        
        preparesalesvalues()
        
        let payload
        payload = getFormData2(document.querySelector('#salesform'), salesid ? [['id', salesid], ['rowsize', document.getElementsByClassName('pprice').length]] : [['rowsize', document.getElementsByClassName('pprice').length]])
        if(ttype)payload.set('ttype', ttype)
        let request = await httpRequest2('../controllers/salescript', payload, triggerButton || document.querySelector('#salesform #submit'))
        if(request.status) {
            notification(`${ttype == 'BILL' ? 'Bill' : ttype == 'ORDER' ? 'Order' : 'Record'} saved successfully!`, 1);
            if(ttype === 'BILL') printsalesreceiptsales(request.reference, '', 'fetchsalesbillsonly.php', true, true)
            else if(ttype === 'ORDER'){
                printsalesreceiptsales(request.reference, '', 'fetchsalesbyreference', false, false)
                resetSalesAfterReceipt()
            }
            else printsalesreceiptsales(request.reference, '', 'fetchsalesbyreference', true, false)
            if(!isOrderWorkspaceMode()) fetchsalesbills()
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
    did('thetabledata').innerHTML = `
                                            <tr id="row-919">
                                                <td class="s/n">1</td>
                                                <td class="">  
                                                    <label for="logoname" class="control-label hidden">Item</label>
                                                    <input autocomplete="off" onchange="checkdatalist(this);salesitempop(this,'1')" onblur="salesitempop(this,'1')" list="hems_itemslist" name="item" id="item-1" class="form-control iitem comp">
                                                    <input autocomplete="off" class="itemmerid hidden" id="itemer-1">
                                                </td>
                                                <td style="">
                                                    <div class="">
                                                        <p class="font-bold">Type:&nbsp;<span class="font-normal" id="type-1"></span></p>
                                                        <p class="font-bold">Unit:&nbsp;<span class="font-normal" id="unit-1"></span></p>
                                                        <p class="font-bold">Stock&nbsp;Balance:&nbsp;<span class="font-normal" id="balance-1"></span></p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <label for="logoname" class="control-label hidden">Price</label>
                                                    <input autocomplete="off" type="number"  name="" id="price-1" class="form-control comp pprice" placeholder="">
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
    did('owner1').value = '';
    did('owner').value = '';
    did('description').value = '';
    did('amountpaid').value = '';
    did('totalamountt').innerHTML = 0;
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
            datasource = isOrderWorkspaceMode()
                ? normalizeOrdersForSalesTable(request.data)
                : normalizeSalesRowsForTable(request.data)
            resolvePagination(datasource, onsalesTableDataSignal)
            return notification(request.message || 'Records retrieved', 1)
        }
    }
    return notification('No records retrieved')
}

function removeSalesEntryPending(reference = '') {
    return notification(`Delete controller pending for sales reference ${reference || ''}`, 0)
}

function openSalesBillDetails(reference = '') {
    const cleanedReference = String(reference || '').trim()
    if(!cleanedReference) return notification('Bill reference is required', 0)
    return printsalesreceiptsales(cleanedReference, '', 'fetchsalesbillsonly.php', false, true)
}

async function removeBillEntry(id = '') {
    const cleanedId = String(id || '').trim()
    if(!cleanedId) return notification('Unable to delete: bill id is missing', 0)
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
    payload.append('id', cleanedId)
    const request = await httpRequest2('../controllers/removesalesbill.php', payload, null, 'json')
    if(request.status){
        notification(request.message || 'Bill deleted successfully', 1)
        fetchsalesbills()
        fetchsales()
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
    fetchsalesbills()
}

function closeSalesReceiptModal() {
    if(did('receiptsalesmodal')) did('receiptsalesmodal').classList.add('hidden')
    if(salesReceiptResetOnClose) resetSalesAfterReceipt()
    salesReceiptResetOnClose = true
}


async function printsalesreceiptsales(ref, room='', salesFetchController='fetchsalesbyreference', resetOnClose=true, showSignatures=false){
    let rm = false
    if(room)rm = true
    if(!ref)return
    salesReceiptResetOnClose = !!resetOnClose
    let tt = 0;
    let html = '';
        function getparamm() {
            let paramstr = new FormData();
            if(!room)paramstr.append('reference', ref);
            return paramstr;
        }
        let request = await httpRequest2(`../controllers/${!room ? salesFetchController : 'fetchroomtransactionhistory'}`, getparamm(), null, 'json');
        if(request.status){
            did('displaydetails').innerHTML = `<img src="../images/${did('your_companylogo').value}" alt="chippz" style="width: 70px" class="mx-auto w-16 py-4" />
                                    <div class="flex flex-col justify-center items-center gap-2">
                                        <h4 class="font-semibold">${did('your_companyname').value}</h4>
                                        <p class="text-xs">${did('your_companyaddress').value}</p>
                                    </div>
                                    <div class="flex flex-col gap-3 border-b py-6 text-xs">
                                      <p class="flex justify-between">
                                        <span class="text-gray-400">Receipt No.:</span>
                                        <span>${request.data[0].reference}</span>
                                      </p>
                                      ${(request.data[0].owner && request.data[0].owner !== '-1' && request.data[0].owner !== '-1' && Number(request.data[0].owner) >= 0) || (request.data[0].ownerid && request.data[0].ownerid !== '-1' && Number(request.data[0].ownerid) >= 0) ? `<p class="flex justify-between">
                                        <span class="text-gray-400">Room / CC:</span>
                                        <span>${request.data[0].owner || request.data[0].ownerid || ''}</span>
                                      </p>` : ''}
                                      <p class="flex justify-between">
                                        <span class="text-gray-400">Total Amount:</span>
                                        <span class="">${formatNumber(request.data[0].totalamount || 0)}</span>
                                      </p>
                                      <p class="flex justify-between">
                                        <span class="text-gray-400">Amount Paid:</span>
                                        <span>${formatNumber(request.data[0].amountpaid || request.data[0].amountreceived || 0)}</span>
                                      </p>
                                      <p class="flex justify-between">
                                        <span class="text-gray-400">Payment Method:</span>
                                        <span>${request.data[0].paymentmethod || ''}</span>
                                      </p>
                                      <p class="flex justify-between">
                                        <span class="text-gray-400">Transaction Date:</span>
                                        <span>${specialformatDateTime(request.data[0].transactiondate)}</span>
                                      </p>
                                    </div>
                                    <div class="flex flex-col gap-3 pb-6 pt-2 text-[10px] w-full overflow-x-auto">
                                      <table class="w-full text-left border-collapse" style="font-size: 10px;">
                                        <thead>
                                          ${!rm ? `<tr class="border-b">
                                            <th class="py-1 px-1 text-left" style="min-width: 25px; max-width: 30px;">s/n</th>
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
                                            ${!rm && request.data.length > 0 && request.data[0].ttype != 'ROOMS' 
                                              ? request.data.map((dat, i) => {tt=tt+(Number(dat.qty) * Number(dat.cost)); return`
                                                  <tr class="border-b">
                                                      <td class="py-1 px-1" style="font-size: 10px;">${i+1}</td>
                                                      <td class="py-1 px-1" style="font-size: 10px; word-break: break-word; max-width: 120px;">${dat.itemname || ''}</td> 
                                                      <td class="py-1 px-1 text-right" style="font-size: 10px;">${formatNumber(dat.qty || 0)}</td>
                                                      <td class="py-1 px-1 text-right" style="font-size: 10px;">${formatNumber(dat.cost || 0)}</td>
                                                      <td class="py-1 px-1 text-right" style="font-size: 10px;">${formatNumber(Number(dat.qty || 0) * Number(dat.cost || 0))}</td>
                                                  </tr>
                                                `}).join('') 
                                              : ''}
                                            
                                            ${!rm && request.data.length > 0 && request.data[0].ttype != 'ROOMS'
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
                                      ${showSignatures ? `<div class="pt-4 pb-2 text-xs">
                                        <div class="flex justify-between gap-8">
                                          <div class="flex-1">
                                            <p class="text-gray-500">Customer Signature</p>
                                            <div class="h-8 border-b border-gray-400"></div>
                                          </div>
                                          <div class="flex-1">
                                            <p class="text-gray-500">Salesperson Signature</p>
                                            <div class="h-8 border-b border-gray-400"></div>
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
