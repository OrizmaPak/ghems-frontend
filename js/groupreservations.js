let groupreservationsidd
let mindepoo
async function groupreservationsActive() {
    const form = document.querySelector('#groupreservationsform')
    const form2 = document.querySelector('#groupreservationscheckinsform')
    // did('iddcheckinform1').addEventListener('click', e=>openarrivaltab('checkin'))
    // did('iddcheckinform2').addEventListener('click', e=>openarrivaltab('checkin'))
    // did('iddguestsreservationsform1').addEventListener('click', e=>openarrivaltab('arrivals'))
    // did('iddguestsreservationsform2').addEventListener('click', e=>openarrivaltab('arrivals'))
    
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', groupreservationsFormSubmitHandler)
    if(form2.querySelector('#submit')) form2.querySelector('#submit').addEventListener('click', groupreservationscheckinFormSubmitHandler)
    datasource = []
    await fetchgroupsgroupres()
    // await fetchgroupreservations()
}

async function fetchgroupsgroupres() {
    let request = await httpRequest2('../controllers/fetchguestgroup', null, null, 'json')
        if(request.status) {
                did('group_id').innerHTML = `<option value="">-- Select Group --</option>`;
                did('group_id').innerHTML += request.data.map(dat=>`<option value="${dat.id}">${dat.groupname}</option>`).join('')
    }
    else return notification('No records retrieved')
}

function openarrivaltab(where){
    if(where == 'checkin' && groupreservationsidd){
        did('groupreservationsformcontainer').classList.add('hidden')
        did('groupreservationscheckinsform').classList.remove('hidden')
    }
    if(where == 'arrivals'){
        did('groupreservationsformcontainer').classList.remove('hidden')
        did('groupreservationscheckinsform').classList.add('hidden')
    }
}

async function fetchgroupreservations(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchreservationsbyfilter', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data.filter(data=>data.reservations.status == 'OPEN' || data.reservations.status == 'RESERVED')
                resolvePagination(datasource, ongroupreservationsTableDataSignal)
            }
        }else{
             groupreservationsidd = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removegroupreservations(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this groupreservations?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('reservationid', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/cancelreservation', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchgroupreservations()
    return notification(request.message);
    
}


async function ongroupreservationsTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => {
    let x =0;
    let r =0
    if(item.roomgeustrow && item.roomgeustrow.length>0){
        for(let i=0;i<item.roomgeustrow.length;i++){
            if(item.roomgeustrow[i].guest1.length > 0)x++
            if(item.roomgeustrow[i].guest2.length > 0)x++
            if(item.roomgeustrow[i].guest3.length > 0)x++ 
            if(item.roomgeustrow[i].guest4.length > 0)x++ 
            if(item.roomgeustrow[i].roomdata.roomrate)r = Number(item.roomgeustrow[i].roomdata.roomrate)+r
        }
    }
    return ` 
    <tr> 
        <td>${index + 1 }</td> 
        <td>
            <div class="w-full h-full flex items-center justify-center gap-4">
                <button onclick="opencheckinreceiptgroup('${item.reservations.id}', '${r}', '${x}')" class="material-symbols-outlined rounded-full bg-gray-100 h-8 w-8 text-green-400 drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
                <button title="check in" onclick="did('groupcheckin').click();sessionStorage.setItem('checkinfromsomewhere', '${item.reservations.id}')" class="material-symbols-outlined ${item.reservations.status != 'CHECKED IN' ? '' : 'hidden'} rounded-full bg-green-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">check_circle</button>
                <button title="Edit row entry" onclick="did('guestsreservations').click();sessionStorage.setItem('checkinfromsomewhere', '${item.reservations.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
                <button title="Delete row entry"s onclick="removeguestsreservations('${item.reservations.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
            </div>
        </td> 
        <td>${item.reservations.reference}</td>
        <td>${formatDate(item.reservations.arrivaldate)}</td>
        <td>${formatDate(item.reservations.departuredate)}</td>
        <td>${item.roomgeustrow.length}</td>
        <td>${x}</td>
        <td>${formatNumber(item.reservations.numberofnights)}</td>
        <td>${formatNumber(r)}</td>
        <td>${item.reservations.reservationtype}</td> 
        <td>${item.reservations.paymentmethod}</td>
        <td>${formatDate(item.reservations.reservationdate)}</td>
        <td class="">${item.reservations.timeline ? item.reservations.timeline : '--'}</td>
        <td>${item.reservations.status == 'OPEN' ? 'RESERVED' : item.reservations.status}</td>
    </tr> `}
    )
    .join('')
    injectPaginatatedTable(rows)
}

