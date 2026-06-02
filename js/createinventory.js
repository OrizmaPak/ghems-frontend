let createinventoryid
let departmenthtml
let inventoryDepartmentNames = []
const inventoryImportHeaderMap = {
    'item name': 'itemname',
    'item type': 'itemtype',
    'units': 'units',
    'cost': 'cost',
    'price': 'price',
    'price two': 'price_two',
    'begin balance': 'beginbalance',
    'min balance': 'minbalance',
    'group name': 'groupname',
    'apply to': 'applyto',
    'item class': 'itemclass',
    'reorder level': 'rlevel',
    'composite': 'composite',
    'description': 'description',
    'sales points': 'salespoint'
}
async function createinventoryActive() {
    did('submit').addEventListener('click', createinventoryFormSubmitHandler) 
    datasource = []
    let request = await httpRequest2('../controllers/fetchdepartments', null, null, 'json')
    if(request.status) {
        inventoryDepartmentNames = request.data
            .filter(dat=>dat.applyforsales == 'NON STOCK' || dat.applyforsales == 'STOCK')
            .map(data => String(data.department || '').trim())
            .filter(Boolean)
        departmenthtml = request.data.filter(dat=>dat.applyforsales == 'NON STOCK' || dat.applyforsales == 'STOCK').map(data=>`<div class="border  p-2 flex items-center m-1 gap-3 w-fit pr-4">
                            <input class="cp" name="${data.department}"  type="checkbox"/> 
                            <label class="cp" onclick="this.previousElementSibling.click()">${data.department}</label>
                        </div>`).join('');
        if(departmenthtml){
            did('loading').remove();
            did('createinventoryform').classList.remove('hidden');
            did('departmt').innerHTML = departmenthtml
            populateInventoryUnitSelects(did('createinventoryform'))
        }
    }else return notification(request.message, 0);
    wireInventoryImport()
    // await fetchcreateinventorys()
}

function wireInventoryImport(){
    const importBtn = document.getElementById('importExcelBtn')
    const importInput = document.getElementById('importExcelInput')
    if(importBtn && importInput){
        importBtn.addEventListener('click', ()=>importInput.click())
        importInput.addEventListener('change', handleInventoryExcelImport)
    }
}

async function ensureXLSXLoaded(){
    if(window.XLSX) return true
    return await new Promise(resolve=>{
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
        script.onload = ()=>resolve(true)
        script.onerror = ()=>resolve(false)
        document.head.appendChild(script)
    })
}

async function handleInventoryExcelImport(event){
    if(!departmenthtml) return notification('Departments are still loading. Try again shortly.', 0)
    const file = event.target.files[0]
    if(!file) return
    const ok = await ensureXLSXLoaded()
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
            const normalizedRows = normalizeInventoryRows(rawRows)
            importInventoryRows(normalizedRows)
        }catch(err){
            notification('Unable to read Excel file. Please confirm the template.', 0)
            console.error(err)
        }finally{
            event.target.value = ''
        }
    }
    reader.readAsArrayBuffer(file)
}

function normalizeInventoryRows(rawRows){
    const rows = []
    rawRows.forEach(item=>{
        const normalized = {}
        Object.keys(item).forEach(key=>{
            const mappedKey = inventoryImportHeaderMap[key?.toString().trim().toLowerCase()]
            if(mappedKey) normalized[mappedKey] = item[key]
        })
        const hasValues = Object.values(normalized).some(val=>`${val}`.trim() !== '')
        if(hasValues) rows.push(normalized)
    })
    return rows
}

function normalizeInventoryImportSalesPoints(value = ''){
    const requested = String(value || '')
        .split(/[,|;]/)
        .map(item => item.trim())
        .filter(Boolean)
    if(!requested.length) return []

    const availableMap = new Map(
        inventoryDepartmentNames.map(name => [name.toLowerCase(), name])
    )
    const resolved = []
    requested.forEach(point => {
        const match = availableMap.get(point.toLowerCase())
        if(match && !resolved.includes(match)) resolved.push(match)
    })
    return resolved
}

