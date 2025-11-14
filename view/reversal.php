  <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                                <!--<li id="rccview" class="me-2 cp viewer" onclick="did('guestsreservationsform').classList.add('hidden');this.children[0].classList.add('active', '!text-blue-600');did('lostandfoundview').classList.remove('hidden');this.nextElementSibling.children[0].classList.remove('active', '!text-blue-600');">-->
                                <li id="iddformform" class="me-2 cp updater optioner !text-blue-600 active" name="reversesales" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Reverse Sales</p>
                                </li>
                                <li id="iddformform" class="me-2 cp updater optioner" name="reversereceipt" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Reverse Receipt</p>
                                </li>
                            </ul>
                    
                                    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">


                <div id="reversesales" class="">
                        <form id="reversesalesform">
                                 <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div class="form-group"> 
                                                <label for="logoname" class="control-label">Sales reference</label>
                                                <input type="text" name="reference" id="reference" class="form-control comp1" placeholder="Enter reference">
                                            </div>
                                            
                                            <div class="flex justify-end mt-5">
                                                 <button id="submit" type="button" class="btn">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Submit</span>
                                                </button>
                                            </div>
                                            
                                        </div> 
                                </form>
                </div>
                <div id="reversereceipt" class="hidden">
                        <form id="reversereceiptform">
                                 <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div class="form-group"> 
                                                <label for="logoname" class="control-label">Receipt reference</label>
                                                <input type="text" name="reference" id="reference" class="form-control comp2" placeholder="Enter reference">
                                            </div>
                                            
                                            <div class="flex justify-end mt-5">
                                                 <button id="submit" type="button" class="btn">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Submit</span>
                                                </button>
                                            </div>
                                            
                                        </div> 
                                </form>
                </div>
                </div>