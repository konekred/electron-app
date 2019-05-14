const ADODB = require('node-adodb')
const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=/home/ark/develop/database/PaySight.mdb;')

connection
  .query('SELECT * FROM Dummy')
  .then(data => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(error => {
    console.error(error);
  })