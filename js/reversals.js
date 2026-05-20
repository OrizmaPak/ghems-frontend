let reversalsid
let reversalSalesRows = []
let reversalFinderTarget = 'payment'
async function reversalsActive() {
    const form = document.querySelector('#reversepaymentform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', reversepaymentformSubmitHandler)
    const formreversereceivepurchases = document.querySelector('#reversereceivepurchasesform')
    if(formreversereceivepurchases.querySelector('#submit')) formreversereceivepurchases.querySelector('#submit').addEventListener('click', reversereceivepurchasesformSubmitHandler)
    if(did('findreversalreference')) did('findreversalreference').onclick = () => openReversalSalesFinder('payment')
    if(did('findreversalreceiptreference')) did('findreversalreceiptreference').onclick = () => openReversalSalesFinder('receipt')
    initReversalSalesFinderModal()
    datasource = []
    // await fetchreversals()
}

function initReversalSalesFinderModal(){
    if(did('reversalSalesFinderModal'))return
    document.body.insertAdjacentHTML('beforeend', `
    <div id="reversalSalesFinderModal" onclick="if(event.target.id=='reversalSalesFinderModal')this.classList.add('hidden')" class="hidden fixed inset-0 z-[210] bg-[#00000052] p-4 overflow-auto flex items-center justify-center">
      <div class="max-w-5xl w-full bg-white rounded shadow p-4 max-h-[90vh] overflow-auto">
        <div class="flex justify-between items-center mb-3">
          <p class="font-semibold">Find Sales Reference</p>
          <span class="material-symbols-outlined cp text-red-500" onclick="did('reversalSalesFinderModal').classList.add('hidden')">close</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
          <input id="reversalSalesStartDate" type="date" class="form-control">
          <input id="reversalSalesEndDate" type="date" class="form-control">
          <input id="reversalSalesSearch" class="form-control" placeholder="Search ref, room, payment method" oninput="renderReversalSalesRows()">
          <button type="button" class="btn btn-sm" onclick="reloadReversalSalesRows()">Filter</button>
        </div>
        <div class="table-content"><table><thead><tr><th>date</th><th>ref</th><th>room/cc</th><th>amount</th><th>method</th><th>action</th></tr></thead><tbody id="reversalSalesRows"></tbody></table></div>
      </div>
    </div>`)
    const now = new Date()
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
    const monthEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()).padStart(2, '0')}`
    if(did('reversalSalesStartDate') && !did('reversalSalesStartDate').value) did('reversalSalesStartDate').value = monthStart
    if(did('reversalSalesEndDate') && !did('reversalSalesEndDate').value) did('reversalSalesEndDate').value = monthEnd
    did('reversalSalesFinderModal').className = 'hidden fixed inset-0 z-[210] bg-[#00000052] p-4 overflow-auto flex items-center justify-center'
}

async function openReversalSalesFinder(target='payment'){
    reversalFinderTarget = target
    did('reversalSalesFinderModal').classList.remove('hidden')
    await reloadReversalSalesRows()
}

async function reloadReversalSalesRows(){
    const startdate = did('reversalSalesStartDate')?.value || ''
    const enddate = did('reversalSalesEndDate')?.value || ''
    const payload = new FormData()
    payload.append('startdate', startdate)
    payload.append('enddate', enddate)
    const controller = reversalFinderTarget == 'receipt' ? '../controllers/fetchreceipts' : '../controllers/fetchsales'
    const request = await httpRequest2(controller, payload, null, 'json')
    reversalSalesRows = request.status ? (request.data || []) : []
    renderReversalSalesRows()
}

function normalizeReversalFinderRow(item){
    if(item?.saleentry){
        return {
            reference: item.saleentry.reference || '',
            ownerid: item.saleentry.ownerid || '',
            paymentmethod: item.saleentry.paymentmethod || '',
            transactiondate: item.saleentry.transactiondate || '',
            amount: item.saleentry.servicecharge || 0
        }
    }
    return {
        reference: item.reference || '',
        ownerid: item.ownerid || '',
        paymentmethod: item.paymentmethod || '',
        transactiondate: item.transactiondate || '',
        amount: item.credittotal || item.credit || item.totalamount || 0
    }
}

function renderReversalSalesRows(){
    const search = (did('reversalSalesSearch')?.value || '').toLowerCase().trim()
    const rows = reversalSalesRows.filter(item => {
        const sale = normalizeReversalFinderRow(item)
        return `${sale.reference} ${sale.ownerid} ${sale.paymentmethod} ${sale.transactiondate}`.toLowerCase().includes(search)
    })
    did('reversalSalesRows').innerHTML = rows.map((item, idx) => {
        const sale = normalizeReversalFinderRow(item)
        return `
        <tr>
          <td>${sale.transactiondate ? specialformatDateTime(sale.transactiondate) : '-'}</td>
          <td>${sale.reference || '-'}</td>
          <td>${sale.ownerid || '-'}</td>
          <td>${formatNumber(sale.amount || 0)}</td>
          <td>${sale.paymentmethod || '-'}</td>
          <td><button type="button" class="btn btn-sm bg-blue-500 text-white" onclick="useReversalSalesReference(${idx})">Use</button></td>
        </tr>`
    }).join('') || `<tr><td colspan="100%" class="text-center opacity-70">No records found</td></tr>`
}

function useReversalSalesReference(index){
    const rows = reversalSalesRows.filter(item => {
        const sale = normalizeReversalFinderRow(item)
        const search = (did('reversalSalesSearch')?.value || '').toLowerCase().trim()
        return `${sale.reference} ${sale.ownerid} ${sale.paymentmethod} ${sale.transactiondate}`.toLowerCase().includes(search)
    })
    const item = rows[index]
    if(!item)return
    const reference = item?.saleentry?.reference || item?.reference || ''
    const targetInput = reversalFinderTarget == 'receipt'
        ? document.querySelector('#reversereceivepurchasesform #reference')
        : document.querySelector('#reversepaymentform #reference')
    if(targetInput) targetInput.value = reference
    did('reversalSalesFinderModal').classList.add('hidden')
}

async function reversepaymentformSubmitHandler() {
    if(!validateForm('reversepaymentform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#reversepaymentform'), reversalsid ? [['id', reversalsid]] : null)
    let request = await httpRequest2('../controllers/reversepayment', payload, document.querySelector('#reversepaymentform #submit'))
    if(request.status) {
        notification('Payment reversed successfully!', 1);
        document.querySelector('#reversepaymentform').reset();
        return
    }
    document.querySelector('#reversepaymentform').reset();
    return notification(request.message, 0);
}


async function reversereceivepurchasesformSubmitHandler() {
    if(!validateForm('reversereceivepurchasesform', getIdFromCls('comp2'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#reversereceivepurchasesform'), reversalsid ? [['id', reversalsid]] : null)
    let request = await httpRequest2('../controllers/reversereceivepurchases', payload, document.querySelector('#reversereceivepurchasesform #submit'))
    if(request.status) {
        notification('Receive purchase reversed successfully!', 1);
        document.querySelector('#reversereceivepurchasesform').reset();
        return
    }
    document.querySelector('#reversereceivepurchasesform').reset();
    return notification(request.message, 0);
}


// function runAdreversepaymentformValidations() {
//     let form = document.getElementById('reversepaymentform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#reversalsname'))  controls.push([form.querySelector('#reversalsname'), 'reversals name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
