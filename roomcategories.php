       <section class="animate__animated animate__fadeIn">
                            <div class="page-title flex justify-between items-center">
                                <span>MANAGE ROOM CATEGORIES</span>
                                <div class="flex items-center gap-2">
                                    <button id="roomcatTemplateBtn" type="button" class="relative bg-[#3b82f6] text-white text-xs px-3 py-2 rounded-md drop-shadow-md hover:scale-[1.05]">Template</button>
                                    <button id="roomcatImportBtn" type="button" class="relative bg-primary-g text-white text-xs px-3 py-2 rounded-md drop-shadow-md hover:scale-[1.05]">Import Excel</button>
                                    <input type="file" id="roomcatImportInput" accept=".xlsx,.xls,.csv" class="hidden" />
                                </div>
                            </div>
                            <form id="roomcategoriesform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Category Name</label>
                                            <input type="text" name="category" id="category" class="form-control comp" placeholder="Enter Category Name">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Category Type</label>
                                            <select name="categorytype" id="categorytype" class="form-control comp">
                                                <option value=''>-- Select Category Type --</option>
                                                <option>GUEST ROOM</option>
                                                <option>HALL</option>
                                                <option>ROOM</option>
                                                <option>SUITE</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="ratecode" class="control-label">Rate Code</label>
                                            <select name="ratecode" id="ratecode" class="form-control comp">
                                                <option value=''>-- Select Rate Code --</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Currency</label>
                                            <select name="currency" id="currency" class="form-control comp">
                                                <option value=''>-- Select Currency --</option>
                                                <option>NGN</option>
                                                <option>USD</option>
                                                <option>EUR</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Minimum Deposit required</label>
                                            <input type="number" name="minimumrequireddeposit" id="minimumrequireddeposit" class="form-control comp" placeholder="Enter Minimum Deposit">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Price</label>
                                            <input type="number" name="price" id="price" class="form-control comp" placeholder="Enter Price">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Price level 2</label>
                                            <input type="number" name="price_2" id="price_2" class="form-control comp" placeholder="Enter Price level 2">
                                        </div>
                                    </div>
                                    <div class="flex justify-end mt-5">
                                         <button id="submit" type="button" class="btn">
                                            <div class="btnloader" style="display: none;"></div>
                                            <span>Add</span>
                                        </button>
                                        <!-- <button id="submit" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                        <!--    <div class="btnloader" style="display: none;"></div>-->
                                        <!--    <span>Add</span>-->
                                        <!--</button>-->
                                    </div>
                        
                                </div>
                            </form>
                            <hr class="my-10">
                            
                            <div >
                                <div class="table-content">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>s/n</th> 
                                                <th>Category name</th>
                                                <th>rate code</th>
                                                <th>currency</th>
                                                <th>type of category</th>
                                                <th>Minimum deposit</th>
                                                <th>price</th>
                                                <th>price level 2</th>
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

                            <div id="roomcatImportModal" class="hidden fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
                                <div class="bg-white rounded-md shadow-xl w-full max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
                                    <div class="flex justify-between items-center px-4 py-3 border-b">
                                        <h3 class="text-lg font-semibold">Import Room Categories</h3>
                                        <button id="roomcatModalClose" class="material-symbols-outlined text-[#666] hover:text-black">close</button>
                                    </div>
                                    <div class="px-4 py-3 flex items-center gap-3 border-b">
                                        <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
                                            <input type="checkbox" id="roomcatSelectAll" class="accent-[#22c55e]" checked />
                                            <span>Select all</span>
                                        </label>
                                        <span id="roomcatImportCount" class="text-xs text-[#555]">0 rows</span>
                                        <span class="text-xs text-[#f97316]">Review and uncheck any rows you do not want to import.</span>
                                    </div>
                                    <div class="flex-1 overflow-auto">
                                        <table class="w-full text-sm">
                                            <thead class="bg-[#f5f5f6]">
                                                <tr>
                                                    <th class="p-3 text-left w-12">#</th>
                                                    <th class="p-3 text-left">Category</th>
                                                    <th class="p-3 text-left">Type</th>
                                                    <th class="p-3 text-left">Rate Code</th>
                                                    <th class="p-3 text-left">Currency</th>
                                                    <th class="p-3 text-left">Min Deposit</th>
                                                    <th class="p-3 text-left">Price</th>
                                                    <th class="p-3 text-left">Price L2</th>
                                                </tr>
                                            </thead>
                                            <tbody id="roomcatImportTable" class="divide-y"></tbody>
                                        </table>
                                    </div>
                                    <div class="px-4 py-3 border-t flex justify-between items-center">
                                        <div id="roomcatImportStatus" class="text-xs text-[#555]"></div>
                                        <div class="flex gap-2">
                                            <button id="roomcatModalCancel" class="px-3 py-2 rounded-md border text-sm">Cancel</button>
                                            <button id="roomcatModalSubmit" class="px-4 py-2 rounded-md bg-primary-g text-white text-sm drop-shadow-md hover:opacity-90 flex items-center gap-2">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Import Selected</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        
                        </section>  
