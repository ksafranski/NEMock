var fs = require("fs"),
	express = require("express"),
	app = express(),
	multipart = require("connect-multiparty"),
	multiparty = multipart(),
	allowCORS,
	Datastore = require("nedb"),
	db = {},
	http_res, respond,
	config = JSON.parse(fs.readFileSync("./config.json"));

/**
 * Data stores *****************************************************************
 */

var i = 0;
while (i < config.dbs.length) {
	db[config.dbs[i]] = new Datastore( config.db_root + config.dbs[i] + ".db" );
	db[config.dbs[i]].loadDatabase();
	i++;
}

/**
 * API, endpoints **************************************************************
 */

// CORS

if (config.cors_domains) {
	allowCORS = function(req, res, next) {
		res.header("Access-Control-Allow-Origin", config.cors_domains);
		res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
		res.header("Access-Control-Allow-Headers", "Content-Type");
		next();
	};
	app.use(allowCORS);
}

// Additional config
app.use(express.json());
app.use(express.urlencoded());

// Setup endpoints

app.get(config.api_root + ":datastore/*", function (req, res) {
	http_res = res;
	if (req.params[0]) {
		// Get specific item
		db[req.params.datastore].find({ _id: req.params[0] }, respond);
	} else {
		// Return table
		db[req.params.datastore].find({}, respond);
	}
});

app.post(config.api_root + ":datastore/*", multiparty, function (req, res) {
	http_res = res;
	if (req.params[0]) {
		db[req.params.datastore].update({ _id: req.params[0] }, req.body, respond);
	} else {
		db[req.params.datastore].insert(req.body, respond);
	}
});

app.put(config.api_root + ":datastore/*", multiparty, function (req, res) {
	http_res = res;
	db[req.params.datastore].update({ _id: req.params[0] }, req.body, respond);
});

app.del(config.api_root + ":datastore/*", function (req, res) {
	http_res = res;
	db[req.params.datastore].remove({ _id: req.params[0] }, respond);
});

respond = function (err, data) {
	if (err) {
		http_res.send(404, { "status": "error", "message": err });
	} else {
		http_res.send(200, { "status": "success", "data": data });
	}
};

/**
 * Static server ***************************************************************
 */

if (config.http_root) {
	app.get("/*", function (req, res) {
		var path = req.params[0] ? req.params[0] : "index.html";
		res.sendfile(path, {
			root: config.http_root
		});
	});
}

/**
 * Startup *********************************************************************
 */

app.listen(config.port);

console.log("Running on " + config.port);