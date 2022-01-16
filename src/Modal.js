import { Modal, Button, Overlay, Tooltip } from 'react-bootstrap'
import { useState, useRef } from 'react'
import _ from 'lodash'

function Example() {
  const [show, setShow] = useState(false)
  const target = useRef(null)

  return (
    <>
      <Button ref={target} onClick={() => setShow(!show)}>
        Click me!
      </Button>
      <Overlay target={target.current} show={show} placement="right">
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
            My Tooltip
          </Tooltip>
        )}
      </Overlay>
    </>
  )
}

export default function HistoryModal({
  show,
  handleClose,
  guesses,
  answer,
  shareScore,
  gameHistory,
}) {
  const [showTip, setShowTip] = useState(false)
  const target = useRef(null)
  const gamesPlayed = _.sum(gameHistory) > 0 ? _.sum(gameHistory) : 1

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton closeVariant={'white'}>
          <Modal.Title>Historial</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tus estadísticas en este juego</p>
          <div className="d-flex flex-column">
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
        </Modal.Body>
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
      </Modal>
    </>
  )
}
