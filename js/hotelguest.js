let fullguestdata
async function hotelguestActive() {
    if(document.querySelector('#submitguestmodal')) document.querySelector('#submitguestmodal').addEventListener('click', e=>submitguestform('true'));
    await appendguestform()
    await fetallhotelguest()
    // await fetchhotelguest()
}

async function fetallhotelguest() {
    let request = await httpRequest2('../controllers/fetchguestbyfilter', null, null, 'json')
    if(request.status){
       datasource = request.data
       fullguestdata = request.data
        resolvePagination(datasource, onhotelguestTableDataSignal)
    }else return notification(request.message, 0)
}


function editguestHandler(id){
    let x = datasource.filter(item=>item.id == id)[0]
    if(x)populateData(x, [], [], 'guestmodalform')
    runoptioner(document.getElementsByName('manageguesty')[0])
}

function viewguestHandler(id){
    let x = datasource.filter(item=>item.id == id)[0]
    if(x)populateData(x, [], [], 'guestformview');
    document.getElementById('viewprofileofguest').classList.remove('hidden')
}

async function deleteguesthandler(id) {
    const result = await Swal.fire({
                        title: 'Delete Guest',
                        text: 'Are you sure you want to delete this guest?',
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No',
                        customClass: {
                          confirmButton: 'btn btn-md !bg-blue-500 !text-white mx-2',
                          cancelButton: 'btn btn-md !bg-red-500 !text-white mx-2'
                        },
                        buttonsStyling: false
                      });
                    
                      // Set the distribute variable based on user choice
                      let distribute;
                      if (result.isConfirmed) {
                        
                      } else if (result.isDismissed) {
                        return
                      } else {
                        return
                      }
                      
                      function param(){
                            let p = new FormData()
                            p.append('id', id)
                            return p
                        }
                    let request = await httpRequest2('../controllers/removeguest', param(), null, 'json')
                    if(request.status){
                        if(document.getElementById('hotelguest'))document.getElementById('hotelguest').click();
                        Swal.fire({
                          title: "Deleted Guest!",
                          text: "Guest was successfully deleted!",
                          icon: "success",
                          customClass: {
                          confirmButton: 'btn btn-md !bg-blue-500 !text-white mx-2',
                        },
                        buttonsStyling: false
                        });
                    }else{ 
                        if(document.getElementById('hotelguest'))document.getElementById('hotelguest').click();
                        Swal.fire({
                          title: "Error!",
                          text: "Failed to delete Guest!",
                          icon: "error",
                          customClass: {
                          confirmButton: 'btn btn-md !bg-blue-500 !text-white mx-2',
                        },
                        buttonsStyling: false
                        })
                    }
}

function searchguestbyanything(val) {
  let data = fullguestdata;

  if (val) {
    // Convert search term to lowercase for case-insensitive matching
    const searchTerm = val.toLowerCase();

    // Filter the data by checking if any field contains the search term
    data = fullguestdata.filter(guest => 
      Object.values(guest).some(field => 
        String(field).toLowerCase().includes(searchTerm)
      )
    );
  }
  // Pass the filtered data to the pagination function
  resolvePagination(data, onhotelguestTableDataSignal);
  console.log('log', data.length, datasource.length)
}



