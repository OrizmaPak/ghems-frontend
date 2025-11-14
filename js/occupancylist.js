async function occupancylistActive() {
    const form = document.querySelector('#occupancylistform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', generatallcheckin)
    if(document.querySelector('#calbtn')) document.querySelector('#calbtn').addEventListener('click', e=>rundateroomstatus(document.getElementById('arrivaldate').value))
    
    datasource = []
    await runcheckinpiedata()
    await fetchOrgData()
    await generatallcheckin() 
    await rundateroomstatus() 
}

function seetodaysdate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();
    
    return `${year}-${month}-${day}`;
}

function getNext30Days(dateString) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const [year, month, day] = dateString.split('-').map(Number);
    const startDate = new Date(year, month - 1, day);
    const dateArray = [];

    for (let i = 0; i < 120; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        const currentDay = String(currentDate.getDate()).padStart(2, '0');
        const currentMonth = monthNames[currentDate.getMonth()];
        const currentDayName = dayNames[currentDate.getDay()];

        dateArray.push(`${currentDay} ${currentMonth} || ${currentDayName}`);
    }

    return dateArray;
}

function getNext30Dayseraw(dateString) {
     const [year, month, day] = dateString.split('-').map(Number);
    const startDate = new Date(year, month - 1, day);
    const dateArray = [];

    for (let i = 0; i < 120; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        const currentYear = currentDate.getFullYear();
        const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const currentDay = String(currentDate.getDate()).padStart(2, '0');

        dateArray.push(`${currentYear}-${currentMonth}-${currentDay}`);
    }

    return dateArray;
}

