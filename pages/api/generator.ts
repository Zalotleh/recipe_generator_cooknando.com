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
    console.log("the promot is missing")
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
  console.log("this is the ingredientCheck point and the result is: " + ingredientCheck)


  let recipe;
  let nutritionInfo;

  if (ingredientCheck === 'No'){
    console.log("ingredientCheck has been generated and it is No")
    return res.status(400).json({error: "One of the ingredients provided is not food"});

  } else if(ingredientCheck === 'Yes'){

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

  console.log(" nutritionInfo has been generated")


}

  res.status(200).json({
    recipe:recipe , nutritionInfo:nutritionInfo})
}
