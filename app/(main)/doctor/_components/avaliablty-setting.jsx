"use client"

import { useForm } from "react-hook-form";
import { setAvailabiltySlot } from "../../../../actions/doctor"
import UseFetch from "../../../hook/use-fetch"
import { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
 
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card"
import { AlertCircle, Clock, Loader2, Plus } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";



const AvailabiltySetting = ({slot}) =>{
    const [showForm,setShowForm] = useState(true);
    

 const { loading, fn:submitSlot,data} = UseFetch(setAvailabiltySlot);

 const {register, handleSubmit,formState:{errors}}=useForm({
    defaultValues:{
        startTime:"",
        endTime:"",
    },
 });
  
const createLocalDataTimeForm = (timeStr) => {
  if (!timeStr) return null;

  const [hour, minute] = timeStr.split(":").map(Number);

  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    minute
  );
  
};


 const onSubmit = async (data) =>{
  if (loading) return;

  const formdata = new FormData();

  const startDate = createLocalDataTimeForm(data.startTime);
  const endDate = createLocalDataTimeForm(data.endTime);

  console.log("start time:", startDate);
   if (startDate >= endDate){
    toast.error("End time must be after start time");
      return;
   }

   formdata.append("startTime", startDate.toISOString());
   formdata.append("endTime", endDate.toISOString());
  await submitSlot(formdata);


 }

 const formatTimeString= (dateString) =>{
  try{
    return format(new Date(dateString), "h:mm a");
  } catch(error){
    return"invalid time";
  }
 }


 useEffect(()=>{
  if(data && data?.success) {
   
    setTimeout(() => {
     setShowForm(false);
    }, 0);
    toast.success("Availability slot updated successfully")
  }

 },[data])

    return (
        <div>
              <Card>
  <CardHeader>
    <CardTitle className="text-xl font-bold text-white flex items-center">
        <Clock className="h-5 w-5 mr-2 text-emerald-400" />
        Availability Settings 
    </CardTitle>
    <CardDescription>set your daily availability for patient appointments</CardDescription>

  </CardHeader>
  <CardContent>
   {!showForm?(
    
    <>

    <div>
      <h3 className="text-lg font-medium text-white mb-3">
           Current Availability
      </h3>
      {slot.length === 0?(
        <p className=" text-muted-foreground">
          you have&apos;t  set any availability slots yet. add your availability
          to start accepting appointment
        </p>
      ):(

        <div>

          {slot.map((slot) =>{
            return(
 <div key={slot.id} className="flex items-start p-3 mb-4 gap-2 rounded-md bg-muted/20 border border-emerald-900/20">
        <div>
          <Clock  className="h-4 w-4 text-emerald-400"/>
        </div>
        
          <p className="text-white font-medium">
{formatTimeString(slot.startTime)} - {formatTimeString(slot.endTime)}
        </p>
         
       </div>
            );
      
          })}
        </div>

      )}
    </div>
   <Button 
    onClick ={()=>setShowForm(true)}
    className="w-full bg-emerald-600 hover:bg-emerald-700"
   >
    <Plus className="h-4 w-4 mr-2 "/>
    Set Availabilty time
   </Button>
   
   </>):(
    <form className="space-y-4 border rounded-md p-4 border-emerald-900/20" onSubmit={handleSubmit(onSubmit)}>
<h4 className="text-lg font-medium text-white mb-2">
     Set Daily Availabilty 
</h4>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className="space-y-2">
        <Label htmlFor="startTime" > Start time</Label>
        <Input
          id="startTime"
          type="time"
          {...register("startTime",{
            required: "start time is required",
          })}
          className="bg-background border-emerald-900/20"
        />
        {errors.startTime && (
            <p className="text-red-500 text-sm font-medium">{errors.startTime.message}</p>
        )}
 </div>
 <div className="space-y-2">
        <Label htmlFor="startTime" > End Time</Label>
        <Input
          id="endTimeTime"
          type="time"
          {...register("endTime",{
            required: "End time is required",
          })}
          className="bg-background border-emerald-900/20"
        />
        {errors.startTime && (
            <p className="text-red-500 text-sm font-medium">{errors.endTime.message}</p>
        )}
   </div>
   </div>
<div className="flex items-center justify-end space-x-3 pt-4">
    <Button 
    type="button"
     variant="outline"
     onClick={()=>setShowForm(false)}
     disabled={loading}
      className="bg-red-500/30"

    >
        Cancel
    </Button>
    <Button 
    type="sbmit"
  
     disabled={loading}
      className="bg-emerald-600 hover:bg-emerald-700"

    > {loading?(
       <> <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        saving..
       " </>
    ):("Save Appointment")}
        
    </Button>
</div>


    </form>
   )}
   
<div className="mt-6 p-4 bg-muted/10 border border-emerald-900/10 rounded-md">
    <h4 className="font-medium text-white mb-2 flex items-center">
        <AlertCircle className="h-4 w-4 mr-2 text-emerald-400" />
 How Availabillity Work 
    </h4>
    <p className="text-muted-foreground text-sm">
  Setting your daily avaliabilities allows patients to boojk appointments during those hours. 
  the same availability applies to all days. you can update your avalabilty at any time, but existing booked will not be affected.
    </p>
</div>
  </CardContent>
 
</Card>
        </div>
    )
}

export default AvailabiltySetting
