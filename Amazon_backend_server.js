const express = require('express');
const pool = require('./util/db.js');
const crypto = require('crypto');
const cors = require('cors')
const usersRouter = require('./routes/users.js')
const tokenRouter = require('./routes/auth.js')
const tokenAuth = require('./util/tokenAuth.js')

const amazonBackEndServer = express();
amazonBackEndServer.use(express.urlencoded({ extended: false }));
amazonBackEndServer.use(express.json());
amazonBackEndServer.use(cors());

amazonBackEndServer.use('/api', usersRouter)
amazonBackEndServer.use('/api/token', tokenRouter)

amazonBackEndServer.use((req, res) => {
  res.status(404).send('Unexpected requests detected.')
})

amazonBackEndServer.listen(5000, () => {
  console.log('Now Amazon server is created and listening requests from port 5000......');
})