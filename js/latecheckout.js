let latecheckoutid
window.checkoutOccupancyData = window.checkoutOccupancyData || []
async function latecheckoutActive() {
    window.currentCheckoutMode = 'latecheckout'
    const form = document.querySelector('#checkoutform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', latecheckoutFormSubmitHandler)
    if(document.querySelector('#submitref')) document.querySelector('#submitref').addEventListener('click', fetchcheckout)
    if(document.querySelector('#submitview')) document.querySelector('#submitview').addEventListener('click', fetchcheckinn('', '', 'cancelreservationformfilter'))
    if(document.querySelector('#paymentmethod')) document.querySelector('#paymentmethod').addEventListener('click', checkotherbankdetails)
    if(document.querySelector('#refreshcheckoutoccupancy')) document.querySelector('#refreshcheckoutoccupancy').addEventListener('click', loadCheckoutOccupancyList)
    if(document.querySelector('#checkoutoccupancysearch')) document.querySelector('#checkoutoccupancysearch').addEventListener('input', renderCheckoutOccupancyRows)
    if(document.querySelector('#balance_display')) document.querySelector('#balance_display').addEventListener('input', () => syncCheckoutPaymentInput('balance'))
    if(document.querySelector('#balance_display')) document.querySelector('#balance_display').addEventListener('blur', () => syncCheckoutPaymentInput('balance', true))
    if(document.querySelector('#otherbills_display')) document.querySelector('#otherbills_display').addEventListener('input', () => syncCheckoutPaymentInput('otherbills'))
    if(document.querySelector('#otherbills_display')) document.querySelector('#otherbills_display').addEventListener('blur', () => syncCheckoutPaymentInput('otherbills', true))
    if(document.querySelector('#amountpaid_display')) document.querySelector('#amountpaid_display').addEventListener('input', () => syncCheckoutPaymentInput('amountpaid'))
    if(document.querySelector('#amountpaid_display')) document.querySelector('#amountpaid_display').addEventListener('blur', () => syncCheckoutPaymentInput('amountpaid', true))
    datasource = []
    await fetchcheckinn('', '', 'cancelreservationformfilter')
    await loadCheckoutOccupancyList()
    const checkoutReference = sessionStorage.getItem('checkoutreference')
    if(checkoutReference && did('reference')){
        did('reference').value = checkoutReference
        sessionStorage.removeItem('checkoutreference')
        await fetchcheckout()
    }
}

