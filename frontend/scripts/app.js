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

    if (alerts) {
        drawCountiesWithAlerts(map, countyData, alerts)
        drawAlertsOnMap(map, alerts)

        drawStates(map, stateData)
    }

    map.on('idle', () => {
        document.getElementById('map').style.display = 'block'
    })
}

init()
