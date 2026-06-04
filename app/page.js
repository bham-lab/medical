import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import Image from "next/image";
import { ArrowRight, Check, Stethoscope } from "lucide-react";
import Link from "next/link";
import { creditBenefits, features, testimonials } from "../lib/data";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import  Pricing  from "../components/ui/pricing";

export default function Home() {
  return (
    <div className="bg-background">
      <section className="relative overflow-hidden py-32">
        <div className="container mx-auto px-4">


         <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div>
              <Badge variant="outline" className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium">
              Healthcare care simple</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"> connect with doctors <br/>
             <span className="gradient-title"> anytime, anywhere</span></h1>
  <p className="text-muted-foreground text-lg md:text-xl max-w-md"> 
    Bookk appointment, consult via video, and manage your healthcare journey all in on source platform.</p>

    <div className="flex flex-col sm:flex-row gap-4"> 
      <Button asChild
        size="lg"
        className="bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <Link href={"/onboarding"} className="flex items-center">
          Get Started <ArrowRight className="ml-2 h-4 w-4" /> 
           </Link>
        
      </Button>

      <Button asChild
        size="lg"
        variant="outline"
        className="bg-emerald-700/30 text-white hover:bg-muted/80"
        >
          <Link href={"/doctors"} className="flex items-center">
          Find Doctors <ArrowRight className="ml-2 h-4 w-4" /> 
           </Link>
        
      </Button>
    </div>
            </div>
             <div className="relative h-[400px] lg:h-[600px] rounded-xl overflow-hidden"> 
              <Image src="/banner2.png" alt="Doctor consultation" fill priority  className="object-cover md:pt-14 rounded-xl"/>
             </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
         <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It works</h2>
         <p className="text-muted-foreground text-lg max-w-2xl mx-auto"> Our platform makes heakthcare accessible with just a few clicks </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
   {features.map((feature,index) => {
    return (
    
      <Card 
      key={index}
      className="border-emerald-900/20 p-3   hover:border-emerald-800/40 transition-all duration-300">
  <CardHeader className="p-2">
    <div className=" border-emerald-900/20 rounded-lg w-fit mb-4 ">{feature.icon}</div>
    <CardTitle className="text-xl font-semibold text-white">{feature.title}</CardTitle>

   
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground ">{feature.description}</p>
  </CardContent>
 
</Card>
    )
   })}
          </div>
        </div>

        
      </section>


       <section className="py-20 ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium" >Affordable Healthcare</Badge>
         <h2 className="text-3xl md:text-4xl font-bold text-white mb-4"> Consultation Package</h2>
         <p className="text-muted-foreground text-lg max-w-2xl mx-auto"> Choose the perfect consultation that fit s your heakthcare needs </p>
          </div>


 <Pricing />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  
    
      <Card 
     
      className="border-emerald-900/20 mt-12 bg-muted/20 ">
  <CardHeader className="p-2">
    <div className=" border-emerald-900/20 rounded-lg w-fit mb-4 "></div>
    <CardTitle className="text-xl font-semibold text-white flex items-center">
      <Stethoscope className="h-5 w-5 mr-2 text-emerald-400" />
      How Our Credit Sytem Works
    </CardTitle>

   
  </CardHeader>
  <CardContent>
   <ul className="space-y-3" >
    {creditBenefits.map((benefit,index)=>{
      return(
<li key ={index} className="flex items-start">
  <div className="mr-3 mt-1 bg-emerald-900/20 p-1 rounded-full flex">
    <Check className="h-4 w-4  text-emerald-400" />
    <p  
    className="text-muted-foreground"
    dangerouslySetInnerHTML={{__html: benefit}}
    />
  </div>

</li>
      );
    })}
   </ul>
  </CardContent>
 
</Card>
    
          </div>
        </div>

        
      </section>





      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
             <Badge className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium" >Success Stories</Badge>
         <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our User Say</h2>
         <p className="text-muted-foreground text-lg max-w-2xl mx-auto"> Hear from patients and doctors who use our platform </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
   {testimonials.map((testimonal,index) => {
    return (
    
      <Card 
      key={index}
      className="border-emerald-900/20 p-3   hover:border-emerald-800/40 transition-all duration-300">
 
  <CardContent className="pt-6">
   <div className="flex items-start mb-4">
    <div className="w-12 h-12 rounded-full bg-emerald-900/20 flex items-center justify-center mr-4"> 
      <span className="text-emerald-400 font-bold">
        {testimonal.initials}
      </span>
    </div>
    <div>
      <h4 className="font-semibold text-white ">{testimonal.name}</h4>
      <p className="text-sm text-muted-foreground">{testimonal.role}</p>
    </div>
   </div>
   <p className="text-muted-foreground">
    &quot;{testimonal.quote}&quot;
   </p>
  </CardContent>
 
</Card>
    )
   })}
          </div>
        </div>

        
      </section>






 <section className="py-20 ">
      

          <div className="container mx-auto px-4">
  
    
      <Card 
   
      className="bg-gradient-t0-r   from-emerald-900/20  to-emerald-950/20 p-3 border-emerald-800/20 ">
 
  <CardContent className="p-8 md:p-12 lg:p-16 relative overflow-hidden ">
   
    <div>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to take control of your health</h2>
      <p className="text-lg text-muted-foreground mb-8">
        Join thousand of users who have simplified their healthcare joureny with our platform. Get Started today and exprience healthcare the way it should be.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
        size="lg"
        className="bg-emerald-600 text-white hover:bg-emerald-700"
        asChild
        >
          <Link href="/sign-up"> Sign Up Now
          </Link>
        </Button>
         <Button
        size="lg"
        variant="outline"
        className="border-emerald-700/30 hover:bg-muted/80"
        asChild
        >
          <Link href="/pricing"> Veiw Pricing
          </Link>
        </Button>
      </div>
    </div>
  </CardContent>
 
</Card>
   
          </div>
   

        
      </section>
     
    </div>
  );
}
