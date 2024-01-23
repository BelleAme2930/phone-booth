import jLogo from '@assets/jameson-logo.png';
import loading from '@assets/loading.gif';
import congTwo from '@assets/cong-two.gif';
import congThree from '@assets/cong-three.gif';
import client from '@assets/client.png';
import sup3rnovaLogo from '@assets/logo.png';
import signifier from '@assets/signifier.svg';
import hand from '@assets/hand.png';
import head from '@assets/head.png';
import mike from '@assets/mike.png';
import hangup from '@assets/hangup.svg';
import bgCanvas from "@assets/curved-bg.png";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Conversation() {

    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(55);
    const [message, setMessage] = useState("En pocos segundos ampliarás tu círculo de amistades. Aprovecha este tiempo al máximo y recibirás una recompensa.");
    const [subMessage, setSubMessage] = useState("Te tiramos la toalla con algunas peguntas para romper el hielo.");

    const navigate = useNavigate();

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

        if (minutes > 0 && seconds == 0 && seconds < 5) {
            setSubMessage('En la próxima pantalla podrás colocar tu información para redimir tu premio.')
        }

    }, [minutes, seconds]);

    return (
        <div className={`conversation-call ${minutes > 0 && seconds < 5 ? "minute-congrats-gif" : ""}`}>
                    {/* <img className="absolute h-full bottom-0 20%-0 z-50" src={congOne} alt="Congrats" /> */}
                    {minutes > 0 && seconds < 5 ? (
                        <>
                        <img className="absolute h-full z-50 bottom-0 right-0" src={congTwo} alt="Congrats" />
                    <img className="absolute h-full z-50 bottom-0 right-0" src={congTwo} alt="Congrats" />
                    <img className="absolute h-full left-0 z-50 w-[60%]" src={congThree} alt="Congrats" /></>
                    ) : ""}
            <div className="absolute right-0 top-0 h-full w-[40%] z-10">
                <img src={bgCanvas} alt="Canvas" className="w-full h-full" />
                <div className='flex flex-col w-[250px] absolute top-[18%] md:right-[16%] 2xl:right-[24%]'>
                    <div className='timer border border-[10px] border-[#007749] text-[48px] text-[#F1E4B2] rounded-[27px] md:mb-8 2xl:mb-20'>
                        {`${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
                    </div>
                    <div className='relative min-w-[250px] bg-[#154734] py-[30px] px-[20px] border-dashed min-h-[260px] border-[1px] border-[#F1E4B2] rounded-[18px] relative flex items-center'>
                        {seconds > 4 ?
                            (<p className='absolute open-sans pb-[5px] border-b border-[#FFF0BF] text-[#FFF0BF] top-[25px] left-[50%] transform translate-x-[-50%] translate-y-[-50%] whitespace-nowrap'>AMPLÍA TU CÍRCULO</p>)
                            : ""
                        }
                        <p className={`text-[#F1E4B2] text-left open-sans lg:text-[16px] 2xl:text-[18px] ${minutes != 0 && seconds < 5 ? "!text-center" : ""}`}>
                            {seconds < 5 ? (
                                <div className={`${minutes > 0 && seconds < 5 ? "minute-congrats text-[26px]" : ""} message font-bold`}>{message}
                                    {minutes > 0 && seconds < 5 ?
                                        <p className='text-[#F1E4B2] lg:text-[16px] 2xl:text-[18px] font-normal'>pero puedes continuar conversando.</p>
                                        : ""
                                    }
                                </div>

                            ) : (
                                <h2 className='message font-bold text-center'>{message}</h2>
                            )
                            }
                            <img
                                src={
                                    seconds < 5
                                        ? mike
                                        : seconds >= 35 && seconds <= 60
                                            ? head
                                            : hand
                                }
                                className='absolute -top-[35px] -left-[60px]'
                            />

                            <img src={signifier} className='absolute bottom-[15px] right-[15px]' />
                        </p>
                    </div>
                    <p className='text-[#F1E4B2] mt-[14px] font-normal open-sans'>{subMessage}</p>
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
                <div className="bg-no-repeat bg-cover bg-center rounded-full"> <img className="text-[#F1E4B2] md:w-[140px] 2xl:w-[240px]" src={client} alt="Celebration" /></div>
                <div> <img src={sup3rnovaLogo} alt="Logo" className='md:w-[140px] 2xl:w-[200px]' /></div>
            </div>
        </div>
    );
}

export default Conversation;