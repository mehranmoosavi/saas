
import { PrismaClient } from "@prisma/client/extension"
import client from "@/lib/prisma"
import Foods from "./foods"

export default async function FoodAdminLayout(){
const foods = await client.food.findMany()
return<div className="grow-0"><Foods foods={foods}/>



</div>


}