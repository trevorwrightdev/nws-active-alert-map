import { COLOR_MAP, LAYER_STYLES } from '../constants/index.js'
import {
    createMatchExpression,
    alertsToFeatures,
    getCountyAlerts,
    normalizeFipsCode,
} from '../utils/helpers.js'
import { showPopup } from '../components/popup.js'

let fipsToAlertMap = {}

export function addAlertPolygonsLayer(map, alerts) {
    const features = alertsToFeatures(alerts)

    map.addSource('alerts', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features,
        },
    })

    const matchExpr = createMatchExpression('event', COLOR_MAP, '#ff0000')

    map.addLayer({
        id: 'alert-layer',
        type: 'fill',
        source: 'alerts',
        paint: {
            'fill-color': matchExpr,
            'fill-outline-color': matchExpr,
            ...LAYER_STYLES.alertPolygons,
        },
    })

    setupAlertLayerInteractions(map)
}

export function updateAlertPolygons(map, alerts) {
    const features = alertsToFeatures(alerts)
    map.getSource('alerts').setData({
        type: 'FeatureCollection',
        features,
    })
}

export function addCountyLayers(map, countyGeoJson, alerts) {
    map.addSource('counties', {
        type: 'geojson',
        data: countyGeoJson,
    })

    updateFipsToAlertMap(alerts)
    const matchExpr = getCountyFillMatchExpr(alerts)

    map.addLayer({
        id: 'county-fills',
        type: 'fill',
        source: 'counties',
        paint: {
            'fill-color': matchExpr,
            ...LAYER_STYLES.countyFills,
        },
    })

    map.addLayer({
        id: 'county-boundaries',
        type: 'line',
        source: 'counties',
        paint: LAYER_STYLES.countyBoundaries,
    })

    setupCountyLayerInteractions(map)
}

export function addCountyOutlinesLayer(map, countyGeoJson) {
    map.addSource('county-outlines', {
        type: 'geojson',
        data: countyGeoJson,
    })

    map.addLayer({
        id: 'county-outlines',
        type: 'line',
        source: 'county-outlines',
        paint: {
            'line-color': '#cccccc',
            'line-width': 0.5,
            'line-opacity': 0.8,
        },
    })
}

export function updateCountyFills(map, alerts) {
    const matchExpr = getCountyFillMatchExpr(alerts)
    updateFipsToAlertMap(alerts)
    map.setPaintProperty('county-fills', 'fill-color', matchExpr)
}

export function addStateBoundariesLayer(map, stateGeoJson) {
    map.addSource('states', {
        type: 'geojson',
        data: stateGeoJson,
    })

    map.addLayer({
        id: 'state-boundaries',
        type: 'line',
        source: 'states',
        paint: LAYER_STYLES.stateBoundaries,
    })
}

function setupAlertLayerInteractions(map) {
    map.on('click', 'alert-layer', e => {
        const feature = e.features[0]
        showPopup(map, e.lngLat, feature.properties)
    })

    map.on('mousemove', 'alert-layer', e => {
        const feature = e.features[0]
        map.getCanvas().style.cursor = feature ? 'default' : ''
    })
}

function setupCountyLayerInteractions(map) {
    map.on('click', 'county-fills', e => {
        const feature = e.features[0]
        const fips = feature.properties.FIPS
        const alert = fipsToAlertMap[fips]

        if (alert) {
            showPopup(map, e.lngLat, alert.properties)
        }
    })

    map.on('mousemove', 'county-fills', e => {
        const feature = e.features[0]
        if (feature) {
            const fips = feature.properties.FIPS
            const alert = fipsToAlertMap[fips]
            map.getCanvas().style.cursor = alert ? 'default' : ''
        }
    })
}

function getCountyFillMatchExpr(alerts) {
    const countyAlerts = getCountyAlerts(alerts)
    const fipsToColorMap = {}

    for (const alert of countyAlerts) {
        const fipsCodes = alert.properties.geocode.SAME || []
        const event = alert.properties.event
        const color = COLOR_MAP[event] || '#9999ff'

        for (let fips of fipsCodes) {
            const normalizedFips = normalizeFipsCode(fips)
            fipsToColorMap[normalizedFips] = color
        }
    }

    return createMatchExpression('FIPS', fipsToColorMap, '#ffffff')
}

function updateFipsToAlertMap(alerts) {
    fipsToAlertMap = {}

    for (const alert of getCountyAlerts(alerts)) {
        const fipsCodes = alert.properties.geocode.SAME || []

        for (let fips of fipsCodes) {
            const normalizedFips = normalizeFipsCode(fips)
            fipsToAlertMap[normalizedFips] = alert
        }
    }
}
