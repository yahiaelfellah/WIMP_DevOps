const app  = require("./app");
const config = require('dotenv').config()
const PORT = process.env.PORT || 50052;

// listening
app.listen(PORT ,()=> {
    console.log("Gateway running on port :" + PORT);
})