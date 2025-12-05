let addroomid
let addroomImportedRows = []
let addroomImportEventsBound = false
const addroomImportDelay = 1000
async function addroomActive() {
    const form = document.querySelector('#addroomform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', addroomFormSubmitHandler)
    datasource = []
    await fetcroomcategory()
    wireAddRoomImport()
    await fetchaddroom()
}

async function fetcroomcategory(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchroomcategories', id ? getparamm() : null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
            if(request.data.length) {
                const select = did('categoryid')
                if(select) {
                    const options = request.data.map(dat=>`<option value="${dat.id}">${dat.category}</option>`).join('')
                    select.innerHTML = `<option value="">-- SELECT CATEGORY --</option>${options}`
                }
            }
    }
    else return notification('No records retrieved')
}

async function fetchaddroom(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchrooms', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onaddroomTableDataSignal)
            }
        }else{
            // Some endpoints return the full list even when id is supplied, so pick the matching record.
            const record = (request.data || []).find(item => String(item.id) === String(id)) || request.data[0]
            if(!record) return notification('No records retrieved')
            addroomid = record.id
            // Populate the form including description and the two room images.
            populateData(record, ['imageurl1', 'imageurl2'], [], 'addroomform')
        }
    }
    else return notification('No records retrieved')
}

async function removeaddroom(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this addroom?");

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
    fetchaddroom()
    return notification(request.message);
    
}


async function onaddroomTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td><img src="../images/${item.imageurl1}" alt="${item.imageurl1}" style="width: 250px; height: 250px; object-fit: cover;"></td>
    <td><img src="../images/${item.imageurl2}" alt="${item.imageurl2}" style="width: 250px; height: 250px; object-fit: cover;"></td>
        <td>${item.roomname}</td>
        <td>${item.roomnumber}</td>
        <td>${item.roomcategory}</td>
        <td>${item.building}</td>
        <td>${item.floor}</td>
        <td>${item.description}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchaddroom('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeaddroom('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function addroomFormSubmitHandler() {
    if(!validateForm('addroomform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#addroomform'), addroomid ? [['id', addroomid],['photofilename', showFileName('imageurl1')],['userphotoname', getFile('imageurl1')],['photofilename2', showFileName('imageurl2')],['userphotoname2', getFile('imageurl2')]] : [['photofilename', showFileName('imageurl1')],['userphotoname', getFile('imageurl1')],['photofilename2', showFileName('imageurl2')],['userphotoname2', getFile('imageurl2')]])
    let request = await httpRequest2('../controllers/rooms', payload, document.querySelector('#addroomform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#addroomform').reset();
        did('imagePreview').innerHTML = ''
        did('imagePreview2').innerHTML = ''
        fetchaddroom();
        return
    }
    document.querySelector('#addroomform').reset();
    fetchaddroom();
    return notification(request.message, 0);
}

function wireAddRoomImport(){
    if(addroomImportEventsBound) return
    addroomImportEventsBound = true
    const templateBtn = document.getElementById('roomImportTemplateBtn')
    const importBtn = document.getElementById('roomImportBtn')
    const importInput = document.getElementById('roomImportInput')
    const closeBtn = document.getElementById('addRoomModalClose')
    const cancelBtn = document.getElementById('addRoomModalCancel')
    const selectAll = document.getElementById('addRoomSelectAll')
    const submitBtn = document.getElementById('addRoomModalSubmit')
    if(templateBtn) templateBtn.addEventListener('click', downloadAddRoomTemplate)
    if(importBtn && importInput) importBtn.addEventListener('click', ()=>importInput.click())
    if(importInput) importInput.addEventListener('change', handleAddRoomExcelImport)
    if(closeBtn) closeBtn.addEventListener('click', ()=>toggleAddRoomImportModal(false))
    if(cancelBtn) cancelBtn.addEventListener('click', ()=>toggleAddRoomImportModal(false))
    if(selectAll) selectAll.addEventListener('change', ()=>{
        const checked = selectAll.checked
        document.querySelectorAll('.addroom-row-checkbox').forEach(cb=>cb.checked = checked)
    })
    if(submitBtn) submitBtn.addEventListener('click', importSelectedRooms)
}

async function ensureXLSXLoadedAddRoom(){
    if(window.XLSX) return true
    return await new Promise(resolve=>{
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
        script.onload = ()=>resolve(true)
        script.onerror = ()=>resolve(false)
        document.head.appendChild(script)
    })
}

async function downloadAddRoomTemplate(){
    const ok = await ensureXLSXLoadedAddRoom()
    if(!ok) return notification('Could not load Excel helper. Check your connection.', 0)
    const sampleRows = [
        {
            'Room Name': 'Deluxe 101',
            'Room Number': '101',
            'Building': 'Main Tower',
            'Category': 'Deluxe Suite',
            'Floor': '10',
            'Description': 'Ocean view suite'
        },
        {
            'Room Name': 'Standard 202',
            'Room Number': '202',
            'Building': 'Annex',
            'Category': 'Standard',
            'Floor': '2',
            'Description': 'Standard queen'
        }
    ]
    const ws = XLSX.utils.json_to_sheet(sampleRows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Rooms')
    XLSX.writeFile(wb, 'room_import_template.xlsx')
}

async function handleAddRoomExcelImport(event){
    const file = event.target.files[0]
    if(!file) return
    const ok = await ensureXLSXLoadedAddRoom()
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
            addroomImportedRows = normalizeAddRoomRows(rawRows)
            buildAddRoomImportTable(addroomImportedRows)
            toggleAddRoomImportModal(true)
        }catch(err){
            console.error(err)
            notification('Unable to read Excel file. Please confirm the template.', 0)
        }finally{
            event.target.value = ''
        }
    }
    reader.readAsArrayBuffer(file)
}

