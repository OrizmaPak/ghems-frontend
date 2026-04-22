<section class="animate__animated animate__fadeIn">
    <p class="page-title">
        <span>RECIPE</span>
    </p>

    <div class="bg-white/90 rounded-sm p-2 mb-5">
        <div class="flex flex-wrap gap-2" id="recipe-workspace-tabs">
            <button type="button" id="recipe-workspace-tab-recipe" data-tab="recipe" class="btn bg-primary-g text-white">Recipe</button>
            <button type="button" id="recipe-workspace-tab-view" data-tab="view" class="btn">View Recipe</button>
        </div>
    </div>

    <div id="recipe-workspace-panel-recipe">
        <form id="recipeform">
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
                    <div class="grid grid-cols-1 gap-6 mb-3">
                        <div class="form-group">
                            <label for="itembuild" class="control-label">ITEM TO BUILD</label>
                            <select name="itembuild" id="itembuild" class="form-control comp">
                                <option value="">-- Select Item To Build --</option>
                            </select>
                        </div>
                    </div>

                    <p class="page-title mb-5 mt-5">
                        <span>ADD ITEM</span>
                    </p>

                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10 !mb-7">
                        <div class="form-group">
                            <label for="item" class="control-label">ITEM</label>
                            <select name="item" id="item" class="form-control comp">
                                <option value="">-- Select Item --</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="quantity" class="control-label">QUANTITY</label>
                            <input type="number" name="quantity" id="quantity" class="form-control" placeholder="Enter Quantity of Item">
                        </div>
                        <div class="flex justify-end mt-5">
                            <button onclick="addrecipeitem()" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
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
                                <tbody id="recipetabledata"></tbody>
                            </table>
                        </div>
                        <div class="flex justify-end mt-5">
                            <button id="submit" onclick="addbuilditem()" type="button" class="btn">
                                <div class="btnloader" style="display: none;"></div>
                                <span>Submit</span>
                            </button>
                        </div>
                        <div class="recipe-table-status"></div>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <div id="recipe-workspace-panel-view" class="hidden">
        <form id="viewrecipeform" class="hidden">
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
                        <button id="submit" type="button" class="btn">
                            <div class="btnloader" style="display: none;"></div>
                            <span>Submit</span>
                        </button>
                    </div>
                </div>
            </div>
        </form>

        <hr class="my-10">

        <div class="bg-white/90 p-4 rounded-sm mb-4">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div class="form-group">
                    <label for="viewrecipesearch" class="control-label">Filter recipes</label>
                    <input type="text" id="viewrecipesearch" class="form-control" placeholder="Search by item, group, description or ingredient">
                </div>
                <div class="form-group">
                    <label for="viewrecipesalespointfilter" class="control-label">Sales point</label>
                    <select id="viewrecipesalespointfilter" class="form-control">
                        <option value="">All sales points</option>
                    </select>
                </div>
                <div class="flex items-end">
                    <button id="clearviewrecipefilters" type="button" class="btn">Clear Filters</button>
                </div>
            </div>
        </div>

        <div>
            <div class="table-content">
                <table>
                    <thead>
                        <tr>
                            <th>s/n</th>
                            <th>sales point</th>
                            <th>Item Name</th>
                            <th>cost</th>
                            <th>price</th>
                            <th>ITEM NAME | [QUANTITY]</th>
                            <th>units</th>
                            <th>Group name</th>
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

        <div id="viewrecipemodal" onclick="if(event.target.id === 'viewrecipemodal')this.classList.add('hidden')" class="hidden w-full h-full bg-[#0000004a] fixed top-0 left-0 overflow-y-auto flex justify-center items-start">
            <div class="w-fit max-w-[90%] mt-8 min-w-[500px] h-fit min-h-[400px] bg-white p-2 rounded-md shadow-lg">
                <div class="w-full py-2 flex justify-between">
                    <p id="modaltitle" class="text-md font-bold">ITEMS BUILD</p>
                    <span onclick="document.getElementById('viewrecipemodal').classList.add('hidden')" class="cp material-symbols-outlined group-hover:text-primary-g" style="font-size: 20px;">close</span>
                </div>

                <hr class="mb-4">

                <div id="modaldetails" class="flex gap-7 items-end max-w-[500px]"></div>

                <div class="table-content my-4">
                    <table>
                        <thead>
                            <tr>
                                <th>s/n </th>
                                <th> Item ID </th>
                                <th> Item Name </th>
                                <th> Quantity </th>
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
