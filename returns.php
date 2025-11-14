       <section class="animate__animated animate__fadeIn">
                            <p class="page-title"> 
                                <span>returns</span>
                            </p>
                            <div id="returnsform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-5">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Store / Salespoint</label>
                                            <select name="salespoint" id="salespointname" class="form-control comp !text-black !bg-white">
                                                    <option>Loading...</option>
                                                </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label"> Entry Date</label>
                                            <input type="date" name="entrydate" id="entrydate" class="form-control comp" placeholder="Enter Address">
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-5">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Supplier</label>
                                            <select name="supplier" id="supplier" class="form-control comp !text-black !bg-white">
                                                    <option>Loading...</option>
                                                </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label"> Invoice Number</label>
                                            <input type="text" name="intakeinvoicenumber" id="intakeinvoicenumber" class="form-control comp" placeholder="Enter Invoice Number">
                                        </div>
                                    </div>
                                    <!--<hr class="my-10">-->
                            
                             <div >
                                <div class="table-content mt-5">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th style="width:300px">Item</th>
                                                <th style="width:150px">Item Info</th>
                                                <th style="width:100px">quantity</th>
                                                <th style="width:250px">type of issue</th>
                                                <th><p class="flex gap-1 cp justify-center hover:border border-white transition-all items-center p-1 px-2 rounded bg-[#14ad16]" onclick="reqaddrowreturns()"><button title="Edit row entry" class="material-symbols-outlined rounded-full bg-white h-8 w-8 text-[green] font-bold drop-shadow-md text-xs" style="font-size: 18px;">add</button>&nbsp;Add&nbsp;Item</p></th>
                                            </tr>
                                        </thead>
                                        <tbody id="tabledata" class="">
                                            <tr><td>Loading...</td></tr>
                                           <!--<tr id="reqrow_0">-->
                                           <!--     <td class="text-center opacity-70"> -->
                                           <!--     <label class="hidden">Item</label>-->
                                           <!--         <select name="supplyfrom" id="supplyfrom_0" class="form-control comp">-->
                                           <!--             <option value=''>-- Select item --</option>-->
                                           <!--         </select>-->
                                           <!--     </td>-->
                                           <!--     <td>-->
                                           <!--         <p>Type: <span id="type_0"></span></p>-->
                                           <!--         <p>Group: <span id="group_0"></span></p>-->
                                           <!--         <p>Stock Balance: <span id="class_0"></span></p>-->
                                           <!--     </td>-->
                                           <!--     <td>-->
                                           <!--         <label class="hidden">Cost</label>-->
                                           <!--         <input onchange="returnscal2(this)" type="number" id="cost_0" name="cost" class="form-control comp" placeholder="Enter Cost">-->
                                           <!--     </td>-->
                                           <!--     <td>-->
                                           <!--         <label class="hidden">Quantity</label>-->
                                           <!--         <input onchange="returnscal2(this)" type="number" id="qty_0" name="qty" class="form-control comp" placeholder="Qty">-->
                                           <!--     </td>-->
                                           <!--     <td>-->
                                           <!--         <label class="hidden">Value</label>-->
                                           <!--         <input readonly type="text" id="val_0" name="value[]" class="form-control comp" placeholder="">-->
                                           <!--     </td>-->
                                           <!--     <td>-->
                                           <!--         <div class="flex gap-4 items-center h-full w-fit py-3">-->
                                           <!--             <button onclick="reqaddrowreturns()" title="Edit row entry" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">add</button>-->
                                                        <!--<button onclick="reqaddrow()" title="Edit row entry" class="material-symbols-outlined rounded-full bg-[red] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>-->
                                           <!--         </div>-->
                                           <!--     </td>-->
                                           <!-- </tr>-->
                                        </tbody>
                                    </table>
                                </div>
                                <div class="table-status"></div>
                            </div>
                            <div class=" flex justify-end gap-2">
                                     <!--<p class="font-normal">Total Order:</p><p class="font-semibold" id="rptotalorder">Nill</p>-->
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
                            </div>
                            <datalist id="supplierlist2">
                                
                            </datalist>
                        
                        </section>  