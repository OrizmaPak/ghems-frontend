       <section class="animate__animated animate__fadeIn max-w-full">
                            <p class="page-title">
                                <span>Group Reservations</span>
                            </p>
                            
                             <hr class="my-3">
                            
                            <!--<div id="" class="bg-white xl:border !max-w-[100%] overflow-auto rounded py-14 px-7 drop-shadow-sm pt-4">-->
                            <div id="" class="bg-white xl:border overflow-auto rounded py-14 px-7 drop-shadow-sm pt-4">
                                
                                
                                <div id="groupreservationsformcontainer">
                                    <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
                                        <!--<li id="rccview" class="me-2 cp viewer" onclick="did('guestsreservationsform').classList.add('hidden');this.children[0].classList.add('active', '!text-blue-600');did('lostandfoundview').classList.remove('hidden');this.nextElementSibling.children[0].classList.remove('active', '!text-blue-600');">-->
                                        <li id="iddguestsreservationsform1" class="me-2 cp viewer optioner !text-blue-600 active" name="guestsreservationsform" >
                                            <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Group Reservations</p>
                                        </li>
                                        <!--<li id="iddcheckinform1" class="me-2 cp updater optioner" name="viewguestprofiles">-->
                                        <!--    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ">checkin</p>-->
                                        <!--</li>-->
                                    </ul>
                                    <form id="groupreservationsform" class="">
                                        <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                            <div class="grid grid-cols-1 !mb-5 lg:grid-cols-3 gap-10">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">Group</label>
                                                    <select name="group_id" id="group_id" class="form-control ">
                                                        <option>Loading...</option>
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">Arrival Date from:</label>
                                                    <input type="datetime-local"  name="startdate" id="startdate" class="form-control comp" placeholder="Enter  guest's first name or last name or other names or passport number or phone or visa number">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">To:</label>
                                                    <input type="datetime-local" name="enddate" id="enddate" class="form-control comp" placeholder="Enter Last Name">
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-10">
                                                <div class="form-group">
                                                </div>
                                                
                                                
                                                <div class="flex justify-end mt-5">
                                                     <button id="submit" type="button" class="w-full h-[45px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                        <div class="btnloader" style="display: none;"></div>
                                                        <span>Submit</span> 
                                                    </button>
                                                </div>
                                                
                                            </div> 
                                
                                        </div>
                                    </form>
                                     <div class="table-content  lg:max-w-full">
                                    <table id="tableer">
                                        <thead>
                                            <tr>
                                                 <th style="width: 20px">s/n</th> 
                                                <th>action</th>
                                                <th>reference</th>
                                                <th>arrival&nbsp;date</th>
                                                <th>departure&nbsp;date</th>
                                                <th>Rooms</th>
                                                <th>Guest</th>
                                                <th>no.&nbsp;of&nbsp;nights</th>
                                                <th>total&nbsp;rate</th>
                                                <th>reservation&nbsp;type</th>
                                                <th>payment&nbsp;method</th>
                                                <th>reservation&nbsp;date</th>
                                                <th>timeline</th>
                                                <th>status</th>
                                            </tr>
                                        </thead>
                                        <tbody id="tabledata">
                                            <tr>
                                                <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="table-status"></div>    
                                </div>
                                
                                
                                
                                <form id="groupreservationscheckinsform" class="hidden">
                                     <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
                                        <!--<li id="rccview" class="me-2 cp viewer" onclick="did('guestsreservationsform').classList.add('hidden');this.children[0].classList.add('active', '!text-blue-600');did('lostandfoundview').classList.remove('hidden');this.nextElementSibling.children[0].classList.remove('active', '!text-blue-600');">-->
                                        <li id="iddguestsreservationsform2" class="me-2 cp updater optioner" name="viewguestprofiles">
                                            <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ">Arrivals</p>
                                        </li>
                                        <li id="iddcheckinform2" class="me-2 cp viewer optioner !text-blue-600 active" name="guestsreservationsform">
                                            <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">checkin</p>
                                        </li>
                                    </ul>
                                
                                    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="flex w-full justify-between mb-10">
                                        
 
                                        <div class="w-full max-w-md bg-white border border-gray-200 shadow rounded-lg p-5">
                                            <h2 class="text-lg font-semibold text-gray-900 mb-2">Guest / Reservation details</h2>
                                            <address class="relative bg-gray-50 p-4 rounded-lg border border-gray-200 not-italic grid grid-cols-2">
                                                <div class="space-y-2 text-gray-700 leading-loose sm:block">
                                                    Name <br />
                                                    Age <br />
                                                    Origin <br />
                                                    Phone Number <br />
                                                    Nationality <br />
                                                    Purpose of stay <br />
                                                    Arrival <br />
                                                    Room Number <br />
                                                    Room Rate <br />
                                                    Room Category <br />
                                                    Number of Nights <br />
                                                    Number of Persons <br />
                                                    Departure <br />
                                                </div>
                                                <div id="contact-details" class="space-y-2 text-gray-900 font-medium leading-loose">
                                                    
                                                </div>
                                                <!--<button data-copy-to-clipboard-target="contact-details" data-copy-to-clipboard-content-type="textContent" data-tooltip-target="tooltip-contact-details" class="absolute end-2 top-2 text-gray-500 hover:bg-gray-100 rounded-lg p-2 inline-flex items-center justify-center">-->
                                                <!--    <span id="default-icon-contact-details">-->
                                                <!--        <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">-->
                                                <!--            <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>-->
                                                <!--        </svg>-->
                                                <!--    </span>-->
                                                <!--    <span id="success-icon-contact-details" class="hidden inline-flex items-center">-->
                                                <!--        <svg class="w-3.5 h-3.5 text-blue-700 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">-->
                                                <!--            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>-->
                                                <!--        </svg>-->
                                                <!--    </span>-->
                                                <!--</button>-->
                                                <!--<div id="tooltip-contact-details" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip ">-->
                                                <!--    <span id="default-tooltip-message-contact-details">Copy to clipboard</span>-->
                                                <!--    <span id="success-tooltip-message-contact-details" class="hidden">Copied!</span>-->
                                                <!--    <div class="tooltip-arrow" data-popper-arrow></div>-->
                                                <!--</div>-->
                                            </address>
                                        </div>
                                    
                                        <div class="flex items-center gap-5 text-xl mt-auto border !h-fit p-4">
                                            <label for="logoname" class="text-sm font-bold">Total Amount:</label>
                                            <label for="logoname" id="totalmounttext1" class=" !text-xl font-bold text-[blue]">-</label>
                                            <input type="text"  name="totalamount" id="totalmount1" class="form-control !hidden border-none text-[blue]" readonly>
                                            <input type="text"  name="currency" id="currency1" class="form-control !hidden border-none text-[blue]" readonly>
                                        </div>
                                        
                                        
                                    </div>
                                    
                                    <div>
                                        <input type="text"  name="reservationid" id="reservationid" class="form-control hidden" readonly>
                                            <div class="form-group hidden">
                                                <label for="logoname" class="control-label">guest</label>
                                                <input type="text"  name="guestid" id="guest1" class="form-control" readonly>
                                            </div>
                                        <div class="grid grid-cols-1 !mb-5 gap-10">
                                            <input type="text" name="entrypoint" value="ARRIVALS" class="hidden"/>
                                        </div>
                                        <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">payment method</label>
                                                <select name="paymentmethod" id="paymentmethod1" class="form-control comp">
                                                    <option value="">-- SELECT PAYMENT METHOD --</option>
                                                    <option>BANK TRANSFER</option>
                                                    <option>CASH</option>
                                                    <option>VIRTUAL ACCOUNT</option>
                                                    <option>BANK CARD</option>
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">block room number</label>
                                                <input type="text" name="roomnumber" id="roomnumber" list="hems_roomnumber_id" onchange="checkdatalist(this);" class="form-control comp" placeholder="Enter root category">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                                    <label for="logoname" class="control-label">Amount <span class="text-xs text-[blue]" id="mindeposit1"></span></label>
                                                    <input type="number" onchange="checkmin(this)" name="amountpaid" id="amountpaid" class="form-control comp" placeholder="Enter deposit amount">
                                                </div>
                                        <div class="grid grid-cols-1 !mb-5 gap-10">
                                             <div class="flex justify-end mt-5 gap-4">
                                                 <button id="submit" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Submit</span> 
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                            
                                    </div>
                                </form>
                            </div>
                        
                        </section>  
                        <div id="modalreceipt" onclick="if(event.target.id == 'modalreceipt')this.classList.add('hidden')" class="!z-[100] w-screen h-screen fixed bg-[#5a5a5a3e] top-0 left-0 p-10 overflow-auto hidden">
                               
                               
                                </div>
                        
                        
                        
                        
                        