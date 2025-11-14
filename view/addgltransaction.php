       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>INTERNAL TRANSACTION FORM</span>
                            </p>
                            <form id="addgltransactionform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <p class="page-title !mb-3">
                                        <span>Transaction Info</span>
                                    </p>
                                    <div class="grid grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Date</label>
                                            <input type="date" name="transactiondate" id="transactiondate" class="form-control comp" placeholder="Enter Company Name">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Description</label>
                                            <textarea type="text" name="description" id="description" class="form-control comp" placeholder="Enter Description"></textarea>
                                        </div>
                                    </div>
                                    <div id="customertogl">
                                        <p class="page-title !mb-3">
                                            <span>General Ledger section</span>
                                        </p>
                                        <p for="logoname" class="control-label text-[red]">Note: Only GL Accounts are excepted in this section</p>
                                        </div>
                                        <p class="page-title !mb-3 text-sx text-[green]">
                                            <span>Credit</span>
                                        </p>
                                    <div id="creditcontainer_0" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Credit Account</label>
                                            <input type="text" list="glaccountlist" onchange="checkdatalist(this)" name="gltcreditaccount" id="creditaccount_0" class="form-control comp" placeholder="Enter Credit Account">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Amount</label>
                                            <input type="number" name="gltcreditamount" id="creditamount_0" onchange="allcreditamount()" class="form-control comp" placeholder="Enter Amount">
                                        </div>
                                        <div class="form-group flex flex-row cp items-end">
                                            <div title="Add row" onclick="gltaddcreditrow()" onmouseover="this.nextElementSibling.classList.add('!w-[100px]');" onmouseleave="this.nextElementSibling.classList.remove('!w-[100px]');" class="mb-1 material-symbols-outlined rounded-full bg-green-700 h-8 w-8 text-white drop-shadow-md text-xs flex justify-center items-center" style="font-size: 18px;">add</div>
                                            <div class="mb-3 text-xs text-green-600 w-[0px] overflow-hidden trasition-all duration-[0.3s] h-[3]"><p class="px-1 w-[100px]">Click&nbsp;to&nbsp; Add</p></div>
                                        </div>
                                    </div>
                                    <div id="gltcreditcontainer" class="flex flex-col gap-3">
                                    <!--<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">-->
                                    <!--    <div class="form-group">-->
                                    <!--        <label for="logoname" class="control-label">Debit Account</label>-->
                                    <!--        <input type="text" list="glaccountlist"  onchange="checkdatalist(this)" name="companyname" id="companyname" class="form-control" placeholder="Enter Debit Account">-->
                                    <!--    </div>-->
                                    <!--    <div class="form-group">-->
                                    <!--        <label for="logoname" class="control-label">Amount</label>-->
                                    <!--        <input type="number" name="contactperson" id="contactperson" class="form-control" placeholder="Enter Amount">-->
                                    <!--    </div>-->
                                    <!--    <div class="form-group flex flex-row cp items-end">-->
                                    <!--        <div title="Add row" onclick="" onmouseover="this.nextElementSibling.classList.add('!w-[100px]');" onmouseleave="this.nextElementSibling.classList.remove('!w-[100px]');" class="mb-1 material-symbols-outlined rounded-full bg-red-700 h-8 w-8 text-white drop-shadow-md text-xs flex justify-center items-center" style="font-size: 18px;">delete</div>-->
                                    <!--        <div class="mb-3 text-xs text-red-600 w-[0px] overflow-hidden trasition-all duration-[0.3s] h-[3]"><p class="px-1 w-[100px]">Click&nbsp;to&nbsp; Delete</p></div>-->
                                    <!--    </div>-->
                                    <!--</div>-->
                                    </div>
                                        <p class="page-title !my-3 text-sx text-[red]">
                                            <span>Debit</span> 
                                        </p> 
                                    <div id="debitcontainer_0" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Debit Account</label>
                                            <input type="text" list="glaccountlist" onchange="checkdatalist(this)" name="gltdebitaccount" id="debitaccount_0" class="comp form-control" placeholder="Enter Debit Account">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Amount</label>
                                            <input type="number" name="gltdebitamount" id="debitamount_0" onchange="alldebitamount()" class="form-control comp" placeholder="Enter Amount">
                                        </div>
                                        <div class="form-group flex flex-row cp items-end">
                                            <div title="Add row" onclick="gltadddebitrow()" onmouseover="this.nextElementSibling.classList.add('!w-[100px]');" onmouseleave="this.nextElementSibling.classList.remove('!w-[100px]');" class="mb-1 material-symbols-outlined rounded-full bg-green-700 h-8 w-8 text-white drop-shadow-md text-xs flex justify-center items-center" style="font-size: 18px;">add</div>
                                            <div class="mb-3 text-xs text-green-600 w-[0px] overflow-hidden trasition-all duration-[0.3s] h-[3]"><p class="px-1 w-[100px]">Click&nbsp;to&nbsp; Add</p></div>
                                        </div>
                                    </div>
                                    <div id="gltdebitcontainer" class="flex flex-col gap-3">
                                    <!--<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">-->
                                    <!--    <div class="form-group">-->
                                    <!--        <label for="logoname" class="control-label">Debit Account</label>-->
                                    <!--        <input type="text" list="glaccountlist"  onchange="checkdatalist(this)" name="companyname" id="companyname" class="form-control" placeholder="Enter Debit Account">-->
                                    <!--    </div>-->
                                    <!--    <div class="form-group">-->
                                    <!--        <label for="logoname" class="control-label">Amount</label>-->
                                    <!--        <input type="number" name="contactperson" id="contactperson" class="form-control" placeholder="Enter Amount">-->
                                    <!--    </div>-->
                                    <!--    <div class="form-group flex flex-row cp items-end">-->
                                    <!--        <div title="Add row" onclick="" onmouseover="this.nextElementSibling.classList.add('!w-[100px]');" onmouseleave="this.nextElementSibling.classList.remove('!w-[100px]');" class="mb-1 material-symbols-outlined rounded-full bg-red-700 h-8 w-8 text-white drop-shadow-md text-xs flex justify-center items-center" style="font-size: 18px;">delete</div>-->
                                    <!--        <div class="mb-3 text-xs text-red-600 w-[0px] overflow-hidden trasition-all duration-[0.3s] h-[3]"><p class="px-1 w-[100px]">Click&nbsp;to&nbsp; Delete</p></div>-->
                                    <!--    </div>-->
                                    <!--</div>-->
                                    </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Total Credit</label>
                                            <input type="text" name="nationality" readonly id="glttotalcredit" class="form-control" placeholder="Enter Nationality">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Total Debit</label>
                                            <input type="text" name="state" readonly id="glttotaldebit" class="form-control" placeholder="Enter State">
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
                            
                            <datalist id="glaccountlist"></datalist>
                        
                        </section>  