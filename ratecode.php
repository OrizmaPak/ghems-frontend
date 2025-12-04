       <section class="animate__animated animate__fadeIn relative">
                            <div class="page-title flex justify-between items-center">
                                <span>rate code</span>
                                <div class="flex items-center gap-2">
                                    <button id="ratecodeTemplateBtn" type="button" class="relative bg-[#3b82f6] text-white text-xs px-3 py-2 rounded-md drop-shadow-md hover:scale-[1.05]">Template</button>
                                    <button id="ratecodeImportBtn" type="button" class="relative bg-primary-g text-white text-xs px-3 py-2 rounded-md drop-shadow-md hover:scale-[1.05]">Import Excel</button>
                                    <input type="file" id="ratecodeImportInput" accept=".xlsx,.xls,.csv" class="hidden" />
                                </div>
                            </div>
                            
                             <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                                <!--<li id="rccview" class="me-2 cp viewer" onclick="did('guestsreservationsform').classList.add('hidden');this.children[0].classList.add('active', '!text-blue-600');did('lostandfoundview').classList.remove('hidden');this.nextElementSibling.children[0].classList.remove('active', '!text-blue-600');">-->
                                <li class="me-2 cp updater optioner !text-blue-600 active" name="ratecodeform" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Rate Code</p>
                                </li>
                                <li id="" class="me-2 cp viewer optioner" name="ratecodeview" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ">View Rate Code</p>
                                </li>
                            </ul>
                            
                            <form id="ratecodeform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">ratecode</label>
                                            <input type="text" name="ratecode" id="ratecode" class="form-control comp" placeholder="Enter ratecode">
                                        </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">adult one</label>
                                            <input type="number" name="adult1" id="adult1" class="form-control comp" placeholder="Enter adult one">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">adult two</label>
                                            <input type="number" name="adult2" id="adult2" class="form-control " placeholder="Enter adult two">
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">adult three</label>
                                            <input type="number" name="adult3" id="adult3" class="form-control " placeholder="Enter adult three">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">adult four</label>
                                            <input type="number" name="adult4" id="adult4" class="form-control " placeholder="Enter adult four">
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">extadult</label>
                                            <input type="number" name="extadult" id="extadult" class="form-control " placeholder="Enter extadult">
                                        </div>
                                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">extra child</label>
                                                <input type="number" name="extchild" id="extchild" class="form-control " placeholder="Enter extra child">
                                            </div>
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">plan</label>
                                                <!--<input type="number" name="plan" id="plan" class="form-control " placeholder="Enter plan">-->
                                                <select name="plan" id="plan"  class="form-control comp">
                                                    <option value="">-- Select Plan --</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">child two</label>
                                            <input type="number" name="aditchild" id="aditchild" class="form-control " placeholder="Enter aditchild">
                                        </div>
                                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">Adult plan</label>
                                                <input readonly="readonly" type="number" name="adultplan" id="adultplan" class="form-control " placeholder="Enter child plan">
                                            </div>
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">child plan</label>
                                                <input readonly="readonly" type="number" name="childplan" id="childplan" class="form-control " placeholder="Enter child plan">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">currency</label>
                                            <select name="currency" id="currency" class="form-control comp">
                                                <option value="">-- Select currency --</option>
                                                <option>NGN</option>
                                                <option>USD</option>
                                                <option>POUNDS</option>
                                                <option>EUR</option>
                                            </select>
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
                            
                            
                             <div id="ratecodeview" class="hidden">
                                <div class="table-content">
                                    <!--<p class="text-md font-semibold">Balance Brought Forward(B/F): <span id="bbf"></span></p>-->
                                    <table>
                                        <thead>
                                            <tr>
                                                <th style="width:10px">s/n</th>
                                                <th>rate code</th>
                                                  <th>adult one</th>
                                                  <th>adult two</th>
                                                  <th>adult three</th>
                                                  <th>adult four</th>
                                                  <th>extra adult</th>
                                                  <th>extra child</th>
                                                  <th>child two</th>
                                                  <th>plan</th>
                                                  <th>child plan</th>
                                                  <th>currency</th>
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
                            <div id="ratecodeImportModal" class="hidden fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
                                <div class="bg-white rounded-md shadow-xl w-full max-w-6xl max-h-[85vh] overflow-hidden flex flex-col">
                                    <div class="flex justify-between items-center px-4 py-3 border-b">
                                        <h3 class="text-lg font-semibold">Import Rate Codes</h3>
                                        <button id="ratecodeModalClose" class="material-symbols-outlined text-[#666] hover:text-black">close</button>
                                    </div>
                                    <div class="px-4 py-3 flex items-center gap-3 border-b text-sm">
                                        <label class="flex items-center gap-2 cursor-pointer select-none">
                                            <input type="checkbox" id="ratecodeSelectAll" class="accent-[#22c55e]" checked />
                                            <span>Select all</span>
                                        </label>
                                        <span id="ratecodeImportCount" class="text-xs text-[#555]">0 rows</span>
                                        <span class="text-xs text-[#f97316]">Review the breakdown below, uncheck anything you do not want to submit.</span>
                                    </div>
                                    <div class="flex-1 overflow-auto">
                                        <table class="w-full text-sm">
                                            <thead class="bg-[#f5f5f6]">
                                                <tr>
                                                    <th class="p-3 text-left w-12">#</th>
                                                    <th class="p-3 text-left">Rate Code</th>
                                                    <th class="p-3 text-left">Plan</th>
                                                    <th class="p-3 text-left">Currency</th>
                                                    <th class="p-3 text-left">Adult1</th>
                                                    <th class="p-3 text-left">Adult2</th>
                                                    <th class="p-3 text-left">Adult3</th>
                                                    <th class="p-3 text-left">Adult4</th>
                                                    <th class="p-3 text-left">Extra Adult</th>
                                                    <th class="p-3 text-left">Extra Child</th>
                                                    <th class="p-3 text-left">Child Two</th>
                                                    <th class="p-3 text-left">Plan Adult</th>
                                                    <th class="p-3 text-left">Plan Child</th>
                                                </tr>
                                            </thead>
                                            <tbody id="ratecodeImportTable" class="divide-y"></tbody>
                                        </table>
                                    </div>
                                    <div class="px-4 py-3 border-t flex justify-between items-center">
                                        <div id="ratecodeImportStatus" class="text-xs text-[#555]"></div>
                                        <div class="flex gap-2">
                                            <button id="ratecodeModalCancel" class="px-3 py-2 rounded-md border text-sm">Cancel</button>
                                            <button id="ratecodeModalSubmit" class="px-4 py-2 rounded-md bg-primary-g text-white text-sm drop-shadow-md hover:opacity-90 flex items-center gap-2">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Submit Selected</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                           </section> 
