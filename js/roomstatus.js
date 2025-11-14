let roomstatusid
async function roomstatusActive() {
    const form = document.querySelector('#roomstatusform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', fetchallroomstatus)
    datasource = []
    await fetchallroomstatus()
    // await fetchroomstatus()
}

async function fetchallroomstatus() {
    did('roomer').innerHTML = ''
    notification('Loading...')
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('arrivaldate', did('arrivaldate').value)
        paramstr.append('departuredate', did('departuredate').value)
        return paramstr
    }
    let request = await httpRequest2('../controllers/getallroomstatus', getparamm(), did('submit'), 'json')
    if(request.status) { 
        let map = request.data
        datasource = request.data
        if(did('roomstatuser').value == ''){
            map = request.data
        }else{
            map = request.data.filter(dat=>dat.roomstatus == did('roomstatuser').value)
        }
        if(map.length<1){
            did('roomer').innerHTML = 'No Room found for this category'
            return
        }
        // did('roomer').innerHTML = map.map((data, i)=>`
        //      <div class="w-full h-fit p-7 bg-white">
        //                                     <hr/>
        //                                         <div class="flex flex-col lg:flex-row flex-wrap gap-4">
        //                                             <div class="p-2 flex flex-col min-w-[200px]">
        //                                                 <label for="logoname" class="control-label !font-bold">room name:</label>
        //                                                 <p class="control-label">${data.roomname}</p>
        //                                             </div>
        //                                             <div class="p-2 flex flex-col min-w-[200px]">
        //                                                 <label for="logoname" class="control-label !font-bold">Building:</label>
        //                                                 <p class="control-label">${data.building}</p>
        //                                             </div>
        //                                             <div class="p-2 flex flex-col min-w-[200px]">
        //                                                 <label for="logoname" class="control-label !font-bold">category:</label>
        //                                                 <p class="control-label">${data.roomcategory}</p>
        //                                             </div>
        //                                             <div class="p-2 flex flex-col min-w-[200px]">
        //                                                 <label for="logoname" class="control-label !font-bold">floor:</label>
        //                                                 <p class="control-label">${data.floor}</p>
        //                                             </div>
        //                                             <div class="p-2 flex flex-col min-w-[200px]">
        //                                                 <label for="logoname" class="control-label !font-bold">room number:</label>
        //                                                 <p class="control-label">${data.roomnumber}</p>
        //                                             </div>
        //                                             <div class="p-2 flex flex-col min-w-[200px]">
        //                                                 <label for="logoname" class="control-label !font-bold">room status:</label>
        //                                                 <p class="control-label">${data.roomstatus}</p>
        //                                             </div>
        //                                             <div class="p-2 flex flex-col min-w-[200px]">
        //                                                 <label for="logoname" class="control-label !font-bold">floor:</label>
        //                                                 <p class="control-label">${data.roomname}</p>
        //                                             </div>
        //                                             <div class="p-2 flex flex-col min-w-[200px]">
        //                                                 <label for="logoname" class="control-label !font-bold">room status description:</label>
        //                                                 <p class="control-label">${data.roomstatusdescription}</p>
        //                                             </div>
        //                                             <div class="p-2 flex flex-col min-w-[200px]">
        //                                                 <label for="logoname" class="control-label !font-bold">description:</label>
        //                                                 <p class="control-label">${data.description}</p>
        //                                             </div>
        //                                             <div class="p-2 flex flex-col min-w-[200px]">
        //                                                 <label for="logoname" class="control-label !font-bold">image:</label>
        //                                                 <p class="control-label"><img src="../images/${data.imageurl1}" class="w-[200px] h-[200px] hover:scale-[2] transition-all" /></p>
        //                                             </div>
        //                                             <div class="p-2 flex flex-col min-w-[200px]">
        //                                                 <label for="logoname" class="control-label !font-bold">image:</label>
        //                                                 <p class="control-label"><img src="../images/${data.imageurl2}" class="w-[200px] h-[200px] hover:scale-[2] transition-all" /></p>
        //                                             </div>
        //                                         </div>
        //                                             <div class="p-2 flex gap-4 w-full justify-end">
        //                                                 <button title="check-In" onclick="viewroomdetails('${data.roomnumber}')" class="material-symbols-outlined slide-fwd-center rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
        //                                                 <button title="Check-Out" class="${data.roomstatus == 'OCCUPIED' ? '' : 'hidden '}material-symbols-outlined slide-fwd-center rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">exit_to_app</button>
        //                                             </div>
                                                    // ${data.roomstatus == 'AVAILABLE' ? `<button onclick="sessionStorage.setItem('roomsetting', '${data.categoryid}_${data.roomnumber}');did('checkin').click()" type="button" class="mx-1 text-white bg-[#2BAD5D] hover:bg-[#2BAD5D]/90  font-medium text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2">
                                                    // <span class="material-symbols-outlined slide-fwd-center">check</span>
                                                    // &nbsp;&nbsp;Check In
                                                    // </button>
                                                    // <button onclick="sessionStorage.setItem('roomsetting', '${data.categoryid}_${data.roomnumber}');did('guestsreservations').click()" type="button" class="mx-1 text-white bg-[#AD522B] hover:bg-[#AD522B]/90  font-medium text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2">
                                                    // <span class="material-symbols-outlined slide-fwd-center">check</span>
                                                    // &nbsp;&nbsp;Reserve
                                                    // </button>` : ''}
                                                    
                                                    // ${data.roomstatus == 'OCCUPIED' ? `<button type="button" class="mx-1 text-white bg-[#AD2B2B] hover:bg-[#AD2B2B]/90  font-medium text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2">
                                                    // <span class="material-symbols-outlined slide-fwd-center">groups</span>
                                                    // &nbsp;&nbsp;Check out
                                                    // </button>
                                                    // <button type="button" class="mx-1 text-white bg-[#2B7FAD] hover:bg-[#2B7FAD]/90  font-medium text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2">
                                                    // <span class="material-symbols-outlined slide-fwd-center">groups</span>
                                                    // &nbsp;&nbsp;View Check In
                                                    // </button>` : ''}
                                                    
                                                    // ${data.roomstatus == 'RESERVED' ? `<button type="button" class="mx-1 text-white bg-[#2B7FAD] hover:bg-[#2B7FAD]/90  font-medium text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2">
                                                    // <span class="material-symbols-outlined slide-fwd-center">check</span>
                                                    // &nbsp;&nbsp;View Reservation
                                                    // </button>
                                                    // <button type="button" class="mx-1 text-white bg-[#2BAD5D] hover:bg-[#2BAD5D]/90  font-medium text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2">
                                                    // <span class="material-symbols-outlined slide-fwd-center">check</span>
                                                    // &nbsp;&nbsp;Check In
                                                    // </button>
                                                    // <button type="button" class="mx-1 text-white bg-[#AD2B2B] hover:bg-[#AD2B2B]/90  font-medium text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2">
                                                    // <span class="material-symbols-outlined slide-fwd-center">check</span>
                                                    // &nbsp;&nbsp;Cancel Reservation
                                                    // </button>` : ''}
        //                                     <hr/>
        //                                 </div>
        // `).join('')
        did('roomer').innerHTML = map.map((data, i)=>{
            
        return`
             <div class="w-[200px] h-fit pt-2 px-3 
                    ${data.roomstatus == 'AVAILABLE' ? `bg-green-300`: ''} 
                    ${data.roomstatus == 'OCCUPIED' ? `bg-red-300`: ''} 
                    ${data.roomstatus == 'RESERVED' ? `bg-orange-300`: ''} 
                    border overflow-visible rounded shadow-md">
                                                <div class="flex flex-wrap gap-1">
                                                    <div class="flex w-full justify-between items-center min-w-[100px]">
                                                        <label for="logoname" class="control-label hidden !font-bold">room status:</label>
                                                        <p class="control-label text-lg
                                                         ${data.roomstatus == 'AVAILABLE' ? `text-green-800`: ''} 
                                                         ${data.roomstatus == 'OCCUPIED' ? `text-red-800`: ''} 
                                                         ${data.roomstatus == 'RESERVED' ? `text-orange-800`: ''} 
                                                         " title="${data.roomstatusdescription} ${data.description}"
                                                         >${data.roomstatus}</p>
                                                        <div class="flex w-full justify-center gap-2 items-center min-w-[100px]">
                                                            <label for="logoname" class="control-label !font-bold">room:</label>
                                                            <p class="control-label text-lg text-white">${data.roomnumber}</p>
                                                        </div>
                                                    </div>
                                                    <div class="flex flex-col min-w-[100px] text-xs">
                                                        <label for="logoname" class="control-label !font-bold">room name:</label>
                                                        <p class="control-label">${data.roomname}</p>
                                                    </div>
                                                    <div class="flex gap-1">
                                                        <div class="flex flex-col min-w-[100px] text-xs">
                                                            <label for="logoname" class="control-label !font-bold">Building:</label>
                                                            <p class="control-label">${data.building}</p>
                                                        </div>
                                                        <div class="flex flex-col min-w-[100px] text-xs">
                                                            <label for="logoname" class="control-label !font-bold">floor:</label>
                                                            <p class="control-label">${data.floor}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                    <div class="flex w-full justify-between items-end mt-3 min-w-[100px]">
                                                        ${data.roomstatus == 'AVAILABLE' ? `<button title="Check In" onclick="sessionStorage.setItem('roomsetting', '${data.categoryid}_${data.roomnumber}');did('checkin').click()" type="button" class="mx-1 btn-sm text-white bg-[#2BAD5D] hover:bg-[#2BAD5D]/90  font-medium text-sm px-1 py-0.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2">
                                                        <span class="material-symbols-outlined slide-fwd-center">check</span>
                                                        </button>
                                                        <button title="Reserve this room" onclick="sessionStorage.setItem('roomsetting', '${data.categoryid}_${data.roomnumber}');did('guestsreservations').click()" type="button" class="mx-1 btn-sm text-white bg-[#AD522B] hover:bg-[#AD522B]/90  font-medium text-sm px-1 py-0.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2">
                                                        <span class="material-symbols-outlined slide-fwd-center shadow-lg">keep_public</span>
                                                        </button>` : ''}
                                                        
                                                        ${data.roomstatus == 'OCCUPIED' ? `<button title="Check out" type="button" class="mx-1 btn-sm text-white bg-[#AD2B2B] hover:bg-[#AD2B2B]/90  font-medium text-sm px-1 py-0.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-1 mb-1">
                                                        <span class="material-symbols-outlined slide-fwd-center shadow-lg">logout</span>
                                                        </button>
                                                        <button type="button" title="View Check In" class="mx-1 btn-sm text-white bg-[#2B7FAD] hover:bg-[#2B7FAD]/90  font-medium text-sm px-1 py-0.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-1 mb-1">
                                                        <span class="material-symbols-outlined slide-fwd-center shadow-lg">visibility</span>
                                                        </button>` : ''}
                                                        
                                                        ${data.roomstatus == 'RESERVED' ? `<button onclick="viewroomreservationcheckin('${data.reservationid}', this)" title="View Reservation" type="button" class="mx-1 btn-sm text-white bg-[#2B7FAD] hover:bg-[#2B7FAD]/90  font-medium text-sm px-1 py-0.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-1 mb-1">
                                                        <span class="material-symbols-outlined slide-fwd-center shadow-lg">Visibility</span>
                                                        </button>
                                                        <button type="button"  onclick="sessionStorage.setItem('checkinfromsomewhere', '${data.reservationid}');did('reservationcheckin').click()" title="Check In" class="mx-1 btn-sm text-white bg-[#2BAD5D] hover:bg-[#2BAD5D]/90  font-medium text-sm px-1 py-0.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-1 mb-1">
                                                        <span class="material-symbols-outlined slide-fwd-center shadow-lg">check</span>
                                                        </button>
                                                        <button type="button" title="Cancel Reservation" class="mx-1 btn-sm text-white bg-[#AD2B2B] hover:bg-[#AD2B2B]/90  font-medium text-sm px-1 py-0.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-1 mb-1">
                                                        <span class="material-symbols-outlined slide-fwd-center shadow-lg">close</span>
                                                        </button>` : ''}
                                                        
                                                        <div class="tooltip underline flex mx-auto w-fit text-xs items-end mb-[10px]">View Images
                                                            <div class="tooltiptext overflow-visible !w-fit">
                                                            <div class="flex overflow-visible">
                                                                <div class="p-2 flex flex-col min-w-[200px]">
                                                                    <label for="logoname" class="control-label !font-bold">room: ${data.roomnumber}</label>
                                                                    <p class="control-label"><img src="../images/${data.imageurl1}" class="w-[200px] h-[200px] hover:scale-[2] transition-all" /></p>
                                                                </div>
                                                                <div class="p-2 flex flex-col min-w-[200px]">
                                                                    <label for="logoname" class="control-label !font-bold">room: ${data.roomnumber}</label>
                                                                    <p class="control-label"><img src="../images/${data.imageurl2}" class="w-[200px] h-[200px] hover:scale-[2] transition-all" /></p>
                                                                </div>
                                                            </div>
                                                            <div class="flex justify-center w-full overflow-visible">
                                                                <button class="btn btn-sm p-1 text-xs"  onclick="openmodalforoccupancy('${data.roomnumber}')">Room Transactions</button>
                                                            </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                <div class="p-2 flex gap-4 w-full hidden justify-end">
                                                    <button title="check-In" onclick="viewroomdetails('${data.roomnumber}')" class="material-symbols-outlined slide-fwd-center rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
                                                    <button title="Check-Out" class="${data.roomstatus == 'OCCUPIED' ? '' : 'hidden '}material-symbols-outlined slide-fwd-center rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">exit_to_app</button>
                                                </div>
                                        </div>
        `}).join('')
    }
    else return notification('No records retrieved')
}

