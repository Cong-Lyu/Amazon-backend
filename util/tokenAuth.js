const pool = require('./db.js')

async function tokenAuth(userToken) {
  const tokenQuery = 'SELECT *, CURRENT_TIMESTAMP AS timeNow FROM token WHERE token = ?'
  const tokenQueryResult = await pool.query(tokenQuery, [userToken])
  if(tokenQueryResult[0].length === 0) {
    return false
  }
  else {
    const tokenCreatedTime = new Date(tokenQueryResult[0][0]['created']) 
    const timeNow = new Date(tokenQueryResult[0][0]['timeNow']) 
    const diffHour = (timeNow - tokenCreatedTime) / (1000 * 60 * 60)
  
    if(diffHour > 2) {
      return false
    }
    else {
      return true
    }
  }
}

module.exports = tokenAuth