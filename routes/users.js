const express = require('express')
const pool = require('../util/db.js')
const router = express.Router()

router.post('/login', async (req, res) => {
  const queryUserInfo = 'SELECT * FROM users WHERE userEmail = ? AND userPassword = ?'
  const userInfoQueryResult = await pool.query(queryUserInfo, [req.body.login, req.body.password])
  console.log(userInfoQueryResult);
  if(userInfoQueryResult[0].length === 0) {
    res.status(404).send('false')
  }
  else {
    //------below insert a new token for the user----//
    const token = crypto.randomBytes(32).toString('hex')
    const userId = userInfoQueryResult[0][0]['objectId']
    const tokenQuery = 'INSERT INTO token(token, userId) VALUES(?, ?)'
    await pool.query(tokenQuery, [token, userId])
    //------below update the lastLogin column for the user----//
    const userInfoUpdateQuery = 'UPDATE users SET lastLogin = CURRENT_TIMESTAMP() WHERE objectId = ?'
    await pool.query(userInfoUpdateQuery, [userId])

    res.status(200).json({'objectId': userId, 'user-token': token})
  }
})

module.exports = router