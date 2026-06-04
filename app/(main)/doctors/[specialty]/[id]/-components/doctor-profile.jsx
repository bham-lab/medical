"use client"

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../../components/ui/card";
import { Calendar, ChevronDown, ChevronUp, Clock, FileText, Medal, User ,AlertCircle } from "lucide-react";
import { Badge } from "../../../../../../components/ui/badge";
import { Button } from "../../../../../../components/ui/button";
import { Alert ,AlertDescription} from "../../../../../../components/ui/alert";
import { Separator } from "../../../../../../components/ui/separator";
import  SlotPicker  from "../../../../doctor/_components/slot-picker";
import  AppointmentForm  from "../../../../doctor/_components/appointment-form";

import { useState } from "react";
import { useRouter } from "next/navigation";



const DoctorProfile = ({doctor, availableDays})=>{


    
    const [showBooking, setShowBooking] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
   const router = useRouter();

    const handleSlotSelect =(slot) =>{
        setSelectedSlot(slot)
    }

    const toggleBooking = () =>{ 
        setShowBooking(!showBooking);

        if(!showBooking){
            setTimeout(()=> {
                document.getElementById("booking-section")?.scrollIntoView(
                    {
                        behavior: "smooth",
                    }
                )
            }, 100)
        }
}


const handleBookingComplete = () =>{
    router.push("/appointments")
}

    const totalSlots = availableDays.reduce((total,days)=>total + days.slots.length,0)
 
    return (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:grid-cols-1">
                  <div className="md:sticky md:top-24"> 
                     <Card className="border-emerald-900/20">
                    <CardContent className="pt-6" >
                       <div className="flex flex-col items-center text-center">
                          <div className="relative w-32 rounded-full overflow-hidden mb-4 bg-emerald-900/20">
                          { doctor.imageUrl?(
                            <Image 
                           src={doctor.imageUrl}
                           alt={doctor.name}
                           fill
                           className="object-cover" />
                        ):(  
                            <div className="h-full w-full flex items-center justify-center">
       <User className="h-16 w-16 text-emerald-400" />

                            </div>

                        )}
                        </div>
                           <h2 className="text-xl font-bold text-white mb-1 ">
                            {doctor.name}
                           </h2>
                           <Badge variant="outline"
                           className='bg-emerald-900/20 border-emerald-900/30 text-emerald-400 mb-4'>
                            {doctor.doctor.specialty}
                           </Badge>
                           <div className=" flex items-center justify-center mb-2">
                            <Medal className="h-4 w-4 text-emerald-400 mr-2" />
                            <span className="text-muted-foreground">
                                {doctor.doctor.experience} years of experience
                            </span>
                           </div>

                           <Button className="w-full bg-emerald-600 hover:bg-emerald-600 mt-4"
                           onClick={toggleBooking}
                           >
                            {showBooking ? (
                                     <>
                                     Hide Booking
                                     <ChevronUp className="ml-2 h-4 w-4"/>
                                     </>

                            ):(
                                    <>
                                     Book Appointment
                                      <ChevronDown className="ml-2 h-4 w-4"/>
                                    </>

                            )}
                            
                           </Button>

                       </div>

                    </CardContent>
                   </Card>
                  </div>
                    
                </div>
        
        
        
                           
                           
                           
                <div className="col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-white">
                              About Dr. {doctor.doctor.name}
                            </CardTitle>
                        <CardDescription>
                           {doctor.doctor.specialty}
                        </CardDescription>
                        </CardHeader>

                        <CardContent>

                            <div className="space-y-4"> 
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-emerald-400" />
                                    <h3 className="text-white font-medium">Description</h3>
                                </div>
                                <p className="text-muted-foreground whitespace-pre-line">
                                    {doctor.doctor.description}
                                </p>
                            </div>
                            <Separator className="bg-emerald-900/20"  />
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-emerald-400" />
                                    <h3 className="text-white font-medium">Availability</h3>
                                </div>
                            </div>
                            
                              {totalSlots > 0 ? (
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-emerald-400 mr-2" />
                                  
                               
                                <p className="text-muted-foreground ">
                                    {totalSlots} time slots available for booking over th enext 4 days
                                </p>
                                 </div>
                              ):(
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        No available slots for the next 4 days.please check back later.
                                    </AlertDescription>
                                </Alert>
                              )
                            
                            }
                        </CardContent>
                    </Card>

                    {showBooking && (
                        <div id="book-section">
                                <Card className="border-emerald-900/20"> 
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-white">
                             Book an appointment
                            </CardTitle>
                        <CardDescription>
                           Select a time slot and provide details for your consultation.
                        </CardDescription>
                        </CardHeader>

                        <CardContent>
                          {totalSlots > 0 ? (
                            <>
                             {!selectedSlot && (
                                <SlotPicker 
                                days={availableDays}
                                onSelectedSlot = {handleSlotSelect}
                                />
                             )}



                             {selectedSlot && (
                                
                                <AppointmentForm 
                                doctorId = {doctor.doctor.id}
                                slot = {selectedSlot}
                                onBack={()=> setSelectedSlot(null)}
                                onComplete={()=> {handleBookingComplete}}
                                />
                             )}



                            </>
                          ):(
                             <div className=" text-center py-6">
                                    <Calendar className="h-12 w-12 text-muted-foreground mb-3" />
                                  
                               
                                <h3 className="text-xl font-medium text-white mb-2 ">
                                   No available slots
                                </h3>
                                <p>
                                    This doctor dose&apos;t have any available appointment slots for the next 4 days.
                                     Please check back anthor doctors later.
                                </p>
                                 </div>
                          )}

                        </CardContent>
</Card>
                        </div>

                    )}
                </div>
            </div>
    )

}

export default DoctorProfile;