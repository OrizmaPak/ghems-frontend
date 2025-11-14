       <section class="animate__animated animate__fadeIn relative">
                            <p class="page-title">
                                <span>Booking Plan</span>
                            </p>
                            <form id="bookplanform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">plan code</label>
                                            <input type="text" maxlength="2" name="plancode" id="plancode" class="form-control comp" placeholder="Enter plan code ">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">plan name</label>
                                            <input type="text" name="planname" id="planname" class="form-control comp" placeholder="Enter plan name">
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">adult amount</label>
                                            <input type="number" name="adultamount" id="adultamount" class="form-control comp" placeholder="Enter adult amount ">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">child amount</label>
                                            <input type="number" name="childamount" id="childamount" class="form-control comp" placeholder="Enter child amount">
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
                                    <!--<p class="text-md font-semibold">Balance Brought Forward(B/F): <span id="bbf"></span></p>-->
                                    <table>
                                        <thead>
                                            <tr>
                                                <th style="width:10px">s/n</th>
                                                <th>plan code</th>
                                                <th>plan name</th>
                                                <th>adult amount</th>
                                                <th>child amount</th>
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