       <section class="animate__animated animate__fadeIn relative">
                            <p class="page-title">
                                <span>VIEW PURCHASE ORDER</span>
                            </p>
                            <form id="viewpurchaseorderform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
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
                                    <table>
                                        <thead>
                                            <tr>
                                                <th style="width:10px">s/n</th>
                                                <th>TRANSACTION<br/>DATE</th>
                                                <th>reference</th>
                                                <th>items<br/>No.</th>
                                                <th>ITEM&nbsp;NAME&nbsp;|&nbsp;[COST]&nbsp;|&nbsp;[QUANTITY]</th>
                                                <th>GRAND<br/>TOTAL</th>
                                                <th>SUPPLIER</th>
                                                <th>TRANSACTION<br/>TIME</th>
                                                <th>LOCATION</th>
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
                            
                            <div id="viewpurchaseordermodal" onclick="if(event.target.id === 'viewpurchaseordermodal')this.classList.add('hidden')" class="hidden w-full h-full bg-[#0000004a] fixed top-0 left-0 overflow-y-auto flex justify-center items-start">
                                <div class="w-fit max-w-[90%] mt-8 min-w-[500px] h-fit min-h-[400px] bg-white p-2 rounded-md shadow-lg">
                                    
                                    <div class="w-full py-2 flex justify-between">
                                        <p id="modaltitle" class="text-md font-bold">ITEMS VIEW FOR PURCHASE ORDER</p>
                                        <span onclick="document.getElementById('viewpurchaseordermodal').classList.add('hidden')" class="cp material-symbols-outlined group-hover:text-primary-g"
                                           style="font-size: 20px;">close</span>
                                    </div>
                                    
                                    <hr class="mb-4"/>
                                    
                                    <p class="!text-sm font-thin">Supplier: <span id="vposupplier" class="uppercase !text-sm font-semibold" style=""></span></p>
                                    <p class="!text-sm font-thin">Transaction Time: <span class="!text-sm font-semibold" id="vpotime" style="">  </span></p>
                                    <p class="!text-sm font-thin">Transaction Date: <span class="!text-sm font-semibold" id="vpodate" style=""> </span> </p>
                                    <p class="!text-sm font-thin">Location: <span id="vpolocation" class="uppercase !text-sm font-semibold" style=""></span></p>
                                    <p class="!text-sm font-thin" style="marginLeft: 20px;">Description: <span id="vpodesc" class="font-semibold" style=""></span> </p>
                                    <p class="!text-sm font-thin">Order Number: <span id="vporef" class="uppercase !text-sm font-semibold" style=""></span></p>
                                    
                                    
                                       <div class="table-content my-4">
                                            <table>
                                                <thead>
                                                    <tr>
                                                       <th>s/n </th>
                                                        <th> Item ID </th>
                                                        <th> Item Name </th>
                                                        <th> Quantity </th>
                                                        <th> Cost </th>
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