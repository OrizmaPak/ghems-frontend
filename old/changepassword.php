<section class="animate__animated animate__fadeIn">
    <p class="page-title">
        <span>CHANGE PASSWORD</span>
    </p>
    
    <form id="changepasswordform" class="">
             
            <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                <div class="grid grid-cols-3 !mb-5 gap-10">
                    <div class="form-group">
                        <label for="logoname" class="control-label">current password</label>
                        <input type="text" name="currentpassword" id="currentpassword" class="form-control comp" placeholder="Enter Current Password">
                    </div>
                    <div class="form-group">
                        <label for="logoname" class="control-label">new password</label>
                        <input type="text"  name="newpassword" id="newpassword" class="form-control comp" placeholder="Enter New Password">
                    </div>
                    <div class="form-group">
                        <label for="logoname" class="control-label">Confirm Password</label>
                        <input type="text" name="" id="confirmpassword" class="form-control comp" placeholder="Confirm New Password">
                    </div>
                </div>
                <div class="flex justify-end mt-5 gap-4">
                     <button id="submit" type="button" <button id="submit" type="button" class="btn">
                        <div class="btnloader" style="display: none;"></div>
                        <span>Submit</span> 
                    </button>
                    <!-- <button id="submit" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                    <!--    <div class="btnloader" style="display: none;"></div>-->
                    <!--    <span>Submit</span> -->
                    <!--</button>-->
                </div>
                
    
            </div>
        
    
        </form>
</section>  