 var foodInfo = [
        {
            title: "Thali",
            wIncluded: "served with salad, naan & rice.",
            description: "consists of two vegetables, daals, rice and naan",
            category: "classic",
            price: 9.99,
            cookingTime: 25,
            servings: 2,
            calories: 1000,
            photo: "./images/thali.jpg",
            topMeal: false
        },
        {
            title: "Daal Makhni",
            wIncluded: "served with rice or naan",
            description: "Protein rich daal with delicious naan",
            category: "classic",
            price: 6.99,
            cookingTime: 25,
            servings: 2,
            calories: 1000,
            photo: "./images/daalMakhni.jpg",
            topMeal: true
        },
        {
            title: "Shahi Paneer",
            wIncluded: "served with naan & rice.",
            description: "Mouth watering panner with gravy",
            category: "classic",
            price: 10.99,
            cookingTime: 25,
            servings: 2,
            calories: 1000,
            photo:"./images/shahiPaneer.jpg" ,
            topMeal: true
        },
        {
            title: "Chana Masala",
            wIncluded: "served with salad, naan & rice.",
            description: "Delicious and protein rich chanas",
            category: "classic",
            price: 9.99,
            cookingTime: 25,
            servings: 2,
            calories: 1000,
            photo:"./images/chanaMasala.jpg" ,
            topMeal: false
        },
        {
            title: "Vegetable Samosas (2pcs)",
            wIncluded: "served with imly chutney.",
            description: "everygreen indian snack",
            category: "starter",
            price: 2.99,
            cookingTime: 25,
            servings: 2,
            calories: 1000,
            photo:"./images/samosas.jpg" ,
            topMeal: false
        },
        {
            title: "Onion Bhajias (4pcs)",
            wIncluded: "served with red chutney",
            description: "go to food for indians during rain",
            category: "starter",
            price: 3.99,
            cookingTime: 25,
            servings: 4,
            calories: 1000,
            photo:"./images/bhajia.jpg" ,
            topMeal: false
        },
        {
            title: "Butter Chicken Naan",
            wIncluded: "with daahi",
            description: "Main item for any parties",
            category: "classic",
            price: 20,
            cookingTime: 25,
            servings: 2,
            calories: 1000,
            photo: "./images/butter chicken naan.jpg",
            topMeal: true
        },
        {
            title: "Dosa",
            wIncluded: "with Sambhar",
            description: "Best south-indian meal",
            category: "classic",
            price: 20,
            cookingTime: 25,
            servings: 2,
            calories: 250,
            photo: "./images/dosa.jpg",
            topMeal: false
        }
    ];


module.exports.getClassic = function()
{
    var classic = [];

    for (var i=0; i < foodInfo.length; i++)
    {
        if(foodInfo[i].category == "classic")
        classic.push(foodInfo[i]); 
    }
   return classic;
}

module.exports.getStarter = function()
{
    var starter = [];

    for (var i=0; i < foodInfo.length; i++)
    {
        if(foodInfo[i].category == "starter")
        starter.push(foodInfo[i]); 
    }
   return starter;
}

module.exports.getTopMeal = function()
{
    var topMeal = [];

    for (var i=0; i < foodInfo.length; i++)
    {
        if(foodInfo[i].topMeal) {
            topMeal.push(foodInfo[i]); 
        }
    }
   return topMeal;
}

module.exports.getAllFoodItems = function()
{
    return foodInfo;
}

