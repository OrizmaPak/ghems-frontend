# Personnel and Payroll Implementation Guideline

This document is the working guide for replicating HTG Personnel and Payroll behavior in HEMS. It is based on the HTG PHP/JS interfaces and the current HEMS `hrm_workspace` implementation.

## Non-Negotiable Scope Rules

- Do not render department fields, department filters, department columns, department selectors, or department labels in any Personnel and Payroll interface.
- Do not render group fields, group filters, group columns, group selectors, or group labels in any Personnel and Payroll interface.
- Do not call `fetchdepartment.php` or `fetchgroupname.php` from HEMS Personnel and Payroll screens.
- If a controller cannot work without department/group fallback values, send fixed values only:
  `departmentid=0`, `department=NAN`, `groupid=0`, `groupname=NAN`.
- Payloads should follow HTG field names. Do not add generic wrapper keys like `module` or `schema` to HTG-replica save payloads unless a HEMS-specific controller explicitly requires them.
- View responses must be rendered from their real nested shapes. Never render raw objects into table cells.

## Shared HEMS Structure

- Shared page shell: `hrm_workspace.php`
- Shared JS implementation: `js/hrm_workspace.js`
- Route registry: `js/router.js`
- Menu/permission navigation: `index.php`, `js/index.js`, `js/util.js`
- Existing replication notes: `docs/personnel-payroll-htg-replication.md`

The target HEMS interface pattern is:

- Top guide card from the navigation note, with reset button.
- Page tabs when an interface has both input and view behavior: `<Interface Name>` and `View <Interface Name>`.
- Input tab contains form fields and save/reset actions.
- View tab contains filters, summary cards, export buttons, table, and row actions.
- Edit actions must return to the input tab with the selected record loaded and the submit button changed to update mode.

## Shared Data Mapping Rules

- Personnel list responses use:
  `data[].personnel` and optional `data[].salarystructure`.
- Level list responses use:
  `data[].level` and optional `data[].salarystructure`.
- Salary structure rows use:
  `salaryinfo`, `amountpercentage`, `salaryinfotype`.
- Personnel identity should use `staffid`, not database `id`, when HTG uses staff identity for related records.
- File uploads should use HTG keys:
  `photofilename` and `userphotoname`.
- Empty file upload fallback:
  `photofilename=-`, `userphotoname=-`.
- Normalize `null`, `undefined`, and `-` to empty UI display values unless the backend explicitly needs `-`.
- Decode HTML entities before filling forms, for example `God&#039;s` should display as `God's`.

## Interface Guide

| HEMS Route | HTG Files Studied | Main Controllers | Required Behavior |
|---|---|---|---|
| `pp_level` | `level.php`, `js/level.js` | `fetchlevel.php`, `level.php`, `removelevel.php` | Manage levels and salary structures. Render nested `level` + `salarystructure`. Edit loads input tab. Delete uses icon button. Do not introduce department/group. |
| `pp_personnel` | `personnel.php`, `js/personnel.js` | `personnelscript.php`, `fetchlevel.php`, `fetchallusers.php` | Complete Add Personnel form. Staff ID readonly. Level uses Tom Select from `fetchlevel.php`. Save/update sends HTG personnel keys only, no `module`. Department/group hidden with fallback values. View tab renders personnel list without department. |
| `pp_viewpersonnel` | `viewpersonnel.php`, `js/viewpersonnel.js` | `fetchpersonnels.php`, `removepersonnel.php`, `personnelscript.php` | Personnel directory. Table columns: S/N, Staff ID, Name, Phone, Level, Status, Action. Action buttons: View and Edit. View opens modal with all personnel and salary structure details. Edit opens Add Personnel populated for update. |
| `pp_approvepersonnel` | `approvepersonnel.php`, `js/approvepersonnel.js` | `fetchpersonnels.php`, `personnelapprovals.php` | Load only `status=NOT APPROVED`. Batch approve/decline sends `buttonselected`, `ids0..idsN`, `idsize`. Do not show department/group filters or columns. |
| `pp_personnelhistory` | `personnelhistory.php`, `personnelandpayroll.js` | likely `fetchpersonnelhistory.php`/history data endpoints | Show personnel profile history sections such as biodata, guarantor, employment, referees, qualifications, parents/guardians, matters, and payroll history. Render nested sections, not raw objects. No department/group filters. |
| `pp_guarantor` | `guarantor.php`, `js/guarantor.js` | `fetchpersonnels.php`, `guarantorscript.php`, `fetchguarantors.php`, `removeguarantor.php` | Personnel selector maps display name to `staffid`. Save keys: `personnelmatter=GUARANTOR`, `staffid`, `guarantorname`, `occupation`, `phonenumber`, `address`, file keys. Edit reloads input tab. |
| `pp_employerrecord` | `employerrecord.php`, `js/employerrecord.js` | `fetchpersonnels.php`, `employmentrecordscript.php`, `fetchemploymentrecords.php`, `removeemploymentrecord.php` | Personnel selector maps to `staffid`. Save keys: `staffid`, `employer`, `position`, `basic`, `yearsemployed`, `reasonforleaving`, file keys. |
| `pp_referees` | `referees.php`, `js/referees.js` | `fetchpersonnels.php`, `refereescript.php`, `fetchreferees.php`, `removereferee.php` | Save keys: `staffid`, `fullname`, `occupation`, `address`, `phonenumber`, `relationship`, file keys. |
| `pp_qualification` | `qualificationn.php`, `js/qualificationn.js` | `fetchpersonnels.php`, `qualificationscript.php`, `fetchqualifications.php`, `removequalification.php` | Save keys: `staffid`, `institution`, `qualification`, `certificationdate`, file keys. |
| `pp_parentsguardians` | `parentsguardians.php`, `personnelandpayroll.js` | `fetchpersonnels.php`, `parentscript.php`, `fetchparents.php`, `removeparentsguardians.php` | Save keys: `personnelmatter=PARENTSGUARDIANS`, `staffid`, `parentone`, `parenttwo`, `parentoneoccupation`, `parenttwooccupation`, `parentonephone`, `parenttwophone`, `homeaddress`, `officeaddress`, file keys. |
| `pp_query` | `query.php`, `js/query.js` | `fetchpersonnels.php`, `personnelmatterscript.php`, `fetchpersonnelmatters.php`, `removepersonnelmatter.php` | Matter type `QUERY`. Save keys: `personnelmatter=QUERY`, `pid`, `entrydate`, `title`, `startdate`, `enddate`, file keys. View/filter uses `personnelmatter=QUERY` and `personnelid` when scoped. |
| `pp_promotions` | `promotions.php`, `js/promotions.js` | `fetchpersonnels.php`, `fetchlevel.php`, `personnelmatterscript.php`, `fetchpersonnelmatters.php`, `removepersonnelmatter.php` | Matter type `PROMOTION`. Save keys: `personnelmatter=PROMOTION`, `pid`, `entrydate`, `title`, `level`, allowance/deduction grids, file keys. Editing should load level and structure lines. |
| `pp_termination` | `termination.php`, `js/termination.js` | `fetchpersonnels.php`, `personnelmatterscript.php`, `fetchpersonnelmatters.php`, `removepersonnelmatter.php` | Matter type `TERMINATION`. Save keys: `personnelmatter=TERMINATION`, `pid`, `entrydate`, `title`, file keys. |
| `pp_suspension` | `suspension.php`, `js/suspension.js` | `fetchpersonnels.php`, `personnelmatterscript.php`, `fetchpersonnelmatters.php`, `removepersonnelmatter.php` | Matter type `SUSPENSION`. Save keys: `personnelmatter=SUSPENSION`, `pid`, `entrydate`, `title`, file keys. |
| `pp_leave` | `leave.php`, `js/leave.js` | `fetchpersonnels.php`, `personnelmatterscript.php`, `fetchpersonnelmatters.php`, `removepersonnelmatter.php` | Matter type `leave`. Save keys: `personnelmatter=leave`, `pid`, `entrydate`, `title`, `startdate`, `enddate`, file keys. |
| `pp_warning` | `warning.php`, `js/warning.js` | `fetchpersonnels.php`, `personnelmatterscript.php`, `fetchpersonnelmatters.php`, `removepersonnelmatter.php` | Matter type `WARNING`. Save keys: `personnelmatter=WARNING`, `pid`, `entrydate`, `title`, file keys. |
| `pp_monitorevaluation` | combined personnel/payroll behavior | likely `fetchpersonnels.php`, `personnelmatterscript.php`, `fetchpersonnelmatters.php`, `removepersonnelmatter.php` | Treat as personnel matter interface. Confirm exact HTG keys before implementation; keep same tab/input/view pattern. |
| `pp_advance` | `advance.php`, `js/advance.js` | `fetchpersonnels.php`, `personnelmatterscript.php`, `fetchpersonnelmatters.php`, `removepersonnelmatter.php` | Matter type `ADVANCE`. Save keys: `personnelmatter=ADVANCE`, `pid`, `entrydate`, `title`, `amount`, `level=-1`, file keys. |
| `pp_viewstaffadvance` | `viewstaffadvance.php`, `js/viewstaffadvance.js` | `fetchpersonnels.php`, `fetchpersonnelmatters.php` | View advance records only. Filter by personnel/staff id and `personnelmatter=ADVANCE`. |
| `pp_personalstaffsalaryrecord` | `personalstaffsalaryrecord.php`, `js/personalstaffsalaryrecord.js` | `fetchpersonnels.php`, `fetchstaffpayroll.php` | Select staff and load salary/payroll record using `staffid`. Render payroll rows without department/group. |
| `pp_viewmonthlysalaryschedule` | `viewmonthlysalaryschedule.php`, `js/viewmonthlysalaryschedule.js` | `fetchapprovedpayroll.php`, `approvepayroll.php`, `fetchlocation.php` | Filter by month/year/location. Batch actions send `buttonselected`, `ids0..idsN`, `idsize`. Department/group excluded. |
| `pp_presalaryapproval` | `presalaryapproval.php`, `js/presalaryapproval.js` | `dopayroll.php`, `approvepayroll.php` | Run payroll with `applyattendance`, `month`, `year`. Delete selected uses `buttonselected=DELETE`, ids, idsize. |
| `pp_confirmsalary` | `confirmsalary.php`, `js/confirmsalary.js` | `fetchnonapprovedpayroll.php`, `approvepayroll.php`, `fetchlocation.php` | Filter by month/year/location. Approve/delete selected payroll rows using `buttonselected`, ids, idsize. |
| `pp_payrollclassa` | `payrollclassa.php` | `fetchpayrollclassa.php`, `fetchlocation.php` | Report-only payroll class view. Confirm exact response shape before rendering. |
| `pp_payrollclassb` | `payrollclassb.php` | `fetchpayrollclassb.php`, `fetchlocation.php` | Report-only payroll class view. Confirm exact response shape before rendering. |

