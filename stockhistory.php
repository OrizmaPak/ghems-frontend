       <section class="animate__animated animate__fadeIn relative">
                            <p class="page-title">
                                <span>stock history</span>
                            </p>
                            <form id="stockhistoryform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Sales Point / Department</label>
                                            <select name="salespoint" id="salespointname" class="form-control">
                                                <option value="">Loading...</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Item</label>
                                            <select name="itemid" id="itemid" class="form-control">
                                                <option value="">No item</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Start Date</label>
                                            <input type="date" name="startdate" id="startdate" class="form-control" placeholder="Search by Item Name">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">End Date</label>
                                            <input type="date" name="enddate" id="enddate" class="form-control" placeholder="Search by Item Name">
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
                            
                            
                             <div >
                                <div class="table-content">
                                    <div class="flex items-center justify-end my-4 font-semibold text-xl gap-7">
                                       <span> Balance:</span> <span id="fullbalance">0</span>
                                    </div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th style="width:10px">s/n</th>
                                                <th>item</th>
                                                <th>salespoint</th>
                                                <th>qty in</th>
                                                <th>qty out</th>
                                                <th>transaction date</th>
                                                <th>ref</th>
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
                            
                        
                                </section> 