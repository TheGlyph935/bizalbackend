/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { max } = require('lodash')
const _ = require('lodash')

const mostBlogs = (blogs) => {
  const authors = []
  blogs.forEach(value => {
    let author = value.author
    authors.push(author)
  })

  const mostRepeated = _.max(authors)
  const mostRepeatedArray = authors.filter(value => value === mostRepeated)

  const authorObject = {
    author: `${mostRepeated}`,
    blogCount: mostRepeatedArray.length
  }
  return JSON.stringify(authorObject)
}

const mostTotalLikes = (blogs) => {
  const totalAuthors = []
  blogs.forEach((value, i) => {
    if(totalAuthors.filter(author => author.author === value.author).length > 0){
      const index = _.findIndex(totalAuthors, ['author', value.author])
      totalAuthors[index].likes += value.likes
    } else{
      totalAuthors.push(value)
    }
  })

  const likesArray = []
  totalAuthors.forEach(value => likesArray.push(value.likes))

  const index = _.findIndex(totalAuthors, ['likes', _.max(likesArray)])
  const answer = {
    author: `${totalAuthors[index].author}`,
    likes: totalAuthors[index].likes
  }
  return JSON.stringify(answer)
}

const totalLikes = (blogs) => {
  let likes = []

  for(let i = 0; i < blogs.length; i++){
    likes.push(blogs[i].likes)
  }

  if(blogs.length === 1){
    return likes[0]
  } else{
    return likes.reduce((previous, current) => previous + current, 0)
  }
}

const mostLikes = (blogs) => {

  if(blogs.length === 1){
    return blogs[0]
  } else{
    let likesOfBlogs = []
    blogs.forEach(value => {
      likesOfBlogs.push(value.likes)
    })

    const maxLike = Math.max.apply(Math, likesOfBlogs)
    return blogs.filter(blog => blog.likes === maxLike)[0]
  }
}



module.exports = {
  totalLikes,
  mostTotalLikes,
  mostLikes,
  mostBlogs
}