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

        const matchExpr = ['match', ['get', 'event']]
        for (const [event, color] of Object.entries(COLOR_MAP)) {
            matchExpr.push(event, color)
        }
        matchExpr.push('#ff0000')

        map.addLayer({
            id: 'alert-layer',
            type: 'fill',
            source: 'alerts',
            paint: {
                'fill-color': matchExpr,
                'fill-opacity': 1,
                'fill-outline-color': matchExpr,
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

    const fipsToColorMap = {}
    for (const alert of alertsWithNoGeometry) {
        let fips = alert.properties.geocode.SAME?.[0]
        if (fips.length === 6 && fips.startsWith('0')) fips = fips.slice(1)
        const event = alert.properties.event
        const color = COLOR_MAP[event] || '#9999ff'
        fipsToColorMap[fips] = color
    }

    const matchExpr = ['match', ['get', 'FIPS']]
    for (const [fips, color] of Object.entries(fipsToColorMap)) {
        matchExpr.push(fips, color)
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
