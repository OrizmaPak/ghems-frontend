  <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                                <!--<li id="rccview" class="me-2 cp viewer" onclick="did('guestsreservationsform').classList.add('hidden');this.children[0].classList.add('active', '!text-blue-600');did('lostandfoundview').classList.remove('hidden');this.nextElementSibling.children[0].classList.remove('active', '!text-blue-600');">-->
                                <li id="" class="me-2 cp viewer optioner !text-blue-600 active" name="expensesview" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ">View Expenses</p>
                                </li>
                                <li id="iddformform" class="me-2 cp updater optioner" name="expenseformdiv" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Expenses</p>
                                </li>
                            </ul>
                    

<div id="expenseformdiv" class="hidden">
                        <form id="expensesform">
                                    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">Paid to</label>
                                                <input type="text" id="paidto1" class="form-control comp" list="supplierlister" onchange="checkdatalist(this, 'paidto', 'supplierlisterid', false)" placeholder="Search by Item Name">
                                                <input type="text" name="paidto" id="paidto" class="form-control hidden" placeholder="Search by Item Name">
                                            </div>
                                            <div class="form-group"> 
                                                <label for="logoname" class="control-label">other detail</label>
                                                <input type="text" name="otherdetail" id="otherdetail" class="form-control" placeholder="Other details">
                                            </div>
                                        </div>
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">Description</label>
                                                <textarea name="description" id="description" class="form-control" placeholder="Enter Description"></textarea>
                                            </div>
                                        <div>
                                    <div class="table-content ">
                                        <div class="flex w-full justify-end my-3">
                                            <div class="flex justify-end gap-3 items-center p-3 border rounded bg-[#00000045] shadow">
                                                <label for="logoname" class="control-label text-xl font-bold">Total:</label>
                                                <label for="logoname" id="totalamountt" class="control-label text-xl text-[blue] font-bold">0</label>
                                                <input autocomplete="off" type="number" name="totalamount" id="totalamount" class="form-control !hidden text-2xl border-none font-bold" readonly="" placeholder="">
                                            </div>
                                        </div>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>s/n</th>
                                                    <th>item</th>
                                                    <th>amount</th>
                                                    <th><button id="additemrowexpenses" title="Add Item" class="material-symbols-outlined rounded-full bg-green-500 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">add</button></th>
                                                </tr>
                                            </thead>
                                            <tbody id="tabledata1">
                                               <tr id="row-0">
                                                    <td class="text-center opacity-70 s/n">1</td>
                                                    <td class="text-center opacity-70">
                                                        <label class="control-label hidden">Account</label>
                                                        <input name="" id="item1-0" list="fetchglbyaccounttype" onchange="checkdatalist(this, 'item-0', 'fetchglbyaccounttypeaccountnumber')" type="text" class="form-control  comp" placeholder="Enter Item"/>
                                                        <input name="item" id="item-0" type="text" class="form-control item hidden" placeholder="Enter Item"/>
                                                    </td>
                                                    <td class="text-center opacity-70">
                                                        <label class="control-label hidden">Amount</label>
                                                        <input name="amount" id="amount-0" onchange="calculateexpenses(this)" type="number" class="form-control amount comp" placeholder="Enter Amount"/>
                                                    </td>
                                                    <td class="text-center opacity-70">
                                                        <button onclick="this.parentElement.parentElement.remove();runCount()" title="Remove item" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">remove</button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="table-status"></div>
                                </div> 
                                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label text-md">payment method</label>
                                                <select name="paymentmethod" id="paymentmethod" class="bg-white form-control !p-2 comp">
                                                    <option>BANK TRANSFER</option>
                                                    <option>CASH</option>
                                                    <option>VIRTUAL ACCOUNT</option>
                                                    <option>BANK CARD</option>
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">amount paid</label>
                                                <input type="number" name="amountpaid" id="amountpaid" class="form-control comp" placeholder="amount paid">
                                            </div>
                                        </div>
                                       
                            
                                    </div>
                                 <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            <datalist id="supplierlister"></datalist>
                                            <datalist id="supplierlisterid"></datalist>
                                            <datalist id="fetchglbyaccounttype"></datalist>
                                            <datalist id="fetchglbyaccounttypeaccountnumber"></datalist>
                                            <div></div>
                                            <div></div>
                                            
                                            <div class="flex justify-end mt-5">
                                                 <button id="submit" type="button" class="btn">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Submit</span>
                                                </button>
                                            </div>
                                            
                                        </div> 
                                </form>
                             
                                
                    </div>
                    
