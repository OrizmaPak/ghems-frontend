       <form id="updateinventoryform" class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>open stock</span>
                            </p>
                            <div>
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Department / Sales Point</label>
                                            <select name="salespoint" id="salespointname" class="form-control comp" >
                                                <option value="">Loading...</option>
                                            </select>
                                        </div>
                                    <!--<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">-->
                                        
                                    <!--    <div></div>-->
                                    <!--    <div></div>-->
                                        
                                    <!--    <div class="flex justify-end mt-5">-->
                                    <!--         <button id="submit" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                    <!--            <div class="btnloader" style="display: none;"></div>-->
                                    <!--            <span>Retrieve Items</span>-->
                                    <!--        </button>-->
                                    <!--    </div>-->
                                        
                                    <!--</div> -->
                        
                                </div>
                            </div>
                            <hr class="my-10">
                            

                             <div >
                                <div class="table-content">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>s/n</th>
                                                <th>Item name</th>
                                                <th>Begin Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody id="tabledata">
                                           <tr>
                                                <td colspan="100%" class="text-center opacity-70"> Loading...</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                        
                                        
                                        <div class="flex justify-end mt-5 ">
                                             <button id="selectall" type="button" class="w-full md:w-max rounded-md text-black text-sm capitalize bg-gradient-to-tr from-white via-white to-white px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3 hidden">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Select All</span>
                                            </button>
                                        </div>
                                        <div class="flex justify-end mt-5 ">
                                             <button id="deselectall" type="button" class="w-full md:w-max rounded-md text-black text-sm capitalize bg-gradient-to-tr from-white via-white to-white px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3 hidden">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>De-Select All</span>
                                            </button>
                                        </div>
                                        <div class="flex justify-end mt-5 ">
                                             <button id="delete" type="button" class="w-full opacity-[0.5] md:w-max rounded-md text-white text-sm capitalize px-8 py-3 lg:py-2 bg-gradient-to-tr from-[red] via-[red] to-white shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3 hidden">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Delete Selected</span>
                                            </button>
                                        </div>
                                        <div class="flex justify-end mt-5">
                                             <button id="save" type="button" class="btn">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Save All</span>
                                            </button>
                                            <!-- <button id="save" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                            <!--    <div class="btnloader" style="display: none;"></div>-->
                                            <!--    <span>Save All</span>-->
                                            <!--</button>-->
                                        </div>
                                        
                                    </div> 
                                </div>
                                <div class="table-status"></div>
                            </div>
                        
                                </form> 