async function viewroomreservationcheckin(id, btn){
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchreservationbyid', getparamm(), btn, 'json')
    if(request.status) { 
        let receiptdata = request.data[0]
    if(!receiptdata)return callModal('Something went wrong...')
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
                        				<span class="xl:w-[250px] pb-10 font-bold text-2xl text-base block py-3 pl-5 selection:bg-white uppercase font-heebo text-primary-g text-right">He<span class="text-gray-400">ms</span></span>
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
                        				<input readonly value="${receiptdata.reservations.billinginfo??''}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                        				<label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Cancellation Date:</label>
                        				<input readonly value="${receiptdata.reservations.cancellationdate??''}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                        				<label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Source:</label>
                        				<input readonly value="${receiptdata.reservations.source??''}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                        				<label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Status:</label>
                        				<input readonly value="${receiptdata.reservations.status == 'OPEN' ? 'RESERVED' : receiptdata.reservations.status }" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                        				<label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Re-assignment Date:</label>
                        				<input readonly value="${receiptdata.reservations.roomreassignmentdate??''}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                        			</div>
                        			<div class="w-full md:w-1/3">
                        				<label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Firm:</label>
                        				<input value="Hems Limited" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Your company name" >
                        				<label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Group:</label>
                        				<input readonly value="${receiptdata.reservations.groupname??''}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                        				<label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Company:</label>
                        				<input readonly value="${receiptdata.reservations.companyname??''}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                        				<label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Travel Agent:</label>
                        				<input readonly value="${receiptdata.reservations.travelagentname??''}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                        				<label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Type of Guest:</label>
                        				<input readonly value="${receiptdata.reservations.typeofguest??''}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
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
                                                receiptdata.roomguestrow.map((item, index)=>{
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
                        
                        		
                        
                        		<div class="py-10 text-center">
                        			<p class="text-gray-600">Created by <a class="text-blue-600 hover:text-blue-500 border-b-2 border-blue-200 hover:border-blue-300" href="https://twitter.com/mithicher">Mira Technologies</a>.</p>
                                </div>
                        
                        		
                        
                        
                        
                        	</div>
    `
    
    
    did('modalreceipt').classList.remove('hidden')
    }else notification(request.message, 0)
}

async function viewroomdetails(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('roomnumber', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/getroomstatus', id ? getparamm() : null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
       
    }
    else return notification('No records retrieved')
}


async function fetchroomstatus(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchroomstatus', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onroomstatusTableDataSignal)
            }
        }else{
             roomstatusid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeroomstatus(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this roomstatus?");

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
    fetchroomstatus()
    return notification(request.message);
    
}


async function onroomstatusTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchroomstatus('${item.id}')" class="material-symbols-outlined slide-fwd-center rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeroomstatus('${item.id}')" class="material-symbols-outlined slide-fwd-center rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function roomstatusFormSubmitHandler() {
    if(!validateForm('roomstatusform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#roomstatusform'), roomstatusid ? [['id', roomstatusid]] : null)
    let request = await httpRequest2('../controllers/roomstatuscript', payload, document.querySelector('#roomstatusform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#roomstatusform').reset();
        fetchroomstatus();
        return
    }
    document.querySelector('#roomstatusform').reset();
    fetchroomstatus();
    return notification(request.message, 0);
}


// function runAdroomstatusFormValidations() {
//     let form = document.getElementById('roomstatusform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#roomstatusname'))  controls.push([form.querySelector('#roomstatusname'), 'roomstatus name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }