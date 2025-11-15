let roomstatusid
async function roomstatusActive() {
    const form = document.querySelector('#roomstatusform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', fetchallroomstatus)
    datasource = []
    await fetchallroomstatus()
    // await fetchroomstatus()
}

async function fetchallroomstatus() {
    did('roomer').innerHTML = ''
    notification('Loading...')
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('arrivaldate', did('arrivaldate').value)
        paramstr.append('departuredate', did('departuredate').value)
        return paramstr
    }
    let request = await httpRequest2('../controllers/getallroomstatus', getparamm(), did('submit'), 'json')
    if(request.status) { 
        let map = request.data
        datasource = request.data
        if(did('roomstatuser').value == ''){
            map = request.data
        }else{
            map = request.data.filter(dat=>dat.roomstatus == did('roomstatuser').value)
        }
        if(map.length<1){
            did('roomer').innerHTML = 'No Room found for this category'
            return
        }
        // did('roomer').innerHTML = map.map((data, i)=>`
        //      <div class="w-full h-fit p-7 bg-white">
        //                                     <hr/>
        //                                         <div class="flex flex-col lg:flex-row flex-wrap gap-4">
        //                                             <div class="p-2 flex flex-col min-w-[200px]">
        //                                                 <label for="logoname" class="control-label !font-bold">room name:</label>
        //                                                 <p class="control-label">${data.roomname}</p>
        //                                             </div>
        //                                             <div class="p-2 flex flex-col min-w-[200px]">
        //                                                 <label for="logoname" class="control-label !font-bold">Building:</label>
        //                                                 <p class="control-label">${data.building}</p>
        //                                             </div>
        //                                             <div class="p-2 flex flex-col min-w-[200px]">
        //                                                 <label for="logoname" class="control-label !font-bold">category:</label>
        //                                                 <p class="control-label">${data.roomcategory}</p>
        //                                             </div>
        //                                             <div class="p-2 flex flex-col min-w-[200px]">
        //                                                 <label for="logoname" class="control-label !font-bold">floor:</label>
        //                                                 <p class="control-label">${data.floor}</p>
        //                                             </div>
        //                                             <div class="p-2 flex flex-col min-w-[200px]">
        //                                                 <label for="logoname" class="control-label !font-bold">room number:</label>
        //                                                 <p class="control-label">${data.roomnumber}</p>
        //                                             </div>
        //                                             <div class="p-2 flex flex-col min-w-[200px]">
        //                                                 <label for="logoname" class="control-label !font-bold">room status:</label>
        //                                                 <p class="control-label">${data.roomstatus}</p>
        //                                             </div>
        //                                             <div class="p-2 flex flex-col min-w-[200px]">
        //                                                 <label for="logoname" class="control-label !font-bold">floor:</label>
        //                                                 <p class="control-label">${data.roomname}</p>
        //                                             </div>
        //                                             <div class="p-2 flex flex-col min-w-[200px]">
        //                                                 <label for="logoname" class="control-label !font-bold">room status description:</label>
        //                                                 <p class="control-label">${data.roomstatusdescription}</p>
        //                                             </div>
        //                                             <div class="p-2 flex flex-col min-w-[200px]">
        //                                                 <label for="logoname" class="control-label !font-bold">description:</label>
        //                                                 <p class="control-label">${data.description}</p>
        //                                             </div>
        //                                             <div class="p-2 flex flex-col min-w-[200px]">
        //                                                 <label for="logoname" class="control-label !font-bold">image:</label>
        //                                                 <p class="control-label"><img src="../images/${data.imageurl1}" class="w-[200px] h-[200px] hover:scale-[2] transition-all" /></p>
        //                                             </div>
        //                                             <div class="p-2 flex flex-col min-w-[200px]">
        //                                                 <label for="logoname" class="control-label !font-bold">image:</label>
        //                                                 <p class="control-label"><img src="../images/${data.imageurl2}" class="w-[200px] h-[200px] hover:scale-[2] transition-all" /></p>
        //                                             </div>
        //                                         </div>
        //                                             <div class="p-2 flex gap-4 w-full justify-end">
        //                                                 <button title="check-In" onclick="viewroomdetails('${data.roomnumber}')" class="material-symbols-outlined slide-fwd-center rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
        //                                                 <button title="Check-Out" class="${data.roomstatus == 'OCCUPIED' ? '' : 'hidden '}material-symbols-outlined slide-fwd-center rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">exit_to_app</button>
        //                                             </div>
                                                    // ${data.roomstatus == 'AVAILABLE' ? `<button onclick="sessionStorage.setItem('roomsetting', '${data.categoryid}_${data.roomnumber}');did('checkin').click()" type="button" class="mx-1 text-white bg-[#2BAD5D] hover:bg-[#2BAD5D]/90  font-medium text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2">
                                                    // <span class="material-symbols-outlined slide-fwd-center">check</span>
                                                    // &nbsp;&nbsp;Check In
                                                    // </button>
                                                    // <button onclick="sessionStorage.setItem('roomsetting', '${data.categoryid}_${data.roomnumber}');did('guestsreservations').click()" type="button" class="mx-1 text-white bg-[#AD522B] hover:bg-[#AD522B]/90  font-medium text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2">
                                                    // <span class="material-symbols-outlined slide-fwd-center">check</span>
                                                    // &nbsp;&nbsp;Reserve
                                                    // </button>` : ''}
                                                    
                                                    // ${data.roomstatus == 'OCCUPIED' ? `<button type="button" class="mx-1 text-white bg-[#AD2B2B] hover:bg-[#AD2B2B]/90  font-medium text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2">
                                                    // <span class="material-symbols-outlined slide-fwd-center">groups</span>
                                                    // &nbsp;&nbsp;Check out
                                                    // </button>
                                                    // <button type="button" class="mx-1 text-white bg-[#2B7FAD] hover:bg-[#2B7FAD]/90  font-medium text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2">
                                                    // <span class="material-symbols-outlined slide-fwd-center">groups</span>
                                                    // &nbsp;&nbsp;View Check In
                                                    // </button>` : ''}
                                                    
                                                    // ${data.roomstatus == 'RESERVED' ? `<button type="button" class="mx-1 text-white bg-[#2B7FAD] hover:bg-[#2B7FAD]/90  font-medium text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2">
                                                    // <span class="material-symbols-outlined slide-fwd-center">check</span>
                                                    // &nbsp;&nbsp;View Reservation
                                                    // </button>
                                                    // <button type="button" class="mx-1 text-white bg-[#2BAD5D] hover:bg-[#2BAD5D]/90  font-medium text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2">
                                                    // <span class="material-symbols-outlined slide-fwd-center">check</span>
                                                    // &nbsp;&nbsp;Check In
                                                    // </button>
                                                    // <button type="button" class="mx-1 text-white bg-[#AD2B2B] hover:bg-[#AD2B2B]/90  font-medium text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2">
                                                    // <span class="material-symbols-outlined slide-fwd-center">check</span>
                                                    // &nbsp;&nbsp;Cancel Reservation
                                                    // </button>` : ''}
        //                                     <hr/>
        //                                 </div>
        // `).join('')
        did('roomer').innerHTML = map.map((data, i)=>{
            // Determine status colors and gradients
            let statusConfig = {
                'AVAILABLE': {
                    gradient: 'from-emerald-500 via-green-500 to-teal-500',
                    bgGradient: 'from-emerald-50/90 via-green-50/90 to-teal-50/90',
                    borderColor: 'border-emerald-400/50',
                    statusColor: 'text-emerald-700',
                    statusBg: 'bg-emerald-100/80',
                    icon: 'check_circle',
                    pulse: 'animate-pulse'
                },
                'OCCUPIED': {
                    gradient: 'from-red-500 via-rose-500 to-pink-500',
                    bgGradient: 'from-red-50/90 via-rose-50/90 to-pink-50/90',
                    borderColor: 'border-red-400/50',
                    statusColor: 'text-red-700',
                    statusBg: 'bg-red-100/80',
                    icon: 'person',
                    pulse: ''
                },
                'RESERVED': {
                    gradient: 'from-amber-500 via-orange-500 to-yellow-500',
                    bgGradient: 'from-amber-50/90 via-orange-50/90 to-yellow-50/90',
                    borderColor: 'border-amber-400/50',
                    statusColor: 'text-amber-700',
                    statusBg: 'bg-amber-100/80',
                    icon: 'event',
                    pulse: ''
                }
            };
            let config = statusConfig[data.roomstatus] || statusConfig['AVAILABLE'];
            
        return`
             <div class="room-status-card group relative w-full max-w-[320px] h-auto
                    bg-gradient-to-br ${config.bgGradient}
                    backdrop-blur-xl bg-white/70
                    border ${config.borderColor} border-2
                    rounded-2xl shadow-xl overflow-hidden
                    transition-all duration-500 ease-out
                    hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1
                    ${data.roomstatus == 'AVAILABLE' ? 'hover:border-emerald-500' : ''}
                    ${data.roomstatus == 'OCCUPIED' ? 'hover:border-red-500' : ''}
                    ${data.roomstatus == 'RESERVED' ? 'hover:border-amber-500' : ''}
                    animate-fade-in"
                    style="animation-delay: ${i * 0.05}s"
                    id="room-card-${data.roomnumber}">
                    
                    <!-- Status Badge Top Right -->
                    <div class="absolute top-4 right-4 z-10">
                        <div class="relative">
                            <div class="absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-full blur-md opacity-60 ${config.pulse}"></div>
                            <div class="relative ${config.statusBg} backdrop-blur-sm px-4 py-1.5 rounded-full border ${config.borderColor} border-2 shadow-lg">
                                <div class="flex items-center gap-2">
                                    <span class="material-symbols-outlined text-sm ${config.statusColor}">${config.icon}</span>
                                    <span class="text-xs font-bold ${config.statusColor} uppercase tracking-wide">${data.roomstatus}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Collapse/Expand Toggle Button -->
                    <button onclick="toggleRoomCard('${data.roomnumber}')" 
                            class="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border-2 ${config.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group/toggle hover:scale-110"
                            id="toggle-btn-${data.roomnumber}">
                        <span class="material-symbols-outlined text-gray-700 transition-transform duration-300" id="toggle-icon-${data.roomnumber}">expand_more</span>
                    </button>
                    
                    <!-- Room Image Section (Always Visible) -->
                    <div class="relative h-32 room-image-collapsed overflow-hidden bg-gradient-to-br ${config.gradient} transition-all duration-500">
                        <div class="absolute inset-0 bg-black/20"></div>
                        <img src="../images/${data.imageurl1 || 'emptyrooom.png'}" 
                             alt="${data.roomname}" 
                             class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                             onerror="this.src='../images/emptyrooom.png'">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        <!-- Room Number Badge (Collapsed View) -->
                        <div class="absolute bottom-3 left-3 right-3">
                            <div class="bg-white/95 backdrop-blur-md rounded-xl px-3 py-2 shadow-xl border border-white/50">
                                <div class="flex items-center justify-between">
                                    <div class="flex-1">
                                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Room ${data.roomnumber}</p>
                                        <p class="text-lg font-bold ${config.statusColor}">${data.roomname || 'N/A'}</p>
                                    </div>
                                    <div class="w-10 h-10 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg">
                                        <span class="material-symbols-outlined text-white text-xl">meeting_room</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Expanded Image Section (Hidden when collapsed) -->
                    <div class="room-details-expanded hidden">
                        <div class="relative h-48 w-full overflow-hidden bg-gradient-to-br ${config.gradient}">
                            <div class="absolute inset-0 bg-black/20"></div>
                            <img src="../images/${data.imageurl1 || 'emptyrooom.png'}" 
                                 alt="${data.roomname}" 
                                 class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                 onerror="this.src='../images/emptyrooom.png'">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            
                            <!-- Room Number Badge (Expanded View) -->
                            <div class="absolute bottom-4 left-4 right-4">
                                <div class="bg-white/95 backdrop-blur-md rounded-xl px-4 py-3 shadow-xl border border-white/50">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Room Number</p>
                                            <p class="text-2xl font-bold ${config.statusColor} mt-1">${data.roomnumber}</p>
                                        </div>
                                        <div class="w-12 h-12 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg">
                                            <span class="material-symbols-outlined text-white text-2xl">meeting_room</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Content Section (Collapsible) -->
                    <div class="room-details-expanded hidden p-5 space-y-4">
                        <!-- Room Name -->
                        <div class="space-y-1">
                            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                <span class="material-symbols-outlined text-sm">hotel</span>
                                Room Name
                            </p>
                            <p class="text-lg font-bold text-gray-800">${data.roomname || 'N/A'}</p>
                        </div>
                        
                        <!-- Room Details Grid -->
                        <div class="grid grid-cols-2 gap-3">
                            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/50 shadow-sm hover:shadow-md transition-all">
                                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                                    <span class="material-symbols-outlined text-xs">business</span>
                                    Building
                                </p>
                                <p class="text-sm font-bold text-gray-800">${data.building || 'N/A'}</p>
                            </div>
                            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/50 shadow-sm hover:shadow-md transition-all">
                                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                                    <span class="material-symbols-outlined text-xs">layers</span>
                                    Floor
                                </p>
                                <p class="text-sm font-bold text-gray-800">${data.floor || 'N/A'}</p>
                            </div>
                            ${data.roomcategory ? `
                            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/50 shadow-sm hover:shadow-md transition-all col-span-2">
                                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                                    <span class="material-symbols-outlined text-xs">category</span>
                                    Category
                                </p>
                                <p class="text-sm font-bold text-gray-800">${data.roomcategory}</p>
                            </div>
                            ` : ''}
                        </div>
                        
                        <!-- Status Description -->
                        ${data.roomstatusdescription ? `
                        <div class="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/50">
                            <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                                <span class="material-symbols-outlined text-xs">info</span>
                                Status Details
                            </p>
                            <p class="text-sm text-gray-700 leading-relaxed">${data.roomstatusdescription}</p>
                        </div>
                        ` : ''}
                        
                        <!-- Action Buttons -->
                        <div class="flex flex-wrap gap-2 pt-2">
                            ${data.roomstatus == 'AVAILABLE' ? `
                                <button onclick="sessionStorage.setItem('roomsetting', '${data.categoryid}_${data.roomnumber}');did('checkin').click()" 
                                        type="button" 
                                        class="flex-1 group/btn bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                                    <span class="material-symbols-outlined text-lg">check_circle</span>
                                    <span>Check In</span>
                                </button>
                                <button onclick="sessionStorage.setItem('roomsetting', '${data.categoryid}_${data.roomnumber}');did('guestsreservations').click()" 
                                        type="button" 
                                        class="flex-1 group/btn bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                                    <span class="material-symbols-outlined text-lg">event</span>
                                    <span>Reserve</span>
                                </button>
                            ` : ''}
                            
                            ${data.roomstatus == 'OCCUPIED' ? `
                                <button type="button" 
                                        class="flex-1 group/btn bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                                    <span class="material-symbols-outlined text-lg">logout</span>
                                    <span>Check Out</span>
                                </button>
                                <button type="button" 
                                        class="flex-1 group/btn bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                                    <span class="material-symbols-outlined text-lg">visibility</span>
                                    <span>View</span>
                                </button>
                            ` : ''}
                            
                            ${data.roomstatus == 'RESERVED' ? `
                                <button onclick="viewroomreservationcheckin('${data.reservationid}', this)" 
                                        type="button" 
                                        class="flex-1 group/btn bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                                    <span class="material-symbols-outlined text-lg">visibility</span>
                                    <span>View</span>
                                </button>
                                <button onclick="sessionStorage.setItem('checkinfromsomewhere', '${data.reservationid}');did('reservationcheckin').click()" 
                                        type="button" 
                                        class="flex-1 group/btn bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                                    <span class="material-symbols-outlined text-lg">check_circle</span>
                                    <span>Check In</span>
                                </button>
                                <button type="button" 
                                        class="flex-1 group/btn bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                                    <span class="material-symbols-outlined text-lg">close</span>
                                    <span>Cancel</span>
                                </button>
                            ` : ''}
                        </div>
                        
                        <!-- View Images & Transactions -->
                        <div class="flex gap-2 pt-2 border-t border-gray-200/50">
                            <button onclick="openRoomImageModal('${data.roomnumber}', '../images/${data.imageurl1}', '../images/${data.imageurl2}')" 
                                    class="flex-1 group/btn bg-white/80 hover:bg-white backdrop-blur-sm text-gray-700 hover:text-gray-900 font-medium text-xs px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-1.5 border border-gray-200/50">
                                <span class="material-symbols-outlined text-base">photo_library</span>
                                <span>Images</span>
                            </button>
                            <button onclick="openmodalforoccupancy('${data.roomnumber}')" 
                                    class="flex-1 group/btn bg-white/80 hover:bg-white backdrop-blur-sm text-gray-700 hover:text-gray-900 font-medium text-xs px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-1.5 border border-gray-200/50">
                                <span class="material-symbols-outlined text-base">receipt_long</span>
                                <span>Transactions</span>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Shine Effect on Hover -->
                    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                </div>
        `}).join('')
    }
    else return notification('No records retrieved')
}

// Function to toggle room card expand/collapse
function toggleRoomCard(roomNumber) {
    const card = did(`room-card-${roomNumber}`);
    const toggleIcon = did(`toggle-icon-${roomNumber}`);
    if (!card || !toggleIcon) return;
    
    const expandedSections = card.querySelectorAll('.room-details-expanded');
    const collapsedImage = card.querySelector('.room-image-collapsed');
    
    // Check if currently expanded (check first expanded section)
    const isExpanded = expandedSections.length > 0 && !expandedSections[0].classList.contains('hidden');
    
    if (isExpanded) {
        // Collapse: Hide expanded sections, show collapsed image
        expandedSections.forEach(section => {
            section.classList.add('hidden');
        });
        if (collapsedImage) {
            collapsedImage.classList.remove('hidden');
        }
        toggleIcon.style.transform = 'rotate(0deg)';
        toggleIcon.textContent = 'expand_more';
        card.style.minHeight = 'auto';
    } else {
        // Expand: Show expanded sections, hide collapsed image
        expandedSections.forEach(section => {
            section.classList.remove('hidden');
        });
        if (collapsedImage) {
            collapsedImage.classList.add('hidden');
        }
        toggleIcon.style.transform = 'rotate(180deg)';
        toggleIcon.textContent = 'expand_less';
        card.style.minHeight = '420px';
    }
}

// Function to open room image modal
function openRoomImageModal(roomNumber, imageUrl1, imageUrl2) {
    const modal = did('roomImageModal');
    const modalTitle = did('roomImageModalTitle');
    const modalContent = did('roomImageModalContent');
    
    modalTitle.textContent = `Room ${roomNumber} - Images`;
    
    let imagesHtml = '';
    
    if (imageUrl1 && imageUrl1 !== '-' && imageUrl1 !== '../images/-') {
        imagesHtml += `
            <div class="space-y-2">
                <p class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Image 1</p>
                <img src="${imageUrl1}" 
                     alt="Room ${roomNumber} - Image 1" 
                     class="w-full h-auto rounded-xl shadow-lg cursor-pointer hover:shadow-2xl transition-all"
                     onclick="window.open('${imageUrl1}', '_blank')"
                     onerror="this.src='../images/emptyrooom.png'">
            </div>
        `;
    }
    
    if (imageUrl2 && imageUrl2 !== '-' && imageUrl2 !== '../images/-') {
        imagesHtml += `
            <div class="space-y-2">
                <p class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Image 2</p>
                <img src="${imageUrl2}" 
                     alt="Room ${roomNumber} - Image 2" 
                     class="w-full h-auto rounded-xl shadow-lg cursor-pointer hover:shadow-2xl transition-all"
                     onclick="window.open('${imageUrl2}', '_blank')"
                     onerror="this.src='../images/emptyrooom.png'">
            </div>
        `;
    }
    
    if (!imagesHtml) {
        imagesHtml = `
            <div class="col-span-2 text-center py-12">
                <span class="material-symbols-outlined text-6xl text-gray-400 mb-4">image_not_supported</span>
                <p class="text-gray-500 text-lg">No images available for this room</p>
            </div>
        `;
    }
    
    modalContent.innerHTML = imagesHtml;
    modal.classList.remove('hidden');
}

async function viewroomreservationcheckin(id, btn){
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchreservationbyid', getparamm(), btn, 'json')
    if(request.status) { 
        let receiptdata = request.data[0]
    if(!receiptdata)return callModal('Something went wrong...')
        did('modalreceipt').innerHTML = `
        <div id="invoicecontainer" class="w-full mx-auto border rounded shadow p-10 bg-white relative">
                                    <div class="w-full flex justify-end">
                                            <span class="material-symbols-outlined text-red-500 cp hover:scale-[1.3] transition-all" onclick="did('modalreceipt').classList.add('hidden')">close</span>
                                        </div>
                        		<div class="flex mb-8 justify-between">
                        			<div class="w-2/4">
                        				<div class="mb-2 md:mb-1 md:flex items-center">
                        					<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Invoice No.</label>
                        					<div class="flex-1">
                        					<input value="${receiptdata.reservations.reference}" id="invoiceno" readonly class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="eg. #INV-100001">
                        					</div>
                        				</div>
                        
                        				<div class="mb-2 md:mb-1 md:flex items-center">
                        					<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Invoice Date</label>
                        					<div class="flex-1">
                        					<input id="invoicedate" value="${specialformatDateTime(receiptdata.reservations.reservationdate)}" readonly class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker" type="text" id="datepicker1" placeholder="eg. 17 Feb, 2020" autocomplete="off" readonly="">
                        					</div>
                        				</div>
                        				<div class="mb-2 md:mb-1 md:flex items-center">
                        					<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Arrival</label>
                        					<div class="flex-1">
                        					<input id="invoicedate" value="${specialformatDateTime(receiptdata.reservations.arrivaldate)}" readonly class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker" type="text" id="datepicker1" placeholder="eg. 17 Feb, 2020" autocomplete="off" readonly="">
                        					</div>
                        				</div>
                        				<div class="mb-2 md:mb-1 md:flex items-center">
                        					<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Departure</label>
                        					<div class="flex-1">
                        					<input id="invoicedate" value="${specialformatDateTime(receiptdata.reservations.departuredate)}" readonly class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker" type="text" id="datepicker1" placeholder="eg. 17 Feb, 2020" autocomplete="off" readonly="">
                        					</div>
                        				</div>
                        
                        				<!--<div class="mb-2 md:mb-1 md:flex items-center">-->
                        				<!--	<label class="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">Due date</label>-->
                        				<!--	<span class="mr-4 inline-block hidden md:block">:</span>-->
                        				<!--	<div class="flex-1">-->
                        				<!--	<input class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker-2" id="datepicker2" type="text" placeholder="eg. 17 Mar, 2020" x-model="invoiceDueDate" x-on:change="invoiceDueDate = document.getElementById('datepicker2').value" autocomplete="off" readonly="">-->
                        				<!--	</div>-->
                        				<!--</div>-->
                        			</div>
                        			<div>
                        				<span class="xl:w-[250px] pb-10 font-bold text-2xl text-base block py-3 pl-5 selection:bg-white uppercase font-heebo text-primary-g text-right">He<span class="text-gray-400">ms</span></span>
                        				<div class="flex justify-end">
                        				<div onclick="printContent('HEMS INVOICE', null, 'invoicecontainer', true)" class="relative mr-4 inline-block">
                        					<div class="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 inline-flex items-center justify-center" onclick="printInvoice()">
                        						<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-printer" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        							<rect x="0" y="0" width="24" height="24" stroke="none"></rect>
                        							<path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"></path>
                        							<path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"></path>
                        							<rect x="7" y="13" width="10" height="8" rx="2"></rect>
                        						</svg>				  
                        					</div>
                        					<div  class="z-40 shadow-lg text-center w-32 block absolute right-0 top-0 p-2 mt-12 rounded-lg bg-gray-800 text-white text-xs" style="display: none;">
                        						Print this invoice!
                        					</div>
                        				</div>
                        				<div onclick="did('modalreceipt').classList.add('hidden')" class="relative inline-block">
                        					<div class="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 inline-flex items-center justify-center" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false" @click="printInvoice()">
                        						<span class="material-symbols-outlined text-red-500 cp-500">cancel</span>	  
                        					</div>
                        					<div x-show.transition="showTooltip" class="z-40 shadow-lg text-center w-32 block absolute right-0 top-0 p-2 mt-12 rounded-lg bg-gray-800 text-white text-xs" style="display: none;">
                        						cancel
                        					</div>
                        				</div>
                        				
                        			</div>
                        			</div>
  </div>
                        
                        		<div class="flex flex-wrap justify-between mb-8">
                        			<div class="w-full md:w-1/3 mb-2 md:mb-0">
                        				<label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Bill info:</label>
                        				<input readonly value="${receiptdata.reservations.billinginfo??''}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                        				<label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Cancellation Date:</label>
                        				<input readonly value="${receiptdata.reservations.cancellationdate??''}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                        				<label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Source:</label>
                        				<input readonly value="${receiptdata.reservations.source??''}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                        				<label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Status:</label>
                        				<input readonly value="${receiptdata.reservations.status == 'OPEN' ? 'RESERVED' : receiptdata.reservations.status }" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                        				<label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Re-assignment Date:</label>
                        				<input readonly value="${receiptdata.reservations.roomreassignmentdate??''}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                        			</div>
                        			<div class="w-full md:w-1/3">
                        				<label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Firm:</label>
                        				<input value="Hems Limited" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Your company name" >
                        				<label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Group:</label>
                        				<input readonly value="${receiptdata.reservations.groupname??''}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                        				<label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Company:</label>
                        				<input readonly value="${receiptdata.reservations.companyname??''}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                        				<label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Travel Agent:</label>
                        				<input readonly value="${receiptdata.reservations.travelagentname??''}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                        				<label class="text-gray-800 block mb-1 font-semibold text-xs uppercase tracking-wide">Type of Guest:</label>
                        				<input readonly value="${receiptdata.reservations.typeofguest??''}" class="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="inline-full-name" type="text" placeholder="Billing company name" >
                                    </div>
                                </div>
                                
                                <div class="table-content">
                                    <table id="tableer" class="mx-auto">
                                        <thead>
                                            <tr>
                                                 <th style="width: 20px">s/n</th>
                                                <th class="text-center opacity-70">Room&nbsp;Category</th>
                                                <th class="text-center opacity-70">Room</th>
                                                <th class="text-center opacity-70">
                                                    <table  class="mx-auto">
                                                        <thead>
                                                            <tr  class="!bg-[#64748b] !text-white !p-0">
                                                                 <th style="width: 20px">s/n</th>
                                                                <th style="width: 60px" class="text-center opacity-70">name</th>
                                                                <th style="width: 60px" class="text-center opacity-70">phone&nbsp;number</th>
                                                            </tr>
                                                        </thead>
                                                    </table>
                                                </th>
                                                <th class="text-center opacity-70">rate</th>
                                                <th class="text-center opacity-70">discount</th>
                                                <th class="text-center opacity-70">plan discount</th>
                                            </tr>
                                        </thead>
                                        <tbody id="roomtabledata">
                                            ${
                                                receiptdata.roomguestrow.map((item, index)=>{
                                                    return ` 
                                                        <tr> 
                                                            <td>${index + 1 }</td> 
                                                            <td>${item.roomdata.roomcategoryname}</td>
                                                            <td>${item.roomdata.roomnumber}</td>
                                                            <td>
                                                                <table  class="mx-auto">
                                                                        <tbody>
                                                                            ${item.guest1.length>0 ? `<tr>
                                                                                <td class="text-center opacity-70">1</td>
                                                                                <td id="rcheckindate" class="text-center opacity-70">${item.guest1[0].firstname}&nbsp;${item.guest1[0].lastname}&nbsp;${item.guest1[0].othernames}</td>
                                                                                <td id="rcheckindate" class="text-center opacity-70">${item.guest1[0].phone}</td>
                                                                            </tr>` : ''}
                                                                            ${item.guest2.length>0 ? `<tr>
                                                                                <td class="text-center opacity-70">2</td>
                                                                                <td id="rcheckindate" class="text-center opacity-70">${item.guest2[0].firstname}&nbsp;${item.guest2[0].lastname}&nbsp;${item.guest2[0].othernames}</td>
                                                                                <td id="rcheckindate" class="text-center opacity-70">${item.guest2[0].phone}</td>
                                                                            </tr>` : ''}
                                                                            ${item.guest3.length>0 ? `<tr>
                                                                                <td class="text-center opacity-70">3</td>
                                                                                <td id="rcheckindate" class="text-center opacity-70">${item.guest3[0].firstname}&nbsp;${item.guest3[0].lastname}&nbsp;${item.guest3[0].othernames}</td>
                                                                                <td id="rcheckindate" class="text-center opacity-70">${item.guest3[0].phone}</td>
                                                                            </tr>` : ''}
                                                                            ${item.guest4.length>0 ? `<tr>
                                                                                <td class="text-center opacity-70">4</td>
                                                                                <td id="rcheckindate" class="text-center opacity-70">${item.guest4[0].firstname}&nbsp;${item.guest4[0].lastname}&nbsp;${item.guest4[0].othernames}</td>
                                                                                <td id="rcheckindate" class="text-center opacity-70">${item.guest4[0].phone}</td>
                                                                            </tr>` : ''}
                                                                        </tbody>
                                                                    </table>
                                                            </td>
                                                            <td>${formatNumber(item.roomdata.roomrate)}</td> 
                                                            <td>${formatNumber(item.roomdata.discountamount)}</td> 
                                                            <td>${formatNumber(item.roomdata.plandiscountamount)}</td>
                                                        </tr> `
                                                }).join('')
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                
                               
                        
  <!--                      		<div class="flex -mx-1 border-b py-2 items-start">-->
  <!--                      			<div class="w-10 px-1">-->
  <!--                      				<p class="text-gray-800 uppercase tracking-wide text-sm font-bold">S/N</p>-->
  <!--                      			</div>-->
  <!--                      			<div class="w-150 px-1">-->
  <!--                      				<p class="text-gray-800 uppercase tracking-wide text-sm font-bold">Check-in Date</p>-->
  <!--                      			</div>-->
                        
  <!--                      			<div class="px-1 w-40 text-right">-->
  <!--                      				<p class="text-gray-800 uppercase tracking-wide text-sm font-bold">room no.</p>-->
  <!--                      			</div>-->
  <!--                      			<div class="px-1 w-40 text-right">-->
  <!--                      				<p class="text-gray-800 uppercase tracking-wide text-sm font-bold">no. of night</p>-->
  <!--                      			</div>-->
                        
  <!--                      			<div class="px-1 flex-1 text-right">-->
  <!--                      				<p class="leading-none">-->
  <!--                      					<span class="block uppercase tracking-wide text-sm font-bold text-gray-800">debit</span>-->
                        					<!--<span class="font-medium text-xs text-gray-500">(Incl. GST)</span>-->
  <!--                      				</p>-->
  <!--                      			</div>-->
                        
  <!--                      			<div class="px-1 flex-1 text-right">-->
  <!--                      				<p class="leading-none">-->
  <!--                      					<span class="block uppercase tracking-wide text-sm font-bold text-gray-800">Credit</span>-->
                        					<!--<span class="font-medium text-xs text-gray-500">(Incl. GST)</span>-->
  <!--                      				</p>-->
  <!--                      			</div>-->
  <!--                      			<div class="px-1 flex-1 text-right">-->
  <!--                      				<p class="leading-none">-->
  <!--                      					<span class="block uppercase tracking-wide text-sm font-bold text-gray-800">balance</span>-->
                        					<!--<span class="font-medium text-xs text-gray-500">(Incl. GST)</span>-->
  <!--                      				</p>-->
  <!--                      			</div>-->
  <!--</div>-->
                        
                        		
                        			<div class="flex hidden -mx-1 py-2 border-b">
                        				<div class="w-10 px-1">
                        					<p class="text-gray-800" >1</p>
                        				</div>
                        				<div class="w-150 px-1">
                        					<p id="rcheckindate" class="text-gray-800"></p>
                        				</div>
                        
                        				<div class="px-1 w-40 text-right">
                        					<p id="rrroomnumber" class="text-gray-800"></p>
                        				</div>
                        
                        				<div class="px-1 w-40 text-right">
                        					<p id="rnumberofnights" class="text-gray-800"></p>
                        				</div>
                        
                        				<div class="flex-1 px-1 text-right">
                        					<p id="rdebit" class="text-gray-800"></p>
                        				</div>
                        
                        				<div class="flex-1 px-1 text-right">
                        					<p id="rcredit" class="text-gray-800"></p>
                        				</div>
                        				
                        				<div class="flex-1 px-1 text-right">
                        					<p id="rbalance" class="text-gray-800"></p>
                        				</div>
                        			</div>
                        
                        		
                        
                        		<div class="py-10 text-center">
                        			<p class="text-gray-600">Created by <a class="text-blue-600 hover:text-blue-500 border-b-2 border-blue-200 hover:border-blue-300" href="https://twitter.com/mithicher">Mira Technologies</a>.</p>
                                </div>
                        
                        		
                        
                        
                        
                        	</div>
    `
    
    
    did('modalreceipt').classList.remove('hidden')
    }else notification(request.message, 0)
}

async function viewroomdetails(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('roomnumber', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/getroomstatus', id ? getparamm() : null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
       
    }
    else return notification('No records retrieved')
}


async function fetchroomstatus(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchroomstatus', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onroomstatusTableDataSignal)
            }
        }else{
             roomstatusid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeroomstatus(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this roomstatus?");

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
    fetchroomstatus()
    return notification(request.message);
    
}


async function onroomstatusTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchroomstatus('${item.id}')" class="material-symbols-outlined slide-fwd-center rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeroomstatus('${item.id}')" class="material-symbols-outlined slide-fwd-center rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function roomstatusFormSubmitHandler() {
    if(!validateForm('roomstatusform', getIdFromCls('comp'))) return
    
    let payload

    payload = getFormData2(document.querySelector('#roomstatusform'), roomstatusid ? [['id', roomstatusid]] : null)
    let request = await httpRequest2('../controllers/roomstatuscript', payload, document.querySelector('#roomstatusform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#roomstatusform').reset();
        fetchroomstatus();
        return
    }
    document.querySelector('#roomstatusform').reset();
    fetchroomstatus();
    return notification(request.message, 0);
}


// function runAdroomstatusFormValidations() {
//     let form = document.getElementById('roomstatusform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#roomstatusname'))  controls.push([form.querySelector('#roomstatusname'), 'roomstatus name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }