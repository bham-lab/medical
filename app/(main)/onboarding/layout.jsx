 
  import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../actions/onboarding";
 
 
 export const metadata = {
    title: "Medical - Onboarding",
    description: "complete your profile to get started with Medical",
  };

   const OnboardingLayout = async ({children}) =>{
    const user = await getCurrentUser();
      

    if(user){
        if (user.rolen === "PATIENT"){
            redirect("/doctors");
        }
        else if (user.role === "DOCTOR"){
            if(user.verificationStatus === "VERIFIED") {
              redirect("/doctors");    
            } 
            else {
                redirect("/doctors/verification");
            }
        
    }  else if (user.role === "ADMIN"){
   redirect("/admin");
    }
}
   return (
   
   <div className="container mx-auto py-12 px-4"> 
    <div className="max-w-3xl mx-auto"> 
        <div className="text-center mb-10">
            <h1 className=" text-3xl md:text-4xl gradient-title mb-2">Welcome To Medical</h1>
            <p className="text-muted-foreground mb-2 text-lg">Tell us how you want to use the platform</p>
        </div>
        {children}  

    </div>
   
    
    </div>

)
  }

  export default OnboardingLayout;