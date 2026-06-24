"use client"

import { useEffect, useState } from "react";
import useFetch from "../app/hook/use-fetch";
import { cancleAppointment, markAppointmentCompleted, addNoteAppointments } from "../actions/doctor";
import { generateVideotoken } from "../actions/appointment";
import { Card, CardContent } from "./ui/card";
import { format } from "date-fns";
import { Calendar, CheckCircle, Clock, Edit, Loader2, Stethoscope, User, Video, X } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader ,DialogDescription, DialogTitle} from "./ui/dialog";

import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";


const AppointmentCard =({appointment, userRole, refecthAppointments})=>{

    const [open,setOpen]= useState(false);
    const [action , setAction] = useState(null);
    const [notes , setNotes] = useState('');
  const router = useRouter();


    const {loading: cancleLoading, fn: submitCancle , data: cancleData} = useFetch(cancleAppointment );
    const {loading: notesLoading, fn: submitNotes , data:notesData} = useFetch(addNoteAppointments );
    const {loading: tokenLoading, fn: submitTokenRequest , data:tokenData} = useFetch(generateVideotoken );
    const {loading: completeLoading, fn: submitmarkCompleted , data:completeData} = useFetch(markAppointmentCompleted );
    
const formatDateTime = (dateString) =>{
    try{
        return format(new Date(dateString) , "MMM d, yyyy 'at' h:mm a");
    }catch(e){
   return "invalid date";
}
}

    
const formatTime = (dateString) =>{
    try{
        return format(new Date(dateString) , " h:mm a");
    }catch(e){
   return "invalid time";
}
}

const canMarkedCompleted = () =>{
    if(userRole !== "DOCTOR" || appointment.status !== "SCHEDULED") {
        return false;
    }

    const now = new Date();
    const appointmentEndTime = new Date(appointment.endTime);
    return now >= appointmentEndTime;
}

const handleMarkComplete = async ()=>{
    if (tokenLoading) return;
   
       if(
        window.confirm("Are you sure you want mark it as completed? This action can not be undone;")
    )
    
   { const formData = new FormData();
        formData.append("appointmentId", appointment.id);
        await submitmarkCompleted(formData);}
    
}





const isAppointmentActive =()=>{
      const now = new Date();
    const appointmentTime = new Date(appointment.startTime);
    const appointmentEndTime = new Date(appointment.endTime);

    return(
        (appointmentTime.getTime() - now.getTime() <= 30 * 60 *1000 && now < appointmentTime) || (now>= appointmentTime && now <= appointmentEndTime)
    )
}

const handleVideoCall = async ()=>{
    if (tokenLoading) return;
    setAction("video");
        const formData = new FormData();
        formData.append("appointmentId", appointment.id);
        await submitTokenRequest(formData);
    
}

useEffect(()=>{
    if(completeData?.success){
        toast.success("Appointment marked as completed");
        setTimeOut(() => {
                    setOpen(false);
                 
        }, 0);
      
    }
},[completeData])


useEffect(()=>{
    if(notesData?.success){
        toast.success("Notes saved successfully!");
        setTimeout(() => {

            
      setAction(null);}, 0)
    }
},[notesData])



useEffect(()=>{
    if(tokenData?.success){
        router.push(`/video-call?sessionId=${tokenData.videoSessionId}&token=${tokenData.token}&appointmentId=${appointment.id}`)
    }
},[tokenData ,appointment.id])

const handleSaveNotes = async ()=>{
    if(notesLoading || userRole !== "DOCTOR") return;

    const formData = new FormData();
        formData.append("appointmentId", appointment.id);
        formData.append("notes",notes)
        await submitNotes(formData);

}





const handleCancelAppointment = async ()=>{
    if (cancleLoading) return;
   
       if(
        window.confirm("Are you sure you want cancel this appointment? This action can not be undone.")
    )
    
   { const formData = new FormData();
        formData.append("appointmentId", appointment.id);
        await submitCancle(formData);}
    
}

useEffect(()=>{
    if(cancleData?.success){
        toast.success("Appointment cancelled successfully!");
        setTimeout(() => {
      setOpen(false); }, 0)
    }
},[cancleData])







const otherParty = userRole === "DOCTOR"? appointment.patient : appointment.doctor;
const otherPartyLabel = userRole === "DOCTOR" ? "Patient" :"Doctor";
const otherPartyIcon = userRole === "DOCTOR" ? <User /> : <Stethoscope />

    return(
        <>
        <Card className="border-emerald-900/20 hover:border-emerald-700/30 transition-all">
            <CardContent className="p-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className=" bg-muted/20 rounded-full p-2 mt-1"> 
                            {otherPartyIcon}
                        </div>
                    <div>
                        <h3 className=" font-medium text-white">
                            {userRole === "DOCTOR" ?
                            otherPartyLabel : `Dr. ${otherPartyLabel}`}
                        </h3>


                        {userRole === "DOCTOR" && (
                            <p className="text-sm text-muted-foreground">
                                {otherParty.email}
                            </p>
                        )}
                        {userRole === "PATIENT" && (
                            <p className="text-sm text-muted-foreground">
                                {otherParty.specialty}
                            </p>
                        )}

                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span className="">
                                {formatDateTime(appointment.startTime)}
                            </span>
                            <div className="flex items-center mt-2 text-sm text-muted-foreground">
                                 <Clock className="h-4 w-4 mr-1"  />
                                 <span>
                                    {formatTime(appointment.startTime)} -{""}
                                     {formatTime(appointment.endTime)}
                                 </span>

                            </div>
                        </div>
                    </div>
                    </div>

                    <div>
                        <Badge
                        variant="outline"
                        className={
                            appointment.status === "COMPLETED"?"bg-emerald-900/20 border-emerald-900/30 text-emerald-400 self-start" 
                            : appointment.status === "CANCELLED"?"bg-red-900/20 border-red-900/30 text-red-400 self-start"
                            :"bg-amber-900/20 border-amber-900/30 text-amber-400 self-start"
                        }
                        >
                            {appointment.status}
                        </Badge>

                        <div  className="flex gap-2 mt-2 flex-wrap">{canMarkedCompleted() &&( 
                            <Button size="sm" 
                            onClick ={handleMarkComplete}
                             disabled = {completeLoading} 
                             className="bg-emerald-600 hover:bg-emerald-700 ">
                                {completeLoading? (
                                    <Loader2 className="h-4 w-4 animate-spin" /> 
                                ) : (
                                    <>
                                    <CheckCircle className=" h-4 w-4 mr-1"/>
                                     Complete
                                    </>
                                )}
                               
                                </Button>)}
                                <Button
                                size="sm"
                                variant="outline"
                                className="border-emerald-900/30
                                "
                                onClick={() => setOpen(true)}
                                >
                                    View Details
                                </Button>
                                
                                
                                </div>
                    </div>

                </div>
            </CardContent>
        </Card>

        <Dialog open={open} onOpenChange={setOpen} className="w-80 overflow-x-hidden">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">
                        Appointment Details
                    </DialogTitle>
                    <DialogDescription>
                        {appointment.status === "SCHEDULED" ? "Manage your upcoming appoitment":
                        "View appointment information"}
                    </DialogDescription>
                </DialogHeader>
            
<div className="space-y-4 py-4 w-full">
            <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                    {otherPartyLabel}
                </h4>
                <div className="flex items-center">
                    <div className="h-5 w-5 text-emerald-400 mr-2">
                        {otherPartyIcon}
                    </div>
                    <div className="">
                        <p className="text-white font-medium">
                            {userRole === "DOCTOR" ?
                            otherPartyLabel : `Dr. ${otherPartyLabel}`}
                        </p>
                        
                        {userRole === "DOCTOR" && (
                            <p className="text-sm text-muted-foreground">
                                {otherParty.email}
                            </p>
                        )}
                        {userRole === "PATIENT" && (
                            <p className="text-sm text-muted-foreground">
                                {otherParty.specialty}
                            </p>
                        )}
                    </div>
                </div>
            </div>



            <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                    Scheduled Time
                </h4>

                <div className="flex flex-col gap-1">
                    <div  className="flex items-center ">
                        <Calendar className="h-5 w-5 text-emerald-400 mr-2"  />
                        <p className="text-white">
                            {formatDateTime(appointment.startTime)}
                        </p>

                    </div>
                    <div className="flex items-center ">
                                 <Clock className="h-5 w-5 text-emerald-400 mr-2"  />
                                 <p className="text-white">
                                    {formatTime(appointment.startTime)} -{""}
                                     {formatTime(appointment.endTime)}
                                 </p>

                            </div>
                </div>
            </div>

      <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
              Status
                </h4>
                    <Badge
                        variant="outline"
                        className={
                            appointment.status === "COMPLETED"?"bg-emerald-900/20 border-emerald-900/30 text-emerald-400 self-start" 
                            : appointment.status === "CANCELLED"?"bg-red-900/20 border-red-900/30 text-red-400 self-start"
                            :"bg-amber-900/20 border-amber-900/30 text-amber-400 self-start"
                        }
                        >
                            {appointment.status}
                        </Badge>
               
            </div>
            </div>

{appointment.patientDescription && (
      <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
              {userRole === "DOCTOR"?"Patient Description":"Your Description"}
                </h4>

                <div className="p-3 rounded-md bg-muted/20 border border-emerald-900/20">
                    <p className="text-white whitespace-pre-line">
                        {appointment.patientDescription}
                    </p>
                </div>
              

                </div>
)}

{appointment.status === "SCHEDULED" && (
    <div className="space-y-2  w-full overflow-hidden">
                <h4 className="text-sm font-medium text-muted-foreground">
            Video Consultation
                </h4>

                <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={
tokenLoading }
                onClick={handleVideoCall}
                >
                    {tokenLoading || action === "video" ? (
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Preparing Video call...
                        
                        </>
                    ): (
                        <>
                         <Video className="h-4 w-4 mr-2" />
                         {isAppointmentActive() ?
                         "Join Video Call " : " Video call will be available 30 minutes before appointments"}
                        </>
                    )}
                </Button>
        
    </div>
)}

<div className="space-y-2">
    <div className="flex items-center justify-between">
         <h4 className="text-sm font-medium text-muted-foreground">
        Doctor Notes
                </h4>

                {userRole ==="DOCTOR" && action!=="notes" && appointment.status !== "CANCELLED" && (
                    <Button 
                    variant="ghost"
                    size = "sm"
                    onClick ={()=>{
                        setAction("notes");
                        setNotes(appointment.notes || "");
                    }}
                    className="h-7 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20"
                    >
                        <Edit className="h-3.5 w-3.5 mr-1"/>
                        {appointment.notes ? "Edit" : "Add"}

                    </Button>
                )}

                   </div> 
                   <div> 

                {userRole === "DOCTOR" && action === "notes" ? (
                    <div className="space-y-3">
                    <Textarea
                    value={notes}
                    onChange={(e) =>setNotes(e.target.value)}
                    placeholder="Enter your clinical notes here..."
                    className="bg-background border-emerald-900/20 min-h-[100px] "
                    />

                      <div className="flex justify-end space-x-2">
                        <Button 
                        type="submit"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setAction(null);
                            setNotes(appointment.notes || "");
                        }}
                        disabled={notesLoading}
                        className="border-emerald-900/30"
                        >
                         Cancel
                        </Button>
                        <Button 
                        type="submit"
                        variant="outline"
                        size="sm"
                        onClick={handleSaveNotes}
                        disabled={notesLoading}
                        className="bg-emerald-600 hover:bg-emerald-700"
                        >{notesLoading?(
                            <>
                            <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                            Saving...
                            </>
                        ) :(
                            "Save Notes"
                        )}
                        </Button>
                    </div>
                    </div>
                ): (
                <div className="p-3 rounded-md bg-muted/20 border border-emerald-900/20 min-h-[80px]">
                    {appointment.notes?(
                        <p className="text-white whitespace-pre-line">
                            {appointment.notes}
                        </p>
                    ):(
                        <p className="text-muted-foreground italic">
                            No notes added yet
                        </p>
                    )}
                    
                     </div>
                    
                    
                    )}
                    </div>
 
</div>

<DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
    {appointment.status === "SCHEDULED" && (

        <Button 
        variant="outline"
        onClick={handleCancelAppointment}
        disabled={cancleLoading}
        className="border-red-900/30 text-red-400 hover:bg-red-900/10 mt-3 sm:mt-0"
        >
            {cancleLoading ?(
                <>    
                   <Loader2 className="h-4 w-4 mr-2 animate-spin"/>  
                   Cancelling... 
                  </>

              
            ) :(
                <>
                <X className="h-4 mr-1 w-4"/>
                Cancel Appointment
                </>
            )}
        </Button>
    )}
</DialogFooter>
            </DialogContent>
        </Dialog>

</>
    )
}

export default AppointmentCard
