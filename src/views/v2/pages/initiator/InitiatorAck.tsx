import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import jLogo from '@assets/jameson-logo.png';
import phoneIcon from '@assets/phone-icon.svg';
import phoneGreen from '@assets/phone-vector.svg';
import hangup from '@assets/hangup.svg';
import celebration from '@assets/celebration.gif';
import wave from '@assets/wave.gif';
import rotateLogo from '@assets/rotate-logo.gif';
import bgPhone from '@assets/initiator-phone.png';
import bgCanvas from "@assets/curved-bg.png";
import { useMqttState } from "~/@mqtt-react-hooks";
import useSocket from "~/components/useSocket";

import Input from "~/lib/Input";
import Checkbox from "~/lib/Checkbox";

import { AppContext, IVideoInfo } from "~/components/AppContext";
import { MQTT_TOPICS, ROLES, SOCKET_TOPICS } from "~/lib/constants";
import Select from "~/lib/Select";

const InitiatorAcknowledge = () => {
  const navigate = useNavigate();
  const { client } = useMqttState();
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
    console.log("here")
    if (!videoInfo.sessionId) return;

    const payload = {
      ...videoInfo,
    };

    client?.publish(MQTT_TOPICS.CALL_RING, JSON.stringify(payload));
    setTimeout(() => {
      onNext()
    }, 5000)
  };

  const onNext = () => {
    client?.publish(
      MQTT_TOPICS.CALL_CONNECTING,
      JSON.stringify({ ...videoInfo, status: videoInfo.status === "connecting" ? "connected" : "connecting" })
    );
console.log("navigate....")
    navigate(`/start/call`);
  };

    const hangUpCall = () => {
        const confirmed = window.confirm("Are you sure?");
        if(confirmed) {
          navigate('/') 
        }
    }

  return (
    <div className="init-call">
      <div className="absolute h-full w-full left-0 top-0 bg-no-repeat bg-cover bg-top z-20" style={{ backgroundImage: `url(${bgPhone})` }}></div>
      <div className="absolute right-0 top-0 h-full w-[40%] z-10">
        <img src={bgCanvas} alt="Canvas" className="w-full h-full" />
      </div>
      <div className="absolute z-40 right-7 bottom-7 h-10 w-10">
      <button className="border-none hover:border-none focus:border-none focus:outline-none" onClick={hangUpCall}><img src={hangup} alt="Hand up" className="w-full h-full" /></button>
      </div>
      <div className="relative z-30 flex flex-col justify-between mx-auto md:pt-14 2xl:pt-36 mb-10 2xl:mb-10">
        <div className="text-center md:mb-10 2xl:mb-16"><img src={jLogo} alt="Jameson Logo" className="h-auto md:w-[220px] lg:w-[280px] 2xl:w-[360px] mx-auto"></img></div>

        <h2 className="mt-5 md:text-[22px] xl:text-2xl mx-auto leading-10 text-[#F1E4B2] open-sans md:w-[80%] md:w-[500px] xl:w-[50%]">
          ESTAMOS AMPLIANDO TU CÍRCULO, ESPERA UNOS SEGUNDOS MIENTRAS TE CONECTAMOS.
        </h2>
      </div>

      <div className="relative z-40 row flex items-center mx-auto lg:w-[600px] 2xl:w-[800px] gap-4 bg-[#007749] px-5 rounded-full py-3 md:mb-10 2xl:mb-14">
        <div className="w-[20%] bg-no-repeat bg-cover bg-center rounded-full" style={{ backgroundImage: `url(${celebration})` }}> <img className="text-[#F1E4B2]" src={phoneIcon} alt="Celebration" /></div>
        <div className="w-[60%] mt-3">
          <div className="flex items-center">
            <img src={wave} className="w-1/2" alt="Jameson" /> <img src={wave} className="w-1/2" alt="Wave" />
          </div>
          <div>
            <div>
              <p className="md:text-[15px] 2xl:text-[16px] text-[#F1E4B2]">Conectando...</p>
            </div>
          </div>
        </div>
        <div className="w-[20%]"> <img src={rotateLogo} alt="Logo" /></div>
      </div>
      <div className="relative z-40 relative lg:w-[420px] flex items-center mx-auto justify-center">
              <img src={phoneGreen} alt="Phone" className="-mr-[30px]" />
              <p className="text-[#F1E4B2] text-[14px] border-[1px] py-2 px-4 rounded-full border-dashed border-green-700">LEVANTA EL TELÉFONO PARA ESCUCHAR</p>
            </div>
    </div>
  );
};

export default InitiatorAcknowledge;