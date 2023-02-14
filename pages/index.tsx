import Head from 'next/head';
import { FormEvent,useState } from 'react';

import Navigation from './components/Navigation';
import Tabs from './components/Tabs';
import Footer from './components/Footer';


import styles from '../styles/Home.module.css';

import { Form, Spinner, Button} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';





export default function Home() {

  const [recipe, setRecipe] = useState("");
  const [songs, setSongs] = useState("");
  const [nutritionInfo, setNutritionInfo] = useState("");


  const [recipeLoading, setRecipeLoading] = useState(false);
  const [recipeLoadingError, setRecipeLoadingError] = useState(false)


  async function handleSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault();
    //  we get the data from the form, we get the e.target, HTMLFormElement is typescript to identify the type
    const formData = new FormData(e.target as HTMLFormElement)
    // we get the data itself, and we stringfiy it and trim and extra spaces
    const prompt = formData.get("prompt")?.toString().trim();
    // "prompt" is the name of the form in the html
    const extraNote = formData.get("extraNote")?.toString().trim() || '';
    // "extraNote" is the name of the form in the html

    if (prompt){
      try{
        // if the prompt exist: if the user types something:
        // we set the recipe to an empty string
        // we delete the errors and display the loading message
        setRecipe("");
        setSongs("");
        setNutritionInfo("");

        setRecipeLoadingError(false);
        setRecipeLoading(true);

        // we send the prompt to the API end point, and get a response back
        const response = await fetch(`/api/generator?prompt=${encodeURIComponent(prompt)}&extraVeganNote=${encodeURIComponent(extraNote)}`);
        // checking if the recipe has been generated
        if (!response.ok) {
          throw new Error(await response.text());
          
        }
        // here is the response from the API
        const body = await response.json();

        console.log(body)


        
        
        setRecipe(body.recipe);
        setSongs(body.songs);
        setNutritionInfo(body.nutritionInfo);



      }catch(error){
        console.error(error);
        setRecipeLoadingError(true);
      }
      finally{
        setRecipeLoading(false)
      }
    }
  }

  return (
    <>
      <Head>
        <title>Cook Nando - Home Page</title>
        <meta name="description" content="by Ziad Alotleh" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Navigation/>
        <div className="welcome">
          <h1 className="welcome-h1">Hey there! I&rsquo;m your kickside Chef CookNando, here to help you rustle up a tantalizing dish.</h1>
          <p className="welcome-p">Let&rsquo;s get started! Simply input the ingredients 
          you have on hand and add your extra touch, or choose from our recipes generators list. 
          Your personalized recipe is just a few clicks away! 
          Let&rsquo;s start cooking!</p>
        </div>

        <Tab.Container id="left-tabs-example" >
          <Row className="tabs-form-row">
            <Col sm={9}>
              <Form onSubmit={handleSubmit} className="inputForm">
                  <Form.Group className='mb-3' controlId='prompt-input'>
                    
                    <Form.Control
                      required
                      name='prompt'
                      placeholder='add ingredients here, ex: tomato 100g, olive oil 1 cup .. etc'
                    />
                    <p >Add you ingredients here</p>

                    <Form.Control
                      maxLength={300}
                      name='extraNote' className='extra-note'
                      placeholder='add any extra instructions or notes here. ex: do not add salt'
                    />
                    <p>Add any additional notes or instruction here</p>

                  </Form.Group>

                  <Button type='submit' className='mb-3 generator-button' disabled={recipeLoading}>
                    Generate Recipe
                  </Button>

              </Form>
              <div className="spinner">
                {/* if the recipeLoading is true, we display the Spinner and the p tag */}
                {recipeLoading && (<><Spinner animation='border' /> 
                 <p>Cooking up a culinary masterpiece, hang tight foodie!</p>
                 </>)
                }
              </div>
              {recipeLoadingError && <div className="errorMessage">Oh fiddle sticks! Something didn&rsquo;t go as planned. Shall we try again?</div>}
              
              {recipe && <><h5 className='recipe-header-text'>Bon Appetit! Your dish has been magically conjured by CookGenie.</h5></>}
              <div className="generated-recipe">     
                {recipe && recipe.split("\n").map((line, index) => <p key={index}>{line}</p>)}
              </div>

              {songs && <><h4 className='songs-header-text'>These jams are the secret ingredient, so turn up the volume and ENJOY!</h4></>}

              <div className="generated-songs">
                {songs && songs.split("\n").map((line) => {
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
            

            <Col  sm={3}>
              

                {recipe && nutritionInfo && 
                  <Col className='nutrition-info tab-column'>
                    {nutritionInfo.split("\n").map((line, index) => <p key={index}>{line}</p>)}
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
