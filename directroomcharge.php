<section class="animate__animated animate__fadeIn">
    <p class="page-title">
        <span>DIRECT ROOM CHARGE</span>
    </p>

    <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li class="me-2 cp updater optioner !text-blue-600 active" name="directroomchargeform" onclick="runoptioner(this)">
            <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Manage Direct Room Charge</p>
        </li>
        <li class="me-2 cp viewer optioner" name="directroomchargeview" onclick="runoptioner(this)">
            <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">View Direct Room Charge</p>
        </li>
    </ul>

    <hr class="my-3">

    <div id="directroomchargeform" class="">
        <form id="directroomchargeentryform">
            <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div class="form-group">
                        <label class="control-label">Transaction Date</label>
                        <input type="date" id="drc_transactiondate" class="form-control comp">
                    </div>
                    <div class="form-group">
                        <label class="control-label">Room Number</label>
                        <input type="text" id="drc_roomnumber" class="form-control comp" placeholder="Enter room number">
                    </div>
                    <div class="form-group">
                        <label class="control-label">Guest Name</label>
                        <input type="text" id="drc_guestname" class="form-control" placeholder="Enter guest name">
                    </div>
                    <div class="form-group">
                        <label class="control-label">Base Amount</label>
                        <input type="number" min="0" step="0.01" id="drc_baseamount" class="form-control comp" placeholder="0.00">
                    </div>
                    <div class="form-group">
                        <label class="control-label">VAT (%)</label>
                        <input type="number" min="0" step="0.01" id="drc_vatperc" class="form-control" value="0">
                    </div>
                    <div class="form-group">
                        <label class="control-label">Consumption Tax (%)</label>
                        <input type="number" min="0" step="0.01" id="drc_consumptionperc" class="form-control" value="0">
                    </div>
                    <div class="form-group">
                        <label class="control-label">Service Charge (%)</label>
                        <input type="number" min="0" step="0.01" id="drc_serviceperc" class="form-control" value="0">
                    </div>
                    <div class="form-group lg:col-span-2">
                        <label class="control-label">Description</label>
                        <input type="text" id="drc_description" class="form-control comp" placeholder="Charge description">
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-slate-50 p-4 rounded-md">
                    <div><p class="text-xs text-slate-500">VAT Amount</p><p id="drc_vatamount" class="font-semibold">0.00</p></div>
                    <div><p class="text-xs text-slate-500">Consumption Amount</p><p id="drc_consumptionamount" class="font-semibold">0.00</p></div>
                    <div><p class="text-xs text-slate-500">Service Amount</p><p id="drc_serviceamount" class="font-semibold">0.00</p></div>
                    <div><p class="text-xs text-slate-500">Total Charge</p><p id="drc_totalamount" class="font-semibold">0.00</p></div>
                </div>

                <div class="flex justify-end gap-3">
                    <button id="drc_submit" type="button" class="btn">
                        <span>Submit</span>
                    </button>
                    <button id="drc_reset" type="button" class="btn">
                        <span>Reset</span>
                    </button>
                </div>
            </div>
        </form>
    </div>

    <div id="directroomchargeview" class="hidden">
        <div class="table-content lg:max-w-full">
            <table id="drctable">
                <thead>
                <tr>
                    <th>s/n</th>
                    <th>date</th>
                    <th>room number</th>
                    <th>guest</th>
                    <th>description</th>
                    <th>base amount</th>
                    <th>vat</th>
                    <th>consumption</th>
                    <th>service</th>
                    <th>total</th>
                </tr>
                </thead>
                <tbody id="drctabledata">
                    <tr><td colspan="100%" class="text-center opacity-70">Table is empty</td></tr>
                </tbody>
            </table>
        </div>
    </div>
</section>
