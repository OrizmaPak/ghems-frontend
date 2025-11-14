           <section class="animate__animated animate__fadeIn">
                            <!--<p class="page-title">-->
                            <!--    <span>CHECK-IN</span>-->
                            <!--</p>-->
                            
                             <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 cark:border-gray-700 cark:text-gray-400">
                                <li id="" class="me-2 cp viewer optioner" name="noshowview" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ">View Guest & Reservations</p>
                                </li>
                            </ul>
                            
                                <div id="modalform" onclick="if(event.target.id == 'modalform')this.classList.add('hidden')" class="z-[100] w-screen h-screen flex justify-center items-center fixed bg-[#5a5a5a3e] top-0 left-0 p-10 pt-[10%] overflow-auto hidden">
                                    <div id="modalformguest" class=" mt-[10%] animate__animated animate__fadeIn w-[90%] w-fit relative bg-[white] p-10 rounded-lg shadow-lg">
                                        
                                    
                                    </div>  
                                </div>
                            <div class="flex justify-end w-full my-4">
                                                <!-- <button onclick="printContent('HEMS CHECKIN VIEW', null, 'noshowview', true)" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div>-->
                                                <!--    <span>print</span> -->
                                                <!--</button>-->
                                                <!-- <button onclick="exportToPDF('tableer')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div> -->
                                                <!--    <span>Export PDF</span> -->
                                                <!--</button>-->
                                                <!-- <button onclick="exportToExcel('noshowview', 'HEMS CHECKIN VIEW')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div>-->
                                                <!--    <span>Export Excel</span> -->
                                                <!--</button> -->
                                            </div>
                                    <div id="noshowview" class="">
                                    <form id="noshowform" class="">
                                        <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                            <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-10">
                                                <!--<div class="form-group">-->
                                                <!--    <label for="logoname" class="control-label required">Search</label>-->
                                                <!--    <input type="text" name="searchtext" id="searchtext" class="form-control comp" placeholder="Enter  guest's first name or last name or other names or passport number or phone or visa number">-->
                                                <!--</div>-->
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">start date</label>
                                                    <input type="date" name="startdate" id="arrivaldaterr" class="form-control">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">end date</label>
                                                    <input type="date" name="enddate" id="arrivaldaterrr" class="form-control">
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-10">
                                                <div class="form-group">
                                                </div>
                                                
                                                
                                                <div class="flex justify-end mt-5">
                                                    <button id="fetchgandres" onclick="fetchcheckinn('', '', 'noshowform', this)" type="button" class="btn">
                                                        <div class="btnloader" style="display: none;"></div>
                                                        <span>Submit</span> 
                                                    </button>
                                                    <!-- <button id="submit" type="button" class="w-full h-[45px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                    <!--    <div class="btnloader" style="display: none;"></div>-->
                                                    <!--    <span>Submit</span> -->
                                                    <!--</button>-->
                                                </div>
                                                
                                            </div> 
                                
                                        </div>
                                    </form>
                                <div class="table-content  lg:max-w-[1000px]">
                                    <table id="tableer">
                                        <thead>
                                            <tr>
                                                 <th style="width: 20px">s/n</th> 
                                                <th>action</th>
                                                <th>Rooms</th>
                                                <th>Initial Deposit</th>
                                                <th>Guest</th>
                                                <th>no.&nbsp;of&nbsp;nights</th>
                                                <th>total&nbsp;rate</th>
                                                <th>reservation&nbsp;type</th>
                                                <th>arrival&nbsp;date</th>
                                                <th>departure&nbsp;date</th>
                                                <th>billing&nbsp;info</th>
                                                <th>payment&nbsp;method</th>
                                                <th>reservation&nbsp;date</th>
                                                <th>reference</th>
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
                            
                            
                                <div id="modalreceipt" onclick="if(event.target.id == 'modalreceipt')this.classList.add('hidden')" class="z-[100] w-screen h-screen fixed bg-[#5a5a5a3e] top-0 left-0 p-10 overflow-auto hidden">
                               
                               
                                </div>
                                
                                
                                <!--<div id="modalpayment" onclick="if(event.target.id == 'modalpayment')this.classList.add('hidden')" class="z-[100] w-screen h-screen fixed bg-[#5a5a5a3e] top-0 left-0 p-10 overflow-auto hidden">-->
                                    
                                <!--        <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">-->
                                <!--    <div class="grid grid-cols-1 !mb-5 lg:grid-cols-1 gap-10">-->
                                <!--        <div class="form-group col-span-3 hidden">-->
                                <!--            <label for="logoname" class="control-label">Reservation Ref</label>-->
                                <!--            <input type="text" name="reference " id="reference" class="form-control">-->
                                <!--        </div>-->
                                <!--        <div class="form-group ">-->
                                <!--            <label for="logoname" class="control-label required">Amount Paid</label>-->
                                <!--            <input type="text" name="amountpaid " id="amountpaid" class="form-control comp">-->
                                <!--        </div>-->
                                <!--         <div class="form-group">-->
                                <!--                <label for="logoname" class="control-label text-md">payment method</label>-->
                                <!--                <select name="paymentmethod" id="paymentmethod" class="bg-white form-control !p-2 comp2">-->
                                <!--                    <option value="">-- SELECT PAYMENT METHOD --</option>-->
                                <!--                    <option>TRANSFER</option>-->
                                <!--                    <option>CASH</option>-->
                                <!--                    <option>POS</option>-->
                                <!--                </select>-->
                                <!--            </div>-->
                                            
                                <!--        <div id="bankdetails"><div class="form-group mt-2">-->
                                <!--                     <label for="logoname" class="control-label">Bank Name</label>-->
                                <!--                    <input type="number" name="bankname" id="bankname" placeholder="Enter bank name" class="form-control [object PointerEvent] bg-white">-->
                                <!--                </div>-->
                                <!--                <div class="form-group mt-2">-->
                                <!--                    <label for="logoname" class="control-label">Other Details</label>-->
                                <!--                    <textarea type="number" name="otherdetails" id="otherdetails" placeholder="Enter account name, transaction reference and other relevant details" class="form-control [object PointerEvent] bg-white"></textarea>-->
                                <!--                </div></div>-->
                                <!--        <div class="flex items-center mb-4">-->
                                <!--            <input id="distribute" name="distribute" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cark:focus:ring-blue-600 cark:ring-offset-gray-800 focus:ring-2 cark:bg-gray-700 cark:border-gray-600">-->
                                <!--            <label for="default-checkbox" class="ms-2 text-sm font-medium text-black">Distribute payment for all rooms</label>-->
                                <!--        </div>-->
                                <!--        <div class="flex justify-end gap-6">-->
                                <!--            <button onclick="did('receipts').click()" type="button" class="m-auto w-full h-[35px] md:w-max text-white text-sm capitalize bg-red-400 p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                <!--                        <div class="btnloader" style="display: none;"></div>-->
                                <!--                        <span>Reset</span> -->
                                <!--                    </button>-->
                                <!--            <button id="submit" type="button" class="w-full h-[45px] md:w-max text-white text-sm capitalize bg-blue-400 px-4 py-1 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                <!--                <div class="btnloader" style="display: none;"></div>-->
                                <!--                <span class="material-symbols-outlined">send</span>-->
                                <!--            </button>-->
                                <!--        </div>-->
                                <!--    </div>-->
                        
                                <!--</div>-->
                               
                                <!--</div>-->
                                
                            <datalist id="allguest"></datalist>
                            <datalist id="allguest2"></datalist>
                            <datalist id="roomlist"></datalist>
                        
                        </section>  