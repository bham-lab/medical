"use client"


import { useEffect, useState } from "react";
import UseFetch from "../../../hook/use-fetch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Ban, Loader2, Search } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { Check, ExternalLink, FileText, Medal, User, X } from "lucide-react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { updateDoctorsActiveStatus } from "../../../../actions/admin";
import { toast } from "sonner";




 const   VerifiedDoctors =({doctors})=>{

    const [searchTerm, setSearchTerm] = useState("");
    const [targetDoctor, setTargetDoctor] = useState(null);

const filtersDoctor = doctors.filter((doctor) => {
    const query = searchTerm.toLowerCase().trim();
    return(
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query) ||
        doctor.email.toLowerCase().includes(query) 

    );
})


     const {loading ,
        data,
        fn: submitStatusUpdate,
     }= UseFetch(updateDoctorsActiveStatus);

const handleStatusChange = async (doctor) => {
    const confirmed = window.confirm(`Are you sure you want to suspend ${doctor.name}`);

    if(!confirmed || loading) return;

         const formData = new FormData();
         formData.append("doctorId", doctor.id);
         formData.append("suspend",true);
 await submitStatusUpdate(formData);
}


useEffect(()=>{
    if(data?.success && targetDoctor) {
        toast.success(`Suspended ${targetDoctor.name} successfully!`);
      setTimeout(() => {
       setTargetDoctor(null); // or whichever state you are resetting
    }, 0);
      
    }
},[data])

    return(
<div>
      <Card className="bg-muted/20 border-emerald-900/20">
  <CardHeader>
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="">
<CardTitle>Manage Doctors</CardTitle>
    <CardDescription>View and manage all doctors</CardDescription>

        </div>
        <div className="relative w-full md:w-64">
           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
               placeholder ="Search doctors..."
               className="pl-8 bg-background border-emerald-900/20"
               value ={searchTerm}
               onChange ={(e) => setSearchTerm(e.target.value)}
               />
            </div>
    </div>
    
   
  </CardHeader>
  <CardContent>
{filtersDoctor.length === 0 ? (
    <div>
        {searchTerm ?"No doctors match your search criteria.":"No verified doctor available"} 
    </div>
) : (
    <div className="space-y-4">
 {doctors.map(doctor=> (
        <Card key={doctor.id}
        className="bg-background border-emerald-900/20 hover:border-emerald-700/30 transition-all">
            <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-muted/20 rounded-full p-2"><User className="h-5 w-5 text-emerald-400"/></div>
                            <div>
                            <h3 className="text-white font-medium">{doctor.name}</h3>
                            <p className="text-sm text-muted-foreground">{doctor.specialty} . {doctor.experience} years experience </p>
                        </div>
                        </div> 
                        <div className="flex items-center gap-2 self-end md:self-auto">
                            <Badge 
                            variant="outline"

                            className="bg-emerald-900/20 border-emerald-900/30 text-emerald-400">
                            Active
                            </Badge>
                            <Button 
                            variant="outline"
                            onClick ={()=> handleStatusChange(doctor)}
                            className=" border-red-900/30 hover:bg-red-900/20 text-red-400">
                              {loading && targetDoctor?.id === doctor.id ? (
                                <Loader2 className="h-2 w-4 mr-1 animate-spin" />
                              ):(
                                <Ban className="h-2 w-4 mr-1" />
                              )
                              
                              }
                              Suspend
                            </Button >
                        </div>
                    </div>
            </CardContent>
        </Card>
    
    ))} 
    </div>
)}




 
  </CardContent>
 
</Card>
</div>
    )
}

export default VerifiedDoctors
