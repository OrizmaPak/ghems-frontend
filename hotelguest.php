
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
                                <li id="" class="me-2 cp viewer optioner " name="guestregistrationcard" onclick="prepareGuestRegistrationCardBrand();runoptioner(this)">
                                    <p class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Guest Registration Card</p>
                                </li>
                            </ul>

<style>
    .grc-shell {
        --grc-ink: #0f172a;
        --grc-muted: #64748b;
        --grc-line: #cbd5e1;
        --grc-panel: #f8fafc;
        color: var(--grc-ink);
    }
    .grc-card {
        width: 210mm;
        min-height: 297mm;
        max-width: 100%;
        margin: 0 auto;
        background: #ffffff;
        border: 1px solid #d8e2ef;
        box-shadow: 0 24px 70px rgba(15, 23, 42, .12);
        padding: 8mm;
        font-family: Arial, Helvetica, sans-serif;
    }
    .grc-header {
        display: grid;
        grid-template-columns: 26mm 1fr 34mm;
        gap: 5mm;
        align-items: center;
        border-bottom: 2px solid #0f766e;
        padding-bottom: 4mm;
        margin-bottom: 3mm;
    }
    .grc-logo-box {
        width: 22mm;
        height: 22mm;
        border: 1px solid #d8e2ef;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background: #fff;
    }
    .grc-logo-box img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
    .grc-hotel-name {
        font-size: 19px;
        font-weight: 800;
        line-height: 1;
        text-transform: uppercase;
        letter-spacing: .08em;
    }
    .grc-tagline {
        color: #0f766e;
        font-size: 10px;
        font-weight: 700;
        margin-top: 2mm;
    }
    .grc-address {
        color: var(--grc-muted);
        font-size: 9px;
        line-height: 1.35;
        margin-top: 1.5mm;
    }
    .grc-title-box {
        border: 1px solid #0f766e;
        border-radius: 6px;
        padding: 3mm;
        text-align: center;
        background: linear-gradient(135deg, #ecfeff, #f8fafc);
    }
    .grc-title-box h2 {
        font-size: 12px;
        font-weight: 800;
        text-transform: uppercase;
        margin: 0;
        line-height: 1.25;
    }
    .grc-section {
        border: 1px solid #d8e2ef;
        border-radius: 6px;
        overflow: hidden;
        margin-top: 2.4mm;
    }
    .grc-section-title {
        background: #17456a;
        color: #ffffff;
        font-size: 8.5px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: .08em;
        padding: 1.7mm 2.5mm;
    }
    .grc-grid {
        display: grid;
        gap: 0;
        border-top: 1px solid #e2e8f0;
    }
    .grc-grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .grc-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .grc-grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .grc-split {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 2mm;
    }
    .grc-span-2 {
        grid-column: span 2;
    }
    .grc-field {
        min-height: 10.5mm;
        padding: 1.5mm 2mm;
        border-right: 1px solid #e2e8f0;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        background: #ffffff;
    }
    .grc-field label {
        display: block;
        font-size: 7.5px;
        color: #475569;
        font-weight: 800;
        text-transform: uppercase;
        line-height: 1;
        margin-bottom: 1.5mm;
    }
    .grc-line {
        min-height: 4mm;
        border-bottom: 1px solid #0f172a;
    }
    .grc-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 8px;
    }
    .grc-table th {
        background: #edf4f8;
        color: #0f172a;
        font-weight: 800;
        text-transform: uppercase;
        border: 1px solid #d8e2ef;
        padding: 1.4mm 1mm;
        text-align: left;
    }
    .grc-table td {
        height: 8.5mm;
        border: 1px solid #d8e2ef;
        padding: 1mm;
    }
    .grc-terms {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1mm 5mm;
        padding: 2mm 3mm;
        font-size: 7.6px;
        line-height: 1.25;
    }
    .grc-terms p {
        margin: 0;
    }
    .grc-signatures {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8mm;
        margin-top: 5mm;
        font-size: 8px;
        font-weight: 800;
        text-align: center;
    }
    .grc-signature-line {
        border-top: 1px solid #0f172a;
        padding-top: 1.6mm;
    }
    @media print {
        body * {
            visibility: hidden;
        }
        #guestregistrationcardprint, #guestregistrationcardprint * {
            visibility: visible;
        }
        #guestregistrationcardprint {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            min-height: 297mm;
            box-shadow: none;
            border: 0;
        }
    }
</style>

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

