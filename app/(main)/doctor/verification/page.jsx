import { redirect } from "next/navigation";
import { getCurrentUser } from  "../../../../actions/onboarding";

import { Card , CardHeader,CardTitle, CardDescription, CardContent } from "../../../../components/ui/card";
import { AlertCircle, ClipboardCheck, XCircle } from "lucide-react";

import { Button } from "../../../../components/ui/button";
import React from "react";
import  Link  from "next/link";



   


   const VerificationPage = async () =>{

      const user = await getCurrentUser ();

      if (user?.verificationStatus === "VERIFIED"){
        redirect("/doctor")
      }

      const isRejected = user?.verificationStatus === "REJECTED";
    return(
  <div className="container mx-auto px-4 py-12 text-center">
    <div className="max-w-2xl mx-auto">
        <Card className="border-emerald-900/20">
        <CardHeader className="text-center">
            <div className={`mx-auto p-4 ${isRejected ? "bg-red-900/20" : "bg-amber-900/20"} rounded-full mb-4 w-fit`}>
              {isRejected ? (
              <XCircle className="h-8 w-8 text-red-400" /> 
            ) : (
               <ClipboardCheck className="h-8 w-8 text-amber-400" /> )}
            
            </div>
        </CardHeader>
        <CardTitle className="text-2xl font-bold text-white" >
            {isRejected ?("Verification Declined"):("Verification Inprogress")}
        </CardTitle>
        <CardDescription  className ="text-lg">
             {isRejected ?(" UNfortunately, your application needs revission "):("Thank you for submiting your information")}
        </CardDescription>
        <CardContent className="">
            {isRejected ?(
                <div className="bg-red-900/10 border border-red-900/20 rounded-lg p-4 mb-6 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5 shrink-0 "/> 
                <div className="text-muted-foreground text-left">
              <p className="mb-2">Our adminstrative team has reviewed your application and found that
                 it does&apos;t meet our current requirments.common reasons for rejection includes:</p>
                 <ul className="list-disc pl-5 space-y-1 mb-3">
                    <li>Inssuficent or unclear credential document</li>
                    <li>Professional requirments not met  </li>
                    <li>Incomplete or vague service description</li>
                 </ul>
                 <p>you can update your application with one more information and resunmit for review</p>
            </div></div>):(
                <div className="bg-amber-900/10 border border-amber-900/20 rounded-lg p-4 mb-6 flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-400 mr-3 mt-0.5 shrink-0 "/> 
                    <p className="text-muted-foreground text-left">
                        Your profile is currently under review by our adminstrative team, This processes typicaly takes 1-2 business days.
                        you&apos;ll receive an email notification once your account is verified.

                    </p>
                </div>
            )}
                <p className="text-muted-foreground  mb-6">
            {isRejected ?(" you can update your doctor profile and resunmit for Verification "):
            ("While you wait, you can familarize yourself with our platfor or reach out to our support team if you have any question")}
            </p>


            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                asChild
                variant="outline"
                className="bg-emerald-900/30">
                    <Link  href ="/">Return to home</Link>
                </Button>

            </div>
        </CardContent>
        </Card>
    </div>
  </div>

    )
   }

   export default VerificationPage