let viewreversalid
async function viewreversalActive() {
    if(document.querySelector('#viewreversesalesform #submit')) document.querySelector('#viewreversesalesform #submit').addEventListener('click', fetchviewreversesalesform)
    if(document.querySelector('#viewreversereceiptform #submit')) document.querySelector('#viewreversereceiptform #submit').addEventListener('click', fetchviewreversereceiptform)
    datasource = []
    // Initial load - fetch reversed sales data
    if(document.querySelector('#viewreversesalesform #submit')) {
        document.querySelector('#viewreversesalesform #submit').click()
    }
}


async function fetchviewreversesalesform() {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData(document.getElementById('viewreversesalesform'))
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchreversedsales', getparamm(), document.querySelector('#viewreversesalesform #submit'), 'json')
    document.getElementById('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">Table is empty</td></tr>`
    if(request.status) {
        if(request.data && request.data.length) {
            datasource = request.data
            resolvePagination(datasource, onviewreversalTableDataSignal)
        } else {
            document.getElementById('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No records retrieved</td></tr>`
            return notification(request.message || 'No records retrieved', 0)
        }
    }
    else return notification('No records retrieved')
}

async function fetchviewreversereceiptform() {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData(document.getElementById('viewreversereceiptform'))
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchreversedreceipts', getparamm(), document.querySelector('#viewreversereceiptform #submit'), 'json')
    document.getElementById('tabledata2').innerHTML = `No records retrieved`
    if(request.status) {
                datasource = request.data
                // resolvePagination(datasource, onviewreversalTableDataSignal)
    }
    else return notification('No records retrieved')
}


async function onviewreversalTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1}</td>
        <td>${item.salespoint || ''}</td>
        <td>${item.itemid || ''}</td>
        <td class="font-semibold">${item.itemname || ''}</td>
        <td>${item.qty || '0'}</td>
        <td>${item.description || item.category || ''}</td>
        <td>${item.reference || ''}</td>
        <td class="flex items-center gap-3">
            <button title="View Details" onclick="viewReversedSaleDetails('${item.id}')" class="material-symbols-outlined rounded-full bg-green-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
        </td>
    </tr>`
    )
    .join('')
    // Inject into the main table tbody
    document.getElementById('tabledata').innerHTML = rows
    addPaginationStatus()
    handleActivePageNumber();
    handlePageButtonsStatus()
    initializePaginationMoveButtonsEventListeners()
    sessionStorage.removeItem('p-status')
    sessionStorage.removeItem('p-numbers')
    sessionStorage.removeItem('datasource')
}

function viewReversedSaleDetails(id) {
    const record = Array.isArray(datasource) ? datasource.find(row => String(row.id) === String(id)) : null
    if(!record) return notification('Record not found', 0)

    const setField = (elId, value) => {
        const el = document.getElementById(elId)
        if(el) el.textContent = value ?? ''
    }

    setField('vr-itemname', record.itemname || '')
    setField('vr-itemid', record.itemid || '')
    setField('vr-qty', record.qty || '0')
    setField('vr-issue', record.description || record.category || '')
    setField('vr-reference', record.reference || '')
    setField('vr-salespoint', record.salespoint || '')
    setField('vr-date', record.transactiondate || '')
    setField('vr-paymentmethod', record.paymentmethod || '')
    setField('vr-amountpaid', record.amountpaid || '')
    setField('vr-totalamount', record.totalamount || '')
    setField('vr-owner', record.owner || '')
    setField('vr-location', record.location || '')
    setField('vr-entrypoint', record.entrypoint || '')
    setField('vr-status', record.status || '')
    setField('vr-description', record.description || '')
    setField('vr-bankdetails', record.bankandotherdetails || '')
    setField('vr-tlog', record.tlog || '')

    document.getElementById('viewreversalmodal').classList.remove('hidden')
}
