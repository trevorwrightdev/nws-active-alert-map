let fipsToAlertMap = {}

function initAlertPolygonsLayer(map, alerts) {
    const features = alertsToFeatures(alerts)

    map.addSource('alerts', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features,
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

    map.on('click', 'alert-layer', e => {
        const feature = e.features[0]
        // showAlertInfoPage(feature.properties)
        new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(getPopupHtml(feature.properties))
            .addTo(map)
    })

    map.on('mousemove', 'alert-layer', e => {
        const feature = e.features[0]
        if (feature) {
            map.getCanvas().style.cursor = 'default'
        } else {
            map.getCanvas().style.cursor = ''
        }
    })
}

function updateAlertPolygons(map, alerts) {
    const features = alertsToFeatures(alerts)
    map.getSource('alerts').setData({
        type: 'FeatureCollection',
        features,
    })
}

function alertsToFeatures(alerts) {
    return alerts
        .filter(a => a.geometry && a.geometry.coordinates)
        .map(a => ({
            type: 'Feature',
            geometry: a.geometry,
            properties: a.properties || {},
        }))
}

function initCountiesWithAlertsLayer(map, countyData, alerts) {
    map.addSource('counties', {
        type: 'geojson',
        data: countyData,
    })

    updateFipsToAlertMap(alerts)

    const matchExpr = getCountyFillMatchExpr(alerts)

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

    map.on('click', 'county-fills', e => {
        const feature = e.features[0]
        const fips = feature.properties.FIPS
        const alert = fipsToAlertMap[fips]

        if (alert) {
            new maplibregl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(getPopupHtml(alert.properties))
                .addTo(map)
        }
    })

    map.on('mousemove', 'county-fills', e => {
        const feature = e.features[0]
        if (feature) {
            const fips = feature.properties.FIPS
            const alert = fipsToAlertMap[fips]

            if (alert) {
                map.getCanvas().style.cursor = 'default'
            } else {
                map.getCanvas().style.cursor = ''
            }
        }
    })
}

function getCountyFillMatchExpr(alerts) {
    const countyAlerts = getCountyAlerts(alerts)

    const fipsToColorMap = {}
    for (const alert of countyAlerts) {
        const fipsCodes = alert.properties.geocode.SAME || []
        const event = alert.properties.event
        const color = getEventColor(event)

        for (let fips of fipsCodes) {
            if (fips.length === 6 && fips.startsWith('0')) {
                fips = fips.slice(1)
            }
            fipsToColorMap[fips] = color
        }
    }

    const matchExpr = ['match', ['get', 'FIPS']]
    for (const [fips, color] of Object.entries(fipsToColorMap)) {
        matchExpr.push(fips, color)
    }
    matchExpr.push('#ffffff')

    return matchExpr
}

function updateCountyFills(map, alerts) {
    const matchExpr = getCountyFillMatchExpr(alerts)
    updateFipsToAlertMap(alerts)
    map.setPaintProperty('county-fills', 'fill-color', matchExpr)
}

function updateFipsToAlertMap(alerts) {
    fipsToAlertMap = {}

    for (const alert of getCountyAlerts(alerts)) {
        const fipsCodes = alert.properties.geocode.SAME || []

        for (let fips of fipsCodes) {
            if (fips.length === 6 && fips.startsWith('0')) {
                fips = fips.slice(1)
            }
            fipsToAlertMap[fips] = alert
        }
    }
}

function getCountyAlerts(alerts) {
    return alerts.filter(
        a => a.geometry === null && a.properties?.geocode?.SAME?.length > 0
    )
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
