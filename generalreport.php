 <section class="animate__animated animate__fadeIn max-w-full">
     
            <p class="page-title">
                <span>general report</span>
            </p>
            
            <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 cark:border-gray-700 cark:text-gray-400">
                <li  class="me-2 cp updater optioner !text-blue-600 active" name="guestonamealplan" onclick="runoptioner(this)">
                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Guests Plans</p>
                </li> 
                <li id="" class="me-2 cp viewer optioner" name="discountplan" onclick="runoptioner(this)">
                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ">Discounts</p>
                </li>
            </ul>
                            
            <form id="guestonamealplanform" class="">
                                        <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                            <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-10">
                                                <!--<div class="form-group">-->
                                                <!--    <label for="logoname" class="control-label required">Search</label>-->
                                                <!--    <input readonly type="text" name="searchtext" id="searchtext" class="form-control comp" placeholder="Enter  guest's first name or last name or other names or passport number or phone or visa number">-->
                                                <!--</div>-->
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">start date</label>
                                                    <input  type="date" name="startdate" id="arrivaldaterr" class="sss form-control">
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-10">
                                                <div class="form-group">
                                                </div>
                                                
                                                
                                                <div class="flex justify-end mt-5">
                                                    <button id="submitmeal" type="button" class="btn">
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
            
            <div id="guestonamealplan" class="">
            <div class="table-content  lg:max-w-[1000px]">
                
                                    <table id="tableer">
                                        <thead>
                                            <tr>
                                                 <th style="width: 20px">s/n</th> 
                                                <th>Room</th>
                                                <th>Guest</th>
                                                <th class="!w-[200px]">plan&nbsp;name</th>
                                                <th>plan amount</th>
                                                <th>plan discount amount</th>
                                                <th>plan discount %</th>
                                                <th>no.&nbsp;of&nbsp;nights</th>
                                                <th>total&nbsp;rate</th>
                                                <th>reservation&nbsp;date</th>
                                                <th>reference</th>
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
            
            <div id="discountplan" class="hidden">
            <div class="table-content  lg:max-w-[1000px]">
                
                                    <table id="tableer">
                                        <thead>
                                            <tr>
                                                 <th style="width: 20px">s/n</th> 
                                                <th>Room</th>
                                                <th>Guest</th>
                                                <th class="!w-[200px]">Discount&nbsp;name</th>
                                                <th>discount amount</th>
                                                <th>discount coupon</th>
                                                <th>no.&nbsp;of&nbsp;nights</th>
                                                <th>total&nbsp;rate</th>
                                                <th>reservation&nbsp;date</th>
                                                <th>reference</th>
                                            </tr>
                                        </thead>
                                        <tbody id="tabledata2">
                                            <tr>
                                                <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                
                <div class="table-status"></div>
            </div>
            </div>
        
                            
                            
                            
                            
                            
 </section>