<section class="animate__animated animate__fadeIn relative">
    <p class="page-title">
        <span>APPROVE PURCHASE ORDER</span>
    </p>

    <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
        <li class="me-2 cp viewer optioner !text-blue-600 active" name="apoviewunapproved" onclick="runoptioner(this)">
            <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">View Unapproved Order</p>
        </li>
        <li class="me-2 cp updater optioner" name="apoviewapproved" onclick="runoptioner(this)">
            <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">View Approved Order</p>
        </li>
        <li class="me-2 cp updater optioner" name="apoviewdeclined" onclick="runoptioner(this)">
            <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">View Declined Order</p>
        </li>
    </ul>

    <div id="apoviewunapproved" class="mt-6">
        <div class="table-content">
            <table>
                <thead>
                    <tr>
                        <th style="width:10px">s/n</th>
                        <th><input type="checkbox" id="apo_check_all" /></th>
                        <th>transaction date</th>
                        <th>reference</th>
                        <th>supplier</th>
                        <th>items no.</th>
                        <th>grand total</th>
                        <th>location</th>
                        <th>action</th>
                    </tr>
                </thead>
                <tbody id="apo_unapproved_tabledata">
                    <tr>
                        <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                    </tr>
                </tbody>
            </table>
            <div class="flex justify-end mt-5 mb-2 gap-3">
                <button type="button" id="apo_check_selected" class="w-full md:w-max rounded-md text-black text-sm capitalize border px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out">Check All</button>
                <button type="button" id="apo_uncheck_selected" class="w-full md:w-max rounded-md text-black text-sm capitalize border px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out">Uncheck All</button>
                <button type="button" id="apo_bulk_approve" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out">Approve Selected</button>
                <button type="button" id="apo_bulk_decline" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-red-400 via-red-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out">Decline Selected</button>
            </div>
        </div>
        <div class="table-status"></div>
    </div>

    <div id="apoviewapproved" class="mt-6 hidden">
        <div class="table-content">
            <table>
                <thead>
                    <tr>
                        <th style="width:10px">s/n</th>
                        <th>transaction date</th>
                        <th>reference</th>
                        <th>supplier</th>
                        <th>items no.</th>
                        <th>grand total</th>
                        <th>location</th>
                        <th>status</th>
                        <th>action</th>
                    </tr>
                </thead>
                <tbody id="apo_approved_tabledata">
                    <tr>
                        <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="table-status"></div>
    </div>

    <div id="apoviewdeclined" class="mt-6 hidden">
        <div class="table-content">
            <table>
                <thead>
                    <tr>
                        <th style="width:10px">s/n</th>
                        <th>transaction date</th>
                        <th>reference</th>
                        <th>supplier</th>
                        <th>items no.</th>
                        <th>grand total</th>
                        <th>location</th>
                        <th>status</th>
                        <th>action</th>
                    </tr>
                </thead>
                <tbody id="apo_declined_tabledata">
                    <tr>
                        <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="table-status"></div>
    </div>

    <div id="approvepurchaseordermodal" onclick="if(event.target.id === 'approvepurchaseordermodal')this.classList.add('hidden')" class="hidden w-full h-full bg-[#0000004a] fixed top-0 left-0 overflow-y-auto flex justify-center items-start z-20">
        <div class="w-fit max-w-[95%] mt-8 min-w-[500px] h-fit min-h-[400px] bg-white p-3 rounded-md shadow-lg">
            <div class="w-full py-2 flex justify-between">
                <p class="text-md font-bold">PURCHASE ORDER DETAILS</p>
                <span onclick="did('approvepurchaseordermodal').classList.add('hidden')" class="cp material-symbols-outlined" style="font-size: 20px;">close</span>
            </div>
            <hr class="mb-4"/>

            <p class="!text-sm font-thin">Reference: <span id="apo_modal_reference" class="uppercase !text-sm font-semibold"></span></p>
            <p class="!text-sm font-thin">Supplier: <span id="apo_modal_supplier" class="uppercase !text-sm font-semibold"></span></p>
            <p class="!text-sm font-thin">Location: <span id="apo_modal_location" class="uppercase !text-sm font-semibold"></span></p>
            <p class="!text-sm font-thin">Status: <span id="apo_modal_status" class="uppercase !text-sm font-semibold"></span></p>

            <div class="table-content my-4">
                <table>
                    <thead>
                        <tr>
                            <th>s/n</th>
                            <th>item</th>
                            <th>qty</th>
                            <th>cost</th>
                            <th>value</th>
                        </tr>
                    </thead>
                    <tbody id="apo_modal_items"></tbody>
                </table>
            </div>

            <div class="flex justify-end gap-2 mt-4">
                <button type="button" onclick="approvePurchaseOrderModalAction('DECLINED')" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-red-400 via-red-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out">Decline</button>
                <button type="button" onclick="approvePurchaseOrderModalAction('APPROVED')" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out">Approve</button>
            </div>
        </div>
    </div>
</section>
