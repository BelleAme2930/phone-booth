import jLogo from '@assets/jameson-logo.png';
import phoneIcon from '@assets/phone-icon.svg';
import phoneGreen from '@assets/phone-vector.svg';
import loading from '@assets/loading.gif';
import client from '@assets/client.png';
import sup3rnovaLogo from '@assets/logo.png';
import hangup from '@assets/hangup.svg';
import celebration from '@assets/celebration.gif';
import wave from '@assets/wave.gif';
import rotateLogo from '@assets/rotate-logo.gif';
import bgPhone from '@assets/initiator-phone.png';
import bgCanvas from "@assets/curved-bg.png";

function Connecting() {
    return (
        <div className="connecting-call">
            <div className="absolute right-0 top-0 h-full w-[40%] z-10">
                <img src={bgCanvas} alt="Canvas" className="w-full h-full" />
                <div className='flex flex-col w-[250px] absolute top-[18%] md:right-[16%] 2xl:right-[24%]'>
                    <div className='timer border border-[10px] border-[#007749] text-[48px] text-[#F1E4B2] rounded-[27px] md:mb-8 2xl:mb-20'>00:00</div>
                    <div>
                        <p className='text-[#F1E4B2] text-left open-sans text-[18px]'>En pocos segundos ampliarás tu círculo de amistades. Aprovecha este tiempo al máximo y recibirás una recompensa.</p>
                    </div>
                </div>
            </div>
            <div className="absolute z-40 right-7 bottom-7 h-10 w-10">
                <button><img src={hangup} alt="Hand up" className="w-full h-full" /></button>
            </div>
            <div className="mx-10 relative z-30 flex flex-col justify-between mx-auto md:pt-10 2xl:pt-14 mb-10 2xl:mb-10">
                <div className="text-center md:mb-6 2xl:mb-16"><img src={jLogo} alt="Jameson Logo" className="h-auto md:w-[180px] lg:w-[220px] 2xl:w-[300px]"></img></div>
            </div>


            <div className='h-full md:mt-[50px] 2xl:mt-[120px]'>
            <div className="relative z-40 row flex flex-col justify-center items-center md:w-[900px] 2xl:mx-auto gap-4 px-5 rounded-full py-3">
                <div> <img src={loading} alt="Logo" className='w-[140px] opacity-60'/></div>
                <div> <p className='text-[#F1E4B2] md:text-[16px] 2xl:text-[18px]'>Iniciando Videollamada</p></div>
            </div>

            <div className="relative z-40 row flex justify-between items-center md:w-[860px] 2xl:w-[1200px] gap-4 px-5 rounded-full py-3 md:mt-[50px] 2xl:mt-[120px]">
                <div className="bg-no-repeat bg-cover bg-center rounded-full"> <img className="text-[#F1E4B2] md:w-[140px] 2xl:w-[240px]" src={client} alt="Celebration" /></div>
                <div> <img src={sup3rnovaLogo} alt="Logo" className='md:w-[140px] 2xl:w-[200px]'/></div>
            </div>
            </div>
        </div>
    );
}

export default Connecting;