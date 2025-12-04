let ratecodeid; 
let ratecodeImportedRows = []
let bookingplanslist = []
const ratecodeImportDelay = 1000
async function ratecodeActive() {
    const form = document.querySelector('#ratecodeform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', ratecodeFormSubmitHandler)
    
    if(form.plan) form.plan.addEventListener('change', resolvePlanChanges)
    
    datasource = []
    await fetchratecode()
    await fetchbookplans()
    wireRatecodeImport()
}

function resolvePlanChanges() {
   const form = document.querySelector('#ratecodeform')
   const selectedPlanId = +form.plan.value
   const selectedPlan = bookingplanslist.find(item => selectedPlanId == +item.id)
    try {
        form.adultplan.value = selectedPlan.adultamount
        form.childplan.value = selectedPlan.childamount
    } catch(e) {console.log(e)}
   
   
}

async function fetchbookplans(id) {
    bookingplanslist = []
    let request = await httpRequest2('../controllers/fetchbookingplan', null, null, 'json')
    if(request.status) {
        if(request.data.length) {
            bookingplanslist = request.data;
            let options = request.data?.map( item => `<option value="${item.id}">${item.planname}</option>`).join('')
            try {
                document.getElementById('ratecodeform').plan.innerHTML = '<option value=""> --Select Plan -- </option>' + options
            } catch(e) {console.log(e)}
        }
    }
    else return notification('No records retrieved')
}

async function fetchratecode(id) {
    if(id)document.getElementsByClassName('updater')[0].click()
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchratecode', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onratecodeTableDataSignal)
            }
        }else{
             ratecodeid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeratecode(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this ratecode?");

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
    fetchratecode()
    return notification(request.message);
    
}


async function onratecodeTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1 }</td>
        <td>${item.ratecode}</td>
        <td>${item.adult1}</td>
        <td>${item.adult2}</td>
        <td>${item.adult3}</td>
        <td>${item.adult4}</td>
        <td>${item.extadult}</td>
        <td>${item.extchild}</td>
        <td>${item.aditchild}</td>
        <td>${item.planname}</td>
        <td>${item.childplan}</td>
        <td>${item.currency}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchratecode('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeratecode('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function ratecodeFormSubmitHandler() {
    if(!validateForm('ratecodeform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#ratecodeform'), ratecodeid ? [['id', ratecodeid]] : null)
    let request = await httpRequest2('../controllers/ratecode', payload, document.querySelector('#ratecodeform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        ratecodeid = ''
        document.querySelector('#ratecode').click();
        fetchratecode();
        return
    }
        document.querySelector('#ratecode').click();
    fetchratecode();
    return notification(request.message, 0);
}

function wireRatecodeImport(){
    const templateBtn = document.getElementById('ratecodeTemplateBtn')
    const importBtn = document.getElementById('ratecodeImportBtn')
    const importInput = document.getElementById('ratecodeImportInput')
    const modalClose = document.getElementById('ratecodeModalClose')
    const modalCancel = document.getElementById('ratecodeModalCancel')
    if(templateBtn) templateBtn.addEventListener('click', downloadRatecodeTemplate)
    if(importBtn && importInput) importBtn.addEventListener('click', ()=>importInput.click())
    if(importInput) importInput.addEventListener('change', handleRatecodeExcelImport)
    if(modalClose) modalClose.addEventListener('click', ()=>toggleRatecodeModal(false))
    if(modalCancel) modalCancel.addEventListener('click', ()=>toggleRatecodeModal(false))
    const selectAll = document.getElementById('ratecodeSelectAll')
    if(selectAll) selectAll.addEventListener('change', ()=>{
        document.querySelectorAll('#ratecodeImportTable input[type="checkbox"]').forEach(cb=>cb.checked = selectAll.checked)
    })
    const submitBtn = document.getElementById('ratecodeModalSubmit')
    if(submitBtn) submitBtn.addEventListener('click', importSelectedRatecodes)
}

async function ensureXLSXLoadedRatecode(){
    if(window.XLSX) return true
    return await new Promise(resolve=>{
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
        script.onload = ()=>resolve(true)
        script.onerror = ()=>resolve(false)
        document.head.appendChild(script)
    })
}

async function downloadRatecodeTemplate(){
    const ok = await ensureXLSXLoadedRatecode()
    if(!ok) return notification('Could not load Excel helper. Check your connection.', 0)
    const planHints = (bookingplanslist || []).slice(0, 2).map(p=>p.planname)
    const sampleRows = [
        {
            'Rate Code': 'RC-WEEKDAY',
            'Plan': planHints[0] || 'PLAN NAME',
            'Currency': 'NGN',
            'Adult 1': 45000,
            'Adult 2': 50000,
            'Adult 3': 55000,
            'Adult 4': 60000,
            'Extra Adult': 15000,
            'Extra Child': 8000,
            'Child Two': 5000
        },
        {
            'Rate Code': 'RC-WEEKEND',
            'Plan': planHints[1] || 'PLAN CODE/ID',
            'Currency': 'USD',
            'Adult 1': 120,
            'Adult 2': 150,
            'Adult 3': 170,
            'Adult 4': 190,
            'Extra Adult': 40,
            'Extra Child': 25,
            'Child Two': 15
        }
    ]
    const ws = XLSX.utils.json_to_sheet(sampleRows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'RateCodes')
    XLSX.writeFile(wb, 'rate_codes_template.xlsx')
}

async function handleRatecodeExcelImport(event){
    const file = event.target.files[0]
    if(!file) return
    const ok = await ensureXLSXLoadedRatecode()
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
            ratecodeImportedRows = normalizeRatecodeRows(rawRows)
            buildRatecodeImportTable(ratecodeImportedRows)
            toggleRatecodeModal(true)
        }catch(err){
            console.error(err)
            notification('Unable to read Excel file. Please confirm the template.', 0)
        }finally{
            event.target.value = ''
        }
    }
    reader.readAsArrayBuffer(file)
}

