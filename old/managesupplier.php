       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>MANAGE SUPPLIERS</span>
                            </p>
                            <form id="managesupplierform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Supplier Type</label>
                                            <select name="ttype" id="ttype" class="form-control comp">
                                                <option value=''>-- Select Supplier Type --</option>
                                                <option>SUPPLIER</option>
                                                <option>CUSTOMER</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Company Name</label>
                                            <input type="text" name="companyname" id="companyname" class="form-control" placeholder="Enter Company Name">
                                        </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">contact person</label>
                                            <input type="text" name="contactperson" id="contactperson" class="form-control" placeholder="Enter Contact Person">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">phone number</label>
                                            <input type="tel" name="phonenumber" id="phonenumber" class="form-control" placeholder="Enter Phone Number">
                                        </div>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">office address</label>
                                            <input type="text" name="officeaddress" id="officeaddress" class="form-control" placeholder="Enter Office Address">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">nationality</label>
                                            <input type="text" name="nationality" id="nationality" class="form-control" placeholder="Enter Nationality">
                                        </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">state</label>
                                            <input type="text" name="state" id="state" class="form-control" placeholder="Enter State">
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">activity level</label>
                                            <select name="typeofsupplier" id="typeofsupplier" class="form-control comp">
                                                <option value=''>-- Select Supplier Type --</option>
                                                <option>ACTIVE</option>
                                                <option>NON-ACTIVE</option>
                                            </select>
                                        </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">bank</label>
                                            <input type="text" name="supplierbank" id="supplierbank" class="form-control" placeholder="Enter Supplier Bank">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">account Number</label>
                                            <input type="number" name="supplieraccount" id="supplieraccount" class="form-control" placeholder="Enter Account Number">
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
                                        </div>
                                        <!--     <button id="submit" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                        <!--        <div class="btnloader" style="display: none;"></div>-->
                                        <!--        <span>Submit</span>-->
                                        <!--    </button>-->
                                        <!--</div>-->
                                        
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
                                                <th>company name</th>
                                                <th>type of supplier</th>
                                                <th>contact person</th>
                                                <th>nationality</th>
                                                <th>state</th>
                                                <th>address</th>
                                                <th>phone</th>
                                                <th>bank</th>
                                                <th>account no</th>
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