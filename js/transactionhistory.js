let transactionhistoryRoomNumber = ''
let transactionhistorySummary = null

async function transactionhistoryActive() {
    if(document.querySelector('#submittransactionhistoryfilter')) document.querySelector('#submittransactionhistoryfilter').addEventListener('click', () => fetchtransactionhistory(did('transactionhistoryroomnumber').value))
    if(document.querySelector('#resettransactionhistoryfilter')) document.querySelector('#resettransactionhistoryfilter').addEventListener('click', resettransactionhistoryfilter)
    datasource = []
    transactionhistoryRoomNumber = ''
    transactionhistorySummary = null
    rendertransactionhistorysummary()
    rendertransactionhistoryempty('Enter a room number to load transaction history')
}

async function fetchtransactionhistory(roomnumber = '') {
    const normalizedRoom = String(roomnumber || '').trim()
    if(!normalizedRoom)return notification('Please enter a room number', 0)

    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('roomnumber', normalizedRoom)
        return paramstr
    }

    did('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">Loading transaction history...</td></tr>`
    let request = await httpRequest2('../controllers/fetchreceivablesbyrooms', getparamm(), document.querySelector('#submittransactionhistoryfilter'), 'json')
    if(!(request.status && request.data?.length)){
        datasource = []
        transactionhistoryRoomNumber = normalizedRoom
        transactionhistorySummary = null
        rendertransactionhistorysummary()
        rendertransactionhistoryempty('No transaction history was found for this room')
        return notification(request.message || 'No records retrieved', 0)
    }

    transactionhistoryRoomNumber = normalizedRoom
    datasource = normalizeTransactionHistoryData(request.data)
    transactionhistorySummary = buildTransactionHistorySummary(datasource, normalizedRoom)
    rendertransactionhistorysummary()
    resolvePagination(datasource, ontransactionhistoryTableDataSignal)
}

function normalizeTransactionHistoryData(items){
    let runningBalance = 0
    return [...items]
        .sort((a, b) => new Date(String(a.transactiondate || '').replace(' ', 'T')) - new Date(String(b.transactiondate || '').replace(' ', 'T')) || Number(a.id || 0) - Number(b.id || 0))
        .map((item, index) => {
            runningBalance += Number(item.debit || 0)
            runningBalance -= Number(item.credit || 0)
            return {
                ...item,
                index,
                runningBalance
            }
        })
}

function buildTransactionHistorySummary(items, roomnumber){
    const debit = items.reduce((sum, item) => sum + Number(item.debit || 0), 0)
    const credit = items.reduce((sum, item) => sum + Number(item.credit || 0), 0)
    const balance = debit - credit
    const latest = items[items.length - 1] || {}

    return {
        roomnumber,
        count: items.length,
        debit,
        credit,
        balance,
        latestDate: latest.transactiondate || '',
        ownerid: latest.ownerid || roomnumber
    }
}

function rendertransactionhistorysummary(){
    if(!did('transactionhistorysummary'))return
    if(!transactionhistorySummary){
        did('transactionhistorysummary').classList.add('hidden')
        did('transactionhistorysummary').innerHTML = ''
        return
    }

    did('transactionhistorysummary').classList.remove('hidden')
    did('transactionhistorysummary').innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            ${transactionHistorySummaryCard('Room Number', transactionhistorySummary.roomnumber)}
            ${transactionHistorySummaryCard('Transactions', transactionhistorySummary.count)}
            ${transactionHistorySummaryCard('Total Debit', formatNumber(transactionhistorySummary.debit))}
            ${transactionHistorySummaryCard('Total Credit', formatNumber(transactionhistorySummary.credit))}
            ${transactionHistorySummaryCard('Current Balance', formatNumber(transactionhistorySummary.balance))}
        </div>
        <div class="flex flex-wrap justify-between items-center gap-4 mt-5 border-t pt-4">
            <p class="text-sm text-gray-600">Latest Transaction: <span class="font-semibold text-gray-800">${transactionhistorySummary.latestDate ? formatTransactionHistoryDate(transactionhistorySummary.latestDate) : '-'}</span></p>
            <button onclick="openTransactionHistoryPaymentModal()" class="btn ${transactionhistorySummary.balance > 0 ? '' : '!hidden'}">
                <span>Pay Now</span>
            </button>
        </div>
    `
}

function transactionHistorySummaryCard(label, value){
    return `
        <div class="border rounded p-4 bg-white">
            <p class="text-xs uppercase tracking-wide text-gray-400">${label}</p>
            <p class="text-base font-semibold text-gray-800 mt-2">${value}</p>
        </div>
    `
}

function rendertransactionhistoryempty(message){
    if(!did('tabledata'))return
    did('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">${message}</td></tr>`
}

