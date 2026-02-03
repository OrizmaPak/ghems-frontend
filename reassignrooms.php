       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>RE-ASSIGN ROOMS</span>
                            </p>
                            
                             <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 cark:border-gray-700 cark:text-gray-400">
                                <li id="" class="me-2 cp viewer optioner !text-blue-600 active" name="reassignroomsview" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ">Check-In</p>
                                </li>
                                <li id="iddcheckinform" class="me-2 cp updater optioner" name="reassignroomsform" >
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Re-Assign room</p>
                                </li>
                            </ul>
                            
                                <div id="modalform" onclick="if(event.target.id == 'modalform')this.classList.add('hidden')" class="z-[100] w-screen h-screen flex justify-center items-center fixed bg-[#5a5a5a3e] top-0 left-0 p-10 pt-[10%] overflow-auto hidden">
                                    <div id="modalformguest" class=" mt-[10%] animate__animated animate__fadeIn w-[90%] w-fit relative bg-[white] p-10 rounded-lg shadow-lg">
                                        
                                    
                                    </div>  
                                </div>
                                
                                <form id="reassignroomsform" class="hidden">    
                                     <ol class="flex items-center !text-xs w-full  p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white mt-4 shadow-sm sm:text-base  sm:p-4 sm:space-x-4 rtl:space-x-reverse">
                                   
                                <!--<div class="flex justify-end w-full">-->
                                <!--                 <button onclick="printContent('HEMS CHECKIN FORM', null, 'checkinform', true)" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                <!--                    <div class="btnloader" style="display: none;"></div>-->
                                <!--                    <span>print</span> -->
                                <!--                </button>-->
                                <!--                 <button onclick="exportToPDF('checkinform')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                <!--                    <div class="btnloader" style="display: none;"></div>-->
                                <!--                    <span>Export PDF</span> -->
                                <!--                </button>-->
                                <!--            </div>-->
                                </ol>
                                                <!--<div class="grid grid-cols-1 lg:grid-cols-4 gap-2 mb-2">-->
                                                <!--    <div class="form-group col-span-3">-->
                                                <!--        <label for="logoname" class="control-label text-md">Guest</label>-->
                                                <!--        <input type="text"  name="guest1" id="guest1" list="allguest" onchange="checkdatalist(this, 'guestid', 'allguest2')" class="bg-white form-control !p-2 comp bg-white" placeholder="Enter Guest Name">-->
                                                <!--        <input type="text"  name="guestid1" id="guestid1" class="bg-white form-control !p-2 hidden" placeholder="">-->
                                                <!--    </div>-->
                                                <!--    <div class="w-full flex items-end justify-start">-->
                                                <!--        <button onclick="openguestform('guest1', 'guestid1);did('modalform').classList.remove('hidden')" type="button" class="w-full h-[35px] bg-[#468df7] md:w-max text-white text-sm capitalize p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--                <div class="btnloader" style="display: none;"></div>-->
                                                <!--                <span>Add&nbsp;New&nbsp;Guest</span> -->
                                                <!--        </button>-->
                                                <!--        <button onclick="this.parentElement.parentElement.remove()" type="button" class="w-full h-[35px] bg-red-400 md:w-max text-white text-sm capitalize p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--                <div class="btnloader" style="display: none;"></div>-->
                                                <!--                <span>Delete</span> -->
                                                <!--        </button>-->
                                                <!--    </div>-->
                                                <!--</div>-->
                                
                                
                            
                                
                                    <div class="flex flex-col  bg-white/90 p-5 pt-0 rounded-sm">
                                        <p class="page-title">
                                            <span>RESERVATION</span>
                                        </p>
                                        
                                        <input type="hidden" id="oldroomnumber" name="oldroomnumber" />
                                        <input type="hidden" id="oldbalance" name="oldbalance" />
                                        <input type="hidden" id="oldreference" name="oldreference" />
                                    
                                        <!--arrival departure reservationtype nights-->
                                        <div class="grid grid-cols-1 !mb-2 lg:grid-cols-2 gap-10">
                                            <div class="grid grid-cols-1 !mb-2 lg:grid-cols-5 gap-10">
                                                <div class="form-group col-span-2">
                                                    <label for="logoname" class="control-label text-md">arrival date</label>
                                                    <input type="datetime-local" onchange="datedifference()" name="arrivaldate" id="arrivaldate" class="bg-white form-control !p-2 comp" placeholder="Enter arrival date">
                                                </div>
                                                <div class="form-group col-span-2">
                                                    <label for="logoname" class="control-label text-md">departure date</label>
                                                    <input type="datetime-local" onchange="datedifference()" name="departuredate" id="departuredate" class="bg-white form-control !p-2 comp" placeholder="Enter departure date">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label text-md">Nights</label>
                                                    <input type="number" readonly name="numberofnights" id="numberofnights" class="bg-white form-control !p-2 comp2" placeholder="Nights">
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-1 !mb-2 lg:grid-cols-2 gap-10">
                                            <div class="form-group">
                                                    <label for="logoname" class="control-label text-md">reservation type</label>
                                                    <select onchange="reservationtyper(this)" name="reservationtype" id="reservationtype" class="bg-white form-control !p-2">
                                                        <option selected>GUARANTEED</option>
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label text-md">type of guest</label>
                                                    <select name="typeofguest" id="typeofguest" class="bg-white form-control !p-2 ">
                                                        <option value="">-- Select Type of Guest --</option>
                                                        <option>Compliment</option>
                                                        <option>Direct</option>
                                                        <option>Corporate</option>
                                                        <option>Travel Agent</option>
                                                        <option>House Use</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!--group company travel agent channel-->
                                        <div class="grid grid-cols-1 !mb-2 lg:grid-cols-2 gap-10">
                                            <div class="grid grid-cols-1 !mb-2 lg:grid-cols-2 gap-10">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label text-md">group</label>
                                                    <select name="group_id" id="group_id" class="bg-white form-control !p-2 comp2" placeholder="Enter group">
                                                        <option>Loading...</option>
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label text-md">company</label>
                                                    <select name="company" id="company" class="bg-white form-control !p-2 comp2" placeholder="Enter company">
                                                        <option>Loading...</option>
                                                    </select>
                                                </div>
                                            </div> 
                                            <div class="grid grid-cols-1 !mb-2 lg:grid-cols-2 gap-10">
                                                <!--<div class="form-group hidden">-->
                                                <!--    <label for="logoname" class="control-label text-md">room category</label>-->
                                                <!--    <input type="text" name="roomcategory" id="roomcategory" onchange="" class="bg-white form-control !p-2 comp2" placeholder="Enter room category">-->
                                                <!--</div>-->
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label text-md">travel agent</label>
                                                    <select name="travelagent" id="travelagent" class="bg-white form-control !p-2 comp2" placeholder="Enter travel agent">
                                                        <option>Loading...</option>
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label text-md">channel</label>
                                                     <input type="text" name="channel" id="channel" class="bg-white form-control !p-2 comp2" placeholder="Enter channel">
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="grid grid-cols-1 relative !mb-2 lg:grid-cols-2 gap-10">
                                            <div class="form-group !mb-2">
                                                    <label for="logoname" class="control-label text-md">purpose of stay</label>
                                                    <input type="text" name="purposeofvisit" id="purposeofvisit" class="bg-white form-control !p-2" >
                                            </div>
                                        <div class="grid grid-cols-1 relative !mb-2 lg:grid-cols-2 gap-10">
                                                        <div class="form-group">
                                                            <label for="logoname" class="control-label text-md">industry</label> 
                                                            <select name="industry" id="industry" class="bg-white form-control !p-2 ">
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
                                                        <div class="form-group">
                                                            <label for="logoname" class="control-label text-md">source</label>
                                                            <select name="source" id="source" class="bg-white form-control !p-2 ">
                                                                <option value="">-- Select source --</option>
                                                                <option>Guest Direct</option>
                                                                <option>Social Media Corporate</option>
                                                                <option>Online Booking</option>
                                                            </select>
                                                        </div>
                                         </div>
                                        </div>
                                        <div class="w-full flex justify-end">
                                            <button onclick="checkinaddroom()" id="initialroombtn" type="button" class="relative bottom-0 right-0 text-white w-fit h-fit flex items-center justify-center bg-green-400 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 me-1 mb-1 cark:bg-green-600 cark:hover:bg-green-700 focus:outline-none cark:focus:ring-green-800"><span class="material-symbols-outlined">add</span>Add&nbsp;Room</button>
                                        </div>
                                        
                                        <div id="roomfullcontainer" class="relative border rounded py-2 px-2 mt-6 !mb-2 shadow-sm bg-[#3b82f6]">
                                            
                                            <!--////////////////////////////////////////////////////////////////////-->
                                        <!--    <div class="relative border rounded py-3 px-4 mt-6 !mb-2.5 bg-[#f5f5f5]">-->
                                        <!--        <button onclick="this.parentElement.remove()" type="button" class="absolute top-[-25px] shadow right-0 flex justify-center items-center text-white w-10 h-10 bg-red-400 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1 me-1 mb-1 cark:bg-red-600 cark:hover:bg-red-700 focus:outline-none cark:focus:ring-red-800"><span class="material-symbols-outlined">delete</span></button>-->
                                        <!--        <button type="button" class="absolute top-[-25px] shadow right-14 flex justify-center items-center text-white w-10 h-10 bg-green-400 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 me-1 mb-1 cark:bg-green-600 cark:hover:bg-green-700 focus:outline-none cark:focus:ring-green-800"><span class="material-symbols-outlined">add</span></button>-->
    
                                                <!--initial guest-->
                                        <!--        <div class=" border rounded p-2 !mb-4 bg-[#d1f2f7]">-->
                                        <!--        <div class="grid grid-cols-1 lg:grid-cols-4 gap-2">-->
                                        <!--            <div class="form-group col-span-3">-->
                                        <!--                <label for="logoname" class="control-label text-md">Guest</label>-->
                                        <!--                <input type="text"  name="guest" id="guest" list="allguest" onchange="checkdatalist(this, 'guestid', 'allguest2')" class="bg-white form-control !p-2 comp bg-white" placeholder="Enter Guest Name">-->
                                        <!--                <input type="text"  name="guestid" id="guestid" class="bg-white form-control !p-2 hidden" placeholder="">-->
                                        <!--            </div>-->
                                        <!--            <div class="w-full flex items-end justify-start">-->
                                        <!--                <button onclick="openguestform('guest', 'guestid);did('modalform').classList.remove('hidden')" type="button" class="w-full h-[35px] bg-[#468df7] md:w-max text-white text-sm capitalize p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                        <!--                        <div class="btnloader" style="display: none;"></div>-->
                                        <!--                        <span>Add&nbsp;New&nbsp;Guest</span> -->
                                        <!--                </button>-->
                                        <!--            </div>-->
                                        <!--        </div>-->
                                        <!--</div>-->
                                        
                                                <!--Room Category room industry source-->
                                        <!--        <div class="grid grid-cols-1 !mb-1 lg:grid-cols-2 gap-10">-->
                                        <!--            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">-->
                                        <!--                <div class="form-group">-->
                                        <!--                    <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">room category</label>-->
                                        <!--                    <select name="roomcategory" id="roomcategory-1" class="bg-white roomcategory form-control !p-1 ">-->
                                                                
                                        <!--                    </select>-->
                                        <!--                </div>-->
                                        <!--                <div class="form-group !flex relative">-->
                                        <!--                    <div class="">-->
                                        <!--                        <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">Room</label>-->
                                                                <!--<input type="text" readonly  id="roomnumber" list="hems_available_roomnumber_id" onchange="checkdatalist(this);getcategoryrateguest(this)" class="bg-white form-control !p-2 comp2" placeholder="Enter root category">-->
                                        <!--                        <input type="text" readonly name="roomnumber"  id="roomnumber-1" class="bg-white form-control roomnumber !p-2 comp2" placeholder="">-->
                                                                <!--<input type="text" name="roomnumber" id="roomnumber1" list="hems_available_roomnumber_id" onchange="checkdatalist(this);getcategoryrateguest(this)" class="bg-white form-control !p-2 comp2" placeholder="Enter root category">-->
                                        <!--                    </div>-->
                                        <!--                    <button id="searchroombtn" onclick="did('roommodal').classList.remove('hidden')" type="button" class="hidden scale-[0.7] absolute top-0 right-0 text-white w-10 h-10 bg-blue-400 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 me-1 mb-1 cark:bg-blue-600 cark:hover:bg-blue-700 focus:outline-none cark:focus:ring-blue-800"><span class="material-symbols-outlined">search</span></button>-->
                                        <!--                </div>-->
                                        <!--            </div>-->
                                        <!--            <div class="grid grid-cols-1 lg:grid-cols-5 gap-10">-->
                                        <!--                    <div class="form-group">-->
                                        <!--                        <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">adults</label> -->
                                        <!--                        <input type="number" onchange="handlecheckinrate('true')" maxlength="2" name="adult" id="adult-1" class="bg-white form-control !p-2 comp" placeholder=""  oninput="enforceMaxLength(this)">-->
                                        <!--                    </div>-->
                                        <!--                    <div class="form-group">-->
                                        <!--                        <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">children</label>-->
                                        <!--                        <input type="number" onchange="handlecheckinrate('true')" maxlength="2" name="child" id="children-1" class="bg-white form-control !p-2 comp2" placeholder=""  oninput="enforceMaxLength(this)">-->
                                        <!--                    </div>-->
                                        <!--                    <div class="form-group">-->
                                        <!--                        <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">Infants</label>-->
                                        <!--                        <input type="number" maxlength="2" name="infant" id="infant-1" class="bg-white form-control !p-2 comp2" placeholder=""  oninput="enforceMaxLength(this)">-->
                                        <!--                    </div>-->
                                        <!--                    <div class="form-group col-span-2">-->
                                        <!--                        <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">rate&nbsp;code</label>-->
                                        <!--                        <input type="text" readonly name="ratecode" id="ratecodee-1" class="bg-transparent !p-1 comp2 border" placeholder="">-->
                                        <!--                    </div>-->
                                        <!--                </div>-->
                                        <!--    </div>-->
                                                
                                        <!--        <div class="grid grid-cols-1 !mb-1 lg:grid-cols-2 gap-10">-->
                                        <!--            <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">-->
                                        <!--                    <div class="form-group">-->
                                        <!--                        <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">plan</label> -->
                                        <!--                        <input type="text" name="plan" readonly id="plan-1" class="bg-transparent !p-1 comp2 border" placeholder="">-->
                                        <!--                    </div>-->
                                        <!--                    <div class="form-group">-->
                                        <!--                        <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">plan amount</label>-->
                                        <!--                        <input type="text" name="planamount" readonly id="planamount-1" class="bg-transparent !p-1 comp2 border" placeholder="">-->
                                        <!--                    </div>-->
                                        <!--                    <div class="form-group">-->
                                        <!--                        <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">rate</label>-->
                                        <!--                        <input type="number" readonly name="roomrate" id="roomrate-1" class="bg-transparent !p-1 comp2 border" >-->
                                                                <!--<select name="roomrate" onchange="getcategoryrateguest(document.getElementById('roomcategory'))" id="roomrate" class="bg-white form-control !p-2 comp2" >-->
                                                                <!--</select>-->
                                        <!--                    </div>-->
                                        <!--                </div>-->
                                        <!--                <div class="grid grid-cols-1 lg:grid-cols-4 gap-10">-->
                                        <!--                    <div class="form-group">-->
                                        <!--                        <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">discount&nbsp;coupon</label> -->
                                        <!--                        <select name="discountcoupon" id="discountcoupon-1" class="bg-white discountcoupon form-control !p-1 comp2">-->
                                                                    
                                        <!--                        </select>-->
                                        <!--                    </div>-->
                                        <!--                    <div class="form-group">-->
                                        <!--                        <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">discount&nbsp;amount</label>-->
                                        <!--                        <input type="text" name="discountamount" id="discountamount-1" class="bg-transparent !p-1 comp2 border" placeholder="">-->
                                        <!--                    </div>-->
                                        <!--                    <div class="form-group">-->
                                        <!--                            <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">plan&nbsp;discount&nbsp;(%)</label> -->
                                        <!--                            <input type="text" name="plandiscountperc" id="plandiscountperc-1" class="bg-white form-control !p-2 comp2" placeholder="">-->
                                        <!--                        </div>-->
                                        <!--                    <div class="form-group">-->
                                        <!--                        <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">plan&nbsp;discount</label>-->
                                        <!--                        <input type="text" readonly name="plandiscountamount" id="plandiscountamount-1" class="bg-transparent !p-1 comp2 border" placeholder="" border>-->
                                        <!--                    </div>-->
                                        <!--                </div>-->
                                        <!--        </div>-->
                                                
                                                    
                                                <!--container for extra guest-->
                                        <!--        <div id="moreguestcontainer" class="">-->
                                        <!--        </div>-->
                                                
                                                    
                                                <!--ratecode rate dicountcoupon discountamount-->
                                                <!--<div class=" border rounded p-2 !mb-2 bg-[#f5f5f5]">-->
                                                        <!--<p class="page-title">-->
                                                        <!--    <span>Rates</span>-->
                                                        <!--</p>-->
                                                            
                                                <!--</div>-->
                                                    
                                                
                                                <!--plan planamount plandiscount plandiscountamount-->
                                                <!--<div class=" border rounded p-2 !mb-4 bg-[#f5f5f5]">-->
                                                <!--        <div class="grid grid-cols-1 !mb-2 lg:grid-cols-2 gap-10">-->
                                                            
                                                <!--        </div>-->
                                                <!--</div>-->
                                                
                                        <!--    </div>-->
                                            <!--///////////////////////////////////////////////////////////////////////-->
                                            <!--////////////////////////////////////////////////////////////////////-->
                                        <!--    <div class="relative border rounded py-3 px-4 mt-6 !mb-2.5 bg-[#f5f5f5]">-->
                                        <!--        <button onclick="this.parentElement.remove()" type="button" class="absolute top-[-25px] shadow right-0 flex justify-center items-center text-white w-10 h-10 bg-red-400 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1 me-1 mb-1 cark:bg-red-600 cark:hover:bg-red-700 focus:outline-none cark:focus:ring-red-800"><span class="material-symbols-outlined">delete</span></button>-->
                                        <!--        <button type="button" class="absolute top-[-25px] shadow right-14 flex justify-center items-center text-white w-10 h-10 bg-green-400 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 me-1 mb-1 cark:bg-green-600 cark:hover:bg-green-700 focus:outline-none cark:focus:ring-green-800"><span class="material-symbols-outlined">add</span></button>-->
    
                                                <!--initial guest-->
                                        <!--        <div class=" border rounded p-2 !mb-4 bg-[#d1f2f7]">-->
                                        <!--        <div class="grid grid-cols-1 lg:grid-cols-4 gap-2">-->
                                        <!--            <div class="form-group col-span-3">-->
                                        <!--                <label for="logoname" class="control-label text-md">Guest</label>-->
                                        <!--                <input type="text"  name="guest" id="guest" list="allguest" onchange="checkdatalist(this, 'guestid', 'allguest2')" class="bg-white form-control !p-2 comp bg-white" placeholder="Enter Guest Name">-->
                                        <!--                <input type="text"  name="guestid" id="guestid" class="bg-white form-control !p-2 hidden" placeholder="">-->
                                        <!--            </div>-->
                                        <!--            <div class="w-full flex items-end justify-start">-->
                                        <!--                <button onclick="openguestform('guest', 'guestid);did('modalform').classList.remove('hidden')" type="button" class="w-full h-[35px] bg-[#468df7] md:w-max text-white text-sm capitalize p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                        <!--                        <div class="btnloader" style="display: none;"></div>-->
                                        <!--                        <span>Add&nbsp;New&nbsp;Guest</span> -->
                                        <!--                </button>-->
                                        <!--            </div>-->
                                        <!--        </div>-->
                                        <!--</div>-->
                                        
                                                <!--Room Category room industry source-->
                                        <!--        <div class="grid grid-cols-1 !mb-1 lg:grid-cols-2 gap-10">-->
                                        <!--            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">-->
                                        <!--                <div class="form-group">-->
                                        <!--                    <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">room category</label>-->
                                        <!--                    <select name="roomcategory" id="roomcategory-2" class="bg-white roomcategory form-control !p-1 ">-->
                                                                
                                        <!--                    </select>-->
                                        <!--                </div>-->
                                        <!--                <div class="form-group !flex relative">-->
                                        <!--                    <div class="">-->
                                        <!--                        <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">Room</label>-->
                                                                <!--<input type="text" readonly  id="roomnumber" list="hems_available_roomnumber_id" onchange="checkdatalist(this);getcategoryrateguest(this)" class="bg-white form-control !p-2 comp2" placeholder="Enter root category">-->
                                        <!--                        <input type="text" readonly name="roomnumber"  id="roomnumber-2" class="bg-white form-control roomnumber !p-2 comp2" placeholder="">-->
                                                                <!--<input type="text" name="roomnumber" id="roomnumber1" list="hems_available_roomnumber_id" onchange="checkdatalist(this);getcategoryrateguest(this)" class="bg-white form-control !p-2 comp2" placeholder="Enter root category">-->
                                        <!--                    </div>-->
                                        <!--                    <button id="searchroombtn" onclick="did('roommodal').classList.remove('hidden')" type="button" class="hidden scale-[0.7] absolute top-0 right-0 text-white w-10 h-10 bg-blue-400 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 me-1 mb-1 cark:bg-blue-600 cark:hover:bg-blue-700 focus:outline-none cark:focus:ring-blue-800"><span class="material-symbols-outlined">search</span></button>-->
                                        <!--                </div>-->
                                        <!--            </div>-->
                                        <!--            <div class="grid grid-cols-1 lg:grid-cols-5 gap-10">-->
                                        <!--                    <div class="form-group">-->
                                        <!--                        <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">adults</label> -->
                                        <!--                        <input type="number" onchange="handlecheckinrate('true')" maxlength="2" name="adult" id="adult-2" class="bg-white form-control !p-2 comp" placeholder=""  oninput="enforceMaxLength(this)">-->
                                        <!--                    </div>-->
                                        <!--                    <div class="form-group">-->
                                        <!--                        <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">children</label>-->
                                        <!--                        <input type="number" onchange="handlecheckinrate('true')" maxlength="2" name="child" id="children-2" class="bg-white form-control !p-2 comp2" placeholder=""  oninput="enforceMaxLength(this)">-->
                                        <!--                    </div>-->
                                        <!--                    <div class="form-group">-->
                                        <!--                        <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">Infants</label>-->
                                        <!--                        <input type="number" maxlength="2" name="infant" id="infant-2" class="bg-white form-control !p-2 comp2" placeholder=""  oninput="enforceMaxLength(this)">-->
                                        <!--                    </div>-->
                                        <!--                    <div class="form-group col-span-2">-->
                                        <!--                        <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">rate&nbsp;code</label>-->
                                        <!--                        <input type="text" readonly name="ratecode" id="ratecodee-2" class="bg-transparent !p-1 comp2 border" placeholder="">-->
                                        <!--                    </div>-->
                                        <!--                </div>-->
                                        <!--    </div>-->
                                                
                                        <!--        <div class="grid grid-cols-1 !mb-1 lg:grid-cols-2 gap-10">-->
                                        <!--            <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">-->
                                        <!--                    <div class="form-group">-->
                                        <!--                        <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">plan</label> -->
                                        <!--                        <input type="text" name="plan" readonly id="plan-2" class="bg-transparent !p-1 comp2 border" placeholder="">-->
                                        <!--                    </div>-->
                                        <!--                    <div class="form-group">-->
                                        <!--                        <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">plan amount</label>-->
                                        <!--                        <input type="text" name="planamount" readonly id="planamount-2" class="bg-transparent !p-1 comp2 border" placeholder="">-->
                                        <!--                    </div>-->
                                        <!--                    <div class="form-group">-->
                                        <!--                        <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">rate</label>-->
                                        <!--                        <input type="number" readonly name="roomrate" id="roomrate-2" class="bg-transparent !p-1 comp2 border" >-->
                                                                <!--<select name="roomrate" onchange="getcategoryrateguest(document.getElementById('roomcategory'))" id="roomrate" class="bg-white form-control !p-2 comp2" >-->
                                                                <!--</select>-->
                                        <!--                    </div>-->
                                        <!--                </div>-->
                                        <!--                <div class="grid grid-cols-1 lg:grid-cols-4 gap-10">-->
                                        <!--                    <div class="form-group">-->
                                        <!--                        <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">discount&nbsp;coupon</label> -->
                                        <!--                        <select name="discountcoupon" id="discountcoupon-2" class="bg-white discountcoupon form-control !p-1 comp2">-->
                                                                    
                                        <!--                        </select>-->
                                        <!--                    </div>-->
                                        <!--                    <div class="form-group">-->
                                        <!--                        <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">discount&nbsp;amount</label>-->
                                        <!--                        <input type="text" name="discountamount" id="discountamount-2" class="bg-transparent !p-1 comp2 border" placeholder="">-->
                                        <!--                    </div>-->
                                        <!--                    <div class="form-group">-->
                                        <!--                            <label for="logoname" class="control-label text-md bg-white relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">plan&nbsp;discount&nbsp;(%)</label> -->
                                        <!--                            <input type="text" name="plandiscountperc" id="plandiscountperc-2" class="bg-white form-control !p-2 comp2" placeholder="">-->
                                        <!--                        </div>-->
                                        <!--                    <div class="form-group">-->
                                        <!--                        <label for="logoname" class="control-label text-md relative top-2 left-[-3px] px-2 rounded border w-fit opacity-[0.7]">plan&nbsp;discount</label>-->
                                        <!--                        <input type="text" readonly name="plandiscountamount" id="plandiscountamount-2" class="bg-transparent !p-1 comp2 border" placeholder="" border>-->
                                        <!--                    </div>-->
                                        <!--                </div>-->
                                        <!--        </div>-->
                                                
                                                    
                                                <!--container for extra guest-->
                                        <!--        <div id="moreguestcontainer" class="">-->
                                        <!--        </div>-->
                                                    
                                                <!--ratecode rate dicountcoupon discountamount-->
                                                <!--<div class=" border rounded p-2 !mb-2 bg-[#f5f5f5]">-->
                                                        <!--<p class="page-title">-->
                                                        <!--    <span>Rates</span>-->
                                                        <!--</p>-->
                                                            
                                                <!--</div>-->
                                                    
                                                
                                                <!--plan planamount plandiscount plandiscountamount-->
                                                <!--<div class=" border rounded p-2 !mb-4 bg-[#f5f5f5]">-->
                                                <!--        <div class="grid grid-cols-1 !mb-2 lg:grid-cols-2 gap-10">-->
                                                            
                                                <!--        </div>-->
                                                <!--</div>-->
                                                
                                        <!--    </div>-->
                                            <!--///////////////////////////////////////////////////////////////////////-->
                                            
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label text-md">Upload any registration document</label>
                                            <div id="imagePreview2"></div>
                                            <input type="file" name="imageurl" id="imageurl" class="bg-white form-control !p-2" onchange="previewImage('imageurl', 'imagePreview2')">
                                        </div>
                                        <div id="modalformone" onclick="if(event.target.id == 'modalformone')this.classList.add('hidden')" class="z-[100] w-screen h-screen flex justify-center items-center fixed bg-[#5a5a5a3e] top-0 left-0 p-10 overflow-auto hidden">
                                            <div id="viewformtoedit" class="animate__animated animate__fadeIn max-w-[80%] w-fit relative bg-[white] p-10 rounded-lg shadow-lg">
                                             <div class="w-full flex justify-end">
                                            <span class="material-symbols-outlined text-red-500 cp hover:scale-[1.3] transition-all" onclick="did('modalformone').classList.add('hidden')">close</span>
                                        </div>
                                             <p class="page-title">
                                                <span>More info</span>
                                            </p>   
                                                
                                        <div id="reservationbiller" class="grid p-2 rounded-md shadow-sm border bg-[#f5f5f5] hidde mb-6">
                                            <!--<input type="text" value="NO" name="billinginfo" id="billinginfo" class="bg-white form-control !p-2 comp2 hidden" readonly placeholder="Enter room rate">-->
                                            <p class="page-title mx-3 !mb-[5px]">
                                                <span>Billing info</span>
                                            </p>
                                            <div class="grid grid-cols-1 !mb-2 lg:grid-cols-1 gap-10 p-3 ">
                                                <!--<div class="form-group">-->
                                                <!--    <label for="logoname" class="control-label text-md">bill to</label>-->
                                                <!--    <input type="text" name="billto" id="billto" class="bg-white form-control !p-2 comp2" readonly placeholder="">-->
                                                <!--</div>-->
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label text-md">Billing info <span class="text-xs text-[blue]" id="mindeposit"></span></label>
                                                    <!--<input type="number" onchange="checkmin(this)" name="amountpaid" id="amountpaid" class="bg-white form-control !p-2 comp2" placeholder="Enter deposit amount">-->
                                                    <select name="billinginfo" id="billinginfo" class="bg-white form-control !p-2 comp2" placeholder="Enter deposit amount">
                                                        <option value="">-- Select Billing Info --</option>
                                                        <option>Bill To Company</option>
                                                        <option>Bill To Guest</option>
                                                        <option>Stay is Complimentary</option>
                                                    </select>
                                                </div>
                                                 <div class="grid grid-cols-1 !mb-2 lg:grid-cols-2 gap-10">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">reservation method</label> 
                                                        <select name="reservationmethod" id="reservationmethod" class="bg-white form-control !p-2 comp2">
                                                            <option value="">-- Select Reservation Method --</option>
                                                            <option>Telephone</option>
                                                            <option>Email</option>
                                                            <option>Direct</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">guest status</label>
                                                        <select name="gueststatus" id="gueststatus" class="bg-white form-control !p-2 comp2">
                                                            <option value="">-- Select Guest Status --</option>
                                                            <option>VVIP</option>
                                                            <option>VIP</option>
                                                            <option>Regular</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                        <div id="makepayment" class="form-group hidden">
                                            <!--<label for="logoname" class="control-label text-md">reservation date</label>-->
                                            <div class="btn btn-sm btn-primary cp">Make Payment</div>
                                        </div>
                                            <div class="grid grid-cols-1 !mb-2 lg:grid-cols-2 gap-10">
                                                <div class="grid grid-cols-1 !mb-2 lg:grid-cols-2 gap-10">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">Amount Paid</label> 
                                                        <input type="number" name="amountpaid" id="amountpaid" class="bg-white form-control !p-2 comp2" placeholder="Enter Amount Paid">
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">payment method</label>
                                                        <select name="paymentmethod" id="paymentmethod" onchange="
                                                                                                                did('bankname').value = '';
                                                                                                                did('otherdetails').value = '';
                                                                                                                if(this.value == 'TRANSFER'){
                                                                                                                    document.getElementById('bankside').classList.remove('invisible')
                                                                                                                }else{
                                                                                                                    document.getElementById('bankside').classList.add('invisible')
                                                                                                                }" class="bg-white form-control !p-2 comp2">
                                                            <option>TRANSFER</option>
                                                            <option>CASH</option>
                                                            <option>POS</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div id="bankside" class="grid grid-cols-1 !mb-2 lg:grid-cols-2 gap-10">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">Bank Name</label> 
                                                        <input type="text" name="bankname" id="bankname" class="bg-white form-control !p-2 comp2" placeholder="Enter Bank Name">
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">Other Details</label>
                                                        <textarea name="otherdetails" id="otherdetails" class="bg-white form-control !p-2 comp2" placeholder="Enter Other Details"></textarea>
                                                    </div>
                                                </div>
                                                
                                                
                                            
                                                    
                                            </div> 
                                            <div class=" border rounded p-2 !mb-2 !bg-[#f5f5f5]">
                                                <div class="grid grid-cols-1 !mb-2 lg:grid-cols-2 gap-10">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">checkin instructions</label> 
                                                        <input type="text" name="checkininstructions" id="checkininstructions" class="bg-white form-control !p-2 comp2" placeholder="Enter checkin instructions">
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">check out instructions</label>
                                                        <input type="text" name="checkoutinstructions" id="checkoutinstructions" class="bg-white form-control !p-2 comp2" placeholder="Enter check out instructions">
                                                    </div>
                                                </div>
                                                <div class="grid grid-cols-1 !mb-2 lg:grid-cols-2 gap-10">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">point of sales instructions</label> 
                                                        <input type="text" name="posinstructions" id="posinstructions" class="bg-white form-control !p-2 comp2" placeholder="">
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">reservation instructions</label> 
                                                        <input type="text" name="reservationinstructions" id="reservationinstructions" class="bg-white form-control !p-2 comp2" placeholder="Enter reservation instructions">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">special request by guest</label>
                                                        <input type="text" name="specialrequestbyguest" id="specialrequestbyguest" class="bg-white form-control !p-2 comp2" placeholder="Enter special request by guest">
                                                    </div>
                                            </div>  
                                            </div>  
                                        </div>
                                            
                                        <div class="grid grid-cols-1 !mb-2 lg:grid-cols-2 gap-10">
                                            
                                        </div>
                                        <!--<div class="grid grid-cols-1 !mb-2 lg:grid-cols-2 gap-10">-->
                                            
                                            
                                        <!--</div>-->
                                          <div class="flex justify-end mt-5 gap-4 h-fit">
                                                  <div class="flex w-full justify-start items-end"> 
                                        <div class="flex items-center gap-5 text-md border  p-4 ">
                                            <label for="logoname" class=" font-bold">Total Rate:</label>
                                            <label for="logoname" id="totalrate" class=" !text-md font-bold text-[blue]">00.00</label>
                                            <label for="logoname" id="totalmounttext" class=" !text-md hidden font-bold text-[blue]">00.00</label>
                                            <input type="text"  name="" id="totalamount" class="bg-white form-control !p-2 !hidden border-none text-[blue]" readonly>
                                            <input type="text"  name="" id="currency" class="bg-white form-control !p-2 !hidden border-none text-[blue]" readonly>
                                            <input type="text" id="" class="bg-white form-control !p-2 !hidden border-none text-[blue]" readonly>
                                        </div>
                                        <div class="flex items-center gap-5 text-md border  p-4 "> 
                                            <label for="logoname" class=" font-bold">Total Discount:</label>
                                            <label for="logoname" id="totaldiscount" class=" !text-md font-bold text-[blue]">00.00</label>
                                        </div>
                                        <div class="flex items-center gap-5 text-md border  p-4 ">
                                            <label for="logoname" class=" font-bold">Total Plan:</label>
                                            <label for="logoname" id="totalplan" class=" !text-md font-bold text-[blue]">00.00</label>
                                        </div>
                                         <button onclick="did('modalformone').classList.remove('hidden')" type="button" class="m-auto w-full h-[35px] md:w-max text-blue-400 text-sm capitalize border border-2 border-blue-400 p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                            <div class="btnloader" style="display: none;"></div>
                                            <span>More&nbsp;Details</span> 
                                        </button>
                                    </div>
                                                 <button onclick="did('reassignrooms').click()" type="button" class="m-auto w-full h-[35px] md:w-max text-white text-sm capitalize bg-red-400 p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3 btn-reset">
                                                    <span class="material-symbols-outlined text-lg">restart_alt</span>
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span class="text-lg">⟲</span>
                                                    <span>Reset</span> 
                                                </button>
                                                 <button id="submit" type="button" class="m-auto w-full h-[35px] md:w-max text-white text-sm capitalize bg-blue-400 p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Check&nbsp;In</span> 
                                                </button>
                                            </div>
                                            
                                    </div>
                                </form>
                                
                                <div id="travelform" onclick="if(event.target.id == 'travelform')this.classList.add('hidden')" class="z-[100] w-screen h-screen flex justify-center items-center fixed bg-[#5a5a5a3e] top-0 left-0 p-10 overflow-auto hidden">
                                    <div id="viewformtoedit" class=" animate__animated animate__fadeIn w-[80%] w-fit relative bg-[white] p-10 rounded-lg shadow-lg">
                                        <form id="travelagencyform" class="">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                            <p class="page-title">
                            <span>ADD TRAVELS AGENCY</span>
                        </p>
                                    <div class="grid grid-cols-1 !mb-1 gap-10">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">agency name</label>
                                            <input name="agencyname" id="agencyname" class="bg-white form-control compt" placeholder="Enter Agency Name">
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 !mb-1 lg:grid-cols-2 gap-10">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">contact</label>
                                            <input type="text"  name="contact" id="contact" class="bg-white form-control compt" placeholder="Enter contact">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Phone</label>
                                            <input type="text" name="phone" id="phone" class="bg-white form-control compt" placeholder="Enter Phone Number">
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1  lg:grid-cols-2 gap-10">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">email</label>
                                            <input type="text"  name="email" id="email" class="bg-white form-control compt" placeholder="Enter email">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">address</label>
                                            <textarea name="address" id="address" class="bg-white form-control compt" placeholder="Enter Address"></textarea>
                                        </div>
                                    </div>
                                     <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    
                                    <div></div>
                                    <div></div>
                                    
                                    <div class="flex justify-end mt-5">
                                         <button id="submittravel" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                            <div class="btnloader" style="display: none;"></div>
                                            <span>Submit</span>
                                        </button>
                                    </div>
                                    
                                </div> 
                                <div >
                        </div>
                                    </div>
                        </form>
                                    </div>  
                                </div>
                                
                                <div id="companyformm" onclick="if(event.target.id == 'companyformm')this.classList.add('hidden')" class="z-[100] w-screen h-screen flex justify-center items-center fixed bg-[#5a5a5a3e] top-0 left-0 p-10 overflow-auto hidden">
                                            <div id="viewformtoedit" class="animate__animated animate__fadeIn w-[80%] w-fit relative bg-[white] p-10 rounded-lg shadow-lg">
                                                <form id="companyform" class="">
                                        <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <p class="page-title">
                                    <span>ADD COMPANY</span>
                                </p>
                                            <div class="grid grid-cols-1 !mb-1 lg:grid-cols-2 gap-10">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">company name</label>
                                                    <input name="companyname" id="companyname" class="bg-white form-control compp" placeholder="Enter company Name">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">contact</label>
                                                    <input type="text"  name="contact" id="contact" class="bg-white form-control compp" placeholder="Enter contact">
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-1  lg:grid-cols-2 gap-10">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">email</label>
                                                    <input type="text"  name="email" id="email" class="bg-white form-control compp" placeholder="Enter email">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">address</label>
                                                    <textarea name="address" id="address" class="bg-white form-control compp" placeholder="Enter Address"></textarea>
                                                </div>
                                            </div>
                                             <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            
                                            <div></div>
                                            <div></div>
                                            
                                            <div class="flex justify-end mt-5">
                                                 <button id="submitcompany" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Submit</span>
                                                </button>
                                            </div>
                                            
                                        </div> 
                                        <div >
                                </div>
                                            </div>
                                
                                        </div>
                                    
                                
                                    
                                    </form>
                                            </div>  
                                        </div>
                                        
                                <div id="groupform" onclick="if(event.target.id == 'groupform')this.classList.add('hidden')" class="z-[100] w-screen h-screen flex justify-center items-center fixed bg-[#5a5a5a3e] top-0 left-0 p-10 overflow-auto hidden">
                                            <div id="viewformtoedit" class="animate__animated animate__fadeIn w-[80%] w-fit relative bg-[white] p-10 rounded-lg shadow-lg">
                                                <form id="groupofguestsform" class="">
                                    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                        <p class="page-title">
                                            <span>ADD GROUP</span>
                                        </p>
                                        <div class="grid grid-cols-1 !mb-1 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">group name</label>
                                                <input name="groupname" id="groupname" class="bg-white form-control comp">
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-1 !mb-1 lg:grid-cols-2 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">contact</label>
                                                <input type="text"  name="contact" id="contact" class="bg-white form-control comp" placeholder="Enter contact">
                                            </div>
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">travel agent</label>
                                                <select name="travelagent" id="travelagent1" class="bg-white form-control comp">
                                                    <option value="">Loading...</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-1  lg:grid-cols-2 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">company</label>
                                                <select name="company" id="company1" class="bg-white form-control comp">
                                                    <option value="">Loading...</option>
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">email</label>
                                                <input type="email" name="email" id="email" class="bg-white form-control comp" placeholder="Enter email">
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">country</label>
                                                <input type="text" name="country" id="country" class="bg-white form-control comp" placeholder="Enter country">
                                            </div>
                                        <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">City</label>
                                                <input type="text" name="city" id="city" class="bg-white form-control comp" placeholder="Enter City">
                                            </div>
                                            <div class="form-group">
                                                    <label for="logoname" class="control-label">language</label>
                                                    <input type="text" name="language" id="language" class="bg-white form-control comp" placeholder="Enter language">
                                                </div>
                                         </div>
                                         </div>
                                        <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                            <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">group type</label>
                                                    <select name="grouptype" id="grouptype" class="bg-white form-control comp">
                                                        <option value="">-- Select Group Type --</option>
                                                        <option>Local</option>
                                                        <option>Foreign</option>
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">source</label>
                                                    <select name="source" id="source" class="bg-white form-control comp">
                                                        <option value="">-- Select source --</option>
                                                        <option>Guest Direct</option>
                                                        <option>Social Media Corporate</option>
                                                        <option>Online Booking</option>
                                                    </select>
                                                </div>
                                            </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">industry</label>
                                                    <select name="industry" id="industry" class="bg-white form-control comp">
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
                                             <button id="submitgroups" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Submit</span>
                                            </button>
                                        </div>
                                        
                                    </div> 
                                        </div>
                            
                                    </div>
                                
                            
                                
                                </form>
                                            </div>  
                                        </div>
                                        
                                <div id="roommodal" onclick="if(event.target.id == 'roommodal')this.classList.add('hidden')" class="z-[100] w-screen h-screen  fixed bg-[#5a5a5a3e] top-0 left-0 p-10 overflow-auto hidden">
                                            <div id="viewformtoedit" class="animate__animated animate__fadeIn w-[80%] relative bg-[white] mx-auto p-10 rounded-lg shadow-lg">
                                                
                                                <div class="p-4 pt-0">
                                                    <p class="page-title">
                                                        <span>Select Room</span>
                                                    </p>

                                                    <!-- Room Search Header -->
                                                    <div class="mb-4 flex items-center space-x-4">
                                                        <div class="form-group">
                                                            <label for="room-type" class="block text-sm font-medium text-gray-700">Type</label>
                                                            <select id="room-type" name="room-type" class="form-control room-type">
                                                            </select>
                                                        </div>
                                                
                                                        <!--<button class="mt-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 hidden rounded">Due In</button>-->
                                                        <!--<button class="mt-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 hidden rounded">Due Out</button>-->
                                                
                                                        <!--<div class="flex items-center space-x-2 hidden">-->
                                                        <!--    <input type="text" id="room-no" name="room-no" placeholder="Room No" list="roomlist" onchange="checkdatalist(this)" class="mt-6 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">-->
                                                        <!--    <button id="rummodalselectbtn" class="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Select</button>-->
                                                        <!--</div>-->
                                                
                                                        <!--<label class="mt-6 inline-flex items-center">-->
                                                        <!--    <input type="checkbox" class="form-checkbox text-indigo-600">-->
                                                        <!--    <span class="ml-2">Villa Rooms</span>-->
                                                        <!--</label>-->
                                                    </div>
                                                
                                                    <!-- Room Legend -->
                                                    <div class="mb-4 flex space-x-2 p-2 border rounded flex justify-center bg-[#f5f5f5]">
                                                        <span class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 cark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 text-center me-2 mb-2">AVAILABLE</span>
                                                        <span class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 cark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 text-center me-2 mb-2">OCCUPIED</span>
                                                        <span class="text-white bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300 cark:focus:ring-yellow-800 font-medium rounded-lg text-sm px-5 text-center me-2 mb-2">RESERVED</span>
                                                        <span class="text-white bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 cark:focus:ring-gray-800 font-medium rounded-lg text-sm px-5 text-center me-2 mb-2">MTN BLK</span>
                                                        <!--<span class="text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-300 cark:focus:ring-orange-800 font-medium rounded-lg text-sm px-5 text-center me-2 mb-2">Villa Bl</span>-->
                                                        <span class="text-white bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 cark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 text-center me-2 mb-2">MGT BLK</span>
                                                        <!--<span class="text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 cark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 text-center me-2 mb-2"></span>-->
                                                    </div>
                                                
                                                    <!-- Room Display -->
                                                    <div id="roomtable" class="overflow-auto border rounded-lg">
                                                        <!--<table class="min-w-full bg-white">-->
                                                        <!--    <div class="p-4 text-sm text-gray-800 rounded-lg bg-gray-50 cark:bg-gray-800 cark:text-gray-300" role="alert">-->
                                                        <!--          <span class="font-medium">Building:</span> Mosheshe Estate-->
                                                        <!--        </div>-->
                                                        <!--    <thead>-->
                                                        <!--        <tr>-->
                                                        <!--            <th class="px-6 py-2 text-gray-500">Floor</th>-->
                                                        <!--            <th class="px-6 py-2 text-gray-500">Rooms</th>-->
                                                        <!--        </tr>-->
                                                        <!--    </thead>-->
                                                        <!--    <tbody>-->
                                                        <!--         Repeat for each floor -->
                                                        <!--        <tr>-->
                                                        <!--            <td class="px-6 py-4 text-gray-700 text-center">1</td>-->
                                                        <!--            <td class="px-6 py-4 text-center">-->
                                                        <!--                 <span class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 cark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 text-center me-2 mb-2">23</span>-->
                                                        <!--                <span class="text-white bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300 cark:focus:ring-yellow-800 font-medium rounded-lg text-sm px-5 text-center me-2 mb-2">43</span>-->
                                                        <!--                <span class="text-white bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 cark:focus:ring-gray-800 font-medium rounded-lg text-sm px-5 text-center me-2 mb-2">575</span>-->
                                                        <!--                <span class="text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-300 cark:focus:ring-orange-800 font-medium rounded-lg text-sm px-5 text-center me-2 mb-2">34</span>-->
                                                        <!--            </td>-->
                                                        <!--        </tr>-->
                                                        <!--         Add more rows for other floors as needed -->
                                                        <!--         Example row for floor 2 -->
                                                        <!--        <tr>-->
                                                        <!--            <td class="px-6 py-4 text-gray-700  text-center">2</td>-->
                                                        <!--            <td class="px-6 py-4  text-center">-->
                                                        <!--                 <span class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 cark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 text-center me-2 mb-2">23</span>-->
                                                        <!--                <span class="text-white bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300 cark:focus:ring-yellow-800 font-medium rounded-lg text-sm px-5 text-center me-2 mb-2">43</span>-->
                                                        <!--                <span class="text-white bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 cark:focus:ring-gray-800 font-medium rounded-lg text-sm px-5 text-center me-2 mb-2">575</span>-->
                                                        <!--                <span class="text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-300 cark:focus:ring-orange-800 font-medium rounded-lg text-sm px-5 text-center me-2 mb-2">34</span>-->
                                                        <!--            </td>-->
                                                        <!--        </tr>-->
                                                        <!--         Add more rows for other floors as needed -->
                                                        <!--    </tbody>-->
                                                        <!--</table>-->
                                                    </div>
                                                
                                                    <!-- Back View Button -->
                                                    <div class="mt-4">
                                                        <button onclick="document.getElementById('roommodal').classList.add('hidden')" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Cancel</button>
    </div>
                                                
                                                
                                                
                                            </div>  
                                        </div>
                                        </div>
                                        
                                 
                            <hr class="my-3">
                            <div class="flex justify-end w-full my-4">
                                                <!-- <button onclick="printContent('HEMS CHECKIN VIEW', null, 'checkinview', true)" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div>-->
                                                <!--    <span>print</span> -->
                                                <!--</button>-->
                                                <!-- <button onclick="exportToPDF('tableer')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div> -->
                                                <!--    <span>Export PDF</span> -->
                                                <!--</button>-->
                                                <!-- <button onclick="exportToExcel('checkinview', 'HEMS CHECKIN VIEW')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div>-->
                                                <!--    <span>Export Excel</span> -->
                                                <!--</button> -->
                                            </div>
                                <div id="reassignroomsview" class="">
                                    <form id="checkinarrivalsform" class="hidden">
                                        <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                            <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-10">
                                                <!--<div class="form-group">-->
                                                <!--    <label for="logoname" class="control-label required">Search</label>-->
                                                <!--    <input type="text" name="searchtext" id="searchtext" class="form-control comp" placeholder="Enter  guest's first name or last name or other names or passport number or phone or visa number">-->
                                                <!--</div>-->
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">start date</label>
                                                    <input type="date" name="arrivaldate" id="arrivaldaterr" class="form-control">
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-10">
                                                <div class="form-group">
                                                </div>
                                                
                                                
                                                <div class="flex justify-end mt-5">
                                                     <button onclick="fetchcheckinn('', 'form')" type="button" class="btn">
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
                                <div class="table-content  lg:max-w-full">
                                    <table id="tableer">
                                        <thead>
                                            <tr>
                                                 <th style="width: 20px">s/n</th> 
                                                <th>action</th>
                                                <th>Rooms</th>
                                                <th>Guest</th>
                                                <th>no.&nbsp;of&nbsp;nights</th>
                                                <th>total&nbsp;rate</th>
                                                <th>reservation&nbsp;type</th>
                                                <th>arrival&nbsp;date</th>
                                                <th>departure&nbsp;date</th>
                                                <th>billing&nbsp;info</th>
                                                <th>payment&nbsp;method</th>
                                                <th>reservation&nbsp;date</th>
                                                <th>reference</th>
                                                <th>status</th>
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
                            
                            
                                <div id="modalreceipt" onclick="if(event.target.id == 'modalreceipt')this.classList.add('hidden')" class="z-[100] w-screen h-screen fixed bg-[#5a5a5a3e] top-0 left-0 p-10 overflow-auto hidden">
                               
                               
                                </div>
                                
                            <datalist id="allguest"></datalist>
                            <datalist id="allguest2"></datalist>
                            <datalist id="roomlist"></datalist>
                        
                        </section>  
