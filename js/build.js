let buildid
let viewbuildid
let viewbuildDatasource = []

function parseBuildAmount(value) {
    const normalized = String(value ?? '').replace(/,/g, '').trim()
    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : 0
}

function getBuildQuantityMultiplier(detail = {}) {
    const candidates = [
        detail?.quantity,
        detail?.qty,
        detail?.buildqty,
        detail?.buildquantity,
        detail?.qtty,
        detail?.totalquantity
    ]
    for (const value of candidates) {
        const parsed = parseBuildAmount(value)
        if (parsed > 0) return parsed
    }
    return 1
}

function getBuildMemberUnitPrice(member = {}) {
    return parseBuildAmount(member?.price ?? member?.unitprice ?? member?.unit_price ?? member?.cost ?? 0)
}

function resolveBuildImagePath(imageValue) {
    const normalized = String(imageValue ?? '').trim()
    if (!normalized || normalized === '-' || normalized.length <= 1) return '../images/default-avatar.png'
    return `../images/${normalized}`
}

function getBuildInvoiceComputedData(record = {}) {
    const detail = record?.itembuiltdetail || {}
    const buildQty = getBuildQuantityMultiplier(detail)
    const itemPrice = parseBuildAmount(detail?.itemprice || 0)
    const members = (record?.itembuiltmemberitems || []).map((member) => {
        const baseQty = parseBuildAmount(member?.qty || 0)
        const finalQty = baseQty * buildQty
        const unitPrice = getBuildMemberUnitPrice(member)
        const linePrice = finalQty * unitPrice
        return {
            ...member,
            baseQty,
            finalQty,
            unitPrice,
            linePrice
        }
    })
    const componentTotal = members.reduce((sum, item) => sum + item.linePrice, 0)
    const totalBuildPrice = buildQty * itemPrice
    const marginProfit = totalBuildPrice - componentTotal
    return {
        buildQty,
        itemPrice,
        totalBuildPrice,
        marginProfit,
        members,
        total: componentTotal
    }
}

