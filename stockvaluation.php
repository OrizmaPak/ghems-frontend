       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>STOCK VALUATION</span>
                            </p>
                            <form id="stockvaluationform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">As at</label>
                                            <input type="date" name="atdate" id="atdate" class="form-control">
                                        </div>
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
                            </form>
                            <hr class="my-10">
                            
                            
                             <div >
                                    <ol class="flex items-center !text-xs w-full  p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white mt-4 shadow-sm sm:text-base  sm:p-4 sm:space-x-4 rtl:space-x-reverse">
                                   
                                <div class="flex justify-end w-full">
                                                 <button onclick="printContent('HEMS receipts FORM', null, 'stockvaluationtable', true)" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>print</span> 
                                                </button>
                                                 <button onclick="exportToPDF('stockvaluationtable')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Export PDF</span> 
                                                </button>
                                            </div>
                                </ol>
                                <div id="stockvaluationtable" class="table-content">
                                    <div class="w-full bg-white flex justify-end py-3 text-xl font-semibold px-7 gap-5">
                                        Date: <span id="asatdate"></span>
                                    </div>
                                    <div class="w-full bg-white flex justify-end py-3 text-xl font-semibold px-7 gap-5">
                                        Total Value: <span id="asat"></span>
                                    </div>
                                    <table >
                                        <thead>
                                            <tr>
                                                <th>s/n</th>
                                                <th>Item Name</th>
                                                <th>Cost</th>
                                                <th>qty in Stock</th>
                                                <th>value</th>
                                            </tr>
                                        </thead>
                                        <tbody id="tabledata">
                                           <tr>
                                                <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div class="w-full bg-white flex justify-end py-3 text-xl font-semibold px-7">
                                        Total Cost: <span id="asat2"></span>
                                    </div>
                                </div>
                                <div class="table-status"></div>
                            </div>
                        
                                </section> 