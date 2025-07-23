const express = require('express');
const pool = require('./util/db.js');
const crypto = require('crypto');
const cors = require('cors')
const usersRouter = require('./routes/users.js')
const tokenRouter = require('./routes/auth.js')
const tokenAuth = require('./util/tokenAuth.js')

const userLoginUrl = 'https://supplekick-us.backendless.app/api/users/login';
const userTokenVarifyUrl = 'https://supplekick-us.backendless.app/api/users/isvalidusertoken';
const productsTableUrl = 'https://localhost:5000/api/products';

let cartUrl = 'https://api.backendless.com/api/cart';

const amazonBackEndServer = express();
amazonBackEndServer.use(express.urlencoded({ extended: false }));
amazonBackEndServer.use(express.json());
amazonBackEndServer.use(cors());

amazonBackEndServer.use('/api', usersRouter)
amazonBackEndServer.use('/api/token', tokenRouter)



amazonBackEndServer.get('/api/cart', async (req, res) => {
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

amazonBackEndServer.put('/api/cart/:id', async (req, res) => {
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

amazonBackEndServer.listen(5000, () => {
  console.log('Now Amazon server is created and listening requests from port 5000......');
})