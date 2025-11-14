let useractivityid
async function useractivityActive() {
    const form = document.querySelector('#useractivityform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', useractivityFormSubmitHandler)
    datasource = []
    await fetchuseractivity()
}

async function fetchuseractivity(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchallusers', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
            did('email').innerHTML = `<option>-- Select User --</option>`
            did('email').innerHTML += request.data.map(data=>`<option value='${data.email}'>${data.firstname} ${data.lastname} ${data.othernames}</option>`)
                // datasource = request.data
                // resolvePagination(datasource, onuseractivityTableDataSignal)
            }
        }else{
             useractivityid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeuseractivity(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this useractivity?");

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
    fetchuseractivity()
    return notification(request.message);
    
}


async function onuseractivityTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${specialformatDateTime(item.created_at)}</td>
        <td>${item.status}</td>
        <td>${item.description}</td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function useractivityFormSubmitHandler() {
    if(!validateForm('useractivityform', [`email`, `startdate`, `enddate`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#useractivityform'), useractivityid ? [['id', useractivityid]] : null)
    let request = await httpRequest2('../controllers/fetchuseractivities', payload, document.querySelector('#useractivityform #submit'), 'json')
    if(request.status) {
        notification('Successful!', 1);
        datasource = request.data.sort((a, b) => {
  const dateA = new Date(b.created_at);
  const dateB = new Date(a.created_at);

  console.log('Date A:', dateA);
  console.log('Date B:', dateB);

  return dateA - dateB;
});
        resolvePagination(datasource, onuseractivityTableDataSignal)
        // document.querySelector('#useractivityform').reset();
        // fetchuseractivity();
        return
    }
    // document.querySelector('#useractivityform').reset();
    fetchuseractivity();
    return notification(request.message, 0);
}


// function runAduseractivityFormValidations() {
//     let form = document.getElementById('useractivityform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#useractivityname'))  controls.push([form.querySelector('#useractivityname'), 'useractivity name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }