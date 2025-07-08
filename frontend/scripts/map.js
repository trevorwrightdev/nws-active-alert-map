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

function drawCountiesWithAlerts(map, countyData, alerts) {
    map.addSource('counties', {
        type: 'geojson',
        data: countyData,
    })

    const alertsWithNoGeometry = alerts.filter(
        a => a.geometry === null && a.properties?.geocode?.SAME?.[0]
    )

    const fipsToColor = [
        ...new Set(
            alertsWithNoGeometry
                .map(a => a.properties.geocode.SAME?.[0])
                .filter(Boolean)
                .map(raw =>
                    raw.length === 6 && raw.startsWith('0') ? raw.slice(1) : raw
                )
        ),
    ]

    const matchExpr = ['match', ['get', 'FIPS']]
    for (const fips of fipsToColor) {
        matchExpr.push(fips, '#9999ff')
    }
    matchExpr.push('#ffffff')

    map.addLayer({
        id: 'county-fills',
        type: 'fill',
        source: 'counties',
        paint: {
            'fill-color': matchExpr,
            'fill-opacity': 1,
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