async function ontransactionhistoryTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => transactionHistoryRowMarkup(item, index)).join('')
    injectPaginatatedTable(rows || `<tr><td colspan="100%" class="text-center opacity-70">No records retrieved</td></tr>`)
}

function transactionHistoryRowMarkup(item, index){
    const detailId = `transactionhistorydetail-${item.id || index}`
    const toggleId = `transactionhistorytoggle-${item.id || index}`
    return `
        <tr>
            <td>${item.index + 1}</td>
            <td>${formatTransactionHistoryDate(item.transactiondate)}</td>
            <td>${formatTransactionHistoryDescription(item.description)}</td>
            <td>${item.salespoint || '-'}</td>
            <td>${formatNumber(item.debit || 0)}</td>
            <td>${formatNumber(item.credit || 0)}</td>
            <td><p class="text-black font-semibold">${formatNumber(item.runningBalance || 0)}</p></td>
            <td>
                <button type="button" onclick="toggleTransactionHistoryDetail('${detailId}', '${toggleId}')" class="material-symbols-outlined rounded-full bg-slate-100 h-8 w-8 text-slate-700 drop-shadow-md text-xs" style="font-size: 18px;" id="${toggleId}">expand_more</button>
            </td>
        </tr>
        <tr id="${detailId}" class="hidden bg-slate-50">
            <td colspan="100%" class="p-0">
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4 text-sm">
                    ${transactionHistoryDetailItem('Account Number', item.accountnumber)}
                    ${transactionHistoryDetailItem('Reference', item.reference)}
                    ${transactionHistoryDetailItem('Type', item.ttype)}
                    ${transactionHistoryDetailItem('Status', item.status)}
                    ${transactionHistoryDetailItem('Value Date', formatTransactionHistoryDate(item.valuedate))}
                    ${transactionHistoryDetailItem('Payment Method', item.paymentmethod)}
                    ${transactionHistoryDetailItem('Sales Point', item.salespoint)}
                    ${transactionHistoryDetailItem('Bank Name', item.bankname)}
                    ${transactionHistoryDetailItem('Currency', item.currency)}
                    ${transactionHistoryDetailItem('Owner ID', item.ownerid)}
                    ${transactionHistoryDetailItem('Location', item.location)}
                    ${transactionHistoryDetailItem('Service Charge', formatNumber(item.servicecharge || 0))}
                    ${transactionHistoryDetailItem('Debit Total', formatNumber(item.debittotal || item.debit || 0))}
                    ${transactionHistoryDetailItem('Credit Total', formatNumber(item.credittotal || item.credit || 0))}
                    ${transactionHistoryDetailItem('Account Officer', item.accountofficer)}
                    ${transactionHistoryDetailItem('Approved By', item.approvedby)}
                    ${transactionHistoryDetailItem('User', item.user)}
                    ${transactionHistoryDetailItem('Marketer', item.marketer)}
                    ${transactionHistoryDetailItem('Serial Number', item.serialnumber || '-')}
                    ${transactionHistoryDetailItem('Which Account', item.whichaccount)}
                    ${transactionHistoryDetailItem('Log', item.tlog || '-')}
                    ${transactionHistoryDetailItem('Description', item.description || '-')}
                    ${transactionHistoryDetailItem('More Data', item.moredata || '-')}
                </div>
            </td>
        </tr>
    `
}

function transactionHistoryDetailItem(label, value){
    return `
        <div class="border rounded p-3 bg-white">
            <p class="text-xs uppercase tracking-wide text-gray-400">${label}</p>
            <p class="text-sm font-medium text-gray-800 mt-1 break-words">${value || '-'}</p>
        </div>
    `
}

function toggleTransactionHistoryDetail(detailId, toggleId){
    const detail = did(detailId)
    const toggle = did(toggleId)
    if(!detail || !toggle)return
    detail.classList.toggle('hidden')
    toggle.textContent = detail.classList.contains('hidden') ? 'expand_more' : 'expand_less'
}

function resettransactionhistoryfilter(){
    if(did('transactionhistoryroomnumber'))did('transactionhistoryroomnumber').value = ''
    datasource = []
    transactionhistoryRoomNumber = ''
    transactionhistorySummary = null
    rendertransactionhistorysummary()
    rendertransactionhistoryempty('Enter a room number to load transaction history')
}

function openTransactionHistoryPaymentModal(){
    if(!transactionhistorySummary)return notification('No transaction history loaded', 0)
    openTransactionHistoryModal({
        roomnumber: transactionhistorySummary.roomnumber,
        debit: transactionhistorySummary.debit,
        credit: transactionhistorySummary.credit,
        balance: transactionhistorySummary.balance
    })
}

