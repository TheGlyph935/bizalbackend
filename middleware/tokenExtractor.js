/* eslint-disable no-unused-vars */

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  console.log('------')
  let token = ''
  if(authorization && authorization.toLowerCase().startsWith('bearer ')){
    token =  authorization.substring(7) //removes bearer from token and returns token only
  } else{
    token = null
  }

  request.token = token

  next()
}

module.exports = tokenExtractor