function opencheckinreceiptgroup(id, ratee, rooms){
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
        <div id="invoicecontainer" class="w-full mx-auto border rounded shadow p-10 bg-white relative ">
                                    <div class="w-full flex justify-end">
                                            <span class="material-symbols-outlined text-red-500 cp hover:scale-[1.3] transition-all" onclick="did('modalreceipt').classList.add('hidden')">close</span>
                                        </div>
                        		<div class="flex mb-8 justify-between">
                        			<div class="w-2/4">
                        				<div class="mb-2 md:mb-1 md:flex items-center">
                        					<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Ref No.</label>
                        					<div class="flex-1">
                        					<input value="${receiptdata.reservations.reference}" id="invoiceno" readonly class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="eg. #INV-100001">
                        					</div>
                        				</div>
                        
                        				<div class="mb-2 md:mb-1 md:flex items-center">
                        					<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Reservation Date</label>
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
                        				<span class="xl:w-[250px] pb-10 font-bold text-2xl text-base block py-3 pl-5 selection:bg-white uppercase font-heebo text-primary-g text-right">He<span class="text-gray-400">ms reservation view</span></span>
                        				<div class="flex justify-end">
                        				<div onclick="printContent('HEMS RESERVATION VIEW', null, 'invoicecontainer', true)" class="relative mr-4 inline-block">
                        					<div class="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 inline-flex items-center justify-center" onclick="printInvoice()">
                        						<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-printer" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        							<rect x="0" y="0" width="24" height="24" stroke="none"></rect>
                        							<path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"></path>
                        							<path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"></path>
                        							<rect x="7" y="13" width="10" height="8" rx="2"></rect>
                        						</svg>				  
                        					</div>
                        					<div  class="z-40 shadow-lg text-center w-32 block absolute right-0 top-0 p-2 mt-12 rounded-lg bg-gray-800 text-white text-xs" style="display: none;">
                        						Print this View!
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
                        
                        		<div class="flex flex-wrap justify-between mb-8 hidden">
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
                        			<div class="w-full md:w-1/3 hidden">
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
                                                                                <td id="rcheckindate" class="text-center opacity-70">${item.guest3[0].firstname}&nbsp;${item.guest1[0].lastname}&nbsp;${item.guest3[0].othernames}</td>
                                                                                <td id="rcheckindate" class="text-center opacity-70">${item.guest3[0].phone}</td>
                                                                            </tr>` : ''}
                                                                            ${item.guest4.length>0 ? `<tr>
                                                                                <td class="text-center opacity-70">4</td>
                                                                                <td id="rcheckindate" class="text-center opacity-70">${item.guest4[0].firstname}&nbsp;${item.guest1[0].lastname}&nbsp;${item.guest4[0].othernames}</td>
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

function editguestreservation(id, idd){
    did('guestsreservations').click()
    sessionStorage.setItem('editfromarrivals', `[${id},${idd}]`)
    // fetchguestsarrivalreservations(id);
    // fetchreservations(idd)
}

function fetchguestsarrivalreservations(id){
    groupreservationsidd = id
    did('iddcheckinform2').click()
    let datfilt = datasource.filter(data=>data.reservations.id == id)[0]
    did('contact-details').innerHTML = `
        ${datfilt.guests.firstname} ${datfilt.guests.lastname} <br/>
        ${calculateAge(datfilt.guests.birthdate)} <br/>
        ${datfilt.guests.origin} <br/>
        ${datfilt.guests.phone} <br/>
        ${datfilt.guests.nationality} <br/>
        ${datfilt.guests.purposeofstay} <br/>
        ${specialformatDateTime(datfilt.reservations.arrivaldate)} <br/>
        ${datfilt.reservations.roomnumber} <br/>
        ${formatCurrency(datfilt.reservations.roomrate)} <br/>
        ${datfilt.reservations.roomcategoryname} <br/>
        ${datfilt.reservations.numberofnights} <br/>
        ${datfilt.reservations.numberofpersons} <br/>
        ${specialformatDateTime(datfilt.reservations.departuredate)} <br/>
    `
    did('totalmounttext1').innerHTML = `${formatCurrency(Number(datfilt.reservations.roomrate)*Number(datfilt.reservations.numberofnights))}`
    did('totalmount1').value = Number(datfilt.reservations.roomrate)*Number(datfilt.reservations.numberofnights)
    did('reservationid').value = datfilt.reservations.id
    did('guest1').value = datfilt.guests.id
    did('roomnumber').value = datfilt.reservations.roomnumber
    did('amountpaid').value = datfilt.reservations.amountpaid
    did('mindepoosit1').innerHTML = `(minimum deposit is ${formatCurrency(rumcat.filter(data=>data.id == datfilt.reservations.roomcategory)[0].minimumrequireddeposit)})`
    mindepoo = Number(rumcat.filter(data=>data.id == datfilt.reservations.roomcategory)[0].minimumrequireddeposit)
    hemsroomnumber(datfilt.reservations.roomcategory)
}

async function groupreservationsFormSubmitHandler(id) {
    if(!validateForm('groupreservationsform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#groupreservationsform'), null)
    let request = await httpRequest2('../controllers/fetchreservationsbyfilter', payload, document.querySelector('#groupreservationsform #submit'))
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
            const filteredData = request.data
                .filter(data=>data.reservations.status == 'OPEN' || data.reservations.status == 'RESERVED')
                .filter(data=>data.reservations.group_id != '0')
            if(filteredData.length) {
                datasource = filteredData
                resolvePagination(datasource, ongroupreservationsTableDataSignal)
            } else {
                datasource = []
                document.getElementById('tabledata').innerHTML = `No records found for the selected filters`
            }
    }
    else return notification('No records retrieved')
}

async function groupreservationscheckinFormSubmitHandler(id) {
    if(!validateForm('groupreservationscheckinsform', getIdFromCls('comp'))) return
    // if(Number(mindepoo) <= Number(document.getElementById('amountpaid').value))return notification(`Amount paid must be more than or equal to ${formatCurrency(mindepoo)}`, 0)
    
    let payload

    payload = getFormData2(document.querySelector('#groupreservationscheckinsform'), null)
    let request = await httpRequest2('../controllers/checkin', payload, document.querySelector('#groupreservationscheckinsform #submit'))
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        notification('Checked in Successfully', 1)
                did('groupreservations').click()
    }
    else return notification('No records retrieved')
}


// function runAdgroupreservationsFormValidations() {
//     let form = document.getElementById('groupreservationsform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#groupreservationsname'))  controls.push([form.querySelector('#groupreservationsname'), 'groupreservations name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
