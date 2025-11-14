async function cancelreservationActive() {
    notification('Loading...')
    // markallcomp()
    const form = document.querySelector('#cancelreservationform')
    await checkinpopulatedl()
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', e=>checkinnFormSubmitHandler('cancelreservationform'))
    if(document.querySelector('#phone')) document.querySelector('#phone').addEventListener('change', e=>handlecheckinphone('phone')) 
    if(document.querySelector('#submitguestmodal')) document.querySelector('#submitguestmodal').addEventListener('click', e=>submitguestform())
    if(document.querySelector('#submitcompany'))document.querySelector('#submitcompany').addEventListener('click', companysubmithandle)
    if(document.querySelector('#submittravel'))document.querySelector('#submittravel').addEventListener('click', travelssubmithandle) 
    if(document.querySelector('#company'))document.querySelector('#company').addEventListener('change', e=>groupcompanyres()) 
    if(document.querySelector('#company'))document.querySelector('#company').addEventListener('change', e=>groupcompanyres()) 
    if(document.querySelector('#travelagent'))document.querySelector('#travelagent').addEventListener('change', e=>grouptravelagentres())  
    if(document.querySelector('#group_id'))document.querySelector('#group_id').addEventListener('change', e=>groupres()) 
    // if(document.querySelector('#roomcategory'))document.querySelector('#roomcategory').addEventListener('change', e=>controlroomlist('roomcategory')) 
    if(document.querySelector('#submitref')) document.querySelector('#submitref').addEventListener('click', fetchdataforcancelreservation)
    if(document.querySelector('#paymentmethod')) document.querySelector('#paymentmethod').addEventListener('click', e=>checkotherbankdetails('comp22'))
    if(document.querySelector('#room-type'))document.querySelector('#room-type').addEventListener('change', e=>{
        if(!actionid)return
        did('roomcategory-'+actionid).value = did('room-type').value 
        controlroomlist(actionid, 'roomcategory')   
    })  
    // if(document.querySelector('#plandiscountperc'))document.querySelector('#plandiscountperc').addEventListener('change', e=>checkplandiscount()) 
    if(document.querySelector('#roomnumber'))document.querySelector('#roomnumber').addEventListener('click', e=>{
        if(document.querySelector('#roomnumber').getAttribute('readonly'))notification('Please Select a room category before you can select a room')
    }) 
    if(document.querySelector('#rummodalselectbtn'))document.querySelector('#rummodalselectbtn').addEventListener('click', e=>{
        if(did('room-no').value){  
            did('roomnumber').value = did('room-no').value
            did('roommodal').classList.add('hidden')
        }
    }) 
    // if(document.querySelector('#discountcoupon'))document.querySelector('#discountcoupon').addEventListener('change', e=>runcouponcalculations()) 
    datasource = []
    await fetchcheckinn('', '', 'cancelreservationformfilter') 
    await fetchtravelsres()
    await fetchcompanyres()
    await fetchgroupsres()
    did('initialroombtn').click()
    cancelcheckreservation();
}
// every functions can be found in the index.js checkin.js and oreutil.js

function cancelcheckreservation(){
    if(sessionStorage.getItem('cancelreservation')){
        did('reference').value = sessionStorage.getItem('cancelreservation');
        sessionStorage.removeItem('cancelreservation')
        did('submitref').click()
    }
}

async function fetchdataforcancelreservation(id) {
  // Hide the main form
  did('mainform').classList.add('hidden');

  // Validate if reference is provided
  if (!did('reference').value) {
    return notification('Please enter a valid reference number', 0);
  }

  // Prepare the request parameters
  function getParam() {
    const formData = new FormData();
    formData.append('reference', did('reference').value);
    return formData;
  }

  // Make an HTTP request to fetch reservation data
  const request = await httpRequest2(
    '../controllers/fetchreservationbyref',
    getParam(),
    document.querySelector('#submitref'),
    'json'
  );

  // Handle the response
  if (request.status) {
    const reservation = request.data[0].reservations;

    // Update UI based on the response
    datasource = request.data;
    did('referencer').value = did('reference').value;
    did('mainform').classList.add('hidden');

    // Check reservation status
    if (reservation.status !== 'RESERVED' && reservation.status !== 'OPEN') {
      did('reference').value = '';
      return notification(`The guest has already ${reservation.status}`, 0);
    }

    did('mainform').classList.remove('hidden');
    checksessionstorage(reservation.id);

    // Handle further UI updates or data rendering here if needed
  } else {
    did('invoicing').click();
    return notification(request.message, 0);
  }
}

