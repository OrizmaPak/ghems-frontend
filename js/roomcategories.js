let roomcategoriesid
let roomcatImportedRows = []
async function roomcategoriesActive() {
    const form = document.querySelector('#roomcategoriesform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', roomcategoriesFormSubmitHandler)
    datasource = []
    await fetchroomcategories()
    await fetchratecodes()
    wireRoomCategoryImport()
}

async function fetchratecodes(id) {
    let request = await httpRequest2('../controllers/fetchratecode', null, null, 'json')
    if(request.status) {
        if(request.data.length) {
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
    let request = await httpRequest2('../controllers/roomcategories', payload, document.querySelector('#roomcategoriesform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        roomcategoriesid = ''
        document.querySelector('#roomcategoriesform').reset();
        fetchroomcategories();
        return
    }
        roomcategoriesid = ''
    document.querySelector('#roomcategoriesform').reset();
    fetchroomcategories();
    return notification(request.message, 0);
}

function wireRoomCategoryImport(){
    const templateBtn = document.getElementById('roomcatTemplateBtn')
    const importBtn = document.getElementById('roomcatImportBtn')
    const importInput = document.getElementById('roomcatImportInput')
    const modal = document.getElementById('roomcatImportModal')
    const closeBtn = document.getElementById('roomcatModalClose')
    const cancelBtn = document.getElementById('roomcatModalCancel')
    if(templateBtn) templateBtn.addEventListener('click', downloadRoomCategoryTemplate)
    if(importBtn && importInput) importBtn.addEventListener('click', ()=>importInput.click())
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
    const typeLookup = buildOptionLookup(document.getElementById('categorytype'))
    const currencyLookup = buildOptionLookup(document.getElementById('currency'))
    const ratecodeLookup = buildOptionLookup(document.getElementById('ratecode'))
    rows.forEach((row, idx)=>{
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td class="p-3 align-top">
                <input type="checkbox" class="roomcat-row-checkbox accent-[#22c55e]" data-index="${idx}" checked />
            </td>
            <td class="p-3">${row.category || ''}</td>
            <td class="p-3">${resolveLookup(row.categorytype, typeLookup)}</td>
            <td class="p-3">${resolveLookup(row.ratecode, ratecodeLookup)}</td>
            <td class="p-3">${resolveLookup(row.currency, currencyLookup)}</td>
            <td class="p-3">${row.minimumrequireddeposit || ''}</td>
            <td class="p-3">${row.price || ''}</td>
            <td class="p-3">${row.price_2 || ''}</td>
        `
        tbody.appendChild(tr)
    })
    if(count) count.textContent = `${rows.length} row${rows.length>1?'s':''}`
    if(selectAll) selectAll.checked = true
}

function resolveLookup(val, lookup){
    if(!val) return ''
    const key = `${val}`.trim().toUpperCase()
    return lookup[key] || val
}

function buildOptionLookup(selectEl){
    if(!selectEl) return {}
    const map = {}
    Array.from(selectEl.options).forEach(opt=>{
        const keyText = opt.text.toUpperCase()
        const keyVal = opt.value.toUpperCase()
        map[keyText] = opt.text
        map[keyVal] = opt.text
    })
    return map
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
    for(const row of rowsToImport){
        const payload = mapRoomCategoryToFormData(row)
        const request = await httpRequest2('../controllers/roomcategories', payload, null)
        if(request?.status) successCount++
    }
    if(loader) loader.style.display = 'none'
    if(submitBtn) submitBtn.removeAttribute('disabled')
    if(status) status.textContent = `${successCount}/${rowsToImport.length} imported`
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
    form.append('minimumrequireddeposit', row.minimumrequireddeposit || '')
    form.append('price', row.price || '')
    form.append('price_2', row.price_2 || '')
    return form
}

function resolveSelectValue(selectId, rawValue){
    const selectEl = document.getElementById(selectId)
    if(!selectEl) return ''
    const target = `${rawValue || ''}`.trim().toUpperCase()
    const match = Array.from(selectEl.options).find(opt=>opt.text.trim().toUpperCase() === target || opt.value.trim().toUpperCase() === target)
    return match ? match.value : ''
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
