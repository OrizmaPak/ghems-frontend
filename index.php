<?php
session_start();
if(!isset($_SESSION["user_id"]) && !isset($_SESSION["user_id"]))
{
	header('Location: login');
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#051937">
    <meta name="description" content="Guest Harmony Engine Management System - Hotel management system for guest operations, inventory, and financial management">
    <title>User | Hems</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="./css/style.js"></script>
    <link rel="stylesheet" href="./css/index.css">
    <link rel="stylesheet" href="./css/css_vanilla.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;1,700&display=swap"
        rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">

    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@40,400,0,0" />
    <!--<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />-->
    <!--<link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet" />-->
    

    <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    

</head>

<body>
    <main class="h-screen bg-primary/10 app-shell">
        <input type="hidden" name="location_id" id="location_id" value="<?php echo $_SESSION["location_id"]?>" readonly>
        <input type="hidden" name="your_email" id="your_email" value="<?php echo $_SESSION["hemsemail"]?>" readonly>
        <input type="hidden" name="" id="your_role" value="<?php echo $_SESSION["role"]?>" readonly>
        <input type="hidden" name="" id="your_companyname" value="<?php echo $_SESSION["companyname"]?>" readonly>
        <input type="hidden" name="" id="your_companyphone" value="<?php echo $_SESSION["companyphone"]?>" readonly>
        <input type="hidden" name="" id="your_companyaddress" value="<?php echo $_SESSION["companyaddress"]?>" readonly>
        <input type="hidden" name="" id="your_companylogo" value="<?php echo $_SESSION["companylogo"]?>" readonly>
        <input type="hidden" name="" id="your_companyemail" value="<?php echo $_SESSION["companyemail"]?>" readonly>
        <div class="h-full">
            <header>
                <div class="glass-header portal-header">
                    <div class="portal-brand">
                        <span
                            class="xl:w-[250px] font-bold text-base block py-3 pl-5 selection:bg-white uppercase font-heebo text-primary-g">He<span
                                class="text-gray-400">ms</span></span>
                        <div class="portal-brand-meta">
                            <span>Guest Harmony Engine</span>
                            <span><?php echo $_SESSION["companyname"] ?? 'Hotel Ops' ?></span>
                        </div>
                    </div>
                    <div class="portal-control">
                        <div class="portal-persona">
                            <div class="portal-chip">
                                <span class="portal-chip-label">Operator</span>
                                <span class="portal-chip-value" name="user_name">Loading...</span>
                            </div>
                            <div class="portal-chip">
                                <span class="portal-chip-label">Role</span>
                                <span class="portal-chip-value" name="user_role">Loading...</span>
                            </div>
                        </div>
                        <div class="portal-icon-stack">
                            <button id="toggler"
                                class="portal-icon-btn flex items-center justify-center transition ease-linear duration-300 text-gray-500">
                                <span class="material-symbols-outlined">menu</span>
                            </button>
                            <a href="?r=resolve_ticket" class="portal-icon-btn relative" id="user_notification" style="display:none">
                                <span class="material-symbols-outlined">notifications</span>
                                <span class="rounded-full flex items-center justify-center bg-primary-g text-white absolute" style="display:none;position:absolute;top:3px;left:3px;height:7px;width:7px;"></span>
                            </a>
                            <div class="relative flex items-center qq">
                                <button onclick="notificationpanel()" title="notifications" class="portal-icon-btn qq flex items-center justify-center">
                                    <span class="qq material-symbols-outlined">notifications</span>
                                    <p id="notification_badge_count" class="qq badge hidden">0</p>
                                </button>
                                <div id="notificationpanel"  class="qq overflow-auto transition-all text-center px-3 rounded-md absolute flex gap-4 flex-col z-[500] top-12 right-0 w-[250px] h-[400px] !h-[0px] bg-[white] shadow">
                                    <p class="font-semibold qq mt-3">Notification</p>
                                    <hr class="qq opacity-[0.5]"/>
                                    <p class="qq font-normal text-xs">Your Attention needed!!</p>
                                    <div id="notification_content_holder">
                                    </div>
                                </div>
                            </div>
                            <button onclick="logoff()" title="logout" class="portal-icon-btn flex items-center justify-center text-gray-500">
                                <span class="material-symbols-outlined">power_settings_new</span>
                            </button>
                            <span class="portal-avatar w-[34px] h-[34px] lg:w-[40px] lg:h-[40px] rounded-full overflow-hidden">
                                <img src="./images/default-avatar.png" alt="user avatar" class="w-full h-full object-cover">
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <section class="app-layout">
                <div class="lg:flex h-screen relative">
                    <!-- navigation --> 
                    <nav id="navigation" class="fixed top-0 left-0 z-40 lg:relative lg:z-0 w-4/5 lg:w-[250px] h-full bg-white border-r-2 border-gray-200/50 pb-32 overflow-auto glass-sidebar">
                        <div id="hoverer" class="overflow-y-auto overflow-x-hidden h-full px-2">
                        <div class="flex flex-col w-5/6 m-auto items-start py-5 sticky top-0 sidebar-identity">
                            <span class="font-medium text-[9px] text-blue font-mont mt-1"><?php echo $_SESSION["hemsemail"]?></span>
                        </div>
                            <ul id="navigationcontainer" class="font-poppins mt-5 pb-20">
                                <li class="nav-item"> 
                                    <span class="navitem-title group  text-[#292929]" title="<div class='text-[13px] leading-relaxed text-slate-700'><span class='font-semibold text-primary-g text-sm block mb-1'>Live Control Centre</span><p class='mb-2'>Monitor occupancy, receivables, inventory, and sales at a glance. The metrics refresh automatically whenever new data arrives.</p><p class='mb-2 text-[12px]'><span class='font-semibold text-slate-800'>Quick actions:</span></p><ul class='list-disc ml-4 text-[12px] space-y-1'><li>Click any metric card to jump into the detailed workspace it references.</li><li>Use the Available Rooms drawer to pre-assign or audit rooms before check-in.</li><li>Watch the Revenue Velocity chart for unusual spikes or dips and take action fast.</li></ul></div>" id="dashboard">
                                        <span class="material-symbols-outlined group-hover:text-primary-g"
                                            style="font-size: 20px;">dashboard</span>
                                        <span class="group-hover:text-primary-g">
                                            <span>Dashboard</span>
                                        </span>
                                    </span>
                                </li> 
                                <li class="nav-item">
                                    <span class="navitem-title group  text-[#292929]">
                                        <span class="material-symbols-outlined group-hover:text-primary-g"
                                            style="font-size: 20px;">person</span>
                                        <span class="group-hover:text-primary-g">
                                            <span>Administration</span> 
                                            <span class="material-symbols-outlined" style="font-size: 15px;">chevron_right</span>
                                        </span>
                                    </span>
                                    <ul class="ml-14 gap-y-4 flex flex-col">
                                        <li class="navitem-child text-[#292929] hidden" title="<div class='text-[13px] leading-relaxed text-slate-700'><span class='font-semibold text-primary-g text-sm block mb-1'>Profile Workspace</span><p class='mb-2'>Maintain each operator’s personal and job placement record. Email and role remain locked so audit trails stay intact.</p><ul class='list-disc ml-4 text-[12px] space-y-1'><li><strong>Identity & contact:</strong> Update names, mobile, address, and DOB as they change.</li><li><strong>Placement:</strong> Pick the right department and supervisor (lists draw from the Department page so keep that up to date).</li><li><strong>Save cycle:</strong> Hit <em>Update</em> whenever you edit a field; downstream modules (assignment, approvals, notifications) read from this profile.</li></ul></div>" id="profile">Profile</li>
                                        <li class="navitem-child text-[#292929] hidden" title="<div class='text-[13px] leading-relaxed text-slate-700'><span class='font-semibold text-primary-g text-sm block mb-1'>Credential Reset</span><p class='mb-2'>Use this page whenever an operator needs to change their password without contacting IT.</p><ul class='list-disc ml-4 text-[12px] space-y-1'><li><strong>Current password</strong> confirms the person making the change.</li><li><strong>New + confirm</strong> must match; the form refuses to submit if they differ.</li><li><strong>Submit</strong> sends the reset request to <code>resetpassword</code> so the user can authenticate with the new secret immediately.</li></ul><p class='mt-2 text-[11px] text-slate-500'>Use a strong mix of letters, numbers, and symbols—the form does not enforce strength, so coach users accordingly.</p></div>" id="changepassword">Change Password</li>
                                        <li class="navitem-child text-[#292929] hidden" title="<div class='text-[13px] leading-relaxed text-slate-700'><span class='font-semibold text-primary-g text-sm block mb-1'>Activity Panel</span><p class='mb-2'>Audit user actions—logins, updates, reservations—from a filtered time window.</p><ul class='list-disc ml-4 text-[12px] space-y-1'><li>Select a <strong>personnel email</strong> from the auto-filled user list.</li><li>Provide a <strong>start</strong> and <strong>end</strong> date to bound the search.</li><li>Click <em>Submit</em> to load the timeline; entries are sorted newest first with timestamp, status, and description.</li></ul><p class='mt-2 text-[11px] text-slate-500'>Export or screenshot the table for investigations—the pagination controls let you scan large result sets.</p></div>" id="useractivity">Activity Panel</li>
                                        <li class="navitem-child text-[#292929] hidden" title="<div class='text-[13px] leading-relaxed text-slate-700'><span class='font-semibold text-primary-g text-sm block mb-1'>Department Register</span><p class='mb-2'>Define every department/storefront so staff placement, inventory routing, and POS menus know where to post.</p><ul class='list-disc ml-4 text-[12px] space-y-1'><li><strong>Department name:</strong> Unique label that appears everywhere (booking, requisition, etc.).</li><li><strong>Category:</strong> Tag as OFFICE, STORE, or MOBILE MENU to control where it shows up.</li><li><strong>Apply for sales:</strong> Flag whether the department can hold STOCK, NON STOCK, or is strictly administrative.</li><li>The grid lists all departments; edit/delete buttons stay hidden for the default “Main Store” so you never orphan inventory.</li></ul></div>" id="department">Department</li>
                                        <li class="navitem-child text-[#292929] hidden" title="<div class='text-[13px] leading-relaxed text-slate-700'><span class='font-semibold text-primary-g text-sm block mb-1'>Access Control Board</span><p class='mb-2'>SUPERADMIN-only console for assigning roles and granular permissions.</p><ul class='list-disc ml-4 text-[12px] space-y-1'><li>Select a user from the <strong>Personel</strong> datalist to load their current profile.</li><li>Role and department fields auto-populate; adjust them only if the person’s scope changed.</li><li>Each permission switch sits under functional clusters (Administration, Inventory, Front Desk, etc.). Toggle what the user can see or action.</li><li>Click <em>Save</em> to update the permission string stored in the backend; the navigation will immediately respect the new rules.</li></ul><p class='mt-2 text-[11px] text-rose-500 font-semibold'>Tip: Clear the Personel field to reset the board if you pick the wrong user.</p></div>" id="accesscontrol">Access Control</li>
                                        <li class="navitem-child text-[#292929] hidden" title="<div class='text-[13px] leading-relaxed text-slate-700'><span class='font-semibold text-primary-g text-sm block mb-1'>User Directory</span><p class='mb-2'>Review every operator record and quickly lock/unlock access.</p><ul class='list-disc ml-4 text-[12px] space-y-1'><li>The table lists names, email, and address; SUPERADMIN rows stay hidden for safety.</li><li>Use the <strong>lock</strong> icon to deactivate an account (status becomes <em>DEACTIVATED</em>).</li><li>Use the <strong>key</strong> icon to reactivate when HR clears the user.</li></ul><p class='mt-2 text-[11px] text-slate-500'>Actions call the deactivate/reactivate endpoints, so there’s no edit form on this page.</p></div>" id="userspage">Users</li>
                                        <li class="navitem-child text-[#292929] hidden" title="<div class='text-[13px] leading-relaxed text-slate-700'><span class='font-semibold text-primary-g text-sm block mb-1'>Rate Code Builder</span><p class='mb-2'>Publish nightly pricing templates that front office, CRS, and POS will pick up.</p><ul class='list-disc ml-4 text-[12px] space-y-1'><li><strong>Create tab:</strong> Enter the rate code, occupant-based prices, currency, and tie it to a Booking Plan (the plan auto-fills the adult/child plan fields).</li><li><strong>View tab:</strong> Audit all codes, edit mistakes, or delete retired tariffs.</li><li>Include extra adult/child amounts so the system can calculate supplements automatically at check-in.</li></ul></div>" id="ratecode">Rate code</li>
                                        <li class="navitem-child text-[#292929] hidden" title="<div class='text-[13px] leading-relaxed text-slate-700'><span class='font-semibold text-primary-g text-sm block mb-1'>Booking Plan Matrix</span><p class='mb-2'>Define the meal/plan codes (e.g., RO, BB, MAP) that Rate Codes and reservations reference.</p><ul class='list-disc ml-4 text-[12px] space-y-1'><li><strong>Plan code:</strong> Two-letter shorthand printed on folios.</li><li><strong>Adult/child amounts:</strong> Base rates that downstream pricing pulls into packaged deals.</li><li>After saving, the plan becomes available in the Rate Code dropdown and reservation screens.</li></ul><p class='mt-2 text-[11px] text-slate-500'>Keep plan names consistent with marketing material to avoid guest confusion.</p></div>" id="bookplan">Booking Plan</li>
                                        <li class="navitem-child text-[#292929] hidden" title="<div class='text-[13px] leading-relaxed text-slate-700'><span class='font-semibold text-primary-g text-sm block mb-1'>Discount Coupons</span><p class='mb-2'>Issue promo codes for the web or mobile channels.</p><ul class='list-disc ml-4 text-[12px] space-y-1'><li><strong>Coupon name</strong> is what staff will type during billing.</li><li>Pick whether the discount is a <strong>PERCENTAGE</strong> or <strong>FLAT</strong> value and enter the amount.</li><li>Choose the deployment <strong>platform</strong> so the right sales module exposes the code.</li><li>The table lets you edit or retire codes once campaigns end.</li></ul></div>" id="discountcouponp">discount</li>
                                        <li class="navitem-child text-[#292929] hidden" title="<div class='text-[13px] leading-relaxed text-slate-700'><span class='font-semibold text-primary-g text-sm block mb-1'>Cost Center Registry</span><p class='mb-2'>Catalog destinations for expenses so procurement, stores, and finance align.</p><ul class='list-disc ml-4 text-[12px] space-y-1'><li>Capture the <strong>cost center name</strong> and the additional context (address, phone, project owner, etc.).</li><li>Use the grid to edit or delete entries and keep the list lean.</li><li>These centers appear in requisitions, purchase orders, and GL postings.</li></ul></div>" id="costcenter">Cost Center</li>
                                        <li class="navitem-child text-[#292929] hidden" title="<div class='text-[13px] leading-relaxed text-slate-700'><span class='font-semibold text-primary-g text-sm block mb-1'>Organisation Settings</span><p class='mb-2'>Central place for brand identity, statutory charges, and default GL mappings.</p><ul class='list-disc ml-4 text-[12px] space-y-1'><li><strong>Basic Info tab:</strong> Update company name, contact channels, SMS sender ID/charges, tax rates, and control flags (back-dated/future transactions).</li><li><strong>Logo upload:</strong> Click the photo badge to upload a new emblem that flows to receipts and dashboards.</li><li><strong>Default Accounts tab:</strong> Map every financial scenario (income, cash, VAT, receivable, payable, etc.) to a GL account so automation works.</li></ul><p class='mt-2 text-[11px] text-rose-500 font-semibold'>Always click <em>Save</em> after adjusting a tab; the form persists the active tab’s inputs.</p></div>" id="settings">Settings</li>
                                    </ul>
                                </li>
                                <li class="nav-item"> 
                                    <span class="navitem-title group  text-[#292929]">
                                        <span class="material-symbols-outlined group-hover:text-primary-g"
                                            style="font-size: 20px;">storefront</span>
                                        <span class="group-hover:text-primary-g"> 
                                            <span>Inventory</span>
                                            <span class="material-symbols-outlined" style="font-size: 15px;">chevron_right</span>
                                        </span>
                                    </span>
                                    <ul class="ml-14 gap-y-4 flex flex-col">
                                        <li class="navitem-child text-[#292929] hidden" title="Add new inventory items, define their details, and manage stock levels." id="createinventory">Create Inventory</li>
                                        <li class="navitem-child text-[#292929] hidden" title="Enter and manage the initial stock quantities for your inventory items." id="openstock">Opening Stock</li>
                                        <li class="navitem-child text-[#292929] hidden" title="Edit inventory details, adjust stock levels, and manage item information." id="updateinventory">Update Inventory</li>
                                        <li class="navitem-child text-[#292929] hidden" title="View and review the details of current inventory items, including quantities and descriptions."id="viewinventory">View Inventory</li>
                                        <!--<li class="navitem-child text-[#292929] hidden" id="warehousestorage">Warehouse/Department</li>-->
                                        <li class="navitem-child text-[#292929] hidden" title="Create, manage, and track inventory requisitions and supply requests." id="requisition">Requisition</li>
                                        <li class="navitem-child text-[#292929] hidden" title="View and review details of current requisitions, including requests, statuses, and fulfillment." id="viewrequisition">View Requisition</li>
                                        <li class="navitem-child text-[#292929] hidden" title="Review pending inventory requisitions, assess request details, and make decisions to approve or reject each supply request based on needs and availability." id="approverequisition">Approve Requisition</li>
                                        <li class="navitem-child text-[#292929] hidden" title="View and manage a comprehensive list of issue types for categorizing problems." id="issuetypelist">issue type list</li>  
                                        <li class="navitem-child text-[#292929] hidden" title="Create new issue logs by documenting details of problems or requests, including descriptions, priorities, and assigned personnel for resolution." id="issuelog">Issue Log</li>  
                                        <li class="navitem-child text-[#292929] hidden" title="View and track the history of issues, including their details, statuses, resolutions, and any actions taken throughout the issue lifecycle." id="viewissuelog">View Issue Log</li>  
                                        <li class="navitem-child text-[#292929] hidden" title="Process and manage the return of items, including initiating return requests, handling refunds, and updating inventory records." id="returns">Return Item</li>  
                                        <li class="navitem-child text-[#292929] hidden" title="View and review details of returned items, including return requests, reasons for return, status updates, and associated refund or exchange information." id="viewreturns">View Returned Item</li>  
                                        <li class="navitem-child text-[#292929] hidden" title="View and manage the detailed stock ledger, including inventory transactions, stock adjustments, and historical records of item movements and balances." id="stockhistory">Stock Ledger</li>  
                                        <li class="navitem-child text-[#292929] hidden" title="Calculate and review the value of current inventory based on stock quantities, item costs, and market conditions for financial and management purposes." id="stockvaluation">Stock valuation</li>
                                    </ul>
                                </li>
                                <li class="nav-item"> 
                                    <span class="navitem-title group  text-[#292929]">
                                        <span class="material-symbols-outlined group-hover:text-primary-g"
                                            style="font-size: 20px;">computer</span>
                                        <span class="group-hover:text-primary-g">
                                            <span>Front Office</span>
                                            <span class="material-symbols-outlined" style="font-size: 15px;">chevron_right</span>
                                        </span>
                                    </span>
                                    <ul class="ml-14 gap-y-4 flex flex-col">
                                        <li class="navitem-child text-[#292929] hidden" title="Search for recent guest arrivals by entering various search criteria. Review details such as guest names, arrival dates, booking information, and room assignments to efficiently manage check-ins and monitor guest stays." id="searcharrivals">Search Arrivals</li>
                                        <li class="navitem-child text-[#292929] hidden" title="Create, manage, and review guest groups, travel agencies and companies including details, member information, booking arrangements, and special requests. And ensure all group needs are met effectively." id="hotelguest">Guests Management</li>
                                        <li class="navitem-child text-[#292929] hidden" title="Create, manage, and review guest groups, travel agencies and companies including details, member information, booking arrangements, and special requests. And ensure all group needs are met effectively." id="groupofguests">Groups</li>
                                        <li class="navitem-child text-[#292929] hidden" title="View and manage guest profiles and reservations. Access detailed information about individual guests, their booking history, current reservations, check-in and check-out dates, room assignments, and special requests for efficient guest management." id="guestsreservations">Guests & Reservations</li>
                                        <li class="navitem-child text-[#292929] hidden" title="Manage the check-in process for guest reservations. Verify booking details, complete the check-in procedures, update room assignments, and handle any special requests or requirements to ensure a smooth and welcoming guest arrival experience." id="reservationcheckin">Reservation Check In</li>
                                        <li class="navitem-child text-[#292929] hidden" title="Handle direct check-ins for guests arriving without prior reservations. Quickly complete the check-in process, assign rooms, collect necessary information, and ensure guests receive all essential details for a comfortable stay." id="checkin">Direct Check in</li>
                                        <li class="navitem-child text-[#292929] hidden" title="Create, manage, and review group reservations, including booking multiple rooms for group events, tracking group details, coordinating special requests, and overseeing room assignments to ensure a seamless experience for all group members." id="groupreservations">group reservations</li>
                                        <li class="navitem-child text-[#292929] hidden" title="Manage the check-in process for groups, including verifying group reservation details, assigning rooms to group members, processing check-ins for multiple guests simultaneously, and addressing any special requests or needs for a smooth group arrival experience." id="groupcheckin">Group Check in</li>
                                        <li class="navitem-child text-[#292929] hidden" title="Print the guest registration card for the current reservation. This card includes essential guest details, booking information, and check-in/check-out dates for documentation and verification purposes during the check-in process." id="printregistrationcard">Print Registration Card</li>
                                        <li class="navitem-child text-[#292929] hidden" title="View a comprehensive list of upcoming guest arrivals. This page displays essential details such as guest names, expected arrival times, and any special requests. It helps staff prepare for check-ins and ensures a smooth arrival experience." id="expectedarrivals">expected arrivals</li>
                                        <li class="navitem-child text-[#292929] hidden" title="View the expected check-out for departing guests. " id="expectedcheckouts">Expected Check out</li>
                                        <li class="navitem-child text-[#292929] hidden" title="Allow guests to extend their current reservation through the Extend Stay feature. This page provides options for adjusting check-out dates, viewing availability for additional nights, and updating the reservation with new dates and rates to accommodate guests' extended stays." id="extendstay">Extend Stay</li>
                                        <li class="navitem-child text-[#292929] hidden" title="Manage the check-out process for departing guests. This page allows staff to finalize the guest's bill, process payments, and review any additional charges or services. It also provides options for generating invoices and collecting feedback on the guest’s stay." id="checkout">Check out</li>
                                        <li class="navitem-child text-[#292929] hidden" title="Cancel a guest’s reservation by reviewing booking details, applying cancellation policies, updating availability, and confirming the cancellation. This process ensures the reservation is effectively canceled and records are maintained for future reference." id="cancelreservation">cancel reservation</li>
                                        <li class="navitem-child text-[#292929] hidden" title="Re-assign rooms to guests by selecting alternative accommodations and updating reservation details. This process allows adjustments to room assignments due to changes in guest needs, room availability, or special requests, ensuring a smooth and accommodating stay." id="reassignrooms">Room Transfer</li> 
                                        <li class="navitem-child text-[#292929] hidden" title="View the current status of all rooms in the hotel, including availability, cleanliness, and maintenance updates. This overview helps manage room assignments, track housekeeping progress, and ensure that rooms are ready for guest check-ins." id="roomstatus">Room Status</li>
                                        <!--<li class="navitem-child text-[#292929] hidden" id="cancellation">Cancellations</li>-->
                                        <li class="navitem-child text-[#292929] hidden" title="Send and receive messages between the hotel and guests. This feature allows for direct communication to address requests, provide updates, and offer assistance, ensuring a smooth and personalized guest experience throughout their stay." id="messages">Messages</li>
                                        <li class="navitem-child text-[#292929] hidden" title="Receive and manage important updates and alerts related to guest reservations, room statuses, and hotel operations. Notifications keep you informed about upcoming arrivals, changes in bookings, and other time-sensitive information for efficient management." id="notification">Notifications</li>
                                        <li class="navitem-child text-[#292929] hidden" title="Track and manage all outstanding payments and invoices with the Receivables feature. This section provides a detailed overview of pending guest payments, and payment statuses, helping ensure accurate and timely financial management." id="receiveables">Receiveables</li>
                                        <li class="navitem-child text-[#292929] hidden" title="Access and manage guest feedback and reviews. This section allows for viewing ratings, reading comments, and responding to guest experiences. It helps identify areas for improvement, celebrate positive feedback, and enhance overall guest satisfaction." id="reviews">Reviews</li>
                                        <li class="navitem-child text-[#292929] hidden" title="View a detailed list of currently occupied rooms, including guest names, check-in and check-out dates, and room numbers. This section helps monitor hotel capacity, manage room availability, and ensure accurate guest information is readily accessible." id="occupancylist">Occupancy List</li>
                                        <li class="navitem-child text-[#292929] hidden" title="You will see all reservations that the guest hasn't turned up to yet. You can view and cancel the reservation" id="noshow">No Show</li>
                                        <li class="navitem-child text-[#292929] hidden" title="Genral reports of guests including meal plan and more" id="generalreport">General report</li>
                                    </ul>
                                </li>
                                <li class="nav-item"> 
                                    <span class="navitem-title group  text-[#292929]">
                                        <span class="material-symbols-outlined group-hover:text-primary-g"
                                            style="font-size: 20px;">currency_exchange</span>
                                        <span class="group-hover:text-primary-g">
                                            <span>Cashier</span>
                                            <span class="material-symbols-outlined" style="font-size: 15px;">chevron_right</span>
                                        </span>
                                    </span>
                                    <ul class="ml-14 gap-y-4 flex flex-col">
                                        <li class="navitem-child text-[#292929] hidden" id="track">track</li> 
                                        <li class="navitem-child text-[#292929] hidden" id="invoicing">invoicing</li> 
                                        <li class="navitem-child text-[#292929] hidden" id="receipts">Receive Deposits</li> 
                                        <li class="navitem-child text-[#292929] hidden" id="salesreport">sales report</li>
                                        <li class="navitem-child text-[#292929] hidden" title="CONTINUING WITH THIS REVERSAL WILL ERASE REVERSED TRANSACTION PERMANENTLY" id="reversal">reversals</li>
                                        <li class="navitem-child text-[#292929] hidden" id="viewreversal">view reversals</li>
                                    </ul>
                                </li>
                                <li class="nav-item"> 
                                    <span class="navitem-title group  text-[#292929]">
                                        <span class="material-symbols-outlined group-hover:text-primary-g"
                                            style="font-size: 20px;">point_of_sale</span>
                                        <span class="group-hover:text-primary-g">
                                            <span>Point of Sales</span>
                                            <span class="material-symbols-outlined" style="font-size: 15px;">chevron_right</span>
                                        </span>
                                    </span>
                                    <ul class="ml-14 gap-y-4 flex flex-col">
                                        <li class="navitem-child text-[#292929] hidden" id="sales">Sales</li>
                                        <li class="navitem-child text-[#292929] hidden" id="posreceipt">receipt</li>
                                        <li class="navitem-child text-[#292929] hidden" id="salesreportpos">sales report</li>
                                    </ul>
                                </li>
                                <li class="nav-item "> 
                                    <span class="navitem-title group  text-[#292929]">
                                        <span class="material-symbols-outlined group-hover:text-primary-g"
                                            style="font-size: 20px;">kitchen</span>
                                        <span class="group-hover:text-primary-g">
                                            <span>Food & Beverages</span>
                                            <span class="material-symbols-outlined" style="font-size: 15px;">chevron_right</span>
                                        </span>
                                    </span>
                                    <ul class="ml-14 gap-y-4 flex flex-col">
                                        <li class="navitem-child text-[#292929] hidden" id="recipe">Recipe</li>
                                        <li class="navitem-child text-[#292929] hidden" id="viewrecipe">View Recipe</li>
                                        <li class="navitem-child text-[#292929] hidden" id="build">Build</li>
                                        <li class="navitem-child text-[#292929] hidden" id="viewbuild">View Build</li>
                                        <li class="navitem-child text-[#292929] hidden" id="diningtable">Dining Tables</li>
                                        <li class="navitem-child text-[#292929] hidden" id="reservetable">Reserve Tables</li>
                                    </ul>
                                </li>
                                <li class="nav-item "> 
                                    <span class="navitem-title group  text-[#292929]">
                                        <span class="material-symbols-outlined group-hover:text-primary-g"
                                            style="font-size: 20px;">library_add</span>
                                        <span class="group-hover:text-primary-g">
                                            <span>Purchases</span>
                                            <span class="material-symbols-outlined" style="font-size: 15px;">chevron_right</span>
                                        </span>
                                    </span>
                                    <ul class="ml-14 gap-y-4 flex flex-col">
                                        <li class="navitem-child text-[#292929] hidden" id="managesupplier">Manage Supplier</li>
                                        <li class="navitem-child text-[#292929] hidden" id="purchaseorder">Purchase Order</li>
                                        <li class="navitem-child text-[#292929] hidden" id="viewpurchaseorder">View Purchase Order</li>
                                        <li class="navitem-child text-[#292929] hidden" id="receivepurchases">Receive Purchases</li>
                                        <li class="navitem-child text-[#292929] hidden" id="viewpurchases">View Purchases</li>
                                        <li class="navitem-child text-[#292929] hidden" id="expenses">Expenses</li> 
                                        <li class="navitem-child text-[#292929] hidden" id="payment">payment</li> 
                                        <li class="navitem-child text-[#292929] hidden" id="payables">Payables</li>
                                        <li class="navitem-child text-[#292929] hidden" id="allpayables">All Payables</li>
                                        <li class="navitem-child text-[#292929] hidden" title="CONTINUING WITH THIS REVERSAL WILL ERASE REVERSED TRANSACTION PERMANENTLY" id="reversals">reversals</li>
                                        <li class="navitem-child text-[#292929] hidden" id="viewreversals">view reversals</li>
                                    </ul>
                                </li>
                                <li class="nav-item "> 
                                    <span class="navitem-title group  text-[#292929]">
                                        <span class="material-symbols-outlined group-hover:text-primary-g"
                                            style="font-size: 20px;">vacuum</span>
                                        <span class="group-hover:text-primary-g">
                                            <span>House Keeping</span>
                                            <span class="material-symbols-outlined" style="font-size: 15px;">chevron_right</span>
                                        </span>
                                    </span>
                                    <ul class="ml-14 gap-y-4 flex flex-col">
                                        <li class="navitem-child text-[#292929] hidden" id="roomcategories">Room Categories</li>
                                        <li class="navitem-child text-[#292929] hidden" id="addroom">Rooms</li>
                                        <li class="navitem-child text-[#292929] hidden capitalize" id="updateroomstatus">update room status</li>
                                        <li class="navitem-child text-[#292929] hidden capitalize" id="dailyassignmentsheet">daily assignment sheet</li>
                                        <li class="navitem-child text-[#292929] hidden capitalize" id="viewdailyassignmentsheet">View daily assignment sheet</li>
                                        <li class="navitem-child text-[#292929] hidden capitalize" id="createchecklistforcleaning">Create Checklist For Cleaning</li>
                                        <li class="navitem-child text-[#292929] hidden capitalize" id="roomcleaningchecklist">Room Cleaning Checklist</li>
                                        <li class="navitem-child text-[#292929] hidden capitalize" id="lostfoundregister">Lost & Found Register</li>
                                    </ul>
                                </li>
                                <li class="nav-item "> 
                                    <span class="navitem-title group  text-[#292929]">
                                        <span class="material-symbols-outlined group-hover:text-primary-g"
                                            style="font-size: 20px;">engineering</span>
                                        <span class="group-hover:text-primary-g">
                                            <span>Maintenance</span>
                                            <span class="material-symbols-outlined" style="font-size: 15px;">chevron_right</span>
                                        </span>
                                    </span>
                                    <ul class="ml-14 gap-y-4 flex flex-col">
                                        <li class="navitem-child text-[#292929] hidden capitalize" id="maintenancerequest">Maintenance Request</li>
                                        <li class="navitem-child text-[#292929] hidden capitalize" id="viewmaintenancerequest">View Maintenance Request</li>
                                        <li class="navitem-child text-[#292929] hidden capitalize" id="workorder">work order</li>
                                    </ul>
                                </li>
                                <li class="nav-item"> 
                                    <span class="navitem-title group  text-[#292929]">
                                        <span class="material-symbols-outlined group-hover:text-primary-g"
                                            style="font-size: 20px;">attach_money</span>
                                        <span class="group-hover:text-primary-g">
                                            <span>Accounts</span>
                                            <span class="material-symbols-outlined" style="font-size: 15px;">chevron_right</span>
                                        </span>
                                    </span>
                                    <ul class="ml-14 gap-y-4 flex flex-col">
                                        <li class="navitem-child text-[#292929] hidden" id="addglaccount">Add GL Account</li>
                                        <li class="navitem-child text-[#292929] hidden" id="viewglaccount">View GL Accounts</li>
                                        <li class="navitem-child text-[#292929] hidden" id="addgltransaction">Add GL Transaction</li>
                                        <li class="navitem-child text-[#292929] hidden" id="gltransactionhistory">GL Transaction History</li>
                                        <li class="navitem-child text-[#292929] hidden" id="trialbalance">Trial Balance</li>
                                        <li class="navitem-child text-[#292929] hidden" id="incomestatement">Income Statement</li>
                                        <li class="navitem-child text-[#292929] hidden" id="balancesheet">Balance Sheet</li>
                                        <li class="navitem-child text-[#292929] hidden" id="generalaccountreport">General Sales Report</li>
                                    </ul>
                                </li>
                                <li class="nav-item hidden"> 
                                    <span class="navitem-title group  text-[#292929]">
                                        <span class="material-symbols-outlined group-hover:text-primary-g"
                                            style="font-size: 20px;">storefront</span>
                                        <span class="group-hover:text-primary-g">
                                            <span>Products</span>
                                            <span class="material-symbols-outlined" style="font-size: 15px;">chevron_right</span>
                                        </span>
                                    </span>
                                    <ul class="ml-14 gap-y-4 flex flex-col">
                                        <li class="navitem-child text-[#292929] hidden" id="viewproductpurchase">View Products</li>
                                        <li class="navitem-child text-[#292929] hidden" id="addproducts">Add Products</li>
                                    </ul>
                                </li>

                            </ul>
                        </div>
                    </nav>
                    <section class="flex flex-col justify-between pb-6 px-5 w-full lg:px-1 lg:flex-1 lg:min-w-0 content-scaffold">
                        <!-- content area -->
                        <div  class="overflow-y-auto overflow-x-hidden h-full w-full content-scroll">
                            <div class=" w-full mx-auto mt-1 p-5 xl:px-10 workspace-canvas" id="workspace">
                                
                            </div>
                        </div>
                        <footer class="mt-5 p-5 xl:p-0">
                            <p class="w-full mx-auto py-1 border-t border-gray-200 text-xs text-gray-400"> &copy; 2023 Hems.com
                            </p>
                        </footer>
                    </section>
                    
                    
                </div>
                
            </section>

            <div id="arcontainer" class="fixed w-screen h-screen bg-[#00000042] top-0 left-[100%] flex justify-end transition-all duration-[0.5s]">
                            <button type="button" id="aropener" class="absolute !text-xs top-20 left-[-75px] shadow text-white bg-gradient-to-r opacity-[0.7] from-cyan-400 via-cyan-500 to-green-600 hover:bg-gradient-to-br focus:outline-none font-medium rounded-lg text-sm pl-3 pr-5 py-2.5 text-center me-2 mb-2">Available <br/> Rooms</button>
                        <div id="arshadow" class="w-full max-w-[300px] h-full shadow-xs bg-[#ffffffa3] shadow py-4 px-2 relative glass-flyout">
                            <button type="button" id="arremover" class="absolute text-xs top-7 left-[-25px] shadow text-white opacity-[0.8] bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"> X</button>
                            <p class="text-center text-[black] font-bold">AVAILABLE ROOMS GOES HERE</p>
                            
                            <div class="search-box mx-auto scale-[0.7]">
                                <button class="btn-search"><span class="material-symbols-outlined text-white">search</span></button>
                                <input type="text" class="input-search text-black" id="searchavailableroom" placeholder="Type to Search...">
                            </div> 
                            
                            <p class="relative text-xs text-center">You can search by room number, room name, room category, room status and building</p>
                            
                            <div id="availableroomcontainer" class="my-3 h-screen overflow-y-auto">
                                
                                

                            </div>
                        </div>
                    </div>

        </div>
    </main>
     <div class="j-outer-container" id="jmodal-area">
        <div class="modal-content" id="modal-content"></div>
    </div>
    
    <datalist id="hems_userlist_id"></datalist>
    <datalist id="hems_userlist_email"></datalist>
    <datalist id="hems_departmentlist"></datalist>
    <datalist id="hems_roomnumber"></datalist>
    <datalist id="hems_roomnumber_id"></datalist>
    <datalist id="hems_roomnumber_id1"></datalist>
    <datalist id="hems_available_roomnumber"></datalist>
    <datalist id="hems_available_roomnumber_id"></datalist>
    <datalist id="hems_cost_center"></datalist>
    <datalist id="hems_warehouselist"></datalist>
    <datalist id="hems_roomcategories"></datalist>
    <datalist id="hems_itemslist"></datalist>
    <datalist id="hems_itemslist_getid"></datalist>
    <datalist id="hems_itemslist_getname"></datalist>
    <datalist id="hems_department"></datalist>
    <datalist id="hems_rate_code"></datalist>
    <datalist id="hems_rate_code_id"></datalist>
    
    <script src="./js/util.js"></script>
    <script src="./js/oreutil.js"></script>
    <script src="./js/router.js"></script>
    <script src="./js/index.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
    <script src="//unpkg.com/alpinejs" defer></script>
</body>

</html>
