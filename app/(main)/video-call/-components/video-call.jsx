"use client";


import { Button } from "../../../../components/ui/button";
import { Loader2, PhoneOff, User,Video,VideOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Script, { handleClientScriptLoad } from "next/script";
import { useRef, useState } from "react";
import { toast } from "sonner";
import OT from "@opentok/client";


const VideoCall = ({sessionId, token}) =>{


    const [isLoading, setIsLoading] =  useState(true);
    const [scriptedLoaded, setScriptedLoaded] =  useState(false);
    const [isConected, setIsConected] =  useState(false);
    const [isVideoEnabled, setisVideoEnabled] =  useState(true);
    const [isAudioEnabled, setisAudioEnable] =  useState(true);


  const sessionRef =useRef(null);
  const publisherRef = useRef(null);
  const router = useRouter();

  const appId = process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID;

    const handleScriptLoad =()=>{
        setScriptedLoaded(true);
        if(!window.OT) {
              toast.error("Failed to load vonage video api")
            setIsLoading(false);
            return;
        }

        intializeSesion();
    }

    const  intializeSesion =()=>{

        if(!appId || !sessionId ||!token){
             toast.error("Missing required parameters for the video call");
             router.push('/appointments');
             return;
        }

        try{
            sessionRef.current = window.OT.initSession(appId,sessionId);
              sessionRef.current.on("streamCreated" ,(event) =>{
                     sessionRef.current.subscribe(
                        event.stream,
                        "subscriber",
                        {
                            insertMode: "append",
                            width: "100%",
                            height: "100%",
                        },
                        (error)=>{
                            if (error) {
                                toast.error("Error connecting to other participant's stream");
                            }
                        }
                     ) 
              });
              
              sessionRef.current.on("sessionConnected",()=>{
                setIsConected(true);
                setIsLoading(false);


                publisherRef.current = window.OT.initPublisher("publisher" ,{
                      insertMode: "replace",
                            width: "100%",
                            height: "100%",
                            publishAudio: isAudioEnabled,
                            publishVideo: isVideoEnabled
              },

               (error)=>{
                            if (error) {
                                console.error("Publisher error: " ,error.message)
                                toast.error("Error initializing your camera and microphone");
                            } else{
                                console.log("Publisher initialized succussfully  - you should see your video now")
                            }
                        }
            
            )
              }
            ) 


             sessionRef.current.on("sessionDisconnected",()=>{
                setIsConected(false);
             })

             sessionId.current.on(token,(error)=>{
                if(error){
                    toast.error("Error iconnecting to the video call session");
                }
                if(publisherRef.current){
                    sessionRef.current.publish(publisherRef.current,(error)=>{
                        if(error){
                            console.log("Error publishing stream: ", error.message);
                            toast.error("Error publishing your stream to the session");
                        } else{
                            console.log("Stream published successfully");
                        }
                })}

             })
        }catch(e){
            toast.error("An error occurred while setting up the video call");
       setIsLoading(false);
        }
    }

    const toggleVideo =()=>{
        if(publisherRef.current){
          
            publisherRef.current.publishVideo(newVideoState);
            setisVideoEnabled((prev) => !prev);
        }
    }

    const toggleAudio =()=>{
        if(publisherRef.current){
          
            publisherRef.current.publishAudio(newAudioState);
            setisAudioEnable((prev) => !prev);
        }

    const endCall =() =>{

        if (publisherRef.current){
            publisherRef.current.destroy();
           publisherRef.current = null;
        }

         if (sessionRef.current){
            sessionRef.current.disconnect();
           sessionRef.current = null;
        }

        router.push('/appointments');
    }


useEffect(()=>{
return () => {
   if (publisherRef.current){
            publisherRef.current.destroy();
   }
    if (sessionRef.current){
            sessionRef.current.disconnect();
    }
}

},[]);






    if(!sessionId || !token || !appId){
        return(
            <div className="container mx-auto px-4 py-12 text-center ">
                <h1 className="text-3xl font-bold text-white mb-4 ">
                    Inavalid Video call
                </h1>
                <p className="text-muted-foreground mb-6">
                    Missing required parameters for the video call
                </p>
                <Button
                onClick ={()=> router.push('/appointments')}
                 className=" bg-emerald-600 hover:bg-emerald-700">
                    Back To Appointments
                    
                </Button>
            </div>
        )
    }

    return(

        <>
        <Script
         src="https://unpkg.com/@vonage/client-sdk-video@latest/dist/js/opentok.js"
         onLoad={handleScriptLoad}
         onError={()=>{
            toast.error("Failed to load video call script")
            setIsLoading(false);
         }}
        
        />
        

        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h1 className= " text-3xl font-bold text-white mb-2">
                Video Consulattion
            </h1>
            <p className="text-muted-foreground">
                {isConected?"connected":isLoading? "connecting":"connection failed"}
            </p>
          </div>

          {isLoading && !scriptedLoaded?( <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className=" h-12 w-12 text-emerald-400 mb-4 animate-spin"/> 
            <p className="text-white text-lg">
            Loading video call...
            </p>


           </div>
            ):( <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className=  "border border-emerald-900/20 rounded-lg overflow-hidden">
                    <div className="bg-emerald-900/10 px-3 py-2 text-emerald-400 text-sm font-medium">
                        You
                        </div>
                        <div className="w-full h-[300px] md:h-[400px] bg-muted/30" id="publisher">
                        {(!isConected || !scriptedLoaded) && (
                            <div className="flex  items-center justify-center h-full">
                                <div className="bg-muted/20 rounded-full p-8">
                                <User className="h-12 w-12 text-emerald-400"/>
                                    {isConected? "Loading your video stream...":"Connecting to the session..."}
                                </div>
                            </div>
                        )}

                        </div>

                    </div>


                    <div className=  "border border-emerald-900/20 rounded-lg overflow-hidden">
                    <div className="bg-emerald-900/10 px-3 py-2 text-emerald-400 text-sm font-medium">
                       Other Participant
                        </div>
                        <div className="w-full h-[300px] md:h-[400px] bg-muted/30" id="subscriber">
                        {(!isConected || !scriptedLoaded) && (
                            <div className="flex  items-center justify-center h-full">
                                <div className="bg-muted/20 rounded-full p-8">
                                <User className="h-12 w-12 text-emerald-400"/>
                                    {isConected? "Loading your video stream...":"Connecting to the session..."}
                                </div>
                            </div>
                        )}

                        </div>

                    </div>


                </div>



            </div>)}

            <div>
                <Button 
                variant="outline"
                size="lg"
                onClick={toggleVideo}
                className={`rounded-full p-4 h-14 w-14 ${isVideoEnabled?"border-e-mist-900/30":"bg-red-900/20  border-red-900/30 text-red-400"}`}
                disabled={!publisherRef.current}
                >
{isVideoEnabled?<Video />:<VideoOff/>}
                </Button>

                <Button 
                variant="outline"
                size="lg"
                onClick={toggleAudio}
                className={`rounded-full p-4 h-14 w-14 ${isAudioEnabled?"border-e-mist-900/30":"bg-red-900/20  border-red-900/30 text-red-400"}`}
                disabled={!publisherRef.current}
                >
{isAudioEnabled?<Mic />:<MicOff/>}
                </Button>

              <Button 
              variant="destructive"
              size="lg"
              onClick={endCall}
              className="rounded-full p-4 h-14 w-14 bg-red-600 hover:bg-red-700">
                <PhoneOff />

              </Button>


            </div>


            <div className="text-center">
                <p className="text-muted-foreground text-sm">
                    {isVideoEnabled? " Camera on":"Camera off"}
                    {isAudioEnabled? "Microphone on":"Microphone off"}
                </p>
                <p className =" text-muted-foreground text-sm mt-1">
                    When you are finished the video consultation, click the red button to end the call
                </p>
            </div>

        </div>
        </>
    )
}
}



export default VideoCall;
