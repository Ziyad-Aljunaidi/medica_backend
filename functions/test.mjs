import { queryUser } from "./appointment.mjs"


queryUser("18020").then((result) => {
    console.log(result)
})