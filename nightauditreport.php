<section class="animate__animated animate__fadeIn">
    <p class="page-title">
        <span>NIGHT AUDIT REPORT</span>
    </p>
    <p class="text-sm text-slate-600 mt-1 mb-3">
        View daily audit revenue breakdown across room, sales sectors, miscellaneous charges, and taxes.
    </p>

    <form id="nightauditreportfilterform">
        <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
                <div class="form-group">
                    <label for="nightauditcurrentdate" class="control-label">Date</label>
                    <input type="date" name="currentdate" id="nightauditcurrentdate" class="form-control" placeholder="YYYY-MM-DD">
                </div>
                <div></div>
                <div class="flex justify-end gap-3">
                    <button id="submitnightauditreportfilter" type="button" class="btn">
                        <div class="btnloader" style="display: none;"></div>
                        <span>Submit</span>
                    </button>
                    <button id="resetnightauditreportfilter" type="button" class="btn">
                        <span>Reset</span>
                    </button>
                </div>
            </div>
        </div>
    </form>

    <div class="my-4 flex justify-end items-start gap-3">
        <ul class="mr-auto flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
            <li class="me-2 cp">
                <button id="nightauditviewwidget" type="button" class="inline-block p-3 rounded-t-lg border-b-2 border-blue-500 text-blue-600 font-semibold">Widget View</button>
            </li>
            <li class="me-2 cp">
                <button id="nightauditviewtable" type="button" class="inline-block p-3 rounded-t-lg border-b-2 border-transparent text-gray-500 font-semibold">Table View</button>
            </li>
        </ul>
        <button onclick="printContent('HEMS NIGHT AUDIT REPORT', null, 'nightauditreportcontainer', true)" type="button" class="btn">
            <span>Print</span>
        </button>
    </div>

    <div id="nightauditreportcontainer" class="bg-white rounded-sm p-5 xl:p-8">
        <div id="nightauditreportcontent" class="text-center opacity-70 py-8">No records retrieved</div>
    </div>
</section>
