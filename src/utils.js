import _ from 'lodash'
import gen from 'random-seed'
import words from './6-word-list.json'

export const getTodaysNumber = () => {
  const d = new Date()
  const msPerDay = 60 * 60 * 24 * 1000
  return Math.floor((d / msPerDay) - 19006)
}

const getWords = () => {
  const seed = 'favoredmeltinglyonelconsentniece'
  const rand = gen.create(seed)

  const start = Math.floor(rand.random() * (words.length - 400))

  return words.slice(start, start + 400)
}

export const wordList = getWords()

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

// const s = 'HABÍAN'

// const e = evaluate(s, 'MENTIA')

// const c = getCanonical(s)
// console.log(e)
