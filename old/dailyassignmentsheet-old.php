<section class="animate__animated animate__fadeIn">
    <p class="page-title">
        <span>DAILY ASSIGNMENT SHEET</span>
    </p>
    <form id="dailyassignmentsheetform">
        <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
            <div class="grid grid-cols-4 !mb-5 gap-6">
                <!--<div class="form-group">-->
                <!--    <label for="logoname" class="control-label">Guest Name</label>-->
                <!--    <input type="text" name="guestname" id="guestname" class="form-control comp"-->
                <!--        placeholder="Enter Guest Name">-->
                <!--</div>-->
                <div class="form-group">
                    <label for="logoname" class="control-label">Room Number</label>
                    <input type="text" name="roomnumber" id="roomnumber" list="hems_roomnumber"
                        onchange="checkdatalist(this)" class="form-control comp" placeholder="Select Room">
                </div>
                <div class="form-group">
                    <label for="logoname" class="control-label">shift</label>
                    <select name="shift" id="shift" class="form-control comp">
                        <option value=''>-- Select Shift --</option>
                        <option>DAY SHIFT</option>
                        <option>NIGHT SHIFT</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="logoname" class="control-label">Time in</label>
                    <input type="datetime-local" name="timein" id="timein" class="form-control comp"
                        placeholder="Enter Description">
                </div>
                <div class="form-group">
                    <label for="logoname" class="control-label">Time Out</label>
                    <input type="datetime-local" name="timeout" id="timeout" class="form-control comp"
                        placeholder="Enter Address">
                </div>
                <div class="form-group">
                    <label for="logoname" class="control-label">Status Before Service</label>
                    <select name="statusbeforeservice" id="statusbeforeservice" class="form-control comp">
                        <option value=''>-- Select Type --</option>
                        <option>AVAILABLE</option>
                        <option>OCCUPIED</option>
                        <option>STAY-OVER</option>
                        <option>ON-CHANGE</option>
                        <option>OUT-OF-ORDER</option>
                        <option>DIRTY</option>
                        <option>CLEAN</option>
                        <option>DIRTY-AVAILABLE</option>
                        <option>CLEAN-AVAILABLE</option>
                    </select>
                </div>
                <!--<div class="form-group">-->
                <!--    <label for="logoname" class="control-label">arrival date</label>-->
                <!--    <input type="datetime-local" name="arrivaldate" id="arrivaldate" class="form-control comp"-->
                <!--        placeholder="Enter Description">-->
                <!--</div>-->
                <!--<div class="form-group">-->
                <!--    <label for="logoname" class="control-label">departure date</label>-->
                <!--    <input type="datetime-local" name="departuredate" id="departuredate" class="form-control"-->
                <!--        placeholder="Enter Address">-->
                <!--</div>-->
                <div class="form-group">
                    <label for="logoname" class="control-label">Status after Service</label>
                    <select name="statusafterservice" id="statusafterservice" class="form-control">
                        <option value=''>-- Select Type --</option>
                        <option>AVAILABLE</option>
                        <option>OCCUPIED</option>
                        <option>STAY-OVER</option>
                        <option>ON-CHANGE</option>
                        <option>OUT-OF-ORDER</option>
                        <option>DIRTY</option>
                        <option>CLEAN</option>
                        <option>DIRTY-AVAILABLE</option>
                        <option>CLEAN-AVAILABLE</option>
                    </select>
                </div>
                <!--<div class="form-group">-->
                <!--    <label for="logoname" class="control-label">no of persons</label>-->
                <!--    <input type="number" name="noofpersons" id="noofpersons" class="form-control comp"-->
                <!--        placeholder="Enter Description">-->
                <!--</div>-->
                <!--<div class="form-group">-->
                <!--    <label for="logoname" class="control-label">requests</label>-->
                <!--    <input type="text" name="requests" id="requests" class="form-control" placeholder="Enter Address">-->
                </div>
                <!--<div class="form-group">-->
                <!--    <label for="logoname" class="control-label">lost and found items</label>-->
                <!--    <input type="text" name="lostandfounditems" id="lostandfounditems" class="form-control"-->
                <!--        placeholder="Enter Address">-->
                <!--</div>-->
            </div>

            <hr class="my-3">
            <div>
                <div class="table-content">
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 20px">s/n</th>
                                <th>item</th>
                                <th>quantity</th>
                                <th>action</th>
                            </tr>
                        </thead>
                        <tbody id="tabledata">
                            <tr id="assignmentrow_0">
                                <td>
                                    <p class="s/n">1</p>
                                </td>
                                <td><label class="hidden">Item</label><input list="assignmentitems" name=""
                                        id="itemer_0" placeholder="Select Item" onchange="checkdatalist(this)"
                                        class="form-control itemer comp"></td>
                                <td><label class="hidden">Quantity</label><input type="number" name="" id="qtyer_0"
                                        class="form-control qtyer comp" placeholder="Enter Quantity"></td>
                                <td class="flex gap-4">
                                    <div title="Add row" onclick="addassignmentrow()"
                                        class="flex justify-center items-center material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs"
                                        style="font-size: 18px;">add</div>
                                    <!--<button title="Delete row entry's" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">remove</button>-->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="table-status"></div>
            </div>
            <div class="flex justify-end mt-5">
                <button id="submit" type="button"
                    class="btn">
                    <div class="btnloader" style="display: none;"></div>
                    <span>Submit</span>
                </button>
            </div>
        </div>
    </form>
    <datalist id="assignmentitems"></datalist>

</section>