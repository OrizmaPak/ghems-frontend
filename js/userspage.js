async function userspageActive() {
    datasource =  []
    await fetchuserspagesfunc()
}

async function fetchuserspagesfunc() {
    let request = await httpRequest('../controllers/fetchusers')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            datasource = request.data
            resolvePagination(datasource, onuserspagesTableDataSignal)
        }
    }
    else return notification('No records retrieved')
}


async function onuserspagesTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr class="${item.role == 'SUPERADMIN' ? 'hidden' : ''}" >
        <td>${item.index + 1 }</td>
        <td class="flex items-center gap-3">
            ${renderUsersActionButton(item)}
        </td>
        <td>${item.firstname}</td>
        <td>${item.lastname}</td>
        <td style="text-transform:lowercase">${item.email}</td>
        <td>${item.status}</td> 
        <td>${item.address}</td> 
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

function renderUsersActionButton(item){
    const status = String(item?.status || '').trim().toUpperCase()
    const isActive = status === 'ACTIVE'

    if(isActive){
        return `<button onclick="deactivateuserspageItem(event, '${item.email}', '${item.id}')" title="Deactivate User" class="rounded-md bg-red-600 px-2 py-1 text-white drop-shadow-md text-xs font-semibold inline-flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">lock</span>
            <span>Deactivate</span>
        </button>`
    }

    return `<button onclick="activateuserspageItem(event, '${item.email}', '${item.id}')" title="Activate User" class="rounded-md bg-green-600 px-2 py-1 text-white drop-shadow-md text-xs font-semibold inline-flex items-center gap-1">
        <span class="material-symbols-outlined text-sm">key</span>
        <span>Activate</span>
    </button>`
}

async function activateuserspageItem(event, email, index) {
        if(!confirm('You are about to activate this user')) return
        let payload = new FormData()
        payload.append('email', email)
        let request = await httpRequest('../controllers/reactivateuser', payload, event.target)
        if(request.status) {
            document.getElementById('tabledata').innerHTML = ''
            notification('User activated successfully!', 1)
            fetchuserspagesfunc()
            return
        }
        return notification(request.message, 0)
}

async function deactivateuserspageItem(event, email, index) {
        if(!confirm('You are about to deactivate this user')) return
        let payload = new FormData()
        payload.append('email', email)
        let request = await httpRequest('../controllers/deactivateuser', payload, event.target)
        if(request.status) {
            document.getElementById('tabledata').innerHTML = ''
            notification('User deactivated successfully!', 1)
            fetchuserspagesfunc()
            return
        }
        return notification(request.message, 0)
}




// function userspageedit(id){
//     sessionStorage.setItem('edituserspage', id)
//     document.getElementById('profile').click()
// }


// async function userspage(event, index) {func
//     let selectedItem = userspages.find(item => item.id == index)
//     if(selectedItem) {
//         if(!confirm('You are about to select this userspage')) return
//         let payload = new FormData()
//         payload.append('email', selectedItem.email)
//         let request = await httpRequest('../controllers/userspage', payload, event.target)
//         if(request.status) {
//             document.getElementById('tabledata').innerHTML = ''
//             notification('userspage selected successfully!', 1)
//             fetchuserspages()
//             return
//         }
//         return notification(request.message, 0)
//     }
// }
