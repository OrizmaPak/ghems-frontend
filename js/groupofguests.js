let groupofguestsid
let companyid
let travelid
let inmodal
let dcompanyname
async function groupofguestsActive() {
    // const form = document.querySelector('#groupofguestsform')
    if(document.querySelector('#submitcompany'))document.querySelector('#submitcompany').addEventListener('click', companysubmithandle)
    if(document.querySelector('#submittravel'))document.querySelector('#submittravel').addEventListener('click', travelssubmithandle)
    if(document.querySelector('#submitgroups'))document.querySelector('#submitgroups').addEventListener('click', groupssubmithandle)
    if(document.querySelector('#company'))document.querySelector('#company').addEventListener('change', e=>groupcompany()) 
    if(document.querySelector('#travelagent'))document.querySelector('#travelagent').addEventListener('change', e=>grouptravelagent()) 
    datasource = []
    await fetchtravels() 
    await fetchcompany() 
    await fetchgroups() 
}

function groupcompany(){
    if(!did('company').value)return notification('Please note that group name is required if you cannot find your company name select Add COMPANY', 0)
    if(did('company').value == 'ADD COMPANY'){
        inmodal = 'company'
        did('viewformtoedit').appendChild(did('companyform'))
        did('companyform').classList.remove('hidden')
        did('modalform').classList.remove('hidden')
    }
}
function grouptravelagent(){
    if(!did('travelagent').value)return notification('Please note that agency name is required if you cannot find your agency name select Add TRAVEL AGENCY', 0)
    if(did('travelagent').value == 'ADD TRAVEL AGENCY'){
        inmodal = 'travelagent'
        did('viewformtoedit').appendChild(did('travelagencyform'))
        did('travelagencyform').classList.remove('hidden')
        did('modalform').classList.remove('hidden')
    }
}

function returngroupcontent(){
    if(!inmodal)return did('modalform').classList.add('hidden');
    if(inmodal == 'company'){did('showform').appendChild(did('companyform'));did('companyform').classList.add('hidden')}
    if(inmodal == 'travelagent'){did('showform').appendChild(did('travelagencyform'));did('travelagencyform').classList.add('hidden')}
    inmodal = '';
    did('modalform').classList.add('hidden')
}
 
async function fetchtravels(id='',name) {
    // if(id)document.getElementsByClassName('updater')[0].click(id)
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchtravelagency', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledatat').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                did('tabledatat').innerHTML = request.data.map((item, index)=>`<tr>
        <td>${index + 1 }</td>
        <td>${item.agencyname}</td>
        <td>${item.email}</td>
        <td>${item.commission}</td>
        <td>${item.contact}</td>
        <td>${item.phone}</td>
        <td>${item.address}</td>
        <td>
            <div class="w-full h-full flex items-center justify-center gap-4">
                <button title="Edit row entry" onclick="event.preventDefault();fetchtravels('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
                <button title="Delete row entry"s onclick="fetchtravels('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
            </div>
        </td>
    </tr> `
    )
    .join('');
     did('travelagent').innerHTML = `<option value="">-- Select Travel Agency --</option><option class="bg-[green] text-white font-semibold">ADD TRAVEL AGENCY</option>`;
                did('travelagent').innerHTML += request.data.map(dat=>`<option value="${dat.id}">${dat.agencyname}</option>`).join('')
                if(name){
                    did('travelagent').value = request.data.filter(dat=>dat.agencyname == name)[0].id
                    returngroupcontent()
                }
            }
        }else{
             travelid = request.data[0].id
            populateData(request.data[0],'','','travelagencyform')
            // document.getElementById('foundby').value = request.data[0].foundbyname+' || '+request.data[0].foundby
        }
    }
    else return notification('No records retrieved')
}
async function fetchcompany(id='', name) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchcompanyforgroups', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledatac').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                did('tabledatac').innerHTML = request.data.map((item, index)=>`<tr>
                    <td>${index + 1 }</td>
                    <td>${item.companyname}</td>
                    <td>${item.email}</td>
                    <td>${item.contact}</td>
                    <td>${item.address}</td>
                    <td>
                        <div class="w-full h-full flex items-center justify-center gap-4">
                            <button title="Edit row entry" onclick="event.preventDefault();fetchcompany('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
                            <button title="Delete row entry"s onclick="fetchcompany('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
                        </div>
                    </td>
                </tr> `
                )
                .join('');
                did('company').innerHTML = `<option value="">-- Select Company --</option><option class="bg-[green] text-white font-semibold">ADD COMPANY</option>`;
                did('company').innerHTML += request.data.map(dat=>`<option value="${dat.id}">${dat.companyname}</option>`).join('')
                if(name){
                    did('company').value = request.data.filter(dat=>dat.companyname == name)[0].id
                    returngroupcontent()
                }
            }
        }else{
             companyid = request.data[0].id
            populateData(request.data[0],'','','companyform')
            // document.getElementById('foundby').value = request.data[0].foundbyname+' || '+request.data[0].foundby
        }
    }
    else return notification('No records retrieved')
}
async function fetchgroups(id='') {
    if(id)document.getElementsByClassName('updater')[0].click(id)
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchguestgroup', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, ongroupofguestsTableDataSignal)
            }
        }else{
             groupofguestsid = request.data[0].id
            populateData(request.data[0])
            // document.getElementById('foundby').value = request.data[0].foundbyname+' || '+request.data[0].foundby
        }
    }
    else return notification('No records retrieved')
}

async function ongroupofguestsTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1 }</td>
        <td>${item.groupname}</td>
        <td>${item.contact}</td>
        <td>${item.travelagent}</td>
        <td>${item.company}</td>
        <td>${item.email}</td>
        <td>${item.country}</td>
        <td>${item.city}</td>
        <td>${item.language}</td>
        <td>${item.grouptype}</td> 
        <td>${item.source}</td>
        <td>${item.industry}</td>
        <td>
            <div class="w-full h-full flex items-center justify-center gap-4">
                <button title="Edit row entry" onclick="event.preventDefault();fetchgroups('id','${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
                <button title="Delete row entry"s onclick="fetchgroups('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
            </div>
        </td>
    </tr> `
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function travelssubmithandle(){
    if(!validateForm('travelagencyform', getIdFromCls('compt')))return notification('some data are not provided...', 0)
    let payload

    payload = getFormData2(document.querySelector('#travelagencyform'), travelid ? [['id', travelid]] : '')
    let request = await httpRequest2('../controllers/travelagency', payload, document.querySelector('#travelagencyform #submittravel'))
    if(request.status) {
        
        travelid = ''
        if(inmodal == 'travelagent'){
            fetchtravels('', did('agencyname').value)
        }else{
            fetchtravels()
            fetchtravelsres()
            fetchgroupsres()
        }
        document.querySelector('#groupofguests').click();
        // fetchgroupofguestsn();
    // document.querySelector('#guestsform').reset();
        
        return notification(request.message, 1);
    } 
    // document.querySelector('#guestsform').reset();
    // fetchguestsreservations();
    return notification(request.message, 0);
}
async function companysubmithandle(){
    if(!validateForm('companyform', getIdFromCls('compp')))return notification('some data are not provided...', 0)
    let payload

    payload = getFormData2(document.querySelector('#companyform'), companyid ? [['id', companyid]] : '')
    let request = await httpRequest2('../controllers/companyforgroups', payload, document.querySelector('#companyform #submitcompany'))
    if(request.status) {
        
        companyid = ''
        if(inmodal == 'company'){
            fetchcompany('', did('companyname').value)
        }else{
            fetchcompany()
            fetchcompanyres()
            fetchgroupsres()
        }
        document.querySelector('#groupofguests').click();
        notification(request.message, 1);
        // document.querySelector('#groupofguests').click();
        // fetchgroupofguestsn();
        return
    } 
    // document.querySelector('#guestsform').reset();
    // fetchguestsreservations();
    return notification(request.message, 0);
}
async function groupssubmithandle(){
    if(!validateForm('groupofguestsform', getIdFromCls('comp')))return notification('some data are not provided...', 0)
    let payload

    payload = getFormData2(document.querySelector('#groupofguestsform'), companyid ? [['id', companyid]] : '')
    let request = await httpRequest2('../controllers/guestgroup', payload, document.querySelector('#groupofguestsform #submitgroups'))
    if(request.status) {
        
        companyid = ''
        // document.querySelector('#groupofguests').click();
    document.querySelector('#groupofguests').click();
        // fetchgroupofguestsn();
        notification(request.message, 1);
        fetchgroups()
        return
    } 
    // document.querySelector('#guestsform').reset();
    // fetchguestsreservations();
    return notification(request.message, 0);
}