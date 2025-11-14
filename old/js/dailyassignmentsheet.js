let dailyassignmentsheetid
let dailyassignmentsheetitem
async function dailyassignmentsheetActive() {
    const form = document.querySelector('#dailyassignmentsheetform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', dailyassignmentsheetFormSubmitHandler)
    datasource = []
    await fetchRoomsList()
}

async function dailyassignmentsheetFormSubmitHandler() {}

async function fetchRoomsList(id) {
    let request = await httpRequest2('../controllers/fetchrooms.php', null, null, 'json')
    if(request.status) {
        if(request.data.length) {
            let options = request.data?.map( item => `
                <div class="flex flex-col md:flex-row bg-white p-5 gap-1 lg:items-end">
                    <div class="form-group w-max" >
                        <label for="logoname" class="control-label">Room</label>
                        <input type="text" name="roomnumber" id="roomnumber" class="form-control comp lg:w-[100px] !font-black !text-sm !py-2" value="${item.roomnumber}">
                    </div>
                    <div class="form-group">
                        <label for="logoname" class="control-label hidden">Room Number ${item.roomnumber}</label>
                        <input type="text" name="roomname" id="roomname" class="form-control comp" value="${item.roomname}">
                    </div>
                    <div class="form-group">
                        <label for="logoname" class="control-label">shift</label>
                        <select name="shift" id="shift" class="form-control comp">
                            <option value=''>-- Select Shift --</option>
                            <option>DAY SHIFT</option>
                            <option>NIGHT SHIFT</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="logoname" class="control-label">Time in</label>
                        <input type="datetime-local" name="timein" id="timein" class="form-control comp">
                    </div> 
                    <div class="form-group">
                        <label for="logoname" class="control-label">Time Out</label>
                        <input type="datetime-local" name="timeout" id="timeout" class="form-control comp">
                    </div>
                    <div class="form-group">
                        <label for="logoname" class="control-label">Status Before Service</label>
                        <select name="statusbeforeservice" id="statusbeforeservice" class="form-control comp">
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
                        <select name="statusafterservice" id="statusafterservice" class="form-control">
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