function drawAlertPolygons(map, alerts) {
    const features = alerts
        .filter(alert => alert.geometry && alert.geometry.coordinates)
        .map(alert => ({
            type: 'Feature',
            geometry: alert.geometry,
            properties: alert.properties || {},
        }))

    if (features.length === 0) return

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

function drawCountiesWithAlerts(map, countyData, alerts) {
    map.addSource('counties', {
        type: 'geojson',
        data: countyData,
    })

    const alertsWithNoGeometry = alerts.filter(
        a => a.geometry === null && a.properties?.geocode?.SAME?.length > 0
    )

    const fipsToColorMap = {}
    const fipsToAlertMap = {}
    for (const alert of alertsWithNoGeometry) {
        const fipsCodes = alert.properties.geocode.SAME || []
        const event = alert.properties.event
        const color = getEventColor(event)

        for (const fips of fipsCodes) {
            let processedFips = fips
            if (processedFips.length === 6 && processedFips.startsWith('0')) {
                processedFips = processedFips.slice(1)
            }
            fipsToColorMap[processedFips] = color
            fipsToAlertMap[processedFips] = alert
        }
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

    map.on('click', 'county-fills', e => {
        const feature = e.features[0]
        const fips = feature.properties.FIPS
        const alert = fipsToAlertMap[fips]

        if (alert) {
            // showAlertInfoPage(alert.properties)
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
