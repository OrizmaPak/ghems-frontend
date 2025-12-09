       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>ADD GL ACCOUNT</span>
                            </p>
                            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                                <div class="text-xs text-[orange]">Download the template, fill in GL account rows, then import to review before sending.</div>
                                <div class="flex items-center gap-2">
                                    <button id="glAccountTemplateBtn" type="button" class="relative bg-[#3b82f6] text-white text-xs px-3 py-2 rounded-md drop-shadow-md hover:scale-[1.05]">Template</button>
                                    <button id="glAccountImportBtn" type="button" class="relative bg-primary-g text-white text-xs px-3 py-2 rounded-md drop-shadow-md hover:scale-[1.05]">Import Excel</button>
                                    <input type="file" id="glAccountImportInput" accept=".xlsx,.xls,.csv" class="hidden" />
                                </div>
                            </div>
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
                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Group Name</label>
                                            <input type="text" name="groupname" id="groupname" class="form-control comp" placeholder="Enter Group Name">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Subgroup</label>
                                            <input type="text" name="subgroup" id="subgroup" class="form-control comp" placeholder="Enter Subgroup">
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

                            <div id="glAccountImportModal" class="hidden fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
                                <div class="bg-white rounded-md shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                                    <div class="flex justify-between items-center px-4 py-3 border-b">
                                        <h3 class="text-lg font-semibold">Import GL Accounts</h3>
                                        <button id="glAccountModalClose" class="material-symbols-outlined text-[#666] hover:text-black">close</button>
                                    </div>
                                    <div class="px-4 py-3 flex items-center gap-3 border-b">
                                        <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
                                            <input type="checkbox" id="glAccountSelectAll" class="accent-[#22c55e]" checked />
                                            <span>Select all</span>
                                        </label>
                                        <span id="glAccountImportCount" class="text-xs text-[#555]">0 rows</span>
                                        <span class="text-xs text-[#f97316]">Uncheck any rows you do not want to send.</span>
                                    </div>
                                    <div class="flex-1 overflow-auto">
                                        <table class="w-full text-sm">
                                            <thead class="bg-[#f5f5f6]">
                                                <tr>
                                                    <th class="p-3 text-left w-12">#</th>
                                                    <th class="p-3 text-left">Group Name</th>
                                                    <th class="p-3 text-left">Subgroup</th>
                                                    <th class="p-3 text-left">Account Type</th>
                                                    <th class="p-3 text-left">Description</th>
                                                </tr>
                                            </thead>
                                            <tbody id="glAccountImportTable" class="divide-y"></tbody>
                                        </table>
                                    </div>
                                    <div class="px-4 py-3 border-t flex justify-between items-center">
                                        <div id="glAccountImportStatus" class="text-xs text-[#555]"></div>
                                        <div class="flex gap-2">
                                            <button id="glAccountModalCancel" class="px-3 py-2 rounded-md border text-sm">Cancel</button>
                                            <button id="glAccountModalSubmit" class="px-4 py-2 rounded-md bg-primary-g text-white text-sm drop-shadow-md hover:opacity-90 flex items-center gap-2">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Send Selected</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>