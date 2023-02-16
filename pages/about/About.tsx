import Head from 'next/head';

import Navigation from '../components/Navigation';
import Tabs from '../components/Tabs';
import Footer from '../components/Footer';

import Image from 'next/image'

import styles from '../../styles/Home.module.css'







export default function About() {

  
  

  return (
    <>
      <Head>
        <title>Cook Nando - About</title>
        <meta name="description" content="by Ziad Alotleh" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Navigation/>

        <div className="welcome">
          <div>
          <img src="/about-banner.png" alt="My Image"  style={{width:"100%", maxHeight:"500px", marginTop:"30px", marginBottom:"50px", borderRadius:"5px"}}/>
          </div>
          <h1 className="welcome-h1">Hello! I&rsquo;m your Chef CookNando.</h1>

          <p className="welcome-p" style={{fontSize:'large', lineHeight:'2', maxWidth:"100%"}}>Welcome to our recipe generator, the ultimate solution for all your meal planning needs!<br></br>
           With just a few simple clicks, you can create delicious and healthy meals using ingredients you already have on hand.<br></br>
            Our app features a universal recipe generator as well as specific generators for vegan, Mexican, Indian, Mediterranean, and Chinese cuisines,
             making it easy to find the perfect meal for any occasion.<br></br>
              Plus, our generator provides detailed nutritional information,
              so you can make informed choices about what you eat. <br></br>
              And with the ability to add your own notes and instructions, 
              you can truly make each recipe your own. <br></br> So why wait? Start creating mouth-watering meals today with our recipe generators!</p>
        </div>

        <Tabs/>

        <Footer/>

        </main>
          
    </>
  )
}
