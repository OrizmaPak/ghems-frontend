       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>GROUP FOLIO</span>
                            </p>
                            
                             <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                                <!--<li id="rccview" class="me-2 cp viewer" onclick="did('guestsreservationsform').classList.add('hidden');this.children[0].classList.add('active', '!text-blue-600');did('lostandfoundview').classList.remove('hidden');this.nextElementSibling.children[0].classList.remove('active', '!text-blue-600');">-->
                                <!--<li id="iddcheckinform" class="me-2 cp viewer optioner !text-blue-600 active" name="checkinform" onclick="runoptioner(this)">-->
                                <!--    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Check-In</p>-->
                                <!--</li>-->
                                <li id="" class="me-2 cp updater optioner" name="checkinview" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ">View Group Folio</p>
                                </li>
                            </ul>
                            
                            <hr class="my-3">
                                    <div id="checkinview" class="">
                            <form id="receiveablesfilterform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <p class="text-sm text-slate-600">
                                        Select a group to view folio entries and balances.
                                    </p>
                                    <div class="grid grid-cols-1 !mb-5 lg:grid-cols-3 gap-10">
                                        <div id="receivablesRoomFilterWrap" class="form-group lg:col-span-2 hidden">
                                            <label for="receiveablesroomnumber" class="control-label">Room Number</label>
                                            <input type="text" name="roomnumber" id="receiveablesroomnumber" list="hems_roomnumber_id" class="form-control" placeholder="Enter room number">
                                        </div>
                                        <div id="orgFolioOrgFilterWrap" class="form-group lg:col-span-2 hidden">
                                            <label for="receiveablesorgname" class="control-label">Organisation Name</label>
                                            <input type="text" id="receiveablesorgname" list="receiveablesorglist" class="form-control" placeholder="Type and select organisation">
                                            <input type="hidden" id="receiveablesorgid" value="">
                                            <datalist id="receiveablesorglist"></datalist>
                                        </div>
                                        <div id="guestFolioGuestFilterWrap" class="form-group lg:col-span-2">
                                            <label for="receiveablesguestid" class="control-label">Guest Name</label>
                                            <select name="guestid" id="receiveablesguestid" class="form-control">
                                                <option value="">Select guest name</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="receiveablesstartdate" class="control-label">Start Date</label>
                                            <input type="date" id="receiveablesstartdate" class="form-control">
                                        </div>
                                        <div class="form-group">
                                            <label for="receiveablesenddate" class="control-label">End Date</label>
                                            <input type="date" id="receiveablesenddate" class="form-control">
                                        </div>
                                        <div class="flex justify-end items-end gap-3">
                                            <button id="submitreceiveablesfilter" type="button" class="btn">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Submit</span>
                                            </button>
                                            <button id="openReceivablesRoomPicker" type="button" class="btn hidden">
                                                <span>Find</span>
                                            </button>
                                            <button id="resetreceiveablesfilter" type="button" class="btn">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Reset</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 my-4">
                                <li class="me-2 cp">
                                    <button id="guestFolioTabReceivable" type="button" class="inline-block p-3 rounded-t-lg border-b-2 border-blue-500 text-blue-600 font-semibold">View Folio Table</button>
                                </li>
                                <li class="me-2 cp">
                                    <button id="guestFolioTabPrintable" type="button" class="inline-block p-3 rounded-t-lg border-b-2 border-transparent text-gray-500 font-semibold">View Folio Print Table</button>
                                </li>
                            </ul>
                                <div id="guestFolioReceivableTableWrap">
                                    <div class="flex justify-end w-full my-4 gap-2">
                                        <button onclick="printContent('HEMS GUEST FOLIO VIEW TABLE', null, 'guestFolioReceivableTableWrap', true)" type="button" class="btn">
                                            <span>Print</span>
                                        </button>
                                        <button onclick="exportToExcel('tableer', 'HEMS GUEST FOLIO VIEW TABLE')" type="button" class="btn">
                                            <span>Export Excel</span>
                                        </button>
                                    </div>
                                    <div class="table-content">
                                        <table id="tableer">
                                            <thead>
                                                <tr id="receiveables-table-head">
                                                     <th style="width: 20px">s/n</th>
                                                    <th>room&nbsp;number</th>
                                                    <th>debit</th>
                                                    <th>credit</th>
                                                    <th>balance</th>
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

                                <div id="guestFolioPrintTableWrap" class="hidden">
                                    <div class="table-content">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>S/N</th>
                                                    <th>Guest Name</th>
                                                    <th>Total Debit</th>
                                                    <th>Total Credit</th>
                                                    <th>Balance</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody id="guestFolioPrintTableBody">
                                                <tr>
                                                    <td colspan="100%" class="text-center opacity-70">Table is empty</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div> 
                            
                            <div id="modalreceipt" onclick="event.target.id == 'modalreceipt' ? this.classList.add('hidden') : ''" class="hidden fixed w-screen h-screen  top-0 z-[200] left-0 flex justify-center items-center overflow-auto">
                                
                                <div id="invoicecontainer" class="max-w-[90%] mx-auto border rounded shadow p-10 bg-white relative top-[30%]">
                                
                                </div>
                                
                            </div>
                        
                        </section>
