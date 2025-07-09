var map = new maplibregl.Map({
    container: 'map', // container id
    style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
    center: [-98.5795, 39.8283], // starting position [lng, lat] - center of United States
    zoom: 3,
})

async function init() {
    const { data: alerts } = await fetchAlerts()
    const countyData = await getJson('data/county-shapefile.json')
    const stateData = await getJson('data/state-shapefile.json')

    if (!alerts) return

    initCountiesWithAlertsLayer(map, countyData, alerts.features)
    initAlertPolygonsLayer(map, alerts.features)
    drawStates(map, stateData)
    populateAlertListPage(alerts.features)

    map.on('idle', () => {
        document.getElementById('map').style.display = 'block'
    })

    socket.on('alerts-update', alerts => {
        updateAlertPolygons(map, alerts.features)
        updateCountyFills(map, alerts.features)
        populateAlertListPage(alerts.features)
    })
}

generateLegend()

document.getElementById('back-to-home').addEventListener('click', showHomePage)
document.getElementById('nav-map').addEventListener('click', showHomePage)
document
    .getElementById('nav-alerts')
    .addEventListener('click', showAlertListPage)

init()