async function rundateroomstatus(date){
    if(!date)date = seetodaysdate();
    console.log(date)
    let daydata = getNext30Days(date);
    let daydataraw = getNext30Dayseraw(date);
    did('dateheader').innerHTML = daydata.map((data, i)=>`<div class="w-[100px] font-bold border border-y-0 border-l-0 border-white border-r-1 text-white bg-gray-400 py-[2.5px] text-center flex flex-col text-xs uppercase"><span>${data.split('||')[0]}</span><span>${data.split('||')[1]}</span></div>`).join('')
    let param = new FormData()
    param.append('arrivaldate', date)
    let request = await httpRequest2('../controllers/fetchreservationsovernextthirtydays', param, did('calbtn'), 'json')
    document.getElementById('dataroomstatuss').innerHTML = '';
    document.getElementById('rowwithgnatt').innerHTML = '';
    if(request.status && request.data.occupancystatistics.length>0) {
        document.getElementById('dataroomstatuss').innerHTML = Array.from(new Set(request.data.occupancystatistics.map(dat => dat.roomdata.roomnumber)))
    .map(roomNumber => `
        <div class="w-[100px] h-[25px] border border-t-0 text-center py-1">
            ${roomNumber}
        </div>
    `).join('');

            did('rowwithgnatt').innerHTML = '';
        did('rowwithgnatt').innerHTML = Array.from(new Set(request.data.occupancystatistics.map(dat => dat.roomdata.roomnumber))).map(datt=>`
        <div id="room-${datt}" class="flex w-fit">
            ${
                daydataraw.map((data, p)=>{
                return`<div class="w-[100px] h-[25px] border border-t-0 border-l-0 border-r-0 text-center flex relative">
                                    <div title="${data} 00:00:00 to ${data} 12:00:00" class="w-full h-full overflow-visible text-white relative text-nowrap" id="${data}"></div>
                                    <div title="${data} 12:00:01 to ${data} 23:59:59" class="w-full h-full overflow-visible text-white relative text-nowrap" id="${data}"></div>
                        </div>`}).join('')
            }
        </div>
        `).join('')
        
        request.data.occupancystatistics.map(datt=>{
        let color = `bg-[${datt.roomdata.status == 'RESERVED' ? '#FF6600' : datt.roomdata.status == 'CHECKED IN' ? '#00961E' : '#78003C'}]`;
        // let color = `bg-[${generateHighContrastColor()}]`;
        let begindate = datt.reservationdata[0].arrivaldate; //2024-06-14 03:10:00
        let departure = datt.reservationdata[0].departuredate; //2024-06-30 12:00:00
        let j = `${datt.roomdata.status} for ${datt.guest1.firstname ? `${datt.guest1.firstname}&nbsp;${datt.guest1.lastname}&nbsp;${datt.guest1.othernames}` : 'Missing&nbsp;detail'}&nbsp;${Number(datt.roomdata.adult) > 1 ? `&&nbsp;${Number(datt.roomdata.adult)-1+Number(datt.roomdata.child)}&nbsp;other(s)` : ''}`
        let title = `This room is ${datt.roomdata.status} for ${datt.guest1.firstname ? `${datt.guest1.firstname} ${datt.guest1.lastname} ${datt.guest1.othernames}` : 'Missing detail'} ${Number(datt.roomdata.adult) > 1 ? `& ${Number(datt.roomdata.adult)-1} adult(s) with ${Number(datt.roomdata.child)-1} children and ${Number(datt.roomdata.infant)-1} infants(s)` : ''}.`
        
        for(let i=0;i<document.getElementById(`room-${datt.roomdata.roomnumber}`).children.length;i++){
            let data = document.getElementById(`room-${datt.roomdata.roomnumber}`).children[i].children[0].id;
            let cls = checkdaterange(begindate, departure, `${data} 00:00:00 to ${data} 12:00:00`, color, '', '', i == 0 ? true : false) ? checkdaterange(begindate, departure, `${data} 00:00:00 to ${data} 12:00:00`, color, '', '', i == 0 ? true : false).map(dat=>dat) : [];
            let clss = checkdaterange(begindate, departure, `${data} 12:00:01 to ${data} 23:59:59`, color, '', '', i == 0 ? true : false) ? checkdaterange(begindate, departure, `${data} 12:00:01 to ${data} 23:59:59`, color, '', '', i == 0 ? true : false).map(dat=>dat) : [];
            document.getElementById(`room-${datt.roomdata.roomnumber}`).children[i].children[0].title = checkdaterange(begindate, departure, `${data} 00:00:00 to ${data} 12:00:00`, color, '', title, i == 0 ? true : false) ? checkdaterange(begindate, departure, `${data} 00:00:00 to ${data} 12:00:00`, color, '', title, i == 0 ? true : false) : document.getElementById(`room-${datt.roomdata.roomnumber}`).children[i].children[0].title
            if(cls.length>0)cls.map(lass=>document.getElementById(`room-${datt.roomdata.roomnumber}`).children[i].children[0].classList.add(lass))
            document.getElementById(`room-${datt.roomdata.roomnumber}`).children[i].children[0].innerHTML = checkdaterange(begindate, departure, `${data} 00:00:00 to ${data} 12:00:00`, color, j, '', i == 0 ? true : false, document.getElementById(`room-${datt.roomdata.roomnumber}`).children[i].children[0].innerHTML)
            document.getElementById(`room-${datt.roomdata.roomnumber}`).children[i].children[1].title = checkdaterange(begindate, departure, `${data} 12:00:01 to ${data} 23:59:59`, color, '', title, i == 0 ? true : false) ? checkdaterange(begindate, departure, `${data} 12:00:01 to ${data} 23:59:59`, color, '', title, i == 0 ? true : false) : document.getElementById(`room-${datt.roomdata.roomnumber}`).children[i].children[0].title
            if(clss.length>0)clss.map(lass=>document.getElementById(`room-${datt.roomdata.roomnumber}`).children[i].children[1].classList.add(lass))
            document.getElementById(`room-${datt.roomdata.roomnumber}`).children[i].children[1].innerHTML = checkdaterange(begindate, departure, `${data} 12:00:01 to ${data} 23:59:59`, color, j, '', i == 0 ? true : false, document.getElementById(`room-${datt.roomdata.roomnumber}`).children[i].children[1].innerHTML)
        }

        // return`<div id="room-${datt.roomdata.roomnumber}" class="flex w-fit">
        //     ${
        //         daydataraw.map((data, p)=>{
        //         let i = `${datt.guest1.firstname ? `${datt.guest1.firstname}&nbsp;${datt.guest1.lastname}&nbsp;${datt.guest1.othernames}` : 'Missing&nbsp;detail'}&nbsp;${Number(datt.roomdata.adult) > 1 ? `&&nbsp;${Number(datt.roomdata.adult)-1+Number(datt.roomdata.child)}&nbsp;other(s)` : ''}`
        //         let title = `${datt.guest1.firstname ? `${datt.guest1.firstname}&nbsp;${datt.guest1.lastname}&nbsp;${datt.guest1.othernames}` : 'Missing detail'}&nbsp;${Number(datt.roomdata.adult) > 1 ? `&&nbsp;${Number(datt.roomdata.adult)-1} adult(s)` : ''}.&nbsp;This&nbsp;room&nbsp;is&nbsp;${datt.roomdata.status}`
        //         return`<div class="w-[100px] h-[25px] border border-t-0 border-l-0 border-r-0 text-center flex">
        //                             <div title="${checkdaterange(begindate, departure, `${data} 00:00:00 to ${data} 12:00:00`, color, '', title)}" class="w-full h-full ${checkdaterange(begindate, departure, `${data} 00:00:00 to ${data} 12:00:00`, color)} overflow-visible text-white relative text-nowrap" id="${data}_00:00:00">${checkdaterange(begindate, departure, `${data} 00:00:00 to ${data} 12:00:00`, color, i)}</div>
        //                             <div title="${checkdaterange(begindate, departure, `${data} 12:00:01 to ${data} 23:59:59`, color, '', title)}" class="w-full h-full ${checkdaterange(begindate, departure, `${data} 12:00:01 to ${data} 23:59:59`, color)} overflow-visible text-white relative text-nowrap" id="${data}_12:00:00">${checkdaterange(begindate, departure, `${data} 12:00:01 to ${data} 23:59:59`, color, i)}</div>
        //                 </div>`}).join('')
        //     }
        // </div>`
        
        }).join('')
    }
}

