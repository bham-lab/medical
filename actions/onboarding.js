"use server"

import { db } from "../lib/prisma";
import { auth } from "@clerk/nextjs/server"

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";



export async function setUserRole(formData) {
    const  { userId } = await auth();

    if(!userId){
        throw new Error("Unauthorized");
    }
    const user = await db.user.findUnique({where:{
        clerkUserId: userId,
    }});

    if(!user){
        throw new Error("User not found in database");
    }
  const role = formData.get("role");
    if(!role || !["PATIENT","DOCTOR"].includes(role)){
        throw new Error("invalide role selection");
    }

    try{
        if (role === "PATIENT") {
            await db.user.update({
                where:{
                    clerkUserId: userId,
                },
                data:{
                    role: "PATIENT",
                }
            });
            revalidatePath("/")
            return {success: true , redirect: "/doctors"}

        }


        if (role === "DOCTOR") {

            const specialty = formData.get("specialty");
            const experience = formData.get("experience");
            const credentialUrl = formData.get("credentialUrl");
            const description = formData.get("description");

            await db.user.update({
                where:{
                    clerkUserId: userId,
                },
                data:{
                    role: "DOCTOR",
                    specialty,
                    experience,
                    credentialUrl,
                    description,
                    VerificationStatus: "PENDING"
                }
            });
            revalidatePath("/");
            return {success: true , redirect: "/doctor/verification"}

        }

    }catch(error){
        console.error("Falied To set user role",error.message);
        throw new Error(`Failed to update user profile: ${error.message}`);

    }
 
}


export async function getCurrentUser() {
      
 const { userId } = await auth();

    if(!userId){
        throw new Error("Unauthorized");
    }


    try{
       const user = await db.user.findUnique({
  where: {
    clerkUserId: userId,
  },
});
    return user;

    } catch (error) {
           console.error("Failed to get user information" , error.message);
           console.log(error.message);
           return null;
    }
    
}