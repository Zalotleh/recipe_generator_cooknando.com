import Nav from 'react-bootstrap/Nav';




function Navigation() {

    return (

                <Nav variant="pills" className="flex-column">


                    <Nav.Item className='tab-item universal-item'>
                        <Nav.Link  className="item-link" eventKey="first" href="/">Universal Generator</Nav.Link>
                    </Nav.Item>

                    <Nav.Item className='tab-item vegan-item'>
                        <Nav.Link  className="item-link" eventKey="first" href="/diets/Vegan">Vegan Recipes</Nav.Link>
                    </Nav.Item>

                    <Nav.Item className='tab-item mediterranean-item'>
                        <Nav.Link className="item-link" eventKey="second" href="/diets/Mediterranean">Mediterranean Recipes</Nav.Link>
                    </Nav.Item>

                    <Nav.Item className='tab-item mexican-item'>
                        <Nav.Link className="item-link" eventKey="third" href="/diets/Mexican">Mexican Recipes</Nav.Link>
                    </Nav.Item>

                    <Nav.Item className='tab-item indian-item'>
                        <Nav.Link className="item-link" eventKey="fourth" href="/diets/Indian">Indian Recipes</Nav.Link>
                    </Nav.Item>

                    <Nav.Item className='tab-item chinese-item'>
                        <Nav.Link className="item-link" eventKey="fourth" href="/diets/Chinese">Chinese Recipes</Nav.Link>
                    </Nav.Item>                
                </Nav>
              
            );
}
            
export default Navigation;