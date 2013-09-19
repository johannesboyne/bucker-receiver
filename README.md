bucker-receiver
===============

A simple logging service for the simple [bucker](https://github.com/nlf/bucker) logging module.

Usage
=====

This is a drop in thing. You can just start the server be running:
```
node index.js
```
inside the bucker-receiver folder, or by requiring it inside your main application
```javascript
// ...
require('bucker-receiver');
// ...
```
it will automatically start a new http-server instance. Then it is possible to call the configured endpoint from a frontend application (html / curl / it's up to you) to send front-end logs to the receiver:

#### Curl Example

```
$ curl http://localhost:1337 \
-X PUT \
-H "content-type: application/json" \
-d '{"msg": "Hello world", "level": "info"}'

> {"success":true,"logged":"Hello world","loglevel":"info"}
```

#### HTML Example

```html
<html>
<body>
<script src="http://localhost:1337/brc.js" type='text/javascript'></script>
<script>
bucker.log("test"); // this will be logged to the bucker-receiver 
</script>
</body>
</html>
```


### Configuration

Use the `brc.json` to configure `bucker-receiver`. `brc.json` will be used to configure [bucker](https://github.com/nlf/bucker) and to configure `bucker-receiver` as well. Goto [bucker](https://github.com/nlf/bucker) to read more about it's configuration.

