import { Modal, Button, Overlay, Tooltip } from 'react-bootstrap'
import { useState, useRef, useEffect } from 'react'
import { sum } from 'lodash'
import Guess from './Guess'
import { getTodaysNumber } from './utils'

export default function GameOverModal({ show, handleClose }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const msPerDay = 60 * 60 * 24 * 1000
    const secondsPerDay = 60 * 60 * 24
    const secondsPerHour = 60 * 60

    let interval = setInterval(() => {
      const dateNow = new Date()
      let dayFraction = dateNow / msPerDay
      const dayFractionRemaining = 1 - (dayFraction - Math.floor(dayFraction))
      const secondsLeft = secondsPerDay * dayFractionRemaining
      const hoursLeft = Math.floor(secondsLeft / secondsPerHour)
      const secondsLeftInHour = secondsLeft - hoursLeft * secondsPerHour
      const minutesLeft = Math.floor(secondsLeftInHour / 60)
      const secondsLeftInMinute = Math.round(secondsLeftInHour - minutesLeft * 60)

      setTimeLeft(
        `${'00'.concat(hoursLeft).slice(-2)}:${'00'.concat(minutesLeft).slice(-2)}:${'00'
          .concat(secondsLeftInMinute)
          .slice(-2)}`,
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton closeVariant={'white'}>
          <Modal.Title>Fin de Partida</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>
            Ya has terminado la partida de hoy. Espero que te lo hayas pasado bien. Comparte con
            tus amigos!
          </p>
          <p>Tiempo restante hasta que haya una nueva palabra:</p>
          <h3 className="text-center">{timeLeft}</h3>
        </Modal.Body>
      </Modal>
    </>
  )
}
