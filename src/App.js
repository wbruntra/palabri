// import './App.css'
import { useState, useRef, useEffect } from 'react'
import {
  getCanonical,
  evaluateToString,
  wordList,
  getTodaysNumber,
  isWordValid,
  shareScore,
  getStorageKey,
} from './utils'

import HistoryModal from './Modal'
import Navbar from './Navbar'

const sampleHistory = [2, 0, 3, 18, 21, 16, 8]

const config = {
  maxListLength: 20,
  maxTries: 6,
  initialHistory: [0, 0, 0, 0, 0, 0, 0],
}

const Keyboard = ({ guesses, word, setWord, addGuess }) => {
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
  const timer = useRef(null) // we can save timer in useRef and pass it to child
  const [todaysNumber, setTodaysNumber] = useState(getTodaysNumber())
  const [showModal, setShowModal] = useState(true)
  const [gameHistory, setGameHistory] = useState(config.initialHistory)

  const isVictory = () => {
    return (
      guesses.length > 0 && getCanonical(guesses[guesses.length - 1].word) === getCanonical(answer)
    )
  }

  const isGameOver = () => {
    return isVictory() || guesses.length === config.maxTries
  }

  const loadGuesses = () => {
    const answer = wordList[getTodaysNumber()]

    const savedGuesses = localStorage.getItem(getStorageKey())
    if (savedGuesses) {
      const plainWords = JSON.parse(savedGuesses)
      const newGuesses = plainWords.map((word) => {
        let key, savedWord
        if (getCanonical(word) === getCanonical(answer)) {
          key = word
            .split('')
            .map((c) => 'G')
            .join('')
          savedWord = answer
        } else {
          key = evaluateToString(word, getCanonical(answer))
          savedWord = word
        }
        const result = {
          word: savedWord,
          key,
        }
        return result
      })
      setGuesses(newGuesses)
    }
  }

  const loadHistory = () => {
    const savedHistory = localStorage.getItem('game-history')

    if (savedHistory) {
      setGameHistory(JSON.parse(savedHistory))
    } else {
      localStorage.setItem(JSON.parse(gameHistory))
    }
  }

  useEffect(() => {
    const newAnswer = wordList[getTodaysNumber()]
    setAnswer(newAnswer)

    loadGuesses()

    timer.current = setInterval(() => {
      const stored = localStorage.getItem(getStorageKey())
      // console.log(getStorageKey())
      if (!stored) {
        console.log('key has changed, removing all guesses')
        localStorage.setItem(getStorageKey(), JSON.stringify([]))
        setGuesses([])
        setTodaysNumber(getTodaysNumber())
        setAnswer(getTodaysNumber())
      }
    }, 6000)

    // clear on component unmount
    return () => {
      clearInterval(timer.current)
    }
  }, [])

  const renderGuess = (guess) => {
    const getLetterClasses = (letter, key) => {
      let classes = ['box']
      if (key === 'G') {
        classes.push('green')
      }
      if (key === 'Y') {
        classes.push('yellow')
      }
      if (key === '-') {
        classes.push('white')
      }
      if (letter === '-') {
        classes.push('invisible')
      }
      return classes.join(' ')
    }

    return (
      <div className="guess">
        {guess.key.split('').map((c, i) => {
          return (
            <div key={`guess-${i}`} className={getLetterClasses(guess.word[i], c)}>
              {guess.word[i]}
            </div>
          )
        })}
      </div>
    )
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
    let wonGame = false
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
      setWord('')
      return
    } else {
      setError('')
    }
    let key, savedWord
    if (testWord === getCanonical(answer)) {
      wonGame = true
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

    if (wonGame) {
      const newHistory = [...gameHistory]
      newHistory[guesses.length] = gameHistory[guesses.length] + 1
      setGameHistory(newHistory)
      localStorage.setItem('game-history', JSON.stringify(newHistory))
    }

    localStorage.setItem(getStorageKey(), JSON.stringify(newGuesses.map((g) => g.word)))

    inputEl.current.focus()
  }

  const renderBlanks = () => {
    let blanksNeeded = config.maxTries - guesses.length
    blanksNeeded = isGameOver() ? blanksNeeded : blanksNeeded - 1
    if (blanksNeeded <= 0) {
      return null
    }
    return Array(blanksNeeded)
      .fill(1)
      .map((x, i) => {
        return <div key={`guess-${i}`}>{renderGuess({ word: '------', key: '------' })}</div>
      })
  }

  const changeWord = (newWord) => {
    if (word.length <= 6) {
      setWord(newWord)
    }
  }

  const victory = isVictory()

  return (
    <>
      <Navbar
        todaysNumber={getTodaysNumber()}
        toggleModal={() => {
          setShowModal(!showModal)
        }}
      />
      <div className="d-flex flex-column App">
        {/* <h1>Palabrl {getTodaysNumber()}</h1> */}
        <div className="App d-flex justify-content-center mb-3">
          <div className="guess-list d-flex flex-column">
            {guesses.map((guess, i) => {
              return <div key={`guess-${i}`}>{renderGuess(guess)}</div>
            })}
            {!isGameOver() && (
              <div>
                <div className="guess">{renderActiveGuess()}</div>
              </div>
            )}
            {renderBlanks()}
          </div>
        </div>
        <div>
          {!isGameOver() && (
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
                    changeWord(e.target.value.toUpperCase())
                  }}
                  placeholder="palabra"
                />
              </fieldset>
              <input className="btn btn-primary" type="submit" value="Comprobar" />
            </form>
          )}
        </div>

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
                className="btn btn-primary"
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
        <Keyboard word={word} setWord={changeWord} guesses={guesses} addGuess={addGuess} />
      </div>

      <HistoryModal
        guesses={guesses}
        show={showModal}
        shareScore={shareScore}
        handleClose={() => setShowModal(false)}
        gameHistory={sampleHistory}
      />
    </>
  )
}

export default App
