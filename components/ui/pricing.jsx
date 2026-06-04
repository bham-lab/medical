import { PricingTable } from "@clerk/nextjs"
import { Card, CardContent } from "./card"

  const Pricing = () =>{
  return(
    <Card className="border-emerald-900/30 shadow-lg bg-gradient-to-b from-emerald-950/30 to-transparent">
        <CardContent className="p-6 md:p-8">
            <PricingTable checkoutProps={{
                appearance:{
                    elements:{
                        drawRoot:{
                            zIndex: 200,
                        }
                    }
                }
            }}/>
        </CardContent>
    </Card>
  )

  }

  export default Pricing