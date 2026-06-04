



import { db } from "../lib/prisma";

export async function getDoctorsBySpecialty(specialty) {
  try {
    const doctors = await db.user.findMany({
      where: {
        role: "DOCTOR",
        VerificationStatus: "VERIFIED",
        specialty: specialty.split("%20").join(" "),
      },
      orderBy: {
        name: "asc",
      },
    });

  

    return { doctors };
  } catch (error) {
    console.error("Failed to fetch doctors:", error);

    return {
      error: "Failed to fetch doctors",
    };
  }
}