import './App.css'
import { useState, useRef, useEffect } from 'react'
// import starterList from './starterList.json'
import { evaluate, getCanonical, evaluateToString, wordList, getTodaysNumber } from './utils'
// import wordList from './6-word-list.json'
import _ from 'lodash'

const config = {
  maxListLength: 20,
}

const getRandomSlice = (arr, size) => {
  const start = Math.floor(Math.random() * (arr.length - size))
  return arr.slice(start, start + size)
}

function App() {
  const [guesses, setGuesses] = useState([])
  const [word, setWord] = useState('')
  const inputEl = useRef(null)
  const [answer, setAnswer] = useState('HOLLÍN')
  const [error, setError] = useState('')
  // const [victory, setVictory] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const loadGuesses = () => {
    const savedGuesses = localStorage.getItem(`guesses-${getTodaysNumber()}`)
    if (savedGuesses) setGuesses(JSON.parse(savedGuesses))
  }

  useEffect(() => {
    const day = getTodaysNumber()
    const newAnswer = wordList[getTodaysNumber()]
    setAnswer(newAnswer)

    loadGuesses()
  }, [])

  const reset = () => {
    // setAnswer(newAnswer)
    setGuesses([])
    setWord('')
    inputEl.current.focus()
    // setVictory(false)
    setGameOver(false)
  }

  const renderGuess = (guess) => {
    return guess.key.split('').map((c, i) => {
      if (c === 'G') {
        return (
          <div key={`guess-${i}`} className="box green">
            {guess.word[i]}
          </div>
        )
      }
      if (c === 'Y') {
        return (
          <div key={`guess-${i}`} className="box yellow">
            {guess.word[i]}
          </div>
        )
      }
      return (
        <div key={`guess-${i}`} className="box white">
          {guess.word[i]}
        </div>
      )
    })
  }

  const renderActiveGuess = () => {
    const result = word.split('').map((c) => {
      return <div className="box white">{c}</div>
    })
    return result
  }

  const addGuess = (e) => {
    e.preventDefault()
    const testWord = word.trim()
    if (testWord.length !== 6) {
      setError('La palabra debe tener 6 letras')
      return
    } else {
      setError('')
    }
    // console.log(answer)
    let key, savedWord
    if (testWord === getCanonical(answer)) {
      key = testWord
        .split('')
        .map((c) => 'G')
        .join('')
      savedWord = answer
      // setVictory(true)
      setGameOver(true)
    } else {
      key = evaluateToString(testWord, answer)
      savedWord = testWord
    }
    const newGuesses = [
      ...guesses,
      {
        word: savedWord,
        key,
      },
    ]
    setGuesses(newGuesses)
    setWord('')

    console.log(JSON.stringify(newGuesses))

    localStorage.setItem(`guesses-${getTodaysNumber()}`, JSON.stringify(newGuesses))

    inputEl.current.focus()
  }

  const tries = guesses.length
  const victory = guesses.length > 0 && guesses[guesses.length - 1].word === answer

  return (
    <div className="container">
      <h1>Palabrl {getTodaysNumber()}</h1>
      <ul>
        {guesses.map((guess, i) => {
          return (
            <li className="guess" key={`guess-${i}`}>
              {renderGuess(guess)}
            </li>
          )
        })}
      </ul>
      <form onSubmit={addGuess}>
        <fieldset className="mb-0">
          <input
            autoFocus
            ref={inputEl}
            value={word}
            onChange={(e) => setWord(e.target.value.toUpperCase())}
            placeholder="palabra"
          />
        </fieldset>
        <input className="pure-button" type="submit" value="Add Guess" />
      </form>
      {error !== '' && <p className="error">{error}</p>}
      {victory && (
        <div>
          <p>Felicidades! Has ganado.</p>
        </div>
      )}
      {!victory && guesses.length >= 6 && (
        <div>
          <p>Ya llevas 7 intentos. Has perdido :(</p>
        </div>
      )}
      {((guesses.length > 0 && guesses[guesses.length - 1].word === answer) ||
        guesses.length >= 6) && (
        <div>
          <p>La palabra era: {answer}</p>
          {/* <p>
            <button onClick={reset}>Otra vez</button>
          </p> */}
        </div>
      )}
    </div>
  )
}

export default App
