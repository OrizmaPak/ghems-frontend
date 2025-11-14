let salesreportid
async function salesreportActive() {
    recalldatalist()
    const form = document.querySelector('#salesreportform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', e=>fetchsalesreport())
    datasource = []
    await getAllUsers()
}

async function fetchsalesreport(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData(did('salesreportform'))
        if(id)paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchsales', getparamm(), document.querySelector('#salesreportform #submit'), 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onsalesreportTableDataSignal)
            }
        }else{
             salesreportid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removesalesreport(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this salesreport?");

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
    fetchsalesreport()
    return notification(request.message);
    
}


// async function onsalesreportTableDataSignal() {
//     let rows = getSignaledDatasource().map((item, index) => `
//     <tr>
//         <td>${item.index + 1 }</td>
//         <td>${item.saleentry.salespoint}</td>
//         <td>${item.saleentry.itemname}</td>
//         <td>  
//           ${item.itembuiltmemberitems.length > 0 ? `<table>
//                 ${item.itembuiltmemberitems.map((dat, index)=>{
//                     return ( index<3 ?
//                         `
//                     <tr>
//                         <td>${dat.itemname}</td>
//                         <td style="width: 20px">${dat.qty}</td>
//                     </tr>
//                     `
//                     :
//                       index==3?`
//                       <tr>
//                             <td onclick="modalsalesreport('${item.saleentry.id}')" style="color:green;cursor:pointer">click to view the remaining items ${item.saleentry.length-3} ....</td>
//                         </tr>
//                         `:``
//                     )
//                 }).join('')}
//             </table>` : 'No Item found in this build' }
//         </td>
//         <td>${specialformatDateTime(item.saleentry.builddate)}</td>
//         <td class="flex items-center gap-3">
//             <button title="View Item" onclick="modalsalesreport('${item.saleentry.id}')" class="material-symbols-outlined rounded-full bg-green-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
//             <button title="Edit row entry" onclick="sessionStorage.setItem('recipeid','${item.saleentry.id}');did('recipe').click()" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
//             <button title="Delete row entry"s onclick="removesalesreport('${item.compositeitem}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
//         </td>
//     </tr>`
//     )
//     .join('')
//     injectPaginatatedTable(rows)
// }
async function onsalesreportTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1 }</td>
        <td>${specialformatDateTime(item.saleentry.transactiondate)}</td>
        <td>${item.saleentry.reference}</td>
        <td>${item.saleentry.ownerid < 0 ? item.saledetail[0].description : item.saleentry.description}</td>
        <td>${formatNumber(item.saleentry.servicecharge)}</td>
        <td>${formatNumber(item.amountreceived)}</td>
        <td>${item.saleentry.paymentmethod}</td>
        <td>${item.saleentry.ownerid < 0 ? '-' : item.saleentry.ownerid}</td>
        <td class="flex items-center gap-3">
            <button title="View Item" onclick="modalsalesreport('${item.saleentry.reference}', '${item.saleentry.ownerid < 0 ? '' : item.saleentry.ownerid}')" class="material-symbols-outlined rounded-full bg-green-400 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
            <button title="Print sales" onclick="printsalesreceipt('${item.saleentry.reference}', '${item.saleentry.ownerid < 0 ? '' : item.saleentry.ownerid}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">print</button>
            <button title="Delete row entry"s onclick="removesalesreport('${item.compositeitem}')" class="hidden material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function modalsalesreport(ref, room=''){
    let rm = false
    if(room)rm = true
    if(!ref)return
    function getparamm() {
        let paramstr = new FormData();
        if(!room)paramstr.append('reference', ref);
        if(room)paramstr.append('roomnumber', room);
        return paramstr;
    }
    let request = await httpRequest2(`../controllers/${!room ? 'fetchsalesdetailbyref' : 'fetchroomtransactionhistory'}`, getparamm(), null, 'json');
    let data1 = datasource.filter(dat=>dat.saleentry.reference == ref)[0]
    if(request.status){
    let data = request.data
    if(!rm){
            did('tableheader').innerHTML = `
               <th>s/n </th>
                <th> Item ID </th>
                <th> Item Name </th>
                <th> qty </th>
                <th> PRICE </th>
                <th> TOTAL </th>
            `;
            did('modaldetails').innerHTML = `
                <p class="!text-sm font-thin"><img src="../images/${did('your_companylogo').value}" class="w-[100px] h-[100px]"></p>
                <div class="col-span-2">
                    <p class="!text-sm font-semibold flex w-full justify-between">Description: <span class="uppercase !text-sm font-normal text-left w-[50%]">${data1.saleentry.description}</span></p>
                    ${data1.saleentry.ownerid < 0 ? '' : `<p class="!text-sm font-semibold flex w-full justify-between">Room / CC: <span class="uppercase !text-sm font-normal text-left" style="">${data1.saleentry.ownerid}</span></p>`}
                    <p class="!text-sm font-semibold flex w-full justify-between">Total Amount: <span class="uppercase !text-sm font-normal text-left" style="">${formatNumber(data1.saleentry.servicecharge)}</span></p>
                    <p class="!text-sm font-semibold flex w-full justify-between">Amount Paid: <span class="uppercase !text-sm font-normal text-left" style="">${formatNumber(data1.amountreceived)}</span></p>
                    <p class="!text-sm font-semibold flex w-full justify-between">Ref: <span class="uppercase !text-sm font-normal text-left" style="">${data1.saleentry.reference}</span></p>
                    <p class="!text-sm font-semibold flex w-full justify-between">Payment Method: <span class="uppercase !text-sm font-normal text-left" style="">${data1.saleentry.paymentmethod}</span></p>
                    <p class="!text-sm font-semibold flex w-full justify-between">Transaction Date: <span class="uppercase !text-sm font-normal text-left" style="">${specialformatDateTime(data1.saleentry.transactiondate)}</span></p>
                    <div class="w-[150px] py-2 flex justify-center mx-8 bg-white p-5 rounded mt-2 bg-blue-400 hidden">
                        <span onclick="printDomContent('SALES REPORT', 'displaydetails')" class="cp material-symbols-outlined group-hover:text-primary-g scale-[1.5] text-white" style="font-size: 20px;">print</span>
                    </div>
                </div>
            `;
                
             did('tabledata2').innerHTML = 'No Items set for this composite item';
             if(data.length > 0 && data1.saleentry.ttype != 'ROOMS')did('tabledata2').innerHTML = data.map((dat, i)=>`
                    <tr>
                        <td>${i+1}</td>
                        <td>${dat.itemid}</td>
                        <td>${dat.itemname}</td>
                        <td style="width: 20px">${formatNumber(dat.qty)}</td>
                        <td style="width: 20px">${formatNumber(dat.cost)}</td>
                        <td style="width: 20px">${formatNumber(Number(dat.qty)*Number(dat.cost))}</td>
                    </tr>
             `).join('');
             if(data.length > 0 && data1.saleentry.ttype != 'ROOMS')did('tabledata2').innerHTML += `
                    <tr>
                        <td>TOTAL</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style="width: 20px">${formatNumber(data1.saleentry.credit)}</td>
                    </tr>
             `
    }
    
    if(rm){
        did('tableheader').innerHTML = `
            <th style="width: 20px">s/n</th> 
            <th>date</th>
            <th>Ref</th>
            <th>item</th>
            <th>debit</th>
            <th>credit</th>
            <th>balance</th>
        `;
        did('modaldetails').innerHTML = `
                <div>
                <p class="!text-sm font-thin"><img src="../images/${did('your_companylogo').value}" class="w-[100px] h-[100px]"></p>
                </div>
                <div class="col-span-2">
                    <p class="!text-sm font-semibold flex w-full justify-between">Description: <span class="uppercase !text-sm font-normal text-left w-[50%]">${data1.saleentry.description}</span></p>
                    ${data1.saleentry.ownerid < 0 ? '' : `<p class="!text-sm font-semibold flex w-full justify-between">Room / CC: <span class="uppercase !text-sm font-normal text-left" style="">${data1.saleentry.ownerid}</span></p>`}
                    <p class="!text-sm font-semibold flex w-full justify-between">Total Amount: <span class="uppercase !text-sm font-normal text-left" style="">${formatNumber(data1.saleentry.servicecharge)}</span></p>
                    <p class="!text-sm font-semibold flex w-full justify-between">Amount Paid: <span class="uppercase !text-sm font-normal text-left" style="">${formatNumber(data1.amountreceived)}</span></p>
                    <p class="!text-sm font-semibold flex w-full justify-between">Ref: <span class="uppercase !text-sm font-normal text-left" style="">${data1.saleentry.reference}</span></p>
                    <p class="!text-sm font-semibold flex w-full justify-between">Payment Method: <span class="uppercase !text-sm font-normal text-left" style="">${data1.saleentry.paymentmethod}</span></p>
                    <p class="!text-sm font-semibold flex w-full justify-between">Transaction Date: <span class="uppercase !text-sm font-normal text-left" style="">${specialformatDateTime(data1.saleentry.transactiondate)}</span></p>
                </div>
            `;
            let tt = 0
        did('tabledata2').innerHTML = request.data.transactions.map((item, index)=>{
            tt=tt+(Number(item.debit)-Number(item.credit))
            // S/N	ITEM	DEBIT	CREDIT	BALANCE
            if(index == 0 )return`
                <tr>
                    <td colspan="6"><p class="text-bold text-md">Balance Brought Forward:</p></td>
                    <td><p class="text-bold text-xl">${formatNumber(request.data.balance)}</p></td>
                </tr>
            `
            return `
                <tr>
                    <td>${index + 1 }</td>
                    <td>${specialformatDateTime(item.transactiondate)}</td>
                    <td>${item.marketer}</td>
                    <td>${item.description}</td>
                    <td>${formatNumber(item.debit, 0)}</td>
                    <td>${formatNumber(item.credit, 0)}</td>
                    <td>${formatNumber(tt, 0)}</td>
                </tr>
            `
        }).join('')
        did('tabledata2').innerHTML += `
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="text-bold">Total:</td>
                    <td>${formatNumber(tt)}</td>
                </tr>
            `
    }
    
     did('receiptsalesmodal').classList.add('hidden')
     did('salesreportmodal').classList.remove('hidden')
    }else{
        return notification(request.message, 0)
    }
}

