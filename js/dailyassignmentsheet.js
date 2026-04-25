let dailyassignmentsheetid
let dailyassignmentsheetitem

async function dailyassignmentsheetActive() {
    dailyassignmentsheetid = ''
    const form = document.querySelector('#dailyassignmentsheetform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', dailyassignmentsheetFormSubmitHandler)
    datasource = []
    await fetchRoomsList()
    if(sessionStorage.getItem('viewdailyassignmensheetdata')){
        dailyassignmentsheetid = sessionStorage.getItem('viewdailyassignmensheetdata')
        await fetchdailyassignmentsheet(dailyassignmentsheetid)
    }
}

async function dailyassignmentsheetFormSubmitHandler() {
    const roomRows = Array.from(document.querySelectorAll('#roomcatalog [data-room-row="1"]'))
    if(!roomRows.length) return notification('No room rows found', 0)

    const rowsToSubmit = roomRows.filter(row => {
        const shift = row.querySelector('[name="shift"]')?.value
        const statusBefore = row.querySelector('[name="statusbeforeservice"]')?.value
        const statusAfter = row.querySelector('[name="statusafterservice"]')?.value
        return shift || statusBefore || statusAfter
    })

    if(!rowsToSubmit.length) return notification('Please fill at least one room assignment row', 0)

    let successCount = 0
    let failCount = 0
    let firstError = ''

    for(let i=0;i<rowsToSubmit.length;i++){
        const row = rowsToSubmit[i]
        const roomnumber = row.querySelector('[name="roomnumber"]')?.value || ''
        const roomname = row.querySelector('[name="roomname"]')?.value || ''
        const shift = row.querySelector('[name="shift"]')?.value || ''
        const timein = row.querySelector('[name="timein"]')?.value || ''
        const timeout = row.querySelector('[name="timeout"]')?.value || ''
        const statusbeforeservice = row.querySelector('[name="statusbeforeservice"]')?.value || ''
        const statusafterservice = row.querySelector('[name="statusafterservice"]')?.value || ''

        if(!roomnumber || !shift || !timein || !timeout || !statusbeforeservice || !statusafterservice){
            failCount++
            if(!firstError)firstError = `Row ${i+1}: Please complete room, shift, time and status fields`
            continue
        }

        const payload = new FormData()
        if(dailyassignmentsheetid)payload.set('id', dailyassignmentsheetid)
        payload.set('roomnumber', roomnumber)
        payload.set('roomname', roomname)
        payload.set('shift', shift)
        payload.set('timein', `${timein.split('T').join(' ')}:00`)
        payload.set('timeout', `${timeout.split('T').join(' ')}:00`)
        payload.set('statusbeforeservice', statusbeforeservice)
        payload.set('statusafterservice', statusafterservice)
        payload.set('rowsize', 0)
        payload.set('guestname', '')
        payload.set('noofpersons', 0)
        payload.set('requests', '')
        payload.set('lostandfounditems', '')

        const request = await httpRequest2('../controllers/assignmentsheet', payload, i == 0 ? document.querySelector('#dailyassignmentsheetform #submit') : null)
        if(request.status){
            successCount++
        }else{
            failCount++
            if(!firstError)firstError = request.message || `Row ${i+1}: Failed to save`
        }
    }

    if(successCount > 0 && failCount === 0){
        notification(`Saved ${successCount} assignment row(s) successfully`, 1)
        sessionStorage.removeItem('viewdailyassignmensheetdata')
        return
    }
    if(successCount > 0 && failCount > 0){
        return notification(`Saved ${successCount}, failed ${failCount}. ${firstError}`, 0)
    }
    return notification(firstError || 'No assignment rows were saved', 0)
}

async function fetchRoomsList(id) {
    let request = await httpRequest2('../controllers/fetchrooms.php', null, null, 'json')
    if(request.status) {
        if(request.data.length) {
            let options = request.data?.map( item => `
                <div class="flex flex-col md:flex-row bg-white p-5 gap-1 lg:items-end" data-room-row="1">
                    <div class="form-group w-max" >
                        <label for="logoname" class="control-label">Room</label>
                        <input type="text" name="roomnumber" id="roomnumber-${item.roomnumber}" class="form-control comp lg:w-[100px] !font-black !text-sm !py-2" value="${item.roomnumber}">
                    </div>
                    <div class="form-group">
                        <label for="logoname" class="control-label hidden">Room Number ${item.roomnumber}</label>
                        <input type="text" name="roomname" id="roomname-${item.roomnumber}" class="form-control comp" value="${item.roomname}">
                    </div>
                    <div class="form-group">
                        <label for="logoname" class="control-label">shift</label>
                        <select name="shift" id="shift-${item.roomnumber}" class="form-control comp">
                            <option value=''>-- Select Shift --</option>
                            <option>DAY SHIFT</option>
                            <option>NIGHT SHIFT</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="logoname" class="control-label">Time in</label>
                        <input type="datetime-local" name="timein" id="timein-${item.roomnumber}" class="form-control comp">
                    </div> 
                    <div class="form-group">
                        <label for="logoname" class="control-label">Time Out</label>
                        <input type="datetime-local" name="timeout" id="timeout-${item.roomnumber}" class="form-control comp">
                    </div>
                    <div class="form-group">
                        <label for="logoname" class="control-label">Status Before Service</label>
                        <select name="statusbeforeservice" id="statusbeforeservice-${item.roomnumber}" class="form-control comp">
                            <option value=''>-- Select Type --</option>
                            <option>AVAILABLE</option>
                            <option>OCCUPIED</option>
                            <option>STAY-OVER</option>
                            <option>ON-CHANGE</option>
                            <option>OUT-OF-ORDER</option>
                            <option>DIRTY</option>
                            <option>CLEAN</option>
                            <option>DIRTY-AVAILABLE</option>
                            <option>CLEAN-AVAILABLE</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="logoname" class="control-label">Status after Service</label>
                        <select name="statusafterservice" id="statusafterservice-${item.roomnumber}" class="form-control">
                            <option value=''>-- Select Type --</option>
                            <option>AVAILABLE</option>
                            <option>OCCUPIED</option>
                            <option>STAY-OVER</option>
                            <option>ON-CHANGE</option>
                            <option>OUT-OF-ORDER</option>
                            <option>DIRTY</option>
                            <option>CLEAN</option>
                            <option>DIRTY-AVAILABLE</option>
                            <option>CLEAN-AVAILABLE</option>
                        </select>
                    </div>
                </div>
            `).join('')
            try {
                document.getElementById('roomcatalog').innerHTML = options
            } catch(e) {console.log(e)}
        }
    }
    else return notification('No records retrieved')
}

async function fetchdailyassignmentsheet(id) {
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchassignmentsheets', id ? getparamm() : null, null, 'json')
    if(!request.status || !request.data?.assignmentsheet?.length) return

    const assignment = request.data.assignmentsheet[0]
    const roomnumber = String(assignment.roomnumber || '')
    const targetRow = Array.from(document.querySelectorAll('#roomcatalog [data-room-row="1"]'))
        .find(row => String(row.querySelector('[name="roomnumber"]')?.value || '') === roomnumber)
    if(!targetRow) return

    if(targetRow.querySelector('[name="shift"]'))targetRow.querySelector('[name="shift"]').value = assignment.shift || ''
    if(targetRow.querySelector('[name="statusbeforeservice"]'))targetRow.querySelector('[name="statusbeforeservice"]').value = assignment.statusbeforeservice || ''
    if(targetRow.querySelector('[name="statusafterservice"]'))targetRow.querySelector('[name="statusafterservice"]').value = assignment.statusafterservice || ''
    if(targetRow.querySelector('[name="timein"]') && assignment.timein)targetRow.querySelector('[name="timein"]').value = String(assignment.timein).replace(' ', 'T').slice(0,16)
    if(targetRow.querySelector('[name="timeout"]') && assignment.timeout)targetRow.querySelector('[name="timeout"]').value = String(assignment.timeout).replace(' ', 'T').slice(0,16)
}
