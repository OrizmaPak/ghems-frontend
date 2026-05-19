<section class="animate__animated animate__fadeIn">
    <p class="page-title">
        <span>BANK LIST</span>
    </p>
    <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 mb-4">
        <li class="me-2 cp updater optioner !text-blue-600 active" name="managebankpanel" onclick="runoptioner(this)">
            <p class="inline-block p-4 rounded-t-lg">Manage Bank</p>
        </li>
        <li class="me-2 cp viewer optioner" name="viewbankpanel" onclick="runoptioner(this)">
            <p class="inline-block p-4 rounded-t-lg">View Bank</p>
        </li>
    </ul>

    <div id="managebankpanel">
        <form id="banklistform">
            <div class="flex flex-col space-y-4 bg-white/90 p-5 xl:p-8 rounded-sm">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="form-group">
                        <label for="bankname" class="control-label">Bank Name</label>
                        <input type="text" name="bankname" id="bankname" class="form-control comp" placeholder="Enter bank name">
                    </div>
                    <div class="form-group">
                        <label for="accountnumber" class="control-label">Account Number</label>
                        <input type="text" name="accountnumber" id="accountnumber" class="form-control comp" placeholder="Enter account number">
                    </div>
                    <div class="form-group">
                        <label for="address" class="control-label">Address</label>
                        <input type="text" name="address" id="address" class="form-control comp" placeholder="Enter address">
                    </div>
                </div>
                <div class="flex justify-end">
                    <button id="submit" type="button" class="btn">
                        <div class="btnloader" style="display: none;"></div>
                        <span>Submit</span>
                    </button>
                </div>
            </div>
        </form>
    </div>

    <div id="viewbankpanel" class="hidden">
        <div class="table-content">
            <table>
                <thead>
                    <tr>
                        <th style="width: 20px">S/N</th>
                        <th>Bank Name</th>
                        <th>Account Number</th>
                        <th>Address</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="tabledata">
                    <tr>
                        <td colspan="100%" class="text-center opacity-70">Table is empty</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="table-status"></div>
    </div>
</section>
