       <section class="animate__animated animate__fadeIn max-w-full">
                            <p class="page-title">
                                <span>Track</span>
                            </p>
                            
                             <hr class="my-3"> 
                            
                            <!--<div id="" class="bg-white xl:border !max-w-[100%] overflow-auto rounded py-14 px-7 drop-shadow-sm pt-4">-->
                            <div id="" class="bg-white xl:border overflow-auto rounded py-14 px-7 drop-shadow-sm pt-4">
                                
                                
                                <div id="searcharrivalsformcontainer">
                                    <div class="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 " role="alert">
                                      <span class="font-medium">Note!</span> While a room is CHECKED IN by guest, enter the room number here to track the reference. This grid will also show other rooms booked in the reservation.
                                    </div>
                                    <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 hidden">
                                        <!--<li id="rccview" class="me-2 cp viewer" onclick="did('guestsreservationsform').classList.add('hidden');this.children[0].classList.add('active', '!text-blue-600');did('lostandfoundview').classList.remove('hidden');this.nextElementSibling.children[0].classList.remove('active', '!text-blue-600');">-->
                                        <li id="iddguestsreservationsform1" class="me-2 cp viewer optioner !text-blue-600 active" name="guestsreservationsform" >
                                            <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Arrivals</p>
                                        </li>
                                        <!--<li id="iddcheckinform1" class="me-2 cp updater optioner" name="viewguestprofiles">-->
                                        <!--    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ">checkin</p>-->
                                        <!--</li>-->
                                    </ul>
                                            <div id="trackprint">
                                        <form id="searcharrivalsform" class="">
                                        <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                            <!--<div class="grid grid-cols-1 !mb-5 lg:grid-cols-3 gap-10">-->
                                            <!--    <div class="form-group">-->
                                            <!--        <label for="logoname" class="control-label">Room</label>-->
                                            <!--        <input type="text"  name="searchtext" id="searchtext" class="form-control comp" >-->
                                            <!--    </div>-->
                                            <!--    <div class="form-group">-->
                                            <!--        <label for="logoname" class="control-label">status</label>-->
                                            <!--        <select name="arrivaldate" id="arrivaldate" readonly class="form-control" >-->
                                            <!--            <option value="">-- select status --</option>-->
                                            <!--            <option>CHECKED IN</option>-->
                                            <!--            <option>RESERVED</option>-->
                                            <!--        </select>-->
                                            <!--    </div>-->
                                            <!--</div>-->
                                            <div class="grid grid-cols-1 !mb-5 lg:grid-cols-4 gap-10 border p-7 rounded shadow bg-blue-400">
                                                <div class="form-group col-span-3 mx-auto">
                                                    <label for="logoname" class="control-label text-white">Room</label>
                                                    <input type="text" name="roomnumber " id="roomnumber" class="form-control bg-white" >
                                                </div>
                                                <div class="flex items-end mx-auto">
                                                    <button id="submit" type="button" class="w-full h-[40px] md:w-max bg-white text-sm capitalize text-blue-400 px-4 py-1 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                        <div class="btnloader" style="display: none;"></div>
                                                        <span class="material-symbols-outlined">send</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <!--<div class="grid grid-cols-1 !mb-5 lg:grid-cols-1 gap-10">-->
                                            <!--    <div class="form-group">-->
                                            <!--        <label for="logoname" class="control-label">Nights</label>-->
                                            <!--        <input type="text" name="night" id="night" readonly class="form-control">-->
                                            <!--    </div>-->
                                            <!--</div>-->
                                            
                                
                                        </div>
                                    </form>
                                                
                                        <div class="table-content  lg:max-w-[1000px]">
                                    <table id="tableer">
                                        <thead>
                                            <tr>
                                                 <th style="width: 20px">s/n</th> 
                                                <th>ref</th>
                                                <th>rooms</th>
                                                <th>Arrival&nbsp;Date</th>
                                                <th>rate</th>
                                                <th>discount</th>
                                                <th>plan&nbsp;amount</th>
                                                <th>plan&nbsp;discount</th>
                                                <th>Amount</th>
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
                                
                                <div class="flex justify-end mt-5">
                                    <!-- <button id="submittrack" type="button" class="w-full h-[45px] md:w-max text-white text-sm capitalize bg-blue-400 px-4 py-1 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                    <!--    <div class="btnloader" style="display: none;"></div>-->
                                    <!--    <span>Submit</span> -->
                                    <!--</button>-->
                                    <!--<div id="printout" class="flex justify-end w-full my-4">-->
                                    <!--             <button onclick="printContent('HEMS track', null, 'trackprint', true)" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                    <!--                <div class="btnloader" style="display: none;"></div>-->
                                    <!--                <span>print</span> -->
                                    <!--            </button>-->
                                    <!--             <button onclick="exportToPDF('trackprint')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                    <!--                <div class="btnloader" style="display: none;"></div> -->
                                    <!--                <span>Export PDF</span> -->
                                    <!--            </button>-->
                                    <!--             <button onclick="exportToExcel('checkinview', 'HEMS CHECKIN VIEW')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                    <!--                <div class="btnloader" style="display: none;"></div>-->
                                    <!--                <span>Export Excel</span> -->
                                    <!--            </button> -->
                                    <!--        </div>-->
                                </div>
                                
                            </div>
                        
                        </section>  
                        
                        
  <!--                      <div id="modalreceipt" onclick="if(event.target.id == 'modalreceipt')this.classList.add('hidden')" class="!z-[100] w-screen h-screen fixed bg-[#5a5a5a3e] top-0 left-0 p-10 overflow-auto hidden">-->
                               
  <!--                             <div id="viewformtoedit" class="animate__animated animate__fadeIn w-[80%] w-fit mx-auto relative bg-[white] p-10 rounded-lg shadow-lg">-->
                                   
  <!--                                 <div id="trackcontainer" class="w-full mx-auto border rounded shadow p-10 bg-white relative ">-->
  <!--                                  <div class="w-full flex justify-end phide">-->
  <!--                                          <span class="material-symbols-outlined text-red-500 cp hover:scale-[1.3] transition-all" onclick="did('modalreceipt').classList.add('hidden')">close</span>-->
  <!--                                      </div>-->
  <!--                      		<div class="flex mb-8 justify-between">-->
  <!--                      			<div class="w-2/4">-->
  <!--                      				<div class="mb-2 md:mb-1 md:flex items-center">-->
  <!--                      					<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Ref No.</label>-->
  <!--                      					<div class="flex-1">-->
  <!--                      					<input id="trackno" readonly class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="eg. #INV-100001">-->
  <!--                      					</div>-->
  <!--                      				</div>-->
                        
  <!--                      				<div class="mb-2 md:mb-1 md:flex items-center">-->
  <!--                      					<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Reservation Date</label>-->
  <!--                      					<div class="flex-1">-->
  <!--                      					<input id="resdate" readonly class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker" type="text" placeholder="eg. 17 Feb, 2020"  >-->
  <!--                      					</div>-->
  <!--                      				</div>-->
  <!--                      				<div class="mb-2 md:mb-1 md:flex items-center">-->
  <!--                      					<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Arrival</label>-->
  <!--                      					<div class="flex-1">-->
  <!--                      					<input id="arrdate" readonly class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker" type="text" placeholder="eg. 17 Feb, 2020"  >-->
  <!--                      					</div>-->
  <!--                      				</div>-->
  <!--                      				<div class="mb-2 md:mb-1 md:flex items-center">-->
  <!--                      					<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Departure</label>-->
  <!--                      					<div class="flex-1">-->
  <!--                      					<input id="depedate"  readonly class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker" type="text" placeholder="eg. 17 Feb, 2020"  >-->
  <!--                      					</div>-->
  <!--                      				</div>-->
  <!--                      				<div class="mb-2 md:mb-1 md:flex items-center">-->
  <!--                      					<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">track Date</label>-->
  <!--                      					<div class="flex-1">-->
  <!--                      					<input id="trackdate" readonly class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker" type="text" placeholder="eg. 17 Feb, 2020"  >-->
  <!--                      					</div>-->
  <!--                      				</div>-->
  <!--                      				<div class="mb-2 md:mb-1 md:flex items-center">-->
  <!--                      					<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Payment Method</label>-->
  <!--                      					<div class="flex-1">-->
  <!--                      					<input id="pmethod" readonly class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker" type="text" placeholder="eg. 17 Feb, 2020"  >-->
  <!--                      					</div>-->
  <!--                      				</div>-->
                        
                        				<!--<div class="mb-2 md:mb-1 md:flex items-center">-->
                        				<!--	<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Due date</label>-->
                        				<!--	<span class="mr-4 inline-block hidden md:block">:</span>-->
                        				<!--	<div class="flex-1">-->
                        				<!--	<input class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker-2" id="datepicker2" type="text" placeholder="eg. 17 Mar, 2020" x-model="trackDueDate" x-on:change="trackDueDate = document.getElementById('datepicker2').value" autocomplete="off" readonly="">-->
                        				<!--	</div>-->
                        				<!--</div>-->
  <!--                      			</div>-->
  <!--                      			<div>-->
  <!--                      				<span id="comppname" class="xl:w-[250px] pb-10 font-bold text-2xl text-base block py-3 pl-5 selection:bg-white uppercase font-heebo text-primary-g text-right">He<span class="text-gray-400">ms track</span></span>-->
  <!--                      				<div class="border-b-2 border-gray-300 pb-8 mb-8 text-right" id="compinfo">-->
                                            <!--<h2 class="text-2xl font-bold mb-4">Company Info:</h2>-->
                                            <!--<div class="text-gray-700 mb-2"></div>-->
                                            <!--<div class="text-gray-700 mb-2"></div>-->
                                            <!--<div class="text-gray-700 mb-2"></div>-->
                                            <!--<div class="text-gray-700"></div>-->
  <!--                                      </div>-->
  <!--                      				<div class="flex justify-end phide">-->
  <!--                      				<div onclick="printContent('HEMS track', null, 'viewformtoedit', true)" class="relative mr-4 inline-block">-->
  <!--                      					<div class="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 inline-flex items-center justify-center" >-->
  <!--                      						<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-printer" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">-->
  <!--                      							<rect x="0" y="0" width="24" height="24" stroke="none"></rect>-->
  <!--                      							<path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"></path>-->
  <!--                      							<path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"></path>-->
  <!--                      							<rect x="7" y="13" width="10" height="8" rx="2"></rect>-->
  <!--                      						</svg>				  -->
  <!--                      					</div>-->
  <!--                      					<div onclick="exportToPDF('viewformtoedit')" class="z-40 shadow-lg text-center w-32 block absolute right-0 top-0 p-2 mt-12 rounded-lg bg-gray-800 text-white text-xs" style="display: none;">-->
  <!--                      						Print this track!-->
  <!--                      					</div>-->
  <!--                      				</div>-->
  <!--                      				<div onclick="printContent('HEMS track', null, 'viewformtoedit', true)" class="relative mr-4 inline-block">-->
  <!--                      					<div class="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 inline-flex items-center justify-center" onclick="printtrack()">-->
  <!--                      						<span class="material-symbols-outlined">picture_as_pdf</span>			  -->
  <!--                      					</div>-->
  <!--                      					<div  class="z-40 shadow-lg text-center w-32 block absolute right-0 top-0 p-2 mt-12 rounded-lg bg-gray-800 text-white text-xs" style="display: none;">-->
  <!--                      						Print this track!-->
  <!--                      					</div>-->
  <!--                      				</div>-->
  <!--                      				<div onclick="did('modalreceipt').classList.add('hidden')" class="relative inline-block">-->
  <!--                      					<div class="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 inline-flex items-center justify-center" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false" @click="printtrack()">-->
  <!--                      						<span class="material-symbols-outlined text-red-500 cp-500">cancel</span>	  -->
  <!--                      					</div>-->
  <!--                      					<div x-show.transition="showTooltip" class="z-40 shadow-lg text-center w-32 block absolute right-0 top-0 p-2 mt-12 rounded-lg bg-gray-800 text-white text-xs" style="display: none;">-->
  <!--                      						cancel-->
  <!--                      					</div>-->
  <!--                      				</div>-->
                        				
  <!--                      			</div>-->
  <!--                      			</div>-->
  <!--</div>-->
                        
                                   
  <!--                                 <div class="table-content  lg:max-w-[1000px]">-->
  <!--                                  <table id="tableer">-->
  <!--                                      <thead>-->
  <!--                                          <tr>-->
  <!--                                               <th style="width: 20px">s/n</th> -->
  <!--                                               <th>ref</th>-->
  <!--                                              <th>rooms</th>-->
  <!--                                              <th>Arrival&nbsp;Date</th>-->
  <!--                                              <th>rate</th>-->
  <!--                                              <th>discount</th>-->
  <!--                                              <th>plan&nbsp;amount</th>-->
  <!--                                              <th>plan&nbsp;discount</th>-->
  <!--                                              <th>Amount</th>-->
  <!--                                          </tr>-->
  <!--                                      </thead>-->
  <!--                                      <tbody id="tabledata2">-->
  <!--                                          <tr>-->
  <!--                                              <td colspan="100%" class="text-center opacity-70"> Table is empty</td>-->
  <!--                                          </tr>-->
  <!--                                      </tbody>-->
  <!--                                  </table>-->
  <!--                              </div>-->
  <!--                                      <div class="table-status"></div>-->
  <!--                             </div>-->
                               
  <!--                            <div class="w-full flex justify-center p-2">-->
  <!--                             <p>Developed by: <span class="cp text-blue-400">Mira Technologies</span></p>-->
  <!--                            </div>-->
                               
  <!--                      </div>-->
                        
  <!--                      </div>-->