       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>RECIPE</span>
                            </p>
                            <form id="recipeform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                <div class="grid grid-cols-1  lg:grid-cols-1 gap-10 p-3 bg-[#3b82f6] text-white rounded shadow-sm">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">Department / Salespoint</label>
                                                <select name="salespoint" id="salespointname" class="form-control comp !text-black !bg-white">
                                                    <option>Loading...</option>
                                                </select>
                                            </div>
                                        </div>
                                    
                                    <div id="loading">Loading...</div>
                                    
                                    <div id="" class="load hidden">
                                        
                                        <div class="grid grid-cols-1 gap-6 mb-3">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">ITEM TO BUILD</label>
                                                <select name="itembuild" id="itembuild" class="form-control comp">
                                                    <option value=''>-- Select Item To Build --</option>
                                                </select>
                                            </div>
                                        </div>
                                        <p class="page-title mb-5 mt-5">
                                        <span>ADD ITEM</span>
                                    </p>
                                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10 !mb-7">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">ITEM</label>
                                                <select name="item" id="item" class="form-control comp">
                                                    <option value=''>-- Select Item --</option>
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">QUANTITY</label>
                                                 <input type="number" name="quantity" id="quantity" class="form-control" placeholder="Enter Quantity of Item">
                                            </div>
                                            <div class="flex justify-end mt-5">
                                                 <button id="" onclick="addrecipeitem()" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Add</span>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <p class="page-title mb-5 mt-20">
                                            <span>MANAGE ITEM</span>
                                        </p>
                                        
                                
                                
                                        <div class="">
                                    <div class="table-content">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>s/n</th>
                                                    <th>Item id</th>
                                                    <th>item name</th>
                                                    <th>quantity</th>
                                                    <th>action</th>
                                                </tr>
                                            </thead>
                                            <tbody id="tabledata">
                                               <!--<tr>-->
                                               <!--     <td class="opacity-70 w-3"> 1 </td>-->
                                               <!--     <td class="opacity-70"> itemid </td>-->
                                               <!--     <td class="opacity-70"> itemname </td>-->
                                               <!--     <td class="opacity-70"> <input type="number" name="quantity" id="quantity" class="form-control" placeholder="Enter Quantity of Item"> </td>-->
                                               <!--     <td class="flex items-center gap-3">-->
                                               <!--         <button title="Edit row entry" onclick="fetchwarehousestorage('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">add</button>-->
                                               <!--         <button title="Delete row entry"s onclick="removewarehousestorage('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">remove</button>-->
                                               <!--     </td>-->
                                               <!-- </tr>-->
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="flex justify-end mt-5">
                                                 <button id="submit" onclick="addbuilditem()" type="button" class="btn">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Submit</span>
                                                </button>
                                                <!-- <button id="submit" onclick="addbuilditem()" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div>-->
                                                <!--    <span>Submit</span>-->
                                                <!--</button>-->
                                            </div>
                                    <div class="table-status"></div>
                                </div>
                                        
                                    </div>   
                        
                                </div>
                            </form> 
                            
                        
                                </section> 