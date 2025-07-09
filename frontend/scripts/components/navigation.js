export function showHomePage() {
    document.getElementById('map-page').style.display = 'block'
    document.getElementById('alert-info-page').style.display = 'none'
    document.getElementById('alert-list-page').style.display = 'none'

    document.getElementById('nav-map').classList.add('active')
    document.getElementById('nav-alerts').classList.remove('active')
}

export function showAlertListPage() {
    document.getElementById('map-page').style.display = 'none'
    document.getElementById('alert-info-page').style.display = 'none'
    document.getElementById('alert-list-page').style.display = 'block'

    document.getElementById('nav-map').classList.remove('active')
    document.getElementById('nav-alerts').classList.add('active')
}

export function showAlertInfoPage(alertProperties) {
    document.getElementById('map-page').style.display = 'none'
    document.getElementById('alert-list-page').style.display = 'none'

    const alertInfoPage = document.getElementById('alert-info-page')
    alertInfoPage.style.display = 'flex'

    const fields = [
        { id: 'alert-headline', value: alertProperties.headline },
        { id: 'alert-event', value: `Event: ${alertProperties.event}` },
        {
            id: 'alert-severity',
            value: `Severity: ${alertProperties.severity}`,
        },
        { id: 'alert-urgency', value: `Urgency: ${alertProperties.urgency}` },
        {
            id: 'alert-certainty',
            value: `Certainty: ${alertProperties.certainty}`,
        },
        { id: 'alert-sent', value: `Sent: ${alertProperties.sent}` },
        {
            id: 'alert-effective',
            value: `Effective: ${alertProperties.effective}`,
        },
        { id: 'alert-onset', value: `Onset: ${alertProperties.onset}` },
        { id: 'alert-expires', value: `Expires: ${alertProperties.expires}` },
        {
            id: 'alert-areaDesc',
            value: `Affected Areas: ${alertProperties.areaDesc}`,
        },
        {
            id: 'alert-description',
            value: `Description: ${alertProperties.description}`,
        },
        {
            id: 'alert-instruction',
            value: `Instructions: ${alertProperties.instruction}`,
        },
        {
            id: 'alert-senderName',
            value: `Issued By: ${alertProperties.senderName}`,
        },
    ]

    fields.forEach(({ id, value }) => {
        const element = document.getElementById(id)
        if (element) {
            element.textContent = value
        }
    })

    const webElement = document.getElementById('alert-web')
    if (webElement && alertProperties.web) {
        webElement.innerHTML = `More Info: <a href="${alertProperties.web}" target="_blank">${alertProperties.web}</a>`
    }
}

export function initializeNavigation() {
    document
        .getElementById('back-to-home')
        .addEventListener('click', showHomePage)
    document.getElementById('nav-map').addEventListener('click', showHomePage)
    document
        .getElementById('nav-alerts')
        .addEventListener('click', showAlertListPage)
}
