const hrmInterfaceRegistry = {
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
    pp_personnel: {
        title: 'Personnel',
        subtitle: 'Capture personnel bio-data and compensation context for onboarding.',
        flow: ['Select level', 'Capture personnel profile details', 'Submit for approval queue'],
        controllers: [
            { name: 'fetchpersonnels.php', purpose: 'Retrieve personnel list' },
            { name: 'personnelscript.php', purpose: 'Create or update personnel record' },
            { name: 'personnelapprovals.php', purpose: 'Submit to personnel approval pipeline' },
            { name: 'fetchlevel.php', purpose: 'Load level options' }
        ]
    },
    pp_approvepersonnel: {
        title: 'Approve Personnel',
        subtitle: 'Review newly submitted personnel and approve or decline.',
        flow: ['Load non-approved personnel', 'Select entries', 'Approve or decline selected personnel'],
        controllers: [
            { name: 'fetchpersonnels.php', purpose: 'Retrieve personnel pending approval' },
            { name: 'personnelapprovals.php', purpose: 'Approve or decline personnel' }
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
            { name: 'fetchpersonnels.php', purpose: 'Load personnel filter list' }
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
        subtitle: 'Review payroll records for a selected personnel.',
        flow: ['Select personnel', 'Load payroll records', 'Review salary components and net payable'],
        controllers: [
            { name: 'fetchpersonnels.php', purpose: 'Retrieve personnel list' },
            { name: 'fetchstaffpayroll.php', purpose: 'Retrieve selected staff payroll records' }
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

const hrmCommonFilters = [
    { id: 'search', label: 'Search', type: 'text', placeholder: 'Name, staff ID, reference' },
    { id: 'startdate', label: 'Start Date', type: 'date' },
    { id: 'enddate', label: 'End Date', type: 'date' }
];

const hrmMonthSelectOptions = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
];

function hrmPayrollYearOptions() {
    const year = new Date().getFullYear();
    return [year - 1, year, year + 1].map((value) => ({ value: String(value), label: String(value) }));
}

const hrmHiddenFrontendFields = new Set([
    'accountnumber',
    'bankaccountnumber2',
    'bankname2'
]);

const hrmHtgControllerRouting = {
    pp_level: { load: 'fetchlevel.php', save: 'level.php', filter: 'fetchlevel.php', delete: 'removelevel.php' },
    pp_personnel: { load: 'fetchpersonnels.php', save: 'personnelscript.php', filter: 'fetchpersonnels.php' },
    pp_approvepersonnel: { load: 'fetchpersonnels.php', save: 'personnelapprovals.php', filter: 'fetchpersonnels.php' },
    pp_viewpersonnel: { load: 'viewpersonnel.php', save: 'personnel.php', filter: 'viewpersonnel.php' },
    pp_personnelhistory: { load: 'fetchpersonnelhistory.php', save: 'fetchpersonnelhistory.php', filter: 'fetchpersonnelhistory.php' },
    pp_guarantor: { load: 'fetchguarantors.php', save: 'guarantorscript.php', filter: 'fetchguarantors.php', delete: 'removeguarantor.php' },
    pp_employerrecord: { load: 'fetchemploymentrecords.php', save: 'employmentrecordscript.php', filter: 'fetchemploymentrecords.php', delete: 'removeemploymentrecord.php' },
    pp_referees: { load: 'fetchreferees.php', save: 'refereescript.php', filter: 'fetchreferees.php', delete: 'removereferee.php' },
    pp_qualification: { load: 'fetchqualifications.php', save: 'qualificationscript.php', filter: 'fetchqualifications.php', delete: 'removequalification.php' },
    pp_parentsguardians: { load: 'fetchparents.php', save: 'parentscript.php', filter: 'fetchparents.php', delete: 'removeparentsguardians.php' },
    pp_query: { load: 'fetchpersonnelmatters.php', save: 'personnelmatterscript.php', filter: 'fetchpersonnelmatters.php', delete: 'removepersonnelmatter.php' },
    pp_promotions: { load: 'fetchpersonnelmatters.php', save: 'personnelmatterscript.php', filter: 'fetchpersonnelmatters.php', delete: 'removepersonnelmatter.php' },
    pp_termination: { load: 'fetchpersonnelmatters.php', save: 'personnelmatterscript.php', filter: 'fetchpersonnelmatters.php', delete: 'removepersonnelmatter.php' },
    pp_suspension: { load: 'fetchpersonnelmatters.php', save: 'personnelmatterscript.php', filter: 'fetchpersonnelmatters.php', delete: 'removepersonnelmatter.php' },
    pp_leave: { load: 'fetchpersonnelmatters.php', save: 'personnelmatterscript.php', filter: 'fetchpersonnelmatters.php', delete: 'removepersonnelmatter.php' },
    pp_warning: { load: 'fetchpersonnelmatters.php', save: 'personnelmatterscript.php', filter: 'fetchpersonnelmatters.php', delete: 'removepersonnelmatter.php' },
    pp_monitorevaluation: { load: 'fetchpersonnelmatters.php', save: 'personnelmatterscript.php', filter: 'fetchpersonnelmatters.php', delete: 'removepersonnelmatter.php' },
    pp_advance: { load: 'fetchpersonnelmatters.php', save: 'personnelmatterscript.php', filter: 'fetchpersonnelmatters.php', delete: 'removepersonnelmatter.php' },
    pp_viewstaffadvance: { load: 'viewstaffadvance.php', save: 'viewstaffadvance.php', filter: 'viewstaffadvance.php' },
    pp_personalstaffsalaryrecord: { load: 'fetchstaffpayroll.php', save: 'fetchstaffpayroll.php', filter: 'fetchstaffpayroll.php' },
    pp_viewmonthlysalaryschedule: { load: 'fetchapprovedpayroll.php', save: 'approvepayroll.php', filter: 'fetchapprovedpayroll.php' },
    pp_presalaryapproval: { load: 'presalaryapproval.php', save: 'presalaryapproval.php', filter: 'presalaryapproval.php' },
    pp_confirmsalary: { load: 'confirmsalary.php', save: 'confirmsalary.php', filter: 'confirmsalary.php' },
    pp_payrollclassa: { load: 'payrollclassa.php', save: 'payrollclassa.php', filter: 'payrollclassa.php' },
    pp_payrollclassb: { load: 'payrollclassb.php', save: 'payrollclassb.php', filter: 'payrollclassb.php' }
};

let hrmLevelEditingId = '';
const hrmTomSelectInstances = {};
let hrmTomSelectAssetsPromise = null;
const hrmPersonnelLevelMetaById = {};
const hrmPersonnelLabelByStaffId = {};
const hrmLevelLabelById = {};
const hrmFilePreviewUrls = {};

const hrmMatterFields = {
    pp_query: [
        { id: 'id', name: 'id', type: 'hidden' },
        { id: 'personnel', label: 'Personnel', type: 'select', options: [], tom_select: true, dynamic_source: 'personnels', required: true },
        { id: 'entrydate', label: 'Entry Date', type: 'date', required: true },
        { id: 'title', label: 'Title', type: 'text', required: true },
        { id: 'startdate', label: 'Start Date', type: 'date' },
        { id: 'enddate', label: 'End Date', type: 'date' },
        { id: 'attachment', label: 'Attachment', type: 'file' }
    ],
    pp_promotions: [
        { id: 'id', name: 'id', type: 'hidden' },
        { id: 'personnel', label: 'Personnel', type: 'select', options: [], tom_select: true, dynamic_source: 'personnels', required: true },
        { id: 'entrydate', label: 'Entry Date', type: 'date', required: true },
        { id: 'title', label: 'Title', type: 'text', required: true },
        { id: 'level', label: 'Level', type: 'select', options: [], tom_select: true, dynamic_source: 'levels', required: true },
        { id: 'attachment', label: 'Attachment', type: 'file' }
    ],
    pp_termination: [
        { id: 'id', name: 'id', type: 'hidden' },
        { id: 'personnel', label: 'Personnel', type: 'select', options: [], tom_select: true, dynamic_source: 'personnels', required: true },
        { id: 'entrydate', label: 'Entry Date', type: 'date', required: true },
        { id: 'title', label: 'Title', type: 'text', required: true },
        { id: 'startdate', label: 'Start Date', type: 'date' },
        { id: 'enddate', label: 'End Date', type: 'date' },
        { id: 'attachment', label: 'Attachment', type: 'file' }
    ],
    pp_suspension: [
        { id: 'id', name: 'id', type: 'hidden' },
        { id: 'personnel', label: 'Personnel', type: 'select', options: [], tom_select: true, dynamic_source: 'personnels', required: true },
        { id: 'entrydate', label: 'Entry Date', type: 'date', required: true },
        { id: 'title', label: 'Title', type: 'text', required: true },
        { id: 'startdate', label: 'Start Date', type: 'date' },
        { id: 'enddate', label: 'End Date', type: 'date' },
        { id: 'attachment', label: 'Attachment', type: 'file' }
    ],
    pp_leave: [
        { id: 'id', name: 'id', type: 'hidden' },
        { id: 'personnel', label: 'Personnel', type: 'select', options: [], tom_select: true, dynamic_source: 'personnels', required: true },
        { id: 'entrydate', label: 'Entry Date', type: 'date', required: true },
        { id: 'title', label: 'Title', type: 'text', required: true },
        { id: 'startdate', label: 'Start Date', type: 'date', required: true },
        { id: 'enddate', label: 'End Date', type: 'date', required: true },
        { id: 'attachment', label: 'Attachment', type: 'file' }
    ],
    pp_warning: [
        { id: 'id', name: 'id', type: 'hidden' },
        { id: 'personnel', label: 'Personnel', type: 'select', options: [], tom_select: true, dynamic_source: 'personnels', required: true },
        { id: 'entrydate', label: 'Entry Date', type: 'date', required: true },
        { id: 'title', label: 'Title', type: 'text', required: true },
        { id: 'startdate', label: 'Start Date', type: 'date' },
        { id: 'enddate', label: 'End Date', type: 'date' },
        { id: 'attachment', label: 'Attachment', type: 'file' }
    ],
    pp_monitorevaluation: [
        { id: 'id', name: 'id', type: 'hidden' },
        { id: 'personnel', label: 'Personnel', type: 'select', options: [], tom_select: true, dynamic_source: 'personnels', required: true },
        { id: 'entrydate', label: 'Entry Date', type: 'date', required: true },
        { id: 'title', label: 'Title', type: 'text', required: true },
        { id: 'startdate', label: 'Start Date', type: 'date' },
        { id: 'enddate', label: 'End Date', type: 'date' },
        { id: 'attachment', label: 'Attachment', type: 'file' }
    ],
    pp_advance: [
        { id: 'id', name: 'id', type: 'hidden' },
        { id: 'personnel', label: 'Personnel', type: 'select', options: [], tom_select: true, dynamic_source: 'personnels', required: true },
        { id: 'entrydate', label: 'Entry Date', type: 'date', required: true },
        { id: 'title', label: 'Title', type: 'text', required: true },
        { id: 'amount', label: 'Amount', type: 'text', required: true },
        { id: 'monthlyinstallment', label: 'Monthly Installment', type: 'text' },
        { id: 'attachment', label: 'Attachment', type: 'file' }
    ]
};

const hrmHtgPersonnelMatterByRoute = {
    pp_query: 'QUERY',
    pp_promotions: 'PROMOTION',
    pp_termination: 'TERMINATION',
    pp_suspension: 'SUSPENSION',
    pp_leave: 'leave',
    pp_warning: 'WARNING',
    pp_monitorevaluation: 'EVALUATION',
    pp_advance: 'ADVANCE'
};

const hrmHtgSubrecordRoutes = new Set([
    'pp_guarantor',
    'pp_employerrecord',
    'pp_referees',
    'pp_qualification',
    'pp_parentsguardians'
]);

const hrmHtgMatterRoutes = new Set(Object.keys(hrmHtgPersonnelMatterByRoute));
const hrmHtgPayloadRoutes = new Set([...hrmHtgSubrecordRoutes, ...hrmHtgMatterRoutes]);
const hrmHtgActionRoutes = new Set([...hrmHtgPayloadRoutes, 'pp_viewstaffadvance']);

function hrmPersonnelFilterFields(extra = []) {
    return [
        { id: 'personnel', label: 'Personnel', type: 'select', options: [], tom_select: true, dynamic_source: 'personnels' },
        ...extra
    ];
}

const hrmInterfaceBlueprints = {
    pp_level: {
        context: 'Salary level setup',
        fields: [
            { id: 'level', label: 'Level Name', type: 'text', required: true },
            { id: 'basicsalary', label: 'Basic Salary', type: 'number', required: true }
        ],
        sections: [
            { title: 'Allowance Lines', columns: ['Allowance Name', 'Percentage', 'Action'] },
            { title: 'Deduction Lines', columns: ['Deduction Name', 'Percentage', 'Action'] }
        ],
        filters: [{ id: 'search', label: 'Search', type: 'text', placeholder: 'Level name' }],
        columns: ['S/N', 'Level', 'Basic Salary', 'Allowances', 'Deductions', 'Action'],
        summary: ['Total Levels', 'Total Basic Salary', 'Allowance Lines', 'Deduction Lines']
    },
    pp_personnel: {
        context: 'Personnel onboarding',
        fields: [
            { id: 'id', name: 'id', type: 'hidden' },
            { id: 'basicsalary', name: 'basicsalary', type: 'hidden' },
            { id: 'staffid', label: 'Staff ID', type: 'text', readonly: true },
            { id: 'maritalstatus', label: 'Marital Status', type: 'select', options: ['SINGLE', 'MARRIED', 'SEPERATED', 'WIDOW', 'WIDOWER'] },
            { id: 'gender', label: 'Gender', type: 'select', options: ['MALE', 'FEMALE'] },
            { id: 'deformity', label: 'Deformity', type: 'select', options: [{ value: '0', label: 'NO' }, { value: '1', label: 'YES' }] },
            { id: 'eyeglasses', label: 'Eye Glasses', type: 'select', options: [{ value: '0', label: 'NO' }, { value: '1', label: 'YES' }] },
            { id: 'hearingaid', label: 'Hearing Aid', type: 'select', options: [{ value: '0', label: 'NO' }, { value: '1', label: 'YES' }] },
            { id: 'firstname', label: 'First Name', type: 'text', required: true },
            { id: 'lastname', label: 'Last Name', type: 'text', required: true },
            { id: 'othernames', label: 'Other Names', type: 'text' },
            { id: 'phonenumber', label: 'Phone', type: 'tel' },
            { id: 'workstatus', label: 'Work Status', type: 'text' },
            { id: 'residentialaddress', label: 'Residential Address', type: 'textarea' },
            { id: 'permanenthomeaddress', label: 'Permanent Home Address', type: 'textarea' },
            { id: 'birthdate', label: 'Birth Date', type: 'date' },
            { id: 'nationality', label: 'Nationality', type: 'text', list: 'orecountry' },
            { id: 'state', label: 'State', type: 'text', list: 'orestate' },
            { id: 'lga', label: 'LGA', type: 'text', list: 'orelga' },
            { id: 'height', label: 'Height', type: 'number' },
            { id: 'weight', label: 'Weight', type: 'number' },
            { id: 'bankaccountnumber1', label: 'Bank Account Number', type: 'text' },
            { id: 'bankname1', label: 'Bank Name', type: 'text' },
            { id: 'levelid', label: 'Level', type: 'select', options: [], required: true, tom_select: true, dynamic_source: 'levels' },
            { id: 'employmentdate', label: 'Employment Date', type: 'date' },
            { id: 'registereduseremail', label: 'Username/Email', type: 'text', list: 'personelallemail' },
            { id: 'userphotoname', label: 'Profile Photo', type: 'file' }
        ],
        filters: hrmCommonFilters,
        columns: ['S/N', 'Staff ID', 'Name', 'Phone', 'Level', 'Status', 'Action'],
        summary: ['Total Personnel', 'Pending Approval', 'Approved', 'Inactive']
    },
    pp_approvepersonnel: {
        context: 'Personnel approval queue',
        fields: [],
        filters: [
            { id: 'search', label: 'Search', type: 'text', placeholder: 'Staff name, ID, phone, or email' }
        ],
        actions: ['Approve Selected', 'Decline Selected'],
        columns: ['Select', 'S/N', 'Staff ID', 'Name', 'Phone', 'Gender', 'Address', 'Email', 'Employment Date', 'Basic Salary', 'Action'],
        summary: ['Pending Approval', 'Selected', 'Total Basic Salary', 'Allowance Lines']
    },
    pp_viewpersonnel: {
        context: 'Personnel directory',
        fields: [],
        filters: hrmCommonFilters.concat([{ id: 'status', label: 'Status', type: 'select', options: ['All Status', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'TERMINATED'] }]),
        actions: ['Open Profile', 'Export Directory'],
        columns: ['S/N', 'Staff ID', 'Name', 'Phone', 'Level', 'Status', 'Action'],
        summary: ['Total Personnel', 'Active', 'Suspended', 'Terminated']
    },
    pp_personnelhistory: {
        context: 'Personnel audit trail',
        fields: [],
        filters: [
            { id: 'personnel', label: 'Personnel', type: 'select', options: [], tom_select: true, dynamic_source: 'personnel_history_personnels', wrapper_class: 'lg:col-span-3' }
        ],
        columns: ['S/N', 'Section', 'Title', 'Details', 'Entry Date', 'Document'],
        summary: []
    },
    pp_guarantor: {
        context: 'Guarantor records',
        fields: [
            { id: 'id', name: 'id', type: 'hidden' },
            { id: 'personnel', label: 'Staff ID', type: 'select', options: [], tom_select: true, dynamic_source: 'personnels', required: true },
            { id: 'guarantorname', label: 'Guarantor Name', type: 'text', required: true },
            { id: 'occupation', label: 'Occupation', type: 'text' },
            { id: 'phonenumber', label: 'Phone Number', type: 'tel' },
            { id: 'address', label: 'Residential Address', type: 'text' },
            { id: 'officeaddress', label: 'Office Address', type: 'text' },
            { id: 'yearsknown', label: 'Years Known', type: 'text' },
            { id: 'attachment', label: 'Attachment', type: 'file' }
        ],
        filters: hrmPersonnelFilterFields(),
        columns: ['S/N', 'Personnel', 'Guarantor Name', 'Occupation', 'Phone Number', 'Residential Address', 'Action'],
        summary: ['Total Guarantors', 'With Attachment', 'Missing Phone', 'Updated This Month']
    },
    pp_employerrecord: {
        context: 'Previous employment records',
        fields: [
            { id: 'id', name: 'id', type: 'hidden' },
            { id: 'personnel', label: 'Personnel', type: 'select', options: [], tom_select: true, dynamic_source: 'personnels', required: true },
            { id: 'employer', label: 'Employer', type: 'text', required: true },
            { id: 'position', label: 'Position', type: 'text' },
            { id: 'basic', label: 'Basic Salary', type: 'text' },
            { id: 'yearsemployed', label: 'Years Employed', type: 'number' },
            { id: 'reasonforleaving', label: 'Reason For Leaving', type: 'text' },
            { id: 'attachment', label: 'Attachment', type: 'file' }
        ],
        filters: hrmPersonnelFilterFields(),
        columns: ['S/N', 'Personnel', 'Employer', 'Position', 'Basic', 'Years Employed', 'Reason For Leaving', 'Action'],
        summary: ['Records', 'Current Employers', 'Past Employers', 'Updated This Month']
    },
    pp_referees: {
        context: 'Referee records',
        fields: [
            { id: 'id', name: 'id', type: 'hidden' },
            { id: 'personnel', label: 'Personnel', type: 'select', options: [], tom_select: true, dynamic_source: 'personnels', required: true },
            { id: 'fullname', label: 'Referee Name', type: 'text', required: true },
            { id: 'relationship', label: 'Relationship', type: 'text' },
            { id: 'occupation', label: 'Occupation', type: 'text' },
            { id: 'phonenumber', label: 'Phone Number', type: 'tel' },
            { id: 'address', label: 'Address', type: 'text' },
            { id: 'attachment', label: 'Attachment', type: 'file' }
        ],
        filters: hrmPersonnelFilterFields(),
        columns: ['S/N', 'Personnel', 'Referee', 'Relationship', 'Occupation', 'Phone Number', 'Address', 'Action'],
        summary: ['Referees', 'Complete Records', 'With Phone', 'With Document']
    },
    pp_qualification: {
        context: 'Qualification records',
        fields: [
            { id: 'id', name: 'id', type: 'hidden' },
            { id: 'personnel', label: 'Personnel', type: 'select', options: [], tom_select: true, dynamic_source: 'personnels', required: true },
            { id: 'institution', label: 'Institution', type: 'text' },
            { id: 'qualification', label: 'Qualification', type: 'text', required: true },
            { id: 'certificationdate', label: 'Certification Date', type: 'date' },
            { id: 'attachment', label: 'Certificate', type: 'file' }
        ],
        filters: hrmPersonnelFilterFields(),
        columns: ['S/N', 'Personnel', 'Institution', 'Qualification', 'Certification Date', 'Document', 'Action'],
        summary: ['Qualifications', 'With Certificate', 'Professional', 'Academic']
    },
    pp_parentsguardians: {
        context: 'Parent and guardian records',
        fields: [
            { id: 'id', name: 'id', type: 'hidden' },
            { id: 'personnel', label: 'Personnel', type: 'select', options: [], tom_select: true, dynamic_source: 'personnels', required: true },
            { id: 'parentone', label: 'Parent/Guardian One', type: 'text', required: true },
            { id: 'parenttwo', label: 'Parent/Guardian Two', type: 'text' },
            { id: 'parentoneoccupation', label: 'Parent One Occupation', type: 'text' },
            { id: 'parenttwooccupation', label: 'Parent Two Occupation', type: 'text' },
            { id: 'parentonephone', label: 'Parent One Phone', type: 'text' },
            { id: 'parenttwophone', label: 'Parent Two Phone', type: 'text' },
            { id: 'homeaddress', label: 'Home Address', type: 'textarea' },
            { id: 'officeaddress', label: 'Office Address', type: 'textarea' },
            { id: 'attachment', label: 'Attachment', type: 'file' }
        ],
        filters: hrmPersonnelFilterFields(),
        columns: ['S/N', 'Personnel', 'Parent One', 'Parent Two', 'Parent One Occupation', 'Parent Two Occupation', 'Parent One Phone', 'Parent Two Phone', 'Home Address', 'Office Address', 'Action'],
        summary: ['Guardians', 'Emergency Contacts', 'Missing Phone', 'Updated This Month']
    },
    pp_viewstaffadvance: {
        context: 'Advance report',
        fields: [],
        filters: hrmPersonnelFilterFields(),
        columns: ['S/N', 'Personnel', 'Title', 'Amount', 'Entry Date', 'Action'],
        summary: ['Total Advance', 'Recovered', 'Outstanding', 'Open Records']
    },
    pp_personalstaffsalaryrecord: {
        context: 'Staff salary record review',
        fields: [],
        filters: hrmPersonnelFilterFields(),
        columns: ['S/N', 'Personnel', 'Entry Date', 'Month', 'Year', 'Total Allowance', 'Total Deduction', 'With Attendance', 'Net Payable'],
        summary: ['Records', 'Total Allowance', 'Total Deduction', 'Net Payable']
    },
    pp_viewmonthlysalaryschedule: {
        context: 'Approved salary schedule',
        fields: [],
        filters: [
            { id: 'location', label: 'Select by Branch', type: 'select', options: [], dynamic_source: 'locations' },
            { id: 'month', label: 'Select Month', type: 'select', options: hrmMonthSelectOptions },
            { id: 'year', label: 'Year', type: 'select', options: hrmPayrollYearOptions() }
        ],
        columns: ['S/N', '', 'First Name', 'Other Names', 'Last Name', 'Department', 'Level', 'Net Payable', 'Total Allowance', 'Total Deduction', 'Allowances', 'Deductions', 'Entry Date'],
        summary: ['Total Net Payables', 'Total Allowance', 'Total Deductions', 'Total Basic Salary', 'Month', 'Year']
    },
    pp_presalaryapproval: {
        context: 'Payroll processing',
        fields: [],
        filters: [{ id: 'month', label: 'Month', type: 'month' }],
        actions: ['Run Payroll', 'Send For Approval'],
        columns: ['Select', 'S/N', 'Staff ID', 'Name', 'Month', 'Gross Pay', 'Deduction', 'Net Pay', 'Status'],
        summary: ['Payroll Count', 'Gross Pay', 'Deductions', 'Net Pay']
    },
    pp_confirmsalary: {
        context: 'Payroll approval',
        fields: [],
        filters: [{ id: 'month', label: 'Month', type: 'month' }, { id: 'location', label: 'Location', type: 'text' }, { id: 'status', label: 'Status', type: 'select', options: ['PENDING', 'APPROVED', 'DECLINED'] }],
        actions: ['Approve Selected', 'Delete Selected'],
        columns: ['Select', 'S/N', 'Staff ID', 'Name', 'Basic Salary', 'Allowance', 'Deduction', 'Net Pay', 'Action'],
        summary: ['Pending Payroll', 'Approved', 'Deleted', 'Total Net Pay']
    },
    pp_payrollclassa: {
        context: 'Payroll class A report',
        fields: [],
        filters: [{ id: 'month', label: 'Month', type: 'month' }, { id: 'location', label: 'Location', type: 'text' }],
        columns: ['S/N', 'Staff ID', 'Name', 'Designation', 'Basic Salary', 'Allowance', 'Deduction', 'Net Pay'],
        summary: ['Class A Staff', 'Gross Pay', 'Deductions', 'Net Pay']
    },
    pp_payrollclassb: {
        context: 'Payroll class B report',
        fields: [],
        filters: [{ id: 'month', label: 'Month', type: 'month' }, { id: 'location', label: 'Location', type: 'text' }],
        columns: ['S/N', 'Staff ID', 'Name', 'Bank', 'Account Number', 'Net Pay', 'Status', 'Action'],
        summary: ['Class B Staff', 'Bank Ready', 'Total Net Pay', 'Pending']
    }
};

['pp_query', 'pp_promotions', 'pp_termination', 'pp_suspension', 'pp_leave', 'pp_warning', 'pp_monitorevaluation', 'pp_advance'].forEach((route) => {
    const columnsByRoute = {
        pp_promotions: ['S/N', 'Personnel', 'Level', 'Title', 'Entry Date', 'Action'],
        pp_leave: ['S/N', 'Personnel', 'Entry Date', 'Title', 'Start Date', 'End Date', 'Action'],
        pp_advance: ['S/N', 'Personnel', 'Title', 'Amount', 'Entry Date', 'Action']
    };
    hrmInterfaceBlueprints[route] = {
        context: `${hrmInterfaceRegistry[route].title} records`,
        fields: hrmMatterFields[route],
        filters: hrmPersonnelFilterFields(),
        columns: columnsByRoute[route] || ['S/N', 'Personnel', 'Entry Date', 'Title', 'Action'],
        summary: ['Total Records', 'Open', 'Closed', 'Updated This Month']
    };
});

function hrmWorkspaceActive() {
    hrmHideDeprecatedHrmNavigation();
    const requestedRoute = new URLSearchParams(window.location.search).get('r') || '';
    const routeAliases = {
        pp_viewstaffadvance: 'pp_advance',
        pp_viewpersonnel: 'pp_personnel'
    };
    const route = routeAliases[requestedRoute] || requestedRoute;
    const config = hrmInterfaceRegistry[route];
    if (!config) return;

    const blueprint = hrmInterfaceBlueprints[route] || buildDefaultHrmBlueprint(route, config);
    const fields = blueprint.fields || [];
    const filters = blueprint.filters || hrmCommonFilters;
    const sections = blueprint.sections || [];
    const hasEntrySection = fields.length > 0 || sections.length > 0;
    const hasFilters = filters.length > 0;
    const hasSummary = Array.isArray(blueprint.summary) && blueprint.summary.length > 0;
    const hasViewSection = true;
    const pageTitle = document.getElementById('hrm_page_title');
    const tableTitle = document.getElementById('hrm_table_title');
    const inputTabLabel = document.getElementById('hrm_tab_input_label');
    const viewTabLabel = document.getElementById('hrm_tab_view_label');

    if (pageTitle) pageTitle.textContent = config.title;
    if (tableTitle) tableTitle.textContent = `${config.title} Records`;
    if (inputTabLabel) inputTabLabel.textContent = config.title;
    if (viewTabLabel) viewTabLabel.textContent = `View ${config.title}`;

    hrmToggleElement('hrm_workspace_tabs', hasEntrySection && hasViewSection);
    hrmToggleElement('hrm_tabs_separator', hasEntrySection && hasViewSection);
    hrmToggleElement('hrm_input_tabpane', hasEntrySection);
    hrmToggleElement('hrm_view_tabpane', hasViewSection);
    hrmToggleElement('hrm_entry_form', hasEntrySection);
    hrmToggleElement('hrm_form_actions', hasEntrySection);
    hrmToggleElement('hrm_filter_panel', hasFilters);
    hrmToggleElement('hrm_filter_separator', hasFilters);
    hrmToggleElement('hrm_summary_grid', hasSummary);
    hrmSetActiveTab((hasEntrySection && hasViewSection) ? 'input' : 'view');

    hrmRenderFields('hrm_entry_grid', fields);
    hrmRenderFilters(filters, route);
    hrmRenderDynamicSections(blueprint.sections || [], route);
    hrmRenderSummary(blueprint.summary || ['Records', 'Pending', 'Approved', 'Updated']);
    hrmRenderTable(blueprint.columns || ['S/N', 'Name', 'Status', 'Action'], config.title);
    hrmBindFileUploadPreviews();
    hrmBindAmountInputFormatting(blueprint);
    hrmBindWorkspaceControls(route, blueprint);
}

function hrmHideDeprecatedHrmNavigation() {
    ['pp_viewstaffadvance', 'pp_viewstaffadvance_main', 'pp_viewpersonnel', 'pp_viewpersonnel_main'].forEach((id) => {
        const element = document.getElementById(id);
        if (element) element.classList.add('hidden');
    });
}

function hrmToggleElement(id, shouldShow) {
    const element = document.getElementById(id);
    if (!element) return;
    element.classList.toggle('hidden', !shouldShow);
}

function hrmSetActiveTab(tab) {
    const inputButton = document.getElementById('hrm_tab_input');
    const viewButton = document.getElementById('hrm_tab_view');
    const inputPane = document.getElementById('hrm_input_tabpane');
    const viewPane = document.getElementById('hrm_view_tabpane');
    const isInput = tab === 'input';
    const activeElement = isInput ? inputButton : viewButton;

    if (typeof runoptioner === 'function' && activeElement?.getAttribute('name')) {
        runoptioner(activeElement);
        return;
    }

    if (inputButton) inputButton.classList.toggle('!text-blue-600', isInput);
    if (inputButton) inputButton.classList.toggle('active', isInput);
    if (viewButton) viewButton.classList.toggle('!text-blue-600', !isInput);
    if (viewButton) viewButton.classList.toggle('active', !isInput);
    if (inputPane) inputPane.classList.toggle('hidden', !isInput);
    if (viewPane) viewPane.classList.toggle('hidden', isInput);
}

function hrmPopulateEntryForm(record = {}) {
    if (!record || typeof record !== 'object') return;
    Object.keys(record).forEach((key) => {
        const control = document.getElementById(key);
        if (!control) return;
        if (control.type === 'checkbox') {
            control.checked = Boolean(record[key]);
            return;
        }
        control.value = record[key] ?? '';
        if (control.type === 'text' && /amount|salary|installment/i.test(String(key || ''))) {
            const normalized = hrmStripNumericFormatting(control.value || '');
            if (normalized && /^-?\d*\.?\d*$/.test(normalized)) {
                control.value = hrmFormatNumberWithCommas(normalized);
            }
        }
        if (hrmTomSelectInstances[key]) {
            hrmTomSelectInstances[key].setValue(control.value, true);
        }
    });
}

window.hrmNavigateToInput = function(record = {}) {
    const inputPane = document.getElementById('hrm_input_tabpane');
    const entryForm = document.getElementById('hrm_entry_form');
    const formActions = document.getElementById('hrm_form_actions');
    const tabs = document.getElementById('hrm_workspace_tabs');
    const tabsSeparator = document.getElementById('hrm_tabs_separator');
    if (inputPane?.classList.contains('hidden')) {
        inputPane.classList.remove('hidden');
        if (entryForm) entryForm.classList.remove('hidden');
        if (formActions) formActions.classList.remove('hidden');
        if (tabs) tabs.classList.remove('hidden');
        if (tabsSeparator) tabsSeparator.classList.remove('hidden');
    }
    hrmSetActiveTab('input');
    hrmPopulateEntryForm(record);
};

function hrmFocusFirstEditableInput() {
    const form = document.getElementById('hrm_entry_form');
    if (!form) return;
    const target = form.querySelector('input:not([type="hidden"]):not([readonly]), select:not([readonly]), textarea:not([readonly])');
    if (target && typeof target.focus === 'function') target.focus();
}

function hrmEnterEditMode(record = {}, saveButton = null) {
    const form = document.getElementById('hrm_entry_form');
    if (form) form.dataset.hrmMode = 'update';
    window.hrmNavigateToInput(record);
    const inputPane = document.getElementById('hrm_input_tabpane');
    if (inputPane && typeof inputPane.scrollIntoView === 'function') {
        inputPane.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    requestAnimationFrame(() => {
        hrmPopulateEntryForm(record);
        hrmRenderExistingAttachmentPreview(record?.existingdocument || hrmFirstFilled(record, 'doc', 'document', 'filename', 'photofilename'));
        hrmFocusFirstEditableInput();
    });
    const saveLabel = saveButton?.querySelector('span:last-child');
    if (saveLabel) saveLabel.textContent = 'Update';
}

function hrmRenderExistingAttachmentPreview(documentName = '') {
    const filename = hrmNormalizePersonnelValue(documentName);
    const preview = document.getElementById('attachment_preview');
    if (!preview || !filename || filename === '-') return;
    const href = `../images/personnel/${encodeURIComponent(filename)}`;
    const extension = hrmGetFileExtension(filename).toLowerCase();
    const isImage = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'].includes(extension);
    if (isImage) {
        preview.innerHTML = `
            <a href="${href}" target="_blank" rel="noopener" class="flex items-center gap-3" title="Open ${hrmEscapeHtml(filename)}">
                <img src="${href}" alt="${hrmEscapeHtml(filename)}" class="w-16 h-16 object-cover rounded border border-slate-200">
                <div class="flex flex-col">
                    <span class="font-medium text-slate-800">${hrmEscapeHtml(filename)}</span>
                    <span class="text-xs text-blue-700 underline">Open image</span>
                </div>
            </a>
        `;
        return;
    }
    preview.innerHTML = hrmDocumentTableCell(filename);
}

function buildDefaultHrmBlueprint(route, config) {
    return {
        context: `${config.title} records`,
        fields: [
            { id: 'personnel', label: 'Personnel', type: 'text', list: 'hrm_personnel_list' },
            { id: 'entrydate', label: 'Entry Date', type: 'date' },
            { id: 'status', label: 'Status', type: 'select', options: ['ACTIVE', 'INACTIVE'] },
            { id: 'remark', label: 'Remark', type: 'textarea' }
        ],
        filters: hrmCommonFilters,
        columns: ['S/N', 'Staff ID', 'Name', config.title, 'Entry Date', 'Status', 'Action'],
        summary: ['Total Records', 'Active', 'Inactive', 'Updated This Month']
    };
}

function hrmRenderFields(containerId, fields) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const visibleFields = (fields || []).filter((field) => !hrmHiddenFrontendFields.has((field?.id || '').toLowerCase()));

    if (!fields.length) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = visibleFields.map((field) => hrmBuildControl(field)).join('');
}

function hrmBindAmountInputFormatting(blueprint = {}) {
    const fields = Array.isArray(blueprint?.fields) ? blueprint.fields : [];
    if (!fields.length) return;
    const moneyLikePattern = /amount|salary|installment/i;

    fields.forEach((field) => {
        if (!field || ['hidden', 'file', 'select', 'textarea', 'number'].includes(field.type)) return;
        const marker = `${field.id || ''} ${field.label || ''}`;
        if (!moneyLikePattern.test(marker)) return;

        const control = document.getElementById(field.id);
        if (!control || control.dataset.hrmAmountFormatBound === '1') return;
        control.dataset.hrmAmountFormatBound = '1';

        const formatCurrentValue = () => {
            const normalized = hrmStripNumericFormatting(control.value || '');
            if (!normalized || !/^-?\d*\.?\d*$/.test(normalized)) return;
            control.value = hrmFormatNumberWithCommas(normalized);
        };

        control.addEventListener('input', formatCurrentValue);
        control.addEventListener('blur', formatCurrentValue);
        formatCurrentValue();
    });
}

function hrmIsPersonnelOnlyFilter(fields = []) {
    const visibleFields = (Array.isArray(fields) ? fields : []).filter((field) => !hrmHiddenFrontendFields.has((field?.id || '').toLowerCase()));
    return visibleFields.length === 1 && String(visibleFields[0]?.id || '').toLowerCase() === 'personnel';
}

function hrmRenderFilters(fields, route = '') {
    const personnelOnlyFilter = hrmIsPersonnelOnlyFilter(fields);
    const filterFields = fields.map((field) => ({
        ...field,
        id: `hrm_filter_${field.id}`,
        name: field.name || field.id,
        wrapper_class: personnelOnlyFilter && String(field?.id || '').toLowerCase() === 'personnel'
            ? `${field.wrapper_class || ''} lg:col-span-4`
            : field.wrapper_class
    }));
    hrmRenderFields('hrm_filter_grid', filterFields);
}

function hrmRenderDynamicSections(sections, route = '') {
    const container = document.getElementById('hrm_dynamic_sections');
    if (!container) return;

    if (route === 'pp_level') {
        container.innerHTML = `
            <div class="border border-slate-200 rounded-sm p-4">
                <div class="flex items-center justify-between mb-3">
                    <p class="text-sm font-semibold text-slate-700">Allowance Lines</p>
                    <button type="button" id="hrm_level_add_allowance" class="btn hrm-ui-action" title="Add allowance line"><span>Add Line</span></button>
                </div>
                <div id="hrm_level_allowance_container" class="flex flex-col gap-2"></div>
            </div>
            <div class="border border-slate-200 rounded-sm p-4">
                <div class="flex items-center justify-between mb-3">
                    <p class="text-sm font-semibold text-slate-700">Deduction Lines</p>
                    <button type="button" id="hrm_level_add_deduction" class="btn hrm-ui-action" title="Add deduction line"><span>Add Line</span></button>
                </div>
                <div id="hrm_level_deduction_container" class="flex flex-col gap-2"></div>
            </div>
        `;
        hrmRenderLevelLineEditors([], []);
        return;
    }

    container.innerHTML = sections.map((section) => `
        <div class="border border-slate-200 rounded-sm p-4">
            <div class="flex items-center justify-between mb-3">
                <p class="text-sm font-semibold text-slate-700">${section.title}</p>
                <button type="button" class="btn hrm-ui-action" title="Add ${section.title} line"><span>Add Line</span></button>
            </div>
            <div class="table-content">
                <table>
                    <thead><tr>${section.columns.map((column) => `<th>${column}</th>`).join('')}</tr></thead>
                    <tbody><tr><td colspan="${section.columns.length}" class="text-center opacity-70">No lines added</td></tr></tbody>
                </table>
            </div>
        </div>
    `).join('');
}

function hrmBuildLevelLineRow(type, value = '', percent = '', removable = true) {
    const isAllowance = type === 'ALLOWANCE';
    const lineClass = isAllowance ? 'allowancename' : 'deductionname';
    const pctClass = isAllowance ? 'allowancepercent' : 'deductionpecent';
    const placeholderText = isAllowance ? 'Allowance name' : 'Deduction name';
    const removeButton = removable
        ? `<button type="button" class="btn hrm-ui-action hrm-level-remove-line" title="Remove line" style="background-color:#dc2626 !important;color:#fff !important;min-width:38px;padding:6px 10px;"><span class="material-symbols-outlined" style="font-size:16px;line-height:1;">delete</span></button>`
        : `<span class="text-xs text-slate-500">Primary line</span>`;

    return `
        <div class="grid grid-cols-1 md:grid-cols-[1fr_180px_auto] gap-2 items-end hrm-level-line">
            <div class="form-group mb-0">
                <label class="control-label">${isAllowance ? 'Allowance Name' : 'Deduction Name'}</label>
                <input type="text" class="form-control ${lineClass}" placeholder="${placeholderText}" value="${value || ''}">
            </div>
            <div class="form-group mb-0">
                <label class="control-label">Percentage %</label>
                <input type="number" class="form-control ${pctClass}" placeholder="Percentage %" value="${percent || ''}">
            </div>
            <div class="pb-1">${removeButton}</div>
        </div>
    `;
}

function hrmRenderLevelLineEditors(allowances = [], deductions = []) {
    const allowanceContainer = document.getElementById('hrm_level_allowance_container');
    const deductionContainer = document.getElementById('hrm_level_deduction_container');
    if (!allowanceContainer || !deductionContainer) return;

    const allowanceRows = Array.isArray(allowances) && allowances.length > 0 ? allowances : [{ salaryinfo: '', amountpercentage: '' }];
    const deductionRows = Array.isArray(deductions) && deductions.length > 0 ? deductions : [{ salaryinfo: '', amountpercentage: '' }];

    allowanceContainer.innerHTML = allowanceRows.map((row, index) => hrmBuildLevelLineRow('ALLOWANCE', row?.salaryinfo, row?.amountpercentage, index > 0)).join('');
    deductionContainer.innerHTML = deductionRows.map((row, index) => hrmBuildLevelLineRow('DEDUCTION', row?.salaryinfo, row?.amountpercentage, index > 0)).join('');
}

function hrmAddLevelLine(type) {
    const containerId = type === 'ALLOWANCE' ? 'hrm_level_allowance_container' : 'hrm_level_deduction_container';
    const container = document.getElementById(containerId);
    if (!container) return;
    container.insertAdjacentHTML('beforeend', hrmBuildLevelLineRow(type, '', '', true));
}

function hrmCollectLevelLines(payload) {
    const allowanceNames = Array.from(document.getElementsByClassName('allowancename'));
    const allowancePercents = Array.from(document.getElementsByClassName('allowancepercent'));
    const deductionNames = Array.from(document.getElementsByClassName('deductionname'));
    const deductionPercents = Array.from(document.getElementsByClassName('deductionpecent'));

    allowanceNames.forEach((item, index) => payload.append(`allowances${index}`, item.value || ''));
    allowancePercents.forEach((item, index) => payload.append(`amountpercentage${index}`, item.value || ''));
    deductionNames.forEach((item, index) => payload.append(`deductions${index}`, item.value || ''));
    deductionPercents.forEach((item, index) => payload.append(`dedamountpercentage${index}`, item.value || ''));

    payload.append('allgridsize', allowanceNames.length);
    payload.append('dedgridsize', deductionNames.length);
}

function hrmNormalizeLevelRows(responseData) {
    if (Array.isArray(responseData)) return responseData;
    if (Array.isArray(responseData?.data)) return responseData.data;
    if (Array.isArray(responseData?.data?.data)) return responseData.data.data;
    if (Array.isArray(responseData?.result)) return responseData.result;
    return [];
}

function hrmRenderLevelRows(rows, columns) {
    const body = document.getElementById('hrm_table_body');
    const status = document.getElementById('hrm_table_status');
    if (!body) return;

    if (!Array.isArray(rows) || rows.length === 0) {
        body.innerHTML = `<tr><td colspan="${columns.length}" class="text-center opacity-70">No level records found.</td></tr>`;
        if (status) status.textContent = 'Showing 0 to 0 of 0 records';
        hrmSetSummaryValues(['0', '0', '0', '0']);
        return;
    }

    body.innerHTML = rows.map((entry, index) => {
        const level = entry?.level || {};
        const structure = Array.isArray(entry?.salarystructure) ? entry.salarystructure : [];
        const allowanceValues = structure
            .filter((item) => item?.salaryinfotype === 'ALLOWANCE')
            .map((item) => `${item?.salaryinfo || 'Allowance'} ${item?.amountpercentage ?? 0}%`);
        const deductionValues = structure
            .filter((item) => item?.salaryinfotype === 'DEDUCTION')
            .map((item) => `${item?.salaryinfo || 'Deduction'} ${item?.amountpercentage ?? 0}%`);
        const entryId = level?.id ?? '';
        const payload = encodeURIComponent(JSON.stringify(entry));

        return `
            <tr>
                <td>${index + 1}</td>
                <td>${level?.level ?? ''}</td>
                <td>${hrmFormatNumberWithCommas(level?.basicsalary ?? '')}</td>
                <td>${allowanceValues.length ? allowanceValues.join(', ') : '-'}</td>
                <td>${deductionValues.length ? deductionValues.join(', ') : '-'}</td>
                <td>
                    <div class="flex flex-wrap gap-2">
                        <button type="button" class="btn hrm-ui-action" data-hrm-level-edit="${entryId}" data-hrm-level-record="${payload}" title="Edit level" style="background:#2563eb;color:#fff;min-width:38px;padding:6px 10px;"><span class="material-symbols-outlined" style="font-size:16px;line-height:1;">edit</span></button>
                        <button type="button" class="btn hrm-ui-action" data-hrm-level-delete="${entryId}" title="Delete level" style="background-color:#dc2626 !important;color:#fff !important;min-width:38px;padding:6px 10px;"><span class="material-symbols-outlined" style="font-size:16px;line-height:1;">delete</span></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    const totalBasicSalary = rows.reduce((sum, entry) => {
        const raw = entry?.level?.basicsalary ?? 0;
        const normalized = Number(String(raw).replace(/[^0-9.-]/g, ''));
        return sum + (Number.isFinite(normalized) ? normalized : 0);
    }, 0);
    const totalAllowanceLines = rows.reduce((sum, entry) => {
        const structure = Array.isArray(entry?.salarystructure) ? entry.salarystructure : [];
        return sum + structure.filter((item) => item?.salaryinfotype === 'ALLOWANCE').length;
    }, 0);
    const totalDeductionLines = rows.reduce((sum, entry) => {
        const structure = Array.isArray(entry?.salarystructure) ? entry.salarystructure : [];
        return sum + structure.filter((item) => item?.salaryinfotype === 'DEDUCTION').length;
    }, 0);
    hrmSetSummaryValues([
        `${rows.length}`,
        `${totalBasicSalary.toLocaleString()}`,
        `${totalAllowanceLines}`,
        `${totalDeductionLines}`
    ]);

    if (status) status.textContent = `Showing 1 to ${rows.length} of ${rows.length} records`;
}

function hrmEscapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function hrmNormalizePersonnelRows(responseData) {
    if (Array.isArray(responseData)) return responseData;
    if (Array.isArray(responseData?.data)) return responseData.data;
    if (Array.isArray(responseData?.data?.data)) return responseData.data.data;
    return [];
}

function hrmNormalizePersonnelValue(value) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'number') return String(value);
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed || trimmed === '-' || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'undefined') return '';
        return trimmed;
    }
    return String(value);
}

function hrmNormalizePersonnelStatus(value) {
    return String(hrmNormalizePersonnelValue(value)).trim().toUpperCase();
}

function hrmPersonnelDisplayStatus(value) {
    const normalized = hrmNormalizePersonnelStatus(value);
    if (!normalized) return '-';
    if (normalized === 'OPEN') return 'ACTIVE';
    return normalized;
}

function hrmDecodeHtmlEntities(value) {
    const str = hrmNormalizePersonnelValue(value);
    if (!str) return '';
    const parser = document.createElement('textarea');
    parser.innerHTML = str;
    return parser.value;
}

function hrmMapPersonnelEntryToForm(entry = {}) {
    const personnel = entry?.personnel || entry || {};
    return {
        id: hrmNormalizePersonnelValue(personnel?.id),
        staffid: hrmNormalizePersonnelValue(personnel?.staffid),
        lastname: hrmDecodeHtmlEntities(personnel?.lastname),
        firstname: hrmDecodeHtmlEntities(personnel?.firstname),
        othernames: hrmDecodeHtmlEntities(personnel?.othernames),
        phonenumber: hrmNormalizePersonnelValue(personnel?.phonenumber),
        workstatus: hrmDecodeHtmlEntities(personnel?.workstatus),
        maritalstatus: hrmNormalizePersonnelValue(personnel?.maritalstatus),
        residentialaddress: hrmDecodeHtmlEntities(personnel?.residentialaddress),
        permanenthomeaddress: hrmDecodeHtmlEntities(personnel?.permanenthomeaddress),
        gender: hrmNormalizePersonnelValue(personnel?.gender),
        birthdate: hrmNormalizePersonnelValue(personnel?.birthdate),
        nationality: hrmDecodeHtmlEntities(personnel?.nationality),
        state: hrmDecodeHtmlEntities(personnel?.state),
        lga: hrmDecodeHtmlEntities(personnel?.lga),
        deformity: hrmNormalizePersonnelValue(personnel?.deformity),
        eyeglasses: hrmNormalizePersonnelValue(personnel?.eyeglasses),
        hearingaid: hrmNormalizePersonnelValue(personnel?.hearingaid),
        height: hrmNormalizePersonnelValue(personnel?.height),
        weight: hrmNormalizePersonnelValue(personnel?.weight),
        bankname1: hrmDecodeHtmlEntities(personnel?.bankname1),
        bankaccountnumber1: hrmNormalizePersonnelValue(personnel?.bankaccountnumber1),
        employmentdate: hrmNormalizePersonnelValue(personnel?.employmentdate),
        registereduseremail: hrmNormalizePersonnelValue(personnel?.registereduseremail || personnel?.user),
        levelid: hrmNormalizePersonnelValue(personnel?.levelid),
        departmentid: hrmNormalizePersonnelValue(personnel?.departmentid),
        groupid: hrmNormalizePersonnelValue(personnel?.groupid),
        basicsalary: hrmNormalizePersonnelValue(personnel?.basicsalary)
    };
}

function hrmOpenPersonnelModal(entry = {}) {
    const personnel = entry?.personnel || {};
    const salarystructure = Array.isArray(entry?.salarystructure) ? entry.salarystructure : [];
    const allowances = salarystructure.filter((line) => String(line?.salaryinfotype || '').toUpperCase() === 'ALLOWANCE');
    const deductions = salarystructure.filter((line) => String(line?.salaryinfotype || '').toUpperCase() === 'DEDUCTION');
    const fullName = [personnel.lastname, personnel.firstname, personnel.othernames].filter(Boolean).join(' ').trim();

    const previous = document.getElementById('hrm_personnel_view_modal');
    if (previous) previous.remove();

    const modal = document.createElement('div');
    modal.id = 'hrm_personnel_view_modal';
    modal.className = 'fixed inset-0 z-[2000] bg-black/50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-md shadow-xl w-full max-w-5xl max-h-[92vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <div>
                    <p class="text-lg font-semibold text-slate-800">Personnel Details</p>
                    <p class="text-sm text-slate-500">${hrmEscapeHtml(fullName || 'Unnamed Personnel')} (${hrmEscapeHtml(personnel.staffid || '-')})</p>
                </div>
                <button type="button" id="hrm_personnel_modal_close" class="btn" title="Close">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <div class="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 text-sm">
                ${[
                    ['Status', hrmPersonnelDisplayStatus(personnel.status)],
                    ['Work Status', personnel.workstatus],
                    ['Marital Status', personnel.maritalstatus],
                    ['Gender', personnel.gender],
                    ['Phone', personnel.phonenumber],
                    ['Email', personnel.registereduseremail || personnel.user],
                    ['Nationality', personnel.nationality],
                    ['State', personnel.state],
                    ['LGA', personnel.lga],
                    ['Birth Date', personnel.birthdate],
                    ['Employment Date', personnel.employmentdate],
                    ['Level', personnel.levelname || personnel.levelid],
                    ['Basic Salary', hrmFormatNumberWithCommas(personnel.basicsalary)],
                    ['Deformity', personnel.deformity === '1' ? 'YES' : 'NO'],
                    ['Eye Glasses', personnel.eyeglasses === '1' ? 'YES' : 'NO'],
                    ['Hearing Aid', personnel.hearingaid === '1' ? 'YES' : 'NO'],
                    ['Height', personnel.height],
                    ['Weight', personnel.weight],
                    ['Bank Name', personnel.bankname1],
                    ['Bank Account', personnel.bankaccountnumber1],
                    ['Residential Address', personnel.residentialaddress],
                    ['Permanent Address', personnel.permanenthomeaddress]
                ].map(([label, value]) => `
                    <div class="border border-slate-200 rounded-sm p-3 bg-slate-50/60">
                        <p class="text-xs uppercase tracking-wide text-slate-500">${hrmEscapeHtml(label)}</p>
                        <p class="text-sm font-medium text-slate-800 mt-1 break-words">${hrmEscapeHtml(value || '-')}</p>
                    </div>
                `).join('')}
            </div>
            <div class="px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div class="border border-slate-200 rounded-sm p-4">
                    <p class="text-sm font-semibold text-slate-700 mb-2">Allowances</p>
                    <div class="space-y-2">
                        ${allowances.length ? allowances.map((line) => `
                            <div class="flex items-center justify-between text-sm">
                                <span>${hrmEscapeHtml(line?.salaryinfo || '-')}</span>
                                <span class="font-semibold">${hrmEscapeHtml(line?.amountpercentage || '0')}%</span>
                            </div>
                        `).join('') : '<p class="text-sm text-slate-500">No allowance lines</p>'}
                    </div>
                </div>
                <div class="border border-slate-200 rounded-sm p-4">
                    <p class="text-sm font-semibold text-slate-700 mb-2">Deductions</p>
                    <div class="space-y-2">
                        ${deductions.length ? deductions.map((line) => `
                            <div class="flex items-center justify-between text-sm">
                                <span>${hrmEscapeHtml(line?.salaryinfo || '-')}</span>
                                <span class="font-semibold">${hrmEscapeHtml(line?.amountpercentage || '0')}%</span>
                            </div>
                        `).join('') : '<p class="text-sm text-slate-500">No deduction lines</p>'}
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const close = () => {
        const active = document.getElementById('hrm_personnel_view_modal');
        if (active) active.remove();
    };
    const closeButton = modal.querySelector('#hrm_personnel_modal_close');
    if (closeButton) closeButton.onclick = close;
    modal.onclick = (event) => {
        if (event.target === modal) close();
    };
}

function hrmRenderPersonnelRows(rows, columns) {
    const body = document.getElementById('hrm_table_body');
    const status = document.getElementById('hrm_table_status');
    if (!body) return;

    if (!Array.isArray(rows) || rows.length === 0) {
        body.innerHTML = `<tr><td colspan="${columns.length}" class="text-center opacity-70">No personnel records found.</td></tr>`;
        if (status) status.textContent = 'Showing 0 to 0 of 0 records';
        hrmSetSummaryValues(['0', '0', '0', '0']);
        return;
    }

    body.innerHTML = rows.map((entry, index) => {
        const personnel = entry?.personnel || {};
        const fullName = [personnel.lastname, personnel.firstname, personnel.othernames].filter(Boolean).join(' ').trim();
        const rowPayload = encodeURIComponent(JSON.stringify(entry));

        return `
            <tr>
                <td>${index + 1}</td>
                <td>${personnel?.staffid ?? '-'}</td>
                <td>${fullName || '-'}</td>
                <td>${personnel?.phonenumber ?? '-'}</td>
                <td>${personnel?.levelname || personnel?.levelid || '-'}</td>
                <td>${hrmPersonnelDisplayStatus(personnel?.status)}</td>
                <td>
                    <div class="flex flex-wrap gap-2">
                        <button type="button" class="btn hrm-ui-action" data-hrm-personnel-view="${personnel?.id || ''}" data-hrm-personnel-record="${rowPayload}" title="View personnel" style="background:#0f766e;color:#fff;min-width:38px;padding:6px 10px;"><span class="material-symbols-outlined" style="font-size:16px;line-height:1;">visibility</span></button>
                        <button type="button" class="btn hrm-ui-action" data-hrm-personnel-edit="${personnel?.id || ''}" data-hrm-personnel-record="${rowPayload}" title="Edit personnel" style="background:#2563eb;color:#fff;min-width:38px;padding:6px 10px;"><span class="material-symbols-outlined" style="font-size:16px;line-height:1;">edit</span></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    const activeCount = rows.filter((entry) => {
        const status = hrmNormalizePersonnelStatus(entry?.personnel?.status);
        return status === 'APPROVED' || status === 'ACTIVE' || status === 'OPEN';
    }).length;
    const suspendedCount = rows.filter((entry) => String(entry?.personnel?.status || '').toUpperCase().includes('SUSP')).length;
    const terminatedCount = rows.filter((entry) => String(entry?.personnel?.status || '').toUpperCase().includes('TERM')).length;
    hrmSetSummaryValues([`${rows.length}`, `${activeCount}`, `${suspendedCount}`, `${terminatedCount}`]);
    if (status) status.textContent = `Showing 1 to ${rows.length} of ${rows.length} records`;
}

function hrmBuildApprovePersonnelLoadPayload() {
    const payload = new FormData();
    payload.append('status', 'NOT APPROVED');
    return payload;
}

function hrmFilterApprovePersonnelRows(rows, filterForm = null) {
    const filteredRows = Array.isArray(rows)
        ? rows.filter((entry) => hrmNormalizePersonnelStatus(entry?.personnel?.status) !== 'OPEN')
        : [];
    if (!filterForm) return filteredRows;
    const filterData = new FormData(filterForm);
    const search = String(filterData.get('search') || '').trim().toLowerCase();
    if (!search) return filteredRows;

    return filteredRows.filter((entry) => {
        const personnel = entry?.personnel || {};
        const searchable = [
            personnel.staffid,
            personnel.firstname,
            personnel.lastname,
            personnel.othernames,
            personnel.phonenumber,
            personnel.gender,
            personnel.residentialaddress,
            personnel.registereduseremail,
            personnel.user,
            personnel.employmentdate,
            personnel.basicsalary
        ].map((value) => String(value || '').toLowerCase()).join(' ');
        return searchable.includes(search);
    });
}

function hrmRenderApprovePersonnelRows(rows, columns) {
    const body = document.getElementById('hrm_table_body');
    const status = document.getElementById('hrm_table_status');
    if (!body) return;

    if (!Array.isArray(rows) || rows.length === 0) {
        body.innerHTML = `<tr><td colspan="${columns.length}" class="text-center opacity-70">No personnel pending approval.</td></tr>`;
        if (status) status.textContent = 'Showing 0 to 0 of 0 records';
        hrmSetSummaryValues(['0', '0', '0', '0']);
        const selectButton = document.getElementById('hrm_approve_select_all');
        if (selectButton) {
            selectButton.querySelector('span').textContent = 'Select All';
            selectButton.title = 'Select all pending personnel';
        }
        return;
    }

    body.innerHTML = rows.map((entry, index) => {
        const personnel = entry?.personnel || {};
        const salarystructure = Array.isArray(entry?.salarystructure) ? entry.salarystructure : [];
        const fullName = [personnel.firstname, personnel.lastname, personnel.othernames].filter(Boolean).join(' ').trim();
        const rowPayload = encodeURIComponent(JSON.stringify(entry));
        const personnelId = hrmEscapeHtml(personnel?.id || '');

        return `
            <tr>
                <td>
                    <input type="checkbox" class="hrm-approve-personnel-checkbox" value="${personnelId}" data-personnel-id="${personnelId}" title="Select ${hrmEscapeHtml(fullName || 'personnel')}">
                </td>
                <td>${index + 1}</td>
                <td>${hrmEscapeHtml(personnel?.staffid || '-')}</td>
                <td>${hrmEscapeHtml(fullName || '-')}</td>
                <td>${hrmEscapeHtml(personnel?.phonenumber || '-')}</td>
                <td>${hrmEscapeHtml(personnel?.gender || '-')}</td>
                <td class="max-w-[280px] whitespace-normal">${hrmEscapeHtml(hrmDecodeHtmlEntities(personnel?.residentialaddress) || '-')}</td>
                <td>${hrmEscapeHtml((personnel?.registereduseremail || personnel?.user || '-').toLowerCase?.() || personnel?.registereduseremail || personnel?.user || '-')}</td>
                <td>${hrmEscapeHtml(personnel?.employmentdate || '-')}</td>
                <td>${hrmEscapeHtml(hrmFormatNumberWithCommas(personnel?.basicsalary || '-'))}</td>
                <td>
                    <div class="flex flex-wrap gap-2">
                        <button type="button" class="btn hrm-ui-action" data-hrm-approve-personnel-view="${personnelId}" data-hrm-personnel-record="${rowPayload}" title="View personnel" style="background:#0f766e;color:#fff;min-width:38px;padding:6px 10px;"><span class="material-symbols-outlined" style="font-size:16px;line-height:1;">visibility</span></button>
                        <button type="button" class="btn hrm-ui-action" data-hrm-approve-personnel-edit="${personnelId}" data-hrm-personnel-record="${rowPayload}" title="Edit personnel" style="background:#2563eb;color:#fff;min-width:38px;padding:6px 10px;"><span class="material-symbols-outlined" style="font-size:16px;line-height:1;">edit</span></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    const totalBasicSalary = rows.reduce((sum, entry) => {
        const raw = entry?.personnel?.basicsalary ?? 0;
        const amount = Number(String(raw).replace(/[^0-9.-]/g, ''));
        return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);
    const allowanceLines = rows.reduce((sum, entry) => {
        const structure = Array.isArray(entry?.salarystructure) ? entry.salarystructure : [];
        return sum + structure.filter((line) => String(line?.salaryinfotype || '').toUpperCase() === 'ALLOWANCE').length;
    }, 0);

    hrmSetSummaryValues([`${rows.length}`, '0', `${totalBasicSalary.toLocaleString()}`, `${allowanceLines}`]);
    const selectButton = document.getElementById('hrm_approve_select_all');
    if (selectButton) {
        selectButton.querySelector('span').textContent = 'Select All';
        selectButton.title = 'Select all pending personnel';
    }
    if (status) status.textContent = `Showing 1 to ${rows.length} of ${rows.length} records`;
}

function hrmSelectedApprovePersonnelIds() {
    return Array.from(document.querySelectorAll('.hrm-approve-personnel-checkbox:checked'))
        .map((checkbox) => checkbox.getAttribute('data-personnel-id') || checkbox.value)
        .filter(Boolean);
}

function hrmRefreshApprovePersonnelSelectionSummary() {
    const cards = document.querySelectorAll('[data-hrm-summary-value]');
    if (cards[1]) cards[1].textContent = `${hrmSelectedApprovePersonnelIds().length}`;
}

function hrmBuildApprovePersonnelActionPayload(action) {
    const payload = new FormData();
    const ids = hrmSelectedApprovePersonnelIds();
    payload.append('buttonselected', action);
    ids.forEach((id, index) => payload.append(`ids${index}`, id));
    payload.append('idsize', ids.length);
    return payload;
}

async function hrmSubmitApprovePersonnelAction(action, button, blueprint) {
    const selectedIds = hrmSelectedApprovePersonnelIds();
    const actionLabel = action === 'APPROVE' ? 'approval' : 'decline';
    if (selectedIds.length === 0) {
        notification(`No personnel has been selected for ${actionLabel}`, 0);
        return;
    }

    const controller = hrmResolveControllerName('pp_approvepersonnel', 'save');
    const result = await hrmRequestController(controller, hrmBuildApprovePersonnelActionPayload(action), button);
    if (!result.ok || result?.data?.status === false) {
        notification(hrmResultErrorMessage(result, `${actionLabel} failed on ${controller}`), 0);
        return;
    }

    notification(result?.data?.message || `${action === 'APPROVE' ? 'Approval' : 'Decline'} completed`, 1);
    await hrmLoadViewData('pp_approvepersonnel', blueprint);
}

function hrmRenderApprovePersonnelBatchActions(container, blueprint) {
    if (!container) return;
    container.innerHTML = `
        <button type="button" class="btn hrm-ui-action" id="hrm_approve_select_all" title="Select all pending personnel" style="background:#1f2937 !important;color:#fff !important;">
            <span>Select All</span>
        </button>
        <button type="button" class="btn hrm-ui-action" id="hrm_approve_selected" title="Approve selected personnel" style="background:#15803d !important;color:#fff !important;">
            <span class="material-symbols-outlined text-lg">check_circle</span>
            <span>Approve</span>
        </button>
        <button type="button" class="btn hrm-ui-action" id="hrm_decline_selected" title="Decline selected personnel" style="background:#dc2626 !important;color:#fff !important;">
            <span class="material-symbols-outlined text-lg">cancel</span>
            <span>Decline</span>
        </button>
    `;

    const selectButton = document.getElementById('hrm_approve_select_all');
    const approveButton = document.getElementById('hrm_approve_selected');
    const declineButton = document.getElementById('hrm_decline_selected');

    if (selectButton) {
        selectButton.onclick = () => {
            const checkboxes = Array.from(document.querySelectorAll('.hrm-approve-personnel-checkbox'));
            const shouldSelect = checkboxes.some((checkbox) => !checkbox.checked);
            checkboxes.forEach((checkbox) => {
                checkbox.checked = shouldSelect;
            });
            selectButton.querySelector('span').textContent = shouldSelect ? 'Deselect All' : 'Select All';
            selectButton.title = shouldSelect ? 'Deselect all pending personnel' : 'Select all pending personnel';
            hrmRefreshApprovePersonnelSelectionSummary();
        };
    }
    if (approveButton) approveButton.onclick = () => hrmSubmitApprovePersonnelAction('APPROVE', approveButton, blueprint);
    if (declineButton) declineButton.onclick = () => hrmSubmitApprovePersonnelAction('DECLINE', declineButton, blueprint);
}

function hrmNormalizePersonnelHistoryRoot(responseData) {
    const rows = hrmExtractRowsFromResponse(responseData);
    if (Array.isArray(rows) && rows.length > 0 && rows[0] && typeof rows[0] === 'object') return rows[0];
    return null;
}

function hrmNormalizePersonnelHistoryDate(value) {
    const normalized = hrmNormalizePersonnelValue(value);
    if (!normalized) return '-';
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return normalized;
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

function hrmBuildPersonnelHistoryLoadPayload(filterForm = null) {
    const payload = new FormData();
    if (!filterForm) return payload;
    const rawPersonnel = String(new FormData(filterForm).get('personnel') || '').trim();
    if (!rawPersonnel) return payload;
    const staffId = rawPersonnel.includes('||') ? rawPersonnel.split('||')[0].trim() : rawPersonnel;
    if (staffId) payload.append('staffid', staffId);
    return payload;
}

function hrmTogglePersonnelHistoryLayout(active) {
    const tableContainer = document.getElementById('hrm_table_container');
    const historySections = document.getElementById('hrm_personnelhistory_sections');
    if (tableContainer) tableContainer.classList.toggle('hidden', active);
    if (historySections) historySections.classList.toggle('hidden', !active);
}

function hrmPersonnelHistoryDocumentCell(rawDocument) {
    const doc = hrmNormalizePersonnelValue(rawDocument);
    if (!doc) return 'No Document';
    const url = /^https?:\/\//i.test(doc) ? doc : `../images/personnel/${encodeURIComponent(doc)}`;
    return `<a href="${hrmEscapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="inline-block px-3 py-1 text-xs font-semibold rounded-sm" style="background:#15803d;color:#fff;">View Document</a>`;
}

function hrmBuildPersonnelHistorySectionTable(title, columns, rows) {
    const bodyRows = rows.length
        ? rows.map((row) => `<tr>${row.map((value) => `<td>${value}</td>`).join('')}</tr>`).join('')
        : `<tr><td colspan="${columns.length}" class="text-center opacity-70">No records</td></tr>`;

    return `
        <div class="border border-slate-200 rounded-sm p-3 bg-white/90">
            <h4 class="text-sm font-semibold text-slate-800 mb-3">${hrmEscapeHtml(title)}</h4>
            <div class="table-content">
                <table>
                    <thead><tr>${columns.map((column) => `<th>${hrmEscapeHtml(column)}</th>`).join('')}</tr></thead>
                    <tbody>${bodyRows}</tbody>
                </table>
            </div>
        </div>
    `;
}

function hrmResolvePersonnelPhotoFilename(personnel = {}) {
    return hrmNormalizePersonnelValue(hrmFirstFilled(
        personnel,
        'photofilename',
        'photo',
        'userphotoname',
        'image',
        'imageurl',
        'avatar',
        'profilephoto'
    ));
}

function hrmBuildPersonnelHistoryProfilePhotoBlock(personnel = {}, fullName = '') {
    const photoFile = hrmResolvePersonnelPhotoFilename(personnel);
    const safeName = hrmEscapeHtml(fullName || personnel?.staffid || 'Profile');
    if (photoFile && photoFile !== '-') {
        const photoSrc = `../images/personnel/${encodeURIComponent(photoFile)}`;
        return `
            <div class="border border-slate-200 rounded-sm p-4 bg-gradient-to-br from-slate-50 to-white">
                <p class="text-xs uppercase tracking-wide text-slate-500 mb-3">Profile Picture</p>
                <a href="${photoSrc}" target="_blank" rel="noopener" class="block group">
                    <img src="${photoSrc}" alt="${safeName}" class="w-full max-w-[240px] aspect-square object-cover rounded-md border border-slate-200 shadow-sm transition-transform duration-200 group-hover:scale-[1.01]">
                    <span class="inline-flex items-center gap-1 mt-2 text-xs text-blue-700 underline">
                        <span class="material-symbols-outlined" style="font-size:14px;line-height:1;">open_in_new</span>
                        Open image
                    </span>
                </a>
            </div>
        `;
    }

    return `
        <div class="border border-slate-200 rounded-sm p-4 bg-gradient-to-br from-slate-50 to-white">
            <p class="text-xs uppercase tracking-wide text-slate-500 mb-3">Profile Picture</p>
            <div class="w-full max-w-[240px] aspect-square rounded-md border border-dashed border-slate-300 bg-slate-100 flex flex-col items-center justify-center text-slate-500">
                <span class="material-symbols-outlined text-4xl">account_circle</span>
                <span class="text-xs mt-2">No profile image</span>
            </div>
        </div>
    `;
}

function hrmBuildPersonnelHistoryProfileBlock(root) {
    const personnel = root?.personnel || {};
    const fullName = [personnel?.firstname, personnel?.lastname, personnel?.othernames].filter(Boolean).join(' ').trim();
    const fields = [
        ['Staff ID', personnel?.staffid],
        ['Name', fullName],
        ['Phone Number', personnel?.phonenumber],
        ['Work Status', personnel?.workstatus],
        ['Marital Status', personnel?.maritalstatus],
        ['Residential Address', personnel?.residentialaddress],
        ['Permanent Home Address', personnel?.permanenthomeaddress],
        ['Gender', personnel?.gender],
        ['Birth Date', hrmNormalizePersonnelHistoryDate(personnel?.birthdate)],
        ['Nationality', personnel?.nationality],
        ['State', personnel?.state],
        ['LGA', personnel?.lga],
        ['Deformity', personnel?.deformity === '1' ? 'YES' : 'NO'],
        ['Eye Glasses', personnel?.eyeglasses === '1' ? 'YES' : 'NO'],
        ['Hearing Aid', personnel?.hearingaid === '1' ? 'YES' : 'NO'],
        ['Height', personnel?.height],
        ['Weight', personnel?.weight],
        ['Employment Date', hrmNormalizePersonnelHistoryDate(personnel?.employmentdate)],
        ['Basic Salary', hrmFormatNumberWithCommas(personnel?.basicsalary)],
        ['Level', personnel?.level || personnel?.levelname || personnel?.levelid],
        ['Bank Account (Basic)', personnel?.bankaccountnumber1],
        ['Bank Name (Basic)', personnel?.bankname1],
        ['Username/Email', personnel?.registereduseremail || personnel?.user]
    ];

    return `
        <div class="border border-slate-200 rounded-sm p-4 bg-white/90">
            <h4 class="text-sm font-semibold text-slate-800 mb-3">Bio Data</h4>
            <div class="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)] gap-4">
                ${hrmBuildPersonnelHistoryProfilePhotoBlock(personnel, fullName)}
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                ${fields.map(([label, value]) => `
                    <div class="border border-slate-200 rounded-sm p-3 bg-slate-50/60">
                        <p class="text-xs uppercase tracking-wide text-slate-500">${hrmEscapeHtml(label)}</p>
                        <p class="text-sm font-medium text-slate-800 mt-1 break-words">${hrmEscapeHtml(hrmNormalizePersonnelValue(value) || '-')}</p>
                    </div>
                `).join('')}
                </div>
            </div>
        </div>
    `;
}

function hrmRenderPersonnelHistoryRows(root) {
    const status = document.getElementById('hrm_table_status');
    const container = document.getElementById('hrm_personnelhistory_sections');
    if (!container) return;

    const salaryRows = Array.isArray(root?.salarystructure) ? root.salarystructure : [];
    const allowanceRows = salaryRows
        .filter((item) => String(item?.salaryinfotype || '').toUpperCase() === 'ALLOWANCE')
        .map((item, index) => [String(index + 1), hrmEscapeHtml(item?.salaryinfo || '-'), `${hrmEscapeHtml(item?.amountpercentage || '0')}%`]);
    const deductionRows = salaryRows
        .filter((item) => String(item?.salaryinfotype || '').toUpperCase() === 'DEDUCTION')
        .map((item, index) => [String(index + 1), hrmEscapeHtml(item?.salaryinfo || '-'), `${hrmEscapeHtml(item?.amountpercentage || '0')}%`]);

    const sections = [
        ['Advance', ['S/N', 'Title', 'Amount', 'Entry Date'], (root?.advance || []).map((item, index) => [String(index + 1), hrmEscapeHtml(item?.title || '-'), hrmEscapeHtml(hrmFormatNumberWithCommas(item?.amount || '-')), hrmEscapeHtml(hrmNormalizePersonnelHistoryDate(item?.entrydate))])],
        ['Employee Records', ['S/N', 'Employer Name', 'Position', 'Years Employed', 'Reason For Leaving', 'Document'], (root?.employeerecords || []).map((item, index) => [String(index + 1), hrmEscapeHtml(item?.employer || '-'), hrmEscapeHtml(item?.position || '-'), hrmEscapeHtml(item?.yearsemployed || '-'), hrmEscapeHtml(item?.reasonforleaving || '-'), hrmPersonnelHistoryDocumentCell(item?.doc)])],
        ['Guarantors', ['S/N', 'Guarantor Name', 'Years Known', 'Occupation', 'Phone Number', 'Address', 'Document'], (root?.guarantors || []).map((item, index) => [String(index + 1), hrmEscapeHtml(item?.guarantorname || '-'), hrmEscapeHtml(item?.yearsknown || '-'), hrmEscapeHtml(item?.occupation || '-'), hrmEscapeHtml(item?.phonenumber || '-'), hrmEscapeHtml(item?.address || '-'), hrmPersonnelHistoryDocumentCell(item?.doc)])],
        ['Leave', ['S/N', 'Title', 'Entry Date', 'Start Date', 'End Date', 'Document'], (root?.leave || []).map((item, index) => [String(index + 1), hrmEscapeHtml(item?.title || '-'), hrmEscapeHtml(hrmNormalizePersonnelHistoryDate(item?.entrydate)), hrmEscapeHtml(hrmNormalizePersonnelHistoryDate(item?.startdate)), hrmEscapeHtml(hrmNormalizePersonnelHistoryDate(item?.enddate)), hrmPersonnelHistoryDocumentCell(item?.document)])],
        ['Promotion', ['S/N', 'Title', 'Level', 'Entry Date', 'Document'], (root?.promotion || []).map((item, index) => [String(index + 1), hrmEscapeHtml(item?.title || '-'), hrmEscapeHtml(item?.level || '-'), hrmEscapeHtml(hrmNormalizePersonnelHistoryDate(item?.entrydate)), hrmPersonnelHistoryDocumentCell(item?.document)])],
        ['Qualifications', ['S/N', 'Institution', 'Qualification', 'Certification Date', 'Document'], (root?.qualifications || []).map((item, index) => [String(index + 1), hrmEscapeHtml(item?.institution || '-'), hrmEscapeHtml(item?.qualification || '-'), hrmEscapeHtml(hrmNormalizePersonnelHistoryDate(item?.certificationdate)), hrmPersonnelHistoryDocumentCell(item?.doc)])],
        ['Query', ['S/N', 'Title', 'Entry Date', 'Document'], (root?.query || []).map((item, index) => [String(index + 1), hrmEscapeHtml(item?.title || '-'), hrmEscapeHtml(hrmNormalizePersonnelHistoryDate(item?.entrydate)), hrmPersonnelHistoryDocumentCell(item?.document)])],
        ['Referees', ['S/N', 'Referees Full Name', 'Relationship', 'Occupation', 'Phone Number', 'Address', 'Document'], (root?.referees || []).map((item, index) => [String(index + 1), hrmEscapeHtml(item?.fullname || '-'), hrmEscapeHtml(item?.relationship || '-'), hrmEscapeHtml(item?.occupation || '-'), hrmEscapeHtml(item?.phonenumber || '-'), hrmEscapeHtml(item?.address || '-'), hrmPersonnelHistoryDocumentCell(item?.doc)])],
        ['Suspension', ['S/N', 'Title', 'Entry Date', 'Document'], (root?.suspension || []).map((item, index) => [String(index + 1), hrmEscapeHtml(item?.title || '-'), hrmEscapeHtml(hrmNormalizePersonnelHistoryDate(item?.entrydate)), hrmPersonnelHistoryDocumentCell(item?.document)])],
        ['Termination', ['S/N', 'Title', 'Entry Date', 'Document'], (root?.termination || []).map((item, index) => [String(index + 1), hrmEscapeHtml(item?.title || '-'), hrmEscapeHtml(hrmNormalizePersonnelHistoryDate(item?.entrydate)), hrmPersonnelHistoryDocumentCell(item?.document)])],
        ['Warning', ['S/N', 'Title', 'Entry Date', 'Document'], (root?.warning || []).map((item, index) => [String(index + 1), hrmEscapeHtml(item?.title || '-'), hrmEscapeHtml(hrmNormalizePersonnelHistoryDate(item?.entrydate)), hrmPersonnelHistoryDocumentCell(item?.document)])],
        ['Monitor/Evaluation', ['S/N', 'Title', 'Entry Date', 'Document'], (root?.evaluation || []).map((item, index) => [String(index + 1), hrmEscapeHtml(item?.title || '-'), hrmEscapeHtml(hrmNormalizePersonnelHistoryDate(item?.entrydate)), hrmPersonnelHistoryDocumentCell(item?.document)])],
        ['Parents/Guardians', ['S/N', 'Parent One', 'Parent Two', 'Parent One Occupation', 'Parent Two Occupation', 'Parent One Phone', 'Parent Two Phone', 'Home Address', 'Office Address', 'Doc'], (root?.parents || []).map((item, index) => [String(index + 1), hrmEscapeHtml(item?.parentone || '-'), hrmEscapeHtml(item?.parenttwo || '-'), hrmEscapeHtml(item?.parentoneoccupation || '-'), hrmEscapeHtml(item?.parenttwooccupation || '-'), hrmEscapeHtml(item?.parentonephone || '-'), hrmEscapeHtml(item?.parenttwophone || '-'), hrmEscapeHtml(item?.homeaddress || '-'), hrmEscapeHtml(item?.officeaddress || '-'), hrmPersonnelHistoryDocumentCell(item?.doc)])]
    ];

    const hasAnyHistory = sections.some(([, , rows]) => rows.length > 0) || allowanceRows.length > 0 || deductionRows.length > 0 || Boolean(root?.personnel);
    if (!hasAnyHistory) {
        container.innerHTML = `<div class="border border-slate-200 rounded-sm p-4 bg-white/90 text-sm text-slate-600">No personnel history records found for the selected personnel.</div>`;
        if (status) status.textContent = 'Showing 0 to 0 of 0 records';
        hrmSetSummaryValues(['0', '0', '0', '0']);
        return;
    }

    container.innerHTML = [
        hrmBuildPersonnelHistoryProfileBlock(root),
        hrmBuildPersonnelHistorySectionTable('Allowances', ['S/N', 'Allowance Name', 'Percentage %'], allowanceRows),
        hrmBuildPersonnelHistorySectionTable('Deductions', ['S/N', 'Deduction Name', 'Percentage %'], deductionRows),
        ...sections.map(([title, columns, rows]) => hrmBuildPersonnelHistorySectionTable(title, columns, rows))
    ].join('');

    const nonEmptySections = sections.filter(([, , rows]) => rows.length > 0).length + (allowanceRows.length > 0 ? 1 : 0) + (deductionRows.length > 0 ? 1 : 0) + (root?.personnel ? 1 : 0);
    const totalRows = sections.reduce((sum, [, , rows]) => sum + rows.length, 0) + allowanceRows.length + deductionRows.length;
    const withDocuments = sections.reduce((sum, [, , rows]) => sum + rows.filter((row) => String(row[row.length - 1] || '').includes('View Document')).length, 0);
    hrmSetSummaryValues([`${nonEmptySections}`, `${totalRows}`, `${withDocuments}`, `${salaryRows.length}`]);
    if (status) status.textContent = `Showing ${totalRows > 0 ? 1 : 0} to ${totalRows} of ${totalRows} records`;
}

function hrmNormalizePersonnelSelectOptions(responseData) {
    const rows = hrmNormalizePersonnelRows(responseData);
    const options = [];
    rows.forEach((entry) => {
        const personnel = entry?.personnel || entry || {};
        const staffid = hrmNormalizePersonnelValue(personnel?.staffid);
        if (!staffid) return;
        const fullname = [personnel?.firstname, personnel?.lastname].filter(Boolean).join(' ').trim();
        hrmPersonnelLabelByStaffId[staffid] = fullname || staffid;
        options.push({ value: staffid, text: `${staffid} || ${fullname || 'Unnamed Personnel'}` });
    });
    return options;
}

function hrmNormalizeDepartmentSelectOptions(responseData) {
    const rows = Array.isArray(responseData?.data?.data)
        ? responseData.data.data
        : (Array.isArray(responseData?.data) ? responseData.data : (Array.isArray(responseData) ? responseData : []));
    return rows.map((item) => {
        const id = item?.id ?? '';
        const label = item?.department ?? item?.name ?? item?.title ?? '';
        return { value: String(id), text: String(label) };
    }).filter((item) => item.value && item.text);
}

function hrmNormalizeGroupSelectOptions(responseData) {
    const rows = Array.isArray(responseData?.data?.data)
        ? responseData.data.data
        : (Array.isArray(responseData?.data) ? responseData.data : (Array.isArray(responseData) ? responseData : []));
    return rows.map((item) => {
        const id = item?.id ?? '';
        const label = item?.groupname ?? item?.group ?? item?.name ?? '';
        return { value: String(id), text: String(label) };
    }).filter((item) => item.value && item.text);
}

function hrmNormalizeLocationSelectOptions(responseData) {
    const rows = Array.isArray(responseData?.data?.data)
        ? responseData.data.data
        : (Array.isArray(responseData?.data) ? responseData.data : (Array.isArray(responseData) ? responseData : []));
    return rows.map((item) => {
        const location = hrmNormalizePersonnelValue(item?.location || item?.name || item?.title);
        if (!location) return null;
        return { value: location, text: location.toUpperCase() };
    }).filter(Boolean);
}

async function hrmPopulatePersonnelHistoryFilterPicker(route, blueprint, filterForm) {
    const control = document.getElementById('hrm_filter_personnel');
    if (!control) return;
    const autoLoad = async () => {
        if (!control.value) return;
        await hrmLoadViewData(route, blueprint, null, filterForm);
    };
    const result = await hrmRequestController('fetchpersonnels.php');
    if (!result.ok || result?.data?.status === false) {
        notification(hrmResultErrorMessage(result, 'Unable to load personnel selector'), 0);
        return;
    }
    const options = hrmNormalizePersonnelSelectOptions(result.data);
    const selectedValue = control.value || '';
    control.innerHTML = '<option value="">-- select personnel --</option>' + options.map((option) => `<option value="${hrmEscapeHtml(option.value)}">${hrmEscapeHtml(option.text)}</option>`).join('');
    if (selectedValue) control.value = selectedValue;
    control.onchange = autoLoad;

    if (!control.dataset.hrmTomSelect) return;
    try {
        await hrmEnsureTomSelectAssets();
        if (hrmTomSelectInstances.hrm_filter_personnel) {
            hrmTomSelectInstances.hrm_filter_personnel.destroy();
            delete hrmTomSelectInstances.hrm_filter_personnel;
        }
        if (window.TomSelect) {
            hrmTomSelectInstances.hrm_filter_personnel = new window.TomSelect(control, {
                create: false,
                allowEmptyOption: true,
                maxItems: 1,
                dropdownParent: 'body',
                placeholder: 'Select Personnel',
                onChange: async () => {
                    await autoLoad();
                }
            });
        }
    } catch (error) {
        notification('Unable to initialize personnel selector search', 0);
    }
}

async function hrmEnsurePersonnelLookup() {
    if (Object.keys(hrmPersonnelLabelByStaffId).length > 0) return;
    const result = await hrmRequestController('fetchpersonnels.php', new FormData());
    if (result.ok && result?.data?.status !== false) hrmNormalizePersonnelSelectOptions(result.data);
}

async function hrmEnsureLevelLookup() {
    if (Object.keys(hrmLevelLabelById).length > 0) return;
    const result = await hrmRequestController('fetchlevel.php', new FormData());
    if (result.ok && result?.data?.status !== false) hrmNormalizeLevelOptions(result.data);
}

async function hrmEnsureHtgDisplayLookups(route) {
    if (!hrmHtgActionRoutes.has(route)) return;
    await hrmEnsurePersonnelLookup();
    if (route === 'pp_promotions') await hrmEnsureLevelLookup();
}

async function hrmPopulateDynamicSelect(controlId, source) {
    const control = document.getElementById(controlId);
    if (!control || control.tagName !== 'SELECT') return;

    let options = [];
    if (source === 'personnels') {
        const result = await hrmRequestController('fetchpersonnels.php', new FormData());
        if (!result.ok || result?.data?.status === false) return;
        options = hrmNormalizePersonnelSelectOptions(result.data);
    } else if (source === 'levels') {
        const result = await hrmRequestController('fetchlevel.php', new FormData());
        if (!result.ok || result?.data?.status === false) return;
        options = hrmNormalizeLevelOptions(result.data).map((item) => ({ value: item.id, text: item.label }));
    } else if (source === 'departments') {
        const result = await hrmRequestController('fetchdepartment.php', new FormData());
        if (!result.ok || result?.data?.status === false) return;
        options = hrmNormalizeDepartmentSelectOptions(result.data);
    } else if (source === 'groups') {
        const result = await hrmRequestController('fetchgroupname.php', new FormData());
        if (!result.ok || result?.data?.status === false) return;
        options = hrmNormalizeGroupSelectOptions(result.data);
    } else if (source === 'locations') {
        const result = await hrmRequestController('fetchlocation.php', new FormData());
        if (!result.ok || result?.data?.status === false) return;
        options = hrmNormalizeLocationSelectOptions(result.data);
    } else {
        return;
    }

    const selectedValue = control.value || '';
    control.innerHTML = '<option value="">-- select --</option>' + options.map((option) =>
        `<option value="${hrmEscapeHtml(option.value)}">${hrmEscapeHtml(option.text)}</option>`
    ).join('');
    if (selectedValue) control.value = selectedValue;

    if (!control.dataset.hrmTomSelect) return;
    try {
        await hrmEnsureTomSelectAssets();
        if (hrmTomSelectInstances[controlId]) {
            hrmTomSelectInstances[controlId].destroy();
            delete hrmTomSelectInstances[controlId];
        }
        if (window.TomSelect) {
            hrmTomSelectInstances[controlId] = new window.TomSelect(control, {
                create: false,
                allowEmptyOption: true,
                maxItems: 1,
                dropdownParent: 'body',
                placeholder: 'Select'
            });
        }
    } catch (error) {
        console.log(error);
    }
}

async function hrmPopulateRouteDynamicSelectors(blueprint) {
    const allFields = []
        .concat(Array.isArray(blueprint?.fields) ? blueprint.fields : [])
        .concat(Array.isArray(blueprint?.filters) ? blueprint.filters.map((field) => ({
            ...field,
            id: `hrm_filter_${field.id}`
        })) : []);

    const dynamicFields = allFields.filter((field) => field?.type === 'select' && field?.dynamic_source);
    for (const field of dynamicFields) {
        await hrmPopulateDynamicSelect(field.id, field.dynamic_source);
    }
}

function hrmBuildControl(field) {
    if (hrmHiddenFrontendFields.has((field?.id || '').toLowerCase())) return '';

    const required = field.required ? 'required' : '';
    const readonly = field.readonly ? 'readonly' : '';
    const list = field.list ? `list="${field.list}"` : '';
    const placeholder = field.placeholder ? `placeholder="${field.placeholder}"` : '';
    const name = field.name || field.id;
    const wrapperClass = `form-group ${field.wrapper_class || ''}`.trim();

    if (field.type === 'hidden') {
        return `<input id="${field.id}" name="${name}" type="hidden">`;
    }

    if (field.type === 'select') {
        const tomSelectFlag = field.tom_select ? 'data-hrm-tom-select="1"' : '';
        const optionMarkup = (field.options || []).map((option) => {
            if (option && typeof option === 'object') {
                const value = option.value ?? option.label ?? '';
                const label = option.label ?? option.value ?? '';
                return `<option value="${value}">${label}</option>`;
            }
            return `<option value="${option}">${option}</option>`;
        }).join('');
        return `
            <div class="${wrapperClass}">
                <label class="control-label" for="${field.id}">${field.label}</label>
                <select id="${field.id}" name="${name}" class="form-control" ${required} ${tomSelectFlag}>
                    <option value="">-- select ${field.label.toLowerCase()} --</option>
                    ${optionMarkup}
                </select>
            </div>
        `;
    }

    if (field.type === 'textarea') {
        const textareaWrapperClass = `form-group lg:col-span-2 ${field.wrapper_class || ''}`.trim();
        return `
            <div class="${textareaWrapperClass}">
                <label class="control-label" for="${field.id}">${field.label}</label>
                <textarea id="${field.id}" name="${name}" class="form-control" rows="3" ${required} ${placeholder}></textarea>
            </div>
        `;
    }

    if (field.type === 'file') {
        const previewId = `${field.id}_preview`;
        const accept = field.accept ? `accept="${field.accept}"` : '';
        const fileWrapperClass = `form-group lg:col-span-2 ${field.wrapper_class || ''}`.trim();
        return `
            <div class="${fileWrapperClass}">
                <label class="control-label" for="${field.id}">${field.label}</label>
                <div class="flex flex-col gap-2">
                    <input id="${field.id}" name="${name}" type="file" class="form-control hidden" ${required} ${accept} data-hrm-file-input="1" data-hrm-preview-target="${previewId}">
                    <button type="button" class="btn hrm-ui-action self-start" data-hrm-file-trigger="${field.id}">
                        <span class="material-symbols-outlined text-lg">upload_file</span>
                        <span>Select File</span>
                    </button>
                    <div id="${previewId}" class="border border-slate-200 rounded-sm p-3 bg-slate-50/70 text-sm text-slate-600">
                        No file selected.
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="${wrapperClass}">
            <label class="control-label" for="${field.id}">${field.label}</label>
            <input id="${field.id}" name="${name}" type="${field.type || 'text'}" class="form-control" ${list} ${required} ${readonly} ${placeholder}>
        </div>
    `;
}

function hrmGetFileExtension(name = '') {
    const filename = String(name || '').trim();
    const lastDot = filename.lastIndexOf('.');
    if (lastDot === -1 || lastDot === filename.length - 1) return 'FILE';
    return filename.slice(lastDot + 1).toUpperCase();
}

function hrmIsImageFile(file) {
    if (!file) return false;
    if (String(file.type || '').toLowerCase().startsWith('image/')) return true;
    const ext = hrmGetFileExtension(file.name || '').toLowerCase();
    return ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'].includes(ext);
}

function hrmGetDocumentIcon(file) {
    const ext = hrmGetFileExtension(file?.name || '').toLowerCase();
    if (ext === 'pdf') return 'picture_as_pdf';
    if (['doc', 'docx'].includes(ext)) return 'description';
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'table';
    if (['ppt', 'pptx'].includes(ext)) return 'slideshow';
    if (['zip', 'rar', '7z'].includes(ext)) return 'folder_zip';
    return 'insert_drive_file';
}

function hrmRevokePreviewUrl(inputId) {
    const existing = hrmFilePreviewUrls[inputId];
    if (existing) {
        URL.revokeObjectURL(existing);
        delete hrmFilePreviewUrls[inputId];
    }
}

function hrmRenderSelectedFilePreview(input) {
    const previewId = input?.dataset?.hrmPreviewTarget || '';
    const preview = previewId ? document.getElementById(previewId) : null;
    if (!input || !preview) return;

    const inputId = input.id || previewId;
    hrmRevokePreviewUrl(inputId);

    const file = input.files?.[0];
    if (!file) {
        preview.innerHTML = 'No file selected.';
        return;
    }

    const fileUrl = URL.createObjectURL(file);
    hrmFilePreviewUrls[inputId] = fileUrl;
    const fileType = hrmGetFileExtension(file.name);

    if (hrmIsImageFile(file)) {
        preview.innerHTML = `
            <a href="${fileUrl}" download="${hrmEscapeHtml(file.name)}" class="flex items-center gap-3" title="Download ${hrmEscapeHtml(file.name)}">
                <img src="${fileUrl}" alt="${hrmEscapeHtml(file.name)}" class="w-16 h-16 object-cover rounded border border-slate-200">
                <div class="flex flex-col">
                    <span class="font-medium text-slate-800">${hrmEscapeHtml(file.name)}</span>
                    <span class="text-xs uppercase tracking-wide text-emerald-700">${hrmEscapeHtml(fileType)} image</span>
                    <span class="text-xs text-slate-500">Click to download</span>
                </div>
            </a>
        `;
        return;
    }

    const icon = hrmGetDocumentIcon(file);
    preview.innerHTML = `
        <a href="${fileUrl}" download="${hrmEscapeHtml(file.name)}" class="flex items-center gap-3" title="Download ${hrmEscapeHtml(file.name)}">
            <div class="w-16 h-16 rounded border border-slate-200 bg-white flex items-center justify-center">
                <span class="material-symbols-outlined text-3xl text-slate-500">${icon}</span>
            </div>
            <div class="flex flex-col">
                <span class="font-medium text-slate-800">${hrmEscapeHtml(file.name)}</span>
                <span class="text-xs uppercase tracking-wide text-indigo-700">${hrmEscapeHtml(fileType)} document</span>
                <span class="text-xs text-slate-500">Click to download</span>
            </div>
        </a>
    `;
}

function hrmBindFileUploadPreviews() {
    document.querySelectorAll('[data-hrm-file-trigger]').forEach((button) => {
        button.onclick = () => {
            const targetId = button.getAttribute('data-hrm-file-trigger') || '';
            const input = targetId ? document.getElementById(targetId) : null;
            if (input) input.click();
        };
    });

    document.querySelectorAll('input[data-hrm-file-input="1"]').forEach((input) => {
        input.onchange = () => hrmRenderSelectedFilePreview(input);
    });
}

function hrmResetFileUploadPreviews() {
    document.querySelectorAll('input[data-hrm-file-input="1"]').forEach((input) => {
        hrmRevokePreviewUrl(input.id || input.dataset.hrmPreviewTarget || '');
        const previewId = input.dataset.hrmPreviewTarget || '';
        const preview = previewId ? document.getElementById(previewId) : null;
        if (preview) preview.innerHTML = 'No file selected.';
    });
}

function hrmClearTomSelectsWithin(container) {
    if (!container) return;
    container.querySelectorAll('select[id]').forEach((control) => {
        if (hrmTomSelectInstances[control.id]) hrmTomSelectInstances[control.id].clear(true);
    });
}

function hrmResetFormState(form, saveButton = null) {
    form?.reset();
    hrmClearTomSelectsWithin(form);
    hrmResetFileUploadPreviews();
    if (form) form.dataset.hrmMode = 'save';
    const saveLabel = saveButton?.querySelector('span:last-child');
    if (saveLabel) saveLabel.textContent = 'Submit';
}

function hrmRenderSummary(items) {
    const container = document.getElementById('hrm_summary_grid');
    if (!container) return;

    container.innerHTML = items.map((item) => `
        <div class="border border-slate-200 rounded-sm p-4 bg-slate-50/70">
            <p class="text-xs uppercase tracking-wide text-slate-500">${item}</p>
            <p class="text-2xl font-semibold text-slate-800 mt-2" data-hrm-summary-value>0</p>
        </div>
    `).join('');
}

function hrmSetSummaryValues(values = []) {
    const cards = document.querySelectorAll('[data-hrm-summary-value]');
    cards.forEach((card, index) => {
        card.textContent = values[index] ?? '0';
    });
}

function hrmComputeGenericSummary(rows = [], route = '') {
    const normalizedRows = Array.isArray(rows) ? rows : [];
    const total = normalizedRows.length;
    const withDocument = normalizedRows.filter((row) => {
        if (!row || typeof row !== 'object') return false;
        const documentValue = hrmRecordDocumentValue(row);
        return Boolean(hrmNormalizePersonnelValue(documentValue));
    }).length;
    const personnelCount = new Set(normalizedRows
        .map((row) => hrmNormalizePersonnelValue(hrmFirstFilled(row, 'pid', 'staffid', 'personnelid')))
        .filter(Boolean)).size;
    const updatedCount = normalizedRows.filter((row) => hrmNormalizePersonnelValue(hrmFirstFilled(row, 'entrydate', 'updatedat', 'createdat'))).length;

    if (route === 'pp_viewmonthlysalaryschedule') {
        const monthControl = document.getElementById('hrm_filter_month');
        const yearControl = document.getElementById('hrm_filter_year');
        const totalNetPayable = normalizedRows.reduce((sum, row) => {
            const amount = Number(String(hrmFirstFilled(row, 'netpayable') || '').replace(/[^0-9.-]/g, ''));
            return sum + (Number.isFinite(amount) ? amount : 0);
        }, 0);
        const totalAllowance = normalizedRows.reduce((sum, row) => {
            const payroll = row?.payroll || {};
            const amount = Number(String(hrmFirstFilled(payroll, 'totalallowance') || '').replace(/[^0-9.-]/g, ''));
            return sum + (Number.isFinite(amount) ? amount : 0);
        }, 0);
        const totalDeduction = normalizedRows.reduce((sum, row) => {
            const payroll = row?.payroll || {};
            const amount = Number(String(hrmFirstFilled(payroll, 'totaldeduction') || '').replace(/[^0-9.-]/g, ''));
            return sum + (Number.isFinite(amount) ? amount : 0);
        }, 0);
        const totalBasicSalary = normalizedRows.reduce((sum, row) => {
            const personnel = Array.isArray(row?.personnel) ? (row.personnel[0] || {}) : (row?.personnel || {});
            const amount = Number(String(hrmFirstFilled(personnel, 'basicsalary') || '').replace(/[^0-9.-]/g, ''));
            return sum + (Number.isFinite(amount) ? amount : 0);
        }, 0);
        const selectedMonth = monthControl ? hrmMonthNameByValue(monthControl.value || '-') : '-';
        const selectedYear = yearControl ? hrmNormalizePersonnelValue(yearControl.value || '-') || '-' : '-';
        return [
            hrmFormatNumberWithCommas(totalNetPayable),
            hrmFormatNumberWithCommas(totalAllowance),
            hrmFormatNumberWithCommas(totalDeduction),
            hrmFormatNumberWithCommas(totalBasicSalary),
            selectedMonth || '-',
            selectedYear || '-'
        ];
    }

    if (route === 'pp_advance') {
        const totalAmount = normalizedRows.reduce((sum, row) => {
            const rawAmount = hrmFirstFilled(row, 'amount');
            const normalizedAmount = Number(String(rawAmount || '').replace(/[^0-9.-]/g, ''));
            return sum + (Number.isFinite(normalizedAmount) ? normalizedAmount : 0);
        }, 0);
        return [
            `${total}`,
            totalAmount.toLocaleString(),
            `${withDocument}`,
            `${updatedCount}`
        ];
    }

    if (route === 'pp_employerrecord') {
        const currentEmployers = normalizedRows.filter((row) => !hrmNormalizePersonnelValue(hrmFirstFilled(row, 'reasonforleaving'))).length;
        const pastEmployers = total - currentEmployers;
        return [
            `${total}`,
            `${currentEmployers}`,
            `${pastEmployers}`,
            `${updatedCount}`
        ];
    }

    if (route === 'pp_referees') {
        const completeRecords = normalizedRows.filter((row) => {
            const hasName = hrmNormalizePersonnelValue(hrmFirstFilled(row, 'fullname', 'refereename'));
            const hasRelation = hrmNormalizePersonnelValue(hrmFirstFilled(row, 'relationship'));
            const hasPhone = hrmNormalizePersonnelValue(hrmFirstFilled(row, 'phonenumber', 'phone'));
            const hasAddress = hrmNormalizePersonnelValue(hrmFirstFilled(row, 'address'));
            return Boolean(hasName && hasRelation && hasPhone && hasAddress);
        }).length;
        const withPhone = normalizedRows.filter((row) => hrmNormalizePersonnelValue(hrmFirstFilled(row, 'phonenumber', 'phone'))).length;
        return [
            `${total}`,
            `${completeRecords}`,
            `${withPhone}`,
            `${withDocument}`
        ];
    }

    return [
        `${total}`,
        `${personnelCount || total}`,
        `${withDocument}`,
        `${updatedCount}`
    ];
}

function hrmRenderTable(columns, label) {
    const head = document.getElementById('hrm_table_head');
    const body = document.getElementById('hrm_table_body');
    if (!head || !body) return;

    head.innerHTML = `<tr>${columns.map((column) => `<th>${column}</th>`).join('')}</tr>`;
    body.innerHTML = `<tr><td colspan="${columns.length}" class="text-center opacity-70">${label} table is ready.</td></tr>`;
}

function hrmResolveControllerName(route, mode = 'load') {
    const mapped = hrmHtgControllerRouting[route]?.[mode];
    if (mapped) return mapped;
    if (mode === 'delete') return '';
    return hrmInterfaceRegistry[route]?.controllers?.[0]?.name || '';
}

function hrmControllerEndpoint(controllerName = '') {
    const normalized = String(controllerName || '').trim();
    if (!normalized) return '';
    return `../controllers/${normalized.replace(/\.php$/i, '')}`;
}

function hrmExtractPersonnelId(value = '') {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (raw.includes('||')) return raw.split('||')[0].trim();
    return raw;
}

function hrmPickFormDataValue(data, ...keys) {
    for (const key of keys) {
        const value = data.get(key);
        if (value === null || value === undefined) continue;
        if (typeof value === 'string' && value.trim() === '') continue;
        return value;
    }
    return '';
}

function hrmAppendPhotoPayload(payload, fileValue) {
    if (fileValue && typeof fileValue === 'object' && typeof fileValue.name === 'string' && fileValue.name) {
        payload.append('photofilename', fileValue.name);
        payload.append('userphotoname', fileValue);
    } else {
        payload.append('photofilename', '-');
        payload.append('userphotoname', '-');
    }
}

function hrmBuildHtgSubrecordPayload(source, route, mode) {
    const payload = new FormData();
    const append = (key, ...fromKeys) => payload.append(key, hrmPickFormDataValue(source, ...fromKeys));
    const staffid = hrmExtractPersonnelId(hrmPickFormDataValue(source, 'personnel', 'staffid'));
    if (mode === 'save' || mode === 'update') {
        if (mode === 'update') payload.append('id', hrmPickFormDataValue(source, 'id'));
        payload.append('staffid', staffid);
        if (route === 'pp_guarantor') {
            payload.append('personnelmatter', 'GUARANTOR');
            append('guarantorname', 'guarantorname');
            append('occupation', 'occupation');
            append('phonenumber', 'phonenumber');
            append('address', 'address');
            append('officeaddress', 'officeaddress');
            append('yearsknown', 'yearsknown');
        } else if (route === 'pp_employerrecord') {
            append('employer', 'employer');
            append('position', 'position');
            append('basic', 'basic');
            append('yearsemployed', 'yearsemployed');
            append('reasonforleaving', 'reasonforleaving');
        } else if (route === 'pp_referees') {
            append('fullname', 'fullname', 'refereename');
            append('occupation', 'occupation');
            append('address', 'address');
            append('phonenumber', 'phonenumber', 'phone');
            append('relationship', 'relationship');
        } else if (route === 'pp_qualification') {
            append('institution', 'institution');
            append('qualification', 'qualification');
            append('certificationdate', 'certificationdate');
        } else if (route === 'pp_parentsguardians') {
            payload.append('personnelmatter', 'PARENTS');
            append('parentone', 'parentone');
            append('parenttwo', 'parenttwo');
            append('parentoneoccupation', 'parentoneoccupation');
            append('parenttwooccupation', 'parenttwooccupation');
            append('parentonephone', 'parentonephone');
            append('parenttwophone', 'parenttwophone');
            append('homeaddress', 'homeaddress');
            append('officeaddress', 'officeaddress');
        }
        hrmAppendPhotoPayload(payload, hrmPickFormDataValue(source, 'attachment', 'userphotoname', 'photo', 'document'));
        return payload;
    }

    if (staffid) payload.append('staffid', staffid);
    return payload;
}

function hrmBuildHtgMatterPayload(source, route, mode) {
    const payload = new FormData();
    const append = (key, ...fromKeys) => payload.append(key, hrmPickFormDataValue(source, ...fromKeys));
    const appendNumeric = (key, ...fromKeys) => payload.append(key, hrmStripNumericFormatting(hrmPickFormDataValue(source, ...fromKeys)));
    const matter = hrmHtgPersonnelMatterByRoute[route] || '';
    const pid = hrmExtractPersonnelId(hrmPickFormDataValue(source, 'personnel', 'personnelid', 'pid'));
    const recordId = hrmPickFormDataValue(source, 'id');

    if (mode === 'save' || mode === 'update') {
        if (mode === 'update') payload.append('id', recordId);
        payload.append('personnelmatter', matter);
        payload.append('pid', pid);
        append('entrydate', 'entrydate');
        append('title', 'title');
        if (route === 'pp_query') {
            append('startdate', 'startdate');
            append('enddate', 'enddate');
        }
        if (route === 'pp_leave') {
            append('startdate', 'startdate');
            append('enddate', 'enddate');
        }
        if (route === 'pp_promotions') {
            append('level', 'level');
        }
        if (route === 'pp_advance') {
            const normalizedAmount = hrmStripNumericFormatting(hrmPickFormDataValue(source, 'amount'));
            const normalizedInstallment = hrmStripNumericFormatting(hrmPickFormDataValue(source, 'monthlyinstallment'));
            payload.append('amount', normalizedAmount);
            payload.append('monthlyinstallment', normalizedInstallment);
            payload.append('installmentamount', normalizedInstallment);
            payload.append('level', '-1');
        }
        hrmAppendPhotoPayload(payload, hrmPickFormDataValue(source, 'attachment', 'userphotoname', 'photo', 'document'));
        return payload;
    }

    payload.append('personnelmatter', matter);
    if (pid) payload.append('personnelid', pid);
    if (recordId) payload.append('id', recordId);
    return payload;
}

function hrmBuildPayloadFromForm(form, route, mode) {
    if (route === 'pp_viewmonthlysalaryschedule') {
        const source = form ? new FormData(form) : new FormData();
        const payload = new FormData();
        payload.append('location', hrmPickFormDataValue(source, 'location'));
        payload.append('month', hrmPickFormDataValue(source, 'month'));
        payload.append('year', hrmPickFormDataValue(source, 'year'));
        return payload;
    }

    if (route === 'pp_personalstaffsalaryrecord') {
        const source = form ? new FormData(form) : new FormData();
        const payload = new FormData();
        const staffid = hrmExtractPersonnelId(hrmPickFormDataValue(source, 'personnel', 'staffid'));
        if (staffid) payload.append('staffid', staffid);
        return payload;
    }

    if (hrmHtgPayloadRoutes.has(route)) {
        const source = form ? new FormData(form) : new FormData();
        if (hrmHtgSubrecordRoutes.has(route)) return hrmBuildHtgSubrecordPayload(source, route, mode);
        if (hrmHtgMatterRoutes.has(route)) return hrmBuildHtgMatterPayload(source, route, mode);
    }

    const payload = new FormData();
    if (form) {
        const data = new FormData(form);
        data.forEach((value, key) => {
            if (value === null || value === undefined || value === '') return;
            payload.append(key, value);
        });
    }
    payload.append('module', route);
    payload.append('mode', mode);
    if (route === 'pp_personnel') {
        const levelId = payload.get('levelid') || payload.get('level') || '';
        if (levelId) payload.set('levelid', levelId);
    }
    return payload;
}

function hrmStripNumericFormatting(value) {
    const raw = String(value ?? '').trim();
    if (!raw) return '';
    return raw.replace(/,/g, '').replace(/\s+/g, '');
}

function hrmGetFieldControl(form, field = {}) {
    if (!form || !field) return null;
    const fieldId = String(field.id || '').trim();
    const fieldName = String(field.name || fieldId).trim();
    if (fieldId) {
        const byId = form.querySelector(`#${fieldId}`);
        if (byId) return byId;
    }
    if (fieldName) {
        const byName = form.querySelector(`[name="${fieldName}"]`);
        if (byName) return byName;
    }
    return null;
}

function hrmControlHasValue(control) {
    if (!control) return false;
    if (control.type === 'file') return Boolean(control.files && control.files.length > 0) || String(control.value || '').trim() !== '';
    if (control.type === 'checkbox' || control.type === 'radio') return Boolean(control.checked);
    if (control.tomselect && typeof control.tomselect.getValue === 'function') {
        const selected = control.tomselect.getValue();
        if (Array.isArray(selected)) return selected.some((item) => String(item || '').trim() !== '');
        return String(selected || '').trim() !== '';
    }
    return String(control.value || '').trim() !== '';
}

function hrmValidateEntryForm(form, blueprint = {}) {
    if (!form) return { valid: true, missing: [] };
    const requiredFields = Array.isArray(blueprint?.fields)
        ? blueprint.fields.filter((field) => field?.required)
        : [];
    if (!requiredFields.length) return { valid: true, missing: [] };

    const missing = [];
    let firstMissingControl = null;
    requiredFields.forEach((field) => {
        const control = hrmGetFieldControl(form, field);
        if (hrmControlHasValue(control)) return;
        missing.push(String(field.label || field.id || field.name || 'Field'));
        if (!firstMissingControl) firstMissingControl = control;
    });

    if (firstMissingControl && typeof firstMissingControl.focus === 'function') {
        firstMissingControl.focus();
    }
    return { valid: missing.length === 0, missing };
}

function hrmEnsureDatalist(id) {
    if (!id) return null;
    let list = document.getElementById(id);
    if (list) return list;
    list = document.createElement('datalist');
    list.id = id;
    document.body.appendChild(list);
    return list;
}

function hrmSetDatalistOptions(id, values = []) {
    const list = hrmEnsureDatalist(id);
    if (!list) return;
    list.innerHTML = (values || [])
        .map((value) => String(value || '').trim())
        .filter((value, index, arr) => value && arr.indexOf(value) === index)
        .map((value) => `<option value="${value}"></option>`)
        .join('');
}

function hrmBuildPersonnelPayload(form, mode = 'save') {
    const source = form ? new FormData(form) : new FormData();
    const payload = new FormData();
    const pick = (...keys) => {
        for (const key of keys) {
            const value = source.get(key);
            if (value === null || value === undefined) continue;
            if (typeof value === 'string' && value.trim() === '') continue;
            return value;
        }
        return '';
    };
    const append = (key, value) => payload.append(key, value ?? '');

    if (mode === 'update') append('id', pick('id'));
    append('staffid', pick('staffid'));

    append('maritalstatus', pick('maritalstatus'));
    append('gender', pick('gender'));
    append('deformity', pick('deformity'));
    append('eyeglasses', pick('eyeglasses'));
    append('firstname', pick('firstname'));
    append('hearingaid', pick('hearingaid'));
    append('lastname', pick('lastname'));
    append('othernames', pick('othernames'));
    append('phonenumber', pick('phonenumber', 'phone'));
    append('workstatus', pick('workstatus'));
    append('residentialaddress', pick('residentialaddress', 'address'));
    append('permanenthomeaddress', pick('permanenthomeaddress'));
    append('birthdate', pick('birthdate'));
    append('nationality', pick('nationality'));
    append('state', pick('state'));
    append('lga', pick('lga'));
    append('height', pick('height'));
    append('weight', pick('weight'));
    append('bankaccountnumber1', pick('bankaccountnumber1'));
    append('bankname1', pick('bankname1'));
    append('bankaccountnumber2', '-');
    append('bankname2', '-');
    append('employmentdate', pick('employmentdate'));
    append('registereduseremail', pick('registereduseremail', 'email'));
    append('basicsalary', pick('basicsalary'));
    append('departmentid', pick('departmentid', 'department'));
    append('levelid', pick('levelid', 'level'));
    append('groupid', '0');

    const photo = pick('userphotoname', 'photo', 'document');
    if (photo && typeof photo === 'object' && typeof photo.name === 'string' && photo.name) {
        append('photofilename', photo.name);
        append('userphotoname', photo);
    } else {
        append('photofilename', '-');
        append('userphotoname', '-');
    }

    return payload;
}

function hrmEnsureTomSelectAssets() {
    if (window.TomSelect) return Promise.resolve();
    if (hrmTomSelectAssetsPromise) return hrmTomSelectAssetsPromise;

    hrmTomSelectAssetsPromise = new Promise((resolve, reject) => {
        if (!document.querySelector('link[data-hrm-tom-select]')) {
            const css = document.createElement('link');
            css.rel = 'stylesheet';
            css.href = 'https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/css/tom-select.css';
            css.dataset.hrmTomSelect = '1';
            document.head.appendChild(css);
        }

        const existingScript = document.querySelector('script[data-hrm-tom-select]');
        if (existingScript) {
            existingScript.addEventListener('load', () => resolve(), { once: true });
            existingScript.addEventListener('error', () => reject(new Error('Tom Select load failed')), { once: true });
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/js/tom-select.complete.min.js';
        script.async = true;
        script.dataset.hrmTomSelect = '1';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Tom Select load failed'));
        document.head.appendChild(script);
    });

    return hrmTomSelectAssetsPromise;
}

function hrmNormalizeLevelOptions(responseData) {
    const rows = hrmNormalizeLevelRows(responseData);
    return rows.map((item) => {
        const nested = item?.level || {};
        const id = item?.id ?? nested?.id ?? '';
        const label = typeof item?.level === 'string'
            ? item.level
            : (nested?.level ?? item?.levelname ?? '');
        const basicsalary = nested?.basicsalary ?? item?.basicsalary ?? '';
        if (id && label) hrmLevelLabelById[String(id)] = String(label);
        return { id: String(id), label: String(label), basicsalary: String(basicsalary ?? '') };
    }).filter((item) => item.id && item.label);
}

async function hrmPopulatePersonnelLevelPicker() {
    const control = document.getElementById('levelid');
    if (!control) return;

    const result = await hrmRequestController('fetchlevel.php', new FormData());
    const options = result.ok ? hrmNormalizeLevelOptions(result.data) : [];
    Object.keys(hrmPersonnelLevelMetaById).forEach((key) => delete hrmPersonnelLevelMetaById[key]);
    options.forEach((item) => {
        hrmPersonnelLevelMetaById[item.id] = { basicsalary: item.basicsalary || '' };
    });

    control.innerHTML = `<option value="">-- select level --</option>${options.map((item) => `<option value="${item.id}">${item.label.toUpperCase()}</option>`).join('')}`;
    control.onchange = () => {
        const basicsalaryControl = document.getElementById('basicsalary');
        if (!basicsalaryControl) return;
        basicsalaryControl.value = hrmPersonnelLevelMetaById[control.value]?.basicsalary || '';
    };
    control.dispatchEvent(new Event('change'));

    if (!control.dataset.hrmTomSelect) return;
    try {
        await hrmEnsureTomSelectAssets();
        if (hrmTomSelectInstances.levelid) {
            hrmTomSelectInstances.levelid.destroy();
            delete hrmTomSelectInstances.levelid;
        }
        if (window.TomSelect) {
            hrmTomSelectInstances.levelid = new window.TomSelect(control, {
                create: false,
                maxOptions: 500,
                sortField: { field: 'text', direction: 'asc' },
                placeholder: 'Select level'
            });
        }
    } catch (error) {
        console.log(error);
    }
}

async function hrmPopulatePersonnelEmailList() {
    const result = await hrmRequestController('fetchallusers.php', new FormData());
    if (!result.ok || result?.data?.status === false) {
        hrmSetDatalistOptions('personelallemail', []);
        return;
    }
    const rows = Array.isArray(result?.data?.data) ? result.data.data : (Array.isArray(result?.data) ? result.data : []);
    const values = rows.map((row) => row?.user || row?.email || row?.username || '').filter(Boolean);
    hrmSetDatalistOptions('personelallemail', values);
}

async function hrmPopulateCountries() {
    try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries');
        const result = await response.json();
        const countries = Array.isArray(result?.data) ? result.data.map((item) => item?.country || '').filter(Boolean) : [];
        hrmSetDatalistOptions('orecountry', countries);
    } catch (error) {
        hrmSetDatalistOptions('orecountry', []);
    }
}

async function hrmPopulateStates(country) {
    if (!country) {
        hrmSetDatalistOptions('orestate', []);
        hrmSetDatalistOptions('orelga', []);
        return;
    }
    try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country })
        });
        const result = await response.json();
        const states = Array.isArray(result?.data?.states) ? result.data.states.map((item) => item?.name || '').filter(Boolean) : [];
        hrmSetDatalistOptions('orestate', states);
        hrmSetDatalistOptions('orelga', []);
    } catch (error) {
        hrmSetDatalistOptions('orestate', []);
        hrmSetDatalistOptions('orelga', []);
    }
}

async function hrmPopulateCities(country, state) {
    if (!country || !state) {
        hrmSetDatalistOptions('orelga', []);
        return;
    }
    try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country, state })
        });
        const result = await response.json();
        const cities = Array.isArray(result?.data) ? result.data : [];
        hrmSetDatalistOptions('orelga', cities);
    } catch (error) {
        hrmSetDatalistOptions('orelga', []);
    }
}

