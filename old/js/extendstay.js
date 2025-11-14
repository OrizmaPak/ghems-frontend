async function extendstayActive() {
    notification('Loading...')
    // markallcomp()
    const form = document.querySelector('#extendstayform')
    await checkinpopulatedl()
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', e=>checkinnFormSubmitHandler('extendstayform'))
    if(document.querySelector('#phone')) document.querySelector('#phone').addEventListener('change', e=>handlecheckinphone('phone')) 
    if(document.querySelector('#submitguestmodal')) document.querySelector('#submitguestmodal').addEventListener('click', e=>submitguestform())
    if(document.querySelector('#submitcompany'))document.querySelector('#submitcompany').addEventListener('click', companysubmithandle)
    if(document.querySelector('#submittravel'))document.querySelector('#submittravel').addEventListener('click', travelssubmithandle) 
    if(document.querySelector('#company'))document.querySelector('#company').addEventListener('change', e=>groupcompanyres()) 
    if(document.querySelector('#company'))document.querySelector('#company').addEventListener('change', e=>groupcompanyres()) 
    if(document.querySelector('#travelagent'))document.querySelector('#travelagent').addEventListener('change', e=>grouptravelagentres())  
    if(document.querySelector('#group_id'))document.querySelector('#group_id').addEventListener('change', e=>groupres()) 
    // if(document.querySelector('#roomcategory'))document.querySelector('#roomcategory').addEventListener('change', e=>controlroomlist('roomcategory')) 
    if(document.querySelector('#submitref')) document.querySelector('#submitref').addEventListener('click', fetchdataforextendstay)
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
    // await fetchcheckinn() 
    await fetchtravelsres()
    await fetchcompanyres()
    await fetchgroupsres()
    did('initialroombtn').click()
}
// every functions can be found in the index.js checkin.js and oreutil.js

async function fetchdataforextendstay(id) {
        did('mainform').classList.add('hidden')
    // scrollToTop('scrolldiv') 
    if(!did('reference').value)return notification('Please enter a valid reference number', 0)
    function getparamm(){ 
        let paramstr = new FormData()
        paramstr.append('reference', did('reference').value)
        return paramstr
    } 
    let request = await httpRequest2('../controllers/fetchreservationbyref', getparamm(), document.querySelector('#submitref'), 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        datasource = request.data;
        did('referencer').value = did('reference').value
        did('mainform').classList.add('hidden')
        if(request.data[0].reservations.status == 'RESERVED' && request.data[0].reservations.status == 'OPEN' && request.data[0].reservations.status == 'CHECKED IN')did('reference').value = ''
        if(request.data[0].reservations.status == 'RESERVED' && request.data[0].reservations.status == 'OPEN' && request.data[0].reservations.status == 'CHECKED IN')return notification(`The guest has already ${request.data[0].reservations.status}`, 0)
        did('mainform').classList.remove('hidden')
        checksessionstorage(request.data[0].reservations.id)
        // let tt = 0
        //     yy = 0
        // did('tabledata').innerHTML = request.data.transactions.map((item, index)=>{
        //     tt=tt+(Number(item.debit)-Number(item.credit))
        //     // S/N	ITEM	DEBIT	CREDIT	BALANCE
        //     return `
        //         <tr>
        //             <td>${index + 1 }</td>
        //             <td>${specialformatDateTime(item.transactiondate)}</td>
        //             <td>${item.description}</td>
        //             <td>${formatNumber(item.debit)}</td>
        //             <td>${formatNumber(item.credit)}</td>
        //             <td>${formatNumber(tt)}</td>
        //         </tr>
        //     `
        // }).join('')
        // did('tabledata').innerHTML += `
        //         <tr>
        //             <td></td>
        //             <td></td>
        //             <td></td>
        //             <td></td>
        //             <td class="text-bold">Total:</td>
        //             <td>${formatNumber(tt)}</td>
        //         </tr>
        //     `
        // did('balance').value = tt
        // did('displaydetails').innerHTML = `
        //                     <div class="flex flex-col justify-center items-center gap-2">
        //                             <h4 class="font-semibold">${did('your_companyname').value}</h4>
        //                             <p class="text-xs">${did('your_companyaddress').value}</p>
        //                         </div>
        //                         <div class="flex flex-col gap-3 border-b py-6 text-xs">
        //                           <p class="flex justify-between">
        //                             <span class="text-gray-400 capitalize text-right">reference:</span>
        //                             <span>${request.data.reservation.reference}</span>
        //                           </p>
        //                           <p class="flex justify-between">
        //                             <span class="text-gray-400 capitalize text-right">arrival date:</span>
        //                             <span>${specialformatDateTime(request.data.reservation.arrivaldate)}</span>
        //                           </p>
        //                           <p class="flex justify-between">
        //                             <span class="text-gray-400 capitalize text-right">departure date:</span>
        //                             <span>${specialformatDateTime(request.data.reservation.departuredate)}</span>
        //                           </p>
        //                           <p class="flex justify-between">
        //                             <span class="text-gray-400 capitalize text-right">number of nights:</span>
        //                             <span>${specialformatDateTime(request.data.reservation.numberofnights)}</span>
        //                           </p>
        //                           <p class="flex justify-between">
        //                             <span class="text-gray-400 capitalize text-right">type of guest:</span>
        //                             <span>${request.data.reservation.typeofguest}</span>
        //                           </p>
        //                           <p class="flex justify-between">
        //                             <span class="text-gray-400 capitalize text-right">currency:</span>
        //                             <span>${request.data.reservation.currency}</span>
        //                           </p>
        //                           <p class="flex justify-between">
        //                             <span class="text-gray-400 capitalize text-right text-bold">Total Balance:</span>
        //                             <span>${formatNumber(tt)}</span>
        //                           </p>
        //                         </div>
        //                         <div class="flex flex-col gap-3 pb-6 pt-2 text-xs">
        //                           <div class=" border-b border border-dashed"></div>
        //                           <div class="py-4 justify-center items-center flex flex-col gap-2">
        //                             <p class="flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21.3 12.23h-3.48c-.98 0-1.85.54-2.29 1.42l-.84 1.66c-.2.4-.6.65-1.04.65h-3.28c-.31 0-.75-.07-1.04-.65l-.84-1.65a2.567 2.567 0 0 0-2.29-1.42H2.7c-.39 0-.7.31-.7.7v3.26C2 19.83 4.18 22 7.82 22h8.38c3.43 0 5.54-1.88 5.8-5.22v-3.85c0-.38-.31-.7-.7-.7ZM12.75 2c0-.41-.34-.75-.75-.75s-.75.34-.75.75v2h1.5V2Z" fill="#000"></path><path d="M22 9.81v1.04a2.06 2.06 0 0 0-.7-.12h-3.48c-1.55 0-2.94.86-3.63 2.24l-.75 1.48h-2.86l-.75-1.47a4.026 4.026 0 0 0-3.63-2.25H2.7c-.24 0-.48.04-.7.12V9.81C2 6.17 4.17 4 7.81 4h3.44v3.19l-.72-.72a.754.754 0 0 0-1.06 0c-.29.29-.29.77 0 1.06l2 2c.01.01.02.01.02.02a.753.753 0 0 0 .51.2c.1 0 .19-.02.28-.06.09-.03.18-.09.25-.16l2-2c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-.72.72V4h3.44C19.83 4 22 6.17 22 9.81Z" fill="#000"></path></svg>${did('your_companyemail').value}</p>
        //                             <p class="flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path fill="#000" d="M11.05 14.95L9.2 16.8c-.39.39-1.01.39-1.41.01-.11-.11-.22-.21-.33-.32a28.414 28.414 0 01-2.79-3.27c-.82-1.14-1.48-2.28-1.96-3.41C2.24 8.67 2 7.58 2 6.54c0-.68.12-1.33.36-1.93.24-.61.62-1.17 1.15-1.67C4.15 2.31 4.85 2 5.59 2c.28 0 .56.06.81.18.26.12.49.3.67.56l2.32 3.27c.18.25.31.48.4.7.09.21.14.42.14.61 0 .24-.07.48-.21.71-.13.23-.32.47-.56.71l-.76.79c-.11.11-.16.24-.16.4 0 .08.01.15.03.23.03.08.06.14.08.2.18.33.49.76.93 1.28.45.52.93 1.05 1.45 1.58.1.1.21.2.31.3.4.39.41 1.03.01 1.43zM21.97 18.33a2.54 2.54 0 01-.25 1.09c-.17.36-.39.7-.68 1.02-.49.54-1.03.93-1.64 1.18-.01 0-.02.01-.03.01-.59.24-1.23.37-1.92.37-1.02 0-2.11-.24-3.26-.73s-2.3-1.15-3.44-1.98c-.39-.29-.78-.58-1.15-.89l3.27-3.27c.28.21.53.37.74.48.05.02.11.05.18.08.08.03.16.04.25.04.17 0 .3-.06.41-.17l.76-.75c.25-.25.49-.44.72-.56.23-.14.46-.21.71-.21.19 0 .39.04.61.13.22.09.45.22.7.39l3.31 2.35c.26.18.44.39.55.64.1.25.16.5.16.78z"></path></svg>${did('your_companyphone').value}</p>
        //                           </div>
        //                         </div>
        // `;
       
    }
    else{
        did('invoicing').click()
        return notification(request.message, 0)}
}
