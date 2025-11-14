let checkinid
let populateddata // this is to hold the data populated
let rr // this means a store roomcategory object for when the user enters the room number
let ratedata // this holds the rate amount details pertaining to the rate code in the room  category
let discountcoup // this will be used to hold all coupon data
let planobj // this is used to keep the plan object
let nameandidofguest  // this will carry an array of the name and id of the newly created guest
let actionid // this is the variable that will hold id in memory for me
let distribute = "YES"
async function checkinActive() {
    notification('Loading...')
    checkinid = ''
    // markallcomp() 
    const form = document.querySelector('#checkinform')  
    await checkinpopulatedl() 
    // if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', e=>checkinnFormSubmitHandler('checkinform'))
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', e=>{
        if(document.getElementById('reservationtype').value == 'GUARANTEED'){
            if(did('amountpaid').value == ''){
                notification('please Enter Amount Paid', 0);
                return did('modalformone').classList.remove('hidden')
            }
            if (did('paymentmethod').value == 'TRANSFER') {
                if (!did('bankname').value || !did('otherdetails').value) {
                    notification('Please Enter Customer\'s Bank Name and Other Details');
                    did('modalformone').classList.remove('hidden');
                    return;  // Prevent further execution
                }
            }
        return checkinnFormSubmitHandler('checkinform')
        }
        return checkinnFormSubmitHandler('checkinform')
    })
    if(document.querySelector('#phone')) document.querySelector('#phone').addEventListener('change', e=>handlecheckinphone('phone'))
    // if(document.querySelector('#submitguestmodal')) document.querySelector('#submitguestmodal').addEventListener('click', e=>submitguestform())
    if(document.querySelector('#submitcompany'))document.querySelector('#submitcompany').addEventListener('click', companysubmithandler)
    if(document.querySelector('#submittravel'))document.querySelector('#submittravel').addEventListener('click', travelssubmithandler)
    if(document.querySelector('#submitgroups'))document.querySelector('#submitgroups').addEventListener('click', groupssubmithandler)
    if(document.querySelector('#company'))document.querySelector('#company').addEventListener('change', e=>groupcompanyres()) 
    if(document.querySelector('#travelagent'))document.querySelector('#travelagent').addEventListener('change', e=>grouptravelagentres()) 
    if(document.querySelector('#group_id'))document.querySelector('#group_id').addEventListener('change', e=>groupres()) 
    // if(document.querySelector('#roomcategory'))document.querySelector('#roomcategory').addEventListener('change', e=>controlroomlist('roomcategory')) 
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
    await fetchcheckinn() 
    await fetchtravelsres()
    await fetchcompanyres()
    await fetchgroupsres()
    did('initialroombtn').click()
    if(sessionStorage.getItem('checkinfromsomewhere')){
        let id = sessionStorage.getItem('checkinfromsomewhere')
        fetchcheckinn(id)
        sessionStorage.removeItem('checkinfromsomewhere')
    } 
    
} 


async function groupssubmithandler(){
    if(!validateForm('groupofguestsform', getIdFromCls('comp')))return notification('some data are not provided...', 0)
    let payload

    payload = getFormData2(document.querySelector('#groupofguestsform'))
    let request = await httpRequest2('../controllers/guestgroup', payload, document.querySelector('#groupofguestsform #submitgroups'))
    if(request.status) {
        did('groupform').classList.add('hidden') 
            fetchgroupsres('', document.querySelector('#groupname').value)
        notification(request.message, 1);
        return
    } 
    
    return notification(request.message, 0);
}

async function travelssubmithandler(){
    if(!validateForm('travelagencyform', getIdFromCls('compt')))return notification('some data are not provided...', 0)
    let payload

    payload = getFormData2(document.querySelector('#travelagencyform'))
    let request = await httpRequest2('../controllers/travelagency', payload, document.querySelector('#travelagencyform #submittravel'))
    if(request.status) {
        did('travelform').classList.add('hidden')
            fetchtravelsres('', did('agencyname').value)
        return notification(request.message, 1);
    } 
    // document.querySelector('#guestsform').reset();
    // fetchguestsreservations();
    return notification(request.message, 0);
}

async function companysubmithandler(){
    if(!validateForm('companyform', getIdFromCls('compp')))return notification('some data are not provided...', 0)
    let payload

    payload = new FormData(document.getElementById('companyform'))
    let request = await httpRequest2('../controllers/companyforgroups', payload, document.querySelector('#submitcompany'))
    if(request.status) {
        did('companyformm').classList.add('hidden')
        fetchcompanyres('', did('companyname').value)
        notification(request.message, 1)
        return
    } 
    return notification(request.message, 0);
}

function checksessionstorage(id=''){
    if(document.getElementsByClassName('updater')[0])runoptioner(document.getElementsByClassName('updater')[0])
    if(sessionStorage.getItem('checkinfromsomewhere')){
        let id = sessionStorage.getItem('checkinfromsomewhere')
        fetchcheckinn(id)
        sessionStorage.removeItem('checkinfromsomewhere')
    }
    if(id){
        fetchcheckinn(id)
        sessionStorage.removeItem('checkinfromsomewhere')
    }
}

