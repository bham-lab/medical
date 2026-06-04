import { Inter } from "next/font/google";
import "./globals.css";

import Header from "../components/ui/header";
import { ClerkProvider } from '@clerk/nextjs'
import  { dark  } from '@clerk/themes';
import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "../components/ui/sonner";



const inter =Inter({subsets: ["latin"]})



export const metadata = {
  title: "Medical - Doctors Appointment App",
  description: "connect with doctors anytime, anywhere",
};

export default async function RootLayout({ children }) {


  return (
    <ClerkProvider appearance={{
      baseTheme: dark,
    }}> 
    <html
      lang="en"
   
      suppressHydrationWarning
    >
      <body    className={`${inter.className} `}>
      
     <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header/>
        <main className="min-h-screen">

            {children}
        </main>
        <Toaster  richColors />
      <footer className="bg-muted/50 py-12  ">
   <div className="container px-4 mx-auto text-gray-200">
  <p> Made With Sulus Code</p>
   </div>
      </footer>
        </ThemeProvider>
        </body>
       
    </html>
      </ClerkProvider>
  );
}
