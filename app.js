var express = require('express');
var bodyParser = require('body-parser')
var app = express();

app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));

// database
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'iam'
});

connection.connect();

app.post('/', function(req, res){
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var address = req.body.address;
	var company = req.body.company;
	var salary = req.body.salary;

	var sql = 'INSERT INTO people (first_name, last_name, address, company, salary) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [firstname, lastname, address, company, salary], function(err, result, fields){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/');
    }
  });	
})

app.get('/', function(req,res){
	var sql = 'SELECT first_name, last_name, company, salary FROM people';
  	connection.query(sql, function(err, results, fields){
	    if(err){
	      console.log(err);
	      res.status(500).send('Internal Server Error');
	    }
	    else{
  	      if (req.query.cost != undefined) {
		    cost_val = req.query.cost
	        res.render('form', {people: results, cost: cost_val});
		  } else{
	        res.render('form', {people: results});
	  	  }
	    }
	});
})

app.post('/cost', function(req, res){
	var company = req.body.company;
	// select company, avg(salary) as cost from people group by company;
	var sql = 'SELECT avg(salary) as cost from people where company=?'
  connection.query(sql, company, function(err, result, fields){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/?cost='+result[0].cost);
    }
  });	
})


app.listen(3000, function(){
  console.log("Connected 3000 port!");
});

