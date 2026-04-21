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
        title: 'Add Personnel',
        subtitle: 'Capture personnel bio-data and compensation context for onboarding.',
        flow: ['Select department/level', 'Capture personnel profile details', 'Submit for approval queue'],
        controllers: [
            { name: 'fetchpersonnels.php', purpose: 'Retrieve personnel list' },
            { name: 'personnelscript.php', purpose: 'Create or update personnel record' },
            { name: 'personnelapprovals.php', purpose: 'Submit to personnel approval pipeline' },
            { name: 'fetchdepartment.php', purpose: 'Load department options' },
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

const hrmCommonFilters = [
    { id: 'search', label: 'Search', type: 'text', placeholder: 'Name, staff ID, reference' },
    { id: 'department', label: 'Department', type: 'select', options: ['All Departments'] },
    { id: 'startdate', label: 'Start Date', type: 'date' },
    { id: 'enddate', label: 'End Date', type: 'date' }
];

const hrmHiddenFrontendFields = new Set(['accountnumber', 'bankaccountnumber2', 'bankname2']);

const hrmHtgControllerRouting = {
    pp_level: { load: 'fetchlevel.php', save: 'level.php', filter: 'fetchlevel.php', delete: 'removelevel.php' },
    pp_personnel: { load: 'fetchpersonnels.php', save: 'personnelscript.php', filter: 'fetchpersonnels.php' },
    pp_approvepersonnel: { load: 'approvepersonnel.php', save: 'approvepersonnel.php', filter: 'approvepersonnel.php' },
    pp_viewpersonnel: { load: 'viewpersonnel.php', save: 'personnel.php', filter: 'viewpersonnel.php' },
    pp_personnelhistory: { load: 'personnelhistory.php', save: 'personnelhistory.php', filter: 'personnelhistory.php' },
    pp_guarantor: { load: 'guarantor.php', save: 'guarantor.php', filter: 'guarantor.php' },
    pp_employerrecord: { load: 'employerrecord.php', save: 'employerrecord.php', filter: 'employerrecord.php' },
    pp_referees: { load: 'referees.php', save: 'referees.php', filter: 'referees.php' },
    pp_qualification: { load: 'qualificationn.php', save: 'qualificationn.php', filter: 'qualificationn.php' },
    pp_parentsguardians: { load: 'parentsguardians.php', save: 'parentsguardians.php', filter: 'parentsguardians.php' },
    pp_query: { load: 'query.php', save: 'query.php', filter: 'query.php' },
    pp_promotions: { load: 'promotions.php', save: 'promotions.php', filter: 'promotions.php' },
    pp_termination: { load: 'termination.php', save: 'termination.php', filter: 'termination.php' },
    pp_suspension: { load: 'suspension.php', save: 'suspension.php', filter: 'suspension.php' },
    pp_leave: { load: 'leave.php', save: 'leave.php', filter: 'leave.php' },
    pp_warning: { load: 'warning.php', save: 'warning.php', filter: 'warning.php' },
    pp_monitorevaluation: { load: 'monitorevaluation.php', save: 'monitorevaluation.php', filter: 'monitorevaluation.php' },
    pp_advance: { load: 'advance.php', save: 'advance.php', filter: 'advance.php' },
    pp_viewstaffadvance: { load: 'viewstaffadvance.php', save: 'viewstaffadvance.php', filter: 'viewstaffadvance.php' },
    pp_personalstaffsalaryrecord: { load: 'personalstaffsalaryrecord.php', save: 'personalstaffsalaryrecord.php', filter: 'personalstaffsalaryrecord.php' },
    pp_viewmonthlysalaryschedule: { load: 'viewmonthlysalaryschedule.php', save: 'viewmonthlysalaryschedule.php', filter: 'viewmonthlysalaryschedule.php' },
    pp_presalaryapproval: { load: 'presalaryapproval.php', save: 'presalaryapproval.php', filter: 'presalaryapproval.php' },
    pp_confirmsalary: { load: 'confirmsalary.php', save: 'confirmsalary.php', filter: 'confirmsalary.php' },
    pp_payrollclassa: { load: 'payrollclassa.php', save: 'payrollclassa.php', filter: 'payrollclassa.php' },
    pp_payrollclassb: { load: 'payrollclassb.php', save: 'payrollclassb.php', filter: 'payrollclassb.php' }
};

let hrmLevelEditingId = '';
const hrmTomSelectInstances = {};
let hrmTomSelectAssetsPromise = null;
const hrmPersonnelLevelMetaById = {};

const hrmMatterFields = {
    pp_query: [
        { id: 'personnel', label: 'Personnel', type: 'text', list: 'hrm_personnel_list', required: true },
        { id: 'querydate', label: 'Query Date', type: 'date', required: true },
        { id: 'subject', label: 'Subject', type: 'text', required: true },
        { id: 'severity', label: 'Severity', type: 'select', options: ['LOW', 'MEDIUM', 'HIGH'] },
        { id: 'description', label: 'Query Details', type: 'textarea' },
        { id: 'attachment', label: 'Attachment', type: 'file' }
    ],
    pp_promotions: [
        { id: 'personnel', label: 'Personnel', type: 'text', list: 'hrm_personnel_list', required: true },
        { id: 'currentlevel', label: 'Current Level', type: 'text', readonly: true },
        { id: 'newlevel', label: 'New Level', type: 'text', list: 'hrm_level_list', required: true },
        { id: 'effectivedate', label: 'Effective Date', type: 'date', required: true },
        { id: 'newsalary', label: 'New Basic Salary', type: 'number' },
        { id: 'remark', label: 'Remark', type: 'textarea' }
    ],
    pp_termination: [
        { id: 'personnel', label: 'Personnel', type: 'text', list: 'hrm_personnel_list', required: true },
        { id: 'exit_type', label: 'Exit Type', type: 'select', options: ['TERMINATION', 'RESIGNATION', 'RETIREMENT'] },
        { id: 'effectivedate', label: 'Effective Date', type: 'date', required: true },
        { id: 'reason', label: 'Reason', type: 'textarea' },
        { id: 'finalentitlement', label: 'Final Entitlement', type: 'number' },
        { id: 'attachment', label: 'Attachment', type: 'file' }
    ],
    pp_suspension: [
        { id: 'personnel', label: 'Personnel', type: 'text', list: 'hrm_personnel_list', required: true },
        { id: 'startdate', label: 'Start Date', type: 'date', required: true },
        { id: 'enddate', label: 'End Date', type: 'date', required: true },
        { id: 'status', label: 'Status', type: 'select', options: ['ACTIVE', 'LIFTED'] },
        { id: 'reason', label: 'Reason', type: 'textarea' },
        { id: 'attachment', label: 'Attachment', type: 'file' }
    ],
    pp_leave: [
        { id: 'personnel', label: 'Personnel', type: 'text', list: 'hrm_personnel_list', required: true },
        { id: 'leave_type', label: 'Leave Type', type: 'select', options: ['ANNUAL', 'SICK', 'MATERNITY', 'COMPASSIONATE', 'UNPAID'] },
        { id: 'startdate', label: 'Start Date', type: 'date', required: true },
        { id: 'enddate', label: 'End Date', type: 'date', required: true },
        { id: 'resumptiondate', label: 'Resumption Date', type: 'date' },
        { id: 'remark', label: 'Remark', type: 'textarea' }
    ],
    pp_warning: [
        { id: 'personnel', label: 'Personnel', type: 'text', list: 'hrm_personnel_list', required: true },
        { id: 'warningdate', label: 'Warning Date', type: 'date', required: true },
        { id: 'warning_type', label: 'Warning Type', type: 'select', options: ['VERBAL', 'WRITTEN', 'FINAL'] },
        { id: 'subject', label: 'Subject', type: 'text' },
        { id: 'details', label: 'Details', type: 'textarea' },
        { id: 'attachment', label: 'Attachment', type: 'file' }
    ],
    pp_monitorevaluation: [
        { id: 'personnel', label: 'Personnel', type: 'text', list: 'hrm_personnel_list', required: true },
        { id: 'evaluationdate', label: 'Evaluation Date', type: 'date', required: true },
        { id: 'score', label: 'Score', type: 'number' },
        { id: 'reviewer', label: 'Reviewer', type: 'text' },
        { id: 'metric', label: 'Metric', type: 'text' },
        { id: 'comment', label: 'Comment', type: 'textarea' }
    ],
    pp_advance: [
        { id: 'personnel', label: 'Personnel', type: 'text', list: 'hrm_personnel_list', required: true },
        { id: 'level', label: 'Level', type: 'text', list: 'hrm_level_list' },
        { id: 'amount', label: 'Advance Amount', type: 'number', required: true },
        { id: 'repaymentmonth', label: 'Repayment Months', type: 'number' },
        { id: 'startmonth', label: 'Start Month', type: 'month' },
        { id: 'remark', label: 'Remark', type: 'textarea' }
    ]
};

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
            { id: 'search', label: 'Search', type: 'text', placeholder: 'Staff name or ID' },
            { id: 'department', label: 'Department', type: 'text', list: 'hrm_department_list' },
            { id: 'status', label: 'Approval Status', type: 'select', options: ['PENDING', 'APPROVED', 'DECLINED'] }
        ],
        actions: ['Approve Selected', 'Decline Selected'],
        columns: ['Select', 'S/N', 'Staff ID', 'Name', 'Department', 'Level', 'Basic Salary', 'Status', 'Action'],
        summary: ['Pending', 'Approved Today', 'Declined Today', 'Total Queue']
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
            { id: 'personnel', label: 'Personnel', type: 'text', list: 'hrm_personnel_list' },
            { id: 'department', label: 'Department', type: 'text', list: 'hrm_department_list' },
            { id: 'eventtype', label: 'Event Type', type: 'select', options: ['All Events', 'LEVEL CHANGE', 'PROMOTION', 'QUERY', 'LEAVE', 'PAYROLL'] },
            { id: 'startdate', label: 'Start Date', type: 'date' },
            { id: 'enddate', label: 'End Date', type: 'date' }
        ],
        columns: ['S/N', 'Staff ID', 'Name', 'Event Type', 'Previous Value', 'New Value', 'Entry Date', 'Action'],
        summary: ['Events', 'Promotions', 'Disciplinary', 'Payroll Changes']
    },
    pp_guarantor: {
        context: 'Guarantor records',
        fields: [
            { id: 'personnel', label: 'Personnel', type: 'text', list: 'hrm_personnel_list', required: true },
            { id: 'guarantorname', label: 'Guarantor Name', type: 'text', required: true },
            { id: 'relationship', label: 'Relationship', type: 'text' },
            { id: 'phone', label: 'Phone', type: 'tel' },
            { id: 'email', label: 'Email', type: 'email' },
            { id: 'occupation', label: 'Occupation', type: 'text' },
            { id: 'address', label: 'Address', type: 'textarea' },
            { id: 'attachment', label: 'Attachment', type: 'file' }
        ],
        filters: hrmCommonFilters,
        columns: ['S/N', 'Staff Name', 'Guarantor', 'Relationship', 'Phone', 'Occupation', 'Action'],
        summary: ['Total Guarantors', 'With Attachment', 'Missing Phone', 'Updated This Month']
    },
    pp_employerrecord: {
        context: 'Previous employment records',
        fields: [
            { id: 'personnel', label: 'Personnel', type: 'text', list: 'hrm_personnel_list', required: true },
            { id: 'employer', label: 'Employer', type: 'text', required: true },
            { id: 'position', label: 'Position', type: 'text' },
            { id: 'startdate', label: 'Start Date', type: 'date' },
            { id: 'enddate', label: 'End Date', type: 'date' },
            { id: 'reasonforleaving', label: 'Reason For Leaving', type: 'textarea' }
        ],
        filters: hrmCommonFilters,
        columns: ['S/N', 'Staff Name', 'Employer', 'Position', 'Start Date', 'End Date', 'Action'],
        summary: ['Records', 'Current Employers', 'Past Employers', 'Updated This Month']
    },
    pp_referees: {
        context: 'Referee records',
        fields: [
            { id: 'personnel', label: 'Personnel', type: 'text', list: 'hrm_personnel_list', required: true },
            { id: 'refereename', label: 'Referee Name', type: 'text', required: true },
            { id: 'relationship', label: 'Relationship', type: 'text' },
            { id: 'phone', label: 'Phone', type: 'tel' },
            { id: 'email', label: 'Email', type: 'email' },
            { id: 'address', label: 'Address', type: 'textarea' }
        ],
        filters: hrmCommonFilters,
        columns: ['S/N', 'Staff Name', 'Referee', 'Relationship', 'Phone', 'Email', 'Action'],
        summary: ['Referees', 'Complete Records', 'Missing Email', 'Updated This Month']
    },
    pp_qualification: {
        context: 'Qualification records',
        fields: [
            { id: 'personnel', label: 'Personnel', type: 'text', list: 'hrm_personnel_list', required: true },
            { id: 'qualification', label: 'Qualification', type: 'text', required: true },
            { id: 'institution', label: 'Institution', type: 'text' },
            { id: 'course', label: 'Course', type: 'text' },
            { id: 'yearobtained', label: 'Year Obtained', type: 'number' },
            { id: 'attachment', label: 'Certificate', type: 'file' }
        ],
        filters: hrmCommonFilters,
        columns: ['S/N', 'Staff Name', 'Qualification', 'Institution', 'Course', 'Year', 'Action'],
        summary: ['Qualifications', 'With Certificate', 'Professional', 'Academic']
    },
    pp_parentsguardians: {
        context: 'Parent and guardian records',
        fields: [
            { id: 'personnel', label: 'Personnel', type: 'text', list: 'hrm_personnel_list', required: true },
            { id: 'guardianname', label: 'Parent/Guardian Name', type: 'text', required: true },
            { id: 'relationship', label: 'Relationship', type: 'text' },
            { id: 'phone', label: 'Phone', type: 'tel' },
            { id: 'email', label: 'Email', type: 'email' },
            { id: 'address', label: 'Address', type: 'textarea' }
        ],
        filters: hrmCommonFilters,
        columns: ['S/N', 'Staff Name', 'Parent/Guardian', 'Relationship', 'Phone', 'Email', 'Action'],
        summary: ['Guardians', 'Emergency Contacts', 'Missing Phone', 'Updated This Month']
    },
    pp_viewstaffadvance: {
        context: 'Advance report',
        fields: [],
        filters: [
            { id: 'personnel', label: 'Personnel', type: 'text', list: 'hrm_personnel_list' },
            { id: 'month', label: 'Month', type: 'month' },
            { id: 'status', label: 'Status', type: 'select', options: ['All Status', 'OPEN', 'PAID', 'CANCELLED'] }
        ],
        columns: ['S/N', 'Staff ID', 'Name', 'Advance Amount', 'Paid', 'Balance', 'Status', 'Action'],
        summary: ['Total Advance', 'Recovered', 'Outstanding', 'Open Records']
    },
    pp_personalstaffsalaryrecord: {
        context: 'Staff salary staging',
        fields: [
            { id: 'personnel', label: 'Personnel', type: 'text', list: 'hrm_personnel_list', required: true },
            { id: 'month', label: 'Salary Month', type: 'month', required: true },
            { id: 'basicsalary', label: 'Basic Salary', type: 'number' },
            { id: 'allowance', label: 'Allowance', type: 'number' },
            { id: 'deduction', label: 'Deduction', type: 'number' },
            { id: 'netpay', label: 'Net Pay', type: 'number', readonly: true }
        ],
        filters: [{ id: 'personnel', label: 'Personnel', type: 'text', list: 'hrm_personnel_list' }, { id: 'month', label: 'Month', type: 'month' }],
        actions: ['Generate Salary Record'],
        columns: ['S/N', 'Staff ID', 'Name', 'Month', 'Basic Salary', 'Allowance', 'Deduction', 'Net Pay', 'Action'],
        summary: ['Gross Pay', 'Deductions', 'Net Pay', 'Records']
    },
    pp_viewmonthlysalaryschedule: {
        context: 'Approved salary schedule',
        fields: [],
        filters: [{ id: 'month', label: 'Month', type: 'month' }, { id: 'location', label: 'Location', type: 'text' }, { id: 'status', label: 'Status', type: 'select', options: ['APPROVED', 'PAID'] }],
        columns: ['Select', 'S/N', 'Staff ID', 'Name', 'Basic Salary', 'Allowance', 'Deduction', 'Net Pay', 'Status'],
        summary: ['Total Basic', 'Total Allowance', 'Total Deduction', 'Total Net Pay']
    },
    pp_presalaryapproval: {
        context: 'Payroll processing',
        fields: [],
        filters: [{ id: 'month', label: 'Month', type: 'month' }, { id: 'department', label: 'Department', type: 'text', list: 'hrm_department_list' }],
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
    hrmInterfaceBlueprints[route] = {
        context: `${hrmInterfaceRegistry[route].title} records`,
        fields: hrmMatterFields[route],
        filters: hrmCommonFilters.concat([{ id: 'status', label: 'Status', type: 'select', options: ['All Status', 'OPEN', 'CLOSED', 'APPROVED'] }]),
        columns: ['S/N', 'Staff ID', 'Name', 'Matter Type', 'Effective Date', 'Status', 'Attachment', 'Action'],
        summary: ['Total Records', 'Open', 'Closed', 'Updated This Month']
    };
});

