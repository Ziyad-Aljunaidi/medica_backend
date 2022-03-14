//import { queryUser } from "./appointment.mjs"
const queryUsr = require("./appointment.js");

queryUsr.queryUser("18020").then((result) => {
    console.log(result)
})