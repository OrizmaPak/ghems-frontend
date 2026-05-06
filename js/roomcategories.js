let roomcategoriesid
let roomcatImportedRows = []
let roomCategoryRatecodes = []
let roomCategoryCompanies = []
let roomCategoryAgencies = []
const roomcatImportDelay = 800
async function roomcategoriesActive() {
    const form = document.querySelector('#roomcategoriesform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', roomcategoriesFormSubmitHandler)
    if(document.getElementById('addCompanyRateRowBtn')) document.getElementById('addCompanyRateRowBtn').addEventListener('click', ()=>appendCompanyRateRow())
    if(document.getElementById('addAgencyRateRowBtn')) document.getElementById('addAgencyRateRowBtn').addEventListener('click', ()=>appendAgencyRateRow())
    datasource = []
    await fetchroomcategories()
    await fetchratecodes()
    await fetchcompanysources()
    await fetchagencysources()
    resetRoomCategoryGridRows()
    wireRoomCategoryImport()
}

async function fetchratecodes(id) {
    let request = await httpRequest2('../controllers/fetchratecode', null, null, 'json')
    if(request.status) {
        if(request.data.length) {
            roomCategoryRatecodes = request.data
            let options = request.data?.map( item => `<option value="${item.id}">${item.ratecode}</option>`).join('')
            try {
                document.getElementById('roomcategoriesform').ratecode.innerHTML = options
            } catch(e) {console.log(e)}
        }
    }
    else return notification('No records retrieved')
}

