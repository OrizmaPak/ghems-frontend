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

const hrmCommonFilters = [
    { id: 'search', label: 'Search', type: 'text', placeholder: 'Name, staff ID, reference' },
    { id: 'department', label: 'Department', type: 'select', options: ['All Departments'] },
    { id: 'startdate', label: 'Start Date', type: 'date' },
    { id: 'enddate', label: 'End Date', type: 'date' }
];

const hrmHiddenFrontendFields = new Set(['accountnumber', 'bankaccountnumber2', 'bankname2', 'groupid']);

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
            { id: 'basicsalary', label: 'Basic Salary', type: 'number', required: true },
            { id: 'allowance', label: 'Allowance Name', type: 'text' },
            { id: 'allowancepercent', label: 'Allowance %', type: 'number' },
            { id: 'deduction', label: 'Deduction Name', type: 'text' },
            { id: 'deductionpercent', label: 'Deduction %', type: 'number' }
        ],
        sections: [
            { title: 'Allowance Lines', columns: ['Allowance Name', 'Percentage', 'Action'] },
            { title: 'Deduction Lines', columns: ['Deduction Name', 'Percentage', 'Action'] }
        ],
        filters: [{ id: 'search', label: 'Search', type: 'text', placeholder: 'Level name' }],
        columns: ['S/N', 'Level', 'Basic Salary', 'Allowances', 'Deductions', 'Action'],
        summary: ['Total Levels', 'Total Basic Salary', 'Allowance Lines', 'Deduction Lines']
    },
    pp_groupname: {
        context: 'Personnel group setup',
        fields: [
            { id: 'groupname', label: 'Group Name', type: 'text', required: true },
            { id: 'description', label: 'Description', type: 'text' },
            { id: 'status', label: 'Status', type: 'select', options: ['ACTIVE', 'INACTIVE'] }
        ],
        filters: [{ id: 'search', label: 'Search', type: 'text', placeholder: 'Group name' }],
        columns: ['S/N', 'Group', 'Description', 'Status', 'Action'],
        summary: ['Total Groups', 'Active', 'Inactive', 'Last Updated']
    },
    pp_personnel: {
        context: 'Personnel onboarding',
        fields: [
            { id: 'staffid', label: 'Staff ID', type: 'text' },
            { id: 'firstname', label: 'First Name', type: 'text', required: true },
            { id: 'lastname', label: 'Last Name', type: 'text', required: true },
            { id: 'email', label: 'Email', type: 'email' },
            { id: 'phone', label: 'Phone', type: 'tel' },
            { id: 'department', label: 'Department', type: 'text', list: 'hrm_department_list' },
            { id: 'groupname', label: 'Group', type: 'text', list: 'hrm_group_list' },
            { id: 'level', label: 'Level', type: 'text', list: 'hrm_level_list' },
            { id: 'employmentdate', label: 'Employment Date', type: 'date' },
            { id: 'photo', label: 'Profile Photo', type: 'file' },
            { id: 'address', label: 'Address', type: 'textarea' }
        ],
        filters: hrmCommonFilters,
        columns: ['S/N', 'Staff ID', 'Name', 'Department', 'Group', 'Level', 'Status', 'Action'],
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
        columns: ['S/N', 'Staff ID', 'Name', 'Phone', 'Department', 'Group', 'Level', 'Status', 'Action'],
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
    hrmRenderDynamicSections(blueprint.sections || []);
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

function hrmRenderDynamicSections(sections) {
    const container = document.getElementById('hrm_dynamic_sections');
    if (!container) return;

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

function hrmBuildControl(field) {
    if (hrmHiddenFrontendFields.has((field?.id || '').toLowerCase())) return '';

    const required = field.required ? 'required' : '';
    const readonly = field.readonly ? 'readonly' : '';
    const list = field.list ? `list="${field.list}"` : '';
    const placeholder = field.placeholder ? `placeholder="${field.placeholder}"` : '';
    const name = field.name || field.id;

    if (field.type === 'select') {
        return `
            <div class="form-group">
                <label class="control-label" for="${field.id}">${field.label}</label>
                <select id="${field.id}" name="${name}" class="form-control" ${required}>
                    <option value="">-- select ${field.label.toLowerCase()} --</option>
                    ${(field.options || []).map((option) => `<option value="${option}">${option}</option>`).join('')}
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
            <p class="text-2xl font-semibold text-slate-800 mt-2">0</p>
        </div>
    `).join('');
}

function hrmRenderTable(columns, label) {
    const head = document.getElementById('hrm_table_head');
    const body = document.getElementById('hrm_table_body');
    if (!head || !body) return;

    head.innerHTML = `<tr>${columns.map((column) => `<th>${column}</th>`).join('')}</tr>`;
    body.innerHTML = `<tr><td colspan="${columns.length}" class="text-center opacity-70">${label} table is ready. No data loaded yet.</td></tr>`;
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

    if (saveButton) saveButton.onclick = () => notification('Interface is ready. Controller wiring will be added when you provide the endpoint.', 1);
    if (resetButton) resetButton.onclick = () => form?.reset();
    if (filterButton) filterButton.onclick = () => notification('Filter controls are ready. Data loading is pending controller wiring.', 1);
    if (filterResetButton) filterResetButton.onclick = () => filterForm?.reset();
    if (batchActions) batchActions.innerHTML = '';
    if (tableBody) {
        tableBody.onclick = (event) => {
            const editTrigger = event.target.closest('[data-hrm-edit]');
            if (!editTrigger) return;
            let payload = {};
            const rawRecord = editTrigger.dataset.hrmRecord || '';
            try {
                payload = rawRecord ? JSON.parse(rawRecord) : {};
            } catch (error) {}
            window.hrmNavigateToInput(payload);
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
        button.onclick = () => notification(`${label} action is ready for ${route}. Controller wiring is pending.`, 1);
        batchActions.appendChild(button);
    });
}
