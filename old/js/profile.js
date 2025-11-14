let profileid
async function profileActive() {
    const form = document.querySelector('#profilesform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', profileFormSubmitHandler)
   async function profileFormSubmitHandler(){
    if(!validateForm('profilesform', [`email`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#profilesform'), profileid ? [['id', profileid]] : null)
    let request = await httpRequest2('../controllers/userscript', payload, document.querySelector('#profilesform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#profilesform').reset();
        fetchprofiles();
        return
    }
    document.querySelector('#profilesform').reset();
    fetchprofiles();
    return notification(request.message, 0);
}
    await profileuserlist()
    await profiledepartment()
    await fetchprofiles()
}

async function profileuserlist() {
    let request = await httpRequest('../controllers/fetchusers')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            document.getElementById('supervisorid').innerHTML += request.data.map(data=>`<option value="${data.id}">${data.firstname} ${data.lastname}</option>`).join('')
        }
    }
    else return notification('No records retrieved')
}

async function profiledepartment() {
    let request = await httpRequest('../controllers/fetchlocation')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            document.getElementById('departmentid').innerHTML += request.data.filter(data=>data.locationtype == 'DEPARTMENT').map(data=>`<option value="${data.id}">${data.location}</option>`).join('')
        }
    }
    else return notification('No records retrieved')
}

async function fetchprofiles(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
    paramstr.append('email', JSON.parse(sessionStorage.getItem('user')).email)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchuserprofile', getparamm(), null, 'json')
    if(request.status) {
            if(request) {
                populateData(request)
            }
    }
    else return notification('No records retrieved')
}
