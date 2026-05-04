let splitBillDatasource = []
let splitBillActiveBill = null
let splitBillOriginalItems = []
let splitBillNewItems = []

function splitBillMoney(value = 0) {
    return typeof formatCurrency === 'function' ? formatCurrency(value || 0) : formatNumber(value || 0)
}

function splitBillLineTotal(item) {
    return Number(item.qty || 0) * Number(item.cost || 0)
}

function splitBillTotal(items = []) {
    return items.reduce((sum, item) => sum + splitBillLineTotal(item), 0)
}

function normalizeSplitBillRows(data = []) {
    if (!Array.isArray(data) || !data.length) return []

    if (data[0]?.saleentry) {
        return data.map((entry) => {
            const saleEntry = entry.saleentry || {}
            const details = Array.isArray(entry.saledetail) ? entry.saledetail : []
            const total = details.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.cost || 0)), 0)
            return {
                id: saleEntry.id || '',
                batchid: saleEntry.batchid || '',
                reference: String(saleEntry.reference || '').trim(),
                transactiondate: saleEntry.transactiondate || '',
                salespoint: saleEntry.salespoint || '',
                description: saleEntry.description || (details[0]?.description || ''),
                owner: saleEntry.ownerid ?? saleEntry.owner ?? '',
                applyto: saleEntry.applyto || '',
                ttype: saleEntry.ttype || 'BILL',
                totalamount: Number(saleEntry.totalamount || saleEntry.servicecharge || total || 0),
                items: details.map((item, index) => normalizeSplitBillItem(item, index))
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
                owner: row.owner ?? row.ownerid ?? '',
                applyto: row.applyto || '',
                ttype: row.ttype || 'BILL',
                totalamount: Number(row.totalamount || row.servicecharge || 0),
                items: []
            }
        }
        grouped[key].items.push(normalizeSplitBillItem(row, grouped[key].items.length))
    })

    return Object.values(grouped).map((bill) => ({
        ...bill,
        totalamount: bill.totalamount || splitBillTotal(bill.items)
    })).filter((bill) => bill.reference)
}