function generateHighContrastColor() {
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    let r, g, b;
    while (true) {
        // Generate random values for r, g, and b
        r = getRandomInt(0, 255);
        g = getRandomInt(0, 255);
        b = getRandomInt(0, 255);

        // Calculate the brightness of the color
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        // Check if the brightness is below the threshold (here 128)
        // Lower brightness means the color is dark enough for white text to be visible
        if (brightness < 128) {
            break;
        }
    }
    
    // Convert the RGB values to a hex color string
    const toHex = (value) => value.toString(16).padStart(2, '0').toUpperCase();
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function checkdaterange(begindate, departure, dataRange, color, element='', title='', original=true, html='') {
    const beginDateTime = new Date(begindate);
    const departureDateTime = new Date(departure);
    
    const [dataStartStr, dataEndStr] = dataRange.split(" to ");
    const dataStart = new Date(dataStartStr);
    const dataEnd = new Date(dataEndStr);
    
    if (beginDateTime >= dataStart && beginDateTime <= dataEnd) {
        // element.classList.add('z-10')
            // console.log(element, did(element))
            if(title)return title
            if(element)return `<p class="absolute text-white z-10 w-full ml-4 left-0 mt-[3px]">${element}</p>`;
            return [`${color}`, 'rounded-l-full'];
    }
    if(element)return html
    // Check if dataEnd is exactly the departure date
    if (dataEnd.getTime() === departureDateTime.getTime()) {
        if(title)return title
        return [`${color}`, 'rounded-r-full'];
    }

    // Check if dataStart and dataEnd are both within the range
    if (dataStart >= beginDateTime && dataEnd <= departureDateTime) {
        if(title)return title
        return [color];
    }

    if ((dataStart >= beginDateTime && dataStart <= departureDateTime) || 
        (dataEnd >= beginDateTime && dataEnd <= departureDateTime) ||
        (dataStart <= beginDateTime && dataEnd >= departureDateTime)) {
        if(title)return title
        return [color];
    }

    if(!original)return '';
    if(title)return dataRange;
    return '';
}
     
     
async function runcheckinpiedata() {
    let request = await httpRequest2('../controllers/fetchroomoccupancyoverthirtydays', null, null, 'json')
    if(request.status) {
        let labels = []
        let data = []
        for(let i=0;i<request.data.occupancystatistics.length;i++){
            labels.push(request.data.occupancystatistics[i].roomnumber)
            data.push(request.data.occupancystatistics[i].numberofnights)
        };
        let label = [];
        label.push(formatDate(request.data.begindate))
        label.push(formatDate(request.data.enddate))
        runcheckinpie(labels, data, label) 
    }
    else return notification('No records retrieved')
}

async function runcheckinpie(labels, data, label) {
  const ctx = document.getElementById('myChart');
   
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: `Date from ${label[0]} to ${label[1]}`,
        data,
        borderWidth: 1
      }]
    },
     options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Nights' // Change this to your desired label
          }
        },
        x: {
          title: {
            display: true,
            text: 'Rooms' // Change this to your desired label
          }
        }
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          // Get the index of the clicked bar
          const index = elements[0].index;
          // Get the label and data of the clicked bar
          const clickedLabel = labels[index];
          const clickedData = data[index];
          // Handle the click event here
          console.log(`Clicked bar - Label: ${clickedLabel}, Data: ${clickedData}`);
          openmodalforoccupancy(clickedLabel)
        }
      }
    }
  });
  did('loading').innerHTML = 'BAR CHART'
}

