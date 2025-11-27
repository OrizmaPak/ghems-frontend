let stockhistoryid
async function stockhistoryActive() {
    recalldatalist('STOCK')
    const form = document.querySelector('#stockhistoryform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', e=>fetchstockhistorys())
    // if(document.querySelector('#salespointname')) document.querySelector('#salespointname').addEventListener('change', e=>fetchstockhistorysitems())
    // form.querySelector('#submit').click()
    datasource = []
    await fetchstockhistorys()
    await fetchstockhistorysitems('store') 
}

async function fetchstockhistorys() {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData(document.getElementById('stockhistoryform'))
        return paramstr
    }
    let request = await httpRequest2('../controllers/stockhistory', getparamm(), document.querySelector('#stockhistoryform #submit'), 'json')
    document.getElementById('tabledata').innerHTML = `No records retrieved`;
    if(request.status) {
                datasource = request.data[0].history
                resolvePagination(datasource, onstockhistoryTableDataSignal)
                let qtyin = 0;
                let qtyout = 0;
                request.data[0].history.forEach(entry => {
                  qtyin += parseInt(entry.qtyin);
                  qtyout += parseInt(entry.qtyout);
                });
                did('fullbalance').innerHTML = formatNumber(qtyin-qtyout)
            }else return notification(request.message, 0)
}

async function fetchstockhistorysitems(store='') {
    did('itemid').innerHTML = `<option value="">Loading...</option>`
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('itemclass', 'STOCK-ITEM')
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchinventorybyclass', getparamm(), document.querySelector('#stockhistoryform #submit'), 'json')
    if(request.status) {
        // API now returns data.data = [{ item: [ { ...fields } ] }]
        const dataArray = Array.isArray(request.data?.data) ? request.data.data : []
        const items = dataArray.flatMap(entry => Array.isArray(entry.item) ? entry.item : []).filter(Boolean)
        if(!items.length){
            did('itemid').innerHTML = `<option value="">No Item</option>`
            return notification('No items available', 0)
        }
        did('itemid').innerHTML = `<option value="">-- Select Item --</option>`
        did('itemid').innerHTML += items.map(dat=>`<option value="${dat.itemid}">${dat.itemname}</option>`).join('')
    }else{
        did('itemid').innerHTML = `<option value="">No Item</option>`
        return notification(request.message, 0)
        
    }
}

async function removestockhistory(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this item?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removeitem', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchstockhistorys()
    return notification(request.message);
    
}


async function onstockhistoryTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1 }</td>
        <td>${item.itemname}</td>
        <td>${item.salespoint}</td>
        <td>${formatNumber(item.qtyin)}</td>
        <td>${formatNumber(item.qtyout)}</td>
        <td>${specialformatDateTime(item.transactiondate)}</td>
        <td>${item.reference}</td>
        <td>${Number(item.qtyin)-Number(item.qtyout)}</td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function stockhistoryFormSubmitHandler(id) {
    
    function payload(){
        let param = new FormData()
        param.append('id', id)
        return param
    }
    let request = await httpRequest2('../controllers/resolvereview', payload(), null)
    if(request.status) {
        fetchstockhistorys()
        return notification(request.message, 1);
    }
    else return notification(request.message)
}
