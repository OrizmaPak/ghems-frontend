       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>VIEW INVENTORY</span>
                            </p>
                            <form id="viewinventoryform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Item Name</label>
                                            <input type="text" name="itemname1" id="itemname1" class="form-control" placeholder="Search by Item Name">
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
                            
                            <div id="modalform" class="z-[100] w-screen h-screen fixed bg-[#5a5a5a3e] top-0 left-0 p-10 overflow-auto hidden">
                              <form id="viewinventoryeditform" class="animate__animated animate__fadeIn relative bg-[#f5f5f6] p-10 rounded-lg shadow-lg">
                                    <p class="page-title flex justify-between">
                                        <span>Edit INVENTORY</span>
                                    </p>
                                    <!--start container-->
                                    <div id="createinventoryform">
                                            
                                    <div id="createinventorycontainer">
                                        <div class="flex flex-col mb-10">
                                        <p name="itemno" class="page-title !mb-4">
                                            <span>Item</span>
                                        </p>
                                            <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                                <div  class="relative top-[-15px] w-full justify-end h-fit flex gap-5">
                                                    <!--<button title="Collapse" onclick="this.parentElement.parentElement.nextElementSibling.classList.contains('hidden') ? this.parentElement.parentElement.nextElementSibling.classList.remove('hidden') : this.parentElement.parentElement.nextElementSibling.classList.add('hidden')"  class="!z-[1] material-symbols-outlined rounded-full bg-[#969696] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">menu</button>-->
                                                    <!--<button title="Add Item" onclick="addform()" class="relative material-symbols-outlined rounded-full bg-[green] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">add</button>-->
                                                    <!--<button title="Delete" onclick="this.parentElement.parentElement.parentElement.remove()" class=" material-symbols-outlined rounded-full bg-[red] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">remove</button>-->
                                                </div>
                                                
                                                 
                                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                        <div class="form-group">
                                                            <label for="url" class="control-label">Item Image</label>
                                                            <div id="imagePreview"></div>
                                                            <input type="file" name="imageurl" id="imageurl" class="form-control" onchange="previewImage('imageurl')">
                                                        </div>  
                                                        <div class="form-group relative">
                                                            <label for="logoname" class="control-label flex justify-between">Item Name</label>
                                                            <input type="text" name="itemname" class="form-control comp" placeholder="Enter Name of Item">
                                                        </div>
                                                    </div> 
                                                </div>
                                                <div class="">
                                                    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 !pt-0 rounded-sm">
                                                        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                                            <div class="form-group">
                                                                <label for="logoname" class="control-label">Units</label>
                                                                <select name="units" id="units" class="form-control comp">
                                                                    <option value=''>-- Select Unit --</option>
                                                                    <option>PCS</option>
                                                                    <option>YARDS</option>
                                                                    <option>KG</option>
                                                                    <option>SETS</option>
                                                                    <option>METRES</option>
                                                                    <option>LITRES</option>
                                                                </select>
                                                            </div>
                                                            <div class="form-group">
                                                                <label for="logoname" class="control-label">Cost</label>
                                                                <input type="number" name="cost" class="form-control" placeholder="Enter Cost of Item">
                                                            </div>
                                                            <div class="form-group">
                                                                <label for="logoname" class="control-label">Price</label>
                                                                <input type="number" name="price" readonly class="form-control" placeholder="Set Price"/>
                                                            </div>
                                                            <div class="form-group">
                                                                <label for="logoname" class="control-label">Price</label>
                                                                <input type="number" name="price_two" readonly class="form-control" placeholder="Set Price"/>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 !pt-0 rounded-sm">
                                                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                            <div class="form-group">
                                                                <label for="logoname" class="control-label">Begin Balance</label>
                                                                <input type="number" name="beginbalance" class="form-control" placeholder="Enter Begin Balance">
                                                            </div>
                                                            <div class="form-group">
                                                                <label for="logoname" class="control-label">Minimum Balance</label>
                                                                <input type="number" name="minbalance" class="form-control" placeholder="Enter Minimum Balance">
                                                            </div>
                                                            <div class="form-group">
                                                                <label for="logoname" class="control-label">Group Name</label>
                                                                <input type="text" name="groupname" class="form-control" placeholder="Enter Group Name">
                                                            </div>
                                                        </div> 
                                                    </div>
                                                    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 !pt-0 rounded-sm">
                                                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                            <div class="form-group">
                                                                <label for="logoname" class="control-label">apply to</label>
                                                                <select name="applyto" id="applyto" class="form-control comp">
                                                                    <option value=''>-- Select Apply To --</option>
                                                                    <option>FOR SALE</option>
                                                                    <option>NOT FOR SALE</option>
                                                                </select>
                                                            </div>
                                                            <div class="form-group">
                                                                <label for="logoname" class="control-label">Reorder Level</label>
                                                                <input type="text" name="reorderlevel" class="form-control" placeholder="Enter reorder level">
                                                            </div>
                                                            <div class="form-group">
                                                                <label for="logoname" class="control-label">Composite</label>
                                                                <select name="composite" id="composite" class="form-control">
                                                                    <option value=''>-- Select Composite --</option>
                                                                    <option>YES</option>
                                                                    <option>NO</option>
                                                                </select>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 !pt-0 rounded-sm">
                                                        <div class="grid grid-cols-1 gap-6">
                                                            <div class="form-group">
                                                                <label for="logoname" class="control-label">Description</label>
                                                                <input type="text" name="description" class="form-control" placeholder="Enter Item Description">
                                                            </div>
                                                        </div> 
                                                    </div>
                                                    </div>
                                                </div>
                                        </div>
                                    </div>
                                        
                                        <div class="flex justify-end mt-5 gap-5"> 
                                            <button onclick="did('modalform').classList.add('hidden')" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-red-400 via-red-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>cancel</span>
                                            </button>
                                            <button id="submit" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Update</span>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    
                                    <datalist id='departmentlist'></datalist>
                                    <datalist id='userslist'></datalist>
                                
                        </form>  
                            </div>
                            
                             <div >
                                <div class="table-content">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>s/n</th>
                                                <th>Item Name</th>
                                                <th>cost</th>
                                                <th>price</th>
                                                <th>units</th>
                                                <th>Group name</th>
                                                <th>description</th>
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