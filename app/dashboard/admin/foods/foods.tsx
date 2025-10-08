import Image from "next/image"
export default function Foods({foods}){

return <main className="flex ">{foods.map((food)=>
<div className="flex flex-col justify-between text-center border-1 align-center rounded-md overflow-hidden  border-amber-950" key={food.id}>
    <h2>{food.name}</h2>
    <Image width={200} height={200} src={food.imageUrl} alt="" />
    <p>{food.price.toString()}</p>
    
    </div>)}
    
    </main>

}