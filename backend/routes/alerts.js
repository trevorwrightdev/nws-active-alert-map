const express = require('express')
const router = express.Router()
const { getAlerts } = require('../utils/get-alerts')

router.get('/', async (req, res) => {
    const { data, error } = await getAlerts()

    if (error) {
        res.status(500).json({ error })
    } else {
        res.json(data)
    }
})

module.exports = router
