       <section class="animate__animated animate__fadeIn relative">
                            <p class="page-title">
                                    <span>VIEW GL ACCOUNTS</span>
                            </p>
                            <form id="viewglaccountform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Search by Account Type</label>
                                            <input type="input" oninput="this.value = this.value.toUpperCase()" name="accounttype" id="accounttype" list="viewglaccounttypelist" class="form-control" placeholder="Search by Account Type">
                                        </div>
                                        <div></div>
                                        <div class="flex justify-end mt-5 gap-5">
                                             <button id="" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Print</span>
                                            </button>
                                             <button id="" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Export&nbsp;to&nbsp;Excel</span>
                                            </button>
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
                                                <th>Account&nbsp;Number</th>
                                                <th>Description</th>
                                                <th>Account type</th>
                                                <th>Group name</th>
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
                            <datalist id="viewglaccounttypelist">
                                    <option value="" disabled selected>--Select&nbsp;Account Type--</option>
                                    <option value="ASSET">ASSET</option>
                                    <option value="CASH">CASH</option>
                                    <option value="CURRENT ASSETS">CURRENT ASSETS</option>
                                    <option value="EXPENSE">EXPENSE</option>
                                    <option value="INCOME">INCOME</option>
                                    <option value="EQUITY RETAINED EARNINGS">EQUITY RETAINED EARNINGS</option>
                                    <option value="EQUITY DOES NOT CLOSE">EQUITY DOES NOT CLOSE</option>
                                    <option value="INVENTORY">INVENTORY</option>
                                    <option value="OTHER ASSET">OTHER ASSET</option>
                                    <option value="COST OF SALES">COST OF SALES</option>
                                    <option value="FIXED ASSET">FIXED ASSET</option>
                                    <option value="OTHER CURRENT ASSET">OTHER CURRENT ASSET</option>
                                    <option value="ACCOUNTS PAYABLE">ACCOUNTS PAYABLE</option>
                                    <option value="ACCOUNTS RECEIVABLE">ACCOUNTS RECEIVABLE</option>
                                    <option value="ACCUMULATED DEPRECIATION">ACCUMULATED DEPRECIATION</option>
                                    <option value="LIABILITIES">LIABILITIES</option>
                                    <option value="OTHER CURRENT LIABILITIES">OTHER CURRENT LIABILITIES</option>
                                    <option value="LONG TERM LIABILITIES">LONG TERM LIABILITIES</option>
                                    <option value="EQUITY">EQUITY</option>
                            </datalist>
                                </section> 