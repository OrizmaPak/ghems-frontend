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
    document.getElementById('tabledata1').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">Table is empty</td></tr>`
    if(request.status) {
        if(request.data && request.data.length) {
            datasource = request.data
            resolvePagination(datasource, onviewreversalTableDataSignal)
        } else {
            document.getElementById('tabledata1').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No records retrieved</td></tr>`
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
    let request = await httpRequest2('../controllers/fetchreversedreceipt', getparamm(), document.querySelector('#viewreversereceiptform #submit'), 'json')
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
        <td>
            <div class="flex flex-col">
                <p class="font-semibold">${item.itemname || ''}</p>
                <div class="flex justify-end gap-5 text-sm opacity-70">
                    <span>QTY: ${item.qty || '0'}</span>
                    <span>${item.description || item.category || ''}</span>
                </div>
            </div>
        </td>
        <td>${item.reference || ''}</td>
        <td class="flex items-center gap-3">
            <button title="View Details" onclick="viewReversedSaleDetails('${item.id}', '${item.reference || ''}')" class="material-symbols-outlined rounded-full bg-green-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
        </td>
    </tr>`
    )
    .join('')
    // Inject into tabledata1 instead of tabledata
    document.getElementById('tabledata1').innerHTML = rows
    addPaginationStatus()
    handleActivePageNumber();
    handlePageButtonsStatus()
    initializePaginationMoveButtonsEventListeners()
    sessionStorage.removeItem('p-status')
    sessionStorage.removeItem('p-numbers')
    sessionStorage.removeItem('datasource')
}

function viewReversedSaleDetails(id, reference) {
    // You can implement a modal or detail view here if needed
    notification(`Viewing details for reference: ${reference}`, 1)
}