async function openmodalforoccupancy(rn){
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('roomnumber', rn)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchroomtransactionhistory', getparamm(), null, 'json')
    // if(!id)document.getElementById('tabledata2').innerHTML = `No records retrieved`
    if(request.status) {
        did('modalreceipterrt').classList.remove('hidden')
        datasource = request.data;
        let tt = 0
            yy = 0
        did('tabledata2').innerHTML = `
                <tr>
                    <td colspan="6"><p class="text-bold text-md">Balance Brought Forward:</p></td>
                    <td><p class="text-bold text-xl" id="bbf">${formatNumber(request.data.balance)}</p></td>
                </tr>
            `
        did('tabledata2').innerHTML += request.data.transactions.map((item, index)=>{
            tt=tt+(Number(item.debit)-Number(item.credit))
            console.log('tt', tt, Number(item.debit), Number(item.credit));
            return `
                <tr>
                    <td>${index + 1 }</td>
                    <td>${specialformatDateTime(item.transactiondate)}</td>
                    <td>${item.marketer}</td>
                    <td>${item.description}</td>
                    <td>${formatNumber(item.debit, 0)}</td>
                    <td>${formatNumber(item.credit, 0)}</td>
                    <td>${formatNumber(tt, 0)}</td>
                </tr>
            `
        }).join('')
        did('tabledata2').innerHTML += `
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="text-bold">Total:</td>
                    <td>${formatNumber(tt)}</td>
                </tr>
            `
        did('bbf').value = formatNumber(tt)
        did('displaydetails').innerHTML = `
                            <div class="flex flex-col justify-center items-center gap-2">
                                    <h4 class="font-semibold">${did('your_companyname').value}</h4>
                                    <p class="text-xs">${did('your_companyaddress').value}</p>
                                </div>
                                <div class="flex flex-col gap-3 border-b py-6 text-xs">
                                  <p class="flex justify-between">
                                    <span class="text-gray-400 capitalize text-right">Room:</span>
                                    <span>${rn}</span>
                                  </p>
                                  <p class="flex justify-between">
                                    <span class="text-gray-400 capitalize text-right text-bold">Total Balance:</span>
                                    <span>${formatNumber(request.data.balance)}</span>
                                  </p>
                                </div>
                                <div class="flex flex-col gap-3 pb-6 pt-2 text-xs">
                                  <div class=" border-b border border-dashed"></div>
                                  <div class="py-4 justify-center items-center flex flex-col gap-2">
                                    <p class="flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21.3 12.23h-3.48c-.98 0-1.85.54-2.29 1.42l-.84 1.66c-.2.4-.6.65-1.04.65h-3.28c-.31 0-.75-.07-1.04-.65l-.84-1.65a2.567 2.567 0 0 0-2.29-1.42H2.7c-.39 0-.7.31-.7.7v3.26C2 19.83 4.18 22 7.82 22h8.38c3.43 0 5.54-1.88 5.8-5.22v-3.85c0-.38-.31-.7-.7-.7ZM12.75 2c0-.41-.34-.75-.75-.75s-.75.34-.75.75v2h1.5V2Z" fill="#000"></path><path d="M22 9.81v1.04a2.06 2.06 0 0 0-.7-.12h-3.48c-1.55 0-2.94.86-3.63 2.24l-.75 1.48h-2.86l-.75-1.47a4.026 4.026 0 0 0-3.63-2.25H2.7c-.24 0-.48.04-.7.12V9.81C2 6.17 4.17 4 7.81 4h3.44v3.19l-.72-.72a.754.754 0 0 0-1.06 0c-.29.29-.29.77 0 1.06l2 2c.01.01.02.01.02.02a.753.753 0 0 0 .51.2c.1 0 .19-.02.28-.06.09-.03.18-.09.25-.16l2-2c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-.72.72V4h3.44C19.83 4 22 6.17 22 9.81Z" fill="#000"></path></svg>${did('your_companyemail').value}</p>
                                    <p class="flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path fill="#000" d="M11.05 14.95L9.2 16.8c-.39.39-1.01.39-1.41.01-.11-.11-.22-.21-.33-.32a28.414 28.414 0 01-2.79-3.27c-.82-1.14-1.48-2.28-1.96-3.41C2.24 8.67 2 7.58 2 6.54c0-.68.12-1.33.36-1.93.24-.61.62-1.17 1.15-1.67C4.15 2.31 4.85 2 5.59 2c.28 0 .56.06.81.18.26.12.49.3.67.56l2.32 3.27c.18.25.31.48.4.7.09.21.14.42.14.61 0 .24-.07.48-.21.71-.13.23-.32.47-.56.71l-.76.79c-.11.11-.16.24-.16.4 0 .08.01.15.03.23.03.08.06.14.08.2.18.33.49.76.93 1.28.45.52.93 1.05 1.45 1.58.1.1.21.2.31.3.4.39.41 1.03.01 1.43zM21.97 18.33a2.54 2.54 0 01-.25 1.09c-.17.36-.39.7-.68 1.02-.49.54-1.03.93-1.64 1.18-.01 0-.02.01-.03.01-.59.24-1.23.37-1.92.37-1.02 0-2.11-.24-3.26-.73s-2.3-1.15-3.44-1.98c-.39-.29-.78-.58-1.15-.89l3.27-3.27c.28.21.53.37.74.48.05.02.11.05.18.08.08.03.16.04.25.04.17 0 .3-.06.41-.17l.76-.75c.25-.25.49-.44.72-.56.23-.14.46-.21.71-.21.19 0 .39.04.61.13.22.09.45.22.7.39l3.31 2.35c.26.18.44.39.55.64.1.25.16.5.16.78z"></path></svg>${did('your_companyphone').value}</p>
                                  </div>
                                </div>
        `;
       
    }
    else{
        // did('invoicing').click()
        return notification(request.message, 0)}
}


