let reversalid
let cashierReversalSalesRows = []
let cashierReversalFinderTarget = 'sales'
async function reversalActive() {
    const formsales = document.querySelector('#reversesalesform')
    if(formsales.querySelector('#submit')) formsales.querySelector('#submit').addEventListener('click', reversesalesformSubmitHandler)
    const formreceipt = document.querySelector('#reversereceiptform')
    if(formreceipt.querySelector('#submit')) formreceipt.querySelector('#submit').addEventListener('click', reversereceiptformSubmitHandler)
    if(did('findcashierreversalsalesreference')) did('findcashierreversalsalesreference').onclick = () => openCashierReversalSalesFinder('sales')
    if(did('findcashierreversalreceiptreference')) did('findcashierreversalreceiptreference').onclick = () => openCashierReversalSalesFinder('receipt')
    initCashierReversalSalesFinderModal()
    datasource = []
    // await fetchreversal()
}

function initCashierReversalSalesFinderModal(){
    if(did('cashierReversalSalesFinderModal'))return
    document.body.insertAdjacentHTML('beforeend', `
    <div id="cashierReversalSalesFinderModal" onclick="if(event.target.id=='cashierReversalSalesFinderModal')this.classList.add('hidden')" class="hidden fixed inset-0 z-[210] bg-[#00000052] p-4 overflow-auto flex items-center justify-center">
      <div class="max-w-5xl w-full bg-white rounded shadow p-4 max-h-[90vh] overflow-auto">
        <div class="flex justify-between items-center mb-3">
          <p class="font-semibold">Find Sales Reference</p>
          <span class="material-symbols-outlined cp text-red-500" onclick="did('cashierReversalSalesFinderModal').classList.add('hidden')">close</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
          <input id="cashierReversalSalesStartDate" type="date" class="form-control">
          <input id="cashierReversalSalesEndDate" type="date" class="form-control">
          <input id="cashierReversalSalesSearch" class="form-control" placeholder="Search ref, room, payment method" oninput="renderCashierReversalSalesRows()">
          <button type="button" class="btn btn-sm" onclick="reloadCashierReversalSalesRows()">Filter</button>
        </div>
        <div class="table-content"><table><thead><tr><th>date</th><th>ref</th><th>room/cc</th><th>amount</th><th>method</th><th>action</th></tr></thead><tbody id="cashierReversalSalesRows"></tbody></table></div>
      </div>
    </div>`)
    const year = new Date().getFullYear()
    if(did('cashierReversalSalesStartDate')) did('cashierReversalSalesStartDate').value = `${year}-01-01`
    if(did('cashierReversalSalesEndDate')) did('cashierReversalSalesEndDate').value = `${year + 1}-12-31`
}

async function openCashierReversalSalesFinder(target='sales'){
    cashierReversalFinderTarget = target
    did('cashierReversalSalesFinderModal').classList.remove('hidden')
    await reloadCashierReversalSalesRows()
}

async function reloadCashierReversalSalesRows(){
    const startdate = did('cashierReversalSalesStartDate')?.value || ''
    const enddate = did('cashierReversalSalesEndDate')?.value || ''
    const payload = new FormData()
    payload.append('startdate', startdate)
    payload.append('enddate', enddate)
    const request = await httpRequest2('../controllers/fetchsales', payload, null, 'json')
    cashierReversalSalesRows = request.status ? (request.data || []) : []
    renderCashierReversalSalesRows()
}

function renderCashierReversalSalesRows(){
    const search = (did('cashierReversalSalesSearch')?.value || '').toLowerCase().trim()
    const rows = cashierReversalSalesRows.filter(item => {
        const sale = item.saleentry || {}
        return `${sale.reference || ''} ${sale.ownerid || ''} ${sale.paymentmethod || ''} ${sale.transactiondate || ''}`.toLowerCase().includes(search)
    })
    did('cashierReversalSalesRows').innerHTML = rows.map((item, idx) => {
        const sale = item.saleentry || {}
        return `
        <tr>
          <td>${sale.transactiondate ? specialformatDateTime(sale.transactiondate) : '-'}</td>
          <td>${sale.reference || '-'}</td>
          <td>${sale.ownerid || '-'}</td>
          <td>${formatNumber(sale.servicecharge || 0)}</td>
          <td>${sale.paymentmethod || '-'}</td>
          <td><button type="button" class="btn btn-sm bg-blue-500 text-white" onclick="useCashierReversalSalesReference(${idx})">Use</button></td>
        </tr>`
    }).join('') || `<tr><td colspan="100%" class="text-center opacity-70">No records found</td></tr>`
}

function useCashierReversalSalesReference(index){
    const search = (did('cashierReversalSalesSearch')?.value || '').toLowerCase().trim()
    const rows = cashierReversalSalesRows.filter(item => {
        const sale = item.saleentry || {}
        return `${sale.reference || ''} ${sale.ownerid || ''} ${sale.paymentmethod || ''} ${sale.transactiondate || ''}`.toLowerCase().includes(search)
    })
    const item = rows[index]
    if(!item)return
    const reference = item.saleentry?.reference || ''
    const targetInput = cashierReversalFinderTarget == 'receipt'
        ? document.querySelector('#reversereceiptform #reference')
        : document.querySelector('#reversesalesform #reference')
    if(targetInput) targetInput.value = reference
    did('cashierReversalSalesFinderModal').classList.add('hidden')
}


async function reversesalesformSubmitHandler() {
    if(!validateForm('reversesalesform', getIdFromCls('comp1'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#reversesalesform'), reversalid ? [['id', reversalid]] : null)
    let request = await httpRequest2('../controllers/reversesales', payload, document.querySelector('#reversesalesform #submit'))
    if(request.status) {
        notification('Sales reversed successfully!', 1);
        document.querySelector('#reversesalesform').reset();
        return
    }
    document.querySelector('#reversesalesform').reset();
    return notification(request.message, 0);
}

async function reversereceiptformSubmitHandler() {
    if(!validateForm('reversereceiptform', getIdFromCls('comp2'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#reversereceiptform'), reversalid ? [['id', reversalid]] : null)
    let request = await httpRequest2('../controllers/reversereceipt', payload, document.querySelector('#reversereceiptform #submit'))
    if(request.status) {
        notification('Receipt reversed successfully!', 1);
        document.querySelector('#reversereceiptform').reset();
        return
    }
    document.querySelector('#reversereceiptform').reset();
    return notification(request.message, 0);
}



// function runAdreversepaymentformValidations() {
//     let form = document.getElementById('reversepaymentform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#reversalname'))  controls.push([form.querySelector('#reversalname'), 'reversal name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
