const express = require('express');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios'); // Add this line to install axios: npm install axios

const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


//ai keys
const customVisionApiKey = '0a3a4223b6274d8cba67dc4304b5e147';
const customVisionEndpoint = 'https://joshmission2-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/1b8c8f8b-d481-4a1a-a37b-a0806cb84496/detect/iterations/Car%20Testing/image'; 
const iterationId = 'e54773eb-24b0-4312-b3b9-2f164d77c895';


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/classify', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided.' });
  }

  const imageData = req.file.buffer;

  try {
    // Make a request to the Custom Vision API for predictions
    //sending post request to my endpoint 
    //if the request is successful the try block should extract the predicted car type from the api response
    const response = await axios.post(
      customVisionEndpoint,
      imageData,
      {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Prediction-Key': customVisionApiKey,
        },
      }
    );



    // Extract the predicted result
    const carType = response.data.predictions[0].tagName;

    //this line should show the predicted car on the web page
    res.json({ carType });
    //If there is an error the catch block should respond with a 500 internal server error
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
