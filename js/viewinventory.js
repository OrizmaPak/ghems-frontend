let viewinventoryid
let viewinventoryItems = []
let viewInventoryFilterTimer
const viewInventoryAllowedItemTypes = ['FOOD', 'ALCOHOL', 'NON-ALCOHOL', 'MISCELLANEOUS']

function safeText(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

function updateInventorySummary(total) {
    const summary = did('inventory-summary')
    if (summary) summary.textContent = `${total} item(s) loaded`
}

function normalizeViewInventoryItems(items) {
    const flattened = []
    ;(items || []).forEach(item => {
        if (Array.isArray(item?.itemlist)) {
            item.itemlist.forEach(entry => flattened.push({
                ...entry,
                salespoint: entry?.salespoint || item?.salespoint || ''
            }))
            return
        }
        flattened.push(item)
    })

    return flattened.map(item => ({
        ...item,
        composite: item?.composite || 'NO',
        itemtype: item?.itemtype || '',
        itemclass: item?.itemclass || '',
        salespoint: item?.salespoint || '',
        beginbalance: item?.beginbalance || '',
        applyto: item?.applyto || '',
        minbalance: item?.minbalance || '',
        reorderlevel: item?.reorderlevel || '',
        price_two: item?.price_two || '',
        status: item?.status || ''
    }))
}

function normalizeViewInventoryClass(value = '') {
    return String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
}

function getFilteredViewInventoryItems() {
    const query = String(did('itemname1')?.value || '').trim().toLowerCase()
    const salespoint = String(did('viewinventorysalespoint')?.value || 'ALL').trim().toLowerCase()
    const itemclass = String(did('viewinventoryitemclass')?.value || 'ALL').trim().toUpperCase()
    const itemclassKey = normalizeViewInventoryClass(itemclass)

    return viewinventoryItems.filter(item => {
        const queryPass = !query || [
            item?.itemname,
            item?.cost,
            item?.price,
            item?.units,
            item?.itemtype,
            item?.itemid,
            item?.salespoint,
            item?.itemclass,
            item?.applyto,
            item?.beginbalance,
            item?.minbalance,
            item?.reorderlevel,
            item?.status,
            item?.composite,
            item?.description
        ].some(field => String(field ?? '').toLowerCase().includes(query))
        const salespointPass = !salespoint || salespoint === 'all' || String(item?.salespoint || '').trim().toLowerCase() === salespoint
        const itemclassPass = itemclassKey === 'ALL' || normalizeViewInventoryClass(item?.itemclass) === itemclassKey
        return queryPass && salespointPass && itemclassPass
    })
}

function applyViewInventoryClientFilter() {
    const filtered = getFilteredViewInventoryItems()
    resolvePagination(filtered, onviewinventoryTableDataSignal)
    updateInventorySummary(filtered.length)
}

async function populateViewInventorySalespoints() {
    const target = did('viewinventorysalespoint')
    if (!target || target.dataset.loaded) return
    const request = await httpRequest2('../controllers/fetchdepartments', null, null, 'json')
    if (!request?.status || !Array.isArray(request.data)) return
    const departments = request.data.filter(item => item?.applyforsales === 'NON STOCK' || item?.applyforsales === 'STOCK')
    target.innerHTML = `<option selected>ALL</option>${departments.map(item => {
        const department = item.department === 'FRONT-DESK/BOOKING' ? 'Booking/Reservation' : item.department
        return `<option>${safeText(department || '')}</option>`
    }).join('')}`
    target.dataset.loaded = '1'
}

function bindViewInventoryEvents() {
    const form = document.querySelector('#viewinventoryform')
    const editForm = document.querySelector('#viewinventoryeditform')
    const submitBtn = form?.querySelector('#submit')
    const resetBtn = form?.querySelector('#reset-filter')
    const searchInput = did('itemname1')
    const salespointFilter = did('viewinventorysalespoint')
    const itemclassFilter = did('viewinventoryitemclass')
    const updateBtn = editForm?.querySelector('#submit')
    const tableBody = did('tabledata')
    const exportPageBtn = did('viewinventory-export-page')
    const exportAllBtn = did('viewinventory-export-all')
    const uploadBtn = did('viewinventory-upload-excel-btn')
    const uploadInput = did('viewinventory-upload-excel-input')

    if (submitBtn && !submitBtn.dataset.bound) {
        submitBtn.addEventListener('click', () => viewinventoryFormSubmitHandler())
        submitBtn.dataset.bound = '1'
    }

    if (resetBtn && !resetBtn.dataset.bound) {
        resetBtn.addEventListener('click', async () => {
            if (searchInput) searchInput.value = ''
            if (salespointFilter) salespointFilter.value = 'ALL'
            if (itemclassFilter) itemclassFilter.value = 'ALL'
            await viewinventoryFormSubmitHandler()
        })
        resetBtn.dataset.bound = '1'
    }

    if (searchInput && !searchInput.dataset.bound) {
        searchInput.addEventListener('input', () => {
            clearTimeout(viewInventoryFilterTimer)
            viewInventoryFilterTimer = setTimeout(() => applyViewInventoryClientFilter(), 220)
        })
        searchInput.dataset.bound = '1'
    }

    if (salespointFilter && !salespointFilter.dataset.bound) {
        salespointFilter.addEventListener('change', () => viewinventoryFormSubmitHandler())
        salespointFilter.dataset.bound = '1'
    }

    if (itemclassFilter && !itemclassFilter.dataset.bound) {
        itemclassFilter.addEventListener('change', () => viewinventoryFormSubmitHandler())
        itemclassFilter.dataset.bound = '1'
    }

    if (updateBtn && !updateBtn.dataset.bound) {
        updateBtn.addEventListener('click', () => viewinventoryFormEditHandler())
        updateBtn.dataset.bound = '1'
    }

    if (tableBody && !tableBody.dataset.bound) {
        tableBody.addEventListener('click', (event) => {
            const actionButton = event.target.closest('button[data-action]')
            if (!actionButton) return

            const itemid = decodeURIComponent(actionButton.dataset.itemid || '')
            if (!itemid) return

            if (actionButton.dataset.action === 'edit') return viewinventoryFormSubmitHandler(itemid)
            if (actionButton.dataset.action === 'delete') return removeviewinventory(itemid)
        })
        tableBody.dataset.bound = '1'
    }

    if (exportPageBtn && !exportPageBtn.dataset.bound) {
        exportPageBtn.addEventListener('click', () => exportViewInventoryCurrentPageExcel())
        exportPageBtn.dataset.bound = '1'
    }

    if (exportAllBtn && !exportAllBtn.dataset.bound) {
        exportAllBtn.addEventListener('click', () => exportViewInventoryAllExcel())
        exportAllBtn.dataset.bound = '1'
    }

    if (uploadBtn && uploadInput && !uploadBtn.dataset.bound) {
        uploadBtn.addEventListener('click', () => uploadInput.click())
        uploadInput.addEventListener('change', handleViewInventoryExcelUpload)
        uploadBtn.dataset.bound = '1'
    }

}

async function loadViewInventory() {
    const payload = new FormData()
    payload.append('itemname', did('itemname1')?.value || '')
    payload.append('salespoint', did('viewinventorysalespoint')?.value || 'ALL')
    payload.append('itemclass', did('viewinventoryitemclass')?.value || 'ALL')

    const request = await httpRequest2(
        '../controllers/fetchinventorylist',
        payload,
        document.querySelector('#viewinventoryform #submit')
    )

    if (!request?.status) {
        viewinventoryItems = []
        datasource = []
        resolvePagination([], onviewinventoryTableDataSignal)
        updateInventorySummary(0)
        return notification(request?.message || 'No records retrieved')
    }

    viewinventoryItems = normalizeViewInventoryItems(normalizeInventoryItems(request.data))
    datasource = viewinventoryItems
    applyViewInventoryClientFilter()
    return request
}

async function viewinventoryActive() {
    bindViewInventoryEvents()
    await populateViewInventorySalespoints()
    populateInventoryUnitSelects(document.querySelector('#viewinventoryeditform'))
    await viewinventoryFormSubmitHandler()
}

async function fetchviewinventorys(id) {
    if (!id) return loadViewInventory()

    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }

    let request = await httpRequest2('../controllers/fetchinventorylist', getparamm(), null, 'json')
    if(request.status) {
        const items = normalizeViewInventoryItems(normalizeInventoryItems(request.data))
        if(items[0]) populateData(items[0], ['imageurl'])
        return
    }
    return notification('No records retrieved')
}

async function removeviewinventory(id) {
    const confirmed = window.confirm('Are you sure you want to remove this item?')
    if (!confirmed) return

    function getparamm() {
        let paramstr = new FormData()
        paramstr.append('itemid', id)
        return paramstr
    }

    let request = await httpRequest2('../controllers/removeitem', getparamm(), null, 'json')
    await viewinventoryFormSubmitHandler()
    return notification(request?.message || 'No records retrieved', request?.status ? 1 : 0)
}

async function onviewinventoryTableDataSignal() {
    const rows = (getSignaledDatasource() || []).map((item) => {
        const itemId = encodeURIComponent(String(item?.itemid ?? ''))
        const composite = String(item?.composite || 'NO').toUpperCase()
        const compositeColor = composite === 'YES' ? '#16a34a' : '#64748b'

        return `
            <tr>
                <td>${item.index + 1}</td>
                <td>${safeText(item.salespoint || '-')}</td>
                <td>${safeText(item.itemid || '-')}</td>
                <td>${safeText(item.itemname || '-')}</td>
                <td>${safeText(item.itemclass || '-')}</td>
                <td>${safeText(item.itemtype || '-')}</td>
                <td>${safeText(item.units || '-')}</td>
                <td>${safeText(item.beginbalance || '0')}</td>
                <td>${safeText(item.cost || '-')}</td>
                <td>${safeText(item.price || '-')}</td>
                <td>${safeText(item.price_two || '-')}</td>
                <td>${safeText(item.applyto || '-')}</td>
                <td>${safeText(item.minbalance || '0')}</td>
                <td>${safeText(item.reorderlevel || '0')}</td>
                <td>${safeText(item.status || '-')}</td>
                <td><span style="display:inline-block;padding:2px 8px;border-radius:999px;color:#fff;background:${compositeColor};font-size:11px;font-weight:600;">${safeText(composite)}</span></td>
                <td>${safeText(item.description || '-')}</td>
                <td>
                    <div class="flex items-center gap-3">
                        <button type="button" data-action="edit" data-itemid="${itemId}" title="Edit row entry" class="material-symbols-outlined rounded-full bg-blue-600 h-8 w-8 text-white drop-shadow-md text-xs hover:bg-blue-700 transition-colors" style="font-size: 18px;">edit</button>
                        <button type="button" data-action="delete" data-itemid="${itemId}" title="Delete row entry" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
                    </div>
                </td>
            </tr>`
    }).join('')

    injectPaginatatedTable(rows)
}

async function viewinventoryFormSubmitHandler(itemid='') {
    if (did('imagePreview')) did('imagePreview').innerHTML = ''

    if(itemid){
        let selected = viewinventoryItems.find(data => String(data.itemid) === String(itemid))
        if(!selected){
            await loadViewInventory()
            selected = viewinventoryItems.find(data => String(data.itemid) === String(itemid))
        }
        if (!selected) return notification('Selected item was not found')

        viewinventoryid = itemid
        did('modalform').classList.remove('hidden')
        populateInventoryUnitSelect(document.querySelector('#viewinventoryeditform select[name="units"]'), selected.units || '')
        populateData(selected, ['imageurl'])
        return
    }

    const request = await loadViewInventory()
    if (request?.status) {
        did('modalform').classList.add('hidden')
        return notification(request.message, 1)
    }
}

async function viewinventoryFormEditHandler(id='') {
    const payload = getFormData2(
        document.querySelector('#viewinventoryeditform'),
        viewinventoryid ? [['itemid', viewinventoryid],['photofilename', showFileName('imageurl')],['userphotoname', getFile('imageurl')]] : null
    )

    let request = await httpRequest2('../controllers/editinventory', payload, document.querySelector('#viewinventoryeditform #submit'))
    if(request?.status) {
        did('modalform').classList.add('hidden')
        await viewinventoryFormSubmitHandler()
        return notification(request.message, 1)
    }
    return notification(request?.message || 'No records retrieved')
}

async function ensureXLSXLoadedViewInventory() {
    if (window.XLSX) return true
    return await new Promise(resolve => {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.head.appendChild(script)
    })
}

async function ensureExcelJsLoadedViewInventory() {
    if (window.ExcelJS) return true
    return await new Promise(resolve => {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js'
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.head.appendChild(script)
    })
}

function buildViewInventoryExcelRows(items = []) {
    return items.map(item => ({
        'Item ID': item?.itemid || '',
        'Item Name': item?.itemname || '',
        'Item Type': item?.itemtype || ''
    }))
}

async function exportViewInventoryRowsWithDropdown(rows, sheetName, fileName) {
    const ok = await ensureExcelJsLoadedViewInventory()
    if (!ok) return notification('Could not load Excel helper. Check your connection.', 0)

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(sheetName)
    worksheet.columns = [
        { header: 'Item ID', key: 'itemid', width: 18 },
        { header: 'Item Name', key: 'itemname', width: 40 },
        { header: 'Item Type', key: 'itemtype', width: 22 }
    ]

    rows.forEach(row => worksheet.addRow({
        itemid: row['Item ID'] || '',
        itemname: row['Item Name'] || '',
        itemtype: row['Item Type'] || ''
    }))

    const maxRow = Math.max(rows.length + 1, 2)
    for (let rowIndex = 2; rowIndex <= maxRow; rowIndex++) {
        worksheet.getCell(`C${rowIndex}`).dataValidation = {
            type: 'list',
            allowBlank: true,
            showErrorMessage: true,
            errorTitle: 'Invalid Item Type',
            error: 'Select one of: FOOD, ALCOHOL, NON-ALCOHOL, MISCELLANEOUS',
            formulae: [`"${viewInventoryAllowedItemTypes.join(',')}"`]
        }
    }

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
}

