let orderid = ''
let orderCanDelete = false

async function orderActive() {
    const orderForm = document.querySelector('#orderform')
    const viewForm = document.querySelector('#orderviewform')

    if (orderForm?.querySelector('#submit')) {
        orderForm.querySelector('#submit').addEventListener('click', orderFormSubmitHandler)
    }
    if (viewForm?.querySelector('#submitvieworder')) {
        viewForm.querySelector('#submitvieworder').addEventListener('click', () => fetchorders())
    }

    datasource = []
    orderCanDelete = await userCanDeleteOrder()
    await fetchorders()
}

async function userCanDeleteOrder() {
    if (currentUserIsSuperAdmin()) return true
    const profile = await fetchCurrentUserProfileCached()
    if (!profile?.status) return false
    return profile.grantedPermissions?.has('DELETE ORDER')
}

function validateOrderParties() {
    const roomnumber = String(did('roomnumber')?.value || '').trim()
    const applyto = String(did('applyto')?.value || '').trim()
    if (!roomnumber && !applyto) {
        notification('Room number and apply to cannot be empty at the same time', 0)
        return false
    }
    return true
}

function normalizeOrderRows(data) {
    if (Array.isArray(data)) return data
    if (data && typeof data === 'object') return [data]
    return []
}

function getOrderDate(row = {}) {
    return row.transactiondate || row.created_at || row.entrydate || row.datecreated || ''
}

function getOrderReference(row = {}) {
    return row.reference || row.ref || row.orderref || row.id || ''
}

function populateOrderForm(row = {}) {
    orderid = row.id || row.reference || ''
    if (did('roomnumber')) did('roomnumber').value = row.roomnumber || ''
    if (did('applyto')) did('applyto').value = row.applyto || ''
    if (did('description')) did('description').value = row.description || ''
}

async function fetchorders(id = '') {
    const payload = new FormData()
    const searchReference = String(did('orderreference')?.value || '').trim()
    const shouldUseId = id || searchReference

    if (shouldUseId) {
        payload.append('id', id || searchReference)
    } else {
        const startdate = String(did('startdate')?.value || '').trim()
        const enddate = String(did('enddate')?.value || '').trim()
        if (startdate) payload.append('startdate', startdate)
        if (enddate) payload.append('enddate', enddate)
    }

    const request = await httpRequest2(
        '../controllers/fetchorder.php',
        payload,
        did('submitvieworder'),
        'json'
    )

    if (!id && did('tabledata')) did('tabledata').innerHTML = 'No records retrieved'

    if (request?.status) {
        const rows = normalizeOrderRows(request.data)
        if (id) {
            if (!rows.length) return notification('No records retrieved', 0)
            populateOrderForm(rows[0])
            runoptioner(did('order_updater_tab'))
            return
        }
        datasource = rows
        return resolvePagination(datasource, onorderTableDataSignal)
    }

    return notification(request?.message || 'No records retrieved', 0)
}

async function removeorder(id) {
    if (!orderCanDelete) return notification('You do not have permission to delete order', 0)
    if (!id) return
    const confirmed = window.confirm('Are you sure you want to remove this order?')
    if (!confirmed) return

    const payload = new FormData()
    payload.append('id', id)
    const request = await httpRequest2('../controllers/removeorder.php', payload, null, 'json')
    notification(request?.message || 'Request processed', request?.status ? 1 : 0)
    await fetchorders()
}

async function onorderTableDataSignal() {
    const rows = getSignaledDatasource()
        .map((item, index) => {
            const reference = String(getOrderReference(item))
            const identifier = String(item.id || reference || '')
            const safeIdentifier = identifier.replace(/'/g, "\\'")
            const dated = getOrderDate(item)
            const rowDate = dated ? specialformatDateTime(dated) : '-'
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${rowDate}</td>
                    <td>${reference || '-'}</td>
                    <td>${item.roomnumber || '-'}</td>
                    <td>${item.applyto || '-'}</td>
                    <td>${item.description || '-'}</td>
                    <td class="flex items-center gap-3">
                        <button title="Retrieve" type="button" onclick="fetchorders('${safeIdentifier}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs">download</button>
                        <button title="Delete" type="button" onclick="removeorder('${safeIdentifier}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs ${orderCanDelete ? '' : 'hidden'}">delete</button>
                    </td>
                </tr>
            `
        })
        .join('')
    injectPaginatatedTable(rows)
}

async function orderFormSubmitHandler() {
    if (!validateForm('orderform', ['description'])) return
    if (!validateOrderParties()) return

    const additional = []
    if (orderid) additional.unshift(['id', orderid])

    const payload = getFormData2(document.querySelector('#orderform'), additional)
    const request = await httpRequest2('../controllers/postorder.php', payload, did('submit'), 'json')

    if (request?.status) {
        notification('Order saved successfully!', 1)
        orderid = ''
        document.querySelector('#orderform')?.reset()
        runoptioner(did('order_viewer_tab'))
        await fetchorders()
        return
    }

    notification(request?.message || 'Unable to save order', 0)
}
