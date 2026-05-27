<section class="animate__animated animate__fadeIn">
    <p class="page-title">
        <span>Direct Debit</span>
    </p>

    <form id="directdebitform">
        <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="form-group">
                    <label class="control-label">Salespoint</label>
                    <select id="salespoint" name="salespoint" class="form-control comp">
                        <option value="Booking/Reservation" selected>Booking/Reservation</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="control-label">Room Number</label>
                    <input type="text" id="roomnumber" name="roomnumber" list="hems_roomnumber_id" class="form-control comp" placeholder="Enter room number">
                </div>
                <div class="form-group">
                    <label class="control-label">Tariff/Debit Amount</label>
                    <input type="number" min="0" step="0.01" id="debitamount" name="debitamount" class="form-control comp" placeholder="0.00">
                </div>
                <div class="form-group">
                    <label class="control-label">Narration</label>
                    <input type="text" id="narration" name="narration" class="form-control comp" placeholder="Enter narration">
                </div>
            </div>

            <div class="flex justify-end mt-5">
                <button id="submit" type="button" class="btn">
                    <div class="btnloader" style="display: none;"></div>
                    <span>Submit</span>
                </button>
            </div>
        </div>
    </form>
</section>