function datedifference() {
            const startdate = document.querySelector('#arrivaldate').value;
            const enddate = document.querySelector('#departuredate').value;
            const nightInput = document.querySelector('#numberofnights');
            
            if (!startdate || !enddate) {
                notification("Please select both start and end dates.", 0);
                return;
            }

            const start = new Date(startdate);
            const end = new Date(enddate);

            const timeDifference = end - start;
            const dayDifference = timeDifference / (1000 * 60 * 60 * 24);

            if (dayDifference < 0) {
                notification("Invalid: End date is before start date.", 0);
                startdate = ''
                enddate = ''
                nightInput.value = '';
                return;
            }

            nightInput.value = Math.floor(dayDifference);
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

function calculatetotals(){
    did('totalrate').previousElementSibling.textContent = 'Total Amount'
    did('totalplan').previousElementSibling.textContent = 'Total Due'
    let tr = 0;
    let trd = 0;
    let tp = 0;
    let tpd = 0;
    for(let i=0;i<document.getElementsByClassName('roomnumber').length;i++){
        tr = Number(document.getElementsByClassName('roomrate')[i].value)+tr
        trd = Number(document.getElementsByClassName('discountamount')[i].value)+trd
        tp = Number(document.getElementsByClassName('planamount')[i].value)+tp
        tpd = Number(document.getElementsByClassName('plandiscountamount')[i].value)+tpd
    }
    did('totalrate').textContent = formatNumber(tr + tp)
    did('totaldiscount').textContent = formatNumber(trd+tpd)
    did('totalplan').textContent = formatNumber((tr + tp) - (trd + tpd))
    if(document.getElementById('totalamount'))document.getElementById('totalamount').value = (tr + tp) - (trd + tpd)
}

// this is the function that adds new card
async function checkinaddroom(){
    let id = genID()
    let el = document.createElement('div')
    el.classList.add('relative', 'border', 'rounded', 'py-3', 'px-4', 'mt-6', '!mb-2.5', 'bg-[#f5f5f5]', 'shadow-lg')
    el.setAttribute('onclick', `if(actionid != ${id}){actionid = ${id};runratcod()}`)
    el.innerHTML = `                            <button onclick="this.parentElement.remove()" type="button" class="absolute top-[-25px] shadow right-0 flex justify-center items-center text-white w-10 h-10 bg-red-400 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1 me-1 mb-1 cark:bg-red-600 cark:hover:bg-red-700 focus:outline-none cark:focus:ring-red-800"><span class="material-symbols-outlined">delete</span></button>
                                                <button onclick="checkinaddroom()" type="button" class="absolute top-[-25px] shadow right-14 flex justify-center items-center text-white w-10 h-10 bg-green-400 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 me-1 mb-1 cark:bg-green-600 cark:hover:bg-green-700 focus:outline-none cark:focus:ring-green-800"><span class="material-symbols-outlined">add</span></button>
    
                                        
                                                <!--Room Category room industry source-->
                                                <div class="grid grid-cols-1 !mb-1 lg:grid-cols-2 gap-10">
                                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                                        <div class="form-group">
                                                            <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">room category</label>
                                                            <select name="roomcategory" id="roomcategory-${id}" onchange="controlroomlist('${id}', 'roomcategory')" class="bg-white roomcategory form-control comp !p-1 ">
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
                                                            <button id="searchroombtn-${id}" onclick="opentheroomboard('${id}')" type="button" class="hidden scale-[0.7] absolute top-0 right-0 text-white w-10 h-10 bg-blue-400 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 me-1 mb-1 cark:bg-blue-600 cark:hover:bg-blue-700 focus:outline-none cark:focus:ring-blue-800"><span class="material-symbols-outlined">search</span></button>
                                                        </div>
                                                    </div>
                                                    <div class="grid grid-cols-1 lg:grid-cols-5 gap-10">
                                                            <div class="form-group">
                                                                <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">adults</label> 
                                                                <input type="number" onchange="handlecheckinrate('${id}','true')" maxlength="2" name="adult" id="adult-${id}" class="bg-white adult form-control !p-2 comp" placeholder=""  oninput="enforceMaxLength(this)">
                                                            </div>
                                                            <div class="form-group">
                                                                <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">children</label>
                                                                <input type="number" onchange="handlecheckinrate('${id}','true')" maxlength="2" name="child" id="children-${id}" class="bg-white child form-control !p-2 comp2" placeholder=""  oninput="enforceMaxLength(this)">
                                                            </div>
                                                            <div class="form-group">
                                                                <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">Infants</label>
                                                                <input type="number" maxlength="2" name="infant" id="infant-${id}" class="bg-white infant form-control !p-2 comp2" placeholder=""  oninput="enforceMaxLength(this)">
                                                            </div>
                                                            <div class="form-group col-span-2">
                                                                <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">rate&nbsp;code</label>
                                                                <input type="text" name="ratecodename" list="hems_rate_code" onchange="checkdatalist(this, 'ratecodee-${id}', 'hems_rate_code_id')?runratcod('',true):runratcod('',true)" id="ratecodename-${id}" class="bg-transparent ratecodename !p-1 comp2 border" placeholder="">
                                                                <input type="text" readonly name="ratecode" id="ratecodee-${id}" class="bg-transparent ratecode !p-1 comp2 border hidden" placeholder="">
                                                            </div>
                                                        </div>
                                            </div>
                                                
                                                <div class="grid grid-cols-1 !mb-1 lg:grid-cols-2 gap-10">
                                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                                            <div class="form-group">
                                                                <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">plan</label> 
                                                                <input type="text" name="plan" readonly id="plan-${id}" class="bg-transparent plan !p-1 comp2 border" placeholder="">
                                                            </div>
                                                            <div class="form-group">
                                                                <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">plan amount</label>
                                                                <input type="text" name="planamount" readonly id="planamount-${id}" class="bg-transparent planamount !p-1 comp2 border" placeholder="">
                                                            </div>
                                                            <div class="form-group">
                                                                <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">rate</label>
                                                                <input type="number" readonly name="roomrate" id="roomrate-${id}" class="bg-transparent roomrate !p-1 comp2 border" >
                                                                <!--<select name="roomrate" onchange="getcategoryrateguest(document.getElementById('roomcategory'))" id="roomrate" class="bg-white  form-control !p-2 comp2" >-->
                                                                <!--</select>-->
                                                            </div>
                                                        </div>
                                                        <div class="grid grid-cols-1 lg:grid-cols-4 gap-10">
                                                            <div class="form-group">
                                                                <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">discount&nbsp;coupon</label> 
                                                                <select onchange="runcouponcalculations()" name="discountcoupon" id="discountcoupon-${id}" class="bg-white discountcoupon form-control !p-1 comp2">
                                                                    <option>Loading...</option>
                                                                </select>
                                                            </div>
                                                            <div class="form-group">
                                                                <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">discount&nbsp;amount</label>
                                                                <input type="text" name="discountamount" id="discountamount-${id}" class="bg-transparent discountamount !p-1 comp2 border" placeholder="">
                                                            </div>
                                                            <div class="form-group">
                                                                    <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">plan&nbsp;discount&nbsp;(%)</label> 
                                                                    <input type="text" onchange="checkplandiscount()" name="plandiscountperc" id="plandiscountperc-${id}" class="bg-white plandiscountperc form-control !p-2 comp2" placeholder="">
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
                                                            <button onclick="openguestform('guest-${id}_${id}', 'guestid-${id}_${id}');did('modalform').classList.remove('hidden')" type="button" class="w-full h-[35px] bg-[#468df7] md:w-max text-white text-sm capitalize p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                                    <div class="btnloader" style="display: none;"></div>
                                                                    <span>Add&nbsp;New&nbsp;Guest</span> 
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                    `
     did('roomfullcontainer').appendChild(el)
     fetchdiscountcouponres()
     recalldatalist()
     assignallcheckinlisteners()
     calculatetotals()
}

// this function is to assign listener to all roomcategory class elements
function assignallcheckinlisteners(){
    for(let i=0;i<document.getElementsByClassName('roomcategory').length;i++){
        if(document.getElementsByClassName('roomcategory')[i] && document.getElementsByClassName('roomcategory')[i].children.length > 0){
            if(document.getElementsByClassName('roomcategory')[i])document.getElementsByClassName('roomcategory')[i].addEventListener('change', e=>controlroomlist(document.getElementsByClassName('roomcategory')[i].id.split('-')[1], 'roomcategory'));
        }
        // if(document.getElementsByClassName('room-type')[i] && document.getElementsByClassName('room-type')[i].children.length > 0){
        //     if(document.getElementsByClassName('room-type')[i])document.getElementsByClassName('room-type')[i].addEventListener('change', e=>controlroomlist(document.getElementsByClassName('room-type')[i].id.split('-')[1], 'room-type')) 
        // }
    }
    calculatetotals()
}

function opentheroomboard(idd){
    actionid=idd;
    did('room-type').value = did('roomcategory-'+idd).value
    did('roommodal').classList.remove('hidden')
    controlroomlist(idd, 'roomcategory')
}

function categorizeRoomsByBuilding(data) {
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
function checkplandiscount(){
    if(!did('plan-'+actionid).value || did('planamount-'+actionid).value <= 0){
        did('plandiscountperc-'+actionid).value =''
        did('plandiscountamount-'+actionid).value =''
        calculatetotals()
        return notification('No plan in place to discount from', 0)
    }
    if(!did('plandiscountperc-'+actionid).value){
        did('plandiscountamount-'+actionid).value =''
        calculatetotals()
        return notification('Discount removed', 1)
    }
    if(did('plandiscountperc-'+actionid).value > 100)did('plandiscountperc-'+actionid).value = 100
    did('plandiscountamount-'+actionid).value = ((Number(did('plandiscountperc-'+actionid).value)/100)*(Number(did('planamount-'+actionid).value)))
    calculatetotals()
}

function runcouponcalculations(){
    if(!did('discountcoupon-'+actionid).value){
        did('discountamount-'+actionid).value = 0
        calculatetotals()
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
    calculatetotals()
}

// this is the function to get plan amount and im calling this function from the runratcod function
async function getplanamount(){
    if(ratedata.plan == 0){
        did('planamount-'+actionid).value = '';
        did('plandiscountperc-'+actionid).value =''
        did('plandiscountamount-'+actionid).value =''
        checkplandiscount()
        calculatetotals()
        return notification('No plan available for the rate code')
    }
    function param(){
        let p = new FormData()
        p.append('id', ratedata.plan)
        return p
    }
    let request = await httpRequest2('../controllers/fetchbookingplan', param(), null, 'json')
    if(request.status) {
        planobj = request.data[0]
        if(did('adult-'+actionid).value > 0)did('planamount-'+actionid).value = Number(request.data[0].adultamount)
        if(did('children-'+actionid).value > 0)did('planamount-'+actionid).value = Number(request.data[0].adultamount)+Number(request.data[0].childamount)
    console.log(`${Number(request.data[0].adultamount)} ${Number(request.data[0].adultamount)+Number(request.data[0].childamount)}`)
        checkplandiscount()
    calculatetotals()
    }else notification('No records retrieved')
    calculatetotals()
}

// to populate the rate code and plan and also to give the ratedata the values needed for handlecheckinrate also note that the state parameter is set to true if its just a change in ratecode
async function runratcod(stop='', state=false){
    console.log('ratecode calculation started', state);
    // console.log('ratecode', rumcat, did('roomcategory').value);
    if(!actionid)return notification('Something went wront.', 0)
    // if(!did('roomcategory-'+actionid).value)return notification('Please Select a room category', 0)
    rr = rumcat.filter(data=>data.id ==  did('roomcategory-'+actionid).value)[0];
    if(!rr)return notification('Start with entering room category')
    console.log('rr', rr)
    // this is when the room change triggers the function
    if(!did('ratecodename-'+actionid).value){
        if(rr)did('ratecodename-'+actionid).value = rr.ratecodename;
        if(rr)did('ratecodee-'+actionid).value = rr.ratecode;
        function param(){
            let p = new FormData()
            p.append('id', rr.ratecode)
            return p
        }
        let request = await httpRequest2('../controllers/fetchratecode', param(), null, 'json')
        if(request.status) {
            console.log('ratedata', request.data, request.data[0])
            ratedata = request.data[0]
            if(ratedata.plan == 0)notification('Please note that no plan was all allocated to the choosen reservation', 0)
            did('plan-'+actionid).value = ratedata.planname
            if(stop != 'handlecheckinrate')handlecheckinrate()
            runcouponcalculations()
            getplanamount()
            calculatetotals()
        }else return notification('No records retrieved')
        
    }
    if(did('ratecodename-'+actionid).value){
        function param(){
            let p = new FormData()
            p.append('id', did('ratecodee-'+actionid).value)
            return p
        }
        let request = await httpRequest2('../controllers/fetchratecode', param(), null, 'json')
        if(request.status) {
            console.log('ratedata', request.data, request.data[0])
            ratedata = request.data[0]
            if(ratedata.plan == 0)notification('Please note that no plan was all allocated to the choosen reservation', 0)
            did('plan-'+actionid).value = ratedata.planname
            if(stop != 'handlecheckinrate')handlecheckinrate()
            runcouponcalculations()
            getplanamount()
            calculatetotals()
        }else return notification('No records retrieved')
    }
    calculatetotals()
}

// this is called when the adult and children changes
function handlecheckinrate(idd, state=false){
    if(!did('numberofnights').value)return notification('Please enter your arrival and departure date inorder to get your rates', 0);
    if(did('roomcategory-'+idd) && did('roomnumber-'+idd))if(!did('roomcategory-'+idd).value || !did('roomnumber-'+idd).value)return notification('Please Enter room details', 0);
    if(!idd & !actionid)return calculatetotals();
    if(!idd)idd = actionid;
    if(!actionid)actionid = idd;
    if(did('adult-'+idd).value < 0)did('roomrate-'+idd).value = 0;  
    if(did('adult-'+idd).value < 0)did('adult-'+idd).value = 0;  
    if(!did('adult-'+idd).value || did('adult-'+idd).value == 0)return state ? notification('Please enter number of Adult', 0) : '';
    if(!ratedata)did('adult-'+idd).value = '';
    if(!ratedata)return state ? notification('Please fill out the room details first') : '';
    if(Number(did('adult-'+idd).value) == 1)did('roomrate-'+idd).value = Number(ratedata.adult1)*Number(did('numberofnights').value);
    if(Number(did('adult-'+idd).value) == 2)did('roomrate-'+idd).value = Number(ratedata.adult2)*Number(did('numberofnights').value);
    if(Number(did('adult-'+idd).value) == 3)did('roomrate-'+idd).value = Number(ratedata.adult3)*Number(did('numberofnights').value);
    if(Number(did('adult-'+idd).value) == 4)did('roomrate-'+idd).value = Number(ratedata.adult4)*Number(did('numberofnights').value);
    if(Number(did('adult-'+idd).value) > 4){did('adult-'+idd).value = 4;did('roomrate-'+idd).value = Number(ratedata.adult4);return state ? notification('Number of Adults in a room cannot exceed four', 0) : '';}
    if(Number(did('children-'+idd).value) == 1)did('roomrate-'+idd).value = did('roomrate-'+idd).value+Number(ratedata.extchild);
    if(Number(did('children-'+idd).value) == 2)did('roomrate-'+idd).value = did('roomrate-'+idd).value+Number(ratedata.aditchild);
    if(Number(did('children-'+idd).value) > 2 && did('children-'+idd).value <= 5)did('roomrate-'+idd).value = did('roomrate-'+idd).value+Number(ratedata.aditchild)*did('children-'+idd).value;
    if(Number(did('children-'+idd).value) > 5){did('children-'+idd).value = 5;did('roomrate-'+idd).value = did('roomrate-'+idd).value+Number(ratedata.aditchild)*did('children-'+idd).value;return state ? notification('Number of Children in a room cannot exceed five', 0) : '';}
    if(Number(did('adult-'+idd).value) > 1 && did('moreguestcontainer-'+idd).children.length < Number(did('adult-'+idd).value)){
        let l =  Number(Number(did('adult-'+idd).value) - did('moreguestcontainer-'+idd).children.length);
        console.log('l', l)
        for(let i=0;i<l;i++){
            let id = genID()+i+1
            let el = document.createElement('div')
            el.classList.add('grid', 'grid-cols-1', 'lg:grid-cols-4', 'gap-2', 'mb-2')
            el.innerHTML = `<div class="form-group col-span-3">
                                <label for="logoname" class="control-label text-md">Guest</label>
                                <input type="text"  name="" id="guest-${idd}_${id}" list="allguest" onchange="checkdatalist(this, 'guestid-${idd}_${id}', 'allguest2')" class="bg-white form-control comp !p-2 bg-white" placeholder="Enter Guest Name">
                                <input type="text"  name="" id="guestid-${idd}_${id}" class="bg-white form-control !p-2 hidden" placeholder="">
                            </div>
                            <div class="w-full flex items-end justify-start">
                                <button onclick="openguestform('guest-${idd}_${id}', 'guestid-${idd}_${id}');did('modalform').classList.remove('hidden')" type="button" class="w-full h-[35px] bg-[#468df7] md:w-max text-white text-sm capitalize p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                        <div class="btnloader" style="display: none;"></div>
                                        <span>Add&nbsp;New&nbsp;Guest</span> 
                                </button>
                                <button onclick="this.parentElement.parentElement.remove()" type="button" class="w-full h-[35px] bg-red-400 md:w-max text-white text-sm capitalize p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                        <div class="btnloader" style="display: none;"></div>
                                        <span>Delete</span> 
                                </button>
                            </div>`;
             document.getElementById('moreguestcontainer-'+idd).appendChild(el)
        }
    }
    runcouponcalculations()
    runratcod('handlecheckinrate')
    calculatetotals()
}

// this is the function that is called when room category changes
async function controlroomlist(idd, type){
    if(!idd)return
    if(!document.querySelector('#arrivaldate').value)return notification('Please enter a valid arrival date', 0)
    // if(type == 'roomcategory'){
    //     document.querySelector(`#room-type-${idd}`).value = document.querySelector(`#room-type`).value
    // }
    // if(type == 'room-type'){
    //     document.querySelector(`#room-type-${idd}`).value = document.querySelector(`#room-type-${idd}`).value
    // }
    document.getElementById('ratecodename-'+idd).value = ''
    document.getElementById('ratecodee-'+idd).value = ''
    document.getElementById('roomrate-'+idd).value = ''
    document.getElementById('roomnumber-'+idd).value = ''
    document.getElementById('discountcoupon-'+idd).value = ''
    document.getElementById('discountamount-'+idd).value = ''
    document.getElementById('adult-'+idd).value = ''
    document.getElementById('children-'+idd).value = ''
    document.getElementById('plan-'+idd).value = ''
    document.getElementById('planamount-'+idd).value = ''
    if(!document.querySelector('#roomcategory-'+idd).value){
        document.getElementById('searchroombtn-'+idd).classList.add('hidden')
        document.getElementById('roomnumber-'+idd).value = ''
        document.getElementById('ratecodee-'+idd).value = ''
        document.getElementById('ratecodename-'+idd).value = ''
        
    }else{
        document.getElementById('searchroombtn-'+idd).classList.remove('hidden')
        did('roomtable').innerHTML = 'Loading...'
        function param(){
            let p = new FormData()
            p.append('categoryid', document.querySelector('#roomcategory-'+idd).value)
            p.append('arrivaldate', document.querySelector('#arrivaldate').value.replace('T',' '))
            p.append('departuredate', document.querySelector('#departuredate').value.replace('T',' '))
            return p
        }
        let request = await httpRequest('../controllers/getallroomstatus', param(), null, 'json')
        if(request.status) {
            // document.getElementById('roomlist-'+idd).innerHTML = request.data.map(data=>`<option value="${data.roomnumber}">${data.roomname}</option>`).join('')
            console.log('data b4 categorizeRoomsByBuilding', request.data)
            let data = categorizeRoomsByBuilding(request.data)
            console.log('data after categorizeRoomsByBuilding', data)
            renderRoomTable(data);

        }
        else{did('roomtable').innerHTML = request.message; return notification('No records retrieved')}
        
    }
    calculatetotals()
}

const renderRoomTable = (data) => {
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
                    <span class="inline-block px-3 py-1 rounded-lg text-white ${getStatusClass(room.roomstatus)}">
                      ${room.roomstatusdescription}
                    </span>
                  </p>
                </div>
                <button 
                  class="mt-4 w-full py-2 rounded-lg text-white ${getButtonClass(room.roomstatus)}"
                  onclick="handleRoomClick(${room.roomstatus === 'AVAILABLE' || room.roomstatus === 'CHECKED OUT'}, ${room.roomnumber}, ${actionid})"
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

const getStatusClass = (status) => {
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

const getButtonClass = (status) => {
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

const handleRoomClick = (isAvailable, roomNumber, actionId) => {
  if (isAvailable) {
    runratcod();
    document.getElementById(`roomnumber-${actionId}`).value = roomNumber;
    notification(`Room ${roomNumber} Selected`, 1);
    document.getElementById('roommodal').classList.add('hidden');
  } else {
    notification('Room is not available for selection', 0);
  }
};



function groupcompanyres(){
    if(!did('company').value)return notification('Please note that group name is required if you cannot find your company name select Add COMPANY', 0)
    if(did('company').value == 'ADD COMPANY'){
        did('companyformm').classList.remove('hidden')
    }
    // if(did('company1').value == 'ADD COMPANY'){
    //     did('companyformm').classList.remove('hidden')
    // }
}
function grouptravelagentres(){
    if(!did('travelagent').value)return notification('Please note that agency name is required if you cannot find your agency name select Add TRAVEL AGENCY', 0)
    if(did('travelagent').value == 'ADD TRAVEL AGENCY'){
        did('travelform').classList.remove('hidden')
    }
    if(did('travelagent1').value == 'ADD TRAVEL AGENCY'){
        did('travelform').classList.remove('hidden')
    }
}
function groupres(){
    if(!did('group_id').value)return notification('Please note that agency name is required if you cannot find your group name select Add GROUP', 0)
    if(did('group_id').value == 'ADD GROUP'){
        did('groupform').classList.remove('hidden')
    }
}


async function fetchtravelsres(id='', name) {
    let request = await httpRequest2('../controllers/fetchtravelagency', null, null, 'json')
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
async function fetchcompanyres(id='', name) {
    let request = await httpRequest2('../controllers/fetchcompanyforgroups', null, null, 'json')
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
async function fetchgroupsres(id='', name) {
    did('reservationtype').addEventListener('blur', e=>{
        if(did('reservationtype').value == 'GUARANTEED'){
            notification('Please note that since the reservation is guaranteed the payment method must be entered. Click on the ~More Details~ button to select the payment method')
            did('paymentmethod').classList.add('comp')
        }else{
            did('paymentmethod').classList.remove('comp')
        }
    })
    let request = await httpRequest2('../controllers/fetchguestgroup', null, null, 'json')
        if(request.status) {
                did('group_id').innerHTML = `<option value="">-- Select Group --</option><option class="bg-[green] text-white font-semibold">ADD GROUP</option>`;
                did('group_id').innerHTML += request.data.map(dat=>`<option value="${dat.id}">${dat.groupname}</option>`).join('')
                if(name){
                    did('group_id').value = request.data.filter(dat=>dat.groupname == name)[0].id
                }
    }
    else return notification('No records retrieved')
}
async function fetchdiscountcouponres() {
    let request = await httpRequest2('../controllers/fetchdiscountcoupon', null, null, 'json')
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
function openguestform(name, id){
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
                                                    <input type="tel" name="phone" id="phone" onchange="handlecheckinphone('phone')" class="bg-white form-control !p-2 comp bg-white" placeholder="Enter Phone Number">
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
    if(document.querySelector('#submitguestmodal')) document.querySelector('#submitguestmodal').addEventListener('click', e=>submitguestform());
}

// this handles form submission and the state is true if the function is called from the guest management page but if called anywhere else it will  be false
async function submitguestform(state="") {
    console.log('started')
    if(!validateForm('guestmodalform', getIdFromCls('comp')))return notification('some data are not provided...', 0)
    if(!state && !nameandidofguest)notification('Somethin went wrong, the new guest you are saving cant be automatically loaded. you will have to get it from the datalist.')
    let payload

    // payload = getFormData2(document.querySelector('#guestmodalform'), [['photofilename', showFileName('imageurl')],['userphotoname', getFile('imageurl')]])
    payload = getFormData2(document.querySelector('#guestmodalform'))
    let request = await httpRequest2('../controllers/guests', payload, document.querySelector('#guestmodalform #submitguestmodal'))
    if(request.status) {
        if(!state)notification(request.message, 1)
        if(!state)did(nameandidofguest[0]).value = `${did('guestmodalform').firstname.value} ${did('guestmodalform').lastname.value} ${did('guestmodalform').othernames.value}`
        if(!state)did(nameandidofguest[1]).value = request.id
        if(!state)did('modalform').classList.add('hidden')
        if(!state)checkinpopulatedl()
        if(!state)calculatetotals()
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
    if(!state)calculatetotals()
    return notification(request.message, 0);
}


async function checkinpopulatedl(){
    let request = await httpRequest2('../controllers/fetchguestbyfilter', null, null, 'json')
    if(request.status){
        did('allguest').innerHTML = request.data.map((dat, i)=>`<option>${dat.firstname.trim()} ${dat.lastname.trim()} ${dat.othernames.trim() == '-' ? '_' : dat.othernames.trim()} _ ${dat.phone.trim()} _ ${dat.id.trim()}</option>`).join('')    
        did('allguest2').innerHTML = request.data.map((dat, i)=>`<option value="${dat.firstname.trim()} ${dat.lastname.trim()} ${dat.othernames.trim() == '-' ? '_' : dat.othernames.trim()} _ ${dat.phone.trim()} _ ${dat.id.trim()}">${dat.id.trim()}</option>`).join('')   
        
    }else return notification(request.message, 0)
}
 
async function handlecheckinphone(what, val=''){
    if(did('id'))did('id').value = '';
    if(!did('phone').value && what == 'phone')return 
    function getparamm(){
        let paramstr = new FormData()
        if(what == 'phone')paramstr.append('searchtext', document.getElementById('phone').value)
        if(what == 'id')paramstr.append('id', val)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchguestbyfilter', getparamm(), null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No records retrieved</td></tr>`
    if(request.status) {
        if(what == 'phone')notification('Guest data found and loaded',1)
        // function populateData(data, img=[], locate=[], form='', deep=false) {
        populateData(request.data[0], [], [], 'guestmodalform')
    }
    else return notification('No records retrieved')
}

async function fetchcheckinn(id='', oyn='', form="", btn=null) {
    if(did('autodetails'))did('autodetails').remove();
    if(id)if(document.getElementsByClassName('updater')[0])document.getElementsByClassName('updater')[0].click()
    // scrollToTop('scrolldiv')
    // if(did('expectedarrivalsform'))did('guestreservations').click()
    if(id && did('expectedarrivalsform')){
                    sessionStorage.setItem('checkinfromsomewhere', id)
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
    if(did('checkinform'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchcheckindirect'}`, getparamm(), null, 'json')
    if(did('noshowform'))request = await httpRequest2(`../controllers/${id? 'fetchnoshowreservations' : 'fetchnoshowreservations'}`, getparamm(), null, 'json')
    if(did('reassignroomsform'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchcheckindirect'}`, getparamm(), null, 'json')
    if(did('guestreservationform'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchreservationsbyfilter'}`, getparamm(), did('fetchgandres'), 'json')
    if(did('expectedarrivalsform'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchreservationsbyfilter'}`, getparammexpectedarrivalsform(), null, 'json')
    if(did('reservationcheckinform'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchreservationsbyfilter'}`, getparamm(), null, 'json')
    if(did('groupcheckinform'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchreservationsbyfilter'}`, getparamm(), null, 'json')
    // if(did('cancelreservationform'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchreservationsbyfilter'}`, getparamm(), null, 'json')
    if(did('cancelreservationformfilter'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchcancelledreservations'}`, getparamm(), null, 'json')
    if(did('checkoutformfilter'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchcheckoutsbyfilter'}`, getparamm(), btn, 'json')
    if(did('extendstayform'))request = await httpRequest2(`../controllers/${id? 'fetchreservationbyid' : 'fetchreservationsbyfilter'}`, getparamm(), null, 'json')
    // let request = await httpRequest2(`../controllers/${id? 'fetchcheckindirect' : 'fetchcheckindirect'}`, id ? getparamm() : null, null, 'json')
    if(!id && document.getElementById('tabledata'))document.getElementById('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No records retrieved</td></tr>`;
    if(request.status) { 
        if(!id){
            if(request.data.length) {
                if(did('checkinform'))datasource = request.data.filter(data=>data.reservations.status == 'CHECKED IN')
                if(did('noshowform'))datasource = request.data
                if(did('reassignroomsform'))datasource = request.data.filter(data=>data.reservations.status == 'CHECKED IN')
                if(did('guestreservationform'))datasource = request.data.filter(data=>data.reservations.status == 'OPEN' || data.reservations.status == 'RESERVED').filter(data=>data.reservations.group_id == 0)
                if(did('reservationcheckinform'))datasource = request.data.filter(data=>data.reservations.status == 'OPEN' || data.reservations.status == 'RESERVED').filter(data=>data.reservations.group_id == 0)
                if(did('groupcheckinform'))datasource = request.data.filter(data=>data.reservations.status == 'OPEN' || data.reservations.status == 'RESERVED').filter(data=>data.reservations.group_id != 0)
                if(did('extendstayform'))datasource = request.data
                // if(did('cancelreservationform'))datasource = request.data.filter(data=>data.reservations.status == 'OPEN' || data.reservations.status == 'RESERVED').filter(data=>data.reservations.group_id != 0)
                if(did('cancelreservationformfilter'))datasource = request.data
                if(did('checkoutformfilter'))datasource = request.data
                if(datasource.length > 0)document.getElementById('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No records retrieved</td></tr>`
                if(datasource.length == 0)return document.getElementById('tabledata').innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No records retrieved</td></tr>`
                // Select all <th> elements
                const thElements = document.querySelectorAll('th');
                
                // Loop through the <th> elements to find the one with the text "Rooms"
                thElements.forEach((th) => {
                  if (th.textContent.trim() === 'Rooms') {
                    // Check if the next sibling is the "Deposit" <th>
                    const nextTh = th.nextElementSibling;
                    
                    if (!nextTh || nextTh.textContent.trim() !== 'Initial Deposit') {
                      // Create the "Deposit" <th> element
                      const depositTh = document.createElement('th');
                      depositTh.textContent = 'Initial Deposit';
                      
                      // Insert the "Deposit" <th> after the "Rooms" <th>
                      th.insertAdjacentElement('afterend', depositTh);
                    }
                  }
                });
                
                resolvePagination(datasource, oncheckinTableDataSignal)
            }  
        }else{
             checkinid = request.data[0].reservations.id;
             populateddata = request.data[0].reservations;
            if(did('checkinform'))populateData(request.data[0].reservations, [], [], 'checkinform')
            if(did('reassignroomsform'))populateData(request.data[0].reservations, [], [], 'reassignroomsform')
            if(did('guestreservationform'))populateData(request.data[0].reservations, [], [], 'guestreservationform')
            if(did('reservationcheckinform'))populateData(request.data[0].reservations, [], [], 'reservationcheckinform')
            if(did('groupcheckinform'))populateData(request.data[0].reservations, [], [], 'groupcheckinform')
            if(did('extendstayform'))populateData(request.data[0].reservations, [], [], 'extendstayform')
            if(did('cancelreservationform'))populateData(request.data[0].reservations, [], [], 'cancelreservationform')
            if(did('checkoutformfilter'))populateData(request.data[0].reservations, [], [], 'checkoutformfilter')
            let x = JSON.stringify(request.data[0])
            populaterestcheckindata(x)
            if(did('reassignroomsform'))disablefortransfer(reassignroom)
            // document.getElementById('foundby').value = request.data[0].foundbyname+' || '+request.data[0].foundby
        }
    }
    else return notification('No records retrieved')
} 

function populaterestcheckindata(x){
    let data = JSON.parse(x)
    console.log('data', data)
    did('roomfullcontainer').innerHTML = data.roomguestrow.map((item, id)=>`
        <div class="relative border rounded py-3 px-4 mt-6 !mb-2.5 bg-[#f5f5f5] shadow-lg" onclick="if(actionid != ${id}){actionid = ${id};runratcod()}">
         <button onclick="this.parentElement.remove()" type="button" class="absolute top-[-25px] shadow right-0 flex justify-center items-center text-white w-10 h-10 bg-red-400 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1 me-1 mb-1 cark:bg-red-600 cark:hover:bg-red-700 focus:outline-none cark:focus:ring-red-800"><span class="material-symbols-outlined">delete</span></button>
            <button onclick="checkinaddroom()" type="button" class="absolute top-[-25px] shadow right-14 flex justify-center items-center text-white w-10 h-10 bg-green-400 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 me-1 mb-1 cark:bg-green-600 cark:hover:bg-green-700 focus:outline-none cark:focus:ring-green-800"><span class="material-symbols-outlined">add</span></button>

    
            <!--Room Category room industry source-->
            <div class="grid grid-cols-1 !mb-1 lg:grid-cols-2 gap-10">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div class="form-group">
                        <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">room category</label>
                        <select name="roomcategory" id="roomcategory-${id}" onchange="controlroomlist('${id}', 'roomcategory')" class="bg-white roomcategory form-control comp !p-1 ">
                            <option value="">-- Select Room Type --</option>
                            ${rumcat.map(data=>`<option ${item.roomdata.roomcategory == data.id ? 'selected' : ''} value="${data.id}">${data.category}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group !flex relative">
                        <div class="">
                            <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">Room</label>
                            <!--<input type="text" readonly  id="roomnumber" list="hems_available_roomnumber_id" onchange="checkdatalist(this);getcategoryrateguest(this)" class="bg-white form-control !p-2 comp2" placeholder="Enter root category">-->
                            <input type="text" value="${item.roomdata.roomnumber}" readonly name="roomnumber"  id="roomnumber-${id}" class="bg-white form-control roomnumber !p-2 comp" placeholder="">
                            <!--<input type="text" name="roomnumber" id="roomnumber1" list="hems_available_roomnumber_id" onchange="checkdatalist(this);getcategoryrateguest(this)" class="bg-white form-control !p-2 comp2" placeholder="Enter root category">-->
                        </div>
                        <button id="searchroombtn-${id}" onclick="opentheroomboard('${id}')" type="button" class=" scale-[0.7] absolute top-0 right-0 text-white w-10 h-10 bg-blue-400 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 me-1 mb-1 cark:bg-blue-600 cark:hover:bg-blue-700 focus:outline-none cark:focus:ring-blue-800"><span class="material-symbols-outlined">search</span></button>
                    </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-5 gap-10">
                        <div class="form-group">
                            <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">adults</label> 
                            <input type="number" onchange="handlecheckinrate('${id}','true')" maxlength="2" value="${item.roomdata.adult}" name="adult" id="adult-${id}" class="bg-white adult form-control !p-2 comp" placeholder=""  oninput="enforceMaxLength(this)">
                        </div>
                        <div class="form-group">
                            <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">children</label>
                            <input type="number" onchange="handlecheckinrate('${id}','true')" maxlength="2" name="child" value="${item.roomdata.child}" id="children-${id}" class="bg-white child form-control !p-2 comp2" placeholder=""  oninput="enforceMaxLength(this)">
                        </div>
                        <div class="form-group">
                            <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">Infants</label>
                            <input type="number" maxlength="2" name="infant" id="infant-${id}" value="${item.roomdata.infant}" class="bg-white infant form-control !p-2 comp2" placeholder=""  oninput="enforceMaxLength(this)">
                        </div>
                        <div class="form-group col-span-2">
                            <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">rate&nbsp;code</label>
                            <input type="text" name="ratecodename" list="hems_rate_code" onchange="checkdatalist(this, 'ratecodee-${id}', 'hems_rate_code_id')?runratcod('',true):runratcod('',true)" id="ratecodename-${id}" value="${item.roomdata.ratecodename}" class="bg-transparent ratecodename !p-1 comp2 border " placeholder="">
                            <input type="text" readonly name="ratecode" id="ratecodee-${id}" value="${item.roomdata.ratecode}" class="bg-transparent ratecode !p-1 comp2 border hidden" placeholder="">
                        </div>
                    </div>
        </div>
            
            <div class="grid grid-cols-1 !mb-1 lg:grid-cols-2 gap-10">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div class="form-group">
                            <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">plan</label> 
                            <input type="text" name="plan" value="${item.roomdata.plan}" readonly id="plan-${id}" class="bg-transparent plan !p-1 comp2 border" placeholder="">
                        </div>
                        <div class="form-group">
                            <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">plan amount</label>
                            <input type="text" name="planamount" value="${item.roomdata.planamount}" readonly id="planamount-${id}" class="bg-transparent planamount !p-1 comp2 border" placeholder="">
                        </div>
                        <div class="form-group">
                            <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">rate</label>
                            <input type="number" name="roomrate" value="${item.roomdata.roomrate}" id="roomrate-${id}" class="bg-transparent roomrate !p-1 comp2 border" >
                            <!--<select name="roomrate" onchange="getcategoryrateguest(document.getElementById('roomcategory'))" id="roomrate" class="bg-white  form-control !p-2 comp2" >-->
                            <!--</select>-->
                        </div>
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-4 gap-10">
                        <div class="form-group">
                            <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">discount&nbsp;coupon</label> 
                            <select onchange="runcouponcalculations()" name="discountcoupon" id="discountcoupon-${id}" class="bg-white discountcoupon form-control !p-1 comp2">
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
                                <input type="text" onchange="checkplandiscount()"  value="${item.roomdata.plandiscountperc}" name="plandiscountperc" id="plandiscountperc-${id}" class="bg-white plandiscountperc form-control !p-2 comp2" placeholder="">
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
                        <button onclick="openguestform('guest-${id}_${id}', 'guestid-${id}_${id}');did('modalform').classList.remove('hidden')" type="button" class="w-full h-[35px] bg-[#468df7] md:w-max text-white text-sm capitalize p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                <div class="btnloader" style="display: none;"></div>
                                <span>Add&nbsp;New&nbsp;Guest</span> 
                        </button>
                    </div>
                </div>` : ''}
                ${item.guest2.length>0? `<div class="grid grid-cols-1 lg:grid-cols-4 gap-2 mb-2">
                    <div class="form-group col-span-3">
                        <label for="logoname" class="control-label text-md">Guest</label>
                        <input type="text" value="${item.guest2[0].firstname} ${item.guest2[0].lastname} ${item.guest2[0].phone}_${item.guest2[0].id}" name="" id="guest-${id}_${id}2" list="allguest" onchange="checkdatalist(this, 'guestid-${id}_${id}2', 'allguest2')" class="bg-white comp form-control !p-2 comp bg-white" placeholder="Enter Guest Name">
                        <input type="text" value="${item.guest2[0].id}" name="" id="guestid-${id}_${id}2" class="bg-white guestid form-control !p-2 hidden" placeholder="">
                    </div>
                    <div class="w-full flex items-end justify-start">
                        <button onclick="openguestform('guest-${id}_${id}2', 'guestid-${id}_${id}2');did('modalform').classList.remove('hidden')" type="button" class="w-full h-[35px] bg-[#468df7] md:w-max text-white text-sm capitalize p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                <div class="btnloader" style="display: none;"></div>
                                <span>Add&nbsp;New&nbsp;Guest</span> 
                        </button>
                        <button onclick="this.parentElement.parentElement.remove()" type="button" class="w-full h-[35px] bg-red-400 md:w-max text-white text-sm capitalize p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                <div class="btnloader" style="display: none;"></div>
                                <span>Delete</span> 
                        </button>
                    </div>
                </div>`: ''}
                ${item.guest3.length>0? `<div class="grid grid-cols-1 lg:grid-cols-4 gap-2 mb-2">
                    <div class="form-group col-span-3">
                        <label for="logoname" class="control-label text-md">Guest</label>
                        <input type="text" value="${item.guest3[0].firstname} ${item.guest3[0].lastname} ${item.guest3[0].phone}_${item.guest3[0].id}" name="" id="guest-${id}_${id}3" list="allguest" onchange="checkdatalist(this, 'guestid-${id}_${id}3', 'allguest2')" class="bg-white comp form-control !p-2 comp bg-white" placeholder="Enter Guest Name">
                        <input type="text" value="${item.guest3[0].id}" name="" id="guestid-${id}_${id}3" class="bg-white guestid form-control !p-2 hidden" placeholder="">
                    </div>
                    <div class="w-full flex items-end justify-start">
                        <button onclick="openguestform('guest-${id}_${id}3', 'guestid-${id}_${id}3');did('modalform').classList.remove('hidden')" type="button" class="w-full h-[35px] bg-[#468df7] md:w-max text-white text-sm capitalize p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                <div class="btnloader" style="display: none;"></div>
                                <span>Add&nbsp;New&nbsp;Guest</span> 
                        </button>
                        <button onclick="this.parentElement.parentElement.remove()" type="button" class="w-full h-[35px] bg-red-400 md:w-max text-white text-sm capitalize p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                <div class="btnloader" style="display: none;"></div>
                                <span>Delete</span> 
                        </button>
                    </div>
                </div>`: ''}
                ${item.guest4.length>0? `<div class="grid grid-cols-1 lg:grid-cols-4 gap-2 mb-2">
                    <div class="form-group col-span-3">
                        <label for="logoname" class="control-label text-md">Guest</label>
                        <input type="text" value="${item.guest4[0].firstname} ${item.guest4[0].lastname} ${item.guest4[0].phone}_${item.guest4[0].id}" name="" id="guest-${id}_${id}4" list="allguest" onchange="checkdatalist(this, 'guestid-${id}_${id}4', 'allguest2')" class="bg-white comp form-control !p-2 comp bg-white" placeholder="Enter Guest Name">
                        <input type="text" value="${item.guest4[0].id}" name="" id="guestid-${id}_${id}4" class="bg-white guestid form-control !p-2 hidden" placeholder="">
                    </div>
                    <div class="w-full flex items-end justify-start">
                        <button onclick="openguestform('guest-${id}_${id}4', 'guestid-${id}_${id}4');did('modalform').classList.remove('hidden')" type="button" class="w-full h-[35px] bg-[#468df7] md:w-max text-white text-sm capitalize p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                <div class="btnloader" style="display: none;"></div>
                                <span>Add&nbsp;New&nbsp;Guest</span> 
                        </button>
                        <button onclick="this.parentElement.parentElement.remove()" type="button" class="w-full h-[35px] bg-red-400 md:w-max text-white text-sm capitalize p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                <div class="btnloader" style="display: none;"></div>
                                <span>Delete</span> 
                        </button>
                    </div>
                </div>`: ''}
                
            </div>
        </div>
    `).join('')
    calculatetotals()
}

function reverseareservation(id, state='reserved') {
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
      reverseapproved(id, state);
    }
  });
}


async function reverseapproved(id, state) {
    let param = new FormData()
    param.append('id', id)
    let request = await httpRequest2(`../controllers/${state == 'reserve' ? 'reversereservation' : 'reversecheckin'}`, param, null, 'json')
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
        fetchcheckinn()
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


async function roomtransfer(rm, ref, id) {
    let param = new FormData()
    param.append('roomnumber', rm)
    param.append('reference', ref)
    let request = await httpRequest2(`../controllers/fetchcurrentroombalance`, param, null, 'json')
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

async function performAsyncTask() {
  // Simulate an asynchronous task, like a network request
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

function removeguestsreservations(ref){
    sessionStorage.setItem('cancelreservation', ref)
    document.getElementById('cancelreservation').click()
}



async function oncheckinTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => {
    let x =0;
    let r =0
    // let goto
    // if(did('guestreservationform'))goto = 'checkin'
    // if(did('reservationcheckinform'))goto = ''
    // if(did('groupcheckinform'))goto = ''
    if(item.roomgeustrow && item.roomgeustrow.length>0){
        for(let i=0;i<item.roomgeustrow.length;i++){
            if(item.roomgeustrow[i].guest1.length > 0)x++
            if(item.roomgeustrow[i].guest2.length > 0)x++
            if(item.roomgeustrow[i].guest3.length > 0)x++ 
            if(item.roomgeustrow[i].guest4.length > 0)x++ 
            if(item.roomgeustrow[i].roomdata.roomrate)r = Number(item.roomgeustrow[i].roomdata.roomrate)+r
        }
    }
    if (document.getElementById('tabledata')) {
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
                        <p class="text-3xl font-bold text-black opacity-[0.7]">${formatNumber(datasource.reduce((sum, item)=>sum+Number(item.reservations.amountpaid),0))}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-4 w-full sm:w-1/3 sm:my-8">
            <div class="bg-white p-5">
                <div class="sm:flex sm:items-start">
                    <div class="text-center sm:mt-0 sm:ml-2 sm:text-left">
                        <h3 class="text-sm leading-6 font-medium text-gray-400">Total Rates</h3>
                        <p class="text-3xl font-bold text-black opacity-[0.7]">${formatNumber(datasource.reduce((sum, item)=>sum+r,0))}</p>
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
    return ` 
    <tr> 
        <td>${index + 1 }</td> 
        <td>
            <div class="w-full h-full flex items-center justify-center gap-4">
                <button title="View and Print" onclick="opencheckinreceipt('${item.reservations.id}', '${r}', '${x}')" class="material-symbols-outlined rounded-full bg-gray-100 h-8 w-8 text-green-400 drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
                <button title="check in" onclick="
                                    if(did('guestreservationform'))did('reservationcheckin').click();  
                                    if(did('expectedarrivalsform'))did('reservationcheckin').click();  
                                    if(did('reservationcheckinform'))checksessionstorage();
                                    sessionStorage.setItem('checkinfromsomewhere', '${item.reservations.id}');
                                    " class="material-symbols-outlined ${item.reservations.status != 'CHECKED IN' && item.reservations.status != 'CHECKED OUT' ? !did('cancelreservationformfilter') ? '' : 'hidden' : 'hidden'} ${did('noshowform') ? 'hidden' : ''} rounded-full bg-green-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">check_circle</button>
                <button title="Reverse Reservation" onclick="reverseareservation('${item.reservations.id}', 'reserved')" class="material-symbols-outlined ${item.reservations.status == 'RESERVED' ? '' : item.reservations.status == 'OPEN' ? '' : 'hidden'} ${did('noshowform') ? 'hidden' : ''} rounded-full bg-red-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete_history</button>
                <button title="Reverse Check In" onclick="reverseareservation('${item.reservations.id}', 'checked in')" class="material-symbols-outlined ${item.reservations.status == 'CHECKED IN' ? '' : 'hidden'} ${did('noshowform') ? 'hidden' : ''} rounded-full bg-red-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete_history</button>
                <button title="Reverse Check Out" onclick="reverseareservation('${item.reservations.id}', 'checked out')" class="material-symbols-outlined ${item.reservations.status == 'CHECKED OUT' ? '' : 'hidden'} ${did('noshowform') ? 'hidden' : ''} rounded-full bg-red-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete_history</button>
                <button title="Edit row entry" onclick="fetchcheckinn('${item.reservations.id}')" class="${item.reservations.status == 'CHECKED IN' ? 'hidden' : ''} ${did('cancelreservationformfilter') ? '' : 'hidden'} ${!did('noshowform') ? 'hidden' : ''} material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
                <button title="Cancel Reservation" onclick="removeguestsreservations('${item.reservations.reference}')" class="${item.reservations.status != 'CHECKED IN' ? '' : 'hidden'} material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
            </div>
        </td> 
        <td>${item.roomgeustrow.length}&nbsp;Room(s)</td>
        <td>${formatNumber(item.reservations.amountpaid)}</td>
        <td>${x}&nbsp;Person(s)
            <table  class="mx-auto">
                    <tbody>
                        ${item.roomgeustrow ?
                            item.roomgeustrow.map((datt, i)=>`
                                ${datt.guest1.length>0 ? `<tr>
                                    <td class="text-center opacity-70"><button title="Room Transfer" onclick="roomtransfer('${datt.roomdata?.roomnumber}', '${item.reservations.reference}', '${item.reservations.id}')" class="material-symbols-outlined ${item.reservations.status == 'CHECKED IN' ? !did('cancelreservationformfilter') ? '' : 'hidden' : 'hidden'} rounded-full bg-yellow-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">move_up</button> ${datt.roomdata?.roomnumber}</td>
                                    <td class="text-center opacity-70">${datt.guest1[0].firstname}&nbsp;${datt.guest1[0].lastname}&nbsp;${datt.guest1[0].othernames}</td>
                                    <td class="text-center opacity-70">${datt.guest1[0].phone}</td>
                                </tr>` : ''}
                                ${datt.guest2.length>0 ? `<tr>
                                    <td class="text-center opacity-70"><button title="Room Transfer" onclick="roomtransfer('${datt.roomdata?.roomnumber}', '${item.reservations.reference}', '${item.reservations.id}')" class="material-symbols-outlined ${item.reservations.status == 'CHECKED IN' ? !did('cancelreservationformfilter') ? '' : 'hidden' : 'hidden'} rounded-full bg-yellow-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">move_up</button> ${datt.roomdata?.roomnumber}</td>
                                    <td class="text-center opacity-70">${datt.guest2[0].firstname}&nbsp;${datt.guest2[0].lastname}&nbsp;${datt.guest2[0].othernames}</td>
                                    <td class="text-center opacity-70">${datt.guest2[0].phone}</td>
                                </tr>` : ''}
                                ${datt.guest3.length>0 ? `<tr>
                                    <td class="text-center opacity-70"><button title="Room Transfer" onclick="roomtransfer('${datt.roomdata?.roomnumber}', '${item.reservations.reference}', '${item.reservations.id}')" class="material-symbols-outlined ${item.reservations.status == 'CHECKED IN' ? !did('cancelreservationformfilter') ? '' : 'hidden' : 'hidden'} rounded-full bg-yellow-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">move_up</button> ${datt.roomdata?.roomnumber}</td>
                                    <td class="text-center opacity-70">${datt.guest3[0].firstname}&nbsp;${datt.guest1[0].lastname}&nbsp;${datt.guest3[0].othernames}</td>
                                    <td class="text-center opacity-70">${datt.guest3[0].phone}</td>
                                </tr>` : ''}
                                ${datt.guest4.length>0 ? `<tr>
                                    <td class="text-center opacity-70"><button title="Room Transfer" onclick="roomtransfer('${datt.roomdata?.roomnumber}', '${item.reservations.reference}', '${item.reservations.id}')" class="material-symbols-outlined ${item.reservations.status == 'CHECKED IN' ? !did('cancelreservationformfilter') ? '' : 'hidden' : 'hidden'} rounded-full bg-yellow-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">move_up</button> ${datt.roomdata?.roomnumber}</td>
                                    <td class="text-center opacity-70">${datt.guest4[0].firstname}&nbsp;${datt.guest1[0].lastname}&nbsp;${datt.guest4[0].othernames}</td>
                                    <td class="text-center opacity-70">${datt.guest4[0].phone}</td>
                                </tr>` : ''}
                            `).join('') 
                            :
                            item.roomguestrow.map((datt, i)=>`
                                ${datt.guest1.length>0 ? `<tr>
                                    <td class="text-center opacity-70"><button title="Room Transfer" onclick="roomtransfer('${datt.roomdata?.roomnumber}', '${item.reservations.reference}', '${item.reservations.id}')" class="material-symbols-outlined ${item.reservations.status == 'CHECKED IN' ? !did('cancelreservationformfilter') ? '' : 'hidden' : 'hidden'} rounded-full bg-yellow-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">move_up</button> ${datt.roomdata?.roomnumber}</td>
                                    <td class="text-center opacity-70">${datt.guest1[0].firstname}&nbsp;${datt.guest1[0].lastname}&nbsp;${datt.guest1[0].othernames}</td>
                                    <td class="text-center opacity-70">${datt.guest1[0].phone}</td>
                                </tr>` : ''}
                                ${datt.guest2.length>0 ? `<tr>
                                    <td class="text-center opacity-70"><button title="Room Transfer" onclick="roomtransfer('${datt.roomdata?.roomnumber}', '${item.reservations.reference}', '${item.reservations.id}')" class="material-symbols-outlined ${item.reservations.status == 'CHECKED IN' ? !did('cancelreservationformfilter') ? '' : 'hidden' : 'hidden'} rounded-full bg-yellow-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">move_up</button> ${datt.roomdata?.roomnumber}</td>
                                    <td class="text-center opacity-70">${datt.guest2[0].firstname}&nbsp;${datt.guest2[0].lastname}&nbsp;${datt.guest2[0].othernames}</td>
                                    <td class="text-center opacity-70">${datt.guest2[0].phone}</td>
                                </tr>` : ''}
                                ${datt.guest3.length>0 ? `<tr>
                                    <td class="text-center opacity-70"><button title="Room Transfer" onclick="roomtransfer('${datt.roomdata?.roomnumber}', '${item.reservations.reference}', '${item.reservations.id}')" class="material-symbols-outlined ${item.reservations.status == 'CHECKED IN' ? !did('cancelreservationformfilter') ? '' : 'hidden' : 'hidden'} rounded-full bg-yellow-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">move_up</button> ${datt.roomdata?.roomnumber}</td>
                                    <td class="text-center opacity-70">${datt.guest3[0].firstname}&nbsp;${datt.guest1[0].lastname}&nbsp;${datt.guest3[0].othernames}</td>
                                    <td class="text-center opacity-70">${datt.guest3[0].phone}</td>
                                </tr>` : ''}
                                ${datt.guest4.length>0 ? `<tr>
                                    <td class="text-center opacity-70"><button title="Room Transfer" onclick="roomtransfer('${datt.roomdata?.roomnumber}', '${item.reservations.reference}', '${item.reservations.id}')" class="material-symbols-outlined ${item.reservations.status == 'CHECKED IN' ? !did('cancelreservationformfilter') ? '' : 'hidden' : 'hidden'} rounded-full bg-yellow-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">move_up</button> ${datt.roomdata?.roomnumber}</td>
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
        <td>${item.reservations.reservationtype}</td>  
        <td>${formatDate(item.reservations.arrivaldate)}</td>
        <td>${formatDate(item.reservations.departuredate)}</td>
        <td>${item.reservations.billinginfo}</td>
        <td>${item.reservations.paymentmethod}</td>
        <td>${formatDate(item.reservations.reservationdate)}</td>
        <td>${item.reservations.reference}</td>
        <td class="${did('guestreservationform') ? '' : 'hidden'}">${item.reservations.timeline ? item.reservations.timeline : '--'}</td>
        <td>${item.reservations.status == 'OPEN' ? 'RESERVED' : item.reservations.status}</td>
    </tr> `}
    )
    .join('')
    injectPaginatatedTable(rows)
}

function opencheckinreceipt(id, ratee, rooms){
    let receiptdata = datasource.filter(data=>data.reservations.id == id)[0]
    if(!receiptdata)return callModal('Something went wrong...')
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
                        				<!--	<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Due date</label>-->
                        				<!--	<span class="mr-4 inline-block hidden md:block">:</span>-->
                        				<!--	<div class="flex-1">-->
                        				<!--	<input class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker-2" id="datepicker2" type="text" placeholder="eg. 17 Mar, 2020" x-model="invoiceDueDate" x-on:change="invoiceDueDate = document.getElementById('datepicker2').value" autocomplete="off" readonly="">-->
                        				<!--	</div>-->
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
                        				<input readonly value="${ratee}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                        				<label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Total Rooms:</label>
                        				<input readonly value="${rooms}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
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
                                                <th class="text-center opacity-70">discount</th>
                                                <th class="text-center opacity-70">plan discount</th>
                                            </tr>
                                        </thead>
                                        <tbody id="roomtabledata">
                                            ${
                                                receiptdata.roomgeustrow.map((item, index)=>{
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
                                                                            ${item.guest2.length>0 ? `<tr>
                                                                                <td class="text-center opacity-70">2</td>
                                                                                <td id="rcheckindate" class="text-center opacity-70">${item.guest2[0].firstname}&nbsp;${item.guest2[0].lastname}&nbsp;${item.guest2[0].othernames}</td>
                                                                                <td id="rcheckindate" class="text-center opacity-70">${item.guest2[0].phone}</td>
                                                                            </tr>` : ''}
                                                                            ${item.guest3.length>0 ? `<tr>
                                                                                <td class="text-center opacity-70">3</td>
                                                                                <td id="rcheckindate" class="text-center opacity-70">${item.guest3[0].firstname}&nbsp;${item.guest3[0].lastname}&nbsp;${item.guest3[0].othernames}</td>
                                                                                <td id="rcheckindate" class="text-center opacity-70">${item.guest3[0].phone}</td>
                                                                            </tr>` : ''}
                                                                            ${item.guest4.length>0 ? `<tr>
                                                                                <td class="text-center opacity-70">4</td>
                                                                                <td id="rcheckindate" class="text-center opacity-70">${item.guest4[0].firstname}&nbsp;${item.guest4[0].lastname}&nbsp;${item.guest4[0].othernames}</td>
                                                                                <td id="rcheckindate" class="text-center opacity-70">${item.guest4[0].phone}</td>
                                                                            </tr>` : ''}
                                                                        </tbody>
                                                                    </table>
                                                            </td>
                                                            <td>${formatNumber(item.roomdata.roomrate)}</td> 
                                                            <td>${formatNumber(item.roomdata.discountamount)}</td> 
                                                            <td>${formatNumber(item.roomdata.plandiscountamount)}</td>
                                                        </tr> `
                                                }).join('')
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                
                               
                        
  <!--                      		<div class="flex -mx-1 border-b py-2 items-start">-->
  <!--                      			<div class="w-10 px-1">-->
  <!--                      				<p class="text-gray-800 uppercase tracking-wide text-sm font-bold">S/N</p>-->
  <!--                      			</div>-->
  <!--                      			<div class="w-150 px-1">-->
  <!--                      				<p class="text-gray-800 uppercase tracking-wide text-sm font-bold">Check-in Date</p>-->
  <!--                      			</div>-->
                        
  <!--                      			<div class="px-1 w-40 text-right">-->
  <!--                      				<p class="text-gray-800 uppercase tracking-wide text-sm font-bold">room no.</p>-->
  <!--                      			</div>-->
  <!--                      			<div class="px-1 w-40 text-right">-->
  <!--                      				<p class="text-gray-800 uppercase tracking-wide text-sm font-bold">no. of night</p>-->
  <!--                      			</div>-->
                        
  <!--                      			<div class="px-1 flex-1 text-right">-->
  <!--                      				<p class="leading-none">-->
  <!--                      					<span class="block uppercase tracking-wide text-sm font-bold text-gray-800">debit</span>-->
                        					<!--<span class="font-medium text-xs text-gray-500">(Incl. GST)</span>-->
  <!--                      				</p>-->
  <!--                      			</div>-->
                        
  <!--                      			<div class="px-1 flex-1 text-right">-->
  <!--                      				<p class="leading-none">-->
  <!--                      					<span class="block uppercase tracking-wide text-sm font-bold text-gray-800">Credit</span>-->
                        					<!--<span class="font-medium text-xs text-gray-500">(Incl. GST)</span>-->
  <!--                      				</p>-->
  <!--                      			</div>-->
  <!--                      			<div class="px-1 flex-1 text-right">-->
  <!--                      				<p class="leading-none">-->
  <!--                      					<span class="block uppercase tracking-wide text-sm font-bold text-gray-800">balance</span>-->
                        					<!--<span class="font-medium text-xs text-gray-500">(Incl. GST)</span>-->
  <!--                      				</p>-->
  <!--                      			</div>-->
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
                        
                        		<div class="py-2 ml-auto mt-5 w-full sm:w-2/4 lg:w-1/4">
                        			<div class="flex justify-between mb-3">
                        				<div class="text-gray-800 text-right flex-1">Total&nbsp;Balance</div>
                        				<div class="text-right w-40">
                        					<div id="rtotalbalance" class="text-gray-800 font-medium"></div>
                        				</div>
                        			</div>
                        			<div class="flex justify-between mb-4">
                        				<div class="text-sm text-gray-600 text-right flex-1">VAT</div>
                        				<div class="text-right w-40">
                        					<div id="" class="text-sm text-gray-600" >0.00</div>
                        				</div>
                        			</div>
                        		
                        			<div class="py-2 border-t border-b">
                        				<div class="flex justify-between">
                        					<div class="text-xl text-gray-600 text-right flex-1">Total&nbsp;Amount</div>
                        					<div class="text-right w-40">
                        						<div id="rtotalpaid" class="text-xl text-gray-800 font-bold">${formatNumber(ratee)}</div>
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

function checkDuplicateRoomNumbers() {
    const roomNumberElements = document.getElementsByClassName('roomnumber');
    const roomNumbers = new Set();

    for (let i = 0; i < roomNumberElements.length; i++) {
        const roomNumber = roomNumberElements[i].value; // Assuming the room number is in the value attribute
        if (roomNumbers.has(roomNumber)) {
            notification('Duplicate room number found: ' + roomNumber);
            return true; // Duplicate found
        }
        roomNumbers.add(roomNumber);
    }

    return false; // No duplicates found
}

async function checkinnFormSubmitHandler(guest){
    if(guest == 'reassignroomsform')checkinid = '';
    if(!guest)return notification('Wrong call point', 0)
    if(did('checkinform')){
        if(!validateForm('checkinform', getIdFromCls('comp')))return notification('some data are not provided...', 0)
    }
    if(did('reassignroomsform')){
        if(!validateForm('reassignroomsform', getIdFromCls('comp')))return notification('some data are not provided...', 0)
    }
    if(did('guestreservationform')){
        if(!validateForm('guestreservationform', getIdFromCls('comp')))return notification('some data are not provided...', 0)
    }
    if(did('reservationcheckinform')){
        if(!validateForm('reservationcheckinform', getIdFromCls('comp')))return notification('some data are not provided...', 0)
    }
    if(did('groupcheckinform')){
        if(!validateForm('groupcheckinform', getIdFromCls('comp')))return notification('some data are not provided...', 0)
    }
    if(did('cancelreservationform')){
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        }).then((result) => {
          if (!result.isConfirmed) {
            return
          }
        });
        if(!validateForm('cancelreservationform', getIdFromCls('comp22')))return notification('some data are not provided...', 0)
    }
    if(did('extendstayform')){
        if(!validateForm('extendstayform', getIdFromCls('comp33')))return notification('some data are not provided...', 0)
    }
    calculatetotals()
    // if(checkinid)return alert()
    // if(Number(did('amountpaid').value) < Number(did('mindeposit').value)) return notification('Minimum deposit is required to be paid', 0)
    // if(Number(did('amountpaid').value) < 1) return notification('Minimum deposit is required to be paid', 0)
    // return alert(checkinid)
    
    // Check if any two rooms have the same room number
    if(checkDuplicateRoomNumbers())return;
    
    let rn = document.getElementsByClassName('roomnumber')
    let err = false
    for (let i = 0; i < rn.length; i++) {
        const adultCount = document.getElementsByClassName('adult')[i].value;
        const guestCount = document.getElementsByClassName('moreguestcontainer')[i].children.length;

        if (adultCount !== guestCount.toString()) {
            notification(`The number of adults in room ${document.getElementsByClassName('roomnumber')[i].value} does not match with the number of guest provided.`, 0);
            err = true
            break;
        }
    }
    
    if(err)return
    

    
    // give appropriate name to all dynamic element
    givenamebyclass('roomcategory')
    givenamebyclass('roomnumber')
    givenamebyclass('adult')
    givenamebyclass('child')
    givenamebyclass('infant')
    givenamebyclass('ratecode')
    givenamebyclass('ratecodename')
    givenamebyclass('plan')
    givenamebyclass('planamount')
    givenamebyclass('roomrate')
    givenamebyclass('discountcoupon')
    givenamebyclass('discountamount')
    givenamebyclass('plandiscountperc')
    givenamebyclass('plandiscountamount')
    givenamebyclass('guestid')
    
    
    function payload(){
        let param =  new FormData(document.querySelector(`#${guest}`))
        if(checkinid)param.append('id', checkinid)
        param.append('photofilename', showFileName('imageurl'))
        param.append('userphotoname', getFile('imageurl'))
        param.set('arrivaldate', document.getElementById('arrivaldate').value.replace('T', ' '))
        param.set('departuredate', document.getElementById('departuredate').value.replace('T', ' '))
        param.set('rowsize', document.getElementsByClassName('roomnumber').length)
        
        for(let i=0;i<rn.length;i++){
           if(document.getElementsByClassName('moreguestcontainer')[i].children.length > 1){
               for(let j=1;j<document.getElementsByClassName('moreguestcontainer')[i].children.length;j++){
                   param.append(`guestid${i+1}_${j}`, document.getElementsByClassName('moreguestcontainer')[i].children[j].children[0].children[2].value)
               }
           }
        }
        
        return param
    }
    function payloadcancel(){
        let param =  new FormData()
        param.set('refund', document.getElementById('refund').value)
        param.set('paymentmethod', document.getElementById('paymentmethod').value)
        param.set('reasonforcancellation', document.getElementById('reasonforcancellation').value)
        param.set('reference', document.getElementById('referencer').value)
        if(did('bankname'))param.set('bankname', did('bankname').value)
        if(did('otherdetails'))param.set('otherdetails', did('otherdetails').value)
        
        return param
    }
    function payloadstay(){
        let param =  new FormData()
        param.set('reference', document.getElementById('referencer').value)
        param.set('numberofnights', document.getElementById('numberofnights').value)
        param.set('departuredate', document.getElementById('departuredate').value.replace('T', ' ')+':00')
        
        return param
    }

    let request 
    if(guest == 'checkinform')request = await httpRequest2(`../controllers/checkindirectmodified`, payload(), document.querySelector(`#${guest} #submit`))
    if(guest == 'reassignroomsform')request = await httpRequest2(`../controllers/transferroom`, payload(), document.querySelector(`#${guest} #submit`))
    if(guest == 'guestreservationform')request = await httpRequest2(`../controllers/reservations`, payload(), document.querySelector(`#${guest} #submit`))
    if(guest == 'reservationcheckinform')request = await httpRequest2(`../controllers/reservationcheckin`, payload(), document.querySelector(`#${guest} #submit`))
    if(guest == 'cancelreservationform')request = await httpRequest2(`../controllers/cancelreservation`, payloadcancel(), document.querySelector(`#${guest} #submit`))
    if(guest == 'extendstayform')request = await httpRequest2(`../controllers/extendstay`, payloadstay(), document.querySelector(`#${guest} #submit`))
    if(request.status) {
        
        if(guest != 'cancelreservationform' && guest != 'extendstayform'){
            // if amount its from a reservation and direct then an invoice must be called
            if(did('amountpaid').value && guest){
                async function payloadinvoice() {
                      // Show SweetAlert modal to ask if the user wants to distribute payment
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
                      });
                    
                      // Set the distribute variable based on user choice
                      let distribute;
                      if (result.isConfirmed) {
                        distribute = 'YES';
                      } else if (result.isDismissed) {
                        distribute = 'NO'; // Default to "YES" if the modal is closed without a choice
                      } else {
                        distribute = 'YES';
                      }
                    
                      // Prepare FormData with the chosen distribute value
                      
                        let p = new FormData();
                      p.append('reference', request.reference);
                      p.append('paymentmethod', did('paymentmethod').value);
                      p.append('totaldue', did('totalamount').value);
                      p.append('amountpaid', did('amountpaid').value);
                      p.append('distribute', distribute);
                      p.append('bankname', did('bankname').value);
                      p.append('otherdetails', did('otherdetails').value);
                    
                      return p;
                    }
                if(populateddata && checkinid && populateddata.amountpaid && populateddata.ampuntpaid != document.getElementById('amountpaid').value){
                    let requestinvoice = await httpRequest2('../controllers/receiptforcashier', await payloadinvoice(), document.querySelector(`#${guest} #submit`))
                    if(requestinvoice.status) {
                        notification(requestinvoice.message, 1);
                        Swal.fire({
                        title: 'Successful booking and payment',
                        text: 'Thank you',
                        icon: 'success',
                        confirmButtonText: 'Okay',
                        customClass: {
                          confirmButton: 'btn btn-md !bg-blue-500 !text-white mx-2',
                        },
                        buttonsStyling: false
                      });
                    }else{
                       notification(request.message, 0);
                        Swal.fire({
                        title: 'Failed payment',
                        text: 'Please reach out for support',
                        icon: 'error',
                        confirmButtonText: 'Okay',
                        customClass: {
                          confirmButton: 'btn btn-md !bg-blue-500 !text-white mx-2',
                        },
                        buttonsStyling: false
                      });
                    }
                }else if(populateddata && checkinid && !populateddata.amountpaid){
                    let requestinvoice = await httpRequest2('../controllers/invoicing', await payloadinvoice(), document.querySelector(`#${guest} #submit`))
                    if(requestinvoice.status) {
                        notification(requestinvoice.message, 1);
                        Swal.fire({
                        title: 'Successful booking and payment',
                        text: 'Thank you',
                        icon: 'success',
                        confirmButtonText: 'Okay',
                        customClass: {
                          confirmButton: 'btn btn-md !bg-blue-500 !text-white mx-2',
                        },
                        buttonsStyling: false
                      });
                    }else{
                       notification(request.message, 0);
                        Swal.fire({
                        title: 'Failed payment',
                        text: 'Please reach out for support',
                        icon: 'error',
                        confirmButtonText: 'Okay',
                        customClass: {
                          confirmButton: 'btn btn-md !bg-blue-500 !text-white mx-2',
                        },
                        buttonsStyling: false
                      });
                    }
                }else{
                    let requestinvoice = await httpRequest2('../controllers/invoicing', await payloadinvoice(), document.querySelector(`#${guest} #submit`))
                    if(requestinvoice.status) {
                        notification(requestinvoice.message, 1);
                    Swal.fire({
                        title: 'Successful booking and payment',
                        text: 'Thanks you',
                        icon: 'success',
                        confirmButtonText: 'Okay',
                        customClass: {
                          confirmButton: 'btn btn-md !bg-blue-500 !text-white mx-2',
                        },
                        buttonsStyling: false
                      });
                    }else{
                       notification(request.message, 0);
                        Swal.fire({
                        title: 'Failed payment',
                        text: 'Please reach out for support',
                        icon: 'error',
                        confirmButtonText: 'Okay',
                        customClass: {
                          confirmButton: 'btn btn-md !bg-blue-500 !text-white mx-2',
                        },
                        buttonsStyling: false
                      });
                       notification(request.message, 0);
                    }
                }
            }
            
            
            // if(did('amountpaid').value && guest){
            //     // we have to check if the user
            //     let amt = Number(did('totalamount').value??0) - Number(did('amountpaid').value??0)
            //     if(populateddata && !populateddata.amountpaid){
            //         if(guest == 'reservationcheckinform' || guest == 'groupcheckinform'){
            //             if(request.reference && document.getElementById('reservationtype').value == 'GUARANTEED'){
            //             function payloadinvoice(){
            //                 let p = new FormData();
            //                 p.append('reference', request.reference)
            //                 p.append('paymentmethod', did('paymentmethod').value)
            //                 p.append('totaldue', did('totalamount').value)
            //                 p.append('amountpaid', did('amountpaid').value)
            //                 p.append('distribute', 'YES')
            //                 p.append('bankname', did('bankname').value)
            //                 p.append('otherdetails', did('otherdetails').value)
            //                 return p
            //             }
            //             let requestinvoice = await httpRequest2('../controllers/invoicing', payloadinvoice(), document.querySelector(`#${guest} #submit`))
            //             if(requestinvoice.status) {
            //                 notification(requestinvoice.message, 1);
            //             }
            //                 notification(request.message, 0);
            // }
            //         }
            //     }
            // }
        }else if(guest == 'cancelreservationform'){
            Swal.fire({
              title: "Cancelled!",
              text: "Reservation Cancelled",
              icon: "success"
            });
        }
    
        populateddata = '';
        
        checkinid = '';
        if(guest == 'checkinform')document.querySelector('#checkin').click();
        if(guest == 'reassignroomsform')document.querySelector('#reassignrooms').click();
        if(guest == 'guestreservationform')document.querySelector('#guestsreservations').click();
        if(guest == 'reservationcheckinform')document.querySelector('#reservationcheckin').click();
        if(guest == 'groupcheckinform')document.querySelector('#groupcheckin').click();
        if(guest == 'extendstayform')document.querySelector('#extendstay').click();
        if(guest == 'cancelreservationform')document.querySelector('#cancelreservation').click();
        if(guest != 'cancelreservationform' || guest == 'extendstayform')fetchcheckinn();
        if (guest == 'cancelreservationform') {
        // Query all input, select, and textarea elements within the form with id 'cancelreservationform'
        const elements = document.querySelectorAll('#cancelreservationform input, #cancelreservationform select, #cancelreservationform textarea');
        
        // Loop through each element and disable if it does not have the class 'sss'
        if(elements)elements.forEach(element => {
                                if (!element.classList.contains('sss')) {
                                    element.disabled = true;
                                }
                            });
                        }
                    
        console.log('returned response', request)

        return notification(request.message, 1)
    } 
    
    
    // document.querySelector('#guestsform').reset();
    // fetchguestsreservations();
    return notification(request.message, 0);
}