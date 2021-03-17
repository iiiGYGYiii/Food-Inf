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
        theTitle: 'Inicio'
    })
});

app.route("/about")
.get((req,res)=>{
    res.render("about", {
        theTitle: "Sobre Mí"
    })
});


app.listen(3000 | process.env.PORT, ()=>{
    console.log("Aplicación corriendo en el puerto 3000");
})