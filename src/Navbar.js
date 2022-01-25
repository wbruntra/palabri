import { Navbar, Nav, Container } from 'react-bootstrap'

export default function MyNavbar({
  todaysNumber,
  toggleModal,
  toggleHelpModal,
  toggleGameOverModal,
  gameOver,
}) {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Palabrí {todaysNumber}</Navbar.Brand>
          <Nav className="justify-content-end">
            {gameOver && (
              <Navbar.Text onClick={toggleGameOverModal} className="clickable">
                <span className="material-icons me-3">announcement</span>
              </Navbar.Text>
            )}
            <Navbar.Text onClick={toggleModal} className="clickable">
              <span className="material-icons me-3">equalizer</span>
            </Navbar.Text>
            <Navbar.Text onClick={toggleHelpModal} className="clickable">
              <span className="material-icons">help_outline</span>
            </Navbar.Text>
          </Nav>
        </Container>
      </Navbar>
      <br />
    </>
  )
}
