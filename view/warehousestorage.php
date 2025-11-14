       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>WAREHOUSE / STORAGE</span>
                            </p>
                            <form id="warehousestorageform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Department/Warehouse</label>
                                            <input type="text" name="location" id="location" class="form-control" placeholder="Enter Location">
                                        </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">State</label>
                                            <input type="text" name="state" id="state" class="form-control" placeholder="Enter State">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Type</label>
                                            <select name="locationtype" id="locationtype" class="form-control comp">
                                                <option value=''>-- Select Type --</option>
                                                <option>WAREHOUSE</option>
                                                <option>DEPARTMENT</option>
                                            </select>
                                        </div>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Description</label>
                                            <input type="text" name="description" id="description" class="form-control" placeholder="Enter Description">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Address</label>
                                            <input type="text" name="address" id="address" class="form-control" placeholder="Enter Address">
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        
                                        <div></div>
                                        <div></div>
                                        
                                        <div class="flex justify-end mt-5">
                                             <button id="submit" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Submit</span>
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
                                                <th>s/n</th>
                                                <th>location</th>
                                                <th>state</th>
                                                <th>location type</th>
                                                <th>description</th>
                                                <th>address</th>
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