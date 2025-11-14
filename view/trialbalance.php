       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>trial balance</span>
                            </p>
                            <form id="trialbalanceform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 gap-6"> 
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Date</label>
                                            <input type="date" name="currentdate" id="currentdate" class="form-control">
                                        </div>
                                        <div class="flex justify-end mt-2">
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
                            
                             <div >
                                <div class="table-content">
                                    <table>
                                        <thead>
                                            <tr>
                                                <!--<th>s/n</th> -->
                                              <th>item/decription</th>
                                               <th>debit</th>
                                               <th>credit</th>
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
                            
                            <datalist id="gltransactionhistorylist"></datalist>
                        
                        </section>  