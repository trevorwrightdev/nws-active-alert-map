import { getEventColor } from '../utils/helpers.js'
import { showAlertInfoPage } from './navigation.js'

export function populateAlertListPage(alerts) {
    const alertListContainer = document.getElementById('alert-list')
    alertListContainer.innerHTML = ''

    if (!alerts || alerts.length === 0) {
        alertListContainer.innerHTML =
            '<div class="no-alerts">No active alerts</div>'
        return
    }

    alerts.forEach(alert => {
        const alertItem = createAlertItem(alert)
        alertListContainer.appendChild(alertItem)
    })
}

function createAlertItem(alert) {
    const alertItem = document.createElement('div')
    alertItem.className = 'alert-item'
    alertItem.style.cursor = 'pointer'

    const eventColor = getEventColor(alert.properties.event)
    alertItem.style.borderLeftColor = eventColor

    alertItem.innerHTML = `
        <div class="alert-headline">
            ${alert.properties.headline || alert.properties.event || 'Alert'}
        </div>
        <div class="alert-severity">${alert.properties.severity || 'N/A'}</div>
        <div class="alert-expires">
            Expires: ${alert.properties.expires || 'N/A'}
        </div>
    `

    alertItem.addEventListener('click', () => {
        showAlertInfoPage(alert.properties)
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 100)
    })

    return alertItem
}