function normalizeRatecodeRows(rawRows){
    const map = {
        'ratecode': 'ratecode',
        'rate code': 'ratecode',
        'adult1': 'adult1',
        'adult 1': 'adult1',
        'adult one': 'adult1',
        'adult2': 'adult2',
        'adult 2': 'adult2',
        'adult two': 'adult2',
        'adult3': 'adult3',
        'adult 3': 'adult3',
        'adult three': 'adult3',
        'adult4': 'adult4',
        'adult 4': 'adult4',
        'adult four': 'adult4',
        'extra adult': 'extadult',
        'extadult': 'extadult',
        'extraadult': 'extadult',
        'extra child': 'extchild',
        'extchild': 'extchild',
        'extrachild': 'extchild',
        'child two': 'aditchild',
        'child2': 'aditchild',
        'second child': 'aditchild',
        'plan': 'plan',
        'plan name': 'plan',
        'plan id': 'plan',
        'currency': 'currency'
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

function buildRatecodeImportTable(rows){
    const tbody = document.getElementById('ratecodeImportTable')
    const count = document.getElementById('ratecodeImportCount')
    const selectAll = document.getElementById('ratecodeSelectAll')
    if(!tbody) return
    tbody.innerHTML = ''
    if(!rows.length){
        tbody.innerHTML = `<tr><td colspan="13" class="p-4 text-center text-[#666]">No rows found in Excel.</td></tr>`
        if(count) count.textContent = '0 rows'
        return
    }
    rows.forEach((row, idx)=>{
        const plan = resolvePlanSelection(row.plan)
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td class="p-3 align-top">
                <input type="checkbox" class="ratecode-row-checkbox accent-[#22c55e]" data-index="${idx}" checked />
            </td>
            <td class="p-3">${row.ratecode || ''}</td>
            <td class="p-3">${plan.label || ''}</td>
            <td class="p-3">${resolveRatecodeSelectValue('currency', row.currency) || row.currency || ''}</td>
            <td class="p-3">${formatNumberForImport(row.adult1)}</td>
            <td class="p-3">${formatNumberForImport(row.adult2)}</td>
            <td class="p-3">${formatNumberForImport(row.adult3)}</td>
            <td class="p-3">${formatNumberForImport(row.adult4)}</td>
            <td class="p-3">${formatNumberForImport(row.extadult)}</td>
            <td class="p-3">${formatNumberForImport(row.extchild)}</td>
            <td class="p-3">${formatNumberForImport(row.aditchild)}</td>
            <td class="p-3">${formatNumberForImport(plan.adultamount)}</td>
            <td class="p-3">${formatNumberForImport(plan.childamount)}</td>
        `
        tbody.appendChild(tr)
    })
    if(count) count.textContent = `${rows.length} row${rows.length>1?'s':''}`
    if(selectAll) selectAll.checked = true
}

function toggleRatecodeModal(show){
    const modal = document.getElementById('ratecodeImportModal')
    if(!modal) return
    if(show) modal.classList.remove('hidden')
    else modal.classList.add('hidden')
    const status = document.getElementById('ratecodeImportStatus')
    if(status) status.textContent = ''
}

async function importSelectedRatecodes(){
    const modal = document.getElementById('ratecodeImportModal')
    if(!modal || !ratecodeImportedRows.length) return notification('No rows to import', 0)
    const checkboxes = Array.from(document.querySelectorAll('.ratecode-row-checkbox')).filter(cb=>cb.checked)
    if(!checkboxes.length) return notification('Select at least one row to import.', 0)
    const rowsToImport = checkboxes.map(cb=>ratecodeImportedRows[cb.getAttribute('data-index')])
    const status = document.getElementById('ratecodeImportStatus')
    const submitBtn = document.getElementById('ratecodeModalSubmit')
    const loader = submitBtn?.querySelector('.btnloader')
    if(loader) loader.style.display = 'flex'
    if(submitBtn) submitBtn.setAttribute('disabled', true)
    let successCount = 0
    for(let i=0; i<rowsToImport.length; i++){
        if(i>0) await delay(ratecodeImportDelay)
        const payload = mapRatecodeToFormData(rowsToImport[i])
        const request = await httpRequest2('../controllers/ratecode', payload, null)
        if(request?.status) successCount++
        if(status) status.textContent = `Submitting ${i+1}/${rowsToImport.length}...`
    }
    if(loader) loader.style.display = 'none'
    if(submitBtn) submitBtn.removeAttribute('disabled')
    if(status) status.textContent = `${successCount}/${rowsToImport.length} submitted`
    fetchratecode()
    toggleRatecodeModal(false)
    notification(`${successCount} rate code${successCount===1?'':'s'} imported`, successCount ? 1 : 0)
}

function mapRatecodeToFormData(row){
    const form = new FormData()
    const plan = resolvePlanSelection(row.plan)
    form.append('ratecode', (row.ratecode || '').toString().trim())
    form.append('adult1', row.adult1 || '')
    form.append('adult2', row.adult2 || '')
    form.append('adult3', row.adult3 || '')
    form.append('adult4', row.adult4 || '')
    form.append('extadult', row.extadult || '')
    form.append('extchild', row.extchild || '')
    form.append('aditchild', row.aditchild || '')
    form.append('plan', plan.value || '')
    form.append('adultplan', plan.adultamount || '')
    form.append('childplan', plan.childamount || '')
    form.append('currency', resolveRatecodeSelectValue('currency', row.currency))
    return form
}

function resolveRatecodeSelectValue(selectId, rawValue){
    const selectEl = document.getElementById(selectId)
    if(!selectEl) return `${rawValue || ''}`.trim()
    const target = `${rawValue || ''}`.trim().toUpperCase()
    const match = Array.from(selectEl.options).find(opt=>opt.text.trim().toUpperCase() === target || opt.value.trim().toUpperCase() === target)
    return match ? match.value : `${rawValue || ''}`.trim()
}

function resolvePlanSelection(rawPlan){
    const target = `${rawPlan || ''}`.trim().toUpperCase()
    if(!target) return {value: '', label: '', adultamount: '', childamount: ''}
    const match = (bookingplanslist || []).find(p=>{
        return `${p.planname}`.trim().toUpperCase() === target || `${p.id}`.trim().toUpperCase() === target
    })
    if(!match) return {value: '', label: rawPlan || '', adultamount: '', childamount: ''}
    return {
        value: match.id,
        label: `${match.planname} (${match.id})`,
        adultamount: match.adultamount,
        childamount: match.childamount
    }
}

function delay(ms){
    return new Promise(resolve=>setTimeout(resolve, ms))
}

function formatNumberForImport(val){
    if(val === undefined || val === null) return ''
    const num = Number(val)
    if(isNaN(num)) return val
    return num
}


// function runAdratecodeFormValidations() {
//     let form = document.getElementById('ratecodeform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#ratecodename'))  controls.push([form.querySelector('#ratecodename'), 'ratecode name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
