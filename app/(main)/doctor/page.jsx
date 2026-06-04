

import { Tabs, TabsContent, TabsTrigger,TabsList } from "../../../components/ui/tabs";
import { getDoctorsAppointments, getDoctorsAvaility } from "../../../actions/doctor";
import { getCurrentUser } from "../../../actions/onboarding";
import { redirect } from "next/navigation";
import { Calendar, User } from "lucide-react";
import  AvailabiltySetting  from "./_components/avaliablty-setting";
import AppointmentList from "./_components/appointmen-list";



export default async function DoctorDashboard () {
 const user = await getCurrentUser();

 const [appointmenData, availabiltyData]  = await Promise.all([
  getDoctorsAppointments(),

   getDoctorsAvaility()
 ])

 const slots = Array.isArray(availabiltyData?.slots)
  ? availabiltyData.slots
  : [];
 
 
 if(user?.role !== "DOCTOR") {
    redirect("/onboarding")
 }




  if(user?.VerificationStatus !== "VERIFIED") {
    redirect("/doctor/verification")
 }
 return (
    <div>
              <Tabs defaultValue="appointments" className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <TabsList className="md:col-span-1 bg-muted/30 border h-14 md:h-28 flex sm:flex-row md:flex-col w-full p-2 md:p-1 rounded-md md:space-y-2 sm:space-x-2 md:space-x-0">
                 <TabsTrigger value="appointments" className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full">
                     <Calendar className="h-4 w-4 mr-2 hidden md:inline" />
                     <span>Appointment</span>
                 </TabsTrigger>
                 <TabsTrigger value="availability" className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full">
                      <User className="h-4 w-4 mr-2 hidden md:inline" />
                     <span>Availability</span>
                     </TabsTrigger>
               </TabsList>
               <div className="md:col-span-3">  
             <TabsContent value="appointments" className="border-none p-0">
                <AppointmentList appointments = {appointmenData.appointments || []} />
             </TabsContent >
             <TabsContent value="availability" className="border-none p-0">
                  <AvailabiltySetting slot = {slots} />
             </TabsContent>
             </div>
             </Tabs>

    </div>
 )
}