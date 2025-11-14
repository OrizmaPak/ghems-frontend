       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>room cleaning checklist</span>
                            </p>
                            

                            <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                                <li id="rccview" class="me-2 cp" onclick="did('roomcleaningchecklistform').classList.add('hidden');this.children[0].classList.add('active', '!text-blue-600');did('roomcleaningchecklistview').classList.remove('hidden');this.nextElementSibling.children[0].classList.remove('active', '!text-blue-600');">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50  !text-blue-600 active">View</p>
                                </li>
                                <li id="rccupdatechecklist" class="me-2 cp" onclick="did('roomcleaningchecklistform').classList.remove('hidden');this.children[0].classList.add('active', '!text-blue-600');did('roomcleaningchecklistview').classList.add('hidden');this.previousElementSibling.children[0].classList.remove('active', '!text-blue-600');">
                                    <p class="inline-block p-4 bg-gray-100 rounded-t-lg">Update Checklist</p>
                                </li>
                            </ul>

                            <form id="roomcleaningchecklistform" class="hidden">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 !mb-5 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">supervisor</label>
                                            <input type="text" name="supervisor" id="supervisor" list="hems_userlist_id" onchange="checkdatalist(this)" class="form-control comp" placeholder="Enter Supervisor">
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Room Number</label>
                                            <input type="text" name="roomnumber" id="roomnumber" list="hems_roomnumber_id" onchange="checkdatalist(this)" class="form-control comp" placeholder="Enter Room Number">
                                        </div>
                                    <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">entry date</label>
                                            <input type="datetime-local" name="entrydate" id="entrydate" class="form-control comp" placeholder="Enter Description">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">shift</label>
                                            <select name="shift" id="shift" class="form-control comp">
                                                <option value=''>-- Select Shift --</option>
                                                <option>DAY SHIFT</option>
                                                <option>NIGHT SHIFT</option>
                                            </select>
                                        </div>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 !mb-5 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">items</label>
                                            <!--<textarea name="items" id="items" class="form-control comp" placeholder="Enter Items"></textarea>-->
                                            <div class="border min-h-[200px] flex-wrap h-fit flex gap-3 p-2" id="checklistitemscontainer">
                                                Loading...
                                                <!--<div class="flex w-fit h-fit cp items-center ps-4 border pr-3 border-gray-200 rounded">-->
                                                <!--    <input checked id="bordered-checkbox-2" type="checkbox" value="" name="bordered-checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded ">-->
                                                <!--    <label for="bordered-checkbox-2" class="w-full py-4 ms-2 text-sm font-medium text-black">Checked state</label>-->
                                                <!--</div>-->
                                            </div>
                                        </div>
                                    </div>
                                    <div >
                        <div class="table-content">
                            
                            <table>
                                <thead>
                                    <tr>
                                        <th style="width: 20px">s/n</th>
                                        <th style="width: 400px">items</th>
                                        <th>status</th>
                                        <th>action</th>
                                    </tr>
                                </thead>
                                <tbody id="tabledat">
                                    <!--<tr>-->
                                    <!--    <td >1</td>-->
                                    <!--    <td >itemname</td>-->
                                    <!--    <td >-->
                                    <!--        <div class="flex items-center my-3">-->
                                    <!--             <span class="ms-3 text-sm font-medium text-red-900 mr-2">No</span>-->
                                    <!--            <label class="relative inline-flex items-center cursor-pointer">-->
                                    <!--              <input type="checkbox" value="" class="sr-only peer">-->
                                    <!--              <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>-->
                                    <!--              <span class="ms-3 text-sm font-medium text-green-900">Yes</span>-->
                                    <!--            </label>-->
                                    <!--        </div>-->
                                    <!--    </td>-->
                                    <!--</tr>-->
                                </tbody>
                            </table>
                        </div>
                        <div class="table-status"></div>
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
                            <div class="" id="roomcleaningchecklistview">
                        <div class="table-content">
                            <div class="flex items-center my-3 hidden">
                                  <span class="ms-3 text-sm font-medium text-red-900 mr-2">No</span>
                                <label class="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" value="" class="sr-only peer">
                                  <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                  <span class="ms-3 text-sm font-medium text-green-900">Yes</span>
                                </label>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th style="width: 20px">s/n</th>
                                        <th>Supervisor</th>
                                        <th>room number</th>
                                        <th>items</th>
                                        <th>entry date</th>
                                        <th>SHIFT</th>
                                        <th>action</th>
                                    </tr>
                                </thead>
                                <tbody id="tabledata">
                                    <tr>
                                        <td colspan="100%" class="text-center opacity-70"> Table is empty NB: toggle hidden</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="table-status"></div>
                    </div> 
                    
                    <div id="roomcleaningchecklistmodal" onclick="if(event.target.id === 'roomcleaningchecklistmodal')this.classList.add('hidden')" class="hidden w-full h-full bg-[#0000004a] fixed top-0 left-0 overflow-y-auto flex justify-center items-start">
                                <div class="w-fit max-w-[90%] mt-8 min-w-[500px] h-fit min-h-[400px] bg-white p-2 rounded-md shadow-lg">
                                    
                                    <div class="w-full py-2 flex justify-between">
                                        <p id="modaltitle" class="text-md font-bold">DETAILS VIEW FOR DAILY ASSIGNMENT SHEET</p>
                                        <span onclick="document.getElementById('roomcleaningchecklistmodal').classList.add('hidden')" class="cp material-symbols-outlined group-hover:text-primary-g"
                                           style="font-size: 20px;">close</span>
                                    </div>
                                    
                                    <hr class="mb-4"/>
                                    
                                    <p class="!text-sm font-thin capitalize flex"><span class="w-[180px]">supervisor: </span><span id="rccsupervisor" class="uppercase !text-sm font-semibold" style=""></span></p>
                                    <hr class="opacity-[0.3]"/>
                                    <p class="!text-sm font-thin capitalize flex"><span class="w-[180px]">room number: </span><span class="!text-sm font-semibold" id="rccroomnumber" style="">  </span></p>
                                    <hr class="opacity-[0.3]"/>
                                    <p class="!text-sm font-thin capitalize flex"><span class="w-[180px]">entry date: </span><span class="!text-sm font-semibold" id="rccentrydate" style=""> </span> </p>
                                    <hr class="opacity-[0.3]"/>
                                    <p class="!text-sm font-thin capitalize flex"><span class="w-[180px]">shift: </span><span id="rccshift" class="uppercase !text-sm font-semibold" style=""></span></p>
                                    <hr class="opacity-[0.3]"/>
                                    <!--<p class="!text-sm font-thin capitalize" style="marginLeft: 20px;">Description: <span id="vpodesc" class="font-semibold" style=""></span> </p>-->
                                    
                                    
                                       <form id="modalcleanform" class="table-content my-4">
                                           <input type="text" class="hidden" name="supervisor" id="rcccsupervisor" />
                                           <input type="text" class="hidden" name="roomnumber" id="rcccroomnumber" />
                                           <input type="text" class="hidden" name="entrydate" id="rcccentrydate" />
                                           <input type="text" class="hidden" name="shift" id="rcccshift" />
                                            <table>
                                                <thead>
                                                    <tr>
                                                       <th>s/n </th>
                                                        <th> Item </th>
                                                        <th> status </th>
                                                    </tr>
                                                </thead>
                                                <tbody id="tabledatarcc">
                                                   <tr>
                                                        <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                                <div class="flex justify-end mt-5">
                                             <button id="normalsavebtn" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Save</span>
                                            </button>
                                        </div>
                                        </form>
                                </div>
                                
                            </div>
                    
                            <datalist id="assignmentitems"></datalist>
                        
                        </section>  