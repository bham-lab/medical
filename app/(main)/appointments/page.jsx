import { getCurrentUser } from "@/actions/onboarding"
import { getPatientAppointments } from "@/actions/patient";
import AppointmentCard from "@/components/appointment-card";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import { Calendar } from "lucide-react";
import { redirect } from "next/navigation";


const PatientAppointmentsPage = async()=>{
    const user = await getCurrentUser();

    if(!user || user.role!=="PATIENT") {
        redirect("/onboarding");
    }

    const { appointments , error} = await getPatientAppointments();

    return(
        <div className="container mx-auto px-4">
            <PageHeader 
            icon={<Calendar/>}
            title="My Appointments"
            backLink="/doctors"
            backLabel="Find Doctors"
            />
            <Card className="border-emerald-900/20">
                <CardContent className="pt-4">
                    {error? (<div  className="text-center py-8">
                        <p className="text-red-400">Error: {error}</p>
                    </div>): appointments?.length > 0?(
                    <div className="space-y-4">
                        {appointments.map((app)=>(
                            <AppointmentCard
                                key={app.id}
                                appointment={app}
                                userRole="PATIENT"
                            />
                        ))}
                    </div>
                    ):(<div className="text-center py-8">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3"/>
                        <h3 className="text-xl font-medium text-white mb-2">
                            No appointments Scheduled!
                        </h3>
                       <p className="text-muted-foreground">
                        You don&apos;t have any appointments Scheduled yet. Browse our doctors and book your first Consultation
                         
                       </p>
                    </div>
                    )
                    
                    
                    
                   }
                </CardContent>
            </Card>
        </div>
    )

}

export default PatientAppointmentsPage
