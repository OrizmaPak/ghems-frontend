async function printregistrationcardActive() {
    const form = document.querySelector('#filterprintregistrationcardform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', generateReservationsList)
    
    datasource = []
    await fetchOrgData()
    await generateReservationsList()
}

async function fetchOrgData(id) {
    let request = await httpRequest2('../controllers/fetchorganisationscript', null, null, 'json')
    if(request.status) {
        orgInformation = request.data.data[0]
        console.log(orgInformation)
    }
}

async function generateReservationsList() {
    let paramstr = new FormData(document.querySelector('#filterprintregistrationcardform'))
    let request = await httpRequest2('../controllers/registrationcardprinting.php', paramstr, document.querySelector('#filterprintregistrationcardform #submit'), 'json')
    if(request.status) {
        if(request.data.length) {
            datasource = request.data
            resolvePagination(datasource, onprintregistrationcardTableDataSignal)
        }
    }
    else return notification('No records retrieved')
}

// <table>
//     <tbody>
//         <tr>
//             <td>${item.roomgeustrow[].firstname} ${item.guests.lastname} ${item.guests.othernames}</td>
//         </tr>
//     </tbody>
// </table>
async function onprintregistrationcardTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    ${item.roomgeustrow[0]?.guest1.length > 0 ?`<tr>
        <td class="runCount()">${index + 1 }</td>
        <td>${item.roomgeustrow[0]?.guest1[0]?.firstname} ${item.roomgeustrow[0]?.guest1[0]?.othernames == '-' ? '' : item.roomgeustrow[0]?.guest1[0]?.othernames} ${item.roomgeustrow[0]?.guest1[0]?.lastname}</td>
        <td>${item.roomgeustrow[0]?.roomdata.roomnumber}</td>
        <td>${item.roomgeustrow[0]?.guest1[0]?.nationality == '-' ? '' : item.roomgeustrow[0]?.guest1[0]?.nationality }</td>
        <td>${formatNumber(item.reservations.numberofnights)}</td>
        <td>${item.roomgeustrow[0]?.roomdata.adult ?? 0} Adult &nbsp;&nbsp;${item.roomgeustrow[0]?.roomdata.child ?? 0} Child&nbsp;&nbsp;${item.roomgeustrow[0]?.roomdata.infant ?? 0}&nbsp;&nbsp;Infant(s)</td>
        <td>${item.roomgeustrow[0]?.roomdata.roomcategoryname == '-' || item.roomgeustrow[0]?.roomdata.roomcategoryname == null ? '' : item.roomgeustrow[0]?.roomdata.roomcategoryname}</td>
        <td>${formatDate(item.reservations.arrivaldate)}</td>
        <td>${formatDate(item.reservations.departuredate)}</td>
        <td>${formatDate(item.reservations.reservationdate)}</td>
        <td class="flex items-center gap-3">
            ${reservationTableActionButtons(item.reservations.id)}
        </td>
    </tr>` : ''}
     ${item.roomgeustrow[0]?.guest2.length > 0 ? `<tr>
        <td class="runCount()">${index + 1 }</td>
        <td>${item.roomgeustrow[0]?.guest2[0]?.firstname} ${item.roomgeustrow[0]?.guest2[0]?.othernames == '-' ? '' : item.roomgeustrow[0]?.guest2[0]?.othernames} ${item.roomgeustrow[0]?.guest2[0]?.lastname}</td>
        <td>${item.roomgeustrow[0]?.roomdata.roomnumber}</td>
        <td>${item.roomgeustrow[0]?.guest2[0]?.nationality == '-' ? '' : item.roomgeustrow[0]?.guest2[0]?.nationality }</td>
        <td>${formatNumber(item.reservations.numberofnights)}</td>
        <td>${item.roomgeustrow[0]?.roomdata.adult ?? 0} Adult &nbsp;&nbsp;${item.roomgeustrow[0]?.roomdata.child ?? 0} Child&nbsp;&nbsp;${item.roomgeustrow[0]?.roomdata.infant ?? 0}&nbsp;&nbsp;Infant(s)</td>
        <td>${item.roomgeustrow[0]?.roomdata.roomcategoryname == '-' || item.roomgeustrow[0]?.roomdata.roomcategoryname == null ? '' : item.roomgeustrow[0]?.roomdata.roomcategoryname}</td>
        <td>${formatDate(item.reservations.arrivaldate)}</td>
        <td>${formatDate(item.reservations.departuredate)}</td>
        <td>${formatDate(item.reservations.reservationdate)}</td>
        <td class="flex items-center gap-3">
            ${reservationTableActionButtons(item.reservations.id)}
        </td>
    </tr>`:''}
     ${item.roomgeustrow[0]?.guest3.length > 0 ? `
     <tr>
        <td class="runCount()">${index + 1 }</td>
        <td>${item.roomgeustrow[0]?.guest3[0]?.firstname} ${item.roomgeustrow[0]?.guest3[0]?.othernames == '-' ? '' : item.roomgeustrow[0]?.guest3[0]?.othernames} ${item.roomgeustrow[0]?.guest3[0]?.lastname}</td>
        <td>${item.roomgeustrow[0]?.roomdata.roomnumber}</td>
        <td>${item.roomgeustrow[0]?.guest3[0]?.nationality == '-' ? '' : item.roomgeustrow[0]?.guest3[0]?.nationality }</td>
        <td>${formatNumber(item.reservations.numberofnights)}</td>
        <td>${item.roomgeustrow[0]?.roomdata.adult ?? 0} Adult &nbsp;&nbsp;${item.roomgeustrow[0]?.roomdata.child ?? 0} Child&nbsp;&nbsp;${item.roomgeustrow[0]?.roomdata.infant ?? 0}&nbsp;&nbsp;Infant(s)</td>
        <td>${item.roomgeustrow[0]?.roomdata.roomcategoryname == '-' || item.roomgeustrow[0]?.roomdata.roomcategoryname == null ? '' : item.roomgeustrow[0]?.roomdata.roomcategoryname}</td>
        <td>${formatDate(item.reservations.arrivaldate)}</td>
        <td>${formatDate(item.reservations.departuredate)}</td>
        <td>${formatDate(item.reservations.reservationdate)}</td>
        <td class="flex items-center gap-3">
            ${reservationTableActionButtons(item.reservations.id)}
        </td>
    </tr>` : ''}
      ${item.roomgeustrow[0]?.guest4.length > 0 ? `<tr>
        <td class="runCount()">${index + 1 }</td>
        <td>${item.roomgeustrow[0]?.guest4[0]?.firstname} ${item.roomgeustrow[0]?.guest4[0]?.othernames == '-' ? '' : item.roomgeustrow[0]?.guest4[0]?.othernames} ${item.roomgeustrow[0]?.guest4[0]?.lastname}</td>
        <td>${item.roomgeustrow[0]?.roomdata.roomnumber}</td>
        <td>${item.roomgeustrow[0]?.guest4[0]?.nationality == '-' ? '' : item.roomgeustrow[0]?.guest4[0]?.nationality }</td>
        <td>${formatNumber(item.reservations.numberofnights)}</td>
        <td>${item.roomgeustrow[0]?.roomdata.adult ?? 0} Adult &nbsp;&nbsp;${item.roomgeustrow[0]?.roomdata.child ?? 0} Child&nbsp;&nbsp;${item.roomgeustrow[0]?.roomdata.infant ?? 0}&nbsp;&nbsp;Infant(s)</td>
        <td>${item.roomgeustrow[0]?.roomdata.roomcategoryname == '-' || item.roomgeustrow[0]?.roomdata.roomcategoryname == null ? '' : item.roomgeustrow[0]?.roomdata.roomcategoryname}</td>
        <td>${formatDate(item.reservations.arrivaldate)}</td>
        <td>${formatDate(item.reservations.departuredate)}</td>
        <td>${formatDate(item.reservations.reservationdate)}</td>
        <td class="flex items-center gap-3">
            ${reservationTableActionButtons(item.reservations.id)}
        </td>
    </tr>` : ''}
    
    `
    )
    .join('')
    injectPaginatatedTable(rows)
}

function reservationTableActionButtons(reservationId) {
    return `
        <div class="flex flex-col gap-1 w-[190px]">
            <button type="button" title="Print Guest Registration Card" onclick="printRegistrationCardItem('${reservationId}')" class="rounded-md bg-green-700 text-white px-2 py-1 text-[11px] font-semibold flex items-center justify-center gap-1 leading-tight">
                <span class="material-symbols-outlined text-[14px]">print</span>
                <span>Guest Registration Card</span>
            </button>
            <button type="button" title="Print Reservation Confirmation" onclick="printReservationConfirmationItem('${reservationId}')" class="rounded-md bg-blue-700 text-white px-2 py-1 text-[11px] font-semibold flex items-center justify-center gap-1 leading-tight">
                <span class="material-symbols-outlined text-[14px]">print</span>
                <span>Reservation Confirmation</span>
            </button>
        </div>
    `
}

function printRegistrationCardItem(id) {
    const selectedItem = datasource.find(item => item.reservations.id == id)
    if(selectedItem) stageCardPrint(selectedItem)
}

function printReservationConfirmationItem(id) {
    const selectedItem = datasource.find(item => item.reservations.id == id)
    if(selectedItem) stageReservationConfirmationPrint(selectedItem)
}

const gravityHotelAddress = '5002B, Action Commercial Area, Ikenegbu Layout, Imo State, Nigeria'
const gravityHotelEmail = 'acehospitalityng@gmail.com'
const gravityHotelWebsite = 'www.acehospitality.com/gravityhotelowerri'
const gravityHotelPhone = '+234 (0) 90 9040001-7'

function stageCardPrint(item) {
    const logoFromSettings = orgInformation?.logo && orgInformation.logo !== '-' ? `../images/${orgInformation.logo}` : ''
    const logoFromGlobal = did('your_companylogo')?.value ? `../images/${did('your_companylogo').value}` : ''
    const logoPath = logoFromSettings || logoFromGlobal

    const html = `
    <div class="bg-white !text-black relative">
        <div class="mb-4 w-full border-b pb-3">
            <div class="flex items-center justify-start gap-4 w-full">
                ${logoPath ? `<img src="${logoPath}" alt="Hotel logo" class="w-20 h-20 object-contain shrink-0">` : ''}
                <div class="text-left flex-1">
                    <h1 class="text-2xl font-bold uppercase">${orgInformation.companyname}</h1>
                    <p class="text-sm capitalize">${gravityHotelAddress}</p>
                    <p class="text-sm">Phone: ${orgInformation.mobile} Tel: ${orgInformation.telephone}</p>
                </div>
            </div>
        </div>

        <div>
            <h2 class="text-lg font-semibold text-center">GUEST REGISTRATION CARD</h2>
            <div class="grid grid-cols-2 gap-4 mt-4 border-t py-3 text-xs">
                <div><strong>Ref.No : </strong>${item.reservations.reference}</div>
                <div><strong>Room No :</strong> ${item.roomgeustrow[0]?.roomdata.roomnumber}</div>
            </div>
        </div>

        <div class="grid grid-cols-2 divide-x border border-gray-300 ">
            <div>
                <h3 class="text-sm font-semibold py-2 text-center border-b">Guest Information</h3>
                <table class="w-full border-collapse border-0 border-gray-300 text-xs">
                    <tbody>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Guest</td>
                            <td style="height: 0;overflow:hidden;" class="p-2 capitalize">${item.roomgeustrow[0]?.guest1[0]?.firstname} ${item.roomgeustrow[0]?.guest1[0]?.othernames == '-' ? '' : item.roomgeustrow[0]?.guest1[0]?.othernames} ${item.roomgeustrow[0]?.guest1[0]?.lastname}</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Company</td>
                            <td class="p-2 capitalize">${item.roomgeustrow[0]?.guest1[0]?.companyname == '-' ? '' : item.roomgeustrow[0]?.guest1[0]?.companyname }</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Res. Address</td>
                            <td class="p-2 capitalize">${item.roomgeustrow[0]?.guest1[0]?.residentialaddress == '-' ? '' : item.roomgeustrow[0]?.guest1[0]?.residentialaddress }</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">City</td>
                            <td class="p-2 capitalize">${item.roomgeustrow[0]?.guest1[0]?.city == '-' ? '' : item.roomgeustrow[0]?.guest1[0]?.city }</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Nationality</td>
                             <td class="p-2 capitalize">${item.roomgeustrow[0]?.guest1[0]?.nationality == '-' ? '' : item.roomgeustrow[0]?.guest1[0]?.nationality }</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Date of Birth</td>
                            <td class="p-2">${new Date(item.roomgeustrow[0]?.guest1[0]?.birthdate == '-' ? '' : item.roomgeustrow[0]?.guest1[0]?.birthdate).toLocaleDateString()}</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Mobile No</td>
                            <td class="p-2 capitalize">${item.roomgeustrow[0]?.guest1[0]?.phone == '-' ? '' : item.roomgeustrow[0]?.guest1[0]?.phone }</td>
                        </tr>
                        <tr>
                            <td class="p-2 font-semibold">Email</td>
                            <td class="p-2 capitalize"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <h3 class="text-sm font-semibold py-2 text-center  border-b">Passport Details</h3>
                <table class="w-full border-collapse border-0 border-gray-300 text-xs">
                    <tbody>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Passport ID</td>
                            <td class="p-2 capitalize">${item.roomgeustrow[0]?.guest1[0]?.passportnumber == '-' ? '' : item.roomgeustrow[0]?.guest1[0]?.passportnumber }</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Place of Issue</td>
                            <td class="p-2 capitalize">${item.roomgeustrow[0]?.guest1[0]?.passportplaceofissue == '-' ? '' : item.roomgeustrow[0]?.guest1[0]?.passportplaceofissue }</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Date of Issue</td>
                            <td class="p-2">${new Date(item.roomgeustrow[0]?.guest1[0]?.issuedateofpassport == '-' ? '' : item.roomgeustrow[0]?.guest1[0]?.issuedateofpassport).toLocaleDateString() }</td>
                        </tr>
                        <tr>
                            <td class="p-2 font-semibold">Date of Expiry</td>
                            <td class="p-2">${ new Date(item.roomgeustrow[0]?.guest1[0]?.expiredateofpassport == '-' ? '' : item.roomgeustrow[0]?.guest1[0]?.expiredateofpassport).toLocaleDateString() }</td>
                        </tr>
                    </tbody>
                </table>
 
                <h3 class="text-sm font-semibold py-2 text-center  border-b border-t">Visa / Residential Permit</h3>
                <table class="w-full mb-8 border-collapse border-0 border-gray-300 text-xs">
                    <tbody>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Visa Type / Visa No</td>
                            <td class="p-2">${item.roomgeustrow[0]?.guest1[0]?.visanumber == '-' ? '' : item.roomgeustrow[0]?.guest1[0]?.visanumber }</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Place of Issue</td>
                            <td class="p-2">${item.roomgeustrow[0]?.guest1[0]?.visaplaceofissue == '-' ? '' : item.roomgeustrow[0]?.guest1[0]?.visaplaceofissue }</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Date of Issue</td>
                            <td class="p-2">${new Date(item.roomgeustrow[0]?.guest1[0]?.issuedateofvisa == '-' ? '' : item.roomgeustrow[0]?.guest1[0]?.issuedateofvisa).toLocaleDateString() }</td>
                        </tr>
                        <tr>
                            <td class="p-2 font-semibold">Date of Expiry</td>
                            <td class="p-2">${new Date(item.roomgeustrow[0]?.guest1[0]?.expiredateofvisa == '-' ? '' : item.roomgeustrow[0]?.guest1[0]?.expiredateofvisa).toLocaleDateString() }</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <h3 class="text-sm font-semibold py-2 text-center">Reservation / Check-In Information</h3>
        <div class="grid grid-cols-2 border divide-x border border-gray-300 ">
            <div>
                <table class="w-full  border-collapse border-0 border-gray-300 text-xs">
                    <tbody>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Arrival Date & Time</td>
                            <td class="p-2">${new Date(item.reservations.arrivaldate == '-' ? '' : item.reservations.arrivaldate).toLocaleString() }</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Departure Date & Time</td>
                            <td class="p-2">${new Date(item.reservations.departuredate == '-' ? '' : item.reservations.departuredate).toLocaleString() }</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Room Type</td>
                            <td class="p-2">${item.roomgeustrow[0]?.roomdata.roomcategoryname == '-' || item.roomgeustrow[0]?.roomdata.roomcategoryname == null ? '' : item.roomgeustrow[0]?.roomdata.roomcategoryname}</td>
                        </tr>
                        <tr>
                            <td class="p-2 font-semibold">Room No</td>
                            <td class="p-2">${item.roomgeustrow[0]?.roomdata.roomnumber}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <table class="w-full  border-collapse border-0 border-gray-300 text-xs">
                    <tbody>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Pax</td>
                            <td class="p-2">${item.roomgeustrow[0]?.roomdata.adult ?? 0} Adult &nbsp;&nbsp;${item.roomgeustrow[0]?.roomdata.child ?? 0} Child&nbsp;&nbsp;${item.roomgeustrow[0]?.roomdata.infant ?? 0}&nbsp;&nbsp;Infant(s)</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Plan</td>
                            <td class="p-2">${ formatCurrency(item.roomgeustrow[0]?.roomdata.planamount ?? '')}</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2">Tariff</td>
                            <td class="p-2">${formatCurrency(0)}</td>
                        </tr>
                        <tr>
                            <td class="p-2 font-semibold">Extra Person</td>
                            <td class="p-2">${formatCurrency(0)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <h3 class="text-sm font-semibold py-2 text-center">Instructions</h3>
        <div class="grid grid-cols-2 border divide-x border border-gray-300 ">
            <div>
                <table class="w-full  border-collapse border-0 border-gray-300 text-xs">
                    <tbody>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Checkin instructions</td>
                            <td class="p-2">${item.reservations.checkininstructions ?? ''}</td>
                        </tr>
                        <tr>
                            <td class="p-2 font-semibold">Checkout instructions</td>
                            <td class="p-2">${item.reservations.checkoutinstructions ?? ''}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <table class="w-full  border-collapse border-0 border-gray-300 text-xs">
                    <tbody>
                        <tr>
                            <td class="p-2 font-semibold">Conditions</td>
                            <td class="p-2">funds cannot be refunded after 24hours of confirmation</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="mt-4 border border-red-600 p-2 text-center text-xs font-bold uppercase text-red-600">
            Funds cannot be refunded after 24 hours of confirmation.
        </div>

        <div class="fixed bottom-0 left-0 w-full px-5"> 
            <p class="mb-8"></p>

            <div class="grid grid-cols-3 gap-4 text-xs">
                <div>
                    <p class="font-semibold">Duty Manager</p>
                    <p class="mt-6 border-t border-gray-300"></p>
                </div>
                <div>
                    <p class="font-semibold">FOA's Signature</p>
                    <p class="mt-6 border-t border-gray-300"></p>
                </div>
                <div>
                    <p class="font-semibold">Guest Signature</p>
                    <p class="mt-6 border-t border-gray-300"></p>
                </div>
            </div>

            <div class="text-center mt-4 text-xs">
                <p>TRN No: ${new Date().getTime()}</p>
            </div>
        </div>
    </div>
    `
    printRegistrationCard(html)
}

function stageReservationConfirmationPrint(item) {
    const guest = item.roomgeustrow[0]?.guest1?.[0] || {}
    const logoFromSettings = orgInformation?.logo && orgInformation.logo !== '-' ? `../images/${orgInformation.logo}` : ''
    const logoFromGlobal = did('your_companylogo')?.value ? `../images/${did('your_companylogo').value}` : ''
    const logoPath = logoFromSettings || logoFromGlobal
    const guestNameRaw = `${guest.firstname || ''} ${guest.othernames && guest.othernames !== '-' ? guest.othernames : ''} ${guest.lastname || ''}`.replace(/\s+/g, ' ').trim()
    const guestName = guestNameRaw || 'Guest'
    const nationality = guest.nationality && guest.nationality !== '-' ? guest.nationality : ''
    const reference = item.reservations.reference || item.reservations.id || ''
    const roomType = item.roomgeustrow[0]?.roomdata?.roomcategoryname || ''
    const roomRate = Number(item.roomgeustrow[0]?.roomdata?.roomrate || 0)
    const nights = Number(item.reservations.numberofnights || 0)

    const html = `
    <div class="bg-white !text-black p-8 text-[14px] leading-relaxed">
        <div class="text-center mb-6">
            ${logoPath ? `<img src="${logoPath}" alt="Gravity Hotel logo" class="w-24 h-24 object-contain mx-auto mb-2">` : ''}
            <div class="text-2xl font-bold uppercase">GRAVITY HOTELS</div>
            <div class="text-xl font-bold uppercase mt-2">RESERVATION CONFIRMATION</div>
        </div>

        <p class="mb-4"><strong>Date:</strong> ${formatReservationConfirmationDateTime(new Date())}</p>

        <p><strong>Guest:</strong></p>
        <p class="uppercase">${guestName}</p>
        <p class="uppercase mb-4">${nationality}</p>

        <p class="mb-4">Dear ${guestName},</p>

        <p class="mb-4">Thank you for your request for a reservation at the GRAVITY HOTEL OWERRI. We are pleased to confirm your booking with confirmation number ${reference} under the following terms:</p>

        <div class="mb-4">
            <p><strong>Guest Name:</strong> ${guestName}</p>
            <p><strong>Arrival Date:</strong> ${formatReservationConfirmationDate(item.reservations.arrivaldate)}</p>
            <p><strong>Departure Date:</strong> ${formatReservationConfirmationDate(item.reservations.departuredate)}</p>
            <p><strong>No. of Nights:</strong> ${nights}</p>
            <p><strong>No. of Rooms/Room Type:</strong> 1 x ${roomType}</p>
            <p><strong>Rate payable per room per night:</strong> ${formatNumber(roomRate.toFixed ? roomRate : Number(roomRate))}.00 NGN</p>
        </div>

        <p class="mb-4">Please note that the above rate is inclusive of a Complimentary Breakfast, 10% Service charge, Consumption tax and 7.5% VAT.</p>

        <p class="mb-4">All rooms are furnished with TV, In-room safe, minibar, telephone, internet access, individual adjustable air condition system as well as shower, bathtub and WC.</p>

        <p class="mb-4">Our check-in time is 14:00 hours on date of arrival. A deposit is required 24 hours prior to check-in.<br>
        Check out time is 11:00 hours. Checkout after 12:00PM hours attracts 50% extra charge of your room rate till 16:00 hours and 100% after 18:00 hours.</p>

        <p class="mb-1"><strong>Refund Policy:</strong></p>
        <p class="mb-4">Reservation cancellation must be made 24 - 48 hours before check-in dates to qualify for a refund. Refund payment attracts 15% processing fee and taxes. Refund may take up to 72 hours.</p>

        <p class="mb-4">Should you require any further information or assistance please do not hesitate to contact us.</p>

        <p class="mb-4">We look forward to the pleasure of welcoming you as our guest at the GRAVITY HOTEL OWERRI.</p>

        <p class="mb-4">With kind regards,<br>
        Precious Onuoha<br>
        GRAVITY HOTEL OWERRI</p>

        <p class="mb-0"><strong>Address & Contact:</strong></p>
        <p class="mb-0">${gravityHotelAddress}</p>
        <p class="mb-4">Email: ${gravityHotelEmail}</p>

        <p class="mb-0">Website: ${gravityHotelWebsite}</p>
        <p class="mb-0">Tel: ${gravityHotelPhone}</p>
    </div>
    `

    printRegistrationCard(html)
}

function formatReservationConfirmationDate(value) {
    const d = value ? new Date(value) : new Date()
    if (Number.isNaN(d.getTime())) return ''
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
}

function formatReservationConfirmationDateTime(value) {
    const d = value ? new Date(value) : new Date()
    if (Number.isNaN(d.getTime())) return ''
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    const hour = String(d.getHours()).padStart(2, '0')
    const minute = String(d.getMinutes()).padStart(2, '0')
    const second = String(d.getSeconds()).padStart(2, '0')
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`
}
