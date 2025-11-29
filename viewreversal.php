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
                                                <th>ITEM ID</th>
                                                <th>ITEM NAME</th>
                                                <th>QTY</th>
                                                <th>ISSUE</th>
                                                <th>REF</th>
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
                                                <th>ITEM ID</th>
                                                <th>ITEM NAME</th>
                                                <th>QTY</th>
                                                <th>ISSUE</th>
                                                <th>REF</th>
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
                        
                        <div id="viewreversalmodal" onclick="if(event.target.id === 'viewreversalmodal') this.classList.add('hidden')" class="hidden w-full h-full bg-[#0000004a] fixed top-0 left-0 overflow-y-auto flex justify-center items-start z-50">
                            <div class="w-full max-w-3xl mx-4 mt-10 bg-white p-4 sm:p-6 rounded-md shadow-lg relative">
                                <div class="w-full pb-3 flex justify-between items-center border-b">
                                    <p class="text-lg font-semibold">Reversed Sale Details</p>
                                    <button onclick="document.getElementById('viewreversalmodal').classList.add('hidden')" class="material-symbols-outlined text-gray-500 hover:text-gray-800" style="font-size: 22px;">close</button>
                                </div>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm">
                                    <div><span class="font-semibold">Item Name:</span> <span id="vr-itemname"></span></div>
                                    <div><span class="font-semibold">Item ID:</span> <span id="vr-itemid"></span></div>
                                    <div><span class="font-semibold">Quantity:</span> <span id="vr-qty"></span></div>
                                    <div><span class="font-semibold">Issue/Category:</span> <span id="vr-issue"></span></div>
                                    <div><span class="font-semibold">Reference:</span> <span id="vr-reference"></span></div>
                                    <div><span class="font-semibold">Sales Point:</span> <span id="vr-salespoint"></span></div>
                                    <div><span class="font-semibold">Transaction Date:</span> <span id="vr-date"></span></div>
                                    <div><span class="font-semibold">Payment Method:</span> <span id="vr-paymentmethod"></span></div>
                                    <div><span class="font-semibold">Amount Paid:</span> <span id="vr-amountpaid"></span></div>
                                    <div><span class="font-semibold">Total Amount:</span> <span id="vr-totalamount"></span></div>
                                    <div><span class="font-semibold">Owner:</span> <span id="vr-owner"></span></div>
                                    <div><span class="font-semibold">Location:</span> <span id="vr-location"></span></div>
                                    <div><span class="font-semibold">Entry Point:</span> <span id="vr-entrypoint"></span></div>
                                    <div><span class="font-semibold">Status:</span> <span id="vr-status"></span></div>
                                    <div class="sm:col-span-2"><span class="font-semibold">Description:</span> <span id="vr-description"></span></div>
                                    <div class="sm:col-span-2"><span class="font-semibold">Bank/Other Details:</span> <span id="vr-bankdetails"></span></div>
                                    <div class="sm:col-span-2"><span class="font-semibold">Log:</span> <span id="vr-tlog"></span></div>
                                </div>
                            </div>
                        </div>
                        
                                </section> 
