let diningtableid
async function diningtableActive() {
    const form = document.querySelector('#diningtableform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', diningtableFormSubmitHandler)
    datasource = []
    await fetchdiningtable()
}

async function fetchdiningtable(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchdiningtables', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, ondiningtableTableDataSignal)
            }
        }else{
             diningtableid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removediningtable(id) {
    // Ask for confirmation
    Swal.fire({
  title: 'Are you sure?',
  text: "You won't be able to revert this!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!'
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

    let request = await httpRequest2('../controllers/removediningtable', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchdiningtable()
    return notification(request.message);
    
}


async function ondiningtableTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1 }</td>
        <td>${item.tabletype}</td>
        <td>${item.tablesize}</td>
        <td>${item.tablenumber}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchdiningtable('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removediningtable('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function diningtableFormSubmitHandler() {
    if(!validateForm('diningtableform', getIdFromCls('comp'))) return
    
    if(diningtableid){
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

    payload = getFormData2(document.querySelector('#diningtableform'), diningtableid ? [['id', diningtableid]] : null)
    let request = await httpRequest2('../controllers/diningtables', payload, document.querySelector('#diningtableform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        diningtableid = ''
        document.querySelector('#tabletype').innerHTML = '';
        document.querySelector('#tablesize').innerHTML = '';
        document.querySelector('#tablenumber').innerHTML = '';
        fetchdiningtable();
        return
    }
        document.querySelector('#tabletype').innerHTML = '';
        document.querySelector('#tablesize').innerHTML = '';
        document.querySelector('#tablenumber').innerHTML = '';
    fetchdiningtable();
    return notification(request.message, 0);
}

 
