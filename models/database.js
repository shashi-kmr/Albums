
const pool = require('../routes/lib/postgres');

//to run a query we just pass it to the pool
//after we're done nothing has to be taken care of
//we don't have to return any client to the pool or close a connection

/*pool.query('DROP TABLE albums', function(err, res){

});

pool.query('DROP TABLE image', function(err, res){

})*/

pool.query('SELECT * FROM albums', function(err, res){
	if(err) {
		pool.query('CREATE TABLE albums(_id SERIAL, name VARCHAR(100) PRIMARY KEY, createdat TIMESTAMP NOT NULL DEFAULT now())', function(err, res2) {
			if(err) {
				return console.error('error running query', err);
			}
			console.log(res);
		});
	} else {
		console.log(res);
	}
});

pool.query('SELECT * FROM image', function(err, res){
	if(err) {
		pool.query('CREATE TABLE image(_id SERIAL PRIMARY KEY, name VARCHAR(100), namewithtimestamp VARCHAR(150), path VARCHAR(200) not null, albumname VARCHAR(100) REFERENCES albums(name), createdat TIMESTAMP NOT NULL DEFAULT now(), metaData JSON)', function(err, res2) {
		  	if(err) {
		    	return console.error('error running query', err);
		  	}
		  	console.log(res2);
		});
	} else {
		console.log(res);
	}
});