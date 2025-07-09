import { getEventColor, truncateText } from '../utils/helpers.js'

export function createPopupHtml(alertProperties) {
    const eventColor = getEventColor(alertProperties.event)

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

export function showPopup(map, lngLat, alertProperties) {
    new maplibregl.Popup()
        .setLngLat(lngLat)
        .setHTML(createPopupHtml(alertProperties))
        .addTo(map)
}
