let generalaccountreportid
async function generalaccountreportActive() {
    if(document.querySelector('#submit')) document.querySelector('#submit').addEventListener('click', e=>fetchgeneralaccountreport())
    datasource = []
    await fetchgeneralaccountreport()
}

async function fetchgeneralaccountreport() {
    if(document.getElementById('autodetails'))document.getElementById('autodetails').remove()
    if(document.getElementById('tabledata'))document.getElementById('tabledata').innerHTML = `<tr>
                                                <td colspan="100%" class="text-center opacity-70">Loading...</td>
                                            </tr>`
    function getparamm(){
        let paramstr = new FormData(document.getElementById('generalaccountreportform'));
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchgeneraltransactions', getparamm(), document.querySelector('#submit'), 'json')
    document.getElementById('tabledata').innerHTML = `No records retrieved`;
    if(request.status) {
                datasource = request.data
                await resolvePagination(datasource, ongeneralaccountreportTableDataSignal)
                document.getElementById('tabledata').innerHTML += `
                                        <tr> 
                                            <td></td> 
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>${formatNumber(datasource.reduce((sum, item)=>sum+Number(item.Amount),0))}</td>
                                            <td>${formatNumber(datasource.reduce((sum, item)=>sum+Number(item.Consumption),0))}</td>
                                            <td>${formatNumber(datasource.reduce((sum, item)=>sum+Number(item['Service Charge']),0))}</td>
                                            <td>${formatNumber(datasource.reduce((sum, item)=>sum+Number(item.VAT),0))}</td>
                                            <td>${formatNumber(datasource.reduce((sum, item)=>sum+Number(item.Total),0))}</td>
                                        </tr> `
                if (document.getElementById('tabledata')) {
  const container = document.getElementById('tabledata').parentElement.parentElement;
  container.insertAdjacentHTML('afterbegin', `
    <!-- component -->
<div id="autodetails" class="max-w-full mx-4 py-2 sm:mx-auto sm:px-6 lg:px-4">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-1 w-full sm:my-2">
            <div class="bg-white p-1">
                <div class="sm:flex sm:items-start">
                    <div class="text-center sm:mt-0 sm:ml-2 sm:text-left">
                        <h3 class="text-xs leading-6 font-medium text-blue-400">Total Amount</h3>
                        <p class="text-md font-bold text-black opacity-[0.7]">${formatNumber(datasource.reduce((sum, item)=>sum+Number(item.Amount),0))}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-1 w-full sm:my-2">
            <div class="bg-white p-1">
                <div class="sm:flex sm:items-start">
                    <div class="text-center sm:mt-0 sm:ml-2 sm:text-left">
                        <h3 class="text-xs leading-6 font-medium text-blue-400">Total Consumption</h3>
                        <p class="text-md font-bold text-black opacity-[0.7]">${formatNumber(datasource.reduce((sum, item)=>sum+Number(item.Consumption),0))}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-1 w-full sm:my-2">
            <div class="bg-white p-1">
                <div class="sm:flex sm:items-start">
                    <div class="text-center sm:mt-0 sm:ml-2 sm:text-left">
                        <h3 class="text-xs leading-6 font-medium text-blue-400">Total Service Charge</h3>
                        <p class="text-md font-bold text-black opacity-[0.7]">${formatNumber(datasource.reduce((sum, item)=>sum+Number(item['Service Charge']),0))}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-1 w-full sm:my-2">
            <div class="bg-white p-1">
                <div class="sm:flex sm:items-start">
                    <div class="text-center sm:mt-0 sm:ml-2 sm:text-left">
                        <h3 class="text-xs leading-6 font-medium text-blue-400">Total VAT</h3>
                        <p class="text-md font-bold text-black opacity-[0.7]">${formatNumber(datasource.reduce((sum, item)=>sum+Number(item.VAT),0))}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-1 w-full sm:my-2">
            <div class="bg-white p-1">
                <div class="sm:flex sm:items-start">
                    <div class="text-center sm:mt-0 sm:ml-2 sm:text-left">
                        <h3 class="text-xs leading-6 font-medium text-blue-400">Grand Total</h3>
                        <p class="text-md font-bold text-black opacity-[0.7]">${formatNumber(datasource.reduce((sum, item)=>sum+Number(item.Total),0))}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</div>
  `);
}
    }
    else return notification(request.message, 0);
}


async function ongeneralaccountreportTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => {
    return ` 
    <tr> 
        <td>${index + 1 }</td> 
        <td>${formatDate(item.date)}</td>
        <td>${item.salespoint}</td>
        <td>${item.description}</td>
        <td>${formatNumber(item.Amount)}</td>
        <td>${formatNumber(item.Consumption)}</td>
        <td>${formatNumber(item['Service Charge'])}</td>
        <td>${formatNumber(item.VAT)}</td>
        <td>${formatNumber(item.Total)}</td>
    </tr> `}
    )
    .join('')
    injectPaginatatedTable(rows)
}



