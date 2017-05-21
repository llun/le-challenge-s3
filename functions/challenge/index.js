const AWS = require('aws-sdk')
const path = require('path')

const s3 = new AWS.S3()
exports.handle = (event, context, callback) => {
  const key = event.path.split('/').pop()
  s3.getObject({
    Bucket: process.env.BUCKET,
    Key: path.join('challenges', key)
  }, (error, data) => {
    if (error) return callback(error)
    callback(null, {
      statusCode: 200,
      body: data.Body.toString()
    })
  })
}
