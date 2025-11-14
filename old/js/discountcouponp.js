let discountcouponid
async function discountcouponActive() {
    const form = document.querySelector('#discountcouponform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', discountcouponFormSubmitHandler)
    datasource = []
    await fetchdiscountcoupon()
}

async function fetchdiscountcoupon(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchdiscountcoupon', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, ondiscountcouponTableDataSignal)
            }
        }else{
             discountcouponid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removediscountcoupon(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this discountcoupon?");

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
    fetchdiscountcoupon()
    return notification(request.message);
    
}


async function ondiscountcouponTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1 }</td>
        <td>${item.couponname}</td>
        <td>${item.discounttype}</td>
        <td>${item.discount}</td>
        <td>${item.platform}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchdiscountcoupon('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removediscountcoupon('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function discountcouponFormSubmitHandler() {
    if(!validateForm('discountcouponform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#discountcouponform'), discountcouponid ? [['id', discountcouponid]] : null)
    let request = await httpRequest2('../controllers/discountcoupon', payload, document.querySelector('#discountcouponform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        discountcouponid = ''
        document.querySelector('#discountcouponform').reset();
        fetchdiscountcoupon();
        return
    }
    document.querySelector('#discountcouponform').reset();
    fetchdiscountcoupon();
    return notification(request.message, 0);
}


// function runAddiscountcouponFormValidations() {
//     let form = document.getElementById('discountcouponform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#discountcouponname'))  controls.push([form.querySelector('#discountcouponname'), 'discountcoupon name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }