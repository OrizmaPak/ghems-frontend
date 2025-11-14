let stockvaluationid
async function stockvaluationActive() {
    const form = document.querySelector('#stockvaluationform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', e=>stockvaluationFormSubmitHandler())
    datasource = []
    stockvaluationFormSubmitHandler()
    // await fetchstockvaluations()
}


async function onstockvaluationTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.itemname}</td>
        <td>${formatNumber(item.cost)}</td>
        <td>${formatNumber(item.qtyinstock ? item.qtyinstock : 0)}</td>
        <td>${formatNumber(item.value)}</td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function stockvaluationFormSubmitHandler() {
    function payload(){
        let param = new FormData(document.getElementById('stockvaluationform'))
        return param
    }
    let request = await httpRequest2('../controllers/stockvaluation', payload(), document.querySelector('#stockvaluationform #submit'))
   document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
                datasource = request.data
                did('asatdate').innerHTML = formatDate(did('atdate').value)
                let val = 0
                let cost = 0
                datasource.map(dat=>{
                    val = val+Number(dat.value)
                    cost = cost+Number(dat.cost)
                })
                did('asat').innerHTML = formatNumber(val)
                did('asat2').innerHTML = formatCurrency(cost)
                resolvePagination(datasource, onstockvaluationTableDataSignal)
                return notification(request.message, 1);
    }
    else return notification(request.message, 0)
}