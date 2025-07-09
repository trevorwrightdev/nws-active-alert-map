async function fetchAlerts() {
    try {
        const response = await fetch(SERVER_URL + '/alerts')

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return { data: data, error: null }
    } catch (error) {
        console.error('Error fetching alerts:', error)
        return { data: null, error: error.message }
    }
}

function getEventColor(event) {
    return COLOR_MAP[event] || FALLBACK_COLOR
}

async function getJson(url) {
    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error(`Error fetching ${url}:`, error)
        throw error
    }
}

function showAlertInfoPage(alertProperties) {
    document.getElementById('map-page').style.display = 'none'
    document.getElementById('alert-list-page').style.display = 'none'

    const alertInfoPage = document.getElementById('alert-info-page')
    alertInfoPage.style.display = 'flex'

    document.getElementById(
        'alert-headline'
    ).textContent = `${alertProperties.headline}`
    document.getElementById(
        'alert-event'
    ).textContent = `Event: ${alertProperties.event}`
    document.getElementById(
        'alert-severity'
    ).textContent = `Severity: ${alertProperties.severity}`
    document.getElementById(
        'alert-urgency'
    ).textContent = `Urgency: ${alertProperties.urgency}`
    document.getElementById(
        'alert-certainty'
    ).textContent = `Certainty: ${alertProperties.certainty}`

    document.getElementById(
        'alert-sent'
    ).textContent = `Sent: ${alertProperties.sent}`
    document.getElementById(
        'alert-effective'
    ).textContent = `Effective: ${alertProperties.effective}`
    document.getElementById(
        'alert-onset'
    ).textContent = `Onset: ${alertProperties.onset}`
    document.getElementById(
        'alert-expires'
    ).textContent = `Expires: ${alertProperties.expires}`

    document.getElementById(
        'alert-areaDesc'
    ).textContent = `Affected Areas: ${alertProperties.areaDesc}`
    document.getElementById(
        'alert-description'
    ).textContent = `Description: ${alertProperties.description}`
    document.getElementById(
        'alert-instruction'
    ).textContent = `Instructions: ${alertProperties.instruction}`

    document.getElementById(
        'alert-senderName'
    ).textContent = `Issued By: ${alertProperties.senderName}`
    document.getElementById(
        'alert-web'
    ).innerHTML = `More Info: <a href="${alertProperties.web}" target="_blank">${alertProperties.web}</a>`
}

function showHomePage() {
    document.getElementById('map-page').style.display = 'block'
    document.getElementById('alert-info-page').style.display = 'none'
    document.getElementById('alert-list-page').style.display = 'none'

    document.getElementById('nav-map').classList.add('active')
    document.getElementById('nav-alerts').classList.remove('active')
}

function showAlertListPage() {
    document.getElementById('map-page').style.display = 'none'
    document.getElementById('alert-info-page').style.display = 'none'
    document.getElementById('alert-list-page').style.display = 'block'

    document.getElementById('nav-map').classList.remove('active')
    document.getElementById('nav-alerts').classList.add('active')
}

function getPopupHtml(alertProperties) {
    const eventColor = getEventColor(alertProperties.event)

    const truncateText = (text, maxLength = 100) => {
        if (!text || text.length <= maxLength) return text
        return text.substring(0, maxLength) + '...'
    }

    return `
        <div class="popup-container">
            <h3 class="popup-title" style="color: ${eventColor};">${
        alertProperties.event || 'Alert'
    }</h3>
            <p class="popup-text"><strong>Area:</strong> ${
                truncateText(alertProperties.areaDesc) || 'N/A'
            }</p>
            <p class="popup-text"><strong>Severity:</strong> ${
                alertProperties.severity || 'N/A'
            }</p>
            <p class="popup-text"><strong>Effective:</strong> ${
                alertProperties.effective || 'N/A'
            }</p>
            <p class="popup-text"><strong>Expires:</strong> ${
                alertProperties.expires || 'N/A'
            }</p>
            <button onclick="showAlertInfoPage(${JSON.stringify(
                alertProperties
            ).replace(/"/g, '&quot;')})" class="popup-button">More Info</button>
        </div>
    `
}

function populateAlertListPage(alerts) {
    const alertListContainer = document.getElementById('alert-list')
    alertListContainer.innerHTML = ''

    if (!alerts || alerts.length === 0) {
        alertListContainer.innerHTML =
            '<div class="no-alerts">No active alerts</div>'
        return
    }

    alerts.forEach(alert => {
        const alertItem = document.createElement('div')
        alertItem.className = 'alert-item'
        alertItem.style.cursor = 'pointer'

        const eventColor = getEventColor(alert.properties.event)
        alertItem.style.borderLeftColor = eventColor

        alertItem.innerHTML = `
            <div class="alert-headline">
                ${
                    alert.properties.headline ||
                    alert.properties.event ||
                    'Alert'
                }
            </div>
            <div class="alert-severity">${
                alert.properties.severity || 'N/A'
            }</div>
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

        alertListContainer.appendChild(alertItem)
    })
}

function generateLegend() {
    const legendContainer = document.getElementById('legend')
    legendContainer.innerHTML = ''

    Object.entries(COLOR_MAP).forEach(([eventType, color]) => {
        const legendItem = document.createElement('div')
        legendItem.className = 'legend-item'

        const colorDiv = document.createElement('div')
        colorDiv.className = 'legend-item-color'
        colorDiv.style.backgroundColor = color

        const labelDiv = document.createElement('div')
        labelDiv.className = 'legend-item-label'

        const labelText = document.createElement('span')
        labelText.className = 'legend-item-label-text'
        labelText.textContent = eventType

        labelDiv.appendChild(labelText)
        legendItem.appendChild(colorDiv)
        legendItem.appendChild(labelDiv)
        legendContainer.appendChild(legendItem)
    })
}