async function fetchOrgData(id) {
    let request = await httpRequest2('../controllers/fetchorganisationscript', null, null, 'json')
    if(request.status) {
        orgInformation = request.data.data[0]
        console.log(orgInformation)
    }
}

async function generatallcheckin() {
    let param = new FormData(document.querySelector('#occupancylistform'))
    let request = await httpRequest2('../controllers/fetchallcheckins', param, document.querySelector('#occupancylistform #submit'), 'json')
    if(request.status) {
        if(request.data.length) {
            datasource = request.data
            resolvePagination(datasource, onoccupancylistTableDataSignal)
            let x = 0
            request.data.map(item=>{
                if(item.roomguestrow.length < 1)return
               x=x+(Math.floor(((Number(item.roomguestrow[0].roomdata?.roomrate)+Number(item.roomguestrow[0].roomdata?.planamount))-(Number(item.roomguestrow[0].roomdata?.discountamount)+Number(item.roomguestrow[0].roomdata?.plandiscountamount)))/Number(item.reservations.numberofnights ? item.reservations.numberofnights : 0)))
               return
            })
            did('totalrate').innerHTML = formatNumber(x)
        }
    }
    else return notification('No records retrieved')
}

// <table>
//     <tbody>
//         <tr>
//             <td>${item.roomguestrow[].firstname} ${item.guests.lastname} ${item.guests.othernames}</td>
//         </tr>
//     </tbody>
// </table>
async function onoccupancylistTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => {
        let i = index
        if(item.roomguestrow.length < 1)return
    return `
                                                       <tr> 
                                                            <td>${index + 1 }</td> 
                                                            <td class="hidden">
                                                                <div class="w-full h-full flex items-center justify-center gap-4">
                                                                    <button title="View" class="material-symbols-outlined rounded-full bg-gray-100 h-8 w-8 text-green-400 drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
                                                                </div>
                                                            </td>
                                                            <td>${item.reservations.reference}</td>
                                                            <td>
                                                                <table  class="mx-auto">
                                                                        <tbody>
                                                                                    <tr>
                                                                                        <td class="text-center opacity-70">No. of Nigths</td>
                                                                                        <td class="text-center opacity-70">${item.reservations.numberofnights}</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="text-center opacity-70">Rm Category</td>
                                                                                        <td class="text-center opacity-70">${item.roomguestrow[0].roomdata?.roomcategoryname}</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="text-center opacity-70">amount paid</td>
                                                                                        <td class="text-center opacity-70">${formatNumber(item.reservations.amountpaid)}</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="text-center opacity-70">ARR DATE</td>
                                                                                        <td class="text-center opacity-70">${specialformatDateTime(item.reservations.arrivaldate)}</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="text-center opacity-70">DEP DATE</td>
                                                                                        <td class="text-center opacity-70">${specialformatDateTime(item.reservations.departuredate)}</td>
                                                                                    </tr>
                                                                        </tbody>
                                                                    </table>
                                                            </td>
                                                            <td>
                                                                <table  class="mx-auto">
                                                                        <tbody>
                                                                            ${
                                                                                item.roomguestrow.map((datt, i)=>`
                                                                                    ${datt.guest1.length>0 ? `<tr>
                                                                                        <td class="text-center opacity-70">${datt.roomdata?.roomnumber}</td>
                                                                                        <td class="text-center opacity-70">${datt.guest1[0].firstname}&nbsp;${datt.guest1[0].lastname}&nbsp;${datt.guest1[0].othernames}</td>
                                                                                        <td class="text-center opacity-70">${datt.guest1[0].phone}</td>
                                                                                    </tr>` : ''}
                                                                                    ${datt.guest2.length>0 ? `<tr>
                                                                                        <td class="text-center opacity-70">${datt.roomdata?.roomnumber}</td>
                                                                                        <td class="text-center opacity-70">${datt.guest2[0].firstname}&nbsp;${datt.guest2[0].lastname}&nbsp;${datt.guest2[0].othernames}</td>
                                                                                        <td class="text-center opacity-70">${datt.guest2[0].phone}</td>
                                                                                    </tr>` : ''}
                                                                                    ${datt.guest3.length>0 ? `<tr>
                                                                                        <td class="text-center opacity-70">${datt.roomdata?.roomnumber}</td>
                                                                                        <td class="text-center opacity-70">${datt.guest3[0].firstname}&nbsp;${datt.guest1[0].lastname}&nbsp;${datt.guest3[0].othernames}</td>
                                                                                        <td class="text-center opacity-70">${datt.guest3[0].phone}</td>
                                                                                    </tr>` : ''}
                                                                                    ${datt.guest4.length>0 ? `<tr>
                                                                                        <td class="text-center opacity-70">${datt.roomdata?.roomnumber}</td>
                                                                                        <td class="text-center opacity-70">${datt.guest4[0].firstname}&nbsp;${datt.guest1[0].lastname}&nbsp;${datt.guest4[0].othernames}</td>
                                                                                        <td class="text-center opacity-70">${datt.guest4[0].phone}</td>
                                                                                    </tr>` : ''}
                                                                                `).join('')
                                                                            }
                                                                        </tbody>
                                                                    </table>
                                                            </td>
                                                            <td>${formatNumber(Math.floor(Number(item.roomguestrow[0].roomdata?.roomrate ? item.roomguestrow[0].roomdata?.roomrate : 0)/Number(item.reservations.numberofnights ? item.reservations.numberofnights : 0)))}</td> 
                                                            <td>${formatNumber(Math.floor(Number(item.roomguestrow[0].roomdata?.planamount ? item.roomguestrow[0].roomdata?.planamount : 0)/Number(item.reservations.numberofnights ? item.reservations.numberofnights : 0)))}</td> 
                                                            <td>${formatNumber(Math.floor(Number(item.roomguestrow[0].roomdata?.discountamount ? item.roomguestrow[0].roomdata?.discountamount : 0)/Number(item.reservations.numberofnights ? item.reservations.numberofnights : 0)))}</td> 
                                                            <td>${formatNumber(Math.floor(Number(item.roomguestrow[0].roomdata?.plandiscountamount ? item.roomguestrow[0].roomdata?.plandiscountamount : 0)/Number(item.reservations.numberofnights ? item.reservations.numberofnights : 0)))}</td>
                                                            <td class="tamount">${formatNumber(Math.floor(((Number(item.roomguestrow[0].roomdata?.roomrate)+Number(item.roomguestrow[0].roomdata?.planamount))-(Number(item.roomguestrow[0].roomdata?.discountamount)+Number(item.roomguestrow[0].roomdata?.plandiscountamount)))/Number(item.reservations.numberofnights ? item.reservations.numberofnights : 0)))}</td>
                                                        </tr> `
                                                }).join('')
    injectPaginatatedTable(rows)
}

