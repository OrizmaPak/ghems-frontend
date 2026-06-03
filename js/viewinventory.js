let viewinventoryid
let viewinventoryItems = []
let viewInventoryFilterTimer
const viewInventoryAllowedItemTypes = ['FOOD', 'ALCOHOL', 'NON-ALCOHOL', 'MISCELLANEOUS', 'SERVICE']
let viewInventoryDepartmentNames = []
let viewInventoryDepartmentHtml = ''

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
    const departmentsHost = did('viewinventorydepartments')
    if (!target || target.dataset.loaded) return
    const request = await httpRequest2('../controllers/fetchdepartments', null, null, 'json')
    if (!request?.status || !Array.isArray(request.data)) return
    const departments = request.data.filter(item => item?.applyforsales === 'NON STOCK' || item?.applyforsales === 'STOCK')
    viewInventoryDepartmentNames = departments
        .map(item => String(item?.department || '').trim())
        .filter(Boolean)
    target.innerHTML = `<option selected>ALL</option>${departments.map(item => {
        const department = item.department === 'FRONT-DESK/BOOKING' ? 'Booking/Reservation' : item.department
        return `<option>${safeText(department || '')}</option>`
    }).join('')}`
    viewInventoryDepartmentHtml = departments.map(item => {
        const department = String(item?.department || '').trim()
        if (!department) return ''
        const label = department === 'FRONT-DESK/BOOKING' ? 'Booking/Reservation' : department
        return `<div class="border p-2 flex items-center m-1 gap-3 w-fit pr-4 rounded-md bg-white">
                    <input class="cp" data-department-checkbox="1" name="${safeText(department)}" type="checkbox"/>
                    <label class="cp" onclick="this.previousElementSibling.click()">${safeText(label)}</label>
                </div>`
    }).join('')
    if (departmentsHost) {
        departmentsHost.innerHTML = viewInventoryDepartmentHtml || '<div class="text-sm text-slate-500">No departments found.</div>'
    }
    target.dataset.loaded = '1'
}

