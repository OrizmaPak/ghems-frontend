let approvepurchaseorderid = ''
let approvePurchaseOrderRows = {
    UNAPPROVED: [],
    APPROVED: [],
    DECLINED: []
}

function normalizeApprovePoRows(data = [], fallbackStatus = '') {
    const rows = Array.isArray(data) ? data : []
    const grouped = {}
    rows.forEach((item) => {
        const batchid = item.batchid || item.id || item.reference
        if (!batchid) return
        if (!grouped[batchid]) {
            grouped[batchid] = {
                id: String(batchid),
                transactiondate: item.transactiondate || item.tlog || '',
                reference: item.reference || '',
                supplier: item.suppliername || item.ownername || '',
                location: item.locationname || item.salespoint || '',
                status: String(item.status || item.approvalstatus || fallbackStatus || '').toUpperCase(),
                items: []
            }
        }
        grouped[batchid].items.push({
            itemname: item.itemname || '-',
            qty: Number(item.qty || 0),
            cost: Number(item.cost || 0)
        })
    })
    return Object.values(grouped)
}

function getApprovePurchaseOrderGrandTotal(row) {
    return (row.items || []).reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.cost || 0)), 0)
}

function renderApprovePurchaseOrderRows(rows = [], tableId = '', includeChecks = false) {
    const holder = did(tableId)
    if(!holder) return

    if(!rows.length) {
        holder.innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">Table is empty</td></tr>`
        return
    }

    holder.innerHTML = rows.map((row, idx) => {
        const total = getApprovePurchaseOrderGrandTotal(row)
        const actionButtons = includeChecks
            ? `<div class="flex items-center justify-center gap-2">
                    <button title="View" type="button" onclick="openApprovePurchaseOrderModal('${String(row.id).replace(/'/g, "\\'")}', 'UNAPPROVED')" class="material-symbols-outlined rounded-full bg-green-500 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
               </div>`
            : `<div class="flex items-center justify-center gap-2">
                    <button title="View" type="button" onclick="openApprovePurchaseOrderModal('${String(row.id).replace(/'/g, "\\'")}', '${String(row.status || '').toUpperCase()}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
               </div>`

        return `
            <tr>
                <td>${idx + 1}</td>
                ${includeChecks ? `<td><input type="checkbox" class="apo_row_check" data-id="${row.id}" /></td>` : ''}
                <td>${row.transactiondate ? specialformatDateTime(row.transactiondate) : '-'}</td>
                <td>${row.reference || '-'}</td>
                <td>${row.supplier || '-'}</td>
                <td>${row.items.length}</td>
                <td>${formatNumber(total)}</td>
                <td>${row.location || '-'}</td>
                ${includeChecks ? '' : `<td>${row.status || '-'}</td>`}
                <td>${actionButtons}</td>
            </tr>
        `
    }).join('')
}

function setAllApprovePurchaseOrderChecks(checked) {
    document.querySelectorAll('.apo_row_check').forEach((el) => {
        el.checked = !!checked
    })
}

function getSelectedApprovePurchaseOrderIds() {
    return Array.from(document.querySelectorAll('.apo_row_check:checked')).map((el) => String(el.dataset.id || '').trim()).filter(Boolean)
}

function buildDatePayload(startId, endId) {
    const startdate = String(did(startId)?.value || '').trim()
    const enddate = String(did(endId)?.value || '').trim()
    const payload = new FormData()
    if (startdate) payload.append('startdate', startdate)
    if (enddate) payload.append('enddate', enddate)
    return payload
}

async function fetchPendingApprovalOrders() {
    const payload = buildDatePayload('apo_unapproved_startdate', 'apo_unapproved_enddate')
    const request = await httpRequest2('../controllers/fetchpopendingapproval.php', payload, did('apo_unapproved_filter_btn'), 'json')
    if (!request.status) {
        renderApprovePurchaseOrderRows([], 'apo_unapproved_tabledata', true)
        return notification(request.message || 'No records retrieved', 0)
    }
    approvePurchaseOrderRows.UNAPPROVED = normalizeApprovePoRows(request.data, 'UNAPPROVED')
    renderApprovePurchaseOrderRows(approvePurchaseOrderRows.UNAPPROVED, 'apo_unapproved_tabledata', true)
    if(did('apo_check_all')) did('apo_check_all').checked = false
}

