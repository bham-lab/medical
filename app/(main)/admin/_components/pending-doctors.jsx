"use client"

import { updateDoctorsStatus } from "../../../../actions/admin";
import UseFetch from "../../../hook/use-fetch";
import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Check, ExternalLink, FileText, Medal, User, X } from "lucide-react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { format } from "date-fns";
import { Separator } from "../../../../components/ui/separator";
import { BarLoader } from "react-spinners";



const PendingDoctors =({ doctors })=>{
 const [selectedDoctors , setSElectedDoctors] = useState(null);

 const {loading ,
    data,
    fn: submitStatusUpdate,
 }= UseFetch(updateDoctorsStatus);

  const handelUpdateStatus = async (doctorId,status) => {
   
         if(loading) return;
         const formData = new FormData();
         formData.append("doctorId", doctorId);
         formData.append("status",status);
 await submitStatusUpdate(formData);
 }
const handelCloseModal = () =>{
    setSElectedDoctors(null);
}


  
 useEffect(()=>{
    if (data && data?.success){
       setTimeout(() => {
      handelCloseModal();
    }, 0);
    }

 },[data])

const handViewDetails = (doctor) =>{
    setSElectedDoctors(doctor);
}





    return(
        <div> 
      <Card className="bg-muted/20 border-emerald-900/20">
  <CardHeader>
    <CardTitle>Pending Doctors verification</CardTitle>
    <CardDescription>Review and approve doctor application</CardDescription>
   
  </CardHeader>
  <CardContent>
   {doctors.length === 0? (<div className="text-center py-8 text-muted-foreground">No pending verification requests at this time</div>)
   
   :(<div className="space-y-3.5">
    {doctors.map(doctor=> (
        <Card key={doctor.id}
        className="bg-background border-emerald-900/20 hover:border-emerald-700/30 transition-all">
            <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="bg-muted/20 rounded-full p-2"><User className="h-5 w-5 text-emerald-400"/></div>
                            <div>
                            <h3 className="text-white font-medium">{doctor.name}</h3>
                            <p className="text-sm text-muted-foreground">{doctor.specialty} . {doctor.experience} years experience </p>
                        </div>
                        </div> 
                        <div className="flex items-center gap-2 self-end md:self-auto">
                            <Badge 
                            variant="outline"

                            className="bg-emerald-900/20 border-emerald-900/30 text-amber-400">
                                Pending
                            </Badge>
                            <Button 
                            variant="outline"
                            onClick ={()=> handViewDetails(doctor)}
                            className=" border-emerald-900/30 hover:bg-muted/80">
                                View Details
                            </Button >
                        </div>
                    </div>
            </CardContent>
        </Card>
    ))}
   </div>)}
  </CardContent>
 
</Card>
{selectedDoctors && (
    <Dialog open = {!!selectedDoctors} onOpenChange = {handelCloseModal}>

  <DialogContent className="md:min-w-3xl ">

    <DialogHeader>
      <DialogTitle className="text-xl font-bold text-white">Doctor Verification Details</DialogTitle>
      <DialogDescription>
      Review the doctor&apos;s information carefully before making a decision.
      </DialogDescription>
    </DialogHeader>
    <div>
    <div className="space-y-6 py-4">
        <div className="flex flex-col md:flex-row gap-6">
        <div className="space-y-1 flex-1">
            <h4 className="text-sm font-medium text-muted-foreground " >Full Name</h4>
            <p className="text-base font-medium text-white">{selectedDoctors.name}</p>
        </div>

           <div className="space-y-1 flex-1">
            <h4 className="text-sm font-medium text-muted-foreground " >Email</h4>
            <p className="text-base font-medium text-white">{selectedDoctors.email}</p>
        </div>

               <div className="space-y-1 flex-1">
            <h4 className="text-sm font-medium text-muted-foreground " >Application date</h4>
            <p className="text-base font-medium text-white">{format(new Date(selectedDoctors.createdAt), "ppp")}</p>
        </div>

 </div>
 <Separator className="bg-emerald-900/20 " />
 <div className="space-y-4 ">
    <div className="flex items-center gap-2">
      <Medal className="h-5 w-5 text-emerald-400" />
      <h3 className="text-white font-medium">
        Professional Information
      </h3>
    </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 ">
    <div className="space-y-1">
            <h4 className="text-sm font-medium text-muted-foreground " >Specialty</h4>
            <p className=" text-white">{selectedDoctors.specialty}</p>
        </div>


          <div className="space-y-1 ">
            <h4 className="text-sm font-medium text-muted-foreground " >Years of Experience</h4>
            <p className=" text-white">{selectedDoctors.experience} years</p>
        </div>


          <div className="space-y-1 col-span-2 ">
            <h4 className="text-sm font-medium text-muted-foreground " >Credentials</h4>
          <div className="flex items-center">
            <a href={selectedDoctors.credentialUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 flex items-center">
                View Credentials
                <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>
        </div>
 </div>

    </div>
     <Separator className="bg-emerald-900/20 " />
      <div className="space-y-2">
        <div className="flex items-center gap-2"><FileText className="h-5 w-5 text-emerald-400"/>
            <h3 className="text-white font-medium " > Service Description</h3>
           
        </div>
        <p className="text-muted-foreground whitespace-pre-line">{selectedDoctors.description}</p>
        </div>
     </div>
      </div>

          {loading &&<BarLoader width={"100%"}  color="#36d7b7" />}
          <DialogFooter className="flex md:justify-between" >
            <Button 
            variant="destructive"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
            onClick={()=> handelUpdateStatus(selectedDoctors.id,"REJECTED")}>
                <X className="mr-2 h-4 w-4" />
                Reject
            </Button>
            <Button 
            onClick={()=> handelUpdateStatus(selectedDoctors.id,"VERIFIED")}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700">
                <Check className="mr-2 h-4 w-4" />
                Approve
            </Button>
          </DialogFooter>
  </DialogContent>
</Dialog>
)}
</div>
    )
}

export default PendingDoctors;
