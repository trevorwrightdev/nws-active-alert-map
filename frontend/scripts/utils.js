async function fetchAlerts() {
    try {
        const response = await fetch('http://localhost:3001/alerts')

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return { data: data.features, error: null }
    } catch (error) {
        console.error('Error fetching alerts:', error)
        return { data: null, error: error.message }
    }
}

async function getJson(url) {
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

function convertSameToFips(same) {
    if (typeof same !== 'string') return null
    if (same.length === 6 && same.startsWith('0')) return same.slice(1)
    if (same.length === 5) return same
    return null
}
