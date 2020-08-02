const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const nodemailer = require("nodemailer");
const app = express();
const PORT = process.env.PORT || 3000;
require("dotenv").config()

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));

//nodemailer function
async function main(url,email,res) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email, // list of receivers
      subject: "Chad has sent you your yokee video!", // Subject line
      text: `Hello please see attached. You can also access the full sized video at ${url}, and right click to download.`, // plain text body
      attachments: [{
        filename: "video.mp4",
        content:url
      }]
    });
    console.log("Message sent: %s", info.messageId);
    res.json("success!");
  }
  
 

app.post("/api/getvid", ({body: {email, url}}, res)=>{
    axios.get(url).then(async ({data}) => {
        const $ = await cheerio.load(data);
        const vidURL = $(".thumb1").attr("src").replace(/\.jpg/, ".mp4");
        main(vidURL,email,res).catch(console.error);
    })
});

app.get("*", (req,res)=> res.sendFile(path.join(__dirname, "./public/index.html")));

app.listen(PORT, ()=> console.log(`App is running on port ${PORT}!`))
