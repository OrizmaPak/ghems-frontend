let reassignid;
let reassignroom;
let reassignref;
let reassignbal;

async function reassignroomsActive() {
    reassignid = ''
    reassignroom = ''
    reassignref = ''
    reassignbal = ''
   notification('Loading...')
    checkinid = ''
    // markallcomp() 
    const form = document.querySelector('#reassignroomsform')  
    await checkinpopulatedl() 
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', e=>{
        if(reassignroom == document.getElementsByName('roomnumber')[0].value){
            return notification('Please note that the room was not changed.', 0);
        }
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
        return checkinnFormSubmitHandler('reassignroomsform')
        }
        return checkinnFormSubmitHandler('reassignroomsform')
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
    checkforassignment()
}


function checkforassignment(){
    if(sessionStorage.getItem('assignfromsomewhere')){
        reassignid = sessionStorage.getItem('assignfromsomewhere').split('_')[2]
        reassignroom = sessionStorage.getItem('assignfromsomewhere').split('_')[0]
        reassignref = sessionStorage.getItem('assignfromsomewhere').split('_')[1]
        reassignbal = sessionStorage.getItem('assignfromsomewhere').split('_')[3]
        fetchcheckinn(reassignid)
        sessionStorage.removeItem('assignfromsomewhere')
        runoptioner(document.getElementsByName('reassignroomsform')[0])
    }
}

function disablefortransfer(rm){
    for(let i=0;i<document.getElementsByName('roomnumber').length;i++){
        let index = document.getElementsByName('roomnumber')[i].id.split('-')[1];
        console.log('index', index)
        if(document.getElementsByName('roomnumber')[i].value != rm)document.getElementById('roomfullcontainer').children[index].remove()
    }
    calculatetotals();
    document.getElementById('roomfullcontainer').children[0].children[0].disabled = true;
    document.getElementById('roomfullcontainer').children[0].children[1].disabled = true;
    document.getElementById('initialroombtn').disabled = true;
    document.getElementById('oldroomnumber').value = reassignroom;
    document.getElementById('oldreference').value = reassignref;
    document.getElementById('oldbalance').value = reassignbal;
    document.getElementById('oldbalance').value = reassignbal;
    document.getElementById('amountpaid').value = '';
}