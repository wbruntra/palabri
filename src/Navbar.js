import { Navbar, Nav, Container } from 'react-bootstrap'

export default function MyNavbar({ todaysNumber, toggleModal, toggleHelpModal }) {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Palabrí {todaysNumber}</Navbar.Brand>
          <Nav className="justify-content-end">
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