async function fetchcheckout(id) {
    // scrollToTop('scrolldiv')
    if(!did('reference').value)return notification('Please enter a valid reference number', 0)
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('reference', did('reference').value)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchdataforcheckout', getparamm(), document.querySelector('#submitref'), 'json')
    // if(!id)document.getElementById('tabledata2').innerHTML = `No records retrieved`
    if(request.status) {
        datasource = request.data;
        const checkoutRoomTransactions = request.data.transactions || []
        const checkoutPosTransactions = request.data.posdata || []
        const checkoutTransactions = [
            ...checkoutRoomTransactions,
            ...checkoutPosTransactions
        ].sort((a, b) => new Date(a.transactiondate) - new Date(b.transactiondate) || Number(a.id || 0) - Number(b.id || 0))
        const roomBalance = getCheckoutLedgerBalance(checkoutRoomTransactions)
        const otherBills = getCheckoutLedgerBalance(checkoutPosTransactions)
        let tt = 0
            yy = 0
        did('tabledata2').innerHTML = checkoutTransactions.map((item, index)=>{
            tt=tt+(Number(item.debit)-Number(item.credit))
            // S/N    ITEM    DEBIT    CREDIT    BALANCE
            return `
                <tr>
                    <td>${index + 1 }</td>
                    <td>${specialformatDateTime(item.transactiondate)}</td>
                    <td>${formatCheckoutDescription(item.description)}</td>
                    <td>${formatNumber(item.debit)}</td>
                    <td>${formatNumber(item.credit)}</td>
                    <td>${formatNumber(tt)}</td>
                </tr>
            `
        }).join('')
        setCheckoutPaymentValue('balance', roomBalance)
        setCheckoutPaymentValue('otherbills', otherBills)
        setCheckoutPaymentDueLabel('roompaymentdue', roomBalance)
        setCheckoutPaymentDueLabel('otherbillsdue', otherBills)
        did('tabledata2').innerHTML += `
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="text-bold">Total:</td>
                    <td>${formatNumber(tt)}</td>
                </tr>
            `
        did('displaydetails').innerHTML = `
                            <div class="flex flex-col justify-center items-center gap-2">
                                    <h4 class="font-semibold">${did('your_companyname').value}</h4>
                                    <p class="text-xs">${did('your_companyaddress').value}</p>
                                </div>
                                <div class="flex flex-col gap-3 border-b py-6 text-xs">
                                  <p class="flex justify-between">
                                    <span class="text-gray-400 capitalize text-right">reference:</span>
                                    <span>${request.data.reservation.reference}</span>
                                  </p>
                                  <p class="flex justify-between">
                                    <span class="text-gray-400 capitalize text-right">Room(s):</span>
                                    <span>${request.data.guestrows.length > 0 ? request.data.guestrows.map(da=>da.roomnumber) : '-'}</span>
                                  </p>
                                  <p class="flex justify-between">
                                    <span class="text-gray-400 capitalize text-right">arrival date:</span>
                                    <span>${specialformatDateTime(request.data.reservation.arrivaldate)}</span>
                                  </p>
                                  <p class="flex justify-between">
                                    <span class="text-gray-400 capitalize text-right">departure date:</span>
                                    <span>${specialformatDateTime(request.data.reservation.departuredate)}</span>
                                  </p>
                                  <p class="flex justify-between">
                                    <span class="text-gray-400 capitalize text-right">number of nights:</span>
                                    <span>${specialformatDateTime(request.data.reservation.numberofnights)}</span>
                                  </p>
                                  <p class="flex justify-between">
                                    <span class="text-gray-400 capitalize text-right">type of guest:</span>
                                    <span>${request.data.reservation.typeofguest}</span>
                                  </p>
                                  <p class="flex justify-between">
                                    <span class="text-gray-400 capitalize text-right">currency:</span>
                                    <span>${request.data.reservation.currency}</span>
                                  </p>
                                  <p class="flex justify-between">
                                    <span class="text-gray-400 capitalize text-right text-bold">Total Balance:</span>
                                    <span>${formatNumber(tt)}</span>
                                  </p>
                                </div>
                                <div class="flex flex-col gap-3 pb-6 pt-2 text-xs">
                                  <div class=" border-b border border-dashed"></div>
                                  <div class="py-4 justify-center items-center flex flex-col gap-2">
                                    <p class="flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21.3 12.23h-3.48c-.98 0-1.85.54-2.29 1.42l-.84 1.66c-.2.4-.6.65-1.04.65h-3.28c-.31 0-.75-.07-1.04-.65l-.84-1.65a2.567 2.567 0 0 0-2.29-1.42H2.7c-.39 0-.7.31-.7.7v3.26C2 19.83 4.18 22 7.82 22h8.38c3.43 0 5.54-1.88 5.8-5.22v-3.85c0-.38-.31-.7-.7-.7ZM12.75 2c0-.41-.34-.75-.75-.75s-.75.34-.75.75v2h1.5V2Z" fill="#000"></path><path d="M22 9.81v1.04a2.06 2.06 0 0 0-.7-.12h-3.48c-1.55 0-2.94.86-3.63 2.24l-.75 1.48h-2.86l-.75-1.47a4.026 4.026 0 0 0-3.63-2.25H2.7c-.24 0-.48.04-.7.12V9.81C2 6.17 4.17 4 7.81 4h3.44v3.19l-.72-.72a.754.754 0 0 0-1.06 0c-.29.29-.29.77 0 1.06l2 2c.01.01.02.01.02.02a.753.753 0 0 0 .51.2c.1 0 .19-.02.28-.06.09-.03.18-.09.25-.16l2-2c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-.72.72V4h3.44C19.83 4 22 6.17 22 9.81Z" fill="#000"></path></svg>${did('your_companyemail').value}</p>
                                    <p class="flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path fill="#000" d="M11.05 14.95L9.2 16.8c-.39.39-1.01.39-1.41.01-.11-.11-.22-.21-.33-.32a28.414 28.414 0 01-2.79-3.27c-.82-1.14-1.48-2.28-1.96-3.41C2.24 8.67 2 7.58 2 6.54c0-.68.12-1.33.36-1.93.24-.61.62-1.17 1.15-1.67C4.15 2.31 4.85 2 5.59 2c.28 0 .56.06.81.18.26.12.49.3.67.56l2.32 3.27c.18.25.31.48.4.7.09.21.14.42.14.61 0 .24-.07.48-.21.71-.13.23-.32.47-.56.71l-.76.79c-.11.11-.16.24-.16.4 0 .08.01.15.03.23.03.08.06.14.08.2.18.33.49.76.93 1.28.45.52.93 1.05 1.45 1.58.1.1.21.2.31.3.4.39.41 1.03.01 1.43zM21.97 18.33a2.54 2.54 0 01-.25 1.09c-.17.36-.39.7-.68 1.02-.49.54-1.03.93-1.64 1.18-.01 0-.02.01-.03.01-.59.24-1.23.37-1.92.37-1.02 0-2.11-.24-3.26-.73s-2.3-1.15-3.44-1.98c-.39-.29-.78-.58-1.15-.89l3.27-3.27c.28.21.53.37.74.48.05.02.11.05.18.08.08.03.16.04.25.04.17 0 .3-.06.41-.17l.76-.75c.25-.25.49-.44.72-.56.23-.14.46-.21.71-.21.19 0 .39.04.61.13.22.09.45.22.7.39l3.31 2.35c.26.18.44.39.55.64.1.25.16.5.16.78z"></path></svg>${did('your_companyphone').value}</p>
                                  </div>
                                </div>
        `;
        did('displaydetails').innerHTML = buildCheckoutSummary(request.data, roomBalance, otherBills, tt)

    }
    else{
        did('invoicing').click()
        return notification(request.message, 0)}
}

