# le-challenge-s3

Use S3 for storing challenge key from ACME and serve it via AWS Lambda

## Using

My setup is using with [le-store-s3](https://github.com/llun/le-store-s3) to store all certificates inside S3 and use AWS API gateway to serve challenge.

After API Gateway is setup, run script below to register domain
```js
const S3 = {
  bucketName: 'letsencrypt'
}

const store = require('le-store-s3').create({ S3 })
const challenge = require('le-challenge-s3').create({ S3 })

const instance = LE.create({
  store,
  challenges: { 'http-01': challenge },
  challengeType: 'http-01',
  agreeToTerms (opts, callback) {
    callback(null, opts.tosUrl)
  }
})
instance.register({
  domains: ['awesome.domain'],
  email: 'green@rabbit.candy',
  agreeTos: true,
  rsaKeySize: 2048,
  challengeType: 'http-01'
})
```
or invoke lambda function with below event
```json
{
  "email": "green@rabbit.candy",
  "domain": "awesome.domain"
}
```

## Lambda function setup

Use [apex](apex.run) to deploy all functions `apex deploy` and setup API Gateway with below schema

```yaml
---
swagger: "2.0"
info:
  version: "2017-05-21T13:41:32Z"
  title: "Letsencrypt"
basePath: "/live"
schemes:
- "https"
paths:
  /{acme+}:
    get:
      produces:
      - "application/json"
      parameters:
      - name: "acme"
        in: "path"
        required: true
        type: "string"
      responses:
        200:
          description: "200 response"
          schema:
            $ref: "#/definitions/Empty"
    options:
      consumes:
      - "application/json"
      produces:
      - "application/json"
      responses:
        200:
          description: "200 response"
          schema:
            $ref: "#/definitions/Empty"
          headers:
            Access-Control-Allow-Origin:
              type: "string"
            Access-Control-Allow-Methods:
              type: "string"
            Access-Control-Allow-Headers:
              type: "string"
definitions:
  Empty:
    type: "object"
    title: "Empty Schema"

```

And point your domain to this API Gateway. My setup is using Cloudflare with redirect rule to redirect to this url.

## License

ISC
