const AWS = require('aws-sdk')
const path = require('path')

const DEFAULT_OPTION = {
  challengeDirs: 'challenges'
}

class Challenge {

  static create(options) {
    return new Challenge(Object.assign({},
      DEFAULT_OPTION,
      options))
  }

  constructor(options) {
    this.options = options
    this.s3 = new AWS.S3(options.S3)
  }

  getOptions() {
    return this.options
  }

  set(args, domain, challengePath, keyAuthorization, done) {
    console.log('[challenge.set]')
    const { challengeDirs } = this.options
    const Bucket = this.options.S3.bucketName
    this.s3.putObject({
      Bucket,
      Key: path.join(challengeDirs, challengePath),
      Body: keyAuthorization
    }, done)
  }

  get(defaults, domain, key, done) {
    console.log('[challenge.get]')
    const { challengeDirs } = this.options
    const Bucket = this.options.S3.bucketName
    this.s3.getObject({
      Bucket,
      Key: path.join(challengeDirs, key)
    }, (err, item) => {
      if (err) return done(err)
      done(null, item.Body.toString())
    })
  }

  remove(defaults, domain, key, done) {
    console.log('[challenge.remove]')
    const { challengeDirs } = this.options
    const Bucket = this.options.S3.bucketName
    this.s3.deleteObject({
      Bucket,
      Key: path.join(challengeDirs, key)
    }, done)
  }

}

module.exports = Challenge
