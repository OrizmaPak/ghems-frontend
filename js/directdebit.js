async function directdebitActive() {
    const form = document.querySelector('#directdebitform')
    if(!form) return
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', directdebitFormSubmitHandler)
    await hydrateDirectDebitSalesPoints()
}

async function hydrateDirectDebitSalesPoints() {
    const salespoint = document.getElementById('salespoint')
    if(!salespoint) return
    const defaultValue = 'Booking/Reservation'

    try {
        const request = await httpRequest2('../controllers/fetchdepartment', null, null, 'json')
        if(request?.status && Array.isArray(request.data)) {
            const options = Array.from(new Set(
                request.data
                    .map((row) => String(row?.department || row?.name || '').trim())
                    .filter(Boolean)
                    .map((value) => value === 'FRONT-DESK/BOOKING' ? defaultValue : value)
            ))

            salespoint.innerHTML = ''
            if(!options.includes(defaultValue)) options.unshift(defaultValue)
            else {
                options.splice(options.indexOf(defaultValue), 1)
                options.unshift(defaultValue)
            }

            options.forEach((value) => {
                salespoint.insertAdjacentHTML('beforeend', `<option value="${value.replace(/"/g, '&quot;')}">${value}</option>`)
            })
            salespoint.value = defaultValue
            return
        }
    } catch (e) {}

    salespoint.innerHTML = `<option value="${defaultValue}" selected>${defaultValue}</option>`
}

async function directdebitFormSubmitHandler() {
    if(!validateForm('directdebitform', ['salespoint', 'roomnumber', 'debitamount'])) {
        return notification('Please enter all compulsory fields', 0)
    }

    const form = document.querySelector('#directdebitform')
    const payload = new FormData()
    payload.append('salespoint', String(form.salespoint.value || '').trim())
    payload.append('roomnumber', String(form.roomnumber.value || '').trim())
    payload.append('debitamount', String(form.debitamount.value || '').trim())
    payload.append('narration', String(form.narration.value || '').trim())

    const request = await httpRequest2('../controllers/directdebit', payload, document.querySelector('#directdebitform #submit'))
    if(request?.status) {
        notification(request.message || 'Direct debit posted successfully', 1)
        form.reset()
        if(form.salespoint) form.salespoint.value = 'Booking/Reservation'
        return
    }
    return notification(request?.message || 'Unable to post direct debit', 0)
}
