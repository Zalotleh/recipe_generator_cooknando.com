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

    //  MexicanPrompt is the user input from the form field named: MexicanPrompt, it is sent by the (response = await fetch) request
  const mexicanPrompt = req.query.mexicanPrompt;

  //  extraMexicanNote is the user input from the form field named: extraMexicanNote
  const extraMexicanNote = req.query.extraMexicanNote;

  if (!mexicanPrompt){
    return res.status(400).json({error:"Prompt missing"});
  }

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `check the following ingredients: ${mexicanPrompt} are they all food or drinks? please answer by Yes or No`,
    max_tokens: 1000,
    temperature: 0.1,
    presence_penalty: 0,
    frequency_penalty: 0,
  })

  const ingredientCheck =  completion.data.choices[0].text?.trim()

//   i used trim() becuase the response from api was "n/n/Yes or n/n/No"
  console.log("this is the veganCheck result " + ingredientCheck)
 

let mexicanRecipe;
let mexicanSongs;
let mexicanNutritionInfo;

  if (ingredientCheck === 'No') {
    console.log("ingredientCheck has been generated and it is No")

    return res.status(400).json({error: "One of the ingredients provided is not food"});

  } else if (ingredientCheck === 'Yes') {

    console.log("ingredientCheck has been generated and it is Yes")

    const completion1 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `create a recipe using the following ingredients: ${mexicanPrompt}, the recipe must be mexican one, and please take in consideration the following: ${extraMexicanNote}`,
      max_tokens: 1000,
      temperature: 0.5,
      presence_penalty: 0,
      frequency_penalty: 0,
    })
  
    mexicanRecipe =  completion1.data.choices[0].text
    console.log(mexicanRecipe)

    const completion2 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `for this recipe ${mexicanRecipe} provide the number of calories for per 100g portion and nutrion information`,
      max_tokens: 1000,
      temperature: 0.2,
      presence_penalty: 0,
      frequency_penalty: 0,
    })
    mexicanNutritionInfo =  completion2.data.choices[0].text

    const completion3 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `provide 5 up beat mexican songs to listen to while cooking ${mexicanRecipe} and provide youtube link for each song`,
      max_tokens: 1000,
      temperature: 0,
      presence_penalty: 0,
      frequency_penalty: 0,
    })
      
    mexicanSongs =  completion3.data.choices[0].text?.trim()
  }
  
  res.status(200).json({mexicanSongs:mexicanSongs,
    mexicanRecipe:mexicanRecipe, mexicanNutritionInfo:mexicanNutritionInfo})

}