function normalizeSplitBillItem(item = {}, index = 0) {
    return {
        uid: `${String(item.itemid || item.itemname || 'item')}_${index}_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        itemid: item.itemid || '',
        itemname: item.itemname || item.description || '',
        qty: Number(item.qty || 0),
        cost: Number(item.cost || 0),
        itemtype: item.itemtype || item.type || '',
        units: item.units || item.unit || ''
    }
}

async function splitbillActive() {
    if (did('splitbill_fetch')) did('splitbill_fetch').addEventListener('click', fetchSplitBills)
    if (did('splitbill_clear')) did('splitbill_clear').addEventListener('click', clearSplitBillFilters)
    if (did('splitbill_reset')) did('splitbill_reset').addEventListener('click', resetActiveSplitBill)
    if (did('splitbill_submit')) did('splitbill_submit').addEventListener('click', submitSplitBill)
    if (did('splitbill_reference')) {
        did('splitbill_reference').addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault()
                fetchSplitBills()
            }
        })
    }
    await fetchSplitBills()
}

async function fetchSplitBills() {
    const payload = new FormData()
    const reference = String(did('splitbill_reference')?.value || '').trim()
    const startdate = String(did('splitbill_startdate')?.value || '').trim()
    const enddate = String(did('splitbill_enddate')?.value || '').trim()
    if (reference) payload.append('reference', reference)
    if (startdate) payload.append('startdate', startdate)
    if (enddate) payload.append('enddate', enddate)

    const requestPayload = reference || startdate || enddate ? payload : null
    const request = await httpRequest2('../controllers/fetchsalesbillsonly.php', requestPayload, did('splitbill_fetch'), 'json')
    if (!request.status) {
        splitBillDatasource = []
        renderSplitBillTable()
        return notification(request.message || 'No bills retrieved', 0)
    }
    splitBillDatasource = normalizeSplitBillRows(request.data)
    renderSplitBillTable()
}

function clearSplitBillFilters() {
    if (did('splitbill_reference')) did('splitbill_reference').value = ''
    if (did('splitbill_startdate')) did('splitbill_startdate').value = ''
    if (did('splitbill_enddate')) did('splitbill_enddate').value = ''
    fetchSplitBills()
}

function renderSplitBillTable() {
    const holder = did('splitbill_billtable')
    if (!holder) return
    if (!splitBillDatasource.length) {
        holder.innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No bills retrieved</td></tr>`
        return
    }
    holder.innerHTML = splitBillDatasource.map((bill, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${bill.reference || ''}</td>
            <td>${bill.transactiondate ? specialformatDateTime(bill.transactiondate) : ''}</td>
            <td>${splitBillMoney(bill.totalamount || splitBillTotal(bill.items))}</td>
            <td>
                <button type="button" title="Split Bill" onclick="selectSplitBill('${String(bill.reference || '').replace(/'/g, "\\'")}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">call_split</button>
            </td>
        </tr>
    `).join('')
}

function selectSplitBill(reference = '') {
    const bill = splitBillDatasource.find((item) => String(item.reference) === String(reference))
    if (!bill) return notification('Bill not found', 0)
    splitBillActiveBill = JSON.parse(JSON.stringify(bill))
    splitBillOriginalItems = splitBillActiveBill.items.map((item, index) => ({
        ...item,
        uid: item.uid || `${item.itemid}_${index}`
    })).filter((item) => Number(item.qty || 0) > 0)
    splitBillNewItems = []
    renderSplitBillWorkspace()
}

function resetActiveSplitBill() {
    if (!splitBillActiveBill) return
    selectSplitBill(splitBillActiveBill.reference)
}

function renderSplitBillWorkspace() {
    const hasActive = !!splitBillActiveBill
    if (did('splitbill_workspace_empty')) did('splitbill_workspace_empty').classList.toggle('hidden', hasActive)
    if (did('splitbill_workspace')) did('splitbill_workspace').classList.toggle('hidden', !hasActive)
    if (!hasActive) return

    did('splitbill_active_reference').textContent = splitBillActiveBill.reference || ''
    did('splitbill_active_salespoint').textContent = splitBillActiveBill.salespoint || '-'
    did('splitbill_active_owner').textContent = splitBillActiveBill.owner || '-'
    did('splitbill_active_total').textContent = splitBillMoney(splitBillActiveBill.totalamount || splitBillTotal(splitBillActiveBill.items))
    did('splitbill_active_description').textContent = splitBillActiveBill.description || '-'
    did('splitbill_new_description').textContent = buildSplitBillDescription()
    did('splitbill_original_total').textContent = splitBillMoney(splitBillTotal(splitBillOriginalItems))
    did('splitbill_new_total').textContent = splitBillMoney(splitBillTotal(splitBillNewItems))
    did('splitbill_original_items').innerHTML = renderSplitBillItems(splitBillOriginalItems, 'original')
    did('splitbill_new_items').innerHTML = renderSplitBillItems(splitBillNewItems, 'new')
}

function renderSplitBillItems(items = [], side = 'original') {
    if (!items.length) {
        return `<div class="border border-dashed rounded p-4 text-sm text-gray-500 text-center">No items here</div>`
    }
    return items.map((item) => {
        const safeUid = String(item.uid).replace(/'/g, "\\'")
        const moveAction = side === 'original' ? `moveOriginalItemToSplit('${safeUid}')` : `returnSplitItemToOriginal('${safeUid}')`
        const maxAction = side === 'original' ? `moveOriginalItemToSplit('${safeUid}', true)` : `returnSplitItemToOriginal('${safeUid}', true)`
        const actionIcon = side === 'original' ? 'arrow_forward' : 'arrow_back'
        return `
            <div class="splitbill-item border rounded p-3 bg-white shadow-sm">
                <div class="flex justify-between gap-3">
                    <div>
                        <p class="font-semibold">${item.itemname || '-'}</p>
                        <p class="text-xs text-gray-500">Qty: ${formatNumber(item.qty || 0)} | Price: ${splitBillMoney(item.cost || 0)}</p>
                    </div>
                    <p class="font-semibold text-sm whitespace-nowrap">${splitBillMoney(splitBillLineTotal(item))}</p>
                </div>
                <div class="flex items-center gap-2 mt-3">
                    <input type="number" min="0" max="${item.qty}" value="${item.qty}" id="splitqty_${side}_${safeUid}" class="form-control !py-1 !text-sm" placeholder="Qty">
                    <button type="button" onclick="${moveAction}" title="Move quantity" class="material-symbols-outlined rounded-full bg-blue-500 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">${actionIcon}</button>
                    <button type="button" onclick="${maxAction}" title="Move all" class="rounded border px-3 h-8 text-xs font-semibold">All</button>
                </div>
            </div>
        `
    }).join('')
}

function moveOriginalItemToSplit(uid = '', all = false) {
    moveSplitBillQty(splitBillOriginalItems, splitBillNewItems, uid, 'original', all)
}

function returnSplitItemToOriginal(uid = '', all = false) {
    moveSplitBillQty(splitBillNewItems, splitBillOriginalItems, uid, 'new', all)
}

function moveSplitBillQty(fromItems, toItems, uid, side, all = false) {
    const source = fromItems.find((item) => String(item.uid) === String(uid))
    if (!source) return
    const qtyInput = did(`splitqty_${side}_${uid}`)
    let qty = all ? Number(source.qty || 0) : Number(qtyInput?.value || 0)
    if (qty <= 0) return notification('Enter quantity to move', 0)
    qty = Math.min(qty, Number(source.qty || 0))

    const destination = toItems.find((item) => String(item.itemid || item.itemname) === String(source.itemid || source.itemname) && Number(item.cost || 0) === Number(source.cost || 0))
    if (destination) destination.qty = Number(destination.qty || 0) + qty
    else toItems.push({...source, qty})

    source.qty = Number(source.qty || 0) - qty
    for (let i = fromItems.length - 1; i >= 0; i--) {
        if (Number(fromItems[i].qty || 0) <= 0) fromItems.splice(i, 1)
    }
    renderSplitBillWorkspace()
}

function buildSplitBillDescription() {
    const originalRef = splitBillActiveBill?.reference || ''
    const originalDescription = splitBillActiveBill?.description || ''
    return [`Split from bill ${originalRef}`, originalDescription].filter(Boolean).join(' | ')
}

function buildSplitBillPayload(bill, items, options = {}) {
    const payload = new FormData()
    if (options.id) payload.append('id', options.id)
    payload.append('salespoint', bill.salespoint || '')
    payload.append('applyto', bill.applyto || 'OTHERS')
    payload.append('owner', bill.owner || '-1')
    payload.append('transactiondate', options.transactiondate || String(bill.transactiondate || new Date().toISOString().slice(0, 10)).slice(0, 10))
    payload.append('description', options.description || bill.description || '')
    payload.append('totalamount', splitBillTotal(items))
    payload.append('ttype', 'BILL')
    payload.append('rowsize', items.length)
    if (options.reference) {
        payload.append('reference', options.reference)
        payload.append('billreferencecode', options.reference)
    }
    items.forEach((item, index) => {
        const position = index + 1
        payload.append(`itemname${position}`, item.itemname || '')
        payload.append(`itemid${position}`, item.itemid || '')
        payload.append(`qty${position}`, Number(item.qty || 0))
        payload.append(`cost${position}`, Number(item.cost || 0))
    })
    return payload
}

async function submitSplitBill() {
    if (!splitBillActiveBill) return notification('Select a bill first', 0)
    if (!splitBillNewItems.length) return notification('Move at least one item to the new split bill', 0)
    if (!splitBillOriginalItems.length) return notification('Original bill must retain at least one item', 0)

    const originalId = splitBillActiveBill.id || ''
    if (!originalId) return notification('Selected bill does not have an update id', 0)

    const submitButton = did('splitbill_submit')
    const originalPayload = buildSplitBillPayload(splitBillActiveBill, splitBillOriginalItems, {
        id: originalId,
        reference: splitBillActiveBill.reference,
        description: splitBillActiveBill.description || ''
    })
    const originalRequest = await httpRequest2('../controllers/salescript', originalPayload, submitButton)
    if (!originalRequest.status) return notification(originalRequest.message || 'Unable to update original bill', 0)

    const newPayload = buildSplitBillPayload(splitBillActiveBill, splitBillNewItems, {
        transactiondate: new Date().toISOString().slice(0, 10),
        description: buildSplitBillDescription()
    })
    const newRequest = await httpRequest2('../controllers/salescript', newPayload, submitButton)
    if (!newRequest.status) return notification(newRequest.message || 'Original bill updated, but split bill was not created', 0)

    notification('Bill split successfully', 1)
    splitBillActiveBill = null
    splitBillOriginalItems = []
    splitBillNewItems = []
    renderSplitBillWorkspace()
    await fetchSplitBills()
}
