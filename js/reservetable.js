let reservetableid
async function reservetableActive() {
    const form = document.querySelector('#reservetableform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', reservetableFormSubmitHandler)
    datasource = []
    await fetchtablenumber()
    await fetchreservetable()
}

async function fetchtablenumber() {
    let request = await httpRequest2('../controllers/fetchdiningtables', null, null, 'json')
    if(request.status) {
        document.getElementById('tablenumberlist').innerHTML = request.data.map(data=>`<option value="${data.tablenumber}">${data.tablenumber}</option>`).join('')
    }
    else return notification('No records retrieved')
}

async function fetchreservetable(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchtablereservations', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onreservetableTableDataSignal)
            }
        }else{
             reservetableid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function checktablestatus(state=false) {
    document.getElementById('tablestatus').style.background = 'white'
    document.getElementById('tablestatus').removeAttribute('readonly')
    document.getElementById('tablestatus').value = ''
document.getElementById('tablestatus').setAttribute('readonly', true)
    if(!document.getElementById('reservationdate').value || !document.getElementById('timeline').value || !document.getElementById('tablenumber').value)return notification('Please make sure guest, reservationdate, timeline and tablenumber are valid', 0)
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('reservationdate', document.getElementById('reservationdate').value)
        paramstr.append('timeline', document.getElementById('timeline').value)
        paramstr.append('tablenumber', document.getElementById('tablenumber').value)
        return paramstr
    }
    let request = await httpRequest2('../controllers/tablestatus', getparamm(), null, 'json')
    if(request.status) {
             document.getElementById('tablestatus').style.background = 'green'
             document.getElementById('tablestatus').removeAttribute('readonly')
             document.getElementById('tablestatus').value =  request.result
             document.getElementById('tablestatus').setAttribute('readonly', true)
             if(state)document.getElementById('guest').value = '';
             if(state)document.getElementById('guestview').classList.add('hidden');
         }else{
             document.getElementById('tablestatus').removeAttribute('readonly')
             document.getElementById('tablestatus').style.background = 'orange'
             document.getElementById('tablestatus').value = `${did('tablenumber').value} is ${request.message}`
             if(state)document.getElementById('guest').value = request.data.guest;
             if(state)document.getElementById('guestview').classList.remove('hidden');
            //  if(state)document.getElementById('reservationdata').value = request.data.guest;
             document.getElementById('tablestatus').setAttribute('readonly', true)
             if(!state)did('tablenumber').value ='';
             return notification('No records retrieved')
    }
}

async function removereservetable(id) {
    // Ask for confirmation
    Swal.fire({
  title: 'Are you sure?',
  text: "You won't be able to revert this!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, reverse it!'
}).then((result) => {
  if (result.isConfirmed) {
  } else {
    // Optional: Code to execute if the user cancels the edit
    return console.log('Delete canceled');
  }
});


    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/reversetablereservation', id ? getparamm() : null, null, 'json');
    if(request.status){
        Swal.fire({
  title: "Reversed!",
  text: "Table reservatio reversed!",
  icon: "success"
});
    }
    
    // Show notification based on the result
    fetchreservetable()
    return notification(request.message);
    
}


async function onreservetableTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1 }</td>
        <td>${formatDate(item.reservationdate)}</td>
        <td>${item.tablenumber}</td>
        <td>${item.timeline}</td>
        <td>${item.guest}</td>
        <td>${item.guestdetail}</td>
        <td>${item.messages}</td>
        <td>${formatDate(item.entrydate)}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchreservetable('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Reverse" onclick="removereservetable('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete_history</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function reservetableFormSubmitHandler() {
    if(!validateForm('reservetableform', getIdFromCls('comp'))) return
    
    if(reservetableid){
            Swal.fire({
  title: 'Are you sure?',
  text: "You Are About to update a dining table!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, Update it!'
}).then((result) => {
  if (result.isConfirmed) {
  } else {
    // Optional: Code to execute if the user cancels the edit
    return console.log('Delete canceled');
  }
});

    }
    
    let payload

    payload = getFormData2(document.querySelector('#reservetableform'), reservetableid ? [['id', reservetableid]] : null)
    let request = await httpRequest2('../controllers/reservetable', payload, document.querySelector('#reservetableform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        reservetableid = ''
        document.querySelector('#reservationdate').value = '';
        document.querySelector('#tablenumber').value = '';
        document.querySelector('#guestdetail').value = '';
        document.querySelector('#entrydate').value = '';
        document.querySelector('#guest').value = '';
        document.querySelector('#messages').value = '';
        fetchreservetable();
        return
    }
        // document.querySelector('#reservationdate').innerHTML = '';
        // document.querySelector('#tablenumber').innerHTML = '';
        // document.querySelector('#guestdetail').innerHTML = '';
        // document.querySelector('#entrydate').innerHTML = '';
        // document.querySelector('#guest').innerHTML = '';
        // document.querySelector('#message').innerHTML = '';
    fetchreservetable();
    return notification(request.message, 0);
}

 
