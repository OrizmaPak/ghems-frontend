    <?php
session_start();
if(!isset($_SESSION["user_id"]) || !isset($_SESSION["user_id"]))
{
// 	header('Location: login.php');
}
if($_SESSION["role"] !== "SUPERADMIN"){
    // header('Location: index.php');
}

?>



       <section class="animate__animated animate__fadeIn relative">
                            <p class="page-title flex justify-between">
                                <span>CREATE INVENTORY</span>
                            </p>
                            <div class="w-full flex justify-end items-start">
                                <div onclick="addform()" title="Add Item" class="bg-[#f5f5f6] z-[100] flex justify-end items-center p-3 gap-2 cp hover:scale-[1.1] transition-all">
                                    <button title="Add Item" class="relative material-symbols-outlined rounded-full bg-[green] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">add</button>
                                    <p class="font-bold">Add</p>
                                </div>
                                <div title="Import from excel" class="bg-[#f5f5f6] z-[100] flex flex-col justify-end items-end p-3 gap-2 cp  transition-all">
                                    <div class="flex gap-2 items-center">
                                        <button id="downloadInventoryTemplate" class="relative bg-[#3b82f6] p-2 rounded-md text-white drop-shadow-md text-xs hover:scale-[1.05]" style="font-size: 13px;">Template</button>
                                        <button id="importExcelBtn" class="relative bg-primary-g p-2 rounded-md text-white drop-shadow-md text-xs hover:scale-[1.1]" style="font-size: 13px;">Import Excel</button>
                                        <input type="file" id="importExcelInput" accept=".xlsx,.xls,.csv" class="hidden" />
                                    </div>
                                    <p class="text-xs text-[orange]">NB: Excel 97-2003+. Columns must match template.</p>
                                </div>
                            </div>
                            <!--start container-->
                            
                            <div id="createinventoryform" class=""> 
                                
                                <div id="createinventorycontainer">
                                    <div class="flex flex-col mb-10">
                                <p name="itemno" class="page-title !mb-4">
                                    <span>Item 1</span>
                                </p>
                                    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm"> 
                                        <div  class="relative top-[-15px] w-full justify-end h-fit flex gap-5">
                                            <button title="Collapse" onclick="this.parentElement.parentElement.nextElementSibling.classList.contains('hidden') ? this.parentElement.parentElement.nextElementSibling.classList.remove('hidden') : this.parentElement.parentElement.nextElementSibling.classList.add('hidden')"  class="!z-[1] material-symbols-outlined rounded-full bg-[#969696] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">menu</button>
                                            <button title="Add Item" onclick="addform()" class="relative material-symbols-outlined rounded-full bg-[green] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">add</button>
                                            <!--<button title="Delete" onclick="this.parentElement.parentElement.parentElement.remove()" class=" material-symbols-outlined rounded-full bg-[red] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">remove</button>-->
                                        </div>
                                         
                                            <div class="grid grid-cols-1 gap-6">
                                                <div class="form-group relative">
                                                    <label for="logoname" class="control-label flex justify-between">Item Name</label>
                                                    <input type="text" name="itemname" class="form-control comp" placeholder="Enter Name of Item">
                                                </div>
                                                <label class="text-xl font-medium opacity-[0.7]">Department / Sales Point</label>
                                                <div id="departmt" class="min-h-[100px] h-fit flex flex-wrap items-center rounded bg-[#5757570f] p-4">
                                                    <div id="loading">Loading...</div> 
                                                </div>
                                            </div> 
                                        </div>
                                        <div class="collapsible-body" style="border: none;">
                                            <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 !pt-0 rounded-sm">
                                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Units</label>
                                                        <select name="units" id="units" class="form-control comp">
                                                            <option value=''>-- Select Unit --</option>
                                                            <option>PCS</option>
                                                            <option>PLASTIC</option>
                                                            <option>EACH</option>
                                                            <option>PACKET</option>
                                                            <option>ROLL</option>
                                                            <option>CUP</option>
                                                            <option>PAIR</option>
                                                            <option>YARDS</option>
                                                            <option>KG</option>
                                                            <option>SETS</option>
                                                            <option>METRES</option>
                                                            <option>LITRES</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Cost</label>
                                                        <input type="number" value="" name="cost" class="form-control" placeholder="Enter Cost of Item">
                                                    </div>
                                                </div>
                                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Price</label>
                                                        <input type="number" value="" name="price" class="form-control" placeholder="Set Price"/>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Price Two</label>
                                                        <input type="number" value="" name="price_two" class="form-control" placeholder="Set Price"/>
                                                    </div>
                                                </div>  
                                                </div>  
                                            </div>
                                            <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 !pt-0 rounded-sm"> 
                                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Begin Balance</label>
                                                        <input type="number" name="beginbalance" class="form-control" placeholder="Enter Begin Balance">
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Minimum Balance</label>
                                                        <input type="number" name="minbalance" class="form-control" placeholder="Enter Minimum Balance">
                                                    </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Group Name</label>
                                                        <input type="text" name="groupname" class="form-control" placeholder="Enter Group Name">
                                                    </div>
                                                </div> 
                                            </div>
                                            <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 !pt-0 rounded-sm">
                                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">apply to</label>
                                                        <select name="applyto" id="applyto" class="form-control comp">
                                                            <option value=''>-- Select Apply To --</option>
                                                            <option>FOR SALE</option>
                                                            <option>NOT FOR SALE</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">item class</label>
                                                        <select name="itemclass" id="itemclass" class="form-control comp">
                                                            <option value=''>-- Select Item Class --</option>
                                                            <option>STOCK-ITEM</option>
                                                            <option>NON STOCK-ITEM</option>
                                                        </select>
                                                    </div>
                                                    </div>
                                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Reorder Level</label>
                                                        <input type="text" name="rlevel" class="form-control" placeholder="Enter reorder level">
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Composite</label>
                                                        <select name="composite" id="composite" class="form-control">
                                                            <option value=''>-- Select Composite --</option>
                                                            <option>YES</option>
                                                            <option>NO</option>
                                                        </select>
                                                    </div>
                                                    </div>
                                                </div> 
                                            </div>
                                            <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 !pt-0 rounded-sm">
                                                <div class="grid grid-cols-1 gap-6">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Description</label>
                                                        <input type="text" name="description" class="form-control" placeholder="Enter Item Description">
                                                    </div>
                                                </div> 
                                            </div>
                                            </div>
                                        </div>
                                </div>
                            </div>
                                
                                <div class="flex justify-end mt-5"> 
                                    <button id="submit" type="button" class="btn">
                                        <div class="btnloader" style="display: none;"></div>
                                        <span>Submit</span>
                                    </button>
                                    <!--<button id="submit" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                    <!--    <div class="btnloader" style="display: none;"></div>-->
                                    <!--    <span>Submit</span>-->
                                    <!--</button>-->
                                </div>
                            </div>
                            
                            
                            <datalist id='departmentlist'></datalist>
                            <datalist id='userslist'></datalist>
                        
                        </section> 
