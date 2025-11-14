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
            <button title="Edit row entry" onclick="printRegistrationCardItem('${item.reservations.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">print</button>
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
            <button title="Edit row entry" onclick="printRegistrationCardItem('${item.reservations.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">print</button>
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
            <button title="Edit row entry" onclick="printRegistrationCardItem('${item.reservations.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">print</button>
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
            <button title="Edit row entry" onclick="printRegistrationCardItem('${item.reservations.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">print</button>
        </td>
    </tr>` : ''}
    
    `
    )
    .join('')
    injectPaginatatedTable(rows)
}

function printRegistrationCardItem(id) {
    const selectedItem = datasource.find(item => item.reservations.id == id)
    if(selectedItem) stageCardPrint(selectedItem)
}

function stageCardPrint(item) {

    const html = `
    <div class="bg-white !text-black relative">
        <div class="text-center mb-4">
            <h1 class="text-2xl font-bold uppercase">${orgInformation.companyname}</h1>
            <p class="text-sm capitalize">${orgInformation.address}</p>
            <p class="text-sm">Phone: ${orgInformation.mobile} Tel: ${orgInformation.telephone}</p>
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
                            <td class="p-2"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
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