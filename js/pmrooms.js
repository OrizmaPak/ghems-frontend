let pmroomsEditRoomNumber = ''
let pmroomsEditId = ''
let pmRoomImportedRows = []
let pmRoomImportEventsBound = false
const pmRoomImportDelay = 1000

async function requestPmRooms(endpointBase, payload = null, btn = null, responseType = 'json') {
    let request = await httpRequest2(`../controllers/${endpointBase}`, payload, btn, responseType)
    if(request?.status) return request
    const alt = endpointBase.toLowerCase().endsWith('.php') ? endpointBase : `${endpointBase}.php`
    return await httpRequest2(`../controllers/${alt}`, payload, btn, responseType)
}

async function pmroomsActive() {
    const form = document.querySelector('#pmroomsform')
    if(form?.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', pmroomsFormSubmitHandler)
    datasource = []
    await fetcroomcategory()
    wirePmRoomImport()
    await fetchpmrooms()
}

async function fetcroomcategory(id) {
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchroomcategories', id ? getparamm() : null, null, 'json')
    if(request.status && request.data.length) {
        const postingMasterOnly = request.data.filter(dat => {
            const type = String(dat.categorytype || dat.type || '').trim().toUpperCase()
            return type === 'POSTING MASTER'
        })
        const select = did('categoryid')
        if(select) {
            const source = postingMasterOnly.length ? postingMasterOnly : request.data
            const options = source.map(dat=>`<option value="${dat.id}">${dat.category}</option>`).join('')
            select.innerHTML = `<option value="">-- SELECT CATEGORY --</option>${options}`
        }
    } else if(!request.status) {
        return notification('No records retrieved')
    }
}

async function fetchpmrooms(roomnumber) {
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('roomnumber', roomnumber)
        return paramstr
    }
    let request = await requestPmRooms('fetchpmrooms', roomnumber ? getparamm() : null, null, 'json')
    if(!roomnumber) document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        const rows = Array.isArray(request?.data)
            ? request.data
            : (Array.isArray(request?.data?.data) ? request.data.data : [])
        if(!roomnumber) {
            if(rows.length) {
                datasource = rows
                resolvePagination(datasource, onpmroomsTableDataSignal)
            }
        } else {
            const manageTab = document.querySelector('[name="managepmroomspanel"]')
            if(manageTab && typeof runoptioner === 'function') runoptioner(manageTab)
            const record = rows.find(item => String(item.roomnumber) === String(roomnumber)) || rows[0]
            if(!record) return notification('No records retrieved')
            pmroomsEditRoomNumber = record.roomnumber
            pmroomsEditId = record.id || ''
            populateData(record, [], [], 'pmroomsform')
        }
    } else {
        return notification('No records retrieved')
    }
}

async function onpmroomsTableDataSignal() {
    let rows = getSignaledDatasource().map(item => `
    <tr>
        <td>${item.index + 1}</td>
        <td>${item.roomname || ''}</td>
        <td>${item.roomnumber || ''}</td>
        <td>${item.roomcategory || ''}</td>
        <td>${item.building || ''}</td>
        <td>${item.floor || ''}</td>
        <td>${item.description || ''}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchpmrooms('${item.roomnumber}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
        </td>
    </tr>`
    ).join('')
    injectPaginatatedTable(rows)
}