function normalizeInventoryImportRow(row = {}){
    const itemclass = String(row.itemclass || '').trim().toUpperCase()
    const itemtype = String(row.itemtype || '').trim().toUpperCase()
    const composite = String(row.composite || '').trim().toUpperCase()
    const normalizedSalesPoints = normalizeInventoryImportSalesPoints(row.salespoint)

    return {
        itemname: String(row.itemname || '').trim(),
        itemtype,
        units: String(row.units || '').trim().toUpperCase(),
        cost: row.cost ?? '',
        price: row.price ?? '',
        price_two: row.price_two ?? '',
        beginbalance: row.beginbalance ?? '',
        minbalance: row.minbalance ?? '',
        groupname: String(row.groupname || '').trim(),
        applyto: String(row.applyto || '').trim().toUpperCase() || 'FOR SALE',
        itemclass: itemclass || 'STOCK-ITEM',
        rlevel: row.rlevel ?? '',
        composite: composite || 'NO',
        description: String(row.description || '').trim(),
        salespoint: normalizedSalesPoints.join('|'),
        salespointList: normalizedSalesPoints
    }
}

function validateImportedInventoryRows(rows = []){
    const validRows = []
    const errors = []
    rows.forEach((rawRow, idx) => {
        const rowNo = idx + 2
        const row = normalizeInventoryImportRow(rawRow)
        if(!row.itemname) errors.push(`Row ${rowNo}: Item Name is required`)
        if(!row.itemtype) errors.push(`Row ${rowNo}: Item Type is required`)
        if(!row.units) errors.push(`Row ${rowNo}: Units is required`)
        if(!row.itemclass) errors.push(`Row ${rowNo}: Item Class is required`)
        if(!row.applyto) errors.push(`Row ${rowNo}: Apply To is required`)
        if(!row.salespointList.length) errors.push(`Row ${rowNo}: Sales Points must match an existing department`)
        if(row.itemtype && !['FOOD','ALCOHOL','NON-ALCOHOL','MISCELLANEOUS','SERVICE'].includes(row.itemtype)) {
            errors.push(`Row ${rowNo}: Item Type "${row.itemtype}" is invalid`)
        }
        if(row.itemclass && !['STOCK-ITEM','NON STOCK-ITEM'].includes(row.itemclass)) {
            errors.push(`Row ${rowNo}: Item Class "${row.itemclass}" is invalid`)
        }
        if(row.applyto && !['FOR SALE','NOT FOR SALE'].includes(row.applyto)) {
            errors.push(`Row ${rowNo}: Apply To "${row.applyto}" is invalid`)
        }
        if(row.composite && !['YES','NO'].includes(row.composite)) {
            errors.push(`Row ${rowNo}: Composite "${row.composite}" is invalid`)
        }
        if(!errors.filter(message => message.startsWith(`Row ${rowNo}:`)).length) validRows.push(row)
    })
    return { validRows, errors }
}

function buildInventoryImportPayload(rows = []){
    const payload = new FormData()
    payload.append('rowsize', rows.length)
    rows.forEach((row, idx) => {
        const n = idx + 1
        payload.append(`itemname${n}`, row.itemname)
        payload.append(`itemtype${n}`, row.itemtype)
        payload.append(`units${n}`, row.units)
        payload.append(`cost${n}`, row.cost)
        payload.append(`price${n}`, row.price)
        payload.append(`price_two${n}`, row.price_two)
        payload.append(`beginbalance${n}`, row.beginbalance)
        payload.append(`groupname${n}`, row.groupname)
        payload.append(`applyto${n}`, row.applyto)
        payload.append(`reorderlevel${n}`, row.rlevel)
        payload.append(`composite${n}`, row.composite)
        payload.append(`description${n}`, row.description)
        payload.append(`itemclass${n}`, row.itemclass)
        payload.append(`minbalance${n}`, row.minbalance)
        payload.append(`salespoint${n}`, row.salespoint)
    })
    return payload
}

function renderCreateInventoryImportStatus(messages = [], status = true){
    const host = did('createinventory-import-status')
    if(!host) return
    const tone = status
        ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
        : 'border-red-200 bg-red-50 text-red-900'
    host.className = `mt-3 rounded-md border p-4 text-sm shadow-sm ${tone}`
    host.innerHTML = `
        <div class="font-semibold mb-2">${status ? 'Inventory import result' : 'Inventory import could not continue'}</div>
        <ul class="list-disc pl-5 space-y-1">
            ${messages.map(message => `<li>${String(message || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</li>`).join('')}
        </ul>
    `
}

async function importInventoryRows(rows){
    if(!rows.length) {
        renderCreateInventoryImportStatus(['No rows found in Excel. Please confirm the headers match the expected template.'], false)
        return notification('No rows found in Excel.', 0)
    }

    const { validRows, errors } = validateImportedInventoryRows(rows)
    if(errors.length) {
        renderCreateInventoryImportStatus(errors, false)
        return notification('Excel import has validation errors.', 0)
    }

    const request = await httpRequest2('../controllers/inventoryscript', buildInventoryImportPayload(validRows), did('importExcelBtn'))
    if(request?.status) {
        const successMessages = [
            `${validRows.length} item(s) imported and created successfully.`,
            request.message || 'Record saved successfully.'
        ]
        renderCreateInventoryImportStatus(successMessages, true)
        notification('Inventory items created successfully.', 1)
        return
    }

    renderCreateInventoryImportStatus([request?.message || 'Unable to import inventory items.'], false)
    return notification(request?.message || 'Unable to import inventory items.', 0)
}

async function createinventoryFormSubmitHandler(){
    did('submit').children[0].style.display = 'flex'
    for(let i=0;i<document.getElementsByClassName('comp').length;i++){
        if(!document.getElementsByClassName('comp')[i].value){
            let label = document.getElementsByClassName('comp')[i].previousElementSibling.textContent
            notification(`${label} doesnt have a value`, 0)
            let ini = document.getElementsByClassName('comp')[i].style.borderColor
            document.getElementsByClassName('comp')[i].style.borderColor = 'red';
            document.getElementsByClassName('comp')[i].style.color = 'red';
                document.getElementsByClassName('comp')[i].value = '';
            setTimeout(()=>{
                document.getElementsByClassName('comp')[i].style.borderColor = ini;
                document.getElementsByClassName('comp')[i].style.color = 'black';
            },4000)
            
            return
        }
    }
    
    function params(){
        const items = Array.from(document.getElementById('createinventorycontainer').children)
        const rows = items.map((item)=>{
            const get = name => (item.querySelector(`[name=\"${name}\"]`)?.value ?? '').toString()
            let salespoints = []
            item.querySelectorAll('#departmt input[type=\"checkbox\"]').forEach(cb=>{
                if(cb.checked) salespoints.push(cb.getAttribute('name'))
            })
            return {
                itemname: get('itemname'),
                itemtype: get('itemtype'),
                units: get('units'),
                cost: get('cost'),
                price: get('price'),
                price_two: get('price_two'),
                beginbalance: get('beginbalance'),
                groupname: get('groupname'),
                applyto: get('applyto'),
                rlevel: get('rlevel'),
                composite: get('composite'),
                description: get('description'),
                itemclass: get('itemclass'),
                minbalance: get('minbalance'),
                salespoint: salespoints.join('|')
            }
        })
        return buildInventoryImportPayload(rows)
    }
    let request = await httpRequest2('../controllers/inventoryscript', params(), did('submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#createinventory').click()
        return
    }
    document.querySelector('#createinventory').click();
    return notification(request.message, 0);
}

function runItemNo(){
    for(let i=0;i<document.getElementById('createinventorycontainer').children.length;i++){
        document.getElementsByName('itemno')[i].children[0].innerHTML = `Item ${i+1}`;
    }
}

function addform (){
    const element = document.createElement('div')
    element.classList.add('flex')
    element.classList.add('flex-col')
    element.classList.add('mb-10')
    let x = `
                               
                                <p name="itemno" class="page-title !mb-4">
                                    <span>Item 1</span>
                                </p>
                                    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm" style="border: none;">
                                        <div  class="relative top-[-15px] w-full justify-end h-fit flex gap-5">
                                            <button title="Collapse" onclick="this.parentElement.parentElement.nextElementSibling.classList.contains('hidden') ? this.parentElement.parentElement.nextElementSibling.classList.remove('hidden') : this.parentElement.parentElement.nextElementSibling.classList.add('hidden')"  class="!z-[1] material-symbols-outlined rounded-full bg-[#969696] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">menu</button>
                                            <button title="Add Item" onclick="addform();runItemNo()" class="relative material-symbols-outlined rounded-full bg-[green] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">add</button>
                                            <button title="Delete" onclick="this.parentElement.parentElement.parentElement.remove()" class=" material-symbols-outlined rounded-full bg-[red] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">remove</button>
                                        </div>
                                         
                                            <div class="grid grid-cols-1 gap-6">
                                                <div class="form-group relative">
                                                    <label for="logoname" class="control-label flex justify-between">Item Name</label>
                                                    <input type="text" name="itemname" class="form-control comp" placeholder="Enter Name of Item">
                                                </div>
                                                <label class="text-xl font-medium opacity-[0.7]">Department / Sales Point</label>
                                                <div id="departmt" class="min-h-[100px] h-fit flex flex-wrap items-center rounded bg-[#5757570f] p-4">
                                                    ${departmenthtml}
                                                </div>
                                            </div> 
                                        </div>
                                        <div class="collapsible-body" style="border: none;">
                                            <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 !pt-0 rounded-sm" style="border: none;">
                                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Item Type</label>
                                                        <select name="itemtype" class="form-control comp">
                                                            <option value=''>-- Select Item Type --</option>
                                                            <option>FOOD</option>
                                                            <option>ALCOHOL</option>
                                                            <option>NON-ALCOHOL</option>
                                                            <option>MISCELLANEOUS</option>
                                                            <option>SERVICE</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Units</label>
                                                        <select name="units" id="units" class="form-control comp">
                                                            <option value=''>-- Select Unit --</option>
                                                            <option>PCS</option>
                                                            <option>PLASTIC</option>
                                                            <option>EACH</option>
                                                            <option>PACKET</option>
                                                            <option>ROLL</option>
                                                            <option>CUP</option>
                                                            <option>PAIR</option>
                                                            <option>YARDS</option>
                                                            <option>KG</option>
                                                            <option>SETS</option>
                                                            <option>METRES</option>
                                                            <option>LITRES</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Cost</label>
                                                        <input type="number" value="" name="cost" class="form-control" placeholder="Enter Cost of Item">
                                                    </div>
                                                </div>
                                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Price</label>
                                                        <input type="number" value="" name="price" class="form-control" placeholder="Set Price"/>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Price Two</label>
                                                        <input type="number" value="" name="price_two" class="form-control" placeholder="Set Price"/>
                                                    </div>
                                                </div>  
                                                </div> 
                                            </div>
                                            <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 !pt-0 rounded-sm" style="border: none;">
                                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Begin Balance</label>
                                                        <input type="number" value="" name="beginbalance" class="form-control" placeholder="Enter Begin Balance">
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Minimum Balance</label>
                                                        <input type="number" value="" name="minbalance" class="form-control" placeholder="Enter Minimum Balance">
                                                    </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Group Name</label>
                                                        <input type="text" value="" name="groupname" class="form-control" placeholder="Enter Group Name">
                                                    </div>
                                                </div> 
                                            </div>
                                            <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 !pt-0 rounded-sm" style="border: none;">
                                               <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">apply to</label>
                                                        <select name="applyto" id="applyto" class="form-control comp">
                                                            <option value=''>-- Select Apply To --</option>
                                                            <option>FOR SALE</option>
                                                            <option>NOT FOR SALE</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">item class</label>
                                                        <select name="itemclass" id="itemclass" class="form-control comp">
                                                            <option value=''>-- Select Item Class --</option>
                                                            <option>STOCK-ITEM</option>
                                                            <option>NON STOCK-ITEM</option>
                                                        </select>
                                                    </div>
                                                    </div>
                                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Reorder Level</label>
                                                        <input type="text" value="" name="rlevel" class="form-control" placeholder="Enter reorder level">
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Composite</label>
                                                        <select name="composite" id="composite" class="form-control">
                                                            <option value=''>-- Select Composite --</option>
                                                            <option>YES</option>
                                                            <option selected>NO</option>
                                                        </select>
                                                    </div>
                                                    </div>
                                                </div> 
                                            </div>
                                            <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 !pt-0 rounded-sm" style="border: none;">
                                                <div class="grid grid-cols-1 gap-6">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Description</label>
                                                        <input type="text" name="description" class="form-control" placeholder="Enter Item Description">
                                                    </div>
                                                </div> 
                                            </div>
                                            </div>
                                        
                                `
    element.innerHTML = x
    did('createinventorycontainer').appendChild(element)
    populateInventoryUnitSelect(element.querySelector('select[name="units"]'))
    runItemNo()
}
