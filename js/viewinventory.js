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
    return items.map(item => ({
        ...item,
        composite: item?.composite || 'NO',
        itemtype: item?.itemtype || ''
    }))
}

function applyViewInventoryClientFilter() {
    const query = String(did('itemname1')?.value || '').trim().toLowerCase()
    if (!query) {
        resolvePagination(viewinventoryItems, onviewinventoryTableDataSignal)
        updateInventorySummary(viewinventoryItems.length)
        return
    }

    const filtered = viewinventoryItems.filter(item => [
        item?.itemname,
        item?.cost,
        item?.price,
        item?.units,
        item?.itemtype,
        item?.itemid,
        item?.groupname,
        item?.composite,
        item?.description
    ].some(field => String(field ?? '').toLowerCase().includes(query)))

    resolvePagination(filtered, onviewinventoryTableDataSignal)
    updateInventorySummary(filtered.length)
}

function bindViewInventoryEvents() {
    const form = document.querySelector('#viewinventoryform')
    const editForm = document.querySelector('#viewinventoryeditform')
    const submitBtn = form?.querySelector('#submit')
    const resetBtn = form?.querySelector('#reset-filter')
    const searchInput = did('itemname1')
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
    resolvePagination(viewinventoryItems, onviewinventoryTableDataSignal)
    updateInventorySummary(viewinventoryItems.length)
    return request
}

async function viewinventoryActive() {
    bindViewInventoryEvents()
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
                <td>${safeText(item.itemname || '-')}</td>
                <td>${safeText(item.cost || '-')}</td>
                <td>${safeText(item.price || '-')}</td>
                <td>${safeText(item.units || '-')}</td>
                <td>${safeText(item.groupname || '-')}</td>
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

function buildViewInventoryExcelRows(items = []) {
    return items.map(item => ({
        'Item ID': item?.itemid || '',
        'Item Name': item?.itemname || '',
        'Item Type': item?.itemtype || '',
        'Units': item?.units || '',
        'Group Name': item?.groupname || '',
        'Apply To': item?.applyto || '',
        'Cost': item?.cost || '',
        'Price': item?.price || '',
        'Price Two': item?.price_two || '',
        'Min Balance': item?.minbalance || '',
        'Reorder Level': item?.reorderlevel || '',
        'Composite': item?.composite || '',
        'Description': item?.description || ''
    }))
}

async function exportViewInventoryCurrentPageExcel() {
    const currentPageRows = getSignaledDatasource() || []
    if (!currentPageRows.length) return notification('No records on current page to export', 0)
    const ok = await ensureXLSXLoadedViewInventory()
    if (!ok) return notification('Could not load Excel helper. Check your connection.', 0)
    const rows = buildViewInventoryExcelRows(currentPageRows)
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory_Page')
    XLSX.writeFile(wb, 'view_inventory_current_page.xlsx')
}

async function exportViewInventoryAllExcel() {
    if (!viewinventoryItems.length) return notification('No records to export', 0)
    const ok = await ensureXLSXLoadedViewInventory()
    if (!ok) return notification('Could not load Excel helper. Check your connection.', 0)
    const rows = buildViewInventoryExcelRows(viewinventoryItems)
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory_All')
    XLSX.writeFile(wb, 'view_inventory_all.xlsx')
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
