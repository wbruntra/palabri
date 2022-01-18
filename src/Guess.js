export default function Guess({ guess }) {
  const isWinner = guess.key === 'GGGGGG'

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
      classes.push('text-gray')
    }
    return classes.join(' ')
  }

  return (
    <div className="guess">
      {guess.key.split('').map((c, i) => {
        const styles = {}
        if (isWinner) {
          styles.animation = `bounce 1s`
          // styles.animation = `0.7s ease ${0.12 * i}s normal none running bounce`
          // styles.animationDelay = `${0.08 * i}s !important`
        }
        return (
          <div key={`guess-${i}`} style={styles} className={getLetterClasses(guess.word[i], c)}>
            {guess.word[i]}
          </div>
        )
      })}
    </div>
  )
}
