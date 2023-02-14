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



export default function Chinese() {

  const [chineseRecipe, setChineseRecipe] = useState("");
  const [chineseSongs, setChineseSongs] = useState("");
  const [chineseNutritionInfo, setChineseNutritionInfo] = useState("");


  const [chineseRecipeLoading, setChineseRecipeLoading] = useState(false);
  const [chineseRecipeLoadingError, setChineseRecipeLoadingError] = useState(false)

  async function chineseHandleSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault();
    //  we get the data from the form, we get the e.target, HTMLFormElement is typescript to identify the type
    const chineseFormData = new FormData(e.target as HTMLFormElement)
    // we get the data itself, and we stringfiy it and trim and extra spaces
    const chinesePrompt = chineseFormData.get("chinesePrompt")?.toString().trim();
    // "chinesePrompt" is the name of the form in the html
    const extraChineseNote = chineseFormData.get("extraChineseNote")?.toString().trim() || '';
    // "extraChineseNote" is the name of the form in the html

    if (chinesePrompt){
      try{
        // if the prompt exist: if the user types something:
        // we set the recipe to an empty string
        // we delete the errors and display the loading message
        setChineseRecipe("");
        setChineseSongs("");
        setChineseNutritionInfo("");

        setChineseRecipeLoadingError(false);
        setChineseRecipeLoading(true);

        // we send the prompt to the API end point, and get a response back
        const response = await fetch(`/api/chineseGenerator?chinesePrompt=${encodeURIComponent(chinesePrompt)}&extraChineseNote=${encodeURIComponent(extraChineseNote)}`);
        
        // checking if the recipe has been generated
        if (!response.ok) {
          throw new Error(await response.text());
          
        }
        // here is the response from the API
        const body = await response.json();

        console.log(body)

        setChineseRecipe(body.chineseRecipe);
        setChineseSongs(body.chineseSongs);
        setChineseNutritionInfo(body.chineseNutritionInfo)


      }catch (error) {
        console.error(error);
        setChineseRecipeLoadingError(true);
        }
      finally{
        setChineseRecipeLoading(false)
      }
 
    }
  }

  return (
    <>
      <Head>
        <title>CookNando - Chinese Recipes</title>
        <meta name="description" content="by Ziad Alotleh" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main  className={styles.main}>
        
        <Navigation/>

        <div className="welcome">
          <h1 className='welcome-h1'>Ni hao! Let&rsquo;s cook up some delicious dishes. What ingredients will you use to create your masterpiece?</h1>
          <p className='welcome-p'></p>
        </div>

        <Tab.Container id="left-tabs-example" >
          <Row className='tabs-form-row'>

          <Col sm={9}>
            <Form onSubmit={chineseHandleSubmit} className="inputForm">
                <Form.Group className='mb-3' controlId='prompt-input'>
                 
                  <Form.Control
                    required
                    name='chinesePrompt'
                    placeholder='add ingredients here, ex: tomato 100g, olive oil 1 cup .. etc'
                  />
                  <p>Add you ingredients here</p>

                  <Form.Control className='extra-note'
                    maxLength={300}
                    name='extraChineseNote'
                    placeholder='add any extra instructions or notes here. ex: do not add salt'
                  />
                  <p>Add any additional notes or instruction here</p>

                </Form.Group>
                 
                  
                <Button type='submit' className='mb-3 generator-button' disabled={chineseRecipeLoading}>
                  Generate Recipe
                </Button>

              </Form>
              <div className="spinner">
                {chineseRecipeLoading && (<><Spinner animation='border' /> 
                 <p>Cooking up a culinary masterpiece, hang tight foodie!</p>
                 </>)
                }
              </div>
              {chineseRecipeLoadingError && <div className="errorMessage">Oh fiddle sticks! Something didn&rsquo;t go as planned. Shall we try again?</div>}
              {chineseRecipe && <><h5 className='recipe-header-text'>Bon Appétit! Your dish has been magically conjured by CookGenie.</h5></>}
              <div className="generated-recipe">        
                {chineseRecipe && chineseRecipe.split("\n").map((line, index) => <p key={index}>{line}</p>)}
              </div>

              {chineseSongs && <><h4 className='songs-header-text'>These jams are the secret ingredient, so turn up the volume and ENJOY!</h4></>}

              <div className="generated-songs">
                {chineseSongs && chineseSongs.split("\n").map((line) => {
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


              {chineseRecipe && chineseNutritionInfo && 
                    <Col className='nutrition-info tab-column'>
                      {chineseNutritionInfo.split("\n").map((line, index) => <p key={index}>{line}</p>)}
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
