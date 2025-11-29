       <section class="animate__animated animate__fadeIn relative">
                            <p class="page-title">
                                <span>VIEW reversals</span>
                            </p>
                              <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                                <!--<li id="rccview" class="me-2 cp viewer" onclick="did('guestsreservationsform').classList.add('hidden');this.children[0].classList.add('active', '!text-blue-600');did('lostandfoundview').classList.remove('hidden');this.nextElementSibling.children[0].classList.remove('active', '!text-blue-600');">-->
                                
                                <li id="iddformform" class="me-2 cp updater optioner !text-blue-600 active" name="viewreversesales" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">View Reversed Sales</p>
                                </li>
                                <li id="iddformform" class="me-2 cp updater optioner" name="viewreversereceipt" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">View Reversed Receipt</p>
                                </li>
                            </ul>
                            <hr class="my-10">
                            
                            
                             <div id="viewreversesales">
                            <form id="viewreversesalesform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Start Date</label>
                                            <input type="date" name="startdate" id="startdate" class="form-control" placeholder="Search by Item Name">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">End Date</label>
                                            <input type="date" name="enddate" id="enddate" class="form-control" placeholder="Search by Item Name">
                                        </div>
                                        <!--<div class="flex justify-end mt-5">-->
                                             <button id="submit" type="button" class="btn">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Submit</span>
                                            </button>
                                    </div>
                                        
                                </div> 
                        
                            </form>
                                <div class="table-content">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th style="width:10px">s/n</th>
                                                <th>SALES POINT</th>
                                                <th>items<br/>No.</th>
                                                <th class="relative top-2 flex justify-between"><p>ITEM&nbsp;NAME</p><p class="flex justify-end gap-5">QTY&nbsp;&nbsp;&nbsp;&nbsp;ISSUE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p></th>
                                                <th>ref</th>
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
                             <div id="viewreversereceipt" class="hidden">
                            <form id="viewreversereceiptform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Start Date</label>
                                            <input type="date" name="startdate" id="startdate" class="form-control" placeholder="Search by Item Name">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">End Date</label>
                                            <input type="date" name="enddate" id="enddate" class="form-control" placeholder="Search by Item Name">
                                        </div>
                                        <!--<div class="flex justify-end mt-5">-->
                                             <button id="submit" type="button" class="btn">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Submit</span>
                                            </button>
                                    </div>
                                        
                                </div> 
                        
                            </form>
                                <div class="table-content">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th style="width:10px">s/n</th>
                                                <th>SALES POINT</th>
                                                <th>items<br/>No.</th>
                                                <th class="relative top-2 flex justify-between"><p>ITEM&nbsp;NAME</p><p class="flex justify-end gap-5">QTY&nbsp;&nbsp;&nbsp;&nbsp;ISSUE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p></th>
                                                <th>ref</th>
                                                <th>ACTION</th>
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
                            
                            
                            
                            <!--<div id="viewreturnsmodal" onclick="if(event.target.id === 'viewreturnsmodal')this.classList.add('hidden')" class="hidden w-full h-full bg-[#0000004a] fixed top-0 left-0 overflow-y-auto flex justify-center items-start">-->
                            <!--    <div class="w-fit max-w-[90%] mt-8 min-w-[500px] h-fit min-h-[400px] bg-white p-2 rounded-md shadow-lg">-->
                                    
                            <!--        <div class="w-full py-2 flex justify-between">-->
                            <!--            <p id="modaltitle" class="text-md font-bold">ITEMS VIEW FOR PURCHASE ORDER</p>-->
                            <!--            <span onclick="document.getElementById('viewreturnsmodal').classList.add('hidden')" class="cp material-symbols-outlined group-hover:text-primary-g"-->
                            <!--               style="font-size: 20px;">close</span>-->
                            <!--        </div>-->
                                    
                            <!--        <hr class="mb-4"/>-->
                                    
                            <!--         <p class="!text-sm font-thin">Store / Sales Point: <span id="vpssupplier" class="uppercase !text-sm font-semibold" style=""></span></p>-->
                                    <!--<p class="!text-sm font-thin">Transaction Time: <span class="!text-sm font-semibold" id="vpstime" style="">  </span></p>-->
                            <!--        <p class="!text-sm font-thin">Entry Date: <span class="!text-sm font-semibold" id="vpsdate" style=""> </span> </p>-->
                                    <!--<p class="!text-sm font-thin">Location: <span id="vpslocation" class="uppercase !text-sm font-semibold" style=""></span></p>-->
                                    <!--<p class="!text-sm font-thin" style="marginLeft: 20px;">Type of Issue: <span id="vpsdesc" class="font-semibold" style=""></span> </p>-->
                            <!--        <p class="!text-sm font-thin">Ref Number: <span id="vpsref" class="uppercase !text-sm font-semibold" style=""></span></p>-->
                                    
                                    
                            <!--           <div class="table-content my-4">-->
                            <!--                <table>-->
                            <!--                    <thead>-->
                            <!--                        <tr>-->
                            <!--                           <th>s/n </th>-->
                            <!--                            <th> Item ID </th>-->
                            <!--                            <th> Item Name </th>-->
                            <!--                            <th> Quantity </th>-->
                            <!--                            <th> type of issue </th>-->
                            <!--                        </tr>-->
                            <!--                    </thead>-->
                            <!--                    <tbody id="tabledata2">-->
                            <!--                       <tr>-->
                            <!--                            <td colspan="100%" class="text-center opacity-70"> Table is empty</td>-->
                            <!--                        </tr>-->
                            <!--                    </tbody>-->
                            <!--                </table>-->
                            <!--            </div>-->
                            <!--    </div>-->
                                
                            <!--</div>-->
                        
                                </section> 
