       <section class="animate__animated animate__fadeIn relative">
                            <p class="page-title">
                                <span>APPROVE REQUISITION</span>
                            </p>
                            <hr class="my-10">
                            
                            
                             <div >
                                <div class="table-content">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th style="width:10px">s/n</th>
                                                <th><input type="checkbox" name="allapprovebox" id="allapprovebox" /> </th>
                                                <th>ITEM&nbsp;NAME</th>
                                                <th>source</th>
                                                <th>destination</th>
                                                <th>cost</th>
                                                <th>reference</th>
                                                <th>description</th>
                                                <th>TRANSACTION<br/>DATE</th>
                                            </tr>
                                        </thead>
                                        <tbody id="tabledata">
                                           <tr>
                                                <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div class="flex justify-end mt-5 mb-2 gap-4">
                                             <button id="" onclick="approvechecker('CHECK')" type="button" class="w-full md:w-max rounded-md text-black text-sm capitalize border  px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Check All</span>
                                            </button>
                                             <button id="" onclick="approvechecker('NOTCHECK')" type="button" class="w-full md:w-max rounded-md text-black text-sm capitalize border px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Uncheck All</span>
                                            </button>
                                             <button id="requisitionapprovebtn" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Approve</span>
                                            </button>
                                             <button id="requisitiondeclinebtn" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-red-400 via-red-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Decline</span>
                                            </button>
                                    </div>
                                </div>
                                <div class="table-status"></div>
                            </div>
                            
                                </section> 