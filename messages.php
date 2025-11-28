       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>Messages</span>
                            </p>
                            
                             <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                                <!--<li id="rccview" class="me-2 cp viewer" onclick="did('guestsreservationsform').classList.add('hidden');this.children[0].classList.add('active', '!text-blue-600');did('lostandfoundview').classList.remove('hidden');this.nextElementSibling.children[0].classList.remove('active', '!text-blue-600');">-->
                                <li id="" class="me-2 cp viewer optioner !text-blue-600 active" name="messagesview" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ">View Messages</p>
                                </li>
                                <li id="iddmessagesform" class="me-2 cp updater  optioner" name="messagesform" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Messages</p>
                                </li>
                            </ul>
                            
                            <form id="messagesform" class="hidden">
                                     <ol class="flex items-center !text-xs w-full  p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white mt-4 shadow-sm sm:text-base  sm:p-4 sm:space-x-4 rtl:space-x-reverse">
                                   
                                <div class="flex justify-end w-full">
                                                 <button onclick="printContent('HEMS messages FORM', null, 'messagesform', true)" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>print</span> 
                                                </button>
                                                 <button onclick="exportToPDF('messagesform')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Export PDF</span> 
                                                </button>
                                            </div>
                                </ol>
                                    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                        <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">room number</label>
                                                <input type="text" name="roomnumber" id="roomnumber" list="hems_roomnumber_id" onchange="checkdatalist(this);" class="form-control comp" placeholder="Enter Room Number">
                                            </div>
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">message from</label>
                                                <input type="text" name="messagefrom" id="messagefrom" class="form-control comp" placeholder="Enter Message From">
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-1  lg:grid-cols-2 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">send as email</label>
                                                <select  name="sendasemail" id="sendasemail" class="form-control comp">
                                                    <option>YES</option>
                                                    <option>NO</option>
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">Document</label>
                                                <div id="imagePreview"></div>
                                                <input type="file" name="document" id="document" class="form-control" onchange="previewImage('document')">
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-1 !mb-5 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">message</label>
                                                <textarea name="message" id="message" class="form-control comp" placeholder="Enter Message"></textarea>
                                            </div>
                                        </div>
                                        <div id="messagestatuscontainer" class="form-group hidden">
                                            <label for="logoname" class="control-label">message status</label>
                                            <select name="messagestatus" id="messagestatus" class="form-control comp">
                                                <option>PENDING</option>
                                                <option>DELIVERED</option>
                                            </select>
                                        </div>
                                        
                             
                                    </div>
                                
                            
                                
                                    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                          <div class="flex justify-end mt-5 gap-4">
                                                  <div class="flex w-full justify-start items-end mb-10"></div>
                                                 <button id="submit" type="button" class="btn">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Submit</span> 
                                                </button>
                                                <!-- <button id="submit" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div>-->
                                                <!--    <span>Submit</span> -->
                                                <!--</button>-->
                                            </div>
                                            
                                    </div>
                                </form>
                            <hr class="my-3">
                                    <div id="messagesview" class="">
                            <div class="flex justify-end w-full my-4">
                                                <!-- <button onclick="printContent('HEMS messages VIEW', null, 'messagesview', true)" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div>-->
                                                <!--    <span>print</span> -->
                                                <!--</button>-->
                                                <!-- <button onclick="exportToPDF('tableer')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div> -->
                                                <!--    <span>Export PDF</span> -->
                                                <!--</button>-->
                                                 <button onclick="exportToExcel('messagesview', 'HEMS messages VIEW')" type="button" class="btn">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Export Excel</span> 
                                                </button> 
                                                <!-- <button onclick="exportToExcel('messagesview', 'HEMS messages VIEW')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div>-->
                                                <!--    <span>Export Excel</span> -->
                                                <!--</button> -->
                                            </div>
                                <div class="table-content">
                                    <table id="tableer">
                                        <thead>
                                            <tr>
                                                 <th style="width: 20px">s/n</th>
                                                <th>room number</th>
                                                <th>message</th>
                                                <th>message&nbsp;from</th>
                                                <th>send&nbsp;as&nbsp;email</th>
                                                <th>message&nbsp;status</th>
                                                <th>Sent&nbsp;at</th>
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