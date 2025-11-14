       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>Lost & Found Register</span>
                            </p>
                            
                            <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                                <li id="rccview" class="me-2 cp viewer" onclick="did('lostfoundregisterform').classList.add('hidden');this.children[0].classList.add('active', '!text-blue-600');did('lostandfoundview').classList.remove('hidden');this.nextElementSibling.children[0].classList.remove('active', '!text-blue-600');">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50  !text-blue-600 active">View</p>
                                </li>
                                <li id="rccupdatechecklist" class="me-2 cp updater" onclick="did('lostfoundregisterform').classList.remove('hidden');this.children[0].classList.add('active', '!text-blue-600');did('lostandfoundview').classList.add('hidden');this.previousElementSibling.children[0].classList.remove('active', '!text-blue-600');">
                                    <p class="inline-block p-4 bg-gray-100 rounded-t-lg">Update Lost and Found</p>
                                </li>
                            </ul>
                            
                            <form id="lostfoundregisterform" class="hidden">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Room Number</label>
                                            <input type="text" list="hems_roomnumber_id" onchange="checkdatalist(this)" name="roomnumber" id="roomnumber" class="form-control comp" placeholder="Enter Room Number">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">item</label>
                                            <input type="text" name="item" id="item" class="form-control comp" placeholder="Enter Item Names">
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 !mb-5 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">description</label>
                                            <textarea type="text" name="description" id="description" class="form-control comp" placeholder="Enter items Description"></textarea>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-2 !mb-5 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">found by</label>
                                            <input type="text" name="foundby" id="foundby" list="hems_userlist_id" onchange="checkdatalist(this)" class="form-control comp" placeholder="Enter Supervisor">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">date time found</label>
                                            <input type="datetime-local" name="datetimefound" id="datetimefound" class="form-control comp" placeholder="Enter Description">
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-2 !mb-5 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">item collected by</label>
                                            <input type="text" name="itemcollectedby" id="itemcollectedby" class="form-control" placeholder="Enter Supervisor">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">collection date</label>
                                            <input type="datetime-local" name="collectiondate" id="collectiondate" class="form-control" placeholder="Enter Description">
                                        </div>
                                    </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">collector address</label>
                                            <textarea name="collectoraddress" id="collectoraddress" class="form-control" placeholder="Enter Collector Address"></textarea>
                                        </div>
                                    <div class="grid grid-cols-1 !mb-5 lg:grid-cols-3 gap-6">
                                        
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
                            
                             <hr class="my-3">
                                    <div id="lostandfoundview">
                                <div class="table-content">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th style="width: 20px">s/n</th>
                                                <th>room number</th>
                                                <th>Item</th>
                                                <th>description</th>
                                                <th>found by</th>
                                                <th>date found</th>
                                                <th>collected by</th>
                                                <th>date collected</th>
                                                <th>collector address</th>
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
                            <datalist id="assignmentitems"></datalist>
                        
                        </section>  