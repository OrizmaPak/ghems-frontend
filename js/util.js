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

function computePageCount(){
    return Math.max(1, Math.ceil((datasource?.length || 0) / paginationLimit))
}

function getSignaledDatasource() {
    return filteredDataSource
}

function getSignaledPaginationStatus() {
    return paginationComponent.getStatusMarkup()
}

function getSignaledPaginationNumbers() {
    return paginationComponent.getNumberButtonsMarkup()
}

const paginationComponent = {
    getStatusWrap() {
        return document.querySelector('.table-status')
    },

    getStatusMarkup() {
        const total = datasource.length
        const start = total ? prevRange + 1 : 0
        const end = Math.min(currRange, total)
        return `Showing ${start} to ${end} of ${total} records`
    },

    getNumberButtonsMarkup() {
        pageCount = computePageCount()
        const buildButton = (page) => `<button class="pagination-number ${page === currentPage ? 'active' : ''}" type="button" aria-label="Page ${page}" page-index="${page}">${page}</button>`
        const ellipsis = `<span class="pagination-ellipsis" aria-hidden="true">...</span>`
        const windowSize = 2

        if (pageCount <= 9) {
            let markup = ''
            for (let i = 1; i <= pageCount; i++) markup += buildButton(i)
            return `<span id="pagination-numbers">${markup}</span>`
        }

        const pages = new Set([1, pageCount])
        for(let i = currentPage - windowSize; i <= currentPage + windowSize; i++){
            if(i > 1 && i < pageCount) pages.add(i)
        }
        if(currentPage <= 4) { pages.add(2); pages.add(3); pages.add(4) }
        if(currentPage >= pageCount - 3) { pages.add(pageCount - 1); pages.add(pageCount - 2); pages.add(pageCount - 3) }

        const orderedPages = Array.from(pages).sort((a,b)=>a-b)
        let markup = ''
        for(let i=0; i<orderedPages.length; i++){
            const page = orderedPages[i]
            const previous = orderedPages[i - 1]
            if(i > 0 && page - previous > 1) markup += ellipsis
            markup += buildButton(page)
        }
        return `<span id="pagination-numbers">${markup}</span>`
    },

    render() {
        const wrap = this.getStatusWrap()
        if(!wrap) return

        const template = `
            <div class="pagination-shell">
                <span class="pagination-meta">${this.getStatusMarkup()}</span>
                <span class="flex pagination" aria-label="Pagination">
                    <button type="button" id="prev-button" class="pager-arrow" aria-label="Previous page" ${currentPage <= 1 ? 'disabled' : ''}>&lsaquo;</button>
                    ${this.getNumberButtonsMarkup()}
                    <button type="button" id="next-button" class="pager-arrow" aria-label="Next page" ${currentPage >= pageCount ? 'disabled' : ''}>&rsaquo;</button>
                </span>
            </div>
        `

        wrap.innerHTML = template
        this.attachEvents(wrap)
    },

    attachEvents(wrap) {
        if(wrap.dataset.paginationBound === '1') return

        wrap.addEventListener('click', (event) => {
            const target = event.target?.closest('button')
            if(!target) return

            if(target.id === 'prev-button') return setCurrentPage(currentPage - 1)
            if(target.id === 'next-button') return setCurrentPage(currentPage + 1)

            const pageIndex = Number(target.getAttribute('page-index'))
            if(pageIndex) setCurrentPage(pageIndex)
        })

        wrap.dataset.paginationBound = '1'
    }
}

function resolvePagination(data, cb) {
    callback = typeof cb === 'function' ? cb : function(){}
    datasource = Array.isArray(data) ? data : []
    setCurrentPage(1)
 }
 
 
function setCurrentPage(pageNum) {
    pageCount = computePageCount()
    currentPage = Math.min(Math.max(pageNum, 1), pageCount)
    const tableBody = document.querySelector('#tabledata')
    if(tableBody){
        tableBody.innerHTML = `
            <tr>
                <td colspan="100%" class="text-center opacity-70">
                    <span class="loader mx-auto"></span>
                </td>
            </tr>`
    }
    prevRange = (currentPage - 1) * paginationLimit
    currRange = currentPage * paginationLimit
    filteredDataSource = []
    for(let i=0; i<datasource.length; i++) {
        if (i >= prevRange && i < currRange) {
            filteredDataSource.push({index: i, ...datasource[i]})
        }
    }
    sendStorageSignal(filteredDataSource)
}

async function sendStorageSignal(filteredDataSource) {
    callback()
}


function injectPaginatatedTable(rows) {
    const tableBody = document.querySelector('#tabledata')
    if(tableBody){
        tableBody.innerHTML = rows || `<tr><td colspan="100%" class="text-center opacity-70"> Table is empty</td></tr>`
    }
    paginationComponent.render()
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

