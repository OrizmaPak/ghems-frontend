let qqqqqqqqqq = 0

function runpermissioncheck(state=''){
    if(!state && qqqqqqqqqq ==0)return
    if(state && qqqqqqqqqq ==0)qqqqqqqqqq = 1
    setTimeout(()=>{let x = window.location.href.split('=')[1]
//   console.log(window.location.href.split('=')[1], document.getElementById(x)); // Output: sales
    if(x && document.getElementById(x) && document.getElementById(x).classList.contains('hidden')){
         notification('You do not have permission to access this page', 0)
         return window.location.href = 'index.php?r=dashboard'
    }},2000)
    
}

function modifyButtons() {
    // Get all button elements in the DOM
    const buttons = document.querySelectorAll('button');
    
    // Loop through each button and modify its classes
    buttons.forEach(button => {
        // Find the initial gradient color
        const gradientClasses = Array.from(button.classList).filter(cls => cls.startsWith('from-'));
        let initialColorClass = gradientClasses.length > 0 ? gradientClasses[0] : null;

        // If an initial color class is found, convert it to a Tailwind background color class
        if (initialColorClass) {
            let backgroundColorClass = initialColorClass.replace('from-', 'bg-');
            button.classList.add(backgroundColorClass);
        }

        // Remove Tailwind classes that add rounded edges
        button.classList.remove('rounded', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-full', 'rounded-t-none', 'rounded-r-none', 'rounded-b-none', 'rounded-l-none', 'rounded-t-sm', 'rounded-r-sm', 'rounded-b-sm', 'rounded-l-sm', 'rounded-t-md', 'rounded-r-md', 'rounded-b-md', 'rounded-l-md', 'rounded-t-lg', 'rounded-r-lg', 'rounded-b-lg', 'rounded-l-lg', 'rounded-t-xl', 'rounded-r-xl', 'rounded-b-xl', 'rounded-l-xl', 'rounded-t-2xl', 'rounded-r-2xl', 'rounded-b-2xl', 'rounded-l-2xl', 'rounded-t-3xl', 'rounded-r-3xl', 'rounded-b-3xl', 'rounded-l-3xl', 'rounded-t-full', 'rounded-r-full', 'rounded-b-full', 'rounded-l-full');

        // Remove Tailwind classes that add gradients
        button.classList.remove('bg-gradient-to-t', 'bg-gradient-to-tr', 'bg-gradient-to-r', 'bg-gradient-to-br', 'bg-gradient-to-b', 'bg-gradient-to-bl', 'bg-gradient-to-l', 'bg-gradient-to-tl', 'from-transparent', 'via-transparent', 'to-transparent', 'from-current', 'via-current', 'to-current', 'from-black', 'via-black', 'to-black', 'from-white', 'via-white', 'to-white', 'from-gray-100', 'via-gray-100', 'to-gray-100', 'from-gray-200', 'via-gray-200', 'to-gray-200', 'from-gray-300', 'via-gray-300', 'to-gray-300', 'from-gray-400', 'via-gray-400', 'to-gray-400', 'from-gray-500', 'via-gray-500', 'to-gray-500', 'from-gray-600', 'via-gray-600', 'to-gray-600', 'from-gray-700', 'via-gray-700', 'to-gray-700', 'from-gray-800', 'via-gray-800', 'to-gray-800', 'from-gray-900', 'via-gray-900', 'to-gray-900', 'from-red-100', 'via-red-100', 'to-red-100', 'from-red-200', 'via-red-200', 'to-red-200', 'from-red-300', 'via-red-300', 'to-red-300', 'from-red-400', 'via-red-400', 'to-red-400', 'from-red-500', 'via-red-500', 'to-red-500', 'from-red-600', 'via-red-600', 'to-red-600', 'from-red-700', 'via-red-700', 'to-red-700', 'from-red-800', 'via-red-800', 'to-red-800', 'from-red-900', 'via-red-900', 'to-red-900');
           // Remove Tailwind classes that add rounded edges
        button.classList.remove('rounded', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-full', 'rounded-t-none', 'rounded-r-none', 'rounded-b-none', 'rounded-l-none', 'rounded-t-sm', 'rounded-r-sm', 'rounded-b-sm', 'rounded-l-sm', 'rounded-t-md', 'rounded-r-md', 'rounded-b-md', 'rounded-l-md', 'rounded-t-lg', 'rounded-r-lg', 'rounded-b-lg', 'rounded-l-lg', 'rounded-t-xl', 'rounded-r-xl', 'rounded-b-xl', 'rounded-l-xl', 'rounded-t-2xl', 'rounded-r-2xl', 'rounded-b-2xl', 'rounded-l-2xl', 'rounded-t-3xl', 'rounded-r-3xl', 'rounded-b-3xl', 'rounded-l-3xl', 'rounded-t-full', 'rounded-r-full', 'rounded-b-full', 'rounded-l-full');

        // Remove Tailwind classes that add gradients
        button.classList.remove('bg-gradient-to-t', 'bg-gradient-to-tr', 'bg-gradient-to-r', 'bg-gradient-to-br', 'bg-gradient-to-b', 'bg-gradient-to-bl', 'bg-gradient-to-l', 'bg-gradient-to-tl', 'from-transparent', 'via-transparent', 'to-transparent', 'from-current', 'via-current', 'to-current', 'from-black', 'via-black', 'to-black', 'from-white', 'via-white', 'to-white', 'from-gray-100', 'via-gray-100', 'to-gray-100', 'from-gray-200', 'via-gray-200', 'to-gray-200', 'from-gray-300', 'via-gray-300', 'to-gray-300', 'from-gray-400', 'via-gray-400', 'to-gray-400', 'from-gray-500', 'via-gray-500', 'to-gray-500', 'from-gray-600', 'via-gray-600', 'to-gray-600', 'from-gray-700', 'via-gray-700', 'to-gray-700', 'from-gray-800', 'via-gray-800', 'to-gray-800', 'from-gray-900', 'via-gray-900', 'to-gray-900', 'from-red-100', 'via-red-100', 'to-red-100', 'from-red-200', 'via-red-200', 'to-red-200', 'from-red-300', 'via-red-300', 'to-red-300', 'from-red-400', 'via-red-400', 'to-red-400', 'from-red-500', 'via-red-500', 'to-red-500', 'from-red-600', 'via-red-600', 'to-red-600', 'from-red-700', 'via-red-700', 'to-red-700', 'from-red-800', 'via-red-800', 'to-red-800', 'from-red-900', 'via-red-900', 'to-red-900');
    
    });
}




async function httpRequest(url, payload=null, button=null) {
    runpermissioncheck()
    

    try {

        let result, res;

        if(button) {  
            button.disabled = true 
        }

        if(button?.querySelector('.btnloader')) { 
            button.querySelector('.btnloader').style.display = 'block' 
        }

        if(payload) {
            result = await fetch(url, {method:'POST', body: payload, headers: new Headers()})
            if(result) {
                res = await result.json()
                if(res.message == 'Invalid ssession data. Proceed to login')return window.location.reload()
            }
            else return notification('Unable to perform request.', 0)
        }
        else {
           result = await fetch(url)
           if(result) {
            if(result.message == 'Invalid ssession data. Proceed to login')return window.location.reload()
             res = await result.text() 
             markallcomp()
            // let rest = await result.json()
           }
           else return notification('Unable to perform request.', 0)
           
        }
        var inputs = document.getElementsByTagName('input');

            // Loop through the inputs
            for (var i = 0; i < inputs.length; i++) {
                // Check if the input is of type "date"
                if (inputs[i].type === 'date') {
                    // Set the value to the current date (YYYY-MM-DD format)
                    var currentDate = new Date().toISOString().split('T')[0];
                    if(!inputs[i].value)inputs[i].value = currentDate;
                }
            }
        return res
    }
    catch(e) { 
        console.log(e)
    }
    finally {
        if(button) { 
            button.disabled = false 
        }
        if(button?.querySelector('.btnloader')) { 
            button.querySelector('.btnloader').style.display = 'none' 
        }
        // if(result.message == 'Invalid ssession data. Proceed to login')return window.location.reload()
        //  if(res.message == 'Invalid ssession data. Proceed to login')return window.location.reload()
         setDepartureTimetotwelveoclock();
         modifyButtons();
    }
 }

async function httpRequest2(url, payload=null, button=null, type="text") {
    runpermissioncheck()
    
    
    try {

        let result, res;

        if(button) { 
            button.disabled = true 
        }

        if(button?.querySelector('.btnloader')) { 
            button.querySelector('.btnloader').style.display = 'block' 
        }

        if(payload) {
            console.log('payload', payload)
            result = await fetch(url, {method:'POST', body: payload, headers: new Headers()})
            if(result) {
                // console.log('result', result)
                res = await result.json()
                markallcomp()
                if(res.message == 'Invalid ssession data. Proceed to login')return window.location.reload()
                // payload.forEach(function(value, key) {
                //     console.log(key + ": " + value);
                // });
                // console.log('response', res)
            } 
            else return notification('Unable to perform request.', 0)
        }
        else {
           result = await fetch(url)
           if(result) {
             if(type != "json")res = await result.text() 
             if(type == "json")res = await result.json() 
            //  let rest = await result.json()
            markallcomp()
            if(type != "json" && result.message == 'Invalid ssession data. Proceed to login')return window.location.reload()
                // console.log('response', res)
           }
           else return notification('Unable to perform request.', 0)
           
        }
        var inputs = document.getElementsByTagName('input');

            // Loop through the inputs
            for (var i = 0; i < inputs.length; i++) {
                // Check if the input is of type "date"
                if (inputs[i].type === 'date') {
                    // Set the value to the current date (YYYY-MM-DD format)
                    var currentDate = new Date().toISOString().split('T')[0];
                    if(!inputs[i].value)inputs[i].value = currentDate;
                }
            }
        return res
    }
    catch(e) { 
        console.log(e)
    }
    finally {
        if(button) { 
            button.disabled = false 
        }
        if(button?.querySelector('.btnloader')) { 
            button.querySelector('.btnloader').style.display = 'none' 
        }
        //  if(result.message == 'Invalid ssession data. Proceed to login')return window.location.reload()
        //  if(res.message == 'Invalid ssession data. Proceed to login')return window.location.reload()
         setDepartureTimetotwelveoclock(); 
         modifyButtons();
    }
 }

// Normalizes the fetchinventorylist response into a flat list of items
function normalizeInventoryItems(data) {
    if (!Array.isArray(data)) return []
    const isWrapped = data.some(entry => entry && typeof entry === 'object' && 'item' in entry)
    if (!isWrapped) return data
    return data.reduce((acc, curr) => {
        if (Array.isArray(curr?.item)) acc.push(...curr.item)
        else if (curr?.item) acc.push(curr.item)
        return acc
    }, [])
}


// THIS CODE IS TO MAKE SURE ALL DEPARTURE DATE TIME IS SET TO 12:00:00
function setDepartureTimetotwelveoclock() {
  if(document.getElementsByName('departuredate').length > 0){
      for(let i=0;i<document.getElementsByName('departuredate').length;i++){
          document.getElementsByName('departuredate')[i].addEventListener('blur', e=>{
              if(document.getElementsByName('departuredate')[i].value)document.getElementsByName('departuredate')[i].value = document.getElementsByName('departuredate')[i].value.split('T')[0]+'T12:00:00'
              if(document.getElementsByName('departuredate')[i].value)notification('Departure time will automatically be set to 12PM')
          })
      }
  }
}



function notification(message, type=undefined, timeout=5000) {

    let html;
    if(type === undefined) {
        html = `<span class="animate__animated animate__fadeInDown w-full md:w-[300px] lg:w-[400px] bg-white font-inter text-gray-900 font-medium text-2xs tracking-wide text-center p-3 first-letter:capitalize shadow-md border">${message}</span>`
    }
    else if(type === 0) {
        html = `<span class="animate__animated animate__fadeInDown w-full md:w-[300px] lg:w-[400px] bg-red-100 font-inter text-red-900 font-medium text-2xs tracking-wide text-center p-3 first-letter:capitalize">${message}</span>`
    }
    else if(type === 1) {
        html = `<span class="animate__animated animate__fadeInDown w-full md:w-[300px] lg:w-[400px] bg-green-100 font-inter text-green-900 font-medium text-2xs tracking-wide text-center p-3 first-letter:capitalize">${message}</span>`
    }

    let container = document.createElement('div')
    container.id = 'toast'
    container.innerHTML = html;
    container.classList.add('flex', 'items-center', 'w-full', 'top-0', 'justify-center', 'left-0', 'z-50', 'absolute', 'font-mont', 'px-2', 'py-2', 'lg:p-0')
    document.body.appendChild(container)

    setTimeout(() => document.getElementById('toast')?.remove(), timeout)
}

function controlHasValue(form, selector) {
    if(form.querySelector(selector))return form.querySelector(selector).value.length < 1
}

function mapValidationErrors(errorElements, controls) {

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



const loadScript = function (resource) {
    return new Promise(function (resolve, reject) {
        const script = document.createElement('script');
        script.src = resource.url;
        script.addEventListener('load', function () {
            intializePageJavascript()
            resolve(true);
        });
        document.body.appendChild(script);
    });
};

function getFormData(form) {
    let formdata = new FormData(form)
    return formdata
}

let paginationLimit = 10 
let filteredDataSource = []
let pageCount; 
let currentPage = 1; 
let prevRange; 
let currRange; 
let callback;
let datasource = []

function makePaginationMoveButton(type) {
    return `<button type="button" id="${type}-button" disabled>${type}</button>`
}

function initializePaginationMoveButtonsEventListeners() {

    const tableStatusWrap = document.querySelector('.table-status')
    
    tableStatusWrap.querySelector('#prev-button').addEventListener('click', () => {
        setCurrentPage(currentPage - 1); 
    })

    tableStatusWrap.querySelector('#next-button').addEventListener('click', () => {
        setCurrentPage(currentPage + 1); 
    })

    tableStatusWrap.querySelector('#pagination-limit').addEventListener('change', limitChange)

    document.querySelectorAll(".pagination-number").forEach((button) => {
        const pageIndex = Number(button.getAttribute("page-index"));         
        if (pageIndex)  button.addEventListener("click", () => {
            setCurrentPage(pageIndex); 
        });
    });

}

function limitChange() {
    el = document.querySelector('#pagination-limit')
    paginationLimit = +(el.options[el.selectedIndex].value)
    setCurrentPage(1)
}

const handleActivePageNumber = () => {
    document.querySelectorAll(".pagination-number").forEach((button) => {
        button.classList.remove("active");
        const pageIndex = Number(button.getAttribute("page-index"));
        if (pageIndex == currentPage)  button.classList.add("active")
    });
};

const handlePageButtonsStatus = () => {
    const tableStatusWrap = document.querySelector('.table-status')
    if (currentPage === 1)  disableButton(tableStatusWrap.querySelector('#prev-button'));
    else  enableButton(tableStatusWrap.querySelector('#prev-button'))
    if (pageCount === currentPage) disableButton(tableStatusWrap.querySelector('#next-button'))  
    else enableButton(tableStatusWrap.querySelector('#next-button')) 
 };

const disableButton = (button) => {
    button.classList.add("disabled");
    button.setAttribute("disabled", true);
};

const enableButton = (button) => {
    button.classList.remove("disabled");
    button.removeAttribute("disabled");
};

function getSignaledDatasource() {
    return JSON.parse(sessionStorage.getItem('datasource'))
}

function getSignaledPaginationStatus() {
    return sessionStorage.getItem('p-status')
}

function getSignaledPaginationNumbers() {
    return sessionStorage.getItem('p-numbers')
}

async function getPaginationNumbers (){
    let str = ''
    pageCount = Math.ceil(datasource.length / paginationLimit);
    for (let i = 1; i <= pageCount; i++) {
      str += `<button class="pagination-number" type="button" aria-label="Page ${i}" page-index="${i}">${i}</button>`;
    }
    return str
};

function addPaginationStatus() {

    template = `
        ${getSignaledPaginationStatus()}
        <span class=" flex justify-between gap-6">
            <span>
                <select id="pagination-limit" class="form-control !bg-white cursor-pointer">
                    <option value="" selected="true">10</option>
                    <option value="20" >20</option>
                    <option value="30">30</option>
                    <option value="35">35</option>
                    <option value="40">40</option>
                    <option value="70">70</option>
                    <option value="100">100</option>
                    <option value="150">150</option>
                    <option value="200">200</option>
                    <option value="250">250</option>
                    <option value="500">500</option>
                    <option value="750">750</option>
                    <option value="1000">1000</option>
                    <option value="1500">1500</option>
                </select>
            </span>
            <span class="flex pagination">
                ${ makePaginationMoveButton('prev') }
                ${ getSignaledPaginationNumbers() }
                ${ makePaginationMoveButton('next') }
            </span>
        </span>
    `
    document.querySelector('.table-status').innerHTML = template
}

function resolvePagination(data, cb) {
    datasource = data;
    setCurrentPage(1)
    callback = cb
 }
 
 
 function setCurrentPage(pageNum) {
    document.querySelector('#tabledata').innerHTML = `
        <tr>
            <td colspan="100%" class="text-center opacity-70">
                <span class="loader mx-auto"></span>
            </td>
        </tr`
    currentPage = pageNum;
    prevRange = (pageNum - 1) * paginationLimit;
    currRange = pageNum * paginationLimit;
    if (datasource.length) {
        filteredDataSource = []
        for(let i=0; i<datasource.length; i++) {
            if (i >= prevRange && i < currRange) {
                filteredDataSource.push({index: i, ...datasource[i]})
            }
        }
        sendStorageSignal(filteredDataSource)
    }
}

async function sendStorageSignal(filteredDataSource) {
    sessionStorage.setItem('datasource', JSON.stringify(filteredDataSource))
    let itemsAvailable = getSignaledDatasource().length;

    let status = `<span class="text-xs text-gray-500">Showing ${ prevRange + 1 }  to ${ itemsAvailable >= currRange * currRange ? (-prevRange + currRange ) + itemsAvailable : itemsAvailable + prevRange} of ${ datasource.length } Records </span> `

    let pageNumbers = await getPaginationNumbers()
    let pageNumberTemplate = `<span id="pagination-numbers"> ${pageNumbers} </span>`

    sessionStorage.setItem('p-status', status)
    sessionStorage.setItem('p-numbers', pageNumberTemplate)
    callback()
}


function injectPaginatatedTable(rows) {
    document.querySelector('#tabledata').innerHTML = rows
    addPaginationStatus()
    handleActivePageNumber();
    handlePageButtonsStatus()
    initializePaginationMoveButtonsEventListeners()
    sessionStorage.removeItem('p-status')
    sessionStorage.removeItem('p-numbers')
    sessionStorage.removeItem('datasource')
}

function logoff() {
    let request = httpRequest('')
    window.location.href = './login.php'
}


var printDomContent = (header, contentid, path = `<link rel="stylesheet" type="text/css" media="print" href="./css/index.css"><link rel="stylesheet" type="text/css" media="print" href="./css/user.css"><link rel="stylesheet" type="text/css" media="print" href="./css/style.css"><link rel="stylesheet" type="text/css" media="print" href="./css/css_vanilla.css">`) => {
    let content = document.getElementById(`${contentid}`);
    

    var winPrint = window.open(`${header}`, '', 'width=1000,height=900');
    winPrint.document.write('<html><head><title></title>');
    winPrint.document.write(`${path}`);
    winPrint.document.write(`<h1 style="text-align:center;font-weight:400px;text-transform:uppercase;font-size:14px;">${header}</h1>` + content.innerHTML);
    winPrint.document.write('<script src="https://cdn.tailwindcss.com"></script>');
    winPrint.document.write('<script type="text/javascript">addEventListener("load", () => { print(); close(); })</script></body></html>');
    winPrint.document.close();
    winPrint.focus();
    
}


function printRegistrationCard(content) {
    let div = document.createElement('div')
    div.innerHTML = content;
    div.id = 'card';
    div.className = 'pr-only'
    if(document.getElementById('card')) document.getElementById('card').remove()
    document.body.appendChild(div)
    printDomContent('', 'card')
}
