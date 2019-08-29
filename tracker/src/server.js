const config = require('../config')
const fastify = require('fastify')({
  "maxParamLength": 2048,
  "trustProxy": true
})
const Redis = require('redis')
const assert = require('assert')
const crypto = require('crypto')
const fs = require('fs')
fastify.register(require('fastify-cookie'))

const UID_SIZE = 8
const SID_SIZE = 8
const UID_TTL = 60 * 60 * 24 * 90 // 90d
const SID_TTL = 60 * 60 * 1 // 1h
const PROXYPAGE_TPL = fs.readFileSync('./src/proxypage.html')

const REDIRECT_TYPE_LOCATION = 1
const REDIRECT_TYPE_PROXY_PAGE = 2

const redisClient = Redis.createClient(config.cache)

const getUserId = (request) => {
  if('uid' in request.cookies && request.cookies.uid.length === UID_SIZE * 2) {
    return request.cookies.uid
  }
  return crypto.randomBytes(UID_SIZE).toString('hex') 
}

const buildSessionId = () => crypto.randomBytes(SID_SIZE).toString('hex')
const getSessionId = (request) => request.cookies.sid || request.query.sid || null
const buildTargetUrl = (encodedUrl, query) => {
  var targetUrl = Buffer.from(encodedUrl, 'base64').toString('ascii')
  Object.keys(query).forEach((key) => {
    targetUrl = targetUrl.replace(new RegExp('\{'+key+'\}', 'g'), query[key])
  })
  return targetUrl
}


const handleTransition = async (request, reply) => {
  
  const sessionId = getSessionId(request)
  const userId = getUserId(request)
  const source = request.params.src.toString().toUpperCase()
  const affiliate = request.params.aff.toString().toUpperCase()
  const campaign = request.params.campaign
  
  reply.setCookie('uid', userId, { maxAge: UID_TTL, path: '/' })
  assert(sessionId, 'Session is empty')
  
  const targetUrl = buildTargetUrl(request.params.encodedUrl, request.query)
  try {
    new URL(targetUrl)
  } catch(e) {
    throw new Error('Wrong URL')
  }
  reply.redirect(targetUrl)
  
  redisClient.rpush('events', JSON.stringify({
    'type': 'transition',
    'timeMs': Date.now(),
    'uid': userId,
    'sid': sessionId,
    'query': request.query,
    'headers': request.headers,
    'campaign': campaign,
    'src': source,
    'aff': affiliate,
    'ip': request.headers['x-real-ip']
  }))
}

/**
 * Handle click request
 * @param {Request} request 
 * @param {Reply} reply 
 */
const handleClick = async (request, reply) => {

  const source = request.params.src.toString().toUpperCase()
  const affiliate = request.params.aff.toString().toUpperCase()
  const campaign = request.params.campaign
  const userId = getUserId(request)
  const sessionId = buildSessionId()
  const redirectType = parseInt(request.query.rt) || REDIRECT_TYPE_PROXY_PAGE

  reply.setCookie('uid', userId, { maxAge: UID_TTL, path: '/' })
  reply.setCookie('sid', sessionId, { maxAge: SID_TTL, path: '/' })
   
  assert(source.length === 3, 'Source must be string with 3 letters')
  assert(affiliate.length === 3, 'Affiliate network must be string with 3 letters')
  assert(request.params.encodedUrl.length, 'URL is not correct')
  assert(request.query.subid, 'Subid is not provided')

  const targetUrl = buildTargetUrl(request.params.encodedUrl, request.query)
  try {
    new URL(targetUrl)
  } catch(e) {
    throw new Error('Wrong URL')
  }

  switch(redirectType) {
    case REDIRECT_TYPE_LOCATION: 
      reply.redirect(targetUrl);
      break;
    case REDIRECT_TYPE_PROXY_PAGE:
      reply
        .header('Content-Type', 'text/html; charset=utf-8')
        .send(PROXYPAGE_TPL)
      break;
    default:
      throw new Error('Unknown redirect type');
  }

  redisClient.rpush('events', JSON.stringify({
    'type': 'click',
    'timeMs': Date.now(),
    'headers': request.headers,
    'query': request.query,
    'campaign': campaign,
    'src': source,
    'aff': affiliate,
    'ip': request.headers['x-real-ip'],
    'uid': userId,
    'sid': sessionId,
    'redirectType': redirectType
  }))
}

/** ROUTES */

fastify.route({
  method: 'GET',
  url: '/click/:src/:aff/:campaign/:encodedUrl',
  handler: handleClick
})

fastify.route({
  method: 'GET',
  url: '/transition/:src/:aff/:campaign/:encodedUrl',
  handler: handleTransition
})

fastify.route({
  method: 'GET',
  url: '/aboutme',
  handler: async (request, reply) => {
    reply.send({
      ip: request.headers['x-real-ip'],
      ua: request.headers['user-agent'],
      headers: request.headers
    })
  }
})

/**
 * RUN THE SERVER!
 */
const start = async () => {
  try {
    await fastify.listen(80, '0.0.0.0')
    console.log(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}
start()