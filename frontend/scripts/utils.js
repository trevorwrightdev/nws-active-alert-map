async function fetchAlerts() {
    try {
        const response = await fetch('http://localhost:3001/alerts')

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return { data: data.features, error: null }
    } catch (error) {
        console.error('Error fetching alerts:', error)
        return { data: null, error: error.message }
    }
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
    console.log(alertProperties)
    document.getElementById('map-page').style.display = 'none'

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

function getPopupHtml(alertProperties) {
    return `
        <div style="color: black;">
            <h3 style="color: black; margin: 0 0 10px 0;">${
                alertProperties.event || 'Alert'
            }</h3>
            <p style="color: black; margin: 5px 0;"><strong>Area:</strong> ${
                alertProperties.areaDesc || 'N/A'
            }</p>
            <p style="color: black; margin: 5px 0;"><strong>Effective:</strong> ${
                alertProperties.effective || 'N/A'
            }</p>
            <p style="color: black; margin: 5px 0;"><strong>Expires:</strong> ${
                alertProperties.expires || 'N/A'
            }</p>
        </div>
    `
}
