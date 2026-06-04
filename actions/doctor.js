"use server";



import { db } from "../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { success } from "zod";
import { id } from "zod/locales";

export async function setAvailabiltySlot(formData) {
    const { userId } = await auth();

    console.log("form data: ", formData);

    if (!userId) {
        throw new Error("Unauthorized");
    }
    try{

        const doctor = await db.user.findUnique({
            where:{
                clerkUserId : userId,
                role:"DOCTOR"
            },
        });
        if(!doctor){
            throw new Error("doctor not found");
        }

        const startTime = formData.get("startTime");
        const endTime = formData.get("endTime");

          if(!startTime || !endTime){
            throw new Error("start time and end time is required");
        }
            if(startTime >= endTime){
            throw new Error("start time must be before end time ");
        }


              const existingSlots = await db.availabilities.findMany({
            where:{
              doctorId: doctor.id,
            },


        });

        if(existingSlots.length > 0) {
            const slotWithNoAppointments = existingSlots.filter((slot)=>!slot.appointment);
            if(slotWithNoAppointments.length > 0){
                await db.availabilities.deleteMany({
                    where:{
                        id:{
                            in: slotWithNoAppointments.map((slot)=> slot.id)
                        }
                    }
                })
            }
        }

    const newSlot = await db.availabilities.create({
         data:{
            doctorId: doctor.id,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            status: "AVAILABLE"
         }
    });

    revalidatePath("/doctor");
    return {success: true , slot: newSlot}
        
    } catch(error){
        console.error("Failed to set availability slots: " + error.message )
    }
    
}





export async function getDoctorsAvaility() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });

    if (!doctor) {
      throw new Error("doctor not found");
    }

    const availabilitySlots = await db.availabilities.findMany({
      where: {
        doctorId: doctor.id,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return { slots: availabilitySlots };
  } catch (error) {
    console.error("Failed to fetch availability slots:", error.message);
    return { slots: [] }; // ✅ important fallback
  }
}





export async function getDoctorsAppointments(){

   const { userId } = await auth();


    if (!userId) {
        throw new Error("Unauthorized");
    }
    try{

       const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });

    if (!doctor) {
      throw new Error("doctor not found");
    }
     const appointments = await db.appointment.findMany({
      where: {
        doctorId: doctor.id,
        status:{
          in: ["SCHEDULED"]
        }
      },
      include: {
        patient: true
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return { appointments };

    }catch(e){
       console.error("Failed to fetch appointment slots:", e.message);

    }
  
}


export async function cancleAppointment(formData) {
  
  const { userId } = await auth();

    console.log("form data: ", formData);

    if (!userId) {
        throw new Error("Unauthorized");
    }
    try{

       const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      
      },
    });

    if (!doctor) {
      throw new Error("user not found");
    }

const appointmentId = formData.get("appointmentId");

  if (!appointmentId) {
      throw new Error("Appointment Id is required");
    }


    const appointment = await db.appointment.findUnique({
      where: {
        id:appointmentId,
      },
      include:{
        patient: true,
        doctor:true,
      }
    })


     if (!appointment) {
      throw new Error("Appointment not found");
    }
  if(appointment.doctorId !== user.id && appointment.patientId !== user.id ) {
       throw new Error("You are not authorized to cancle this appointment!");
  }

  await db.$transaction(async tx => {
    await tx.appointment.update({
      where:{
        id: appointmentId,
      },
      data:{
        status:"CANCELLED",
      }
    });


    
    await tx.creitTransaction.create({
      data:{
        userId: appointment.patientId,
        amount: 2,
        type: "APPOINTMENT_DEDUCTION",
        descriptin: `Refund for cancelled appointment with Dr. ${appointment.doctor.name}`,
      }
    });


    await tx.creitTransaction.create({
      data:{
        userId: appointment.doctorId,
        amount: -2,
        type: "APPOINTMENT_DEDUCTION",
        descriptin: `Refund for cancelled appointment with Dr. ${appointment.doctor.name}`,
      }
    });

    await tx.user.update({
      where:{
        id:appointment.patientId,
      },
      data:{
        credits:{
          increment: 2,
        }
      }
    });

    await tx.user.update({
      where:{
        id:appointment.doctorId,
      },
      data:{
        credits:{
          decrement: 2,
        }
      }
    });



  
  });



  if(user.role === "DOCTOR") {
    revalidatePath("/doctor");
  }else if (user.role === "PATIENT") {
    revalidatePath("/appointments");
  } 
     

  return { success:true}
  }catch(e){
    throw new Error("Failed to cancle appointment: " + e.message);
   console.error("Failed to cancle appointment: ", e.message);
  }



}




export async function addNoteAppointments(formData){

   const { userId } = await auth();

    console.log("form data: ", formData);

    if (!userId) {
        throw new Error("Unauthorized");
    }
    try{

       const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });

    if (!doctor) {
      throw new Error("doctor not found");
    }
     

    const appointmentId = formData.get("appointmentId");
    const notes = formData.get("notes");
  

      const appointment = await db.appointment.findUnique({
      where: {
        id:appointmentId,
        doctorId:doctor.id,
      },
      
    })
  if (!appointment) {
      throw new Error("Appointment not found");
      return;
    }

    const updatedAppointment = await db.appointment.update({
      whrere:{
     id:appointmentId,
      },
      data:{
       notes,
      }
    })

    return { success:true , appointment: updatedAppointment};
   
    }catch(e){
       console.error("Failed to update notes: ", e.message);

    }
  
}






export async function markAppointmentCompleted(formData) {

   const { userId } = await auth();

   

    if (!userId) {
        throw new Error("Unauthorized");
    }
    try{

       const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      
      },
    });

    if (!doctor) {
      throw new Error("user not found");
    }

const appointmentId = formData.get("appointmentId");

  if (!appointmentId) {
      throw new Error("Appointment Id is required");
    }


    const appointment = await db.appointment.findUnique({
      where: {
        id:appointmentId,
        doctorId: doctor.id,
      },
      include:{
        patient: true,
     
      }
    })


     if (!appointment) {
      throw new Error("Appointment not found");
    }

     if (appointment.status!== "SCHEDULED") {
      throw new Error("Only scheduled appointments can be marked as completed!");
    }

    const now = new Date();
    const appointmentEndTime = new Date(appointment.endTime);
   if (appointmentEndTime > now) {
      throw new Error("Can not mark appointments as completed before the scheduled end time!");
    }

    
    const updatedAppointment = await db.appointment.update({
      whrere:{
     id:appointmentId,
      },
      data:{
       status: "COMPLETED",
      }
    })

  revalidatePath("/doctor")
    return { success:true , appointment: updatedAppointment};

  }catch(e){
 console.error("Failed to mark appointment as completed: ", e.message);

  }

  
  
}