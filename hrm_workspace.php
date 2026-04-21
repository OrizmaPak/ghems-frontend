<section class="animate__animated animate__fadeIn relative">
    <p class="page-title">
        <span id="hrm_page_title">Personnel & Payroll</span>
    </p>

    <form id="hrm_entry_form">
        <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
            <div id="hrm_entry_grid" class="grid grid-cols-1 lg:grid-cols-3 gap-6"></div>
            <div id="hrm_dynamic_sections" class="flex flex-col gap-4"></div>
            <div id="hrm_form_actions" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div></div>
                <div></div>
                <div class="flex justify-end items-end gap-3 mt-5">
                    <button id="hrm_reset_btn" type="button" class="btn" title="Reset form">
                        <span>Reset</span>
                    </button>
                    <button id="hrm_save_btn" type="button" class="btn" title="Submit record">
                        <div class="btnloader" style="display:none;"></div>
                        <span>Submit</span>
                    </button>
                </div>
            </div>
        </div>
    </form>

    <hr id="hrm_entry_separator" class="my-10">

    <div id="hrm_filter_panel">
        <p class="page-title">
            <span>Filter</span>
        </p>

        <form id="hrm_filter_form">
            <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                <div id="hrm_filter_grid" class="grid grid-cols-1 lg:grid-cols-4 gap-6"></div>
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div class="flex justify-end items-end gap-3 mt-5">
                        <button id="hrm_filter_reset_btn" type="button" class="btn" title="Clear filters">
                            <span>Clear Filter</span>
                        </button>
                        <button id="hrm_filter_btn" type="button" class="btn" title="Apply filter">
                            <div class="btnloader" style="display:none;"></div>
                            <span>Apply Filter</span>
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <hr id="hrm_filter_separator" class="my-10">

    <div id="hrm_summary_grid" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6"></div>

    <div>
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <p id="hrm_table_title" class="text-sm font-semibold text-gray-600 uppercase">Records</p>
            <div class="flex flex-col md:flex-row md:justify-end gap-3">
                <div id="hrm_batch_actions" class="flex flex-wrap justify-end gap-2"></div>
                <div id="hrm_export_actions" class="flex flex-wrap justify-end gap-2">
                    <button type="button" class="btn hrm-export-btn" data-export="print" title="Print records">
                        <span class="material-symbols-outlined text-lg">print</span>
                        <span>Print</span>
                    </button>
                    <button type="button" class="btn hrm-export-btn" data-export="pdf" title="Export records as PDF">
                        <span class="material-symbols-outlined text-lg">picture_as_pdf</span>
                        <span>Export PDF</span>
                    </button>
                    <button type="button" class="btn hrm-export-btn" data-export="excel" title="Export records as Excel">
                        <span class="material-symbols-outlined text-lg">table_view</span>
                        <span>Export Excel</span>
                    </button>
                </div>
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
</section>
