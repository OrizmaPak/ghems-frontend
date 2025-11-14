       <section class="animate__animated animate__fadeIn">
                            <p class="page-title"> 
                                <span>work order</span>
                            </p>
                            <form id="workorderform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">department</label>
                                            <input type="text" list="hems_departmentlist"  onchange="checkdatalist(this)"  name="department" id="department" class="form-control comp">
                                        </div>
                                    <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">entry date</label>
                                            <input type="datetime-local" name="entrydate" id="entrydate" class="form-control comp" >
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">requested by</label>
                                            <input type="text" list="hems_userlist_id" onchange="checkdatalist(this)" name="requestedby" id="requestedby" class="form-control comp" readonly>
                                        </div>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 !mb-5 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">work needed</label>
                                            <textarea name="workneeded" id="workneeded" class="form-control comp" placeholder="Enter Description of Work Needed"></textarea>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">date needed</label>
                                            <input type="datetime-local" name="dateneeded" id="dateneeded" class="form-control comp" >
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">room number</label>
                                            <input type="number" name="roomnumber" id="roomnumber" list="hems_roomnumber_id" onchange="checkdatalist(this)" class="form-control comp" value="" placeholder="Enter Room Number">
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-2 !mb-5 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">work status</label>
                                            <input type="text" name="workstatus" id="workstatus" class="form-control" value="" placeholder="Enter Work Status">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">description of status</label>
                                            <textarea name="descriptionofstatus" id="descriptionofstatus" class="form-control" placeholder="Enter Status description"></textarea>
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
                                <div class="table-content">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>s/n</th>
                                                <th>requested by</th>
                                                <th>department</th>
                                                <th>entry date</th>
                                                <th>work needed</th>
                                                <th>date needed</th>
                                                <th>room number</th>
                                                <th>work status </th>
                                                <th>description of status</th>
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