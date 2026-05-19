let banklistid

async function banklistActive() {
    const form = document.querySelector('#banklistform')
    if (form?.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', banklistFormSubmitHandler)
    datasource = []
    await fetchbankslist()
}

async function fetchbankslist(id = '') {
    function payload() {
        const param = new FormData()
        if (id) param.append('id', id)
        return param
    }

    const request = await httpRequest2('../controllers/fetchbanks.php', id ? payload() : null, null, 'json')
    if (!id) did('tabledata').innerHTML = `No records retrieved`

    if (!request?.status) return notification(request?.message || 'No records retrieved', 0)

    const rows = Array.isArray(request?.data)
        ? request.data
        : (Array.isArray(request?.data?.data) ? request.data.data : [])
    if (!id) {
        datasource = rows
        resolvePagination(datasource, onbanklistTableDataSignal)
        return
    }

    const selected = rows.find(item => String(item?.id) === String(id)) || rows[0]
    if (!selected) return notification('No records retrieved', 0)
    banklistid = selected.id
    populateData(selected)
    const manageTab = document.querySelector('.optioner[name="managebankpanel"]')
    if (manageTab) runoptioner(manageTab)
}

async function onbanklistTableDataSignal() {
    const rows = (getSignaledDatasource() || []).map((item) => `
    <tr>
        <td>${item.index + 1}</td>
        <td>${item.bankname || ''}</td>
        <td>${item.accountnumber || ''}</td>
        <td>${item.address || ''}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchbankslist('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
        </td>
    </tr>`).join('')
    injectPaginatatedTable(rows)
}

async function banklistFormSubmitHandler() {
    if (!validateForm('banklistform', getIdFromCls('comp'))) return

    const payload = getFormData2(document.querySelector('#banklistform'), banklistid ? [['id', banklistid]] : null)
    const request = await httpRequest2('../controllers/banks.php', payload, document.querySelector('#banklistform #submit'))
    if (!request?.status) {
        fetchbankslist()
        return notification(request?.message || 'Unable to save bank', 0)
    }

    notification('Record saved successfully!', 1)
    banklistid = ''
    document.querySelector('#banklistform')?.reset()
    const viewTab = document.querySelector('.optioner[name="viewbankpanel"]')
    if (viewTab) runoptioner(viewTab)
    await fetchbankslist()
}