async function fetchApprovedOrders() {
    const payload = buildDatePayload('apo_approved_startdate', 'apo_approved_enddate')
    const request = await httpRequest2('../controllers/fetchapprovedpo.php', payload, did('apo_approved_filter_btn'), 'json')
    if (!request.status) {
        renderApprovePurchaseOrderRows([], 'apo_approved_tabledata', false)
        return notification(request.message || 'No records retrieved', 0)
    }
    approvePurchaseOrderRows.APPROVED = normalizeApprovePoRows(request.data, 'APPROVED')
    renderApprovePurchaseOrderRows(approvePurchaseOrderRows.APPROVED, 'apo_approved_tabledata', false)
}

function fetchDeclinedOrders() {
    renderApprovePurchaseOrderRows(approvePurchaseOrderRows.DECLINED, 'apo_declined_tabledata', false)
    notification('Declined orders controller not wired yet', 0)
}

function clearFilterInputs(prefix) {
    if (did(`${prefix}_startdate`)) did(`${prefix}_startdate`).value = ''
    if (did(`${prefix}_enddate`)) did(`${prefix}_enddate`).value = ''
}

function findApprovePoRowByIdAndScope(id = '', scope = 'UNAPPROVED') {
    const rows = approvePurchaseOrderRows[String(scope || '').toUpperCase()] || []
    return rows.find((item) => String(item.id) === String(id))
}

function openApprovePurchaseOrderModal(id = '', scope = 'UNAPPROVED') {
    const row = findApprovePoRowByIdAndScope(id, scope)
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

async function approvePurchaseOrderIds(ids = []) {
    if(!ids.length) return false
    const payload = new FormData()
    payload.append('rowsize', ids.length)
    ids.forEach((id, idx) => payload.append(`id${idx + 1}`, id))
    const request = await httpRequest2('../controllers/approvepo.php', payload, null, 'json')
    if(!request.status) {
        notification(request.message || 'Approval failed', 0)
        return false
    }
    return true
}

async function approvePurchaseOrderModalAction(status = 'APPROVED') {
    const id = String(approvepurchaseorderid || '').trim()
    if(!id) return
    if(String(status).toUpperCase() !== 'APPROVED') {
        return notification('Decline controller not wired yet', 0)
    }
    const ok = await approvePurchaseOrderIds([id])
    if(!ok) return
    did('approvepurchaseordermodal').classList.add('hidden')
    notification('Purchase order approved successfully', 1)
    await fetchPendingApprovalOrders()
    await fetchApprovedOrders()
}

async function approveSelectedPurchaseOrders() {
    const ids = getSelectedApprovePurchaseOrderIds()
    if(!ids.length) return notification('No purchase order selected', 0)
    const ok = await approvePurchaseOrderIds(ids)
    if(!ok) return
    notification('Selected purchase orders approved', 1)
    await fetchPendingApprovalOrders()
    await fetchApprovedOrders()
}

function declineSelectedPurchaseOrders() {
    notification('Decline controller not wired yet', 0)
}

async function approvepurchaseorderActive() {
    if(did('apo_check_all')) {
        did('apo_check_all').addEventListener('change', (e) => {
            setAllApprovePurchaseOrderChecks(!!e.target.checked)
        })
    }
    if(did('apo_check_selected')) did('apo_check_selected').addEventListener('click', () => setAllApprovePurchaseOrderChecks(true))
    if(did('apo_uncheck_selected')) did('apo_uncheck_selected').addEventListener('click', () => setAllApprovePurchaseOrderChecks(false))
    if(did('apo_bulk_approve')) did('apo_bulk_approve').addEventListener('click', approveSelectedPurchaseOrders)
    if(did('apo_bulk_decline')) did('apo_bulk_decline').addEventListener('click', declineSelectedPurchaseOrders)

    if(did('apo_unapproved_filter_btn')) did('apo_unapproved_filter_btn').addEventListener('click', fetchPendingApprovalOrders)
    if(did('apo_unapproved_clear_btn')) did('apo_unapproved_clear_btn').addEventListener('click', async () => {
        clearFilterInputs('apo_unapproved')
        await fetchPendingApprovalOrders()
    })

    if(did('apo_approved_filter_btn')) did('apo_approved_filter_btn').addEventListener('click', fetchApprovedOrders)
    if(did('apo_approved_clear_btn')) did('apo_approved_clear_btn').addEventListener('click', async () => {
        clearFilterInputs('apo_approved')
        await fetchApprovedOrders()
    })

    if(did('apo_declined_filter_btn')) did('apo_declined_filter_btn').addEventListener('click', fetchDeclinedOrders)
    if(did('apo_declined_clear_btn')) did('apo_declined_clear_btn').addEventListener('click', () => {
        clearFilterInputs('apo_declined')
        fetchDeclinedOrders()
    })

    await fetchPendingApprovalOrders()
    await fetchApprovedOrders()
    renderApprovePurchaseOrderRows([], 'apo_declined_tabledata', false)
}
