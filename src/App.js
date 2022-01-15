import './App.css'
import { useState, useRef, useEffect } from 'react'
import {
  evaluate,
  getCanonical,
  evaluateToString,
  wordList,
  getTodaysNumber,
  isWordValid,
  getWordHash,
  wordsHash,
  todaysNumber,
  shareScore,
} from './utils'

import _ from 'lodash'

const config = {
  maxListLength: 20,
  storageKey: `guesses-${todaysNumber}-${wordsHash}`,
  maxTries: 6,
}

const getRandomSlice = (arr, size) => {
  const start = Math.floor(Math.random() * (arr.length - size))
  return arr.slice(start, start + size)
}

const getLetterStatus = (guesses) => {
  let result = {}

  const alterStatus = (k, newStatus, previousResult) => {
    const resultCopy = { ...previousResult }
    if (previousResult[k] === 'G') {
      return resultCopy
    } else if (previousResult[k] === 'Y' && newStatus === 'G') {
      // status can only be upgraded from Y to G, never downgraded
      resultCopy[k] = 'G'
    } else if (!previousResult[k]) {
      resultCopy[k] = newStatus
    }
    return resultCopy
  }

  for (const guess of guesses) {
    const key = guess.key
    const word = guess.word
    for (let i = 0; i < word.length; i++) {
      result = alterStatus(word[i], key[i], result)
    }
  }
  return result
}

const Keyboard = ({ guesses, word, setWord, addGuess }) => {
  const letterStatus = getLetterStatus(guesses)

  const getKeyClass = (key) => {
    if (!letterStatus[key]) {
      return ''
    }
    let classes = ['text-white']
    if (letterStatus[key] === 'G') {
      classes.push('green')
    }
    if (letterStatus[key] === 'Y') {
      classes.push('yellow')
    }
    if (letterStatus[key] === '-') {
      classes.push('white')
    }
    return classes.join(' ')
  }

  return (
    <section className="keyboard">
      <div className="keyboard-row">
        {'QWERTYUIOP'.split('').map((k, i) => {
          return (
            <div
              onClick={() => {
                setWord(word + k)
              }}
              key={`key-${k}`}
              className={`keyboard-key ${getKeyClass(k)}`}
            >
              {k}
            </div>
          )
        })}
      </div>
      <div className="keyboard-row">
        {'ASDFGHJKLÑ'.split('').map((k, i) => {
          return (
            <div
              onClick={() => {
                setWord(word + k)
              }}
              key={`key-${k}`}
              className={`keyboard-key ${getKeyClass(k)}`}
            >
              {k}
            </div>
          )
        })}
      </div>
      <div className="keyboard-row">
        <div className="keyboard-key">
          <span
            className="material-icons"
            onClick={() => {
              addGuess()
            }}
          >
            keyboard_return
          </span>
        </div>

        {'ZXCVBNM'.split('').map((k, i) => {
          return (
            <div
              onClick={() => {
                setWord(word + k)
              }}
              key={`key-${k}`}
              className={`keyboard-key ${getKeyClass(k)}`}
            >
              {k}
            </div>
          )
        })}

        <div className="keyboard-key">
          <span
            onClick={() => {
              setWord(word.slice(0, -1))
            }}
            className="material-icons"
          >
            backspace
          </span>
        </div>
      </div>
    </section>
  )
}

function App() {
  const [guesses, setGuesses] = useState([])
  const [word, setWord] = useState('')
  const inputEl = useRef(null)
  const [answer, setAnswer] = useState('HOLLÍN')
  const [error, setError] = useState('')
  const [shareClicked, setSharedClicked] = useState(false)

  const isGameOver = () => {
    return (
      (guesses.length > 0 && guesses[guesses.length - 1].word === answer) ||
      guesses.length === config.maxTries
    )
  }

  const loadGuesses = () => {
    const answer = wordList[todaysNumber]

    const savedGuesses = localStorage.getItem(config.storageKey)
    if (savedGuesses) {
      const plainWords = JSON.parse(savedGuesses)
      const newGuesses = plainWords.map((word) => {
        let key, savedWord
        if (word === getCanonical(answer)) {
          key = word
            .split('')
            .map((c) => 'G')
            .join('')
          savedWord = answer
        } else {
          key = evaluateToString(word, answer)
          savedWord = word
        }
        return {
          word: savedWord,
          key,
        }
      })
      setGuesses(newGuesses)
    }
  }

  useEffect(() => {
    const newAnswer = wordList[todaysNumber]
    setAnswer(newAnswer)

    loadGuesses()
  }, [])

  const reset = () => {
    // setAnswer(newAnswer)
    setGuesses([])
    setWord('')
    inputEl.current.focus()
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
    const filledWord = word.concat('------').slice(0, 6)
    const result = filledWord.split('').map((c, i) => {
      return (
        <div key={`active-${i}`} className={`box white ${c === '-' ? 'invisible' : ''}`}>
          {c}
        </div>
      )
    })
    return result
  }

  const addGuess = (e) => {
    if (e) {
      e.preventDefault()
    }
    if (isGameOver()) {
      return
    }
    const testWord = word.trim()
    if (testWord.length !== 6) {
      setError('La palabra debe tener 6 letras')
      return
    } else {
      setError('')
    }

    if (!isWordValid(testWord)) {
      setError(`${testWord} no es una palabra válida`)
      return
    } else {
      setError('')
    }
    let key, savedWord
    if (testWord === getCanonical(answer)) {
      key = testWord
        .split('')
        .map((c) => 'G')
        .join('')
      savedWord = answer
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

    localStorage.setItem(config.storageKey, JSON.stringify(newGuesses.map((g) => g.word)))

    inputEl.current.focus()
  }

  const victory = guesses.length > 0 && guesses[guesses.length - 1].word === answer

  return (
    <>
      <div className="container">
        <h1>Palabrl {todaysNumber}</h1>
        <ul>
          {guesses.map((guess, i) => {
            return (
              <li className="guess" key={`guess-${i}`}>
                {renderGuess(guess)}
              </li>
            )
          })}
        </ul>
        <ul>
          <li className="guess">{renderActiveGuess()}</li>
        </ul>
        <form onSubmit={addGuess}>
          <fieldset className="mb-0">
            <input
              autoFocus
              ref={inputEl}
              value={word}
              onChange={(e) => {
                if (victory || guesses.length === 6) {
                  return null
                }
                setWord(e.target.value.toUpperCase())
              }}
              placeholder="palabra"
            />
          </fieldset>
          <input className="pure-button" type="submit" value="Comprobar" />
        </form>
        {error !== '' && <p className="error">{error}</p>}
        {victory && (
          <div>
            <p>Felicidades! Has ganado.</p>
          </div>
        )}
        {!victory && guesses.length >= 6 && (
          <div>
            <p>Ya llevas 6 intentos. Has perdido :(</p>
          </div>
        )}
        {isGameOver() && (
          <div>
            <p>La palabra era: {answer}</p>
            {/* <p>
            <button onClick={reset}>Otra vez</button>
          </p> */}
            <p>
              <button
                onClick={() => {
                  setSharedClicked(true)
                  shareScore(guesses)
                }}
              >
                Compartir
              </button>
            </p>
            {shareClicked && <p>El texto ha sido copiado al portapapeles</p>}
          </div>
        )}
      </div>
      <Keyboard word={word} setWord={setWord} guesses={guesses} addGuess={addGuess} />
    </>
  )
}

export default App
