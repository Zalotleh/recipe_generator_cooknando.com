// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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

  const prompt = req.query.prompt;
  const extraNote = req.query.extraNote;

  if (!prompt){
    return res.status(400).json({error:"Prompt missing"});
  }

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `check the following ingredients: ${prompt} are they all food or drinks? please answer by Yes or No`,
    max_tokens: 1000,
    temperature: 0.1,
    presence_penalty: 0,
    frequency_penalty: 0,
  })

  const ingredientCheck =  completion.data.choices[0].text?.trim()

  let recipe;
  let songs;
  let nutritionInfo;

  if (ingredientCheck === 'No'){
    console.log("the ingredients are not food")
    return res.status(400).json({error: "One of the ingredients provided is not food"});

  } else if(ingredientCheck === 'Yes'){
    console.log("the ingredients are food")

  const completion1 = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `use these ingredients ${prompt} and create a recipe with full instruction and time it will take and please take in consideration the following ${extraNote}`,
    max_tokens: 2000,
    temperature: 0.1,
    presence_penalty: 0,
    frequency_penalty: 0,
  })

  recipe =  completion1.data.choices[0].text
  console.log("recipe has been generated")

  const completion2 = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `for this recipe ${recipe} provide the number of calories for per 100g portion and nutrion information`,
    max_tokens: 1000,
    temperature: 0.2,
    presence_penalty: 0,
    frequency_penalty: 0,
  })
  nutritionInfo =  completion2.data.choices[0].text

  const completion3 = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `provide 5 up beat songs to listen to while cooking ${recipe} and provide youtube link for each song`,
    max_tokens: 1000,
    temperature: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
  })

  songs =  completion3.data.choices[0].text?.trim()

}

  res.status(200).json({songs:songs,
    recipe:recipe , nutritionInfo:nutritionInfo})
}
