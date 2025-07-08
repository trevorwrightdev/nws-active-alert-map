var map = new maplibregl.Map({
    container: 'map', // container id
    style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
    center: [-98.5795, 39.8283], // starting position [lng, lat] - center of United States
    zoom: 3,
})

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

async function init() {
    const { data: alerts } = await fetchAlerts()
    const countyData = await getJson('data/county-shapefile.json')
    const stateData = await getJson('data/state-shapefile.json')

    generateLegend()

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