<div id="expensesview" class="">
                        <form id="expenseformview">
                                    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">Start Date</label>
                                                <input type="date" name="startdate" id="startdate" class="form-control" placeholder="Search by Item Name">
                                            </div>
                                            <div class="form-group">
                                                <label for="logoname" class="control-label">End Date</label>
                                                <input type="date" name="enddate" id="enddate" class="form-control" placeholder="Search by Item Name">
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            
                                            <div></div>
                                            <div></div>
                                            
                                            <div class="flex justify-end mt-5">
                                                 <button id="submit1" type="button" class="btn">
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
                        <hr class="my-10">   
                        <div >
                                    <div class="table-content">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>s/n</th>
                                                    <th>t.date</th>
                                                    <th>Applyto</th>
                                                    <th>description</th>
                                                    <th>Total&nbsp;Amount</th>
                                                    <th>Amount&nbsp;paid</th>
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
                    </div>
                    
                    <div id="expensemodal" onclick="if(event.target.id === 'expensemodal')this.classList.add('hidden')" class="hidden w-full h-full bg-[#0000004a] fixed top-0 left-0 overflow-y-auto flex justify-center items-start">
                                <div class="w-fit max-w-[90%] mt-8 min-w-[500px] h-fit min-h-[400px] bg-white p-2 rounded-md shadow-lg flex flex-col items-center">
                                    
                                    <div class="w-full py-2 flex justify-between mx-8">
                                        <p id="modaltitle" class="text-md font-bold">EXPENSE REPORT</p>
                                        <div onclick="printDomContent('SALES REPORT', 'printer')" class="w-[100px] hover:scale-[1.3] transition-all flex justify-center mx-8 bg-white p-2 rounded bg-blue-400">
                                            <span class="cp material-symbols-outlined group-hover:text-primary-g scale-[1.5] text-white" style="font-size: 20px;">print</span>
                                        </div>
                                        <span onclick="document.getElementById('expensemodal').classList.add('hidden')" class="cp material-symbols-outlined text-red-600 group-hover:text-primary-g"
                                           style="font-size: 20px;">close</span>
                                    </div>
                                    
                                    <hr class="mb-4"/>
                                    
                                    <div id="printer">
                                    
                                        <div id="modaldetails" class="grid grid-cols-1 lg:grid-cols-3 gap-3 w-full border shadow max-w-[600px] p-6">
                                            
                                        <!-- <p class="!text-sm font-thin">Supplier: <span id="vrqsupplier" class="uppercase !text-sm font-semibold" style=""></span></p>-->
                                        <!--<p class="!text-sm font-thin">Transaction Time: <span class="!text-sm font-semibold" id="vrqtime" style="">  </span></p>-->
                                        <!--<p class="!text-sm font-thin">Transaction Date: <span class="!text-sm font-semibold" id="vrqdate" style=""> </span> </p>-->
                                        <!--<p class="!text-sm font-thin">Location: <span id="vrqlocation" class="uppercase !text-sm font-semibold" style=""></span></p>-->
                                        <!--<p class="!text-sm font-thin" style="marginLeft: 20px;">Description: <span id="vrqdesc" class="font-semibold" style=""></span> </p>-->
                                        <!--<p class="!text-sm font-thin">Invoice Number: <span id="vrqref" class="uppercase !text-sm font-semibold" style=""></span></p>-->
                                            
                                        </div>
                                        
                                        <div class="table-content my-4">
                                                <table>
                                                    <thead>
                                                        <tr id="tableheader">
                                                           <th>s/n </th>
                                                            <th> Item ID </th>
                                                            <th> Item Name </th>
                                                            <th> qty </th>
                                                            <th> PRICE </th>
                                                            <th> TOTAL </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="tabledata2">
                                                       <tr>
                                                            <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                    
                                    </div>
                                    
                                </div>
                                
                            </div>
                        