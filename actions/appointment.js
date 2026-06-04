"use server";

import { auth } from "@clerk/nextjs/server";
import { Auth } from "@vonage/auth";
import { Vonage } from "@vonage/server-sdk";
import { addDays, addMinutes, endOfDay, format, isBefore } from "date-fns";
import { revalidatePath } from "next/cache";
import { success } from "zod";

import { deductCreditsForAppointment } from "./credits";
import { db } from "../lib/prisma";


  const credentials = new Auth({
    applicationId:process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID,
    privateKey: process.env.VONAGE_PRIVATE_KEY
  });


  const vonage = new Vonage(credentials ,{});



export  const getDoctorsById = async (doctorId) =>{
      
   try{ 
    const  doctors = await db.user.findUnique({
        where:{
            id: doctorId,
            role:"DOCTOR",
            VerificationStatus:"VERIFIED"
        },
    });
    if(!doctors){
        throw new Error("Doctor not found")
    }

    return{doctor: doctors};
}catch(e){
    throw new Error("Faild to fetch doctors by id" + e.message)
}
}

export  const getAvailabletimeSlots = async (doctorId) =>{

   try{ 
   const doctors =  await db.user.findUnique({
        where:{
            id: doctorId,
            role:"DOCTOR",
            VerificationStatus:"VERIFIED"
        },
    });
    if(!doctors){
        throw new Error("Doctor not found")
    }

    const availabilty = await db.availabilities.findFirst({
        where:{
          doctorId: doctors.id,
          status: "AVAILABLE"

        }
    });

     if(!availabilty){
        throw new Error("No availability set by doctor");
    }
 const now = new Date();
 const days = [now, addDays(now,1), addDays(now,2), addDays(now,3)];
const lastDay = endOfDay(days[3]);


const existingAppointments = await db.appointment.findMany({
    where:{
        doctorId:doctors.id,
        status: "SCHEDULED",
        startTime:{
            lte: lastDay
        }
    }
});

const availableSlotsByDay = {};
 for (const day of days){
    const dayString = format(day,"yyyy-MM-dd");
    availableSlotsByDay[dayString] =[];
    const availabilityStart = new Date(availabilty.startTime);
    const availabilityEnd = new Date(availabilty.endTime);

    availabilityStart.setFullYear(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
    );

    availabilityEnd.setFullYear(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
    );

    let current = new Date (availabilityStart);
    let end = new Date (availabilityEnd);

    while(isBefore(addMinutes(current,30),end)|| +addMinutes(current,30)=== +end){
        const next = addMinutes(current,30);
        if(!isBefore(current, now)){
            current = next;
            continue;
        }

        const overlaps = existingAppointments.some((appointment) => {
            const aStart = new Date(appointment.startTime);
            const aEnd = new Date(appointment.endTime);

            return(
                (current >= aStart && current < aEnd) ||
                (next > aStart && next <= aEnd) ||
                (current <= aStart && next >= aEnd)
            );
        });

        if(!overlaps){
            availableSlotsByDay[dayString].push({
                startTime: current.toISOString(),
                endTime: next.toISOString(),
                formatted: `${format(current,"h:mm a")} -${format(next,"h:mm a")} `,
                day:format(current, "EEE, MMMM d"),
            });
        }
        current = next;
    }

 }
    
   const result = Object.entries(availableSlotsByDay).map(([date,slots]) => ({
    date,
    displaydate:
         slots.length > 0 ? slots[0].day: format(new Date(date),"EEE, MMMM d"),

    slots,
   }));

   return { day: result};
}catch(e){
    throw new Error("Faild to fetch availabel time slot " + e.message)
}
}


