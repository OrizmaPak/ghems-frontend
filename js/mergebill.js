let mergeBillDatasource = []
let mergeBillSelectedRefs = []
let mergeBillPreviewItems = []
let mergeBillStockByItemId = {}
let mergeBillStockByName = {}

function mergeBillMoney(value = 0) {
    return typeof formatCurrency === 'function' ? formatCurrency(value || 0) : formatNumber(value || 0)
}

function mergeBillLineTotal(item = {}) {
    return Number(item.qty || 0) * Number(item.cost || 0)
}

function mergeBillTotal(items = []) {
    return items.reduce((sum, item) => sum + mergeBillLineTotal(item), 0)
}

function normalizeMergeBillName(value = '') {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ')
}

function getMergeBillStockValue(item = {}) {
    const availableRaw = Number(
        item?.balance ??
        item?.quantity ??
        item?.qty ??
        item?.stockbalance ??
        item?.instock ??
        0
    )
    return Number.isFinite(availableRaw) ? Math.max(availableRaw, 0) : 0
}

function normalizeMergeBillItem(item = {}, index = 0, reference = '') {
    return {
        uid: `${String(item.itemid || item.itemname || 'item')}_${index}_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        itemid: String(item.itemid || '').trim(),
        itemname: String(item.itemname || item.description || '').trim(),
        qty: Number(item.qty || 0),
        cost: Number(item.cost || 0),
        itemtype: item.itemtype || item.type || '',
        units: item.units || item.unit || '',
        sources: reference ? [reference] : []
    }
}

function normalizeMergeBillRows(data = []) {
    if (!Array.isArray(data) || !data.length) return []

    if (data[0]?.saleentry) {
        return data.map((entry) => {
            const saleEntry = entry.saleentry || {}
            const details = Array.isArray(entry.saledetail) ? entry.saledetail : []
            const reference = String(saleEntry.reference || '').trim()
            const total = details.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.cost || 0)), 0)
            return {
                id: saleEntry.id || '',
                batchid: saleEntry.batchid || '',
                reference,
                transactiondate: saleEntry.transactiondate || '',
                salespoint: saleEntry.salespoint || '',
                description: saleEntry.description || (details[0]?.description || ''),
                owner: saleEntry.ownerdetail ?? saleEntry.ownerid ?? saleEntry.owner ?? '',
                applyto: saleEntry.applyto || 'OTHERS',
                ttype: saleEntry.ttype || 'BILL',
                totalamount: Number(saleEntry.totalamount || saleEntry.servicecharge || total || 0),
                items: details.map((item, index) => normalizeMergeBillItem(item, index, reference))
            }
        }).filter((bill) => bill.reference)
    }

    const grouped = {}
    data.forEach((row) => {
        const key = row.batchid || row.reference
        if (!key) return
        if (!grouped[key]) {
            grouped[key] = {
                id: row.id || '',
                batchid: row.batchid || '',
                reference: String(row.reference || '').trim(),
                transactiondate: row.transactiondate || '',
                salespoint: row.salespoint || '',
                description: row.description || '',
                owner: row.ownerdetail ?? row.owner ?? row.ownerid ?? '',
                applyto: row.applyto || 'OTHERS',
                ttype: row.ttype || 'BILL',
                totalamount: Number(row.totalamount || row.servicecharge || 0),
                items: []
            }
        }
        grouped[key].items.push(normalizeMergeBillItem(row, grouped[key].items.length, grouped[key].reference))
    })

    return Object.values(grouped).map((bill) => ({
        ...bill,
        totalamount: bill.totalamount || mergeBillTotal(bill.items)
    })).filter((bill) => bill.reference)
}

function syncMergeBillSalespointOptions() {
    const source = did('salespointname')
    const target = did('mergebill_salespoint')
    if (!source || !target) return
    const options = Array.from(source.options || []).map((opt) => {
        const value = String(opt.value || '').trim()
        if (!value) return ''
        return `<option value="${value.replace(/"/g, '&quot;')}">${opt.textContent || value}</option>`
    }).filter(Boolean).join('')
    target.innerHTML = `<option value="">-- SELECT SALESPOINT --</option>${options}`
    const preferredSalespoint = String(source.value || '').trim()
    if (preferredSalespoint) target.value = preferredSalespoint
}

function bindMergeBillControl(id, eventName, handler) {
    const control = did(id)
    if (!control || control.dataset.mergebillBound === '1') return
    control.addEventListener(eventName, handler)
    control.dataset.mergebillBound = '1'
}

