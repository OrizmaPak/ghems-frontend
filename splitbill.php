<section class="animate__animated animate__fadeIn">
    <p class="page-title">
        <span>SPLIT BILL</span>
    </p>

    <div class="bg-white/90 p-5 xl:p-6 rounded-sm mb-4">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div class="form-group">
                <label class="control-label">Bill Reference</label>
                <input type="text" id="splitbill_reference" class="form-control" placeholder="Search reference">
            </div>
            <div class="form-group">
                <label class="control-label">Start Date</label>
                <input type="date" id="splitbill_startdate" class="form-control">
            </div>
            <div class="form-group">
                <label class="control-label">End Date</label>
                <input type="date" id="splitbill_enddate" class="form-control">
            </div>
            <div class="form-group flex items-end gap-2">
                <button type="button" id="splitbill_fetch" class="btn !py-2 !px-4 !text-xs">Fetch Bills</button>
                <button type="button" id="splitbill_clear" class="btn !py-2 !px-4 !text-xs !bg-gray-500">Clear</button>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div class="xl:col-span-4">
            <div class="table-content">
                <table>
                    <thead>
                        <tr>
                            <th style="width:20px">s/n</th>
                            <th>reference</th>
                            <th>date</th>
                            <th>total</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody id="splitbill_billtable">
                        <tr>
                            <td colspan="100%" class="text-center opacity-70">No bills retrieved</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="xl:col-span-8">
            <div id="splitbill_workspace_empty" class="bg-white/90 border border-dashed rounded-sm min-h-[220px] flex items-center justify-center text-sm text-gray-500">
                Select a bill to start splitting items.
            </div>

            <div id="splitbill_workspace" class="hidden bg-white/90 rounded-sm border overflow-hidden">
                <div class="p-4 border-b bg-[#3b82f6] text-white">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                        <div><span class="opacity-80">Reference</span><p id="splitbill_active_reference" class="font-semibold"></p></div>
                        <div><span class="opacity-80">Salespoint</span><p id="splitbill_active_salespoint" class="font-semibold"></p></div>
                        <div><span class="opacity-80">Order Details</span><p id="splitbill_active_owner" class="font-semibold"></p></div>
                        <div><span class="opacity-80">Total</span><p id="splitbill_active_total" class="font-semibold"></p></div>
                    </div>
                    <div class="mt-3 text-sm">
                        <span class="opacity-80">Comments</span>
                        <p id="splitbill_active_description" class="font-medium"></p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div class="p-4 border-r">
                        <div class="flex justify-between items-center mb-3">
                            <p class="font-semibold">Original Bill Remaining</p>
                            <p class="text-sm font-semibold text-blue-600" id="splitbill_original_total">0</p>
                        </div>
                        <div id="splitbill_original_items" class="space-y-3 splitbill-panel"></div>
                    </div>

                    <div class="p-4 bg-slate-50">
                        <div class="flex justify-between items-center mb-3">
                            <p class="font-semibold">New Split Bill</p>
                            <p class="text-sm font-semibold text-green-700" id="splitbill_new_total">0</p>
                        </div>
                        <div id="splitbill_new_items" class="space-y-3 splitbill-panel"></div>
                    </div>
                </div>

                <div class="p-4 border-t bg-white flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
                    <div class="text-sm text-gray-600">
                        <span class="font-semibold">New Bill Description:</span>
                        <span id="splitbill_new_description"></span>
                    </div>
                    <div class="flex gap-2 justify-end">
                        <button type="button" id="splitbill_reset" class="btn !py-2 !px-4 !text-xs !bg-gray-500">Reset Split</button>
                        <button type="button" id="splitbill_submit" class="btn !py-2 !px-4 !text-xs">Submit Split</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <style>
        .splitbill-panel .splitbill-item {
            animation: splitbillSlideIn .18s ease-out;
        }
        @keyframes splitbillSlideIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</section>