async function onhotelguestTableDataSignal() {
    try {
            let rows = getSignaledDatasource().map((item, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td class="flex items-center gap-3">
                        <button title="View Guest" onclick="viewguestHandler('${item.id}')" class="material-symbols-outlined rounded-full bg-white h-8 w-8 text-green-500 drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
                        <button title="Edit row entry" onclick="editguestHandler('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
                        <button title="Delete row entry" onclick="deleteguesthandler('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
                    </td>
                    <td>${item.title ?? ''} ${item.firstname ?? ''} ${item.lastname ?? ''} ${item.othernames === '-' ? '' : item.othernames ?? ''}</td>
                    <td>${item.phone ?? ''}</td>
                    <td>${item.nationality ?? ''}</td>
                    <td>${item.state ?? ''}</td>
                    <td>${item.city ?? ''}</td>
                    <td>${item.origin ?? ''}</td>
                    <td>${item.residentialaddress ?? ''}</td>
                    <td>${item.identityproof ?? ''}</td>
                </tr>`
            ).join('');
            
            injectPaginatatedTable(rows);
        
        } catch (error) {
            console.error('Error generating table rows:', error);
            // Handle error or display a user-friendly message
        }

}

function appendguestform(){
    if(did('guestmodalform'))did('guestmodalform').innerHTML =`
        
                                            <div class=" border rounded p-2 !mb-2 bg-[#d1f2f7]">
                                                <div class="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 cark:bg-gray-800 cark:text-blue-400" role="alert">
                                                  <span class="font-medium">Note!</span> When you enter an already existing phone number the form get filled automatically
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label text-md">phone</label>
                                                    <input type="tel" name="phone" id="phone" onchange="handlecheckinphone('phone')" class="bg-white form-control !p-2 comp bg-white" placeholder="Enter Phone Number">
                                                    <input type="hidden" id="id" name="id" />
                                                </div>
                                            </div>
                                            <div class=" border rounded p-2 !mb-2 bg-[#f5f5f5]">
                                                <div class="grid grid-cols-1 lg:grid-cols-2  gap-10">
                                                    <div class="grid grid-cols-1 lg:grid-cols-3  gap-10">
                                                        <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">title</label>
                                                        <select name="title" id="title" class="bg-white form-control !p-2 comp">
                                                            <option value="">-- Select Title --</option>
                                                            <option>Mr</option>
                                                            <option>Mrs</option>
                                                            <option>Miss</option>
                                                            <option>Ms</option>
                                                            <option>Master</option>
                                                            <option>Sir</option>
                                                            <option>Madam</option>
                                                            <option>Lord</option>
                                                            <option>Lady</option>
                                                            <option>Dame</option>
                                                            <option>Dr</option>
                                                            <option>Prof</option>
                                                            <option>Engr</option>
                                                            <option>Capt</option>
                                                            <option>Cmdr</option>
                                                            <option>Lt</option>
                                                            <option>Maj</option>
                                                            <option>Col</option>
                                                            <option>Gen</option>
                                                            <option>Rev</option>
                                                            <option>Rabbi</option>
                                                            <option>Imam</option>
                                                            <option>Sheikh</option>
                                                            <option>Hon</option>
                                                            <option>Sen</option>
                                                            <option>Rep</option>
                                                            <option>Amb</option>
                                                            <option>Pres</option>
                                                            <option>VP</option>
                                                            <option>Gov</option>
                                                            <option>Min</option>
                                                            <option>Sec</option>
                                                            <option>Dir</option>
                                                            <option>Duke</option>
                                                            <option>Duchess</option>
                                                            <option>Marquis</option>
                                                            <option>Marchioness</option>
                                                            <option>Earl</option>
                                                            <option>Countess</option>
                                                            <option>Viscount</option>
                                                            <option>Viscountess</option>
                                                            <option>Baron</option>
                                                            <option>Baroness</option>
                                                            <option>His/Her Excellency </option>
                                                            <option>His/Her Highness </option>
                                                            <option>His/Her Majesty </option>
                                                            <option>His/Her Holiness </option>
                                                            <option>His/Her Royal Highness</option>
                                                        </select>
                                                </div>
                                                        <div class="form-group col-span-2">
                                                            <label for="logoname" class="control-label text-md">first name</label>
                                                            <input type="text"  name="firstname" id="firstname" class="bg-white form-control !p-2 comp" placeholder="Enter First Name">
                                                    </div>
                                                    </div>
                                                    <div class="grid grid-cols-1 lg:grid-cols-2  gap-10">
                                                        <div class="form-group">
                                                            <label for="logoname" class="control-label text-md">last name</label>
                                                            <input type="text" name="lastname" id="lastname" class="bg-white form-control !p-2 comp" placeholder="Enter Last Name">
                                                    </div>
                                                        <div class="form-group">
                                                            <label for="logoname" class="control-label text-md">other names</label>
                                                            <input type="text"  name="othernames" id="othernames" class="bg-white form-control !p-2" placeholder="Enter Other Names">
                                                    </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div class="grid grid-cols-1  lg:grid-cols-2 gap-10">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label text-md">nationality</label>
                                                    <input type="text" name="nationality" id="nationality" class="bg-white form-control !p-2 comp" placeholder="Enter Nationality">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label text-md">residential address</label>
                                                    <textarea name="residentialaddress" id="residentialaddress" class="bg-white form-control !p-2" placeholder="Enter Residential Address"></textarea>
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label text-md">state</label>
                                                    <input type="text" name="state" id="state" class="bg-white form-control !p-2" placeholder="Enter State">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label text-md">City</label>
                                                    <input type="text" name="city" id="city" class="bg-white form-control !p-2 comp" placeholder="Enter City">
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label text-md">company name </label>
                                                    <input type="text" name="companyname" id="companyname" class="bg-white form-control !p-2" placeholder="Enter Company Name">
                                                </div>
                                                <div class="form-group">
                                                    <label for="logoname" class="control-label text-md">company address</label>
                                                    <textarea type="text" placeholder="Enter Company Name" name="companyaddress" id="companyaddress" class="bg-white form-control !p-2"></textarea>
                                                </div>
                                            </div>
                                            <div class=" border rounded p-2 !mb-2 bg-[#f5f5f5]">
                                                <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                                    <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                                        <div class="form-group">
                                                            <label for="logoname" class="control-label text-md">birth date</label>
                                                            <input type="date" name="birthdate" id="birthdate" class="bg-white form-control !p-2 " placeholder="Enter Company Name">
                                                        </div>
                                                        <div class="form-group">
                                                            <label for="logoname" class="control-label text-md">origin</label>
                                                             <select name="origin" id="origin" class="bg-white form-control !p-2 ">
                                                                <option>INDIGEN</option>
                                                                <option>FOREIGNER</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">identity proof  </label>
                                                        <select name="identityproof" id="identityproof" class="bg-white form-control !p-2 comp">
                                                            <option>DRIVERS LICENCE</option>
                                                            <option>INTERNATION PASSPORT</option>
                                                            <option>NATIONAL ID CARD</option>
                                                            <option>VOTERS CARD</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div name="removeitemm" class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">passport number</label>
                                                        <input type="text" name="passportnumber" id="passportnumber" class="bg-white form-control !p-2" placeholder="Enter Company Name">
                                                    </div>
                                                <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">issue date of passport</label>
                                                        <input type="date" name="issuedateofpassport" id="issuedateofpassport" class="bg-white form-control !p-2" placeholder="Enter issue date of passport">
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">expire date of passport</label>
                                                        <input type="date" name="expiredateofpassport" id="expiredateofpassport" class="bg-white form-control !p-2" placeholder="Enter issue date of passport">
                                                    </div>
                                                    </div>
                                                </div>
                                                <div name="removeitemm" class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                                    <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                                        <div class="form-group">
                                                            <label for="logoname" class="control-label text-md">visa number</label>
                                                            <input type="text" name="visanumber" id="visanumber" class="bg-white form-control !p-2" placeholder="Enter Visa Number">
                                                        </div>
                                                        <div class="form-group">
                                                            <label for="logoname" class="control-label text-md">visa type</label>
                                                            <input type="text" name="visatype" id="visatype" class="bg-white form-control !p-2" >
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">visa place of issue</label>
                                                        <input type="text" name="visaplaceofissue" id="visaplaceofissue" class="bg-white form-control !p-2" placeholder="Enter visa place of issue">
                                                    </div>
                                                </div>
                                                <div name="removeitemm" class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">passport place of issue</label>
                                                        <input type="text" name="passportplaceofissue" id="passportplaceofissue" class="bg-white form-control !p-2" placeholder="Enter passport place of issue ">
                                                    </div>
                                                <div class="grid grid-cols-1 lg:grid-cols-2 !mb-1 gap-10">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">issue date of visa</label>
                                                        <input type="date" name="issuedateofvisa" id="issuedateofvisa" class="bg-white form-control !p-2" placeholder="Enter issue date of passport">
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label text-md">expire date of visa</label>
                                                        <input type="date" name="expiredateofvisa" id="expiredateofvisa" class="bg-white form-control !p-2" placeholder="Enter expire date of passport">
                                                    </div>
                                                    </div>
                                                </div>
                                            </div>
                                                
                                                
                                                
                                                <div class="flex justify-end mt-5 gap-4 h-fit">
                                                 <button onclick="did('hotelguest').click()" type="button" class="w-full h-[35px] md:w-max text-white text-sm capitalize bg-red-400 p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Reset</span> 
                                                </button>
                                                 <button id="submitguestmodal" onclick="submitguestform('true')" type="button" class="w-full h-[35px] md:w-max text-white text-sm capitalize bg-blue-400 p-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                                                    <div class="btnloader" style="display: none;"></div>
                                                    <span>Submit</span> 
                                                </button>
                                            </div>
                                            
                                
                                        
    `
}