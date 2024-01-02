import sup3rnovaLogo from "../../assets/v2/logo.png";
import cursor from "../../assets/v2/cursor-finger.svg";
import markBox from "../../assets/v2/mark-box.png";
import Modal from 'react-modal';
import bgCanvas from "../../assets/v2/curved-bg.png";
import jGinger from "../../assets/v2/jameson-ginger.png";
import settings from "../../assets/v2/settings.png";
import handHoldingPhone from "../../assets/v2/hand-phone.png";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useMqttState, useSubscription } from "../../@mqtt-react-hooks";
import { MQTT_TOPICS, SOCKET_TOPICS } from "../../lib/constants";
import { AppContext, IVideoInfo, defaultVideoInfo } from "../../components/AppContext";
import io, { Socket } from "socket.io-client";
import useSocket from "../../components/useSocket";

const SOCKET_SERVER_URL = "http://localhost:8000";

function Home() {

  const [showTerms, setShowTerms] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isCallDisabled, setIsCallDisabled] = useState(true);


  const handleTermsClick = () => {
    setShowTerms(true);
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

  const handleCheckboxChange = (e: any) => {
    setIsChecked(e.target.checked);
    if (e.target.checked) {
      setIsTermsChecked(true);
    } else {
      setIsTermsChecked(false);
    }
  };


  const navigate = useNavigate();

  const { boothInfo, updateBoothInfo, videoInfo, updateVideoInfo } = useContext(AppContext);
  const [socket, isLoading, error, addListener, emitMessage] = useSocket();

  const { client } = useMqttState();
  const { message: payload } = useSubscription([MQTT_TOPICS.CALL_RING]);

  useEffect(() => {
    if (socket && socket.connected && !boothInfo?.mac) {
      emitMessage("GET_MAC");
    }
    if (socket && socket.connected) {
      emitMessage("HEADSET_STATUS");
    }
  }, [socket, emitMessage]);


  useEffect(() => {
    updateVideoInfo({ ...defaultVideoInfo })
  }, []);

  useEffect(() => {
    if (socket) {
      const _onHeadsetPicked = addListener("__HEADSET_STATUS", onHeadSetPicked);
      const _onMacAdd = addListener(SOCKET_TOPICS.__MAC, onMacAddressRecieved);

      return () => {
        _onHeadsetPicked();
        _onMacAdd();
      };
    }
  }, [socket, addListener]);

  const onMacAddressRecieved = (mac: string) => {
    console.log("mac recieved", mac);

    const _boothInfo = {
      ...boothInfo,
      mac: mac + "-" + Math.floor(Math.random() * 1000),
    };

    updateBoothInfo(_boothInfo);
  };

  const onHeadSetPicked = (data: any) => {
    console.log("headset picked", data);

    if (data?.picked === true) {
      IntializeCall();
    }
  };

  useEffect(() => {
    onPayloadRecieved(payload);
  }, [payload]);

  useEffect(() => {
    console.log("MQTT Connected", client?.connected);
  }, [client?.connected]);

  const onPayloadRecieved = (payload: any) => {
    console.log("payload recieved", payload);

    if (!payload) return;

    const { topic, message } = payload;

    if (topic === MQTT_TOPICS.CALL_RING) {
      onCALL_RING(message);
    }
  };

  const onCALL_RING = (payload: any) => {
    const { sessionId, token, initiator } = payload;

    //if (videoInfo?.status !== "idle") return;
    if (initiator === boothInfo?.mac) return;

    const _videoInfo: IVideoInfo = {
      ...videoInfo,
      incomming_sessionId: sessionId,
      incomming_token: token,
      status: "ringing",
      initiator: initiator,
      receiver: "",
    };

    console.log("video info", _videoInfo);

    updateVideoInfo(_videoInfo);

    if (boothInfo.mac === "") {

      updateBoothInfo({ ...boothInfo, mac: generateRandomMac() })

    }

    navigate("/start/new-call");
  };

  const IntializeCall = () => {


    navigate("/start/initiator-ack");
  };

  return (
    <>
      <div className="container mx-auto min-w-[600px] h-full flex items-center justify-center flex-col">
        <div className="top-settings right-8 top-8 absolute z-20">
          <button className="border-none hover:border-none focus:border-none focus:outline-none"><img src={settings} className="w-8 h-8"></img></button>
          <div className="settings-box p-2">
            <div className="settings__head "></div>
          </div>
        </div>
        <div className="rounded-full flex items-center justify-center mx-auto md:mt-[40px] 2xl:mt-[90px] md:mb-5 2xl:mb-8">
          <img src={sup3rnovaLogo} className="logo-v2 md:h-40 md:w-40 2xl:h-[220px] 2xl:w-[220px] react" alt="logo" />
        </div>
        <div className="text-center w-2/3 mx-auto mb-5"><p className="font-light text-[#F1E4B2] open-sans md:text-[14px] 2xl:text-[17px]">OPRIME EL BOTÓN PARA INICIAR LLAMADA A OTRO TELÉFONO DE JAMESON.</p></div>

        <button onClick={IntializeCall} className="dashboard-btn relative md:text-[46px] 2xl:text-[64px] font-extrabold text-[#F1E4B2] bg-[#007749] rounded-[30px] md:w-[350px] 2xl:w-[420px] mx-auto md:mb-4 2xl:mb-8 border-none hover:border-none" disabled={isCallDisabled}><span>¡LLAMAR!</span><img src={cursor} className="absolute md:right-0 md:-bottom-6 2xl:right-2 2xl:-bottom-4"></img></button>


        <h2 className="mt-5 w-2/3 mx-auto text-left text-[#F1E4B2] flex items-center gap-3 mb-1 open-sans md:text-[14px] 2xl:text-[17px]">
          <input type="checkbox" id="termsCheckbox" checked={isTermsChecked} className="h-12 w-12 bg-transparent border-[5px] border-[#F1E4B2] checked:!bg-transparent checked:!border-[5px] checked:!border-[#F1E4B2] !outline-none focus:!outline-none cursor-pointer" />
          <label htmlFor="termsCheckbox" className="ml-2">
            Confirmo que soy mayor de 18 años de edad, y acepto los términos y condiciones.
          </label>
        </h2>


        {/* <Link to="/start/terms" className="m-5 md:mb-15 mb-15 px-4 py-3 w-3/4 mx-auto bg-red-900 bg-opacity-70 text-[#F1E4B2] rounded-[36px] w-[340px] md:text-[14px] 2xl:text-[17px] border-none hover:border-none hover:text-white">
          LEER TÉRMINOS Y CONDICIONES*
        </Link> */}
        <button onClick={handleTermsClick} className="m-5 md:mb-15 mb-15 px-4 py-3 w-3/4 mx-auto bg-red-900 bg-opacity-70 text-[#F1E4B2] rounded-[36px] w-[340px] md:text-[14px] 2xl:text-[17px] border-none hover:border-none hover:text-white">
          LEER TÉRMINOS Y CONDICIONES*
        </button>


        <div className="z-10 bg-[#133923] py-2 px-3 w-full absolute bottom-0 left-0 "><p className="text-[#F1E4B2] open-sans text-center mx-auto md:text-[13px] 2xl:text-[16px] 2xl:pl-[20px]">Consuma Responsablemente. Jameson Irish Whiskey 40% Alc. Vol. Distribuye B. Fernánadez & Hnos.</p></div>
        <div className="bottle absolute left-0 bottom-0 max-w-full z-10 flex justify-start">
          <img src={jGinger} alt="Canvas" className="" />
        </div>
      </div>
      <div>
        <div className="absolute right-0 top-0 h-full w-[40%]">
          <img src={bgCanvas} alt="Canvas" className="w-full h-full" />
        </div>
        <div className="phone-holding absolute right-0 bottom-0 z-10 flex justify-end">
          <img src={handHoldingPhone} alt="Canvas" className="" />
        </div>
        <div className="absolute md:w-[220px] 2xl:w-[250px] right-0 top-0 h-full flex flex-col justify-center">
          <div className="call-info bg-[#880d27] md:px-4 md:py-8 2xl:px-5 2xl:py-8">
            <p className="uppercase md:text-[14px] 2xl:text-[17px]"><strong>Amplía tu círculo,</strong> <span className="open-sans">conecta con nuevas amistades y </span></p>
            <p className="uppercase md:text-[14px] 2xl:text-[17px]"><strong>gana premios.*</strong></p>
          </div>
        </div>
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
          <div className="h-[600px] overflow-y-auto open-sans">
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
    </>
  );
}

export default Home;


const generateRandomMac = () => {
  const mac = "00:00:00:00:00:00".replace(/0/g, () => {
    return (~~(Math.random() * 16)).toString(16);
  });

  return mac;
}
