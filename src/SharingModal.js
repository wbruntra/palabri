import { Modal } from 'react-bootstrap'

export default function HelpModal({ show, handleClose, shareText }) {
  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton closeVariant={'white'}>
          <Modal.Title>Compartir Resultado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            En teoría, el texto ya ha sido copiado a tu portapapeles. Por si acaso, lo tienes aquí.
          </p>
          <pre>{shareText}</pre>
        </Modal.Body>
      </Modal>
    </>
  )
}
