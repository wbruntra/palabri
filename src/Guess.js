export default function Guess({ guess, active, movingForward }) {
  const isWinner = guess.key === 'GGGGGG'

  const getLastLetterIndex = () => {
    if (guess.word.indexOf('-') !== -1) {
      return guess.word.indexOf('-') - 1
    }
    return guess.word.length - 1
  }

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

  return (
    <div className={`guess`}>
      {guess.key.split('').map((c, i) => {
        const styles = {}
        if (isWinner) {
          styles.animation = `jump .35s`
          styles.animationDelay = `${0.08 * i}s`
        }
        const shouldPop = active && movingForward && getLastLetterIndex() === i
        return (
          <div
            key={`guess-${i}`}
            style={styles}
            className={`${getLetterClasses(guess.word[i], c)} ${shouldPop ? 'pop' : ''}`}
          >
            {guess.word[i]}
          </div>
        )
      })}
    </div>
  )
}
