let updateinventoryid
const updateInventoryAllowedItemTypes = ['FOOD', 'ALCOHOL', 'NON-ALCOHOL', 'MISCELLANEOUS']
async function updateinventoryActive() {
    recalldatalist()
    updateinventoryFormSubmitHandler(default_department)
    if(document.querySelector('#salespointname'))document.querySelector('#salespointname').addEventListener('change', e=>updateinventoryFormSubmitHandler())
    if(document.querySelector('#save')) document.querySelector('#save').addEventListener('click', e=>saveupdatedprices())
    if(document.querySelector('#updateinventory-export-btn')) document.querySelector('#updateinventory-export-btn').addEventListener('click', exportUpdateInventoryRows)
    if(document.querySelector('#updateinventory-import-btn')) document.querySelector('#updateinventory-import-btn').addEventListener('click', ()=>did('updateinventory-import-input')?.click())
    if(document.querySelector('#updateinventory-import-input')) document.querySelector('#updateinventory-import-input').addEventListener('change', handleUpdateInventoryImportFile)
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
        deleteitemupdateinventory()
    })
    // form.querySelector('#submit').click()
    datasource = []
    // await fetchupdateinventorys()
}

async function ensureXLSXLoadedForUpdateInventory(){
    if(window.XLSX) return true
    return await new Promise(resolve=>{
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
        script.onload = ()=>resolve(true)
        script.onerror = ()=>resolve(false)
        document.head.appendChild(script)
    })
}

async function ensureExcelJsLoadedForUpdateInventory(){
    if(window.ExcelJS) return true
    return await new Promise(resolve=>{
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js'
        script.onload = ()=>resolve(true)
        script.onerror = ()=>resolve(false)
        document.head.appendChild(script)
    })
}

function getUpdateInventoryTableRowsData(){
    const rows = []
    const itemIds = document.getElementsByName('itemid')
    const itemNames = document.getElementsByName('itemname')
    const itemTypes = document.getElementsByName('itemtype')
    const prices = document.getElementsByName('price')
    const priceTwos = document.getElementsByName('price_two')
    const minBalances = document.getElementsByName('minbalance')
    const salespoint = did('salespointname')?.value || ''
    for(let i=0;i<itemIds.length;i++){
        rows.push({
            itemid: `${itemIds[i]?.value || ''}`.trim(),
            itemname: `${itemNames[i]?.value || ''}`.trim(),
            itemtype: `${itemTypes[i]?.value || ''}`.trim(),
            price: `${prices[i]?.value || ''}`.trim(),
            price_two: `${priceTwos[i]?.value || ''}`.trim(),
            minbalance: `${minBalances[i]?.value || ''}`.trim(),
            balance: `${datasource?.[i]?.balance ?? ''}`.trim(),
            salespoint
        })
    }
    return rows
}

function updateInventoryExcelSafeName(value=''){
    const sanitized = String(value || 'all').trim().replace(/[^\w-]+/g, '_')
    return sanitized || 'all'
}

async function exportUpdateInventoryRows(){
    const rows = getUpdateInventoryTableRowsData()
    if(!rows.length) return notification('Load items first before exporting', 0)
    const ok = await ensureExcelJsLoadedForUpdateInventory()
    if(!ok) return notification('Could not load Excel helper. Check your connection.', 0)

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Update_Inventory')
    worksheet.columns = [
        { header: 'Item ID', key: 'itemid', width: 18 },
        { header: 'Item Name', key: 'itemname', width: 38 },
        { header: 'Item Type', key: 'itemtype', width: 24 },
        { header: 'Price', key: 'price', width: 16 },
        { header: 'Price Two', key: 'price_two', width: 16 },
        { header: 'Min Balance', key: 'minbalance', width: 16 },
        { header: 'Qty in Stock', key: 'balance', width: 16 },
        { header: 'Sales Point', key: 'salespoint', width: 28 }
    ]
    rows.forEach(row=>worksheet.addRow(row))
    const maxRow = Math.max(rows.length + 1, 2)
    for(let rowIndex=2; rowIndex<=maxRow; rowIndex++){
        worksheet.getCell(`C${rowIndex}`).dataValidation = {
            type: 'list',
            allowBlank: true,
            showErrorMessage: true,
            errorTitle: 'Invalid Item Type',
            error: 'Select one of: FOOD, ALCOHOL, NON-ALCOHOL, MISCELLANEOUS',
            formulae: [`"${updateInventoryAllowedItemTypes.join(',')}"`]
        }
    }
    const dateStr = new Date().toISOString().slice(0,10)
    const salespoint = updateInventoryExcelSafeName(did('salespointname')?.value)
    const filename = `update_inventory_${salespoint}_${dateStr}.xlsx`
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    return notification('Export completed', 1)
}

function mapUpdateInventoryImportHeaders(rawRow = {}){
    const mapped = {}
    Object.keys(rawRow || {}).forEach(key=>{
        const normalizedKey = String(key || '').trim().toLowerCase()
        const value = rawRow[key]
        if(normalizedKey === 'item id' || normalizedKey === 'itemid') mapped.itemid = value
        if(normalizedKey === 'item type' || normalizedKey === 'itemtype') mapped.itemtype = value
        if(normalizedKey === 'sales point' || normalizedKey === 'salespoint') mapped.salespoint = value
    })
    return mapped
}

function normalizeUpdateInventoryItemType(value=''){
    const normalized = String(value || '').trim().toUpperCase()
    return updateInventoryAllowedItemTypes.find(type => type === normalized) || ''
}

async function handleUpdateInventoryImportFile(event){
    const input = event?.target
    const file = input?.files?.[0]
    if(!file) return
    const currentRows = getUpdateInventoryTableRowsData()
    if(!currentRows.length){
        input.value = ''
        return notification('Load items first before importing', 0)
    }
    const ok = await ensureXLSXLoadedForUpdateInventory()
    if(!ok){
        input.value = ''
        return notification('Could not load Excel helper. Check your connection.', 0)
    }

    try{
        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' })
        if(!rawRows.length){
            input.value = ''
            return notification('No rows found in uploaded Excel', 0)
        }

        const domRowsByItemId = new Map()
        const itemIds = document.getElementsByName('itemid')
        for(let i=0;i<itemIds.length;i++){
            domRowsByItemId.set(String(itemIds[i]?.value || '').trim(), i)
        }

        const currentSalespoint = String(did('salespointname')?.value || '').trim().toLowerCase()
        let updated = 0
        let skipped = 0
        let invalidType = 0
        let unmatched = 0

        rawRows.forEach(row=>{
            const mapped = mapUpdateInventoryImportHeaders(row)
            const itemid = String(mapped.itemid || '').trim()
            if(!itemid){
                skipped++
                return
            }
            const normalizedType = normalizeUpdateInventoryItemType(mapped.itemtype)
            if(!normalizedType){
                invalidType++
                return
            }
            const rowSalespoint = String(mapped.salespoint || '').trim().toLowerCase()
            if(rowSalespoint && currentSalespoint && rowSalespoint !== currentSalespoint){
                skipped++
                return
            }
            const index = domRowsByItemId.get(itemid)
            if(index === undefined){
                unmatched++
                return
            }
            const typeSelect = document.getElementsByName('itemtype')[index]
            if(typeSelect){
                typeSelect.value = normalizedType
                updated++
            }else{
                unmatched++
            }
        })

        notification(`Import completed. Updated: ${updated}, Skipped: ${skipped}, Invalid Type: ${invalidType}, Unmatched: ${unmatched}`, updated ? 1 : 0)
    }catch(error){
        console.error(error)
        notification('Unable to read Excel file. Please confirm headers and format.', 0)
    }finally{
        if(input) input.value = ''
    }
}

