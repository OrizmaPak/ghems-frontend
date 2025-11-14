       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>Groups</span>
                            </p>
                            
                             <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                                <!--<li id="rccview" class="me-2 cp viewer" onclick="did('guestsreservationsform').classList.add('hidden');this.children[0].classList.add('active', '!text-blue-600');did('lostandfoundview').classList.remove('hidden');this.nextElementSibling.children[0].classList.remove('active', '!text-blue-600');">-->
                                <li id="iddgroupofguestsform" class="me-2 cp viewer optioner !text-blue-600 active" name="travelagencyform" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Travel Agency</p>
                                </li>
                                <li id="iddgroupofguestsform" class="me-2 cp viewer optioner" name="companyform" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Company</p>
                                </li>
                                <li id="iddgroupofguestsform" class="me-2 cp viewer optioner" name="groupofguestsform" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Groups</p>
                                </li>
                                <li id="" class="me-2 cp updater optioner" name="groupofguestsview" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ">View Groups</p>
                                </li>
                            </ul>
                            
                            <div id="showform">
                                <form id="travelagencyform" class="">
                                         <ol class="flex items-center !text-xs w-full  p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white mt-4 shadow-sm sm:text-base  sm:p-4 sm:space-x-4 rtl:space-x-reverse">
                                       
                                    <div class="flex justify-end w-full hidden">
                                                     <button onclick="printContent('HEMS group of guests FORM', null, 'groupofguestsform', true)" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                        <div class="btnloader" style="display: none;"></div>
                                                        <span>print</span> 
                                                    </button>
                                                     <button onclick="exportToPDF('groupofguestsform')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                        <div class="btnloader" style="display: none;"></div>
                                                        <span>Export PDF</span> 
                                                    </button>
                                                </div>
                                    </ol>
                                        <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <p class="page-title">
                                    <span>TRAVELS AND TOURS</span>
                                </p>
                                            <div class="grid grid-cols-1 !mb-1 gap-10">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">agency name</label>
                                                    <input name="agencyname" id="agencyname" class="form-control compt" placeholder="Enter Agency Name">
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-1 !mb-1 lg:grid-cols-3 gap-10">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">contact</label>
                                                    <input type="text"  name="contact" id="contact" class="form-control compt" placeholder="Enter contact">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">Phone</label>
                                                    <input type="text" name="phone" id="phone" class="form-control compt" placeholder="Enter Phone Number">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">commission</label>
                                                    <input type="text" name="commission" id="commission" class="form-control compt" placeholder="Enter commission">
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-1  lg:grid-cols-2 gap-10">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">email</label>
                                                    <input type="text"  name="email" id="email" class="form-control compt" placeholder="Enter email">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">address</label>
                                                    <textarea name="address" id="address" class="form-control compt" placeholder="Enter Address"></textarea>
                                                </div>
                                            </div>
                                             <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            
                                            <div></div>
                                            <div></div>
                                            
                                            <div class="flex justify-end mt-5">
                                                 <button id="submittravel" type="button" class="btn">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Submit</span>
                                                </button>
                                                <!-- <button id="submittravel" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div>-->
                                                <!--    <span>Submit</span>-->
                                                <!--</button>-->
                                            </div>
                                            
                                        </div> 
                                        <div >
                                    <div class="table-content">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th style="width:10px">s/n</th>
                                                    <th>Agency</th>
                                                    <th>Email</th>
                                                    <th>Commission</th>
                                                    <th>Contact</th>
                                                    <th>phone</th>
                                                    <th>address</th>
                                                    <th>ACTION</th>
                                                </tr>
                                            </thead>
                                            <tbody id="tabledatat">
                                               <tr>
                                                    <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="table-status"></div>
                                </div>
                                            </div>
                                </form>
                                <form id="companyform" class="hidden">
                                         <ol class="flex items-center !text-xs w-full  p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white mt-4 shadow-sm sm:text-base  sm:p-4 sm:space-x-4 rtl:space-x-reverse">
                                       
                                    <div class="flex justify-end w-full hidden">
                                                     <button onclick="printContent('HEMS group of guests FORM', null, 'groupofguestsform', true)" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                        <div class="btnloader" style="display: none;"></div>
                                                        <span>print</span> 
                                                    </button>
                                                     <button onclick="exportToPDF('groupofguestsform')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                        <div class="btnloader" style="display: none;"></div>
                                                        <span>Export PDF</span> 
                                                    </button>
                                                </div>
                                    </ol>
                                        <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <p class="page-title">
                                    <span>COMPANY</span>
                                </p>
                                            <div class="grid grid-cols-1 !mb-1 lg:grid-cols-2 gap-10">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">company name</label>
                                                    <input name="companyname" id="companyname" class="form-control compp" placeholder="Enter company Name">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">contact</label>
                                                    <input type="text"  name="contact" id="contact" class="form-control compp" placeholder="Enter contact">
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-1  lg:grid-cols-2 gap-10">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">email</label>
                                                    <input type="text"  name="email" id="email" class="form-control compp" placeholder="Enter email">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">address</label>
                                                    <textarea name="address" id="address" class="form-control compp" placeholder="Enter Address"></textarea>
                                                </div>
                                            </div>
                                             <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            
                                            <div></div>
                                            <div></div>
                                            
                                            <div class="flex justify-end mt-5">
                                                 <button id="submitcompany" type="button" class="btn">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Submit</span>
                                                </button>
                                                <!-- <button id="submitcompany" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div>-->
                                                <!--    <span>Submit</span>-->
                                                <!--</button>-->
                                            </div>
                                            
                                        </div> 
                                        <div >
                                    <div class="table-content">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th style="width:10px">s/n</th>
                                                    <th>Company</th>
                                                    <th>Email</th>
                                                    <th>Contact</th>
                                                    <th>address</th>
                                                    <th>ACTION</th>
                                                </tr>
                                            </thead>
                                            <tbody id="tabledatac">
                                               <tr>
                                                    <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="table-status"></div>
                                </div>
                                            </div>
                                
                                        </div>
                                    
                                
                                    
                                    </form>
                            </div>
                            <form id="groupofguestsform" class="hidden">
                                     <ol class="flex items-center !text-xs w-full  p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white mt-4 shadow-sm sm:text-base  sm:p-4 sm:space-x-4 rtl:space-x-reverse">
                                   
                                <div class="flex justify-end w-full hidden">
                                                 <button onclick="printContent('HEMS group of guests FORM', null, 'groupofguestsform', true)" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>print</span> 
                                                </button>
                                                 <button onclick="exportToPDF('groupofguestsform')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Export PDF</span> 
                                                </button>
                                            </div>
                                </ol>
                                    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                <p class="page-title">
                                <span>GROUPS</span>
                            </p>
                                        <div class="grid grid-cols-1 !mb-1 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">group name</label>
                                                <input name="groupname" id="groupname" class="form-control comp">
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-1 !mb-1 lg:grid-cols-2 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">contact</label>
                                                <input type="text"  name="contact" id="contact" class="form-control comp" placeholder="Enter contact">
                                            </div>
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">travel agent</label>
                                                <select name="travelagent" id="travelagent" class="form-control comp">
                                                    <option value="">Loading...</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-1  lg:grid-cols-2 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">company</label>
                                                <select name="company" id="company" class="form-control comp">
                                                    <option value="">Loading...</option>
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">email</label>
                                                <input type="email" name="email" id="email" class="form-control comp" placeholder="Enter email">
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">country</label>
                                                <input type="text" name="country" id="country" class="form-control comp" placeholder="Enter country">
                                            </div>
                                        <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">City</label>
                                                <input type="text" name="city" id="city" class="form-control comp" placeholder="Enter City">
                                            </div>
                                            <div class="form-group">
                                                    <label for="logoname" class="control-label">language</label>
                                                    <input type="text" name="language" id="language" class="form-control comp" placeholder="Enter language">
                                                </div>
                                         </div>
                                         </div>
                                        <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                            <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">group type</label>
                                                    <select name="grouptype" id="grouptype" class="form-control comp">
                                                        <option value="">-- Select Group Type --</option>
                                                        <option>Local</option>
                                                        <option>Foreign</option>
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">source</label>
                                                    <select name="source" id="source" class="form-control comp">
                                                        <option value="">-- Select source --</option>
                                                        <option>Guest Direct</option>
                                                        <option>Social Media Corporate</option>
                                                        <option>Online Booking</option>
                                                    </select>
                                                </div>
                                            </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">industry</label>
                                                    <select name="industry" id="industry" class="form-control comp">
                                                        <option value="">-- Select Industry --</option>
                                                        <option>Travel and Tours</option>
                                                        <option>Finance</option>
                                                        <option>Education</option>
                                                        <option>Agriculture</option>
                                                        <option value="Agriculture">Agriculture</option>
                                                          <option value="Mining">Mining</option>
                                                          <option value="Forestry">Forestry</option>
                                                          <option value="Fishing">Fishing</option>
                                                          <option value="Manufacturing">Manufacturing</option>
                                                          <option value="Construction">Construction</option>
                                                          <option value="Electricity, gas, and water supply">Electricity, gas, and water supply</option>
                                                          <option value="Retail and wholesale trade">Retail and wholesale trade</option>
                                                          <option value="Transportation and storage">Transportation and storage</option>
                                                          <option value="Accommodation and food service activities">Accommodation and food service activities</option>
                                                          <option value="Information and communication">Information and communication</option>
                                                          <option value="Financial and insurance activities">Financial and insurance activities</option>
                                                          <option value="Real estate activities">Real estate activities</option>
                                                          <option value="Professional, scientific and technical activities">Professional, scientific and technical activities</option>
                                                          <option value="Administrative and support service activities">Administrative and support service activities</option>
                                                          <option value="Public administration and defense; compulsory social security">Public administration and defense; compulsory social security</option>
                                                          <option value="Education">Education</option>
                                                          <option value="Human health and social work activities">Human health and social work activities</option>
                                                          <option value="Arts, entertainment and recreation">Arts, entertainment and recreation</option>
                                                          <option value="Other service activities">Other service activities</option>
                                                          <option value="Information services">Information services</option>
                                                          <option value="Research and development">Research and development</option>
                                                          <option value="Financial planning">Financial planning</option>
                                                          <option value="Humanitarian services">Humanitarian services</option>
                                                          <option value="Domestic activities">Domestic activities</option>
                                                        <option>others</option>
                                                    </select>
                                                </div>
                                        </div>
                                         <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        
                                        <div></div>
                                        <div></div>
                                        
                                        <div class="flex justify-end mt-5">
                                             <button id="submitgroups" type="button" class="btn">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Submit</span>
                                            </button>
                                            <!-- <button id="submitgroups" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                            <!--    <div class="btnloader" style="display: none;"></div>-->
                                            <!--    <span>Submit</span>-->
                                            <!--</button>-->
                                        </div>
                                        
                                    </div> 
                                        </div>
                            
                                    </div>
                                
                            
                                
                                </form>
                            <hr class="my-3">
                            <div id="groupofguestsview" class="hidden">
                                <div class="table-content">
                                    <table id="tableer">
                                        <thead>
                                            <tr>
                                                 <th style="width: 20px">s/n</th>
                                                <th>Group</th>
                                                <th>Contact</th>
                                                <th>Travel Agent</th>
                                                <th>Company</th>
                                                <th>Email</th>
                                                <th>Country</th>
                                                <th>city</th>
                                                <th>Language</th>
                                                <th>Group Type</th>
                                                <th>Source</th>
                                                <th>Industry</th>
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
                            
                            <div id="modalform" onclick="if(event.target.id == 'modalform')returngroupcontent()" class="z-[100] w-screen h-screen flex justify-center items-center fixed bg-[#5a5a5a3e] top-0 left-0 p-10 overflow-auto hidden">
                                <div id="viewformtoedit" class="animate__animated animate__fadeIn max-w-[80%] w-fit relative bg-[#f5f5f6] p-10 rounded-lg shadow-lg">
                                    
                                    
                                
                                </div>  
                            </div>
                        
                        </section>  