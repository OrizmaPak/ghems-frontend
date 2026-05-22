(function(){
let datasource = []

const postingMasterControllers = {
    list: 'fetchpmreservationsbyfilter',
    single: 'fetchpmreservationbyid',
    save: 'pmreservations',
    payment: 'invoicing',
    balance: 'getreservationrefbalance',
    receiptFallback: 'fetchpmreservationbyref',
    roomStatus: 'getallpmroomstatus',
    currentRoomBalance: 'fetchcurrentroombalance',
    ratecode: 'fetchratecode',
    bookingPlan: 'fetchbookingplan',
    guestLookup: 'fetchguestbyfilter',
    guestSave: 'guests',
    discountCoupon: 'fetchdiscountcoupon',
    travelAgencyList: 'fetchtravelagency',
    companyList: 'fetchcompanyforgroups',
    guestGroupList: 'fetchguestgroup',
    travelAgencySave: 'travelagency',
    companySave: 'companyforgroups',
    guestGroupSave: 'guestgroup',
    banks: 'fetchbanks.php',
    reverseCheckin: 'reversecheckin',
    reverseReservation: 'reversereservation',
    reservations: 'reservations',
    reservationcheckin: 'reservationcheckin',
    cancelreservation: 'cancelreservation',
    transferroom: 'transferroom',
    extendstay: 'extendstay',
    reducestay: 'reducestay.php'
}

function postingMasterController(key) {
    return `../controllers/${postingMasterControllers[key] || key}`
}

const POSTING_MASTER_ROOM_CATEGORY = 'POSTING MASTER'
let postingMasterRoomCategoryObserver = null
let postingMasterApplyingRoomCategoryRestriction = false

function postingMasterRoomCategoryName(item = {}) {
    return String(item?.category || item?.categoryname || item?.roomcategory || item?.roomcategoryname || '').trim()
}

function postingMasterAllowedRoomCategories() {
    const categories = Array.isArray(rumcat) ? rumcat : []
    return categories.filter((item) => postingMasterRoomCategoryName(item).toUpperCase() === POSTING_MASTER_ROOM_CATEGORY)
}

function postingMasterKeepOnlyPostingMasterOption(selectEl) {
    if(!selectEl) return false
    const options = Array.from(selectEl.querySelectorAll('option'))
    if(!options.length) return false
    const match = options.find((option) => String(option.textContent || '').trim().toUpperCase() === POSTING_MASTER_ROOM_CATEGORY)
    if(!match) return false
    const value = String(match.value || '').trim()
    const label = String(match.textContent || '').trim() || POSTING_MASTER_ROOM_CATEGORY
    selectEl.innerHTML = `<option value="${value}">${label}</option>`
    selectEl.value = value
    return true
}

function postingMasterApplyRoomCategoryRestriction(root = document) {
    if(postingMasterApplyingRoomCategoryRestriction) return
    postingMasterApplyingRoomCategoryRestriction = true
    try {
        const allowed = postingMasterAllowedRoomCategories()
        const roomCategorySelects = Array.from((root || document).querySelectorAll('.roomcategory'))
        const roomTypeSelect = did('room-type')

        if(allowed.length){
            const defaultCategory = allowed[0]
            const optionsHtml = allowed.map((item) => `<option value="${item.id}">${postingMasterRoomCategoryName(item) || POSTING_MASTER_ROOM_CATEGORY}</option>`).join('')
            roomCategorySelects.forEach((select) => {
                select.innerHTML = optionsHtml
                select.value = String(defaultCategory.id)
            })
            if(roomTypeSelect){
                roomTypeSelect.innerHTML = optionsHtml
                roomTypeSelect.value = String(defaultCategory.id)
            }
            return
        }

        roomCategorySelects.forEach((select) => postingMasterKeepOnlyPostingMasterOption(select))
        postingMasterKeepOnlyPostingMasterOption(roomTypeSelect)
    } finally {
        postingMasterApplyingRoomCategoryRestriction = false
    }
}

function postingMasterScheduleRoomCategoryRestriction(root = document) {
    postingMasterApplyRoomCategoryRestriction(root)
    ;[150, 400, 900, 1500].forEach((delay) => {
        setTimeout(() => postingMasterApplyRoomCategoryRestriction(root), delay)
    })
}

function postingMasterStartRoomCategoryRestrictionObserver() {
    if(postingMasterRoomCategoryObserver || !document.body) return
    let pending = false
    postingMasterRoomCategoryObserver = new MutationObserver((mutations) => {
        if(pending || postingMasterApplyingRoomCategoryRestriction) return
        const shouldRestrict = mutations.some((mutation) => {
            const target = mutation.target
            if(target?.classList?.contains('roomcategory') || target?.id === 'room-type') return true
            return Array.from(mutation.addedNodes || []).some((node) => {
                if(!node?.querySelector && !node?.classList) return false
                return node.classList?.contains('roomcategory') || node.id === 'room-type' || !!node.querySelector?.('.roomcategory, #room-type')
            })
        })
        if(!shouldRestrict) return
        pending = true
        setTimeout(() => {
            pending = false
            postingMasterApplyRoomCategoryRestriction()
        }, 0)
    })
    postingMasterRoomCategoryObserver.observe(document.body, { childList: true, subtree: true })
}

let checkinid
let populateddata // this is to hold the data populated
let rr // this means a store roomcategory object for when the user enters the room number
let ratedata // this holds the rate amount details pertaining to the rate code in the room  category
let discountcoup = [] // Posting Master keeps discount fields neutral for controller compatibility.
let planobj // this is used to keep the plan object
let nameandidofguest  // this will carry an array of the name and id of the newly created guest
let actionid // this is the variable that will hold id in memory for me
let distribute = "YES"
const checkinOtherDetailsPromptState = {}
const checkinRateDataByCard = {}
const checkinRateSourceByCard = {}
const checkinSubmitLocks = {}
const CHECKIN_PENDING_PAYMENT_RECEIPT_KEY = 'postingmaster_pending_payment_receipt'
let checkinOrgContextChangeLock = false
let checkinViewTableSource = []

function postingMasterNormalizeReservationRow(row = {}) {
    const normalized = { ...row }
    normalized.reservations = normalized.reservations || {}
    const roomRows = Array.isArray(normalized.roomgeustrow)
        ? normalized.roomgeustrow
        : Array.isArray(normalized.roomguestrow)
            ? normalized.roomguestrow
            : []
    normalized.roomgeustrow = roomRows.map((roomRow) => ({
        ...roomRow,
        roomdata: roomRow?.roomdata || {},
        guest1: Array.isArray(roomRow?.guest1) ? roomRow.guest1 : [],
        guest2: Array.isArray(roomRow?.guest2) ? roomRow.guest2 : [],
        guest3: Array.isArray(roomRow?.guest3) ? roomRow.guest3 : [],
        guest4: Array.isArray(roomRow?.guest4) ? roomRow.guest4 : []
    }))
    normalized.roomguestrow = normalized.roomgeustrow
    return normalized
}

function postingMasterBuildCheckinViewSearchText(item = {}) {
    const reservation = item?.reservations || {}
    const roomRows = item?.roomgeustrow || item?.roomguestrow || []
    const roomText = roomRows.map((row) => {
        const roomData = row?.roomdata || {}
        const guests = []
        ;['guest1', 'guest2', 'guest3', 'guest4'].forEach((key) => {
            const guest = row?.[key]?.[0]
            if(!guest) return
            guests.push(`${guest.firstname || ''} ${guest.lastname || ''} ${guest.othernames || ''} ${guest.phone || ''}`.trim())
        })
        return [
            roomData.roomnumber,
            roomData.roomcategoryname,
            roomData.ratecodename,
            guests.join(' ')
        ].filter(Boolean).join(' ')
    }).join(' ')

    return [
        reservation.reference,
        reservation.status,
        reservation.arrivaldate,
        reservation.departuredate,
        reservation.reservationdate,
        reservation.billinginfo,
        reservation.companyname,
        reservation.travelagentname,
        reservation.groupname,
        roomText
    ].filter(Boolean).join(' ').toLowerCase()
}

function postingMasterApplyCheckinViewFrontendSearch() {
    if(!did('postingmasterform') || !did('postingmasterviewfrontsearch')) return
    const source = Array.isArray(checkinViewTableSource) ? checkinViewTableSource : []
    const term = String(did('postingmasterviewfrontsearch').value || '').trim().toLowerCase()
    const filtered = term
        ? source.filter((item) => postingMasterBuildCheckinViewSearchText(item).includes(term))
        : source
    resolvePagination(filtered, postingMasterOncheckinTableDataSignal)
}

function postingMasterBindCheckinViewFrontendSearch() {
    const input = did('postingmasterviewfrontsearch')
    if(!input || input.dataset.boundCheckinSearch === '1') return
    input.dataset.boundCheckinSearch = '1'
    input.addEventListener('input', postingMasterApplyCheckinViewFrontendSearch)
}

function postingMasterNormalizeCheckinOrgType(value = '') {
    const normalized = String(value || '').trim().toUpperCase()
    if(normalized === 'TRAVEL AGENCY' || normalized === 'TRAVELAGENCY') return 'TRAVEL AGENCY'
    if(normalized === 'COMPANY') return 'COMPANY'
    return 'HOTEL'
}

function postingMasterGetCheckinSelectText(id = '') {
    const el = did(id)
    if(!el) return ''
    const option = el.options ? el.options[el.selectedIndex] : null
    return String(option?.textContent || option?.text || el.value || '').replace(/\s*\|\|.*$/, '').trim()
}

function postingMasterGetActiveCheckinRateContext() {
    const companyValue = String(did('company')?.value || '').trim()
    const agencyValue = String(did('travelagent')?.value || '').trim()
    if(companyValue && companyValue !== 'ADD COMPANY') {
        return { type: 'COMPANY', orgid: companyValue, orgname: postingMasterGetCheckinSelectText('company') || 'Company' }
    }
    if(agencyValue && agencyValue !== 'ADD TRAVEL AGENCY') {
        return { type: 'TRAVEL AGENCY', orgid: agencyValue, orgname: postingMasterGetCheckinSelectText('travelagent') || 'Travel agency' }
    }
    return { type: 'HOTEL', orgid: '', orgname: 'Hotel' }
}

function postingMasterGetCheckinRoomCategoryMeta(categoryId = '') {
    const id = String(categoryId || '').trim()
    if(!id || !Array.isArray(rumcat)) return null
    return rumcat.find(data => String(data?.id || data?.categoryid || '').trim() === id) || null
}

function postingMasterEnsureRateSourceNode(idd = '') {
    let node = did('ratesource-'+idd)
    if(node) return node
    const rateCodeNode = did('ratecodee-'+idd)
    if(!rateCodeNode || !rateCodeNode.parentElement) return null
    node = document.createElement('div')
    node.id = 'ratesource-'+idd
    node.className = 'mt-1 text-[11px] leading-snug rounded-md border px-2 py-1 bg-slate-50 text-slate-600 border-slate-200'
    rateCodeNode.parentElement.appendChild(node)
    return node
}

function postingMasterSetRateSourceMessage(idd = '', resolution = null) {
    const node = postingMasterEnsureRateSourceNode(idd)
    if(!node) return
    if(!resolution) {
        node.textContent = ''
        node.className = 'mt-1 text-[11px] leading-snug rounded-md border px-2 py-1 bg-slate-50 text-slate-600 border-slate-200'
        return
    }
    const isFallback = !!resolution.usedFallback
    const isOrg = resolution.sourceType === 'COMPANY' || resolution.sourceType === 'TRAVEL AGENCY'
    node.textContent = resolution.message || ''
    node.className = `mt-1 text-[11px] leading-snug rounded-md border px-2 py-1 ${
        isFallback
            ? 'bg-amber-50 text-amber-800 border-amber-200'
            : isOrg
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-sky-50 text-sky-800 border-sky-200'
    }`
}

function postingMasterResolveCategoryRateForActiveContext(categoryId = '') {
    const category = postingMasterGetCheckinRoomCategoryMeta(categoryId)
    if(!category) return null
    const context = postingMasterGetActiveCheckinRateContext()
    const mappings = Array.isArray(category.Organisationdata) ? category.Organisationdata : []
    const hotelRatecode = String(category.ratecode || '').trim()
    const hotelRatecodename = String(category.ratecodename || '').trim()
    const categoryName = String(category.category || category.categoryname || '').trim()

    if(context.type !== 'HOTEL') {
        const match = mappings.find(item => (
            postingMasterNormalizeCheckinOrgType(item?.organisationtype) === context.type &&
            String(item?.orgid || '').trim() === String(context.orgid || '').trim() &&
            String(item?.ratecode || '').trim()
        ))
        if(match) {
            const sourceLabel = context.type === 'COMPANY' ? 'Company' : 'Travel agency'
            return {
                category,
                categoryName,
                context,
                sourceType: context.type,
                usedFallback: false,
                ratecode: String(match.ratecode || '').trim(),
                ratecodename: String(match.ratecodename || '').trim(),
                hotelRatecode,
                hotelRatecodename,
                message: `${sourceLabel} rate code: ${context.orgname}`
            }
        }
        const missingLabel = context.type === 'COMPANY' ? 'company' : 'travel agency'
        return {
            category,
            categoryName,
            context,
            sourceType: 'HOTEL',
            usedFallback: true,
            ratecode: hotelRatecode,
            ratecodename: hotelRatecodename,
            hotelRatecode,
            hotelRatecodename,
            message: `No available ${missingLabel} rate code for ${context.orgname}. Using hotel rate code.`
        }
    }

    return {
        category,
        categoryName,
        context,
        sourceType: 'HOTEL',
        usedFallback: false,
        ratecode: hotelRatecode,
        ratecodename: hotelRatecodename,
        hotelRatecode,
        hotelRatecodename,
        message: 'Hotel rate code'
    }
}

async function postingMasterFetchCheckinRatecodeById(ratecode = '') {
    const id = String(ratecode || '').trim()
    if(!id) return null
    const payload = new FormData()
    payload.append('id', id)
    const request = await httpRequest2(postingMasterController('ratecode'), payload, null, 'json')
    if(request?.status && Array.isArray(request.data) && request.data.length) return request.data[0]
    return null
}

async function postingMasterConfirmCheckinRateUpgrade(idd = '', resolution = {}) {
    if(!resolution?.context || resolution.context.type === 'HOTEL') return false
    if(!window.Swal) return false
    const source = resolution.context.type === 'COMPANY' ? 'company' : 'travel agency'
    const category = resolution.categoryName || 'This room category'
    const response = await Swal.fire({
        title: 'Update Rate Code?',
        text: `${category}: this reservation is using hotel rate code. A ${source} rate code is now available for ${resolution.context.orgname}. Update this room to the organisation rate code?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, update',
        cancelButtonText: 'No, keep current',
        customClass: {
            confirmButton: 'btn btn-md !bg-blue-500 !text-white mx-2',
            cancelButton: 'btn btn-md !bg-gray-500 !text-white mx-2'
        },
        buttonsStyling: false
    })
    return !!response.isConfirmed
}

async function postingMasterResolveAndApplyRateForRoomCard(idd = actionid, options = {}) {
    idd = String(idd || actionid || '').trim()
    if(!idd || !did('roomcategory-'+idd)) return false
    actionid = idd
    const categoryId = String(did('roomcategory-'+idd).value || '').trim()
    if(!categoryId) {
        postingMasterSetRateSourceMessage(idd, null)
        return false
    }
    const resolution = postingMasterResolveCategoryRateForActiveContext(categoryId)
    if(!resolution || !resolution.ratecode) {
        postingMasterSetRateSourceMessage(idd, {
            usedFallback: true,
            message: `No rate code found for ${resolution?.categoryName || 'selected category'}.`
        })
        return false
    }

    const savedRatecode = String(did('ratecodee-'+idd)?.value || '').trim()
    let selectedResolution = resolution
    let selectedRatecode = resolution.ratecode
    let selectedRatecodename = resolution.ratecodename

    if(options.preserveExistingRate && savedRatecode) {
        selectedRatecode = savedRatecode
        selectedRatecodename = String(did('ratecodename-'+idd)?.value || resolution.ratecodename || '').trim()
        selectedResolution = {
            ...resolution,
            ratecode: selectedRatecode,
            ratecodename: selectedRatecodename
        }
        if(resolution.context.type !== 'HOTEL' && !resolution.usedFallback && savedRatecode !== resolution.ratecode) {
            const source = resolution.context.type === 'COMPANY' ? 'company' : 'travel agency'
            selectedResolution.usedFallback = savedRatecode === String(resolution.hotelRatecode || '').trim()
            selectedResolution.sourceType = selectedResolution.usedFallback ? 'HOTEL' : resolution.sourceType
            selectedResolution.message = selectedResolution.usedFallback
                ? `${resolution.categoryName || 'Room category'} is using the loaded hotel rate code. A ${source} rate code is available for ${resolution.context.orgname}.`
                : `${resolution.categoryName || 'Room category'} is using the loaded rate code. Current ${source} rate code differs for ${resolution.context.orgname}.`
        }
        postingMasterSetRateSourceMessage(idd, selectedResolution)
        checkinRateSourceByCard[idd] = selectedResolution
        const loadedRateDetail = await postingMasterFetchCheckinRatecodeById(selectedRatecode)
        if(loadedRateDetail) {
            ratedata = loadedRateDetail
            checkinRateDataByCard[idd] = loadedRateDetail
        }
        postingMasterCalculatetotals()
        return true
    }

    if(options.promptForUpgrade && resolution.context.type !== 'HOTEL' && !resolution.usedFallback && savedRatecode && savedRatecode === String(resolution.hotelRatecode || '').trim() && savedRatecode !== resolution.ratecode) {
        const shouldUpgrade = await postingMasterConfirmCheckinRateUpgrade(idd, resolution)
        if(!shouldUpgrade) {
            selectedRatecode = savedRatecode
            selectedRatecodename = resolution.hotelRatecodename || did('ratecodename-'+idd)?.value || ''
            selectedResolution = {
                ...resolution,
                sourceType: 'HOTEL',
                usedFallback: true,
                ratecode: selectedRatecode,
                ratecodename: selectedRatecodename,
                message: `${resolution.categoryName || 'Room category'} is still using hotel rate code for ${resolution.context.orgname}.`
            }
        }
    }

    if(did('ratecodename-'+idd)) did('ratecodename-'+idd).value = selectedRatecodename || ''
    if(did('ratecodee-'+idd)) did('ratecodee-'+idd).value = selectedRatecode || ''
    postingMasterSetRateSourceMessage(idd, selectedResolution)
    checkinRateSourceByCard[idd] = selectedResolution

    const rateDetail = await postingMasterFetchCheckinRatecodeById(selectedRatecode)
    if(!rateDetail) {
        return notification('No records retrieved')
    }
    ratedata = rateDetail
    checkinRateDataByCard[idd] = rateDetail
    if(did('plan-'+idd)) did('plan-'+idd).value = ''
    if(did('planamount-'+idd)) did('planamount-'+idd).value = 0
    if(did('discountcoupon-'+idd)) did('discountcoupon-'+idd).value = ''
    if(did('discountamount-'+idd)) did('discountamount-'+idd).value = 0
    if(did('plandiscountperc-'+idd)) did('plandiscountperc-'+idd).value = 0
    if(did('plandiscountamount-'+idd)) did('plandiscountamount-'+idd).value = 0
    postingMasterHandlecheckinrate(idd, false, { skipResolve: true })
    postingMasterCalculatetotals()
    return true
}

function postingMasterClearCalculatedRoomCardValues(idd = '') {
    ;[
        'ratecodename',
        'ratecodee',
        'plan',
        'planamount',
        'roomrate',
        'discountamount',
        'plandiscountamount'
    ].forEach((prefix) => {
        if(did(prefix+'-'+idd)) did(prefix+'-'+idd).value = ''
    })
    if(did('discountcoupon-'+idd)) did('discountcoupon-'+idd).value = ''
    delete checkinRateDataByCard[idd]
    delete checkinRateSourceByCard[idd]
    postingMasterSetRateSourceMessage(idd, null)
    postingMasterUpdateRoomRatePerDayLabel(idd)
}

function postingMasterUpdateRoomRatePerDayLabel(idd = '') {
    const id = String(idd || '').trim()
    if(!id) return
    const label = did('roomrate-label-'+id) || document.querySelector(`[data-roomrate-label="${id}"]`)
    if(!label) return
    const roomRate = Number(did('roomrate-'+id)?.value || 0)
    const nights = Math.max(Number(did('numberofnights')?.value || 0), 1)
    const perDayRate = roomRate > 0 ? roomRate / nights : 0
    label.innerHTML = perDayRate
        ? `rate <span class="text-[10px] font-semibold text-slate-600 whitespace-nowrap">(${formatNumber(perDayRate)} Per Day)</span>`
        : 'rate'
    label.setAttribute('title', perDayRate ? `Rate per day based on ${nights} night${nights === 1 ? '' : 's'}` : 'Rate')
}

function postingMasterUpdateAllRoomRatePerDayLabels() {
    Array.from(document.getElementsByClassName('roomrate')).forEach((input) => {
        const id = String(input?.id || '').replace('roomrate-', '').trim()
        if(id) postingMasterUpdateRoomRatePerDayLabel(id)
    })
}

async function postingMasterRecalculateRoomCardAfterRoomSelection(cardId = '') {
    const idd = String(cardId || actionid || '').trim()
    if(!idd || !did('roomcategory-'+idd) || !did('roomnumber-'+idd)) {
        postingMasterCalculatetotals()
        return false
    }
    actionid = idd
    if(!String(did('roomcategory-'+idd).value || '').trim() || !String(did('roomnumber-'+idd).value || '').trim()) {
        postingMasterCalculatetotals()
        return false
    }
    postingMasterClearCalculatedRoomCardValues(idd)
    const resolved = await postingMasterResolveAndApplyRateForRoomCard(idd)
    if(!resolved) {
        postingMasterCalculatetotals()
        return false
    }
    postingMasterCalculatetotals()
    return true
}

async function postingMasterRecalculateAllRoomCardsForRateContext(reason = '', options = {}) {
    const cards = Array.from(document.getElementsByClassName('roomcategory'))
    if(!cards.length) {
        postingMasterCalculatetotals()
        return
    }
    for(const card of cards) {
        const id = String(card?.id || '').replace('roomcategory-', '').trim()
        if(!id || !String(card.value || '').trim()) continue
        await postingMasterResolveAndApplyRateForRoomCard(id, {
            promptForUpgrade: !!options.promptForUpgrade,
            preserveExistingRate: !!options.preserveExistingRate
        })
    }
    postingMasterCalculatetotals()
}

function postingMasterSetCheckinPaymentMethodDefaultCash() {
    const paymentMethodEl = did('paymentmethod')
    if (!paymentMethodEl) return
    if (paymentMethodEl.value) return
    paymentMethodEl.value = ''
    did('bankside')?.classList.add('invisible')
}

function postingMasterGetCheckinNumericValue(value = '') {
    const parsed = Number(String(value ?? '').replace(/,/g, '').trim())
    return Number.isFinite(parsed) ? parsed : 0
}

function postingMasterGetCheckinAmountPaidValue() {
    return postingMasterGetCheckinNumericValue(did('amountpaid')?.value || '')
}

function postingMasterGetCheckinResponseMessage(response, fallback = 'Unable to complete request. Please try again.') {
    if(typeof response === 'string' && response.trim()) return response
    return response?.message || response?.result || fallback
}

function postingMasterGetCheckinResponseReference(response = {}) {
    if(!response || typeof response !== 'object') return ''
    const data = response.data
    return String(
        response.reference ||
        response.ref ||
        data?.reference ||
        data?.ref ||
        (Array.isArray(data) ? data[0]?.reference || data[0]?.ref : '') ||
        did('referencer')?.value ||
        did('reference')?.value ||
        ''
    ).trim()
}

function postingMasterIsCheckinPaymentForm(formId = '') {
    return ['postingmasterform', 'guestreservationform', 'reservationpostingmasterform'].includes(formId)
}

function postingMasterGetCheckinFormRoot(formId = '') {
    return did(formId) || document
}

function postingMasterGetCheckinScopedElements(formId = '', className = '') {
    return Array.from(postingMasterGetCheckinFormRoot(formId).getElementsByClassName(className))
}

function postingMasterGetCheckinRequiredIds(formId = '') {
    let ids = []
    if(formId === 'guestreservationform') {
        ids = postingMasterGetGuestReservationRequiredIds()
    } else if(formId === 'cancelreservationform') {
        // Cancel reservation now requires only cancellation reason.
        ids = ['reasonforcancellation']
    } else if(formId === 'extendstayform') {
        ids = getIdFromCls('comp33', formId)
    } else {
        ids = getIdFromCls('comp', formId)
    }

    const optionalPaymentIds = ['amountpaid', 'paymentmethod', 'bankname', 'otherdetails', 'receivingbank']
    return ids.filter(id => id && !optionalPaymentIds.includes(id))
}

function postingMasterShowCheckinValidationFeedback(formId = '') {
    const form = did(formId)
    if(!form) return
    const errors = Array.from(form.querySelectorAll('.control-error'))
    if(!errors.length) return
    const messages = errors.map(error => String(error.textContent || '').trim()).filter(Boolean)
    const firstControl = errors[0].previousElementSibling
    const summary = messages.slice(0, 3).join(', ')
    notification(`Please complete: ${summary}${messages.length > 3 ? '...' : ''}`, 0, 7000)
    if(firstControl && typeof firstControl.scrollIntoView === 'function') {
        firstControl.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setTimeout(() => {
            try { firstControl.focus({ preventScroll: true }) } catch(_) {}
        }, 250)
    }
}

function postingMasterValidateSubmittedCheckinForm(formId = '') {
    const valid = validateForm(formId, postingMasterGetCheckinRequiredIds(formId))
    if(!valid) postingMasterShowCheckinValidationFeedback(formId)
    return valid
}

async function postingMasterConfirmCheckinNoPaymentSubmit() {
    const message = 'No amount paid entered. Continue without posting payment?'
    if(window.Swal) {
        const result = await Swal.fire({
            title: 'Continue Without Payment?',
            text: message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Continue',
            cancelButtonText: 'Make Payment',
            customClass: {
                confirmButton: 'btn btn-md !bg-blue-500 !text-white mx-2',
                cancelButton: 'btn btn-md !bg-green-600 !text-white mx-2'
            },
            buttonsStyling: false
        })
        return !!result.isConfirmed
    }
    return window.confirm ? window.confirm(message) : true
}

async function postingMasterRunCheckinOtherDetailsSubmitGuard(formId) {
    const amountPaid = postingMasterGetCheckinAmountPaidValue()
    if(amountPaid <= 0) {
        return postingMasterConfirmCheckinNoPaymentSubmit()
    }

    const paymentMethod = String((did('paymentmethod') && did('paymentmethod').value) || '').trim().toUpperCase()
    const bankName = String((did('bankname') && did('bankname').value) || '').trim()
    const otherDetails = String((did('otherdetails') && did('otherdetails').value) || '').trim()
    const receivingBank = getReceivingBankValue()

    if(!paymentMethod) {
        notification('Please select a payment method for the amount paid.', 0)
        did('modalformone')?.classList.remove('hidden')
        return false
    }

    // If transfer is selected, receiving bank remains mandatory.
    if (paymentMethod === 'TRANSFER') {
        if (!receivingBank) {
            notification('Please select receiving bank')
            did('modalformone').classList.remove('hidden')
            return false
        }
        checkinOtherDetailsPromptState[formId] = false
        return true
    }

    // For non-transfer methods, show a one-time confirmation before submit.
    if (!bankName && !otherDetails && !checkinOtherDetailsPromptState[formId]) {
        await Swal.fire({
            title: 'Confirm Without Other Details',
            text: 'You are about to submit without bank name and other details. Click submit again to continue.',
            icon: 'warning',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'btn btn-md !bg-blue-500 !text-white mx-2'
            },
            buttonsStyling: false
        })
        checkinOtherDetailsPromptState[formId] = true
        return false
    }

    return true
}

function postingMasterBindCheckinSubmitButton(formId = '') {
    const form = did(formId)
    const submitButton = form?.querySelector('#submit')
    if(!form || !submitButton) return
    submitButton.onclick = async (event) => {
        event?.preventDefault?.()
        return postingMasterCheckinnFormSubmitHandler(formId)
    }
}

async function postingMasterCheckinActive() {
    notification('Loading...')
    checkinid = ''
    checkinOtherDetailsPromptState.postingmasterform = false
    postingMasterStartRoomCategoryRestrictionObserver()
    // markallcomp()
    const form = document.querySelector('#postingmasterform')
    await postingMasterCheckinpopulatedl()
    postingMasterBindCheckinSubmitButton('postingmasterform')
    if(document.querySelector('#phone')) document.querySelector('#phone').addEventListener('change', e=>postingMasterHandlecheckinphone('phone'))
    // if(document.querySelector('#submitguestmodal')) document.querySelector('#submitguestmodal').addEventListener('click', e=>postingMasterSubmitguestform())
    if(document.querySelector('#submitcompany'))document.querySelector('#submitcompany').addEventListener('click', postingMasterCompanysubmithandler)
    if(document.querySelector('#submittravel'))document.querySelector('#submittravel').addEventListener('click', postingMasterTravelssubmithandler)
    if(document.querySelector('#submitgroups'))document.querySelector('#submitgroups').addEventListener('click', postingMasterGroupssubmithandler)
    if(document.querySelector('#company'))document.querySelector('#company').addEventListener('change', e=>postingMasterGroupcompanyres())
    if(document.querySelector('#travelagent'))document.querySelector('#travelagent').addEventListener('change', e=>postingMasterGrouptravelagentres())
    if(document.querySelector('#group_id'))document.querySelector('#group_id').addEventListener('change', e=>postingMasterGroupres())
    // if(document.querySelector('#roomcategory'))document.querySelector('#roomcategory').addEventListener('change', e=>postingMasterControlroomlist('roomcategory'))
    if(document.querySelector('#room-type'))document.querySelector('#room-type').addEventListener('change', e=>{
        if(!actionid)return
        did('roomcategory-'+actionid).value = did('room-type').value
        postingMasterControlroomlist(actionid, 'roomcategory')
    })
    // if(document.querySelector('#plandiscountperc'))document.querySelector('#plandiscountperc').addEventListener('change', e=>postingMasterCheckplandiscount())
    if(document.querySelector('#roomnumber'))document.querySelector('#roomnumber').addEventListener('click', e=>{
        if(document.querySelector('#roomnumber').getAttribute('readonly'))notification('Please Select a room category before you can select a room')
    })
    if(document.querySelector('#rummodalselectbtn'))document.querySelector('#rummodalselectbtn').addEventListener('click', e=>{
        if(did('room-no').value){
            did('roomnumber').value = did('room-no').value
            did('roommodal').classList.add('hidden')
        }
    })
    // if(document.querySelector('#discountcoupon'))document.querySelector('#discountcoupon').addEventListener('change', e=>postingMasterRuncouponcalculations())
    datasource = []
    await postingMasterFetchcheckinn()
    await postingMasterFetchtravelsres()
    await postingMasterFetchcompanyres()
    await postingMasterFetchgroupsres()
    await populateReceivingBankSelects()
    postingMasterScheduleRoomCategoryRestriction()
    did('initialroombtn').click()
    if(sessionStorage.getItem('postingmasterfromsomewhere')){
        let id = sessionStorage.getItem('postingmasterfromsomewhere')
        postingMasterFetchcheckinn(id)
        sessionStorage.removeItem('postingmasterfromsomewhere')
    }
    postingMasterFlushSubmittedCheckinPaymentReceipt()

}


async function postingMasterGroupssubmithandler(){
    if(!validateForm('groupofguestsform', getIdFromCls('comp', 'groupofguestsform')))return notification('some data are not provided...', 0)
    let payload

    payload = getFormData2(document.querySelector('#groupofguestsform'))
    let request = await httpRequest2(postingMasterController('guestGroupSave'), payload, document.querySelector('#groupofguestsform #submitgroups'))
    if(request.status) {
        did('groupform').classList.add('hidden')
            postingMasterFetchgroupsres('', document.querySelector('#groupname').value)
        notification(request.message, 1);
        return
    }

    return notification(request.message, 0);
}

async function postingMasterTravelssubmithandler(){
    if(!validateForm('travelagencyform', getIdFromCls('compt', 'travelagencyform')))return notification('some data are not provided...', 0)
    let payload

    payload = getFormData2(document.querySelector('#travelagencyform'))
    let request = await httpRequest2(postingMasterController('travelAgencySave'), payload, document.querySelector('#travelagencyform #submittravel'))
    if(request.status) {
        did('travelform').classList.add('hidden')
            postingMasterFetchtravelsres('', did('agencyname').value)
        return notification(request.message, 1);
    }
    // document.querySelector('#guestsform').reset();
    // fetchguestsreservations();
    return notification(request.message, 0);
}

async function postingMasterCompanysubmithandler(){
    if(!validateForm('companyform', getIdFromCls('compp', 'companyform')))return notification('some data are not provided...', 0)
    let payload

    payload = new FormData(document.getElementById('companyform'))
    let request = await httpRequest2(postingMasterController('companySave'), payload, document.querySelector('#submitcompany'))
    if(request.status) {
        did('companyformm').classList.add('hidden')
        postingMasterFetchcompanyres('', did('companyname').value)
        notification(request.message, 1)
        return
    }
    return notification(request.message, 0);
}

function postingMasterChecksessionstorage(id=''){
    if(document.getElementsByClassName('updater')[0])runoptioner(document.getElementsByClassName('updater')[0])
    if(sessionStorage.getItem('postingmasterfromsomewhere')){
        let id = sessionStorage.getItem('postingmasterfromsomewhere')
        postingMasterFetchcheckinn(id)
        sessionStorage.removeItem('postingmasterfromsomewhere')
    }
    if(id){
        postingMasterFetchcheckinn(id)
        sessionStorage.removeItem('postingmasterfromsomewhere')
    }
}

function postingMasterOpenGuestReservationForEdit(id = '') {
    const reservationId = String(id || '').trim()
    if(!reservationId) return
    const guestReservationUpdaterTab = document.querySelector('.optioner[name="guestreservationform"]')
    if(guestReservationUpdaterTab) runoptioner(guestReservationUpdaterTab)
    postingMasterFetchcheckinn(reservationId)
}

function postingMasterNormalizeRoomNumberDisplay(value = '') {
    const normalized = String(value ?? '').trim()
    if (!normalized || normalized === '0') return ''
    return normalized
}

function postingMasterNormalizeAmountPaidDisplay(value = 0) {
    const numeric = Number(value || 0)
    if (!numeric) return ''
    return formatNumber(numeric)
}

async function postingMasterRecalculateCheckinFormFromDates() {
    postingMasterDatedifference()
    const nightsValue = Number(document.querySelector('#numberofnights')?.value || 0)
    if(!nightsValue) {
        postingMasterCalculatetotals()
        return
    }
    await postingMasterRecalculateAllRoomCardsForRateContext('date-change')
}

function postingMasterDatedifference() {
            const startdate = document.querySelector('#arrivaldate').value;
            const enddate = document.querySelector('#departuredate').value;
            const nightInput = document.querySelector('#numberofnights');

            if (!startdate || !enddate) {
                notification("Please select both start and end dates.", 0);
                return;
            }

            const start = new Date(startdate);
            const end = new Date(enddate);
            if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
                notification("Please enter valid arrival and departure dates.", 0);
                nightInput.value = '';
                return;
            }

            // Nights are based on calendar dates, not raw hour difference.
            const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
            const dayDifference = (endDay - startDay) / (1000 * 60 * 60 * 24);

            if (dayDifference < 0) {
                notification("Invalid: End date is before start date.", 0);
                document.querySelector('#arrivaldate').value = ''
                document.querySelector('#departuredate').value = ''
                nightInput.value = '';
                return;
            }

            nightInput.value = dayDifference;
            // if a room is selected prior to entering the page this set of code below sets
            if(sessionStorage.getItem('roomsetting')){
                try{
                    let roomsetting = sessionStorage.getItem('roomsetting')
                    sessionStorage.removeItem('roomsetting')
                    document.getElementsByName('roomcategory')[0].value = roomsetting.split('_')[0]
                    document.getElementsByName('roomnumber')[0].parentElement.nextElementSibling.classList.remove('hidden')
                    document.getElementsByName('roomnumber')[0].parentElement.nextElementSibling.click()
                    notification('Please wait Loading selected room...')
                    // Set an interval to check the condition every 0.5 seconds
                    let checkInterval = setInterval(function() {
                        // Check if the innerHTML of the element with id 'roomtable' is 'Loading...'
                        if (document.getElementById('roomtable').innerHTML !== 'Loading...') {
                            // Clear the interval once the condition is met
                            clearInterval(checkInterval);


                            // Run the code below when the condition is met
                            if (document.getElementsByName(`${roomsetting.split('_')[1]}`)[0]) {
                                document.getElementsByName(`${roomsetting.split('_')[1]}`)[0].click();
                                notification('Room selected has been successfully loaded...', 1);
                            } else {
                                notification('Room selected could not be loaded, maybe the date range doesn\'t fall within the room\'s availability', 0);
                            }
                        }
                    }, 1500); // 500 milliseconds equals 0.5 seconds

                }catch(err){
                    notification('Room selected could not be loaded, maybe the date range doesnt fall within the rooms availability', 0)
                }
            }
        }

function postingMasterGetCheckinSummarySelectText(id = '') {
    const el = did(id)
    if(!el || !el.value || el.value === 'ADD COMPANY' || el.value === 'ADD TRAVEL AGENCY' || el.value === 'ADD GROUP') return ''
    if(el.tagName === 'SELECT') return String(el.options?.[el.selectedIndex]?.textContent || el.value || '').trim()
    return String(el.value || '').trim()
}

function postingMasterEscapeCheckinSummaryText(value = '') {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]))
}

function postingMasterGetCheckinSummaryGuests(roomId = '') {
    const container = did('moreguestcontainer-'+roomId)
    if(!container) return []
    return Array.from(container.querySelectorAll('input[id^="guest-'+roomId+'_"]'))
        .map((input, index) => {
            const rawValue = String(input.value || '').trim()
            if(!rawValue) return null
            const [nameAndPhone] = rawValue.split('_')
            return {
                serial: index + 1,
                name: String(nameAndPhone || rawValue).trim(),
                rawValue
            }
        })
        .filter(Boolean)
}

function postingMasterCollectCheckinTariffSummaryData(){
    const nights = Math.max(Number(did('numberofnights')?.value || 0), 1)
    const rooms = Array.from(document.getElementsByClassName('roomcategory')).map((categoryEl) => {
        const id = String(categoryEl.id || '').replace('roomcategory-', '').trim()
        if(!id) return null
        const categoryName = String(categoryEl.options?.[categoryEl.selectedIndex]?.textContent || categoryEl.value || '').trim()
        const roomNumber = String(did('roomnumber-'+id)?.value || '').trim()
        const rateCodeName = String(did('ratecodename-'+id)?.value || '').trim()
        const roomRate = Number(did('roomrate-'+id)?.value || 0)
        const oneDayTariff = roomRate / nights
        const guests = postingMasterGetCheckinSummaryGuests(id).slice(0, 1)
        if(!categoryEl.value && !roomNumber && !rateCodeName && !roomRate) return null
        return {
            id,
            categoryName,
            roomNumber,
            rateCodeName,
            roomRate,
            oneDayTariff,
            guests,
            adults: 1,
            children: 0,
            infants: 0
        }
    }).filter(Boolean)
    const totalRoomRate = rooms.reduce((sum, room) => sum + room.roomRate, 0)
    const totalDue = Number(did('totalamount')?.value || totalRoomRate)
    const formDetails = [
        ['Arrival', String(did('arrivaldate')?.value || '').replace('T', ' ')],
        ['Departure', String(did('departuredate')?.value || '').replace('T', ' ')],
        ['Nights', Number(did('numberofnights')?.value || 0) > 0 ? String(did('numberofnights').value) : ''],
        ['Company', postingMasterGetCheckinSummarySelectText('company')],
        ['Travel Agency', postingMasterGetCheckinSummarySelectText('travelagent')],
        ['Group', postingMasterGetCheckinSummarySelectText('group_id')],
        ['Source', postingMasterGetCheckinSummarySelectText('source')],
        ['Billing Info', postingMasterGetCheckinSummarySelectText('billinginfo')]
    ].filter((detail) => String(detail[1] || '').trim())

    return {
        nights,
        rooms,
        formDetails,
        netTariff: totalRoomRate / nights,
        netTariffAfterDiscount: totalRoomRate / nights,
        totalNetTariffForNights: totalDue,
        totalRoomRate,
        totalRoomDiscount: 0,
        totalPlanAmount: 0,
        totalPlanDiscount: 0,
        otherDiscountPerc: 0,
        otherDiscountTotal: 0,
        totalDiscount: 0
    }
}

function postingMasterRenderSummaryMetric(label, value, tone='text-slate-900') {
    return `<div class="rounded border border-slate-200 bg-white p-3">
        <div class="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">${label}</div>
        <div class="mt-1 text-lg font-bold ${tone}">${formatNumber(value)}</div>
    </div>`
}

function postingMasterSetCheckinTariffSummaryTab(tab = 'calculation') {
    const container = did('checkinTariffSummary')
    if(!container) return
    container.dataset.tab = tab
    postingMasterRenderCheckinTariffSummary()
}

function postingMasterRenderCheckinSummaryTabButton(tab, activeTab, label, icon) {
    const isActive = tab === activeTab
    return `<button type="button" onclick="postingMasterSetCheckinTariffSummaryTab('${tab}')" class="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold border-b-2 ${isActive ? 'border-blue-500 text-blue-700 bg-blue-50' : 'border-transparent text-slate-600 hover:bg-slate-50'}">
        <span class="material-symbols-outlined text-base">${icon}</span>
        ${label}
    </button>`
}

function postingMasterRenderCheckinCalculationSummary(data) {
    const nightLabel = `${data.nights} ${data.nights === 1 ? 'Night' : 'Nights'}`
    return `
        ${data.formDetails.length ? `<div class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
            ${data.formDetails.map(([label, value]) => `<div class="rounded bg-white border border-slate-200 px-3 py-2">
                <div class="text-[11px] uppercase text-slate-500 font-semibold">${postingMasterEscapeCheckinSummaryText(label)}</div>
                <div class="text-sm font-semibold text-slate-800 truncate" title="${postingMasterEscapeCheckinSummaryText(value)}">${postingMasterEscapeCheckinSummaryText(value)}</div>
            </div>`).join('')}
        </div>` : ''}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            ${postingMasterRenderSummaryMetric('Rate Per Day', data.netTariff)}
            ${postingMasterRenderSummaryMetric(`Total Due for ${nightLabel}`, data.totalNetTariffForNights, 'text-blue-700')}
            ${postingMasterRenderSummaryMetric('Rooms', data.rooms.length)}
        </div>
        <div class="md:hidden space-y-3">
            ${data.rooms.length ? data.rooms.map((room) => {
                return `<div class="rounded border border-slate-200 bg-white p-3">
                    <div class="flex items-start justify-between gap-3 border-b border-slate-100 pb-2 mb-2">
                        <div>
                            <div class="font-bold text-slate-800">${postingMasterEscapeCheckinSummaryText(room.categoryName || '-')}</div>
                            ${room.roomNumber ? `<div class="text-xs text-slate-500">Room ${postingMasterEscapeCheckinSummaryText(room.roomNumber)}</div>` : ''}
                        </div>
                        <div class="text-right">
                            <div class="text-[11px] uppercase text-slate-500 font-semibold">Total Due</div>
                            <div class="font-bold text-blue-700">${formatNumber(room.roomRate)}</div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-sm">
                        <div class="rounded bg-slate-50 p-2">
                            <div class="text-[11px] uppercase text-slate-500 font-semibold">Rate Code</div>
                            <div class="font-semibold text-slate-800 truncate" title="${postingMasterEscapeCheckinSummaryText(room.rateCodeName || '-')}">${postingMasterEscapeCheckinSummaryText(room.rateCodeName || '-')}</div>
                        </div>
                        <div class="rounded bg-slate-50 p-2">
                            <div class="text-[11px] uppercase text-slate-500 font-semibold">Net Rate (One Day)</div>
                            <div class="font-semibold">${formatNumber(room.oneDayTariff)}</div>
                        </div>
                        <div class="rounded bg-slate-50 p-2">
                            <div class="text-[11px] uppercase text-slate-500 font-semibold">Net Rate Total</div>
                            <div class="font-semibold">${formatNumber(room.roomRate)}</div>
                        </div>
                    </div>
                </div>`
            }).join('') : `<div class="rounded border border-dashed border-slate-200 bg-white p-4 text-center text-slate-500">No room tariff data yet</div>`}
        </div>
        <div class="hidden md:block rounded border border-slate-200 bg-white overflow-auto">
            <table class="w-full text-sm min-w-[900px]">
                <thead class="bg-[#64748b] text-white">
                    <tr>
                        <th class="p-2 text-left">Room</th>
                        <th class="p-2 text-left">Rate Code</th>
                        <th class="p-2 text-right">Net Rate (One Day)</th>
                        <th class="p-2 text-right">Total Due</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.rooms.length ? data.rooms.map((room) => {
                        return `<tr class="border-t border-slate-100 align-top">
                            <td class="p-2">
                                <div class="font-semibold text-slate-800">${postingMasterEscapeCheckinSummaryText(room.categoryName || '-')}</div>
                                ${room.roomNumber ? `<div class="text-xs text-slate-500">Room ${postingMasterEscapeCheckinSummaryText(room.roomNumber)}</div>` : ''}
                            </td>
                            <td class="p-2 text-slate-700">${postingMasterEscapeCheckinSummaryText(room.rateCodeName || '-')}</td>
                            <td class="p-2 text-right font-semibold">${formatNumber(room.oneDayTariff)}</td>
                            <td class="p-2 text-right font-bold text-blue-700">${formatNumber(room.roomRate)}</td>
                        </tr>`
                    }).join('') : `<tr><td colspan="4" class="p-4 text-center text-slate-500">No room tariff data yet</td></tr>`}
                </tbody>
            </table>
        </div>`
}

function postingMasterRenderCheckinGuestsSummary(data) {
    return `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
            ${data.rooms.length ? data.rooms.map((room, index) => `<div class="rounded border border-slate-200 bg-white p-3">
                <div class="flex items-start justify-between gap-3 border-b border-slate-100 pb-2 mb-3">
                    <div>
                        <div class="text-xs uppercase font-bold text-slate-500">Room ${index + 1}</div>
                        <div class="text-base font-bold text-slate-800">${postingMasterEscapeCheckinSummaryText(room.categoryName || 'Room Category')}</div>
                        ${room.roomNumber ? `<div class="text-xs text-slate-500">Room No: ${postingMasterEscapeCheckinSummaryText(room.roomNumber)}</div>` : ''}
                    </div>
                    <div class="text-right">
                        <div class="text-xs uppercase font-bold text-slate-500">Guests</div>
                        <div class="text-lg font-bold text-blue-700">${room.guests.length || room.adults || 0}</div>
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-2 mb-3">
                    <div class="rounded bg-slate-50 p-2 text-center">
                        <div class="text-[11px] text-slate-500 font-semibold uppercase">Adults</div>
                        <div class="font-bold">${formatNumber(room.adults)}</div>
                    </div>
                    <div class="rounded bg-slate-50 p-2 text-center">
                        <div class="text-[11px] text-slate-500 font-semibold uppercase">Children</div>
                        <div class="font-bold">${formatNumber(room.children)}</div>
                    </div>
                    <div class="rounded bg-slate-50 p-2 text-center">
                        <div class="text-[11px] text-slate-500 font-semibold uppercase">Infants</div>
                        <div class="font-bold">${formatNumber(room.infants)}</div>
                    </div>
                </div>
                <div class="space-y-2">
                    ${room.guests.length ? room.guests.map((guest) => `<div class="flex items-center justify-between gap-2 rounded border border-slate-100 px-3 py-2">
                        <div class="font-semibold text-slate-800 truncate" title="${postingMasterEscapeCheckinSummaryText(guest.rawValue)}">${postingMasterEscapeCheckinSummaryText(guest.name)}</div>
                        <span class="text-xs font-bold text-slate-500">#${guest.serial}</span>
                    </div>`).join('') : `<div class="rounded border border-dashed border-slate-200 p-3 text-sm text-slate-500">No guest names entered yet</div>`}
                </div>
            </div>`).join('') : `<div class="rounded border border-dashed border-slate-200 bg-white p-4 text-center text-slate-500">No room or guest data yet</div>`}
        </div>`
}

function postingMasterRenderCheckinFullDetailSummary(data) {
    return `
        <div class="space-y-4">
            ${data.formDetails.length ? `<div class="rounded border border-slate-200 bg-white overflow-hidden">
                <div class="bg-[#64748b] text-white text-xs font-bold uppercase px-3 py-2">Booking Details</div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-2 p-3">
                    ${data.formDetails.map(([label, value]) => `<div class="rounded bg-slate-50 px-3 py-2">
                        <div class="text-[11px] uppercase text-slate-500 font-semibold">${postingMasterEscapeCheckinSummaryText(label)}</div>
                        <div class="text-sm font-bold text-slate-800 truncate" title="${postingMasterEscapeCheckinSummaryText(value)}">${postingMasterEscapeCheckinSummaryText(value)}</div>
                    </div>`).join('')}
                </div>
            </div>` : ''}
            <div class="rounded border border-slate-200 bg-white overflow-hidden">
                <div class="bg-[#64748b] text-white text-xs font-bold uppercase px-3 py-2">Room, Guest And Tariff Details</div>
                <div class="divide-y divide-slate-100">
                    ${data.rooms.length ? data.rooms.map((room, index) => {
                        const detailRows = [
                            ['Room Category', room.categoryName],
                            ['Room Number', room.roomNumber],
                            ['Rate Code', room.rateCodeName],
                            ['Net Rate (One Day)', formatNumber(room.oneDayTariff)],
                            ['Net Rate Total', formatNumber(room.roomRate)],
                            ['Total Due', formatNumber(room.roomRate)]
                        ].filter(([, value]) => String(value || '').trim())
                        return `<div class="p-3">
                            <div class="flex flex-wrap items-start justify-between gap-3 mb-3">
                                <div>
                                    <div class="text-xs font-bold uppercase text-slate-500">Room ${index + 1}</div>
                                    <div class="text-base font-bold text-slate-800">${postingMasterEscapeCheckinSummaryText(room.categoryName || 'Room')}</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-xs font-bold uppercase text-slate-500">Total Due</div>
                                    <div class="text-lg font-bold text-blue-700">${formatNumber(room.roomRate)}</div>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
                                ${detailRows.map(([label, value]) => `<div class="rounded bg-slate-50 px-3 py-2">
                                    <div class="text-[11px] uppercase text-slate-500 font-semibold">${postingMasterEscapeCheckinSummaryText(label)}</div>
                                    <div class="text-sm font-semibold text-slate-800 truncate" title="${postingMasterEscapeCheckinSummaryText(value)}">${postingMasterEscapeCheckinSummaryText(value)}</div>
                                </div>`).join('')}
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                                <div class="rounded border border-slate-100 px-3 py-2 text-center">
                                    <div class="text-[11px] uppercase text-slate-500 font-semibold">Adults</div>
                                    <div class="font-bold">${formatNumber(room.adults)}</div>
                                </div>
                                <div class="rounded border border-slate-100 px-3 py-2 text-center">
                                    <div class="text-[11px] uppercase text-slate-500 font-semibold">Children</div>
                                    <div class="font-bold">${formatNumber(room.children)}</div>
                                </div>
                                <div class="rounded border border-slate-100 px-3 py-2 text-center">
                                    <div class="text-[11px] uppercase text-slate-500 font-semibold">Infants</div>
                                    <div class="font-bold">${formatNumber(room.infants)}</div>
                                </div>
                            </div>
                            <div class="rounded bg-slate-50 p-2">
                                <div class="text-[11px] uppercase text-slate-500 font-bold mb-2">Guests</div>
                                ${room.guests.length ? `<div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    ${room.guests.map((guest) => `<div class="rounded bg-white border border-slate-100 px-3 py-2 flex items-center justify-between gap-2">
                                        <span class="font-semibold text-slate-800 truncate" title="${postingMasterEscapeCheckinSummaryText(guest.rawValue)}">${postingMasterEscapeCheckinSummaryText(guest.name)}</span>
                                        <span class="text-xs font-bold text-slate-500">#${guest.serial}</span>
                                    </div>`).join('')}
                                </div>` : `<div class="text-sm text-slate-500">No guest names entered yet</div>`}
                            </div>
                        </div>`
                    }).join('') : `<div class="p-4 text-center text-slate-500">No room data yet</div>`}
                </div>
            </div>
        </div>`
}

function postingMasterRenderCheckinTariffSummary(){
    const container = did('checkinTariffSummary')
    if(!container) return
    const data = postingMasterCollectCheckinTariffSummaryData()
    const isOpen = container.dataset.open === 'true'
    const activeTab = container.dataset.tab || 'calculation'
    container.innerHTML = `
        <div class="rounded border border-slate-200 bg-slate-50 shadow-sm overflow-hidden">
            <button type="button" onclick="postingMasterToggleCheckinTariffSummary()" class="w-full flex items-center justify-between gap-3 px-4 py-3 text-left bg-white hover:bg-slate-50 transition">
                <span class="flex items-center gap-2 font-semibold text-slate-800">
                    <span class="material-symbols-outlined text-blue-500 text-lg">summarize</span>
                    Tariff Summary
                </span>
                <span class="material-symbols-outlined text-slate-500 transition ${isOpen ? 'rotate-180' : ''}">expand_more</span>
            </button>
            <div class="${isOpen ? '' : 'hidden'} border-t border-slate-200 p-4">
                <div class="rounded border border-slate-200 bg-white overflow-hidden">
                    <div class="flex flex-wrap items-center border-b border-slate-200 bg-white">
                        ${postingMasterRenderCheckinSummaryTabButton('calculation', activeTab, 'Room Calculation', 'calculate')}
                        ${postingMasterRenderCheckinSummaryTabButton('guests', activeTab, 'Rooms & Guests', 'groups')}
                        ${postingMasterRenderCheckinSummaryTabButton('full', activeTab, 'Full Detail', 'fact_check')}
                    </div>
                    <div class="p-3">
                        ${activeTab === 'guests' ? postingMasterRenderCheckinGuestsSummary(data) : activeTab === 'full' ? postingMasterRenderCheckinFullDetailSummary(data) : postingMasterRenderCheckinCalculationSummary(data)}
                    </div>
                </div>
            </div>
        </div>`
}

function postingMasterToggleCheckinTariffSummary(){
    const container = did('checkinTariffSummary')
    if(!container) return
    container.dataset.open = container.dataset.open === 'true' ? 'false' : 'true'
    postingMasterRenderCheckinTariffSummary()
}

function postingMasterUpdateNetTariffFooterLabel(){
    const label = did('totalrate')?.previousElementSibling
    if(!label) return
    label.innerHTML = 'Rate <span class="block text-xs font-normal opacity-70">(per day)</span>'
    label.setAttribute('title', 'Rate amount per day')
}

function postingMasterRefreshCheckinSummaryAndTotals(reason = ''){
    postingMasterCalculatetotals()
}

function postingMasterRemoveCheckinRoomCard(button){
    const card = button?.parentElement
    if(card) card.remove()
    postingMasterRefreshCheckinSummaryAndTotals('room-card-delete')
}

function postingMasterRemoveCheckinGuestRow(button){
    const row = button?.parentElement?.parentElement
    if(row) row.remove()
    postingMasterRefreshCheckinSummaryAndTotals('guest-row-delete')
}

function postingMasterCalculatetotals(){
    postingMasterUpdateNetTariffFooterLabel()
    if(did('totalplan')?.previousElementSibling) did('totalplan').previousElementSibling.textContent = 'Total Due'
    let tr = 0;
    for(let i=0;i<document.getElementsByClassName('roomnumber').length;i++){
        tr = Number(document.getElementsByClassName('roomrate')[i].value)+tr
    }
    postingMasterUpdateAllRoomRatePerDayLabels()
    const grossTotalAmount = tr
    const nights = Math.max(Number(did('numberofnights')?.value || 0), 1)
    const oneDayNetTariff = grossTotalAmount / nights
    let totalamount = Math.max(grossTotalAmount, 0)
    did('totalrate').textContent = formatNumber(oneDayNetTariff)
    if(did('totaldiscount')) did('totaldiscount').textContent = formatNumber(0)
    if(did('totalplan')) did('totalplan').textContent = formatNumber(totalamount)
    if(document.getElementById('totalamount'))document.getElementById('totalamount').value = totalamount
    postingMasterRenderCheckinTariffSummary()
}

// this is the function that adds new card
async function postingMasterCheckinaddroom(){
    if(did('roomfullcontainer')?.children?.length >= 1) {
        postingMasterCalculatetotals()
        return
    }
    let id = genID()
    let el = document.createElement('div')
    el.classList.add('relative', 'border', 'rounded', 'py-3', 'px-4', 'mt-6', '!mb-2.5', 'bg-[#f5f5f5]', 'shadow-lg')
    el.setAttribute('onclick', `if(actionid != ${id}){actionid = ${id};postingMasterRunratcod()}`)
    el.innerHTML = `                            <button onclick="event.stopPropagation(); postingMasterRemoveCheckinRoomCard(this)" type="button" class="absolute top-[-25px] shadow right-0 flex justify-center items-center text-white w-10 h-10 bg-red-400 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1 me-1 mb-1 cark:bg-red-600 cark:hover:bg-red-700 focus:outline-none cark:focus:ring-red-800"><span class="material-symbols-outlined">delete</span></button>
                                                <button onclick="postingMasterCheckinaddroom()" type="button" class="hidden absolute top-[-25px] shadow right-14 justify-center items-center text-white w-10 h-10 bg-green-400 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 me-1 mb-1 cark:bg-green-600 cark:hover:bg-green-700 focus:outline-none cark:focus:ring-green-800"><span class="material-symbols-outlined">add</span></button>


                                                <!--Room Category room industry source-->
                                                <div class="grid grid-cols-1 !mb-1 lg:grid-cols-2 gap-10">
                                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                                        <div class="form-group">
                                                            <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">room category</label>
                                                            <select name="roomcategory" id="roomcategory-${id}" onchange="postingMasterControlroomlist('${id}', 'roomcategory')" class="bg-white roomcategory form-control comp !p-1 ">
                                                                <option>Loading...</option>
                                                            </select>
                                                        </div>
                                                        <div class="form-group !flex relative">
                                                            <div class="">
                                                                <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">Room</label>
                                                                <!--<input type="text" readonly  id="roomnumber" list="hems_available_roomnumber_id" onchange="checkdatalist(this);getcategoryrateguest(this)" class="bg-white form-control !p-2 comp2" placeholder="Enter root category">-->
                                                                <input type="text" readonly name="roomnumber"  id="roomnumber-${id}" class="bg-white form-control roomnumber !p-2 comp" placeholder="">
                                                                <!--<input type="text" name="roomnumber" id="roomnumber1" list="hems_available_roomnumber_id" onchange="checkdatalist(this);getcategoryrateguest(this)" class="bg-white form-control !p-2 comp2" placeholder="Enter root category">-->
                                                            </div>
                                                            <button id="searchroombtn-${id}" onclick="postingMasterOpentheroomboard('${id}')" type="button" class="scale-[0.7] absolute top-0 right-0 text-white w-10 h-10 bg-blue-400 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 me-1 mb-1 cark:bg-blue-600 cark:hover:bg-blue-700 focus:outline-none cark:focus:ring-blue-800"><span class="material-symbols-outlined">search</span></button>
                                                        </div>
                                                    </div>
                                                    <div class="grid grid-cols-1 lg:grid-cols-5 gap-10">
                                                            <div class="form-group hidden">
                                                                <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">adults</label>
                                                                <input type="number" value="1" readonly onchange="postingMasterHandlecheckinrate('${id}','true')" maxlength="2" name="adult" id="adult-${id}" class="bg-white adult form-control !p-2 comp" placeholder=""  oninput="enforceMaxLength(this)">
                                                            </div>
                                                            <div class="form-group hidden">
                                                                <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">children</label>
                                                                <input type="number" value="0" readonly onchange="postingMasterHandlecheckinrate('${id}','true')" maxlength="2" name="child" id="children-${id}" class="bg-white child form-control !p-2 comp2" placeholder=""  oninput="enforceMaxLength(this)">
                                                            </div>
                                                            <div class="form-group hidden">
                                                                <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">Infants</label>
                                                                <input type="number" value="0" readonly maxlength="2" name="infant" id="infant-${id}" class="bg-white infant form-control !p-2 comp2" placeholder=""  oninput="enforceMaxLength(this)">
                                                            </div>
                                                            <div class="form-group col-span-2">
                                                                <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">rate&nbsp;code</label>
                                                                <input type="text" name="ratecodename" list="hems_rate_code" onchange="checkdatalist(this, 'ratecodee-${id}', 'hems_rate_code_id')?postingMasterRunratcod('',true):postingMasterRunratcod('',true)" id="ratecodename-${id}" class="bg-transparent ratecodename !p-1 comp2 border" placeholder="">
                                                                <input type="text" readonly name="ratecode" id="ratecodee-${id}" class="bg-transparent ratecode !p-1 comp2 border hidden" placeholder="">
                                                                <div id="ratesource-${id}" class="mt-1 text-[11px] leading-snug rounded-md border px-2 py-1 bg-slate-50 text-slate-600 border-slate-200"></div>
                                                            </div>
                                                        </div>
                                            </div>

                                                <div class="grid grid-cols-1 !mb-1 lg:grid-cols-1 gap-10">
                                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                                            <div class="form-group hidden">
                                                                <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">plan</label>
                                                                <input type="text" name="plan" readonly value="" id="plan-${id}" class="bg-transparent plan !p-1 comp2 border" placeholder="">
                                                            </div>
                                                            <div class="form-group hidden">
                                                                <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">plan amount</label>
                                                                <input type="text" name="planamount" value="0" readonly id="planamount-${id}" class="bg-transparent planamount !p-1 comp2 border" placeholder="">
                                                            </div>
                                                            <div class="form-group">
                                                                <label for="roomrate-${id}" id="roomrate-label-${id}" data-roomrate-label="${id}" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">rate</label>
                                                                <input type="number" name="roomrate" id="roomrate-${id}" oninput="postingMasterCalculatetotals()" onchange="postingMasterCalculatetotals()" class="bg-transparent roomrate !p-1 comp2 border" >
                                                                <!--<select name="roomrate" onchange="getcategoryrateguest(document.getElementById('roomcategory'))" id="roomrate" class="bg-white  form-control !p-2 comp2" >-->
                                                                <!--</select>-->
                                                            </div>
                                                        </div>
                                                        <div class="hidden grid-cols-1 lg:grid-cols-4 gap-10">
                                                            <div class="form-group">
                                                                <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">discount&nbsp;coupon</label>
                                                                <select onchange="postingMasterRuncouponcalculations()" name="discountcoupon" id="discountcoupon-${id}" class="bg-white discountcoupon form-control !p-1 comp2">
                                                                    <option>Loading...</option>
                                                                </select>
                                                            </div>
                                                            <div class="form-group">
                                                                <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">discount&nbsp;amount</label>
                                                                <input type="text" name="discountamount" id="discountamount-${id}" class="bg-transparent discountamount !p-1 comp2 border" placeholder="">
                                                            </div>
                                                            <div class="form-group">
                                                                    <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">plan&nbsp;discount&nbsp;(%)</label>
                                                                    <input type="text" onchange="postingMasterCheckplandiscount()" name="plandiscountperc" id="plandiscountperc-${id}" class="bg-white plandiscountperc form-control !p-2 comp2" placeholder="">
                                                                </div>
                                                            <div class="form-group">
                                                                <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">plan&nbsp;discount</label>
                                                                <input type="text" readonly name="plandiscountamount" id="plandiscountamount-${id}" class="bg-transparent plandiscountamount !p-1 comp2 border" placeholder="" border>
                                                            </div>
                                                        </div>
                                                </div>


                                                <!--container for extra guest-->
                                                <div id="moreguestcontainer-${id}" class="moreguestcontainer">
                                                    <div class="grid grid-cols-1 lg:grid-cols-4 gap-2 mb-2">
                                                        <div class="form-group col-span-3">
                                                            <label for="logoname" class="control-label text-md">Guest</label>
                                                            <input type="text"  name="" id="guest-${id}_${id}" list="allguest" onchange="checkdatalist(this, 'guestid-${id}_${id}', 'allguest2')" class="bg-white comp form-control !p-2 comp bg-white" placeholder="Enter Guest Name">
                                                            <input type="text"  name="" id="guestid-${id}_${id}" class="bg-white guestid form-control !p-2 hidden" placeholder="">
                                                        </div>
                                                        <div class="w-full flex items-end justify-start">
                                                            <div class="flex px-2 items-center mb-4">
                                                                <input id="default-radio-1" type="radio" value="" name="default-radio_${id}" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                                                <label for="default-radio-1" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Leader</label>
                                                            </div>
                                                            <button onclick="postingMasterOpenguestform('guest-${id}_${id}', 'guestid-${id}_${id}');did('modalform').classList.remove('hidden')" type="button" class="w-full h-[35px] bg-[#468df7] md:w-max text-white text-sm capitalize p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                                    <div class="btnloader" style="display: none;"></div>
                                                                    <span>Add&nbsp;New&nbsp;Guest</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                    `
     did('roomfullcontainer').appendChild(el)
     if(Array.isArray(rumcat) && rumcat.length && did('roomcategory-'+id)){
        const allowed = postingMasterAllowedRoomCategories()
        if(allowed.length){
            did('roomcategory-'+id).innerHTML = allowed.map(data=>`<option value="${data.id}">${data.category}</option>`).join('')
            did('roomcategory-'+id).value = String(allowed[0].id)
        }else{
            did('roomcategory-'+id).innerHTML = `<option value="">-- Select Room Type --</option>`
        }
     }
     recalldatalist()
     postingMasterScheduleRoomCategoryRestriction(did('roomfullcontainer'))
     postingMasterAssignallcheckinlisteners()
     postingMasterCalculatetotals()
}

// this function is to assign listener to all roomcategory class elements
function postingMasterAssignallcheckinlisteners(){
    for(let i=0;i<document.getElementsByClassName('roomcategory').length;i++){
        if(document.getElementsByClassName('roomcategory')[i] && document.getElementsByClassName('roomcategory')[i].children.length > 0){
            if(document.getElementsByClassName('roomcategory')[i])document.getElementsByClassName('roomcategory')[i].addEventListener('change', e=>postingMasterControlroomlist(document.getElementsByClassName('roomcategory')[i].id.split('-')[1], 'roomcategory'));
        }
        // if(document.getElementsByClassName('room-type')[i] && document.getElementsByClassName('room-type')[i].children.length > 0){
        //     if(document.getElementsByClassName('room-type')[i])document.getElementsByClassName('room-type')[i].addEventListener('change', e=>postingMasterControlroomlist(document.getElementsByClassName('room-type')[i].id.split('-')[1], 'room-type'))
        // }
    }
    postingMasterCalculatetotals()
}

function postingMasterOpentheroomboard(idd){
    actionid=idd;
    did('room-type').value = did('roomcategory-'+idd).value
    did('roommodal').classList.remove('hidden')
    postingMasterControlroomlist(idd, 'roomsearch')
}

function postingMasterCategorizeRoomsByBuilding(data) {
    return data.reduce((acc, room) => {
        const { building, floor } = room;

        // Find or create the building category
        let buildingCategory = acc.find(b => b.building === building);
        if (!buildingCategory) {
            buildingCategory = { building, floors: [] };
            acc.push(buildingCategory);
        }

        // Find or create the floor category within the building
        let floorCategory = buildingCategory.floors.find(f => f.floor === floor);
        if (!floorCategory) {
            floorCategory = { floor, rooms: [] };
            buildingCategory.floors.push(floorCategory);
        }

        // Add the room to the correct floor in the building
        floorCategory.rooms.push(room);

        return acc;
    }, []);
}

// now this is when the discount percent changes..... just to avoid overhead of tracking any major change in dependant input will clear the value in the plandiscountperc
function postingMasterCheckplandiscount(){
    if(!did('plan-'+actionid).value || did('planamount-'+actionid).value <= 0){
        did('plandiscountperc-'+actionid).value =''
        did('plandiscountamount-'+actionid).value =''
        postingMasterCalculatetotals()
        return notification('No plan in place to discount from', 0)
    }
    if(!did('plandiscountperc-'+actionid).value){
        did('plandiscountamount-'+actionid).value =''
        postingMasterCalculatetotals()
        return notification('Discount removed', 1)
    }
    if(did('plandiscountperc-'+actionid).value > 100)did('plandiscountperc-'+actionid).value = 100
    did('plandiscountamount-'+actionid).value = ((Number(did('plandiscountperc-'+actionid).value)/100)*(Number(did('planamount-'+actionid).value)))
    postingMasterCalculatetotals()
}

function postingMasterRuncouponcalculations(){
    if(!did('discountcoupon-'+actionid).value){
        did('discountamount-'+actionid).value = 0
        postingMasterCalculatetotals()
        return
    }
    if(!did('roomrate-'+actionid).value || did('roomrate-'+actionid).value == 0){did('discountcoupon-'+actionid).value = '';return notification('No rate to calculate with', 0)}
    let discounttype = discountcoup.filter(data=>data.id == did('discountcoupon-'+actionid).value)[0].discounttype
    let discount = discountcoup.filter(data=>data.id == did('discountcoupon-'+actionid).value)[0].discount
    console.log(discounttype, discount)
    if(discounttype == 'PERCENTAGE'){
        did('discountamount-'+actionid).value = Math.floor((Number(discount)/100)*Number(did('roomrate-'+actionid).value))
        // console.log(Math.floor((Number(discount)/100)*Number(did('roomrate').value)))
    }else{
        did('discountamount-'+actionid).value = Math.floor(Number(did('roomrate-'+actionid).value)-(Number(discount)))
        // console.log(Math.floor(Number(did('roomrate').value)-(Number(discount))))

    }
    postingMasterCalculatetotals()
}

// this is the function to get plan amount and im calling this function from the postingMasterRunratcod function
async function postingMasterGetplanamount(idd=actionid, rateData=ratedata){
    idd = String(idd || actionid || '').trim()
    if(!idd) return postingMasterCalculatetotals()
    actionid = idd
    rateData = rateData || checkinRateDataByCard[idd] || ratedata
    if(!rateData || rateData.plan == 0){
        if(did('planamount-'+idd))did('planamount-'+idd).value = '';
        if(did('plandiscountperc-'+idd))did('plandiscountperc-'+idd).value =''
        if(did('plandiscountamount-'+idd))did('plandiscountamount-'+idd).value =''
        postingMasterCheckplandiscount()
        postingMasterCalculatetotals()
        return notification('No plan available for the rate code')
    }
    function param(){
        let p = new FormData()
        p.append('id', rateData.plan)
        return p
    }
    let request = await httpRequest2(postingMasterController('bookingPlan'), param(), null, 'json')
    if(request.status) {
        planobj = request.data[0]
        if(did('adult-'+idd).value > 0)did('planamount-'+idd).value = Number(request.data[0].adultamount)
        if(did('children-'+idd).value > 0)did('planamount-'+idd).value = Number(request.data[0].adultamount)+Number(request.data[0].childamount)
    console.log(`${Number(request.data[0].adultamount)} ${Number(request.data[0].adultamount)+Number(request.data[0].childamount)}`)
        postingMasterCheckplandiscount()
    postingMasterCalculatetotals()
    }else notification('No records retrieved')
    postingMasterCalculatetotals()
}

// to populate the rate code and plan and also to give the ratedata the values needed for postingMasterHandlecheckinrate also note that the state parameter is set to true if its just a change in ratecode
async function postingMasterRunratcod(stop='', state=false){
    console.log('ratecode calculation started', state);
    if(!actionid)return notification('Something went wront.', 0)
    await postingMasterResolveAndApplyRateForRoomCard(actionid)
    postingMasterCalculatetotals()
}

// this is called when the adult and children changes
function postingMasterHandlecheckinrate(idd, state=false, options={}){
    if(!did('numberofnights').value)return notification('Please enter your arrival and departure date inorder to get your rates', 0);
    const allowOptionalReservationRoom = did('guestreservationform');
    if(did('roomcategory-'+idd) && did('roomnumber-'+idd)){
        if(!did('roomcategory-'+idd).value || (!allowOptionalReservationRoom && !did('roomnumber-'+idd).value))return notification('Please Enter room details', 0);
    }
    if(!idd & !actionid)return postingMasterCalculatetotals();
    if(!idd)idd = actionid;
    if(!actionid)actionid = idd;
    actionid = idd;
    if(did('adult-'+idd)) did('adult-'+idd).value = 1
    if(did('children-'+idd)) did('children-'+idd).value = 0
    if(did('infant-'+idd)) did('infant-'+idd).value = 0
    const activeRateData = checkinRateDataByCard[idd] || ratedata
    if(!activeRateData && !options.skipResolve){
        did('adult-'+idd).value = '';
        postingMasterResolveAndApplyRateForRoomCard(idd)
        return state ? notification('Please fill out the room details first') : '';
    }
    if(!activeRateData)return state ? notification('Please fill out the room details first') : '';
    ratedata = activeRateData
    did('roomrate-'+idd).value = Number(activeRateData.adult1 || 0)*Number(did('numberofnights').value || 0);
    if(did('plan-'+idd)) did('plan-'+idd).value = ''
    if(did('planamount-'+idd)) did('planamount-'+idd).value = 0
    if(did('discountcoupon-'+idd)) did('discountcoupon-'+idd).value = ''
    if(did('discountamount-'+idd)) did('discountamount-'+idd).value = 0
    if(did('plandiscountperc-'+idd)) did('plandiscountperc-'+idd).value = 0
    if(did('plandiscountamount-'+idd)) did('plandiscountamount-'+idd).value = 0
    postingMasterCalculatetotals()
}

// this is the function that is called when room category changes
async function postingMasterControlroomlist(idd, type){
    if(!idd)return
    if(!document.querySelector('#arrivaldate').value)return notification('Please enter a valid arrival date', 0)
    const isRoomSearch = type === 'roomsearch'
    // if(type == 'roomcategory'){
    //     document.querySelector(`#room-type-${idd}`).value = document.querySelector(`#room-type`).value
    // }
    // if(type == 'room-type'){
    //     document.querySelector(`#room-type-${idd}`).value = document.querySelector(`#room-type-${idd}`).value
    // }
    if(!isRoomSearch){
        document.getElementById('ratecodename-'+idd).value = ''
        document.getElementById('ratecodee-'+idd).value = ''
        document.getElementById('roomrate-'+idd).value = ''
        document.getElementById('roomnumber-'+idd).value = ''
        if(document.getElementById('discountcoupon-'+idd))document.getElementById('discountcoupon-'+idd).value = ''
        if(document.getElementById('discountamount-'+idd))document.getElementById('discountamount-'+idd).value = 0
        if(document.getElementById('adult-'+idd))document.getElementById('adult-'+idd).value = 1
        if(document.getElementById('children-'+idd))document.getElementById('children-'+idd).value = 0
        if(document.getElementById('infant-'+idd))document.getElementById('infant-'+idd).value = 0
        if(document.getElementById('plan-'+idd))document.getElementById('plan-'+idd).value = ''
        if(document.getElementById('planamount-'+idd))document.getElementById('planamount-'+idd).value = 0
        delete checkinRateDataByCard[idd]
        delete checkinRateSourceByCard[idd]
        postingMasterSetRateSourceMessage(idd, null)
    }
    if(!document.querySelector('#roomcategory-'+idd).value){
        document.getElementById('searchroombtn-'+idd).classList.remove('hidden')
        document.getElementById('roomnumber-'+idd).value = ''
        document.getElementById('ratecodee-'+idd).value = ''
        document.getElementById('ratecodename-'+idd).value = ''

    }else{
        document.getElementById('searchroombtn-'+idd).classList.remove('hidden')
        if(did('guestreservationform')){
            if(!document.getElementById('adult-'+idd).value)document.getElementById('adult-'+idd).value = 1
            actionid = idd
        }
        if(!isRoomSearch) await postingMasterResolveAndApplyRateForRoomCard(idd)
        did('roomtable').innerHTML = 'Loading...'
        function param(){
            let p = new FormData()
            p.append('arrivaldate', document.querySelector('#arrivaldate').value.replace('T',' '))
            p.append('departuredate', document.querySelector('#departuredate').value.replace('T',' '))
            return p
        }
        let request = await httpRequest(postingMasterController('roomStatus'), param(), null, 'json')
        if(request.status) {
            // document.getElementById('roomlist-'+idd).innerHTML = request.data.map(data=>`<option value="${data.roomnumber}">${data.roomname}</option>`).join('')
            console.log('data b4 postingMasterCategorizeRoomsByBuilding', request.data)
            let data = postingMasterCategorizeRoomsByBuilding(request.data)
            console.log('data after postingMasterCategorizeRoomsByBuilding', data)
            postingMasterRenderRoomTable(data);

        }
        else{did('roomtable').innerHTML = request.message; return notification('No records retrieved')}

    }
    postingMasterCalculatetotals()
}

const postingMasterRenderRoomTable = (data) => {
  const container = document.getElementById('roomtable');
  container.innerHTML = data.map(buildingData => `
    <div class="building-section mb-8">
      <h2 class="text-2xl font-bold text-center bg-green-800 text-white px-2 mb-4">
        ${buildingData.building}
      </h2>
      ${buildingData.floors.map(floorData => `
        <div class="floor-section mb-6">
          <h3 class="text-xl font-semibold text-white px-2 bg-blue-700 mb-3">
            Floor ${floorData.floor}
          </h3>
          <div class="room-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            ${floorData.rooms.map(room => `
              <div class="room-card border border-gray-300 dark:border-gray-700 p-4 rounded-lg shadow-sm transition-transform transform hover:scale-105">
                <div class="room-images flex gap-2 mb-3">
                  <img src="${room.imageurl1 && room.imageurl1 != '-' ? room.imageurl1 : './images/emptyrooom.png'}" alt="Room Image 1" class="w-1/2 h-32 object-cover rounded">
                  <img src="${room.imageurl2 && room.imageurl2 != '-' ? room.imageurl2 : './images/emptyrooom.png'}" alt="Room Image 2" class="w-1/2 h-32 object-cover rounded">
                </div>
                <div class="room-info">
                  <p class="text-gray-600 dark:text-gray-400 text-sm">
                    <span class="font-medium">Room Name:</span> ${room.roomname}
                  </p>
                  <p class="text-gray-600 dark:text-gray-00 text-sm">
                    <span class="font-medium">Room Number:</span> <span class="text-black">${room.roomnumber}</span>
                  </p>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">
                    <span class="font-medium">Status:</span>
                    <span class="inline-block px-3 py-1 rounded-lg text-white ${postingMasterGetStatusClass(room.roomstatus)}">
                      ${room.roomstatus}/${room.roomstatusdescription || '-'}
                    </span>
                  </p>
                </div>
                <button
                  class="mt-4 w-full py-2 rounded-lg text-white ${postingMasterGetButtonClass(room.roomstatus)}"
                  onclick="postingMasterHandleRoomClick(${room.roomstatus === 'AVAILABLE' || room.roomstatus === 'CHECKED OUT'}, ${room.roomnumber}, ${actionid})"
                >
                  Select Room
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');
};

const postingMasterGetStatusClass = (status) => {
  switch(status) {
    case 'AVAILABLE':
      return 'text-green-500';
    case 'CHECKED OUT':
      return 'text-green-500';
    case 'OCCUPIED':
    case 'CHECKED IN':
      return 'text-red-500';
    case 'MTN BLK':
      return 'text-gray-500';
    case 'RESERVED':
      return 'text-yellow-500';
    case 'MGT BLK':
      return 'text-purple-500';
    default:
      return 'text-gray-400';
  }
};

const postingMasterGetButtonClass = (status) => {
  switch(status) {
    case 'AVAILABLE':
    case 'CHECKED OUT':
      return 'bg-green-600 hover:bg-green-700';
    case 'OCCUPIED':
    case 'CHECKED IN':
      return 'bg-red-600 hover:bg-red-700';
    case 'MTN BLK':
      return 'bg-gray-600 hover:bg-gray-700';
    case 'RESERVED':
      return 'bg-yellow-600 hover:bg-yellow-700';
    case 'MGT BLK':
      return 'bg-purple-600 hover:bg-purple-700';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

const postingMasterHandleRoomClick = async (isAvailable, roomNumber, actionId) => {
  if (isAvailable) {
    document.getElementById(`roomnumber-${actionId}`).value = roomNumber;
    actionid = actionId;
    await postingMasterRecalculateRoomCardAfterRoomSelection(actionId);
    notification(`Room ${roomNumber} Selected`, 1);
    document.getElementById('roommodal').classList.add('hidden');
  } else {
    notification('Room is not available for selection', 0);
  }
};



function postingMasterGroupcompanyres(){
    if(!did('company').value){
        postingMasterRecalculateAllRoomCardsForRateContext('company-cleared')
        return
    }
    if(did('company').value == 'ADD COMPANY'){
        did('companyformm').classList.remove('hidden')
        return
    }
    // if(did('company1').value == 'ADD COMPANY'){
    //     did('companyformm').classList.remove('hidden')
    // }
    if(checkinOrgContextChangeLock) return
    checkinOrgContextChangeLock = true
    if(did('travelagent')) did('travelagent').value = ''
    checkinOrgContextChangeLock = false
    postingMasterRecalculateAllRoomCardsForRateContext('company-change')
}
function postingMasterGrouptravelagentres(){
    if(!did('travelagent').value){
        postingMasterRecalculateAllRoomCardsForRateContext('travelagency-cleared')
        return
    }
    if(did('travelagent').value == 'ADD TRAVEL AGENCY'){
        did('travelform').classList.remove('hidden')
        return
    }
    if(did('travelagent1') && did('travelagent1').value == 'ADD TRAVEL AGENCY'){
        did('travelform').classList.remove('hidden')
        return
    }
    if(checkinOrgContextChangeLock) return
    checkinOrgContextChangeLock = true
    if(did('company')) did('company').value = ''
    checkinOrgContextChangeLock = false
    postingMasterRecalculateAllRoomCardsForRateContext('travelagency-change')
}
function postingMasterGroupres(){
    if(!did('group_id').value)return notification('Please note that agency name is required if you cannot find your group name select Add GROUP', 0)
    if(did('group_id').value == 'ADD GROUP'){
        did('groupform').classList.remove('hidden')
    }
}


async function postingMasterFetchtravelsres(id='', name) {
    let request = await httpRequest2(postingMasterController('travelAgencyList'), null, null, 'json')
    if(request.status) {
        did('travelagent').innerHTML = `<option value="">-- Select Travel Agency --</option><option class="bg-[green] text-white font-semibold">ADD TRAVEL AGENCY</option>`;
        did('travelagent').innerHTML += request.data.map(dat=>`<option value="${dat.id}">${dat.agencyname}</option>`).join('')
        // did('travelagent1').innerHTML = `<option value="">-- Select Travel Agency --</option><option class="bg-[green] text-white font-semibold">ADD TRAVEL AGENCY</option>`;
        did('travelagent1').innerHTML = request.data.map(dat=>`<option value="${dat.id}">${dat.agencyname}</option>`).join('')
        if(name){
                    did('travelagent').value = request.data.filter(dat=>dat.agencyname == name)[0].id
                }
    }
    else return notification('No records retrieved')
}
async function postingMasterFetchcompanyres(id='', name) {
    let request = await httpRequest2(postingMasterController('companyList'), null, null, 'json')
    if(request.status) {
                did('company').innerHTML = `<option value="">-- Select Company --</option><option class="bg-[green] text-white font-semibold">ADD COMPANY</option>`;
                did('company').innerHTML += request.data.map(dat=>`<option value="${dat.id}">${dat.companyname}</option>`).join('')
                // did('company1').innerHTML = `<option value="">-- Select Company --</option><option class="bg-[green] text-white font-semibold">ADD COMPANY</option>`;
                did('company1').innerHTML = request.data.map(dat=>`<option value="${dat.id}">${dat.companyname}</option>`).join('')
                if(name){
                    did('company').value = request.data.filter(dat=>dat.companyname == name)[0].id
                }
    }
    else return notification('No records retrieved')
}
async function postingMasterFetchgroupsres(id='', name) {
    postingMasterSetupReservationTypePaymentRequirement()
    let request = await httpRequest2(postingMasterController('guestGroupList'), null, null, 'json')
        if(request.status) {
                did('group_id').innerHTML = `<option value="">-- Select Group --</option><option class="bg-[green] text-white font-semibold">ADD GROUP</option>`;
                did('group_id').innerHTML += request.data.map(dat=>`<option value="${dat.id}">${dat.groupname}</option>`).join('')
                if(name){
                    did('group_id').value = request.data.filter(dat=>dat.groupname == name)[0].id
                }
    }
    else return notification('No records retrieved')
}
async function postingMasterFetchdiscountcouponres() {
    let request = await httpRequest2(postingMasterController('discountCoupon'), null, null, 'json')
        if(request.status) {
            discountcoup = request.data
            for(let i=0;i<document.getElementsByClassName('discountcoupon').length;i++){
                document.getElementsByClassName('discountcoupon')[i].innerHTML = `<option value="">-- Select Discount Coupon --</option>`;
                document.getElementsByClassName('discountcoupon')[i].innerHTML += request.data.map(dat=>`<option value="${dat.id}">${dat.couponname}</option>`).join('')
            }
    }
    else return notification('No records retrieved')
}

// this handle the form that takes in guest data
function postingMasterOpenguestform(name, id){
    nameandidofguest = [name, id]
    did('modalformguest').innerHTML = `
        <div class="w-full flex justify-end">
                                            <span class="material-symbols-outlined text-red-500 cp hover:scale-[1.3] transition-all" onclick="did('modalform').classList.add('hidden')">close</span>
                                        </div>

                                        <form id="guestmodalform" class="flex flex-col rounded-sm">
                                            <div class=" border rounded p-2 !mb-2 bg-[#d1f2f7]">
                                                <div class="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 cark:bg-gray-800 cark:text-blue-400" role="alert">
                                                  <span class="font-medium">Note!</span> When you enter an already existing phone number the form get filled automatically
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label text-md">phone</label>
                                                    <input type="tel" name="phone" id="phone" onchange="postingMasterHandlecheckinphone('phone')" class="bg-white form-control !p-2 comp bg-white" placeholder="Enter Phone Number">
                                                    <input type="hidden" id="id" name="id"/>
                                                </div>
                                            </div>
                                            <div class=" border rounded p-2 !mb-2 bg-[#f5f5f5]">
                                                <div class="grid grid-cols-1 lg:grid-cols-2  gap-10">
                                                    <div class="grid grid-cols-1 lg:grid-cols-3  gap-10">
                                                        <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">title</label>
                                                        <select name="title" id="title" class="bg-white form-control !p-2 comp">
                                                            <option value="">-- Select Title --</option>
                                                            <option>Mr</option>
                                                            <option>Mrs</option>
                                                            <option>Miss</option>
                                                            <option>Ms</option>
                                                            <option>Master</option>
                                                            <option>Sir</option>
                                                            <option>Madam</option>
                                                            <option>Lord</option>
                                                            <option>Lady</option>
                                                            <option>Dame</option>
                                                            <option>Dr</option>
                                                            <option>Prof</option>
                                                            <option>Engr</option>
                                                            <option>Capt</option>
                                                            <option>Cmdr</option>
                                                            <option>Lt</option>
                                                            <option>Maj</option>
                                                            <option>Col</option>
                                                            <option>Gen</option>
                                                            <option>Rev</option>
                                                            <option>Rabbi</option>
                                                            <option>Imam</option>
                                                            <option>Sheikh</option>
                                                            <option>Hon</option>
                                                            <option>Sen</option>
                                                            <option>Rep</option>
                                                            <option>Amb</option>
                                                            <option>Pres</option>
                                                            <option>VP</option>
                                                            <option>Gov</option>
                                                            <option>Min</option>
                                                            <option>Sec</option>
                                                            <option>Dir</option>
                                                            <option>Duke</option>
                                                            <option>Duchess</option>
                                                            <option>Marquis</option>
                                                            <option>Marchioness</option>
                                                            <option>Earl</option>
                                                            <option>Countess</option>
                                                            <option>Viscount</option>
                                                            <option>Viscountess</option>
                                                            <option>Baron</option>
                                                            <option>Baroness</option>
                                                            <option>His/Her Excellency </option>
                                                            <option>His/Her Highness </option>
                                                            <option>His/Her Majesty </option>
                                                            <option>His/Her Holiness </option>
                                                            <option>His/Her Royal Highness</option>
                                                        </select>
                                                </div>
                                                        <div class="form-group col-span-2">
                                                            <label for="logoname" class="control-label text-md">first name</label>
                                                            <input type="text"  name="firstname" id="firstname" class="bg-white form-control !p-2 comp" placeholder="Enter First Name">
                                                    </div>
                                                    </div>
                                                    <div class="grid grid-cols-1 lg:grid-cols-2  gap-10">
                                                        <div class="form-group">
                                                            <label for="logoname" class="control-label text-md">last name</label>
                                                            <input type="text" name="lastname" id="lastname" class="bg-white form-control !p-2 comp" placeholder="Enter Last Name">
                                                    </div>
                                                        <div class="form-group">
                                                            <label for="logoname" class="control-label text-md">other names</label>
                                                            <input type="text"  name="othernames" id="othernames" class="bg-white form-control !p-2" placeholder="Enter Other Names">
                                                    </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="grid grid-cols-1  lg:grid-cols-2 gap-10">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label text-md">nationality</label>
                                                    <input type="text" name="nationality" id="nationality" class="bg-white form-control !p-2 comp" placeholder="Enter Nationality">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label text-md">residential address</label>
                                                    <textarea name="residentialaddress" id="residentialaddress" class="bg-white form-control !p-2" placeholder="Enter Residential Address"></textarea>
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label text-md">state</label>
                                                    <input type="text" name="state" id="state" class="bg-white form-control !p-2" placeholder="Enter State">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label text-md">City</label>
                                                    <input type="text" name="city" id="city" class="bg-white form-control !p-2 comp" placeholder="Enter City">
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label text-md">company name </label>
                                                    <input type="text" name="companyname" id="companyname" class="bg-white form-control !p-2" placeholder="Enter Company Name">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label text-md">company address</label>
                                                    <textarea type="text" placeholder="Enter Company Name" name="companyaddress" id="companyaddress" class="bg-white form-control !p-2"></textarea>
                                                </div>
                                            </div>
                                            <div class=" border rounded p-2 !mb-2 bg-[#f5f5f5]">
                                                <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                                    <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                                        <div class="form-group">
                                                            <label for="logoname" class="control-label text-md">birth date</label>
                                                            <input type="date" name="birthdate" id="birthdate" class="bg-white form-control !p-2 " placeholder="Enter Company Name">
                                                        </div>
                                                        <div class="form-group">
                                                            <label for="logoname" class="control-label text-md">origin</label>
                                                             <select name="origin" id="origin" class="bg-white form-control !p-2 ">
                                                                <option>INDIGEN</option>
                                                                <option>FOREIGNER</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">identity proof  </label>
                                                        <select name="identityproof" id="identityproof" class="bg-white form-control !p-2 comp">
                                                            <option>DRIVERS LICENCE</option>
                                                            <option>INTERNATION PASSPORT</option>
                                                            <option>NATIONAL ID CARD</option>
                                                            <option>VOTERS CARD</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div name="removeitemm" class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">passport number</label>
                                                        <input type="text" name="passportnumber" id="passportnumber" class="bg-white form-control !p-2" placeholder="Enter Company Name">
                                                    </div>
                                                <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">issue date of passport</label>
                                                        <input type="date" name="issuedateofpassport" id="issuedateofpassport" class="bg-white form-control !p-2" placeholder="Enter issue date of passport">
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">expire date of passport</label>
                                                        <input type="date" name="expiredateofpassport" id="expiredateofpassport" class="bg-white form-control !p-2" placeholder="Enter issue date of passport">
                                                    </div>
                                                    </div>
                                                </div>
                                                <div name="removeitemm" class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                                    <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                                        <div class="form-group">
                                                            <label for="logoname" class="control-label text-md">visa number</label>
                                                            <input type="text" name="visanumber" id="visanumber" class="bg-white form-control !p-2" placeholder="Enter Visa Number">
                                                        </div>
                                                        <div class="form-group">
                                                            <label for="logoname" class="control-label text-md">visa type</label>
                                                            <input type="text" name="visatype" id="visatype" class="bg-white form-control !p-2" >
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">visa place of issue</label>
                                                        <input type="text" name="visaplaceofissue" id="visaplaceofissue" class="bg-white form-control !p-2" placeholder="Enter visa place of issue">
                                                    </div>
                                                </div>
                                                <div name="removeitemm" class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">passport place of issue</label>
                                                        <input type="text" name="passportplaceofissue" id="passportplaceofissue" class="bg-white form-control !p-2" placeholder="Enter passport place of issue ">
                                                    </div>
                                                <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">issue date of visa</label>
                                                        <input type="date" name="issuedateofvisa" id="issuedateofvisa" class="bg-white form-control !p-2" placeholder="Enter issue date of passport">
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">expire date of visa</label>
                                                        <input type="date" name="expiredateofvisa" id="expiredateofvisa" class="bg-white form-control !p-2" placeholder="Enter expire date of passport">
                                                    </div>
                                                    </div>
                                                </div>
                                            </div>

                                                <button id="submitguestmodal" type="button" class="w-full h-[35px] md:w-max text-white text-sm capitalize bg-blue-400 p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Submit</span>
                                                </button>


                                        </form>
    `
    if(document.querySelector('#submitguestmodal')) document.querySelector('#submitguestmodal').addEventListener('click', e=>postingMasterSubmitguestform());
}

// this handles form submission and the state is true if the function is called from the guest management page but if called anywhere else it will  be false
async function postingMasterSubmitguestform(state="") {
    console.log('started')
    if(!validateForm('guestmodalform', getIdFromCls('comp', 'guestmodalform')))return notification('some data are not provided...', 0)
    if(!state && !nameandidofguest)notification('Somethin went wrong, the new guest you are saving cant be automatically loaded. you will have to get it from the datalist.')
    let payload

    // payload = getFormData2(document.querySelector('#guestmodalform'), [['photofilename', showFileName('imageurl')],['userphotoname', getFile('imageurl')]])
    payload = getFormData2(document.querySelector('#guestmodalform'))
    let request = await httpRequest2(postingMasterController('guestSave'), payload, document.querySelector('#guestmodalform #submitguestmodal'))
    if(request.status) {
        if(!state)notification(request.message, 1)
        if(!state)did(nameandidofguest[0]).value = `${did('guestmodalform').firstname.value} ${did('guestmodalform').lastname.value} ${did('guestmodalform').othernames.value}`
        if(!state)did(nameandidofguest[1]).value = request.id
        if(!state)did('modalform').classList.add('hidden')
        if(!state)postingMasterCheckinpopulatedl()
        if(!state)postingMasterCalculatetotals()
        if(state)Swal.fire({
          title: "Saved!",
          text: "Guest data saved!",
          icon: "success",
          customClass: {
                          confirmButton: 'btn btn-md !bg-blue-500 !text-white mx-2',
                        },
                        buttonsStyling: false
        });
        if(did('searchforguestdata'))did('hotelguest').click()
        return
    }
    if(!state)postingMasterCalculatetotals()
    return notification(request.message, 0);
}


async function postingMasterCheckinpopulatedl(){
    let request = await httpRequest2(postingMasterController('guestLookup'), null, null, 'json')
    if(request.status){
        did('allguest').innerHTML = request.data.map((dat, i)=>`<option>${dat.firstname.trim()} ${dat.lastname.trim()} ${dat.othernames.trim() == '-' ? '_' : dat.othernames.trim()} _ ${dat.phone.trim()} _ ${dat.id.trim()}</option>`).join('')
        did('allguest2').innerHTML = request.data.map((dat, i)=>`<option value="${dat.firstname.trim()} ${dat.lastname.trim()} ${dat.othernames.trim() == '-' ? '_' : dat.othernames.trim()} _ ${dat.phone.trim()} _ ${dat.id.trim()}">${dat.id.trim()}</option>`).join('')

    }else return notification(request.message, 0)
}

async function postingMasterHandlecheckinphone(what, val=''){
    if(did('id'))did('id').value = '';
    if(!did('phone').value && what == 'phone')return
    function getparamm(){
        let paramstr = new FormData()
        if(what == 'phone')paramstr.append('searchtext', document.getElementById('phone').value)
        if(what == 'id')paramstr.append('id', val)
        return paramstr
    }
    let request = await httpRequest2(postingMasterController('guestLookup'), getparamm(), null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No records retrieved</td></tr>`
    if(request.status) {
        if(what == 'phone')notification('Guest data found and loaded',1)
        // function populateData(data, img=[], locate=[], form='', deep=false) {
        populateData(request.data[0], [], [], 'guestmodalform')
    }
    else return notification('No records retrieved')
}

async function postingMasterFetchcheckinn(id='', oyn='', form="", btn=null) {
    if(did('autodetails'))did('autodetails').remove();
    if(id)if(document.getElementsByClassName('updater')[0])document.getElementsByClassName('updater')[0].click()
    // scrollToTop('scrolldiv')
    // if(did('expectedarrivalsform'))did('guestreservations').click()
    if(id && did('expectedarrivalsform')){
                    sessionStorage.setItem('postingmasterfromsomewhere', id)
                    did('guestsreservations').click()
                    return
            }
    function getparamm(){
        if(!form && !id)return null;
        let paramstr
        if(form)paramstr = new FormData(did(form))
        if(!form)paramstr = new FormData()
        if(id)paramstr.append('id', id)
        // if(!id && oyn)paramstr.append('startdate', document.getElementById('arrivaldaterr').value)
        // if(!id && oyn)paramstr.append('enddate', document.getElementById('arrivaldaterrr').value)
        // if(!id && oyn)paramstr.append('enddate', document.getElementById('arrivaldaterrr').value)
        return paramstr
    }
    function getparammexpectedarrivalsform(){
        if(!form && !id)return null;
        let paramstr
        if(form)paramstr = new FormData(did(form))
        if(!form)paramstr = new FormData()
        if(id)paramstr.append('id', id)
        // if(!id && oyn)paramstr.append('startdate', document.getElementById('arrivaldaterr').value)
        // if(!id && oyn)paramstr.append('enddate', document.getElementById('arrivaldaterrr').value)
        // if(!id && oyn)paramstr.append('enddate', document.getElementById('arrivaldaterrr').value)
        return paramstr
    }
    let request
    if(did('postingmasterform'))request = await httpRequest2(postingMasterController(id ? 'single' : 'list'), getparamm(), null, 'json')
    if(did('noshowform'))request = await httpRequest2(`../controllers/${id? 'fetchnoshowreservations' : 'fetchnoshowreservations'}`, getparamm(), null, 'json')
    if(did('reassignroomsform'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchcheckindirect'}`, getparamm(), null, 'json')
    if(did('guestreservationform'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchreservationsbyfilter'}`, getparamm(), did('fetchgandres'), 'json')
    if(did('expectedarrivalsform'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchreservationsbyfilter'}`, getparammexpectedarrivalsform(), null, 'json')
    if(did('reservationpostingmasterform'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchreservationsbyfilter'}`, getparamm(), null, 'json')
    if(did('grouppostingmasterform'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchreservationsbyfilter'}`, getparamm(), null, 'json')
    // if(did('cancelreservationform'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchreservationsbyfilter'}`, getparamm(), null, 'json')
    if(did('cancelreservationformfilter'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchcancelledreservations'}`, getparamm(), null, 'json')
    if(did('checkoutformfilter'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchcheckoutsbyfilter'}`, getparamm(), btn, 'json')
    if(did('extendstayform'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchreservationsbyfilter'}`, getparamm(), null, 'json')
    // let request = await httpRequest2(`../controllers/${id? 'fetchcheckindirect' : 'fetchcheckindirect'}`, id ? getparamm() : null, null, 'json')

    function applyFetchedReservationRecord(record){
        if(!record || !record.reservations) return false
        checkinid = record.reservations.id
        populateddata = record.reservations
        if(did('postingmasterform'))populateData(record.reservations, [], [], 'postingmasterform')
        if(did('reassignroomsform'))populateData(record.reservations, [], [], 'reassignroomsform')
        if(did('guestreservationform'))populateData(record.reservations, [], [], 'guestreservationform')
        if(did('reservationpostingmasterform'))populateData(record.reservations, [], [], 'reservationpostingmasterform')
        if(did('grouppostingmasterform'))populateData(record.reservations, [], [], 'grouppostingmasterform')
        if(did('extendstayform'))populateData(record.reservations, [], [], 'extendstayform')
        if(did('cancelreservationform'))populateData(record.reservations, [], [], 'cancelreservationform')
        if(did('checkoutformfilter'))populateData(record.reservations, [], [], 'checkoutformfilter')
        if(did('amountpaid') && Number(did('amountpaid').value || 0) === 0) did('amountpaid').value = ''
        let x = JSON.stringify(record)
        postingMasterPopulaterestcheckindata(x)
        document.querySelectorAll('.roomnumber').forEach((control) => {
            if(String(control.value || '').trim() === '0') control.value = ''
        })
        setTimeout(() => {
            postingMasterRecalculateAllRoomCardsForRateContext('edit-load', { preserveExistingRate: true })
        }, 0)
        const invoice = record?.invoicedata?.[0]
        if(invoice){
            if(did('bankname') && invoice.bankname) did('bankname').value = invoice.bankname
            if(did('otherdetails') && invoice.tlog){
                const tlogParts = String(invoice.tlog).split('|')
                const detail = tlogParts.length > 1 ? tlogParts[1] : ''
                did('otherdetails').value = detail
            }
        }
        if(did('reassignroomsform'))disablefortransfer(reassignroom)
        return true
    }

    if(id && request?.status && Array.isArray(request.data) && request.data.length === 0){
        const fallbackRecord = (datasource || []).find((row) => String(row?.reservations?.id || '') === String(id))
        if(fallbackRecord) return applyFetchedReservationRecord(fallbackRecord)
    }

    if(!id && document.getElementById('tabledata'))document.getElementById('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No records retrieved</td></tr>`;
    if(request.status) {
        if(!id){
            if(request.data.length) {
                const normalizedRows = request.data.map(postingMasterNormalizeReservationRow)
                if(did('postingmasterform'))datasource = normalizedRows
                if(did('noshowform'))datasource = request.data
                if(did('reassignroomsform'))datasource = request.data.filter(data=>data.reservations.status == 'CHECKED IN')
                if(did('guestreservationform'))datasource = request.data.filter(data=>data.reservations.status == 'OPEN' || data.reservations.status == 'RESERVED').filter(data=>data.reservations.group_id == 0)
                if(did('reservationpostingmasterform'))datasource = request.data.filter(data=>data.reservations.status == 'OPEN' || data.reservations.status == 'RESERVED').filter(data=>data.reservations.group_id == 0)
                if(did('grouppostingmasterform'))datasource = request.data.filter(data=>data.reservations.status == 'OPEN' || data.reservations.status == 'RESERVED' || data.reservations.status == 'CHECKED IN').filter(data=>data.reservations.group_id != 0)
                if(did('extendstayform'))datasource = request.data
                // if(did('cancelreservationform'))datasource = request.data.filter(data=>data.reservations.status == 'OPEN' || data.reservations.status == 'RESERVED').filter(data=>data.reservations.group_id != 0)
                if(did('cancelreservationformfilter'))datasource = request.data
                if(did('checkoutformfilter'))datasource = request.data
                if(did('postingmasterform'))checkinViewTableSource = Array.isArray(datasource) ? [...datasource] : []
                if(datasource.length > 0)document.getElementById('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No records retrieved</td></tr>`
                if(datasource.length == 0)return document.getElementById('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No records retrieved</td></tr>`
                if(did('postingmasterform')){
                    postingMasterBindCheckinViewFrontendSearch()
                    postingMasterApplyCheckinViewFrontendSearch()
                }else{
                    resolvePagination(datasource, postingMasterOncheckinTableDataSignal)
                }
            }
        }else{
            if(Array.isArray(request.data) && request.data.length){
                return applyFetchedReservationRecord(postingMasterNormalizeReservationRow(request.data[0]))
            }
            const fallbackRecord = (datasource || []).find((row) => String(row?.reservations?.id || '') === String(id))
            if(fallbackRecord) return applyFetchedReservationRecord(fallbackRecord)
            return notification('No records retrieved')
        }
    }
    else return notification('No records retrieved')
}

function postingMasterPopulaterestcheckindata(x){
    let data = postingMasterNormalizeReservationRow(JSON.parse(x))
    console.log('data', data)
    did('roomfullcontainer').innerHTML = (data.roomgeustrow || data.roomguestrow || []).slice(0, 1).map((item, id)=>`
        <div class="relative border rounded py-3 px-4 mt-6 !mb-2.5 bg-[#f5f5f5] shadow-lg" onclick="if(actionid != ${id}){actionid = ${id};postingMasterRunratcod()}">
         <button onclick="event.stopPropagation(); postingMasterRemoveCheckinRoomCard(this)" type="button" class="absolute top-[-25px] shadow right-0 flex justify-center items-center text-white w-10 h-10 bg-red-400 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1 me-1 mb-1 cark:bg-red-600 cark:hover:bg-red-700 focus:outline-none cark:focus:ring-red-800"><span class="material-symbols-outlined">delete</span></button>
            <button onclick="postingMasterCheckinaddroom()" type="button" class="hidden absolute top-[-25px] shadow right-14 justify-center items-center text-white w-10 h-10 bg-green-400 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 me-1 mb-1 cark:bg-green-600 cark:hover:bg-green-700 focus:outline-none cark:focus:ring-green-800"><span class="material-symbols-outlined">add</span></button>


            <!--Room Category room industry source-->
            <div class="grid grid-cols-1 !mb-1 lg:grid-cols-2 gap-10">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div class="form-group">
                        <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">room category</label>
                        <select name="roomcategory" id="roomcategory-${id}" onchange="postingMasterControlroomlist('${id}', 'roomcategory')" class="bg-white roomcategory form-control comp !p-1 ">
                            <option value="">-- Select Room Type --</option>
                            ${postingMasterAllowedRoomCategories().map(data=>`<option ${item.roomdata.roomcategory == data.id ? 'selected' : ''} value="${data.id}">${data.category}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group !flex relative">
                        <div class="">
                            <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">Room</label>
                            <!--<input type="text" readonly  id="roomnumber" list="hems_available_roomnumber_id" onchange="checkdatalist(this);getcategoryrateguest(this)" class="bg-white form-control !p-2 comp2" placeholder="Enter root category">-->
                            <input type="text" value="${postingMasterNormalizeRoomNumberDisplay(item.roomdata.roomnumber)}" readonly name="roomnumber"  id="roomnumber-${id}" class="bg-white form-control roomnumber !p-2 comp" placeholder="">
                            <!--<input type="text" name="roomnumber" id="roomnumber1" list="hems_available_roomnumber_id" onchange="checkdatalist(this);getcategoryrateguest(this)" class="bg-white form-control !p-2 comp2" placeholder="Enter root category">-->
                        </div>
                        <button id="searchroombtn-${id}" onclick="postingMasterOpentheroomboard('${id}')" type="button" class=" scale-[0.7] absolute top-0 right-0 text-white w-10 h-10 bg-blue-400 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 me-1 mb-1 cark:bg-blue-600 cark:hover:bg-blue-700 focus:outline-none cark:focus:ring-blue-800"><span class="material-symbols-outlined">search</span></button>
                    </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-5 gap-10">
                        <div class="form-group hidden">
                            <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">adults</label>
                            <input type="number" onchange="postingMasterHandlecheckinrate('${id}','true')" maxlength="2" value="1" readonly name="adult" id="adult-${id}" class="bg-white adult form-control !p-2 comp" placeholder=""  oninput="enforceMaxLength(this)">
                        </div>
                        <div class="form-group hidden">
                            <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">children</label>
                            <input type="number" onchange="postingMasterHandlecheckinrate('${id}','true')" maxlength="2" name="child" value="0" readonly id="children-${id}" class="bg-white child form-control !p-2 comp2" placeholder=""  oninput="enforceMaxLength(this)">
                        </div>
                        <div class="form-group hidden">
                            <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">Infants</label>
                            <input type="number" maxlength="2" name="infant" id="infant-${id}" value="0" readonly class="bg-white infant form-control !p-2 comp2" placeholder=""  oninput="enforceMaxLength(this)">
                        </div>
                        <div class="form-group col-span-2">
                            <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">rate&nbsp;code</label>
                            <input type="text" name="ratecodename" list="hems_rate_code" onchange="checkdatalist(this, 'ratecodee-${id}', 'hems_rate_code_id')?postingMasterRunratcod('',true):postingMasterRunratcod('',true)" id="ratecodename-${id}" value="${item.roomdata.ratecodename}" class="bg-transparent ratecodename !p-1 comp2 border " placeholder="">
                            <input type="text" readonly name="ratecode" id="ratecodee-${id}" value="${item.roomdata.ratecode}" class="bg-transparent ratecode !p-1 comp2 border hidden" placeholder="">
                            <div id="ratesource-${id}" class="mt-1 text-[11px] leading-snug rounded-md border px-2 py-1 bg-slate-50 text-slate-600 border-slate-200"></div>
                        </div>
                    </div>
        </div>

            <div class="grid grid-cols-1 !mb-1 lg:grid-cols-1 gap-10">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div class="form-group hidden">
                            <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">plan</label>
                            <input type="text" name="plan" value="" readonly id="plan-${id}" class="bg-transparent plan !p-1 comp2 border" placeholder="">
                        </div>
                        <div class="form-group hidden">
                            <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">plan amount</label>
                            <input type="text" name="planamount" value="0" readonly id="planamount-${id}" class="bg-transparent planamount !p-1 comp2 border" placeholder="">
                        </div>
                        <div class="form-group">
                            <label for="roomrate-${id}" id="roomrate-label-${id}" data-roomrate-label="${id}" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">rate</label>
                            <input type="number" name="roomrate" value="${item.roomdata.roomrate}" id="roomrate-${id}" oninput="postingMasterCalculatetotals()" onchange="postingMasterCalculatetotals()" class="bg-transparent roomrate !p-1 comp2 border" >
                            <!--<select name="roomrate" onchange="getcategoryrateguest(document.getElementById('roomcategory'))" id="roomrate" class="bg-white  form-control !p-2 comp2" >-->
                            <!--</select>-->
                        </div>
                    </div>
                    <div class="hidden grid-cols-1 lg:grid-cols-4 gap-10">
                        <div class="form-group">
                            <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">discount&nbsp;coupon</label>
                            <select onchange="postingMasterRuncouponcalculations()" name="discountcoupon" id="discountcoupon-${id}" class="bg-white discountcoupon form-control !p-1 comp2">
                                <option value="">-- Select Discount Coupon --</option>
                                ${discountcoup.map(dat=>`<option ${item.roomdata.discountcoupon == dat.id ? 'selected' : ''} value="${dat.id}">${dat.couponname}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">discount&nbsp;amount</label>
                            <input type="text"  value="${item.roomdata.discountamount}" name="discountamount" id="discountamount-${id}" class="bg-transparent discountamount !p-1 comp2 border" placeholder="">
                        </div>
                        <div class="form-group">
                                <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">plan&nbsp;discount&nbsp;(%)</label>
                                <input type="text" onchange="postingMasterCheckplandiscount()"  value="${item.roomdata.plandiscountperc}" name="plandiscountperc" id="plandiscountperc-${id}" class="bg-white plandiscountperc form-control !p-2 comp2" placeholder="">
                            </div>
                        <div class="form-group">
                            <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">plan&nbsp;discount</label>
                            <input type="text" readonly name="plandiscountamount" value="${item.roomdata.plandiscountamount}" id="plandiscountamount-${id}" class="bg-transparent plandiscountamount !p-1 comp2 border" placeholder="" border>
                        </div>
                    </div>
            </div>


            <!--container for extra guest-->
            <div id="moreguestcontainer-${id}" class="moreguestcontainer">
                ${item.guest1.length>0? `<div class="grid grid-cols-1 lg:grid-cols-4 gap-2 mb-2">
                    <div class="form-group col-span-3">
                        <label for="logoname" class="control-label text-md">Guest</label>
                        <input type="text" value="${item.guest1[0].firstname} ${item.guest1[0].lastname} ${item.guest1[0].phone}_${item.guest1[0].id}" name="" id="guest-${id}_${id}" list="allguest" onchange="checkdatalist(this, 'guestid-${id}_${id}', 'allguest2')" class="bg-white comp form-control !p-2 comp bg-white" placeholder="Enter Guest Name">
                        <input type="text" value="${item.guest1[0].id}" name="" id="guestid-${id}_${id}" class="bg-white guestid form-control !p-2 hidden" placeholder="">
                    </div>
                    <div class="w-full flex items-end justify-start">
                        <div class="flex px-2 items-center mb-4">
                            <input id="default-radio-1" type="radio" value="" name="default-radio_${id}" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                            <label for="default-radio-1" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Leader</label>
                        </div>
                        <button onclick="postingMasterOpenguestform('guest-${id}_${id}', 'guestid-${id}_${id}');did('modalform').classList.remove('hidden')" type="button" class="w-full h-[35px] bg-[#468df7] md:w-max text-white text-sm capitalize p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                <div class="btnloader" style="display: none;"></div>
                                <span>Add&nbsp;New&nbsp;Guest</span>
                        </button>
                    </div>
                </div>` : ''}
                ${false && item.guest2.length>0? `<div class="grid grid-cols-1 lg:grid-cols-4 gap-2 mb-2">
                    <div class="form-group col-span-3">
                        <label for="logoname" class="control-label text-md">Guest</label>
                        <input type="text" value="${item.guest2[0].firstname} ${item.guest2[0].lastname} ${item.guest2[0].phone}_${item.guest2[0].id}" name="" id="guest-${id}_${id}2" list="allguest" onchange="checkdatalist(this, 'guestid-${id}_${id}2', 'allguest2')" class="bg-white comp form-control !p-2 comp bg-white" placeholder="Enter Guest Name">
                        <input type="text" value="${item.guest2[0].id}" name="" id="guestid-${id}_${id}2" class="bg-white guestid form-control !p-2 hidden" placeholder="">
                    </div>
                    <div class="w-full flex items-end justify-start">
                        <button onclick="postingMasterOpenguestform('guest-${id}_${id}2', 'guestid-${id}_${id}2');did('modalform').classList.remove('hidden')" type="button" class="w-full h-[35px] bg-[#468df7] md:w-max text-white text-sm capitalize p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                <div class="btnloader" style="display: none;"></div>
                                <span>Add&nbsp;New&nbsp;Guest</span>
                        </button>
                        <button onclick="postingMasterRemoveCheckinGuestRow(this)" type="button" class="w-full h-[35px] bg-red-400 md:w-max text-white text-sm capitalize p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                <div class="btnloader" style="display: none;"></div>
                                <span>Delete</span>
                        </button>
                    </div>
                </div>`: ''}
                ${false && item.guest3.length>0? `<div class="grid grid-cols-1 lg:grid-cols-4 gap-2 mb-2">
                    <div class="form-group col-span-3">
                        <label for="logoname" class="control-label text-md">Guest</label>
                        <input type="text" value="${item.guest3[0].firstname} ${item.guest3[0].lastname} ${item.guest3[0].phone}_${item.guest3[0].id}" name="" id="guest-${id}_${id}3" list="allguest" onchange="checkdatalist(this, 'guestid-${id}_${id}3', 'allguest2')" class="bg-white comp form-control !p-2 comp bg-white" placeholder="Enter Guest Name">
                        <input type="text" value="${item.guest3[0].id}" name="" id="guestid-${id}_${id}3" class="bg-white guestid form-control !p-2 hidden" placeholder="">
                    </div>
                    <div class="w-full flex items-end justify-start">
                        <button onclick="postingMasterOpenguestform('guest-${id}_${id}3', 'guestid-${id}_${id}3');did('modalform').classList.remove('hidden')" type="button" class="w-full h-[35px] bg-[#468df7] md:w-max text-white text-sm capitalize p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                <div class="btnloader" style="display: none;"></div>
                                <span>Add&nbsp;New&nbsp;Guest</span>
                        </button>
                        <button onclick="postingMasterRemoveCheckinGuestRow(this)" type="button" class="w-full h-[35px] bg-red-400 md:w-max text-white text-sm capitalize p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                <div class="btnloader" style="display: none;"></div>
                                <span>Delete</span>
                        </button>
                    </div>
                </div>`: ''}
                ${false && item.guest4.length>0? `<div class="grid grid-cols-1 lg:grid-cols-4 gap-2 mb-2">
                    <div class="form-group col-span-3">
                        <label for="logoname" class="control-label text-md">Guest</label>
                        <input type="text" value="${item.guest4[0].firstname} ${item.guest4[0].lastname} ${item.guest4[0].phone}_${item.guest4[0].id}" name="" id="guest-${id}_${id}4" list="allguest" onchange="checkdatalist(this, 'guestid-${id}_${id}4', 'allguest2')" class="bg-white comp form-control !p-2 comp bg-white" placeholder="Enter Guest Name">
                        <input type="text" value="${item.guest4[0].id}" name="" id="guestid-${id}_${id}4" class="bg-white guestid form-control !p-2 hidden" placeholder="">
                    </div>
                    <div class="w-full flex items-end justify-start">
                        <button onclick="postingMasterOpenguestform('guest-${id}_${id}4', 'guestid-${id}_${id}4');did('modalform').classList.remove('hidden')" type="button" class="w-full h-[35px] bg-[#468df7] md:w-max text-white text-sm capitalize p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                <div class="btnloader" style="display: none;"></div>
                                <span>Add&nbsp;New&nbsp;Guest</span>
                        </button>
                        <button onclick="postingMasterRemoveCheckinGuestRow(this)" type="button" class="w-full h-[35px] bg-red-400 md:w-max text-white text-sm capitalize p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                <div class="btnloader" style="display: none;"></div>
                                <span>Delete</span>
                        </button>
                    </div>
                </div>`: ''}

            </div>
        </div>
    `).join('')
    postingMasterScheduleRoomCategoryRestriction(did('roomfullcontainer'))
    postingMasterCalculatetotals()
}

function postingMasterReverseareservation(id, state='reserved') {
  function customConfirm(message) {
    return Swal.fire({
      title: `Reservation ${state} Reversal`,
      html: `
        <div class="text-center mt-4">${message}</div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes, Reverse',
      cancelButtonText: 'No, Don\'t reverse',
      customClass: {
        confirmButton: 'btn btn-md !bg-red-500 mx-2',
        cancelButton: 'btn btn-md !bg-blue-500 mx-2'
      },
      buttonsStyling: false
    }).then((result) => {
      return result.isConfirmed;
    });
  }

  // Usage example
  customConfirm(`Are you sure you want to reverse this ${state} reservation? ${state != 'checked out' ? '' : 'Please note that proceeding will result in the loss of transaction data associated with this reservation.'}`).then((confirmed) => {
    if (confirmed) {
      postingMasterReverseapproved(id, state);
    }
  });
}


async function postingMasterReverseapproved(id, state) {
    let param = new FormData()
    param.append('id', id)
    const controller = (state === 'reserve' || state === 'reserved')
        ? 'reversereservation'
        : 'reversecheckin'
    let request = await httpRequest2(postingMasterController(controller), param, null, 'json')
    if(request.status) {
        Swal.fire({
          title: `${state} Reversed!`,
          text: `The ${state} reservation has been reversed.`,
          icon: "success",
          customClass: {
            confirmButton: 'btn btn-md !bg-blue-500 !text-white'
          },
          buttonsStyling: false
        });
        postingMasterFetchcheckinn()
    } else {
        Swal.fire({
          title: `Failed ${state} Reversal!`,
          text: request.message,
          icon: "error",
          customClass: {
            confirmButton: 'btn btn-md !bg-blue-500 !text-white'
          },
          buttonsStyling: false
        });
    }
}


async function postingMasterRoomtransfer(rm, ref, id) {
    let param = new FormData()
    param.append('roomnumber', rm)
    param.append('reference', ref)
    let request = await httpRequest2(postingMasterController('currentRoomBalance'), param, null, 'json')
    if(request.status){
            if(request.balance == null){
                Swal.fire({
                  title: `Failed to get Balance!`,
                  text: 'Balance is cannot be found',
                  icon: "error",
                  customClass: {
                    confirmButton: 'btn btn-md !bg-blue-500 !text-white'
                  },
                  buttonsStyling: false
                });
            }
            if(Number(request.balance) == 0){
                sessionStorage.setItem('assignfromsomewhere', `${rm}_${ref}_${id}_${request.balance}`);
                if(!did('reassignroomsform'))document.getElementById('reassignrooms').click()
                if(did('reassignroomsform'))checkforassignment();
            }
            if(Number(request.balance) > 0){
                const result = await Swal.fire({
                      title: `${formatNumber(request.balance)}`,
                      text: `The above is the available balance`,
                      icon: 'warning',
                      showCancelButton: true,
                      showDenyButton: true,
                      confirmButtonText: 'Roll Over',
                      denyButtonText: 'Make payment',
                      cancelButtonText: 'Cancel',
                      customClass: {
                        confirmButton: 'btn btn-md !bg-blue-500 !text-white m-2',
                        denyButton: 'btn btn-md !bg-orange-500 !text-white m-2',
                        cancelButton: 'btn btn-md !bg-red-500 !text-white m-2'
                      },
                      buttonsStyling: false
                    });

                    if(result.isConfirmed){
                        // alert('roll over')
                        // Perform the asynchronous operation
                        sessionStorage.setItem('assignfromsomewhere', `${rm}_${ref}_${id}_${request.balance}`);
                        if(!did('reassignroomsform'))document.getElementById('reassignrooms').click()
                        if(did('reassignroomsform'))checkforassignment();
                    }else if(result.isDismissed){
                        // alert('cancel')
                        // Swal.fire('Cancelled', 'Your file is safe :)', 'error');
                    }else{
                        // alert('make payment')
                        sessionStorage.setItem('assignfromsomewhere', `${rm}_${ref}_${id}_${request.balance}`);
                        document.getElementById('receipts').click()
                    }

            }
            if(Number(request.balance) < 0){
                const result = await Swal.fire({
                      title: `${formatNumber(request.balance)}`,
                      text: `The above is the available balance`,
                      icon: 'warning',
                      showCancelButton: true,
                      showDenyButton: true,
                      confirmButtonText: 'Roll Over',
                      cancelButtonText: 'Cancel',
                      customClass: {
                        confirmButton: 'btn btn-md !bg-blue-500 !text-white m-2',
                        cancelButton: 'btn btn-md !bg-red-500 !text-white m-2'
                      },
                      buttonsStyling: false
                    });

                    if(result.isConfirmed){
                        // alert('roll over')
                        // Perform the asynchronous operation
                        sessionStorage.setItem('assignfromsomewhere', `${rm}_${ref}_${id}_${request.balance}`);
                        if(!did('reassignroomsform'))document.getElementById('reassignrooms').click()
                        if(did('reassignroomsform'))checkforassignment();
                    }else if(result.isDismissed){
                        // alert('cancel')
                        // Swal.fire('Cancelled', 'Your file is safe :)', 'error');
                    }

            }


    }else{
        Swal.fire({
          title: `Failed to get Balance!`,
          text: request.message,
          icon: "error",
          customClass: {
            confirmButton: 'btn btn-md !bg-blue-500 !text-white'
          },
          buttonsStyling: false
        });
    }
}

async function postingMasterPerformAsyncTask() {
  // Simulate an asynchronous task, like a network request
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

function postingMasterRemoveguestsreservations(ref){
    sessionStorage.setItem('cancelreservation', ref)
    document.getElementById('cancelreservation').click()
}

function postingMasterApplyReservationTypePaymentRequirement(showNotice = false) {
    if(!did('reservationtype') || !did('paymentmethod')) return
    did('paymentmethod').classList.remove('comp')
}

function postingMasterSetupReservationTypePaymentRequirement() {
    if(!did('reservationtype')) return
    const reservationTypeEl = did('reservationtype')
    if(reservationTypeEl.dataset.paymentRequirementBound === '1'){
        postingMasterApplyReservationTypePaymentRequirement(false)
        return
    }
    reservationTypeEl.dataset.paymentRequirementBound = '1'
    reservationTypeEl.addEventListener('change', () => postingMasterApplyReservationTypePaymentRequirement(true))
    reservationTypeEl.addEventListener('blur', () => postingMasterApplyReservationTypePaymentRequirement(false))
    postingMasterApplyReservationTypePaymentRequirement(false)
}

async function postingMasterWaitForDirectCheckinTransferTarget(targetCheck, timeoutMs = 5000, intervalMs = 100) {
    const startedAt = Date.now()
    while ((Date.now() - startedAt) <= timeoutMs) {
        if (targetCheck()) return true
        await new Promise(resolve => setTimeout(resolve, intervalMs))
    }
    return false
}

async function postingMasterOpenStayInterfaceFromDirectCheckin(routeId, loaderFunctionName, reference) {
    const normalizedReference = String(reference || '').trim()
    if (!normalizedReference) return notification('Reference is required to continue', 0)
    const routeTrigger = did(routeId)
    if (!routeTrigger) return notification('Could not open requested interface', 0)

    routeTrigger.click()
    const ready = await postingMasterWaitForDirectCheckinTransferTarget(() => did('reference') && typeof window[loaderFunctionName] === 'function')
    if (!ready) return notification('Please wait for the form to finish loading and try again', 0)

    did('reference').value = normalizedReference
    await window[loaderFunctionName]()
}

async function postingMasterOpenExtendStayFromDirectCheckin(reference) {
    return postingMasterOpenStayInterfaceFromDirectCheckin('extendstay', 'fetchdataforextendstay', reference)
}

async function postingMasterOpenReduceStayFromDirectCheckin(reference) {
    return postingMasterOpenStayInterfaceFromDirectCheckin('reducestay', 'fetchdataforreducestay', reference)
}

const directCheckinBalanceCache = new Map()

function postingMasterOpenReceiveDepositFromDirectCheckin(reference = '') {
    const cleanedReference = String(reference || '').trim()
    if (!cleanedReference) return notification('Reference is required to make payment', 0)
    sessionStorage.setItem('assignfromsomewhere', `0_${cleanedReference}_0_0`)
    const receiptsRoute = did('receipts')
    if (!receiptsRoute) return notification('Receive Deposits interface is unavailable', 0)
    receiptsRoute.click()
}

async function postingMasterFetchDirectCheckinBalance(reference = '', reservationId = '') {
    const ref = String(reference || '').trim()
    const rowKey = String(reservationId || '').trim()
    if (!ref || !rowKey) return notification('Unable to fetch balance: missing reference', 0)

    const cell = did(`checkin-balance-cell-${rowKey}`)
    if (!cell) return

    if (directCheckinBalanceCache.has(ref)) {
        cell.innerHTML = `<span class="font-semibold">${formatNumber(directCheckinBalanceCache.get(ref))}</span>`
        return
    }

    cell.innerHTML = `<span class="material-symbols-outlined animate-spin text-slate-500" style="font-size:18px;">progress_activity</span>`
    const payload = new FormData()
    payload.append('reference', ref)
    const request = await httpRequest2(postingMasterController('balance'), payload, null, 'json')
    if (!request || !request.status) {
        cell.innerHTML = `<button title="Click to load balance" onclick="postingMasterFetchDirectCheckinBalance('${ref}', '${rowKey}')" class="material-symbols-outlined text-slate-500 hover:text-slate-700" style="font-size:18px;">visibility_off</button>`
        return notification(request?.message || 'Unable to fetch balance right now', 0)
    }

    const balanceValue = Number(request.balance || request.data?.balance || 0)
    directCheckinBalanceCache.set(ref, balanceValue)
    cell.innerHTML = `<span class="font-semibold">${formatNumber(balanceValue)}</span>`
}



async function postingMasterOncheckinTableDataSignal() {
    const totalDeposit = datasource.reduce((sum, data) => sum + Number(data.reservations?.amountpaid ?? 0), 0);
    const totalRates = datasource.reduce((sum, data) => {
        if (!data.roomgeustrow || !data.roomgeustrow.length) return sum;
        const roomTotal = data.roomgeustrow.reduce((roomSum, row) => roomSum + Number(row.roomdata?.roomrate ?? 0), 0);
        return sum + roomTotal;
    }, 0);

    if (document.getElementById('tabledata')) {
        // Clear any existing summary blocks to prevent duplicates after repeated submits
        document.querySelectorAll('#autodetails').forEach(el => el.remove());

        const container = document.getElementById('tabledata').parentElement.parentElement;
        container.insertAdjacentHTML('afterbegin', `
        <!-- component -->
        <div id="autodetails" class="max-w-full mx-4 py-6 sm:mx-auto sm:px-6 lg:px-8">
            <div class="sm:flex sm:space-x-4">
                <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-4 w-full sm:w-1/3 sm:my-8">
                    <div class="bg-white p-5">
                        <div class="sm:flex sm:items-start">
                            <div class="text-center sm:mt-0 sm:ml-2 sm:text-left">
                                <h3 class="text-sm leading-6 font-medium text-gray-400">Total Initial Deposit</h3>
                                <p class="text-3xl font-bold text-black opacity-[0.7]">${formatNumber(totalDeposit)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-4 w-full sm:w-1/3 sm:my-8">
                    <div class="bg-white p-5">
                        <div class="sm:flex sm:items-start">
                            <div class="text-center sm:mt-0 sm:ml-2 sm:text-left">
                                <h3 class="text-sm leading-6 font-medium text-gray-400">Total Rates</h3>
                                <p class="text-3xl font-bold text-black opacity-[0.7]">${formatNumber(totalRates)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="inline-block hidden align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-4 w-full sm:w-1/3 sm:my-8">
                    <div class="bg-white p-5">
                        <div class="sm:flex sm:items-start">
                            <div class="text-center sm:mt-0 sm:ml-2 sm:text-left">
                                <h3 class="text-sm leading-6 font-medium text-gray-400">Avg. Click Rate</h3>
                                <p class="text-3xl font-bold text-black">24.57%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `);
    }

    let rows = getSignaledDatasource().map((item, index) => {
    let x =0;
    let r =0
    // let goto
    // if(did('guestreservationform'))goto = 'checkin'
    // if(did('reservationpostingmasterform'))goto = ''
    // if(did('grouppostingmasterform'))goto = ''
    if(item.roomgeustrow && item.roomgeustrow.length>0){
        for(let i=0;i<item.roomgeustrow.length;i++){
            if(item.roomgeustrow[i].guest1.length > 0)x++
            if(item.roomgeustrow[i].guest2.length > 0)x++
            if(item.roomgeustrow[i].guest3.length > 0)x++
            if(item.roomgeustrow[i].guest4.length > 0)x++
            if(item.roomgeustrow[i].roomdata.roomrate)r = Number(item.roomgeustrow[i].roomdata.roomrate)+r
        }
    }
    const companyOrTravelAgency = String(
        item?.reservations?.companyname ||
        item?.reservations?.travelagentname ||
        ''
    ).trim()
    const isPostingMasterView = !!did('postingmasterform')

    return `
    <tr>
        <td>${index + 1 }</td>
        <td>
            <div class="w-full h-full flex items-center justify-center gap-4">
                <button title="View and Print" onclick="postingMasterOpencheckinreceipt('${item.reservations.id}', '${r}', '${x}')" class="material-symbols-outlined rounded-full bg-gray-100 h-8 w-8 text-green-400 drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
                <button title="check in" onclick="
                                    if(did('guestreservationform'))did('reservationcheckin').click();
                                    if(did('expectedarrivalsform'))did('reservationcheckin').click();
                                    if(did('reservationpostingmasterform'))postingMasterChecksessionstorage();
                                    sessionStorage.setItem('postingmasterfromsomewhere', '${item.reservations.id}');
                                    " class="material-symbols-outlined ${isPostingMasterView ? 'hidden' : ''} ${item.reservations.status != 'CHECKED IN' && item.reservations.status != 'CHECKED OUT' ? !did('cancelreservationformfilter') ? '' : 'hidden' : 'hidden'} ${did('noshowform') ? 'hidden' : ''} rounded-full bg-green-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">check_circle</button>
                <button title="Reverse Reservation" onclick="postingMasterReverseareservation('${item.reservations.id}', 'reserved')" class="material-symbols-outlined ${isPostingMasterView ? 'hidden' : ''} ${item.reservations.status == 'RESERVED' ? '' : item.reservations.status == 'OPEN' ? '' : 'hidden'} ${did('noshowform') ? 'hidden' : ''} rounded-full bg-red-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete_history</button>
                <button title="Reverse Posting Master" onclick="postingMasterReverseareservation('${item.reservations.id}', 'checked in')" class="material-symbols-outlined ${item.reservations.status == 'CHECKED IN' ? '' : 'hidden'} ${did('noshowform') ? 'hidden' : ''} rounded-full bg-red-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete_history</button>
                <button title="Reverse Check Out" onclick="postingMasterReverseareservation('${item.reservations.id}', 'checked out')" class="material-symbols-outlined ${item.reservations.status == 'CHECKED OUT' ? '' : 'hidden'} ${did('noshowform') ? 'hidden' : ''} rounded-full bg-red-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete_history</button>
                <button title="Edit Reservation" onclick="postingMasterOpenGuestReservationForEdit('${item.reservations.id}')" class="${did('guestreservationform') ? '' : 'hidden'} ${item.reservations.status == 'CHECKED IN' || item.reservations.status == 'CHECKED OUT' ? 'hidden' : ''} material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
                <button title="Edit row entry" onclick="postingMasterFetchcheckinn('${item.reservations.id}')" class="${item.reservations.status == 'CHECKED IN' ? 'hidden' : ''} ${did('cancelreservationformfilter') ? '' : 'hidden'} ${!did('noshowform') ? 'hidden' : ''} material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
                <button title="Cancel Reservation" onclick="postingMasterRemoveguestsreservations('${item.reservations.reference}')" class="${item.reservations.status != 'CHECKED IN' ? '' : 'hidden'} material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
                <button title="Make Payment" onclick="postingMasterOpenReceiveDepositFromDirectCheckin('${item.reservations.reference}')" class="${did('postingmasterform') ? '' : 'hidden'} ${did('noshowform') ? 'hidden' : ''} material-symbols-outlined rounded-full bg-emerald-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">payments</button>
                <button title="Extend Stay" onclick="postingMasterOpenExtendStayFromDirectCheckin('${item.reservations.reference}')" class="${did('postingmasterform') ? '' : 'hidden'} ${item.reservations.status == 'CHECKED IN' ? '' : 'hidden'} material-symbols-outlined rounded-full bg-blue-500 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">calendar_add_on</button>
                <button title="Reduce Stay" onclick="postingMasterOpenReduceStayFromDirectCheckin('${item.reservations.reference}')" class="${did('postingmasterform') ? '' : 'hidden'} ${item.reservations.status == 'CHECKED IN' ? '' : 'hidden'} material-symbols-outlined rounded-full bg-orange-500 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">event_busy</button>
            </div>
        </td>
        <td>${item.roomgeustrow.length}&nbsp;Room(s)</td>
        <td id="checkin-balance-cell-${item.reservations.id}" class="text-center">
            <button title="Click to load balance" onclick="postingMasterFetchDirectCheckinBalance('${item.reservations.reference}', '${item.reservations.id}')" class="material-symbols-outlined text-slate-500 hover:text-slate-700" style="font-size:18px;">visibility_off</button>
        </td>
        <td>${x}&nbsp;Person(s)
            <table  class="mx-auto">
                    <tbody>
                        ${item.roomgeustrow ?
                            item.roomgeustrow.map((datt, i)=>`
                                ${datt.guest1.length>0 ? `<tr>
                                    <td class="text-center opacity-70"><button title="Room Transfer" onclick="postingMasterRoomtransfer('${datt.roomdata?.roomnumber}', '${item.reservations.reference}', '${item.reservations.id}')" class="material-symbols-outlined ${item.reservations.status == 'CHECKED IN' ? !did('cancelreservationformfilter') ? '' : 'hidden' : 'hidden'} rounded-full bg-yellow-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">move_up</button> ${postingMasterNormalizeRoomNumberDisplay(datt.roomdata?.roomnumber)}</td>
                                    <td class="text-center opacity-70">${datt.guest1[0].firstname}&nbsp;${datt.guest1[0].lastname}&nbsp;${datt.guest1[0].othernames}</td>
                                    <td class="text-center opacity-70">${datt.guest1[0].phone}</td>
                                </tr>` : ''}
                                ${datt.guest2.length>0 ? `<tr>
                                    <td class="text-center opacity-70"><button title="Room Transfer" onclick="postingMasterRoomtransfer('${datt.roomdata?.roomnumber}', '${item.reservations.reference}', '${item.reservations.id}')" class="material-symbols-outlined ${item.reservations.status == 'CHECKED IN' ? !did('cancelreservationformfilter') ? '' : 'hidden' : 'hidden'} rounded-full bg-yellow-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">move_up</button> ${postingMasterNormalizeRoomNumberDisplay(datt.roomdata?.roomnumber)}</td>
                                    <td class="text-center opacity-70">${datt.guest2[0].firstname}&nbsp;${datt.guest2[0].lastname}&nbsp;${datt.guest2[0].othernames}</td>
                                    <td class="text-center opacity-70">${datt.guest2[0].phone}</td>
                                </tr>` : ''}
                                ${datt.guest3.length>0 ? `<tr>
                                    <td class="text-center opacity-70"><button title="Room Transfer" onclick="postingMasterRoomtransfer('${datt.roomdata?.roomnumber}', '${item.reservations.reference}', '${item.reservations.id}')" class="material-symbols-outlined ${item.reservations.status == 'CHECKED IN' ? !did('cancelreservationformfilter') ? '' : 'hidden' : 'hidden'} rounded-full bg-yellow-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">move_up</button> ${postingMasterNormalizeRoomNumberDisplay(datt.roomdata?.roomnumber)}</td>
                                    <td class="text-center opacity-70">${datt.guest3[0].firstname}&nbsp;${datt.guest1[0].lastname}&nbsp;${datt.guest3[0].othernames}</td>
                                    <td class="text-center opacity-70">${datt.guest3[0].phone}</td>
                                </tr>` : ''}
                                ${datt.guest4.length>0 ? `<tr>
                                    <td class="text-center opacity-70"><button title="Room Transfer" onclick="postingMasterRoomtransfer('${datt.roomdata?.roomnumber}', '${item.reservations.reference}', '${item.reservations.id}')" class="material-symbols-outlined ${item.reservations.status == 'CHECKED IN' ? !did('cancelreservationformfilter') ? '' : 'hidden' : 'hidden'} rounded-full bg-yellow-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">move_up</button> ${postingMasterNormalizeRoomNumberDisplay(datt.roomdata?.roomnumber)}</td>
                                    <td class="text-center opacity-70">${datt.guest4[0].firstname}&nbsp;${datt.guest1[0].lastname}&nbsp;${datt.guest4[0].othernames}</td>
                                    <td class="text-center opacity-70">${datt.guest4[0].phone}</td>
                                </tr>` : ''}
                            `).join('')
                            :
                            item.roomguestrow.map((datt, i)=>`
                                ${datt.guest1.length>0 ? `<tr>
                                    <td class="text-center opacity-70"><button title="Room Transfer" onclick="postingMasterRoomtransfer('${datt.roomdata?.roomnumber}', '${item.reservations.reference}', '${item.reservations.id}')" class="material-symbols-outlined ${item.reservations.status == 'CHECKED IN' ? !did('cancelreservationformfilter') ? '' : 'hidden' : 'hidden'} rounded-full bg-yellow-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">move_up</button> ${postingMasterNormalizeRoomNumberDisplay(datt.roomdata?.roomnumber)}</td>
                                    <td class="text-center opacity-70">${datt.guest1[0].firstname}&nbsp;${datt.guest1[0].lastname}&nbsp;${datt.guest1[0].othernames}</td>
                                    <td class="text-center opacity-70">${datt.guest1[0].phone}</td>
                                </tr>` : ''}
                                ${datt.guest2.length>0 ? `<tr>
                                    <td class="text-center opacity-70"><button title="Room Transfer" onclick="postingMasterRoomtransfer('${datt.roomdata?.roomnumber}', '${item.reservations.reference}', '${item.reservations.id}')" class="material-symbols-outlined ${item.reservations.status == 'CHECKED IN' ? !did('cancelreservationformfilter') ? '' : 'hidden' : 'hidden'} rounded-full bg-yellow-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">move_up</button> ${postingMasterNormalizeRoomNumberDisplay(datt.roomdata?.roomnumber)}</td>
                                    <td class="text-center opacity-70">${datt.guest2[0].firstname}&nbsp;${datt.guest2[0].lastname}&nbsp;${datt.guest2[0].othernames}</td>
                                    <td class="text-center opacity-70">${datt.guest2[0].phone}</td>
                                </tr>` : ''}
                                ${datt.guest3.length>0 ? `<tr>
                                    <td class="text-center opacity-70"><button title="Room Transfer" onclick="postingMasterRoomtransfer('${datt.roomdata?.roomnumber}', '${item.reservations.reference}', '${item.reservations.id}')" class="material-symbols-outlined ${item.reservations.status == 'CHECKED IN' ? !did('cancelreservationformfilter') ? '' : 'hidden' : 'hidden'} rounded-full bg-yellow-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">move_up</button> ${postingMasterNormalizeRoomNumberDisplay(datt.roomdata?.roomnumber)}</td>
                                    <td class="text-center opacity-70">${datt.guest3[0].firstname}&nbsp;${datt.guest1[0].lastname}&nbsp;${datt.guest3[0].othernames}</td>
                                    <td class="text-center opacity-70">${datt.guest3[0].phone}</td>
                                </tr>` : ''}
                                ${datt.guest4.length>0 ? `<tr>
                                    <td class="text-center opacity-70"><button title="Room Transfer" onclick="postingMasterRoomtransfer('${datt.roomdata?.roomnumber}', '${item.reservations.reference}', '${item.reservations.id}')" class="material-symbols-outlined ${item.reservations.status == 'CHECKED IN' ? !did('cancelreservationformfilter') ? '' : 'hidden' : 'hidden'} rounded-full bg-yellow-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">move_up</button> ${postingMasterNormalizeRoomNumberDisplay(datt.roomdata?.roomnumber)}</td>
                                    <td class="text-center opacity-70">${datt.guest4[0].firstname}&nbsp;${datt.guest1[0].lastname}&nbsp;${datt.guest4[0].othernames}</td>
                                    <td class="text-center opacity-70">${datt.guest4[0].phone}</td>
                                </tr>` : ''}
                            `).join('')
                        }
                    </tbody>
                </table>
        </td>
        <td>${formatNumber(item.reservations.numberofnights)}&nbsp;Night(s)</td>
        <td>${formatNumber(r)}</td>
        <td>${formatDate(item.reservations.arrivaldate)}</td>
        <td>${formatDate(item.reservations.departuredate)}</td>
        <td>${item.reservations.billinginfo}</td>
        <td>${companyOrTravelAgency}</td>
        <td>${formatDate(item.reservations.reservationdate)}</td>
        <td>${item.reservations.reference}</td>
        <td>${postingMasterNormalizeAmountPaidDisplay(item.reservations.amountpaid)}</td>
        <td class="${did('guestreservationform') ? '' : 'hidden'}">${item.reservations.timeline ? item.reservations.timeline : '--'}</td>
        <td>${item.reservations.status == 'OPEN' ? 'RESERVED' : item.reservations.status}</td>
    </tr> `}
    )
    .join('')
    injectPaginatatedTable(rows)
}

function postingMasterOpencheckinreceipt(id, ratee, rooms){
    let receiptdata = datasource.filter(data=>data.reservations.id == id)[0]
    if(!receiptdata)return callModal('Something went wrong...')
    const bookingRows = (receiptdata.roomgeustrow || receiptdata.roomguestrow || []).slice(0, 1)
    const totalRooms = bookingRows.length
    const totalRoomRate = bookingRows.reduce((sum, row)=>sum + Number(row?.roomdata?.roomrate || 0), 0)
    const calculatedTotalAmount = Math.max(totalRoomRate, 0)
    const savedTotalAmount = Number(receiptdata?.reservations?.totalamount || 0)
    const finalTotalAmount = savedTotalAmount > 0 ? savedTotalAmount : calculatedTotalAmount
    // did('invoiceno').setAttribute('value', receiptdata.reservations.reference)
    // did('invoiceno').value = receiptdata.reservations.reference
    // did('invoicedate').setAttribute('value', specialformatDateTime(receiptdata.reservations.reservationdate))
    // did('invoicedate').value = specialformatDateTime(receiptdata.reservations.reservationdate)
    // did('rbillto').setAttribute('value', receiptdata.roomgeustrow[0].guest1[0].firstname+' '+receiptdata.roomgeustrow[0].guest1[0].lastname)
    // did('rbillto').value =receiptdata.roomgeustrow[0].guest1[0].firstname+' '+receiptdata.roomgeustrow[0].guest1[0].lastname
    // did('rroomnumber').setAttribute('value', receiptdata.roomgeustrow[0].roomdata.roomnumber)
    // did('rpaymentmenthod').setAttribute('value', receiptdata.reservations.paymentmethod)
    // did('rpaymentmenthod').setAttribute('value', receiptdata.reservations.paymentmethod)
    // did('rcheckindate').textContent = specialformatDateTime(receiptdata.reservations.reservationdate)
    // did('rrroomnumber').textContent = 'Room '+receiptdata.roomgeustrow[0].roomdata.roomnumber
    // // did('ramountpaid').textContent = receiptdata.guests.origin+', '+receiptdata.guests.state
    // did('rnumberofnights').textContent = formatNumber(receiptdata.reservations.numberofnights)
    // did('rbalance').textContent = formatNumber(Number(receiptdata.reservations.numberofnights)*Number(receiptdata.reservations.roomrate))

    did('modalreceipt').innerHTML = `
        <div id="invoicecontainer" class="w-full mx-auto border rounded shadow p-10 bg-white relative">
                                    <div class="w-full flex justify-end">
                                            <span class="material-symbols-outlined text-red-500 cp hover:scale-[1.3] transition-all" onclick="did('modalreceipt').classList.add('hidden')">close</span>
                                        </div>
                                <div class="flex mb-8 justify-between">
                                    <div class="w-2/4">
                                        <div class="mb-2 md:mb-1 md:flex items-center">
                                            <label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Invoice No.</label>
                                            <div class="flex-1">
                                            <input value="${receiptdata.reservations.reference}" id="invoiceno" readonly class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="eg. #INV-100001">
                                            </div>
                                        </div>

                                        <div class="mb-2 md:mb-1 md:flex items-center">
                                            <label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Invoice Date</label>
                                            <div class="flex-1">
                                            <input id="invoicedate" value="${specialformatDateTime(receiptdata.reservations.reservationdate)}" readonly class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker" type="text" id="datepicker1" placeholder="eg. 17 Feb, 2020" autocomplete="off" readonly="">
                                            </div>
                                        </div>
                                        <div class="mb-2 md:mb-1 md:flex items-center">
                                            <label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Arrival</label>
                                            <div class="flex-1">
                                            <input id="invoicedate" value="${specialformatDateTime(receiptdata.reservations.arrivaldate)}" readonly class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker" type="text" id="datepicker1" placeholder="eg. 17 Feb, 2020" autocomplete="off" readonly="">
                                            </div>
                                        </div>
                                        <div class="mb-2 md:mb-1 md:flex items-center">
                                            <label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Departure</label>
                                            <div class="flex-1">
                                            <input id="invoicedate" value="${specialformatDateTime(receiptdata.reservations.departuredate)}" readonly class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker" type="text" id="datepicker1" placeholder="eg. 17 Feb, 2020" autocomplete="off" readonly="">
                                            </div>
                                        </div>

                                        <!--<div class="mb-2 md:mb-1 md:flex items-center">-->
                                        <!--    <label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Due date</label>-->
                                        <!--    <span class="mr-4 inline-block hidden md:block">:</span>-->
                                        <!--    <div class="flex-1">-->
                                        <!--    <input class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker-2" id="datepicker2" type="text" placeholder="eg. 17 Mar, 2020" x-model="invoiceDueDate" x-on:change="invoiceDueDate = document.getElementById('datepicker2').value" autocomplete="off" readonly="">-->
                                        <!--    </div>-->
                                        <!--</div>-->
                                    </div>
                                    <div>
                                        <span class="xl:w-[250px] pb-10 font-bold text-2xl text-base block py-3 pl-5 selection:bg-white uppercase font-heebo text-primary-g text-right">He<span class="text-gray-400">ms Reservation</span></span>
                                        <div class="flex justify-end">
                                        <div onclick="printContent('HEMS INVOICE', null, 'invoicecontainer', true)" class="relative mr-4 inline-block">
                                            <div class="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 inline-flex items-center justify-center" onclick="printInvoice()">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-printer" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                    <rect x="0" y="0" width="24" height="24" stroke="none"></rect>
                                                    <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"></path>
                                                    <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"></path>
                                                    <rect x="7" y="13" width="10" height="8" rx="2"></rect>
                                                </svg>
                                            </div>
                                            <div  class="z-40 shadow-lg text-center w-32 block absolute right-0 top-0 p-2 mt-12 rounded-lg bg-gray-800 text-white text-xs" style="display: none;">
                                                Print this invoice!
                                            </div>
                                        </div>
                                        <div onclick="did('modalreceipt').classList.add('hidden')" class="relative inline-block">
                                            <div class="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 inline-flex items-center justify-center" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false" @click="printInvoice()">
                                                <span class="material-symbols-outlined text-red-500 cp-500">cancel</span>
                                            </div>
                                            <div x-show.transition="showTooltip" class="z-40 shadow-lg text-center w-32 block absolute right-0 top-0 p-2 mt-12 rounded-lg bg-gray-800 text-white text-xs" style="display: none;">
                                                cancel
                                            </div>
                                        </div>

                                    </div>
                                    </div>
  </div>

                                <div class="flex flex-wrap justify-between mb-8">
                                    <div class="w-full md:w-1/3 mb-2 md:mb-0">
                                        <label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Bill info:</label>
                                        <input readonly value="${receiptdata.reservations.billinginfo}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                                        <label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Cancellation Date:</label>
                                        <input readonly value="${receiptdata.reservations.cancellationdate}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                                        <label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Source:</label>
                                        <input readonly value="${receiptdata.reservations.source}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                                        <label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Status:</label>
                                        <input readonly value="${receiptdata.reservations.status == 'OPEN' ? 'RESERVED' : receiptdata.reservations.status }" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                                        <label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Total Rate:</label>
                                        <input readonly value="${formatNumber(totalRoomRate)}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                                        <label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Total Rooms:</label>
                                        <input readonly value="${totalRooms}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                                    </div>
                                    <div class="w-full md:w-1/3">
                                        <label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Firm:</label>
                                        <input value="Hems Limited" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Your company name" >
                                        <label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Group:</label>
                                        <input readonly value="${receiptdata.reservations.groupname}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                                        <label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Company:</label>
                                        <input readonly value="${receiptdata.reservations.companyname}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                                        <label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Travel Agent:</label>
                                        <input readonly value="${receiptdata.reservations.travelagentname}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                                        <label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Type of Guest:</label>
                                        <input readonly value="${receiptdata.reservations.typeofguest}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                                        <label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Re-assignment Date:</label>
                                        <input readonly value="${receiptdata.reservations.roomreassignmentdate}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                                    </div>
                                </div>

                                <div class="table-content">
                                    <table id="tableer" class="mx-auto">
                                        <thead>
                                            <tr>
                                                 <th style="width: 20px">s/n</th>
                                                <th class="text-center opacity-70">Room&nbsp;Category</th>
                                                <th class="text-center opacity-70">Room</th>
                                                <th class="text-center opacity-70">
                                                    <table  class="mx-auto">
                                                        <thead>
                                                            <tr  class="!bg-[#64748b] !text-white !p-0">
                                                                 <th style="width: 20px">s/n</th>
                                                                <th style="width: 60px" class="text-center opacity-70">name</th>
                                                                <th style="width: 60px" class="text-center opacity-70">phone&nbsp;number</th>
                                                            </tr>
                                                        </thead>
                                                    </table>
                                                </th>
                                                <th class="text-center opacity-70">rate</th>
                                            </tr>
                                        </thead>
                                        <tbody id="roomtabledata">
                                            ${
                                                bookingRows.map((item, index)=>{
                                                    const roomRate = Number(item.roomdata.roomrate || 0)
                                                    return `
                                                        <tr>
                                                            <td>${index + 1 }</td>
                                                            <td>${item.roomdata.roomcategoryname}</td>
                                                            <td>${item.roomdata.roomnumber}</td>
                                                            <td>
                                                                <table  class="mx-auto">
                                                                        <tbody>
                                                                            ${item.guest1.length>0 ? `<tr>
                                                                                <td class="text-center opacity-70">1</td>
                                                                                <td id="rcheckindate" class="text-center opacity-70">${item.guest1[0].firstname}&nbsp;${item.guest1[0].lastname}&nbsp;${item.guest1[0].othernames}</td>
                                                                                <td id="rcheckindate" class="text-center opacity-70">${item.guest1[0].phone}</td>
                                                                            </tr>` : ''}
                                                                        </tbody>
                                                                    </table>
                                                            </td>
                                                            <td>${formatNumber(roomRate)}</td>
                                                        </tr> `
                                                }).join('')
                                            }
                                        </tbody>
                                    </table>
                                </div>



  <!--                              <div class="flex -mx-1 border-b py-2 items-start">-->
  <!--                                  <div class="w-10 px-1">-->
  <!--                                      <p class="text-gray-800 uppercase tracking-wide text-sm font-bold">S/N</p>-->
  <!--                                  </div>-->
  <!--                                  <div class="w-150 px-1">-->
  <!--                                      <p class="text-gray-800 uppercase tracking-wide text-sm font-bold">Check-in Date</p>-->
  <!--                                  </div>-->

  <!--                                  <div class="px-1 w-40 text-right">-->
  <!--                                      <p class="text-gray-800 uppercase tracking-wide text-sm font-bold">room no.</p>-->
  <!--                                  </div>-->
  <!--                                  <div class="px-1 w-40 text-right">-->
  <!--                                      <p class="text-gray-800 uppercase tracking-wide text-sm font-bold">no. of night</p>-->
  <!--                                  </div>-->

  <!--                                  <div class="px-1 flex-1 text-right">-->
  <!--                                      <p class="leading-none">-->
  <!--                                          <span class="block uppercase tracking-wide text-sm font-bold text-gray-800">debit</span>-->
                                            <!--<span class="font-medium text-xs text-gray-500">(Incl. GST)</span>-->
  <!--                                      </p>-->
  <!--                                  </div>-->

  <!--                                  <div class="px-1 flex-1 text-right">-->
  <!--                                      <p class="leading-none">-->
  <!--                                          <span class="block uppercase tracking-wide text-sm font-bold text-gray-800">Credit</span>-->
                                            <!--<span class="font-medium text-xs text-gray-500">(Incl. GST)</span>-->
  <!--                                      </p>-->
  <!--                                  </div>-->
  <!--                                  <div class="px-1 flex-1 text-right">-->
  <!--                                      <p class="leading-none">-->
  <!--                                          <span class="block uppercase tracking-wide text-sm font-bold text-gray-800">balance</span>-->
                                            <!--<span class="font-medium text-xs text-gray-500">(Incl. GST)</span>-->
  <!--                                      </p>-->
  <!--                                  </div>-->
  <!--</div>-->


                                    <div class="flex hidden -mx-1 py-2 border-b">
                                        <div class="w-10 px-1">
                                            <p class="text-gray-800" >1</p>
                                        </div>
                                        <div class="w-150 px-1">
                                            <p id="rcheckindate" class="text-gray-800"></p>
                                        </div>

                                        <div class="px-1 w-40 text-right">
                                            <p id="rrroomnumber" class="text-gray-800"></p>
                                        </div>

                                        <div class="px-1 w-40 text-right">
                                            <p id="rnumberofnights" class="text-gray-800"></p>
                                        </div>

                                        <div class="flex-1 px-1 text-right">
                                            <p id="rdebit" class="text-gray-800"></p>
                                        </div>

                                        <div class="flex-1 px-1 text-right">
                                            <p id="rcredit" class="text-gray-800"></p>
                                        </div>

                                        <div class="flex-1 px-1 text-right">
                                            <p id="rbalance" class="text-gray-800"></p>
                                        </div>
                                    </div>

                                <div class="py-2 ml-auto mt-5 w-full sm:w-2/4 lg:w-1/3">
                                    <div class="flex justify-between mb-3">
                                        <div class="text-gray-800 text-right flex-1">Total Room Rate</div>
                                        <div class="text-right w-40">
                                            <div id="rtotalbalance" class="text-gray-800 font-medium">${formatNumber(totalRoomRate)}</div>
                                        </div>
                                    </div>
                                    <div class="py-2 border-t border-b">
                                        <div class="flex justify-between">
                                            <div class="text-xl text-gray-600 text-right flex-1">Total&nbsp;Amount</div>
                                            <div class="text-right w-40">
                                                <div id="rtotalpaid" class="text-xl text-gray-800 font-bold">${formatNumber(finalTotalAmount)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="py-10 text-center">
                                    <p class="text-gray-600">Created by <a class="text-blue-600 hover:text-blue-500 border-b-2 border-blue-200 hover:border-blue-300" href="https://twitter.com/mithicher">Mira Technologies</a>.</p>
                                </div>





                            </div>
    `


    did('modalreceipt').classList.remove('hidden')
}

function postingMasterNormalizeSubmittedRoomRowsFromRecord(record = null) {
    if(!record) return []
    const bookingRows = record.roomgeustrow || record.roomguestrow || []
    if(!Array.isArray(bookingRows)) return []
    return bookingRows.map((row, index) => ({
        serial: index + 1,
        category: String(row?.roomdata?.roomcategoryname || '').trim(),
        roomnumber: String(row?.roomdata?.roomnumber || '').trim(),
        ratecode: String(row?.roomdata?.ratecodename || '').trim(),
        roomrate: Number(row?.roomdata?.roomrate || 0),
        planamount: Number(row?.roomdata?.planamount || 0),
        discountamount: Number(row?.roomdata?.discountamount || 0),
        plandiscountamount: Number(row?.roomdata?.plandiscountamount || 0),
        guests: [
            ...(Array.isArray(row?.guest1) ? row.guest1 : []),
            ...(Array.isArray(row?.guest2) ? row.guest2 : []),
            ...(Array.isArray(row?.guest3) ? row.guest3 : []),
            ...(Array.isArray(row?.guest4) ? row.guest4 : [])
        ].map((guest) => `${String(guest?.firstname || '').trim()} ${String(guest?.lastname || '').trim()} ${String(guest?.othernames || '').trim()}`.replace(/\s+/g, ' ').trim()).filter(Boolean)
    }))
}

async function postingMasterFetchSubmittedCheckinFallbackByReference(reference = '') {
    const ref = String(reference || '').trim()
    if(!ref) return null
    const payload = new FormData()
    payload.append('reference', ref)
    const request = await httpRequest2(postingMasterController('receiptFallback'), payload, null, 'json')
    if(!request?.status) return null
    if(Array.isArray(request?.data) && request.data.length) return request.data[0]
    if(request?.data && typeof request.data === 'object') return request.data
    return null
}

async function postingMasterBuildSubmittedCheckinReceiptContext(formId = '', saveResponse = {}, invoiceResponse = {}) {
    const form = did(formId)
    if(!form) return null

    const bookingReference = postingMasterGetCheckinResponseReference(saveResponse)
    const paymentReference = postingMasterGetCheckinResponseReference(invoiceResponse)
    const reservationDate = String(did('reservationdate')?.value || '').trim()
    const arrivalDate = String(did('arrivaldate')?.value || '').trim()
    const departureDate = String(did('departuredate')?.value || '').trim()
    const numberOfNights = Number(did('numberofnights')?.value || 0) || 0
    const reservationType = String(did('reservationtype')?.value || '').trim()
    const paymentMethod = String(did('paymentmethod')?.value || '').trim()
    const bankName = String(did('bankname')?.value || '').trim()
    const otherDetails = String(did('otherdetails')?.value || '').trim()
    const billingInfo = String(did('billinginfo')?.value || '').trim()
    const source = String(did('source')?.value || '').trim()
    const status = String(did('status')?.value || 'RESERVED').trim()
    const amountPaid = postingMasterGetCheckinAmountPaidValue()
    const totalDue = postingMasterGetCheckinNumericValue(did('totalamount')?.value || 0)
    const balance = Math.max(totalDue - amountPaid, 0)
    const company = postingMasterGetCheckinSummarySelectText('company')
    const travelAgent = postingMasterGetCheckinSummarySelectText('travelagent')
    const groupName = postingMasterGetCheckinSummarySelectText('group_id')

    let roomRows = []
    const roomCategories = postingMasterGetCheckinScopedElements(formId, 'roomcategory')
    roomRows = roomCategories.map((categoryEl, index) => {
        const id = String(categoryEl?.id || '').replace('roomcategory-', '').trim()
        const guests = postingMasterGetCheckinSummaryGuests(id).map(guest => String(guest?.name || '').trim()).filter(Boolean)
        return {
            serial: index + 1,
            category: String(categoryEl.options?.[categoryEl.selectedIndex]?.textContent || '').trim(),
            roomnumber: String(did('roomnumber-'+id)?.value || '').trim(),
            ratecode: String(did('ratecodename-'+id)?.value || '').trim(),
            roomrate: postingMasterGetCheckinNumericValue(did('roomrate-'+id)?.value || 0),
            planamount: postingMasterGetCheckinNumericValue(did('planamount-'+id)?.value || 0),
            discountamount: postingMasterGetCheckinNumericValue(did('discountamount-'+id)?.value || 0),
            plandiscountamount: postingMasterGetCheckinNumericValue(did('plandiscountamount-'+id)?.value || 0),
            guests
        }
    }).filter(row => row.category || row.roomnumber || row.ratecode || row.roomrate || row.guests.length)

    if(!roomRows.length && bookingReference) {
        const inMemoryRecord = Array.isArray(datasource) ? datasource.find((record) => String(record?.reservations?.reference || '').trim() === bookingReference) : null
        roomRows = postingMasterNormalizeSubmittedRoomRowsFromRecord(inMemoryRecord)
    }

    if(!roomRows.length && bookingReference) {
        const fetchedRecord = await postingMasterFetchSubmittedCheckinFallbackByReference(bookingReference)
        roomRows = postingMasterNormalizeSubmittedRoomRowsFromRecord(fetchedRecord)
    }

    const totalRoomRate = roomRows.reduce((sum, row) => sum + Number(row.roomrate || 0), 0)
    const totalPlanAmount = roomRows.reduce((sum, row) => sum + Number(row.planamount || 0), 0)
    const totalRoomDiscount = roomRows.reduce((sum, row) => sum + Number(row.discountamount || 0), 0)
    const totalPlanDiscount = roomRows.reduce((sum, row) => sum + Number(row.plandiscountamount || 0), 0)

    return {
        bookingReference,
        paymentReference,
        reservationDate,
        arrivalDate,
        departureDate,
        numberOfNights,
        reservationType,
        paymentMethod,
        bankName,
        otherDetails,
        billingInfo,
        source,
        status,
        amountPaid,
        totalDue,
        balance,
        company,
        travelAgent,
        groupName,
        roomRows,
        totalRoomRate,
        totalPlanAmount,
        totalRoomDiscount,
        totalPlanDiscount
    }
}

function postingMasterPrintSubmittedCheckinPaymentReceipt() {
    const receiptPrintStyles = `
        <style>
            h1 { display: none !important; }
            html, body { background: #fff !important; }
            .submitted-payment-receipt-paper {
                width: 80mm !important;
                max-width: 80mm !important;
                margin: 0 auto !important;
                box-shadow: none !important;
                border: 0 !important;
            }
            .submitted-payment-receipt-paper img {
                max-width: 48px !important;
                max-height: 48px !important;
            }
        </style>
    `
    printContent('HEMS PAYMENT RECEIPT', receiptPrintStyles, 'submittedpaymentreceiptcontainer', false)
}

function postingMasterOpenSubmittedCheckinPaymentReceipt(context = null) {
    if(!context || !did('modalreceipt')) return
    const rows = Array.isArray(context.roomRows) ? context.roomRows : []
    const logoValue = String(did('your_companylogo')?.value || '').trim()
    const logoPath = logoValue && logoValue !== '-' ? `../images/${logoValue}` : ''
    const companyName = String(did('your_companyname')?.value || 'HEMS').trim()
    const companyAddress = String(did('your_companyaddress')?.value || '').trim()
    const companyPhone = String(did('your_companyphone')?.value || '').trim()
    const companyInitials = companyName.split(/\s+/).filter(Boolean).map(word => word.charAt(0)).join('').slice(0, 2).toUpperCase() || 'HM'
    const formatReceiptDate = (value = '') => {
        const raw = String(value || '').trim()
        if(!raw) return '-'
        try {
            return specialformatDateTime(raw.replace('T', ' ')) || raw
        } catch(error) {
            return raw
        }
    }
    const renderMetaLine = (label = '', value = '', always = false) => {
        const text = String(value ?? '').trim()
        if(!text && !always) return ''
        return `
            <div style="display: flex; justify-content: space-between; gap: 10px; padding: 2px 0;">
                <span style="color: #64748b;">${postingMasterEscapeCheckinSummaryText(label)}</span>
                <span style="text-align: right; font-weight: 700; word-break: break-word;">${postingMasterEscapeCheckinSummaryText(text || '-')}</span>
            </div>
        `
    }
    const rowMarkup = rows.length ? rows.map((row, index) => {
        const guests = row.guests?.length ? row.guests.join(', ') : '-'
        const serial = row.serial || index + 1
        const roomrate = Number(row.roomrate || 0)
        return `
            <div style="padding: 9px 0; border-bottom: 1px dashed #cbd5e1;">
                <div style="display: flex; justify-content: space-between; gap: 8px; font-weight: 800; color: #0f172a;">
                    <span style="max-width: 62%; word-break: break-word;">${serial}. ${postingMasterEscapeCheckinSummaryText(row.category || 'Room')}</span>
                    <span>${formatNumber(roomrate)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; gap: 8px; color: #475569; font-size: 10px; margin-top: 2px;">
                    <span>Room: ${postingMasterEscapeCheckinSummaryText(row.roomnumber || '-')}</span>
                    <span>Rate: ${formatNumber(roomrate)}</span>
                </div>
                ${row.ratecode ? `<div style="color: #475569; font-size: 10px; margin-top: 2px;">Rate Code: ${postingMasterEscapeCheckinSummaryText(row.ratecode)}</div>` : ''}
                ${guests && guests !== '-' ? `<div style="color: #475569; font-size: 10px; margin-top: 2px; word-break: break-word;">Guest: ${postingMasterEscapeCheckinSummaryText(guests)}</div>` : ''}
            </div>
        `
    }).join('') : `<div style="padding: 14px 0; text-align: center; color: #64748b; border-bottom: 1px dashed #cbd5e1;">No room lines available</div>`

    did('modalreceipt').innerHTML = `
        <div class="w-full flex justify-center">
            <div class="w-[360px] max-w-full">
                <div id="submittedpaymentreceiptcontainer">
                    <div class="submitted-payment-receipt-paper" style="width: 80mm; max-width: 100%; margin: 0 auto; background: #ffffff; color: #0f172a; padding: 12px 11px 14px; font-family: 'Courier New', monospace; font-size: 11px; line-height: 1.35; border: 1px solid #e2e8f0; border-radius: 6px; box-shadow: 0 18px 45px rgba(15,23,42,.20);">
                        <div style="height: 5px; background: linear-gradient(90deg, #0f172a, #14b8a6, #0f172a); border-radius: 4px; margin-bottom: 10px;"></div>
                        <div style="text-align: center; border-bottom: 1px dashed #0f172a; padding-bottom: 10px;">
                            ${logoPath ? `<img src="${postingMasterEscapeCheckinSummaryText(logoPath)}" alt="Company logo" style="width: 48px; height: 48px; object-fit: contain; margin: 0 auto 6px; display: block;">` : `<div style="width: 46px; height: 46px; border: 1px solid #0f172a; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 6px; font-weight: 800; font-size: 14px;">${postingMasterEscapeCheckinSummaryText(companyInitials)}</div>`}
                            <div style="font-size: 14px; font-weight: 800; text-transform: uppercase;">${postingMasterEscapeCheckinSummaryText(companyName)}</div>
                            ${companyAddress ? `<div style="font-size: 10px; color: #475569; margin-top: 2px;">${postingMasterEscapeCheckinSummaryText(companyAddress)}</div>` : ''}
                            ${companyPhone ? `<div style="font-size: 10px; color: #475569;">Tel: ${postingMasterEscapeCheckinSummaryText(companyPhone)}</div>` : ''}
                            <div style="margin-top: 8px; font-weight: 800; font-size: 12px; color: #ffffff; background: #0f172a; border-radius: 4px; display: inline-block; padding: 3px 10px;">PAYMENT RECEIPT</div>
                        </div>

                        <div style="padding: 9px 0; border-bottom: 1px dashed #cbd5e1;">
                            ${renderMetaLine('Payment Ref', context.paymentReference, true)}
                            ${renderMetaLine('Booking Ref', context.bookingReference, true)}
                            ${renderMetaLine('Date', formatReceiptDate(context.reservationDate) !== '-' ? formatReceiptDate(context.reservationDate) : new Date().toLocaleString(), true)}
                            ${renderMetaLine('Method', context.paymentMethod, true)}
                            ${renderMetaLine('Bank', context.bankName)}
                        </div>

                        <div style="padding: 9px 0; border-bottom: 1px dashed #cbd5e1;">
                            <div style="font-weight: 800; margin-bottom: 5px; color: #0f172a;">STAY DETAILS</div>
                            ${renderMetaLine('Arrival', formatReceiptDate(context.arrivalDate), true)}
                            ${renderMetaLine('Departure', formatReceiptDate(context.departureDate), true)}
                            ${renderMetaLine('Nights', context.numberOfNights || '-', true)}
                            ${renderMetaLine('Company', context.company)}
                            ${renderMetaLine('Agent', context.travelAgent)}
                            ${renderMetaLine('Group', context.groupName)}
                        </div>

                        <div style="padding: 4px 0;">
                            <div style="display: flex; justify-content: space-between; font-weight: 800; padding: 6px 0; border-bottom: 1px solid #0f172a;">
                                <span>DESCRIPTION</span>
                                <span>AMOUNT</span>
                            </div>
                            ${rowMarkup}
                        </div>

                        <div style="padding: 10px 0; border-top: 1px dashed #0f172a; border-bottom: 1px dashed #0f172a;">
                            <div style="display: flex; justify-content: space-between; color: #334155;"><span>Room Rate</span><span>${formatNumber(context.totalRoomRate || 0)}</span></div>
                            <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 13px; margin-top: 7px;"><span>Total Due</span><span>${formatNumber(context.totalDue || 0)}</span></div>
                            <div style="display: flex; justify-content: space-between; align-items: center; background: #ecfeff; border: 1px solid #67e8f9; border-radius: 5px; padding: 5px 6px; margin-top: 6px; font-weight: 800; font-size: 14px;"><span>PAID</span><span>${formatNumber(context.amountPaid || 0)}</span></div>
                            <div style="display: flex; justify-content: space-between; font-weight: 800; margin-top: 5px;"><span>Balance</span><span>${formatNumber(context.balance || 0)}</span></div>
                        </div>

                        ${context.otherDetails ? `<div style="padding: 9px 0; border-bottom: 1px dashed #cbd5e1;"><div style="font-weight: 800;">NOTE</div><div style="word-break: break-word; color: #475569;">${postingMasterEscapeCheckinSummaryText(context.otherDetails)}</div></div>` : ''}
                        <div style="text-align: center; padding-top: 12px;">
                            <div style="font-weight: 800;">Thank you for your payment</div>
                            <div style="font-size: 10px; color: #64748b; margin-top: 4px;">Please keep this receipt for your records.</div>
                            <div style="margin-top: 10px; border-top: 1px dashed #cbd5e1; padding-top: 8px; font-size: 9px; color: #64748b;">Generated by HEMS</div>
                        </div>
                    </div>
                </div>
                <div class="phide flex justify-center gap-2 mt-4">
                    <button type="button" onclick="postingMasterPrintSubmittedCheckinPaymentReceipt()" class="px-5 py-2 rounded-md bg-slate-900 text-white text-xs font-semibold shadow">Print</button>
                    <button type="button" onclick="did('modalreceipt').classList.add('hidden')" class="px-5 py-2 rounded-md bg-white text-slate-700 text-xs font-semibold shadow">Cancel</button>
                </div>
            </div>
        </div>
    `
    did('modalreceipt').classList.remove('hidden')
}

function postingMasterQueueSubmittedCheckinPaymentReceipt(context = null) {
    if(!context) return
    try {
        sessionStorage.setItem(CHECKIN_PENDING_PAYMENT_RECEIPT_KEY, JSON.stringify(context))
    } catch(error) {
        console.error(error)
    }
}

function postingMasterFlushSubmittedCheckinPaymentReceipt() {
    try {
        const raw = sessionStorage.getItem(CHECKIN_PENDING_PAYMENT_RECEIPT_KEY)
        if(!raw) return
        sessionStorage.removeItem(CHECKIN_PENDING_PAYMENT_RECEIPT_KEY)
        const context = JSON.parse(raw)
        if(context) postingMasterOpenSubmittedCheckinPaymentReceipt(context)
    } catch(error) {
        sessionStorage.removeItem(CHECKIN_PENDING_PAYMENT_RECEIPT_KEY)
        console.error(error)
    }
}

function postingMasterGetGuestReservationRequiredIds() {
    return getIdFromCls('comp', 'guestreservationform').filter(id => !String(id || '').startsWith('roomnumber-'));
}

function postingMasterCheckDuplicateRoomNumbers(root = document) {
    const roomNumberElements = root.getElementsByClassName('roomnumber');
    const roomNumbers = new Set();

    for (let i = 0; i < roomNumberElements.length; i++) {
        const roomNumber = String(roomNumberElements[i].value || '').trim();
        if(!roomNumber)continue;
        if (roomNumbers.has(roomNumber)) {
            notification('Duplicate room number found: ' + roomNumber);
            return true; // Duplicate found
        }
        roomNumbers.add(roomNumber);
    }

    return false; // No duplicates found
}

function postingMasterNormalizeSinglePostingMasterForm(form){
    const roomCards = Array.from(did('roomfullcontainer')?.children || [])
    roomCards.slice(1).forEach(card => card.remove())
    const firstRoomId = String(form?.querySelector('.roomcategory')?.id || '').replace('roomcategory-', '').trim()
    Array.from(form?.querySelectorAll('.adult') || []).forEach(input => input.value = 1)
    Array.from(form?.querySelectorAll('.child, .infant, .planamount, .discountamount, .plandiscountperc, .plandiscountamount') || []).forEach(input => input.value = 0)
    Array.from(form?.querySelectorAll('.plan, .discountcoupon') || []).forEach(input => input.value = '')
    if(did('otherdiscount')) did('otherdiscount').value = 0
    if(firstRoomId && did('moreguestcontainer-'+firstRoomId)){
        const guestRows = Array.from(did('moreguestcontainer-'+firstRoomId).children || [])
        guestRows.slice(1).forEach(row => row.remove())
    }
}

async function postingMasterCheckinnFormSubmitHandler(guest){
    if(!guest)return notification('Wrong call point', 0)
    const form = did(guest)
    if(!form)return notification('Unable to submit. The active form was not found.', 0)
    const submitButton = form.querySelector('#submit')
    if(checkinSubmitLocks[guest])return notification('Submission already in progress. Please wait.', 0)

    checkinSubmitLocks[guest] = true
    if(submitButton)submitButton.disabled = true

    let request
    let successNotified = false

    try {
        if(guest == 'postingmasterform') postingMasterNormalizeSinglePostingMasterForm(form)
        if(!postingMasterValidateSubmittedCheckinForm(guest))return

        if(postingMasterIsCheckinPaymentForm(guest)){
            const canSubmitPaymentState = await postingMasterRunCheckinOtherDetailsSubmitGuard(guest)
            if(!canSubmitPaymentState)return
        }

        if(guest == 'cancelreservationform' && window.Swal){
            const cancelResult = await Swal.fire({
              title: "Are you sure?",
              text: "You won't be able to revert this!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, delete it!"
            })
            if(!cancelResult.isConfirmed)return
        }

        postingMasterCalculatetotals()
        if(postingMasterCheckDuplicateRoomNumbers(form))return

        const rn = postingMasterGetCheckinScopedElements(guest, 'roomnumber')
        const adultControls = postingMasterGetCheckinScopedElements(guest, 'adult')
        const guestContainers = postingMasterGetCheckinScopedElements(guest, 'moreguestcontainer')

        for (let i = 0; i < rn.length; i++) {
            const adultCount = String(adultControls[i]?.value || '').trim()
            const guestCount = String(guestContainers[i]?.children?.length || 0)

            if (adultCount !== guestCount) {
                const roomLabel = rn[i]?.value || `row ${i + 1}`
                notification(`The number of adults in room ${roomLabel} does not match with the number of guest provided.`, 0)
                adultControls[i]?.scrollIntoView?.({ behavior: 'smooth', block: 'center' })
                return
            }
        }

        ;[
            'roomcategory',
            'roomnumber',
            'adult',
            'child',
            'infant',
            'ratecode',
            'ratecodename',
            'plan',
            'planamount',
            'roomrate',
            'discountcoupon',
            'discountamount',
            'plandiscountperc',
            'plandiscountamount',
            'guestid'
        ].forEach(cls => givenamebyclass(cls, cls, form))

        function payload(){
            let param =  new FormData(form)
            if(checkinid)param.append('id', checkinid)
            if(guest == 'reassignroomsform' && typeof reassignid !== 'undefined' && reassignid)param.set('id', reassignid)
            param.append('photofilename', showFileName('imageurl'))
            param.append('userphotoname', getFile('imageurl'))
            if(did('arrivaldate'))param.set('arrivaldate', did('arrivaldate').value.replace('T', ' '))
            if(did('departuredate'))param.set('departuredate', did('departuredate').value.replace('T', ' '))
            param.set('rowsize', rn.length)
            param.set('otherdiscount', 0)
            if(did('totalamount'))param.set('totalamount', did('totalamount').value || 0)

            for(let i=0;i<rn.length;i++){
               const container = guestContainers[i]
               if(container?.children?.length > 1){
                   for(let j=1;j<container.children.length;j++){
                       const extraGuestId = container.children[j]?.children?.[0]?.children?.[2]?.value || ''
                       param.append(`guestid${i+1}_${j}`, extraGuestId)
                   }
               }
            }

            return param
        }
        function payloadcancel(){
            let param =  new FormData()
            param.set('refund', did('refund')?.value || '')
            param.set('paymentmethod', did('paymentmethod')?.value || '')
            param.set('reasonforcancellation', did('reasonforcancellation')?.value || '')
            param.set('reference', did('referencer')?.value || '')
            if(did('bankname'))param.set('bankname', did('bankname').value)
            if(did('otherdetails'))param.set('otherdetails', did('otherdetails').value)
            appendReceivingBankMoreData(param)

            return param
        }
        function payloadstay(){
            let param =  new FormData()
            param.set('reference', did('referencer')?.value || '')
            param.set('numberofnights', did('numberofnights')?.value || '')
            param.set('departuredate', `${String(did('departuredate')?.value || '').replace('T', ' ')}:00`)

            return param
        }
        async function payloadinvoice() {
            const roomCardsCount = rn.length
            const amountPaidValue = postingMasterGetCheckinAmountPaidValue()
            const isReservationFlow = guest == 'guestreservationform' || guest == 'reservationpostingmasterform'
            const shouldAskDistribution = roomCardsCount > 1 && amountPaidValue > 0 && !isReservationFlow

            let distribute = 'NO'
            if (shouldAskDistribution && window.Swal) {
                const result = await Swal.fire({
                    title: 'Distribute Payment',
                    text: 'Do you want to distribute the payment?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    customClass: {
                        confirmButton: 'btn btn-md !bg-blue-500 !text-white mx-2',
                        cancelButton: 'btn btn-md !bg-red-500 !text-white mx-2'
                    },
                    buttonsStyling: false
                })
                distribute = result.isConfirmed ? 'YES' : 'NO'
            }

            let p = new FormData()
            p.append('reference', postingMasterGetCheckinResponseReference(request))
            p.append('paymentmethod', did('paymentmethod')?.value || '')
            p.append('totaldue', did('totalamount')?.value || 0)
            p.append('amountpaid', did('amountpaid')?.value || '')
            p.append('distribute', distribute)
            p.append('bankname', did('bankname')?.value || '')
            p.append('otherdetails', did('otherdetails')?.value || '')
            appendReceivingBankMoreData(p)

            return p
        }

        if(guest == 'postingmasterform')request = await httpRequest2(postingMasterController('save'), payload(), submitButton)
        if(guest == 'reassignroomsform')request = await httpRequest2(postingMasterController('transferroom'), payload(), submitButton)
        if(guest == 'guestreservationform')request = await httpRequest2(postingMasterController('reservations'), payload(), submitButton)
        if(guest == 'reservationpostingmasterform')request = await httpRequest2(postingMasterController('reservationcheckin'), payload(), submitButton)
        if(guest == 'cancelreservationform')request = await httpRequest2(postingMasterController('cancelreservation'), payloadcancel(), submitButton)
        if(guest == 'extendstayform'){
            const isReduceStayMode = !!did('reducestaymode')
            const stayController = isReduceStayMode ? postingMasterController('reducestay') : postingMasterController('extendstay')
            request = await httpRequest2(stayController, payloadstay(), submitButton)
        }

        if(!request || request.status !== true) {
            return notification(postingMasterGetCheckinResponseMessage(request, 'Submit failed. Please check your connection/session and try again.'), 0)
        }

        if((postingMasterIsCheckinPaymentForm(guest) || guest == 'grouppostingmasterform') && guest != 'cancelreservationform' && guest != 'extendstayform'){
            const amountPaidValue = postingMasterGetCheckinAmountPaidValue()
            const previousAmountPaid = populateddata && checkinid ? postingMasterGetCheckinNumericValue(populateddata.amountpaid || 0) : 0
            const shouldPostPayment = amountPaidValue > 0 && (!populateddata || !checkinid || previousAmountPaid !== amountPaidValue)

            if(amountPaidValue <= 0) {
                notification('Saved successfully without payment posting.', 1)
                successNotified = true
            } else if(shouldPostPayment) {
                const bookingReference = postingMasterGetCheckinResponseReference(request)
                if(!bookingReference) {
                    notification('Saved, but payment could not be posted because no reference was returned.', 0)
                    successNotified = true
                } else {
                    const requestinvoice = await httpRequest2(postingMasterController('payment'), await payloadinvoice(), submitButton)
                    const invoiceMessage = postingMasterGetCheckinResponseMessage(requestinvoice, 'Payment posting failed. Please reach out for support.')
                    if(requestinvoice?.status) {
                        notification(invoiceMessage, 1)
                        successNotified = true
                        const paymentReceiptContext = await postingMasterBuildSubmittedCheckinReceiptContext(guest, request, requestinvoice)
                        postingMasterQueueSubmittedCheckinPaymentReceipt(paymentReceiptContext)
                    } else {
                        notification(invoiceMessage, 0)
                        successNotified = true
                        if(window.Swal) {
                            Swal.fire({
                                title: 'Failed payment',
                                text: invoiceMessage,
                                icon: 'error',
                                confirmButtonText: 'Okay',
                                customClass: {
                                  confirmButton: 'btn btn-md !bg-blue-500 !text-white mx-2',
                                },
                                buttonsStyling: false
                            })
                        }
                    }
                }
            }
        } else if(guest == 'cancelreservationform' && window.Swal){
            Swal.fire({
              title: "Cancelled!",
              text: "Reservation Cancelled",
              icon: "success"
            })
        }

        populateddata = ''
        checkinid = ''
        if(guest == 'postingmasterform')document.querySelector('#postingmaster')?.click()
        if(guest == 'reassignroomsform')document.querySelector('#reassignrooms')?.click()
        if(guest == 'guestreservationform')document.querySelector('#guestsreservations')?.click()
        if(guest == 'reservationpostingmasterform')document.querySelector('#reservationcheckin')?.click()
        if(guest == 'grouppostingmasterform')document.querySelector('#groupcheckin')?.click()
        if(guest == 'extendstayform')document.querySelector(did('reducestaymode') ? '#reducestay' : '#extendstay')?.click()
        if(guest == 'cancelreservationform')document.querySelector('#cancelreservation')?.click()
        if(guest != 'cancelreservationform' || guest == 'extendstayform')postingMasterFetchcheckinn()
        if (guest == 'cancelreservationform') {
            const elements = document.querySelectorAll('#cancelreservationform input, #cancelreservationform select, #cancelreservationform textarea')
            if(elements)elements.forEach(element => {
                if (!element.classList.contains('sss')) element.disabled = true
            })
        }

        console.log('returned response', request)
        if(!successNotified)notification(postingMasterGetCheckinResponseMessage(request, 'Saved successfully.'), 1)
    } catch(error) {
        console.error(error)
        notification(error?.message || 'Unable to submit. Please try again.', 0)
    } finally {
        checkinSubmitLocks[guest] = false
        if(submitButton)submitButton.disabled = false
    }
}


window.postingmasterActive = postingMasterCheckinActive
window.postingMasterFetchSubmittedCheckinFallbackByReference = postingMasterFetchSubmittedCheckinFallbackByReference
window.postingMasterApplyReservationTypePaymentRequirement = postingMasterApplyReservationTypePaymentRequirement
window.postingMasterSetupReservationTypePaymentRequirement = postingMasterSetupReservationTypePaymentRequirement
window.postingMasterRecalculateRoomCardAfterRoomSelection = postingMasterRecalculateRoomCardAfterRoomSelection
window.postingMasterRecalculateAllRoomCardsForRateContext = postingMasterRecalculateAllRoomCardsForRateContext
window.postingMasterNormalizeSubmittedRoomRowsFromRecord = postingMasterNormalizeSubmittedRoomRowsFromRecord
window.postingMasterResolveCategoryRateForActiveContext = postingMasterResolveCategoryRateForActiveContext
window.postingMasterOpenReceiveDepositFromDirectCheckin = postingMasterOpenReceiveDepositFromDirectCheckin
window.postingMasterBuildSubmittedCheckinReceiptContext = postingMasterBuildSubmittedCheckinReceiptContext
window.postingMasterPrintSubmittedCheckinPaymentReceipt = postingMasterPrintSubmittedCheckinPaymentReceipt
window.postingMasterQueueSubmittedCheckinPaymentReceipt = postingMasterQueueSubmittedCheckinPaymentReceipt
window.postingMasterFlushSubmittedCheckinPaymentReceipt = postingMasterFlushSubmittedCheckinPaymentReceipt
window.postingMasterSetCheckinPaymentMethodDefaultCash = postingMasterSetCheckinPaymentMethodDefaultCash
window.postingMasterWaitForDirectCheckinTransferTarget = postingMasterWaitForDirectCheckinTransferTarget
window.postingMasterOpenStayInterfaceFromDirectCheckin = postingMasterOpenStayInterfaceFromDirectCheckin
window.postingMasterOpenSubmittedCheckinPaymentReceipt = postingMasterOpenSubmittedCheckinPaymentReceipt
window.postingMasterRunCheckinOtherDetailsSubmitGuard = postingMasterRunCheckinOtherDetailsSubmitGuard
window.postingMasterRecalculateCheckinFormFromDates = postingMasterRecalculateCheckinFormFromDates
window.postingMasterCollectCheckinTariffSummaryData = postingMasterCollectCheckinTariffSummaryData
window.postingMasterRenderCheckinCalculationSummary = postingMasterRenderCheckinCalculationSummary
window.postingMasterOpenExtendStayFromDirectCheckin = postingMasterOpenExtendStayFromDirectCheckin
window.postingMasterOpenReduceStayFromDirectCheckin = postingMasterOpenReduceStayFromDirectCheckin
window.postingMasterApplyCheckinViewFrontendSearch = postingMasterApplyCheckinViewFrontendSearch
window.postingMasterResolveAndApplyRateForRoomCard = postingMasterResolveAndApplyRateForRoomCard
window.postingMasterRenderCheckinFullDetailSummary = postingMasterRenderCheckinFullDetailSummary
window.postingMasterRefreshCheckinSummaryAndTotals = postingMasterRefreshCheckinSummaryAndTotals
window.postingMasterGetGuestReservationRequiredIds = postingMasterGetGuestReservationRequiredIds
window.postingMasterBindCheckinViewFrontendSearch = postingMasterBindCheckinViewFrontendSearch
window.postingMasterClearCalculatedRoomCardValues = postingMasterClearCalculatedRoomCardValues
window.postingMasterUpdateAllRoomRatePerDayLabels = postingMasterUpdateAllRoomRatePerDayLabels
window.postingMasterShowCheckinValidationFeedback = postingMasterShowCheckinValidationFeedback
window.postingMasterConfirmCheckinNoPaymentSubmit = postingMasterConfirmCheckinNoPaymentSubmit
window.postingMasterRenderCheckinSummaryTabButton = postingMasterRenderCheckinSummaryTabButton
window.postingMasterValidateSubmittedCheckinForm = postingMasterValidateSubmittedCheckinForm
window.postingMasterGetActiveCheckinRateContext = postingMasterGetActiveCheckinRateContext
window.postingMasterGetCheckinResponseReference = postingMasterGetCheckinResponseReference
window.postingMasterOpenGuestReservationForEdit = postingMasterOpenGuestReservationForEdit
window.postingMasterGetCheckinSummarySelectText = postingMasterGetCheckinSummarySelectText
window.postingMasterBuildCheckinViewSearchText = postingMasterBuildCheckinViewSearchText
window.postingMasterGetCheckinRoomCategoryMeta = postingMasterGetCheckinRoomCategoryMeta
window.postingMasterNormalizeRoomNumberDisplay = postingMasterNormalizeRoomNumberDisplay
window.postingMasterNormalizeAmountPaidDisplay = postingMasterNormalizeAmountPaidDisplay
window.postingMasterSetCheckinTariffSummaryTab = postingMasterSetCheckinTariffSummaryTab
window.postingMasterRenderCheckinGuestsSummary = postingMasterRenderCheckinGuestsSummary
window.postingMasterRenderCheckinTariffSummary = postingMasterRenderCheckinTariffSummary
window.postingMasterToggleCheckinTariffSummary = postingMasterToggleCheckinTariffSummary
window.postingMasterUpdateNetTariffFooterLabel = postingMasterUpdateNetTariffFooterLabel
window.postingMasterConfirmCheckinRateUpgrade = postingMasterConfirmCheckinRateUpgrade
window.postingMasterUpdateRoomRatePerDayLabel = postingMasterUpdateRoomRatePerDayLabel
window.postingMasterGetCheckinAmountPaidValue = postingMasterGetCheckinAmountPaidValue
window.postingMasterGetCheckinResponseMessage = postingMasterGetCheckinResponseMessage
window.postingMasterAssignallcheckinlisteners = postingMasterAssignallcheckinlisteners
window.postingMasterCategorizeRoomsByBuilding = postingMasterCategorizeRoomsByBuilding
window.postingMasterFetchDirectCheckinBalance = postingMasterFetchDirectCheckinBalance
window.postingMasterCheckDuplicateRoomNumbers = postingMasterCheckDuplicateRoomNumbers
window.postingMasterCheckinnFormSubmitHandler = postingMasterCheckinnFormSubmitHandler
window.postingMasterFetchCheckinRatecodeById = postingMasterFetchCheckinRatecodeById
window.postingMasterGetCheckinScopedElements = postingMasterGetCheckinScopedElements
window.postingMasterEscapeCheckinSummaryText = postingMasterEscapeCheckinSummaryText
window.postingMasterRemoveguestsreservations = postingMasterRemoveguestsreservations
window.postingMasterOncheckinTableDataSignal = postingMasterOncheckinTableDataSignal
window.postingMasterNormalizeCheckinOrgType = postingMasterNormalizeCheckinOrgType
window.postingMasterBindCheckinSubmitButton = postingMasterBindCheckinSubmitButton
window.postingMasterGetCheckinSummaryGuests = postingMasterGetCheckinSummaryGuests
window.postingMasterPopulaterestcheckindata = postingMasterPopulaterestcheckindata
window.postingMasterGetCheckinNumericValue = postingMasterGetCheckinNumericValue
window.postingMasterFetchdiscountcouponres = postingMasterFetchdiscountcouponres
window.postingMasterGetCheckinRequiredIds = postingMasterGetCheckinRequiredIds
window.postingMasterRemoveCheckinRoomCard = postingMasterRemoveCheckinRoomCard
window.postingMasterRemoveCheckinGuestRow = postingMasterRemoveCheckinGuestRow
window.postingMasterRuncouponcalculations = postingMasterRuncouponcalculations
window.postingMasterGetCheckinSelectText = postingMasterGetCheckinSelectText
window.postingMasterEnsureRateSourceNode = postingMasterEnsureRateSourceNode
window.postingMasterSetRateSourceMessage = postingMasterSetRateSourceMessage
window.postingMasterIsCheckinPaymentForm = postingMasterIsCheckinPaymentForm
window.postingMasterTravelssubmithandler = postingMasterTravelssubmithandler
window.postingMasterCompanysubmithandler = postingMasterCompanysubmithandler
window.postingMasterGroupssubmithandler = postingMasterGroupssubmithandler
window.postingMasterChecksessionstorage = postingMasterChecksessionstorage
window.postingMasterRenderSummaryMetric = postingMasterRenderSummaryMetric
window.postingMasterGrouptravelagentres = postingMasterGrouptravelagentres
window.postingMasterReverseareservation = postingMasterReverseareservation
window.postingMasterGetCheckinFormRoot = postingMasterGetCheckinFormRoot
window.postingMasterHandlecheckinphone = postingMasterHandlecheckinphone
window.postingMasterOpencheckinreceipt = postingMasterOpencheckinreceipt
window.postingMasterCheckplandiscount = postingMasterCheckplandiscount
window.postingMasterHandlecheckinrate = postingMasterHandlecheckinrate
window.postingMasterCheckinpopulatedl = postingMasterCheckinpopulatedl
window.postingMasterOpentheroomboard = postingMasterOpentheroomboard
window.postingMasterPerformAsyncTask = postingMasterPerformAsyncTask
window.postingMasterCalculatetotals = postingMasterCalculatetotals
window.postingMasterControlroomlist = postingMasterControlroomlist
window.postingMasterGroupcompanyres = postingMasterGroupcompanyres
window.postingMasterFetchtravelsres = postingMasterFetchtravelsres
window.postingMasterFetchcompanyres = postingMasterFetchcompanyres
window.postingMasterSubmitguestform = postingMasterSubmitguestform
window.postingMasterReverseapproved = postingMasterReverseapproved
window.postingMasterRenderRoomTable = postingMasterRenderRoomTable
window.postingMasterDatedifference = postingMasterDatedifference
window.postingMasterCheckinaddroom = postingMasterCheckinaddroom
window.postingMasterFetchgroupsres = postingMasterFetchgroupsres
window.postingMasterGetStatusClass = postingMasterGetStatusClass
window.postingMasterGetButtonClass = postingMasterGetButtonClass
window.postingMasterHandleRoomClick = postingMasterHandleRoomClick
window.postingMasterCheckinActive = postingMasterCheckinActive
window.postingMasterGetplanamount = postingMasterGetplanamount
window.postingMasterOpenguestform = postingMasterOpenguestform
window.postingMasterFetchcheckinn = postingMasterFetchcheckinn
window.postingMasterRoomtransfer = postingMasterRoomtransfer
window.postingMasterRunratcod = postingMasterRunratcod
window.postingMasterGroupres = postingMasterGroupres
})();
