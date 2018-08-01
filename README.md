# MockServer

## Requirements

### Global
* [NodeJS](https://nodejs.org/en/download/)
* [Yarn](https://yarnpkg.com/en/docs/install) (*optional*)

### Environment file
```
cp .env.default .env
```
You can customize the `HOST` and the `PORT` of the application.
The default URL is: http://localhost:1337.

## Commands

* Install dependencies
```bash
yarn
```

* Start dev
```bash
yarn start
```

* Tests
```bash
yarn test
```

* Build for production
```bash
yarn build
```

* Start the production version (not for real prod).
```bash
yarn serve
```

## How to use

You have to configure your routes in JSON file in the directory `/config`. An file `example.json` is here to give you some examples.

- Each configuration file must have a different *prefix*, and have an `Array` of *urls*.
- Server is using `Content-Type: application/json` header to parse body parameters.
- You should use `String` only in the JSON configuration files for the request parameters (instead of `Number`).
- You can specify for a delay in your request, by adding a `async` property, giving an mount in *ms*.

### Example

```json
{
  "prefix": "/example",
  "urls": [{
    "async": 1000,
    "request": {
      "pattern": "",
      "method": "GET",
      "queryParams": {
        "offset": "0",
        "limit": "10"
      }
    },
    "response": {
      "status": 200,
      "body": [{
        "id": 1,
        "title": "Example 1"
      }, {
        "id": 2,
        "title": "Example 2"
      }]
    }
  }, {
    "request": {
      "pattern": "",
      "method": "POST",
      "bodyParams": {
        "title": "Create example"
      }
    },
    "response": {
      "status": 201,
      "body": {
        "id": 3,
        "title": "Create example"
      }
    }
  }, {
    "request": {
      "pattern": "",
      "method": "POST"
    },
    "response": {
      "status": 400
    }
  }, {
    "request": {
      "pattern": "/42",
      "method": "PUT",
      "bodyParams": {
        "title": "Unknown example"
      }
    },
    "response": {
      "status": 404
    }
  }, {
    "request": {
      "pattern": "/1",
      "method": "DELETE"
    },
    "response": {
      "status": 403
    }
  }]
}
```

### Random data

To use the random data system you have to put the key `random` in the response of an URL. You configure the behavior for each URL.

* `type` of the response, can be an `Array` or `Object`.
* `amount` is used when the `type` is an `Array`, the amount of random entities to generate.
* `entity` is a list of property definitions.

The system is based on the [Faker](https://github.com/Marak/faker.js) library, and you can use most of the basic methods. An `entity` is based on these parameters:

* `name`, the property name.
* `method`, the method used with the **faker** library.

Examples:
```js
// Configuration
{
  "name": "id",
  "method": "random.uuid"
}
// Result
{
  "id": "24ff1cd8-4caf-4bd5-8b55-759c1030b92d",
}
```

You can see complete working examples in the `config/ directory.

### Regex

Express is handling regex in the routes. You can use some for your configurations.

In the above example, we get a random entity, for every URL called with a number:
- `GET /42`
- `GET /89784312`

```json
{
  "request": {
    "pattern": "/[0-9]+",
    "method": "GET"
  },
  "response": {
    "status": 200,
    "random": {
      "type": "Object",
      "entity": [{
        "name": "id",
        "method": "random.uuid"
      }, {
        "name": "name",
        "method": "name.findName"
      }]
    }
  }
}
```

In the next example, we get a random entity, for every every URL starting with `article`:
- `GET /article`
- `GET /article-by-him`
- `GET /articles/42`
- `GET /article/comment-89`

```json
{
  "request": {
    "pattern": "/article*",
    "method": "GET"
  },
  "response": {
    "status": 200,
    "random": {
      "type": "Object",
      "entity": [{
        "name": "id",
        "method": "random.number"
      }, {
        "name": "description",
        "method": "lorem.lines"
      }]
    }
  }
}
```

### Custom headers in a response

You can configure the headers you want in a response. You have to define them as an *Object*, where keys are the header name, and value, the header value
(following this [express method](https://expressjs.com/en/api.html#res.set)).

Example:
```json
{
  "request": {
    "pattern": "/text",
    "method": "GET"
  },
  "response": {
    "status": 200,
    "headers": {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*"
    },
    "body": "My full response in Text"
  }
}
```
## Resources

- [Example Node Server w/ Babel](https://github.com/babel/example-node-server)
- [Express Routing](http://expressjs.com/en/guide/routing.html)
- [Faker demo](https://rawgit.com/Marak/faker.js/master/examples/browser/index.html)