       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>MANAGE ROOM CATEGORIES</span>
                            </p>
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
                        
                        </section>  