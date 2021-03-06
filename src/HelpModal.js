import Guess from './Guess'
import { Modal } from 'react-bootstrap'

export default function HelpModal({ show, handleClose }) {
  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton closeVariant={'white'}>
          <Modal.Title>Como Jugar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Adivina la palabra del día según las pistas</p>
          <p>Ejemplos:</p>
          <Guess guess={{ word: 'TRUENO', key: '-GG---' }} />
          <p className="my-3">La U y la R son correctas y bien colocadas</p>
          <Guess guess={{ word: 'PUNTAS', key: '-Y--G-' }} />
          <p className="my-3">
            La A es correcta y en la posición correcta. La U es correcta pero debe estar en otra
            posición.
          </p>
          <hr />
          <p>Los acentos no aparecen hasta que hayas adivinado la palabra entera.</p>
          <p>
            <span className="fw-bold">Palabras válidas:</span> la palabra puede ser sustantivo o adjectivo en singular
            o plural. En caso de un verbo, se usa el infinitivo o el participio, no habrá conjugaciones
            raras (a no ser que haya, por ejemplo, un sustantivo que se escribe igual).
          </p>
        </Modal.Body>
      </Modal>
    </>
  )
}
