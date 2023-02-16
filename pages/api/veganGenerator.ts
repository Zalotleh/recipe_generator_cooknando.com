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

    //  VeganPrompt is the user input from the form field named: VeganPrompt, it is sent by the (response = await fetch) request
  const veganPrompt = req.query.veganPrompt;

  //  extraVeganNote is the user input from the form field named: extraVeganNote
  const extraVeganNote = req.query.extraVeganNote;

  if (!veganPrompt){
    console.log("the promot is missing")

    return res.status(400).json({error:"Prompt missing"});
  }

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `check the following ingredients: ${veganPrompt} are they all vegan and food or drinks? please answer by Yes or No`,
    max_tokens: 1000,
    temperature: 0.1,
    presence_penalty: 0,
    frequency_penalty: 0,
  })

  const ingredientCheck =  completion.data.choices[0].text?.trim()
//   i used trim() becuase the response from api was "n/n/Yes or n/n/No"
console.log("this is the ingredientCheck point and the result is: " + ingredientCheck)
 

let veganRecipe;
let veganNutritionInfo;

  if (ingredientCheck === 'No') {
    console.log("ingredientCheck has been generated and it is No")

    return res.status(400).json({error: "One of the ingredients provided is not vegan"});

  } else if (ingredientCheck === 'Yes') {
    const completion1 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `create a vegan recipe using the following ingredients: ${veganPrompt} and please take in consideration the following: ${extraVeganNote}`,
      max_tokens: 1000,
      temperature: 0.5,
      presence_penalty: 0,
      frequency_penalty: 0,
    })
  
    veganRecipe =  completion1.data.choices[0].text
    console.log("recipe has been generated")

    const completion2 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `for this recipe ${veganRecipe} provide the number of calories for per 100g portion and nutrion information`,
      max_tokens: 1000,
      temperature: 0.2,
      presence_penalty: 0,
      frequency_penalty: 0,
    })
    veganNutritionInfo =  completion2.data.choices[0].text
    console.log(" nutritionInfo has been generated")

   
  }
  
  res.status(200).json({
    veganRecipe:veganRecipe, veganNutritionInfo:veganNutritionInfo})

}