const express = require('express');
const pool = require('./util/db.js');
const crypto = require('crypto');
const cors = require('cors')
const usersRouter = require('./routes/users.js')
const tokenRouter = require('./routes/auth.js')




const userLoginUrl = 'https://supplekick-us.backendless.app/api/users/login';
const userTokenVarifyUrl = 'https://supplekick-us.backendless.app/api/users/isvalidusertoken';

const productsTableUrl = 'https://localhost:5000/api/products';
//let cartUrl = 'https://api.backendless.com/059E0E6C-3A70-434F-B0EE-230A6650EEAE/3AB37559-1318-4AAE-8B26-856956A63050/data/cart';

const amazonBackEndServer = express();
amazonBackEndServer.use(express.urlencoded({ extended: false }));
amazonBackEndServer.use(express.json());
amazonBackEndServer.use(cors());

amazonBackEndServer.use('/api/users', usersRouter)
amazonBackEndServer.use('/api/token', tokenRouter)

amazonBackEndServer.get('/api/products', async (req, res) => {
  const productsQuery = 'SELECT * FROM products'
  const productsQueryResult = await pool.query(productsQuery, [])
  if(productsQueryResult[0].length !== 0) {
    res.json(productsQueryResult[0])
  }
})

amazonBackEndServer.listen(5000, () => {
  console.log('Now Amazon server is created and listening requests from port 5000......');
})