async function pmroomsFormSubmitHandler() {
    if(!validateForm('pmroomsform', getIdFromCls('comp'))) return

    const roomNumberField = did('roomnumber')
    const roomNumberValue = `${roomNumberField?.value || ''}`.trim()
    if(!/^\d+$/.test(roomNumberValue)) {
        return notification('Room number must be an integer.', 0)
    }
    if(roomNumberField) roomNumberField.value = parseInt(roomNumberValue, 10)
    const extra = pmroomsEditId ? [['id', pmroomsEditId]] : null
    let payload = getFormData2(document.querySelector('#pmroomsform'), extra)

    let request = await requestPmRooms('pmrooms', payload, document.querySelector('#pmroomsform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1)
        pmroomsEditRoomNumber = ''
        pmroomsEditId = ''
        document.querySelector('#pmroomsform')?.reset()
        fetchpmrooms()
        return
    }
    return notification(request.message, 0)
}

function wirePmRoomImport(){
    if(pmRoomImportEventsBound) return
    pmRoomImportEventsBound = true
    const templateBtn = document.getElementById('pmRoomImportTemplateBtn')
    const importBtn = document.getElementById('pmRoomImportBtn')
    const importInput = document.getElementById('pmRoomImportInput')
    const closeBtn = document.getElementById('pmRoomModalClose')
    const cancelBtn = document.getElementById('pmRoomModalCancel')
    const selectAll = document.getElementById('pmRoomSelectAll')
    const submitBtn = document.getElementById('pmRoomModalSubmit')
    if(templateBtn) templateBtn.addEventListener('click', downloadPmRoomTemplate)
    if(importBtn && importInput) importBtn.addEventListener('click', ()=>importInput.click())
    if(importInput) importInput.addEventListener('change', handlePmRoomExcelImport)
    if(closeBtn) closeBtn.addEventListener('click', ()=>togglePmRoomImportModal(false))
    if(cancelBtn) cancelBtn.addEventListener('click', ()=>togglePmRoomImportModal(false))
    if(selectAll) selectAll.addEventListener('change', ()=>{
        const checked = selectAll.checked
        document.querySelectorAll('.pmroom-row-checkbox').forEach(cb=>cb.checked = checked)
    })
    if(submitBtn) submitBtn.addEventListener('click', importSelectedPmRooms)
}

async function ensureXLSXLoadedPmRoom(){
    if(window.XLSX) return true
    return await new Promise(resolve=>{
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
        script.onload = ()=>resolve(true)
        script.onerror = ()=>resolve(false)
        document.head.appendChild(script)
    })
}

async function downloadPmRoomTemplate(){
    const ok = await ensureXLSXLoadedPmRoom()
    if(!ok) return notification('Could not load Excel helper. Check your connection.', 0)
    const sampleRows = [
        {
            'Room Name': 'Deluxe 101',
            'Room Number': '101',
            'Building': 'Main Tower',
            'Category': 'Deluxe Suite',
            'Floor': '10',
            'Description': 'Ocean view suite'
        }
    ]
    const ws = XLSX.utils.json_to_sheet(sampleRows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'PM Rooms')
    XLSX.writeFile(wb, 'pm_rooms_import_template.xlsx')
}

async function handlePmRoomExcelImport(event){
    const file = event.target.files[0]
    if(!file) return
    const ok = await ensureXLSXLoadedPmRoom()
    if(!ok) {
        event.target.value = ''
        return notification('Could not load Excel helper. Check your connection.', 0)
    }
    const reader = new FileReader()
    reader.onload = e=>{
        try{
            const workbook = XLSX.read(e.target.result, {type: 'array'})
            const sheet = workbook.Sheets[workbook.SheetNames[0]]
            const rawRows = XLSX.utils.sheet_to_json(sheet, {defval: ''})
            pmRoomImportedRows = normalizePmRoomRows(rawRows)
            buildPmRoomImportTable(pmRoomImportedRows)
            togglePmRoomImportModal(true)
        }catch(err){
            console.error(err)
            notification('Unable to read Excel file. Please confirm the template.', 0)
        }finally{
            event.target.value = ''
        }
    }
    reader.readAsArrayBuffer(file)
}

function normalizePmRoomRows(rawRows){
    const map = {
        'room name': 'roomname',
        'name': 'roomname',
        'room number': 'roomnumber',
        'roomnumber': 'roomnumber',
        'number': 'roomnumber',
        'building': 'building',
        'category': 'category',
        'category name': 'category',
        'category id': 'category',
        'categoryid': 'category',
        'floor': 'floor',
        'level': 'floor',
        'description': 'description',
        'details': 'description'
    }
    const rows = []
    rawRows.forEach(item=>{
        const normalized = {}
        Object.keys(item).forEach(key=>{
            const mappedKey = map[key?.toString().trim().toLowerCase()]
            if(mappedKey) normalized[mappedKey] = item[key]
        })
        const hasValue = Object.values(normalized).some(val=>`${val}`.trim() !== '')
        if(hasValue) rows.push(normalized)
    })
    return rows
}

function buildPmRoomImportTable(rows){
    const tbody = document.getElementById('pmRoomImportTable')
    const count = document.getElementById('pmRoomImportCount')
    const selectAll = document.getElementById('pmRoomSelectAll')
    if(!tbody) return
    tbody.innerHTML = ''
    if(!rows.length){
        tbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-[#666]">No rows found in Excel.</td></tr>`
        if(count) count.textContent = '0 rows'
        return
    }
    rows.forEach((row, idx)=>{
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td class="p-3 align-top">
                <input type="checkbox" class="pmroom-row-checkbox accent-[#22c55e]" data-index="${idx}" checked />
            </td>
            <td class="p-3">${formatPmRoomCell(row.roomname)}</td>
            <td class="p-3">${formatPmRoomCell(row.roomnumber)}</td>
            <td class="p-3">${formatPmRoomCell(row.building)}</td>
            <td class="p-3">${resolvePmRoomCategoryLabel(row.category)}</td>
            <td class="p-3">${formatPmRoomCell(row.floor)}</td>
            <td class="p-3">${formatPmRoomCell(row.description)}</td>
        `
        tbody.appendChild(tr)
    })
    if(count) count.textContent = `${rows.length} row${rows.length>1?'s':''}`
    if(selectAll) selectAll.checked = true
}

function togglePmRoomImportModal(show){
    const modal = document.getElementById('pmRoomImportModal')
    if(!modal) return
    if(show) modal.classList.remove('hidden')
    else modal.classList.add('hidden')
    const status = document.getElementById('pmRoomImportStatus')
    if(status) status.textContent = ''
}

async function importSelectedPmRooms(){
    if(!pmRoomImportedRows.length) return notification('No rows to import', 0)
    const checkboxes = Array.from(document.querySelectorAll('.pmroom-row-checkbox')).filter(cb=>cb.checked)
    if(!checkboxes.length) return notification('Select at least one row to import.', 0)
    const rowsToImport = checkboxes.map(cb=>pmRoomImportedRows[cb.getAttribute('data-index')])
    const submitBtn = document.getElementById('pmRoomModalSubmit')
    const loader = submitBtn?.querySelector('.btnloader')
    const status = document.getElementById('pmRoomImportStatus')
    if(loader) loader.style.display = 'flex'
    if(submitBtn) submitBtn.setAttribute('disabled', true)
    let successCount = 0
    for(let i=0; i<rowsToImport.length; i++){
        if(i>0) await delayPmRoomImport(pmRoomImportDelay)
        if(status) status.textContent = `Submitting ${i+1}/${rowsToImport.length}...`
        const payload = mapPmRoomRowToFormData(rowsToImport[i])
        const request = await requestPmRooms('pmrooms', payload, null)
        if(request?.status) successCount++
    }
    if(loader) loader.style.display = 'none'
    if(submitBtn) submitBtn.removeAttribute('disabled')
    if(status) status.textContent = `${successCount}/${rowsToImport.length} submitted`
    fetchpmrooms()
    togglePmRoomImportModal(false)
    notification(`${successCount} row(s) imported`, successCount ? 1 : 0)
}

function mapPmRoomRowToFormData(row){
    const form = new FormData()
    const roomNumber = parseInt(formatPmRoomCell(row.roomnumber), 10)
    form.append('roomname', formatPmRoomCell(row.roomname))
    form.append('roomnumber', Number.isNaN(roomNumber) ? '' : roomNumber)
    form.append('building', formatPmRoomCell(row.building))
    form.append('categoryid', resolvePmRoomCategoryValue(row.category))
    form.append('floor', formatPmRoomCell(row.floor))
    form.append('description', formatPmRoomCell(row.description))
    return form
}

function resolvePmRoomCategoryValue(rawValue){
    const select = document.getElementById('categoryid')
    const fallback = `${rawValue || ''}`.trim()
    if(!select) return fallback
    const target = fallback.toUpperCase()
    const match = Array.from(select.options).find(opt=>{
        const optionText = opt.text?.trim().toUpperCase()
        const optionValue = opt.value?.toString().trim().toUpperCase()
        return optionText === target || optionValue === target
    })
    return match ? match.value : ''
}

function resolvePmRoomCategoryLabel(rawValue){
    const select = document.getElementById('categoryid')
    const fallback = `${rawValue || ''}`.trim()
    if(!select) return fallback
    const target = fallback.toUpperCase()
    const match = Array.from(select.options).find(opt=>{
        const optionText = opt.text?.trim().toUpperCase()
        const optionValue = opt.value?.toString().trim().toUpperCase()
        return optionText === target || optionValue === target
    })
    return match ? match.text : fallback
}

function formatPmRoomCell(value){
    if(value === undefined || value === null) return ''
    return value.toString().trim()
}

function delayPmRoomImport(ms){
    return new Promise(resolve=>setTimeout(resolve, ms))
}
