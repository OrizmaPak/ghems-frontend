from pathlib import Path
import re

replacements = {
    'searcharrivals': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Arrivals Command Center</span>"
        "<p class='mb-2'>Find open reservations by guest detail or arrival date and jump straight into check-in tasks.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Search by name, document, phone, or reference and combine it with an arrival date to focus on today's funnel.</li>"
        "<li>The action icons let you preview folios, send the booking to the edit workspace, trigger the reservation check-in, or cancel.</li>"
        "<li>Switch to the check-in tab to pick payment method, block a room from the datalist, and capture at least the highlighted minimum deposit.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Clear the filters whenever you need a full OPEN/RESERVED list; the grid repaginates automatically.</p>"
        "</div>"
    ),
    'hotelguest': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Guest Registry</span>"
        "<p class='mb-2'>Search, audit, and update the personal profiles that power every reservation, folio, and message.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>The search bar filters the table and the action icons open a printable profile, edit the guest, or delete the record (with confirmation).</li>"
        "<li>In the Manage tab the phone field auto-fills existing data so you can refresh addresses, ID numbers, employer info, and passport or visa details without retyping.</li>"
        "<li>Use the built-in Print/PDF/Excel buttons whenever HR, immigration, or finance needs an official copy.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Accurate identity data here flows instantly to reservations, invoices, and compliance exports.</p>"
        "</div>"
    ),
    'groupofguests': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Travel & Group Master</span>"
        "<p class='mb-2'>Capture agencies, companies, and ad-hoc groups so reservations can reuse correct billing partners.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Each tab (Travel Agency, Company, Group) has a dedicated form covering contacts, addresses, commissions, and allocation notes.</li>"
        "<li>Selecting the special 'ADD TRAVEL AGENCY' or 'ADD COMPANY' options in other modules opens these same forms in a modal so you never break a workflow.</li>"
        "<li>The View tab lists existing groups with edit/delete actions and keeps dropdowns elsewhere synchronized.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Close the modal with its button so the form snaps back here and the dropdown lists refresh immediately.</p>"
        "</div>"
    ),
    'guestsreservations': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Reservation Builder</span>"
        "<p class='mb-2'>Create full reservations with multiple rooms, guests, plans, and deposits before a guest arrives.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Arrival/departure pickers auto-calculate nights and the reservation type toggle controls the NOT GUARANTEED timeline and validations.</li>"
        "<li>Use Add Room to duplicate guest and rate panels, pick room categories/numbers from datalists, and attach charges or meal plans per room.</li>"
        "<li>The payment modal enforces deposits, requires bank metadata for transfers, and can distribute funds across rooms.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: The View Guest & Reservations tab lets you filter, reopen, or print bookings without rebuilding the form.</p>"
        "</div>"
    ),
    'reservationcheckin': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Reservation Check-In</span>"
        "<p class='mb-2'>Convert confirmed bookings into live stays without rebuilding the reservation.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Load the booking via reference (or by jumping from Arrivals) and the form repopulates guests, rooms, plans, and pricing.</li>"
        "<li>Deposit logic mirrors the reservation page so guaranteed bookings cannot be checked in until the required amount and bank details are captured.</li>"
        "<li>Inline Group/Company/Travel Agent dropdowns still support the 'Add' modal for last-minute account changes.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: When this screen is opened from another module the reservation ID sits in sessionStorage—submit or reset to clear it before the next guest.</p>"
        "</div>"
    ),
    'checkin': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Direct Check-In</span>"
        "<p class='mb-2'>Handle walk-ins or manual bookings and check guests in immediately.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Capture arrival/departure, guest type, purpose, and industry data so dashboards and housekeeping stay accurate.</li>"
        "<li>Add Room replicates the guest/room panels, letting you assign multiple rooms, rate codes, discounts, and meal plans at once.</li>"
        "<li>The payment drawer enforces deposit collection, supports transfer/POS/cash, and can distribute funds across rooms.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Use the View Check-In tab to audit existing stays or reopen one for edits without touching the live form.</p>"
        "</div>"
    ),
    'groupreservations': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Group Reservation Monitor</span>"
        "<p class='mb-2'>Filter upcoming group arrivals and review their booking health.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Select the group and date range to pull every reservation tied to that contract.</li>"
        "<li>The table highlights room and guest counts, totals, payment method, and timeline so you can spot incomplete bookings.</li>"
        "<li>Use the action buttons to view folios, jump to the edit screen, check the party in, or cancel the block.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Run this right after updating a group allotment to confirm all linked reservations share the same reference.</p>"
        "</div>"
    ),
    'groupcheckin': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Group Check-In</span>"
        "<p class='mb-2'>Check entire groups in with shared billing and deposit controls.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Requires selecting the group/company/agent so shared charges and contacts flow to every room card.</li>"
        "<li>Add Room copies the guest/room panels, letting you assign several rooms, rate codes, and plans in one go.</li>"
        "<li>Deposit collection mirrors the individual check-in but can be distributed across the set when needed.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: When you open this from Group Reservations the reference auto-loads—submit or reset before working on the next group.</p>"
        "</div>"
    ),
    'printregistrationcard': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Registration Card Printer</span>"
        "<p class='mb-2'>Produce guest registration cards with all reservation metadata for signatures.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Filter by reservation reference or arrival date range to load the guests you need.</li>"
        "<li>Use the action column to open the formatted card showing guest name, room, stay dates, and occupancy info ready for printing.</li>"
        "<li>Export buttons above the table let you generate PDF or Excel versions when multiple cards are needed.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Build cards before a rush so check-in staff only collect signatures at the desk.</p>"
        "</div>"
    ),
    'expectedarrivals': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Expected Arrivals</span>"
        "<p class='mb-2'>Daily arrival list to prep rooms, deposits, and paperwork.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Select an arrival date and the board refreshes with every OPEN/RESERVED booking for that day.</li>"
        "<li>See room count, nights, payment method, and totals so you can verify deposits and allocations.</li>"
        "<li>Action buttons preview folios, open the edit form, launch reservation check-in, or cancel the booking.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Pair this report with Messages/Notifications to alert teams about VIPs or special requests.</p>"
        "</div>"
    ),
    'expectedcheckouts': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Expected Departures</span>"
        "<p class='mb-2'>Monitor guests due to leave so billing and housekeeping stay aligned.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Filter by departure date to review every room, guest, and payment status scheduled to check out.</li>"
        "<li>Use the action buttons to inspect the folio or jump straight into the checkout workflow.</li>"
        "<li>Billing info, method, and references help you balance folios before guests reach the desk.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Share the exported list with housekeeping during the morning briefing.</p>"
        "</div>"
    ),
    'extendstay': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Extend Stay</span>"
        "<p class='mb-2'>Push a reservation's departure and nights without rebuilding the booking.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Enter the reservation reference and the form auto-populates existing details for review.</li>"
        "<li>Only the departure field stays editable; nights recalc automatically and the system updates calendars on save.</li>"
        "<li>Reservation type logic ensures NOT GUARANTEED stays keep a valid timeline when extended.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Use the full edit-reservation workspace if you need to change anything besides the departure.</p>"
        "</div>"
    ),
    'checkout': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Checkout & Folio</span>"
        "<p class='mb-2'>Finalize guest bills, collect balances, and free the room.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Lookup the reference to load the running folio ledger, summary cards, and guest snapshot.</li>"
        "<li>Select payment method, capture bank notes for transfers, and click Check Out to post the transaction and update room status.</li>"
        "<li>The View tab filters historical checkouts and provides print-ready receipts for audits.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Fill the bank details block before choosing Transfer to avoid validation errors at submission.</p>"
        "</div>"
    ),
    'cancelreservation': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Cancellation Portal</span>"
        "<p class='mb-2'>Process reservation cancellations with penalties and audit trails.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Enter the booking reference to fetch the reservation; only OPEN or RESERVED statuses are eligible here.</li>"
        "<li>The cancellation modal captures the reason, penalty/refund decision, and notes so finance can reconcile deposits.</li>"
        "<li>The read-only reservation snapshot lets you double-check guest and rate information before confirming.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Many modules pass the reference through sessionStorage when you click Cancel, so this page often opens ready to submit.</p>"
        "</div>"
    ),
    'reassignrooms': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Room Transfer Tool</span>"
        "<p class='mb-2'>Move a checked-in guest from one room to another while keeping billing accurate.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Load the reservation to capture the current room number, balance, and reference before you make a change.</li>"
        "<li>Use the room category/number datalists on each card to assign the new accommodation and adjust rates or plans as needed.</li>"
        "<li>Submitting updates the folio, frees the old room, and keeps an audit trail of the previous allocation.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Add the new room card, assign it, then remove the old one so totals stay consistent.</p>"
        "</div>"
    ),
    'roomstatus': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Room Status Board</span>"
        "<p class='mb-2'>Visual dashboard of availability, occupancy, and housekeeping progress.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Filter by arrival/departure dates or status (Available, Occupied, Reserved) to shrink the card grid.</li>"
        "<li>Each card shows guest info, rate plan, and quick actions to view images or open detailed folios.</li>"
        "<li>Export the board to PDF when you need a printout for shift briefings.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Click a card to open the image modal when engineering or housekeeping needs a visual reference.</p>"
        "</div>"
    ),
    'messages': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Guest Messaging</span>"
        "<p class='mb-2'>Log inbound guest requests and outbound replies per room, including attachments.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Select the room number, specify who sent the message, and note whether it should also be emailed directly from the app.</li>"
        "<li>Attach supporting documents or photos; the preview component lets you double-check uploads before submitting.</li>"
        "<li>The View table tracks every message with status so shifts can mark items delivered and export follow-up lists.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Pair this log with Notifications to keep both guests and internal teams aligned on requests.</p>"
        "</div>"
    ),
    'notification': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Staff Notifications</span>"
        "<p class='mb-2'>Send internal alerts with optional attachments so departments stay synced.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Pick the receiver from the user list; the sender defaults to the logged-in operator for audit purposes.</li>"
        "<li>Attachments travel with the alert, and the status dropdown lets you mark messages delivered when acknowledged.</li>"
        "<li>The View table lists each notification with timestamps and quick actions to remove or resend.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: For urgent issues send both a notification and a guest message so front-of-house and internal teams see it.</p>"
        "</div>"
    ),
    'receiveables': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Receivables Ledger</span>"
        "<p class='mb-2'>Watch outstanding balances per room and print mini invoices on demand.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>The table aggregates debit and credit totals so you instantly spot rooms with unpaid balances.</li>"
        "<li>Color cues show whether the room is settled (black) or still owes (red).</li>"
        "<li>Click Pay Now to open the invoice modal, print the notice, or collect settlement before checkout.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Review this list before every shift change to brief cashiers on pending follow-ups.</p>"
        "</div>"
    ),
    'reviews': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Guest Reviews</span>"
        "<p class='mb-2'>Track guest comments, ratings, and resolution status.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Filter by status (Pending or Settled) and date range to focus on the feedback you need.</li>"
        "<li>The table shows guest name, comment, location, and ratings so you can triage service issues quickly.</li>"
        "<li>Use the Resolve action to mark a review as addressed; it calls the resolvereview endpoint for auditing.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Export the pending list before management reviews so stakeholders only see unresolved items.</p>"
        "</div>"
    ),
    'occupancylist': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Occupancy Intelligence</span>"
        "<p class='mb-2'>Mix of charts, detailed lists, and a 30-day timeline to understand room utilization.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>The Charts Analysis tab renders occupancy KPIs so leadership can see trends at a glance.</li>"
        "<li>The Occupancy List tab filters by reference or date and displays each room's guests, plan amounts, discounts, and totals with a running grand total.</li>"
        "<li>The Room Status Next 30 Days tab builds a timeline grid showing each room's booking blocks for long-range planning.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Export the occupancy list before budget meetings; it already includes plan and discount figures needed for revenue reports.</p>"
        "</div>"
    ),
    'noshow': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>No-Show Tracker</span>"
        "<p class='mb-2'>List reservations where guests failed to arrive so you can apply policies or reallocate rooms.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Filter by date range to see bookings that never checked in but still hold inventory and deposits.</li>"
        "<li>Each row shows initial deposit, payment method, and timeline to help finance enforce penalties or refunds.</li>"
        "<li>Action buttons link to the cancellation or check-in modules if you need to regularize the record.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Share the exported sheet with accounting nightly to support no-show charge processing.</p>"
        "</div>"
    ),
    'generalreport': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Plans & Discounts Report</span>"
        "<p class='mb-2'>Analyze which meal plans and discounts guests actually used.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>The Guests Plans tab filters by start date and lists each room/guest along with plan amounts and discount figures.</li>"
        "<li>The Discounts tab highlights coupon usage, percentage versus flat values, and the total impact on rates.</li>"
        "<li>Both tables are export friendly so revenue managers can reconcile them against GL postings.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Run both tabs before closing the month to catch misconfigured plans or expired coupons.</p>"
        "</div>"
    ),
    'track': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Room Revenue Tracker</span>"
        "<p class='mb-2'>Enter a room number to see every linked reservation, rate, and outstanding balance.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>The board shows the reservation reference, all rooms on the folio, arrival date, and rate/plan breakdown.</li>"
        "<li>Totals are calculated automatically so you can tell at a glance what is due before check-out.</li>"
        "<li>Use the second table to inspect each posting and keep audit notes for finance.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Run Track whenever a guest wants a mid-stay bill preview; the totals include both room rate and plan extras.</p>"
        "</div>"
    ),
    'invoicing': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Invoice Builder</span>"
        "<p class='mb-2'>Fetch a reservation by reference, summarize every room charge, and issue a printable invoice.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>The summary grid calculates totals per room (rate, discounts, plan amounts) and updates the Amount Due field automatically.</li>"
        "<li>Capture payment method details and distribution preferences before clicking Submit to post the invoice.</li>"
        "<li>The right-hand card renders a branded invoice with company info, stay dates, and payment method for printing or PDF export.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Fill in bank notes whenever TRANSFER is selected; finance relies on this metadata for reconciliation.</p>"
        "</div>"
    ),
    'receipts': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Deposit Receipts</span>"
        "<p class='mb-2'>Record money received against a reservation and print an acknowledgment for the guest.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Lookup the reservation reference to see current balance, stay information, and company branding that will appear on the receipt.</li>"
        "<li>Enter the payment amount, choose the method, and provide bank/other details for transfer or POS transactions.</li>"
        "<li>The distribute toggle applies the payment across all rooms on the folio when needed.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: After a successful post the printable receipt opens automatically—save or email it before closing the modal.</p>"
        "</div>"
    ),
    'salesreport': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Cashier Sales Report</span>"
        "<p class='mb-2'>Filter POS transactions by sales point, staff, and date range, then drill into each receipt.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>The filter form pulls dynamic lists of sales points and users so you can target a single outlet or staff member.</li>"
        "<li>The table displays reference, description, amounts received, service charge, and payment method.</li>"
        "<li>Action buttons open a detailed modal or print the official sales receipt for auditing.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Use this view for daily reconciliation—export after each shift before clearing filters.</p>"
        "</div>"
    ),
    'reversal': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Transaction Reversal</span>"
        "<p class='mb-2'>Submit reversal requests when a sale or receipt needs to be voided by finance.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Use the Sales tab to reverse a POS sale by entering its reference and justification.</li>"
        "<li>Use the Receipt tab when you need to cancel a posted deposit; both forms enforce the mandatory fields via validation.</li>"
        "<li>Successful submissions notify the user and clear the form so you can queue the next reversal.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Keep supporting evidence handy—the backend logs the user, timestamp, and payload for audit trails.</p>"
        "</div>"
    ),
    'viewreversal': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Reversal Audit Board</span>"
        "<p class='mb-2'>Review every approved reversal with filters for date, sales point, and reference.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>The tables separate sales and receipts so you can focus on the type of reversal you are investigating.</li>"
        "<li>Click View Details to open a modal showing item names, quantities, owner, payment method, bank notes, and status.</li>"
        "<li>Pagination controls let you scan long histories without exporting to Excel.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Run the receipt filter before closing a shift to ensure every reversed deposit has an attached note.</p>"
        "</div>"
    ),
    'sales': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>POS Terminal</span>"
        "<p class='mb-2'>Post retail sales per department with search-driven grids, restaurant tables, and payment capture.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Choose the Department/Sales point first; inventory lists load for that store and Restaurant unlocks table assignment plus reservation context.</li>"
        "<li>Use the search row or Add Item button to bring in stock items; each line shows type/group/balance and refuses quantities that exceed stock.</li>"
        "<li>Apply To toggles whether you collect room/cost center info, enforces minimum deposits, and exposes the payment/bank fields before posting.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Press Enter in the Search Item field to inject the item immediately and reselect the department anytime you need a clean slate.</p>"
        "</div>"
    ),
    'posreceipt': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>POS Deposit Receipts</span>"
        "<p class='mb-2'>Collect deposits for rooms or cost centers and print branded receipts tied to outstanding balances.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Apply To switches the datalist (rooms or cost centers) and the app runs <code>getposreceiptbalance</code> so you see what is still due.</li>"
        "<li>Amount Paid and Submit stay disabled until a positive balance returns, protecting you from receipting more than is allowed.</li>"
        "<li>The View tab filters by date and gives each receipt action buttons to preview or print the HTML/PDF version with guest/company and bank notes.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Fill the bank details block before choosing TRANSFER or POS so the printed receipt includes the audit trail automatically.</p>"
        "</div>"
    ),
    'salesreportpos': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>POS Sales Report</span>"
        "<p class='mb-2'>Audit POS batches by outlet, cashier, and date with drilldowns to item or folio detail.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Filters call <code>fetchsales</code> with sales point, staff, and date range so you can isolate a specific shift or outlet.</li>"
        "<li>Rows show reference, service charge, amount received, payment method, and owner (room/CC); the View button opens either the item modal or room ledger depending on the sale type.</li>"
        "<li>Print modal (<code>receiptsalesmodal</code>) renders your branding plus line items so exporting to PDF or paper takes one click.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: When the sale was charged to a room, use the green View button so you can verify it against the guest folio before approving a reversal.</p>"
        "</div>"
    ),
    'recipe': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Recipe Builder</span>"
        "<p class='mb-2'>Define composite menu items by linking base inventory ingredients to a finished SKU per sales point.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Select the Department/Sales point to load inventory; composite items populate the Item To Build dropdown while non-composite items feed the ingredient list.</li>"
        "<li>Add Item enforces unique selections, auto-fills type/unit data, and lets you capture exact quantities for each ingredient.</li>"
        "<li>Submit posts the selected composite ID plus every ingredient/qty pair to <code>builditemscript</code>, preventing blank grids or missing targets.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Launch Recipe from the View tab's Edit action to auto-load the existing BOM via sessionStorage.</p>"
        "</div>"
    ),
    'viewrecipe': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Recipe Catalog</span>"
        "<p class='mb-2'>Review every composite definition with cost/price summaries and drilldowns to the full ingredient list.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Submitting optional date filters runs <code>fetchcompositeitemscript</code> and groups entries by composite item.</li>"
        "<li>Each row previews the first three ingredients; the View action opens a modal with photo, cost/price, units, and the complete ingredient table.</li>"
        "<li>Edit pushes the composite ID into sessionStorage and routes you back to Recipe so you can tweak the BOM without retyping.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Use the modal to confirm pricing before publishing a composite to POS menus.</p>"
        "</div>"
    ),
    'build': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Production Build Sheet</span>"
        "<p class='mb-2'>Record kitchen or bar production runs by selecting composite SKUs and the quantity prepared.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Pick the sales point so the form loads composite items available at that outlet; the workspace stays hidden until data arrives.</li>"
        "<li>Each row captures the composite SKU and quantity to build; Add buttons let you enter multiple batches without duplicating SKUs.</li>"
        "<li>Submitting sends the build date, sales point, and every SKU/qty pair to <code>buildrecipes</code> so finished goods stock updates immediately.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Revisit View Build before logging a large run-the modal shows prior quantities so you can sanity-check your numbers.</p>"
        "</div>"
    ),
    'viewbuild': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Build History</span>"
        "<p class='mb-2'>Filter past production runs, inspect the items produced, and reuse the data if a build needs editing.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Filters call <code>fetchbuiltrecipes</code> and group entries per batch, showing sales point, composite name, and the first few components inline.</li>"
        "<li>View opens a modal with the product image, build date, and the complete ingredient list so costing teams see what was consumed.</li>"
        "<li>Edit writes the build/composite ID into sessionStorage and opens Recipe, making it easy to adjust the BOM.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Use the modal totals before approving an inventory adjustment-if component usage looks off, revisit the original build.</p>"
        "</div>"
    ),
    'diningtable': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Dining Table Registry</span>"
        "<p class='mb-2'>Define every table type/size so reservations, POS, and the host stand stay perfectly aligned.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Capture table type (Regular, Window-side, Outdoor, etc.), size (for two/four/six/eight), and the actual table number.</li>"
        "<li>Submissions immediately refresh the grid, keeping datalists that power reservations synced without a page reload.</li>"
        "<li>Edit uses SweetAlert confirmations and lets you adjust wiring when a table is renumbered or retired.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Keep your type labels descriptive-hosts see the exact text when assigning tables from the reservation screen.</p>"
        "</div>"
    ),
    'reservetable': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Reserve Dining Tables</span>"
        "<p class='mb-2'>Book tables, capture guest details, and verify availability before confirming the slot.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Reservation Date cannot be set in the past; choosing it mirrors the Entry Date so handoffs stay accurate.</li>"
        "<li>Table Number field uses the dining table datalist and triggers <code>tablestatus</code> which tells you if the table is FREE or already booked, revealing guest info when occupied.</li>"
        "<li>The grid lists upcoming reservations with action buttons that reverse a booking via the backend when plans change.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Always check the status field before saving-if it turns orange the table is already tied to another reservation for that timeline.</p>"
        "</div>"
    ),
    'managesupplier': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Supplier & Customer Registry</span>"
        "<p class='mb-2'>Maintain one directory of suppliers/customers, their contacts, and banking details for use across procurement and finance.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Select the type (SUPPLIER/CUSTOMER), capture company/contact info, address, nationality/state, and the activity level tag.</li>"
        "<li>Bank name and account number fields ensure payments and receipts have the metadata required for approval.</li>"
        "<li>The grid lists every entry so you can edit or delete, and datalists elsewhere (PO, payments, payables) update immediately after a save.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Use the activity level as a soft block-mark dormant vendors as NON-ACTIVE so buyers know to verify them first.</p>"
        "</div>"
    ),
    'purchaseorder': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Purchase Order Workspace</span>"
        "<p class='mb-2'>Build supplier orders with multiple inventory lines, automatic item info, and real-time totals.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Supplier field links to the Manage Supplier catalog so the correct ID is sent with every request.</li>"
        "<li>Line items pull from inventory, show item type/group/stock balance, and auto-calc the value when you enter cost and quantity.</li>"
        "<li>Submit calls <code>intakescript</code> (entrypoint PO) which stores the reference, description, items, and totals for later receipt matching.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: If you need to revise an order, open it from View Purchase Order-the batch loads back into this grid via sessionStorage.</p>"
        "</div>"
    ),
    'viewpurchaseorder': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Purchase Order Tracker</span>"
        "<p class='mb-2'>Filter stored POs by date, inspect the items, and reopen them for edits when necessary.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>The filter form calls <code>fetchintakes</code> with entrypoint PO and groups results by batch for clean totals.</li>"
        "<li>View opens a modal that shows supplier, transaction date/time, location, and a detailed line table with totals.</li>"
        "<li>Edit pushes the batch payload to sessionStorage and navigates you to the PO form to reuse or update the document.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Use the inline 'click to view the remaining items' link when a batch has more than three lines-it saves you from opening the modal unnecessarily.</p>"
        "</div>"
    ),
    'receivepurchases': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Receive Purchases</span>"
        "<p class='mb-2'>Convert supplier deliveries into stock and payables, linking them to invoices and payment details.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Capture supplier, invoice reference, amount paid, payment method (with bank details), transaction date, and destination store.</li>"
        "<li>Typing an invoice that matches a PO triggers <code>checkreferenceforreceivepurchase</code> which pre-fills items, costs, and quantities.</li>"
        "<li>The item grid enforces unique selections, displays on-hand balance for the destination, and updates the Total Order figure automatically.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Enter the invoice number first when receiving against a PO-the system will populate the line items and save you from manual entry.</p>"
        "</div>"
    ),
    'viewpurchases': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Received Purchase Ledger</span>"
        "<p class='mb-2'>Review every goods receipt, copy invoice numbers, and reopen batches for corrections.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Filter by date range, supplier, or invoice; submissions call <code>fetchintakes</code> (entrypoint RP) and group lines by batch.</li>"
        "<li>Each row shows number of items, supplier, location, totals, and the invoice reference-clicking it copies the number to your clipboard.</li>"
        "<li>View opens a modal with times, description, and the full item table; Edit stores the batch in sessionStorage for the Receive page.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Use the copy-to-clipboard badge whenever you need the invoice number in Payables or Payments.</p>"
        "</div>"
    ),
    'expenses': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Expense Journal</span>"
        "<p class='mb-2'>Record lump-sum expenses with GL-coded line items and payment metadata.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Paid To supports supplier lookups and stores the linked ID in a hidden field while still letting you add free-form recipients.</li>"
        "<li>The table lets you add multiple GL accounts, enter amounts, and see the running total in the summary box.</li>"
        "<li>Payment method and amount paid drive what bank fields appear, so audit trails include how the expense was settled.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Use separate GL lines for each cost category-the total still matches the payout but reporting stays clean.</p>"
        "</div>"
    ),
    'payment': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Supplier Payments</span>"
        "<p class='mb-2'>Pay down vendor balances and print a receipt showing what remains outstanding.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Select the supplier from the datalist; <code>handlesalesapplytopaymentbalance</code> fetches the payable balance and unlocks Submit only when money is owed.</li>"
        "<li>Capture amount paid, method, and optional notes-Transfer/POS methods reveal the bank detail block automatically.</li>"
        "<li>The View tab filters by start/end date and lists payments with action buttons to view or print the receipt for auditing.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Wait for the balance label to update before submitting-if it reads Nill the system will not let you post a payment.</p>"
        "</div>"
    ),
    'payables': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Supplier Statement</span>"
        "<p class='mb-2'>Run a detailed statement for one supplier across a date range, including balance brought forward.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Supplier field expects values like <code>ABC Supplies __42</code>; the script splits on <code>__</code> to send the correct ID.</li>"
        "<li>Submitting calls <code>getpayables</code> which returns B/F plus every debit (charges) and credit (payments) for the window.</li>"
        "<li>The table surfaces date, reference, description, debit, credit, and the running balance so reconciliations are straightforward.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Copy the outstanding balance into the Payment form when settling a vendor-it ensures you clear the whole statement.</p>"
        "</div>"
    ),
    'allpayables': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>All Payables Summary</span>"
        "<p class='mb-2'>See every supplier's total debits, credits, and current balance in one table.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>This page auto-runs <code>getpayables</code> without filters so you get a quick liabilities snapshot on load.</li>"
        "<li>Each row lists the company name, total debit, total credit, and balance (credit minus debit).</li>"
        "<li>Use the paginated view or browser search to focus on a single vendor when exporting the data.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Capture this summary before month-end close so finance can compare it to the GL control account.</p>"
        "</div>"
    ),
    'reversals': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Reverse Payment / Receipt</span>"
        "<p class='mb-2'>Request a reversal when a supplier payment or goods receipt was posted in error.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Reverse Payment form only needs the payment reference; the backend validates it before cancelling the ledger entry.</li>"
        "<li>Reverse Receive Purchases form targets intake references (entrypoint RP) so stock and payables are rolled back together.</li>"
        "<li>Each form uses its own validation class (<code>comp</code> vs <code>comp2</code>) so Submit stays disabled until a reference is supplied.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Look up the reference inside View Purchases or Payments first-these forms do not show a preview before reversing.</p>"
        "</div>"
    ),
    'viewreversals': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Reversal Logs</span>"
        "<p class='mb-2'>Audit reversed payments and reversed receipts separately with the same filter experience.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>The Payment tab calls <code>fetchreversedpayments</code>, showing sales point, item count, item previews, and the reversal reference.</li>"
        "<li>The Receive Purchases tab runs <code>fetchreversedreceivepurchases</code> so you can confirm stock rollbacks.</li>"
        "<li>Each table mirrors the original transaction layout, making it easy to trace why a reversal happened.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Run the relevant tab immediately after submitting a reversal to confirm it landed-if you do not see it, the reference likely failed validation.</p>"
        "</div>"
    ),
    'roomcategories': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Room Category Builder</span>"
        "<p class='mb-2'>Set up the rate-bearing categories front office and housekeeping depend on.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Enter the category name, type (Guest Room, Hall, Suite, etc.), rate code, currency, and minimum deposit/price tiers.</li>"
        "<li>Rate code options load from the Rate Code module so pricing stays consistent across the platform.</li>"
        "<li>Saves refresh the table instantly, letting you edit or delete categories before they are used elsewhere.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Update the minimum deposit whenever Revenue changes policy-front desk deposit forms pull the value directly from here.</p>"
        "</div>"
    ),
    'addroom': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Room Inventory</span>"
        "<p class='mb-2'>Create or edit rooms with rich metadata and photos so every downstream module references the same details.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Capture room name, number, building, floor, and category; category dropdown reads from Room Categories to enforce valid pairings.</li>"
        "<li>Upload up to two photos (previewed with a 200kb limit) so marketing, reservations, and housekeeping know what the room looks like.</li>"
        "<li>Description field flows to assignments and room status cards, giving supervisors extra context.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Keep room numbers identical to PMS signage-the datalists used by reservations and housekeeping are literal.</p>"
        "</div>"
    ),
    'updateroomstatus': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Room Status Shortcut</span>"
        "<p class='mb-2'>This navigation entry is reserved for a future quick-update board; the current template is empty.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>The router points to <code>updateroomstatus.php</code>, which ships as a 0-byte placeholder in this build.</li>"
        "<li>No scripts or forms load yet, so the workspace will appear blank when you click it.</li>"
        "<li>Use the Room Status board or housekeeping screens to update statuses until this fast-update feature is released.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Watch the release notes-once this page is implemented the tooltip will describe the new workflow.</p>"
        "</div>"
    ),
    'dailyassignmentsheet': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Daily Assignment Sheet</span>"
        "<p class='mb-2'>Create shift-by-shift housekeeping assignments for every room with status tracking.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li><code>fetchRoomsList</code> builds a card per room containing shift, time in/out, and status before/after service fields.</li>"
        "<li>Supervisors can scroll the catalog and fill in the required data so the day's assignments are captured in one submission.</li>"
        "<li>Although the submit handler is lightweight today, the structure matches the reporting modules that read these values.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Enter at least the shift and status fields for every room-even &quot;No Service&quot; entries help the Viewer screen stay accurate.</p>"
        "</div>"
    ),
    'viewdailyassignmentsheet': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Assignment Sheet Viewer</span>"
        "<p class='mb-2'>Filter previously logged assignments by shift, staff, or time range and inspect the details.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>The filter form collects shift, staff (from the user datalist), and Time In range before loading entries.</li>"
        "<li>Results show guest name, number of persons, room, arrival/departure, times, and any items used.</li>"
        "<li>View action pops a modal with detailed fields (lost-and-found, requests, statuses) plus an item table for consumables.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Run this report at shift change to confirm requests and lost-and-found items were recorded properly.</p>"
        "</div>"
    ),
    'createchecklistforcleaning': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Cleaning Checklist Library</span>"
        "<p class='mb-2'>Define the reusable checklist items housekeeping must complete for each room type.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Enter the checklist item description and tag it to a room type (Guest Room, Bathroom, Others).</li>"
        "<li>Saved items feed the toggles on the Room Cleaning Checklist page, ensuring staff check the right boxes.</li>"
        "<li>The list view lets you edit or delete items as procedures change.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Keep bathroom-specific tasks separate so they can be assigned to deep-cleaning teams independently.</p>"
        "</div>"
    ),
    'roomcleaningchecklist': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Room Cleaning Checklist</span>"
        "<p class='mb-2'>Log actual cleaning sessions, toggle checklist items, and review historical records.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Update tab captures supervisor, room number, entry date, shift, and renders every checklist item as a Yes/No toggle.</li>"
        "<li>Saving posts item statuses, while the table view lists past sessions with supervisor, room, entry date, and shift.</li>"
        "<li>View opens a modal that lists supervisor, room, entry date, shift, and the full item table with a Save button for follow-up edits.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Revisit the modal whenever an inspection fails-unchecked items stay highlighted so coaching is easy.</p>"
        "</div>"
    ),
    'lostfoundregister': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Lost & Found Register</span>"
        "<p class='mb-2'>Log items discovered in rooms, track who found/collected them, and keep a searchable archive.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>The form records room number, item, description, finder, timestamps, collector details, and addresses.</li>"
        "<li>Tabs let you switch between View and Update; the view grid lists every record with edit/delete actions.</li>"
        "<li>Datalists ensure rooms and staff entries match valid values, preventing typos in this compliance-sensitive log.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Always fill the collector address-when guests sign it becomes the official release receipt.</p>"
        "</div>"
    ),
    'maintenancerequest': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Maintenance Request</span>"
        "<p class='mb-2'>Capture complaints as they come in, assign them to staff, and record completion details.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Fields include room number, lodge date, nature of complaint, assigned-to staff, completion date, and reported by.</li>"
        "<li>Datalists on room and staff ensure you only assign valid resources.</li>"
        "<li>The (optional) table can display existing requests so you edit or verify prior work before logging a new ticket.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Enter a completion date as soon as engineering reports back-open-ended tickets clog the work order pipeline.</p>"
        "</div>"
    ),
    'viewmaintenancerequest': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Maintenance Request Viewer</span>"
        "<p class='mb-2'>Filter logged maintenance cases by reporter and timeframe.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Form lets you pick the reporting staff plus start/end date to narrow the dataset.</li>"
        "<li>Results show room, complaint, lodge time, assignee, reporter, and completion time for quick follow-up.</li>"
        "<li>Action buttons (once wired) can feed Work Orders or open the original request.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Use this screen before approving overtime-if a room has repeated issues, you will see them listed back-to-back.</p>"
        "</div>"
    ),
    'workorder': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Work Order</span>"
        "<p class='mb-2'>Escalate maintenance needs into formal work orders with department routing and status tracking.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Capture department, entry date, requester (auto-filled to the logged-in user), work needed description, and date needed.</li>"
        "<li>Optional fields track room number, work status, and status description so follow-ups have context.</li>"
        "<li>The table lists every work order with requested by, department, dates, and status, giving supervisors a live queue.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Use descriptive status text like &quot;awaiting part&quot; or &quot;in progress&quot; so the table instantly communicates blockers.</p>"
        "</div>"
    ),
    'addglaccount': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Add GL Account</span>"
        "<p class='mb-2'>Create or retrieve GL accounts so transactions can be posted to the right buckets.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Click Retrieve Account to look up an existing account number; otherwise leave it blank to auto-generate on save.</li>"
        "<li>Group name, account type, and description are required and map directly into reports and dropdowns elsewhere.</li>"
        "<li>The Delete button appears when editing an existing account, letting you retire it when it is no longer needed.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Keep descriptions short but specific-report filters display this text verbatim.</p>"
        "</div>"
    ),
    'viewglaccount': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>View GL Accounts</span>"
        "<p class='mb-2'>Search, print, or export GL accounts grouped by account type.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Use the account type datalist to narrow the list before printing or exporting to Excel.</li>"
        "<li>The table shows account number, description, account type, and group name so you can audit mappings.</li>"
        "<li>Action column is reserved for future edit links and currently mirrors the Add screen.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Uppercase filters ensure consistent matches-type &quot;EXPENSE&quot; rather than mixed case.</p>"
        "</div>"
    ),
    'addgltransaction': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>GL Transaction Entry</span>"
        "<p class='mb-2'>Post manual journals with multiple debit and credit lines that must balance before submission.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Start with transaction date and description, then use the Credit and Debit sections to add as many GL lines as needed.</li>"
        "<li>Each account field is backed by the GL datalist so you cannot mistype account numbers, and running totals display at the bottom.</li>"
        "<li>Reset clears the grids, while Submit validates that total debit equals total credit before calling the API.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Enter all credit lines first; seeing the total helps you match the combined debit amount without mental math.</p>"
        "</div>"
    ),
    'gltransactionhistory': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>GL Transaction History</span>"
        "<p class='mb-2'>Filter posted GL batches by account number and date to investigate activity.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Select an account from the datalist and provide start/end dates before running the report.</li>"
        "<li>The table lists account number/name, credit/debit totals, description, payment method, and reference for each batch.</li>"
        "<li>Use the data when reconciling control accounts or answering auditor questions.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Combine this report with the Trial Balance-if a control account looks off, run the history for the same period.</p>"
        "</div>"
    ),
    'trialbalance': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Trial Balance</span>"
        "<p class='mb-2'>Summarize debit and credit totals as of a specific reporting date.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Pick the snapshot date and submit; the backend rolls up every GL balance up to that point.</li>"
        "<li>Table displays item descriptions with separate debit and credit columns so you can ensure they match.</li>"
        "<li>Use it as the first check before generating financial statements.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: If debits and credits do not match, revisit recent manual journals-the imbalance is usually a one-sided entry.</p>"
        "</div>"
    ),
    'incomestatement': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Income Statement</span>"
        "<p class='mb-2'>Generate a P&L for any date range, pulling revenue, cost of sales, and expenses.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Provide start and end dates; the report sums all GLs tagged as income or expense between those dates.</li>"
        "<li>Results show each item with debit/credit totals so you can see how the period performed.</li>"
        "<li>Print/export using your browser to share the snapshot with management.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Align your date range with revenue reports (e.g., monthly) to make cross-checking easier.</p>"
        "</div>"
    ),
    'balancesheet': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Balance Sheet</span>"
        "<p class='mb-2'>See assets, liabilities, and equity balances as of a given date.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Enter the reporting date and submit; the system aggregates GL balances into the classic balance sheet sections.</li>"
        "<li>Debits represent assets while credits represent liabilities/equity, helping you confirm the equation balances.</li>"
        "<li>Useful for banker packages or owner updates alongside the Income Statement.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Run this on the same date as the Trial Balance to ensure totals match before distributing.</p>"
        "</div>"
    ),
    'generalaccountreport': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>General Account Report</span>"
        "<p class='mb-2'>Cross-module revenue report grouped by category (Bookings, F&B, Sundry) with ready-to-go exports.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>Select a date range and a category to pull matching transactions with amounts, consumption, service charge, VAT, and totals.</li>"
        "<li>Print, PDF, and Excel buttons sit directly above the table, so you can share the filtered report instantly.</li>"
        "<li>Sales point and description columns help you trace each row back to its originating module if questions arise.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Export each category separately when preparing departmental revenue summaries-the totals already include VAT and service charge.</p>"
        "</div>"
    ),
    'viewproductpurchase': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Products (View)</span>"
        "<p class='mb-2'>This navigation item is a placeholder-the router does not load a template for it yet.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li>The ID exists in <code>index.php</code>, but no PHP template or router entry has been provided, so the workspace stays blank.</li>"
        "<li>Until the Products module ships, use Inventory &gt; View Inventory or Purchases &gt; View Purchases to review stock items.</li>"
        "<li>The nav group remains hidden by default to avoid confusing users with an empty page.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Once engineering delivers the module, update this tooltip to describe the real workflow.</p>"
        "</div>"
    ),
    'addproducts': (
        "<div class='text-[13px] leading-relaxed text-slate-700'>"
        "<span class='font-semibold text-primary-g text-sm block mb-1'>Products (Add)</span>"
        "<p class='mb-2'>Reserved link for a future product creation form; no template or script is wired up today.</p>"
        "<ul class='list-disc ml-4 text-[12px] space-y-1'>"
        "<li><code>routerTree</code> has no entry for <code>addproducts</code> and the project lacks an <code>addproducts.php</code> template.</li>"
        "<li>The navigation group stays hidden, so clicking it does nothing until the feature is implemented.</li>"
        "<li>Use Inventory &gt; Create/Update Inventory to add items until this shortcut becomes available.</li>"
        "</ul>"
        "<p class='mt-2 text-[11px] text-slate-500'>Tip: Keep a backlog of requirements-when the screen ships you can populate the guide with the actual flow.</p>"
        "</div>"
    ),


}


def main():
    path = Path('index.php')
    text = path.read_text(encoding='utf-8', newline='')
    for nav_id, html in replacements.items():
        marker = f'id="{nav_id}"'
        marker_index = text.find(marker)
        if marker_index == -1:
            raise RuntimeError(f'Could not find nav item with id="{nav_id}"')
        title_key = 'title="'
        tag_start = text.rfind('<', 0, marker_index)
        title_index = text.rfind(title_key, tag_start, marker_index)
        if title_index != -1:
            value_start = title_index + len(title_key)
            segment = text[value_start:marker_index]
            closing_offset = segment.find('"')
            if closing_offset == -1:
                raise RuntimeError(f'Could not locate the closing quote for id="{nav_id}"')
            value_end = value_start + closing_offset
            text = text[:value_start] + html + text[value_end:]
        else:
            insertion = f'title="{html}" '
            text = text[:marker_index] + insertion + text[marker_index:]
    path.write_text(text, encoding='utf-8', newline='')


if __name__ == '__main__':
    main()