function formatCheckoutDescription(value){
    if(!value)return ''

    const parts = String(value).split('|').map(part => part.trim())
    if(parts.length >= 3 && parts[1])return parts[1]

    return value
}

function getCheckoutLedgerBalance(items){
    return items.reduce((total, item) => total + (Number(item.debit || 0) - Number(item.credit || 0)), 0)
}

async function loadCheckoutOccupancyList(){
    if(!did('checkoutoccupancydata'))return
    did('checkoutoccupancydata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">Loading current check-ins...</td></tr>`
    let request = await httpRequest2('../controllers/fetchallcheckins', new FormData(), did('refreshcheckoutoccupancy'), 'json')
    if(request.status && request.data?.length){
        window.checkoutOccupancyData = request.data
        renderCheckoutOccupancyRows()
        return
    }
    window.checkoutOccupancyData = []
    did('checkoutoccupancydata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No current check-ins found</td></tr>`
}

function renderCheckoutOccupancyRows(){
    if(!did('checkoutoccupancydata'))return
    const search = (did('checkoutoccupancysearch')?.value || '').toLowerCase().trim()
    const rows = window.checkoutOccupancyData
        .filter(item => getCheckoutOccupancySearchText(item).includes(search))
        .map((item, index) => buildCheckoutOccupancyRow(item, index))
        .join('')

    did('checkoutoccupancydata').innerHTML = rows || `<tr><td colspan="100%" class="text-center opacity-70">No matching check-ins found</td></tr>`
}

function buildCheckoutOccupancyRow(item, index){
    const reservation = item.reservations || {}
    const roomRows = item.roomguestrow || item.roomgeustrow || []
    const rooms = roomRows.map(row => row.roomdata?.roomnumber).filter(Boolean).join(', ') || '-'
    const guests = roomRows.flatMap(row => [
        ...(row.guest1 || []),
        ...(row.guest2 || []),
        ...(row.guest3 || []),
        ...(row.guest4 || [])
    ]).map(guest => `${guest.firstname || ''} ${guest.lastname || ''} ${guest.othernames || ''}`.trim()).filter(Boolean).join(', ') || '-'

    return `
        <tr>
            <td>${index + 1}</td>
            <td>
                <button title="Load checkout" onclick="loadCheckoutFromOccupancy('${reservation.id || ''}')" class="material-symbols-outlined rounded-full bg-blue-500 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">logout</button>
            </td>
            <td>${reservation.reference || '-'}</td>
            <td>${rooms}</td>
            <td>${guests}</td>
            <td>${reservation.arrivaldate ? specialformatDateTime(reservation.arrivaldate) : '-'}</td>
            <td>${reservation.departuredate ? specialformatDateTime(reservation.departuredate) : '-'}</td>
            <td>${formatNumber(reservation.amountpaid || 0)}</td>
        </tr>
    `
}

function getCheckoutOccupancySearchText(item){
    const reservation = item.reservations || {}
    const roomRows = item.roomguestrow || item.roomgeustrow || []
    const roomText = roomRows.map(row => row.roomdata?.roomnumber).filter(Boolean).join(' ')
    const guestText = roomRows.flatMap(row => [
        ...(row.guest1 || []),
        ...(row.guest2 || []),
        ...(row.guest3 || []),
        ...(row.guest4 || [])
    ]).map(guest => `${guest.firstname || ''} ${guest.lastname || ''} ${guest.othernames || ''} ${guest.phone || ''}`).join(' ')
    return `${reservation.reference || ''} ${reservation.arrivaldate || ''} ${reservation.departuredate || ''} ${reservation.status || ''} ${roomText} ${guestText}`.toLowerCase()
}

async function loadCheckoutFromOccupancy(reservationId){
    const reference = window.checkoutOccupancyData.find(item => String(item.reservations?.id) == String(reservationId))?.reservations?.reference
    if(!reference)return notification('Reservation reference was not found for checkout', 0)
    if(did('reference'))did('reference').value = reference
    await fetchcheckout()
}

function parseCheckoutPaymentAmount(value){
    return String(value || '').replace(/,/g, '').replace(/[^\d.]/g, '')
}

function setCheckoutPaymentValue(field, value){
    const amount = parseCheckoutPaymentAmount(value)
    if(did(field))did(field).value = amount
    if(did(`${field}_display`))did(`${field}_display`).value = amount ? formatNumber(amount) : ''
}

function setCheckoutPaymentDueLabel(id, value){
    if(did(id))did(id).innerHTML = `(Due: ${formatNumber(value || 0)})`
}

function syncCheckoutPaymentInput(field, shouldFormat = false){
    const display = did(`${field}_display`)
    if(!display)return
    const amount = parseCheckoutPaymentAmount(display.value)
    if(did(field))did(field).value = amount
    if(shouldFormat)display.value = amount ? formatNumber(amount) : ''
}

function buildCheckoutSummary(data, roomBalance, otherBills, totalBalance){
    const reservation = data.reservation || {}
    const guestrows = data.guestrows || []
    const posdata = data.posdata || []
    const rooms = guestrows.length ? guestrows.map(row => row.roomnumber).filter(Boolean).join(', ') : '-'
    const totalRoomRate = guestrows.reduce((total, row) => total + Number(row.roomrate || 0), 0)
    const roomTypes = guestrows.length ? [...new Set(guestrows.map(row => row.roomcategoryname).filter(Boolean))].join(', ') : '-'
    const rateCodes = guestrows.length ? [...new Set(guestrows.map(row => row.ratecodename).filter(Boolean))].join(', ') : '-'

    return `
                            <div class="flex flex-col justify-center items-center gap-2 text-center">
                                    <h4 class="font-semibold">${did('your_companyname').value}</h4>
                                    <p class="text-xs">${did('your_companyaddress').value}</p>
                                </div>
                                <div class="flex flex-col gap-3 border-b py-6 text-xs">
                                  ${checkoutSummaryRow('reference', reservation.reference)}
                                  ${checkoutSummaryRow('status', reservation.status)}
                                  ${checkoutSummaryRow('Room(s)', rooms)}
                                  ${checkoutSummaryRow('room type', roomTypes)}
                                  ${checkoutSummaryRow('rate code', rateCodes)}
                                  ${checkoutSummaryRow('arrival date', specialformatDateTime(reservation.arrivaldate))}
                                  ${checkoutSummaryRow('departure date', specialformatDateTime(reservation.departuredate))}
                                  ${checkoutSummaryRow('number of nights', reservation.numberofnights)}
                                  ${checkoutSummaryRow('type of guest', reservation.typeofguest)}
                                  ${checkoutSummaryRow('reservation type', reservation.reservationtype)}
                                  ${checkoutSummaryRow('billing info', reservation.billinginfo)}
                                  ${checkoutSummaryRow('payment method', reservation.paymentmethod)}
                                  ${checkoutSummaryRow('currency', reservation.currency)}
                                </div>
                                <div class="flex flex-col gap-3 border-b py-6 text-xs">
                                  <p class="font-semibold text-gray-700">${window.currentCheckoutMode == 'latecheckout' ? 'Late Checkout Overview' : 'Checkout Overview'}</p>
                                  ${checkoutSummaryRow('total room rate', formatNumber(totalRoomRate))}
                                  ${checkoutSummaryRow('room balance', formatNumber(roomBalance))}
                                  ${checkoutSummaryRow('other bills', formatNumber(otherBills))}
                                  ${checkoutSummaryRow('POS entries', posdata.length)}
                                  ${checkoutSummaryRow('total balance', formatNumber(totalBalance), true)}
                                </div>
                                <div class="flex flex-col gap-3 pb-6 pt-4 text-xs">
                                  <div class="py-2 justify-center items-center flex flex-col gap-2">
                                    <p class="flex gap-2">${did('your_companyemail').value}</p>
                                    <p class="flex gap-2">${did('your_companyphone').value}</p>
                                  </div>
                                </div>
        `;
}

function checkoutSummaryRow(label, value, strong=false){
    const displayValue = value === 0 ? 0 : value || '-'
    return `
                                  <p class="flex justify-between gap-4">
                                    <span class="text-gray-400 capitalize text-right">${label}:</span>
                                    <span class="${strong ? 'font-semibold text-black' : 'text-gray-800'} text-right">${displayValue}</span>
                                  </p>
    `
}

async function fetchexpectedarrivalss() {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData(document.getElementById('expectedarrivalsform'))
        return paramstr
    }
    let request = await httpRequest2('../controllers/expectedarrivals', getparamm(), document.querySelector('#expectedarrivalsform #submit'), 'json')
    document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, oncheckinTableDataSignal)
            }else return notification(request.message, 0)
    }
    else return notification('No records retrieved')
}

