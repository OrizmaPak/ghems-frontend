       <section class="animate__animated animate__fadeIn relative">
                            <p class="page-title">
                                <span>MANAGE ROOM</span>
                            </p>
                            <form id="addroomform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                        <div class="form-group col-span-3">
                                            <label for="logoname" class="control-label">Room Name</label>
                                            <input type="text" name="roomname" id="roomname" class="form-control comp">
                                        </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 !mb-5">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Room Number</label>
                                            <input type="text" name="roomnumber" id="roomnumber" class="form-control comp">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Building</label>
                                            <input type="text" name="building" id="building" class="form-control comp">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Category</label>
                                            <select name="categoryid" id="categoryid" class="form-control comp" >
                                                <option value="">-- SELECT CATEGORY --</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 !mb-5">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">floor</label>
                                            <input type="text" name="floor" id="floor" class="form-control comp" >
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Room Picture one</label>
                                            <div id="imagePreview"></div>
                                            <input type="file" name="imageurl1" id="imageurl1" class="form-control" onchange="previewImage('imageurl1', 'imagePreview', 200)">
                                            <p class="text-[red] text-xs italic">maximum size (200kb)</p>
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Room Picture two</label>
                                            <div id="imagePreview2"></div>
                                            <input type="file" name="imageurl2" id="imageurl2" class="form-control" onchange="previewImage('imageurl2', 'imagePreview2', 200)">
                                            <p class="text-[red] text-xs italic">maximum size (200kb)</p>
                                        </div>
                                    </div>
                                        <div class="form-group col-span-3">
                                            <label for="logoname" class="control-label">Description</label>
                                            <textarea type="text" name="description" id="description" class="form-control comp" rows="4" ></textarea>
                                        </div>
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
                                <div class="table-content">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th style="width:10px">s/n</th>
                                                <th style="width:150px;">Room img</th>
                                                <th style="width:150px;">Room img</th>
                                                <th>Room name</th>
                                                <th>Room number</th>
                                                <th>category</th>
                                                <th>building</th>
                                                <th>floor</th>
                                                <th style="width: 30%">description</th>
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
                            
                            <datalist id="supplierlistpayable">
                                
                            </datalist>

                                </section> 