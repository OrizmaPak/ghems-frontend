  
        <section class="animate__animated animate__fadeIn max-w-full">
            <p class="page-title">
                <span>check out</span>
            </p>
            
            <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 cark:border-gray-700 cark:text-gray-400">
                                <!--<li id="rccview" class="me-2 cp viewer" onclick="did('cancelreservationform').classList.add('hidden');this.children[0].classList.add('active', '!text-blue-600');did('lostandfoundview').classList.remove('hidden');this.nextElementSibling.children[0].classList.remove('active', '!text-blue-600');">-->
                                <li  class="me-2 cp updater optioner !text-blue-600 active" name="checkoutcontainer" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Check Out</p>
                                </li> 
                                <li id="" class="me-2 cp viewer optioner" name="checkoutview" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ">View Check Outs</p>
                                </li>
                            </ul>
            
             <hr class="my-3">
            
            <!--<div id="" class="bg-white xl:border !max-w-[100%] overflow-auto rounded py-14 px-7 drop-shadow-sm pt-4">-->
            <div id="" class="bg-white xl:border overflow-auto rounded py-14 px-7 drop-shadow-sm pt-4">
                    
                    <div id="checkoutcontainer" class="grid grid-cols-1 lg:grid-cols-3 gap-7 w-full mx-auto">
                        <div class="w-full col-span-2">
                            <form id="getrefform" class="">
                            <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                <div class="grid grid-cols-1 !mb-5 lg:grid-cols-4 gap-10">
                                    <div class="form-group col-span-3">
                                        <label for="logoname" class="control-label">Reservation Ref</label>
                                        <input type="text" name="reference" id="reference" class="form-control" >
                                    </div>
                                    <div class="flex items-end">
                                        <button id="submitref" type="button" class="w-full h-[45px] md:w-max text-white text-sm capitalize bg-blue-400 px-4 py-1 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
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
                            <form id="checkoutform" class=" shadow rounded border">
                                <div class="table-content">
                                    <table id="tableer">
                                        <thead>
                                            <tr>
                                                 <th style="width: 20px">s/n</th> 
                                                <th>date</th>
                                                <th>item</th>
                                                <th>debit</th>
                                                <th>credit</th>
                                                <th>balance</th>
                                            </tr>
                                        </thead>
                                        <tbody id="tabledata2">
                                            <tr>
                                                <td colspan="100%" class="text-center opacity-70"> Table is empty </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div class="flex gap-10 justify-end items-end pr-5">
                                        <input type="hidden" name="balance" id="balance" />
                                         <div class="form-group pl-6">
                                                <label for="logoname" class="control-label text-md ">payment method</label>
                                                <select name="paymentmethod" id="paymentmethod" class="bg-white form-control !p-2 comp">
                                                    <option value="">-- SELECT PAYMENT METHOD --</option>
                                                    <option>TRANSFER</option>
                                                    <option>CASH</option>
                                                    <option>POS</option>
                                                </select>
                                            </div>
                                    </div>
                                            <div id="bankdetails" class="px-5"></div>
                                            <div class="w-full flex justify-end mt-2">
                                                <button id="submit" type="button" class="w-full h-[45px] md:w-max text-white text-sm capitalize bg-blue-400 px-4 py-1 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span class="">Check&nbsp;Out</span>
                                                </button>
                                            </div>
                                    
                                </div>
                            </form>
                        </div>
                        <div class="w-fit flex flex-col items-end">
                            <div class="w-80 rounded bg-gray-50 px-6 pt-8 shadow-lg" id="displaydetails">
                                <!--<img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" alt="chippz" class="mx-auto w-16 py-4" />-->
                                <!--<div class="flex flex-col justify-center items-center gap-2">-->
                                <!--    <h4 class="font-semibold">Business Name</h4>-->
                                <!--    <p class="text-xs">Some address goes here</p>-->
                                <!--</div>-->
                                <!--<div class="flex flex-col gap-3 border-b py-6 text-xs">-->
                                <!--  <p class="flex justify-between">-->
                                <!--    <span class="text-gray-400">checkout No.:</span>-->
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
                
            </div>
            
            <div id="checkoutview" class="hidden">
                
            <form id="checkoutformfilter" class="">
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
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">end date</label>
                                                    <input  type="date" name="enddate" id="arrivaldaterrr" class="sss form-control">
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-10">
                                                <div class="form-group">
                                                </div>
                                                
                                                
                                                <div class="flex justify-end mt-5">
                                                    <button onclick="fetchcheckinn('', '', 'checkoutformfilter', this) " type="button" class="btn">
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
            
            <div class="table-content  lg:max-w-[1000px]">
                
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
                                
                <div class="table-status"></div>
            </div>
            </div>
        
        </section>  
               <div id="modalcheckout" onclick="if(event.target.id == 'modalcheckout')this.classList.add('hidden');did('checkout').click()" class="!z-[100] w-screen h-screen fixed bg-[#5a5a5a3e] top-0 left-0 p-10 overflow-auto hidden">
                               
                               <div id="viewformtoeditcheckout" class="animate__animated animate__fadeIn w-[80%] bg-white w-fit mx-auto relative p-10 rounded-lg shadow-lg">
                                   
                                   
                    
                               
                        </div>
                        
                        </div>
                        