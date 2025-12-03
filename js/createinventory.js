let createinventoryid
let departmenthtml
const inventoryImportHeaderMap = {
    'item name': 'itemname',
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
        departmenthtml = request.data.filter(dat=>dat.applyforsales == 'NON STOCK' || dat.applyforsales == 'STOCK').map(data=>`<div class="border  p-2 flex items-center m-1 gap-3 w-fit pr-4">
                            <input class="cp" name="${data.department}"  type="checkbox"/> 
                            <label class="cp" onclick="this.previousElementSibling.click()">${data.department}</label>
                        </div>`).join('');
        if(departmenthtml){
            did('loading').remove();
            did('createinventoryform').classList.remove('hidden');
            did('departmt').innerHTML = departmenthtml
        }
    }else return notification(request.message, 0);
    wireInventoryImport()
    wireInventoryTemplate()
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

function wireInventoryTemplate(){
    const templateBtn = document.getElementById('downloadInventoryTemplate')
    if(templateBtn) templateBtn.addEventListener('click', downloadInventoryTemplate)
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

async function downloadInventoryTemplate(){
    const ok = await ensureXLSXLoaded()
    if(!ok) return notification('Could not load Excel helper. Check your connection.', 0)
    const sampleRows = [
        {
            'Item Name': 'Sample Item 1',
            'Units': 'PCS',
            'Cost': 10,
            'Price': 15,
            'Price Two': 14,
            'Begin Balance': 5,
            'Min Balance': 1,
            'Group Name': 'GENERAL',
            'Apply To': 'FOR SALE',
            'Item Class': 'STOCK-ITEM',
            'Reorder Level': 3,
            'Composite': 'NO',
            'Description': 'Example description',
            'Sales Points': 'BAR|RESTAURANT'
        },
        {
            'Item Name': 'Sample Item 2',
            'Units': 'KG',
            'Cost': 20,
            'Price': 28,
            'Price Two': '',
            'Begin Balance': 0,
            'Min Balance': 0,
            'Group Name': 'SUPPLIES',
            'Apply To': 'NOT FOR SALE',
            'Item Class': 'NON STOCK-ITEM',
            'Reorder Level': '',
            'Composite': 'NO',
            'Description': 'Second example item',
            'Sales Points': 'KITCHEN'
        }
    ]
    const ws = XLSX.utils.json_to_sheet(sampleRows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory')
    XLSX.writeFile(wb, 'inventory_import_template.xlsx')
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
            populateInventoryForm(normalizedRows)
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

function populateInventoryForm(rows){
    if(!rows.length) return notification('No rows found in Excel. Please confirm headers match the template.', 0)
    const container = did('createinventorycontainer')
    container.innerHTML = ''
    for(let i=0;i<rows.length;i++) addform()
    rows.forEach((row, idx)=>{
        const form = container.children[idx]
        setInventoryField(form, 'itemname', row.itemname)
        setInventoryField(form, 'units', row.units)
        setInventoryField(form, 'cost', row.cost)
        setInventoryField(form, 'price', row.price)
        setInventoryField(form, 'price_two', row.price_two)
        setInventoryField(form, 'beginbalance', row.beginbalance)
        setInventoryField(form, 'minbalance', row.minbalance)
        setInventoryField(form, 'groupname', row.groupname)
        setInventoryField(form, 'applyto', row.applyto)
        setInventoryField(form, 'itemclass', row.itemclass)
        setInventoryField(form, 'rlevel', row.rlevel)
        setInventoryField(form, 'composite', row.composite || 'NO')
        setInventoryField(form, 'description', row.description)
        setSalesPoints(form, row.salespoint)
    })
    runItemNo()
    notification(`${rows.length} item(s) loaded from Excel. Review and submit.`, 1)
}

function setInventoryField(form, name, value){
    const el = form?.querySelector(`[name=\"${name}\"]`)
    if(!el) return
    let val = value
    if(val === undefined || val === null) val = ''
    if(typeof val === 'string') val = val.trim()
    if(el.tagName === 'SELECT'){
        const targetVal = `${val}`.toUpperCase()
        const match = Array.from(el.options).find(opt=>opt.value.toUpperCase() === targetVal || opt.text.toUpperCase() === targetVal)
        el.value = match ? match.value : ''
    }else{
        el.value = val
    }
}

function setSalesPoints(form, salesPoints){
    const points = (salesPoints || '').toString().split(/[,|;]/).map(p=>p.trim().toLowerCase()).filter(Boolean)
    if(!points.length) return
    const set = new Set(points)
    form.querySelectorAll('#departmt input[type=\"checkbox\"]').forEach(cb=>{
        const key = (cb.getAttribute('name') || '').trim().toLowerCase()
        cb.checked = set.has(key)
    })
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
        let param = new FormData();
            param.append(`rowsize`, document.getElementsByName('itemname').length)
        for(let i=0;i<document.getElementsByName('itemname').length;i++){
            param.append(`itemname${i+1}`, document.getElementsByName('itemname')[i].value)
            param.append(`units${i+1}`, document.getElementsByName('units')[i].value)
            param.append(`cost${i+1}`, document.getElementsByName('cost')[i].value)
            param.append(`price${i+1}`, document.getElementsByName('price')[i].value)
            param.append(`price_two${i+1}`, document.getElementsByName('price_two')[i].value) 
            param.append(`beginbalance${i+1}`, document.getElementsByName('beginbalance')[i].value)
            param.append(`groupname${i+1}`, document.getElementsByName('groupname')[i].value)
            param.append(`applyto${i+1}`, document.getElementsByName('applyto')[i].value)
            param.append(`reorderlevel${i+1}`, document.getElementsByName('rlevel')[i].value)
            param.append(`composite${i+1}`, document.getElementsByName('composite')[i].value) 
            param.append(`description${i+1}`, document.getElementsByName('description')[i].value)
            param.append(`itemclass${i+1}`, document.getElementsByName('itemclass')[i].value) 
            param.append(`minbalance${i+1}`, document.getElementsByName('minbalance')[i].value) 
            let x = document.getElementsByName('itemname')[i].parentElement.parentElement.children[2]
            let y = ''; 
            for(let j=0;j<x.children.length;j++){
                if(x.children[j].children[0].checked && y)y=y+'|'+x.children[j].children[0].getAttribute('name')
                if(x.children[j].children[0].checked && !y)y=x.children[j].children[0].getAttribute('name')
            }
            param.append(`salespoint${i+1}`, y)
            
            
        }
        return param
    }
    params()
    let request = await httpRequest2('../controllers/inventoryscript', params(), document.querySelector('#productitemsform #submit'))
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
    runItemNo()
}
