const express = require('express')
const pool = require('../util/db.js')
const crypto = require('crypto');
const router = express.Router()
const tokenAuth = require('../util/tokenAuth.js')

router.get('/isvalidusertoken/:userToken', async (req, res) => {
  if(tokenAuth(req.params['userToken'])) {
    res.status(200).send('true')
  }
  else {
    res.status(404).send('please log in.')
  }
})

module.exports = router