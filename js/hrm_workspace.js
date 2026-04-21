const hrmInterfaceRegistry = {
    pp_department: {
        title: 'Department',
        subtitle: 'Create, edit, and retire departments used in personnel placement and payroll grouping.',
        flow: ['Capture department details', 'List existing departments', 'Edit or remove department records'],
        controllers: [
            { name: 'fetchdepartment.php', purpose: 'Retrieve departments' },
            { name: 'department.php', purpose: 'Create or update department' },
            { name: 'removedepartment.php', purpose: 'Delete department entry' }
        ]
    },
    pp_level: {
        title: 'Level',
        subtitle: 'Maintain compensation levels with basic salary and allowance/deduction structure.',
        flow: ['Define level and base salary', 'Attach allowance/deduction percentages', 'Update or remove a level'],
        controllers: [
            { name: 'fetchlevel.php', purpose: 'Retrieve levels and salary structures' },
            { name: 'level.php', purpose: 'Create or update level profile' },
            { name: 'removelevel.php', purpose: 'Delete level' },
            { name: 'fetchlocation.php', purpose: 'Load locations for payroll context' }
        ]
    },
    pp_groupname: {
        title: 'Group',
        subtitle: 'Create and manage personnel grouping used by payroll workflows.',
        flow: ['Add group name', 'List groups', 'Edit or delete group'],
        controllers: [
            { name: 'fetchgroupname.php', purpose: 'Retrieve groups' },
            { name: 'groupname.php', purpose: 'Create or update group' },
            { name: 'removegroup.php', purpose: 'Delete group' }
        ]
    },
    pp_personnel: {
        title: 'Add Personnel',
        subtitle: 'Capture personnel bio-data and compensation context for onboarding.',
        flow: ['Select department/group/level', 'Capture personnel profile details', 'Submit for approval queue'],
        controllers: [
            { name: 'fetchpersonnels.php', purpose: 'Retrieve personnel list' },
            { name: 'personnelscript.php', purpose: 'Create or update personnel record' },
            { name: 'personnelapprovals.php', purpose: 'Submit to personnel approval pipeline' },
            { name: 'fetchdepartment.php', purpose: 'Load department options' },
            { name: 'fetchgroupname.php', purpose: 'Load group options' },
            { name: 'fetchlevel.php', purpose: 'Load level options' }
        ]
    },
    pp_approvepersonnel: {
        title: 'Approve Personnel',
        subtitle: 'Review newly submitted personnel and approve or decline.',
        flow: ['Load non-approved personnel', 'Select entries', 'Approve or decline selected personnel'],
        controllers: [
            { name: 'fetchpersonnels.php', purpose: 'Retrieve personnel pending approval' },
            { name: 'personnelapprovals.php', purpose: 'Approve or decline personnel' },
            { name: 'removepersonnel.php', purpose: 'Delete personnel entry' }
        ]
    },
    pp_viewpersonnel: {
        title: 'View Personnel',
        subtitle: 'Search and maintain approved personnel records and attached HR sub-records.',
        flow: ['Filter personnel list', 'Open personnel details', 'Trigger related HR actions from row actions'],
        controllers: [
            { name: 'fetchpersonnels.php', purpose: 'Retrieve approved personnel' },
            { name: 'personnelscript.php', purpose: 'Update personnel details' },
            { name: 'removepersonnel.php', purpose: 'Delete personnel profile' }
        ]
    },
    pp_personnelhistory: {
        title: 'Personnel History',
        subtitle: 'Audit changes and historical personnel movement.',
        flow: ['Filter by personnel and dimensions', 'Load historical events', 'Review timeline entries'],
        controllers: [
            { name: 'fetchpersonnelhistory.php', purpose: 'Retrieve personnel history records' },
            { name: 'fetchpersonnels.php', purpose: 'Load personnel filter list' },
            { name: 'fetchdepartment.php', purpose: 'Load department filter list' },
            { name: 'fetchgroupname.php', purpose: 'Load group filter list' },
            { name: 'fetchlevel.php', purpose: 'Load level filter list' }
        ]
    },
    pp_guarantor: {
        title: 'Guarantor',
        subtitle: 'Attach guarantor entries to personnel profiles.',
        flow: ['Select personnel', 'Capture guarantor details', 'Edit or delete guarantor rows'],
        controllers: [
            { name: 'fetchguarantors.php', purpose: 'Retrieve guarantor records' },
            { name: 'guarantorscript.php', purpose: 'Create or update guarantor' },
            { name: 'removeguarantor.php', purpose: 'Delete guarantor' },
            { name: 'fetchpersonnels.php', purpose: 'Load personnel selector' }
        ]
    },
    pp_employerrecord: {
        title: 'Employment Record',
        subtitle: 'Store employment history records for personnel.',
        flow: ['Select personnel', 'Capture employer record details', 'Edit or remove employer records'],
        controllers: [
            { name: 'fetchemploymentrecords.php', purpose: 'Retrieve employment records' },
            { name: 'employmentrecordscript.php', purpose: 'Create or update employment record' },
            { name: 'removeemploymentrecord.php', purpose: 'Delete employment record' },
            { name: 'fetchpersonnels.php', purpose: 'Load personnel selector' }
        ]
    },
    pp_referees: {
        title: 'Referees',
        subtitle: 'Register and maintain personnel referees.',
        flow: ['Select personnel', 'Add referee details', 'Edit or remove referee'],
        controllers: [
            { name: 'fetchreferees.php', purpose: 'Retrieve referee records' },
            { name: 'refereescript.php', purpose: 'Create or update referee' },
            { name: 'removereferee.php', purpose: 'Delete referee' },
            { name: 'fetchpersonnels.php', purpose: 'Load personnel selector' }
        ]
    },
    pp_qualification: {
        title: 'Qualification',
        subtitle: 'Capture educational/professional qualifications for personnel.',
        flow: ['Select personnel', 'Save qualification record', 'Edit or remove qualification entry'],
        controllers: [
            { name: 'fetchqualifications.php', purpose: 'Retrieve qualification records' },
            { name: 'qualificationscript.php', purpose: 'Create or update qualification' },
            { name: 'removequalification.php', purpose: 'Delete qualification record' },
            { name: 'fetchpersonnels.php', purpose: 'Load personnel selector' }
        ]
    },
    pp_parentsguardians: {
        title: 'Parents/Guardians',
        subtitle: 'Store next-of-kin and guardian details.',
        flow: ['Select personnel', 'Capture parent/guardian details', 'Edit or remove guardian records'],
        controllers: [
            { name: 'fetchparents.php', purpose: 'Retrieve parent/guardian records' },
            { name: 'parentscript.php', purpose: 'Create or update parent/guardian' },
            { name: 'removeparentsguardians.php', purpose: 'Delete parent/guardian entry' },
            { name: 'fetchpersonnels.php', purpose: 'Load personnel selector' }
        ]
    },
    pp_query: {
        title: 'Query',
        subtitle: 'Log disciplinary or personnel matter query records.',
        flow: ['Select personnel', 'Capture query details', 'Update or delete personnel matter'],
        controllers: [
            { name: 'fetchpersonnelmatters.php', purpose: 'Retrieve personnel matters' },
            { name: 'personnelmatterscript.php', purpose: 'Create or update matter entry' },
            { name: 'removepersonnelmatter.php', purpose: 'Delete personnel matter' },
            { name: 'fetchpersonnels.php', purpose: 'Load personnel selector' }
        ]
    },
    pp_promotions: {
        title: 'Promotions',
        subtitle: 'Track personnel promotions and level adjustments.',
        flow: ['Select personnel and target level', 'Capture promotion note/effective date', 'Save promotion record'],
        controllers: [
            { name: 'fetchpersonnelmatters.php', purpose: 'Retrieve promotion-type matters' },
            { name: 'personnelmatterscript.php', purpose: 'Create or update promotion matter' },
            { name: 'removepersonnelmatter.php', purpose: 'Delete promotion matter' },
            { name: 'fetchpersonnels.php', purpose: 'Load personnel selector' },
            { name: 'fetchlevel.php', purpose: 'Load level selector' }
        ]
    },
    pp_termination: {
        title: 'Termination/Resignation',
        subtitle: 'Register termination and resignation records.',
        flow: ['Select personnel', 'Capture termination or resignation details', 'Save/update/remove matter'],
        controllers: [
            { name: 'fetchpersonnelmatters.php', purpose: 'Retrieve termination matters' },
            { name: 'personnelmatterscript.php', purpose: 'Create or update termination matter' },
            { name: 'removepersonnelmatter.php', purpose: 'Delete termination matter' },
            { name: 'fetchpersonnels.php', purpose: 'Load personnel selector' }
        ]
    },
    pp_suspension: {
        title: 'Suspension',
        subtitle: 'Manage personnel suspension records.',
        flow: ['Select personnel', 'Capture suspension details', 'Save/update/remove matter'],
        controllers: [
            { name: 'fetchpersonnelmatters.php', purpose: 'Retrieve suspension matters' },
            { name: 'personnelmatterscript.php', purpose: 'Create or update suspension matter' },
            { name: 'removepersonnelmatter.php', purpose: 'Delete suspension matter' },
            { name: 'fetchpersonnels.php', purpose: 'Load personnel selector' }
        ]
    },
    pp_leave: {
        title: 'Leave',
        subtitle: 'Record leave requests and updates.',
        flow: ['Select personnel', 'Capture leave period and notes', 'Save/update/remove leave matter'],
        controllers: [
            { name: 'fetchpersonnelmatters.php', purpose: 'Retrieve leave matters' },
            { name: 'personnelmatterscript.php', purpose: 'Create or update leave matter' },
            { name: 'removepersonnelmatter.php', purpose: 'Delete leave matter' },
            { name: 'fetchpersonnels.php', purpose: 'Load personnel selector' }
        ]
    },
    pp_warning: {
        title: 'Warning',
        subtitle: 'Issue and track warning records.',
        flow: ['Select personnel', 'Capture warning details', 'Save/update/remove warning matter'],
        controllers: [
            { name: 'fetchpersonnelmatters.php', purpose: 'Retrieve warning matters' },
            { name: 'personnelmatterscript.php', purpose: 'Create or update warning matter' },
            { name: 'removepersonnelmatter.php', purpose: 'Delete warning matter' },
            { name: 'fetchpersonnels.php', purpose: 'Load personnel selector' }
        ]
    },
    pp_monitorevaluation: {
        title: 'Monitoring/Evaluation',
        subtitle: 'Capture monitoring and evaluation notes per personnel.',
        flow: ['Select personnel', 'Capture evaluation entry', 'Save/update/remove evaluation matter'],
        controllers: [
            { name: 'fetchpersonnelmatters.php', purpose: 'Retrieve evaluation matters' },
            { name: 'personnelmatterscript.php', purpose: 'Create or update evaluation matter' },
            { name: 'removepersonnelmatter.php', purpose: 'Delete evaluation matter' },
            { name: 'fetchpersonnels.php', purpose: 'Load personnel selector' }
        ]
    },
    pp_advance: {
        title: 'Advance',
        subtitle: 'Manage staff advance requests and deductions setup.',
        flow: ['Select personnel and level', 'Capture advance amount and rules', 'Save or delete advance matter'],
        controllers: [
            { name: 'fetchpersonnelmatters.php', purpose: 'Retrieve advance records' },
            { name: 'personnelmatterscript.php', purpose: 'Create or update advance matter' },
            { name: 'removepersonnelmatter.php', purpose: 'Delete advance matter' },
            { name: 'fetchpersonnels.php', purpose: 'Load personnel selector' },
            { name: 'fetchlevel.php', purpose: 'Load level selector' }
        ]
    },
    pp_viewstaffadvance: {
        title: 'View Staff Advance',
        subtitle: 'Review staff advance entries and payroll impact.',
        flow: ['Filter advance records', 'Inspect payroll links', 'Take corrective actions'],
        controllers: [
            { name: 'fetchstaffpayroll.php', purpose: 'Retrieve staff payroll entries' },
            { name: 'fetchpersonnelmatters.php', purpose: 'Retrieve advance-type personnel matters' },
            { name: 'controller.php', purpose: 'Generic action endpoint used by HTG module' }
        ]
    },
    pp_personalstaffsalaryrecord: {
        title: 'Staff Salary Record',
        subtitle: 'Build and inspect per-staff salary records before payroll run.',
        flow: ['Select staff and period', 'Generate salary record', 'Prepare records for payroll approval'],
        controllers: [
            { name: 'fetchpersonnels.php', purpose: 'Retrieve personnel list' },
            { name: 'approvepayroll.php', purpose: 'Create/update salary staging records' },
            { name: 'controller.php', purpose: 'Generic action endpoint used by HTG module' }
        ]
    },
    pp_viewmonthlysalaryschedule: {
        title: 'View Monthly Salary Schedule',
        subtitle: 'Review approved monthly payroll schedule.',
        flow: ['Pick month/location', 'Load approved schedule', 'Verify totals and row-level values'],
        controllers: [
            { name: 'fetchapprovedpayroll.php', purpose: 'Retrieve approved payroll schedule' },
            { name: 'approvepayroll.php', purpose: 'Payroll approval workflow actions' },
            { name: 'fetchlocation.php', purpose: 'Load location selector' }
        ]
    },
    pp_presalaryapproval: {
        title: 'Payroll',
        subtitle: 'Run payroll staging and submit entries for payroll approval.',
        flow: ['Load pending payroll batch', 'Run payroll action', 'Send payroll for final confirmation'],
        controllers: [
            { name: 'approvepayroll.php', purpose: 'Payroll staging and updates' },
            { name: 'dopayroll.php', purpose: 'Execute payroll run action' }
        ]
    },
    pp_confirmsalary: {
        title: 'Approve Payroll',
        subtitle: 'Final payroll confirmation and approval.',
        flow: ['Load unapproved payroll records', 'Approve selected payroll rows', 'Finalize payroll confirmations'],
        controllers: [
            { name: 'fetchnonapprovedpayroll.php', purpose: 'Retrieve payroll awaiting final confirmation' },
            { name: 'dopayroll.php', purpose: 'Finalize payroll approval action' },
            { name: 'fetchlocation.php', purpose: 'Load location selector' }
        ]
    },
    pp_payrollclassa: {
        title: 'Payroll Class A',
        subtitle: 'View payroll output grouped by class A format.',
        flow: ['Select month/location', 'Fetch class A payroll rows', 'Audit payroll class A totals'],
        controllers: [
            { name: 'fetchpayrollclassa.php', purpose: 'Retrieve class A payroll records' },
            { name: 'fetchlocation.php', purpose: 'Load location selector' }
        ]
    },
    pp_payrollclassb: {
        title: 'Payroll Class B',
        subtitle: 'View payroll output grouped by class B format.',
        flow: ['Select month/location', 'Fetch class B payroll rows', 'Audit payroll class B totals'],
        controllers: [
            { name: 'fetchpayrollclassb.php', purpose: 'Retrieve class B payroll records' },
            { name: 'fetchlocation.php', purpose: 'Load location selector' }
        ]
    }
};

