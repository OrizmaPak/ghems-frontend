let addglaccountid
let glAccountImportedRows = []
let glAccountImportEventsBound = false
async function addglaccountActive() {
    const form = document.querySelector('#addglaccountform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', addglaccountFormSubmitHandler)
    datasource = []
    addglaccountid = ''
    glAccountImportedRows = []
    // await fetchaddglaccount()
    await populateaddglaccountselects()
    wireGlAccountImport()
}

function addglaccountrunEdit(){
    document.querySelector('#addglaccountform #submit').textContent = 'Submit'
    did('deleteglaccountsubmit').classList.add('hidden')
    if(!sessionStorage.getItem('viewglaccountedit'))return
    let x = JSON.parse(sessionStorage.getItem('viewglaccountedit'))
    sessionStorage.removeItem('viewglaccountedit')
    populateData(x[0], [], [], 'addglaccountform')
    addglaccountid = x[0].id
    did('deleteglaccountsubmit').classList.remove('hidden')
    document.querySelector('#addglaccountform #submit').textContent = 'Update'
}

function wireGlAccountImport(){
    if(glAccountImportEventsBound) return
    glAccountImportEventsBound = true
    const templateBtn = document.getElementById('glAccountTemplateBtn')
    const importBtn = document.getElementById('glAccountImportBtn')
    const importInput = document.getElementById('glAccountImportInput')
    const closeBtn = document.getElementById('glAccountModalClose')
    const cancelBtn = document.getElementById('glAccountModalCancel')
    const selectAll = document.getElementById('glAccountSelectAll')
    const submitBtn = document.getElementById('glAccountModalSubmit')
    if(templateBtn) templateBtn.addEventListener('click', downloadGlAccountTemplate)
    if(importBtn && importInput) importBtn.addEventListener('click', ()=>importInput.click())
    if(importInput) importInput.addEventListener('change', handleGlAccountExcelImport)
    if(closeBtn) closeBtn.addEventListener('click', ()=>toggleGlAccountImportModal(false))
    if(cancelBtn) cancelBtn.addEventListener('click', ()=>toggleGlAccountImportModal(false))
    if(selectAll) selectAll.addEventListener('change', ()=>{
        const checked = selectAll.checked
        document.querySelectorAll('.glaccount-row-checkbox').forEach(cb=>cb.checked = checked)
    })
    if(submitBtn) submitBtn.addEventListener('click', importSelectedGlAccounts)
}

async function ensureXLSXLoadedGlAccount(){
    if(window.XLSX) return true
    return await new Promise(resolve=>{
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
        script.onload = ()=>resolve(true)
        script.onerror = ()=>resolve(false)
        document.head.appendChild(script)
    })
}

async function downloadGlAccountTemplate(){
    const ok = await ensureXLSXLoadedGlAccount()
    if(!ok) return notification('Could not load Excel helper. Check your connection.', 0)
    const sampleRows = [
        {
            'Group Name': 'CASH & BANK',
            'Subgroup': 'OPERATIONS',
            'Account Type': 'ASSET',
            'Description': 'Cash at hand and bank balances'
        },
        {
            'Group Name': 'ROOM REVENUE',
            'Subgroup': 'FRONT OFFICE',
            'Account Type': 'INCOME',
            'Description': 'Income from room sales'
        }
    ]
    const ws = XLSX.utils.json_to_sheet(sampleRows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'GL Accounts')
    XLSX.writeFile(wb, 'gl_account_template.xlsx')
}

async function handleGlAccountExcelImport(event){
    const file = event.target.files[0]
    if(!file) return
    const ok = await ensureXLSXLoadedGlAccount()
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
            glAccountImportedRows = normalizeGlAccountRows(rawRows)
            buildGlAccountImportTable(glAccountImportedRows)
            toggleGlAccountImportModal(true)
        }catch(err){
            console.error(err)
            notification('Unable to read Excel file. Please confirm the template.', 0)
        }finally{
            event.target.value = ''
        }
    }
    reader.readAsArrayBuffer(file)
}

function normalizeGlAccountRows(rawRows){
    const map = {
        'group name': 'groupname',
        'group': 'groupname',
        'subgroup': 'subgroup',
        'sub group': 'subgroup',
        'account type': 'accounttype',
        'type of account': 'accounttype',
        'type': 'accounttype',
        'description': 'description',
        'desc': 'description',
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

function buildGlAccountImportTable(rows){
    const tbody = document.getElementById('glAccountImportTable')
    const count = document.getElementById('glAccountImportCount')
    const selectAll = document.getElementById('glAccountSelectAll')
    if(!tbody) return
    tbody.innerHTML = ''
    if(!rows.length){
        tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-[#666]">No rows found in Excel.</td></tr>`
        if(count) count.textContent = '0 rows'
        return
    }
    rows.forEach((row, idx)=>{
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td class="p-3 align-top">
                <input type="checkbox" class="glaccount-row-checkbox accent-[#22c55e]" data-index="${idx}" checked />
            </td>
            <td class="p-3">${formatGlAccountCell(row.groupname)}</td>
            <td class="p-3">${formatGlAccountCell(row.subgroup)}</td>
            <td class="p-3">${formatGlAccountCell(row.accounttype).toUpperCase()}</td>
            <td class="p-3">${formatGlAccountCell(row.description)}</td>
        `
        tbody.appendChild(tr)
    })
    if(count) count.textContent = `${rows.length} row${rows.length>1?'s':''}`
    if(selectAll) selectAll.checked = true
}

function toggleGlAccountImportModal(show){
    const modal = document.getElementById('glAccountImportModal')
    if(!modal) return
    if(show) modal.classList.remove('hidden')
    else modal.classList.add('hidden')
    const status = document.getElementById('glAccountImportStatus')
    if(status) status.textContent = ''
}

async function importSelectedGlAccounts(){
    if(!glAccountImportedRows.length) return notification('No rows to import', 0)
    const checkboxes = Array.from(document.querySelectorAll('.glaccount-row-checkbox')).filter(cb=>cb.checked)
    if(!checkboxes.length) return notification('Select at least one row to send.', 0)
    const rowsToImport = checkboxes.map(cb=>glAccountImportedRows[cb.getAttribute('data-index')])
    const submitBtn = document.getElementById('glAccountModalSubmit')
    const loader = submitBtn?.querySelector('.btnloader')
    const status = document.getElementById('glAccountImportStatus')
    if(loader) loader.style.display = 'flex'
    if(submitBtn) submitBtn.setAttribute('disabled', true)
    let successCount = 0
    for(let i=0; i<rowsToImport.length; i++){
        if(status) status.textContent = `Sending ${i+1}/${rowsToImport.length}...`
        const payload = mapGlAccountRowToFormData(rowsToImport[i])
        const request = await httpRequest2('../controllers/glaccountscript', payload, null)
        if(request?.status) successCount++
    }
    if(loader) loader.style.display = 'none'
    if(submitBtn) submitBtn.removeAttribute('disabled')
    if(status) status.textContent = `${successCount}/${rowsToImport.length} submitted`
    toggleGlAccountImportModal(false)
    notification(`${successCount} row(s) sent`, successCount ? 1 : 0)
}

function mapGlAccountRowToFormData(row){
    const form = new FormData()
    form.append('groupname', formatGlAccountCell(row.groupname))
    form.append('subgroup', formatGlAccountCell(row.subgroup))
    form.append('accounttype', formatGlAccountCell(row.accounttype).toUpperCase())
    form.append('description', formatGlAccountCell(row.description))
    return form
}

function formatGlAccountCell(value){
    if(value === undefined || value === null) return ''
    return value.toString().trim()
}

async function populateaddglaccountselects(id='') {
            return addglaccountrunEdit()
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    } 
    let request = await httpRequest2('../controllers/fetchglbyaccounttype', id ? getparamm() : null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
            document.getElementById('accounttype').innerHTML += request.data.map(item=>`<option>${item.accounttype}</option>`).join('')
    }
    else return notification('No records retrieved')
}

async function fetchaddglaccount(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchaddglaccount', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onaddglaccountTableDataSignal)
            }
        }else{
             addglaccountid = request.data[0].id
            populateData(request.data[0], [], [], 'addglaccountform')
        }
    }
    else return notification('No records retrieved')
}

async function removeaddglaccount(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this addglaccount?");

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
    fetchaddglaccount()
    return notification(request.message);
    
}


async function onaddglaccountTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchaddglaccount('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeaddglaccount('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function addglaccountFormSubmitHandler() {
    if(!validateForm('addglaccountform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#addglaccountform'), addglaccountid ? [['id', addglaccountid]] : null)
    let request = await httpRequest2('../controllers/glaccountscript', payload, document.querySelector('#addglaccountform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#addglaccountform').reset();
        if(document.querySelector('#addglaccountform #submit').textContent == 'Update')document.querySelector('#viewglaccount').click() 
        return
    }
    document.querySelector('#addglaccountform').reset();
    // fetchaddglaccount();
    return notification(request.message, 0);
}


// function runAdaddglaccountFormValidations() {
//     let form = document.getElementById('addglaccountform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#addglaccountname'))  controls.push([form.querySelector('#addglaccountname'), 'addglaccount name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