async function hrmBindPersonnelLookupBehavior() {
    hrmEnsureDatalist('personelallemail');
    hrmEnsureDatalist('orecountry');
    hrmEnsureDatalist('orestate');
    hrmEnsureDatalist('orelga');

    await Promise.all([hrmPopulatePersonnelEmailList(), hrmPopulateCountries()]);

    const nationalityControl = document.getElementById('nationality');
    const stateControl = document.getElementById('state');
    if (nationalityControl) {
        nationalityControl.onchange = async () => {
            await hrmPopulateStates(nationalityControl.value);
        };
    }
    if (stateControl) {
        stateControl.onchange = async () => {
            const country = nationalityControl?.value || '';
            await hrmPopulateCities(country, stateControl.value);
        };
    }
}

function hrmSetButtonLoading(button, loading) {
    if (!button) return;
    button.disabled = loading;
    const loader = button.querySelector('.btnloader');
    if (loader) loader.style.display = loading ? 'block' : 'none';
}

async function hrmRequestController(controllerName, payload = null, button = null) {
    const endpoint = hrmControllerEndpoint(controllerName);
    if (!endpoint) return { ok: false, message: 'Controller endpoint is missing', data: null };

    try {
        hrmSetButtonLoading(button, true);
        const response = await fetch(endpoint, {
            method: 'POST',
            body: payload || new FormData(),
            headers: new Headers()
        });
        const raw = await response.text();
        let parsed = raw;
        try {
            parsed = JSON.parse(raw);
        } catch (error) {}
        return { ok: response.ok, data: parsed, raw, status: response.status };
    } catch (error) {
        return { ok: false, message: error?.message || 'Failed to reach controller', data: null };
    } finally {
        hrmSetButtonLoading(button, false);
    }
}