function occupancylistItem(id) {
    const selectedItem = datasource.find(item => item.reservations.id == id)
    if(selectedItem) stageCardPrintoccupancylist(selectedItem)
}

function stageCardPrintoccupancylist(item) {

    const html = `
    <div class="bg-white !text-black relative">
        <div class="text-center mb-4">
            <h1 class="text-2xl font-bold uppercase">${orgInformation.companyname}</h1>
            <p class="text-sm capitalize">${orgInformation.address}</p>
            <p class="text-sm">Phone: ${orgInformation.mobile} Tel: ${orgInformation.telephone}</p>
        </div>

        <div>
            <h2 class="text-lg font-semibold text-center">GUEST REGISTRATION CARD</h2>
            <div class="grid grid-cols-3 gap-4 mt-4 border-t py-3 text-xs">
                <div><strong>Res.No :</strong> </div>
                <div><strong>Reg.No :</strong> </div>
                <div><strong>Room No :</strong> ${item.roomguestrow[0]?.roomdata?.roomnumber}</div>
            </div>
        </div>

        <div class="grid grid-cols-2 divide-x border border-gray-300 ">
            <div>
                <h3 class="text-sm font-semibold py-2 text-center border-b">Guest Information</h3>
                <table class="w-full border-collapse border-0 border-gray-300 text-xs">
                    <tbody>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Guest</td>
                            <td style="height: 0;overflow:hidden;" class="p-2 capitalize">${item.roomguestrow[0]?.guest1[0]?.firstname} ${item.roomguestrow[0]?.guest1[0]?.othernames == '-' ? '' : item.roomguestrow[0]?.guest1[0]?.othernames} ${item.roomguestrow[0]?.guest1[0]?.lastname}</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Company</td>
                            <td class="p-2 capitalize">${item.roomguestrow[0]?.guest1[0]?.companyname == '-' ? '' : item.roomguestrow[0]?.guest1[0]?.companyname }</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Res. Address</td>
                            <td class="p-2 capitalize">${item.roomguestrow[0]?.guest1[0]?.residentialaddress == '-' ? '' : item.roomguestrow[0]?.guest1[0]?.residentialaddress }</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">City</td>
                            <td class="p-2 capitalize">${item.roomguestrow[0]?.guest1[0]?.city == '-' ? '' : item.roomguestrow[0]?.guest1[0]?.city }</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Nationality</td>
                             <td class="p-2 capitalize">${item.roomguestrow[0]?.guest1[0]?.nationality == '-' ? '' : item.roomguestrow[0]?.guest1[0]?.nationality }</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Date of Birth</td>
                            <td class="p-2">${new Date(item.roomguestrow[0]?.guest1[0]?.birthdate == '-' ? '' : item.roomguestrow[0]?.guest1[0]?.birthdate).toLocaleDateString()}</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Mobile No</td>
                            <td class="p-2 capitalize">${item.roomguestrow[0]?.guest1[0]?.phone == '-' ? '' : item.roomguestrow[0]?.guest1[0]?.phone }</td>
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
                            <td class="p-2 capitalize">${item.roomguestrow[0]?.guest1[0]?.passportnumber == '-' ? '' : item.roomguestrow[0]?.guest1[0]?.passportnumber }</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Place of Issue</td>
                            <td class="p-2 capitalize">${item.roomguestrow[0]?.guest1[0]?.passportplaceofissue == '-' ? '' : item.roomguestrow[0]?.guest1[0]?.passportplaceofissue }</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Date of Issue</td>
                            <td class="p-2">${new Date(item.roomguestrow[0]?.guest1[0]?.issuedateofpassport == '-' ? '' : item.roomguestrow[0]?.guest1[0]?.issuedateofpassport).toLocaleDateString() }</td>
                        </tr>
                        <tr>
                            <td class="p-2 font-semibold">Date of Expiry</td>
                            <td class="p-2">${ new Date(item.roomguestrow[0]?.guest1[0]?.expiredateofpassport == '-' ? '' : item.roomguestrow[0]?.guest1[0]?.expiredateofpassport).toLocaleDateString() }</td>
                        </tr>
                    </tbody>
                </table>
 
                <h3 class="text-sm font-semibold py-2 text-center  border-b border-t">Visa / Residential Permit</h3>
                <table class="w-full mb-8 border-collapse border-0 border-gray-300 text-xs">
                    <tbody>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Visa Type / Visa No</td>
                            <td class="p-2">${item.roomguestrow[0]?.guest1[0]?.visanumber == '-' ? '' : item.roomguestrow[0]?.guest1[0]?.visanumber }</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Place of Issue</td>
                            <td class="p-2">${item.roomguestrow[0]?.guest1[0]?.visaplaceofissue == '-' ? '' : item.roomguestrow[0]?.guest1[0]?.visaplaceofissue }</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Date of Issue</td>
                            <td class="p-2">${new Date(item.roomguestrow[0]?.guest1[0]?.issuedateofvisa == '-' ? '' : item.roomguestrow[0]?.guest1[0]?.issuedateofvisa).toLocaleDateString() }</td>
                        </tr>
                        <tr>
                            <td class="p-2 font-semibold">Date of Expiry</td>
                            <td class="p-2">${new Date(item.roomguestrow[0]?.guest1[0]?.expiredateofvisa == '-' ? '' : item.roomguestrow[0]?.guest1[0]?.expiredateofvisa).toLocaleDateString() }</td>
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
                            <td class="p-2">${item.roomguestrow[0]?.roomdata?.roomcategoryname == '-' || item.roomguestrow[0]?.roomdata?.roomcategoryname == null ? '' : item.roomguestrow[0]?.roomdata?.roomcategoryname}</td>
                        </tr>
                        <tr>
                            <td class="p-2 font-semibold">Room No</td>
                            <td class="p-2">${item.roomguestrow[0]?.roomdata?.roomnumber}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <table class="w-full  border-collapse border-0 border-gray-300 text-xs">
                    <tbody>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Pax</td>
                            <td class="p-2">${item.roomguestrow[0]?.roomdata?.adult ?? 0} Adult &nbsp;&nbsp;${item.roomguestrow[0]?.roomdata?.child ?? 0} Child&nbsp;&nbsp;${item.roomguestrow[0]?.roomdata?.infant ?? 0}&nbsp;&nbsp;Infant(s)</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="p-2 font-semibold">Plan</td>
                            <td class="p-2">${ formatCurrency(item.roomguestrow[0]?.roomdata?.planamount ?? '')}</td>
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
    occupancylist(html)
}