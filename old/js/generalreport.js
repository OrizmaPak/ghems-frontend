let generalreportid
async function generalreportActive() {
    if(document.querySelector('#submitmeal')) document.querySelector('#submitmeal').addEventListener('click', e=>fetchguestmeal())
    datasource = []
    await fetchguestmeal()
}

async function fetchguestmeal() {
    function getparamm(){
        let paramstr = new FormData();
        paramstr.append('arrivaldate', document.getElementById('arrivaldaterr').value)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchreservationsovernextthirtydays', getparamm(), document.querySelector('#submitmeal'), 'json')
    document.getElementById('tabledata').innerHTML = `No records retrieved`;
    if(request.status) {
                datasource = request.data.occupancystatistics.filter(data=>data.reservationdata[0].status == 'CHECKED IN')
                console.log(datasource)
                resolvePagination(datasource, onguestmealTableDataSignal)
                ondiscountTableDataSignal()
    }
    else return notification(request.message, 0);
}

async function onguestmealTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => {
        console.log(item)
    let x =0;
    let r =0
    // let goto
    // if(did('guestreservationform'))goto = 'checkin'
    // if(did('reservationcheckinform'))goto = ''
    // if(did('groupcheckinform'))goto = ''
            if(item.guest1)x++
            if(item.guest2)x++
            if(item.guest3)x++ 
            if(item.guest4)x++ 
            if(item.roomdata.roomrate)r = Number(item.roomdata.roomrate)+r
    return ` 
    <tr> 
        <td>${index + 1 }</td> 
        <td>${item.roomdata?.roomnumber}</td>
        <td>${x}&nbsp;Person(s)
            <table  class="mx-auto">
                    <tbody>
                        ${item ?
                                `${item.guest1 ? `<tr>
                                    <td class="text-center opacity-70">${item.guest1.firstname}&nbsp;${item.guest1.lastname}&nbsp;${item.guest1.othernames}</td>
                                    <td class="text-center opacity-70">${item.guest1.phone}</td>
                                </tr>` : ''}
                                ${item.guest2 ? `<tr>
                                    <td class="text-center opacity-70">${item.guest2.firstname}&nbsp;${item.guest2.lastname}&nbsp;${item.guest2.othernames}</td>
                                    <td class="text-center opacity-70">${item.guest2.phone}</td>
                                </tr>` : ''}
                                ${item.guest3 ? `<tr>
                                    <td class="text-center opacity-70">${item.guest3.firstname}&nbsp;${item.guest1.lastname}&nbsp;${item.guest3.othernames}</td>
                                    <td class="text-center opacity-70">${item.guest3.phone}</td>
                                </tr>` : ''}
                                ${item.guest4 ? `<tr>
                                    <td class="text-center opacity-70">${item.guest4.firstname}&nbsp;${item.guest1.lastname}&nbsp;${item.guest4.othernames}</td>
                                    <td class="text-center opacity-70">${item.guest4.phone}</td>
                                </tr>` : ''}`
                            :
                            `
                                ${item.guest1 ? `<tr>
                                    <td class="text-center opacity-70">${item.guest1.firstname}&nbsp;${item.guest1.lastname}&nbsp;${item.guest1.othernames}</td>
                                    <td class="text-center opacity-70">${item.guest1.phone}</td>
                                </tr>` : ''}
                                ${item.guest2 ? `<tr>
                                    <td class="text-center opacity-70">${item.guest2.firstname}&nbsp;${item.guest2.lastname}&nbsp;${item.guest2.othernames}</td>
                                    <td class="text-center opacity-70">${item.guest2.phone}</td>
                                </tr>` : ''}
                                ${item.guest3 ? `<tr>
                                    <td class="text-center opacity-70">${item.guest3.firstname}&nbsp;${item.guest1.lastname}&nbsp;${item.guest3.othernames}</td>
                                    <td class="text-center opacity-70">${item.guest3.phone}</td>
                                </tr>` : ''}
                                ${item.guest4 ? `<tr>
                                    <td class="text-center opacity-70">${item.guest4.firstname}&nbsp;${item.guest1.lastname}&nbsp;${item.guest4.othernames}</td>
                                    <td class="text-center opacity-70">${item.guest4.phone}</td>
                                </tr>` : ''}
                            `
                        }
                    </tbody>
                </table>
        </td>
        <td class="font-bold">${item.roomdata.plan}</td>
        <td>${item.roomdata.planamount}</td>
        <td>${item.roomdata.plandiscountamount}</td>
        <td>${item.roomdata.plandiscountperc}</td>
        <td>${formatNumber(item.reservationdata[0].numberofnights).replace('.00', '')}&nbsp;Night(s)</td> 
        <td>${formatNumber(r)}</td>
        <td>${formatDate(item.reservationdata[0].reservationdate)}</td>
        <td>${item.reservationdata[0].reference}</td>
    </tr> `}
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function ondiscountTableDataSignal() {
    document.getElementById('tabledata2').innerHTML = datasource.map((item, index) => {
        console.log(item)
    let x =0;
    let r =0
    // let goto
    // if(did('guestreservationform'))goto = 'checkin'
    // if(did('reservationcheckinform'))goto = ''
    // if(did('groupcheckinform'))goto = ''
            if(item.guest1)x++
            if(item.guest2)x++
            if(item.guest3)x++ 
            if(item.guest4)x++ 
            if(item.roomdata.roomrate)r = Number(item.roomdata.roomrate)+r
    return ` 
    <tr> 
        <td>${index + 1 }</td> 
        <td>${item.roomdata?.roomnumber}</td>
        <td>${x}&nbsp;Person(s)
            <table  class="mx-auto">
                    <tbody>
                        ${item ?
                                `${item.guest1 ? `<tr>
                                    <td class="text-center opacity-70">${item.guest1.firstname}&nbsp;${item.guest1.lastname}&nbsp;${item.guest1.othernames}</td>
                                    <td class="text-center opacity-70">${item.guest1.phone}</td>
                                </tr>` : ''}
                                ${item.guest2 ? `<tr>
                                    <td class="text-center opacity-70">${item.guest2.firstname}&nbsp;${item.guest2.lastname}&nbsp;${item.guest2.othernames}</td>
                                    <td class="text-center opacity-70">${item.guest2.phone}</td>
                                </tr>` : ''}
                                ${item.guest3 ? `<tr>
                                    <td class="text-center opacity-70">${item.guest3.firstname}&nbsp;${item.guest1.lastname}&nbsp;${item.guest3.othernames}</td>
                                    <td class="text-center opacity-70">${item.guest3.phone}</td>
                                </tr>` : ''}
                                ${item.guest4 ? `<tr>
                                    <td class="text-center opacity-70">${item.guest4.firstname}&nbsp;${item.guest1.lastname}&nbsp;${item.guest4.othernames}</td>
                                    <td class="text-center opacity-70">${item.guest4.phone}</td>
                                </tr>` : ''}`
                            :
                            `
                                ${item.guest1 ? `<tr>
                                    <td class="text-center opacity-70">${item.guest1.firstname}&nbsp;${item.guest1.lastname}&nbsp;${item.guest1.othernames}</td>
                                    <td class="text-center opacity-70">${item.guest1.phone}</td>
                                </tr>` : ''}
                                ${item.guest2 ? `<tr>
                                    <td class="text-center opacity-70">${item.guest2.firstname}&nbsp;${item.guest2.lastname}&nbsp;${item.guest2.othernames}</td>
                                    <td class="text-center opacity-70">${item.guest2.phone}</td>
                                </tr>` : ''}
                                ${item.guest3 ? `<tr>
                                    <td class="text-center opacity-70">${item.guest3.firstname}&nbsp;${item.guest1.lastname}&nbsp;${item.guest3.othernames}</td>
                                    <td class="text-center opacity-70">${item.guest3.phone}</td>
                                </tr>` : ''}
                                ${item.guest4 ? `<tr>
                                    <td class="text-center opacity-70">${item.guest4.firstname}&nbsp;${item.guest1.lastname}&nbsp;${item.guest4.othernames}</td>
                                    <td class="text-center opacity-70">${item.guest4.phone}</td>
                                </tr>` : ''}
                            `
                        }
                    </tbody>
                </table>
        </td>
        <td class="font-bold">${item.roomdata.discountcoupon}</td>
        <td>${formatNumber(item.roomdata.discountamount)}</td>
        <td>${item.roomdata.discountcoupon}</td>
        <td>${formatNumber(item.reservationdata[0].numberofnights).replace('.00', '')}&nbsp;Night(s)</td> 
        <td>${formatNumber(r)}</td>
        <td>${formatDate(item.reservationdata[0].reservationdate)}</td>
        <td>${item.reservationdata[0].reference}</td>
    </tr> `}
    )
    .join('')
    // injectPaginatatedTable(rows)
}


