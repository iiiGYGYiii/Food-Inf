import fetch from "node-fetch";
import dotenv from "dotenv";
import _ from "lodash";
dotenv.config();

const API_ID = process.env.API_ID;
const API_KEY = process.env.API_KEY;
const API_URL = `https://api.edamam.com/api/food-database/v2/parser?app_id=${API_ID}&app_key=${API_KEY}&nutrition-type=logging&ingr=`;
const NUTRIENTS_URL = `https://api.edamam.com/api/food-database/v2/nutrients?app_id=${API_ID}&app_key=${API_KEY}`;

async function searchFoodID(userResponse) {
  // THIS FUNCTION USES DE NLP OFFERED BY THE API, SO IT RETRIEVES
  // FOOD DATA GIVEN THE USER INPUT
  try {
    const foodItems = [];
    let url =
      API_URL +
      _.join(
        userResponse.split(" ").map((word) => _.capitalize(word)),
        " "
      );

    console.log(url);
    // GET REQUEST TO THE API
    const response = await fetch(url);
    const jsonData = await response.json();
    // THIS IS MADE BECAUSE ONLY I NEED IS THE BASIC INFORMATION OF THE
    // FOOD FOUND
    for (let item of jsonData.parsed) {
      foodItems.push({
        id: item.food.foodId,
        nombre: item.food.label,
        imagen: item.food.image,
      });
    }
    return foodItems;
  } catch (e) {
    console.error("First message", e.message);
    return e;
  }
}

async function getFoodInf(foodItems) {
  // SETTING THE COFIGURATION FOR THE POST REQUEST THAT THE API REQUIRES
  const fetchConfig = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  // SETTING A BASE OBJECT THAT API REQUIRES TO RETRIEVE DATA
  const foodJSON = {
    quantity: 100,
    measureURI: "http://www.edamam.com/ontologies/edamam.owl#Measure_gram",
  };

  try {
    // foodItems IS GIVEN AS A PROMISE, HAD TO RESOLVE
    const foodItemss = await foodItems;
    const foodIds = foodItemss.map((item) => item.id);
    // FOR AL ID's GIVEN, CREATE A POST REQUEST TO API
    const foodItemsInf = await Promise.allSettled(
      foodIds.map((id) =>
        fetch(NUTRIENTS_URL, {
          ...fetchConfig,
          body: JSON.stringify({
            ingredients: [
              {
                ...foodJSON,
                foodId: id,
              },
            ],
          }),
        }).then((resp) => resp.json())
      )
    );

    // MERGING THE OBJECTS foodItemss ARRAY WITH OBJECTS OF
    // foodItemsInf REFERING THEM TO THE COMMON ID
    // newArray IS THE TOTAL ARRAY CONTAINING ALL THE INFO GIVEN BY API
    const newArray = foodItemss.map((itm) => ({
      ...foodItemsInf.find(
        (item) => item.value.ingredients[0].parsed[0].foodId == itm.id && item
      ).value,
      ...itm,
    }));
    const sendFoodInf = [];
    for (let item of newArray) {
      sendFoodInf.push({
        nombre: item.nombre,
        imagen: item.imagen,
        calorias: item.calories,
        grasas: item.totalNutrients.FAT.quantity,
        proteina: item.totalNutrients.PROCNT.quantity,
      });
    }
    return sendFoodInf;
  } catch (e) {
    console.error("Second message", e.message);
    return "Hey!";
  }
}

function calcCalories(foodArray) {
  let totalCalories = 0;
  for (let item of foodArray) {
    totalCalories += item.calorias;
  }
  return totalCalories;
}

export { searchFoodID, getFoodInf, calcCalories };
