# NEMock

Simple endpoint mocking with [NodeJS](http://www.nodejs.org), [NEDB](https://github.com/louischatriot/nedb)
and [Express](http://expressjs.com/).

## Getting Started

Installation is as simple as `npm install` to install the dependencies required.

From there it's a simple bit of configuration. Open `/config.json`:

```json
{
    "port": 9090,
    "api_root": "/api/",
    "dbs": [
        "users",
        "todos"
    ],
    "db_root": "./db/",
    "http_root": "./public/",
    "cors_domains": [
        "*"
    ]
}
```

The `port`, `api_root`, `dbs`, and `db_root` are required to run the system. The
`http_root` and `cors_domains` can be set to `false` if you don't plan on using
either the static web server or CORS.

Once configured to taste, simply run the server via `node index.js`.

## Usage

When the server is started it will create the datastores and begin serving the
endpoints at `http://www.server.com:9090/api/` (for instance) and (optionally)
will provide CORS and static web services.

From here any http requests made against the endpoints will respond with the
action to, or data from the request.

The response will be either:

**Success (200):**

```json
{
	"status": "success",
	"data": [
		...
	]
}
```

**Error (404):**

```json
{
	"status": "error",
	"message": "..."
}
```

## License

The software is licensed under the MIT-style license. Other licenses for the
dependencies should be consulted before utilizing any source code.
