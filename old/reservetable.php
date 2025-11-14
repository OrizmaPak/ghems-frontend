       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>RESERVE DINING TABLES</span>
                            </p>
                            
                            <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                                <li id="" class="me-2 cp viewer optioner !text-blue-600 active" name="viewreservetable" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ">View Reserved Dining Table</p>
                                </li>
                                <li class="me-2 cp updater  optioner" name="reservetableform" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Reserve Dining Tables</p>
                                </li>
                            </ul>
                        
                                </div>
                            <form id="reservetableform" class="hidden">
                                    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                         <div class="grid grid-cols-1  lg:grid-cols-3 gap-10 p-3 bg-[white] rounded shadow-sm">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">reservation date</label>
                                                    <input type="date" name="reservationdate" id="reservationdate" class="form-control comp !text-black !bg-white" placeholder="Enter Reservation date">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">guest/room</label>
                                                    <input type="text" name="guest" id="guest" class="form-control comp !text-black !bg-white" placeholder="Enter Guest">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">timeline</label>
                                                    <select name="timeline" id="timeline" class="form-control !text-black !bg-white" >
                                                        <option>EVENING</option>
                                                    </select>
                                                </div>
                                                </div>
                                         <div class="grid grid-cols-1  lg:grid-cols-2 gap-10 p-3 bg-[white] rounded shadow-sm">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">Table Number</label>
                                                    <input type="text" name="tablenumber" list="tablenumberlist" id="tablenumber" onchange="checkdatalist(this)?checktablestatus(this):''" class="form-control comp !text-black !bg-white" placeholder="Enter Table Number">
                                                    <datalist id="tablenumberlist"></datalist>
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">Table Status</label>
                                                    <input type="text" name=""  id="tablestatus" class="form-control text-white" readonly placeholder="">
                                                </div>
                                                </div>
                                            <div class="grid grid-cols-1  lg:grid-cols-2 gap-10 p-3 bg-[white] rounded shadow-sm">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">guest detail</label>
                                                    <input type="text" name="guestdetail" id="guestdetail"  list="tablesizelist" class="form-control !text-black !bg-white" placeholder="Enter Guest Details">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">entry date</label>
                                                    <input type="date" name="entrydate" id="entrydate" readonly  list="tablesizelist" class="form-control comp !text-black !bg-white" placeholder="Enter Entry Date">
                                                </div>
                                            </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">message</label>
                                                    <textarea name="messages" id="messages" class="form-control !text-black !bg-white" placeholder="Enter Message"></textarea>
                                                </div>
                                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            
                                            <div></div>
                                            <div></div>
                                            
                                            <div class="flex justify-end mt-5">
                                                 <button id="submit" type="button" class="btn">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Submit</span>
                                                </button>
                                                <!-- <button id="submit" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div>-->
                                                <!--    <span>Submit</span>-->
                                                <!--</button>-->
                                            </div>
                                            
                                        </div> 
                            
                                    </div>
                            </form>
                            
                            <hr class="my-10">
                            
                             <div id="viewreservetable">
                                <div class="table-content">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>s/n</th>
                                                <th>reservation date</th>
                                                <th>Table Number</th>
                                                <th>timeline</th>
                                                <th>guest/room</th>
                                                <th>guest detail</th>
                                                <th>messages</th>
                                                <th>entry date</th>
                                                <th>action</th>
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
                            
                        
                                </section> 