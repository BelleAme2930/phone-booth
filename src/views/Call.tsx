import { useContext, useEffect, useRef, useState } from "react";
import "@vonage/video-publisher/video-publisher.js";
import "@vonage/video-subscribers/video-subscribers.js";

import { useMqttState, useSubscription } from "~/@mqtt-react-hooks";
import { AppContext, IVideoInfo } from "~/components/AppContext";

import { MQTT_TOPICS, API_KEY } from "~/lib/constants";
import { useNavigate } from "react-router-dom";
import useTimer from "~/components/useTimer";
import jLogo from '@assets/jameson-logo.png';
import loading from '@assets/loading.gif';
import clientImage from '@assets/client.png';
import sup3rnovaLogo from '@assets/logo.png';
import signifier from '@assets/signifier.svg';
import hangup from '@assets/hangup.svg';
import bgCanvas from "@assets/curved-bg.png";
declare global {
    interface Window {
        OT: any;
    }
}

const Call = () => {
    const { boothInfo, videoInfo } = useContext(AppContext);
    const { client } = useMqttState();
    const navigate = useNavigate();

    const sessionRef = useRef<any>(null);

    const { countdown, countdownHHMM, startTimer, resetTimer } = useTimer(60 * 10);


    const { message: payload } = useSubscription([MQTT_TOPICS.CALL_END]);


    useEffect(() => {
        onPayloadRecieved(payload);
    }, [payload]);

    const onPayloadRecieved = (payload: any) => {
        console.log("payload recieved", payload);

        if (!payload) return;

        const { topic, message } = payload;

        if (topic === MQTT_TOPICS.CALL_END) {
            onCALL_END(message);
        }
    };

    const onCALL_END = (message: IVideoInfo) => {
        console.log("onCALL_END", message);

        console.log({ message })
        console.log({ videoInfo })


        if (message.status === "ended" && message.incomming_sessionId === videoInfo.incomming_sessionId && videoInfo.endedBy !== boothInfo?.mac) {
            closeCall(true);
        }


    }


    useEffect(() => {
        if (countdown === 0) {
            closeCall();
        }
    }, [countdown]);


    const closeCall = (forceEnd = false) => {

        console.log("onCloseCall", forceEnd)

        if (!forceEnd) {
            console.log("onCloseCall", videoInfo, boothInfo?.mac)
            client?.publish(MQTT_TOPICS.CALL_END, JSON.stringify({ ...videoInfo, status: "ended", endedBy: boothInfo?.mac }));
        }

        if (sessionRef.current) {
            const session = sessionRef.current;
            console.log("onCloseCall session", session.capabilities)
            session.disconnect();

            // if (session.capabilities.forceDisconnect == 1) {
            //   console.log("onCloseCall session", session.current)
            //   const connectionId = session.connection.connectionId;
            //   session.forceDisconnect(connectionId);

            //   // The client can forceDisconnect. See the next section.
            // }

        }

        setTimeout(() => {
            navigate("/thankyou");
        }, 2000);

    }





    useEffect(() => {
        if (videoInfo.status === "idle") {
            navigate("/");
        }

        if (boothInfo?.role === "publisher") {
            console.log("initializing publisher", videoInfo.sessionId, videoInfo.token);

            const { sessionId, token } = videoInfo;
            initializeSession(sessionId, token);
        }

        if (boothInfo?.role === "subscriber") {
            console.log("initializing subscriber", videoInfo.incomming_sessionId, videoInfo.incomming_token);
            const { incomming_sessionId, incomming_token } = videoInfo;
            initializeSession(incomming_sessionId, incomming_token);
        }
    }, []);

    useEffect(() => {
        console.log("useEffect", videoInfo.status, boothInfo?.role);

        if (videoInfo.status !== "connected") {
            console.log("publising to topic", MQTT_TOPICS.CALL_CONNECTED);
            client?.publish(MQTT_TOPICS.CALL_CONNECTED, JSON.stringify({ ...videoInfo, status: "connected" }));
        }
    }, [videoInfo.status]);

    const handleError = (error: any) => {
        if (error) console.error(error);
    };

    const initializeSession = (sessionId: string, token: string) => {
        //console.log("initializing session", videoInfo.sessionId);
        const OT = window?.OT;

        //const { sessionId, token } = videoInfo;

        console.log("initializing session", sessionId, token);

        const session = OT.initSession(API_KEY, sessionId);
        sessionRef.current = session;

        console.log("session", session);

        // Subscribe to a newly created stream
        session.on("streamCreated", function (event: any) {
            session.subscribe(
                event.stream,
                "subscriber",
                {
                    insertMode: "append",
                    width: "100%",
                    height: "100%",
                },
                handleError
            );
            startTimer();
        });

        // Create a publisher
        const publisher = OT.initPublisher(
            "publisher",
            {
                insertMode: "append",
                width: "100%",
                height: "100%",
            },
            handleError
        );

        // Connect to the session
        session.connect(token, function (error: any) {
            // If the connection is successful, publish to the session
            if (error) {
                handleError(error);
            } else {
                session.publish(publisher, handleError);
            }
        });
    };


    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [message, setMessage] = useState("En pocos segundos ampliarás tu círculo de amistades. Aprovecha este tiempo al máximo y recibirás una recompensa.");

    const hangUpCall = () => {
        navigate('/start/form')
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (seconds === 59) {
                setSeconds(0);
                setMinutes(prevMinutes => prevMinutes + 1);
            } else {
                setSeconds(prevSeconds => prevSeconds + 1);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds]);

    useEffect(() => {
        if (seconds === 5) {
            setMessage("¿Cómo te llamas?");
        } else if (seconds === 10) {
            setMessage("¿En qué barra estás?");
        } else if (seconds === 15) {
            setMessage("¿Cuál es tu spot favorito en P.R.?");
        } else if (seconds === 20) {
            setMessage("¿Jangueas en corillx o en la tuya?");
        } else if (seconds === 25) {
            setMessage("¿Cuál sería tu super poder?");
        } else if (seconds === 30) {
            setMessage("¿Cuál es tu comida favorita?");
        } else if (seconds === 35) {
            setMessage("¿Qué te apasiona?");
        } else if (seconds === 40) {
            setMessage("¿Empanadilla o Pastelillo?");
        } else if (seconds === 45) {
            setMessage("¿Amarillitos o tostones?");
        } else if (seconds === 50) {
            setMessage("¡Cuéntame algo que no sepan tus papás!");
        } else if (minutes > 0 && seconds === 0) {
            setMessage(`¡FELICIDADES! Llegaron a ${minutes}:00`);
        }

    }, [minutes, seconds]);

    if (true) {
        return (
            <div id="publisher" className="conversation-call">
                <div className="absolute right-0 top-0 h-full w-[40%] z-10">
                    <img src={bgCanvas} alt="Canvas" className="w-full h-full" />
                    <div className='flex flex-col w-[250px] absolute top-[18%] md:right-[16%] 2xl:right-[24%]'>
                        <div className='timer border border-[10px] border-[#007749] text-[48px] text-[#F1E4B2] rounded-[27px] md:mb-8 2xl:mb-20'>
                            {`${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
                        </div>

                        <p className='bg-[#154734] py-[30px] px-[20px] rounded-[18px] text-[#F1E4B2] text-left open-sans lg:text-[16px] 2xl:text-[18px] relative'>
                            {
                                seconds < 5 ? (
                                    <div className='message'>{message}</div>
                                ) : (
                                    <h2 className='message'>{message}</h2>
                                )
                            }

                        </p>

                    </div>
                </div>
                <div className="absolute z-40 right-7 bottom-7 h-10 w-10">
                    <button className='border-none hover:border-none focus:border-none focus:outline-none' onClick={hangUpCall}><img src={hangup} alt="Hand up" className="w-full h-full" /></button>
                </div>
                <div className="mx-10 relative z-30 flex flex-col justify-between mx-auto md:pt-10 2xl:pt-14 mb-10 2xl:mb-10">
                    <div className="text-center md:mb-6 2xl:mb-16"><img src={jLogo} alt="Jameson Logo" className="h-auto md:w-[180px] lg:w-[220px] 2xl:w-[300px]"></img></div>
                </div>


                <div className="invisible relative z-40 row flex flex-col justify-center items-center md:w-[900px] 2xl:mx-auto gap-4 px-5 rounded-full py-3 2xl:mb-24">
                    <div> <img src={loading} alt="Logo" className='w-[140px] opacity-60' /></div>
                    <div> <p className='text-[#F1E4B2] md:text-[16px] 2xl:text-[18px]'>Iniciando Videollamada</p></div>
                </div>

                <div className="relative z-40 row flex justify-between items-center md:w-[910px] 2xl:w-[1200px] gap-4 px-5 rounded-full py-3 md:mb-10 2xl:mb-14">
                    <div id="subscriber" className="bg-no-repeat bg-cover bg-center rounded-full"> <img className="text-[#F1E4B2] md:w-[140px] 2xl:w-[240px]" src={clientImage} alt="Celebration" /></div>
                    <div> <img src={sup3rnovaLogo} alt="Logo" className='md:w-[140px] 2xl:w-[200px]' /></div>
                </div>
            </div>
        );
    } else {
        return (
            <>
                <div className="flex flex-col h-full">
                    <>
                        <div id="videos" className="w-full  h-full text-8xl relative mt-4">
                            <div id="subscriber" className="w-full  h-full"></div>
                            <div id="publisher" className=" h-64 w-64 absolute bottom-4 right-4 "></div>
                            <div className="text-3xl p-4 absolute top-6 right-6 rounded-lg bg-gray-800">Timer: {countdownHHMM}</div>
                            <button type="button" onClick={() => closeCall()} className="text-2xl py-6 absolute bottom-6 left-6 bg-red-800 bg-opacity-50 w-20 h-20 rounded-full text-center">
                                End
                            </button>
                            {countdown < 5 && (
                                <div className="text-2xl p-4 absolute bottom-6 left-6 rounded-lg bg-gray-800 bg-opacity-50 w-2/5 text-left ">
                                    Congratulations, your circle of friends is wider. Check your email for your free drink.
                                </div>
                            )}
                        </div>
                    </>
                    {/* )} */}
                </div>
            </>
        );
    }
};

export default Call;
