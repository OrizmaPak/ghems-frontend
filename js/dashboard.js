let dashboardid
async function dashboardActive() {
    let x
    if(sessionStorage.getItem('user')){
         x = JSON.parse(sessionStorage.getItem('user'))
        // if(x.role !== 'SUPERADMIN'){
        //     did('SUPERADMIN').classList.remove('hidden')
        // }else{
        //     did('NOTSUPERADMIN').classList.remove('hidden')
        // }
        
    }
    // const form = document.querySelector('#dashboardform')
    // if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', dashboardFormSubmitHandler)
    datasource = []
    entername()
    attachDashboardMetricRoutes()
    // if(x.role !== 'SUPERADMIN'){
    //     await fetchtheusersonline()
    //     await fetchthfetchtotalusers()
    // }else{
    //     await gettotalpurchasedproducts()
    //     await getusertotaltransactions()
    //     await walletbalance()
    // }
    // await fetchthfetchtranscation()
    if(document.getElementById('dashavailablerooms'))document.getElementById('dashavailablerooms').textContent = availableroomlength
    if(document.getElementById('dashoccupiedrooms'))document.getElementById('dashoccupiedrooms').textContent = occupiedroomlength
    if(document.getElementById('dashreceiveable'))document.getElementById('dashreceiveable').textContent = receiveablelength
    if(document.getElementById('dashinventory'))document.getElementById('dashinventory').textContent = receiveablelength
    if(document.getElementById('dashpayables'))document.getElementById('dashpayables').textContent = payableslength
    if(document.getElementById('dashsales'))document.getElementById('dashsales').textContent = saleslength
    await runavailablerooms()
    await rundashboard()
    
    await fetchdashboarder()
    
        for(let i=0;i<document.getElementsByClassName('val').length;i++){
            if(did('your_role').value !== 'USERADMIN'){
                document.getElementsByClassName('val')[i].classList.add('hidden')
            }else{
                document.getElementsByClassName('val')[i].classList.remove('hidden')
            }
        }
    
}

async function fetchdashboarder() {
    let request = await httpRequest2('../controllers/saleschart', null, null, 'json')
    if(request.status) {
        let labels = []
        let data = []
        for(let i=0;i<request.data.length;i++){
            labels.push(formatDate(request.data[i].date))
            data.push(request.data[i].totalsales)
        }
        fetchdashboard(labels, data)
    }
    else return notification('No records retrieved')
}

async function fetchdashboard(labels, data) {
  
   const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Total Sales For the Week',
        data,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

}
async function fetchdashboard2(labels, data) {
  
   const ctx = document.getElementById('myChart2');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: '# of Votes',
        data,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

}

async function fetchthfetchtranscation() { 
    let request = await httpRequest2('../controllers/fetchalltransactions', null, null, 'json')
    if(request.status) {
        did('totaltransactions').innerHTML = request.data.length
        let labels = []
        let data = []
        for(let i=0;i<request.data.length;i++){
            labels.push(request.data[i].transactiondate.split(' ')[0])
            data.push(request.data[i].amount.split(' ')[0])
        }
        fetchdashboard(labels, data)
        fetchdashboard2(labels, data)
        return 
    }
    return notification(request.message, 0);
}
async function fetchthfetchtotalusers() {
    let request = await httpRequest2('../controllers/fetchtotalusers', null, null, 'json')
    if(request.status) {
        did('fetchtotalusers').innerHTML = request.data.registeredusers
        return 
    }
    return notification(request.message, 0);
}
async function fetchtheusersonline() {
    let request = await httpRequest2('../controllers/fetchusersonline', null, null, 'json')
    if(request.status) {
        did('fetchusersonline').innerHTML = request.data.totalusersonline
        return 
    }
    return notification(request.message, 0);
}
async function gettotalpurchasedproducts() {
    let request = await httpRequest2('../controllers/gettotalpurchasedproducts', null, null, 'json')
    if(request.status) {
        did('totalpurchasedproducts').innerHTML = request.data.totalpurchasedproducts
        return 
    }
    return notification(request.message, 0);
}
async function getusertotaltransactions() {
    let request = await httpRequest2('../controllers/getusertotaltransactions', null, null, 'json')
    if(request.status) {
        did('transactionstotal').innerHTML = request.data.transactionstotal
        return 
    }
    return notification(request.message, 0);
}
async function walletbalance() {
    let request = await httpRequest2('../controllers/walletbalance', null, null, 'json')
    if(request.status) {
        did('walletbalance').innerHTML = request.data.walletbalance
        return 
    }
    return notification(request.message, 0);
}

async function removedashboard(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this dashboard?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removevisacountries', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchdashboard()
    return notification(request.message);
    
}


async function ondashboardTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchdashboard('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removedashboard('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function dashboardFormSubmitHandler() {
    if(!validateForm('dashboardform', [`productname`, `productdescription`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#dashboardform'), dashboardid ? [['id', dashboardid]] : null)
    let request = await httpRequest2('../controllers/dashboardcript', payload, document.querySelector('#dashboardform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#dashboardform').reset();
        fetchdashboard();
        return
    }
    document.querySelector('#dashboardform').reset();
    fetchdashboard();
    return notification(request.message, 0);
}

function attachDashboardMetricRoutes() {
    try {
        document.querySelectorAll('.metric-card[data-route-target]').forEach(card => {
            if(card.dataset.routeBound === '1') return
            const targetId = card.dataset.routeTarget
            if(!targetId) return
            card.dataset.routeBound = '1'
            card.addEventListener('click', () => {
                const navItem = document.getElementById(targetId)
                if(navItem) navItem.click()
            })
        })
    } catch (error) {
        console.log(error)
    }
}

