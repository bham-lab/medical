import { redirect } from "next/navigation";
import { getAvailabletimeSlots, getDoctorsById } from "../../../../../actions/appointment";
import DoctorProfile from "./-components/doctor-profile";

const DoctorProfilePage = async ({ params }) => {
    const { id } = await params;
    
    let doctorData = null;
    let slotData = null;

    try {
        // Only run data fetching inside the try/catch
        const [fetchedDoctor, fetchedSlot] = await Promise.all([
            getDoctorsById(id),
            getAvailabletimeSlots(id)
        ]);
        doctorData = fetchedDoctor;
        slotData = fetchedSlot;
    } catch (e) {
        console.error("Error loading doctor profile:", e);
        redirect("/doctors");
    }

    // Handle missing data conditions outside the try/catch block
    if (!doctorData || !slotData) {
        return <div>Loading doctor profile...</div>; 
    }

    // Return your JSX safely outside the try/catch block
    return (
        <div>
            <DoctorProfile doctor={doctorData} availableDays={slotData.day} />
        </div>
    );
};

export default DoctorProfilePage;
