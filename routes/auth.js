const express = require('express')
const pool = require('../util/db.js')
const router = express.Router()

router.get('/isvalidusertoken/:userToken', async (req, res) => {
  const params = req.params['userToken']
  const tokenQuery = 'SELECT *, CURRENT_TIMESTAMP AS timeNow FROM token WHERE token = ?'
  const tokenQueryResult = await pool.query(tokenQuery, [params])
  if(tokenQueryResult[0].length === 0) {
    res.status(404).send('false')
  }
  else {
    const tokenCreatedTime = new Date(tokenQueryResult[0][0]['created']) 
    const timeNow = new Date(tokenQueryResult[0][0]['timeNow']) 
    const diffHour = (timeNow - tokenCreatedTime) / (1000 * 60 * 60)
  
    if(diffHour > 2) {
      res.status(200).send('false')
    }
    else {
      res.status(200).send('true')
    }
  }
})

module.exports = router