function hrmHasControllerResponse(result) {
    if (!result) return false;
    if (typeof result?.data === 'string' && result.data.trim()) return true;
    if (result?.data && typeof result.data === 'object' && Object.keys(result.data).length > 0) return true;
    if (typeof result?.raw === 'string' && result.raw.trim()) return true;
    return false;
}

function hrmResultErrorMessage(result, fallback = 'Request failed') {
    if (typeof result?.data === 'string' && result.data.trim()) return result.data.trim();
    if (result?.data?.message) return String(result.data.message);
    if (result?.message) return String(result.message);
    if (typeof result?.raw === 'string' && result.raw.trim()) return result.raw.trim();
    return fallback;
}

function hrmResultSuccessMessage(result, fallback = 'Request completed successfully') {
    if (result?.data && typeof result.data === 'object' && result.data.message) {
        return String(result.data.message);
    }
    if (typeof result?.data === 'string' && /success|successful|completed/i.test(result.data)) {
        return result.data.trim();
    }
    if (typeof result?.raw === 'string' && /success|successful|completed/i.test(result.raw)) {
        return result.raw.trim();
    }
    return fallback;
}

function hrmIsControllerSuccess(result) {
    if (!result || result.ok !== true) return false;

    const data = result.data;
    if (data && typeof data === 'object') {
        if (data.status === false || data.success === false) return false;
        if (Number(data.code) === 200) return true;
        if (data.status === true || data.success === true) return true;
        if (typeof data.message === 'string' && /success|successful|completed/i.test(data.message)) return true;
    }

    if (typeof data === 'string') {
        if (/error|failed|invalid|unable/i.test(data)) return false;
        if (/success|successful|completed/i.test(data)) return true;
    }

    return Number(result.status) === 200;
}

