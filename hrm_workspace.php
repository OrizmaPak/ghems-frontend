<section class="animate__animated animate__fadeIn relative">
    <p class="page-title">
        <span id="hrm_page_title">Personnel & Payroll</span>
    </p>

    <div class="bg-white/90 rounded-sm p-5 xl:p-8 flex flex-col gap-8">
        <form id="hrm_entry_form" class="flex flex-col gap-5">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <p id="hrm_page_subtitle" class="text-sm text-slate-600">Prepare the record below.</p>
                    <p id="hrm_page_context" class="text-xs text-slate-400 mt-1"></p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button id="hrm_reset_btn" type="button" class="btn-reset btn">
                        <span class="material-symbols-outlined text-lg">restart_alt</span>
                        <span class="text-lg">Reset</span>
                    </button>
                    <button id="hrm_save_btn" type="button" class="btn">
                        <div class="btnloader" style="display:none;"></div>
                        <span>Submit</span>
                    </button>
                </div>
            </div>

            <div id="hrm_entry_grid" class="grid grid-cols-1 lg:grid-cols-3 gap-6"></div>
            <div id="hrm_dynamic_sections" class="flex flex-col gap-4"></div>
        </form>

        <div id="hrm_filter_panel" class="flex flex-col gap-4 border-t border-slate-200 pt-6">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <p class="text-sm font-semibold text-slate-700">Filters</p>
                <div class="flex flex-wrap gap-2">
                    <button id="hrm_filter_btn" type="button" class="btn">
                        <span>Apply Filter</span>
                    </button>
                    <button id="hrm_filter_reset_btn" type="button" class="btn-reset btn">
                        <span class="material-symbols-outlined text-lg">filter_alt_off</span>
                        <span class="text-lg">Clear</span>
                    </button>
                </div>
            </div>
            <div id="hrm_filter_grid" class="grid grid-cols-1 lg:grid-cols-4 gap-6"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4" id="hrm_summary_grid"></div>

        <div class="flex flex-col gap-4">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <p id="hrm_table_title" class="text-sm font-semibold text-slate-700">Records</p>
                <div class="flex flex-wrap gap-2">
                    <button type="button" class="btn hrm-export-btn" data-export="print">
                        <span class="material-symbols-outlined text-lg">print</span>
                        <span>Print</span>
                    </button>
                    <button type="button" class="btn hrm-export-btn" data-export="pdf">
                        <span class="material-symbols-outlined text-lg">picture_as_pdf</span>
                        <span>PDF</span>
                    </button>
                    <button type="button" class="btn hrm-export-btn" data-export="excel">
                        <span class="material-symbols-outlined text-lg">table_view</span>
                        <span>Excel</span>
                    </button>
                </div>
            </div>

            <div class="table-content">
                <table id="hrm_records_table">
                    <thead id="hrm_table_head"></thead>
                    <tbody id="hrm_table_body"></tbody>
                </table>
            </div>
            <div class="table-status" id="hrm_table_status">Showing 0 to 0 of 0 records</div>
        </div>
    </div>
</section>
