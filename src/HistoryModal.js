import { Modal, Button, Overlay, Tooltip } from 'react-bootstrap'
import { useState, useRef } from 'react'
import { sum } from 'lodash'

export default function HistoryModal({
  show,
  handleClose,
  guesses,
  answer,
  shareScore,
  gameHistory,
  gameOver,
}) {
  const [showTip, setShowTip] = useState(false)
  const target = useRef(null)
  const gamesPlayed = sum(gameHistory) > 0 ? sum(gameHistory) : 1

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton closeVariant={'white'}>
          <Modal.Title>Historial</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {sum(gameHistory) === 0 ? (
            <>
              <p>Aún no tienes historial!</p>
              <p>Tus estadísticas aparecerán aquí</p>
            </>
          ) : (
            <>
              <p>
                Has jugado {gamesPlayed} {gamesPlayed > 1 ? 'veces' : 'vez'}
              </p>
              <div className="d-flex flex-column">
                <p>Intentos para adivinar la palabra:</p>
                {gameHistory.map((h, i) => {
                  if (i < 1) {
                    return null
                  }
                  return (
                    <div key={`history-${i}`} className="d-flex flex-row">
                      <div>{i}</div>:<div className="ms-2">{h}</div>{' '}
                      <div className="ms-2">({Math.round((100 * h) / gamesPlayed)}%)</div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </Modal.Body>
        {gameOver && (
          <Modal.Footer>
            <Button
              variant="primary"
              ref={target}
              onClick={() => {
                setShowTip(true)
                shareScore(guesses)

                setTimeout(() => {
                  setShowTip(false)
                }, 1400)
              }}
            >
              Compartir
            </Button>
            <Overlay target={target.current} show={showTip} placement="left">
              {(props) => (
                <Tooltip id="overlay-example" {...props}>
                  Copiado
                </Tooltip>
              )}
            </Overlay>
            {/* <Button variant="primary" onClick={() => handleClose('confirm')}>
            Cerrar
          </Button> */}
          </Modal.Footer>
        )}
      </Modal>
    </>
  )
}
