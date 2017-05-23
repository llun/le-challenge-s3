const AWS = require('aws-sdk')
const LE = require('greenlock')

const s3Store = require('le-store-s3')
const s3Challenge = require('le-challenge-s3')

const configs = {
  bucketName: process.env.BUCKET
}
const challenge = s3Challenge.create({ S3: configs })
const instance = LE.create({
  server: process.env.LETSENCRYPT_SERVER || LE.stagingServerUrl,
  store: s3Store.create({ S3: configs, debug: true }),
  challenges: {
    'http-01': challenge,
    'tls-sni-01': challenge,
    'tls-sni-02': challenge
  },
  challengeType: 'http-01',
  agreeToTerms({ tosUrl }, callback) {
    callback(null, tosUrl)
  }
})

exports.handle = (event, context, callback) => {
  const { domain, email } = event
  if (!domain &&  !email) {
    return callback(new Error('required domain and email'))
  }

  console.log(`registering ${domain} with account ${email}`)
  instance.register({
    domains: [ domain ],
    email: email,
    agreeTos: true,
    rsaKeySize: 2048,
    challengeType: 'http-01'
  })
  .then(() => callback(null, { ok: true }))
  .catch(error => callback(error))
}
