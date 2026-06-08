let openstockid
let openstockDatasource = []
let openstockImportEventsBound = false
let openstockDepartmentSelect = null
let openstockTomSelectAssetsPromise = null
let openstockAllDepartments = []
let openstockAvailableDepartments = []
let openstockActiveDepartment = ''
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

function normalizeOpenstockDepartmentLabel(value){
    const label = String(value || '').trim()
    if(label === 'FRONT-DESK/BOOKING') return 'Booking/Reservation'
    return label
}

function setOpenstockActiveDepartmentStatus(message = ''){
    const status = did('openstock-active-department-status')
    if(!status) return
    status.textContent = message
}

function getOpenstockSelectedDepartment(){
    const control = did('salespointname')
    if(!control) return ''
    if(control.tomselect && typeof control.tomselect.getValue === 'function'){
        return String(control.tomselect.getValue() || '').trim()
    }
    return String(control.value || '').trim()
}

function clearOpenstockSelectedDepartment(){
    const control = did('salespointname')
    if(!control) return
    if(control.tomselect && typeof control.tomselect.clear === 'function'){
        control.tomselect.clear(true)
        return
    }
    control.value = ''
}

function openstockEnsureTomSelectAssets() {
    if (window.TomSelect) return Promise.resolve()
    if (openstockTomSelectAssetsPromise) return openstockTomSelectAssetsPromise
    openstockTomSelectAssetsPromise = new Promise((resolve, reject) => {
        if (!document.querySelector('link[data-openstock-tom-select]')) {
            const css = document.createElement('link')
            css.rel = 'stylesheet'
            css.href = 'https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/css/tom-select.css'
            css.dataset.openstockTomSelect = '1'
            document.head.appendChild(css)
        }
        const existingScript = document.querySelector('script[data-openstock-tom-select]')
        if (existingScript) {
            if (window.TomSelect) resolve()
            else existingScript.addEventListener('load', () => resolve(), { once: true })
            return
        }
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/js/tom-select.complete.min.js'
        script.dataset.openstockTomSelect = '1'
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Unable to load Tom Select'))
        document.head.appendChild(script)
    })
    return openstockTomSelectAssetsPromise
}

function getOpenstockDepartmentOptions(departments = []){
    return departments.map(item=>({
        value: String(item?.value || '').trim(),
        label: String(item?.label || '').trim()
    })).filter(item=>item.value)
}

