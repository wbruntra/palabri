import { Modal } from 'react-bootstrap'
import { sum } from 'lodash'

export default function HistoryModal({ show, handleClose, gameHistory }) {
  // const gameHistory = [0, 1, 1, 3, 4, 4, 2]
  const gamesPlayed = sum(gameHistory) > 0 ? sum(gameHistory) : 1
  // const gamesPlayed = sum(gameHistory) > 0 ? sum(gameHistory) : 1

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
              <div className="history-graph d-flex flex-column">
                <p>Intentos para adivinar la palabra:</p>
                {gameHistory.map((h, i) => {
                  if (i < 1) {
                    return null
                  }
                  return (
                    <div
                      key={`history-item-${i}`}
                      className="history-item d-flex flex-row"
                      style={{ width: '100%' }}
                    >
                      <div className="me-2 pt-0">{i}</div>
                      <div
                        className="history-bar"
                        style={{ flexBasis: `${Math.floor(.8 * (100 * h) / gamesPlayed)}%` }}
                      />
                      <p className="ms-2">{`${Math.floor((100 * h) / gamesPlayed)}%`}</p>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}
