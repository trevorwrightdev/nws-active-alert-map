var map = new maplibregl.Map({
    container: 'map', // container id
    style: 'https://demotiles.maplibre.org/style.json', // style URL
    center: [-98.5795, 39.8283], // starting position [lng, lat] - center of United States
    zoom: 3, // starting zoom - shows most of the continental US
})

async function init() {
    const { data: alertData, error: alertsError } = await fetchAlerts()

    if (alertData) {
        drawAlertsOnMap(map, alertData.features)
    }
}

init()
