       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>CHECK-OUT</span>
                            </p>
                            
                             <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                                <!--<li id="rccview" class="me-2 cp viewer" onclick="did('guestsreservationsform').classList.add('hidden');this.children[0].classList.add('active', '!text-blue-600');did('lostandfoundview').classList.remove('hidden');this.nextElementSibling.children[0].classList.remove('active', '!text-blue-600');">-->
                                <li id="" class="me-2 cp viewer optioner !text-blue-600 active" name="checkoutview" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ">Occupancy List</p>
                                </li>
                                <li id="iddcheckoutform" class="me-2 cp updater optioner" name="checkoutform" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Check-Out</p>
                                </li>
                                <li id="" class="me-2 cp updater2 optioner" name="checkoutviewer" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Check-Out View</p>
                                </li>
                            </ul>
                            
                            <form id="checkoutform" class="hidden">
                                     <ol class="flex items-center !text-xs w-full  p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white mt-4 shadow-sm sm:text-base  sm:p-4 sm:space-x-4 rtl:space-x-reverse">
                                   
                                <div class="flex justify-end w-full">
                                     <button onclick="printContent('HEMS checkout FORM', null, 'checkoutform', true)" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                        <div class="btnloader" style="display: none;"></div>
                                        <span>print</span> 
                                    </button>
                                     <button onclick="exportToPDF('checkoutform')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                        <div class="btnloader" style="display: none;"></div>
                                        <span>Export PDF</span> 
                                    </button>
                                </div>
                                </ol>
                                    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                <p class="page-title">
                                <span>GUEST</span>
                            </p>
                                        <div class="grid grid-cols-1 !mb-5 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">phone</label>
                                                <input type="tel" readonly name="phone" id="phone" class="form-control comp" placeholder="Enter Phone Number">
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">first name</label>
                                                <input type="text" readonly name="firstname" id="firstname" class="form-control comp" placeholder="Enter First Name">
                                            </div>
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">last name</label>
                                                <input type="text" readonly name="lastname" id="lastname" class="form-control comp" placeholder="Enter Last Name">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                        <p class="page-title">
                                            <span>RESERVATION</span>
                                        </p>
                                   
                                        <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">arrival date</label>
                                                <input type="datetime-local" readonly onchange="datedifference()" name="arrivaldate" id="arrivaldate" class="form-control comp" placeholder="Enter arrival date">
                                            </div>
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">departure date</label>
                                                <input type="datetime-local" onchange="fetchguestreceivable(document.getElementById('reservationid').value, this.value.replace('T', ' '))" name="departuredate" id="departuredate" class="form-control comp" placeholder="Enter departure date">
                                                <!--<input type="datetime-local" onchange="datedifference()" name="departuredate" id="departuredate" class="form-control comp" placeholder="Enter departure date">-->
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">number of persons</label>
                                                <input type="number" readonly name="numberofpersons" id="numberofpersons" class="form-control comp" placeholder="Enter number of persons">
                                            </div>
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">number of nights</label>
                                                <input type="number" readonly name="numberofnights" id="numberofnights" class="form-control comp" placeholder="Enter number of nights">
                                            </div>
                                        </div>
                                        <!--<div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-10">-->
                                        <!--    <div class="form-group">-->
                                        <!--        <label for="logoname" class="control-label">room category</label>-->
                                        <!--        <input type="text" name="roomcategory" id="roomcategory" list="hems_roomcategories" onchange="checkdatalist(this);getcategoryrateguest(this)" class="form-control comp" placeholder="Enter root category">-->
                                        <!--    </div>-->
                                        <!--    <div class="form-group">-->
                                        <!--        <label for="logoname" class="control-label">room rate</label>-->
                                        <!--        <select name="roomrate" id="roomrate" class="form-control comp" >-->
                                        <!--        </select>-->
                                        <!--    </div>-->
                                            
                                        <!--</div>-->
                                        <!--<div class="grid grid-cols-1 !mb-5 gap-10">-->
                                            <!--<div class="form-group">-->
                                            <!--    <label for="logoname" class="control-label">reservation date</label> -->
                                            <!--    <input onchange="reservationtyper()" type="datetime-local" name="reservationdate" id="reservationdate" class="form-control comp" placeholder="Enter number of persons">-->
                                            <!--</div>-->
                                            <!--<div class="form-group hid">-->
                                            <!--    <label for="logoname" class="control-label">reservation type</label>-->
                                            <!--    <select onchange="reservationtyper(this)" name="reservationtype" id="reservationtype" class="form-control comp">-->
                                                    <!--<option value="">--SELECT RESERVATION TYPE--</option>-->
                                            <!--        <option selected>GUARANTEED</option>-->
                                            <!--        <option>NOT GUARANTEED</option>-->
                                            <!--    </select>-->
                                            <!--</div>-->
                                        <!--</div>--> 
                                        <div id="reservationbiller" class="grid p-2 rounded-md shadow-sm border bg-[#1f5e990d] ">
                                            <input type="text" value="NO" name="billinginfo" id="billinginfo" class="form-control comp hidden" readonly placeholder="Enter room rate">
                                            <p class="page-title mx-3 !mb-[5px]">
                                                <span>Billing info</span>
                                            </p>
                                        <div class="flex items-center gap-5 text-xl border  p-4">
                                            <label for="logoname" class=" font-bold">Total Amount: </label>
                                            <label for="logoname" id="amountdis" class=" !text-3xl font-bold text-[blue]">-</label>
                                            <input type="text"  name="totalamount" id="totalamount" class="form-control !hidden border-none text-[blue]" readonly>
                                            <input type="text"  name="currency" id="currency" class="form-control !hidden border-none text-[blue]" readonly>
                                            <input type="text" id="mindeposit" class="form-control !hidden border-none text-[blue]" readonly>
                                        </div>
                                        <div class="flex items-center gap-5 text-xl border  p-4">
                                            <label for="logoname" class=" font-bold">Amount Paid: </label>
                                            <label for="logoname" id="paiddis" class=" !text-3xl font-bold text-[blue]">-</label>
                                        </div>
                                        <div class="flex items-center gap-5 text-xl border  p-4">
                                            <label for="logoname" class=" font-bold">Balance: </label>
                                            <label for="logoname" id="balancedis" class=" !text-3xl font-bold text-[blue]">-</label>
                                            <input type="text"  name="balancedis" class="form-control !hidden border-none text-[blue]" readonly>
                                        </div>
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">payment method</label>
                                                <select name="paymentmethod" id="paymentmethod" class="form-control comp">
                                                    <option>BANK TRANSFER</option>
                                                    <option>CASH</option>
                                                    <option>VIRTUAL ACCOUNT</option>
                                                    <option>BANK CARD</option>
                                                </select>
                                            </div>
                                            <div class="grid grid-cols-1 !mb-5 lg:grid-cols-1 gap-10 p-3 ">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">amount paid <span class="text-xs text-[blue]" id="mindeposit"></span></label>
                                                    <input type="number" readonly onchange="" name="amountpaid" id="amountpaid" class="form-control comp" placeholder="Enter amount paid">
                                                </div>
                                                <!--<div id="makepayment" class="form-group">-->
                                                <!--    <label for="logoname" class="control-label">reservation date</label>-->
                                                <!--    <div class="btn btn-sm btn-primary cp">Make Payment</div>-->
                                                <!--</div>-->
                                            </div>
                                            <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-10 p-3 ">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">amount paid on checkout  <span class="text-xs text-[blue]" id="mindeposit"></span></label>
                                                    <input type="number" value=0 name="amountpaidoncheckout" id="amountpaidoncheckout" class="form-control comp">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">amount refunded on checkout  <span class="text-xs text-[blue]" id="mindeposit"></span></label>
                                                    <input type="number" value=0 name="amountrefundedoncheckout" id="amountrefundedoncheckout" class="form-control comp">
                                                </div>
                                                <!--<div id="makepayment" class="form-group">-->
                                                <!--    <label for="logoname" class="control-label">reservation date</label>-->
                                                <!--    <div class="btn btn-sm btn-primary cp">Make Payment</div>-->
                                                <!--</div>-->
                                            </div>
                                        </div>
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">block room number</label>
                                                <input type="text" readonly name="roomnumber" id="roomnumber" list="hems_roomnumber_id" onchange="checkdatalist(this);" class="form-control comp" placeholder="Enter root category">
                                            </div>
                                            <div class="form-group hidden">
                                                <label for="logoname" class="control-label">guest id</label>
                                                <input type="text" readonly name="guestid" id="guestid" class="form-control comp" placeholder="Enter root category">
                                            </div>
                                            <div class="form-group hidden">
                                                <label for="logoname" class="control-label">reservationid</label>
                                                <input type="text" readonly name="reservationid" id="reservationid" class="form-control comp" placeholder="Enter root category">
                                            </div>
                                            <!--<div class="form-group">-->
                                            <!--    <label for="logoname" class="control-label">Messages</label>-->
                                            <!--    <textarea name="messages" id="messages" class="form-control" placeholder="Enter message"></textarea>-->
                                            <!--</div>-->
                                        <!--<div class="grid grid-cols-1 !mb-5 gap-10">-->
                                        <!--    <div class="form-group">-->
                                        <!--        <label for="logoname" class="control-label">Upload</label>-->
                                        <!--        <div id="imagePreview"></div>-->
                                        <!--        <input type="file" name="imageurl" id="imageurl" class="form-control" onchange="previewImage('imageurl')">-->
                                        <!--    </div>-->
                                            
                                        <!--</div> -->
                                          <div class="flex justify-end mt-5 gap-4">
                                                  <div class="flex w-full justify-start items-end mb-10"> 
                                        
                                    </div>
                                                 <button id="submit" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Check&nbsp;Out</span> 
                                                </button>
                                            </div>
                                            
                                    </div>
                                </form>
                            <hr class="my-3">
                                    <div id="checkoutview" class="">
                            <div class="flex justify-end w-full my-4">
                                                <!-- <button onclick="printContent('HEMS checkout VIEW', null, 'checkoutview', true)" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div>-->
                                                <!--    <span>print</span> -->
                                                <!--</button>-->
                                                <!-- <button onclick="exportToPDF('tableer')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div> -->
                                                <!--    <span>Export PDF</span> -->
                                                <!--</button>-->
                                                 <button onclick="exportToExcel('checkoutview', 'HEMS checkout VIEW')" type="button" class="btn">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Export Excel</span> 
                                                </button> 
                                                <!-- <button onclick="exportToExcel('checkoutview', 'HEMS checkout VIEW')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div>-->
                                                <!--    <span>Export Excel</span> -->
                                                <!--</button> -->
                                            </div>
                                <div class="table-content">
                                    <table id="tableer">
                                        <thead>
                                            <tr>
                                                 <th style="width: 20px">s/n</th>
                                                <th>action</th>
                                                <th>Guest&nbsp;full&nbsp;name</th>
                                                <th>room&bsp;number</th>
                                                <th>nationality</th>
                                                <th>no.&nbsp;of&nbsp;nights</th>
                                                <th>room&nbsp;category</th>
                                                <th>arrival&nbsp;date</th>
                                                <th>departure&nbsp;date</th>
                                                <th>reservation&nbsp;date</th>
                                                <th>status</th>
                                            </tr>
                                        </thead>
                                        <tbody id="tabledatar">
                                            <tr>
                                                <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="table-status"></div>
                            </div> 
                                  <div id="checkoutviewer" class="hidden">
                            <div class="flex justify-end w-full my-4">
                                                <!-- <button onclick="printContent('HEMS checkout VIEW', null, 'checkoutview', true)" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div>-->
                                                <!--    <span>print</span> -->
                                                <!--</button>-->
                                                <!-- <button onclick="exportToPDF('tableer')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div> -->
                                                <!--    <span>Export PDF</span> -->
                                                <!--</button>-->
                                                 <button onclick="exportToExcel('checkoutview', 'HEMS checkout VIEW')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Export Excel</span> 
                                                </button> 
                                            </div>
                                <div class="table-content">
                                    <table id="tableer">
                                        <thead>
                                            <tr>
                                                 <th style="width: 20px">s/n</th>
                                                <th>Guest&nbsp;full&nbsp;name</th>
                                                <th>nationality</th>
                                                <th>no.&nbsp;of&nbsp;nights</th>
                                                <th>room&nbsp;category</th>
                                                <th>arrival&nbsp;date</th>
                                                <th>departure&nbsp;date</th>
                                                <th>reservation&nbsp;date</th>
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
                        
                        </section>  