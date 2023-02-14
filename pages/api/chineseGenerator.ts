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

    //  chinesePrompt is the user input from the form field named: chinesePrompt, it is sent by the (response = await fetch) request
  const chinesePrompt = req.query.chinesePrompt;

  //  extraMediterraneanNote is the user input from the form field named: extraMediterraneanNote
  const extraChineseNote = req.query.extraChineseNote;

  if (!chinesePrompt){
    return res.status(400).json({error:"Prompt missing"});
  }

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `check the following ingredients: ${chinesePrompt} are they all food or drinks? please answer by Yes or No`,
    max_tokens: 1000,
    temperature: 0.1,
    presence_penalty: 0,
    frequency_penalty: 0,
  })

  const ingredientCheck =  completion.data.choices[0].text?.trim()

//   i used trim() becuase the response from api was "n/n/Yes or n/n/No"
  console.log("this is the veganCheck result " + ingredientCheck)
 

let chineseRecipe;
let chineseSongs;
let chineseNutritionInfo;

  if (ingredientCheck === 'No') {
    console.log("ingredientCheck has been generated and it is No")

    return res.status(400).json({error: "One of the ingredients provided is not food"});

  } else if (ingredientCheck === 'Yes') {

    console.log("ingredientCheck has been generated and it is Yes")

    const completion1 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `create a recipe using the following ingredients: ${chinesePrompt}, the recipe must be chinese one, and please take in consideration the following: ${extraChineseNote}`,
      max_tokens: 1000,
      temperature: 0.5,
      presence_penalty: 0,
      frequency_penalty: 0,
    })
  
    chineseRecipe =  completion1.data.choices[0].text
    console.log(chineseRecipe)

    const completion2 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `for this recipe ${chineseRecipe} provide the number of calories for per 100g portion and nutrion information`,
      max_tokens: 1000,
      temperature: 0.2,
      presence_penalty: 0,
      frequency_penalty: 0,
    })
    chineseNutritionInfo =  completion2.data.choices[0].text

    const completion3 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `provide 5 up beat songs to listen to while cooking ${chineseRecipe} and provide youtube link for each song`,
      max_tokens: 1000,
      temperature: 0,
      presence_penalty: 0,
      frequency_penalty: 0,
    })
      
    chineseSongs =  completion3.data.choices[0].text?.trim()
  }
  
  res.status(200).json({chineseSongs:chineseSongs,
    chineseRecipe:chineseRecipe, chineseNutritionInfo:chineseNutritionInfo})

}
