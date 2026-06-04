

import PageHeader from "../../../../components/ui/page-header";
import { redirect } from "next/navigation";
import { getDoctorsBySpecialty } from "../../../../actions/doctors-listing";
import DoctorCard from "../_components/doctor-card";


const Specialty = async ({params}) => {

    const { specialty } = await params;

    if(!specialty){
        redirect("/doctors")
    }

    const { doctors ,error } = await  getDoctorsBySpecialty(specialty) ;


if(error){
 console.error("Error fetching doctors:" , error);
}


    return(
        <div className="space-y-2">
        <PageHeader title={specialty.split("%20").join("")}
        backLink="/doctors"
        backLabel="All Specialties"
        />

        {doctors && doctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2">
                {doctors.map(doctor =>(
            
                    <DoctorCard key ={doctor.id} doctor={doctor}/>
                ))}
                 </div>

        ):(

          <div className=" text-center py-12">
          <h3 className=" text-xl font-medium mb-2 text-white ">
          No doctors available
          </h3>
          <p className="text-muted-foreground">
            There are currently no verified doctors in this specialty. Please check back later or choose other specialty.
          </p>
          </div>
        ) }

        
        </div>
    )

}
 export default Specialty;