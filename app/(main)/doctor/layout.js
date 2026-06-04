import { Stethoscope } from "lucide-react";
import PageHeader from "../../../components/ui/page-header";




export const metadata = {
  title: "Medical - Doctors Dashboard",
  description: "Manage your appointments and availablty",
};

export default async function DoctorDashboardLayout({ children }) {


  return (
   
   <div className="container mx-auto px-4 py-8">
    <PageHeader icon ={<Stethoscope />}  title ={"Doctor dashboard"} />
            {children}
        </div>
  )

}
