import { redirect } from "next/navigation";
import { getAvailabletimeSlots, getDoctorsById } from "../../../../../actions/appointment";
import DoctorProfile from "./-components/doctor-profile";


const DoctorProfilePage = async ({ params }) =>{
             
        const { id } = await params;
        

        try{
            const [doctorData, slotData] = await Promise.all([
                getDoctorsById(id),
                getAvailabletimeSlots(id)
            ]);

      
            return(
             <div>
                
                <DoctorProfile doctor={doctorData} availableDays={slotData.day} />
             </div>
            )

        }catch(e){
            console.error("Error loadind doctor profile:",e);
            redirect("/doctors");
        }

   return(
    <></>
   )
}

export default DoctorProfilePage