async function mergebillActive() {
    syncMergeBillSalespointOptions()
    bindMergeBillControl('mergebill_fetch', 'click', fetchMergeBills)
    bindMergeBillControl('mergebill_clear', 'click', clearMergeBillFilters)
    bindMergeBillControl('mergebill_salespoint', 'change', fetchMergeBills)
    bindMergeBillControl('mergebill_reset_selection', 'click', resetMergeBillSelection)
    bindMergeBillControl('mergebill_rebuild', 'click', rebuildMergeBillPreview)
    bindMergeBillControl('mergebill_submit', 'click', submitMergeBill)
    bindMergeBillControl('mergebill_reference', 'keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            fetchMergeBills()
        }
    })
    await fetchMergeBills()
}

async function fetchMergeBillStockMap() {
    const salespoint = String(did('mergebill_salespoint')?.value || '').trim()
    mergeBillStockByItemId = {}
    mergeBillStockByName = {}
    if (!salespoint) return false

    const payload = new FormData()
    payload.append('salespoint', salespoint)
    const request = await httpRequest2('../controllers/fetchinventorybysalespoint', payload, null, 'json')
    if (!request.status || !Array.isArray(request.data)) return false

    request.data.forEach((entry) => {
        const itemid = String(entry?.itemid || '').trim()
        const itemname = normalizeMergeBillName(entry?.itemname || '')
        const stock = getMergeBillStockValue(entry)
        if (itemid) mergeBillStockByItemId[itemid] = stock
        if (itemname) mergeBillStockByName[itemname] = stock
    })
    return true
}

async function fetchMergeBills() {
    const payload = new FormData()
    const reference = String(did('mergebill_reference')?.value || '').trim()
    const startdate = String(did('mergebill_startdate')?.value || '').trim()
    const enddate = String(did('mergebill_enddate')?.value || '').trim()
    const salespoint = String(did('mergebill_salespoint')?.value || '').trim()
    if (!salespoint) {
        mergeBillDatasource = []
        mergeBillSelectedRefs = []
        mergeBillPreviewItems = []
        renderMergeBillTable()
        renderMergeBillWorkspace()
        return notification('Select a department/salespoint to fetch merge bills', 0)
    }
    if (reference) payload.append('reference', reference)
    if (startdate) payload.append('startdate', startdate)
    if (enddate) payload.append('enddate', enddate)
    if (salespoint) payload.append('salespoint', salespoint)
    await fetchMergeBillStockMap()

    const request = await httpRequest2('../controllers/fetchsalesbillsonly.php', payload, did('mergebill_fetch'), 'json')
    if (!request.status) {
        mergeBillDatasource = []
        mergeBillSelectedRefs = []
        mergeBillPreviewItems = []
        renderMergeBillTable()
        renderMergeBillWorkspace()
        return notification(request.message || 'No bills retrieved', 0)
    }
    mergeBillDatasource = normalizeMergeBillRows(request.data)
    mergeBillSelectedRefs = mergeBillSelectedRefs.filter((ref) => mergeBillDatasource.some((bill) => bill.reference === ref))
    renderMergeBillTable()
    rebuildMergeBillPreview(false)
}

function clearMergeBillFilters() {
    if (did('mergebill_reference')) did('mergebill_reference').value = ''
    if (did('mergebill_startdate')) did('mergebill_startdate').value = ''
    if (did('mergebill_enddate')) did('mergebill_enddate').value = ''
    if (did('mergebill_salespoint')) did('mergebill_salespoint').value = ''
    mergeBillDatasource = []
    mergeBillSelectedRefs = []
    mergeBillPreviewItems = []
    mergeBillStockByItemId = {}
    mergeBillStockByName = {}
    renderMergeBillTable()
    renderMergeBillWorkspace()
}

function getSelectedMergeBills() {
    return mergeBillSelectedRefs
        .map((ref) => mergeBillDatasource.find((bill) => bill.reference === ref))
        .filter(Boolean)
}

