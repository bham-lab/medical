  "use client"
"use no memo" 

  import { useEffect, useReducer, useState } from "react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"
import { Card, CardContent, CardDescription, CardTitle } from "../../../components/ui/card";
import { Loader, Stethoscope, User } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import useFetch from "../../hook/use-fetch";
import { setUserRole } from "/actions/onboarding";
import { useRouter } from "next/navigation";
import { SPECIALTIES } from "../../../lib/specialities";
import { toast } from "sonner";




  const doctorsFormSchema = z.object({
    specailty:z.string().min(1,"specailty is required"),
    experience:z.number().min(1,"experience must be at least 1 year").max(70, "experience mustbe less than 70 years"),
    credentialUrl:z.string().url("Please enter valid url").min(1,"Credential Url is required"),
    description:z.string().min(20,"Description must be at lease 20 characters").max(1000,"Description can not exceed 1000 characters"),

  })
  
  
  const Onboarding =()=>{




    const [step, setStep] = useState("choose-role");
    const router = useRouter();

        const {data , fn:submitUserRole , loading} = useFetch(setUserRole);

    const {register,handleSubmit,formState:{errors}, setValue,watch} = useForm({

        resolver: zodResolver(doctorsFormSchema),
        defaultValues:{
          specailty:"",
          experience:undefined,
          credentialUrl:"",
          description:"",
        }
    });
 const specialityValue = watch("specailty");

    const handlePatientSelection = async () => {
      if (loading) {
        return;
      }
      const formData = new FormData();
      formData.append("role" , "PATIENT");

      await submitUserRole(formData);
    }
 
  useEffect(()=> {
    if(data && data?.success){
      toast.success("Role Selected");
      router.push(data.redirect);
    }

  },[data])


  const onDoctorSubmit = async (data) =>{
    if(loading) return;
    const formData = new FormData();
    formData.append("role","DOCTOR");
    formData.append("specialty", data.specailty);
    formData.append("experience", data.experience);
    formData.append("credentialUrl", data.credentialUrl);
    formData.append("description", data.description);

    await submitUserRole(formData);
  }


      if ( step === "choose-role") {  
          return(
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          onClick={()=>!loading && handlePatientSelection()}
        className="border-emerald-900/30 hover:border-emerald-700/40 cursor-pointer p-2 transition-all">
       
          <CardContent className="pt-6 pb-6 flex items-center justify-center flex-col">
             <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
        <User className="h-8 w-8 text-emerald-400" />
        </div>
            <CardTitle className="text-xl font-semibold text-white mb-2">Join as a Patient</CardTitle>
            <CardDescription className="mb-4">Book appointments, comnsult with doctors, and manage your healthcare journey</CardDescription>
          </CardContent>
         <Button className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
            
            {loading? (<>  <Loader className="mr-2 h-4 w-4 animate-spin"/> Processing... </>) : ("Continue as a Patient")}</Button>
        </Card>


        <Card 
        onClick ={() => !loading && setStep("doctor-form")}
        className="border-emerald-900/30 p-2 hover:border-emerald-700/40 cursor-pointer transition-all">
        
          <CardContent className="pt-6 pb-6 flex items-center justify-center flex-col">
            <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
        <Stethoscope className="h-8 w-8 text-emerald-400" />
        </div>
            <CardTitle className="text-xl font-semibold text-white mb-2">Join as a doctor</CardTitle>
            <CardDescription className="mb-4">Create a profesional profile, set yopur availability, and provide consultatuions</CardDescription>
          </CardContent>
          <Button className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
            
            {loading? (<>  <Loader className="mr-2 h-4 w-4 animate-spin"/> Processing... </>) : ("Continue as a Doctor")}</Button>
        </Card>
      </div>
        )
       }

       if (step === "doctor-form"){
        return(
          
        <Card 
   
        className="border-emerald-900/30 hover:border-emerald-700/40 cursor-pointer transition-all">
        
          <CardContent className="pt-6 ">
            <div className=" mb-6">
   
       
            <CardTitle className="text-2xl font-bold text-white mb-2">Complete Your Doctor Profile</CardTitle>
           
           <CardDescription className="mb-4">Create a profesional profile, set yopur availability, and provide consultatuions</CardDescription>
           </div> 

    <form className="space-y-6" onSubmit={handleSubmit(onDoctorSubmit)} >
      <div className="space-y-2">
        <Label htmlFor ="specailty"> Medical Specialty</Label>
        <Select value={specialityValue} onValueChange={ (value) => setValue("specailty", value)} >
           <SelectTrigger id="Specailty"> 
                 <SelectValue placeholder="select Your speciality" />
             </SelectTrigger>
             <SelectContent>
              { SPECIALTIES.map((spe) => {
                return(
                       <SelectItem key ={spe.name} value= {spe.name} > <div className="flex items-center gap-2">
                       <span className="text-emerald-400"> {spe.icon}</span> {spe.name} </div></SelectItem>
                );
              })}
         
             </SelectContent>
       
        </Select>
        {errors?.speciality && <p className="text-sm text-red-500 mt-1 font-medium">{errors.specailty.message}</p>}
      </div>


       <div className="space-y-2">
        <Label htmlFor ="experience"> Years of experience </Label>
        <Input id ="experience" type="number" placeholder="eg. 5"  {...register("experience",{ valueAsNumber: true })} />
       
        {errors?.experience && <p className="text-sm text-red-500 mt-1 font-medium">{errors.experience.message}</p>}
      </div>

       <div className="space-y-2">
        <Label htmlFor ="credentialUrl"> Link to Credential Document </Label>
        <Input id ="credentialUrl" type="url" placeholder="https://example.com/my-medical-degree.pdf"  {...register("credentialUrl")} />
       
        {errors?.credentialUrl && (<p className="text-sm text-red-500 mt-1 font-medium">{errors.credentialUrl.message}</p>)}
  <p>Please Provide a link to your medical degree or certification </p>
      </div>

       <div className="space-y-2">
        <Label htmlFor ="description"> Description of Your service </Label>
        <Textarea id ="description"  placeholder="Describe your expertise, service, and approach to patient care..." row="4" {...register("description")} />
       
        {errors?.description && (<p className="text-sm text-red-500 mt-1 font-medium">{errors.description.message}</p>)}

      </div>
      <div className="pt-2 flex items-center justify-between">
        <Button 
         type="button"
          variant="outline" 
          onClick={() => setStep("choose-role")}
          className="border-emerald-900/30 "
           disabled={loading}
           >
           Back
         
        </Button>

         <Button type="submit"
          className=" bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
            
            {loading? (<>  <Loader className="mr-2 h-4 w-4 animate-spin"/> Submitting... </>) : ("Submit")}</Button>
      </div>
    </form>


          </CardContent>
     
        </Card>
        )
       }
  

   }
   export default Onboarding