async function fetchroomcategories(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchroomcategories', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onroomcategoriesTableDataSignal)
            }
        }else{
             roomcategoriesid = request.data[0].id
            populateData(request.data[0])
            populateRoomCategoryGridsFromRecord(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeroomcategories(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this roomcategories?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removeroomcategory', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchroomcategories()
    return notification(request.message);
    
}


async function onroomcategoriesTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.category}</td>
        <td>${item.ratecode}</td>
        <td>${item.currency}</td>
        <td>${item.categorytype}</td>
        <td>${formatCurrency(item.minimumrequireddeposit)}</td>
        <td>${formatCurrency(item.price)}</td>
        <td>${formatCurrency(item.price_2)}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchroomcategories('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeroomcategories('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function roomcategoriesFormSubmitHandler() {
    if(!validateForm('roomcategoriesform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#roomcategoriesform'), roomcategoriesid ? [['id', roomcategoriesid]] : null)
    appendRoomCategoryGridPayload(payload)
    let request = await httpRequest2('../controllers/roomcategories', payload, document.querySelector('#roomcategoriesform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        roomcategoriesid = ''
        document.querySelector('#roomcategoriesform').reset();
        resetRoomCategoryGridRows()
        fetchroomcategories();
        return
    }
        roomcategoriesid = ''
    document.querySelector('#roomcategoriesform').reset();
    resetRoomCategoryGridRows()
    fetchroomcategories();
    return notification(request.message, 0);
}

async function fetchcompanysources() {
    let request = await httpRequest2('../controllers/fetchcompanyforgroups', null, null, 'json')
    roomCategoryCompanies = request?.status && Array.isArray(request.data) ? request.data : []
}

async function fetchagencysources() {
    let request = await httpRequest2('../controllers/fetchtravelagency', null, null, 'json')
    roomCategoryAgencies = request?.status && Array.isArray(request.data) ? request.data : []
}

function getRatecodeOptionsHtml(selected = '') {
    const target = String(selected || '')
    const options = roomCategoryRatecodes.map(item => `<option value="${item.id}" ${String(item.id) === target ? 'selected' : ''}>${item.ratecode}</option>`).join('')
    return `<option value="">-- Select Ratecode --</option>${options}`
}

function getCompanyOptionsHtml(selected = '') {
    const target = String(selected || '')
    const options = roomCategoryCompanies.map(item => `<option value="${item.id}" ${String(item.id) === target ? 'selected' : ''}>${item.companyname}</option>`).join('')
    return `<option value="">-- Select Company --</option>${options}`
}

function getAgencyOptionsHtml(selected = '') {
    const target = String(selected || '')
    const options = roomCategoryAgencies.map(item => `<option value="${item.id}" ${String(item.id) === target ? 'selected' : ''}>${item.agencyname}</option>`).join('')
    return `<option value="">-- Select Agency --</option>${options}`
}

function appendCompanyRateRow(orgid = '', ratecode = '') {
    const tbody = document.getElementById('companyRateGridBody')
    if(!tbody) return
    const tr = document.createElement('tr')
    tr.innerHTML = `
        <td><select class="form-control company-orgid">${getCompanyOptionsHtml(orgid)}</select></td>
        <td><select class="form-control company-ratecode">${getRatecodeOptionsHtml(ratecode)}</select></td>
        <td><button type="button" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white text-xs" style="font-size: 18px;" onclick="this.closest('tr').remove()">delete</button></td>
    `
    tbody.appendChild(tr)
}

function appendAgencyRateRow(orgid = '', ratecode = '') {
    const tbody = document.getElementById('agencyRateGridBody')
    if(!tbody) return
    const tr = document.createElement('tr')
    tr.innerHTML = `
        <td><select class="form-control agency-orgid">${getAgencyOptionsHtml(orgid)}</select></td>
        <td><select class="form-control agency-ratecode">${getRatecodeOptionsHtml(ratecode)}</select></td>
        <td><button type="button" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white text-xs" style="font-size: 18px;" onclick="this.closest('tr').remove()">delete</button></td>
    `
    tbody.appendChild(tr)
}

function resetRoomCategoryGridRows() {
    const companyBody = document.getElementById('companyRateGridBody')
    const agencyBody = document.getElementById('agencyRateGridBody')
    if(companyBody) companyBody.innerHTML = ''
    if(agencyBody) agencyBody.innerHTML = ''
    appendCompanyRateRow()
    appendAgencyRateRow()
}

function appendRoomCategoryGridPayload(payload) {
    const companyRows = Array.from(document.querySelectorAll('#companyRateGridBody tr'))
        .map(row => ({
            orgid: String(row.querySelector('.company-orgid')?.value || '').trim(),
            ratecode: String(row.querySelector('.company-ratecode')?.value || '').trim()
        }))
        .filter(row => row.orgid || row.ratecode)
    payload.append('coyrowsize', String(companyRows.length))
    companyRows.forEach((row, index) => {
        const i = index + 1
        payload.append(`coyorgid${i}`, row.orgid)
        payload.append(`coyratecode${i}`, row.ratecode)
    })

    const agencyRows = Array.from(document.querySelectorAll('#agencyRateGridBody tr'))
        .map(row => ({
            orgid: String(row.querySelector('.agency-orgid')?.value || '').trim(),
            ratecode: String(row.querySelector('.agency-ratecode')?.value || '').trim()
        }))
        .filter(row => row.orgid || row.ratecode)
    payload.append('agrowsize', String(agencyRows.length))
    agencyRows.forEach((row, index) => {
        const i = index + 1
        payload.append(`agorgid${i}`, row.orgid)
        payload.append(`agratecode${i}`, row.ratecode)
    })
}

function populateRoomCategoryGridsFromRecord(record = {}) {
    const companyBody = document.getElementById('companyRateGridBody')
    const agencyBody = document.getElementById('agencyRateGridBody')
    if(companyBody) companyBody.innerHTML = ''
    if(agencyBody) agencyBody.innerHTML = ''

    let hasCompany = false
    let hasAgency = false

    const coyrowsize = Number(record.coyrowsize || 0)
    for(let i = 1; i <= coyrowsize; i++) {
        const orgid = record[`coyorgid${i}`]
        const ratecode = record[`coyratecode${i}`]
        if(String(orgid || '').trim() || String(ratecode || '').trim()) {
            appendCompanyRateRow(orgid, ratecode)
            hasCompany = true
        }
    }

    const agrowsize = Number(record.agrowsize || 0)
    for(let i = 1; i <= agrowsize; i++) {
        const orgid = record[`agorgid${i}`]
        const ratecode = record[`agratecode${i}`]
        if(String(orgid || '').trim() || String(ratecode || '').trim()) {
            appendAgencyRateRow(orgid, ratecode)
            hasAgency = true
        }
    }

    if(!hasCompany) appendCompanyRateRow()
    if(!hasAgency) appendAgencyRateRow()
}

function wireRoomCategoryImport(){
    const templateBtn = document.getElementById('roomcatTemplateBtn')
    const importBtn = document.getElementById('roomcatImportBtn')
    const importInput = document.getElementById('roomcatImportInput')
    const modal = document.getElementById('roomcatImportModal')
    const closeBtn = document.getElementById('roomcatModalClose')
    const cancelBtn = document.getElementById('roomcatModalCancel')
    if(templateBtn) templateBtn.addEventListener('click', downloadRoomCategoryTemplate)
    if(importBtn && importInput) importBtn.addEventListener('click', async ()=>{
        await fetchratecodes() // make sure lookups are fresh before mapping rows
        importInput.click()
    })
    if(importInput) importInput.addEventListener('change', handleRoomCategoryExcelImport)
    if(closeBtn) closeBtn.addEventListener('click', ()=>toggleRoomCatModal(false))
    if(cancelBtn) cancelBtn.addEventListener('click', ()=>toggleRoomCatModal(false))
    const selectAll = document.getElementById('roomcatSelectAll')
    if(selectAll) selectAll.addEventListener('change', ()=>{
        document.querySelectorAll('#roomcatImportTable input[type=\"checkbox\"]').forEach(cb=>cb.checked = selectAll.checked)
    })
    const submitBtn = document.getElementById('roomcatModalSubmit')
    if(submitBtn) submitBtn.addEventListener('click', importSelectedRoomCategories)
}

async function ensureXLSXLoadedRoomCat(){
    if(window.XLSX) return true
    return await new Promise(resolve=>{
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
        script.onload = ()=>resolve(true)
        script.onerror = ()=>resolve(false)
        document.head.appendChild(script)
    })
}

async function downloadRoomCategoryTemplate(){
    const ok = await ensureXLSXLoadedRoomCat()
    if(!ok) return notification('Could not load Excel helper. Check your connection.', 0)
    const sampleRows = [
        {
            'Category': 'Deluxe Suite',
            'Category Type': 'SUITE',
            'Rate Code': 'RC-DELUXE',
            'Currency': 'NGN',
            'Minimum Deposit': 50000,
            'Price': 120000,
            'Price Level 2': 100000
        },
        {
            'Category': 'Conference Hall',
            'Category Type': 'HALL',
            'Rate Code': 'RC-HALL',
            'Currency': 'USD',
            'Minimum Deposit': 300,
            'Price': 900,
            'Price Level 2': 800
        }
    ]
    const ws = XLSX.utils.json_to_sheet(sampleRows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'RoomCategories')
    XLSX.writeFile(wb, 'room_categories_template.xlsx')
}

async function handleRoomCategoryExcelImport(event){
    const file = event.target.files[0]
    if(!file) return
    const ok = await ensureXLSXLoadedRoomCat()
    if(!ok) {
        event.target.value = ''
        return notification('Could not load Excel helper. Check your connection.', 0)
    }
    const reader = new FileReader()
    reader.onload = e=>{
        try{
            const workbook = XLSX.read(e.target.result, {type:'array'})
            const sheet = workbook.Sheets[workbook.SheetNames[0]]
            const rawRows = XLSX.utils.sheet_to_json(sheet, {defval: ''})
            roomcatImportedRows = normalizeRoomCategoryRows(rawRows)
            buildRoomCategoryImportTable(roomcatImportedRows)
            toggleRoomCatModal(true)
        }catch(err){
            console.error(err)
            notification('Unable to read Excel file. Please confirm the template.', 0)
        }finally{
            event.target.value = ''
        }
    }
    reader.readAsArrayBuffer(file)
}

function normalizeRoomCategoryRows(rawRows){
    const map = {
        'category': 'category',
        'category name': 'category',
        'category type': 'categorytype',
        'type': 'categorytype',
        'rate code': 'ratecode',
        'currency': 'currency',
        'minimum deposit': 'minimumrequireddeposit',
        'minimum deposit required': 'minimumrequireddeposit',
        'min deposit': 'minimumrequireddeposit',
        'price': 'price',
        'price level 2': 'price_2',
        'price level two': 'price_2'
    }
    const rows = []
    rawRows.forEach(item=>{
        const normalized = {}
        Object.keys(item).forEach(key=>{
            const mappedKey = map[key?.toString().trim().toLowerCase()]
            if(mappedKey) normalized[mappedKey] = item[key]
        })
        const hasValue = Object.values(normalized).some(v=>`${v}`.trim() !== '')
        if(hasValue) rows.push(normalized)
    })
    return rows
}

function buildRoomCategoryImportTable(rows){
    const tbody = document.getElementById('roomcatImportTable')
    const count = document.getElementById('roomcatImportCount')
    const selectAll = document.getElementById('roomcatSelectAll')
    if(!tbody) return
    tbody.innerHTML = ''
    if(!rows.length){
        tbody.innerHTML = `<tr><td colspan="8" class="p-4 text-center text-[#666]">No rows found in Excel.</td></tr>`
        if(count) count.textContent = '0 rows'
        return
    }
    rows.forEach((row, idx)=>{
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td class="p-3 align-top">
                <input type="checkbox" class="roomcat-row-checkbox accent-[#22c55e]" data-index="${idx}" checked />
            </td>
            <td class="p-3">${row.category || ''}</td>
            <td class="p-3">${resolveRoomCatSelectLabel('categorytype', row.categorytype)}</td>
            <td class="p-3">${resolveRoomCatSelectLabel('ratecode', row.ratecode)}</td>
            <td class="p-3">${resolveRoomCatSelectLabel('currency', row.currency)}</td>
            <td class="p-3">${formatRoomCatNumberForImport(row.minimumrequireddeposit)}</td>
            <td class="p-3">${formatRoomCatNumberForImport(row.price)}</td>
            <td class="p-3">${formatRoomCatNumberForImport(row.price_2)}</td>
        `
        tbody.appendChild(tr)
    })
    if(count) count.textContent = `${rows.length} row${rows.length>1?'s':''}`
    if(selectAll) selectAll.checked = true
}

function toggleRoomCatModal(show){
    const modal = document.getElementById('roomcatImportModal')
    if(!modal) return
    if(show) modal.classList.remove('hidden')
    else modal.classList.add('hidden')
    const status = document.getElementById('roomcatImportStatus')
    if(status) status.textContent = ''
}

async function importSelectedRoomCategories(){
    const modal = document.getElementById('roomcatImportModal')
    if(!modal || !roomcatImportedRows.length) return notification('No rows to import', 0)
    const checkboxes = Array.from(document.querySelectorAll('.roomcat-row-checkbox')).filter(cb=>cb.checked)
    if(!checkboxes.length) return notification('Select at least one row to import.', 0)
    const rowsToImport = checkboxes.map(cb=>roomcatImportedRows[cb.getAttribute('data-index')])
    const status = document.getElementById('roomcatImportStatus')
    const submitBtn = document.getElementById('roomcatModalSubmit')
    const loader = submitBtn?.querySelector('.btnloader')
    if(loader) loader.style.display = 'flex'
    if(submitBtn) submitBtn.setAttribute('disabled', true)
    let successCount = 0
    for(let i=0; i<rowsToImport.length; i++){
        if(i>0) await delayRoomCat(roomcatImportDelay)
        if(status) status.textContent = `Submitting ${i+1}/${rowsToImport.length}...`
        const row = rowsToImport[i]
        const payload = mapRoomCategoryToFormData(row)
        const request = await httpRequest2('../controllers/roomcategories', payload, null)
        if(request?.status) successCount++
    }
    if(loader) loader.style.display = 'none'
    if(submitBtn) submitBtn.removeAttribute('disabled')
    if(status) status.textContent = `${successCount}/${rowsToImport.length} submitted`
    fetchroomcategories()
    toggleRoomCatModal(false)
    notification(`${successCount} row(s) imported`, successCount ? 1 : 0)
}

function mapRoomCategoryToFormData(row){
    const form = new FormData()
    form.append('category', (row.category || '').toString().trim())
    form.append('categorytype', resolveSelectValue('categorytype', row.categorytype))
    form.append('ratecode', resolveSelectValue('ratecode', row.ratecode))
    form.append('currency', resolveSelectValue('currency', row.currency))
    form.append('minimumrequireddeposit', normalizeRoomCategoryNumber(row.minimumrequireddeposit))
    form.append('price', normalizeRoomCategoryNumber(row.price))
    form.append('price_2', normalizeRoomCategoryNumber(row.price_2))
    return form
}

function resolveSelectValue(selectId, rawValue){
    const selectEl = document.getElementById(selectId)
    const fallback = `${rawValue || ''}`.trim()
    if(!selectEl) return fallback
    const target = `${rawValue || ''}`.trim().toUpperCase()
    const match = Array.from(selectEl.options).find(opt=>opt.text.trim().toUpperCase() === target || opt.value.trim().toUpperCase() === target)
    return match ? match.value : fallback
}

function normalizeRoomCategoryNumber(val){
    if(val === undefined || val === null) return ''
    const num = Number(val)
    return isNaN(num) ? val : num
}

function resolveRoomCatSelectLabel(selectId, rawValue){
    const selectEl = document.getElementById(selectId)
    const fallback = `${rawValue || ''}`.trim()
    if(!selectEl) return fallback
    const target = fallback.toUpperCase()
    const match = Array.from(selectEl.options).find(opt=>opt.text.trim().toUpperCase() === target || opt.value.trim().toUpperCase() === target)
    return match ? match.text : fallback
}

function formatRoomCatNumberForImport(val){
    if(val === undefined || val === null) return ''
    const num = Number(val)
    return isNaN(num) ? val : num
}

function delayRoomCat(ms){
    return new Promise(resolve=>setTimeout(resolve, ms))
}


// function runAdroomcategoriesFormValidations() {
//     let form = document.getElementById('roomcategoriesform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#roomcategoriesname'))  controls.push([form.querySelector('#roomcategoriesname'), 'roomcategories name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
