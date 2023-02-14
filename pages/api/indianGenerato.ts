import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    //  indianPrompt is the user input from the form field named: indianPrompt, it is sent by the (response = await fetch) request
  const indianPrompt = req.query.indianPrompt;

  //  extraIndianNote is the user input from the form field named: extraIndianNote
  const extraIndianNote = req.query.extraIndianNote;

  if (!indianPrompt){
    return res.status(400).json({error:"Prompt missing"});
  }

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `check the following ingredients: ${indianPrompt} are they all food or drinks? please answer by Yes or No`,
    max_tokens: 1000,
    temperature: 0.1,
    presence_penalty: 0,
    frequency_penalty: 0,
  })

  const ingredientCheck =  completion.data.choices[0].text?.trim()

//   i used trim() becuase the response from api was "n/n/Yes or n/n/No"
  console.log("this is the veganCheck result " + ingredientCheck)
 

let indianRecipe;
let indianSongs;
let indianNutritionInfo;

  if (ingredientCheck === 'No') {
    console.log("ingredientCheck has been generated and it is No")

    return res.status(400).json({error: "One of the ingredients provided is not food"});

  } else if (ingredientCheck === 'Yes') {

    console.log("ingredientCheck has been generated and it is Yes")

    const completion1 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `create a recipe using the following ingredients: ${indianPrompt}, the recipe must be indian one, and please take in consideration the following: ${extraIndianNote}`,
      max_tokens: 1000,
      temperature: 0.5,
      presence_penalty: 0,
      frequency_penalty: 0,
    })
  
    indianRecipe =  completion1.data.choices[0].text
    console.log(indianRecipe)

    const completion2 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `for this recipe ${indianRecipe} provide the number of calories for per 100g portion and nutrion information`,
      max_tokens: 1000,
      temperature: 0.2,
      presence_penalty: 0,
      frequency_penalty: 0,
    })
    indianNutritionInfo =  completion2.data.choices[0].text

    const completion3 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `provide 5 up beat famous indian songs to listen to while cooking ${indianRecipe} and provide youtube link for each song`,
      max_tokens: 1000,
      temperature: 0,
      presence_penalty: 0,
      frequency_penalty: 0,
    })
      
    indianSongs =  completion3.data.choices[0].text?.trim()
  }
  
  res.status(200).json({indianSongs:indianSongs,
    indianRecipe:indianRecipe, indianNutritionInfo:indianNutritionInfo})

}
