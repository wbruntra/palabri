import {
  copyWithWebShare,
  evaluateToString,
  getCanonical,
  getShareText,
  getTodaysNumber,
  isWordValid,
  wordList,
  wordsHash,
} from './utils'
import { useEffect, useRef, useState } from 'react'

import GameOverModal from './WinnerModal'
import Guess from './Guess'
import HelpModal from './HelpModal'
import HistoryModal from './HistoryModal'
import Navbar from './Navbar'
import SharingModal from './SharingModal'

const config = {
  maxListLength: 20,
  maxTries: 6,
  initialHistory: [0, 0, 0, 0, 0, 0, 0],
}

const Keyboard = ({ guesses, word, setWord, addGuess, setMovingForward }) => {
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
      <div className="keyboard-row d-flex justify-content-between">
        {'QWERTYUIOP'.split('').map((k, i) => {
          return (
            <div
              onClick={() => {
                setMovingForward(true)
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
      <div className="keyboard-row d-flex justify-content-around">
        {'ASDFGHJKLÑ'.split('').map((k, i) => {
          return (
            <div
              onClick={() => {
                setMovingForward(true)
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
      <div className="keyboard-row d-flex justify-content-evenly">
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
                setMovingForward(true)
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
              setMovingForward(false)
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

const getWordIndex = () => {
  if (!window.location.host.startsWith('localhost')) {
    return getTodaysNumber()
  }
  let chunk
  let param = new URL(document.location).searchParams.get('chunk')
  if (param) {
    chunk = parseInt(param)
  }
  const wordIndex = chunk ? parseInt(param) : getTodaysNumber()
  return wordIndex
}

const getStorageKey = () => {
  const wordIndex = getWordIndex()
  return `guesses-${wordIndex}-${wordsHash}`
}

function App() {
  const [guesses, setGuesses] = useState([])
  const [word, setWord] = useState('')
  const inputEl = useRef(null)
  const [error, setError] = useState('')
  const [shareClicked, setSharedClicked] = useState(false)
  const timer = useRef(null)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [gameHistory, setGameHistory] = useState(config.initialHistory)
  const [shareError, setShareError] = useState('')
  const [movingForward, setMovingForward] = useState(true)
  const [allowAnimations, setAllowAnimations] = useState(true)

  const [answer, setAnswer] = useState(wordList[getWordIndex()])

  const isVictory = (guesses) => {
    return (
      guesses.length > 0 && getCanonical(guesses[guesses.length - 1].word) === getCanonical(answer)
    )
  }

  const isGameOver = (guesses) => {
    return isVictory(guesses) || guesses.length === config.maxTries
  }

  const loadGuesses = (storageKey, answer) => {
    const savedGuesses = localStorage.getItem(storageKey)
    if (savedGuesses && savedGuesses.length > 0) {
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
      if (isGameOver(newGuesses)) {
        setAllowAnimations(false)
        setTimeout(() => {
          setShowGameOverModal(true)
        }, 2500)
      }
    }
  }

  const loadHistory = () => {
    const savedHistory = localStorage.getItem('game-history')

    if (savedHistory) {
      setGameHistory(JSON.parse(savedHistory))
    } else {
      setShowHelpModal(true)
      localStorage.setItem('game-history', JSON.stringify(gameHistory))
    }
  }

  const reset = () => {
    setShowGameOverModal(false)
    setShowHistoryModal(false)
  }

  useEffect(() => {
    loadGuesses(getStorageKey(), answer)
    loadHistory()

    const checkGuessesValid = () => {
      const storageKey = getStorageKey()
      const stored = localStorage.getItem(storageKey)
      if (!stored) {
        console.log('no valid key, removing all guesses')
        localStorage.setItem(storageKey, JSON.stringify([]))
        setGuesses([])
        // setTodaysNumber(getWordIndex())
        reset()

        const newAnswer = wordList[getWordIndex()]
        setAnswer(newAnswer)
      }
    }

    checkGuessesValid()

    timer.current = setInterval(checkGuessesValid, 6000)

    // clear on component unmount
    return () => {
      clearInterval(timer.current)
    }
  }, [])

  const addGuess = (e) => {
    let wonGame = false
    if (e) {
      e.preventDefault()
    }
    if (isGameOver(guesses)) {
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

    if (isGameOver(newGuesses)) {
      setTimeout(() => {
        setShowGameOverModal(true)
      }, 4500)
    }

    if (wonGame) {
      const newHistory = [...gameHistory]
      newHistory[newGuesses.length] = gameHistory[newGuesses.length] + 1
      setGameHistory(newHistory)
      localStorage.setItem('game-history', JSON.stringify(newHistory))
    }

    localStorage.setItem(getStorageKey(), JSON.stringify(newGuesses.map((g) => g.word)))

    inputEl.current.focus()
  }

  const changeWord = (newWord) => {
    if (newWord.length <= 6) {
      setWord(newWord)
    } else {
      setWord(newWord.slice(0, 6))
    }
  }

  const renderGuessColumn = () => {
    let result = [
      ...guesses.map((guess, i) => {
        return (
          <div key={`final-guess-${i}`}>
            <Guess
              allowAnimations={allowAnimations}
              guess={guess}
              lastGuess={i === guesses.length - 1}
            />
          </div>
        )
      }),
    ]
    if (!isGameOver(guesses)) {
      result.push(
        <div key={'active-guess'} className="active-guess">
          <Guess
            guess={{ word: word.concat('------').slice(0, 6), key: '......' }}
            active={true}
            movingForward={movingForward}
          />
        </div>,
      )
    }
    result = [
      ...result,
      ...Array(7)
        .fill(1)
        .map((x, i) => {
          return (
            <div key={`blank-guess-${i}`}>
              <Guess guess={{ word: '------', key: '......' }} />
            </div>
          )
        }),
    ].slice(0, 6)

    return result
  }

  const victory = isVictory(guesses)

  return (
    <div className="d-flex flex-column main">
      <Navbar
        todaysNumber={getWordIndex()}
        toggleModal={() => {
          setShowHistoryModal(!showHistoryModal)
        }}
        toggleHelpModal={() => {
          setShowHelpModal(true)
        }}
        gameOver={isGameOver(guesses)}
        toggleGameOverModal={() => setShowGameOverModal(true)}
      />

      {!shareClicked && (
        <div className="d-flex flex-column App">
          <div className="d-flex justify-content-center mb-3">
            <div className="guess-list d-flex flex-column">{renderGuessColumn()}</div>
          </div>
          {!isGameOver(guesses) && (
            <>
              <div className="d-none d-md-block">
                <form className="entry-form mb-3" onSubmit={addGuess}>
                  <fieldset className="mb-2">
                    <input
                      type="text"
                      autoFocus
                      ref={inputEl}
                      value={word}
                      onChange={(e) => {
                        if (victory || guesses.length === 6) {
                          return null
                        }
                        setMovingForward(e.target.value !== word.slice(0, -1))
                        changeWord(e.target.value.toUpperCase())
                      }}
                      placeholder="palabra"
                    />
                  </fieldset>
                  <input className="btn btn-primary" type="submit" value="Comprobar" />
                </form>
              </div>

              {error !== '' ? (
                <p className="error">{error}</p>
              ) : (
                <p className="text-bgcolor">Adelante</p>
              )}
            </>
          )}

          {isGameOver(guesses) && (
            <>
              <div>
                <p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      const shareText = getShareText(guesses)
                      copyWithWebShare(shareText)
                        .then((msg) => {
                          setSharedClicked(true)
                          if (msg !== 'SUCCESS') {
                            setShareError(msg)
                          }
                        })
                        .catch((err) => {
                          setSharedClicked(true)
                        })
                    }}
                  >
                    Compartir
                  </button>
                </p>
              </div>
            </>
          )}
          <div className="">
            <Keyboard
              word={word}
              setWord={changeWord}
              guesses={guesses}
              addGuess={addGuess}
              setMovingForward={setMovingForward}
            />
          </div>
          <GameOverModal
            show={showGameOverModal}
            handleClose={() => setShowGameOverModal(false)}
            victory={victory}
            answer={answer}
          />
        </div>
      )}

      <SharingModal
        shareText={getShareText(guesses)}
        show={shareClicked}
        handleClose={() => {
          setSharedClicked(false)
        }}
      />

      <HistoryModal
        guesses={guesses}
        show={showHistoryModal}
        handleClose={() => setShowHistoryModal(false)}
        gameHistory={gameHistory}
        gameOver={isGameOver(guesses)}
      />
      <HelpModal show={showHelpModal} handleClose={() => setShowHelpModal(false)} />
    </div>
  )
}

export default App
