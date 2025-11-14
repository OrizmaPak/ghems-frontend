       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>DINING TABLES</span>
                            </p>
                            
                            <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                                <li id="" class="me-2 cp viewer optioner !text-blue-600 active" name="viewdiningtable" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ">Dining Tables</p>
                                </li>
                                <!--<li class="me-2 cp updater  optioner" name="diningtableform" onclick="runoptioner(this)">-->
                                <!--    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Manage Dining Tables</p>-->
                                <!--</li>-->
                            </ul>
                        
                                </div>
                            <form id="diningtableform" class="">
                                    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                         <div class="grid grid-cols-1  lg:grid-cols-3 gap-10 p-3 bg-[#3b82f6] text-white rounded shadow-sm">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">Table type</label>
                                                    <input type="text" name="tabletype" id="tabletype" list="tabletypelist" onchange="checkdatalist(this)" class="form-control comp !text-black !bg-white" placeholder="Enter Table Type">
                                                    <datalist id="tabletypelist">
                                                        <option>REGULAR</option>
                                                        <option>WINDOW-SIDE</option>
                                                        <option>OUTDOOR</option>
                                                    </datalist>
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">table size</label>
                                                    <input type="text" name="tablesize" id="tablesize"  list="tablesizelist" onchange="checkdatalist(this)" class="form-control comp !text-black !bg-white" placeholder="Enter Table Size">
                                                    <datalist id="tablesizelist">
                                                        <option>FOR TWO</option>
                                                        <option>FOR FOUR</option>
                                                        <option>FOR SIX</option>
                                                        <option>FOR EIGHT</option>
                                                    </datalist>
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">table number</label>
                                                    <input type="text" name="tablenumber" id="tablenumber" class="form-control comp !text-black !bg-white" placeholder="Enter Table Number">
                                                </div>
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
                            
                             <div id="viewdiningtable">
                                <div class="table-content">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>s/n</th>
                                                <th>TABLE TYPE</th>
                                                <th>TABLE SIZE</th>
                                                <th>TABLE NUMBER</th>
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