       <section class="animate__animated animate__fadeIn relative">
                            <p class="page-title">
                                <span>DEPARTMENT</span>
                            </p>
                            <form id="departmentform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                   <div class="form-group">
                                            <label for="logoname" class="control-label">department name</label>
                                            <input type="text" name="department" id="department" class="form-control comp" placeholder="Enter Department Name">
                                        </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        
                                            <div class="form-group">
                                            <label for="logoname" class="control-label">category</label>
                                            <select name="category" id="category" class="form-control comp" placeholder="Enter Department Name">
                                                <option value="">-- select category --</option>
                                                <option>OFFICE</option>
                                                <option>MOBILE MENU</option>
                                                <option>STORE</option>
                                            </select>
                                        </div>
                                            <div class="form-group">
                                            <label for="logoname" class="control-label">apply for sales</label>
                                            <select name="applyforsales" id="applyforsales" class="form-control comp" placeholder="Enter Department Name">
                                                <option value="">-- select apply for sales --</option>
                                                <option>JUST DEPARTMENT</option>
                                                <option>STOCK</option>
                                                <option>NON STOCK</option>
                                            </select>
                                        </div>
                                        
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
                                        <!--<div class="flex justify-end mt-5">-->
                                        <!--     <button id="submit" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                        <!--        <div class="btnloader" style="display: none;"></div>-->
                                        <!--        <span>Submit</span>-->
                                        <!--    </button>-->
                                        </div>
                                        
                                    </div> 
                        
                                </div>
                            </form>
                            <hr class="my-10">
                            
                            
                             <div >
                                <div class="table-content">
                                    <!--<p class="text-md font-semibold">Balance Brought Forward(B/F): <span id="bbf"></span></p>-->
                                    <table>
                                        <thead>
                                            <tr>
                                                <th style="width:10px">s/n</th>
                                                <th>Department name</th>
                                                <th>category</th>
                                                <th>apply for sales</th>
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
                            
                           </section> 