function hrmWorkspaceActive() {
    const route = new URLSearchParams(window.location.search).get('r') || '';
    const config = hrmInterfaceRegistry[route];
    if (!config) return;

    const blueprint = hrmInterfaceBlueprints[route] || buildDefaultHrmBlueprint(route, config);
    const fields = blueprint.fields || [];
    const filters = blueprint.filters || hrmCommonFilters;
    const sections = blueprint.sections || [];
    const hasEntrySection = fields.length > 0 || sections.length > 0;
    const hasFilters = filters.length > 0;
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
    hrmSetActiveTab((hasEntrySection && hasViewSection) ? 'input' : 'view');

    hrmRenderFields('hrm_entry_grid', fields);
    hrmRenderFilters(filters);
    hrmRenderDynamicSections(blueprint.sections || [], route);
    hrmRenderSummary(blueprint.summary || ['Records', 'Pending', 'Approved', 'Updated']);
    hrmRenderTable(blueprint.columns || ['S/N', 'Name', 'Status', 'Action'], config.title);
    hrmBindWorkspaceControls(route, blueprint);
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
    });
}

window.hrmNavigateToInput = function(record = {}) {
    const inputPane = document.getElementById('hrm_input_tabpane');
    if (inputPane?.classList.contains('hidden')) {
        notification('Input form is not available on this interface.', 0);
        return;
    }
    hrmSetActiveTab('input');
    hrmPopulateEntryForm(record);
};

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

