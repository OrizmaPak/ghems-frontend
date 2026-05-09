<div class="bg-white/90 p-5 xl:p-6 rounded-sm mb-4">
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div class="form-group">
            <label class="control-label">Bill Reference</label>
            <input type="text" id="mergebill_reference" class="form-control" placeholder="Search reference">
        </div>
        <div class="form-group">
            <label class="control-label">Department / Salespoint</label>
            <select id="mergebill_salespoint" class="form-control !text-black !bg-white">
                <option value="">-- ALL --</option>
            </select>
        </div>
        <div class="form-group">
            <label class="control-label">Start Date</label>
            <input type="date" id="mergebill_startdate" class="form-control">
        </div>
        <div class="form-group">
            <label class="control-label">End Date</label>
            <input type="date" id="mergebill_enddate" class="form-control">
        </div>
        <div class="form-group flex items-end gap-2">
            <button type="button" id="mergebill_fetch" class="btn !py-2 !px-4 !text-xs">Fetch Bills</button>
            <button type="button" id="mergebill_clear" class="btn !py-2 !px-4 !text-xs !bg-gray-500">Clear</button>
        </div>
    </div>
</div>

<div class="grid grid-cols-1 xl:grid-cols-12 gap-4">
    <div class="xl:col-span-5">
        <div class="bg-white/90 rounded-sm border overflow-hidden">
            <div class="p-4 border-b bg-[#3b82f6] text-white flex justify-between items-center gap-3">
                <div>
                    <p class="font-semibold">Available Bills</p>
                    <p class="text-xs opacity-80">The first selected bill becomes the base bill.</p>
                </div>
                <button type="button" id="mergebill_reset_selection" class="btn !py-2 !px-4 !text-xs !bg-slate-600">Reset</button>
            </div>
            <div class="table-content">
                <table>
                    <thead>
                        <tr>
                            <th style="width:20px">select</th>
                            <th>reference</th>
                            <th>date</th>
                            <th>sales point</th>
                            <th>total</th>
                        </tr>
                    </thead>
                    <tbody id="mergebill_billtable">
                        <tr>
                            <td colspan="100%" class="text-center opacity-70">No bills retrieved</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="xl:col-span-7">
        <div class="bg-white/90 rounded-sm border overflow-hidden mb-4">
            <div class="p-4 border-b flex justify-between items-center gap-3">
                <div>
                    <p class="font-semibold">Selected Bills</p>
                    <p class="text-xs text-gray-500">Base bill keeps its reference and metadata.</p>
                </div>
                <p id="mergebill_selected_count" class="text-sm font-semibold text-blue-600">0 selected</p>
            </div>
            <div id="mergebill_selected_tray" class="p-4 flex flex-wrap gap-2 text-sm text-gray-500">
                Select at least two bills to build a merge preview.
            </div>
        </div>

        <div id="mergebill_workspace_empty" class="bg-white/90 border border-dashed rounded-sm min-h-[220px] flex items-center justify-center text-sm text-gray-500">
            Select bills to preview the merged result.
        </div>

        <div id="mergebill_workspace" class="hidden bg-white/90 rounded-sm border overflow-hidden">
            <div class="p-4 border-b bg-slate-900 text-white">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                    <div><span class="opacity-70">Base Reference</span><p id="mergebill_base_reference" class="font-semibold"></p></div>
                    <div><span class="opacity-70">Salespoint</span><p id="mergebill_base_salespoint" class="font-semibold"></p></div>
                    <div><span class="opacity-70">Order Details</span><p id="mergebill_base_owner" class="font-semibold"></p></div>
                    <div><span class="opacity-70">Merged Total</span><p id="mergebill_total" class="font-semibold"></p></div>
                </div>
                <div class="mt-3 text-sm">
                    <span class="opacity-70">Description</span>
                    <p id="mergebill_description" class="font-medium"></p>
                </div>
            </div>

            <div class="p-4">
                <div class="flex justify-between items-center mb-3">
                    <p class="font-semibold">Merged Items</p>
                    <p id="mergebill_item_count" class="text-xs text-gray-500"></p>
                </div>
                <div class="table-content">
                    <table>
                        <thead>
                            <tr>
                                <th>item</th>
                                <th>source</th>
                                <th>price</th>
                                <th>qty</th>
                                <th>amount</th>
                                <th>action</th>
                            </tr>
                        </thead>
                        <tbody id="mergebill_items">
                            <tr>
                                <td colspan="100%" class="text-center opacity-70">No merged items</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="p-4 border-t bg-white flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
                <p class="text-sm text-gray-600">Submitting updates the base bill and removes the other selected bills.</p>
                <div class="flex gap-2 justify-end">
                    <button type="button" id="mergebill_rebuild" class="btn !py-2 !px-4 !text-xs !bg-gray-500">Rebuild Preview</button>
                    <button type="button" id="mergebill_submit" class="btn !py-2 !px-4 !text-xs">Submit Merge</button>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .mergebill-chip {
        animation: mergebillFadeIn .16s ease-out;
    }
    @keyframes mergebillFadeIn {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
    }
</style>
