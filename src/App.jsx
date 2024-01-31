import { useState } from 'react';
import axios from "axios";
import logo from "./assets/pngwing.png";
import { Modal, Box, Typography, TextField, LinearProgress } from '@mui/material';
import GPTResponse from './components/GPTResponse';


function App() {
  const URL = "https://api.cohere.ai/v1/generate";
  const auth= "ZkJUbmAflNFzYMFnDs0uKTJl1YtKyuMAWrQBRSaM"
  const GEMINI_KEY= "AIzaSyBQO5WbbBvOaS0JcKa00H4G1OEGE5yC4ac"

  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const[gemini, setGemini] = useState(false);
  const[cohere, setCohere] = useState(false)

  const handleOpen = () => {
    setOpen(true);
    setCohere(true)
    setGemini(false)
  }
  const handleOpenGemini = () => {
    setOpen(true);
    setGemini(true)
    setCohere(false)
  }

  const handleClose = () => {
    setOpen(false);
    setResponse("");
    setPrompt("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(prompt)
    {
    if(gemini === true)
    { console.log("gemini")
      const data = JSON.stringify({
        "contents": [{
          "parts":[{
            "text": `${prompt}`}]}]})
      setLoading(true);
      await axios
      .post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,data, { 
        headers:{
         "Content-Type": "application/json",
        },
       }) .then((res) => {
      console.log(res);
      setLoading(false);
      setResponse(res?.data?.candidates[0]?.content?.parts[0]?.text);
       }).catch((error) => {
        console.log(error);
      });
    } else if(cohere === true)
    {
      console.log("cohere")
      const data = JSON.stringify({
        "truncate": "END",
        "return_likelihoods": "NONE",
        "temperature": 0.3,
        "prompt": `${prompt}`
      })
      setLoading(true);
      await axios
      .post(`${URL}`,data, { 
        headers:{
         "Content-Type": "application/json",
         Authorization:`Bearer ${auth}`,
        },
       }) .then((res) => {
      console.log("data",res);
      setLoading(false);
      setResponse(res?.data?.generations[0]?.text);
       }).catch((error) => {
        console.log(error);
      });
    }
  } else return;

  }

  return (
    <div className="app">
      <img src={logo}   className="img-container"/> 
      <div className="button-container">
      <button className="btn" onClick={handleOpen}>Cohere</button>
      
      <button className="btn" onClick={handleOpenGemini}>Gemini</button>
      </div>

      
      <Modal
        open={open}
        onClose={handleClose}
        className="chatgpt-modal"
      >
          <Box className="container">
            <div>
              <Typography variant="h6" component="h2">
              Email content generation using {cohere ? <span>Cohere</span> :  <span>Gemini</span>}
              </Typography>
              <form style={{ display: "flex", flexDirection: "column", alignItems: "center" }} onSubmit={handleSubmit}>
                <TextField value={prompt} onChange={(e) => {setPrompt(e.target.value)}} id="outlined-basic" label="Query" variant="outlined" sx={{margin: "15px 0", width: "100%"}} />
                <button className="btn">Submit</button>
              </form>
            </div>

            {loading && <LinearProgress />}
            {response && <GPTResponse response={response} />}
          </Box>
      </Modal>
    </div>
  )
}

export default App
