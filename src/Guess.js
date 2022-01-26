import Flippy, { BackSide, FrontSide } from 'react-flippy'
import { useEffect, useRef, useState } from 'react'

const getLetterClasses = (letter, key) => {
  let classes = ['box']
  if (key === 'G') {
    classes.push('green')
  }
  if (key === 'Y') {
    classes.push('yellow')
  }
  if (key === '-') {
    classes.push('missed-guess')
  }
  if (key === '.') {
    classes.push('white')
  }
  if (letter === '-') {
    classes.push('text-gray')
  }
  return classes.join(' ')
}

function Flip({ letter, letterKey, position }) {
  const ref = useRef()
  const [shouldFlip, setFlip] = useState(false)

  useEffect(() => {
    let timer

    timer = setTimeout(() => {
      setFlip(true)
    }, 100)

    return () => {
      clearInterval(timer)
    }
  })

  const style = {
    transitionDelay: `${240 * position}ms`,
  }

  return (
    <Flippy flipDirection="horizontal" isFlipped={shouldFlip}>
      <FrontSide style={style} className="box white">
        <div> {letter}</div>
      </FrontSide>
      <BackSide style={style} className={getLetterClasses(letter, letterKey)}>
        <div ref={ref}>{letter}</div>
      </BackSide>
    </Flippy>
  )
}

export default function Guess({ guess, active, movingForward, lastGuess, allowAnimations }) {
  const [useJump, setUseJump] = useState(false)
  const isWinner = guess.key === 'GGGGGG'

  useEffect(() => {
    const isWinner = guess.key === 'GGGGGG'
    let timer

    timer = setTimeout(() => {
      if (isWinner) {
        setUseJump(true)
      }
    }, 1850)

    return () => {
      clearInterval(timer)
    }
  })

  const getLastLetterIndex = () => {
    if (guess.word.indexOf('-') !== -1) {
      return guess.word.indexOf('-') - 1
    }
    return guess.word.length - 1
  }

  return (
    <div className={`guess`}>
      {guess.key.split('').map((c, i) => {
        if (allowAnimations && useJump) {
          const styles = {}
          styles.animation = `jump .3s`
          styles.animationDelay = `${0.08 * i}s`

          return (
            <div
              key={`guess-jump-${i}`}
              style={styles}
              className={`${getLetterClasses(guess.word[i], c)}`}
            >
              {guess.word[i]}
            </div>
          )
        }

        if (allowAnimations && lastGuess) {
          return (
            <div key={`guess-last-${i}`}>
              <Flip isWinner={isWinner} letter={guess.word[i]} letterKey={c} position={i} />
            </div>
          )
        }

        const shouldPop = active && movingForward && getLastLetterIndex() === i
        return (
          <div
            key={`guess-${i}`}
            className={`${getLetterClasses(guess.word[i], c)} ${shouldPop ? 'pop' : ''}`}
          >
            {guess.word[i]}
          </div>
        )
      })}
    </div>
  )
}
