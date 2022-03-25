# 404 response test
GET http://localhost:8080/no-such-route

# should get back a 404 response
HTTP/1.1 404

# Extra checks to perform against the response
[Asserts]
# We expect to get back a JSON response with { "status": "error", ... }
jsonpath "$.status" == "error"
# We expect to get back a JSON response with { ..., "error": "404", ... }
jsonpath "$.error.code" == 404
# We expect to get back a JSON response with { ..., "error": "some message" }
jsonpath "$.error.message" isString
