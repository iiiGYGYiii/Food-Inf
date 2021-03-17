import express from 'express';

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
});

app.route("/about")
.get((req,res)=>{
    res.render("about", {
        theTitle: "Sobre Mí",
        homeActive: "nav-link subtles",
        aboutActive: "nav-link subtles active"
    })
});


app.listen(3000 | process.env.PORT, ()=>{
    console.log("Aplicación corriendo en el puerto 3000");
})