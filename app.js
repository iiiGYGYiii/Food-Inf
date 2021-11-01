import express from "express";
import { getFoodInf, searchFoodID, calcCalories } from "./pro/apiconnection.js";

const headerObj = {
  theTitle: "Inicio",
  homeActive: "nav-link subtles active",
  aboutActive: "nav-link subtles",
};

const app = express();

app.set("view engine", "ejs");
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

app
  .route("/")
  .get((req, res) => {
    res.render("home", headerObj);
  })
  .post((req, res) => {
    getFoodInf(searchFoodID(req.body.userResponse)).then((data) => {
      res.render("foodinf", {
        ...headerObj,
        data: data,
        totalKCAL: calcCalories(data),
      });
    });
  });

app.route("/about").get((req, res) => {
  res.render("about", {
    theTitle: "Sobre Mí",
    homeActive: "nav-link subtles",
    aboutActive: "nav-link subtles active",
  });
});

app.get("*", function (req, res) {
  res.render("404", {
    theTitle: "Sobre Mí",
    homeActive: "nav-link subtles",
    aboutActive: "nav-link subtles",
  });
});

let PORT = process.env.PORT;
if (!PORT) {
  PORT = 3000;
}

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