function hrmRenderFilters(fields) {
    const filterFields = fields.map((field) => ({
        ...field,
        id: `hrm_filter_${field.id}`,
        name: field.name || field.id
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
                <td>${level?.basicsalary ?? ''}</td>
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
                    ['Status', personnel.status],
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
                    ['Basic Salary', personnel.basicsalary],
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
                <td>${personnel?.status ?? '-'}</td>
                <td>
                    <div class="flex flex-wrap gap-2">
                        <button type="button" class="btn hrm-ui-action" data-hrm-personnel-view="${personnel?.id || ''}" data-hrm-personnel-record="${rowPayload}" title="View personnel" style="background:#0f766e;color:#fff;min-width:38px;padding:6px 10px;"><span class="material-symbols-outlined" style="font-size:16px;line-height:1;">visibility</span></button>
                        <button type="button" class="btn hrm-ui-action" data-hrm-personnel-edit="${personnel?.id || ''}" data-hrm-personnel-record="${rowPayload}" title="Edit personnel" style="background:#2563eb;color:#fff;min-width:38px;padding:6px 10px;"><span class="material-symbols-outlined" style="font-size:16px;line-height:1;">edit</span></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    const activeCount = rows.filter((entry) => String(entry?.personnel?.status || '').toUpperCase() === 'APPROVED').length;
    const suspendedCount = rows.filter((entry) => String(entry?.personnel?.status || '').toUpperCase().includes('SUSP')).length;
    const terminatedCount = rows.filter((entry) => String(entry?.personnel?.status || '').toUpperCase().includes('TERM')).length;
    hrmSetSummaryValues([`${rows.length}`, `${activeCount}`, `${suspendedCount}`, `${terminatedCount}`]);
    if (status) status.textContent = `Showing 1 to ${rows.length} of ${rows.length} records`;
}

function hrmBuildControl(field) {
    if (hrmHiddenFrontendFields.has((field?.id || '').toLowerCase())) return '';

    const required = field.required ? 'required' : '';
    const readonly = field.readonly ? 'readonly' : '';
    const list = field.list ? `list="${field.list}"` : '';
    const placeholder = field.placeholder ? `placeholder="${field.placeholder}"` : '';
    const name = field.name || field.id;

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
            <div class="form-group">
                <label class="control-label" for="${field.id}">${field.label}</label>
                <select id="${field.id}" name="${name}" class="form-control" ${required} ${tomSelectFlag}>
                    <option value="">-- select ${field.label.toLowerCase()} --</option>
                    ${optionMarkup}
                </select>
            </div>
        `;
    }

    if (field.type === 'textarea') {
        return `
            <div class="form-group lg:col-span-2">
                <label class="control-label" for="${field.id}">${field.label}</label>
                <textarea id="${field.id}" name="${name}" class="form-control" rows="3" ${required} ${placeholder}></textarea>
            </div>
        `;
    }

    return `
        <div class="form-group">
            <label class="control-label" for="${field.id}">${field.label}</label>
            <input id="${field.id}" name="${name}" type="${field.type || 'text'}" class="form-control" ${list} ${required} ${readonly} ${placeholder}>
        </div>
    `;
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
    return hrmInterfaceRegistry[route]?.controllers?.[0]?.name || '';
}

function hrmControllerEndpoint(controllerName = '') {
    const normalized = String(controllerName || '').trim();
    if (!normalized) return '';
    return `../controllers/${normalized.replace(/\.php$/i, '')}`;
}

function hrmBuildPayloadFromForm(form, route, mode) {
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
    if (String(route || '').startsWith('pp_')) {
        payload.set('groupname', 'NAN');
        payload.set('groupid', '0');
    }
    if (route === 'pp_personnel') {
        const levelId = payload.get('levelid') || payload.get('level') || '';
        if (levelId) payload.set('levelid', levelId);
        if (!payload.get('departmentid')) payload.set('departmentid', '0');
        if (!payload.get('department')) payload.set('department', 'NAN');
    }
    return payload;
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
    append('departmentid', '0');
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

function hrmResultErrorMessage(result, fallback = 'Request failed') {
    if (typeof result?.data === 'string' && result.data.trim()) return result.data.trim();
    if (result?.data?.message) return String(result.data.message);
    if (result?.message) return String(result.message);
    if (typeof result?.raw === 'string' && result.raw.trim()) return result.raw.trim();
    return fallback;
}

function hrmExtractRowsFromResponse(responseData) {
    if (!responseData) return [];
    if (Array.isArray(responseData)) return responseData;
    if (Array.isArray(responseData?.data)) return responseData.data;
    if (Array.isArray(responseData?.result)) return responseData.result;
    if (Array.isArray(responseData?.records)) return responseData.records;
    return [];
}

function hrmRenderRows(columns, rows) {
    const body = document.getElementById('hrm_table_body');
    const status = document.getElementById('hrm_table_status');
    if (!body) return;

    if (!Array.isArray(rows) || rows.length === 0) {
        body.innerHTML = `<tr><td colspan="${columns.length}" class="text-center opacity-70">No records found.</td></tr>`;
        if (status) status.textContent = 'Showing 0 to 0 of 0 records';
        return;
    }

    body.innerHTML = rows.map((row, index) => {
        const objectRow = (row && typeof row === 'object') ? row : { value: row };
        const valueList = Object.values(objectRow);
        const cells = columns.map((column, cellIndex) => {
            if (String(column).toLowerCase() === 'action') {
                return `<td><button type="button" class="btn hrm-ui-action" data-hrm-edit="1" data-hrm-record='${JSON.stringify(objectRow).replace(/'/g, '&apos;')}'><span>Edit</span></button></td>`;
            }
            if (cellIndex === 0) return `<td>${index + 1}</td>`;
            const value = valueList[cellIndex - 1] ?? '';
            return `<td>${value}</td>`;
        }).join('');
        return `<tr>${cells}</tr>`;
    }).join('');

    if (status) status.textContent = `Showing 1 to ${rows.length} of ${rows.length} records`;
}

async function hrmLoadViewData(route, blueprint, button = null, filterForm = null) {
    const columns = blueprint.columns || ['S/N', 'Name', 'Status', 'Action'];
    const loadController = hrmResolveControllerName(route, filterForm ? 'filter' : 'load');
    const payload = hrmBuildPayloadFromForm(filterForm, route, filterForm ? 'filter' : 'load');
    const result = await hrmRequestController(loadController, payload, button);

    if (!result.ok || result?.data?.status === false) {
        notification(hrmResultErrorMessage(result, `Unable to load data from ${loadController}`), 0);
        hrmRenderRows(columns, []);
        return;
    }

    if (typeof result.data === 'string' && result.data.includes('<tr')) {
        const body = document.getElementById('hrm_table_body');
        if (body) body.innerHTML = result.data;
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

    const rows = hrmExtractRowsFromResponse(result.data);
    hrmRenderRows(columns, rows);
}

function hrmBindWorkspaceControls(route, blueprint) {
    const form = document.getElementById('hrm_entry_form');
    const filterForm = document.getElementById('hrm_filter_form');
    const saveButton = document.getElementById('hrm_save_btn');
    const resetButton = document.getElementById('hrm_reset_btn');
    const filterButton = document.getElementById('hrm_filter_btn');
    const filterResetButton = document.getElementById('hrm_filter_reset_btn');
    const batchActions = document.getElementById('hrm_batch_actions');
    const tableBody = document.getElementById('hrm_table_body');

    if (saveButton) {
        saveButton.onclick = async () => {
            const saveController = hrmResolveControllerName(route, 'save');
            let payload = hrmBuildPayloadFromForm(form, route, 'save');
            if (route === 'pp_level') {
                payload.delete('module');
                payload.delete('mode');
                if (hrmLevelEditingId) payload.append('id', hrmLevelEditingId);
                hrmCollectLevelLines(payload);
            }
            if (route === 'pp_personnel') {
                const mode = form?.querySelector('[name="id"]')?.value ? 'update' : 'save';
                payload = hrmBuildPersonnelPayload(form, mode);
            }
            const result = await hrmRequestController(saveController, payload, saveButton);
            if (!result.ok || result?.data?.status === false) {
                notification(hrmResultErrorMessage(result, `Save failed on ${saveController}`), 0);
                return;
            }
            notification(result?.data?.message || 'Record submitted successfully', 1);
            if (route === 'pp_level') {
                form?.reset();
                hrmLevelEditingId = '';
                hrmRenderLevelLineEditors([], []);
            }
            if (route === 'pp_personnel') {
                form?.reset();
                const levelControl = document.getElementById('levelid');
                if (hrmTomSelectInstances.levelid) {
                    hrmTomSelectInstances.levelid.clear(true);
                } else if (levelControl) {
                    levelControl.value = '';
                }
                const basicSalaryControl = document.getElementById('basicsalary');
                const idControl = document.getElementById('id');
                if (basicSalaryControl) basicSalaryControl.value = '';
                if (idControl) idControl.value = '';
                const saveLabel = saveButton?.querySelector('span:last-child');
                if (saveLabel) saveLabel.textContent = 'Submit';
            }
            await hrmLoadViewData(route, blueprint);
        };
    }
    if (resetButton) {
        resetButton.onclick = () => {
            form?.reset();
            if (route === 'pp_level') {
                hrmLevelEditingId = '';
                hrmRenderLevelLineEditors([], []);
            }
            if (route === 'pp_personnel') {
                if (hrmTomSelectInstances.levelid) hrmTomSelectInstances.levelid.clear(true);
                const saveLabel = saveButton?.querySelector('span:last-child');
                if (saveLabel) saveLabel.textContent = 'Submit';
            }
        };
    }
    if (filterButton) filterButton.onclick = async () => hrmLoadViewData(route, blueprint, filterButton, filterForm);
    if (filterResetButton) filterResetButton.onclick = async () => {
        filterForm?.reset();
        await hrmLoadViewData(route, blueprint);
    };
    if (batchActions) batchActions.innerHTML = '';
    if (tableBody) {
        tableBody.onclick = (event) => {
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
                            hrmSetActiveTab('input');
                            hrmPopulateEntryForm(editRecord);
                            if (editRecord?.nationality) await hrmPopulateStates(editRecord.nationality);
                            if (editRecord?.state) await hrmPopulateCities(editRecord.nationality, editRecord.state);
                            const levelControl = document.getElementById('levelid');
                            if (hrmTomSelectInstances.levelid && levelControl?.value) {
                                hrmTomSelectInstances.levelid.setValue(levelControl.value, true);
                            }
                            const saveLabel = saveButton?.querySelector('span:last-child');
                            if (saveLabel) saveLabel.textContent = 'Update';
                        });
                    } else if (typeof routerEvent === 'function') {
                        sessionStorage.setItem('hrm_personnel_edit_record', JSON.stringify(entry));
                        routerEvent('pp_personnel');
                    } else {
                        notification('Unable to open Add Personnel for edit', 0);
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

            const editTrigger = event.target.closest('[data-hrm-edit]');
            if (editTrigger) {
                let payload = {};
                const rawRecord = editTrigger.dataset.hrmRecord || '';
                try {
                    payload = rawRecord ? JSON.parse(rawRecord) : {};
                } catch (error) {}
                window.hrmNavigateToInput(payload);
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
        hrmBindPersonnelLookupBehavior();
        const editRecordRaw = sessionStorage.getItem('hrm_personnel_edit_record');
        if (editRecordRaw) {
            try {
                const editEntry = JSON.parse(editRecordRaw);
                const editRecord = hrmMapPersonnelEntryToForm(editEntry);
                Promise.resolve(levelPickerLoad).finally(() => {
                    (async () => {
                        hrmSetActiveTab('input');
                        hrmPopulateEntryForm(editRecord);
                        if (editRecord?.nationality) await hrmPopulateStates(editRecord.nationality);
                        if (editRecord?.state) await hrmPopulateCities(editRecord.nationality, editRecord.state);
                        const levelControl = document.getElementById('levelid');
                        if (hrmTomSelectInstances.levelid && levelControl?.value) {
                            hrmTomSelectInstances.levelid.setValue(levelControl.value, true);
                        }
                        const saveLabel = saveButton?.querySelector('span:last-child');
                        if (saveLabel) saveLabel.textContent = 'Update';
                        notification('Personnel record loaded for edit', 1);
                    })();
                });
            } catch (error) {}
            sessionStorage.removeItem('hrm_personnel_edit_record');
        }
    }

    hrmLoadViewData(route, blueprint);
}
