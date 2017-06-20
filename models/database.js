
const pool = require('../routes/lib/postgres');

//to run a query we just pass it to the pool
//after we're done nothing has to be taken care of
//we don't have to return any client to the pool or close a connection
pool.query('CREATE TABLE albums(id SERIAL PRIMARY KEY, name VARCHAR(100) not null, createdAt TIMESTAMP)', function(err, res) {
  if(err) {
    return console.error('error running query', err);
  }
  console.log(res);
});


pool.query('CREATE TABLE image(id SERIAL PRIMARY KEY, name VARCHAR(100), url VARCHAR(200) not null, albumId integer REFERENCES albums, uploadedAt TIMESTAMP, metaData JSON)', function(err, res) {
  if(err) {
    return console.error('error running query', err);
  }
  console.log(res);
});