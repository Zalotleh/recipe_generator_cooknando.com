import Head from 'next/head'
import { FormEvent,useState } from 'react'

import Navigation from '../components/Navigation';
import Tabs from '../components/Tabs';

import styles from '../../styles/Diets.module.css'

import { Form, Spinner, Button} from 'react-bootstrap'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Footer from '../components/Footer';



export default function Vegan() {

  const [veganRecipe, setVeganRecipe] = useState("");
  const [veganNutritionInfo, setVeganNutritionInfo] = useState("");


  const [veganRecipeLoading, setVeganRecipeLoading] = useState(false);
  const [veganRecipeLoadingError, setVeganRecipeLoadingError] = useState(false)

  async function veganHandleSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault();
    //  we get the data from the form, we get the e.target, HTMLFormElement is typescript to identify the type
    const veganFormData = new FormData(e.target as HTMLFormElement)
    // we get the data itself, and we stringfiy it and trim and extra spaces
    const veganPrompt = veganFormData.get("veganPrompt")?.toString().trim();
    // "veganPrompt" is the name of the form in the html
    const extraVeganNote = veganFormData.get("extraVeganNote")?.toString().trim() || '';
    // "extraVeganNote" is the name of the form in the html

    if (veganPrompt){
      try{
        // if the prompt exist: if the user types something:
        // we set the recipe to an empty string
        // we delete the errors and display the loading message
        setVeganRecipe("");
        setVeganNutritionInfo("");

        setVeganRecipeLoadingError(false);
        setVeganRecipeLoading(true);

        // we send the prompt to the API end point, and get a response back
        const response = await fetch(`/api/veganGenerator?veganPrompt=${encodeURIComponent(veganPrompt)}&extraVeganNote=${encodeURIComponent(extraVeganNote)}`);
        
        // checking if the recipe has been generated
        if (!response.ok) {
          throw new Error(await response.text());
          
        }
        // here is the response from the API
        const body = await response.json();

        console.log(body)

        setVeganRecipe(body.veganRecipe);
        setVeganNutritionInfo(body.veganNutritionInfo)


      }catch (error) {
        console.error(error);
        setVeganRecipeLoadingError(true);
        }
      finally{
        setVeganRecipeLoading(false)
      }
 
    }
  }

  return (
    <>
      <Head>
        <title>Cook Nando - Vegan Recipes</title>
        <meta name="description" content="by Ziad Alotleh" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main  className={styles.main}>
        
        <Navigation/>

        <div className="welcome">
          <h1 className='welcome-h1'>Viva la vegan! It&rsquo;s time to get creative in the kitchen. What tasty ingredients will you add to the mix?</h1>
          <p className='welcome-p'></p>
        </div>

        <Tab.Container id="left-tabs-example" >
          <Row className='tabs-form-row'>

          <Col sm={9}>
            <Form onSubmit={veganHandleSubmit} className="inputForm">
                <Form.Group className='mb-3' controlId='prompt-input'>
                 
                  <Form.Control
                    required
                    name='veganPrompt'
                    placeholder='add ingredients here, ex: tomato 100g, olive oil 1 cup .. etc'
                  />
                  <p>Add your ingredients here</p>

                  <Form.Control className='extra-note'
                    maxLength={300}
                    name='extraVeganNote'
                    placeholder='add any extra instructions or notes here. ex: do not add salt'
                  />
                  <p>Add any additional notes or instruction here</p>

                </Form.Group>
                 
                  
                <Button type='submit' className='mb-3 generator-button' disabled={veganRecipeLoading}>
                  Generate Recipe
                </Button>

              </Form>
              <div className="spinner">
                {veganRecipeLoading && (<><Spinner animation='border' /> 
                 <p>Cooking up a culinary masterpiece, hang tight foodie!</p>
                 </>)
                }
              </div>
              {veganRecipeLoadingError && <div className="errorMessage">Oh fiddle sticks! Something didn&rsquo;t go as planned. Shall we try again?
              <br></br>Please make sure that all the ingredients are vegan, food or drinks!</div>}
              {veganRecipe && <><h5 className='recipe-header-text'>Bon Appétit! Your dish has been magically conjured by CookGenie.</h5></>}
              <div className="generated-recipe">        
                {veganRecipe && veganRecipe.split("\n").map((line, index) => <p key={index}>{line}</p>)}
              </div>

              
            </Col>

            <Col sm={3}>


              {veganRecipe && veganNutritionInfo && 
                    <Col className='nutrition-info tab-column'>
                      {veganNutritionInfo.split("\n").map((line, index) => <p key={index}>{line}</p>)}
                    </Col>
              }

              <Tabs/>

            </Col>
            
          </Row>
        </Tab.Container>


                           
      </main>
      <Footer/>

    </>
  )
}
