import PageHeader from "../../../../../components/ui/page-header";
import { getDoctorsById } from "../../../../../actions/appointment"
import { redirect } from "next/navigation";


export async function generateMetadata({ params }) {
    const { id } = await params
    const { doctor } = await getDoctorsById(id);
    return {
        title: `Dr. ${doctor.name} - Medical`,
        description: `Book an appointment with Dr.${doctor.name} ,${doctor.specialty} specialist with ${doctor.experience} years of experience`
    }
}



export default async function DoctorProfileLayout({children, params}){

 const { id } = await params
    const { doctor } = await getDoctorsById(id);

    if(!doctor){
        redirect("/doctors")
    }

    return(
        <div className="   py-8 ">
     <PageHeader  
     title={`Dr.${doctor.name}`} 
     backLink={`/doctors/${doctor.specialty}`}
     backLabel={`Back to ${doctor.specialty}`}

     />

    {children}
        </div>
    )




}
