       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>ADD GL ACCOUNT</span>
                            </p>
                            <form id="addglaccountform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 gap-6 mb-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Account Number</label>
                                            <input type="text" name="accountnumber" readonly id="accountnumber" class="form-control" placeholder="Enter Account Number">
                                        </div>
                                        <div id="retrieveglaccountbtn" class="btn">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Retrieve Account</span>
                                            </div>
                                        <!--<div id="retrieveglaccountbtn" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                        <!--        <div class="btnloader" style="display: none;"></div>-->
                                        <!--        <span>Retrieve Account</span>-->
                                        <!--    </div>-->
                                    </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Group Name</label>
                                            <input type="text" name="groupname" id="groupname" class="form-control comp" placeholder="Enter Group Name">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Type Of Account</label>
                                            <select type="text" name="accounttype" id="accounttype" class="form-control comp">
                                                <option value="" disabled="" selected="">--Select&nbsp;Account Type--</option><option value="ASSET">ASSET</option><option value="CASH">CASH</option><option value="CURRENT ASSETS">CURRENT ASSETS</option><option value="EXPENSE">EXPENSE</option><option value="INCOME">INCOME</option><option value="EQUITY RETAINED EARNINGS">EQUITY RETAINED EARNINGS</option><option value="EQUITY DOES NOT CLOSE">EQUITY DOES NOT CLOSE</option><option value="INVENTORY">INVENTORY</option><option value="OTHER ASSET">OTHER ASSET</option><option value="COST OF SALES">COST OF SALES</option><option value="FIXED ASSET">FIXED ASSET</option><option value="OTHER CURRENT ASSET">OTHER CURRENT ASSET</option><option value="ACCOUNTS PAYABLE">ACCOUNTS PAYABLE</option><option value="ACCOUNTS RECEIVABLE">ACCOUNTS RECEIVABLE</option><option value="ACCUMULATED DEPRECIATION">ACCUMULATED DEPRECIATION</option><option value="LIABILITIES">LIABILITIES</option><option value="OTHER CURRENT LIABILITIES">OTHER CURRENT LIABILITIES</option><option value="LONG TERM LIABILITIES">LONG TERM LIABILITIES</option><option value="EQUITY">EQUITY</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">description</label>
                                            <textarea type="text" name="description" id="description" class="form-control comp" placeholder="Enter Description"></textarea>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        
                                        <div></div>
                                        <div></div>
                                        
                                        <div class="flex justify-end mt-5 gap-8">
                                             <button id="deleteglaccountsubmit" type="button" class="hidden w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-red-400 via-red-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Delete</span>
                                            </button>
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
                        
                        </section>  