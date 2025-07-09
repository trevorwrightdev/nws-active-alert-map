async function getAlerts() {
    try {
        const response = await fetch('https://api.weather.gov/alerts/active', {
            headers: {
                'User-Agent': '(trevdev.me, contact@trevdev.me)',
                Accept: 'application/geo+json',
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return { data, error: null }
    } catch (error) {
        console.error('Error fetching alerts:', error)
        return { data: null, error: 'Failed to fetch alerts' }
    }
}

module.exports = { getAlerts }
