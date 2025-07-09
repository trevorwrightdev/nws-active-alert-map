import { COLOR_MAP } from '../constants/index.js'

export function generateLegend() {
    const legendContainer = document.getElementById('legend')
    legendContainer.innerHTML = ''

    Object.entries(COLOR_MAP).forEach(([eventType, color]) => {
        const legendItem = document.createElement('div')
        legendItem.className = 'legend-item'

        const colorDiv = document.createElement('div')
        colorDiv.className = 'legend-item-color'
        colorDiv.style.backgroundColor = color

        const labelDiv = document.createElement('div')
        labelDiv.className = 'legend-item-label'

        const labelText = document.createElement('span')
        labelText.className = 'legend-item-label-text'
        labelText.textContent = eventType

        labelDiv.appendChild(labelText)
        legendItem.appendChild(colorDiv)
        legendItem.appendChild(labelDiv)
        legendContainer.appendChild(legendItem)
    })
}
