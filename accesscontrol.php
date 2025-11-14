<?php
session_start();
if(!isset($_SESSION["user_id"]) || !isset($_SESSION["user_id"]))
{
	header('Location: login.php');
}
if($_SESSION["role"] !== "SUPERADMIN"){ 
    header('Location: index.php');
}

?>


       <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>Access Control</span>
                            </p>
                            <form id="accesscontrolsform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Personel</label>
                                            <input type="text" name="email" id="email" list="userslist" class="form-control" onchange="checkdatalist(this);accessboard(this)">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Role</label>
                                            <select name="role" id="role" class="form-control">
                                                <option value=''>-- Select Role --</option>
                                                <option value="ADMIN">ADMIN</option>
                                                <option value="STAFF">STAFF</option>
                                                <option value="SUPERADMIN">SUPER ADMIN</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Department</label>
                                            <input type="text" name="department" id="department" class="form-control" list="departmentlist" onchange="checkdatalist(this)">
                                        </div>
                                        
                                        <div class="flex justify-end mt-5">
                                             <button id="submit" type="button" class="btn">
                                            <div class="btnloader" style="display: none;"></div>
                                            <span>Submit</span>
                                        </button>
                                        <!--     <button id="submit" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                        <!--    <div class="btnloader" style="display: none;"></div>-->
                                        <!--    <span>Submit</span>-->
                                        <!--</button>-->
                                    </div> 
                                    </div>
                                    </div>
                        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            <div></div>
                            <div></div>
                            <div></div>
                                    <div class="flex justify-end mt-5">
                                         <button id="accesssave" type="button" class="btn">
                                        <div class="btnloader" style="display: none;"></div>
                                        <span>Save</span>
                                    </button>
                                    <!--     <button id="accesssave" type="button" class="w-full hidden md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                                    <!--    <div class="btnloader" style="display: none;"></div>-->
                                    <!--    <span>Save</span>-->
                                    <!--</button>-->
                                </div>
                                </div>
                            </form>
                            <hr class="mt-6 mb-2">
                            
                             <div class="">
                                <div class="table-content bg-white p-4 flex flex-wrap justify-center" id="accessctrl_container">
                                    
                                    <!--<div id="accessctrl_inventory" class="flex flex-col gap-3">-->
                                    <!--    <p class="font-bold mb-4 text-lg">INVENTORY</p>-->
                                        <!--<label class="pl-5 relative inline-flex items-center cursor-pointer">-->
                                        <!--  <input type="checkbox" value="" class="sr-only peer">-->
                                        <!--  <div class="scale-[0.9] w-11 h-6 bg-gray-400 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>-->
                                        <!--  <span class="ms-2 text-sm font-medium text-blue-900">DELETE OPTION</span>-->
                                        <!--</label>-->
                                    <!--    <label class="pl-5 relative inline-flex items-center cursor-pointer">-->
                                    <!--      <input type="checkbox" value="" class="sr-only peer">-->
                                    <!--      <div class="scale-[0.9] w-11 h-6 bg-gray-400 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>-->
                                    <!--      <span class="ms-2 text-sm font-medium text-blue-900">APPROVE INVENTORY</span>-->
                                    <!--    </label>-->
                                    <!--</div>-->
                                    
                                    <!--<div id="accessctrl_requisition"></div>-->
                                    
                                </div>
                            </div>
                            
                            <datalist id='departmentlist'></datalist>
                            <datalist id='userslist'></datalist>
                        
                        </section>  