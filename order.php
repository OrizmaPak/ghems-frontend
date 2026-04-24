<section class="animate__animated animate__fadeIn">
    <p class="page-title">
        <span>ORDER</span>
    </p>

    <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
        <li id="order_viewer_tab" class="me-2 cp viewer optioner !text-blue-600 active" name="orderview" onclick="runoptioner(this)">
            <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">View Orders</p>
        </li>
        <li id="order_updater_tab" class="me-2 cp updater optioner" name="orderformdiv" onclick="runoptioner(this)">
            <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Post Order</p>
        </li>
    </ul>

    <div id="orderformdiv" class="hidden">
        <form id="orderform">
            <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="form-group">
                        <label for="roomnumber" class="control-label">Room Number</label>
                        <input type="text" name="roomnumber" id="roomnumber" class="form-control" placeholder="Optional: enter room number">
                    </div>
                    <div class="form-group">
                        <label for="applyto" class="control-label">Apply To</label>
                        <input type="text" name="applyto" id="applyto" class="form-control" placeholder="Optional: guest name or phone number">
                    </div>
                </div>
                <div class="form-group">
                    <label for="description" class="control-label">Description</label>
                    <textarea name="description" id="description" class="form-control comp" placeholder="Enter order details"></textarea>
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                <div></div>
                <div></div>
                <div class="flex justify-end mt-5">
                    <button id="submit" type="button" class="btn">
                        <div class="btnloader" style="display: none;"></div>
                        <span>Submit</span>
                    </button>
                </div>
            </div>
        </form>
    </div>

    <div id="orderview" class="">
        <form id="orderviewform">
            <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="form-group">
                        <label for="orderreference" class="control-label">Reference / ID</label>
                        <input type="text" name="orderreference" id="orderreference" class="form-control" placeholder="Enter reference/id to fetch one order">
                    </div>
                    <div class="form-group">
                        <label for="startdate" class="control-label">Start Date</label>
                        <input type="date" name="startdate" id="startdate" class="form-control">
                    </div>
                    <div class="form-group">
                        <label for="enddate" class="control-label">End Date</label>
                        <input type="date" name="enddate" id="enddate" class="form-control">
                    </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div></div>
                    <div></div>
                    <div class="flex justify-end mt-5">
                        <button id="submitvieworder" type="button" class="btn">
                            <div class="btnloader" style="display: none;"></div>
                            <span>Retrieve</span>
                        </button>
                    </div>
                </div>
            </div>
        </form>

        <hr class="my-10">

        <div>
            <div class="table-content">
                <table>
                    <thead>
                        <tr>
                            <th>s/n</th>
                            <th>t.date</th>
                            <th>ref</th>
                            <th>room</th>
                            <th>apply to</th>
                            <th>description</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody id="tabledata">
                        <tr>
                            <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table-status"></div>
        </div>
    </div>
</section>
