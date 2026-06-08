let openstockid
let openstockDatasource = []
let openstockImportEventsBound = false
let openstockItemSelect = null
let openstockTomSelectAssetsPromise = null
let openstockAllDepartmentItems = []
let openstockAvailableItems = []
let openstockActiveDepartment = ''
const openstockSelectedItems = new Map()
const openstockImportHeaderMap = {
    'item id': 'itemid',
    'itemid': 'itemid',
    'item name': 'itemname',
    'itemname': 'itemname',
    'item type': 'itemtype',
    'itemtype': 'itemtype',
    'begin balance': 'qty',
    'opening stock': 'qty',
    'stock value': 'qty',
    'stock qty': 'qty',
    'quantity': 'qty',
    'qty': 'qty',
    'sales point': 'salespoint',
    'salespoint': 'salespoint',
    'department': 'salespoint'
}

function normalizeOpenstockDepartmentLabel(value = ''){
    const label = String(value || '').trim()
    if(label === 'FRONT-DESK/BOOKING') return 'Booking/Reservation'
    return label
}

function setOpenstockBulkStatus(message, isError){
    const status = did('openstock-bulk-status')
    if(!status) return
    status.textContent = message || ''
    status.style.color = isError ? '#b91c1c' : '#334155'
}

function setOpenstockItemPickerStatus(message = ''){
    const status = did('openstock-item-picker-status')
    if(!status) return
    status.textContent = message
}

function getOpenstockSelectedDepartment(){
    return normalizeOpenstockDepartmentLabel(did('salespointname')?.value || '')
}

function getOpenstockActiveSalesPoint(){
    return String(openstockActiveDepartment || getOpenstockSelectedDepartment() || default_department || '').trim()
}

function resetOpenstockTable(){
    openstockSelectedItems.clear()
    if(did('tabledata')) renderUnfilteredListPrompt('tabledata', openstockActiveDepartment ? 'Select items from the item picker to add them to the table' : 'Select a department to load items')
}

function resetOpenstockItemPool(){
    openstockAllDepartmentItems = []
    openstockAvailableItems = []
    openstockDatasource = []
    datasource = []
    if(openstockItemSelect){
        openstockItemSelect.clearOptions()
        openstockItemSelect.clear(true)
        openstockItemSelect.disable()
    }else if(did('openstockitempicker')){
        did('openstockitempicker').innerHTML = `<option value="">No items loaded</option>`
        did('openstockitempicker').setAttribute('disabled', 'disabled')
    }
    setOpenstockItemPickerStatus('')
}

function resetOpenstockDepartmentState(){
    openstockActiveDepartment = ''
    openstockid = ''
    resetOpenstockItemPool()
    resetOpenstockTable()
    setOpenstockBulkStatus('')
}

function handleOpenstockDepartmentSelectionChange(){
    const selectedDepartment = getOpenstockSelectedDepartment()
    if(!selectedDepartment){
        resetOpenstockDepartmentState()
        return
    }
    openstockActiveDepartment = ''
    openstockAllDepartmentItems = []
    openstockAvailableItems = []
    openstockDatasource = []
    datasource = []
    openstockSelectedItems.clear()
    renderOpenstockItemPicker()
    renderUnfilteredListPrompt('tabledata', 'Click Fetch to load items for the selected department')
    setOpenstockItemPickerStatus(`Selected department: ${selectedDepartment}. Click Fetch to load items.`)
    setOpenstockBulkStatus('')
}

function openstockEnsureTomSelectAssets() {
    if (window.TomSelect) return Promise.resolve()
    if (openstockTomSelectAssetsPromise) return openstockTomSelectAssetsPromise
    openstockTomSelectAssetsPromise = new Promise((resolve, reject) => {
        if (!document.querySelector('link[data-openstock-item-tom-select]')) {
            const css = document.createElement('link')
            css.rel = 'stylesheet'
            css.href = 'https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/css/tom-select.css'
            css.dataset.openstockItemTomSelect = '1'
            document.head.appendChild(css)
        }
        const existingScript = document.querySelector('script[data-openstock-item-tom-select]')
        if (existingScript) {
            if (window.TomSelect) resolve()
            else existingScript.addEventListener('load', () => resolve(), { once: true })
            return
        }
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/js/tom-select.complete.min.js'
        script.dataset.openstockItemTomSelect = '1'
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Unable to load Tom Select'))
        document.head.appendChild(script)
    })
    return openstockTomSelectAssetsPromise
}

async function initializeOpenstockItemPicker(){
    await openstockEnsureTomSelectAssets()
    const control = did('openstockitempicker')
    if(!control || !window.TomSelect) return
    if(openstockItemSelect){
        openstockItemSelect.destroy()
        openstockItemSelect = null
    }
    openstockItemSelect = new window.TomSelect(control, {
        create: false,
        persist: false,
        maxOptions: 1000,
        placeholder: 'Search item to add'
    })
    openstockItemSelect.on('change', value=>{
        if(!value) return
        addOpenstockItemToTableById(value)
        openstockItemSelect.clear(true)
    })
    openstockItemSelect.disable()
}

function renderOpenstockItemPicker(){
    const control = did('openstockitempicker')
    if(!control) return
    const options = openstockAvailableItems.map(item=>({
        value: String(item.itemid || '').trim(),
        text: `${String(item.itemname || '').trim()}`
    })).filter(item=>item.value && item.text)

    control.innerHTML = `<option value="">${openstockActiveDepartment ? 'Select item' : 'Load a department first'}</option>${
        options.map(item=>`<option value="${item.value.replace(/"/g, '&quot;')}">${item.text}</option>`).join('')
    }`

    if(openstockItemSelect){
        openstockItemSelect.clearOptions()
        openstockItemSelect.addOptions(options)
        openstockItemSelect.refreshOptions(false)
        openstockItemSelect.clear(true)
        if(openstockActiveDepartment && options.length) openstockItemSelect.enable()
        else openstockItemSelect.disable()
    }else{
        if(openstockActiveDepartment && options.length) control.removeAttribute('disabled')
        else control.setAttribute('disabled', 'disabled')
    }

    if(!openstockActiveDepartment){
        setOpenstockItemPickerStatus('')
    }else{
        setOpenstockItemPickerStatus(`${openstockAvailableItems.length} item(s) available in ${openstockActiveDepartment}`)
    }
}

function normalizeOpenstockDepartmentItems(items = []){
    const unique = new Map()
    ;(items || []).forEach(item=>{
        const itemid = String(item?.itemid || '').trim()
        const itemname = String(item?.itemname || '').trim()
        if(!itemid || !itemname) return
        if(unique.has(itemid)) return
        unique.set(itemid, {
            ...item,
            itemid,
            itemname,
            itemtype: String(item?.itemtype || '').trim(),
            salespoint: normalizeOpenstockDepartmentLabel(item?.salespoint || openstockActiveDepartment || '')
        })
    })
    return Array.from(unique.values())
}

function getOpenstockRowId(itemid){
    return `openstock-row-${String(itemid || '').trim().replace(/[^a-zA-Z0-9_-]/g, '_')}`
}

function removeOpenstockItemFromAvailable(itemid){
    const normalized = String(itemid || '').trim()
    openstockAvailableItems = openstockAvailableItems.filter(item=>String(item.itemid || '').trim() !== normalized)
    renderOpenstockItemPicker()
}

function restoreOpenstockItemToAvailable(itemid){
    const normalized = String(itemid || '').trim()
    if(!normalized) return
    if(openstockAvailableItems.some(item=>String(item.itemid || '').trim() === normalized)) return
    const source = openstockAllDepartmentItems.find(item=>String(item.itemid || '').trim() === normalized)
    if(!source) return
    openstockAvailableItems.push(source)
    openstockAvailableItems.sort((a, b)=>String(a.itemname || '').localeCompare(String(b.itemname || '')))
    renderOpenstockItemPicker()
}

function getOpenstockRowMarkup(item, quantity = ''){
    const itemid = String(item?.itemid || '').trim()
    const itemname = String(item?.itemname || '').trim()
    const itemtype = String(item?.itemtype || '').trim()
    const rowId = getOpenstockRowId(itemid)
    return `
        <tr id="${rowId}" data-itemid="${itemid}">
            <input value="${itemid}" type="hidden" name="itemid" class="form-control comp">
            <td class="openstock-row-sn"></td>
            <td>
                <p name="itemname">${itemname}</p>
            </td>
            <td>${itemtype || '-'}</td>
            <td>
                <div class="flex items-center gap-2">
                    <input type="number" value="${quantity}" name="beginbalance" class="form-control comp" placeholder="Enter begin balance">
                    <button type="button" onclick="removeOpenstockItemFromTable('${itemid.replace(/'/g, "\\'")}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs flex items-center justify-center" style="font-size: 18px;">delete</button>
                </div>
            </td>
        </tr>
    `
}

function renumberOpenstockTableRows(){
    Array.from(document.querySelectorAll('#tabledata .openstock-row-sn')).forEach((cell, index)=>{
        cell.textContent = index + 1
    })
}

function addOpenstockItemToTable(item, quantity = ''){
    const itemid = String(item?.itemid || '').trim()
    if(!itemid || openstockSelectedItems.has(itemid)) return false
    if(!did('tabledata')) return false
    const shouldResetPrompt = !document.querySelector('#tabledata tr[data-itemid]')
    if(shouldResetPrompt) did('tabledata').innerHTML = ''
    did('tabledata').insertAdjacentHTML('beforeend', getOpenstockRowMarkup(item, quantity))
    openstockSelectedItems.set(itemid, item)
    removeOpenstockItemFromAvailable(itemid)
    renumberOpenstockTableRows()
    return true
}

function addOpenstockItemToTableById(itemid, quantity = ''){
    const normalized = String(itemid || '').trim()
    if(!normalized) return false
    const item = openstockAllDepartmentItems.find(entry=>String(entry.itemid || '').trim() === normalized)
    if(!item) {
        notification('Selected item is not available in the current department', 0)
        return false
    }
    return addOpenstockItemToTable(item, quantity)
}

function removeOpenstockItemFromTable(itemid){
    const normalized = String(itemid || '').trim()
    const row = did(getOpenstockRowId(normalized))
    if(row) row.remove()
    openstockSelectedItems.delete(normalized)
    restoreOpenstockItemToAvailable(normalized)
    if(!document.querySelector('#tabledata tr[data-itemid]')){
        renderUnfilteredListPrompt('tabledata', openstockActiveDepartment ? 'Select items from the item picker to add them to the table' : 'Select a department to load items')
    }else{
        renumberOpenstockTableRows()
    }
}

async function loadOpenstockDepartmentItems(store, options = {}){
    const { notifyOnSuccess = true } = options
    const selectedDepartment = normalizeOpenstockDepartmentLabel(store || getOpenstockSelectedDepartment())
    if(!selectedDepartment) {
        resetOpenstockDepartmentState()
        return
    }
    did('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">Loading...</td></tr>`
    setOpenstockBulkStatus('')
    function payload(){
        let param = new FormData()
        param.append('salespoint', selectedDepartment)
        return param
    }
    const request = await httpRequest2('../controllers/fetchinventorybysalespoint', payload(), null)
    if(request?.status && Array.isArray(request.data) && request.data.length){
        openstockActiveDepartment = selectedDepartment
        openstockDatasource = request.data
        datasource = request.data
        openstockAllDepartmentItems = normalizeOpenstockDepartmentItems(request.data)
        openstockAvailableItems = [...openstockAllDepartmentItems]
        openstockSelectedItems.clear()
        renderOpenstockItemPicker()
        renderUnfilteredListPrompt('tabledata', 'Select items from the item picker to add them to the table')
        if(notifyOnSuccess) return notification(request.message || 'Items loaded successfully', 1)
        return true
    }

    resetOpenstockItemPool()
    openstockActiveDepartment = selectedDepartment
    renderUnfilteredListPrompt('tabledata', request?.message || 'No records retrieved')
    return notification(request?.message || 'No records retrieved', 0)
}

