       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>view daily assignment sheet</span>
                            </p>
                            <form id="viewdailyassignmentsheetform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 !mb-5 lg:grid-cols-4 gap-6">
                                         <div class="form-group">
                                            <label for="logoname" class="control-label">shift</label>
                                            <select name="shift" id="shift" class="form-control">
                                                <option>DAY SHIFT</option>
                                                <option>NIGHT SHIFT</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">staff</label>
                                            <input type="text" list="hems_userlist_id" onchange="checkdatalist(this)" name="staff" id="staff" class="form-control" readonly value="">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Timein -from</label>
                                            <input type="date" name="startdate" id="startdate" class="form-control" placeholder="Enter Room Number">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Timein-to</label>
                                            <input type="date" name="enddate" id="enddate" class="form-control">
                                        </div>
                                    </div>
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
                            </form>
                            <hr class="my-3">
                            <div >
                                <div class="table-content">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>s/n</th>
                                                <th>guest name</th>
                                                <th>no of persons</th>
                                                <th>room number</th>
                                                <th>arrival date</th>
                                                <th>departure date</th>
                                                <th>time in</th>
                                                <th>time out</th>
                                                <th>Items</th>
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
                            
                            <div id="viewdailyassignmentsheetmodal" onclick="if(event.target.id === 'viewdailyassignmentsheetmodal')this.classList.add('hidden')" class="hidden w-full h-full bg-[#0000004a] fixed top-0 left-0 overflow-y-auto flex justify-center items-start">
                                <div class="w-fit max-w-[90%] mt-8 min-w-[500px] h-fit min-h-[400px] bg-white p-2 rounded-md shadow-lg">
                                    
                                    <div class="w-full py-2 flex justify-between">
                                        <p id="modaltitle" class="text-md font-bold">DETAILS VIEW FOR DAILY ASSIGNMENT SHEET</p>
                                        <span onclick="document.getElementById('viewdailyassignmentsheetmodal').classList.add('hidden')" class="cp material-symbols-outlined group-hover:text-primary-g"
                                           style="font-size: 20px;">close</span>
                                    </div>
                                    
                                    <hr class="mb-4"/>
                                    
                                    <p class="!text-sm font-thin capitalize flex"><span class="w-[180px]">arrival date: </span><span id="vasarrivaldate" class="uppercase !text-sm font-semibold" style=""></span></p>
                                    <hr class="opacity-[0.3]"/>
                                    <p class="!text-sm font-thin capitalize flex"><span class="w-[180px]">departure date: </span><span class="!text-sm font-semibold" id="vasdeparturedate" style="">  </span></p>
                                    <hr class="opacity-[0.3]"/>
                                    <p class="!text-sm font-thin capitalize flex"><span class="w-[180px]">guest name: </span><span class="!text-sm font-semibold" id="vasguestname" style=""> </span> </p>
                                    <hr class="opacity-[0.3]"/>
                                    <p class="!text-sm font-thin capitalize flex"><span class="w-[180px]">lost and found items: </span><span id="vaslostandfounditems" class="uppercase !text-sm font-semibold" style=""></span></p>
                                    <hr class="opacity-[0.3]"/>
                                    <p class="!text-sm font-thin capitalize flex"><span class="w-[180px]">no of persons: </span><span id="vasnoofpersons" class="uppercase !text-sm font-semibold" style=""></span></p>
                                    <hr class="opacity-[0.3]"/>
                                    <p class="!text-sm font-thin capitalize flex"><span class="w-[180px]">requestsr: </span><span id="vasrequests" class="uppercase !text-sm font-semibold" style=""></span></p>
                                    <hr class="opacity-[0.3]"/>
                                    <p class="!text-sm font-thin capitalize flex"><span class="w-[180px]">room number: </span><span id="vasroomnumber" class="uppercase !text-sm font-semibold" style=""></span></p>
                                    <hr class="opacity-[0.3]"/>
                                    <p class="!text-sm font-thin capitalize flex"><span class="w-[180px]">shift: </span><span id="vasshift" class="uppercase !text-sm font-semibold" style=""></span></p>
                                    <hr class="opacity-[0.3]"/>
                                    <p class="!text-sm font-thin capitalize flex"><span class="w-[180px]">status after service: </span><span id="vasstatusafterservice" class="uppercase !text-sm font-semibold" style=""></span></p>
                                    <hr class="opacity-[0.3]"/>
                                    <p class="!text-sm font-thin capitalize flex"><span class="w-[180px]">status before service: </span><span id="vasstatusbeforeservice" class="uppercase !text-sm font-semibold" style=""></span></p>
                                    <hr class="opacity-[0.3]"/>
                                    <p class="!text-sm font-thin capitalize flex"><span class="w-[180px]">time in: </span><span id="vastimein" class="uppercase !text-sm font-semibold" style=""></span></p>
                                    <hr class="opacity-[0.3]"/>
                                    <p class="!text-sm font-thin capitalize flex"><span class="w-[180px]">time out: </span><span id="vastimeout" class="uppercase !text-sm font-semibold" style=""></span></p>
                                    <hr class="opacity-[0.3]"/>
                                    <!--<p class="!text-sm font-thin capitalize" style="marginLeft: 20px;">Description: <span id="vpodesc" class="font-semibold" style=""></span> </p>-->
                                    
                                    
                                       <div class="table-content my-4">
                                            <table>
                                                <thead>
                                                    <tr>
                                                       <th>s/n </th>
                                                        <th> Item ID </th>
                                                        <th> Item Name </th>
                                                        <th> Quantity </th>
                                                    </tr>
                                                </thead>
                                                <tbody id="tabledata22">
                                                   <tr>
                                                        <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                </div>
                                
                            </div>
                        
                        </section>  