function renderOpenstockDepartmentOptions(){
    const control = did('salespointname')
    if(!control) return
    const options = getOpenstockDepartmentOptions(openstockAvailableDepartments)
    control.innerHTML = `<option value="">-- Select Department / Sales Point --</option>${
        options.map(item=>`<option value="${item.value.replace(/"/g, '&quot;')}">${item.label}</option>`).join('')
    }`
    if(openstockDepartmentSelect){
        openstockDepartmentSelect.clearOptions()
        openstockDepartmentSelect.addOptions(options.map(item=>({ value: item.value, text: item.label })))
        openstockDepartmentSelect.refreshOptions(false)
        openstockDepartmentSelect.clear(true)
    }
}

async function initializeOpenstockDepartmentPicker(){
    await openstockEnsureTomSelectAssets()
    const control = did('salespointname')
    if(!control || !window.TomSelect) return
    if(openstockDepartmentSelect){
        openstockDepartmentSelect.destroy()
        openstockDepartmentSelect = null
    }
    openstockDepartmentSelect = new window.TomSelect(control, {
        create: false,
        persist: false,
        maxOptions: 1000,
        placeholder: 'Search department / sales point'
    })
}

async function fetchOpenstockDepartments(){
    const request = await httpRequest2('../controllers/fetchdepartments', null, null, 'json')
    if(!request?.status || !Array.isArray(request.data)){
        renderOpenstockDepartmentOptions()
        return notification(request?.message || 'Unable to load departments', 0)
    }
    const normalized = request.data
        .filter(item=>item?.applyforsales == 'STOCK' || item?.applyforsales == 'NON STOCK')
        .map(item=>({
            value: normalizeOpenstockDepartmentLabel(item?.department),
            label: normalizeOpenstockDepartmentLabel(item?.department),
            raw: item
        }))
        .filter(item=>item.value)
    const uniqueMap = new Map()
    normalized.forEach(item=>{
        if(!uniqueMap.has(item.value)) uniqueMap.set(item.value, item)
    })
    openstockAllDepartments = Array.from(uniqueMap.values())
    openstockAvailableDepartments = [...openstockAllDepartments]
    renderOpenstockDepartmentOptions()
}

function removeOpenstockDepartmentFromPicker(department){
    const normalized = normalizeOpenstockDepartmentLabel(department)
    if(!normalized) return
    openstockAvailableDepartments = openstockAvailableDepartments.filter(item=>item.value !== normalized)
    renderOpenstockDepartmentOptions()
}

function restoreOpenstockDepartmentToPicker(department){
    const normalized = normalizeOpenstockDepartmentLabel(department)
    if(!normalized) return
    const existing = openstockAvailableDepartments.some(item=>item.value === normalized)
    if(existing) return
    const source = openstockAllDepartments.find(item=>item.value === normalized)
    if(source){
        openstockAvailableDepartments.push(source)
        openstockAvailableDepartments.sort((a, b)=>String(a.label).localeCompare(String(b.label)))
        renderOpenstockDepartmentOptions()
    }
}

function clearOpenstockTableState(options = {}){
    const { restoreActiveDepartment = true } = options
    if(restoreActiveDepartment && openstockActiveDepartment){
        restoreOpenstockDepartmentToPicker(openstockActiveDepartment)
    }
    openstockDatasource = []
    datasource = []
    openstockActiveDepartment = ''
    clearOpenstockSelectedDepartment()
    setOpenstockActiveDepartmentStatus('')
    renderUnfilteredListPrompt('tabledata')
    setOpenstockBulkStatus('')
}

async function openstockActive() {
    wireOpenstockImport()
    renderUnfilteredListPrompt('tabledata')
    openstockDatasource = []
    openstockActiveDepartment = ''
    setOpenstockActiveDepartmentStatus('')
    await initializeOpenstockDepartmentPicker()
    await fetchOpenstockDepartments()
    if(document.querySelector('#openstockAddDepartmentBtn')) document.querySelector('#openstockAddDepartmentBtn').addEventListener('click', ()=>openstockFormSubmitHandler())
    if(document.querySelector('#openstockClearDepartmentBtn')) document.querySelector('#openstockClearDepartmentBtn').addEventListener('click', ()=>clearOpenstockTableState())
    if(document.querySelector('#save')) document.querySelector('#save').addEventListener('click',saveopenstock, false)
    if(document.querySelector('#selectall')) document.querySelector('#selectall').addEventListener('click', e=>{
        for(let i=0;i<document.getElementsByName('itemer').length;i++){
            document.getElementsByName('itemer')[i].checked = true
        }
    })
    if(document.querySelector('#deselectall')) document.querySelector('#deselectall').addEventListener('click', e=>{
        for(let i=0;i<document.getElementsByName('itemer').length;i++){
            document.getElementsByName('itemer')[i].checked = false
        }
    })
    if(document.querySelector('#delete')) document.querySelector('#delete').addEventListener('click', e=>{
        let j = false
        for(let i=0;i<document.getElementsByName('itemer').length;i++){
            if(document.getElementsByName('itemer')[i].checked == true)j=true
        }
        if(!j)return notification('Please select atleast an item to delete', 0)
        deleteitemopenstock()
    })
    // form.querySelector('#submit').click()
    datasource = []
}

function setOpenstockBulkStatus(message, isError){
    const status = did('openstock-bulk-status')
    if(!status) return
    status.textContent = message || ''
    status.style.color = isError ? '#b91c1c' : '#334155'
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

function getOpenstockActiveSalesPoint(){
    return String(
        openstockActiveDepartment ||
        getOpenstockSelectedDepartment() ||
        openstockDatasource?.[0]?.salespoint ||
        default_department ||
        ''
    ).trim()
}

function getOpenstockRowsForTemplate(){
    const rows = Array.isArray(openstockDatasource) ? openstockDatasource : []
    return rows.map(item=>({
        'Item ID': String(item?.itemid || '').trim(),
        'Item Name': String(item?.itemname || '').trim(),
        'Item Type': String(item?.itemtype || '').trim(),
        'Stock Value': '',
        'Sales Point': String(item?.salespoint || openstockActiveDepartment || getOpenstockSelectedDepartment() || '').trim()
    }))
}

async function downloadOpenstockTemplate(){
    const salespoint = getOpenstockActiveSalesPoint()
    if(!salespoint) return notification('Please select a Department / Sales Point', 0)

    if(!openstockDatasource.length){
        await openstockFormSubmitHandler(salespoint)
    }

    if(!openstockDatasource.length) return notification('No items available for template export', 0)
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
            salespoint: String(normalized.salespoint || '').trim(),
            qty: String(normalized.qty ?? '').replace(/,/g, '').trim()
        })
    })
    return rows
}

function buildOpenstockImportPayload(row){
    const payload = new FormData()
    payload.append('salespoint', row.salespoint || openstockActiveDepartment || getOpenstockSelectedDepartment() || '')
    payload.append('itemname', row.itemname || '')
    payload.append('itemid', row.itemid || '')
    payload.append('qty', row.qty || '0')
    return payload
}

function syncOpenstockTableImportedValues(rows){
    if(!Array.isArray(rows) || !rows.length) return
    const importedMap = new Map(rows.map(row=>[String(row.itemid || '').trim(), row.qty]))
    const itemInputs = document.getElementsByName('itemid')
    const qtyInputs = document.getElementsByName('beginbalance')
    for(let i=0; i<itemInputs.length; i++){
        const itemId = String(itemInputs[i]?.value || '').trim()
        if(importedMap.has(itemId) && qtyInputs[i]){
            qtyInputs[i].value = importedMap.get(itemId)
        }
    }
}

async function importOpenstockRowsSequentially(rows){
    let successCount = 0
    let failureCount = 0
    const failures = []

    for(let i=0; i<rows.length; i++){
        const row = rows[i]
        setOpenstockBulkStatus(`Importing ${i + 1} of ${rows.length}: ${row.itemname || row.itemid}`)
        const request = await httpRequest2('../controllers/openingstock', buildOpenstockImportPayload(row), null, 'json')
        if(request && request.status){
            successCount++
        }else{
            failureCount++
            failures.push(`${row.itemname || row.itemid}: ${request?.message || 'Update failed'}`)
        }
    }

    if(failureCount){
        setOpenstockBulkStatus(`Imported ${successCount}/${rows.length}. ${failureCount} failed.`, true)
        return notification(failures[0] || 'Some rows failed to import', 0)
    }

    setOpenstockBulkStatus(`Imported ${successCount}/${rows.length} opening stock rows successfully.`)
    return notification('Opening stock import completed successfully', 1)
}

async function handleOpenstockImport(event){
    const file = event.target.files[0]
    if(!file) return
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
            const normalizedRows = normalizeOpenstockImportRows(rawRows)
                .filter(row=>row.itemid && row.itemname && row.qty !== '')

            if(!normalizedRows.length) return notification('No valid stock rows found in the import file', 0)

            const activeSalesPoint = String(openstockActiveDepartment || getOpenstockSelectedDepartment() || '').trim()
            normalizedRows.forEach(row=>{
                if(!row.salespoint) row.salespoint = activeSalesPoint
            })

            syncOpenstockTableImportedValues(normalizedRows)
            await importOpenstockRowsSequentially(normalizedRows)
            await openstockFormSubmitHandler(activeSalesPoint || default_department)
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

async function fetchopenstocks(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    const payload = id ? getparamm() : null
    if(shouldBlockUnfilteredListFetch({ id, payload, isInitialLoad: true })) return
    let request = await httpRequest2('../controllers/fetchinventorylist', payload, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `<tr>
                                                <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                                            </tr>`
    if(request.status) {
        const items = normalizeInventoryItems(request.data)
        if(!id){
            if(items.length) {
                datasource = items
                
                // resolvePagination(datasource, onopenstockTableDataSignal)
            }
        }else{
             openstockid = items[0]?.id
            if(items[0])populateData(items[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeopenstock(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this item?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removeitem', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchopenstocks()
    return notification(request.message);
    
}


// async function onopenstockTableDataSignal() {
//     let rows = getSignaledDatasource().map((item, index) => `
//     <tr>
//         <td>${item.index + 1 }</td>
//         <td>${item.itemname}</td>
//         <td><input value="${item.price ? Number(item.price) : ''}" type="number" name="price" id="price" class="form-control" placeholder="Enter Price"></td>
//         <td><input value="${item.price_two ? Number(item.price_two) : ''}" type="number" name="price_two" id="price_two" class="form-control" placeholder="Enter Price two"></td>
//         <td><input value="${item.beginbalance ? Number(item.beginbalance) : ''}" type="number" name="beginbalance" id="beginbalance" class="form-control" placeholder="Enter min balance"></td>
//         <td><input value="${item.balance ? Number(item.balance) : ''}" type="number" name="balance" id="balance" class="form-control" placeholder="Enter stock balance"></td>
//     </tr>`
//     )
//     .join('')
//     injectPaginatatedTable(rows)
// }

