       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>RECEIVEABLES</span>
                            </p>
                            
                             <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                                <!--<li id="rccview" class="me-2 cp viewer" onclick="did('guestsreservationsform').classList.add('hidden');this.children[0].classList.add('active', '!text-blue-600');did('lostandfoundview').classList.remove('hidden');this.nextElementSibling.children[0].classList.remove('active', '!text-blue-600');">-->
                                <!--<li id="iddcheckinform" class="me-2 cp viewer optioner !text-blue-600 active" name="checkinform" onclick="runoptioner(this)">-->
                                <!--    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Check-In</p>-->
                                <!--</li>-->
                                <li id="" class="me-2 cp updater optioner" name="checkinview" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ">View Check-In</p>
                                </li>
                            </ul>
                            
                            <hr class="my-3">
                                    <div id="checkinview" class="">
                            <div class="flex justify-end w-full my-4">
                                                <!-- <button onclick="printContent('HEMS CHECKIN VIEW', null, 'checkinview', true)" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div>-->
                                                <!--    <span>print</span> -->
                                                <!--</button>-->
                                                <!-- <button onclick="exportToPDF('tableer')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div> -->
                                                <!--    <span>Export PDF</span> -->
                                                <!--</button>-->
                                                 <button onclick="exportToExcel('checkinview', 'HEMS CHECKIN VIEW')" type="button" cclass="btn"
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Export Excel</span> 
                                                </button> 
                                                <!-- <button onclick="exportToExcel('checkinview', 'HEMS CHECKIN VIEW')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div>-->
                                                <!--    <span>Export Excel</span> -->
                                                <!--</button> -->
                                            </div>
                                <div class="table-content">
                                    <table id="tableer">
                                        <thead>
                                            <tr>
                                                 <th style="width: 20px">s/n</th>
                                                <th>room&nbsp;number</th>
                                                <th>debit</th>
                                                <th>credit</th>
                                                <th>balance</th>
                                                <th>ACTION</th>
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
                            
                            <div id="modalreceipt" onclick="event.target.id == 'modalreceipt' ? this.classList.add('hidden') : ''" class="hidden fixed w-screen h-screen  top-0 z-[200] left-0 flex justify-center items-center overflow-auto">
                                
                                <div id="invoicecontainer" class="max-w-[90%] mx-auto border rounded shadow p-10 bg-white relative top-[30%]">
                                
                                </div>
                                
                            </div>
                        
                        </section>  