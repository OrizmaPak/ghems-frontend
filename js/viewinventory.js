let viewinventoryid
let viewinventoryItems = []
let viewInventoryFilterTimer

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
        composite: item?.composite || 'NO'
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
