    <section class="h-full overflow-y-auto">
        <div class="text-primary-g font-heebo font-bold text-base uppercase md:w-2/3 xl:w-1/3 3xl:w-2/5 mx-auto text-center mt-10 lg:mb-10"> 
            <!--He<span class="text-gray-400">ms</span>-->
        </div> 
        <div class="bg-white xl:border w-[90%] mx-auto rounded py-14 px-12 drop-shadow-sm pt-4">
            <h1 class="font-bold text-2xl text-center">Profile</h1>
            <!--<p class="mt-5 text-xs text-gray-400 tracking-wider leading-relaxed font-sans text-center">Provide the information below to register a new account</p>-->
            <div class="flex flex-col w-5/6 m-auto items-center py-5 sticky top-0 bg-white border-b border-gray-200/50">
                            <span class="w-[50px] h-auto lg:w-[60px] rounded-full overflow-hidden">
                                <img src="./images/default-avatar.png" alt="user Avater" class="w-full h-auto object-center">
                            </span>
                            <span class="font-extrabold text-normal font-mont capitalize mt-2">John  I. Doe</span>
                            <span class="rounded-full text-white text-3xs font-bold capitalize bg-blue-500 px-2 py-0.5 text-center">Admin</span>
                        </div>
            <form class="mt-10" id="profilesform" autocomplete="of">
                <div class="flex flex-col gap-4">

                    <div class="flex flex-col lg:flex-row items-start gap-3">
                        <div class="form-group-auth">
                            <label for="firstname" class="text-gray-500 font-normal capitalize text-2xs font-heebo">first name</label>
                            <input name="firstname" id="firstname" type="text" class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                        </div>
                        <div class="form-group-auth">
                            <label for="lastname" class="text-gray-500 font-normal capitalize text-2xs font-heebo">last name</label>
                            <input name="lastname" id="lastname" type="text" class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                        </div>
                        <div class="form-group-auth">
                            <label for="othernames" class="text-gray-500 font-normal capitalize text-2xs font-heebo">other names</label>
                            <input name="othernames" id="othernames" type="text" class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                        </div>
                    </div>

                    <div class="flex flex-col lg:flex-row items-start gap-3 my-5">
                        <div class="form-group-auth">
                            <label for="email" class="text-gray-500 font-normal capitalize text-2xs font-heebo">email</label>
                            <input name="email" id="email" type="email" readonly class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                        </div>
                        <div class="form-group-auth">
                            <label for="phone" class="text-gray-500 font-normal capitalize text-2xs font-heebo">phone</label>
                            <input name="phone" id="phone" type="tel" class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                        </div>
                        <div class="form-group-auth">
                            <label for="address" class="text-gray-500 font-normal capitalize text-2xs font-heebo">address</label>
                            <input name="address" id="address" type="text" class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                        </div>
                    </div>

                    <div class="flex flex-col lg:flex-row items-start gap-3 my-5">
                        <div class="form-group-auth">
                            <label for="role" class="text-gray-500 font-normal capitalize text-2xs font-heebo">role</label>
                            <select readonly="readonly" name="role" id="role" class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                <option value="STAFF" selected="selected">STAFF</option>
                            </select>
                        </div>
                        <div class="form-group-auth">
                            <label for="location_name" class="text-gray-500 font-normal capitalize text-2xs font-heebo">Department</label>
                            <select  id="departmentid" name="departmentid" class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                <option value="">-- SELECT DEPARTMENT --</option>
                            </select>
                        </div>
                        <div class="form-group-auth">
                            <label for="dateofbirth" class="text-gray-500 font-normal capitalize text-2xs font-heebo">date of birth</label>
                            <input  id="dateofbirth" type="date" name="dateofbirth" class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                        </div>
                    </div>

                    <div class="flex flex-col lg:flex-row items-start gap-3">
                        <div class="form-group-auth">
                            <label for="dateofbirth" class="text-gray-500 font-normal capitalize text-2xs font-heebo">Supervisor</label>
                            <select  id="supervisorid" name="supervisorid" class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                <option value="">-- SELECT SUPERVISOR --</option>
                            </select>
                        </div>
                    </div>
                
                    <div class="flex gap-3 3xl:gap-1 flex-col md:flex-row items-center mt-10">
                        <!--<button id="submit" type="button" class="w-full md:w-max rounded-full text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8  py-3 lg:py-2shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
                        <!--    <div class="btnloader" style="display: none;" ></div>-->
                        <!--    <span>Update</span>-->
                        <!--</button>-->
                        <button id="submit" type="button" class="btn">
                            <div class="btnloader" style="display: none;" ></div>
                            <span>Update</span>
                        </button>
                        
                    </div>
                </div>
            </form>
            
        </div>
    </section>
