let reviewsid
async function reviewsActive() {
    const form = document.querySelector('#reviewsform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', e=>fetchreviewss())
    form.querySelector('#submit').click()
    datasource = []
    await fetchreviewss()
}

async function fetchreviewss() {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData(document.getElementById('reviewsform'))
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchreviews', getparamm(), document.querySelector('#reviewsform #submit'), 'json')
    document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onreviewsTableDataSignal)
            }else return notification(request.message, 0)
    }
    else return notification('No records retrieved')
}

async function removereviews(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this item?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removeitem', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchreviewss()
    return notification(request.message);
    
}


async function onreviewsTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1 }</td>
        <td>${item.guest}</td>
        <td>${item.comment}</td>
        <td>${item.location}</td>
        <td>${item.ratings}</td>
        <td>${specialformatDateTime(item.created_at)}</td>
        <td>${item.status}</td>
        <td class="flex items-center gap-3">
            <button title="Resolve" onclick="reviewsFormSubmitHandler('${item.id}')" class="${item.status == 'APPROVED' ? 'hidden' : ''}material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">security_update_good</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function reviewsFormSubmitHandler(id) {
    
    function payload(){
        let param = new FormData()
        param.append('id', id)
        return param
    }
    let request = await httpRequest2('../controllers/resolvereview', payload(), null)
    if(request.status) {
        fetchreviewss()
        return notification(request.message, 1);
    }
    else return notification(request.message)
}