function renderMergeBillTable() {
    const holder = did('mergebill_billtable')
    if (!holder) return
    if (!mergeBillDatasource.length) {
        holder.innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No bills retrieved</td></tr>`
        return
    }
    holder.innerHTML = mergeBillDatasource.map((bill) => {
        const safeRef = String(bill.reference || '').replace(/'/g, "\\'")
        const isSelected = mergeBillSelectedRefs.includes(bill.reference)
        const position = mergeBillSelectedRefs.indexOf(bill.reference)
        const label = position === 0 ? 'Base' : position > 0 ? `Merge ${position + 1}` : ''
        return `
            <tr>
                <td>
                    <label class="inline-flex items-center gap-2">
                        <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleMergeBillSelection('${safeRef}', this.checked)">
                        ${label ? `<span class="text-[10px] font-semibold text-blue-600">${label}</span>` : ''}
                    </label>
                </td>
                <td>${bill.reference || ''}</td>
                <td>${bill.transactiondate ? specialformatDateTime(bill.transactiondate) : ''}</td>
                <td>${bill.salespoint || '-'}</td>
                <td>${mergeBillMoney(bill.totalamount || mergeBillTotal(bill.items))}</td>
            </tr>
        `
    }).join('')
}

function toggleMergeBillSelection(reference = '', checked = false) {
    const ref = String(reference || '').trim()
    if (!ref) return
    if (checked && !mergeBillSelectedRefs.includes(ref)) mergeBillSelectedRefs.push(ref)
    if (!checked) mergeBillSelectedRefs = mergeBillSelectedRefs.filter((item) => item !== ref)
    renderMergeBillTable()
    rebuildMergeBillPreview(false)
}

function resetMergeBillSelection() {
    mergeBillSelectedRefs = []
    mergeBillPreviewItems = []
    renderMergeBillTable()
    renderMergeBillWorkspace()
}

function rebuildMergeBillPreview(showWarning = true) {
    const selectedBills = getSelectedMergeBills()
    mergeBillPreviewItems = []
    selectedBills.forEach((bill) => {
        ;(bill.items || []).forEach((item) => mergeBillItemIntoPreview(item, bill.reference))
    })
    applyMergeBillStockStatus()
    if (showWarning && selectedBills.length < 2) notification('Select at least two bills to merge', 0)
    renderMergeBillWorkspace()
}

function mergeBillItemIntoPreview(sourceItem = {}, reference = '') {
    const qty = Number(sourceItem.qty || 0)
    if (qty <= 0) return
    const sourceItemId = String(sourceItem.itemid || '').trim()
    const sourceName = normalizeMergeBillName(sourceItem.itemname)
    const sourceCost = Number(sourceItem.cost || 0)
    const existing = mergeBillPreviewItems.find((item) => {
        const idMatches = sourceItemId && String(item.itemid || '').trim() === sourceItemId
        const nameMatches = sourceName && normalizeMergeBillName(item.itemname) === sourceName
        return Number(item.cost || 0) === sourceCost && (idMatches || nameMatches)
    })

    if (existing) {
        existing.qty = Number(existing.qty || 0) + qty
        if (reference && !existing.sources.includes(reference)) existing.sources.push(reference)
        return
    }

    mergeBillPreviewItems.push({
        ...sourceItem,
        uid: `${String(sourceItem.itemid || sourceItem.itemname || 'item')}_${mergeBillPreviewItems.length}_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        qty,
        cost: sourceCost,
        sources: reference ? [reference] : [],
        stockavailable: null,
        stockstatus: 'unknown'
    })
}

function resolveMergeBillItemStock(item = {}) {
    const itemid = String(item.itemid || '').trim()
    const itemname = normalizeMergeBillName(item.itemname || '')
    if (itemid && Object.prototype.hasOwnProperty.call(mergeBillStockByItemId, itemid)) {
        return { stockavailable: Number(mergeBillStockByItemId[itemid]), stockstatus: 'ok' }
    }
    if (itemname && Object.prototype.hasOwnProperty.call(mergeBillStockByName, itemname)) {
        return { stockavailable: Number(mergeBillStockByName[itemname]), stockstatus: 'ok' }
    }
    return { stockavailable: null, stockstatus: 'unknown' }
}

function applyMergeBillStockStatus() {
    mergeBillPreviewItems = mergeBillPreviewItems.map((item) => {
        const resolved = resolveMergeBillItemStock(item)
        const qty = Number(item.qty || 0)
        const status = resolved.stockstatus === 'unknown'
            ? 'unknown'
            : (qty > Number(resolved.stockavailable || 0) ? 'exceeds' : 'ok')
        return {
            ...item,
            stockavailable: resolved.stockavailable,
            stockstatus: status
        }
    })
}

function getMergeBillStockViolations() {
    const exceeds = mergeBillPreviewItems.filter((item) => item.stockstatus === 'exceeds')
    const unknown = mergeBillPreviewItems.filter((item) => item.stockstatus === 'unknown')
    return { exceeds, unknown, hasViolations: exceeds.length > 0 || unknown.length > 0 }
}

