import { MAP_CONFIG } from './constants/index.js'
import { fetchAlerts, fetchJson } from './services/api.js'
import { initializeSocket, socket } from './services/socket.js'
import {
    addAlertPolygonsLayer,
    updateAlertPolygons,
    addCountyLayers,
    updateCountyFills,
    addStateBoundariesLayer,
} from './map/layers.js'
import { populateAlertListPage } from './components/alert-list.js'
import { generateLegend } from './components/legend.js'
import {
    initializeNavigation,
    showAlertInfoPage,
} from './components/navigation.js'

const map = new maplibregl.Map(MAP_CONFIG)

async function initializeApp() {
    const { data: alerts } = await fetchAlerts()
    const countyData = await fetchJson('data/county-shapefile.json')
    const stateData = await fetchJson('data/state-shapefile.json')

    if (!alerts) return

    addCountyLayers(map, countyData, alerts.features)
    addAlertPolygonsLayer(map, alerts.features)
    addStateBoundariesLayer(map, stateData)
    populateAlertListPage(alerts.features)

    map.on('idle', () => {
        document.getElementById('map').style.display = 'block'
    })

    socket.on('alerts-update', alerts => {
        console.log('Updating map...')
        updateAlertPolygons(map, alerts.features)
        updateCountyFills(map, alerts.features)
        populateAlertListPage(alerts.features)
    })
}

generateLegend()
initializeNavigation()

window.showAlertInfoPage = showAlertInfoPage

initializeApp()
