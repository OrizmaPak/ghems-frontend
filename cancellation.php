       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>Cancellation</span>
                            </p>
                
                            
                            <div id="" class="screen ">
                                
                                <form id="cancellationform" class="">
                                    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                        <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">Search</label>
                                                <input type="text"  name="searchtext" id="searchtext" class="form-control" placeholder="Enter  guest's first name or last name or other names or passport number or phone or visa number">
                                            </div>
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">arrival date</label>
                                                <input type="date" name="arrivaldate" id="arrivaldate" class="form-control">
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-10">
                                            <div class="form-group">
                                            </div>
                                            
                                            
                                            <div class="flex justify-end mt-5">
                                                 <button id="submit" type="button" class="btn">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Search</span> 
                                                </button>
                                                <!-- <button id="submit" type="button" class="w-full h-[45px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div>-->
                                                <!--    <span>Search</span> -->
                                                <!--</button>-->
                                            </div>
                                            
                                        </div> 
                            
                                    </div>
                                </form>
                                <div class="table-content">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th style="width: 20px">s/n</th>
                                                <th>Guest&nbsp;full&nbsp;name</th>
                                                <th>nationality</th>
                                                <th>no.&nbsp;of&nbsp;nights</th>
                                                <th>room&nbsp;category</th>
                                                <th>arrival&nbsp;date</th>
                                                <th>departure&nbsp;date</th>
                                                <th>reservation&nbsp;date</th>
                                                <th>status</th>
                                                <th>action</th>
                                            </tr>
                                        </thead>
                                        <tbody id="tabledata2">
                                            <tr>
                                                <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="table-status"></div>                                
                            </div>
                        
                        </section>  
                        
                        
                        
                        
                        