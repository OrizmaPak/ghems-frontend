let viewreversalid
async function viewreversalActive() {
    if(document.querySelector('#viewreversesalesform #submit')) document.querySelector('#viewreversesalesform #submit').addEventListener('click', fetchviewreversesalesform)
    if(document.querySelector('#viewreversereceiptform #submit')) document.querySelector('#viewreversereceiptform #submit').addEventListener('click', fetchviewreversesalesform)
    datasource = []
    fetchviewreversesalesform();
    fetchviewreversesalesform();
}


async function fetchviewreversesalesform() {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData(document.getElementById('viewreversesalesform'))
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchreversedsales', getparamm(), document.querySelector('#viewreversesalesform #submit'), 'json')
    document.getElementById('tabledata1').innerHTML = `No records retrieved`
    if(request.status) {
                datasource = request.data
                // resolvePagination(datasource, onviewreversalTableDataSignal)
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
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchviewreversal('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeviewreversal('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}
