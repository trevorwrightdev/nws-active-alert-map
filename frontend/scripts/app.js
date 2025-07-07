var map = new maplibregl.Map({
    container: 'map', // container id
    style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json', // clean, minimal style
    // Alternative styles you can try:
    // 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' // dark theme
    // 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json' // colorful
    // 'https://demotiles.maplibre.org/style.json' // original demo style
    center: [-98.5795, 39.8283], // starting position [lng, lat] - center of United States
    zoom: 3, // starting zoom - shows most of the continental US,
})

async function init() {
    const { data: alerts } = await fetchAlerts()
    const countyData = await getJson('data/county-shapefile-reduced.json')
    const stateData = await getJson('data/state-shapefile.json')

    if (alerts) {
        drawAlertsOnMap(map, alerts)
        drawCounties(map, countyData)
        drawStates(map, stateData)
    }
}

init()
