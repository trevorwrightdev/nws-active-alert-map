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

function drawCounties(map, countyData) {
    map.addSource('counties', {
        type: 'geojson',
        data: countyData,
    })

    map.addLayer({
        id: 'county-fills',
        type: 'fill',
        source: 'counties',
        paint: {
            'fill-color': [
                'match',
                ['get', 'FIPS'],
                '51083',
                '#0000ff',
                '#ffffff',
            ],
            'fill-opacity': 0.4,
        },
    })

    map.addLayer({
        id: 'county-boundaries',
        type: 'line',
        source: 'counties',
        paint: {
            'line-color': '#808080',
            'line-width': 0.5,
            'line-opacity': 0.5,
        },
    })
}

function drawStates(map, stateData) {
    map.addSource('states', {
        type: 'geojson',
        data: stateData,
    })

    map.addLayer({
        id: 'state-boundaries',
        type: 'line',
        source: 'states',
        paint: {
            'line-color': '#000000',
            'line-width': 1,
            'line-opacity': 1,
        },
    })
}