<div id="guestregistrationcard" class="hidden grc-shell">
    <div class="flex flex-wrap justify-end gap-3 my-4">
        <button onclick="printGuestRegistrationCard()" type="button" class="w-full h-[38px] md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-green-400 via-green-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
            <span class="material-symbols-outlined text-sm">print</span>
            <span>Print Form</span>
        </button>
    </div>

    <div id="guestregistrationcardprint" class="grc-card">
        <div class="grc-header">
            <div class="grc-logo-box">
                <img id="guestregistrationcardlogo" alt="Hotel Logo">
            </div>
            <div>
                <div id="guestregistrationcardhotelname" class="grc-hotel-name">Gravity Hotel Owerri</div>
                <div class="grc-tagline">Where Great Minds Meet</div>
                <div id="guestregistrationcardaddress" class="grc-address">50000 Action Commercial Area, New Owerri Behind CBN Bank, New Owerri, Imo State, Nigeria</div>
                <div class="grc-address">
                    <span id="guestregistrationcardphone">07053718721, 09135228959</span>
                    <span>&nbsp; | &nbsp;</span>
                    <span id="guestregistrationcardemail">reception@gravityhotels.ng</span>
                </div>
            </div>
            <div class="grc-title-box">
                <h2>Guest Registration Card</h2>
            </div>
        </div>

        <div class="grc-section">
            <div class="grc-section-title">Guest Information</div>
            <div class="grc-grid grc-grid-3">
                <div class="grc-field"><label>Guest Name</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Company</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Mobile Number</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Address 1</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>City</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Pin Code</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Nationality</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Date of Birth</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Email ID</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Arrival From</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Proceeding To</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Mode of Payment</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Credit Card</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Credit Card Number</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Expiry Date</label><div class="grc-line"></div></div>
            </div>
        </div>

        <div class="grc-split">
            <div class="grc-section">
                <div class="grc-section-title">Passport Details</div>
                <div class="grc-grid grc-grid-2">
                    <div class="grc-field"><label>Passport Number</label><div class="grc-line"></div></div>
                    <div class="grc-field"><label>Place of Issue</label><div class="grc-line"></div></div>
                    <div class="grc-field"><label>Date of Issue</label><div class="grc-line"></div></div>
                    <div class="grc-field"><label>Date of Expiry</label><div class="grc-line"></div></div>
                </div>
            </div>
            <div class="grc-section">
                <div class="grc-section-title">Visa / Residential Permit Details</div>
                <div class="grc-grid grc-grid-2">
                    <div class="grc-field"><label>Visa Type / Visa Number</label><div class="grc-line"></div></div>
                    <div class="grc-field"><label>Place of Issue</label><div class="grc-line"></div></div>
                    <div class="grc-field"><label>Date of Issue</label><div class="grc-line"></div></div>
                    <div class="grc-field"><label>Date of Expiry</label><div class="grc-line"></div></div>
                    <div class="grc-field"><label>Date of Arrival</label><div class="grc-line"></div></div>
                    <div class="grc-field"><label>Duration of Stay</label><div class="grc-line"></div></div>
                    <div class="grc-field grc-span-2"><label>Purpose of Visit</label><div class="grc-line"></div></div>
                </div>
            </div>
        </div>

        <div class="grc-section">
            <div class="grc-section-title">Rate / Check-In Information</div>
            <div class="grc-grid grc-grid-4">
                <div class="grc-field"><label>Arrival Date & Time</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Departure Date & Time</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Air Flight No. & Time</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Departure Flight No. & Time</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Room Type</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Room Number</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Tariff</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Plan</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Pax - Adult</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Pax - Child</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Extra Person</label><div class="grc-line"></div></div>
                <div class="grc-field"><label>Reservation Advance</label><div class="grc-line"></div></div>
                <div class="grc-field grc-span-2"><label>Bill Instruction</label><div class="grc-line"></div></div>
                <div class="grc-field grc-span-2"><label>Special Instruction</label><div class="grc-line"></div></div>
            </div>
        </div>

        <div class="grc-section">
            <div class="grc-section-title">Room / Payment Table</div>
            <table class="grc-table">
                <thead>
                    <tr>
                        <th>Room Type</th>
                        <th>Tariff</th>
                        <th>Adult</th>
                        <th>Child</th>
                        <th>Plan</th>
                        <th>Extra Person</th>
                        <th>Res. Advance</th>
                        <th>Bill Instruction</th>
                        <th>Special Instruction</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                </tbody>
            </table>
        </div>

        <div class="grc-section">
            <div class="grc-section-title">Terms & Conditions</div>
            <div class="grc-terms">
                <p>1. Includes breakfast for one person, 7.5% VAT, 5% Consumption Tax & 10% Service Charge.</p>
                <p>2. Subject to rooms available in each category.</p>
                <p>3. Subject to payment on arrival.</p>
                <p>4. Check-in time is 14:00 hours.</p>
                <p>5. Check-out time is 11:00 hours. Late check-out attracts 50% charge.</p>
                <p>6. Smoking in the room attracts charge of NGN 50,000.</p>
                <p>7. Breakfast time is 06:30 hours - 10:00 hours.</p>
                <p>8. Non-guaranteed reservation is released by 16:00 hours. No-show guaranteed reservation is charged 100% without information before 24:00 hours.</p>
            </div>
        </div>

        <div class="grc-signatures">
            <div class="grc-signature-line">Duty Manager</div>
            <div class="grc-signature-line">Guest Signature</div>
            <div class="grc-signature-line">FOA's Signature</div>
        </div>
    </div>
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
