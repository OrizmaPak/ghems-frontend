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
            ${item.status == 'ACTIVE' ? `<button onclick="deactivateuserspageItem(event, '${item.email}', '${item.id}')" title="Deactivate User" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">lock</button>`
            :
            item.status == 'DEACTIVATED' ? `<button onclick="activateuserspageItem(event, '${item.email}', '${item.id}')" title="Activate User" class="material-symbols-outlined rounded-full bg-green-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">key</button>` 
            :
                ''
            }
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
