let viewglaccountid
async function viewglaccountActive() {
    // const form = document.querySelector('#viewglaccountform')
    // if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', viewglaccountFormSubmitHandler)
    document.getElementById('accounttype').addEventListener('keyup', e=>viewglaccountFormSubmitHandler())
    document.getElementById('accounttype').addEventListener('change', e=>viewglaccountFormSubmitHandler())
    datasource = []
    await fetchviewglaccount()
    wireViewGlAccountExports()
}

async function fetchviewglaccount(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchglbyaccounttype', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onviewglaccountTableDataSignal)
                buildViewGlAccountExport(datasource)
            }
        }else{
             viewglaccountid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeviewglaccount(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this viewglaccount?");

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
    fetchviewglaccount()
    return notification(request.message);
    
}


async function onviewglaccountTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.accountnumber}</td>
        <td>${item.description}</td>
        <td>${item.accounttype}</td>
        <td>${item.subgroup || ''}</td>
        <td>${item.groupname}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchviewglaccountedit('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeviewglaccount('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

function fetchviewglaccountedit(id){
    let x = datasource.filter(data=>data.id == id)
    sessionStorage.setItem('viewglaccountedit', JSON.stringify(x))
    document.getElementById('addglaccount').click()
}

async function viewglaccountFormSubmitHandler() {
    
    let payload

    payload = getFormData2(document.querySelector('#viewglaccountform'))
    let request = await httpRequest2('../controllers/fetchglbyaccounttype', payload, document.querySelector('#viewglaccountform #submit'))
    if(request.status){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onviewglaccountTableDataSignal)
                buildViewGlAccountExport(datasource)
            }}else return notification(request.message, 0);
}

function wireViewGlAccountExports(){
    const pdfBtn = document.getElementById('viewglaccountPrintBtn')
    const excelBtn = document.getElementById('viewglaccountExcelBtn')
    if(pdfBtn) pdfBtn.addEventListener('click', ()=>exportViewGlAccountPDF())
    if(excelBtn) excelBtn.addEventListener('click', ()=>exportViewGlAccountExcel())
}

function buildViewGlAccountExport(data){
    const tbody = document.getElementById('viewGlAccountExportBody')
    if(!tbody) return
    tbody.innerHTML = ''
    if(!data?.length) return
    data.forEach((item, idx)=>{
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td>${item.accountnumber || ''}</td>
            <td>${item.description || ''}</td>
            <td>${item.accounttype || ''}</td>
            <td>${item.subgroup || ''}</td>
            <td>${item.groupname || ''}</td>
        `
        tbody.appendChild(tr)
    })
}

function exportViewGlAccountExcel(){
    if(!datasource || !datasource.length) return notification('No data to export', 0)
    buildViewGlAccountExport(datasource)
    return exportToExcel('viewGlAccountExportTable', 'GL Accounts')
}

function exportViewGlAccountPDF(){
    if(!datasource || !datasource.length) return notification('No data to export', 0)
    buildViewGlAccountExport(datasource)
    return exportToPDF('viewGlAccountExportWrap', true)
}


// function runAdviewglaccountFormValidations() {
//     let form = document.getElementById('viewglaccountform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#viewglaccountname'))  controls.push([form.querySelector('#viewglaccountname'), 'viewglaccount name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }