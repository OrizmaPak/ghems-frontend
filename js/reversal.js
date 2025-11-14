let reversalid
async function reversalActive() {
    const formsales = document.querySelector('#reversesalesform')
    if(formsales.querySelector('#submit')) formsales.querySelector('#submit').addEventListener('click', reversesalesformSubmitHandler)
    const formreceipt = document.querySelector('#reversesalesform')
    if(formreceipt.querySelector('#submit')) formreceipt.querySelector('#submit').addEventListener('click', reversereceiptformSubmitHandler)
    datasource = []
    // await fetchreversal()
}


async function reversesalesformSubmitHandler() {
    if(!validateForm('reversesalesform', getIdFromCls('comp1'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#reversesalesform'), reversalid ? [['id', reversalid]] : null)
    let request = await httpRequest2('../controllers/reversesales', payload, document.querySelector('#reversesalesform #submit'))
    if(request.status) {
        notification('Sales reversed successfully!', 1);
        document.querySelector('#reversepaymentform').reset();
        return
    }
    document.querySelector('#reversepaymentform').reset();
    return notification(request.message, 0);
}

async function reversereceiptformSubmitHandler() {
    if(!validateForm('reversereceiptform', getIdFromCls('comp2'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#reversereceiptform'), reversalid ? [['id', reversalid]] : null)
    let request = await httpRequest2('../controllers/reversereceipt', payload, document.querySelector('#reversereceiptform #submit'))
    if(request.status) {
        notification('Receipt reversed successfully!', 1);
        document.querySelector('#reversepaymentform').reset();
        return
    }
    document.querySelector('#reversepaymentform').reset();
    return notification(request.message, 0);
}



// function runAdreversepaymentformValidations() {
//     let form = document.getElementById('reversepaymentform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#reversalname'))  controls.push([form.querySelector('#reversalname'), 'reversal name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }