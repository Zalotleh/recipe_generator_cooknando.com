import styles from '../../styles/Navigation.module.css'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


function Navigation() {

  return (
<div className= {styles.nav_bar_div}>
<Navbar variant="dark" className={styles.nav_bar} expand="lg">
<Container>
  <Navbar.Brand className={`${styles.nav_item} ${styles.nav_brand}`} href="/">CookNando</Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse   id="basic-navbar-nav">
    <Nav className="me-auto"  >
      <Nav.Link className={styles.nav_item} href="/about/About">About</Nav.Link>
      <Nav.Link className={styles.nav_item} href="/">Universal</Nav.Link>
      <Nav.Link className={styles.nav_item} href="/diets/Vegan">Vegan</Nav.Link>
      <Nav.Link className={styles.nav_item} href="/diets/Mediterranean">Mediterranean</Nav.Link>
      <Nav.Link className={styles.nav_item} href="/diets/Mexican">Mexican</Nav.Link>
      <Nav.Link className={styles.nav_item} href="/diets/Indian">Indian</Nav.Link>
      <Nav.Link className={styles.nav_item} href="/diets/Chinese">Chinese</Nav.Link>

    </Nav>
  </Navbar.Collapse>
  

</Container>

</Navbar>
<hr className={styles.horizontal_line} />

</div>
  );
}

export default Navigation;