async function exportViewInventoryCurrentPageExcel() {
    const currentPageRows = getSignaledDatasource() || []
    if (!currentPageRows.length) return notification('No records on current page to export', 0)
    const rows = buildViewInventoryExcelRows(currentPageRows)
    return exportViewInventoryRowsWithDropdown(rows, 'Inventory_Page', 'view_inventory_current_page.xlsx')
}

async function exportViewInventoryAllExcel() {
    if (!viewinventoryItems.length) return notification('No records to export', 0)
    const rows = buildViewInventoryExcelRows(viewinventoryItems)
    return exportViewInventoryRowsWithDropdown(rows, 'Inventory_All', 'view_inventory_all.xlsx')
}

function mapViewInventoryImportHeaders(rawRow = {}) {
    const mapped = {}
    Object.keys(rawRow || {}).forEach(key => {
        const normalizedKey = String(key || '').trim().toLowerCase()
        const value = rawRow[key]
        if (normalizedKey === 'item id' || normalizedKey === 'itemid') mapped.itemid = value
        if (normalizedKey === 'item type' || normalizedKey === 'itemtype') mapped.itemtype = value
    })
    return mapped
}

function normalizeViewInventoryItemType(value) {
    const normalized = String(value || '').trim().toUpperCase()
    if (!normalized) return ''
    return viewInventoryAllowedItemTypes.find(item => item === normalized) || ''
}

async function updateViewInventoryItemTypeByRow(sourceItem, newItemType) {
    const payload = new FormData()
    payload.append('itemid', sourceItem?.itemid || '')
    payload.append('itemname', sourceItem?.itemname || '')
    payload.append('units', sourceItem?.units || '')
    payload.append('cost', sourceItem?.cost || '')
    payload.append('price', sourceItem?.price || '')
    payload.append('price_two', sourceItem?.price_two || '')
    payload.append('beginbalance', sourceItem?.beginbalance || '')
    payload.append('minbalance', sourceItem?.minbalance || '')
    payload.append('groupname', sourceItem?.groupname || '')
    payload.append('applyto', sourceItem?.applyto || '')
    payload.append('reorderlevel', sourceItem?.reorderlevel || '')
    payload.append('composite', sourceItem?.composite || 'NO')
    payload.append('description', sourceItem?.description || '')
    payload.append('itemtype', newItemType)
    const request = await httpRequest2('../controllers/editinventory', payload, null, 'json')
    return !!request?.status
}

async function handleViewInventoryExcelUpload(event) {
    const input = event?.target
    const uploadBtn = did('viewinventory-upload-excel-btn')
    const file = input?.files?.[0]
    if (!file) return
    if (!viewinventoryItems.length) {
        input.value = ''
        return notification('Load inventory first before uploading Excel', 0)
    }

    const ok = await ensureXLSXLoadedViewInventory()
    if (!ok) {
        input.value = ''
        return notification('Could not load Excel helper. Check your connection.', 0)
    }

    if (uploadBtn) uploadBtn.disabled = true
    let updated = 0
    let skipped = 0
    let failed = 0

    try {
        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' })
        if (!rawRows.length) {
            return notification('No rows found in uploaded Excel', 0)
        }

        for (let i = 0; i < rawRows.length; i++) {
            const row = mapViewInventoryImportHeaders(rawRows[i])
            const itemid = String(row.itemid || '').trim()
            const normalizedType = normalizeViewInventoryItemType(row.itemtype)
            if (!itemid || !normalizedType) {
                skipped++
                continue
            }

            const item = viewinventoryItems.find(entry => String(entry?.itemid || '') === itemid)
            if (!item) {
                skipped++
                continue
            }

            const successful = await updateViewInventoryItemTypeByRow(item, normalizedType)
            if (successful) {
                item.itemtype = normalizedType
                updated++
            } else {
                failed++
            }
        }

        await viewinventoryFormSubmitHandler()
        return notification(`Item type upload completed. Updated: ${updated}, Skipped: ${skipped}, Failed: ${failed}`, failed ? 0 : 1)
    } catch (error) {
        console.log(error)
        return notification('Unable to process uploaded Excel file', 0)
    } finally {
        if (uploadBtn) uploadBtn.disabled = false
        if (input) input.value = ''
    }
}
