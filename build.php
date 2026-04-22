<section class="animate__animated animate__fadeIn">
    <p class="page-title">
        <span>BUILD</span>
    </p>

    <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li id="buildoptioner_build" class="me-2 cp optioner !text-blue-600 active" name="buildformpanel" onclick="runoptioner(this)">
            <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Build</p>
        </li>
        <li id="buildoptioner_view" class="me-2 cp optioner" name="viewbuildpanel" onclick="runoptioner(this)">
            <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">View Build</p>
        </li>
    </ul>

    <div id="buildformpanel">
        <form id="buildform">
            <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                <div class="grid grid-cols-1 lg:grid-cols-1 gap-10 p-3 bg-[#3b82f6] text-white rounded shadow-sm">
                    <div class="form-group">
                        <label for="salespointname" class="control-label">Department / Salespoint</label>
                        <select name="salespoint" id="salespointname" class="form-control comp !text-black !bg-white">
                            <option>Loading...</option>
                        </select>
                    </div>
                </div>

                <div id="loading">Loading...</div>

                <div class="load hidden">
                    <div class="form-group">
                        <label for="builddate" class="control-label">Build Date</label>
                        <input type="date" readonly name="builddate" id="builddate" class="form-control comp">
                    </div>
                    <p class="page-title mt-5">
                        <span>ADD ITEM</span>
                    </p>
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10 !mb-7">
                        <div class="form-group">
                            <label for="item" class="control-label">Build</label>
                            <select name="item" id="item" class="form-control comp">
                                <option value="">-- Select Composite Item --</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="quantity" class="control-label">QUANTITY</label>
                            <input type="number" name="quantity" id="quantity" class="form-control" placeholder="Enter Quantity of Item">
                        </div>
                        <div class="flex justify-end mt-5">
                            <button onclick="addbuilditem()" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                <div class="btnloader" style="display: none;"></div>
                                <span>Add</span>
                            </button>
                        </div>
                    </div>

                    <p class="page-title mb-5 mt-20">
                        <span>MANAGE ITEM</span>
                    </p>

                    <div>
                        <div class="table-content">
                            <table>
                                <thead>
                                    <tr>
                                        <th>s/n</th>
                                        <th>Item id</th>
                                        <th>item name</th>
                                        <th>quantity</th>
                                        <th>action</th>
                                    </tr>
                                </thead>
                                <tbody id="buildtabledata"></tbody>
                            </table>
                        </div>
                        <div class="flex justify-end mt-5">
                            <button id="submit" type="button" class="btn">
                                <div class="btnloader" style="display: none;"></div>
                                <span>Submit</span>
                            </button>
                        </div>
                        <div class="build-table-status"></div>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <div id="viewbuildpanel" class="hidden">
        <form id="viewbuildform">
            <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="form-group">
                        <label for="startdate" class="control-label">Start Date</label>
                        <input type="date" name="startdate" id="startdate" class="form-control" placeholder="Search by Item Name">
                    </div>
                    <div class="form-group">
                        <label for="enddate" class="control-label">End Date</label>
                        <input type="date" name="enddate" id="enddate" class="form-control" placeholder="Search by Item Name">
                    </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div></div>
                    <div></div>
                    <div class="flex justify-end mt-5">
                        <button id="viewbuildsubmit" type="button" class="btn">
                            <div class="btnloader" style="display: none;"></div>
                            <span>Submit</span>
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
                            <th>sales point</th>
                            <th>Item Name</th>
                            <th>ITEM&nbsp;NAME&nbsp;|&nbsp;[QUANTITY]</th>
                            <th>Item Price</th>
                            <th>Total Build Price</th>
                            <th>build Date</th>
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

        <div id="viewbuildmodal" onclick="if(event.target.id === 'viewbuildmodal')this.classList.add('hidden')" class="hidden w-full h-full bg-[#00000080] fixed top-0 left-0 overflow-y-auto flex justify-center items-center p-4 z-[700]">
            <div class="w-full max-w-[1100px] mt-8 h-fit min-h-[420px] bg-white p-5 rounded-xl shadow-2xl border border-slate-100">
                <div class="w-full py-2 flex justify-between items-center">
                    <p id="modaltitle" class="text-lg font-semibold text-slate-800">Build Breakdown</p>
                    <span onclick="document.getElementById('viewbuildmodal').classList.add('hidden')" class="cp material-symbols-outlined text-slate-500 hover:text-primary-g" style="font-size: 24px;">close</span>
                </div>

                <hr class="mb-5">

                <div id="modaldetails" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4"></div>

                <div class="table-content my-4">
                    <table>
                        <thead>
                            <tr>
                                <th>s/n </th>
                                <th> Item Name </th>
                                <th> Base Qty </th>
                                <th> Build Qty </th>
                                <th> Final Qty </th>
                                <th> Unit Price </th>
                                <th> Price </th>
                            </tr>
                        </thead>
                        <tbody id="tabledata2">
                            <tr>
                                <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</section>
