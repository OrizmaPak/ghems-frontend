 <section class="animate__animated animate__fadeIn max-w-full">
     
            <p class="page-title">
                <span>General report</span>
            </p>
            
            <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 cark:border-gray-700 cark:text-gray-400">
                <li  class="me-2 cp updater optioner !text-blue-600 active" name="generalaccountreport" onclick="runoptioner(this)">
                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">General Report</p>
                </li> 
            </ul>
                            
            <form id="generalaccountreportform" class="">
                                        <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                            <div class="grid grid-cols-1 !mb-5 lg:grid-cols-3 gap-10">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">date from</label>
                                                    <input  type="date" name="startdate" id="arrivaldaterr" class="sss form-control">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">to</label>
                                                    <input  type="date" name="enddate" id="enddate" class="sss form-control">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label required">category</label>
                                                    <select name="category" id="category" class="form-control comp">
                                                        <option value="">-- Select Category --</option>
                                                        <option>Booking/Reservation</option>
                                                        <option>Food/Beverages</option>
                                                        <option>Sundry Sales</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-10">
                                                <div class="form-group">
                                                    
                                                </div>
                                                
                                                
                                                <div class="flex justify-end mt-5">
                                                    <button id="submit" type="button" class="btn">
                                                        <div class="btnloader" style="display: none;"></div>
                                                        <span>Submit</span> 
                                                    </button>
                                                    <!-- <button id="submit" type="button" class="w-full h-[45px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                    <!--    <div class="btnloader" style="display: none;"></div>-->
                                                    <!--    <span>Submit</span> -->
                                                    <!--</button>-->
                                                </div>
                                                
                                            </div> 
                                
                                        </div>
                                    </form>
                                    
                                    <div class="w-full flex justify-end relative my-2 ">
                                                             <button onclick="printContent('HEMS GENERAL REPORT', null, 'generalaccountreporter', true)" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                                <div class="btnloader" style="display: none;"></div>
                                                                <span>print</span> 
                                                            </button>
                                                             <button onclick="exportToPDF('generalaccountreporter')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                                <div class="btnloader" style="display: none;"></div> 
                                                                <span>Export PDF</span> 
                                                            </button>
                                                             <button onclick="exportToExcel('tableer', 'HEMS GENERAL REPORT')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                                <div class="btnloader" style="display: none;"></div>
                                                                <span>Export Excel</span> 
                                                            </button> 
                                                    </div>
            
            <div id="generalaccountreporter" class="">
            <div class="table-content  lg:max-w-[1000px]">
                
                                    <table id="tableer">
                                        <thead>
                                            <tr>
                                                 <th style="width: 20px">s/n</th> 
                                                <th>date</th>
                                                <th>sales point</th>
                                                <th class="!w-[200px]">description</th>
                                                <th>amount</th>
                                                <th>Consumption</th>
                                                <th>Service Charge</th>
                                                <th>VAT</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody id="tabledata">
                                            <tr>
                                                <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                
                <div class="table-status"></div>
            </div>
            </div>
            
        
                            
                            
                            
                            
                            
 </section>