let reversalsid
async function reversalsActive() {
    const form = document.querySelector('#reversepaymentform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', reversepaymentformSubmitHandler)
    const formreversereceivepurchases = document.querySelector('#reversereceivepurchasesform')
    if(formreversereceivepurchases.querySelector('#submit')) formreversereceivepurchases.querySelector('#submit').addEventListener('click', reversereceivepurchasesformSubmitHandler)
    datasource = []
    // await fetchreversals()
}

async function reversepaymentformSubmitHandler() {
    if(!validateForm('reversepaymentform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#reversepaymentform'), reversalsid ? [['id', reversalsid]] : null)
    let request = await httpRequest2('../controllers/reversepayment', payload, document.querySelector('#reversepaymentform #submit'))
    if(request.status) {
        notification('Payment reversed successfully!', 1);
        document.querySelector('#reversepaymentform').reset();
        return
    }
    document.querySelector('#reversepaymentform').reset();
    return notification(request.message, 0);
}


async function reversereceivepurchasesformSubmitHandler() {
    if(!validateForm('reversereceivepurchasesform', getIdFromCls('comp2'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#reversereceivepurchasesform'), reversalsid ? [['id', reversalsid]] : null)
    let request = await httpRequest2('../controllers/reversereceivepurchases', payload, document.querySelector('#reversereceivepurchasesform #submit'))
    if(request.status) {
        notification('Receive purchase reversed successfully!', 1);
        document.querySelector('#reversereceivepurchasesform').reset();
        return
    }
    document.querySelector('#reversereceivepurchasesform').reset();
    return notification(request.message, 0);
}


// function runAdreversepaymentformValidations() {
//     let form = document.getElementById('reversepaymentform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#reversalsname'))  controls.push([form.querySelector('#reversalsname'), 'reversals name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }