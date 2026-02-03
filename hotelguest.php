
<section class="animate__animated animate__fadeIn">
    
                            <p class="page-title">
                                <span>HOTEL GUEST</span>
                            </p>
                            
                             <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 cark:border-gray-700 cark:text-gray-400">
                                <li  class="me-2 cp updater optioner !text-blue-600 active" name="hotelguestview" onclick="appendguestform();runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ">View Guest</p>
                                </li>
                                <li id="" class="me-2 cp viewer optioner " name="manageguesty" onclick="runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Manage guest</p>
                                </li>
                            </ul>

<div id="hotelguestview" class="">
                                    <form id="hotelguestsform" class="">
                                        <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                            <div class="grid grid-cols-1 !mb-5 lg:grid-cols-1 gap-10">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label">Search Guest</label>
                                                    <input onkeyup="searchguestbyanything(this.value)" type="text" id="searchforguestdata" class="form-control" placeholder="Search by anything">
                                                </div>
                                            </div>
                                
                                        </div>
                                    </form>
                                <div class="table-content  lg:max-w-full">
                                    <div class="w-full flex justify-end relative my-2 ">
                                         <button onclick="printContent('HEMS GUEST PROFILE', null, 'tableer', true)" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                            <div class="btnloader" style="display: none;"></div>
                                            <span>print</span> 
                                        </button>
                                         <button onclick="exportToPDF('tableer')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                            <div class="btnloader" style="display: none;"></div> 
                                            <span>Export PDF</span> 
                                        </button>
                                         <button onclick="exportToExcel('tableer', 'HEMS CHECKIN VIEW')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                            <div class="btnloader" style="display: none;"></div>
                                            <span>Export Excel</span> 
                                        </button> 
                                </div>
                                    <table id="tableer">
                                        <thead>
                                            <tr>
                                                 <th style="width: 20px">s/n</th> 
                                                <th>action</th>
                                                <th>full name</th>
                                                <th>phone</th>
                                                <th>Nationality</th>
                                                <th>state</th>
                                                <th>city</th>
                                                <th>origin</th>
                                                <th>residential address</th>
                                                <th>identity&nbsp;proof</th>
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
                            

<div id="manageguesty" class="hidden">
                                        
                                        <form id="guestmodalform" class="flex flex-col rounded-sm">loading...</form>
</div>


<div id="viewprofileofguest" onclick="if(event.target.id == 'viewprofileofguest')this.classList.add('hidden')" class="z-[100] py-20 w-screen h-screen flex flex-col justify-center items-center fixed bg-[#5a5a5a3e] top-0 left-0 p-10 overflow-auto hidden">
    <div class="w-full flex justify-center relative top-20 z-[500] mb-10 mt-14">
             <button onclick="printContent('HEMS GUEST PROFILE', null, 'guestformview', true)" type="button" class="w-full h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                <div class="btnloader" style="display: none;"></div>
                <span>print</span> 
            </button>
             <button onclick="exportToPDF('guestformview')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                <div class="btnloader" style="display: none;"></div> 
                <span>Export PDF</span> 
            </button>
            <!-- <button onclick="exportToExcel('noshowview', 'HEMS CHECKIN VIEW')" type="button" class="w-full mx-3 h-[35px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">-->
            <!--    <div class="btnloader" style="display: none;"></div>-->
            <!--    <span>Export Excel</span> -->
            <!--</button> -->
    </div>
<form id="guestformview" class="animate__animated animate__fadeIn max-w-[80%] w-fit relative bg-[white] p-10 rounded-lg shadow-lg">
         <p class="page-title">
            <span>HEMS GUEST</span>
        </p>   
        
        
           <div class=" border rounded p-2 !mb-2 bg-[#d1f2f7]">
            <div class="form-group">
                <label for="logoname" class="control-label font-bold text-md">phone</label>
                <input readonly type="tel" name="phone" id="phone" class="border-none outline-none bg-transparent text-md form-control !p-2 comp bg-white" placeholder="Enter Phone Number">
                <input readonly type="hidden" id="id" name="id" />
            </div>
        </div>
        <div class=" border rounded p-2 !mb-2 bg-[#f5f5f5]">
            <div class="grid grid-cols-1 lg:grid-cols-2  gap-10">
                <div class="grid grid-cols-1 lg:grid-cols-3  gap-10">
                    <div class="form-group">
                    <label for="logoname" class="control-label font-bold text-md">title</label>
                    <input readonly name="title" id="title" class="border-none outline-none bg-transparent text-md form-control !p-2 comp">
            </div>
                    <div class="form-group col-span-2">
                        <label for="logoname" class="control-label font-bold text-md">first name</label>
                        <input readonly type="text"  name="firstname" id="firstname" class="border-none outline-none bg-transparent text-md form-control !p-2 comp" placeholder="Enter First Name">
                </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2  gap-10">
                    <div class="form-group">
                        <label for="logoname" class="control-label font-bold text-md">last name</label>
                        <input readonly type="text" name="lastname" id="lastname" class="border-none outline-none bg-transparent text-md form-control !p-2 comp" placeholder="Enter Last Name">
                </div>
                    <div class="form-group">
                        <label for="logoname" class="control-label font-bold text-md">other names</label>
                        <input readonly type="text"  name="othernames" id="othernames" class="border-none outline-none bg-transparent text-md form-control !p-2" placeholder="Enter Other Names">
                </div>
                </div>
            </div>
        </div>
        
        <div class="grid grid-cols-1  lg:grid-cols-2 gap-10">
            <div class="form-group">
                <label for="logoname" class="control-label font-bold text-md">nationality</label>
                <input readonly type="text" name="nationality" id="nationality" class="border-none outline-none bg-transparent text-md form-control !p-2 comp" placeholder="Enter Nationality">
            </div>
            <div class="form-group">
                <label for="logoname" class="control-label font-bold text-md">residential address</label>
                <input readonly name="residentialaddress" id="residentialaddress" class="border-none outline-none bg-transparent text-md form-control !p-2" placeholder="Enter Residential Address">
            </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
            <div class="form-group">
                <label for="logoname" class="control-label font-bold text-md">state</label>
                <input readonly type="text" name="state" id="state" class="border-none outline-none bg-transparent text-md form-control !p-2" placeholder="Enter State">
            </div>
            <div class="form-group">
                <label for="logoname" class="control-label font-bold text-md">City</label>
                <input readonly type="text" name="city" id="city" class="border-none outline-none bg-transparent text-md form-control !p-2 comp" placeholder="Enter City">
            </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
            <div class="form-group">
                <label for="logoname" class="control-label font-bold text-md">company name </label>
                <input readonly type="text" name="companyname" id="companyname" class="border-none outline-none bg-transparent text-md form-control !p-2" placeholder="Enter Company Name">
            </div>
            <div class="form-group">
                <label for="logoname" class="control-label font-bold text-md">company address</label>
                <input readonly type="text" placeholder="Enter Company Name" name="companyaddress" id="companyaddress" class="border-none outline-none bg-transparent text-md form-control !p-2">
            </div>
        </div>
        <div class=" border rounded p-2 !mb-2 bg-[#f5f5f5]">
            <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                    <div class="form-group">
                        <label for="logoname" class="control-label font-bold text-md">birth date</label>
                        <input readonly type="date" name="birthdate" id="birthdate" class="border-none outline-none bg-transparent text-md form-control !p-2 " placeholder="Enter Company Name">
                    </div>
                    <div class="form-group">
                        <label for="logoname" class="control-label font-bold text-md">origin</label>
                         <input name="origin" id="origin" class="border-none outline-none bg-transparent text-md form-control !p-2 ">
                    </div>
                </div>
                <div class="form-group">
                    <label for="logoname" class="control-label font-bold text-md">identity proof  </label>
                    <input readonly name="identityproof" id="identityproof" class="border-none outline-none bg-transparent text-md form-control !p-2 comp">
                </div>
            </div>
            <div name="removeitemm" class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                <div class="form-group">
                    <label for="logoname" class="control-label font-bold text-md">passport number</label>
                    <input readonly type="text" name="passportnumber" id="passportnumber" class="border-none outline-none bg-transparent text-md form-control !p-2" placeholder="Enter Company Name">
                </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                <div class="form-group">
                    <label for="logoname" class="control-label font-bold text-md">issue date of passport</label>
                    <input readonly type="date" name="issuedateofpassport" id="issuedateofpassport" class="border-none outline-none bg-transparent text-md form-control !p-2" placeholder="Enter issue date of passport">
                </div>
                <div class="form-group">
                    <label for="logoname" class="control-label font-bold text-md">expire date of passport</label>
                    <input readonly type="date" name="expiredateofpassport" id="expiredateofpassport" class="border-none outline-none bg-transparent text-md form-control !p-2" placeholder="Enter issue date of passport">
                </div>
                </div>
            </div>
            <div name="removeitemm" class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                    <div class="form-group">
                        <label for="logoname" class="control-label font-bold text-md">visa number</label>
                        <input readonly type="text" name="visanumber" id="visanumber" class="border-none outline-none bg-transparent text-md form-control !p-2" placeholder="Enter Visa Number">
                    </div>
                    <div class="form-group">
                        <label for="logoname" class="control-label font-bold text-md">visa type</label>
                        <input readonly type="text" name="visatype" id="visatype" class="border-none outline-none bg-transparent text-md form-control !p-2" >
                    </div>
                </div>
                <div class="form-group">
                    <label for="logoname" class="control-label font-bold text-md">visa place of issue</label>
                    <input readonly type="text" name="visaplaceofissue" id="visaplaceofissue" class="border-none outline-none bg-transparent text-md form-control !p-2" placeholder="Enter visa place of issue">
                </div>
            </div>
            <div name="removeitemm" class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                <div class="form-group">
                    <label for="logoname" class="control-label font-bold text-md">passport place of issue</label>
                    <input readonly type="text" name="passportplaceofissue" id="passportplaceofissue" class="border-none outline-none bg-transparent text-md form-control !p-2" placeholder="Enter passport place of issue ">
                </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                <div class="form-group">
                    <label for="logoname" class="control-label font-bold text-md">issue date of visa</label>
                    <input readonly type="date" name="issuedateofvisa" id="issuedateofvisa" class="border-none outline-none bg-transparent text-md form-control !p-2" placeholder="Enter issue date of passport">
                </div>
                <div class="form-group">
                    <label for="logoname" class="control-label font-bold text-md">expire date of visa</label>
                    <input readonly type="date" name="expiredateofvisa" id="expiredateofvisa" class="border-none outline-none bg-transparent text-md form-control !p-2" placeholder="Enter expire date of passport">
                </div>
                </div>
            </div>
        </div>
        
        </form>                                         </div>

</section>