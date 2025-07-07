function drawAlertsOnMap(map, alerts) {
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
                    'fill-opacity': 1,
                    'fill-outline-color': '#ff0000',
                },
            })
        }
    })
}

async function drawCounties(map) {
    try {
        const response = await fetch('data/county-shapefile-reduced.json')
        const countyData = await response.json()

        if (countyData.features) {
            map.addSource('counties', {
                type: 'geojson',
                data: countyData,
            })

            map.addLayer({
                id: 'county-boundaries',
                type: 'line',
                source: 'counties',
                paint: {
                    'line-color': '#ffffff',
                    'line-width': 1,
                    'line-opacity': 1,
                },
            })
        }
    } catch (error) {
        console.error('Error loading county data:', error)
    }
}