async function removecheckout(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this checkout?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removevisacountries', id ? getparamm() : null, null, 'json');

    // Show notification based on the result
    fetchcheckout()
    return notification(request.message);

}


async function oncheckoutTableData2Signal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchcheckout('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removecheckout('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function latecheckoutFormSubmitHandler() {
    if(!validateForm('checkoutform', getIdFromCls('comp'))) return

    let payload

    payload = getFormData2(document.querySelector('#checkoutform'), [['reference', did('reference').value]])
    let request = await httpRequest2('../controllers/latecheckout.php', payload, document.querySelector('#checkoutform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        // document.querySelector('#checkout').click();
        document.querySelector('#modalcheckout').classList.remove('hidden');
        // fetchcheckout();
         did('viewformtoeditreceipt').innerHTML = `
            <div class="flex flex-col justify-center items-center gap-2" >
                                    <div>
                                        <div class="flex justify-end phide">
                                        <div onclick="printContent('HEMS RECEIPT', null, 'viewformtoeditreceipt', true)" class="relative mr-4 inline-block">
                                            <div class="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 inline-flex items-center justify-center" >
                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-printer" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                    <rect x="0" y="0" width="24" height="24" stroke="none"></rect>
                                                    <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"></path>
                                                    <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"></path>
                                                    <rect x="7" y="13" width="10" height="8" rx="2"></rect>
                                                </svg>
                                            </div>
                                            <div onclick="exportToPDF('viewformtoeditreceipt')" class="z-40 shadow-lg text-center w-32 block absolute right-0 top-0 p-2 mt-12 rounded-lg bg-gray-800 text-white text-xs" style="display: none;">
                                                Print this Invoice!
                                            </div>
                                        </div>
                                        <div onclick="printContent('HEMS INVOICE', null, 'viewformtoeditreceipt', true)" class="relative mr-4 inline-block">
                                            <div class="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 inline-flex items-center justify-center" onclick="printInvoice()">
                                                <span class="material-symbols-outlined">picture_as_pdf</span>
                                            </div>
                                            <div  class="z-40 shadow-lg text-center w-32 block absolute right-0 top-0 p-2 mt-12 rounded-lg bg-gray-800 text-white text-xs" style="display: none;">
                                                Print this Invoice!
                                            </div>
                                        </div>
                                        <div onclick="did('modalcheckout').classList.add('hidden');did('latecheckout').click()" class="relative inline-block">
                                            <div class="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 inline-flex items-center justify-center" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false" @click="printInvoice()">
                                                <span class="material-symbols-outlined text-red-500 cp-500">cancel</span>
                                            </div>
                                            <div x-show.transition="showTooltip" class="z-40 shadow-lg text-center w-32 block absolute right-0 top-0 p-2 mt-12 rounded-lg bg-gray-800 text-white text-xs" style="display: none;">
                                                cancel
                                            </div>
                                        </div>

                                    </div>
                                    </div>
                                    <h4 class="font-semibold">${did('your_companyname').value}</h4>
                                    <p class="text-xs">${did('your_companyaddress').value}</p>
                                </div>
                                <div class="flex flex-col gap-3 border-b py-6 text-xs">
                                  <p class="flex justify-between">
                                    <span class="text-gray-400 capitalize text-right">reference:</span>
                                    <span>${datasource.reference}</span>
                                  </p>
                                  <p class="flex justify-between">
                                    <span class="text-gray-400 capitalize text-right">arrival date:</span>
                                    <span>${specialformatDateTime(datasource.arrivaldate)}</span>
                                  </p>
                                  <p class="flex justify-between">
                                    <span class="text-gray-400 capitalize text-right">departure date:</span>
                                    <span>${specialformatDateTime(datasource.departuredate)}</span>
                                  </p>
                                  <p class="flex justify-between">
                                    <span class="text-gray-400 capitalize text-right">number of nights:</span>
                                    <span>${specialformatDateTime(datasource.numberofnights)}</span>
                                  </p>
                                  <p class="flex justify-between">
                                    <span class="text-gray-400 capitalize text-right">type of guest:</span>
                                    <span>${datasource.typeofguest}</span>
                                  </p>
                                  <p class="flex justify-between">
                                    <span class="text-gray-400 capitalize text-right">Payment method:</span>
                                    <span>${did('paymentmethod').value}</span>
                                  </p>
                                </div>
                                <div class="flex flex-col gap-3 pb-6 pt-2 text-xs">
                                  <div class=" border-b border border-dashed">
                                   <table class="w-full text-left">
                                        <thead>
                                          <tr class="flex">
                                            <th class="w-full py-2">Item</th>
                                            <th class="min-w-[44px] py-2">Amount&nbsp;Paid</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr class="flex">
                                            <td class="flex-1 py-1">Deposit</td>
                                            <td class="min-w-[64px] text-semibold">${formatNumber(Number(did('balance').value))}</td>
                                          </tr>
                                        </tbody>
                                      </table>
                                  </div>
                                  <div class="py-4 justify-center items-center flex flex-col gap-2">
                                    <p class="flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21.3 12.23h-3.48c-.98 0-1.85.54-2.29 1.42l-.84 1.66c-.2.4-.6.65-1.04.65h-3.28c-.31 0-.75-.07-1.04-.65l-.84-1.65a2.567 2.567 0 0 0-2.29-1.42H2.7c-.39 0-.7.31-.7.7v3.26C2 19.83 4.18 22 7.82 22h8.38c3.43 0 5.54-1.88 5.8-5.22v-3.85c0-.38-.31-.7-.7-.7ZM12.75 2c0-.41-.34-.75-.75-.75s-.75.34-.75.75v2h1.5V2Z" fill="#000"></path><path d="M22 9.81v1.04a2.06 2.06 0 0 0-.7-.12h-3.48c-1.55 0-2.94.86-3.63 2.24l-.75 1.48h-2.86l-.75-1.47a4.026 4.026 0 0 0-3.63-2.25H2.7c-.24 0-.48.04-.7.12V9.81C2 6.17 4.17 4 7.81 4h3.44v3.19l-.72-.72a.754.754 0 0 0-1.06 0c-.29.29-.29.77 0 1.06l2 2c.01.01.02.01.02.02a.753.753 0 0 0 .51.2c.1 0 .19-.02.28-.06.09-.03.18-.09.25-.16l2-2c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-.72.72V4h3.44C19.83 4 22 6.17 22 9.81Z" fill="#000"></path></svg>${did('your_companyemail').value}</p>
                                    <p class="flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path fill="#000" d="M11.05 14.95L9.2 16.8c-.39.39-1.01.39-1.41.01-.11-.11-.22-.21-.33-.32a28.414 28.414 0 01-2.79-3.27c-.82-1.14-1.48-2.28-1.96-3.41C2.24 8.67 2 7.58 2 6.54c0-.68.12-1.33.36-1.93.24-.61.62-1.17 1.15-1.67C4.15 2.31 4.85 2 5.59 2c.28 0 .56.06.81.18.26.12.49.3.67.56l2.32 3.27c.18.25.31.48.4.7.09.21.14.42.14.61 0 .24-.07.48-.21.71-.13.23-.32.47-.56.71l-.76.79c-.11.11-.16.24-.16.4 0 .08.01.15.03.23.03.08.06.14.08.2.18.33.49.76.93 1.28.45.52.93 1.05 1.45 1.58.1.1.21.2.31.3.4.39.41 1.03.01 1.43zM21.97 18.33a2.54 2.54 0 01-.25 1.09c-.17.36-.39.7-.68 1.02-.49.54-1.03.93-1.64 1.18-.01 0-.02.01-.03.01-.59.24-1.23.37-1.92.37-1.02 0-2.11-.24-3.26-.73s-2.3-1.15-3.44-1.98c-.39-.29-.78-.58-1.15-.89l3.27-3.27c.28.21.53.37.74.48.05.02.11.05.18.08.08.03.16.04.25.04.17 0 .3-.06.41-.17l.76-.75c.25-.25.49-.44.72-.56.23-.14.46-.21.71-.21.19 0 .39.04.61.13.22.09.45.22.7.39l3.31 2.35c.26.18.44.39.55.64.1.25.16.5.16.78z"></path></svg>${did('your_companyphone').value}</p>
                                  </div>
                                </div>
                                <div class="w-full flex justify-center p-2">
                               <p>We appreciate your stay with us</p>
                              </div>
        `
        return
    }
    document.querySelector('#latecheckout').click();
    return notification(request.message, 0);
}


// async function fetchcheckoutview(form="") {
//     function getparamm(){
//         if(!form && !id)return null;
//         let paramstr
//         if(form)paramstr = new FormData(did(form))
//         if(!form)paramstr = new FormData()
//         if(id)paramstr.append('id', id)
//         // if(!id && oyn)paramstr.append('startdate', document.getElementById('arrivaldaterr').value)
//         // if(!id && oyn)paramstr.append('enddate', document.getElementById('arrivaldaterrr').value)
//         // if(!id && oyn)paramstr.append('enddate', document.getElementById('arrivaldaterrr').value)
//         return paramstr
//     }
//     function getparammexpectedarrivalsform(){
//         if(!form && !id)return null;
//         let paramstr
//         if(form)paramstr = new FormData(did(form))
//         if(!form)paramstr = new FormData()
//         if(id)paramstr.append('id', id)
//         // if(!id && oyn)paramstr.append('startdate', document.getElementById('arrivaldaterr').value)
//         // if(!id && oyn)paramstr.append('enddate', document.getElementById('arrivaldaterrr').value)
//         // if(!id && oyn)paramstr.append('enddate', document.getElementById('arrivaldaterrr').value)
//         return paramstr
//     }
//     let request
//     if(did('checkinform'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchcheckindirect'}`, getparamm(), null, 'json')
//     if(did('guestreservationform'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchreservationsbyfilter'}`, getparamm(), did('fetchgandres'), 'json')
//     if(did('expectedarrivalsform'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchreservationsbyfilter'}`, getparammexpectedarrivalsform(), null, 'json')
//     if(did('reservationcheckinform'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchreservationsbyfilter'}`, getparamm(), null, 'json')
//     if(did('groupcheckinform'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchreservationsbyfilter'}`, getparamm(), null, 'json')
//     // if(did('cancelreservationform'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchreservationsbyfilter'}`, getparamm(), null, 'json')
//     if(did('cancelreservationformfilter'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchcancelledreservations'}`, getparamm(), null, 'json')
//     if(did('extendstayform'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchreservationsbyfilter'}`, getparamm(), null, 'json')
//     // let request = await httpRequest2(`../controllers/${id? 'fetchcheckindirect' : 'fetchcheckindirect'}`, id ? getparamm() : null, null, 'json')
//     if(!id && document.getElementById('tabledata'))document.getElementById('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No records retrieved</td></tr>`;
//     if(request.status) {
//         if(!id){
//             if(request.data.length) {
//                 if(did('checkinform'))datasource = request.data.filter(data=>data.reservations.status == 'CHECKED IN')
//                 if(did('guestreservationform'))datasource = request.data.filter(data=>data.reservations.status == 'OPEN' || data.reservations.status == 'RESERVED').filter(data=>data.reservations.group_id == 0)
//                 if(did('reservationcheckinform'))datasource = request.data.filter(data=>data.reservations.status == 'OPEN' || data.reservations.status == 'RESERVED').filter(data=>data.reservations.group_id == 0)
//                 if(did('groupcheckinform'))datasource = request.data.filter(data=>data.reservations.status == 'OPEN' || data.reservations.status == 'RESERVED').filter(data=>data.reservations.group_id != 0)
//                 if(did('extendstayform'))datasource = request.data
//                 // if(did('cancelreservationform'))datasource = request.data.filter(data=>data.reservations.status == 'OPEN' || data.reservations.status == 'RESERVED').filter(data=>data.reservations.group_id != 0)
//                 if(did('cancelreservationformfilter'))datasource = request.data
//                 if(datasource.length > 0)document.getElementById('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No records retrieved</td></tr>`
//                 if(datasource.length == 0)return document.getElementById('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No records retrieved</td></tr>`
//                 resolvePagination(datasource, oncheckinTableDataSignal)
//             }
//         }else{
//              checkinid = request.data[0].reservations.id;
//              populateddata = request.data[0].reservations;
//             if(did('checkinform'))populateData(request.data[0].reservations, [], [], 'checkinform')
//             if(did('guestreservationform'))populateData(request.data[0].reservations, [], [], 'guestreservationform')
//             if(did('reservationcheckinform'))populateData(request.data[0].reservations, [], [], 'reservationcheckinform')
//             if(did('groupcheckinform'))populateData(request.data[0].reservations, [], [], 'groupcheckinform')
//             if(did('extendstayform'))populateData(request.data[0].reservations, [], [], 'extendstayform')
//             if(did('cancelreservationform'))populateData(request.data[0].reservations, [], [], 'cancelreservationform')
//             let x = JSON.stringify(request.data[0])
//             populaterestcheckindata(x)
//             // document.getElementById('foundby').value = request.data[0].foundbyname+' || '+request.data[0].foundby
//         }
//     }
//     else return notification('No records retrieved')
// }
