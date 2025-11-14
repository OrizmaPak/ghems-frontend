<div id="SUPERADMIN" class="flex-grow text-gray-800">
    <main class="p-2 sm:p-4 space-y-6 dashboard-shell">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
        <div class="mr-0 md:mr-6 space-y-1">
          <p class="text-[11px] tracking-[0.28em] uppercase text-slate-400">Today at a glance</p>
          <h1 class="text-2xl md:text-[26px] font-semibold flex items-baseline gap-1">
            Welcome
            <span class="text-primary-g" name="user_name">Loading...</span>
          </h1>
        </div>
      </div>

      <section class="dashboard-metrics-grid">
        <div class="metric-card cp" onclick="document.getElementById('roomstatus')?.click()">
          <div class="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
            <span class="material-symbols-outlined">nest_multi_room</span>
          </div>
          <div>
            <span class="metric-label">Available Rooms</span>
            <span class="metric-value val" id="dashavailablerooms">Loading...</span>
          </div>
        </div>
        <div onclick="document.getElementById('activitylog').click()" class="metric-card cp">
          <div class="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
            <span class="material-symbols-outlined">sensor_occupied</span>
          </div>
          <div>
            <span class="metric-label">Occupied Rooms</span>
            <span class="metric-value val" id="dashoccupiedrooms">Loading...</span>
          </div>
        </div>
        <div onclick="document.getElementById('viewhistory').click()"  class="metric-card cp">
          <div class="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
           <span class="material-symbols-outlined group-hover:text-primary-g" style="font-size: 40px;">attach_money</span>
          </div>
          <div>
            <span class="metric-label">Total Sales</span>
            <span class="metric-value val" id="dashsales">Loading...</span>
          </div>
        </div>
      </section>

      <section class="dashboard-metrics-grid">
        <div class="metric-card cp">
          <div class="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
           <span class="material-symbols-outlined">call_received</span>
          </div>
          <div>
            <span class="metric-label">Total Receivables</span>
            <span class="metric-value val" id="dashreceiveable">Loading...</span>
          </div>
        </div>
        <div onclick="document.getElementById('activitylog').click()" class="metric-card cp">
          <div class="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
            <span class="material-symbols-outlined">inventory</span>
          </div>
          <div>
            <span class="metric-label">Total Inventory</span>
            <span class="metric-value val" id="dashinventory">Loading...</span>
          </div>
        </div>
        <div onclick="document.getElementById('viewhistory').click()"  class="metric-card cp">
          <div class="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
           <span class="material-symbols-outlined">local_atm</span>
          </div>
          <div>
            <span class="metric-label">Total Payables</span>
            <span class="metric-value val" id="dashpayables">Loading...</span>
          </div>
        </div>
      </section>

      <section class="dashboard-lower grid md:grid-cols-1 xl:grid-cols-3 gap-6">
        <div class="flex flex-col w-full min-h-[360px] xl:col-span-2 glass-analytic-panel">
          <div class="px-6 py-4 w-full flex items-center justify-between gap-3">
            <div>
              <p class="text-[11px] uppercase tracking-[0.2em] text-slate-400">Revenue velocity</p>
              <p class="text-sm text-slate-500">Sales trend (Chart.js)</p>
            </div>
          </div>
          <div class="px-2 pb-4 flex-grow w-full flex items-stretch">
            <div class="flex items-center justify-center h-full w-full px-4 py-5 text-gray-400 text-3xl font-semibold">
                <canvas id="myChart"></canvas>
            </div>
          </div>
        </div>

        <div class="glass-analytic-panel flex flex-col gap-4 p-5">
          <div>
            <p class="text-[11px] uppercase tracking-[0.2em] text-slate-400">Snapshot</p>
            <p class="text-sm text-slate-600">Today’s signal</p>
          </div>
          <div class="flex flex-col gap-3 text-xs text-slate-500">
            <div class="flex items-center justify-between">
              <span>Occupancy vs. availability</span>
              <span class="font-semibold text-slate-800">Live</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Receivables health</span>
              <span class="font-semibold text-slate-800">Monitoring</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Inventory coverage</span>
              <span class="font-semibold text-slate-800">Stable</span>
            </div>
          </div>
        </div>
      </section>

      <section class="text-right font-semibold text-gray-500">
        <a href="#" class="text-green-600 text-xs hover:underline">all rights reserved</a>
      </section>
    </main>
  </div> 

