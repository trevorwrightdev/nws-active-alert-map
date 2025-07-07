async function fetchAlerts() {
    try {
        const response = await fetch('http://localhost:3001/alerts')

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return { data, error: null }
    } catch (error) {
        console.error('Error fetching alerts:', error)
        return { data: null, error: error.message }
    }
}

function drawAlertsOnMap(map, alerts) {
    console.log(alerts)

    alerts.forEach((alert, index) => {
        if (alert.geometry && alert.geometry.coordinates) {
            const sourceId = `alert-${index}`
            const layerId = `alert-layer-${index}`

            map.addSource(sourceId, {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: alert.geometry,
                    properties: alert.properties || {},
                },
            })

            map.addLayer({
                id: layerId,
                type: 'fill',
                source: sourceId,
                paint: {
                    'fill-color': '#ff0000',
                    'fill-opacity': 0.3,
                    'fill-outline-color': '#ff0000',
                },
            })
        }
    })
}