function hrmWorkspaceActive() {
    const route = new URLSearchParams(window.location.search).get('r') || '';
    const config = hrmInterfaceRegistry[route];
    if (!config) return;

    document.getElementById('hrm_page_title').textContent = config.title;
    document.getElementById('hrm_page_subtitle').textContent = config.subtitle;

    const flowList = document.getElementById('hrm_flow_list');
    flowList.innerHTML = config.flow.map((item) => `<li>${item}</li>`).join('');

    const controllerRows = config.controllers.map((controller, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${controller.name}</td>
            <td>${controller.purpose}</td>
            <td><span class="text-amber-700">placeholder</span></td>
        </tr>
    `).join('');
    document.getElementById('hrm_controller_table').innerHTML = controllerRows;

    document.getElementById('hrm_fetch_btn').onclick = async () => {
        const response = await hrmPlaceholderController(route, 'fetch');
        hrmRenderPreviewTable(response.data || []);
        notification(response.message, response.status ? 1 : 0);
    };

    document.getElementById('hrm_submit_btn').onclick = async () => {
        const response = await hrmPlaceholderController(route, 'submit', { source: 'hems-hrm-workspace' });
        notification(response.message, response.status ? 1 : 0);
    };
}

async function hrmPlaceholderController(route, action, payload = {}) {
    const config = hrmInterfaceRegistry[route];
    const primaryController = config?.controllers?.[0]?.name || 'controller.php';
    await new Promise((resolve) => setTimeout(resolve, 220));

    if (!window.__hrmPlaceholderLog) window.__hrmPlaceholderLog = [];
    window.__hrmPlaceholderLog.unshift({
        route,
        action,
        controller: primaryController,
        payload,
        at: new Date().toISOString()
    });

    if (action === 'fetch') {
        return {
            status: true,
            message: `Placeholder fetch complete via ${primaryController}.`,
            data: hrmGeneratePreviewRows(route)
        };
    }

    return {
        status: true,
        message: `Placeholder ${action} accepted via ${primaryController}.`,
        data: []
    };
}

function hrmGeneratePreviewRows(route) {
    const now = new Date().toISOString().slice(0, 10);
    return [
        { reference: `${route.toUpperCase()}-001`, person: 'Demo Personnel 1', status: 'PENDING', effective_date: now },
        { reference: `${route.toUpperCase()}-002`, person: 'Demo Personnel 2', status: 'APPROVED', effective_date: now },
        { reference: `${route.toUpperCase()}-003`, person: 'Demo Personnel 3', status: 'DRAFT', effective_date: now }
    ];
}

function hrmRenderPreviewTable(rows) {
    const head = document.getElementById('hrm_preview_head');
    const body = document.getElementById('hrm_preview_body');

    if (!rows.length) {
        head.innerHTML = '';
        body.innerHTML = `<tr><td colspan="100%" class="text-center opacity-70">No preview rows returned.</td></tr>`;
        return;
    }

    const columns = Object.keys(rows[0]);
    head.innerHTML = `<tr>${columns.map((column) => `<th>${column.replace('_', ' ')}</th>`).join('')}</tr>`;
    body.innerHTML = rows.map((row) => `<tr>${columns.map((column) => `<td>${row[column] ?? ''}</td>`).join('')}</tr>`).join('');
}
