let recipeid
let recipeInventoryDatasource = []

function parseRecipeAmount(value) {
    const normalized = String(value ?? '').replace(/,/g, '').trim()
    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : 0
}

function getRecipeItemUnitPrice(itemId) {
    if (!itemId) return 0
    const item = (recipeInventoryDatasource || []).find(data => String(data?.itemid) === String(itemId))
    if (!item) return 0
    return parseRecipeAmount(item.price ?? item.unitprice ?? item.unit_price ?? item.cost ?? 0)
}

function refreshRecipeTableTotal() {
    const rows = Array.from(document.querySelectorAll('#recipetabledata tr'))
    const total = rows.reduce((sum, row) => {
        const amount = parseRecipeAmount(row.querySelector('.recipe-item-total')?.dataset?.raw || 0)
        return sum + amount
    }, 0)
    if (did('recipetabletotal')) did('recipetabletotal').textContent = formatNumber(total)
}

function updateRecipeRowTotal(quantityInput) {
    const row = quantityInput?.closest('tr')
    if (!row) return

    const unitPrice = parseRecipeAmount(row.querySelector('.recipe-item-unit-price')?.dataset?.raw || 0)
    const quantity = parseRecipeAmount(quantityInput.value)
    const rowTotal = unitPrice * quantity
    const totalCell = row.querySelector('.recipe-item-total')
    if (totalCell) {
        totalCell.dataset.raw = String(rowTotal)
        totalCell.textContent = formatNumber(rowTotal)
    }
    refreshRecipeTableTotal()
}

function setRecipeActionMode(isEditing) {
    const submitButton = did('recipesubmit')
    const resetButton = did('recipereset')
    const updateButton = did('recipeupdate')
    if (submitButton) submitButton.classList.toggle('hidden', !!isEditing)
    if (resetButton) resetButton.classList.toggle('hidden', !isEditing)
    if (updateButton) updateButton.classList.toggle('hidden', !isEditing)
}

async function resetRecipeEditorToCreateMode() {
    recipeid = null
    clearRecipeManageTable()
    if (did('recipeform')) did('recipeform').reset()
    setRecipeActionMode(false)
    const currentSalesPoint = String(did('salespointname')?.value || '').trim()
    await handlerecipedepartment(currentSalesPoint || default_department)
}

async function recipeActive() {
    recalldatalist()

    let form = document.querySelector('#recipeform')
    if (form.querySelector('#recipesubmit')) form.querySelector('#recipesubmit').addEventListener('click', recipeFormSubmitHandler)
    if (form.querySelector('#recipeupdate')) form.querySelector('#recipeupdate').addEventListener('click', recipeFormSubmitHandler)
    if (form.querySelector('#recipereset')) form.querySelector('#recipereset').addEventListener('click', resetRecipeEditorToCreateMode)
    if (document.querySelector('#salespointname')) document.querySelector('#salespointname').addEventListener('change', e => handlerecipedepartment())
    setRecipeActionMode(false)

    datasource = []
    await handlerecipedepartment(default_department)

    const activeRoute = new URLSearchParams(window.location.search).get('r')
    const defaultTabElement = activeRoute === 'viewrecipe'
        ? did('recipeoptioner_view')
        : did('recipeoptioner_recipe')
    if (defaultTabElement) runoptioner(defaultTabElement)

    await viewrecipeActive()

    if (sessionStorage.getItem('recipeid')) {
        recipeid = sessionStorage.getItem('recipeid')
        sessionStorage.removeItem('recipeid')
        if (did('recipeoptioner_recipe')) runoptioner(did('recipeoptioner_recipe'))
        await fetchrecipe(recipeid)
    }

    refreshRecipeTableTotal()
}