## Controller Payload Standards

For create/update screens:

- Build a dedicated payload function per interface when HTG has interface-specific field names.
- Add `id` only for update flows.
- Use `staffid` for personnel-related child records unless HTG explicitly uses `pid`.
- If HTG uses `pid`, populate it from the selected personnel staff id/value exactly as HTG does.
- Save payloads should not inherit `hrmBuildPayloadFromForm` blindly if that would add `module`, `mode`, department, or group keys.

For list/filter screens:

- Filters should include only fields visible in HEMS.
- Do not send department/group filter keys.
- For personnel matter screens, include `personnelmatter` as HTG expects.
- Render all nested values deliberately. Avoid generic `Object.values(row)` rendering for any endpoint that returns nested objects.

## Expected Response Renderers

Use dedicated renderers for these shapes:

- `fetchlevel.php`:
  `{ level: { id, level, basicsalary, location, status }, salarystructure: [...] }`
- `fetchpersonnels.php`:
  `{ personnel: { ... }, salarystructure: [...] }`
- Personnel child records:
  flat rows keyed by each controller, usually containing `id`, `staffid`, and interface-specific fields.
- Personnel matters:
  rows should be grouped/rendered by `personnelmatter`, with row actions for view/edit/delete.
- Payroll:
  rows may be batch-action driven; confirm endpoint response before implementing each payroll table.

## Testing Checklist Per Interface

For every interface implementation:

- Confirm HTG controller name and payload keys from the HTG JS file.
- Confirm HEMS payload in browser Network tab: no department/group unless fallback is required.
- Confirm save success notification uses controller `message`.
- Confirm successful save clears input fields and reloads view data.
- Confirm update includes `id` and any required identifier such as `staffid`.
- Confirm edit action loads input tab with exact values from the fetched row.
- Confirm view action opens a modal or details view with all fields displayed as text, not raw objects.
- Confirm table columns contain no department/group.
- Confirm filters contain no department/group.
- Confirm response values such as `salarystructure` show as readable lines with percentages.
- Confirm empty, null, and `-` values display cleanly.
- Confirm export buttons remain visible and do not break layout.
- Confirm mobile/tablet widths do not overflow.

## Current HEMS Cleanup Targets

These should be removed or replaced as implementation continues:

- `hrmCommonFilters` currently includes `department`; create a Personnel/Payroll-specific common filter without it.
- `pp_approvepersonnel` still references a Department column in the current blueprint.
- `pp_personnelhistory` still references department filters in the current blueprint.
- `pp_presalaryapproval` still references department in the current filter blueprint.
- `hrmBuildPayloadFromForm` adds `module`, `mode`, `groupname`, `groupid`, and department fallback keys. Do not use it for HTG-exact save payloads that should not send those keys.
- Documentation in `personnel-payroll-htg-replication.md` still lists removed group/department controllers and should be reconciled after implementation cleanup.

## Recommended Implementation Order

1. Finish shared cleanup: remove department/group from shared filters, columns, docs, and payload defaults.
2. Complete `pp_personnel` and `pp_viewpersonnel` because other interfaces depend on clean personnel selection and edit/view behavior.
3. Complete personnel child-record screens: guarantor, employer record, referees, qualification, parents/guardians.
4. Complete personnel matter screens: query, promotion, termination, suspension, leave, warning, monitoring/evaluation, advance.
5. Complete approval screens: approve personnel, pre-salary approval, confirm salary, monthly salary schedule.
6. Complete report-only screens: staff salary record, view staff advance, payroll class A, payroll class B.
