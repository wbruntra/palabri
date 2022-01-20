import _ from 'lodash'
import gen from 'random-seed'

// import words from './data/6-word-list.json'
import words from './data/answers-word-list.json'

import officialWords from './data/valid-word-list-xl.json'
// import officialWords from './data/6-word-list-lg.json'

const md5 = require('md5')

const config = {
  seed: 'cutsleaptbathed',
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
    Ü: 'U',
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
export const wordsHash = md5(JSON.stringify(wordList)).slice(0, 5)
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

export const squares = {
  '-': '⬛',
  Y: '🟨',
  G: '🟩',
  white: '⬜',
}

export async function copyWithWebShare(text) {
  if (navigator.share) {
    return navigator
      .share({
        text,
      })
      .then(() => {
        return 'SUCCESS'
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          return 'SUCCESS'
        } else {
          return 'No se ha podido compartir :('
        }
      })
  } else if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  } else {
    return 'No se ha podido compartir :('
  }
}

export const getShareText = (guesses) => {
  const results = []
  for (const guess of guesses) {
    const key = guess.key.split('').map((k) => squares[k])
    results.push(key.join(''))
  }
  const shareText = `Palabrí ${todaysNumber} ${guesses.length}/6

${results.join('\n')}`

  return shareText
}

export const getStorageKey = () => {
  return `guesses-${getTodaysNumber()}-${wordsHash}`
}
