import _ from 'lodash'
import gen from 'random-seed'

// import words from './data/6-word-list.json'
import words from './data/answers-word-list.json'

import officialWords from './data/valid-word-list-xl.json'
// import officialWords from './data/6-word-list-lg.json'

const md5 = require('md5')

const config = {
  seed: 'swordgather',
}

export const getTodaysNumber = () => {
  const d = new Date()
  const msPerDay = 60 * 60 * 24 * 1000
  return Math.floor(d / msPerDay - 19006)
}

export const getCanonical = (s) => {
  let canonical = s.slice()
  const accents = {
    Á: 'A',
    É: 'E',
    Í: 'I',
    Ó: 'O',
    Ú: 'U',
  }
  _.forEach(accents, (plainVowel, accented) => {
    canonical = canonical.replace(accented, plainVowel)
  })

  return canonical
}

const allWordsCanonical = new Set(officialWords.map((word) => getCanonical(word)))

export const isWordValid = (word) => {
  return allWordsCanonical.has(word)
}

const getRandomSample = (arr, size, seed) => {
  const idxs = new Set()
  const rand = gen.create(seed)
  while (idxs.size < size) {
    idxs.add(rand.range(arr.length))
  }
  const result = Array.from(idxs)
  return result.map((idx) => arr[idx])
}

const getWords = () => {
  // const seed = config.seed
  // const rand = gen.create(seed)

  const ourWordList = getRandomSample(words, 400, config.seed)
  // console.log(ourWordList)

  return ourWordList
}

export const wordList = getWords()
export const wordsHash = md5(JSON.stringify(wordList)).slice(0, 9)
export const todaysNumber = getTodaysNumber()

export const getWordHash = () => {
  return md5(JSON.stringify(wordList)).slice(0, 9)
}

const replaceAtIndex = (str, idx) => {
  let newString = str.split('')
  newString[idx] = '-'
  return newString.join('')
}

export const evaluateToString = (guess, answer) => {
  let remainingAnswer = getCanonical(answer.slice())
  // console.log(remainingAnswer)
  const result = []
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === remainingAnswer[i]) {
      result[i] = 'G'
      remainingAnswer = replaceAtIndex(remainingAnswer, i)
    }
  }
  for (let i = 0; i < guess.length; i++) {
    if (result[i]) {
      continue
    }
    if (remainingAnswer.includes(guess[i])) {
      result[i] = 'Y'
      remainingAnswer = remainingAnswer.replace(guess[i], '-')
    } else {
      result[i] = '-'
    }
  }
  return result.join('')
}

// const s = 'HABÍAN'

// const e = evaluate(s, 'MENTIA')

// const c = getCanonical(s)
// console.log(e)

export const squares = {
  '-': '⬛',
  Y: '🟨',
  G: '🟩',
  white: '⬜',
}

export async function copyTextToClipboard(text) {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text)
  } else {
    return document.execCommand('copy', true, text)
  }
}

export const shareScore = (guesses) => {
  const results = []
  for (const guess of guesses) {
    const key = guess.key.split('').map((k) => squares[k])
    results.push(key.join(''))
  }
  const shareText = `Palabrl ${todaysNumber} ${guesses.length}/6
  
${results.join('\n')}`

  return copyTextToClipboard(shareText)
}

export const getStorageKey = () => {
  return `guesses-${getTodaysNumber()}-${wordsHash}`
}
