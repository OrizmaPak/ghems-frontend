# Personnel & Payroll Replication (HTG -> HEMS)

Detailed implementation rules, payload contracts, and per-interface guidance now live in `docs/personnel-payroll-implementation-guideline.md`.

## Scope Completed
- HTG personnel/payroll interfaces were mapped and recreated in HEMS under Administration using `pp_*` routes.
- HEMS keeps its own design while preserving HTG logic flow per interface.
- Each interface is wired to HTG-named controller endpoints through `../controllers/<controller-name>`.

## Implemented Interfaces and Controller Mapping

| HEMS Route ID | Interface | HTG Logic Summary | Controllers (from HTG mapping) |
|---|---|---|---|
| `pp_level` | Level | Level + salary structure CRUD | `fetchlevel.php`, `level.php`, `removelevel.php`, `fetchlocation.php` |
| `pp_personnel` | Add Personnel | Personnel onboarding and submission | `fetchpersonnels.php`, `personnelscript.php`, `personnelapprovals.php`, `fetchlevel.php` |
| `pp_approvepersonnel` | Approve Personnel | Approve/decline personnel | `fetchpersonnels.php`, `personnelapprovals.php`, `removepersonnel.php` |
| `pp_viewpersonnel` | View Personnel | Personnel list and maintenance | `fetchpersonnels.php`, `personnelscript.php`, `removepersonnel.php` |
| `pp_personnelhistory` | Personnel History | Personnel change audit | `fetchpersonnelhistory.php`, `fetchpersonnels.php`, `fetchlevel.php` |
| `pp_guarantor` | Guarantor | Personnel guarantor records | `fetchguarantors.php`, `guarantorscript.php`, `removeguarantor.php`, `fetchpersonnels.php` |
| `pp_employerrecord` | Employment Record | Employer history records | `fetchemploymentrecords.php`, `employmentrecordscript.php`, `removeemploymentrecord.php`, `fetchpersonnels.php` |
| `pp_referees` | Referees | Referee records per personnel | `fetchreferees.php`, `refereescript.php`, `removereferee.php`, `fetchpersonnels.php` |
| `pp_qualification` | Qualification | Qualification records | `fetchqualifications.php`, `qualificationscript.php`, `removequalification.php`, `fetchpersonnels.php` |
| `pp_parentsguardians` | Parents/Guardians | Next-of-kin records | `fetchparents.php`, `parentscript.php`, `removeparentsguardians.php`, `fetchpersonnels.php` |
| `pp_query` | Query | Personnel matter logging | `fetchpersonnelmatters.php`, `personnelmatterscript.php`, `removepersonnelmatter.php`, `fetchpersonnels.php` |
| `pp_promotions` | Promotions | Promotion matter workflow | `fetchpersonnelmatters.php`, `personnelmatterscript.php`, `removepersonnelmatter.php`, `fetchpersonnels.php`, `fetchlevel.php` |
| `pp_termination` | Termination/Resignation | Exit workflow | `fetchpersonnelmatters.php`, `personnelmatterscript.php`, `removepersonnelmatter.php`, `fetchpersonnels.php` |
| `pp_suspension` | Suspension | Suspension workflow | `fetchpersonnelmatters.php`, `personnelmatterscript.php`, `removepersonnelmatter.php`, `fetchpersonnels.php` |
| `pp_leave` | Leave | Leave workflow | `fetchpersonnelmatters.php`, `personnelmatterscript.php`, `removepersonnelmatter.php`, `fetchpersonnels.php` |
| `pp_warning` | Warning | Warning workflow | `fetchpersonnelmatters.php`, `personnelmatterscript.php`, `removepersonnelmatter.php`, `fetchpersonnels.php` |
| `pp_monitorevaluation` | Monitoring/Evaluation | Monitoring/evaluation records | `fetchpersonnelmatters.php`, `personnelmatterscript.php`, `removepersonnelmatter.php`, `fetchpersonnels.php` |
| `pp_advance` | Advance | Advance/repayment personnel matter | `fetchpersonnelmatters.php`, `personnelmatterscript.php`, `removepersonnelmatter.php`, `fetchpersonnels.php`, `fetchlevel.php` |
| `pp_viewstaffadvance` | View Staff Advance | Advance-payroll review | `fetchstaffpayroll.php`, `fetchpersonnelmatters.php`, `controller.php` |
| `pp_personalstaffsalaryrecord` | Staff Salary Record | Salary staging per staff | `fetchpersonnels.php`, `approvepayroll.php`, `controller.php` |
| `pp_viewmonthlysalaryschedule` | View Monthly Salary Schedule | Approved monthly schedule view | `fetchapprovedpayroll.php`, `approvepayroll.php`, `fetchlocation.php` |
| `pp_presalaryapproval` | Payroll | Payroll pre-approval run | `approvepayroll.php`, `dopayroll.php` |
| `pp_confirmsalary` | Approve Payroll | Final payroll confirmation | `fetchnonapprovedpayroll.php`, `dopayroll.php`, `fetchlocation.php` |
| `pp_payrollclassa` | Payroll Class A | Class A payroll reporting | `fetchpayrollclassa.php`, `fetchlocation.php` |
| `pp_payrollclassb` | Payroll Class B | Class B payroll reporting | `fetchpayrollclassb.php`, `fetchlocation.php` |

## HEMS Placeholder Implementation Location
- Route/template wiring: `js/router.js`
- Navigation entries: `index.php`
- Shared interface page: `hrm_workspace.php`
- Placeholder logic + controller simulation: `js/hrm_workspace.js`
- Script de-duplication improvement: `js/index.js`

## Controller Wiring Plan
- Controller routing is centralized in `hrmHtgControllerRouting` inside `js/hrm_workspace.js`.
- For each route, the module calls `load`, `filter`, and `save` endpoints using HTG controller names (for example, `personnel.php`, `viewpersonnel.php`, `presalaryapproval.php`).
- To swap to final backend controllers later, update `hrmHtgControllerRouting` only.
- Department and group screens/controllers are intentionally excluded from this replication. Do not add `fetchdepartment.php`, `fetchgroupname.php`, department filters, group filters, department columns, or group columns back into Personnel and Payroll.