async function openstockFormSubmitHandler(store) {
    const selectedDepartment = normalizeOpenstockDepartmentLabel(store || getOpenstockSelectedDepartment())
    if(!selectedDepartment) return notification('Please select a Department / Sales Point', 0)
    const previousActiveDepartment = openstockActiveDepartment
    const previousDatasource = Array.isArray(openstockDatasource) ? [...openstockDatasource] : []
    const previousTableMarkup = String(did('tabledata')?.innerHTML || '')
    did('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">Loading...</td></tr>`
    setOpenstockBulkStatus('')
    if(document.querySelector('#openstockAddDepartmentBtn')) document.querySelector('#openstockAddDepartmentBtn').setAttribute('disabled', 'disabled')
    function payload(){
        let param = new FormData()
        param.append('salespoint', selectedDepartment)
        return param
    }
    let request = await httpRequest2('../controllers/fetchinventorybysalespoint', payload(), document.querySelector('#openstockform #save'))
    document.getElementById('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No records retrieved</td></tr>`
    if(document.querySelector('#openstockAddDepartmentBtn')) document.querySelector('#openstockAddDepartmentBtn').removeAttribute('disabled')
    if(request.status) {
            if(request.data.length) {
                if(previousActiveDepartment && previousActiveDepartment !== selectedDepartment){
                    restoreOpenstockDepartmentToPicker(previousActiveDepartment)
                }
                datasource = request.data
                openstockDatasource = request.data
                openstockActiveDepartment = selectedDepartment
                removeOpenstockDepartmentFromPicker(selectedDepartment)
                clearOpenstockSelectedDepartment()
                setOpenstockActiveDepartmentStatus(`Loaded Department: ${selectedDepartment}`)
                document.getElementById('tabledata').innerHTML = request.data.map((item, index) => `
                <tr>
                    <input value="${item.itemid ? Number(item.itemid) : ''}" type="hidden" name="itemid" id="itemid-${index}" class="form-control comp" placeholder="Enter Price">
                    <input value="${item.id ? Number(item.id) : ''}" type="hidden" name="id" id="id-${index}" class="form-control comp" placeholder="Enter Price">
                    <td>${index + 1 }</td>
                    <td><p name="itemname">${item.itemname}</p></td>
                    <td>${item.itemtype || '-'}</td>
                    <td><input type="number" name="beginbalance" id="beginbalance-${index}" class="form-control comp" placeholder="Enter min balance"></td>
                </tr>`
                )
                .join('')
                // resolvePagination(datasource, onopenstockTableDataSignal)
                return notification(request.message, 1);
            }
            openstockDatasource = []
            if(previousActiveDepartment && previousDatasource.length){
                datasource = previousDatasource
                openstockDatasource = previousDatasource
                openstockActiveDepartment = previousActiveDepartment
                setOpenstockActiveDepartmentStatus(`Loaded Department: ${previousActiveDepartment}`)
                did('tabledata').innerHTML = previousTableMarkup
                clearOpenstockSelectedDepartment()
            }else{
                restoreOpenstockDepartmentToPicker(selectedDepartment)
                openstockActiveDepartment = ''
                clearOpenstockSelectedDepartment()
                setOpenstockActiveDepartmentStatus('')
                renderUnfilteredListPrompt('tabledata')
            }
            return notification('No records retrieved', 0)
    }else {
                openstockDatasource = []
                if(previousActiveDepartment && previousDatasource.length){
                    datasource = previousDatasource
                    openstockDatasource = previousDatasource
                    openstockActiveDepartment = previousActiveDepartment
                    setOpenstockActiveDepartmentStatus(`Loaded Department: ${previousActiveDepartment}`)
                    did('tabledata').innerHTML = previousTableMarkup
                    clearOpenstockSelectedDepartment()
                }else{
                    restoreOpenstockDepartmentToPicker(selectedDepartment)
                    openstockActiveDepartment = ''
                    clearOpenstockSelectedDepartment()
                    setOpenstockActiveDepartmentStatus('')
                    did('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">${request.message || 'No records retrieved'}</td></tr>`
                }
            return notification('No records retrieved')
            }
}

async function saveopenstock() {
    // if(!validateForm('openstockform', getIdFromCls('comp'))) return
    if(!document.getElementsByName('beginbalance')[0])return notification('Nothing to save', 0)
    if(!openstockActiveDepartment) return notification('Please add a Department / Sales Point first', 0)
    let m = false
    for(let l=0;l<document.getElementsByName('beginbalance').length;l++){
        if(document.getElementsByName('beginbalance')[l].value == '')document.getElementsByName('beginbalance')[l].value = 0
        if(document.getElementsByName('beginbalance')[l].value)m=true
    }
    if(!m)return notification('Please enter atleast one item quantity', 0)
    function payload(){
        let param = new FormData()
        param.append('salespoint', openstockActiveDepartment)
        let itemid = ''
        let itemname = ''
        let beginbalance = '' 
        for(let i=0;i<document.getElementsByName('itemid').length;i++){
            console.log(document.getElementsByName('beginbalance')[i].value)
            if(i == 0){
                itemid = document.getElementsByName('itemid')[i].value;
                itemname = document.getElementsByName('itemname')[i].innerHTML;
                beginbalance = document.getElementsByName('beginbalance')[i].value;
            }else{
                itemid = itemid+'|'+document.getElementsByName('itemid')[i].value;
                itemname = itemname+'|'+document.getElementsByName('itemname')[i].innerHTML;
                beginbalance = beginbalance+'|'+document.getElementsByName('beginbalance')[i].value;
            }
        }
            param.append('itemname', itemname)
            param.append('itemid', itemid)
            param.append('qty', beginbalance)
        return param
    }
    let request = await httpRequest2('../controllers/openingstock', payload(),  document.querySelector('#openstockform #save'))
    // document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
                clearOpenstockTableState()
                return notification(request.message, 1);
    }else{
        return notification(request.message || 'No records retrieved', 0)}
}

async function deleteitemopenstock() {
    if(!openstockActiveDepartment) return notification('Please add a Department / Sales Point first', 0)
    function payload(){
        let param = new FormData()
        param.append('salespoint', openstockActiveDepartment) 
        let itemid = ''
        let id = ''
        for(let i=0;i<document.getElementsByName('itemer').length;i++){
            if(document.getElementsByName('itemer')[i].checked == true){
                    itemid = itemid+'|'+document.getElementsByName('itemid')[i].value;
                    id = id+'|'+document.getElementsByName('id')[i].value;
            }
        }
            param.append('itemid', itemid.slice(1))
            param.append('id', id.slice(1))
        return param
    }
    let request = await httpRequest2('../controllers/deleteinventoryfromupdate', payload(),  document.querySelector('#openstockform #delete'))
    if(request.status) {
                openstockFormSubmitHandler(openstockActiveDepartment)
                return notification(request.message, 1);
    }else return notification('No records retrieved')
}


// function runAdopenstockFormValidations() {
//     let form = document.getElementById('openstockform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#openstockname'))  controls.push([form.querySelector('#openstockname'), 'openstock name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
