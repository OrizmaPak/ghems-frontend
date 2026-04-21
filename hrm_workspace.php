<section class="animate__animated animate__fadeIn relative">
    <p class="page-title">
        <span id="hrm_page_title">Personnel & Payroll</span>
    </p>

    <div class="bg-white/90 rounded-sm p-5 xl:p-8 flex flex-col gap-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="border border-slate-200 rounded-md p-4 bg-slate-50/60">
                <p class="text-xs uppercase tracking-wide text-slate-500">Interface Focus</p>
                <p id="hrm_page_subtitle" class="text-sm text-slate-700 mt-1">Loading workspace...</p>
                <div class="mt-4 flex flex-wrap gap-2">
                    <button id="hrm_fetch_btn" type="button" class="btn">
                        <div class="btnloader" style="display:none;"></div>
                        <span>Fetch Placeholder Data</span>
                    </button>
                    <button id="hrm_submit_btn" type="button" class="btn">
                        <div class="btnloader" style="display:none;"></div>
                        <span>Submit Placeholder Action</span>
                    </button>
                </div>
            </div>

            <div class="border border-slate-200 rounded-md p-4 bg-slate-50/60">
                <p class="text-xs uppercase tracking-wide text-slate-500">Replicated Flow</p>
                <ul id="hrm_flow_list" class="mt-2 text-sm text-slate-700 list-disc pl-5 space-y-1">
                    <li>Loading...</li>
                </ul>
            </div>
        </div>

        <div>
            <p class="text-sm font-semibold text-slate-700 mb-2">HTG Controllers (Placeholder wired in HEMS)</p>
            <div class="table-content">
                <table>
                    <thead>
                        <tr>
                            <th style="width: 10px">#</th>
                            <th>Controller Name</th>
                            <th>Purpose</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="hrm_controller_table">
                        <tr>
                            <td colspan="100%" class="text-center opacity-70">Loading controllers...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div>
            <p class="text-sm font-semibold text-slate-700 mb-2">Interface Data Preview</p>
            <div class="table-content">
                <table>
                    <thead id="hrm_preview_head"></thead>
                    <tbody id="hrm_preview_body">
                        <tr>
                            <td colspan="100%" class="text-center opacity-70">No rows yet. Use "Fetch Placeholder Data".</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</section>
