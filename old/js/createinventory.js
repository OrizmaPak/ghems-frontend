let createinventoryid
let departmenthtml
async function createinventoryActive() {
    did('submit').addEventListener('click', createinventoryFormSubmitHandler) 
    datasource = []
    let request = await httpRequest2('../controllers/fetchdepartments', null, null, 'json')
    if(request.status) {
        departmenthtml = request.data.filter(dat=>dat.applyforsales == 'NON STOCK' || dat.applyforsales == 'STOCK').map(data=>`<div class="border  p-2 flex m-1 gap-3 w-fit pr-4">
                            <input class="cp" name="${data.department}"  type="checkbox"/> 
                            <label class="cp" onclick="this.previousElementSibling.click()">${data.department}</label>
                        </div>`).join('');
        if(departmenthtml){
            did('loading').remove();
            did('createinventoryform').classList.remove('hidden');
            did('departmt').innerHTML = departmenthtml
        }
    }else return notification(request.message, 0);
    // await fetchcreateinventorys()
}

async function createinventoryFormSubmitHandler(){
    did('submit').children[0].style.display = 'flex'
    for(let i=0;i<document.getElementsByClassName('comp').length;i++){
        if(!document.getElementsByClassName('comp')[i].value){
            let label = document.getElementsByClassName('comp')[i].previousElementSibling.textContent
            notification(`${label} doesnt have a value`, 0)
            let ini = document.getElementsByClassName('comp')[i].style.borderColor
            document.getElementsByClassName('comp')[i].style.borderColor = 'red';
            document.getElementsByClassName('comp')[i].style.color = 'red';
                document.getElementsByClassName('comp')[i].value = '';
            setTimeout(()=>{
                document.getElementsByClassName('comp')[i].style.borderColor = ini;
                document.getElementsByClassName('comp')[i].style.color = 'black';
            },4000)
            
            return
        }
    }
    
    function params(){
        let param = new FormData();
            param.append(`rowsize`, document.getElementsByName('itemname').length)
        for(let i=0;i<document.getElementsByName('itemname').length;i++){
            param.append(`itemname${i+1}`, document.getElementsByName('itemname')[i].value)
            param.append(`units${i+1}`, document.getElementsByName('units')[i].value)
            param.append(`cost${i+1}`, document.getElementsByName('cost')[i].value)
            param.append(`price${i+1}`, document.getElementsByName('price')[i].value)
            param.append(`price_two${i+1}`, document.getElementsByName('price_two')[i].value) 
            param.append(`beginbalance${i+1}`, document.getElementsByName('beginbalance')[i].value)
            param.append(`groupname${i+1}`, document.getElementsByName('groupname')[i].value)
            param.append(`applyto${i+1}`, document.getElementsByName('applyto')[i].value)
            param.append(`reorderlevel${i+1}`, document.getElementsByName('rlevel')[i].value)
            param.append(`composite${i+1}`, document.getElementsByName('composite')[i].value) 
            param.append(`description${i+1}`, document.getElementsByName('description')[i].value)
            param.append(`itemclass${i+1}`, document.getElementsByName('itemclass')[i].value) 
            param.append(`minbalance${i+1}`, document.getElementsByName('minbalance')[i].value) 
            let x = document.getElementsByName('itemname')[i].parentElement.parentElement.children[2]
            let y = ''; 
            for(let j=0;j<x.children.length;j++){
                if(x.children[j].children[0].checked && y)y=y+'|'+x.children[j].children[0].getAttribute('name')
                if(x.children[j].children[0].checked && !y)y=x.children[j].children[0].getAttribute('name')
            }
            param.append(`salespoint${i+1}`, y)
            
            
        }
        return param
    }
    params()
    let request = await httpRequest2('../controllers/inventoryscript', params(), document.querySelector('#productitemsform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#createinventory').click()
        return
    }
    document.querySelector('#createinventory').click();
    return notification(request.message, 0);
}

function runItemNo(){
    for(let i=0;i<document.getElementById('createinventorycontainer').children.length;i++){
        document.getElementsByName('itemno')[i].children[0].innerHTML = `Item ${i+1}`;
    }
}

