       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>SALES</span>
                            </p>
                            
                             <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                                <!--<li id="rccview" class="me-2 cp viewer" onclick="did('guestsreservationsform').classList.add('hidden');this.children[0].classList.add('active', '!text-blue-600');did('lostandfoundview').classList.remove('hidden');this.nextElementSibling.children[0].classList.remove('active', '!text-blue-600');">-->
                                <li id="iddsalesform" class="me-2 cp updater optioner !text-blue-600 active" name="salesform" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Sales</p>
                                </li>
                                <li id="" class="me-2 cp viewer optioner hidden" name="salesview" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ">View Sales</p>
                                </li>
                            </ul>
                            
                            <form id="salesform" class="">
                                     <ol class="flex items-center !text-xs w-full  p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white mt-4 shadow-sm sm:text-base  sm:p-4 sm:space-x-4 rtl:space-x-reverse">
                                   
                                <div class="flex justify-end w-full">
                                                <!-- <button onclick="printContent('HEMS sales FORM', null, 'salesform', true)" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div>-->
                                                <!--    <span>print</span> -->
                                                <!--</button>-->
                                                 <button onclick="exportToPDF('salesform')" type="button" class="btn">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Export PDF</span> 
                                                </button>
                                                <!-- <button onclick="exportToPDF('salesform')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div>-->
                                                <!--    <span>Export PDF</span> -->
                                                <!--</button>-->
                                            </div>
                                </ol>
                                    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                        <div class="grid grid-cols-1  lg:grid-cols-1 gap-10 p-3 bg-[#3b82f6] text-white rounded shadow-sm">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">Department / Salespoint</label>
                                                <select name="salespoint" id="salespointname" class="form-control comp !text-black !bg-white">
                                                    <option>Loading...</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div id="loading">Loading...</div>
                                        <div class="grid load hidden grid-cols-1  lg:grid-cols-6 gap-10 p-3 bg-[#01290812] rounded shadow-sm">
                                            <div class="form-group col-span-4">
                                                <label for="logoname" class="control-label">Search Item <span class="text-[9px] italic text-blue-500">(Press Enter button to load item on the grid)</span></label>
                                                <input autocomplete="off" onkeydown="if(event.key === 'Enter' && this.value)addfromsearch();" onchange="checkdatalist(this);" list="hems_itemslist" id="searcheditem" class="form-control bg-white">
                                            </div>
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">Quantity</label>
                                                <input autocomplete="off" type="number" id="searchedqty" class="form-control bg-white" value=1>
                                            </div>
                                            <div onclick="addfromsearch()" class="cp btn btn-sm btn-primary h-10 mt-auto ml-auto rounded">
                                                Add Item
                                            </div>
                                        </div>
                                        <div class="grid load hidden grid-cols-1 !mb-1 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">Apply To</label>
                                                <select name="applyto" id="applyto" class="form-control comp" >
                                                    <option>OTHERS</option>
                                                    <!--<option value="">-- Select Applied to --</option>-->
                                                    <option>ROOMS</option>
                                                    <option>COST CENTER</option>
                                                </select>
                                            </div>
                                            <div class="form-group" id="ownercontainer">
                                                <label for="logoname" class="control-label">Invoice / reciept to</label>
                                                <input autocomplete="off" type="text" name="" id="owner1" class="form-control comp" onchange="checkdatalist(this, 'owner');" placeholder="">
                                                <input type="text" name="owner" id="owner" class="form-control hidden" onchange="checkdatalist(this);" placeholder="">
                                            </div>
                                        </div>
                                           <div id="tablecheck" class="hidden mb-2">
                                           <div class="grid grid-cols-1  lg:grid-cols-2 gap-10 bg-[white] rounded shadow-sm mb-3">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">Table Number</label>
                                                    <input type="text" name="tablenumber" list="tablenumberlist" id="tablenumber" onchange="checkdatalist(this)?checktablestatus(true):''" class="form-control comp !text-black !bg-white" placeholder="Enter Table Number">
                                                    <datalist id="tablenumberlist"></datalist>
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">Table Status</label>
                                                    <input type="text" name=""  id="tablestatus" class="form-control text-white" readonly placeholder="">
                                                </div>
                                            </div>
                                           <div id="guestview" class="hidden grid grid-cols-1  lg:grid-cols-2 gap-10 bg-[white] rounded shadow-sm ">
                                                <div class="form-group hidden">
                                                    <label for="logoname" class="control-label">reservation date</label>
                                                    <input type="date" readonly name="reservationdate" id="reservationdate" class="form-control !text-black !bg-white" placeholder="Enter Reservation date">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">guest/room</label>
                                                    <input type="text" name="guest" id="guest" class="form-control !text-black !bg-white" placeholder="Enter Guest">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">timeline</label>
                                                    <select name="timeline" id="timeline" class="form-control !text-black !bg-white" >
                                                        <option>EVENING</option>
                                                    </select>
                                                </div>
                                                </div>
                                        </div>
                                        <div class="grid load hidden grid-cols-1 !mb-1 lg:grid-cols-2 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">transaction date</label>
                                                <input autocomplete="off" type="date"  name="transactiondate" id="transactiondate" class="form-control comp" placeholder="">
                                            </div>
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">Description</label>
                                                <textarea name="description" id="description" class="form-control" placeholder=""></textarea>
                                            </div>
                                        </div>
                                        <div class="grid load hidden grid-cols-1  lg:grid-cols-1 gap-10"> 
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">payment method</label>
                                                <select  name="paymentmethod" id="paymentmethod" class="form-control comp">
                                                    <option value="">-- SELECT PAYMENT METHOD --</option>
                                                    <option>TRANSFER</option>
                                                    <option>CASH</option>
                                                    <option>POS</option>
                                                </select>
                                            </div>
                                            
                                        </div>
                                        <div id="bankdetails"></div>
                                        
                                        <div class="table-content load hidden">
                                        <div class="flex w-full justify-end gap-7 items- my-3">
                                        <div class="flex justify-end gap-3 items-center p-3 border rounded bg-[#00000045] shadow">
                                            <label for="logoname" class="control-label text-xl font-bold">Total:</label>
                                            <label for="logoname" id="totalamountt" class="control-label text-xl text-[blue] font-bold">0</label>
                                            <input autocomplete="off" type="number"  name="totalamount" id="totalamount" class="form-control !hidden text-2xl border-none font-bold" readonly placeholder="">
                                        </div>
                                        </div>
                                    <table id="tableer">
                                        <thead>
                                            <tr>
                                                <th style="width: 20px">s/n</th> 
                                                <th style="width:300px">item</th>
                                                <th>item info</th>
                                                <th>price</th>
                                                <th>quantity</th>
                                                <th>amount</th>
                                                <th><button onclick="event.preventDefault();addsalesrow()" class="material-symbols-outlined rounded-full text-primary-g h-8 w-8 bg-white drop-shadow-md text-xs" style="font-size: 18px;">add</button></th>
                                            </tr>
                                        </thead> 
                                        <tbody id="thetabledata">
                                            <tr id="row-919">
                                                <td class="s/n">1</td>
                                                <td class="">  
                                                    <label for="logoname" class="control-label hidden">Item</label>
                                                    <input autocomplete="off" onchange="checkdatalist(this);salesitempop(this,'1')" onblur="salesitempop(this,'1')" list="hems_itemslist" name="item" id="item-1" class="form-control iitem comp">
                                                    <input autocomplete="off" class="itemmerid hidden" id="itemer-1">
                                                </td>
                                                <td style="">
                                                    <div class="">
                                                        <p class="font-bold">Type:&nbsp;<span class="font-normal" id="type-1"></span></p>
                                                        <p class="font-bold">Unit:&nbsp;<span class="font-normal" id="unit-1"></span></p>
                                                        <p class="font-bold">Stock&nbsp;Balance:&nbsp;<span class="font-normal" id="balance-1"></span></p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <label for="logoname" class="control-label hidden">Price</label>
                                                    <input autocomplete="off" type="number"  name="" id="price-1" class="form-control comp pprice" placeholder="">
                                                </td>
                                                <td>
                                                    <label for="logoname" class="control-label hidden">Quantity</label>
                                                    <input autocomplete="off" type="number"  name="" id="qty-1" class="form-control comp qqty" onchange="calsaleqty('1')" placeholder="">
                                                </td>
                                                <td>
                                                    <label for="logoname" class="control-label hidden">Amount</label>
                                                    <input autocomplete="off" type="number" disabled name="" id="amount-1" class="form-control ammount" placeholder="">
                                                </td>
                                                <td>
                                                    <button onclick="event.preventDefault();removesalesrow('919')" class="material-symbols-outlined rounded-full bg-red-500 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">remove</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                              <div class="w-full flex justify-end items-center">
                                                 
                                                <div class="flex items-center gap-5 m-5">
                                                    <label for="logoname" class="control-label text-xl">Amount&nbsp;Paid:</label>
                                                    <input autocomplete="off" type="number"  name="amountpaid" id="amountpaid" class="form-control comp " onchange="" placeholder="">
                                                </div>
                                            </div>
                                    <div class="flex justify-end w-full my-4">
                                                 <button type="button" id="submit" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Post Sales</span> 
                                                </button> 
                                            </div>
                                </div>
                                        
                            
                                    </div>
                                    
                                </form>
                            <hr class="my-3">
                        <div id="salesview" class="hidden">
                            <div class="flex justify-end w-full my-4">
                                                <!-- <button onclick="printContent('HEMS sales VIEW', null, 'salesview', true)" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div>-->
                                                <!--    <span>print</span> -->
                                                <!--</button>-->
                                                <!-- <button onclick="exportToPDF('tableer')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div> -->
                                                <!--    <span>Export PDF</span> -->
                                                <!--</button>-->
                                                 <button onclick="did('modalreceipt').classList.remove('hidden')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                    <div class="btnloader" style="display: none;"></div> 
                                                    <span>Receipt</span> 
                                                </button>
                                                 <button onclick="exportToExcel('salesview', 'HEMS sales VIEW')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Export to Excel</span> 
                                                </button> 
                                            </div>
                                <div class="table-content">
                                    <table id="tableer">
                                        <thead>
                                            <tr>
                                                <th> s/n </th>
                                                <th style="width: 150px"> Action </th>
                                                <th> ref </th>
                                                <th> transaction&nbsp;date </th>
                                                <th> details </th> 
                                                <th> sales&nbsp;person  </th>
                                                <th> total&nbsp;item </th>
                                                <th> total&nbsp;qty </th>
                                                <th> total&nbsp;cost  </th>
                                                <th> amount&nbsp;paid </th>
                                                <th> payment&nbsp;method</th>
                                                <th> reversal</th>
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
                            
                              <div id="receiptsalesmodal" onclick="if(event.target.id === 'receiptsalesmodal'){this.classList.add('hidden');emptysales()}" class="hidden w-full h-full bg-[#0000004a] fixed top-0 left-0 overflow-y-auto flex justify-center items-start">
                                <div class="w-fit max-w-[90%] mt-8 min-w-[500px] h-fit min-h-[400px] bg-transparent p-2 rounded-md shadow-lg flex flex-col items-center">
                            
                                    <div class="w-full py-2 flex justify-between mx-8 bg-white p-5 rounded mb-2">
                                        <p id="modaltitle" class="text-md font-bold">PRINT SALES REPORT</p>
                                        <span  onclick="printDomContent('SALES REPORT', 'displaydetails');document.getElementById('receiptsalesmodal').classList.add('hidden');emptysales()" class="cp material-symbols-outlined group-hover:text-primary-g bg-blue-400 scale-[1.5] text-white"
                                           style="font-size: 20px;">print</span>
                                        <span onclick="document.getElementById('receiptsalesmodal').classList.add('hidden');emptysales()" class="cp material-symbols-outlined text-red-600 group-hover:text-primary-g"
                                           style="font-size: 20px;">close</span>
                                    </div>
                                    
                                        <div class="">
                                <div class="w-full flex flex-col items-center">
                                    <div class="w-80 rounded bg-gray-50 px-6 pt-8 shadow-lg" id="displaydetails">
                                        <!--<img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" alt="chippz" class="mx-auto w-16 py-4" />-->
                                        <!--<div class="flex flex-col justify-center items-center gap-2">-->
                                        <!--    <h4 class="font-semibold">Business Name</h4>-->
                                        <!--    <p class="text-xs">Some address goes here</p>-->
                                        <!--</div>-->
                                        <!--<div class="flex flex-col gap-3 border-b py-6 text-xs">-->
                                        <!--  <p class="flex justify-between">-->
                                        <!--    <span class="text-gray-400">Receipt No.:</span>-->
                                        <!--    <span>#5033</span>-->
                                        <!--  </p>-->
                                        <!--  <p class="flex justify-between">-->
                                        <!--    <span class="text-gray-400">Order Type:</span>-->
                                        <!--    <span>Dine-in</span>-->
                                        <!--  </p>-->
                                        <!--  <p class="flex justify-between">-->
                                        <!--    <span class="text-gray-400">Host:</span>-->
                                        <!--    <span>Jane Doe</span>-->
                                        <!--  </p>-->
                                        <!--  <p class="flex justify-between">-->
                                        <!--    <span class="text-gray-400">Customer:</span>-->
                                        <!--    <span>John Doe</span>-->
                                        <!--  </p>-->
                                        <!--</div>-->
                                        <!--<div class="flex flex-col gap-3 pb-6 pt-2 text-xs">-->
                                        <!--  <table class="w-full text-left">-->
                                        <!--    <thead>-->
                                        <!--      <tr class="flex">-->
                                        <!--        <th class="w-full py-2">Product</th>-->
                                        <!--        <th class="min-w-[44px] py-2">QTY</th>-->
                                        <!--        <th class="min-w-[44px] py-2">Total</th>-->
                                        <!--      </tr>-->
                                        <!--    </thead>-->
                                        <!--    <tbody>-->
                                        <!--      <tr class="flex">-->
                                        <!--        <td class="flex-1 py-1">Shawarma Big</td>-->
                                        <!--        <td class="min-w-[44px]">4</td>-->
                                        <!--        <td class="min-w-[44px]">$12</td>-->
                                        <!--      </tr>-->
                                        <!--      <tr class="flex py-1">-->
                                        <!--        <td class="flex-1">Viju Milk - 100ml</td>-->
                                        <!--        <td class="min-w-[44px]">1</td>-->
                                        <!--        <td class="min-w-[44px]">$1</td>-->
                                        <!--      </tr>-->
                                        <!--    </tbody>-->
                                        <!--  </table>-->
                                        <!--  <div class=" border-b border border-dashed"></div>-->
                                        <!--  <div class="py-4 justify-center items-center flex flex-col gap-2">-->
                                        <!--    <p class="flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21.3 12.23h-3.48c-.98 0-1.85.54-2.29 1.42l-.84 1.66c-.2.4-.6.65-1.04.65h-3.28c-.31 0-.75-.07-1.04-.65l-.84-1.65a2.567 2.567 0 0 0-2.29-1.42H2.7c-.39 0-.7.31-.7.7v3.26C2 19.83 4.18 22 7.82 22h8.38c3.43 0 5.54-1.88 5.8-5.22v-3.85c0-.38-.31-.7-.7-.7ZM12.75 2c0-.41-.34-.75-.75-.75s-.75.34-.75.75v2h1.5V2Z" fill="#000"></path><path d="M22 9.81v1.04a2.06 2.06 0 0 0-.7-.12h-3.48c-1.55 0-2.94.86-3.63 2.24l-.75 1.48h-2.86l-.75-1.47a4.026 4.026 0 0 0-3.63-2.25H2.7c-.24 0-.48.04-.7.12V9.81C2 6.17 4.17 4 7.81 4h3.44v3.19l-.72-.72a.754.754 0 0 0-1.06 0c-.29.29-.29.77 0 1.06l2 2c.01.01.02.01.02.02a.753.753 0 0 0 .51.2c.1 0 .19-.02.28-.06.09-.03.18-.09.25-.16l2-2c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-.72.72V4h3.44C19.83 4 22 6.17 22 9.81Z" fill="#000"></path></svg> info@example.com</p>-->
                                        <!--    <p class="flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path fill="#000" d="M11.05 14.95L9.2 16.8c-.39.39-1.01.39-1.41.01-.11-.11-.22-.21-.33-.32a28.414 28.414 0 01-2.79-3.27c-.82-1.14-1.48-2.28-1.96-3.41C2.24 8.67 2 7.58 2 6.54c0-.68.12-1.33.36-1.93.24-.61.62-1.17 1.15-1.67C4.15 2.31 4.85 2 5.59 2c.28 0 .56.06.81.18.26.12.49.3.67.56l2.32 3.27c.18.25.31.48.4.7.09.21.14.42.14.61 0 .24-.07.48-.21.71-.13.23-.32.47-.56.71l-.76.79c-.11.11-.16.24-.16.4 0 .08.01.15.03.23.03.08.06.14.08.2.18.33.49.76.93 1.28.45.52.93 1.05 1.45 1.58.1.1.21.2.31.3.4.39.41 1.03.01 1.43zM21.97 18.33a2.54 2.54 0 01-.25 1.09c-.17.36-.39.7-.68 1.02-.49.54-1.03.93-1.64 1.18-.01 0-.02.01-.03.01-.59.24-1.23.37-1.92.37-1.02 0-2.11-.24-3.26-.73s-2.3-1.15-3.44-1.98c-.39-.29-.78-.58-1.15-.89l3.27-3.27c.28.21.53.37.74.48.05.02.11.05.18.08.08.03.16.04.25.04.17 0 .3-.06.41-.17l.76-.75c.25-.25.49-.44.72-.56.23-.14.46-.21.71-.21.19 0 .39.04.61.13.22.09.45.22.7.39l3.31 2.35c.26.18.44.39.55.64.1.25.16.5.16.78z"></path></svg> +234XXXXXXXX</p>-->
                                        <!--  </div>-->
                                        <!--</div>-->
                                    </div>
                                </div>
                        </div>
                            
                                    <div class="w-full py-2 flex justify-center mx-8 bg-white p-5 rounded mt-2 bg-blue-400">
                                        <span onclick="printDomContent('SALES REPORT','displaydetails');document.getElementById('receiptsalesmodal').classList.add('hidden');emptysales()" class="cp material-symbols-outlined group-hover:text-primary-g scale-[1.5] text-white"
                                           style="font-size: 20px;">print</span>
                                    </div>
                        
                                </div>
                            </div>
                        
                            
  <!--                          <div id="modalreceipt" onclick="event.target.id == 'modalreceipt' ? this.classList.add('hidden') : ''" class="hidden fixed w-screen h-screen  top-0 z-[200] left-0 flex justify-center items-center overflow-auto">-->
                                
  <!--                              <div class="max-w-[90%] mx-auto border rounded shadow p-10 bg-white relative top-[30%]">-->
                        
  <!--                      		<div class="flex mb-8 justify-between">-->
  <!--                      			<div class="w-2/4">-->
  <!--                      				<div class="mb-2 md:mb-1 md:flex items-center">-->
  <!--                      					<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Invoice No.</label>-->
  <!--                      					<span class="mr-4 inline-block hidden md:block">:</span>-->
  <!--                      					<div class="flex-1">-->
  <!--                      					<input autocomplete="off" class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="eg. #INV-100001" x-model="invoiceNumber">-->
  <!--                      					</div>-->
  <!--                      				</div>-->
                        
  <!--                      				<div class="mb-2 md:mb-1 md:flex items-center">-->
  <!--                      					<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Invoice Date</label>-->
  <!--                      					<span class="mr-4 inline-block hidden md:block">:</span>-->
  <!--                      					<div class="flex-1">-->
  <!--                      					<input autocomplete="off" class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker" type="text" id="datepicker1" placeholder="eg. 17 Feb, 2020" x-model="invoiceDate" x-on:change="invoiceDate = document.getElementById('datepicker1').value" autocomplete="off" readonly="">-->
  <!--                      					</div>-->
  <!--                      				</div>-->
                        
  <!--                      				<div class="mb-2 md:mb-1 md:flex items-center">-->
  <!--                      					<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Due date</label>-->
  <!--                      					<span class="mr-4 inline-block hidden md:block">:</span>-->
  <!--                      					<div class="flex-1">-->
  <!--                      					<input autocomplete="off" class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker-2" id="datepicker2" type="text" placeholder="eg. 17 Mar, 2020" x-model="invoiceDueDate" x-on:change="invoiceDueDate = document.getElementById('datepicker2').value" autocomplete="off" readonly="">-->
  <!--                      					</div>-->
  <!--                      				</div>-->
  <!--                      			</div>-->
  <!--                      			<div>-->
  <!--                      				<span class="xl:w-[250px] pb-10 font-bold text-2xl text-base block py-3 pl-5 selection:bg-white uppercase font-heebo text-primary-g text-right">He<span class="text-gray-400">ms Invoice</span></span>-->
  <!--                      				<div class="flex justify-end">-->
  <!--                      				<div class="relative mr-4 inline-block">-->
  <!--                      					<div class="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 inline-flex items-center justify-center" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false" @click="printInvoice()">-->
  <!--                      						<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-printer" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">-->
  <!--                      							<rect x="0" y="0" width="24" height="24" stroke="none"></rect>-->
  <!--                      							<path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"></path>-->
  <!--                      							<path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"></path>-->
  <!--                      							<rect x="7" y="13" width="10" height="8" rx="2"></rect>-->
  <!--                      						</svg>				  -->
  <!--                      					</div>-->
  <!--                      					<div x-show.transition="showTooltip" class="z-40 shadow-lg text-center w-32 block absolute right-0 top-0 p-2 mt-12 rounded-lg bg-gray-800 text-white text-xs" style="display: none;">-->
  <!--                      						Print this invoice!-->
  <!--                      					</div>-->
  <!--                      				</div>-->
  <!--                      				<div onclick="did('modalreceipt').classList.add('hidden')" class="relative inline-block">-->
  <!--                      					<div class="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 inline-flex items-center justify-center" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false" @click="printInvoice()">-->
  <!--                      						<span class="material-symbols-outlined text-red-500">cancel</span>	  -->
  <!--                      					</div>-->
  <!--                      					<div x-show.transition="showTooltip" class="z-40 shadow-lg text-center w-32 block absolute right-0 top-0 p-2 mt-12 rounded-lg bg-gray-800 text-white text-xs" style="display: none;">-->
  <!--                      						cancel-->
  <!--                      					</div>-->
  <!--                      				</div>-->
                        				
  <!--                      			</div>-->
  <!--                      			</div>-->
  <!--</div>-->
                        
  <!--                      		<div class="flex flex-wrap justify-between mb-8">-->
  <!--                      			<div class="w-full md:w-1/3 mb-2 md:mb-0">-->
  <!--                      				<label class="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">Bill To:</label>-->
  <!--                      				<input autocomplete="off" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >-->
  <!--                      				<input autocomplete="off" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company address" >-->
  <!--                      				<input autocomplete="off" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Additional info" >-->
  <!--                      			</div>-->
  <!--                      			<div class="w-full md:w-1/3">-->
  <!--                      				<label class="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">From:</label>-->
  <!--                      				<input autocomplete="off" value="Hems Limited" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Your company name" >-->
                        
  <!--                      				<input autocomplete="off" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Your company address" >-->
                        
  <!--                      				<input autocomplete="off" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Additional info" >-->
  <!--                      			</div>-->
  <!--                              </div>-->
                        
  <!--                      		<div class="flex -mx-1 border-b py-2 items-start">-->
  <!--                      			<div class="w-10 px-1">-->
  <!--                      				<p class="text-gray-800 uppercase tracking-wide text-sm font-bold">S/N</p>-->
  <!--                      			</div>-->
  <!--                      			<div class="flex-1 px-1">-->
  <!--                      				<p class="text-gray-800 uppercase tracking-wide text-sm font-bold">Description</p>-->
  <!--                      			</div>-->
                        
  <!--                      			<div class="px-1 w-20 text-right">-->
  <!--                      				<p class="text-gray-800 uppercase tracking-wide text-sm font-bold">Units</p>-->
  <!--                      			</div>-->
                        
  <!--                      			<div class="px-1 w-32 text-right">-->
  <!--                      				<p class="leading-none">-->
  <!--                      					<span class="block uppercase tracking-wide text-sm font-bold text-gray-800">Unit Price</span>-->
                        					<!--<span class="font-medium text-xs text-gray-500">(Incl. GST)</span>-->
  <!--                      				</p>-->
  <!--                      			</div>-->
                        
  <!--                      			<div class="px-1 w-32 text-right">-->
  <!--                      				<p class="leading-none">-->
  <!--                      					<span class="block uppercase tracking-wide text-sm font-bold text-gray-800">Amount</span>-->
                        					<!--<span class="font-medium text-xs text-gray-500">(Incl. GST)</span>-->
  <!--                      				</p>-->
  <!--                      			</div>-->
  <!--</div>-->
  <!--                      	    <template x-for="invoice in items" :key="invoice.id">-->
                        			<!--<div class="flex -mx-1 py-2 border-b">-->
                        			<!--	<div class="flex-1 px-1">-->
                        			<!--		<p class="text-gray-800" >coke</p>-->
                        			<!--	</div>-->
                        
                        			<!--	<div class="px-1 w-20 text-right">-->
                        			<!--		<p class="text-gray-800" >10</p>-->
                        			<!--	</div>-->
                        
                        			<!--	<div class="px-1 w-32 text-right">-->
                        			<!--		<p class="text-gray-800">300</p>-->
                        			<!--	</div>-->
                        
                        			<!--	<div class="px-1 w-32 text-right">-->
                        			<!--		<p class="text-gray-800" >3,000</p>-->
                        			<!--	</div>-->
                        			<!--</div>-->
  <!--                              </template>-->
                        
                        		
  <!--                      			<div class="flex -mx-1 py-2 border-b">-->
  <!--                      				<div class="w-10 px-1">-->
  <!--                      					<p class="text-gray-800" >1</p>-->
  <!--                      				</div>-->
  <!--                      				<div class="flex-1 px-1">-->
  <!--                      					<p class="text-gray-800" >coke</p>-->
  <!--                      				</div>-->
                        
  <!--                      				<div class="px-1 w-20 text-right">-->
  <!--                      					<p class="text-gray-800" >10</p>-->
  <!--                      				</div>-->
                        
  <!--                      				<div class="px-1 w-32 text-right">-->
  <!--                      					<p class="text-gray-800">300</p>-->
  <!--                      				</div>-->
                        
  <!--                      				<div class="px-1 w-32 text-right">-->
  <!--                      					<p class="text-gray-800" >3,000</p>-->
  <!--                      				</div>-->
  <!--                      			</div>-->
                        
  <!--                      		<div class="py-2 ml-auto mt-5 w-full sm:w-2/4 lg:w-1/4">-->
  <!--                      			<div class="flex justify-between mb-3">-->
  <!--                      				<div class="text-gray-800 text-right flex-1">Total</div>-->
  <!--                      				<div class="text-right w-40">-->
  <!--                      					<div class="text-gray-800 font-medium">NGN 4,400.00</div>-->
  <!--                      				</div>-->
  <!--                      			</div>-->
  <!--                      			<div class="flex justify-between mb-4">-->
  <!--                      				<div class="text-sm text-gray-600 text-right flex-1">VAT</div>-->
  <!--                      				<div class="text-right w-40">-->
  <!--                      					<div class="text-sm text-gray-600" >NGN 0.00</div>-->
  <!--                      				</div>-->
  <!--                      			</div>-->
                        		
  <!--                      			<div class="py-2 border-t border-b">-->
  <!--                      				<div class="flex justify-between">-->
  <!--                      					<div class="text-xl text-gray-600 text-right flex-1">Paid Amount</div>-->
  <!--                      					<div class="text-right w-40">-->
  <!--                      						<div class="text-xl text-gray-800 font-bold">NGN 4,400.00</div>-->
  <!--                      					</div>-->
  <!--                      				</div>-->
  <!--                      			</div>-->
  <!--                              </div>-->
                        
  <!--                      		<div class="py-10 text-center">-->
  <!--                      			<p class="text-gray-600">Created by <a class="text-blue-600 hover:text-blue-500 border-b-2 border-blue-200 hover:border-blue-300" href="https://twitter.com/mithicher">Mira Technologies</a>.</p>-->
  <!--                              </div>-->
                        
                        		
                        
                        
                        
  <!--                      	</div>-->
                                
  <!--                          </div>-->
                            
                        
                        </section>  
                            <div id="whsalesviewmodalcontainer" onclick="event.target.id == 'whsalesviewmodalcontainer' ? this.classList.add('hidden') : ''" class="hidden fixed w-screen h-screen  top-0 z-[200] left-0 flex justify-center items-center overflow-auto">
                                
                                <div id="whsalesviewmodal" class="max-w-[90%] mx-auto border rounded shadow p-10 bg-white relative top-[50%] rounded-lg">
                                        Modal content goes here
                        	    </div>
                                
                            </div>
                        