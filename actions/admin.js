
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "../lib/prisma";

import { revalidatePath } from "next/cache";



export const verifyAdmin = async () => {

    const { userId } = await auth();

    if (!userId) {
        return false;
    }

   try {
    
    const user = await db.user.findUnique({ where:{clerkUserId: userId}});
    return user?.role === "ADMIN";

    } catch(error) {
            console.error(error);
            return false;
    }
}

export const getPendingDoctors = async () => {
    const isADmin = await verifyAdmin();
    if(!isADmin){
        throw new Error("Unauthorized");
    }

    try{
        const pendingDoctors = await db.user.findMany({
  where: {
    role: "DOCTOR",
    VerificationStatus: "PENDING",
  },
  orderBy: {
    createdAt: "desc",
  },
});
        return {doctors: pendingDoctors};
    } catch(error)    {
        throw new Error("Faild to fetch pending doctors");
    }
}


export const getVerifiedDoctors = async () => {
    const isADmin = await verifyAdmin();
    if(!isADmin){
        throw new Error("Unauthorized");
    }

    try{
        const verifiedDoctors = await db.user.findMany({
            where: {
                role: "DOCTOR",
                VerificationStatus:"VERIFIED",
              
            },
              orderBy:{
                createdAt: "asc",
              },
        });
        return {doctors: verifiedDoctors};
    } catch(error)    {
        throw new Error("Faild to fetch verified doctors");
    }
}






export const updateDoctorsStatus = async (formData) => {
    const isADmin = await verifyAdmin();
    if(!isADmin){
        throw new Error("Unauthorized");
    }

    const doctorId = formData.get("doctorId");
    const status = formData.get("status");

    if(!doctorId || !["VERIFIED","REJECTED"].includes(status)){
        throw new Error("Invalid input");
    }

    try{
    await db.user.update({
            where: {
                id: doctorId,
              
              
            },
              data:{
             VerificationStatus: status,
              }
        })
        revalidatePath("/admin");
        return { success : true}
    } catch(error)    {
        console.error("Faild to update doctors status",error.message);
        throw new Error (`"Faild to update doctors status" : ${error?.message}`);
    }
}




export const updateDoctorsActiveStatus = async (formData) => {
    const isADmin = await verifyAdmin();
    if(!isADmin){
        throw new Error("Unauthorized");
    }

    const doctorId = formData.get("doctorId");
    const suspend  = formData.get("suspend") === "true";

    if(!doctorId ){
        throw new Error("Doctor id is required");
    }

    try{
        const status = suspend? "PENDING" : "VERIFIED";
    await db.user.update({
            where: {
                id: doctorId,
              
              
            },
              data:{
             VerificationStatus: status,
              }
        })
        revalidatePath("/admin");
        return { success : true}
    } catch(error)    {
        console.error("Faild to update doctors status",error.message);
        throw new Error (`"Faild to update doctors status" : ${error?.message}`);
    }
}
