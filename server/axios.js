const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Read the image file as binary data


const apiKey = process.env['imgbbapikey'];

async function postimg(img,pid) {
const imageData = img.split(',')[1];
  
  //const bImageData = Buffer.from(imageData, 'base64');
  
  const form = new FormData();
  form.append('image', imageData);
  
  const config = {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
    },
    params: {
      key: apiKey,
    },
  };
  
  const response = await axios.post('https://api.imgbb.com/1/upload', form, config);
  return [response.data.data.thumb.url,response.data.data.delete_url];

}


module.exports = { postimg }