function renderMergeBillWorkspace() {
    const selectedBills = getSelectedMergeBills()
    const baseBill = selectedBills[0] || null
    if (did('mergebill_selected_count')) did('mergebill_selected_count').textContent = `${selectedBills.length} selected`
    renderMergeBillSelectedTray(selectedBills)

    const hasPreview = selectedBills.length >= 2 && mergeBillPreviewItems.length > 0
    if (did('mergebill_workspace_empty')) did('mergebill_workspace_empty').classList.toggle('hidden', hasPreview)
    if (did('mergebill_workspace')) did('mergebill_workspace').classList.toggle('hidden', !hasPreview)
    if (!hasPreview || !baseBill) return

    did('mergebill_base_reference').textContent = baseBill.reference || ''
    did('mergebill_base_salespoint').textContent = baseBill.salespoint || '-'
    did('mergebill_base_owner').textContent = baseBill.owner || '-'
    did('mergebill_description').textContent = buildMergeBillDescription(selectedBills)
    did('mergebill_total').textContent = mergeBillMoney(mergeBillTotal(mergeBillPreviewItems))
    did('mergebill_item_count').textContent = `${mergeBillPreviewItems.length} line item${mergeBillPreviewItems.length === 1 ? '' : 's'}`
    renderMergeBillStockAlert()
    did('mergebill_items').innerHTML = renderMergeBillPreviewRows()
}

function renderMergeBillStockAlert() {
    const holder = did('mergebill_stock_alert')
    if (!holder) return
    const violations = getMergeBillStockViolations()
    if (!violations.hasViolations) {
        holder.classList.add('hidden')
        holder.innerHTML = ''
        return
    }

    const messages = []
    if (violations.exceeds.length) messages.push(`${violations.exceeds.length} item(s) exceed stock available`)
    if (violations.unknown.length) messages.push(`${violations.unknown.length} item(s) have unknown stock`)
    holder.innerHTML = `<span class="font-semibold">Submit blocked:</span> ${messages.join(' and ')}. Adjust quantities so each line is equal to or below available stock and resolve unknown stock rows.`
    holder.classList.remove('hidden')
}

function renderMergeBillSelectedTray(selectedBills = []) {
    const holder = did('mergebill_selected_tray')
    if (!holder) return
    if (!selectedBills.length) {
        holder.innerHTML = 'Select at least two bills to build a merge preview.'
        return
    }
    holder.innerHTML = selectedBills.map((bill, index) => `
        <span class="mergebill-chip inline-flex items-center gap-2 rounded border px-3 py-2 bg-white">
            <span class="text-[10px] font-bold ${index === 0 ? 'text-blue-600' : 'text-slate-500'}">${index === 0 ? 'BASE' : 'MERGE'}</span>
            <span class="font-semibold">${bill.reference}</span>
            <span class="text-xs text-gray-500">${mergeBillMoney(bill.totalamount || mergeBillTotal(bill.items))}</span>
        </span>
    `).join('')
}

