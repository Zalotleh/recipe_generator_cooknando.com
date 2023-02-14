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



export default function Mediterranean() {

  const [mediterraneanRecipe, setMediterraneanRecipe] = useState("");
  const [mediterraneanSongs, setMediterraneanSongs] = useState("");
  const [mediterraneanNutritionInfo, setMediterraneanNutritionInfo] = useState("");


  const [mediterraneanRecipeLoading, setMediterraneanRecipeLoading] = useState(false);
  const [mediterraneanRecipeLoadingError, setMediterraneanRecipeLoadingError] = useState(false)

  async function mediterraneanHandleSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault();
    //  we get the data from the form, we get the e.target, HTMLFormElement is typescript to identify the type
    const mediterraneanFormData = new FormData(e.target as HTMLFormElement)
    // we get the data itself, and we stringfiy it and trim and extra spaces
    const mediterraneanPrompt = mediterraneanFormData.get("mediterraneanPrompt")?.toString().trim();
    // "veganPrompt" is the name of the form in the html
    const extraMediterraneanNote = mediterraneanFormData.get("extraMediterraneanNote")?.toString().trim() || '';
    // "extraVeganNote" is the name of the form in the html

    if (mediterraneanPrompt){
      try{
        // if the prompt exist: if the user types something:
        // we set the recipe to an empty string
        // we delete the errors and display the loading message
        setMediterraneanRecipe("");
        setMediterraneanSongs("");
        setMediterraneanNutritionInfo("");

        setMediterraneanRecipeLoadingError(false);
        setMediterraneanRecipeLoading(true);

        // we send the prompt to the API end point, and get a response back
        const response = await fetch(`/api/mediterraneanGenerator?mediterraneanPrompt=${encodeURIComponent(mediterraneanPrompt)}&extraMediterraneanNote=${encodeURIComponent(extraMediterraneanNote)}`);
        
        // checking if the recipe has been generated
        if (!response.ok) {
          throw new Error(await response.text());
          
        }
        // here is the response from the API
        const body = await response.json();

        console.log(body)

        setMediterraneanRecipe(body.mediterraneanRecipe);
        setMediterraneanSongs(body.mediterraneanSongs);
        setMediterraneanNutritionInfo(body.mediterraneanNutritionInfo)


      }catch (error) {
        console.error(error);
        setMediterraneanRecipeLoadingError(true);
        }
      finally{
        setMediterraneanRecipeLoading(false)
      }
 
    }
  }

  return (
    <>
      <Head>
        <title>Cook Nando - Mediterranean Recipes</title>
        <meta name="description" content="by Ziad Alotleh" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main  className={styles.main}>
        
        <Navigation/>

        <div className="welcome">
          <h1 className='welcome-h1'>Ole! Let&rsquo;s embrace the flavors of the Mediterranean. What ingredients will you use to bring the flavors to life?</h1>
          <p className='welcome-p'></p>
        </div>

        <Tab.Container id="left-tabs-example" >
          <Row className='tabs-form-row'>

          <Col sm={9}>
            <Form onSubmit={mediterraneanHandleSubmit} className="inputForm">
                <Form.Group className='mb-3' controlId='prompt-input'>
                 
                  <Form.Control
                    required
                    name='mediterraneanPrompt'
                    placeholder='add ingredients here, ex: tomato 100g, olive oil 1 cup .. etc'
                  />
                  <p>Add you ingredients here</p>

                  <Form.Control className='extra-note'
                    maxLength={300}
                    name='extraMediterraneanNote'
                    placeholder='add any extra instructions or notes here. ex: do not add salt'
                  />
                  <p>Add any additional notes or instruction here</p>

                </Form.Group>
                 
                  
                <Button type='submit' className='mb-3 generator-button' disabled={mediterraneanRecipeLoading}>
                  Generate Recipe
                </Button>

              </Form>
              <div className="spinner">
                {mediterraneanRecipeLoading && (<><Spinner animation='border' /> 
                 <p>Cooking up a culinary masterpiece, hang tight foodie!</p>
                 </>)
                }
              </div>
              {mediterraneanRecipeLoadingError && <div className="errorMessage">Oh fiddle sticks! Something didn&rsquo;t go as planned. Shall we try again?</div>}
              {mediterraneanRecipe && <><h5 className='recipe-header-text'>Bon Appétit! Your dish has been magically conjured by CookGenie.</h5></>}
              <div className="generated-recipe">        
                {mediterraneanRecipe && mediterraneanRecipe.split("\n").map((line, index) => <p key={index}>{line}</p>)}
              </div>

              {mediterraneanSongs && <><h4 className='songs-header-text'>These jams are the secret ingredient, so turn up the volume and ENJOY!</h4></>}

              <div className="generated-songs">
                {mediterraneanSongs && mediterraneanSongs.split("\n").map((line) => {
                  const parts = line.split(" - https");
                  const link = "https" + parts[parts.length - 1];
                  return (
                    <p key={line} style={{ color: "#f8f9fa", textDecoration: "none" }}>
                      {parts.slice(0, -1).join(" - https")} - 
                      <a href={link} target="_blank" rel="noopener" style={{ color: "#da9036", textDecoration: "none" }}>  Open with YouTube</a>
                    </p>
                  );
                })}
              </div>
            
            </Col>

            <Col sm={3}>


              {mediterraneanRecipe && mediterraneanNutritionInfo && 
                    <Col className='nutrition-info tab-column'>
                      {mediterraneanNutritionInfo.split("\n").map((line, index) => <p key={index}>{line}</p>)}
                    </Col>
              }

              <Tabs/>

            </Col>
            
          </Row>
        </Tab.Container>
        <Footer/>

      </main>
          
    </>
  )
}
