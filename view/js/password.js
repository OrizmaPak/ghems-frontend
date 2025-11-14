window.onload = function() {
    let form = document.getElementById('passwordform')
    if(form.querySelector('button#submit')) form.querySelector('button#submit').addEventListener('click', passwordRecoverSubmitHander, false)
}

async function passwordRecoverSubmitHander() {
    if(!validatePasswordForm()) return

    let paramstr = new FormData(document.getElementById('passwordform'))
    let result = await httpRequest('../controllers/forgotpassword', paramstr, document.querySelector('button#submit'))
    if(result.status) {
        notification('Successful! Please check your email for new password', 1)
        setTimeout(() => window.location = './login.php', 3000)
    }
    else {
        if(result.message) return notification(result.message, 0)
        else return notification('Unable to reset password', 0)
    }
}

function validatePasswordForm() {

    let form = document.getElementById('passwordform')
    let errorElements = form.querySelectorAll('.control-error')
    let controls = []

    if(form.querySelector('#email').value.length < 1)  controls.push([form.querySelector('#email'), 'Provide your email address'])
    
    else if(!form.querySelector('#email').value.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) controls.push([form.querySelector('#email'), 'Email not a valid address'])

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