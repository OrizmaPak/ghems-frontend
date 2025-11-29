let viewreversalsid
async function viewreversalsActive() {
    if(document.querySelector('#viewreversepaymentform #submitviewreversepayment')) document.querySelector('#viewreversepaymentform #submitviewreversepayment').addEventListener('click', fetchviewreversepayment)
    if(document.querySelector('#viewreversereceivepurchasesform #submit')) document.querySelector('#viewreversereceivepurchasesform #submit').addEventListener('click', fetchviewreversereceivepurchasesform)
    datasource = []
    fetchviewreversepayment();
    fetchviewreversereceivepurchasesform();
}

async function fetchviewreversepayment() {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData(document.getElementById('viewreversepaymentform'));
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchreversedpayments', getparamm(), document.querySelector('#viewreversepaymentform #submitviewreversepayment'), 'json');
    document.getElementById('tabledata').innerHTML = `No records retrieved`;
    if(request.status) {
                datasource = request.data
                // resolvePagination(datasource, onviewreversalsTableDataSignal)
    }
    else return notification('No records retrieved')
}

async function fetchviewreversereceivepurchasesform() {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData(document.getElementById('viewreversereceivepurchasesform'))
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchreversedreceivepurchases', getparamm(), document.querySelector('#viewreversereceivepurchasesform #submit'), 'json')
    document.getElementById('tabledata3').innerHTML = `No records retrieved`
    if(request.status) {
                datasource = request.data
                // resolvePagination(datasource, onviewreversalsTableDataSignal)
    }
    else return notification('No records retrieved')
}

async function onviewreversalsTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchviewreversals('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeviewreversals('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}