async function handlerecipedepartment(store) {
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
            recipeInventoryDatasource = request.data
            if (request.data.filter(data => data.composite == 'YES').length < 1) return did('loading').innerHTML = 'No Composite Item can be found for this department'
            if (request.data.filter(data => data.composite == 'NO').length < 1) return did('loading').innerHTML = 'No Non-Composite Item can be found for this department'
            did('itembuild').innerHTML = `<option value=''>-- Select Item To Build --</option>`
            did('itembuild').innerHTML += request.data.map(data => {
                if (data.composite == 'YES') return `<option value='${data.itemid}'>${data.itemname}</option>`
            }).join('')
            did('item').innerHTML = `<option value=''>-- Select Item --</option>`
            did('item').innerHTML += request.data.map(data => {
                if (data.composite == 'NO') return `<option value='${data.itemid}'>${data.itemname}</option>`
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

function clearRecipeManageTable() {
    did('recipetabledata').innerHTML = ''
    runCount('datatable', 'sn')
    refreshRecipeTableTotal()
}

function appendRecipeTableRow(itemId, quantity) {
    const selectedItemId = String(itemId || '').trim()
    const enteredQuantity = parseRecipeAmount(quantity)
    if (!selectedItemId || enteredQuantity <= 0) return

    const unitPrice = getRecipeItemUnitPrice(selectedItemId)
    const linePrice = unitPrice * enteredQuantity

    let element = document.createElement('tr')
    let x = `<td class="opacity-70 w-3 sn">  </td>
                <td class="opacity-70" name="itemid"> ${selectedItemId} </td>
                <td class="opacity-70"> ${getLabelByValue('item', selectedItemId)} </td>
                <td class="opacity-70"><input type="number" value='${enteredQuantity}' name="qty" id="${generateUID()}" class="form-control verify" placeholder="Enter Quantity of Item" oninput="updateRecipeRowTotal(this)"></td>
                <td class="opacity-70 recipe-item-unit-price" data-raw="${unitPrice}">${formatNumber(unitPrice)}</td>
                <td class="opacity-70 recipe-item-total" data-raw="${linePrice}">${formatNumber(linePrice)}</td>
                <td class="flex items-center gap-3">
                    <button title="Delete item" onclick="removebuilditem(this, '${selectedItemId}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">remove</button>
                </td>`
    element.innerHTML = x
    hideOptionByValue('item', selectedItemId)
    did('recipetabledata').appendChild(element)
}

function setItemToBuildValueFromCompositeData(data) {
    const candidateValues = [
        data?.compositeitem,
        data?.compositeitemdetail?.compositeitem,
        data?.compositeitemdetail?.itemid
    ].map(value => String(value || '').trim()).filter(Boolean)

    for (const value of candidateValues) {
        if (Array.from(did('itembuild').options).some(option => String(option.value) === value)) {
            did('itembuild').value = value
            return
        }
    }

    const itemName = String(data?.compositeitemdetail?.itemname || '').trim().toLowerCase()
    if (!itemName) return
    const optionByName = Array.from(did('itembuild').options).find(option => String(option.textContent || '').trim().toLowerCase() === itemName)
    if (optionByName) did('itembuild').value = optionByName.value
}

async function fetchrecipe(id) {
    if (!id) return
    recipeid = id
    setRecipeActionMode(true)
    function getparamm() {
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchcompositeitemscript', getparamm(), null, 'json')
    if (!id) document.getElementById('recipetabledata').innerHTML = `No records retrieved`
    if (request.status) {
        let thedata = request.data.filter(dat => String(dat?.compositeitemdetail?.id) === String(id))[0]
        if (!thedata) return notification('No records retrieved')

        const salesPoint = String(thedata?.compositeitemdetail?.salespoint || '').trim()
        if (salesPoint) did('salespointname').value = salesPoint
        await handlerecipedepartment(salesPoint || did('salespointname').value || default_department)

        setItemToBuildValueFromCompositeData(thedata)
        clearRecipeManageTable()

        ;(thedata.compositememberitems || []).forEach(item => {
            appendRecipeTableRow(item?.itemid, item?.qty)
        })
        runCount('datatable', 'sn')
        refreshRecipeTableTotal()
    }
    else return notification('No records retrieved')
}

function addrecipeitem() {
    if (!validateForm('recipeform', ['item', 'quantity'])) return

    appendRecipeTableRow(document.getElementById('item').value, document.getElementById('quantity').value)
    runCount('datatable', 'sn')
    did('item').value = ''
    did('quantity').value = ''
    refreshRecipeTableTotal()
}

function removebuilditem(element, value) {
    element.parentElement.parentElement.remove()
    hideOptionByValue('item', value, false)
    runCount('datatable', 'sn')
    refreshRecipeTableTotal()
}

async function removerecipe(id) {
    const confirmed = window.confirm('Are you sure you want to remove this recipe?')
    if (!confirmed) return

    function getparamm() {
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }

    let request = await httpRequest2('../controllers/removevisacountries', id ? getparamm() : null, null, 'json')
    fetchrecipe()
    return notification(request.message)
}

async function onrecipeTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchrecipe('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removerecipe('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
        .join('')
    injectPaginatatedTable(rows)
}

async function recipeFormSubmitHandler() {
    if (!validateForm('recipeform', getIdFromCls('verify'))) return notification('Please ensure all compulsory fields are filled', 0)
    if (!validateForm('recipeform', ['itembuild'])) return notification('Item to build was not selected', 0)
    if (!document.getElementById('recipetabledata').children[0]) return notification('No items selected to build with', 0)

    function payload() {
        let param = new FormData()
        param.append('salespoint', document.getElementById('salespointname').value)
        param.append('itemtobuildid', document.getElementById('itembuild').value)
        if (recipeid) param.append('id', recipeid)
        const qtyElements = document.getElementsByName('qty')
        const itemIdElements = document.getElementsByName('itemid')
        const rowTotalElements = document.querySelectorAll('#recipetabledata .recipe-item-total')
        for (let i = 0; i < qtyElements.length; i++) {
            const qtyValue = parseRecipeAmount(qtyElements[i].value)
            const rowPrice = parseRecipeAmount(rowTotalElements[i]?.dataset?.raw || 0)
            if (qtyValue) param.append(`itemid${i + 1}`, itemIdElements[i].textContent)
            param.append(`qty${i + 1}`, qtyValue)
            param.append(`price${i + 1}`, rowPrice)
        }
        param.append('gridsize', qtyElements.length)
        return param
    }
    const actionButton = recipeid ? document.querySelector('#recipeform #recipeupdate') : document.querySelector('#recipeform #recipesubmit')
    let request = await httpRequest2('../controllers/builditemscript.php', payload(), actionButton)
    if (request.status) {
        notification('Record saved successfully!', 1)
        recipeid = null
        sessionStorage.removeItem('recipeid')
        setRecipeActionMode(false)
        document.querySelector('#recipe').click()
        return
    }
    document.querySelector('#recipe').click()
    return notification(request.message, 0)
}


let viewrecipeid
let viewrecipeDatasource = []
let filteredViewrecipeDatasource = []
let groupedViewrecipeDatasource = []
let expandedViewrecipeGroups = new Set()

async function viewrecipeActive() {
    const form = document.querySelector('#viewrecipeform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', e=>fetchviewrecipe())
    if(did('viewrecipesearch')) did('viewrecipesearch').addEventListener('input', applyViewrecipeFilters)
    if(did('viewrecipesalespointfilter')) did('viewrecipesalespointfilter').addEventListener('change', applyViewrecipeFilters)
    if(did('clearviewrecipefilters')) did('clearviewrecipefilters').addEventListener('click', clearViewrecipeFilters)
    datasource = []
    await fetchviewrecipe()
}

async function fetchviewrecipe(id='') {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData(did('viewrecipeform'))
        if(id)paramstr.append('id', id) 
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchcompositeitemscript', getparamm(), document.querySelector('#viewrecipeform #submit'), 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                viewrecipeDatasource = request.data
                datasource = request.data
                syncViewrecipeSalesPointFilterOptions(viewrecipeDatasource)
                applyViewrecipeFilters()
            } else {
                viewrecipeDatasource = []
                filteredViewrecipeDatasource = []
                datasource = []
                syncViewrecipeSalesPointFilterOptions([])
                did('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No records retrieved</td></tr>`
                const tableStatus = document.querySelector('.table-status')
                if(tableStatus) tableStatus.innerHTML = ''
            }
        }else{
             viewrecipeid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

function clearViewrecipeFilters() {
    if(did('viewrecipesearch')) did('viewrecipesearch').value = ''
    if(did('viewrecipesalespointfilter')) did('viewrecipesalespointfilter').value = ''
    applyViewrecipeFilters()
}

function syncViewrecipeSalesPointFilterOptions(data) {
    const salesPointFilter = did('viewrecipesalespointfilter')
    if(!salesPointFilter) return
    const uniqueSalesPoints = [...new Set(
        (data || [])
            .map(item => item?.compositeitemdetail?.salespoint)
            .filter(Boolean)
    )].sort((a, b) => String(a).localeCompare(String(b)))

    salesPointFilter.innerHTML = `
        <option value="">All sales points</option>
        ${uniqueSalesPoints.map(point => `<option value="${point}">${point}</option>`).join('')}
    `
}

function getViewrecipeSearchText(item){
    const base = [
        item?.compositeitemdetail?.salespoint || '',
        item?.compositeitemdetail?.itemname || '',
        item?.compositeitemdetail?.groupname || '',
        item?.compositeitemdetail?.description || '',
        item?.compositeitemdetail?.units || '',
        item?.compositeitemdetail?.cost || '',
        item?.compositeitemdetail?.price || ''
    ].join(' ')
    const members = (item?.compositememberitems || []).map(dat => `${dat?.itemname || ''} ${dat?.qty || ''}`).join(' ')
    return `${base} ${members}`.toLowerCase()
}

function parseViewrecipeAmount(value) {
    const normalized = String(value ?? '').replace(/,/g, '').trim()
    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : 0
}

function getViewrecipeGroupKey(item) {
    return String(item?.compositeitemdetail?.itemname || '').trim().toLowerCase()
}

function groupViewrecipeByItem(data = []) {
    const groups = new Map()
    ;(data || []).forEach(item => {
        const key = getViewrecipeGroupKey(item)
        if (!key) return
        if (!groups.has(key)) {
            groups.set(key, {
                groupkey: key,
                itemname: item?.compositeitemdetail?.itemname || '',
                units: item?.compositeitemdetail?.units || '',
                groupname: item?.compositeitemdetail?.groupname || '',
                description: item?.compositeitemdetail?.description || '',
                records: []
            })
        }
        groups.get(key).records.push(item)
    })
    return Array.from(groups.values())
}

function toggleViewrecipeGroup(groupKey) {
    if (!groupKey) return
    if (expandedViewrecipeGroups.has(groupKey)) expandedViewrecipeGroups.delete(groupKey)
    else expandedViewrecipeGroups.add(groupKey)
    onviewrecipeTableDataSignal()
}

function getViewrecipeIngredientUnitPrice(ingredient) {
    return parseViewrecipeAmount(ingredient?.price ?? ingredient?.unitprice ?? ingredient?.unit_price ?? ingredient?.cost ?? 0)
}

function applyViewrecipeFilters() {
    const search = (did('viewrecipesearch')?.value || '').toLowerCase().trim()
    const salesPoint = (did('viewrecipesalespointfilter')?.value || '').toLowerCase().trim()
    filteredViewrecipeDatasource = (viewrecipeDatasource || []).filter(item => {
        const itemSalesPoint = String(item?.compositeitemdetail?.salespoint || '').toLowerCase()
        const matchesSalesPoint = !salesPoint || itemSalesPoint === salesPoint
        const matchesSearch = !search || getViewrecipeSearchText(item).includes(search)
        return matchesSalesPoint && matchesSearch
    })

    groupedViewrecipeDatasource = groupViewrecipeByItem(filteredViewrecipeDatasource)
    datasource = groupedViewrecipeDatasource
    if(groupedViewrecipeDatasource.length) {
        resolvePagination(groupedViewrecipeDatasource, onviewrecipeTableDataSignal)
        return
    }
    did('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No matching recipes found</td></tr>`
    const tableStatus = document.querySelector('.table-status')
    if(tableStatus) tableStatus.innerHTML = ''
}

async function removeviewrecipe(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this viewrecipe?");

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
    fetchviewrecipe()
    return notification(request.message);
    
}


async function onviewrecipeTableDataSignal() {
    let rows = getSignaledDatasource().map((group) => {
        const groupKey = group.groupkey
        const encodedGroupKey = encodeURIComponent(groupKey)
        const isExpanded = expandedViewrecipeGroups.has(groupKey)
        const detailsRow = isExpanded ? `
            <tr>
                <td colspan="100%" class="bg-slate-50">
                    <div class="p-3">
                        <div class="table-content">
                            <table>
                                <thead>
                                    <tr>
                                        <th>s/n</th>
                                        <th>sales point</th>
                                        <th>cost</th>
                                        <th>price</th>
                                        <th>item name</th>
                                        <th>quantity</th>
                                        <th>price</th>
                                        <th>total price</th>
                                        <th>action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${group.records.map((record, recordIndex) => {
                                        const ingredientRows = (record?.compositememberitems || []).map(ingredient => {
                                            const qtyValue = parseViewrecipeAmount(ingredient?.qty || 0)
                                            const unitPrice = getViewrecipeIngredientUnitPrice(ingredient)
                                            const linePrice = qtyValue * unitPrice
                                            return {
                                                itemname: ingredient?.itemname || '',
                                                qty: qtyValue,
                                                linePrice
                                            }
                                        })
                                        const entryTotalPrice = ingredientRows.reduce((sum, row) => sum + row.linePrice, 0)
                                        return `
                                            <tr>
                                                <td>${recordIndex + 1}</td>
                                                <td>${record?.compositeitemdetail?.salespoint || ''}</td>
                                                <td>${formatNumber(record?.compositeitemdetail?.cost || 0)}</td>
                                                <td>${formatNumber(record?.compositeitemdetail?.price || 0)}</td>
                                                <td>${ingredientRows.length ? ingredientRows.map(row => `<div>${row.itemname}</div>`).join('') : 'No item'}</td>
                                                <td>${ingredientRows.length ? ingredientRows.map(row => `<div>${formatNumber(row.qty)}</div>`).join('') : '-'}</td>
                                                <td>${ingredientRows.length ? ingredientRows.map(row => `<div>${formatNumber(row.linePrice)}</div>`).join('') : '-'}</td>
                                                <td>${formatNumber(entryTotalPrice)}</td>
                                                <td class="flex items-center gap-3">
                                                    <button title="View Item" onclick="modalviewrecipe('${record?.compositeitemdetail?.id}')" class="material-symbols-outlined rounded-full bg-green-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
                                                    <button title="Edit row entry" onclick="if(did('recipeoptioner_recipe'))runoptioner(did('recipeoptioner_recipe'));fetchrecipe('${record?.compositeitemdetail?.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
                                                    <button title="Delete row entry" onclick="removeviewrecipe('${record?.compositeitem}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
                                                </td>
                                            </tr>
                                        `
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </td>
            </tr>
        ` : ''

        return `
            <tr>
                <td>${group.index + 1}</td>
                <td>${group.itemname}</td>
                <td>${group.units}</td>
                <td>${group.groupname}</td>
                <td>${group.description}</td>
                <td class="flex items-center gap-3">
                    <button title="${isExpanded ? 'Collapse' : 'Expand'} item" onclick="toggleViewrecipeGroup(decodeURIComponent('${encodedGroupKey}'))" class="material-symbols-outlined rounded-full bg-slate-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">${isExpanded ? 'expand_less' : 'expand_more'}</button>
                </td>
            </tr>
            ${detailsRow}
        `
    }).join('')
    injectPaginatatedTable(rows)
}

function modalviewrecipe (id){
    if(!id)return
    let data = viewrecipeDatasource.filter(dat=>dat.compositeitemdetail.id == id)[0]
    did('modaldetails').innerHTML = `
        <p class="!text-sm font-thin"><img src="../images/${data.compositeitemdetail.imageurl}" class="w-[100px] h-[100px]"></p>
        <div>
        <p class="!text-sm font-thin">Composite Item Name: <span class="uppercase !text-sm font-semibold" style="">${data.compositeitemdetail.itemname}</span></p>
        <p class="!text-sm font-thin">Composite Cost: <span class="uppercase !text-sm font-semibold" style="">${formatNumber(data.compositeitemdetail.cost)}</span></p>
        <p class="!text-sm font-thin">Composite Price: <span class="uppercase !text-sm font-semibold" style="">${formatNumber(data.compositeitemdetail.price)}</span></p>
        <p class="!text-sm font-thin">Composite units: <span class="uppercase !text-sm font-semibold" style="">${data.compositeitemdetail.units}</span></p>
        <p class="!text-sm font-thin">Composite group name: <span class="uppercase !text-sm font-semibold" style="">${data.compositeitemdetail.groupname}</span></p>
        <p class="!text-sm font-thin">Composite description: <span class="uppercase !text-sm font-semibold" style="">${data.compositeitemdetail.description}</span></p>
        </div>
    `;
     did('tabledata2').innerHTML = 'No Items set for this composite item'
     if(data.compositememberitems.length > 0)did('tabledata2').innerHTML = data.compositememberitems.map((dat, i)=>`
            <tr>
                <td>${i+1}</td>
                <td>${dat.itemid}</td>
                <td>${dat.itemname}</td>
                <td style="width: 20px">${formatNumber(dat.qty)}</td>
            </tr> 
     `);
     did('viewrecipemodal').classList.remove('hidden')
}
 
async function viewrecipeFormSubmitHandler() {
    if(!validateForm('viewrecipeform', [`productname`, `productdescription`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#viewrecipeform'), viewrecipeid ? [['id', viewrecipeid]] : null)
    let request = await httpRequest2('../controllers/viewrecipecript', payload, document.querySelector('#viewrecipeform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#viewrecipeform').reset();
        fetchviewrecipe();
        return
    }
    document.querySelector('#viewrecipeform').reset();
    fetchviewrecipe();
    return notification(request.message, 0);
}


// function runAdviewrecipeFormValidations() {
//     let form = document.getElementById('viewrecipeform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#viewrecipename'))  controls.push([form.querySelector('#viewrecipename'), 'viewrecipe name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }

