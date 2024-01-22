import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import sup3rnovaLogo from '@assets/logo.png';
import noansr from '@assets/noansr.png';
import phoneGreen from '@assets/phone-vector.svg';
import hangup from '@assets/hangup.svg';
import whiteHangup from '@assets/white-hangup.png';
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

const NoAnswer = () => {
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

    const hangUpCall = () => {
        const confirmed = window.confirm("Are you sure?");
        if(confirmed) {
          navigate('/') 
        }
    }

  return (
    <div className="init-call">
      <div className="absolute right-0 top-0 h-full w-[40%] z-10">
        <img src={bgCanvas} alt="Canvas" className="w-full h-full" />
      </div>
      <div className="relative z-30 flex flex-col justify-between mx-auto md:pt-12 2xl:pt-36 mb-10 2xl:mb-10">
        <div className="text-center md:mb-0 2xl:mb-16"><img src={sup3rnovaLogo} alt="Logo" className='md:w-[140px] 2xl:w-[200px] mx-auto' /></div>

        <h2 className="mt-5 md:text-[24px] xl:lg:text-[36px] mx-auto md:leading-10 xl:leading-[50px] font-bold text-[#F1E4B2] open-sans md:w-[80%] lg:w-[450px] xl:w-[45%]">
        Al parecer no están contestando la otra línea. ¡Por favor, intenta otra vez más tarde!
        </h2>
      </div>
      <div className="flex justify-center relative z-50">
        <button onClick={hangUpCall} className="no-answer-button flex gap-[20px] items-center justify-center px-[20px] w-[400px] py-[10px] bg-[#880D27]">
          <img src={whiteHangup} alt="Hangup" />
          <span className="text-[22px]">E N G A N C H A R</span>
        </button>
      </div>
      <div className="absolute bottom-0 md:left-[100px] xl:left-[150px] 2xl:left-[19%]">
        <img src={noansr} alt="No Answer" className="2xl:h-[500px]"/>
      </div>
    </div>
  );
};

export default NoAnswer;