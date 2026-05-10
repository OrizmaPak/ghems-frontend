async function reducestayActive() {
    notification('Loading...')
    const form = document.querySelector('#extendstayform')
    await checkinpopulatedl()
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', e=>{
        if(!validateReduceStayDates())return
        checkinnFormSubmitHandler('extendstayform')
    })
    if(document.querySelector('#phone')) document.querySelector('#phone').addEventListener('change', e=>handlecheckinphone('phone')) 
    if(document.querySelector('#submitguestmodal')) document.querySelector('#submitguestmodal').addEventListener('click', e=>submitguestform())
    if(document.querySelector('#submitcompany'))document.querySelector('#submitcompany').addEventListener('click', companysubmithandle)
    if(document.querySelector('#submittravel'))document.querySelector('#submittravel').addEventListener('click', travelssubmithandle) 
    if(document.querySelector('#company'))document.querySelector('#company').addEventListener('change', e=>groupcompanyres()) 
    if(document.querySelector('#travelagent'))document.querySelector('#travelagent').addEventListener('change', e=>grouptravelagentres())  
    if(document.querySelector('#group_id'))document.querySelector('#group_id').addEventListener('change', e=>groupres()) 
    if(document.querySelector('#submitref')) document.querySelector('#submitref').addEventListener('click', fetchdataforreducestay)
    if(document.querySelector('#room-type'))document.querySelector('#room-type').addEventListener('change', e=>{
        if(!actionid)return
        did('roomcategory-'+actionid).value = did('room-type').value 
        controlroomlist(actionid, 'roomcategory')   
    })  
    if(document.querySelector('#roomnumber'))document.querySelector('#roomnumber').addEventListener('click', e=>{
        if(document.querySelector('#roomnumber').getAttribute('readonly'))notification('Please Select a room category before you can select a room')
    }) 
    if(document.querySelector('#rummodalselectbtn'))document.querySelector('#rummodalselectbtn').addEventListener('click', e=>{
        if(did('room-no').value){  
            did('roomnumber').value = did('room-no').value
            did('roommodal').classList.add('hidden')
        }
    }) 
    datasource = []
    await fetchtravelsres()
    await fetchcompanyres()
    await fetchgroupsres()
    did('initialroombtn').click()
}

function normalizeDateTimeLocalValue(value = '') {
    if(!value)return ''
    return String(value).replace(' ', 'T').slice(0, 16)
}

function validateReduceStayDates() {
    const originalDeparture = did('originaldeparturedate')?.value || ''
    const arrivalValue = did('arrivaldate')?.value || ''
    const departureValue = did('departuredate')?.value || ''
    if(!originalDeparture){ notification('Please load a reservation before reducing the stay.', 0); return false }
    if(!arrivalValue || !departureValue){ notification('Please enter arrival and reduced departure dates.', 0); return false }

    const originalDate = new Date(normalizeDateTimeLocalValue(originalDeparture))
    const arrivalDate = new Date(arrivalValue)
    const newDepartureDate = new Date(departureValue)
    if(Number.isNaN(originalDate.getTime()) || Number.isNaN(arrivalDate.getTime()) || Number.isNaN(newDepartureDate.getTime())){ notification('Please enter valid stay dates.', 0); return false }
    if(newDepartureDate >= originalDate){ notification('Reduce Stay requires a departure date earlier than the current departure date.', 0); return false }
    if(newDepartureDate <= arrivalDate){ notification('Reduced departure date must be after the arrival date.', 0); return false }
    return true
}

async function fetchdataforreducestay(id) {
    did('mainform').classList.add('hidden')
    if(!did('reference').value)return notification('Please enter a valid reference number', 0)
    function getparamm(){ 
        let paramstr = new FormData()
        paramstr.append('reference', did('reference').value)
        return paramstr
    } 
    let request = await httpRequest2('../controllers/fetchreservationbyref', getparamm(), document.querySelector('#submitref'), 'json')
    if(request.status) {
        datasource = request.data
        const reservation = request.data[0]?.reservations || {}
        did('referencer').value = did('reference').value
        did('originaldeparturedate').value = normalizeDateTimeLocalValue(reservation.departuredate || '')
        did('mainform').classList.remove('hidden')
        await fetchcheckinn(reservation.id)

        const originalDeparture = normalizeDateTimeLocalValue(reservation.departuredate || did('departuredate').value)
        did('originaldeparturedate').value = originalDeparture
        if(did('departuredate')){
            did('departuredate').max = originalDeparture
            did('departuredate').addEventListener('change', validateReduceStayDates)
        }
        notification('Reservation loaded. Select an earlier departure date to reduce the stay.', 1)
    }
    else{
        did('reducestay').click()
        return notification(request.message, 0)
    }
}
