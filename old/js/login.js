window.onload = function() {
    getlocationnn()
    let form = document.getElementById('loginform')
    if(form) {
         if(form.querySelector('button#submit')) form.querySelector('button#submit').addEventListener('click', submitHander, false)
         if(form.querySelector('#password')) form.querySelector('#password').addEventListener('keypress', e => enterEvent(e))
    }
    verifyorganisationlicencea()
 }
 
 function enterEvent(event) {
    if(event.key.includes('Enter'))submitHander()
 }
 
 async function getlocationnn() {
    let param = new FormData()
    param.append('locationtype', 'OFFICE')
     let result = await httpRequest('../controllers/fetchlocation', param, null)
        //  result = JSON.parse(result)
     if(result.status) {
         document.getElementById('location').innerHTML += result.data.map(dat=>`<option value="${dat.id}">${dat.location}</option>`).join('')
     }else { 
         notification(result.message, 0)
     }
 
 }
 async function verifyorganisationlicencea() {
    let param = new FormData()
     let result = await httpRequest('../controllers/verifyorganisationlicencea', null, null)
         result = JSON.parse(result)
         console.log(result)
     if(result.status) {
         document.getElementById('consentcontainer').innerHTML = ``
     }else { 
         document.getElementById('consentcontainer').innerHTML = `<span class="h-14 w-14 flex">
                            <span class="material-symbols-outlined m-auto text-gray-300">verified_user</span>
                        </span>
                        <span class="flex items-center gap-2">
                            <input type="checkbox" name="consent" id="consent" class="p-3 placeholder:text-xs placeholder:text-gray-500 font-semibold text-sm focus:outline-none focus:ring-0 focus:border-transparent bg-transparent">
                            <label for="consent" class="text-gray-500 font-normal capitalize text-sm font-heebo">I Agree to the <a class="text-blue-400 underline" href="https://miratechnologiesng.com/privacy">Terms & Conditions</a></label>
                        </span>`
     }
 
 }
 async function submitHander() {
     if(!runLoginValidations()) return
 
     let result = await httpRequest('../controllers/loginscript', getLoginFormParams(), document.querySelector('button#submit'))
     if(result.status) {
         notification('Login Successful', 1)
         sessionStorage.setItem('user', JSON.stringify(result.data.data))
         setTimeout(() => window.location.href = './index.php?r=dashboard', 1000)
     }else { 
         if(result.code == 204) return notification('Incorrect email or password', 0)
         else if(result.code == 300) return notification('Account is unverified', 0)
         else return notification('Unable to sign in. please try again', 0)
     }
 
 }
 
 function getLoginFormParams() {
     let paramstr = new FormData(document.getElementById('loginform'))
     paramstr.append('upw', document.getElementById('loginform').password.value)
     if(document.getElementById('consent'))paramstr.append('consent', document.getElementById('consent').checked ? 'YES' : 'NO')
     return paramstr
 }
 
 
 function runLoginValidations() {
     let form = document.getElementById('loginform')
     let errorElements = form.querySelectorAll('.control-error')
     let controls = []
 
     if(form.querySelector('#email').value.length < 1)  controls.push([form.querySelector('#email'), 'Email is required'])
     else if(!form.querySelector('#email').value.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) controls.push([form.querySelector('#email'), 'Email not a valid address'])
 
     if(form.querySelector('#password').value.length < 1)  controls.push([form.querySelector('#password'), 'password is required'])
     if(form.querySelector('#location').value.length < 1)  controls.push([form.querySelector('#location'), 'Location is required'])
 
     errorElements.forEach( item => {
         item.previousElementSibling.style.borderColor = '';
         item.remove()
     })
 
     if(controls.length) {
         controls.map( item => {
             let errorElement = document.createElement('span')
             errorElement.classList.add('control-error','dom-entrance')
             let control = item[0] , mssg = item[1]
             errorElement.textContent = mssg;
             control.parentElement.appendChild(errorElement)            
         })
         return false
     }
     
     return true
 
 }
 