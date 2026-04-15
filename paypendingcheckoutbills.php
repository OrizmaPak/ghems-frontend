<section class="animate__animated animate__fadeIn">
    <p class="page-title">
        <span>PAY PENDING CHECKOUT BILLS</span>
    </p>

    <hr class="my-3">

    <div id="paypendingcheckoutbillsview">
        <form id="receiveablesfilterform">
            <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                <div class="grid grid-cols-1 !mb-5 lg:grid-cols-3 gap-10">
                    <div class="form-group lg:col-span-2">
                        <label for="receiveablesroomnumber" class="control-label">Room Number</label>
                        <input type="text" name="roomnumber" id="receiveablesroomnumber" list="hems_roomnumber_id" class="form-control" placeholder="Enter room number">
                    </div>
                    <div class="flex justify-end items-end gap-3">
                        <button id="submitreceiveablesfilter" type="button" class="btn">
                            <div class="btnloader" style="display: none;"></div>
                            <span>Submit</span>
                        </button>
                        <button id="resetreceiveablesfilter" type="button" class="btn">
                            <div class="btnloader" style="display: none;"></div>
                            <span>Reset</span>
                        </button>
                    </div>
                </div>
            </div>
        </form>

        <div class="flex justify-end w-full my-4">
            <button onclick="exportToExcel('paypendingcheckoutbillsview', 'HEMS PAY PENDING CHECKOUT BILLS')" type="button" class="btn">
                <div class="btnloader" style="display: none;"></div>
                <span>Export Excel</span>
            </button>
        </div>

        <div class="table-content">
            <table id="tableer">
                <thead>
                    <tr id="receiveables-table-head">
                        <th>transaction&nbsp;date</th>
                        <th>room&nbsp;number</th>
                        <th>description</th>
                        <th>debit</th>
                        <th>credit</th>
                        <th>balance</th>
                        <th>ACTION</th>
                    </tr>
                </thead>
                <tbody id="tabledata">
                    <tr>
                        <td colspan="100%" class="text-center opacity-70">Enter a room number to load pending checkout bills</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="table-status"></div>
    </div>

    <div id="modalreceipt" onclick="event.target.id == 'modalreceipt' ? this.classList.add('hidden') : ''" class="hidden fixed w-screen h-screen top-0 z-[200] left-0 flex justify-center items-center overflow-auto">
        <div id="invoicecontainer" class="max-w-[90%] mx-auto border rounded shadow p-10 bg-white relative top-[30%]"></div>
    </div>
</section>
