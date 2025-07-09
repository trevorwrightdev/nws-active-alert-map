export const API_BASE_URL = 'http://localhost:3001'

export async function fetchAlerts() {
    try {
        const response = await fetch(`${API_BASE_URL}/alerts`)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return { data, error: null }
    } catch (error) {
        console.error('Error fetching alerts:', error)
        return { data: null, error: error.message }
    }
}

export async function fetchJson(url) {
    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error(`Error fetching ${url}:`, error)
        throw error
    }
}
