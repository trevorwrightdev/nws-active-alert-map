async function fetchAlerts() {
    try {
        const response = await fetch('http://localhost:3001/alerts')

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
