let approvepurchaseorderid = ''
let approvePurchaseOrderRows = []

function createApprovePurchaseOrderMockRows() {
    return [
        {
            id: 'PO-AP-001',
            transactiondate: '2026-05-01 10:15:00',
            reference: 'PO-2026-001',
            supplier: 'Apex Beverages Ltd',
            location: 'Main Store',
            status: 'UNAPPROVED',
            items: [
                { itemname: 'Blue Hawaii', qty: 20, cost: 8000 },
                { itemname: 'Bacardi Silver', qty: 10, cost: 12000 }
            ]
        },
        {
            id: 'PO-AP-002',
            transactiondate: '2026-05-01 14:05:00',
            reference: 'PO-2026-002',
            supplier: 'Green Farms Supplies',
            location: 'Kitchen Store',
            status: 'UNAPPROVED',
            items: [
                { itemname: 'Frozen Chicken', qty: 15, cost: 14500 },
                { itemname: 'Vegetable Oil', qty: 8, cost: 18000 },
                { itemname: 'Rice 50kg', qty: 6, cost: 55000 }
            ]
        },
        {
            id: 'PO-AP-003',
            transactiondate: '2026-04-29 09:20:00',
            reference: 'PO-2026-003',
            supplier: 'Metro Hospitality',
            location: 'Bar Store',
            status: 'APPROVED',
            items: [
                { itemname: 'Cocktail Syrup', qty: 25, cost: 4500 }
            ]
        },
        {
            id: 'PO-AP-004',
            transactiondate: '2026-04-28 16:30:00',
            reference: 'PO-2026-004',
            supplier: 'Prime Foods',
            location: 'Main Store',
            status: 'DECLINED',
            items: [
                { itemname: 'Tinned Tomato', qty: 40, cost: 2500 }
            ]
        }
    ]
}

function getApprovePurchaseOrderGrandTotal(row) {
    return (row.items || []).reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.cost || 0)), 0)
}

function getApprovePurchaseOrderRowsByStatus(status) {
    return approvePurchaseOrderRows.filter((row) => row.status === status)
}

function renderApprovePurchaseOrderRows(status, tableId) {
    const rows = getApprovePurchaseOrderRowsByStatus(status)
    const holder = did(tableId)
    if(!holder) return

    if(!rows.length) {
        holder.innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">Table is empty</td></tr>`
        return
    }

    holder.innerHTML = rows.map((row, idx) => {
        const total = getApprovePurchaseOrderGrandTotal(row)
        const actionButtons = status === 'UNAPPROVED'
            ? `<div class="flex items-center justify-center gap-2">
                    <button title="View" type="button" onclick="openApprovePurchaseOrderModal('${String(row.id).replace(/'/g, "\\'")}')" class="material-symbols-outlined rounded-full bg-green-500 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
               </div>`
            : `<div class="flex items-center justify-center gap-2">
                    <button title="View" type="button" onclick="openApprovePurchaseOrderModal('${String(row.id).replace(/'/g, "\\'")}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
               </div>`

        return `
            <tr>
                <td>${idx + 1}</td>
                ${status === 'UNAPPROVED' ? `<td><input type="checkbox" class="apo_row_check" data-id="${row.id}" /></td>` : ''}
                <td>${specialformatDateTime(row.transactiondate)}</td>
                <td>${row.reference}</td>
                <td>${row.supplier}</td>
                <td>${row.items.length}</td>
                <td>${formatNumber(total)}</td>
                <td>${row.location}</td>
                ${status === 'UNAPPROVED' ? '' : `<td>${row.status}</td>`}
                <td>${actionButtons}</td>
            </tr>
        `
    }).join('')
}

function renderApprovePurchaseOrderTables() {
    renderApprovePurchaseOrderRows('UNAPPROVED', 'apo_unapproved_tabledata')
    renderApprovePurchaseOrderRows('APPROVED', 'apo_approved_tabledata')
    renderApprovePurchaseOrderRows('DECLINED', 'apo_declined_tabledata')
    if(did('apo_check_all')) did('apo_check_all').checked = false
}

function setAllApprovePurchaseOrderChecks(checked) {
    document.querySelectorAll('.apo_row_check').forEach((el) => {
        el.checked = !!checked
    })
}

function getSelectedApprovePurchaseOrderIds() {
    return Array.from(document.querySelectorAll('.apo_row_check:checked')).map((el) => String(el.dataset.id || '').trim()).filter(Boolean)
}

function applyApprovePurchaseOrderStatus(ids = [], status = 'APPROVED') {
    if(!ids.length) return
    const idSet = new Set(ids)
    approvePurchaseOrderRows = approvePurchaseOrderRows.map((row) => {
        if(idSet.has(String(row.id))) {
            return { ...row, status }
        }
        return row
    })
    renderApprovePurchaseOrderTables()
}

function openApprovePurchaseOrderModal(id = '') {
    const row = approvePurchaseOrderRows.find((item) => String(item.id) === String(id))
    if(!row) return
    approvepurchaseorderid = row.id

    did('apo_modal_reference').textContent = row.reference || ''
    did('apo_modal_supplier').textContent = row.supplier || ''
    did('apo_modal_location').textContent = row.location || ''
    did('apo_modal_status').textContent = row.status || ''

    did('apo_modal_items').innerHTML = (row.items || []).map((item, idx) => {
        const value = Number(item.qty || 0) * Number(item.cost || 0)
        return `<tr>
            <td>${idx + 1}</td>
            <td>${item.itemname || '-'}</td>
            <td>${formatNumber(item.qty || 0)}</td>
            <td>${formatNumber(item.cost || 0)}</td>
            <td>${formatNumber(value)}</td>
        </tr>`
    }).join('')

    did('approvepurchaseordermodal').classList.remove('hidden')
}

function approvePurchaseOrderModalAction(status = 'APPROVED') {
    const id = String(approvepurchaseorderid || '').trim()
    if(!id) return
    applyApprovePurchaseOrderStatus([id], status)
    did('approvepurchaseordermodal').classList.add('hidden')
    notification(`Purchase order ${status.toLowerCase()} successfully`, 1)
}

async function approvepurchaseorderActive() {
    approvePurchaseOrderRows = createApprovePurchaseOrderMockRows()

    if(did('apo_check_all')) {
        did('apo_check_all').addEventListener('change', (e) => {
            setAllApprovePurchaseOrderChecks(!!e.target.checked)
        })
    }

    if(did('apo_check_selected')) {
        did('apo_check_selected').addEventListener('click', () => setAllApprovePurchaseOrderChecks(true))
    }
    if(did('apo_uncheck_selected')) {
        did('apo_uncheck_selected').addEventListener('click', () => setAllApprovePurchaseOrderChecks(false))
    }

    if(did('apo_bulk_approve')) {
        did('apo_bulk_approve').addEventListener('click', () => {
            const ids = getSelectedApprovePurchaseOrderIds()
            if(!ids.length) return notification('No purchase order selected', 0)
            applyApprovePurchaseOrderStatus(ids, 'APPROVED')
            notification('Selected purchase orders approved', 1)
        })
    }

    if(did('apo_bulk_decline')) {
        did('apo_bulk_decline').addEventListener('click', () => {
            const ids = getSelectedApprovePurchaseOrderIds()
            if(!ids.length) return notification('No purchase order selected', 0)
            applyApprovePurchaseOrderStatus(ids, 'DECLINED')
            notification('Selected purchase orders declined', 1)
        })
    }

    renderApprovePurchaseOrderTables()
}
