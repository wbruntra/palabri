import { Navbar, Nav, Container } from 'react-bootstrap'

export default function MyNavbar({ todaysNumber, toggleModal }) {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Palabrl {todaysNumber}</Navbar.Brand>
          <Nav className="justify-content-end">
            <Navbar.Text onClick={toggleModal} className="clickable">
              <span className="material-icons">equalizer</span>
            </Navbar.Text>
          </Nav>
        </Container>
      </Navbar>
      <br />
    </>
  )
}