function renderMergeBillPreviewRows() {
    if (!mergeBillPreviewItems.length) return `<tr><td colspan="100%" class="text-center opacity-70">No merged items</td></tr>`
    return mergeBillPreviewItems.map((item) => {
        const safeUid = String(item.uid || '').replace(/'/g, "\\'")
        const isInvalid = item.stockstatus === 'exceeds' || item.stockstatus === 'unknown'
        const stockValue = item.stockstatus === 'unknown' ? 'Unknown' : formatNumber(Number(item.stockavailable || 0))
        const stockHint = item.stockstatus === 'exceeds'
            ? '<p class="text-[10px] text-red-700 font-semibold">Quantity exceeds stock available</p>'
            : item.stockstatus === 'unknown'
                ? '<p class="text-[10px] text-red-700 font-semibold">Stock record not found for this item</p>'
                : ''
        return `
            <tr class="${isInvalid ? 'mergebill-row-invalid' : ''}">
                <td>
                    <div>
                        <p class="font-semibold">${item.itemname || '-'}</p>
                        <p class="text-xs text-gray-500">${item.itemid || ''}</p>
                    </div>
                </td>
                <td>
                    <div class="flex flex-wrap gap-1">
                        ${(item.sources || []).map((source) => `<span class="rounded bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">${source}</span>`).join('')}
                    </div>
                </td>
                <td>
                    <div>
                        <p class="font-semibold">${stockValue}</p>
                        ${stockHint}
                    </div>
                </td>
                <td>${mergeBillMoney(item.cost || 0)}</td>
                <td><input type="number" min="1" value="${Number(item.qty || 0)}" onchange="updateMergeBillItemQty('${safeUid}', this.value)" class="form-control !py-1 !text-sm !min-w-[90px]"></td>
                <td>${mergeBillMoney(mergeBillLineTotal(item))}</td>
                <td><button type="button" title="Remove item" onclick="removeMergeBillItem('${safeUid}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button></td>
            </tr>
        `
    }).join('')
}

function updateMergeBillItemQty(uid = '', value = 0) {
    const item = mergeBillPreviewItems.find((entry) => String(entry.uid) === String(uid))
    if (!item) return
    item.qty = Math.max(1, Number(value || 1))
    applyMergeBillStockStatus()
    renderMergeBillWorkspace()
}

function removeMergeBillItem(uid = '') {
    mergeBillPreviewItems = mergeBillPreviewItems.filter((item) => String(item.uid) !== String(uid))
    applyMergeBillStockStatus()
    renderMergeBillWorkspace()
}

function buildMergeBillDescription(selectedBills = []) {
    const baseBill = selectedBills[0] || {}
    const mergedRefs = selectedBills.slice(1).map((bill) => bill.reference).filter(Boolean).join(', ')
    return [`Merged bills: ${mergedRefs}`, baseBill.description || ''].filter(Boolean).join(' | ')
}

function buildMergeBillPayload(baseBill, selectedBills) {
    const payload = new FormData()
    payload.append('id', baseBill.id || '')
    payload.append('batchid', baseBill.batchid || '')
    payload.append('reference', baseBill.reference || '')
    payload.append('billreferencecode', baseBill.reference || '')
    payload.append('salespoint', baseBill.salespoint || '')
    payload.append('applyto', baseBill.applyto || 'OTHERS')
    payload.append('ownerdetail', baseBill.owner || '-1')
    payload.append('owner', baseBill.owner || '-1')
    payload.append('transactiondate', String(baseBill.transactiondate || new Date().toISOString().slice(0, 10)).slice(0, 10))
    payload.append('description', buildMergeBillDescription(selectedBills))
    payload.append('totalamount', mergeBillTotal(mergeBillPreviewItems))
    payload.append('ttype', 'BILL')
    payload.append('rowsize', mergeBillPreviewItems.length)
    mergeBillPreviewItems.forEach((item, index) => {
        const position = index + 1
        payload.append(`itemname${position}`, item.itemname || '')
        payload.append(`itemid${position}`, item.itemid || '')
        payload.append(`qty${position}`, Number(item.qty || 0))
        payload.append(`cost${position}`, Number(item.cost || 0))
    })
    return payload
}

function validateMergeBillBeforeSubmit(selectedBills = []) {
    if (selectedBills.length < 2) return 'Select at least two bills to merge'
    const baseBill = selectedBills[0]
    if (!baseBill?.id || !baseBill?.batchid) return 'Base bill requires both id and batch id'
    if (!mergeBillPreviewItems.length) return 'Merged bill must contain at least one item'
    const invalidItem = mergeBillPreviewItems.find((item) => !item.itemname || Number(item.qty || 0) <= 0 || Number(item.cost || 0) < 0)
    if (invalidItem) return 'Every merged item requires a valid item, quantity, and price'
    const stockViolations = getMergeBillStockViolations()
    if (stockViolations.exceeds.length) return 'You cannot submit until all quantities are equal to or below stock available'
    if (stockViolations.unknown.length) return 'You cannot submit while some merged items have unknown stock records'
    const missingSourceBatch = selectedBills.slice(1).find((bill) => !bill.batchid)
    if (missingSourceBatch) return `Source bill ${missingSourceBatch.reference || ''} is missing batch id`
    return ''
}

async function submitMergeBill() {
    const selectedBills = getSelectedMergeBills()
    const validationMessage = validateMergeBillBeforeSubmit(selectedBills)
    if (validationMessage) return notification(validationMessage, 0)

    const submitButton = did('mergebill_submit')
    const baseBill = selectedBills[0]
    const updateRequest = await httpRequest2('../controllers/salescript', buildMergeBillPayload(baseBill, selectedBills), submitButton)
    if (!updateRequest.status) return notification(updateRequest.message || 'Unable to update base bill', 0)

    const failedDeletes = []
    for (const bill of selectedBills.slice(1)) {
        const payload = new FormData()
        payload.append('batchid', bill.batchid)
        payload.append('status', 'DELETED')
        const request = await httpRequest2('../controllers/removesalesbill.php', payload, submitButton, 'json')
        if (!request.status) failedDeletes.push(bill.reference || bill.batchid)
    }

    if (failedDeletes.length) {
        notification(`Merged bill saved, but these source bills were not removed: ${failedDeletes.join(', ')}`, 0)
    } else {
        notification('Bills merged successfully', 1)
    }

    mergeBillSelectedRefs = []
    mergeBillPreviewItems = []
    await fetchMergeBills()
    if (typeof fetchsalesbills === 'function') fetchsalesbills()
}
