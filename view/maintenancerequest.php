       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>maintenance request</span>
                            </p>
                            <form id="maintenancerequestform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Room Number</label>
                                            <input type="text" name="roomnumber" id="roomnumber" onchange="checkdatalist(this)" list="hems_roomnumber" class="form-control comp" placeholder="Enter Room Number">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">complaint lodge date</label>
                                            <input type="datetime-local" name="complaintlodgedate" id="complaintlodgedate" class="form-control comp">
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 !mb-5 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">nature of complaint</label>
                                            <textarea name="natureofcomplaint" id="natureofcomplaint" class="form-control comp" placeholder="Enter Complaint"></textarea>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">assigned to</label>
                                            <input type="text" list="hems_userlist_id" onchange="checkdatalist(this)" name="assignedto" id="assignedto" class="form-control comp" placeholder="Select staff">
                                        </div>
                                    <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">completion date</label>
                                            <input type="datetime-local" name="completiondate" id="completiondate" class="form-control comp" placeholder="Enter Description">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">reported by</label>
                                            <input type="text" list="hems_userlist_id" onchange="checkdatalist(this)" name="reportedby" id="reportedby" class="form-control comp" readonly value="">
                                        </div>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 !mb-5 lg:grid-cols-3 gap-6">
                                        
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
                            <hr class="my-3">
                            <div >
                                <div class="table-content hidden">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>s/n</th>
                                                <th>Room number</th>
                                                <th>Complaint</th>
                                                <th>Complaint lodged at</th>
                                                <th>assigned to</th>
                                                <th>reported by</th>
                                                <th>completed at</th>
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