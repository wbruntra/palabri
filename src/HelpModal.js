import { Modal, Button, Overlay, Tooltip } from 'react-bootstrap'
import { useState, useRef } from 'react'
import { sum } from 'lodash'
import Guess from './Guess'

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
          <p className="my-3">La "U" y la "R" son correctas y bien colocadas</p>
          <Guess guess={{ word: 'PUNTAS', key: '-Y--G-' }} />
          <p className="my-3">
            La A es correcta y en la posición correcta. La U es correcta pero debe estar en otra posición.
          </p>
        </Modal.Body>
      </Modal>
    </>
  )
}