function sanitizePrintValue(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

function printBuildInvoice(id) {
    if (!id) return
    const data = viewbuildDatasource.find(dat => String(dat?.itembuiltdetail?.id) === String(id))
    if (!data) return notification('No build details found for print', 0)

    const computed = getBuildInvoiceComputedData(data)
    const detail = data.itembuiltdetail || {}
    const buildName = detail.itemname || 'N/A'
    const salesPoint = detail.salespoint || 'N/A'
    const buildDate = detail.builddate ? specialformatDateTime(detail.builddate) : 'N/A'

    const rows = computed.members.length
        ? computed.members.map((member, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${sanitizePrintValue(member.itemname || '')}</td>
                <td class="num">${formatNumber(member.baseQty)}</td>
                <td class="num">${formatNumber(computed.buildQty)}</td>
                <td class="num">${formatNumber(member.finalQty)}</td>
                <td class="num">${formatNumber(member.unitPrice)}</td>
                <td class="num">${formatNumber(member.linePrice)}</td>
            </tr>
        `).join('')
        : `<tr><td colspan="7" class="empty">No items found for this build</td></tr>`

    const printWindow = window.open('', '_blank', 'width=1100,height=800')
    if (!printWindow) return notification('Unable to open print window. Please allow popups.', 0)

    printWindow.document.write(`
        <html>
            <head>
                <title>Build Invoice - ${sanitizePrintValue(buildName)}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
                    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
                    .title { font-size: 22px; font-weight: 700; margin: 0; }
                    .subtitle { margin-top: 6px; color: #475569; font-size: 13px; }
                    .meta { display: grid; grid-template-columns: repeat(2, minmax(180px, 1fr)); gap: 8px 16px; margin: 14px 0 18px; }
                    .meta p { margin: 0; font-size: 13px; }
                    .meta strong { color: #334155; }
                    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
                    th, td { border: 1px solid #cbd5e1; padding: 8px 10px; font-size: 12px; }
                    th { background: #1d4ed8; color: #fff; text-align: left; }
                    td.num { text-align: right; }
                    tr.total-row td { font-weight: 700; background: #f8fafc; }
                    .empty { text-align: center; color: #64748b; }
                    .footer-note { margin-top: 12px; color: #64748b; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <h1 class="title">Build Invoice</h1>
                        <p class="subtitle">Quantity-scaled component usage and valuation</p>
                    </div>
                </div>

                <div class="meta">
                    <p><strong>Build Item:</strong> ${sanitizePrintValue(buildName)}</p>
                    <p><strong>Sales Point:</strong> ${sanitizePrintValue(salesPoint)}</p>
                    <p><strong>Build Date:</strong> ${sanitizePrintValue(buildDate)}</p>
                    <p><strong>Build Quantity:</strong> ${formatNumber(computed.buildQty)}</p>
                    <p><strong>Item Price:</strong> ${formatNumber(computed.itemPrice)}</p>
                    <p><strong>Total Build Price:</strong> ${formatNumber(computed.totalBuildPrice)}</p>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>s/n</th>
                            <th>Item Name</th>
                            <th>Base Qty</th>
                            <th>Build Qty</th>
                            <th>Final Qty</th>
                            <th>Unit Price</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                        <tr class="total-row">
                            <td colspan="6" style="text-align:right;">Total</td>
                            <td class="num">${formatNumber(computed.total)}</td>
                        </tr>
                    </tbody>
                </table>

                <p class="footer-note">Final Qty = Base Qty x Build Qty. Price = Final Qty x Unit Price. Component Total: ${formatNumber(computed.total)} | Build Price Total: ${formatNumber(computed.totalBuildPrice)}</p>
            </body>
        </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
        printWindow.print()
    }, 300)
}

async function buildActive() {
    recalldatalist()
    let form = document.querySelector('#buildform')
    if (form?.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', buildFormSubmitHandler)
    if (document.querySelector('#salespointname')) document.querySelector('#salespointname').addEventListener('change', e => handlebuilddepartment())
    datasource = []
    await handlebuilddepartment(default_department)

    const activeRoute = new URLSearchParams(window.location.search).get('r')
    const defaultTabElement = activeRoute === 'viewbuild'
        ? did('buildoptioner_view')
        : did('buildoptioner_build')
    if (defaultTabElement) runoptioner(defaultTabElement)

    await viewbuildActive()
}

async function handlebuilddepartment(store) {
    hidesalesterminal()
    did('loading').classList.remove('hidden')
    did('loading').innerHTML = 'Loading...'

    if (!did('salespointname').value && !store) return notification('Please enter a Department / Sales Point')

    function payload() {
        let param = new FormData()
        if (!store) param.append('salespoint', did('salespointname').value)
        if (store) param.append('salespoint', store)
        return param
    }
    let request = await httpRequest2('../controllers/fetchinventorybysalespoint', payload(), null)
    if (request.status) {
        if (request.data.length) {
            datasource = request.data
            if (request.data.filter(data => data.composite == 'YES').length < 1) return did('loading').innerHTML = 'No Composite Item can be found for this department'
            did('item').innerHTML = `<option value=''>-- Select Item --</option>`
            did('item').innerHTML += request.data.map(data => {
                if (data.composite == 'YES') return `<option value='${data.itemid}'>${data.itemname}</option>`
            }).join('')
            did('loading').classList.add('hidden')
            hidesalesterminal(false)
            return notification(request.message, 1)
        }
    } else {
        did('loading').innerHTML = request.message
        return notification('No records retrieved')
    }
}

function addbuilditem() {
    if (!validateForm('buildform', ['item', 'quantity'])) return

    let element = document.createElement('tr')
    let selectedItemId = document.getElementById('item').value
    let x = `<td class="opacity-70 w-3 sn">  </td>
                <td class="opacity-70" name="itemid"> ${selectedItemId} </td>
                <td class="opacity-70"> ${getLabelByValue('item', selectedItemId)} </td>
                <td class="opacity-70"> <input type="number" value='${document.getElementById('quantity').value}' name="qty" id="${generateUID()}" class="form-control verify" placeholder="Enter Quantity of Item"> </td>
                <td class="flex items-center gap-3">
                    <button title="Delete item" onclick="removebuildtableitem(this, '${selectedItemId}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">remove</button>
                </td>`
    element.innerHTML = x
    hideOptionByValue('item', selectedItemId)
    did('buildtabledata').appendChild(element)
    runCount('datatable', 'sn')
    did('item').value = ''
    did('quantity').value = ''
}

function removebuildtableitem(element, value) {
    element.parentElement.parentElement.remove()
    hideOptionByValue('item', value, false)
    runCount('datatable', 'sn')
}

async function removebuild(id) {
    const confirmed = window.confirm('Are you sure you want to remove this build?')
    if (!confirmed) return

    function getparamm() {
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }

    let request = await httpRequest2('../controllers/removevisacountries', id ? getparamm() : null, null, 'json')
    fetchviewbuild()
    return notification(request.message)
}

async function onbuildTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1}</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchbuild('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry" onclick="removebuild('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
        .join('')
    injectPaginatatedTable(rows)
}

async function buildFormSubmitHandler() {
    if (!validateForm('buildform', getIdFromCls('verify'))) return notification('Please ensure all compulsory fields are filled', 0)
    if (!document.getElementById('buildtabledata').children[0]) return notification('No items selected to build with', 0)

    function payload() {
        let param = new FormData()
        param.append('salespoint', document.getElementById('salespointname').value)
        param.append('builddate', document.getElementById('builddate').value)
        for (let i = 0; i < document.getElementsByName('qty').length; i++) {
            param.append(`itemtobuildid${i + 1}`, document.getElementsByName('itemid')[i].textContent.trim())
            param.append(`qty${i + 1}`, document.getElementsByName('qty')[i].value)
        }
        param.append('gridsize', document.getElementsByName('qty').length)
        return param
    }
    let request = await httpRequest2('../controllers/buildrecipes', payload(), document.querySelector('#buildform #submit'))
    if (request.status) {
        notification('Record saved successfully!', 1)
        document.querySelector('#build').click()
        return
    }
    document.querySelector('#build').click()
    return notification(request.message, 0)
}

async function viewbuildActive() {
    const form = document.querySelector('#viewbuildform')
    if (form?.querySelector('#viewbuildsubmit')) form.querySelector('#viewbuildsubmit').addEventListener('click', e => fetchviewbuild())
    await fetchviewbuild()
}

async function fetchviewbuild(id) {
    function getparamm() {
        let paramstr = new FormData(did('viewbuildform'))
        if (id) paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchbuiltrecipes', getparamm(), document.querySelector('#viewbuildform #viewbuildsubmit'), 'json')
    if (!id) document.getElementById('tabledata').innerHTML = `No records retrieved`
    if (request.status) {
        if (!id) {
            if (request.data.length) {
                viewbuildDatasource = request.data
                datasource = request.data
                resolvePagination(datasource, onviewbuildTableDataSignal)
            } else {
                viewbuildDatasource = []
                datasource = []
                did('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No records retrieved</td></tr>`
                const tableStatus = document.querySelector('.table-status')
                if (tableStatus) tableStatus.innerHTML = ''
            }
        } else {
            viewbuildid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeviewbuild(id) {
    const confirmed = window.confirm('Are you sure you want to remove this build record?')
    if (!confirmed) return

    function getparamm() {
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }

    let request = await httpRequest2('../controllers/removevisacountries', id ? getparamm() : null, null, 'json')
    fetchviewbuild()
    return notification(request.message)
}

async function onviewbuildTableDataSignal() {
    let rows = getSignaledDatasource().map((item) => {
        const computed = getBuildInvoiceComputedData(item)
        const previewMembers = computed.members.slice(0, 3)
        const imagePath = resolveBuildImagePath(item?.itembuiltdetail?.imageurl)
        return `
    <tr>
        <td>${item.index + 1}</td>
        <td>${item.itembuiltdetail.salespoint}</td>
        <td>
            <div class="flex items-center gap-2">
                <img src="${imagePath}" onerror="this.onerror=null;this.src='../images/default-avatar.png';" class="w-8 h-8 rounded-full object-cover border border-slate-200">
                <span>${item.itembuiltdetail.itemname}</span>
            </div>
        </td>
        <td>
           ${computed.members.length > 0 ? `<table class="w-full">
                ${previewMembers.map((dat) => `
                    <tr>
                        <td>${dat.itemname}</td>
                        <td style="width: 80px" class="text-right">${formatNumber(dat.finalQty)}</td>
                        <td style="width: 100px" class="text-right">${formatNumber(dat.linePrice)}</td>
                    </tr>
                `).join('')}
                ${computed.members.length > 3 ? `
                    <tr>
                        <td colspan="3" onclick="modalviewbuild('${item.itembuiltdetail.id}')" style="color:green;cursor:pointer">Click to view more (${computed.members.length - 3} more items)</td>
                    </tr>
                ` : ''}
                <tr>
                    <td colspan="2" class="text-right font-semibold">Total</td>
                    <td class="text-right font-semibold">${formatNumber(computed.total)}</td>
                </tr>
            </table>` : 'No Item found in this build'}
        </td>
        <td class="text-right">${formatNumber(computed.itemPrice)}</td>
        <td class="text-right font-semibold">${formatNumber(computed.totalBuildPrice)}</td>
        <td>${specialformatDateTime(item.itembuiltdetail.builddate)}</td>
        <td class="flex items-center gap-3">
            <button title="View Item" onclick="modalviewbuild('${item.itembuiltdetail.id}')" class="material-symbols-outlined rounded-full bg-green-500 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
            <button title="Print Invoice" onclick="printBuildInvoice('${item.itembuiltdetail.id}')" class="material-symbols-outlined rounded-full bg-slate-700 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">print</button>
            <button title="Edit row entry" onclick="sessionStorage.setItem('recipeid','${item.itembuiltdetail.id}');did('recipe').click()" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry" onclick="removeviewbuild('${item.compositeitem || item.itembuiltdetail.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    }).join('')
    injectPaginatatedTable(rows)
}

function modalviewbuild(id) {
    if (!id) return
    let data = viewbuildDatasource.find(dat => String(dat?.itembuiltdetail?.id) === String(id))
    if (!data) return

    const computed = getBuildInvoiceComputedData(data)
    const detail = data.itembuiltdetail || {}
    const imagePath = resolveBuildImagePath(detail.imageurl)

    did('modaldetails').innerHTML = `
        <div class="rounded-lg border border-slate-200 p-3 flex gap-3 items-center">
            <img src="${imagePath}" onerror="this.onerror=null;this.src='../images/default-avatar.png';" class="w-[72px] h-[72px] rounded-md object-cover">
            <div>
                <p class="text-xs text-slate-500">Build Item</p>
                <p class="text-sm font-semibold uppercase">${detail.itemname || ''}</p>
            </div>
        </div>
        <div class="rounded-lg border border-slate-200 p-3">
            <p class="text-xs text-slate-500">Build Quantity</p>
            <p class="text-lg font-semibold">${formatNumber(computed.buildQty)}</p>
        </div>
        <div class="rounded-lg border border-slate-200 p-3">
            <p class="text-xs text-slate-500">Total Component Value</p>
            <p class="text-lg font-semibold">${formatNumber(computed.total)}</p>
        </div>
        <div class="rounded-lg border border-slate-200 p-3">
            <p class="text-xs text-slate-500">Item Price</p>
            <p class="text-lg font-semibold">${formatNumber(computed.itemPrice)}</p>
        </div>
        <div class="rounded-lg border border-slate-200 p-3">
            <p class="text-xs text-slate-500">Total Build Price</p>
            <p class="text-lg font-semibold">${formatNumber(computed.totalBuildPrice)}</p>
        </div>
        <div class="rounded-lg border border-slate-200 p-3">
            <p class="text-xs text-slate-500">Margin Profit</p>
            <p class="text-lg font-semibold ${computed.marginProfit >= 0 ? 'text-green-600' : 'text-red-600'}">${formatNumber(computed.marginProfit)}</p>
        </div>
        <div class="rounded-lg border border-slate-200 p-3">
            <p class="text-xs text-slate-500">Build Date</p>
            <p class="text-sm font-semibold">${detail.builddate ? specialformatDateTime(detail.builddate) : ''}</p>
        </div>
        <div class="rounded-lg border border-slate-200 p-3 md:col-span-2 xl:col-span-4 flex justify-between items-center">
            <div>
                <p class="text-xs text-slate-500">Sales Point</p>
                <p class="text-sm font-medium">${detail.salespoint || ''}</p>
            </div>
            <button type="button" onclick="printBuildInvoice('${detail.id}')" class="btn">Print Invoice</button>
        </div>
    `

    did('tabledata2').innerHTML = '<tr><td colspan="100%" class="text-center opacity-70">No Items set for this build</td></tr>'
    if (computed.members.length > 0) {
        did('tabledata2').innerHTML = computed.members.map((dat, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${dat.itemname || ''}</td>
                <td class="text-right">${formatNumber(dat.baseQty)}</td>
                <td class="text-right">${formatNumber(computed.buildQty)}</td>
                <td class="text-right">${formatNumber(dat.finalQty)}</td>
                <td class="text-right">${formatNumber(dat.unitPrice)}</td>
                <td class="text-right">${formatNumber(dat.linePrice)}</td>
            </tr>
        `).join('') + `
            <tr>
                <td colspan="6" class="text-right font-semibold">Total</td>
                <td class="font-semibold text-right">${formatNumber(computed.total)}</td>
            </tr>
        `
    }
    did('viewbuildmodal').classList.remove('hidden')
}