function addform (){
    const element = document.createElement('div')
    element.classList.add('flex')
    element.classList.add('flex-col')
    element.classList.add('mb-10')
    let x = `
                               
                                <p name="itemno" class="page-title !mb-4">
                                    <span>Item 1</span>
                                </p>
                                    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                        <div  class="relative top-[-15px] w-full justify-end h-fit flex gap-5">
                                            <button title="Collapse" onclick="this.parentElement.parentElement.nextElementSibling.classList.contains('hidden') ? this.parentElement.parentElement.nextElementSibling.classList.remove('hidden') : this.parentElement.parentElement.nextElementSibling.classList.add('hidden')"  class="!z-[1] material-symbols-outlined rounded-full bg-[#969696] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">menu</button>
                                            <button title="Add Item" onclick="addform();runItemNo()" class="relative material-symbols-outlined rounded-full bg-[green] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">add</button>
                                            <button title="Delete" onclick="this.parentElement.parentElement.parentElement.remove()" class=" material-symbols-outlined rounded-full bg-[red] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">remove</button>
                                        </div>
                                         
                                            <div class="grid grid-cols-1 gap-6">
                                                <div class="form-group relative">
                                                    <label for="logoname" class="control-label flex justify-between">Item Name</label>
                                                    <input type="text" name="itemname" class="form-control comp" placeholder="Enter Name of Item">
                                                </div>
                                                <label class="text-xl font-medium opacity-[0.7]">Department / Sales Point</label>
                                                <div id="departmt" class="min-h-[100px] h-fit flex flex-wrap rounded bg-[#5757570f] p-4">
                                                    ${departmenthtml}
                                                </div>
                                            </div> 
                                        </div>
                                        <div class="">
                                            <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 !pt-0 rounded-sm">
                                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Units</label>
                                                        <select name="units" id="units" class="form-control comp">
                                                            <option value=''>-- Select Unit --</option>
                                                            <option>PCS</option>
                                                            <option>YARDS</option>
                                                            <option>KG</option>
                                                            <option>SETS</option>
                                                            <option>METRES</option>
                                                            <option>LITRES</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Cost</label>
                                                        <input type="number" value="" name="cost" class="form-control" placeholder="Enter Cost of Item">
                                                    </div>
                                                </div>
                                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Price</label>
                                                        <input type="number" value="" name="price" class="form-control" placeholder="Set Price"/>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Price Two</label>
                                                        <input type="number" value="" name="price_two" class="form-control" placeholder="Set Price"/>
                                                    </div>
                                                </div>  
                                                </div> 
                                            </div>
                                            <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 !pt-0 rounded-sm">
                                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Begin Balance</label>
                                                        <input type="number" value="" name="beginbalance" class="form-control" placeholder="Enter Begin Balance">
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Minimum Balance</label>
                                                        <input type="number" value="" name="minbalance" class="form-control" placeholder="Enter Minimum Balance">
                                                    </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Group Name</label>
                                                        <input type="text" value="" name="groupname" class="form-control" placeholder="Enter Group Name">
                                                    </div>
                                                </div> 
                                            </div>
                                            <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 !pt-0 rounded-sm">
                                               <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">apply to</label>
                                                        <select name="applyto" id="applyto" class="form-control comp">
                                                            <option value=''>-- Select Apply To --</option>
                                                            <option>FOR SALE</option>
                                                            <option>NOT FOR SALE</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">item class</label>
                                                        <select name="itemclass" id="itemclass" class="form-control comp">
                                                            <option value=''>-- Select Item Class --</option>
                                                            <option>STOCK-ITEM</option>
                                                            <option>NON STOCK-ITEM</option>
                                                        </select>
                                                    </div>
                                                    </div>
                                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Reorder Level</label>
                                                        <input type="text" value="" name="rlevel" class="form-control" placeholder="Enter reorder level">
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Composite</label>
                                                        <select name="composite" id="composite" class="form-control">
                                                            <option value=''>-- Select Composite --</option>
                                                            <option>YES</option>
                                                            <option selected>NO</option>
                                                        </select>
                                                    </div>
                                                    </div>
                                                </div> 
                                            </div>
                                            <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 !pt-0 rounded-sm">
                                                <div class="grid grid-cols-1 gap-6">
                                                    <div class="form-group">
                                                        <label for="logoname" class="control-label">Description</label>
                                                        <input type="text" name="description" class="form-control" placeholder="Enter Item Description">
                                                    </div>
                                                </div> 
                                            </div>
                                            </div>
                                        
                                `
    element.innerHTML = x
    did('createinventorycontainer').appendChild(element)
    runItemNo()
}