function hrmExtractRowsFromResponse(responseData) {
    const scan = (candidate, depth = 0) => {
        if (depth > 5 || candidate === null || candidate === undefined) return [];
        if (Array.isArray(candidate)) return candidate;
        if (typeof candidate !== 'object') return [];

        const directKeys = ['data', 'result', 'records', 'rows', 'payload', 'items', 'list'];
        for (const key of directKeys) {
            const value = candidate[key];
            if (Array.isArray(value)) return value;
        }

        const numericKeySet = Object.keys(candidate);
        if (numericKeySet.length && numericKeySet.every((key) => /^\d+$/.test(key))) {
            return numericKeySet.sort((a, b) => Number(a) - Number(b)).map((key) => candidate[key]);
        }

        for (const key of directKeys) {
            if (candidate[key] && typeof candidate[key] === 'object') {
                const nested = scan(candidate[key], depth + 1);
                if (nested.length) return nested;
            }
        }
        return [];
    };
    return scan(responseData, 0);
}

function hrmFirstFilled(record = {}, ...keys) {
    for (const key of keys) {
        const value = record?.[key];
        if (value === null || value === undefined || value === '') continue;
        return value;
    }
    return '';
}

function hrmFormatNumberWithCommas(value) {
    const normalized = hrmNormalizePersonnelValue(value);
    if (!normalized) return '';
    const raw = String(normalized).replace(/,/g, '').trim();
    if (!/^-?\d+(\.\d+)?$/.test(raw)) return normalized;
    const [whole, decimal] = raw.split('.');
    const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decimal !== undefined ? `${formattedWhole}.${decimal}` : formattedWhole;
}

function hrmMonthNameByValue(value) {
    const month = String(value || '').trim();
    const option = hrmMonthSelectOptions.find((item) => String(item.value) === month);
    return option ? option.label : month;
}

function hrmBuildPayrollLineTable(lines = []) {
    const normalized = Array.isArray(lines) ? lines : [];
    if (!normalized.length) return '-';
    const rows = normalized.map((line, index) => {
        const title = hrmEscapeHtml(hrmFirstFilled(line, 'salaryinfo', 'title') || '-');
        const amount = hrmEscapeHtml(hrmFormatNumberWithCommas(hrmFirstFilled(line, 'amount') || '0'));
        return `<tr><td>${index + 1}</td><td>${title}</td><td>${amount}</td></tr>`;
    }).join('');
    return `<table class="min-w-[220px]">${rows}</table>`;
}

function hrmIsMonetaryColumn(column = '') {
    const label = String(column || '').toLowerCase();
    return /amount|salary|basic|allowance|deduction|gross|net pay|netpay|installment|monthly/i.test(label);
}

function hrmFormatMonetaryColumnValue(column = '', value = '') {
    if (!hrmIsMonetaryColumn(column)) return value;
    const normalized = hrmNormalizePersonnelValue(value);
    if (!normalized || normalized.includes('%') || normalized.includes('<')) return value;
    const raw = String(normalized).replace(/,/g, '').trim();
    if (!/^-?\d+(\.\d+)?$/.test(raw)) return value;
    return hrmFormatNumberWithCommas(raw);
}

function hrmExtractIdFromActionHtml(html = '') {
    const raw = String(html || '');
    const idMatch = raw.match(/\((\d+)\)/) || raw.match(/['"]id['"]\s*[:,=]\s*['"]?(\d+)['"]?/i) || raw.match(/data-[a-z0-9_-]*id=['"]?(\d+)['"]?/i);
    return idMatch ? idMatch[1] : '';
}

function hrmParseHtmlRowsByRoute(html = '', route = '') {
    const source = String(html || '').trim();
    if (!source) return [];

    const container = document.createElement('table');
    container.innerHTML = `<tbody>${source}</tbody>`;
    const tableRows = Array.from(container.querySelectorAll('tbody tr'));
    if (!tableRows.length) return [];

    const rows = tableRows.map((tr) => {
        const cells = Array.from(tr.querySelectorAll('td'));
        if (!cells.length) return null;
        const values = cells.map((cell) => String(cell.textContent || '').trim());
        const actionHtml = cells[cells.length - 1]?.innerHTML || '';
        const id = hrmExtractIdFromActionHtml(actionHtml);

        if (route === 'pp_employerrecord') {
            return {
                id,
                staffid: values[1] || '',
                employer: values[2] || '',
                position: values[3] || '',
                basic: values[4] ? String(values[4]).replace(/,/g, '') : '',
                yearsemployed: values[5] || '',
                reasonforleaving: values[6] || ''
            };
        }
        if (route === 'pp_referees') {
            return {
                id,
                staffid: values[1] || '',
                fullname: values[2] || '',
                relationship: values[3] || '',
                occupation: values[4] || '',
                phonenumber: values[5] || '',
                address: values[6] || ''
            };
        }
        return null;
    }).filter(Boolean);

    return rows;
}

function hrmNormalizeSubrecordRows(route = '', rows = []) {
    const sourceRows = Array.isArray(rows) ? rows : [];
    const normalizeOne = (row) => {
        const base = (row && typeof row === 'object') ? row : {};
        const nested = hrmFirstFilled(
            base,
            'guarantor',
            'employmentrecord',
            'employerrecord',
            'referee',
            'referees',
            'qualification',
            'parents',
            'parent',
            'parentsguardians',
            'record'
        );
        const candidate = (nested && typeof nested === 'object' && !Array.isArray(nested))
            ? { ...nested, ...base }
            : { ...base };

        if (route === 'pp_referees') {
            candidate.staffid = hrmFirstFilled(candidate, 'staffid', 'pid', 'personnelid', 'personnel');
            candidate.fullname = hrmFirstFilled(candidate, 'fullname', 'refereename', 'name');
            candidate.phonenumber = hrmFirstFilled(candidate, 'phonenumber', 'phone');
            candidate.relationship = hrmFirstFilled(candidate, 'relationship');
            candidate.occupation = hrmFirstFilled(candidate, 'occupation');
            candidate.address = hrmFirstFilled(candidate, 'address');
            candidate.id = hrmFirstFilled(candidate, 'id');
        }

        return candidate;
    };

    return sourceRows.map(normalizeOne).filter((row) => row && typeof row === 'object');
}

function hrmPersonnelDisplay(staffid) {
    const key = hrmNormalizePersonnelValue(staffid);
    if (!key) return '-';
    return hrmPersonnelLabelByStaffId[key] || key;
}

function hrmResolvePersonnelId(value) {
    const normalized = hrmNormalizePersonnelValue(value);
    if (!normalized) return '';
    if (hrmPersonnelLabelByStaffId[normalized]) return normalized;
    const lowered = normalized.toLowerCase();
    const normalizeNameOrder = (name) => String(name || '').toLowerCase().split(/\s+/).filter(Boolean).sort().join(' ');
    const loweredCanonical = normalizeNameOrder(lowered);
    const matched = Object.entries(hrmPersonnelLabelByStaffId).find(([staffid, label]) => {
        const sid = String(staffid || '').toLowerCase();
        const text = String(label || '').toLowerCase();
        const textCanonical = normalizeNameOrder(text);
        return lowered === sid || lowered === text || lowered === `${sid} || ${text}` || (loweredCanonical && loweredCanonical === textCanonical);
    });
    return matched ? matched[0] : normalized;
}

function hrmLevelDisplay(levelid) {
    const key = hrmNormalizePersonnelValue(levelid);
    if (!key || key === '-1') return key === '-1' ? '-' : '-';
    return hrmLevelLabelById[key] || key;
}

function hrmRecordDocumentValue(record = {}) {
    return hrmFirstFilled(record, 'doc', 'document', 'filename', 'photofilename');
}

function hrmDocumentTableCell(value) {
    const documentName = hrmNormalizePersonnelValue(value);
    if (!documentName || documentName === '-') return '-';
    const href = `../images/personnel/${encodeURIComponent(documentName)}`;
    return `<a href="${href}" target="_blank" rel="noopener" class="text-blue-700 underline">${hrmEscapeHtml(documentName)}</a>`;
}

function hrmRouteRowValues(route, record = {}) {
    switch (route) {
        case 'pp_viewmonthlysalaryschedule': {
            const personnel = Array.isArray(record?.personnel) ? (record.personnel[0] || {}) : (record?.personnel || {});
            const payroll = record?.payroll || {};
            const paydetail = Array.isArray(record?.paydetail) ? record.paydetail : [];
            const allowanceLines = paydetail.filter((line) => String(line?.salaryinfotype || '').toUpperCase() === 'ALLOWANCE');
            const deductionLines = paydetail.filter((line) => String(line?.salaryinfotype || '').toUpperCase() === 'DEDUCTION');
            const rowId = hrmEscapeHtml(hrmFirstFilled(payroll, 'id') || hrmFirstFilled(record, 'id'));
            return [
                `<input class="confirmmonthpayrollcheckbox" type="checkbox" id="${rowId}">`,
                hrmFirstFilled(personnel, 'firstname'),
                hrmFirstFilled(personnel, 'othernames'),
                hrmFirstFilled(personnel, 'lastname'),
                hrmFirstFilled(personnel, 'department', 'departmentname'),
                hrmLevelDisplay(hrmFirstFilled(personnel, 'levelid')),
                hrmFirstFilled(record, 'netpayable'),
                hrmFirstFilled(payroll, 'totalallowance'),
                hrmFirstFilled(payroll, 'totaldeduction'),
                hrmBuildPayrollLineTable(allowanceLines),
                hrmBuildPayrollLineTable(deductionLines),
                hrmFirstFilled(payroll, 'entrydate')
            ];
        }
        case 'pp_personalstaffsalaryrecord': {
            const payrollPersonnelId = hrmFirstFilled(record, 'staffid', 'pid', 'personnelid', 'personnel');
            const fallbackPersonnel = hrmExtractPersonnelId(document.getElementById('hrm_filter_personnel')?.value || '');
            const personnelId = payrollPersonnelId || fallbackPersonnel;
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const monthNumber = Number(String(hrmFirstFilled(record, 'month') || '').trim());
            const monthLabel = Number.isFinite(monthNumber) && monthNumber >= 1 && monthNumber <= 12
                ? monthNames[monthNumber - 1]
                : hrmFirstFilled(record, 'month');
            return [
                hrmPersonnelDisplay(personnelId),
                hrmFirstFilled(record, 'entrydate'),
                monthLabel,
                hrmFirstFilled(record, 'year'),
                hrmFirstFilled(record, 'totalallowance'),
                hrmFirstFilled(record, 'totaldeduction'),
                hrmFirstFilled(record, 'withattendance'),
                hrmFirstFilled(record, 'netpayable')
            ];
        }
        case 'pp_guarantor':
            return [hrmPersonnelDisplay(record.staffid), record.guarantorname, record.occupation, record.phonenumber, record.address];
        case 'pp_employerrecord':
            return [hrmPersonnelDisplay(record.staffid), record.employer, record.position, hrmFormatNumberWithCommas(record.basic), record.yearsemployed, record.reasonforleaving];
        case 'pp_referees':
            return [hrmPersonnelDisplay(record.staffid), record.fullname, record.relationship, record.occupation, record.phonenumber, record.address];
        case 'pp_qualification':
            return [hrmPersonnelDisplay(record.staffid), record.institution, record.qualification, record.certificationdate, hrmDocumentTableCell(record.doc)];
        case 'pp_parentsguardians':
            return [hrmPersonnelDisplay(record.staffid), record.parentone, record.parenttwo, record.parentoneoccupation, record.parenttwooccupation, record.parentonephone, record.parenttwophone, record.homeaddress, record.officeaddress];
        case 'pp_promotions':
            return [hrmPersonnelDisplay(record.pid), hrmLevelDisplay(record.level), record.title, record.entrydate];
        case 'pp_leave':
            return [hrmPersonnelDisplay(record.pid), record.entrydate, record.title, record.startdate, record.enddate];
        case 'pp_advance':
        case 'pp_viewstaffadvance':
            return [hrmPersonnelDisplay(record.pid), record.title, record.amount, record.entrydate];
        case 'pp_query':
        case 'pp_termination':
        case 'pp_suspension':
        case 'pp_warning':
        case 'pp_monitorevaluation':
            return [hrmPersonnelDisplay(record.pid), record.entrydate, record.title];
        default:
            return Object.values(record || {});
    }
}

function hrmEncodeRecord(record = {}) {
    return encodeURIComponent(JSON.stringify(record || {}));
}

function hrmRouteActionCell(route, record = {}) {
    const encoded = hrmEncodeRecord(record);
    const id = hrmEscapeHtml(hrmFirstFilled(record, 'id'));
    const deleteController = hrmResolveControllerName(route, 'delete');
    const deleteButton = id && deleteController
        ? `<button type="button" class="btn hrm-ui-action" data-hrm-delete="1" data-hrm-id="${id}" data-hrm-record="${encoded}" title="Delete record" style="background-color:#dc2626 !important;color:#fff !important;min-width:38px;padding:6px 10px;"><span class="material-symbols-outlined" style="font-size:16px;line-height:1;">delete</span></button>`
        : '';
    return `
        <td>
            <div class="flex flex-wrap gap-2">
                <button type="button" class="btn hrm-ui-action" data-hrm-view="1" data-hrm-record="${encoded}" title="View record" style="background:#0f766e;color:#fff;min-width:38px;padding:6px 10px;"><span class="material-symbols-outlined" style="font-size:16px;line-height:1;">visibility</span></button>
                <button type="button" class="btn hrm-ui-action" data-hrm-edit="1" data-hrm-record="${encoded}" title="Edit record" style="background:#2563eb;color:#fff;min-width:38px;padding:6px 10px;"><span class="material-symbols-outlined" style="font-size:16px;line-height:1;">edit</span></button>
                ${deleteButton}
            </div>
        </td>
    `;
}

function hrmRenderRows(columns, rows, route = '') {
    const body = document.getElementById('hrm_table_body');
    const status = document.getElementById('hrm_table_status');
    if (!body) return;

    if (!Array.isArray(rows) || rows.length === 0) {
        body.innerHTML = `<tr><td colspan="${columns.length}" class="text-center opacity-70">No records found.</td></tr>`;
        if (status) status.textContent = 'Showing 0 to 0 of 0 records';
        if (route === 'pp_viewmonthlysalaryschedule') {
            const monthControl = document.getElementById('hrm_filter_month');
            const yearControl = document.getElementById('hrm_filter_year');
            hrmSetSummaryValues(['0', '0', '0', '0', hrmMonthNameByValue(monthControl?.value || '-'), hrmNormalizePersonnelValue(yearControl?.value || '-') || '-']);
        } else {
            hrmSetSummaryValues(['0', '0', '0', '0']);
        }
        return;
    }

    body.innerHTML = rows.map((row, index) => {
        const objectRow = (row && typeof row === 'object') ? row : { value: row };
        const valueList = hrmRouteRowValues(route, objectRow);
        const cells = columns.map((column, cellIndex) => {
            if (String(column).toLowerCase() === 'action') {
                return hrmRouteActionCell(route, objectRow);
            }
            if (cellIndex === 0) return `<td>${index + 1}</td>`;
            const rawValue = valueList[cellIndex - 1] ?? '';
            const value = hrmFormatMonetaryColumnValue(column, rawValue);
            const allowsRawHtml = route === 'pp_viewmonthlysalaryschedule' && /<input|<table|<span/i.test(String(value));
            return `<td>${String(value).includes('<a ') || allowsRawHtml ? value : hrmEscapeHtml(value)}</td>`;
        }).join('');
        return `<tr>${cells}</tr>`;
    }).join('');

    if (status) status.textContent = `Showing 1 to ${rows.length} of ${rows.length} records`;
    hrmSetSummaryValues(hrmComputeGenericSummary(rows, route));
}

function hrmMapRouteRecordToForm(route, record = {}) {
    const personnel = hrmResolvePersonnelId(hrmFirstFilled(record, 'staffid', 'pid', 'personnelid'));
    const baseMatter = {
        id: hrmFirstFilled(record, 'id'),
        personnel,
        entrydate: hrmFirstFilled(record, 'entrydate'),
        title: hrmFirstFilled(record, 'title'),
        startdate: hrmFirstFilled(record, 'startdate'),
        enddate: hrmFirstFilled(record, 'enddate')
    };

    switch (route) {
        case 'pp_guarantor':
            return { id: record.id, personnel, guarantorname: record.guarantorname, occupation: record.occupation, phonenumber: record.phonenumber, address: record.address, officeaddress: record.officeaddress, yearsknown: record.yearsknown, existingdocument: hrmRecordDocumentValue(record) };
        case 'pp_employerrecord':
            return { id: record.id, personnel, employer: record.employer, position: record.position, basic: record.basic, yearsemployed: record.yearsemployed, reasonforleaving: record.reasonforleaving, existingdocument: hrmRecordDocumentValue(record) };
        case 'pp_referees':
            return { id: record.id, personnel, fullname: record.fullname, relationship: record.relationship, occupation: record.occupation, phonenumber: record.phonenumber, address: record.address, existingdocument: hrmRecordDocumentValue(record) };
        case 'pp_qualification':
            return { id: record.id, personnel, institution: record.institution, qualification: record.qualification, certificationdate: record.certificationdate, existingdocument: hrmRecordDocumentValue(record) };
        case 'pp_parentsguardians':
            return { id: record.id, personnel, parentone: record.parentone, parenttwo: record.parenttwo, parentoneoccupation: record.parentoneoccupation, parenttwooccupation: record.parenttwooccupation, parentonephone: record.parentonephone, parenttwophone: record.parenttwophone, homeaddress: record.homeaddress, officeaddress: record.officeaddress, existingdocument: hrmRecordDocumentValue(record) };
        case 'pp_promotions':
            return { ...baseMatter, level: record.level, existingdocument: hrmRecordDocumentValue(record) };
        case 'pp_advance':
        case 'pp_viewstaffadvance':
            return { ...baseMatter, amount: record.amount, monthlyinstallment: record.monthlyinstallment, existingdocument: hrmRecordDocumentValue(record) };
        default:
            return { ...baseMatter, existingdocument: hrmRecordDocumentValue(record) };
    }
}

function hrmRecordDetailPairs(route, record = {}) {
    const commonMatter = [
        ['Personnel', hrmPersonnelDisplay(hrmFirstFilled(record, 'pid', 'staffid', 'personnelid'))],
        ['Entry Date', record.entrydate],
        ['Title', record.title],
        ['Start Date', record.startdate],
        ['End Date', record.enddate],
        ['Document', hrmRecordDocumentValue(record)]
    ];
    const routePairs = {
        pp_guarantor: [['Personnel', hrmPersonnelDisplay(record.staffid)], ['Guarantor Name', record.guarantorname], ['Occupation', record.occupation], ['Phone Number', record.phonenumber], ['Residential Address', record.address], ['Office Address', record.officeaddress], ['Years Known', record.yearsknown], ['Document', hrmRecordDocumentValue(record)]],
        pp_employerrecord: [['Personnel', hrmPersonnelDisplay(record.staffid)], ['Employer', record.employer], ['Position', record.position], ['Basic', record.basic], ['Years Employed', record.yearsemployed], ['Reason For Leaving', record.reasonforleaving], ['Document', hrmRecordDocumentValue(record)]],
        pp_referees: [['Personnel', hrmPersonnelDisplay(record.staffid)], ['Referee', record.fullname], ['Relationship', record.relationship], ['Occupation', record.occupation], ['Phone Number', record.phonenumber], ['Address', record.address], ['Document', hrmRecordDocumentValue(record)]],
        pp_qualification: [['Personnel', hrmPersonnelDisplay(record.staffid)], ['Institution', record.institution], ['Qualification', record.qualification], ['Certification Date', record.certificationdate], ['Document', hrmRecordDocumentValue(record)]],
        pp_parentsguardians: [['Personnel', hrmPersonnelDisplay(record.staffid)], ['Parent One', record.parentone], ['Parent Two', record.parenttwo], ['Parent One Occupation', record.parentoneoccupation], ['Parent Two Occupation', record.parenttwooccupation], ['Parent One Phone', record.parentonephone], ['Parent Two Phone', record.parenttwophone], ['Home Address', record.homeaddress], ['Office Address', record.officeaddress], ['Document', hrmRecordDocumentValue(record)]],
        pp_promotions: [['Personnel', hrmPersonnelDisplay(record.pid)], ['Level', hrmLevelDisplay(record.level)], ['Title', record.title], ['Entry Date', record.entrydate], ['Document', hrmRecordDocumentValue(record)]],
        pp_advance: [['Personnel', hrmPersonnelDisplay(record.pid)], ['Title', record.title], ['Amount', record.amount], ['Monthly Installment', record.monthlyinstallment], ['Entry Date', record.entrydate], ['Document', hrmRecordDocumentValue(record)]],
        pp_viewstaffadvance: [['Personnel', hrmPersonnelDisplay(record.pid)], ['Title', record.title], ['Amount', record.amount], ['Entry Date', record.entrydate], ['Document', hrmRecordDocumentValue(record)]]
    };
    const pairs = routePairs[route] || commonMatter;
    const seen = new Set(pairs.map(([label]) => label.toLowerCase().replace(/\s+/g, '')));
    Object.entries(record || {}).forEach(([key, value]) => {
        const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (seen.has(normalized) || value === null || typeof value === 'object') return;
        pairs.push([key, value]);
    });
    return pairs;
}

function hrmRenderModalDocument(value) {
    const documentName = hrmNormalizePersonnelValue(value);
    if (!documentName || documentName === '-') return '-';
    const href = `../images/personnel/${encodeURIComponent(documentName)}`;
    const extension = hrmGetFileExtension(documentName).toLowerCase();
    const isImage = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'].includes(extension);
    if (!isImage) return hrmDocumentTableCell(documentName);
    return `
        <a href="${href}" target="_blank" rel="noopener" class="inline-flex flex-col gap-2">
            <img src="${href}" alt="${hrmEscapeHtml(documentName)}" class="w-32 h-24 object-cover rounded border border-slate-200">
            <span class="text-xs text-blue-700 underline">Open image</span>
        </a>
    `;
}

function hrmOpenRecordDetailModal(route, record = {}, blueprint = {}) {
    const previous = document.getElementById('hrm_record_detail_modal');
    if (previous) previous.remove();

    const modal = document.createElement('div');
    modal.id = 'hrm_record_detail_modal';
    modal.className = 'fixed inset-0 z-[2000] bg-black/50 flex items-center justify-center p-4';
    const title = hrmInterfaceRegistry[route]?.title || blueprint?.context || 'Record';
    modal.innerHTML = `
        <div class="bg-white rounded-md shadow-xl w-full max-w-4xl max-h-[92vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <p class="text-lg font-semibold text-slate-800">${hrmEscapeHtml(title)} Details</p>
                <button type="button" id="hrm_record_detail_close" class="btn" title="Close">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                ${hrmRecordDetailPairs(route, record).map(([label, value]) => {
                    const isDocument = String(label).toLowerCase().includes('document');
                    const rendered = isDocument ? hrmRenderModalDocument(value) : hrmEscapeHtml(value || '-');
                    return `
                        <div class="border border-slate-200 rounded-sm p-3 bg-slate-50/60">
                            <p class="text-xs uppercase tracking-wide text-slate-500">${hrmEscapeHtml(label)}</p>
                            <p class="text-sm font-medium text-slate-800 mt-1 break-words">${rendered}</p>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    const close = () => document.getElementById('hrm_record_detail_modal')?.remove();
    modal.querySelector('#hrm_record_detail_close')?.addEventListener('click', close);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) close();
    });
}

async function hrmDeleteRouteRecord(route, record = {}, blueprint = {}, button = null) {
    const id = hrmFirstFilled(record, 'id');
    const deleteController = hrmResolveControllerName(route, 'delete');
    if (!id || !deleteController) {
        notification('Delete is not available for this record', 0);
        return;
    }
    if (!window.confirm('Delete this record?')) return;
    const payload = new FormData();
    payload.append('id', id);
    const result = await hrmRequestController(deleteController, payload, button);
    if (!hrmIsControllerSuccess(result)) {
        notification(hrmResultErrorMessage(result, `Delete failed on ${deleteController}`), 0);
        return;
    }
    notification(hrmResultSuccessMessage(result, 'Code 200: Record deleted successfully'), 1);
    await hrmLoadViewData(route === 'pp_viewstaffadvance' ? 'pp_advance' : route, blueprint);
}

async function hrmLoadViewData(route, blueprint, button = null, filterForm = null) {
    const columns = blueprint.columns || ['S/N', 'Name', 'Status', 'Action'];
    const loadController = hrmResolveControllerName(route, filterForm ? 'filter' : 'load');
    const payload = route === 'pp_approvepersonnel'
        ? hrmBuildApprovePersonnelLoadPayload()
        : route === 'pp_personnelhistory'
            ? hrmBuildPersonnelHistoryLoadPayload(filterForm)
        : hrmBuildPayloadFromForm(filterForm, route, filterForm ? 'filter' : 'load');

    if (route === 'pp_personnelhistory' && !payload.get('staffid')) {
        const body = document.getElementById('hrm_table_body');
        const status = document.getElementById('hrm_table_status');
        const historySections = document.getElementById('hrm_personnelhistory_sections');
        if (body) body.innerHTML = `<tr><td colspan="${columns.length}" class="text-center opacity-70">Select a personnel to load history.</td></tr>`;
        if (historySections) historySections.innerHTML = `<div class="border border-slate-200 rounded-sm p-4 bg-white/90 text-sm text-slate-600">Select a personnel to load history.</div>`;
        if (status) status.textContent = 'Showing 0 to 0 of 0 records';
        hrmSetSummaryValues(['0', '0', '0', '0']);
        return;
    }
    if (route === 'pp_personalstaffsalaryrecord' && !payload.get('staffid')) {
        const body = document.getElementById('hrm_table_body');
        const status = document.getElementById('hrm_table_status');
        if (body) body.innerHTML = `<tr><td colspan="${columns.length}" class="text-center opacity-70">Select a personnel to load staff salary records.</td></tr>`;
        if (status) status.textContent = 'Showing 0 to 0 of 0 records';
        hrmSetSummaryValues(['0', '0', '0', '0']);
        return;
    }
    if (route === 'pp_viewmonthlysalaryschedule' && (!hrmNormalizePersonnelValue(payload.get('month')) || !hrmNormalizePersonnelValue(payload.get('year')))) {
        const body = document.getElementById('hrm_table_body');
        const status = document.getElementById('hrm_table_status');
        if (body) body.innerHTML = `<tr><td colspan="${columns.length}" class="text-center opacity-70">Select month and year, then fetch monthly salary schedule.</td></tr>`;
        if (status) status.textContent = 'Showing 0 to 0 of 0 records';
        hrmSetSummaryValues(['0', '0', '0', '0', '-', '-']);
        return;
    }

    await hrmEnsureHtgDisplayLookups(route);
    const result = await hrmRequestController(loadController, payload, button);

    if (!result.ok || result?.data?.status === false) {
        notification(hrmResultErrorMessage(result, `Unable to load data from ${loadController}`), 0);
        hrmRenderRows(columns, [], route);
        return;
    }

    if (typeof result.data === 'string' && result.data.includes('<tr')) {
        if (hrmHtgActionRoutes.has(route)) {
            const parsedRows = hrmParseHtmlRowsByRoute(result.data, route);
            if (parsedRows.length) {
                hrmRenderRows(columns, parsedRows, route);
                return;
            }
        }
        const body = document.getElementById('hrm_table_body');
        if (body) body.innerHTML = result.data;
        const noRecordCell = body ? body.querySelector('td[colspan]') : null;
        const looksLikeNoRecord = noRecordCell ? /no records?|no data|no .*found/i.test(String(noRecordCell.textContent || '')) : false;
        const rowCount = body && !looksLikeNoRecord ? body.querySelectorAll('tr').length : 0;
        hrmSetSummaryValues([`${rowCount}`, `${rowCount}`, '0', '0']);
        return;
    }

    if (route === 'pp_level') {
        const rows = hrmNormalizeLevelRows(result.data);
        hrmRenderLevelRows(rows, columns);
        return;
    }
    if (route === 'pp_viewpersonnel' || route === 'pp_personnel') {
        const rows = hrmNormalizePersonnelRows(result.data);
        hrmRenderPersonnelRows(rows, columns);
        return;
    }
    if (route === 'pp_approvepersonnel') {
        const rows = hrmFilterApprovePersonnelRows(hrmNormalizePersonnelRows(result.data), filterForm);
        hrmRenderApprovePersonnelRows(rows, columns);
        return;
    }
    if (route === 'pp_personnelhistory') {
        const root = hrmNormalizePersonnelHistoryRoot(result.data);
        hrmRenderPersonnelHistoryRows(root, columns);
        return;
    }

    const extractedRows = hrmExtractRowsFromResponse(result.data);
    const rows = hrmHtgSubrecordRoutes.has(route)
        ? hrmNormalizeSubrecordRows(route, extractedRows)
        : extractedRows;
    hrmRenderRows(columns, rows, route);
}

function hrmBindWorkspaceControls(route, blueprint) {
    const form = document.getElementById('hrm_entry_form');
    const filterForm = document.getElementById('hrm_filter_form');
    const saveButton = document.getElementById('hrm_save_btn');
    const resetButton = document.getElementById('hrm_reset_btn');
    const filterButton = document.getElementById('hrm_filter_btn');
    const filterResetButton = document.getElementById('hrm_filter_reset_btn');
    const batchActions = document.getElementById('hrm_batch_actions');
    const tableBatchActions = document.getElementById('hrm_table_batch_actions');
    const tableBody = document.getElementById('hrm_table_body');
    const personnelOnlyFilter = hrmIsPersonnelOnlyFilter(blueprint?.filters || []);
    const autoLoadFromPersonnelFilter = async () => hrmLoadViewData(route, blueprint, null, filterForm);
    hrmTogglePersonnelHistoryLayout(route === 'pp_personnelhistory');

    if (saveButton) {
        saveButton.onclick = async () => {
            let payloadMode = 'save';
            try {
                const saveController = hrmResolveControllerName(route, 'save');
                const validation = hrmValidateEntryForm(form, blueprint);
                if (!validation.valid) {
                    notification(`Please complete required field(s): ${validation.missing.join(', ')}`, 0);
                    return;
                }
                if (hrmHtgPayloadRoutes.has(route) && form?.querySelector('[name="id"]')?.value) {
                    payloadMode = 'update';
                }
                let payload = hrmBuildPayloadFromForm(form, route, payloadMode);
                if (route === 'pp_level') {
                    payload.delete('module');
                    payload.delete('mode');
                    if (hrmLevelEditingId) payload.append('id', hrmLevelEditingId);
                    hrmCollectLevelLines(payload);
                }
                if (route === 'pp_personnel') {
                    const mode = form?.querySelector('[name="id"]')?.value ? 'update' : 'save';
                    payloadMode = mode;
                    payload = hrmBuildPersonnelPayload(form, mode);
                }
                const result = await hrmRequestController(saveController, payload, saveButton);
                if (!hrmHasControllerResponse(result)) {
                    notification(`No response was returned from ${saveController}`, 0);
                    return;
                }
                if (!hrmIsControllerSuccess(result)) {
                    const failedLabel = payloadMode === 'update' ? 'Update' : 'Submit';
                    notification(hrmResultErrorMessage(result, `${failedLabel} failed on ${saveController}`), 0);
                    return;
                }
                const successLabel = payloadMode === 'update' ? 'updated' : 'submitted';
                notification(hrmResultSuccessMessage(result, `Code 200: Record ${successLabel} successfully`), 1);
                if (Array.isArray(blueprint?.fields) && blueprint.fields.length > 0) {
                    hrmResetFormState(form, saveButton);
                }
                if (route === 'pp_level') {
                    hrmLevelEditingId = '';
                    hrmRenderLevelLineEditors([], []);
                }
                if (route === 'pp_personnel') {
                    const levelControl = document.getElementById('levelid');
                    const departmentControl = document.getElementById('departmentid');
                    if (hrmTomSelectInstances.levelid) {
                        hrmTomSelectInstances.levelid.clear(true);
                    } else if (levelControl) {
                        levelControl.value = '';
                    }
                    if (hrmTomSelectInstances.departmentid) {
                        hrmTomSelectInstances.departmentid.clear(true);
                    } else if (departmentControl) {
                        departmentControl.value = '';
                    }
                    const basicSalaryControl = document.getElementById('basicsalary');
                    const idControl = document.getElementById('id');
                    if (basicSalaryControl) basicSalaryControl.value = '';
                    if (idControl) idControl.value = '';
                }
                await hrmLoadViewData(route, blueprint);
            } catch (error) {
                const failedLabel = payloadMode === 'update' ? 'update' : 'submit';
                notification(`Unable to ${failedLabel} record: ${error?.message || 'Unknown error'}`, 0);
            }
        };
    }
    if (resetButton) {
        resetButton.onclick = () => {
            hrmResetFormState(form, saveButton);
            if (route === 'pp_level') {
                hrmLevelEditingId = '';
                hrmRenderLevelLineEditors([], []);
            }
            if (route === 'pp_personnel') {
                if (hrmTomSelectInstances.levelid) hrmTomSelectInstances.levelid.clear(true);
                if (hrmTomSelectInstances.departmentid) hrmTomSelectInstances.departmentid.clear(true);
            }
        };
    }
    if (filterButton) {
        const filterLabel = filterButton.querySelector('span:last-child');
        if (filterLabel) filterLabel.textContent = route === 'pp_viewmonthlysalaryschedule' ? 'Fetch' : 'Filter';
        if (route === 'pp_personnelhistory' || personnelOnlyFilter) {
            filterButton.classList.add('hidden');
            filterButton.disabled = true;
            filterButton.onclick = null;
        } else {
            filterButton.classList.remove('hidden');
            filterButton.disabled = false;
            filterButton.onclick = async () => hrmLoadViewData(route, blueprint, filterButton, filterForm);
        }
    }
    if (filterResetButton) filterResetButton.onclick = async () => {
        filterForm?.reset();
        hrmClearTomSelectsWithin(filterForm);
        await hrmLoadViewData(route, blueprint);
    };
    if (personnelOnlyFilter) {
        const personnelFilterControl = document.getElementById('hrm_filter_personnel');
        if (personnelFilterControl) personnelFilterControl.onchange = autoLoadFromPersonnelFilter;
    }
    if (batchActions) batchActions.innerHTML = '';
    if (tableBatchActions) {
        tableBatchActions.innerHTML = '';
        tableBatchActions.classList.add('hidden');
    }
    if (route === 'pp_approvepersonnel') {
        const targetBatchActions = tableBatchActions || batchActions;
        if (targetBatchActions) {
            targetBatchActions.classList.remove('hidden');
            hrmRenderApprovePersonnelBatchActions(targetBatchActions, blueprint);
        }
    }
    if (tableBody) {
        tableBody.onclick = (event) => {
            if (route === 'pp_approvepersonnel') {
                if (event.target.closest('.hrm-approve-personnel-checkbox')) {
                    hrmRefreshApprovePersonnelSelectionSummary();
                    return;
                }
                const rowRecord = (trigger) => {
                    const raw = decodeURIComponent(trigger?.getAttribute('data-hrm-personnel-record') || '');
                    try {
                        return raw ? JSON.parse(raw) : {};
                    } catch (error) {
                        return {};
                    }
                };
                const viewTrigger = event.target.closest('[data-hrm-approve-personnel-view]');
                if (viewTrigger) {
                    hrmOpenPersonnelModal(rowRecord(viewTrigger));
                    return;
                }
                const editTrigger = event.target.closest('[data-hrm-approve-personnel-edit]');
                if (editTrigger) {
                    const entry = rowRecord(editTrigger);
                    if (typeof routerEvent === 'function') {
                        sessionStorage.setItem('hrm_personnel_edit_record', JSON.stringify(entry));
                        routerEvent('pp_personnel');
                    } else {
                        notification('Unable to open Personnel for edit', 0);
                    }
                    return;
                }
            }
            if (route === 'pp_viewpersonnel' || route === 'pp_personnel') {
                const rowRecord = (trigger) => {
                    const raw = decodeURIComponent(trigger?.getAttribute('data-hrm-personnel-record') || '');
                    try {
                        return raw ? JSON.parse(raw) : {};
                    } catch (error) {
                        return {};
                    }
                };
                const viewTrigger = event.target.closest('[data-hrm-personnel-view]');
                if (viewTrigger) {
                    const entry = rowRecord(viewTrigger);
                    hrmOpenPersonnelModal(entry);
                    return;
                }
                const editTrigger = event.target.closest('[data-hrm-personnel-edit]');
                if (editTrigger) {
                    const entry = rowRecord(editTrigger);
                    if (route === 'pp_personnel') {
                        const editRecord = hrmMapPersonnelEntryToForm(entry);
                        Promise.resolve(hrmPopulatePersonnelLevelPicker()).finally(async () => {
                            hrmEnterEditMode(editRecord, saveButton);
                            if (editRecord?.nationality) await hrmPopulateStates(editRecord.nationality);
                            if (editRecord?.state) await hrmPopulateCities(editRecord.nationality, editRecord.state);
                            const levelControl = document.getElementById('levelid');
                            if (hrmTomSelectInstances.levelid && levelControl?.value) {
                                hrmTomSelectInstances.levelid.setValue(levelControl.value, true);
                            }
                            const departmentControl = document.getElementById('departmentid');
                            if (hrmTomSelectInstances.departmentid && departmentControl?.value) {
                                hrmTomSelectInstances.departmentid.setValue(departmentControl.value, true);
                            }
                        });
                    } else if (typeof routerEvent === 'function') {
                        sessionStorage.setItem('hrm_personnel_edit_record', JSON.stringify(entry));
                        routerEvent('pp_personnel');
                    } else {
                        notification('Unable to open Personnel for edit', 0);
                    }
                    return;
                }
            }
            if (route === 'pp_level') {
                const deleteTrigger = event.target.closest('[data-hrm-level-delete]');
                if (deleteTrigger) {
                    const id = deleteTrigger.getAttribute('data-hrm-level-delete');
                    if (id) {
                        const deleteController = hrmResolveControllerName(route, 'delete');
                        const payload = new FormData();
                        payload.append('id', id);
                        hrmRequestController(deleteController, payload).then(async (result) => {
                            if (!result.ok || result?.data?.status === false) {
                                notification(hrmResultErrorMessage(result, `Delete failed on ${deleteController}`), 0);
                                return;
                            }
                            notification('Level deleted successfully', 1);
                            await hrmLoadViewData(route, blueprint);
                        });
                    }
                    return;
                }

                const editLevelTrigger = event.target.closest('[data-hrm-level-edit]');
                if (editLevelTrigger) {
                    let record = {};
                    const raw = decodeURIComponent(editLevelTrigger.getAttribute('data-hrm-level-record') || '');
                    try {
                        record = raw ? JSON.parse(raw) : {};
                    } catch (error) {}
                    hrmLevelEditingId = record?.level?.id || '';
                    const levelControl = document.getElementById('level');
                    const basicSalaryControl = document.getElementById('basicsalary');
                    if (levelControl) levelControl.value = record?.level?.level || '';
                    if (basicSalaryControl) basicSalaryControl.value = record?.level?.basicsalary || '';
                    const structure = Array.isArray(record?.salarystructure) ? record.salarystructure : [];
                    const allowances = structure.filter((item) => item?.salaryinfotype === 'ALLOWANCE');
                    const deductions = structure.filter((item) => item?.salaryinfotype === 'DEDUCTION');
                    hrmRenderLevelLineEditors(allowances, deductions);
                    hrmSetActiveTab('input');
                    window.hrmNavigateToInput({ level: record?.level?.level || '', basicsalary: record?.level?.basicsalary || '' });
                    return;
                }
            }

            const parseRouteRecord = (trigger) => {
                const rawRecord = trigger?.dataset?.hrmRecord || '';
                try {
                    return rawRecord ? JSON.parse(decodeURIComponent(rawRecord)) : {};
                } catch (error) {
                    return {};
                }
            };

            const viewTrigger = event.target.closest('[data-hrm-view]');
            if (viewTrigger) {
                hrmOpenRecordDetailModal(route, parseRouteRecord(viewTrigger), blueprint);
                return;
            }

            const deleteTrigger = event.target.closest('[data-hrm-delete]');
            if (deleteTrigger) {
                hrmDeleteRouteRecord(route, parseRouteRecord(deleteTrigger), blueprint, deleteTrigger);
                return;
            }

            const editTrigger = event.target.closest('[data-hrm-edit]');
            if (editTrigger) {
                const payload = hrmMapRouteRecordToForm(route, parseRouteRecord(editTrigger));
                hrmEnterEditMode(payload, saveButton);
            }
        };
    }

    document.querySelectorAll('.hrm-export-btn').forEach((button) => {
        button.title = button.title || `${button.textContent.trim()} records`;
        button.onclick = () => {
            const exportType = button.dataset.export || 'export';
            if (exportType === 'print') window.print();
            if (exportType !== 'print') notification(`${exportType.toUpperCase()} export button is ready. Data export will run after controller wiring.`, 1);
        };
    });

    if (route !== 'pp_approvepersonnel') {
        (blueprint.actions || []).forEach((label) => {
            if (!batchActions) return;
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn hrm-ui-action';
            button.dataset.hrmAction = label;
            button.title = label;
            button.innerHTML = `<span>${label}</span>`;
            button.onclick = async () => {
                const saveController = hrmResolveControllerName(route, 'save');
                const payload = hrmBuildPayloadFromForm(form, route, label.toLowerCase().replace(/\s+/g, '_'));
                payload.append('action', label);
                const result = await hrmRequestController(saveController, payload, button);
                if (!result.ok || result?.data?.status === false) {
                    notification(hrmResultErrorMessage(result, `${label} failed on ${saveController}`), 0);
                    return;
                }
                notification(`${label} completed`, 1);
                await hrmLoadViewData(route, blueprint);
            };
            batchActions.appendChild(button);
        });
    }

    if (route === 'pp_level') {
        const addAllowanceButton = document.getElementById('hrm_level_add_allowance');
        const addDeductionButton = document.getElementById('hrm_level_add_deduction');
        if (addAllowanceButton) addAllowanceButton.onclick = () => hrmAddLevelLine('ALLOWANCE');
        if (addDeductionButton) addDeductionButton.onclick = () => hrmAddLevelLine('DEDUCTION');
        const sectionsContainer = document.getElementById('hrm_dynamic_sections');
        if (sectionsContainer) {
            sectionsContainer.onclick = (event) => {
                const removeButton = event.target.closest('.hrm-level-remove-line');
                if (!removeButton) return;
                const row = removeButton.closest('.hrm-level-line');
                if (row) row.remove();
            };
        }
    }

    if (route === 'pp_personnel') {
        const levelPickerLoad = hrmPopulatePersonnelLevelPicker();
        const departmentPickerLoad = hrmPopulateDynamicSelect('departmentid', 'departments');
        hrmBindPersonnelLookupBehavior();
        const editRecordRaw = sessionStorage.getItem('hrm_personnel_edit_record');
        if (editRecordRaw) {
            try {
                const editEntry = JSON.parse(editRecordRaw);
                const editRecord = hrmMapPersonnelEntryToForm(editEntry);
                Promise.allSettled([levelPickerLoad, departmentPickerLoad]).finally(() => {
                    (async () => {
                        hrmEnterEditMode(editRecord, saveButton);
                        if (editRecord?.nationality) await hrmPopulateStates(editRecord.nationality);
                        if (editRecord?.state) await hrmPopulateCities(editRecord.nationality, editRecord.state);
                        const levelControl = document.getElementById('levelid');
                        if (hrmTomSelectInstances.levelid && levelControl?.value) {
                            hrmTomSelectInstances.levelid.setValue(levelControl.value, true);
                        }
                        const departmentControl = document.getElementById('departmentid');
                        if (hrmTomSelectInstances.departmentid && departmentControl?.value) {
                            hrmTomSelectInstances.departmentid.setValue(departmentControl.value, true);
                        }
                        notification('Personnel record loaded for edit', 1);
                    })();
                });
            } catch (error) {}
            sessionStorage.removeItem('hrm_personnel_edit_record');
        }
    }
    if (route === 'pp_personnelhistory') {
        hrmPopulatePersonnelHistoryFilterPicker(route, blueprint, filterForm);
    }
    if (route !== 'pp_personnel') {
        hrmPopulateRouteDynamicSelectors(blueprint);
    }
    if (personnelOnlyFilter) {
        setTimeout(() => {
            const personnelFilterControl = document.getElementById('hrm_filter_personnel');
            if (personnelFilterControl) personnelFilterControl.onchange = autoLoadFromPersonnelFilter;
            const picker = hrmTomSelectInstances.hrm_filter_personnel;
            if (picker && typeof picker.on === 'function') {
                picker.on('change', () => { autoLoadFromPersonnelFilter(); });
            }
        }, 300);
    }

    hrmLoadViewData(route, blueprint);
}