async function fetchupdateinventorys(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchinventorylist', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `<tr>
                                                <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                                            </tr>`
    if(request.status) {
        const items = normalizeInventoryItems(request.data)
        if(!id){
            if(items.length) {
                datasource = items
                
                // resolvePagination(datasource, onupdateinventoryTableDataSignal)
            }
        }else{
             updateinventoryid = items[0]?.id
            if(items[0])populateData(items[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeupdateinventory(id) {
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
    fetchupdateinventorys()
    return notification(request.message);
    
}


// async function onupdateinventoryTableDataSignal() {
//     let rows = getSignaledDatasource().map((item, index) => `
//     <tr>
//         <td>${item.index + 1 }</td>
//         <td>${item.itemname}</td>
//         <td><input value="${item.price ? Number(item.price) : ''}" type="number" name="price" id="price" class="form-control" placeholder="Enter Price"></td>
//         <td><input value="${item.price_two ? Number(item.price_two) : ''}" type="number" name="price_two" id="price_two" class="form-control" placeholder="Enter Price two"></td>
//         <td><input value="${item.minbalance ? Number(item.minbalance) : ''}" type="number" name="minbalance" id="minbalance" class="form-control" placeholder="Enter min balance"></td>
//         <td><input value="${item.balance ? Number(item.balance) : ''}" type="number" name="balance" id="balance" class="form-control" placeholder="Enter stock balance"></td>
//     </tr>`
//     )
//     .join('')
//     injectPaginatatedTable(rows)
// }

async function updateinventoryFormSubmitHandler(store) {
    if(!did('salespointname').value && !store)return notification('Please enter a Department / Sales Point')
    function payload(){
        let param = new FormData()
        if(!store)param.append('salespoint', did('salespointname').value)
        if(store)param.append('salespoint', default_department)
        return param
    }
    let request = await httpRequest2('../controllers/fetchinventorybysalespoint', payload(), document.querySelector('#updateinventoryform #save'))
    document.getElementById('tabledata').innerHTML = `<p class="text-center w-full">No records retrieved</p>`
    if(request.status) {
            if(request.data.length) {
                datasource = request.data
                document.getElementById('tabledata').innerHTML = request.data.map((item, index) => `
                <tr>
                    <input value="${item.itemid ? Number(item.itemid) : ''}" type="hidden" name="itemid" id="itemid-${index}" class="form-control comp" placeholder="Enter Price">
                    <input value="${item.id ? Number(item.id) : ''}" type="hidden" name="id" id="id-${index}" class="form-control comp" placeholder="Enter Price">
                    <input value="${item.itemname ? String(item.itemname).trim() : ''}" type="hidden" name="itemname" id="itemname-${index}" class="form-control comp" placeholder="Enter Item Name">
                    <td>${index + 1 }</td>
                    <td><input type="checkbox" id="${item.itemid}" name="itemer"/></td>
                    <td>${item.itemname}</td>
                    <td>
                        <select name="itemtype" id="itemtype-${index}" class="form-control comp">
                            <option value=''>-- Select Item Type --</option>
                            <option ${String(item.itemtype || '').toUpperCase() === 'FOOD' ? 'selected' : ''}>FOOD</option>
                            <option ${String(item.itemtype || '').toUpperCase() === 'ALCOHOL' ? 'selected' : ''}>ALCOHOL</option>
                            <option ${String(item.itemtype || '').toUpperCase() === 'NON-ALCOHOL' ? 'selected' : ''}>NON-ALCOHOL</option>
                            <option ${String(item.itemtype || '').toUpperCase() === 'MISCELLANEOUS' ? 'selected' : ''}>MISCELLANEOUS</option>
                        </select>
                    </td>
                    <td><input value="${item.price ? Number(item.price) : ''}" type="number" name="price" id="price-${index}" class="form-control comp" placeholder="Enter Price"></td>
                    <td><input value="${item.price_two ? Number(item.price_two) : ''}" type="number" name="price_two" id="price_two-${index}" class="form-control comp" placeholder="Enter Price two"></td>
                    <td><input value="${item.minbalance ? Number(item.minbalance) : ''}" type="number" name="minbalance" id="minbalance-${index}" class="form-control comp" placeholder="Enter min balance"></td>
                    <td>${item.balance}</td>
                </tr>`
                )
                .join('')
                // resolvePagination(datasource, onupdateinventoryTableDataSignal)
                return notification(request.message, 1);
            }
    }else return notification('No records retrieved')
}

async function saveupdatedprices() {
    if(!validateForm('updateinventoryform', getIdFromCls('comp'))) return
    function payload(){
        let param = new FormData()
        param.append('salespoint', did('salespointname').value)
        let itemid = ''
        let price = ''
        let price_two = ''
        let minbalance = ''
        let itemtype = ''
        let itemname = ''
        for(let i=0;i<document.getElementsByName('itemid').length;i++){
            if(i == 0){
                itemid = document.getElementsByName('itemid')[i].value;
                itemname = document.getElementsByName('itemname')[i].value;
                price = document.getElementsByName('price')[i].value;
                price_two = document.getElementsByName('price_two')[i].value;
                minbalance = document.getElementsByName('minbalance')[i].value;
                itemtype = document.getElementsByName('itemtype')[i].value;
            }else{
                itemid = itemid+'|'+document.getElementsByName('itemid')[i].value;
                itemname = itemname+'|'+document.getElementsByName('itemname')[i].value;
                price = price+'|'+document.getElementsByName('price')[i].value;
                price_two = price_two+'|'+document.getElementsByName('price_two')[i].value;
                minbalance = minbalance+'|'+document.getElementsByName('minbalance')[i].value;
                itemtype = itemtype+'|'+document.getElementsByName('itemtype')[i].value;
            }
        }
            param.append('itemid', itemid)
            param.append('itemname', itemname)
            param.append('price', price)
            param.append('price_two', price_two)
            param.append('minbalance', minbalance)
            param.append('itemtype', itemtype)
        return param
    }
    let request = await httpRequest2('../controllers/inventoryupdate', payload(),  document.querySelector('#updateinventoryform #save'))
    // document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
                return notification(request.message, 1);
    }else{
                did('updateinventory').click()
                did('salespointname').value = ''
        document.getElementById('tabledata').innerHTML = `<tr>
                                                <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                                            </tr>`;
        return notification('No records retrieved')}
}

async function deleteitemupdateinventory() {
    function payload(){
        let param = new FormData()
        param.append('salespoint', did('salespointname').value) 
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
    let request = await httpRequest2('../controllers/deleteinventoryfromupdate', payload(),  document.querySelector('#updateinventoryform #delete'))
    if(request.status) {
                updateinventoryFormSubmitHandler()
                return notification(request.message, 1);
    }else return notification('No records retrieved')
}


// function runAdupdateinventoryFormValidations() {
//     let form = document.getElementById('updateinventoryform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#updateinventoryname'))  controls.push([form.querySelector('#updateinventoryname'), 'updateinventory name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
