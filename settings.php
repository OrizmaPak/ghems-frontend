    <section class="h-full overflow-y-auto">
        <style>.edit-icon {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: #08c0f7;
    color: white;
    border-radius: 50%;
    padding: 4px;
    cursor: pointer;
}

.edit-icon:hover {
    background-color: #e0e0e0;
}</style>
        <div class="text-primary-g font-heebo font-bold text-base uppercase md:w-2/3 xl:w-1/3 3xl:w-2/5 mx-auto text-center mt-10 lg:mb-10"> 
            <!--He<span class="text-gray-400">ms</span>-->
        </div> 
        <div class="bg-white xl:border w-[100%] mx-auto rounded py-14 px-12 drop-shadow-sm pt-4">
            <div class="flex flex-col lg:flex-row lg:justify-between">
                            <div class="mb-3 bg-[white] flex items-end">
                                <ul class="flex cp justify-center flex-wrap -mb-px border-b  text-sm font-medium text-center text-gray-500 ">
                                    <li class="me-2">
                                        <div id="settings_basicinfo" class="inline-flex items-center justify-center p-4 border-b-2 !border-blue-600 !text-blue-600 active rounded-t-lg active  group" aria-current="page">
                                            <svg class="w-4 h-4 me-2 !text-blue-600 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                                <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
                                            </svg>Basic Info
                                        </div>
                                    </li>
                                    <li class="me-2">
                                        <div id="settings_defaultaccounts" class="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 group">
                                            <svg class="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M5 11.424V1a1 1 0 1 0-2 0v10.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.228 3.228 0 0 0 0-6.152ZM19.25 14.5A3.243 3.243 0 0 0 17 11.424V1a1 1 0 0 0-2 0v10.424a3.227 3.227 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.243 3.243 0 0 0 2.25-3.076Zm-6-9A3.243 3.243 0 0 0 11 2.424V1a1 1 0 0 0-2 0v1.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0V8.576A3.243 3.243 0 0 0 13.25 5.5Z"/>
                                            </svg>Default Accounts
                                        </div>
                                    </li>
                                </ul>
                            </div>
                <div class="flex flex-col w-5/6 lg:w-fit m-auto items-center py-5 sticky top-0 bg-white ">
                            <div class="relative w-[140px] h-[140px] lg:w-[140px] my-10 rounded-full overflow-hidden">
        <img id="displayimg" src="./images/default-avatar.png" alt="user Avatar" class="w-full h-full object-center">
        <span class="material-symbols-outlined edit-icon" onclick="document.getElementById('fileInput').click()">edit</span>
        <input type="file" id="fileInput" accept="image/*" style="display: none;" onchange="updateImage(event)">
    </div>
                            <!--<span class="rounded-full text-white text-3xs font-bold capitalize bg-blue-500 my-3 px-2 py-0.5 text-center">Organisation</span>-->
            <h1 class="font-bold text-2xl text-center"><span class="text-blue-500">HE</span>MS</h1>
                            

                        </div>
            </div>
            <!--<p class="mt-5 text-xs text-gray-400 tracking-wider leading-relaxed font-sans text-center">Provide the information below to register a new account</p>-->
            
                



            <form class="mt-10" id="settingsform" autocomplete="of">
                    <div class="w-[100%] overflow-hidden flex transition-all">
                        <div name="settings_basicinfo" class="w-[100%] h-fit visible flex flex-col transition-all gap-" mt-5>
                    
                            <div class="flex flex-col lg:flex-row items-start gap-3 mt-3">
                                    <input name="company_id" id="company_id" type="hidden" class="font-semibold text-sm focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                <div class="form-group-auth mt-5">
                                    <label for="companyname" class="text-gray-500 font-normal capitalize text-2xs font-heebo">Company Name<span class="text-[red]">*</span></label>
                                    <input name="companyname" id="companyName" type="text" class="font-semibold text-sm focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                </div>
                                <div class="form-group-auth mt-5">
                                    <label for="lastname" class="text-gray-500 font-normal capitalize text-2xs font-heebo">SMS Sender ID<span class="text-[red]">*</span></label>
                                    <input name="smssenderid" id="smssenderid" type="text" class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent comp border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                </div>
                                <div class="form-group-auth mt-5">
                                    <label for="othernames" class="text-gray-500 font-normal capitalize text-2xs font-heebo">Number Of Users<span class="text-[red]">*</span></label>
                                    <input name="no_of_users" id="no_of_users" type="number" class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent comp border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                </div>
                            </div>
                            <div class="flex flex-col lg:flex-row items-start gap-3 mt-3">
                                <div class="form-group-auth mt-5">
                                    <label for="email" class="text-gray-500 font-normal capitalize text-2xs font-heebo">Telephone<span class="text-[red]">*</span></label>
                                    <input name="telephone" id="telephone" type="tel"  class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent comp border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                </div>
                                <div class="form-group-auth mt-5">
                                    <label for="phone" class="text-gray-500 font-normal capitalize text-2xs font-heebo">Mobile</label>
                                    <input name="mobile" id="mobile" type="tel" class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                </div>
                                <div class="form-group-auth mt-5">
                                    <label for="address" class="text-gray-500 font-normal capitalize text-2xs font-heebo">Email<span class="text-[red]">*</span></label>
                                    <input name="email" id="email" type="email" class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent comp border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                </div>
                            </div>
                            <div class="flex flex-col lg:flex-row items-start gap-3 mt-3">
                                <div class="form-group-auth mt-5">
                                    <label for="role" class="text-gray-500 font-normal capitalize text-2xs font-heebo">Address<span class="text-[red]">*</span></label>
                                    <input  id="address" type="text" name="address" class="font-semibold text-sm focus:outline-none comp focus:ring-0 bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                </div>
                                <div class="form-group-auth mt-5">
                                    <label for="location_name" class="text-gray-500 font-normal capitalize text-2xs font-heebo">SMS Charge<span class="text-[red]">*</span></label>
                                    <input  id="smscharge" type="number" name="smscharge" class="font-semibold text-sm focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                </div>
                                <div class="form-group-auth mt-5">
                                    <label for="dateofbirth" class="text-gray-500 font-normal capitalize text-2xs font-heebo">SMS Charge Account<span class="text-[red]">*</span></label>
                                         <select id="smschargeaccount" name="smschargeaccount" class="font-semibold text-sm focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                        <option selected="" value="" disabled>Select SMS charge account to credit</option>
                                            <option value="8001000010">8001000010 | LOAN FEES</option>
                                            <option value="8001000026">8001000026 | LOAN PROVISIONING</option>
                                            <option value="8001000009">8001000009 | COMMISSIONS</option>
                                            <option value="8001000011">8001000011 | PENALTIES</option>
                                            <option value="8001000012">8001000012 | CHARGES</option>
                                            <option value="8001000021">8001000021 | GENERAL INCOME</option>
                                            <option value="8001000008">8001000008 | LOAN INTEREST</option>    
                                    </select>
                                </div>
                            </div>
                            <div class="flex flex-col lg:flex-row items-start gap-3 mt-3">
                                <div class="form-group-auth mt-5">
                                    <label for="role" class="text-gray-500 font-normal capitalize text-2xs font-heebo">VAT Rate (%)<span class="text-[red]">*</span></label>
                                    <select name="vatrate" id="vatrate" class="font-semibold text-sm focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                        <option>4</option>
                                        <option>4.5</option>
                                        <option>5</option>
                                        <option>5.5</option>
                                        <option>6</option>
                                        <option>6.5</option>
                                        <option>7</option>
                                        <option>7.5</option>
                                        <option>8</option>
                                        <option>8.5</option>
                                        <option>9</option>
                                        <option>9.5</option>
                                        <option>10</option>
                                        <option>10.5</option>
                                        <option>11</option>
                                        <option>11.5</option>
                                        <option>12</option>
                                        <option>12.5</option>
                                        <option>13</option>
                                        <option>13.5</option>
                                        <option>14</option>
                                        <option>14.5</option>
                                        <option>15</option>
                                        <option>15.5</option>
                                        <option>16</option>
                                        <option>16.5</option>
                                        <option>17</option>
                                        <option>17.5</option>
                                        <option>18</option>
                                        <option>18.5</option>
                                        <option>19</option>
                                        <option>19.5</option>
                                        <option>20</option>
                                        <option>20.5</option>
                                    </select>
                                </div>
                                <div class="form-group-auth mt-5">
                                    <label for="location_name" class="text-gray-500 font-normal capitalize text-2xs font-heebo">WHT Rate (%)<span class="text-[red]">*</span></label>
                                    <select id="whtrate"  name="whtrate" class="font-semibold text-sm focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                        <option>4</option>
                                        <option>4.5</option>
                                        <option>5</option>
                                        <option>5.5</option>
                                        <option>6</option>
                                        <option>6.5</option>
                                        <option>7</option>
                                        <option>7.5</option>
                                        <option>8</option>
                                        <option>8.5</option>
                                        <option>9</option>
                                        <option>9.5</option>
                                        <option>10</option>
                                        <option>10.5</option>
                                        <option>11</option>
                                        <option>11.5</option>
                                        <option>12</option>
                                        <option>12.5</option>
                                        <option>13</option>
                                        <option>13.5</option>
                                        <option>14</option>
                                        <option>14.5</option>
                                        <option>15</option>
                                        <option>15.5</option>
                                        <option>16</option>
                                        <option>16.5</option>
                                        <option>17</option>
                                        <option>17.5</option>
                                        <option>18</option>
                                        <option>18.5</option>
                                        <option>19</option>
                                        <option>19.5</option>
                                        <option>20</option>
                                        <option>20.5</option>
                                    </select>
                                </div>
                                <div class="form-group-auth mt-5">
                                    <label for="dateofbirth" class="text-gray-500 font-normal capitalize text-2xs font-heebo">Allow Back-Dated Transaction<span class="text-[red]">*</span></label>
                                    <select id="backdated_transaction" name="backdated_transaction" class="font-semibold text-sm focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                        <option></option>
                                        <option>YES</option>
                                        <option>NO</option>
                                    </select>
                                </div>
                            </div>
                            <div class="flex flex-col lg:flex-row items-start gap-3 mt-3">
                                <div class="form-group-auth mt-5">
                                    <label for="role" class="text-gray-500 font-normal capitalize text-2xs font-heebo">Allow Future Transaction<span class="text-[red]">*</span></label>
                                    <select name="future_transaction" id="future_transaction" class="font-semibold text-sm focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                        <option></option>
                                        <option>YES</option>
                                        <option>NO</option>
                                    </select>
                                </div>
                                <div class="form-group-auth mt-5">
                                    <label for="dateofbirth" class="text-gray-500 font-normal capitalize text-2xs font-heebo">Automate SMS Charges<span class="text-[red]">*</span></label>
                                    <select  id="automate_smscharge" name="automate_smscharge" class="font-semibold text-sm focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                        <option></option>
                                        <option>YES</option>
                                        <option>NO</option>
                                    </select>
                                </div>
                                <div class="form-group-auth mt-5">
                                    <label for="dateofbirth" class="text-gray-500 font-normal capitalize text-2xs font-heebo">Set Accounting Year End<span class="text-[red]">*</span></label>
                                    <input  id="accounting_yearend" type="date" name="accounting_yearend" class="font-semibold text-sm focus:outline-none comp focus:ring-0 bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                </div>
                            </div>
                            <div class="flex flex-col lg:flex-row items-start gap-3 mt-3">
                                <div class="form-group-auth mt-5">
                                    <label for="role" class="text-gray-500 font-normal capitalize text-2xs font-heebo">consumption charge<span class="text-[red]">*</span></label>
                                    <select name="consumptioncharge" id="consumptioncharge" class="font-semibold text-sm focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                        <option value="0">0%</option>
                                        <option value="5">5%</option>
                                        <option value="7.5">7.5%</option>
                                        <option value="10">10%</option>
                                        <option value="12.5">12.5%</option>
                                        <option value="15">15%</option>
                                    </select>
                                </div>
                                <div class="form-group-auth mt-5">
                                    <label for="role" class="text-gray-500 font-normal capitalize text-2xs font-heebo">service charge<span class="text-[red]">*</span></label>
                                    <select name="servicecharge" id="servicecharge" class="font-semibold text-sm focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                        <option value="0">0%</option>
                                        <option value="5">5%</option>
                                        <option value="7.5">7.5%</option>
                                        <option value="10">10%</option>
                                        <option value="12.5">12.5%</option>
                                        <option value="15">15%</option>
                                    </select>
                                </div>
                            </div>
                        
                </div>
                        <div name="settings_defaultaccounts" class="w-[0%] h-0 invisible flex flex-col transition-all gap-4">
                    
                            <div class="flex flex-col lg:flex-row items-start gap-3 mt-3">
                                <div class="form-group-auth mt-5">
                                    <label for="companyname" class="text-gray-500 font-normal capitalize text-xs font-heebo">Default GL Income Account<span class="text-[red]">*</span></label>
                                    <select name="default_incomeaccount" id="default_incomeaccount" class="populateaccounts font-semibold text-xs focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                        <option value=""> -- SELECT ACCOUNT --</option>
                                    </select>
                                </div>
                                <div class="form-group-auth mt-5">
                                    <label for="lastname" class="text-gray-500 font-normal capitalize text-xs font-heebo">Default GL Asset Account<span class="text-[red]">*</span></label>
                                    <select name="default_assetaccount" id="default_assetaccount" class="populateaccounts font-semibold text-xs focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                        <option value=""> -- SELECT ACCOUNT --</option>
                                    </select>
                                </div>
                            </div>
                            <div class="flex flex-col lg:flex-row items-start gap-3 mt-3">
                                <div class="form-group-auth mt-5">
                                    <label for="address" class="text-gray-500 font-normal capitalize text-xs font-heebo">Default GL Cash Account<span class="text-[red]">*</span></label>
                                    <select name="default_cashaccount" id="default_cashaccount" class="populateaccounts font-semibold text-xs focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                        <option value=""> -- SELECT ACCOUNT --</option>
                                    </select>
                                </div>
                                <!--<div class="form-group-auth mt-5">-->
                                <!--    <label for="role" class="text-gray-500 font-normal capitalize text-xs font-heebo">Default return cash account<span class="text-[red]">*</span></label>-->
                                <!--    <select name="default_returncashaccount" id="default_returncashaccount" class="populateaccounts font-semibold text-xs focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">-->
                                <!--        <option value=""> -- SELECT ACCOUNT --</option>-->
                                <!--    </select>-->
                                <!--</div>-->
                                <div class="form-group-auth mt-5">
                                    <label for="dateofbirth" class="text-gray-500 font-normal capitalize text-xs font-heebo">Default GL Wages Account<span class="text-[red]">*</span></label>
                                    <select name="default_glwagesaccount" id="default_glwagesaccount" class="populateaccounts font-semibold text-xs focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                        <option value=""> -- SELECT ACCOUNT --</option>
                                    </select>
                                </div>
                            </div>
                            <div class="flex flex-col lg:flex-row items-start gap-3 mt-3">
                                <div class="form-group-auth mt-5">
                                    <label for="role" class="text-gray-500 font-normal capitalize text-xs font-heebo">Default Expense Account<span class="text-[red]">*</span></label>
                                    <select name="default_glexpenseaccount" id="default_glexpenseaccount" class="populateaccounts font-semibold text-xs focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                        <option value=""> -- SELECT ACCOUNT --</option>
                                    </select>
                                </div>
                                <div class="form-group-auth mt-5">
                                    <label for="location_name" class="text-gray-500 font-normal capitalize text-xs font-heebo">Default Loan Account<span class="text-[red]">*</span></label>
                                    <select name="default_glloanaccount" id="default_glloanaccount" class="populateaccounts font-semibold text-xs focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                        <option value=""> -- SELECT ACCOUNT --</option>
                                    </select>
                                </div>
                                <div class="form-group-auth mt-5">
                                    <label for="dateofbirth" class="text-gray-500 font-normal capitalize text-xs font-heebo">Default Non-Cash Account (Bank Account)<span class="text-[red]">*</span></label>
                                    <select name="default_noncashaccount" id="default_noncashaccount" class="populateaccounts font-semibold text-xs focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                        <option value=""> -- SELECT ACCOUNT --</option>
                                    </select>
                                </div>
                            </div>
                            <div class="flex flex-col lg:flex-row items-start gap-3 mt-3">
                                <!--<div class="form-group-auth mt-5">-->
                                <!--    <label for="location_name" class="text-gray-500 font-normal capitalize text-xs font-heebo">Default Property Account<span class="text-[red]">*</span></label>-->
                                <!--    <select name="default_propertyaccount" id="default_propertyaccount" class="populateaccounts font-semibold text-xs focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">-->
                                <!--        <option value=""> -- SELECT ACCOUNT --</option>-->
                                <!--    </select>-->
                                <!--</div>-->
                                <div class="form-group-auth mt-5">
                                    <label for="location_name" class="text-gray-500 font-normal capitalize text-xs font-heebo">Default Depreciation<span class="text-[red]">*</span></label>
                                    <select name="default_depreciation" id="default_depreciation" class="populateaccounts font-semibold text-xs focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                        <option value=""> -- SELECT ACCOUNT --</option>
                                    </select>
                                </div>
                                <div class="form-group-auth mt-5">
                                    <label for="role" class="text-gray-500 font-normal capitalize text-xs font-heebo">Default liability Account<span class="text-[red]">*</span></label>
                                    <select name="default_liabilityaccount" id="default_liabilityaccount" class="populateaccounts font-semibold text-xs focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                        <option value=""> -- SELECT ACCOUNT --</option>
                                    </select>
                                </div>
                            </div>
                            <div class="flex flex-col lg:flex-row items-start gap-3 mt-3">
                                <div class="form-group-auth mt-5">
                                    <label for="location_name" class="text-gray-500 font-normal capitalize text-xs font-heebo">Default VAT tax Account<span class="text-[red]">*</span></label>
                                    <select name="default_vattaxaccount" id="default_vattaxaccount" class="populateaccounts font-semibold text-xs focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                        <option value=""> -- SELECT ACCOUNT --</option>
                                    </select>
                                </div>
                                <div class="form-group-auth mt-5">
                                    <label for="location_name" class="text-gray-500 font-normal capitalize text-xs font-heebo">Default GL SALES Account<span class="text-[red]">*</span></label>
                                    <select name="default_glsalesaccount" id="default_glsalesaccount" class="populateaccounts font-semibold text-xs focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                        <option value=""> -- SELECT ACCOUNT --</option>
                                    </select>
                                </div>
                                <div class="form-group-auth mt-5">
                                    <label for="role" class="text-gray-500 font-normal capitalize text-xs font-heebo">Default-Receivable-Account<span class="text-[red]">*</span></label>
                                    <select name="default_receivableaccount" id="default_receivableaccount" class="populateaccounts font-semibold text-xs focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                        <option value=""> -- SELECT ACCOUNT --</option>
                                    </select>
                                </div>
                            </div>
                            <div class="flex flex-col lg:flex-row items-start gap-3 mt-3">
                                <div class="form-group-auth mt-5">
                                    <label for="role" class="text-gray-500 font-normal capitalize text-xs font-heebo">Default Bank Account<span class="text-[red]">*</span></label>
                                    <select name="default_bankaccount" id="default_bankaccount" class="populateaccounts font-semibold text-xs focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                        <option value=""> -- SELECT ACCOUNT --</option>
                                    </select>
                                </div>
                                <div class="form-group-auth mt-5">
                                    <label for="location_name" class="text-gray-500 font-normal capitalize text-xs font-heebo">Default Inventory<span class="text-[red]">*</span></label>
                                    <select name="default_inventory" id="default_inventory" class="populateaccounts font-semibold text-xs focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                        <option value=""> -- SELECT ACCOUNT --</option>
                                    </select>
                                </div>
                                <div class="form-group-auth mt-5">
                                    <label for="location_name" class="text-gray-500 font-normal capitalize text-xs font-heebo">Default Payable Account<span class="text-[red]">*</span></label>
                                    <select name="default_payableaccount" id="default_payableaccount" class="populateaccounts font-semibold text-xs focus:outline-none focus:ring-0 comp bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                        <option value=""> -- SELECT ACCOUNT --</option>
                                    </select>
                                </div>
                            </div>
                        
                </div>
                    </div>
                
                
                
                    <div class="flex justify-end items-center mt-10">
                        <button id="submit" type="button" class="btn">
                            <div class="btnloader" style="display: none;" ></div>
                            <span>Update</span>
                        </button>
                        <!--<button id="submit" type="button" class="w-full md:w-max rounded-full text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8  py-3 lg:py-2shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                        <!--    <div class="btnloader" style="display: none;" ></div>-->
                        <!--    <span>Update</span>-->
                        <!--</button>-->
                    </div>
            </form>
            
        </div>
    </section>
