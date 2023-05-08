require('dotenv').config();
const express=require('express');
const path=require('path');
const morgan=require('morgan');
const cors=require('cors')
const app=express();
const { Configuration, OpenAIApi } = require("openai");
app.use(express.static(path.join(process.cwd(),'views')))

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(express.json()).use(express.urlencoded({extended:true}))
//app.use(cors());
app.use(morgan('dev'))

//routes go here

app.get('/',(req,res)=>{
  res.sendFile(require('path').join(process.cwd(),'views','index.html'))
})

app.post('/',async(req,res)=>{
  
  
  const{string,language}=await req.body
  console.log(string,language)
    let promptString=`${string}  ${language}`
let completion=await openai.createCompletion({
    model: "text-davinci-002",
    prompt: promptString,
    temperature: 0.3,
    max_tokens: 100,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  
  let result=completion.data.choices;
  result.forEach(el=>{
   res.json({msg:el.text})
    console.log('this:',el.text)

  })
 
})
const port=process.env.PORT||3243;
app.listen(port,()=>{console.log('started')})

