import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import handHoldingPhone from '@assets/phone-with-wire.png';
import Modal from 'react-modal';
import jLogo from '@assets/jameson-logo.png';
import phoneIcon from '@assets/phone-icon.svg';
import phoneGreen from '@assets/phone-vector.svg';
import hangup from '@assets/hangup.svg';
import celebration from '@assets/celebration.gif';
import wave from '@assets/wave.gif';
import rotateLogo from '@assets/rotate-logo.gif';
import cursor from '@assets/cursor-finger.svg';
import bgCanvas from "@assets/curved-bg.png";
import { useMqttState } from "~/@mqtt-react-hooks";
import useSocket from "~/components/useSocket";

import Input from "~/lib/Input";
import Checkbox from "~/lib/Checkbox";

import { AppContext, IVideoInfo } from "~/components/AppContext";
import { MQTT_TOPICS, ROLES, SOCKET_TOPICS } from "~/lib/constants";
import Select from "~/lib/Select";

const ReceiverAcknowledge = () => {
  const navigate = useNavigate();
  const { client } = useMqttState();
  const [isTermsChecked, setIsTermsChecked] = useState(true);
  const [isCallDisabled, setIsCallDisabled] = useState(true);
  const [showTerms, setShowTerms] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { boothInfo, updateBoothInfo, videoInfo, updateVideoInfo } = useContext(AppContext);

  const [socket, isLoading, error, addListener, emitMessage] = useSocket();

  const ageArray = Array.from({ length: 63 }, (_, i) => i + 18);

  //get role from url

  useEffect(() => {
    //console.log(videoInfo);
    if (socket && socket.connected && !videoInfo.sessionId) {
      //console.log("emitting get token");
      emitMessage("GET_TOKEN");
    }
  }, [socket, emitMessage]);

  useEffect(() => {
    prepareForCall();
  }, []);

  useEffect(() => {
    if (socket) {
      const _onTokenRcvd = addListener(SOCKET_TOPICS.__TOKEN, onTokenReceived);

      return () => {
        _onTokenRcvd();
      };
    }
  }, [socket, addListener]);

  const handleCheckboxItselfClick = () => { 
    setIsTermsChecked(!isTermsChecked)
    setIsCallDisabled(!isCallDisabled);
  }
  const handleTermsClick = () => {
    setShowTerms(true);
  };
  const handleCheckboxChange = (e: any) => {
    setIsChecked(e.target.checked);
    if (e.target.checked) {
      setIsTermsChecked(true);
    } else {
      setIsTermsChecked(false);
    }
  };

  const handleCancelarClick = () => {
    setShowTerms(false);
    setIsTermsChecked(false);
  };

  const handleAceptarClick = () => {
    setShowTerms(false);
    setIsTermsChecked(true);
    setIsCallDisabled(false);
  };
  const onTokenReceived = (sessionToken: { session_id: string; token: string }) => {
    //console.log("token recieved", sessionToken);
    const { session_id: sessionId, token } = sessionToken;

    const videoInfo: IVideoInfo = {
      sessionId,
      token,
      incomming_sessionId: sessionId,
      incomming_token: token,
      status: "ringing",
      initiator: boothInfo?.mac,
      receiver: "",
    };
    //update video info context
    updateVideoInfo(videoInfo);

    //publish video info to mqtt
    const payload = {
      ...videoInfo,
    };



    console.log("updating booth info to publisher");
    updateBoothInfo({ ...boothInfo, role: "publisher" });

    client?.publish(MQTT_TOPICS.CALL_RING, JSON.stringify(payload));
  };

  const prepareForCall = () => {
    if (!videoInfo.sessionId) return;

    const payload = {
      ...videoInfo,
    };

    client?.publish(MQTT_TOPICS.CALL_RING, JSON.stringify(payload));
  };

  const onNext = () => {
    client?.publish(
      MQTT_TOPICS.CALL_CONNECTING,
      JSON.stringify({ ...videoInfo, status: videoInfo.status === "connecting" ? "connected" : "connecting" })
    );

    navigate(`/start/call`);
  };

  return (
    <div className="receiver-call h-full lg:pt-[90px] xl:pt-[100px] 2xl:pt-[100px]">

      <div className="receiver-head relative z-30 flex flex-col justify-between mx-auto">
        <div className="text-center"><img src={jLogo} alt="Jameson Logo" className="h-auto md:w-[220px] lg:w-[280px] 2xl:w-[360px] mx-auto lg:mb-[60px] xl:mb-[20px] 2xl:mb-[60px]"></img></div>
        <h2 className="text-2xl mx-auto leading-10 text-[#F1E4B2] text-[22px] lg:text-[24px] xl:text-[30px] 2xl:text-[38px] open-sans tracking-widest">LLAMADA ENTRANDO</h2>
      </div>

      <div className="flex mx-auto items-center justify-center relative z-40 lg:w-[780px] 2xl:w-[880px] mb-[20px]">
        <span className="absolute open-sans left-0 lg:w-[200px] text-[#F1E4B2] text-right">OPRIME EL BOTÓN PARA INICIAR LLAMADA A OTRO TELÉFONO DE JAMESON.</span>
        <button className="dashboard-btn relative md:text-[46px] 2xl:text-[64px] font-extrabold text-[#F1E4B2] bg-[#007749] rounded-[30px] border-none hover:border-none lg:w-[320px] 2xl:w-[430px]"><span>¡ACEPTAR!</span><img src={cursor} className="absolute md:right-0 md:-bottom-6 2xl:right-2 2xl:-bottom-4"></img></button>
      </div>

      <div className="receiver-mid">
      <button onClick={handleTermsClick} className="relative z-40 m-5 md:mb-15 mb-15 px-4 py-3 w-3/4 mx-auto bg-red-900 bg-opacity-70 text-[#F1E4B2] rounded-[36px] w-[340px] md:text-[14px] 2xl:text-[17px] border-none hover:border-none hover:text-white">
          LEER TÉRMINOS Y CONDICIONES*
        </button>
        </div>

      <div className="receiver-bott ">
        <div className="flex">
          <div className="flex items-center gap-10 absolute z-50">
            <div className="relative z-40 relative lg:w-[420px] flex items-center mx-auto">
              <img src={phoneGreen} alt="Phone" className="-mr-[30px]" />
              <p className="text-[#F1E4B2] border-[1px] py-2 px-4 rounded-full border-dashed border-green-700">LEVANTA EL TELÉFONO PARA ESCUCHAR</p>
            </div>
            <h2 className="mt-5 w-2/3 mx-auto text-left text-[#F1E4B2] flex items-center gap-3 mb-1 open-sans md:text-[14px] 2xl:text-[17px] w-[420px]">
          <input type="checkbox" id="termsCheckbox" onChange={handleCheckboxItselfClick} checked={isTermsChecked} className="h-9 w-9 bg-transparent border-[5px] border-[#F1E4B2] checked:!bg-transparent checked:!border-[5px] checked:!border-[#F1E4B2] !outline-none focus:!outline-none cursor-pointer" />
          <label htmlFor="termsCheckbox" className="ml-2">
            Confirmo que soy mayor de 18 años de edad, y acepto los términos y condiciones.
          </label>
        </h2>
          </div>
        </div>
        
      </div>
      <div className="absolute w-[80%] z-50 row flex items-center mx-auto  gap-4 bg-[#880D27] px-5 rounded-l-full py-3 right-0 lg:top-[42%] 2xl:top-[46%] -translate-y-1/2">
        <div className="w-[10%] "> <img className="text-[#F1E4B2] " src={rotateLogo} alt="Celebration" /></div>
        <div className="w-[50%]">
          <div className="flex items-center">
            <img src={wave} className="w-1/2" alt="Jameson" /> <img src={wave} className="w-1/2" alt="Wave" />
          </div>
          <div>
          </div>
        </div>
        <div className="w-[20%] absolute right-0">
          <div className="call-info md:px-4 2xl:px-5 mt-[6px]">
            <p className="uppercase md:text-[14px] 2xl:text-[17px]"><strong>Amplía tu círculo,</strong> <span className="open-sans">conecta con nuevas amistades y </span></p>
            <p className="uppercase md:text-[14px] 2xl:text-[17px]"><strong>gana premios.*</strong></p>
          </div>
        </div>
      </div>
      <div className="phone-wire-holding absolute right-0 z-50 top-[20%]">
        <img src={handHoldingPhone} alt="Canvas" />
      </div>
      <div className="absolute right-0 top-0 h-full w-[40%] z-10">
        <img src={bgCanvas} alt="Canvas" className="w-full h-full" />
      </div>
      <div className="absolute right-10 bottom-5 z-50 lg:w-[400px] 2xl:w-[460px]">
        <p className="text-[#F1E4B2] lg:text-[13px] xl:text-[15px]">Consuma Responsablemente. Jameson Irish Whiskey 40% Alc. Vol. Distribuye B. Fernánadez & Hnos.</p>
      </div>

      <Modal
        isOpen={showTerms}
        onRequestClose={() => setShowTerms(false)}
        contentLabel="Terms Modal"
        ariaHideApp={false}
        className="modal" // Add your custom modal styles here
        overlayClassName="overlay" // Add your custom overlay styles here
      >
        <button onClick={() => setShowTerms(false)} className="absolute right-5 top-5 text-[#007749] text-[16px] border-none hover:border-none hover:text-[#007749]">
          <i className="fa fa-solid fa-xmark"></i>
        </button>
        <div className="terms text-left md:py-10 2xl:py-20 text-[#6B6B6B] max-w-[95%] mx-auto">
          <h1 className="text-[30px] text-[#007749] mb-7">Términos y Condiciones</h1>
          <h2 className="text-[24px] text-[#132F41] mb-7">Términos</h2>
          <div className="open-sans">
            <p className="mb-6">1. Aceptación de los Términos Al descargar y utilizar esta aplicación, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con ellos, por favor no use la aplicación.</p>

            <p className="mb-6">2. Uso Apropiado Esta aplicación está destinada exclusivamente para usuarios mayores de edad legal para consumir bebidas alcohólicas en su país de residencia. Usted acepta usar la aplicación solo para fines legales y de manera que no infrinja los derechos de, restrinja o inhiba el uso y disfrute de la aplicación por parte de terceros.</p>

            <p className="mb-6">3. Propiedad Intelectual Todo el contenido incluido en la aplicación, como textos, gráficos, logos, imágenes, así como la compilación de estos, es propiedad de Pernod Ricard o sus licenciantes y está protegido por leyes de derechos de autor y marcas registradas.</p>

            <p className="mb-6">4. Limitación de Responsabilidad Pernod Ricard no se hace responsable de ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la incapacidad de usar esta aplicación.</p>

            <p className="mb-6">5. Privacidad Su privacidad es importante para nosotros. Por favor, revise nuestra Política de Privacidad, que también rige su uso de la aplicación, para entender nuestras prácticas.</p>
            <p className="mb-6">6. Cambios en los Términos Pernod Ricard se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Se considerará que usted acepta dichos cambios si continúa utilizando la aplicación después de que se hayan publicado.</p>
            <p className="mb-6">7. Legislación Aplicable Estos términos se regirán e interpretarán de acuerdo con las leyes del país donde Pernod Ricard tiene su sede principal, sin dar efecto a ningún principio de conflictos de leyes.</p>
            <p className="mb-6">8. Contacto Si tiene alguna pregunta sobre estos términos, por favor contacte a [correo electrónico/medio de contacto].</p>
          </div>
          <div className="flex justify-between">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-green-900" onChange={handleCheckboxChange} />
              <span className="text-[16px] text-gray-700">
                Confirmo que he leído y acepto los términos y condiciones y la política de privacidad.
              </span>
            </label>
            <div className="flex justify-between gap-10 items-center">
              <button onClick={handleCancelarClick} className="text-[#007749] text-[16px] border-none hover:border-none hover:text-[#007749]" >Cancelar</button>
              <button disabled={!isTermsChecked} onClick={handleAceptarClick} className="text-white text-[16px] bg-[#007749] p-[10px] w-[164px] rounded-[5px] text-center hover:text-white" >Aceptar</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReceiverAcknowledge;