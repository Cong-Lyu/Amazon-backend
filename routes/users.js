const express = require('express')
const pool = require('../util/db.js')
const crypto = require('crypto');
const router = express.Router()

router.post('/users/login', async (req, res) => {
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

router.get('/products', async (req, res) => {
  const productsQuery = 'SELECT * FROM products'
  const productsQueryResult = await pool.query(productsQuery, [])
  if(productsQueryResult[0].length !== 0) {
    res.status(200).json(productsQueryResult[0])
  }
})

router.post('/cart', async (req, res) => {
  if(!req.headers['user-token']) {
    res.status(404).send('user token is not provided!')
  }
  //-----we assume that the validation of the token is executed at the front end site------//
  else {
    console.log(req.body)
    const userObjectId = req.body['userObjectId']
    const productObjectId = req.body['productObjectId']
    const productQuantity = req.body['productQuantity']
    const productInsertQuery = 'INSERT INTO cart(userObjectId, productObjectId, productQuantity) VALUES(?, ?, ?)'
    const insertResult = await pool.query(productInsertQuery, [userObjectId, productObjectId, productQuantity])
    console.log(insertResult)
    res.status(200).send('INSERTION SUCCEEDS')
  }
})

router.get('/cart', async (req, res) => {
  if(tokenAuth(req.headers['userToken'])) {
    const allowedFields = ['userObjectId', 'productObjectId']; // only fields in this are allowed.
    let retrievalQuery = 'SELECT * FROM cart WHERE 1=1'
    const keyPairs = req.query
    const keys = Object.keys(keyPairs)
    const values = []
    for (const key of keys) {
      if(allowedFields.includes(key)) {
        retrievalQuery += ` AND ${key} = ?`
        values.push(Number(keyPairs[key]))
      }
      else {
        return res.status(404).send('Wrong field name!')
      }
    }
    const retrievalResult = await pool.query(retrievalQuery, values)
    return res.status(200).json(retrievalResult[0])
  }
  else {
    return res.status(404).send('You have not logged in yet!')
  }
})

router.put('/cart/:id', async (req, res) => {
  if(!req.headers['user-token']) {
    res.status(404).send('user token is not provided!')
  }
  //-----we assume that the validation of the token is executed at the front end site------//
  else {
    const num = req.params['id']
    const productObjectId = req.body['productObjectId']
    const productQuantity = req.body['productQuantity']
    const productInsertQuery = 'UPDATE cart SET productQuantity = ? WHERE productObjectId = ?'
    const insertResult = await pool.query(productInsertQuery, [productQuantity, productObjectId])
    res.status(200).send(insertResult)
  }
})

module.exports = router