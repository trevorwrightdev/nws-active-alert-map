import { COLOR_MAP, FALLBACK_COLOR } from '../constants/index.js'

export function getEventColor(event) {
    return COLOR_MAP[event] || FALLBACK_COLOR
}

export function normalizeFipsCode(fips) {
    if (fips.length === 6 && fips.startsWith('0')) {
        return fips.slice(1)
    }
    return fips
}

export function truncateText(text, maxLength = 50) {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}

export function createMatchExpression(
    property,
    colorMap,
    fallbackColor = '#ffffff'
) {
    const matchExpr = ['match', ['get', property]]

    for (const [key, color] of Object.entries(colorMap)) {
        matchExpr.push(key, color)
    }

    matchExpr.push(fallbackColor)
    return matchExpr
}

export function alertsToFeatures(alerts) {
    return alerts
        .filter(alert => alert.geometry && alert.geometry.coordinates)
        .map(alert => ({
            type: 'Feature',
            geometry: alert.geometry,
            properties: alert.properties || {},
        }))
}

// County alerts are alerts that don't have geometry. Otherwise we would just draw the polygon.
export function getCountyAlerts(alerts) {
    return alerts.filter(
        alert =>
            alert.geometry === null &&
            alert.properties?.geocode?.SAME?.length > 0
    )
}