async function printsalesreceipt(ref, room=''){
    let rm = false
    if(room)rm = true
    if(!ref)return
    let tt = 0;
    let html = '';
    if(rm){
        function getparamm() {
            let paramstr = new FormData();
            if(!room)paramstr.append('reference', ref);
            if(room)paramstr.append('roomnumber', room);
            return paramstr;
        }
        let request = await httpRequest2(`../controllers/${!room ? 'fetchsalesdetailbyref' : 'fetchroomtransactionhistory'}`, getparamm(), null, 'json');
        if(request.status){
           html =  request.data.transactions.map((item, index)=>{
                                                            tt=tt+(Number(item.debit)-Number(item.credit))
                                                            // S/N	ITEM	DEBIT	CREDIT	BALANCE
                                                            if(index == 0 )return`
                                                                <tr>
                                                                    <td colspan="3"><p class="text-bold text-md">Balance Brought Forward:</p></td>
                                                                    <td><p class="text-bold text-xl">${formatNumber(request.data.balance)}</p></td>
                                                                </tr>
                                                            `
                                                            return `
                                                                <tr>
                                                                    <td class="!text-xs">${item.description}</td>
                                                                    <td class="!text-xs">${formatNumber(item.debit, 0)}</td>
                                                                    <td class="!text-xs">${formatNumber(item.credit, 0)}</td>
                                                                    <td class="!text-xs">${formatNumber(tt, 0)}</td>
                                                                </tr>
                                                            `
                                                        }).join('')
          html += `
                    <tr>
                        <td></td>
                        <td></td>
                        <td class="text-bold">Total:</td>
                        <td>${formatNumber(tt)}</td>
                    </tr>
                `
        }
    }
        let data = datasource.filter(dat=>dat.saleentry.reference == ref)[0]
        did('displaydetails').innerHTML = `<img src="../images/${did('your_companylogo').value}" alt="chippz" style="width: 70px" class="mx-auto w-16 py-4" />
                                    <div class="flex flex-col justify-center items-center gap-2">
                                        <h4 class="font-semibold">${did('your_companyname').value}</h4>
                                        <p class="text-xs">${did('your_companyaddress').value}</p>
                                    </div>
                                    <div class="flex flex-col gap-3 border-b py-6 text-xs">
                                      <p class="flex justify-between">
                                        <span class="text-gray-400">Receipt No.:</span>
                                        <span>${data.saleentry.reference}</span>
                                      </p>
                                      ${data.saleentry.ownerid < 0 ? '' : `<p class="flex justify-between">
                                        <span clas="text-gray-400">Room / CC::</span>
                                        <span>${data.saleentry.ownerid}</span>
                                      </p>`}
                                      <p class="flex justify-between">
                                        <span class="text-gray-400">Total Amount:</span>
                                        <span>${formatNumber(data.saleentry.servicecharge)}</span>
                                      </p>
                                      <p class="flex justify-between">
                                        <span class="text-gray-400">Amount Paid:</span>
                                        <span>${formatNumber(data.amountreceived)}</span>
                                      </p>
                                      <p class="flex justify-between">
                                        <span class="text-gray-400">Payment Method:</span>
                                        <span>${data.saleentry.paymentmethod}</span>
                                      </p>
                                      <p class="flex justify-between">
                                        <span class="text-gray-400">Transaction Date:</span>
                                        <span>${specialformatDateTime(data.saleentry.transactiondate)}</span>
                                      </p>
                                    </div>
                                    <div class="flex flex-col gap-3 pb-6 pt-2 text-xs w-full">
                                      <table class="w-full text-left">
                                        <thead>
                                          ${!rm ? `<tr>
                                            <th class="min-w-[14px] py-2">s/n</th>
                                            <th class="min-w-[64px] py-2">Product</th>
                                            <th class="min-w-[14px] py-2">QTY</th>
                                            <th class="min-w-[44px] py-2">Price</th>
                                            <th class="min-w-[44px] py-2">Total</th>
                                          </tr>` : `<tr>
                                                <th>item</th>
                                                <th>debit</th>
                                                <th>credit</th>
                                                <th>balance</th>
                                          </tr>`}
                                        </thead>
                                        <tbody>
                                            ${!rm && data.saledetail.length > 0 && data.saleentry.ttype != 'ROOMS' 
                                              ? data.saledetail.map((dat, i) => `
                                                  <tr>
                                                      <td class="min-w-[44px] py-2">${i+1}</td>
                                                      <td class="min-w-[44px] py-2">${dat.itemname}</td>
                                                      <td class="min-w-[44px] py-2">${formatNumber(dat.qty)}</td>
                                                      <td class="min-w-[44px] py-2">${formatNumber(dat.cost)}</td>
                                                      <td class="min-w-[44px] py-2">${formatNumber(Number(dat.qty) * Number(dat.cost))}</td>
                                                  </tr>
                                                `).join('') 
                                              : ''}
                                            
                                            ${!rm && data.saledetail.length > 0 && data.saleentry.ttype != 'ROOMS'
                                              ? `
                                                  <tr>
                                                      <td></td>
                                                      <td></td>
                                                      <td></td>
                                                      <td>TOTAL</td>
                                                      <td style="width: 20px">${formatNumber(data.saleentry.credit)}</td>
                                                  </tr>
                                                `
                                              : ''}
                                              
                                              ${
                                                  rm ? `${
                                                    html
                                                  }` : ''
                                              }

                                        </tbody>
                                      </table>
                                      <div class=" border-b border border-dashed"></div>
                                      <div class="py-4 justify-center items-center flex flex-col gap-2">
                                        <p class="flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21.3 12.23h-3.48c-.98 0-1.85.54-2.29 1.42l-.84 1.66c-.2.4-.6.65-1.04.65h-3.28c-.31 0-.75-.07-1.04-.65l-.84-1.65a2.567 2.567 0 0 0-2.29-1.42H2.7c-.39 0-.7.31-.7.7v3.26C2 19.83 4.18 22 7.82 22h8.38c3.43 0 5.54-1.88 5.8-5.22v-3.85c0-.38-.31-.7-.7-.7ZM12.75 2c0-.41-.34-.75-.75-.75s-.75.34-.75.75v2h1.5V2Z" fill="#000"></path><path d="M22 9.81v1.04a2.06 2.06 0 0 0-.7-.12h-3.48c-1.55 0-2.94.86-3.63 2.24l-.75 1.48h-2.86l-.75-1.47a4.026 4.026 0 0 0-3.63-2.25H2.7c-.24 0-.48.04-.7.12V9.81C2 6.17 4.17 4 7.81 4h3.44v3.19l-.72-.72a.754.754 0 0 0-1.06 0c-.29.29-.29.77 0 1.06l2 2c.01.01.02.01.02.02a.753.753 0 0 0 .51.2c.1 0 .19-.02.28-.06.09-.03.18-.09.25-.16l2-2c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-.72.72V4h3.44C19.83 4 22 6.17 22 9.81Z" fill="#000"></path></svg>${did('your_companyemail').value}</p>
                                        <p class="flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path fill="#000" d="M11.05 14.95L9.2 16.8c-.39.39-1.01.39-1.41.01-.11-.11-.22-.21-.33-.32a28.414 28.414 0 01-2.79-3.27c-.82-1.14-1.48-2.28-1.96-3.41C2.24 8.67 2 7.58 2 6.54c0-.68.12-1.33.36-1.93.24-.61.62-1.17 1.15-1.67C4.15 2.31 4.85 2 5.59 2c.28 0 .56.06.81.18.26.12.49.3.67.56l2.32 3.27c.18.25.31.48.4.7.09.21.14.42.14.61 0 .24-.07.48-.21.71-.13.23-.32.47-.56.71l-.76.79c-.11.11-.16.24-.16.4 0 .08.01.15.03.23.03.08.06.14.08.2.18.33.49.76.93 1.28.45.52.93 1.05 1.45 1.58.1.1.21.2.31.3.4.39.41 1.03.01 1.43zM21.97 18.33a2.54 2.54 0 01-.25 1.09c-.17.36-.39.7-.68 1.02-.49.54-1.03.93-1.64 1.18-.01 0-.02.01-.03.01-.59.24-1.23.37-1.92.37-1.02 0-2.11-.24-3.26-.73s-2.3-1.15-3.44-1.98c-.39-.29-.78-.58-1.15-.89l3.27-3.27c.28.21.53.37.74.48.05.02.11.05.18.08.08.03.16.04.25.04.17 0 .3-.06.41-.17l.76-.75c.25-.25.49-.44.72-.56.23-.14.46-.21.71-.21.19 0 .39.04.61.13.22.09.45.22.7.39l3.31 2.35c.26.18.44.39.55.64.1.25.16.5.16.78z"></path></svg>${did('your_companyphone').value}</p>
                                      </div>
                                    </div>`
        did('salesreportmodal').classList.add('hidden')
        did('receiptsalesmodal').classList.remove('hidden')
    // }else{
        
    // }
}

async function salesreportFormSubmitHandler() {
    if(!validateForm('salesreportform', [`productname`, `productdescription`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#salesreportform'), salesreportid ? [['id', salesreportid]] : null)
    let request = await httpRequest2('../controllers/salesreportcript', payload, document.querySelector('#salesreportform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#salesreportform').reset();
        fetchsalesreport();
        return
    }
    document.querySelector('#salesreportform').reset();
    fetchsalesreport();
    return notification(request.message, 0);
}


// function runAdsalesreportFormValidations() {
//     let form = document.getElementById('salesreportform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#salesreportname'))  controls.push([form.querySelector('#salesreportname'), 'salesreport name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }