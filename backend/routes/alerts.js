const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
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
        res.json(data)
    } catch (error) {
        console.error('Error fetching alerts:', error)
        res.status(500).json({ error: 'Failed to fetch alerts' })
    }
})

module.exports = router
