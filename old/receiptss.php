       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>RECEIPTS</span>
                            </p>
                            
                             <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                                <!--<li id="rccview" class="me-2 cp viewer" onclick="did('guestsreservationsform').classList.add('hidden');this.children[0].classList.add('active', '!text-blue-600');did('lostandfoundview').classList.remove('hidden');this.nextElementSibling.children[0].classList.remove('active', '!text-blue-600');">-->
                                <li id="iddreceiptsform" class="me-2 cp updater optioner !text-blue-600 active" name="receiptsform" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Receipts</p>
                                </li>
                                <li id="" class="me-2 cp  optioner viewer" name="receiptsview" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ">View Receipts</p>
                                </li>
                            </ul>
                            
                            <form id="receiptsform" class="">
                                     <ol class="flex items-center !text-xs w-full  p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white mt-4 shadow-sm sm:text-base  sm:p-4 sm:space-x-4 rtl:space-x-reverse">
                                   
                                <div class="flex justify-end w-full">
                                                 <button onclick="printContent('HEMS receipts FORM', null, 'receiptsform', true)" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>print</span> 
                                                </button>
                                                 <button onclick="exportToPDF('receiptsform')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Export PDF</span> 
                                                </button>
                                            </div>
                                </ol>
                                    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                       
                                        <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">Receipt From:</label>
                                                <input type="text"  name="owner" id="owner" list="hems_roomnumber_id" class="form-control comp">
                                            </div>
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">transaction date</label>
                                                <input type="date" name="transactiondate" id="transactiondate" class="form-control comp" >
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-1  lg:grid-cols-2 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">amount paid</label>
                                                <input type="number"  name="amountpaid" id="amountpaid" class="form-control comp" placeholder="Enter Amount paid">
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
                                        </div>
                                        
                            
                                    </div>
                                    <div class="w-full flex justify-end my-3">
                                    <button id="submit" type="button" class="btn">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Submit</span> 
                                                </button>
                                    <!--<button id="submit" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                    <!--                <div class="btnloader" style="display: none;"></div>-->
                                    <!--                <span>Submit</span> -->
                                    <!--            </button>-->
                                    </div>
                                </form>
                            <hr class="my-3">
                            <div id="receiptsview" class="hidden">
                                 <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                       
                                <form id="viewreceiptform">
                                        <div class="grid grid-cols-1 !mb-5 lg:grid-cols-2 gap-10">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">Start date</label>
                                                <input type="date"  name="startdate" id="startdate" list="hems_roomnumber_id" class="form-control comp2">
                                            </div>
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">End date</label>
                                                <input type="date" name="enddate" id="enddate" class="form-control comp2" >
                                            </div>
                                        </div>
                                    <div class="w-full flex justify-end my-3">
                                                <button id="submit" type="button" class="btn">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Submit</span> 
                                                </button>
                                                <!--<button id="submit" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                                <!--    <div class="btnloader" style="display: none;"></div>-->
                                                <!--    <span>Submit</span> -->
                                                <!--</button>-->
                                    </div>
                                </form>
                                </div>
                                <div class="table-content">
                                    <table id="tableer">
                                        <thead>
                                            <tr>
                                                 <th style="width: 20px">s/n</th>
                                                <th>Receipt&nbsp;From</th>
                                                <th>Transaction&nbsp;Date</th>
                                                <th>Credit</th>
                                                <th>payment&nbsp;method</th>
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
                            
                            
                            <div id="modalreceipt" onclick="event.target.id == 'modalreceipt' ? this.classList.add('hidden') : ''" class="hidden fixed w-screen h-screen  top-0 z-[200] left-0 flex justify-center items-center overflow-auto">
                                
                                <div id="invoicecontainerr" class="max-w-[90%] mx-auto border rounded shadow p-10 bg-white relative top-[30%]">
                        
                        		<div class="flex mb-8 justify-between">
                        			<div class="w-2/4">
                        				<div class="mb-2 md:mb-1 md:flex items-center">
                        					<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Invoice No.</label>
                        					<span class="mr-4 inline-block hidden md:block">:</span>
                        					<div class="flex-1">
                        					<input id="invoiceno" readonly class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="eg. #INV-100001" x-model="invoiceNumber">
                        					</div>
                        				</div>
                        
                        				<div class="mb-2 md:mb-1 md:flex items-center">
                        					<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Invoice Date</label>
                        					<span class="mr-4 inline-block hidden md:block">:</span>
                        					<div class="flex-1">
                        					<input id="invoicedate" readonly class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker" type="text" id="datepicker1" placeholder="eg. 17 Feb, 2020" x-model="invoiceDate" x-on:change="invoiceDate = document.getElementById('datepicker1').value" autocomplete="off" readonly="">
                        					</div>
                        				</div>
                        
                        				<!--<div class="mb-2 md:mb-1 md:flex items-center">-->
                        				<!--	<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Due date</label>-->
                        				<!--	<span class="mr-4 inline-block hidden md:block">:</span>-->
                        				<!--	<div class="flex-1">-->
                        				<!--	<input class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker-2" id="datepicker2" type="text" placeholder="eg. 17 Mar, 2020" x-model="invoiceDueDate" x-on:change="invoiceDueDate = document.getElementById('datepicker2').value" autocomplete="off" readonly="">-->
                        				<!--	</div>-->
                        				<!--</div>-->
                        			</div>
                        			<div>
                        				<span class="xl:w-[250px] pb-10 font-bold text-2xl text-base block py-3 pl-5 selection:bg-white uppercase font-heebo text-primary-g text-right">He<span class="text-gray-400">ms Invoice</span></span>
                        				<div class="flex justify-end">
                        				<div onclick="printContent('HEMS INVOICE', null, 'invoicecontainer', true)" class="relative mr-4 inline-block">
                        					<div class="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 inline-flex items-center justify-center" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false" @click="printInvoice()">
                        						<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-printer" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        							<rect x="0" y="0" width="24" height="24" stroke="none"></rect>
                        							<path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"></path>
                        							<path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"></path>
                        							<rect x="7" y="13" width="10" height="8" rx="2"></rect>
                        						</svg>				  
                        					</div>
                        					<div x-show.transition="showTooltip" class="z-40 shadow-lg text-center w-32 block absolute right-0 top-0 p-2 mt-12 rounded-lg bg-gray-800 text-white text-xs" style="display: none;">
                        						Print this invoice!
                        					</div>
                        				</div>
                        				<div onclick="did('modalreceipt').classList.add('hidden')" class="relative inline-block">
                        					<div class="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 inline-flex items-center justify-center" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false" @click="printInvoice()">
                        						<span class="material-symbols-outlined text-red-500">cancel</span>	  
                        					</div>
                        					<div x-show.transition="showTooltip" class="z-40 shadow-lg text-center w-32 block absolute right-0 top-0 p-2 mt-12 rounded-lg bg-gray-800 text-white text-xs" style="display: none;">
                        						cancel
                        					</div>
                        				</div>
                        				
                        			</div>
                        			</div>
  </div>
                        
                        		<div class="flex flex-wrap justify-between mb-8">
                        			<div class="w-full md:w-1/3 mb-2 md:mb-0">
                        				<label class="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">Bill To:</label>
                        				<input id="rbillto" readonly class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                        				<input id="rroomnumber" readonly class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company address" >
                        				<input id="rpaymentmenthod" readonly class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Additional info" >
                        			</div>
                        			<div class="w-full md:w-1/3">
                        				<label class="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">From:</label>
                        				<input value="Hems Limited" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Your company name" >
                        
                        				<input class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Your company address" >
                        
                        				<input class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Additional info" >
                        			</div>
                                </div>
                                
                                <table id="tableer">
                                        <thead>
                                            <tr>
                                                 <th style="width: 20px">s/n</th>
                                                <th>Check-in Date</th>
                                                <th>room&nbsp;number</th>
                                                <th>no. of night</th>
                                                <th>debit</th>
                                                <th>credit</th>
                                                <th>balance</th>
                                            </tr>
                                        </thead>
                                        <tbody id="tabledata">
                                            <tr>
                                                <td class="text-center opacity-70">1</td>
                                                <td id="rreceiptsdate" class="text-center opacity-70"> </td>
                                                <td id="rrroomnumber" class="text-center opacity-70"> </td>
                                                <td id="rnumberofnights" class="text-center opacity-70"> </td>
                                                <td id="rdebit" class="text-center opacity-70"> </td>
                                                <td id="rcredit" class="text-center opacity-70"> </td>
                                                <td id="rbalance" class="text-center opacity-70"> </td>
                                            </tr>
                                        </tbody>
                                    </table>
                        
  <!--                      		<div class="flex -mx-1 border-b py-2 items-start">-->
  <!--                      			<div class="w-10 px-1">-->
  <!--                      				<p class="text-gray-800 uppercase tracking-wide text-sm font-bold">S/N</p>-->
  <!--                      			</div>-->
  <!--                      			<div class="w-150 px-1">-->
  <!--                      				<p class="text-gray-800 uppercase tracking-wide text-sm font-bold">Check-in Date</p>-->
  <!--                      			</div>-->
                        
  <!--                      			<div class="px-1 w-40 text-right">-->
  <!--                      				<p class="text-gray-800 uppercase tracking-wide text-sm font-bold">room no.</p>-->
  <!--                      			</div>-->
  <!--                      			<div class="px-1 w-40 text-right">-->
  <!--                      				<p class="text-gray-800 uppercase tracking-wide text-sm font-bold">no. of night</p>-->
  <!--                      			</div>-->
                        
  <!--                      			<div class="px-1 flex-1 text-right">-->
  <!--                      				<p class="leading-none">-->
  <!--                      					<span class="block uppercase tracking-wide text-sm font-bold text-gray-800">debit</span>-->
                        					<!--<span class="font-medium text-xs text-gray-500">(Incl. GST)</span>-->
  <!--                      				</p>-->
  <!--                      			</div>-->
                        
  <!--                      			<div class="px-1 flex-1 text-right">-->
  <!--                      				<p class="leading-none">-->
  <!--                      					<span class="block uppercase tracking-wide text-sm font-bold text-gray-800">Credit</span>-->
                        					<!--<span class="font-medium text-xs text-gray-500">(Incl. GST)</span>-->
  <!--                      				</p>-->
  <!--                      			</div>-->
  <!--                      			<div class="px-1 flex-1 text-right">-->
  <!--                      				<p class="leading-none">-->
  <!--                      					<span class="block uppercase tracking-wide text-sm font-bold text-gray-800">balance</span>-->
                        					<!--<span class="font-medium text-xs text-gray-500">(Incl. GST)</span>-->
  <!--                      				</p>-->
  <!--                      			</div>-->
  <!--</div>-->
                        
                        		
                        			<div class="flex -mx-1 py-2 border-b">
                        				<div class="w-10 px-1">
                        					<p class="text-gray-800" >1</p>
                        				</div>
                        				<div class="w-150 px-1">
                        					<p id="rreceiptsdate" class="text-gray-800"></p>
                        				</div>
                        
                        				<div class="px-1 w-40 text-right">
                        					<p id="rrroomnumber" class="text-gray-800"></p>
                        				</div>
                        
                        				<div class="px-1 w-40 text-right">
                        					<p id="rnumberofnights" class="text-gray-800"></p>
                        				</div>
                        
                        				<div class="flex-1 px-1 text-right">
                        					<p id="rdebit" class="text-gray-800"></p>
                        				</div>
                        
                        				<div class="flex-1 px-1 text-right">
                        					<p id="rcredit" class="text-gray-800"></p>
                        				</div>
                        				
                        				<div class="flex-1 px-1 text-right">
                        					<p id="rbalance" class="text-gray-800"></p>
                        				</div>
                        			</div>
                        
                        		<div class="py-2 ml-auto mt-5 w-full sm:w-2/4 lg:w-1/4">
                        			<div class="flex justify-between mb-3">
                        				<div class="text-gray-800 text-right flex-1">Total&nbsp;Balance</div>
                        				<div class="text-right w-40">
                        					<div id="rtotalbalance" class="text-gray-800 font-medium"></div>
                        				</div>
                        			</div>
                        			<div class="flex justify-between mb-4">
                        				<div class="text-sm text-gray-600 text-right flex-1">VAT</div>
                        				<div class="text-right w-40">
                        					<div id="" class="text-sm text-gray-600" >0.00</div>
                        				</div>
                        			</div>
                        		
                        			<div class="py-2 border-t border-b">
                        				<div class="flex justify-between">
                        					<div class="text-xl text-gray-600 text-right flex-1">Total&nbsp;Paid&nbsp;Amount</div>
                        					<div class="text-right w-40">
                        						<div id="rtotalpaid" class="text-xl text-gray-800 font-bold"></div>
                        					</div>
                        				</div>
                        			</div>
                                </div>
                        
                        		<div class="py-10 text-center">
                        			<p class="text-gray-600">Created by <a class="text-blue-600 hover:text-blue-500 border-b-2 border-blue-200 hover:border-blue-300" href="https://twitter.com/mithicher">Mira Technologies</a>.</p>
                                </div>
                        
                        		
                        
                        
                        
                        	</div>
                                
                            </div>
                        
                        </section>  