export async function bookAppointmen(formData) {
    const { userId } = await auth();

    if(!userId)  {
        throw new Error("Unauthorized")
    }

    try{
        const patient = await db.user.findUnique({
            where:{
                clerkUserId: userId,
                role:"PATIENT"
            }
        });

        if(!patient)  {
        throw new Error("Patient not found")
    }

    const doctorId = formData.get("doctorId");
    const startTime = new Date(formData.get("startTime"));
    const endTime = new Date(formData.get("endTime"));
    const patientDescription =formData.get("patientDescription");

    if(!doctorId || !startTime || !endTime){
        throw new Error("doctor, start time , end time are required");
    }





    const  doctor =  await db.user.findFirst({
        where:{
            id: doctorId,
            role:"DOCTOR",
            VerificationStatus:"VERIFIED"
        },
    });


    if(patient.credits < 2){
        throw new Error("insufficient credits to book an appointment");
    }


  const overlappingAppointment = await db.appointment.findFirst({
    where:{
        doctorId: doctorId,
        status: "SCHEDULED",
        OR: [
          { 
            startTime: {
                lte:startTime,
            } ,
            endTime: { 
                gt: startTime,
            }
        },
          { 
            startTime: {
                lt:startTime,
            } ,
            endTime: { 
                gte: startTime,
            }
        },
          { 
            startTime: {
                gte:startTime,
            } ,
            endTime: { 
               lte: startTime,
            }
        },

        ]
    }
  });

  if(overlappingAppointment){
    throw new Error(" This time slot is already booked");
  }
 

  const sessionId = await createVideoSession();

        
    const { success, error}= await deductCreditsForAppointment(
        patient.id,
        doctor.id
    );


    if(!success){
        throw new Error(error || "Failed to Deduct Credits")
    }

    const appointment = await db.appointment.create({
        data:{
            patientId: patient.id,
            doctorId: doctor.id,
            startTime,
            endTime,
            patientDescription,
            status:"SCHEDULED",
            videoSessionId: sessionId
        },
    });


  
 
  revalidatePath("/appointments");
  return {success:true, appointment: appointment}
    }catch(error){
       throw new Error("Failed to book appointment:" + error.message)
    }
}

async function createVideoSession() {
    try{
  const session = await vonage.video.createSession({mediaMode: "routed"});

    return session.sessionId;

    }catch(error){
        throw new Error("Failed to create video session:" + error.message);
    }
  
};


export async function generateVideotoken(formData) {

      const { userId } = await auth();

    if(!userId)  {
        throw new Error("Unauthorized")
    }
 try{
        const user = await db.user.findUnique({
            where:{
                clerkUserId: userId,
               
            }
        });

        if(!user)  {
        throw new Error("User not found")
    }

const appointmentId = formData.get("appointmentId");

  if (!appointmentId) {
      throw new Error("Appointment Id is required");
    }


     const appointment = await db.appointment.findUnique({
          where: {
            id:appointmentId,
       
          },
        
        });

            if(!appointment)  {
        throw new Error("Appointment not found")
    }

     if(appointment.doctorId !== user.id && appointment.patientId !== user.id ) {
           throw new Error("You are not authorized to join the call!");
      }

    
         if (appointment.status!== "SCHEDULED") {
          throw new Error("This appointmen is not currently scheduled!");
        }


         const now = new Date();
            const appointmentTime = new Date(appointment.startTime);

            const timeDifference = (appointmentTime - now) / (100 * 60);

            if(timeDifference > 30){
                throw new Error("The call will be available  30 minutes before the schedule time")
            }

              const appointmentEndTime = new Date(appointment.endTime);
              const expirationTime = Math.floor(appointmentEndTime.getTime() / 1000) + 60 * 60;

              const connectionData = JSON.stringify({
                name: user.name,
                role:user.role,
                userId: user.id,
              })

             const token =  vonage.video.generateClientToken(appointment.videoSessionId,{
                role: "publisher",
                expireTime: expirationTime,
                data: connectionData
              })

              await db.appointment.update({
                where:{
                    id:appointmentId,
                },
                data:{
                    videoSessionToken: token,
                }
              })

return {  success: true, videoSessionId: appointment.videoSessionId , token: token}

}catch(e){
 console.error("Failed to generate video token: ", e.message);

}

}