function openTransactionHistoryModal(data){
    document.getElementById('modaltransactionhistoryreceipt').classList.remove('hidden')
    did('transactionhistoryinvoicecontainer').innerHTML = `
        <div class="rounded-lg">
            <div class="flex mb-8 justify-between">
                <div class="w-2/4">
                    <div class="mb-2 md:mb-1 md:flex items-center">
                        <label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Invoice Date</label>
                        <div class="flex-1">
                            <input value="${formatDate(getTransactionHistoryTodayDate())}" readonly class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" type="text">
                        </div>
                    </div>
                </div>
                <div>
                    <span class="xl:w-[250px] pb-10 font-bold text-2xl text-base block py-3 pl-5 selection:bg-white uppercase font-heebo text-primary-g text-right">He<span class="text-gray-400">ms Invoice</span></span>
                    <div class="flex justify-end">
                        <div onclick="printContent('HEMS INVOICE', null, 'transactionhistoryinvoicecontainer', true)" class="relative mr-4 inline-block">
                            <div class="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 inline-flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-printer" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="0" y="0" width="24" height="24" stroke="none"></rect>
                                    <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"></path>
                                    <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"></path>
                                    <rect x="7" y="13" width="10" height="8" rx="2"></rect>
                                </svg>
                            </div>
                        </div>
                        <div onclick="did('modaltransactionhistoryreceipt').classList.add('hidden')" class="relative inline-block">
                            <div class="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 inline-flex items-center justify-center">
                                <span class="material-symbols-outlined text-red-500">cancel</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-wrap justify-between mb-8">
                <div class="w-full md:w-1/3 mb-2 md:mb-0">
                    <label class="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">Bill To Room:</label>
                    <input value="${data.roomnumber}" readonly class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" type="text">
                </div>
                <div class="w-full md:w-1/3">
                    <label class="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">From:</label>
                    <input value="Hems Limited" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" type="text">
                </div>
            </div>

            <h3 class="text-xl font-bold">Payment:</h3>
            <ul class="text-md font-semibold text-grey-400 px-1">
                <li class="border rounded p-1 mt-1" style="display: flex;justify-content:space-between;width: 100%"><p>Date:</p><span>${String(formatDate(getTransactionHistoryTodayDate()))}</span></li>
                <li class="border rounded p-1 mt-1" style="display: flex;justify-content:space-between;width: 100%"><p>Total Debit:</p><p>${formatCurrency(data.debit)}</p></li>
                <li class="border rounded p-1 mt-1" style="display: flex;justify-content:space-between;width: 100%"><p>Total Credit:</p><p>${formatCurrency(data.credit)}</p></li>
                <li class="border rounded p-1 mt-1" style="display: flex;justify-content:space-between;width: 100%"><p>Balance:</p><p>${formatCurrency(data.balance)}</p></li>
            </ul>

            <div class="py-2 ml-auto mt-5 w-full sm:w-2/4 lg:w-1/4">
                <div class="py-2 border-t border-b">
                    <div class="flex justify-between">
                        <div class="text-xl text-gray-600 text-right flex-1">Total Balance</div>
                        <div class="text-right w-40">
                            <div class="text-xl text-gray-800 font-bold">${formatCurrency(data.balance)}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="py-10 text-center">
                <p class="text-gray-600">Created by <a class="text-blue-600 hover:text-blue-500 border-b-2 border-blue-200 hover:border-blue-300" href="https://twitter.com/mithicher">Mira Technologies</a>.</p>
            </div>
        </div>
    `
}

function getTransactionHistoryTodayDate() {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

function formatTransactionHistoryDate(value){
    if(!value)return ''

    const parsedDate = new Date(String(value).replace(' ', 'T'))
    if(Number.isNaN(parsedDate.getTime()))return value

    const day = parsedDate.getDate()
    const suffix = day % 10 == 1 && day % 100 != 11 ? 'st' : day % 10 == 2 && day % 100 != 12 ? 'nd' : day % 10 == 3 && day % 100 != 13 ? 'rd' : 'th'
    const month = parsedDate.toLocaleString('en-US', { month: 'long' })
    const year = parsedDate.getFullYear()
    const hours = parsedDate.getHours() % 12 || 12
    const minutes = String(parsedDate.getMinutes()).padStart(2, '0')
    const period = parsedDate.getHours() < 12 ? 'a.m.' : 'p.m.'

    return `${day}${suffix} of ${month} ${year} ${hours}:${minutes} ${period}`
}

function formatTransactionHistoryDescription(value){
    if(!value)return ''

    const parts = String(value).split('|').map(part => part.trim())
    if(parts.length >= 3 && parts[1])return parts[1]

    return value
}
