function drawAlertsOnMap(map, alerts) {
    const features = alerts
        .filter(alert => alert.geometry && alert.geometry.coordinates)
        .map(alert => ({
            type: 'Feature',
            geometry: alert.geometry,
            properties: alert.properties || {},
        }))

    if (features.length > 0) {
        map.addSource('alerts', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: features,
            },
        })

        map.addLayer({
            id: 'alert-layer',
            type: 'fill',
            source: 'alerts',
            paint: {
                'fill-color': '#ff0000',
                'fill-opacity': 1,
                'fill-outline-color': '#ff0000',
            },
        })
    }
}

async function drawCounties(map, alerts) {
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
                    'line-color': '#000000',
                    'line-width': 1,
                    'line-opacity': 1,
                },
            })
        }
    } catch (error) {
        console.error('Error loading county data:', error)
    }
}
