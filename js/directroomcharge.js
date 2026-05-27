let directRoomChargeRows = []

async function directroomchargeActive() {
    if (did('drc_submit')) did('drc_submit').addEventListener('click', submitDirectRoomCharge)
    if (did('drc_reset')) did('drc_reset').addEventListener('click', resetDirectRoomChargeForm)
    ;['drc_baseamount', 'drc_vatperc', 'drc_consumptionperc', 'drc_serviceperc'].forEach((id) => {
        if (did(id)) did(id).addEventListener('input', updateDirectRoomChargeTotals)
    })
    if (did('drc_transactiondate') && !did('drc_transactiondate').value) did('drc_transactiondate').value = new Date().toISOString().slice(0, 10)
    updateDirectRoomChargeTotals()
    renderDirectRoomChargeRows()
}

function drcNum(id) {
    return Number(did(id)?.value || 0)
}

function updateDirectRoomChargeTotals() {
    const base = drcNum('drc_baseamount')
    const vat = (base * drcNum('drc_vatperc')) / 100
    const consumption = (base * drcNum('drc_consumptionperc')) / 100
    const service = (base * drcNum('drc_serviceperc')) / 100
    const total = base + vat + consumption + service
    if (did('drc_vatamount')) did('drc_vatamount').textContent = formatNumber(vat)
    if (did('drc_consumptionamount')) did('drc_consumptionamount').textContent = formatNumber(consumption)
    if (did('drc_serviceamount')) did('drc_serviceamount').textContent = formatNumber(service)
    if (did('drc_totalamount')) did('drc_totalamount').textContent = formatNumber(total)
}

function getDirectRoomChargePayload() {
    const base = drcNum('drc_baseamount')
    const vat = (base * drcNum('drc_vatperc')) / 100
    const consumption = (base * drcNum('drc_consumptionperc')) / 100
    const service = (base * drcNum('drc_serviceperc')) / 100
    return {
        id: genID(),
        transactiondate: did('drc_transactiondate')?.value || '',
        roomnumber: String(did('drc_roomnumber')?.value || '').trim(),
        guestname: String(did('drc_guestname')?.value || '').trim(),
        description: String(did('drc_description')?.value || '').trim(),
        baseamount: base,
        vatamount: vat,
        consumptionamount: consumption,
        serviceamount: service,
        totalamount: base + vat + consumption + service
    }
}

function submitDirectRoomCharge() {
    if (!validateForm('directroomchargeentryform', ['drc_transactiondate', 'drc_roomnumber', 'drc_baseamount', 'drc_description'])) {
        return notification('Please fill all required fields', 0)
    }
    const payload = getDirectRoomChargePayload()
    directRoomChargeRows.unshift(payload)
    renderDirectRoomChargeRows()
    notification('Direct room charge saved on interface. Controller wiring can be plugged in next.', 1)
    resetDirectRoomChargeForm()
}

function resetDirectRoomChargeForm() {
    if (did('directroomchargeentryform')) did('directroomchargeentryform').reset()
    if (did('drc_transactiondate')) did('drc_transactiondate').value = new Date().toISOString().slice(0, 10)
    if (did('drc_vatperc')) did('drc_vatperc').value = '0'
    if (did('drc_consumptionperc')) did('drc_consumptionperc').value = '0'
    if (did('drc_serviceperc')) did('drc_serviceperc').value = '0'
    updateDirectRoomChargeTotals()
}

function renderDirectRoomChargeRows() {
    const tableBody = did('drctabledata')
    if (!tableBody) return
    if (!directRoomChargeRows.length) {
        tableBody.innerHTML = '<tr><td colspan="100%" class="text-center opacity-70">Table is empty</td></tr>'
        return
    }
    tableBody.innerHTML = directRoomChargeRows.map((row, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${row.transactiondate || '-'}</td>
            <td>${row.roomnumber || '-'}</td>
            <td>${row.guestname || '-'}</td>
            <td>${row.description || '-'}</td>
            <td>${formatNumber(row.baseamount)}</td>
            <td>${formatNumber(row.vatamount)}</td>
            <td>${formatNumber(row.consumptionamount)}</td>
            <td>${formatNumber(row.serviceamount)}</td>
            <td>${formatNumber(row.totalamount)}</td>
        </tr>
    `).join('')
}
