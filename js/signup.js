window.onload = function() {
    getlocationnn()
    let form = document.getElementById('signupform')
    if(form) {
         if(form.querySelector('button#submit')) form.querySelector('button#submit').addEventListener('click', submitHander, false)
         if(form.querySelector('#password')) form.querySelector('#password').addEventListener('keypress', e => enterEvent(e))
         if(form.querySelector('#confirmpassword')) form.querySelector('#confirmpassword').addEventListener('keypress', e => enterEvent(e))
    }
 }
 
 function enterEvent(event) {
    if(event.key.includes('Enter')) submitHander()
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
 
 function isValidPassword(password) {
   const hasMinimumLength = password.length >= 8;
   const containsLetter = /[a-zA-Z]/.test(password);
   const containsNumber = /\d/.test(password);
   return hasMinimumLength && containsLetter && containsNumber;
}


 async function submitHander() { 
     if(!runSignupValidations()) return
 
     let result = await httpRequest('../controllers/userscript', getSignupFormParams(), document.querySelector('button#submit'))
     if(result) {
        if(result.status && result.code == 200) {
            notification('Account created successfull', 1)
            setTimeout(() => window.location = './login.php', 2000)
        }
        else {
             if(result.message) return  notification(result.message, 0)
             else return  notification('Unable to register your account. try again..', 0)
         }
    }
     else return  notification('Unable to register your account. try again..', 0)
        
 }
 
 function getSignupFormParams() {
     let paramstr = new FormData(document.getElementById('signupform'))
     paramstr.append('upw', document.getElementById('signupform').password.value)
     return paramstr
 }

 function runSignupValidations() {
     let form = document.getElementById('signupform')
     let errorElements = form.querySelectorAll('.control-error')
     let controls = []
     if(form.querySelector('#location').value.length < 1)  controls.push([form.querySelector('#location'), 'location is required'])
     if(form.querySelector('#firstname').value.length < 1)  controls.push([form.querySelector('#firstname'), 'First name is required'])
     if(form.querySelector('#lastname').value.length < 1)  controls.push([form.querySelector('#lastname'), 'Last name is required'])
     if(form.querySelector('#othernames').value.length < 1)  controls.push([form.querySelector('#othernames'), 'Other names is required'])
     if(form.querySelector('#email').value.length < 1)  controls.push([form.querySelector('#email'), 'Email is required'])
     else if(!form.querySelector('#email').value.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) controls.push([form.querySelector('#email'), 'Email not a valid address'])
     if(form.querySelector('#phone').value.length < 1)  controls.push([form.querySelector('#phone'), 'phone is required'])
     if(form.querySelector('#address').value.length < 1)  controls.push([form.querySelector('#address'), 'address is required'])
     if(form.querySelector('#password').value.length < 1)  controls.push([form.querySelector('#password'), 'Password is required'])
     else if(form.querySelector('#password').value.length < 8) controls.push([form.querySelector('#password'), 'Password should be minimum of 8 characters'])
     else if(!isValidPassword(form.querySelector('#password').value)) controls.push([form.querySelector('#password'), 'Passwords should contains letters and digits'])
     
     if(form.querySelector('#confirmpassword').value.length < 1)  controls.push([form.querySelector('#confirmpassword'), 'Confirm password is required'])
     else if(form.querySelector('#confirmpassword').value.trim() !== form.querySelector('#password').value.trim())  controls.push([form.querySelector('#confirmpassword'), 'Passwords does not match'])
 
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