function getOpenstockRowsForTemplate(){
    return openstockAllDepartmentItems.map(item=>({
        'Item ID': String(item?.itemid || '').trim(),
        'Item Name': String(item?.itemname || '').trim(),
        'Item Type': String(item?.itemtype || '').trim(),
        'Stock Value': '',
        'Sales Point': String(item?.salespoint || openstockActiveDepartment || '').trim()
    }))
}

async function downloadOpenstockTemplate(){
    const salespoint = getOpenstockActiveSalesPoint()
    if(!salespoint) return notification('Please select a Department / Sales Point', 0)

    if(!openstockAllDepartmentItems.length){
        await loadOpenstockDepartmentItems(salespoint)
    }

    if(!openstockAllDepartmentItems.length) return notification('No items available for template export', 0)
    const ok = await ensureXLSXLoadedOpenstock()
    if(!ok) return notification('Could not load Excel helper. Check your connection.', 0)

    try{
        const rows = getOpenstockRowsForTemplate()
        const worksheet = XLSX.utils.json_to_sheet(rows)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Opening Stock')
        const safeSalespoint = salespoint.replace(/[\\/:*?"<>|]/g, '_')
        XLSX.writeFile(workbook, `opening_stock_template_${safeSalespoint}.xlsx`)
        setOpenstockBulkStatus(`Template exported for ${salespoint}`)
        return notification('Opening stock template exported', 1)
    }catch(err){
        console.error(err)
        setOpenstockBulkStatus('Template export failed.', true)
        return notification('Template export failed', 0)
    }
}

function normalizeOpenstockImportRows(rawRows){
    const rows = []
    ;(rawRows || []).forEach(item=>{
        const normalized = {}
        Object.keys(item || {}).forEach(key=>{
            const mappedKey = openstockImportHeaderMap[String(key || '').trim().toLowerCase()]
            if(mappedKey) normalized[mappedKey] = item[key]
        })
        const hasValue = Object.values(normalized).some(value=>String(value ?? '').trim() !== '')
        if(!hasValue) return
        rows.push({
            itemid: String(normalized.itemid || '').trim(),
            itemname: String(normalized.itemname || '').trim(),
            itemtype: String(normalized.itemtype || '').trim(),
            salespoint: normalizeOpenstockDepartmentLabel(normalized.salespoint || ''),
            qty: String(normalized.qty ?? '').replace(/,/g, '').trim()
        })
    })
    return rows
}

function applyImportedOpenstockRows(rows){
    let added = 0
    let updated = 0
    let skipped = 0
    let mismatchedDepartment = 0
    let missingItems = 0

    rows.forEach(row=>{
        const rowDepartment = normalizeOpenstockDepartmentLabel(row.salespoint || '')
        if(rowDepartment && rowDepartment !== openstockActiveDepartment){
            mismatchedDepartment++
            return
        }

        const item = openstockAllDepartmentItems.find(entry=>String(entry.itemid || '').trim() === String(row.itemid || '').trim())
        if(!item){
            missingItems++
            return
        }

        const alreadySelected = openstockSelectedItems.has(String(item.itemid || '').trim())
        if(!alreadySelected){
            const inserted = addOpenstockItemToTable(item, row.qty)
            if(inserted) added++
            else skipped++
        }else{
            const rowEl = did(getOpenstockRowId(String(item.itemid || '').trim()))
            const qtyInput = rowEl?.querySelector('input[name="beginbalance"]')
            if(qtyInput){
                qtyInput.value = row.qty
                updated++
            }else{
                skipped++
            }
        }
    })

    return { added, updated, skipped, mismatchedDepartment, missingItems }
}

async function handleOpenstockImport(event){
    const file = event.target.files[0]
    if(!file) return
    if(!openstockActiveDepartment) {
        event.target.value = ''
        return notification('Please select a Department / Sales Point first', 0)
    }
    const ok = await ensureXLSXLoadedOpenstock()
    if(!ok) {
        event.target.value = ''
        return notification('Could not load Excel helper. Check your connection.', 0)
    }

    const reader = new FileReader()
    reader.onload = async e=>{
        try{
            const workbook = XLSX.read(e.target.result, { type: 'array' })
            const sheet = workbook.Sheets[workbook.SheetNames[0]]
            const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' })
            const normalizedRows = normalizeOpenstockImportRows(rawRows).filter(row=>row.itemid && row.qty !== '')

            if(!normalizedRows.length) return notification('No valid stock rows found in the import file', 0)

            const result = applyImportedOpenstockRows(normalizedRows)
            setOpenstockBulkStatus(`Import staged: ${result.added} added, ${result.updated} updated, ${result.missingItems} missing, ${result.mismatchedDepartment} wrong department`, result.missingItems > 0 || result.mismatchedDepartment > 0)
            return notification('Import loaded into the table successfully', 1)
        }catch(err){
            console.error(err)
            setOpenstockBulkStatus('Unable to read Excel file.', true)
            notification('Unable to read Excel file. Please confirm the template.', 0)
        }finally{
            event.target.value = ''
        }
    }
    reader.readAsArrayBuffer(file)
}

function buildOpenstockSavePayload(){
    let param = new FormData()
    param.append('salespoint', openstockActiveDepartment)
    const rows = Array.from(document.querySelectorAll('#tabledata tr[data-itemid]'))
    const itemid = []
    const itemname = []
    const qty = []
    rows.forEach(row=>{
        itemid.push(String(row.querySelector('input[name="itemid"]')?.value || '').trim())
        itemname.push(String(row.querySelector('p[name="itemname"]')?.textContent || '').trim())
        qty.push(String(row.querySelector('input[name="beginbalance"]')?.value || '0').trim())
    })
    param.append('itemname', itemname.join('|'))
    param.append('itemid', itemid.join('|'))
    param.append('qty', qty.join('|'))
    return param
}

async function openstockActive() {
    recalldatalist()
    wireOpenstockImport()
    await initializeOpenstockItemPicker()
    resetOpenstockDepartmentState()
    if(document.querySelector('#salespointname')) document.querySelector('#salespointname').addEventListener('change', handleOpenstockDepartmentSelectionChange)
    if(document.querySelector('#openstockfetchbtn')) document.querySelector('#openstockfetchbtn').addEventListener('click', ()=>loadOpenstockDepartmentItems())
    if(document.querySelector('#save')) document.querySelector('#save').addEventListener('click', saveopenstock, false)
    datasource = []
}

function wireOpenstockImport(){
    if(openstockImportEventsBound) return
    openstockImportEventsBound = true
    const templateBtn = did('openstockTemplateBtn')
    const importBtn = did('openstockImportBtn')
    const importInput = did('openstockImportInput')
    if(templateBtn) templateBtn.addEventListener('click', downloadOpenstockTemplate)
    if(importBtn && importInput) importBtn.addEventListener('click', ()=>importInput.click())
    if(importInput) importInput.addEventListener('change', handleOpenstockImport)
}

async function ensureXLSXLoadedOpenstock(){
    if(window.XLSX) return true
    return await new Promise(resolve=>{
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
        script.onload = ()=>resolve(!!window.XLSX)
        script.onerror = ()=>resolve(false)
        document.head.appendChild(script)
    })
}

async function fetchopenstocks(id) {
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    const payload = id ? getparamm() : null
    if(shouldBlockUnfilteredListFetch({ id, payload, isInitialLoad: true })) return
    let request = await httpRequest2('../controllers/fetchinventorylist', payload, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70"> Table is empty</td></tr>`
    if(request.status) {
        const items = normalizeInventoryItems(request.data)
        if(!id){
            if(items.length) datasource = items
        }else{
            openstockid = items[0]?.id
            if(items[0])populateData(items[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeopenstock(id) {
    const confirmed = window.confirm("Are you sure you want to remove this item?")
    if (!confirmed) return

    function getparamm() {
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }

    let request = await httpRequest2('../controllers/removeitem', id ? getparamm() : null, null, 'json')
    fetchopenstocks()
    return notification(request.message)
}

async function saveopenstock() {
    if(!document.querySelector('#tabledata tr[data-itemid]')) return notification('Nothing to save', 0)
    if(!openstockActiveDepartment) return notification('Please select a Department / Sales Point first', 0)

    let hasValue = false
    Array.from(document.getElementsByName('beginbalance')).forEach(input=>{
        if(input.value === '') input.value = 0
        if(String(input.value || '').trim() !== '') hasValue = true
    })
    if(!hasValue) return notification('Please enter atleast one item quantity', 0)

    let request = await httpRequest2('../controllers/openingstock', buildOpenstockSavePayload(), document.querySelector('#openstockform #save'))
    if(request.status) {
        const department = openstockActiveDepartment
        await loadOpenstockDepartmentItems(department, { notifyOnSuccess: false })
        return notification(request.message, 1)
    }
    return notification(request.message || 'No records retrieved', 0)
}

async function deleteitemopenstock() {
    return notification('Delete Selected is no longer used on opening stock', 0)
}