function normalizeViewInventoryDepartmentName(value = '') {
    return String(value || '')
        .trim()
        .toUpperCase()
        .replace(/&/g, 'AND')
        .replace(/\//g, ' ')
        .replace(/-/g, ' ')
        .replace(/\s+/g, ' ')
}

function resolveViewInventoryDepartmentName(value = '') {
    const requested = String(value || '').trim()
    if (!requested) return ''
    const normalized = normalizeViewInventoryDepartmentName(requested)
    const aliasMap = new Map([
        ['BOOKING RESERVATION', 'FRONT-DESK/BOOKING'],
        ['FRONT DESK BOOKING', 'FRONT-DESK/BOOKING'],
        ['SALON SPA', 'Saloon/Spa'],
        ['SALOON SPA', 'Saloon/Spa'],
        ['BUSINESS CENTRE', 'Business Center'],
        ['CONFERENCE EVENT CENTRE', 'Conference/Event Center'],
        ['CONFERENCE OR EVENT CENTRE', 'Conference/Event Center'],
        ['LOBBY', 'Lobby Bar'],
        ['40 CAPACITY BOARDROOM', '40 Capacity Board Room']
    ])
    const resolvedAlias = aliasMap.get(normalized)
    if (resolvedAlias) return resolvedAlias
    const direct = viewInventoryDepartmentNames.find(name => normalizeViewInventoryDepartmentName(name) === normalized)
    return direct || ''
}

function parseViewInventoryDepartmentList(value = '') {
    const requested = String(value || '')
        .replace(/Current:/gi, '')
        .replace(/Missing:/gi, '')
        .replace(/Recommended:/gi, '')
        .split(/[|,;]/)
        .map(item => resolveViewInventoryDepartmentName(item))
        .filter(Boolean)
    return Array.from(new Set(requested))
}

function getViewInventoryItemDepartments(itemid = '') {
    const departments = viewinventoryItems
        .filter(item => String(item?.itemid || '').trim() === String(itemid || '').trim())
        .map(item => String(item?.salespoint || '').trim())
        .filter(Boolean)
    return Array.from(new Set(departments))
}

function renderViewInventoryDepartmentSelection(selectedDepartments = []) {
    const host = did('viewinventorydepartments')
    if (!host) return
    if (!viewInventoryDepartmentHtml) {
        host.innerHTML = '<div class="text-sm text-slate-500">No departments found.</div>'
        return
    }
    host.innerHTML = viewInventoryDepartmentHtml
    const selectedSet = new Set((selectedDepartments || []).map(item => String(item || '').trim()))
    host.querySelectorAll('[data-department-checkbox="1"]').forEach(input => {
        input.checked = selectedSet.has(String(input.name || '').trim())
    })
}

function getSelectedViewInventoryDepartments() {
    const host = did('viewinventorydepartments')
    if (!host) return []
    return Array.from(host.querySelectorAll('[data-department-checkbox="1"]:checked'))
        .map(input => String(input.name || '').trim())
        .filter(Boolean)
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
    const deleteUploadBtn = did('viewinventory-delete-excel-btn')
    const deleteUploadInput = did('viewinventory-delete-excel-input')
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

    if (deleteUploadBtn && deleteUploadInput && !deleteUploadBtn.dataset.bound) {
        deleteUploadBtn.addEventListener('click', () => deleteUploadInput.click())
        deleteUploadInput.addEventListener('change', handleViewInventoryDeleteExcelUpload)
        deleteUploadBtn.dataset.bound = '1'
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
        '../controllers/fetchinventoryview.php',
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

    let request = await httpRequest2('../controllers/fetchinventoryview.php', getparamm(), null, 'json')
    if(request.status) {
        const items = normalizeViewInventoryItems(normalizeInventoryItems(request.data))
        if(items[0]) populateData(items[0], ['imageurl'])
        return
    }
    return notification('No records retrieved')
}

async function deleteViewInventoryItem(itemid) {
    function getparamm() {
        let paramstr = new FormData()
        paramstr.append('itemid', itemid)
        return paramstr
    }

    return await httpRequest2('../controllers/removeitem', getparamm(), null, 'json')
}

async function deleteViewInventoryExcelItem(itemid, salespoint = '') {
    const payload = new FormData()
    payload.append('itemid', String(itemid || '').trim())
    if (String(salespoint || '').trim()) payload.append('salespoint', String(salespoint || '').trim())
    return await httpRequest2('../controllers/removeitem', payload, null, 'json')
}

async function removeviewinventory(id) {
    const confirmed = window.confirm('Are you sure you want to remove this item?')
    if (!confirmed) return

    let request = await deleteViewInventoryItem(id)
    await viewinventoryFormSubmitHandler()
    return notification(request?.message || 'No records retrieved', request?.status ? 1 : 0)
}

async function onviewinventoryTableDataSignal() {
    let currentSalespoint = ''
    const rows = (getSignaledDatasource() || []).map((item) => {
        const itemId = encodeURIComponent(String(item?.itemid ?? ''))
        const composite = String(item?.composite || 'NO').toUpperCase()
        const compositeColor = composite === 'YES' ? '#16a34a' : '#64748b'
        const salespoint = String(item.salespoint || 'Unassigned').trim() || 'Unassigned'
        const groupRow = salespoint !== currentSalespoint
            ? `<tr class="bg-slate-100"><td colspan="17" class="font-bold text-left uppercase tracking-wide text-slate-700">${safeText(salespoint)}</td></tr>`
            : ''
        currentSalespoint = salespoint

        return `${groupRow}
            <tr>
                <td>${item.index + 1}</td>
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
        renderViewInventoryDepartmentSelection(getViewInventoryItemDepartments(itemid))
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
    const selectedDepartments = getSelectedViewInventoryDepartments()
    if (!selectedDepartments.length) {
        return notification('Select at least one department for this item', 0)
    }
    const payload = getFormData2(
        document.querySelector('#viewinventoryeditform'),
        viewinventoryid ? [['itemid', viewinventoryid],['photofilename', showFileName('imageurl')],['userphotoname', getFile('imageurl')], ['salespoint', selectedDepartments.join('|')]] : null
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
        'Sales Point': item?.salespoint || '',
        'Item Type': item?.itemtype || ''
    }))
}

function buildViewInventoryUniqueExcelRows(items = []) {
    const grouped = new Map()
    ;(items || []).forEach((item) => {
        const itemid = String(item?.itemid || '').trim()
        if (!itemid) return
        if (!grouped.has(itemid)) {
            grouped.set(itemid, {
                itemid,
                itemname: String(item?.itemname || '').trim(),
                itemtype: String(item?.itemtype || '').trim(),
                departments: new Set()
            })
        }
        const record = grouped.get(itemid)
        if (!record.itemname && item?.itemname) record.itemname = String(item.itemname).trim()
        if (!record.itemtype && item?.itemtype) record.itemtype = String(item.itemtype).trim()
        const salespoint = String(item?.salespoint || '').trim()
        if (salespoint) record.departments.add(salespoint)
    })

    return Array.from(grouped.values()).map((record) => ({
        'Item ID': record.itemid,
        'Item Name': record.itemname,
        'Item Type': record.itemtype,
        'Departments': Array.from(record.departments).join(', ')
    }))
}

async function exportViewInventoryRowsWithDropdown(rows, sheetName, fileName) {
    const ok = await ensureExcelJsLoadedViewInventory()
    if (!ok) return notification('Could not load Excel helper. Check your connection.', 0)

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(sheetName)
    const hasDepartments = rows.some(row => row && Object.prototype.hasOwnProperty.call(row, 'Departments'))
    worksheet.columns = [
        { header: 'Item ID', key: 'itemid', width: 18 },
        { header: 'Item Name', key: 'itemname', width: 40 },
        { header: 'Item Type', key: 'itemtype', width: 22 },
        ...(hasDepartments ? [{ header: 'Departments', key: 'departments', width: 40 }] : [])
    ]

    rows.forEach(row => worksheet.addRow({
        itemid: row['Item ID'] || '',
        itemname: row['Item Name'] || '',
        itemtype: row['Item Type'] || '',
        departments: row['Departments'] || ''
    }))

    const maxRow = Math.max(rows.length + 1, 2)
    const itemTypeColumnIndex = worksheet.columns.findIndex(col => col.key === 'itemtype') + 1
    const itemTypeColumnLetter = String.fromCharCode(64 + itemTypeColumnIndex)
    for (let rowIndex = 2; rowIndex <= maxRow; rowIndex++) {
        worksheet.getCell(`${itemTypeColumnLetter}${rowIndex}`).dataValidation = {
            type: 'list',
            allowBlank: true,
            showErrorMessage: true,
            errorTitle: 'Invalid Item Type',
            error: 'Select one of: FOOD, ALCOHOL, NON-ALCOHOL, MISCELLANEOUS, SERVICE',
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
    const rows = buildViewInventoryUniqueExcelRows(viewinventoryItems)
    return exportViewInventoryRowsWithDropdown(rows, 'Inventory_All', 'view_inventory_all.xlsx')
}

function mapViewInventoryImportHeaders(rawRow = {}) {
    const mapped = {}
    Object.keys(rawRow || {}).forEach(key => {
        const normalizedKey = String(key || '').trim().toLowerCase()
        const value = rawRow[key]
        if (normalizedKey === 'item id' || normalizedKey === 'itemid') mapped.itemid = value
        if (normalizedKey === 'sales point' || normalizedKey === 'salespoint') mapped.salespoint = value
        if (normalizedKey === 'departments' || normalizedKey === 'department') mapped.departments = value
        if (normalizedKey === 'item type' || normalizedKey === 'itemtype') mapped.itemtype = value
    })
    return mapped
}

function mapViewInventoryDeleteHeaders(rawRow = {}) {
    const mapped = {}
    Object.keys(rawRow || {}).forEach(key => {
        const normalizedKey = String(key || '').trim().toLowerCase()
        const value = rawRow[key]
        if (normalizedKey === 'delete item id' || normalizedKey === 'item id' || normalizedKey === 'itemid') mapped.itemid = value
        if (normalizedKey === 'item name' || normalizedKey === 'itemname') mapped.itemname = value
        if (normalizedKey === 'sales point' || normalizedKey === 'salespoint' || normalizedKey === 'department') mapped.salespoint = value
        if (normalizedKey === 'original row' || normalizedKey === 'row') mapped.originalrow = value
    })
    return mapped
}

function normalizeViewInventoryItemType(value) {
    const normalized = String(value || '').trim().toUpperCase()
    if (!normalized) return ''
    return viewInventoryAllowedItemTypes.find(item => item === normalized) || ''
}

function normalizeViewInventorySalesPoint(value) {
    return String(value || '').trim().toLowerCase()
}

function parseViewInventoryDepartments(value) {
    return String(value || '')
        .split(/[|,]/)
        .map(part => normalizeViewInventorySalesPoint(part))
        .filter(Boolean)
}

async function updateViewInventoryRow(sourceItem, overrides = {}) {
    const payload = new FormData()
    payload.append('itemid', sourceItem?.itemid || '')
    payload.append('itemname', overrides.itemname ?? (sourceItem?.itemname || ''))
    payload.append('units', overrides.units ?? (sourceItem?.units || ''))
    payload.append('cost', overrides.cost ?? (sourceItem?.cost || ''))
    payload.append('price', overrides.price ?? (sourceItem?.price || ''))
    payload.append('price_two', overrides.price_two ?? (sourceItem?.price_two || ''))
    payload.append('beginbalance', overrides.beginbalance ?? (sourceItem?.beginbalance || ''))
    payload.append('minbalance', overrides.minbalance ?? (sourceItem?.minbalance || ''))
    payload.append('groupname', overrides.groupname ?? (sourceItem?.groupname || ''))
    payload.append('applyto', overrides.applyto ?? (sourceItem?.applyto || ''))
    payload.append('reorderlevel', overrides.reorderlevel ?? (sourceItem?.reorderlevel || ''))
    payload.append('composite', overrides.composite ?? (sourceItem?.composite || 'NO'))
    payload.append('description', overrides.description ?? (sourceItem?.description || ''))
    payload.append('itemtype', overrides.itemtype ?? (sourceItem?.itemtype || ''))
    payload.append('salespoint', overrides.salespoint ?? (sourceItem?.salespoint || ''))
    return await httpRequest2('../controllers/editinventory', payload, null, 'json')
}

async function handleViewInventoryExcelUpload(event) {
    const input = event?.target
    const uploadBtn = did('viewinventory-upload-excel-btn')
    const statusBox = did('viewinventory-upload-status')
    const file = input?.files?.[0]
    if (!file) return

    const ok = await ensureXLSXLoadedViewInventory()
    if (!ok) {
        input.value = ''
        return notification('Could not load Excel helper. Check your connection.', 0)
    }

    if (uploadBtn) uploadBtn.disabled = true
    let updated = 0
    let skipped = 0
    let failed = 0
    const failures = []

    const setStatus = (message, tone = 'violet') => {
        if (!statusBox) return
        const palette = {
            violet: 'border-violet-200 bg-violet-50 text-violet-900',
            emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
            amber: 'border-amber-200 bg-amber-50 text-amber-900',
            rose: 'border-rose-200 bg-rose-50 text-rose-900'
        }
        statusBox.className = `mb-4 rounded-md px-4 py-3 text-sm ${palette[tone] || palette.violet}`
        statusBox.classList.remove('hidden')
        statusBox.innerHTML = message
    }

    try {
        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' })
        if (!rawRows.length) {
            return notification('No rows found in uploaded Excel', 0)
        }

        setStatus(`Preparing department update run for ${rawRows.length} row(s)...`)

        for (let i = 0; i < rawRows.length; i++) {
            const row = mapViewInventoryImportHeaders(rawRows[i])
            const itemid = String(row.itemid || '').trim()
            const departments = parseViewInventoryDepartmentList(row.departments || row.salespoint || '')
            if (!itemid) {
                skipped++
                setStatus(`Processing ${i + 1}/${rawRows.length} ... skipped blank Item ID row`, 'amber')
                continue
            }
            if (!departments.length) {
                skipped++
                setStatus(`Processing ${i + 1}/${rawRows.length} ... skipped Item ID ${safeText(itemid)} because no valid departments were found`, 'amber')
                continue
            }

            let sourceItem = viewinventoryItems.find(item => String(item?.itemid || '').trim() === itemid)
            if (!sourceItem) {
                skipped++
                setStatus(`Processing ${i + 1}/${rawRows.length} ... skipped Item ID ${safeText(itemid)} because it is not loaded in the table`, 'amber')
                continue
            }

            setStatus(`Updating ${i + 1}/${rawRows.length}: Item ID ${safeText(itemid)} with ${departments.length} department(s)`)
            const request = await updateViewInventoryRow(sourceItem, {
                itemtype: sourceItem?.itemtype || '',
                salespoint: departments.join('|')
            })
            if (request?.status) {
                updated++
            } else {
                failed++
                failures.push(`Item ID ${itemid}: ${request?.message || 'Department update failed'}`)
            }
        }

        await viewinventoryFormSubmitHandler()
        const summaryMessage = `Department update completed. Updated: ${updated}, Skipped: ${skipped}, Failed: ${failed}`
        if (failed) {
            setStatus(`${summaryMessage}<br><br>${failures.map(item => safeText(item)).join('<br>')}`, 'rose')
        } else {
            setStatus(summaryMessage, updated ? 'emerald' : 'amber')
        }
        return notification(summaryMessage, failed ? 0 : 1)
    } catch (error) {
        console.log(error)
        setStatus('Unable to process uploaded Excel file for department update run', 'rose')
        return notification('Unable to process uploaded Excel file', 0)
    } finally {
        if (uploadBtn) uploadBtn.disabled = false
        if (input) input.value = ''
    }
}

async function handleViewInventoryDeleteExcelUpload(event) {
    const input = event?.target
    const uploadBtn = did('viewinventory-delete-excel-btn')
    const statusBox = did('viewinventory-upload-status')
    const file = input?.files?.[0]
    if (!file) return

    const ok = await ensureXLSXLoadedViewInventory()
    if (!ok) {
        input.value = ''
        return notification('Could not load Excel helper. Check your connection.', 0)
    }

    const setStatus = (message, tone = 'rose') => {
        if (!statusBox) return
        const palette = {
            violet: 'border-violet-200 bg-violet-50 text-violet-900',
            emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
            amber: 'border-amber-200 bg-amber-50 text-amber-900',
            rose: 'border-rose-200 bg-rose-50 text-rose-900'
        }
        statusBox.className = `mb-4 rounded-md px-4 py-3 text-sm ${palette[tone] || palette.rose}`
        statusBox.classList.remove('hidden')
        statusBox.innerHTML = message
    }

    if (uploadBtn) uploadBtn.disabled = true
    let deleted = 0
    let failed = 0
    const failures = []

    try {
        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' })
        if (!rawRows.length) {
            setStatus('No rows found in uploaded Excel', 'amber')
            return notification('No rows found in uploaded Excel', 0)
        }

        const uniqueRows = []
        const seen = new Set()
        rawRows.forEach(rawRow => {
            const row = mapViewInventoryDeleteHeaders(rawRow)
            const itemid = String(row.itemid || '').trim()
            const salespoint = String(row.salespoint || '').trim()
            if (!itemid) return
            const dedupeKey = `${itemid}||${salespoint}`
            if (seen.has(dedupeKey)) return
            seen.add(dedupeKey)
            uniqueRows.push({
                itemid,
                itemname: String(row.itemname || '').trim(),
                salespoint
            })
        })

        if (!uniqueRows.length) {
            setStatus('No valid delete rows found. Ensure the Excel contains Delete Item ID or Item ID.', 'amber')
            return notification('No valid delete rows found in Excel', 0)
        }

        setStatus(`Preparing delete run for ${uniqueRows.length} row(s)...`)

        for (let i = 0; i < uniqueRows.length; i++) {
            const row = uniqueRows[i]
            const label = row.itemname || row.itemid
            const suffix = row.salespoint ? ` from ${safeText(row.salespoint)}` : ''
            setStatus(`Deleting ${i + 1}/${uniqueRows.length}: ${safeText(label)}${suffix}`)
            const request = await deleteViewInventoryExcelItem(row.itemid, row.salespoint)
            if (request?.status) {
                deleted++
            } else {
                failed++
                failures.push(`Item ID ${row.itemid}${row.salespoint ? ` / ${row.salespoint}` : ''}: ${request?.message || 'Delete failed'}`)
            }
        }

        await viewinventoryFormSubmitHandler()
        const summaryMessage = `Delete import completed. Deleted: ${deleted}, Failed: ${failed}`
        if (failed) {
            setStatus(`${summaryMessage}<br><br>${failures.map(item => safeText(item)).join('<br>')}`, 'rose')
        } else {
            setStatus(summaryMessage, deleted ? 'emerald' : 'amber')
        }
        return notification(summaryMessage, failed ? 0 : 1)
    } catch (error) {
        console.log(error)
        setStatus('Unable to process uploaded Excel file for delete run', 'rose')
        return notification('Unable to process uploaded Excel file', 0)
    } finally {
        if (uploadBtn) uploadBtn.disabled = false
        if (input) input.value = ''
    }
}
