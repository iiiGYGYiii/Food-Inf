import express from 'express';
import translate from "translate";
import https from 'https';
import dotenv from 'dotenv';
import _ from "lodash";

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
    translate(req.body.userResponse, {to:"en"}).then(text=>{
        let ntext = _.join(text.split(" ").map(word=> _.capitalize(word)), " ");
        let url = API_URL + ntext;
        
        https.get(url, (response)=>{
            const chunks = [];
            response.on('data', function (chunk) {
                chunks.push(chunk);
            });
            response.on('end', function () {
                const data = Buffer.concat(chunks);
                let got = JSON.parse(data);
                let foodArray = got.parsed;
                let kcalTotal = 0;
                for (let item of foodArray){
                    kcalTotal += item.food.nutrients.ENERC_KCAL;
                }
                res.render("foodinf",{
                    theTitle: "Food Inf",
                    homeActive: "nav-link subtles active",
                    aboutActive: "nav-link subtles",
                    foodArray: foodArray,
                    totalKCAL: kcalTotal
                });
            });
    }); 
    
});  
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
});