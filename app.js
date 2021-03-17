import express from 'express';
import translate from "translate";
import https from 'https';
import dotenv from 'dotenv';


dotenv.config();

const API_ID = process.env.API_ID;
const API_KEY = process.env.API_KEY;
const API_URL = `https://api.edamam.com/api/food-database/v2/parser?app_id=${API_ID}&app_key=${API_KEY}&ingr=`

translate.engine='libre';
translate.from="es";

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));

app.route('/')
.get((req,res)=>{
    res.render("home", {
        theTitle: 'Inicio',
        homeActive: "nav-link subtles active",
        aboutActive: "nav-link subtles"
    })
})
.post((req,res)=>{
    //const text = await translate("café y pan", "en");
    const transText = translateUserResponse(req.body.userResponse);
    let url = API_URL + req.body.userResponse;
    https.get(url, (response)=>{
        const chunks = [];
        response.on('data', function (chunk) {
          chunks.push(chunk);
        })
    
        response.on('end', function () {
          const data = Buffer.concat(chunks);
          let got = JSON.parse(data);
          //console.log(got.parsed[0].food.nutrients);
          console.log(got)
        })
    });
    res.redirect("/");
});

app.route("/about")
.get((req,res)=>{
    res.render("about", {
        theTitle: "Sobre Mí",
        homeActive: "nav-link subtles",
        aboutActive: "nav-link subtles active"
    })
});

let PORT = process.env.PORT;
if (!PORT){
    PORT = 3000;
}

app.listen(PORT, ()=>{
    console.log(`App is running on port ${PORT}`);
})


async function translateUserResponse(userResponse){
    const text = await translate(userResponse, "es");
    return text;
}