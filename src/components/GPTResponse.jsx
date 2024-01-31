// import React from 'react'
import "./gPTResponse.css"

const GPTResponse = (response) => {
  
console.log("response",response)
  return (
    <div className="response">
        <p className="response-data">{response?.response}</p>
    </div>
  )
}

export default GPTResponse