function normalizeAddRoomRows(rawRows){
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

function buildAddRoomImportTable(rows){
    const tbody = document.getElementById('addRoomImportTable')
    const count = document.getElementById('addRoomImportCount')
    const selectAll = document.getElementById('addRoomSelectAll')
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
                <input type="checkbox" class="addroom-row-checkbox accent-[#22c55e]" data-index="${idx}" checked />
            </td>
            <td class="p-3">${formatAddRoomCell(row.roomname)}</td>
            <td class="p-3">${formatAddRoomCell(row.roomnumber)}</td>
            <td class="p-3">${formatAddRoomCell(row.building)}</td>
            <td class="p-3">${resolveAddRoomCategoryLabel(row.category)}</td>
            <td class="p-3">${formatAddRoomCell(row.floor)}</td>
            <td class="p-3">${formatAddRoomCell(row.description)}</td>
        `
        tbody.appendChild(tr)
    })
    if(count) count.textContent = `${rows.length} row${rows.length>1?'s':''}`
    if(selectAll) selectAll.checked = true
}

function toggleAddRoomImportModal(show){
    const modal = document.getElementById('roomImportModal')
    if(!modal) return
    if(show) modal.classList.remove('hidden')
    else modal.classList.add('hidden')
    const status = document.getElementById('addRoomImportStatus')
    if(status) status.textContent = ''
}

async function importSelectedRooms(){
    if(!addroomImportedRows.length) return notification('No rows to import', 0)
    const checkboxes = Array.from(document.querySelectorAll('.addroom-row-checkbox')).filter(cb=>cb.checked)
    if(!checkboxes.length) return notification('Select at least one row to import.', 0)
    const rowsToImport = checkboxes.map(cb=>addroomImportedRows[cb.getAttribute('data-index')])
    const submitBtn = document.getElementById('addRoomModalSubmit')
    const loader = submitBtn?.querySelector('.btnloader')
    const status = document.getElementById('addRoomImportStatus')
    if(loader) loader.style.display = 'flex'
    if(submitBtn) submitBtn.setAttribute('disabled', true)
    let successCount = 0
    for(let i=0; i<rowsToImport.length; i++){
        if(i>0) await delayAddRoomImport(addroomImportDelay)
        if(status) status.textContent = `Submitting ${i+1}/${rowsToImport.length}...`
        const payload = mapAddRoomRowToFormData(rowsToImport[i])
        const request = await httpRequest2('../controllers/rooms', payload, null)
        if(request?.status) successCount++
    }
    if(loader) loader.style.display = 'none'
    if(submitBtn) submitBtn.removeAttribute('disabled')
    if(status) status.textContent = `${successCount}/${rowsToImport.length} submitted`
    fetchaddroom()
    toggleAddRoomImportModal(false)
    notification(`${successCount} row(s) imported`, successCount ? 1 : 0)
}

function mapAddRoomRowToFormData(row){
    const form = new FormData()
    form.append('roomname', formatAddRoomCell(row.roomname))
    form.append('roomnumber', formatAddRoomCell(row.roomnumber))
    form.append('building', formatAddRoomCell(row.building))
    form.append('categoryid', resolveAddRoomCategoryValue(row.category))
    form.append('floor', formatAddRoomCell(row.floor))
    form.append('description', formatAddRoomCell(row.description))
    return form
}

function resolveAddRoomCategoryValue(rawValue){
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

function resolveAddRoomCategoryLabel(rawValue){
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

function formatAddRoomCell(value){
    if(value === undefined || value === null) return ''
    return value.toString().trim()
}

function delayAddRoomImport(ms){
    return new Promise(resolve=>setTimeout(resolve, ms))
}


// function runAdaddroomFormValidations() {
//     let form = document.getElementById('addroomform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#addroomname'))  controls.push([form.querySelector('#addroomname'), 'addroom name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
