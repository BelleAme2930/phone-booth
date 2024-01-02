import { createBrowserRouter } from "react-router-dom";
import Home from "./views/v2/Home";
import InitiatorAcknowledge from "./views/v2/pages/initiator/InitiatorAck";
import ReceiverAcknowledge from "./views/v2/pages/receiver/ReceiverAck";
import InitiatorConnecting from "./views/v2/pages/connector/Connecting";
import Form from "./views/v2/pages/form/Form";
import Terms from "./views/v2/pages/terms/Terms";
import InitiatorConversation from "./views/v2/pages/conversation/Conversation";
import Call from "./views/Call";
import NewCall from "./views/receiver/NewCall";
import Start from "./views/start";
import Thankyou from "./views/Thankyou";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "start",
    element: <Start />,
    children: [
      {
        path: "initiator-ack",
        element: <InitiatorAcknowledge />,
      },
      {
        path: "initiator-conn",
        element: <InitiatorConnecting />,
      },
      {
        path: "initiator-view",
        element: <InitiatorConversation />,
      },
      {
        path: "terms",
        element: <Terms />,
      },
      {
        path: "form",
        element: <Form />,
      },
      {
        path: "receiver-ack",
        element: <ReceiverAcknowledge />,
      },
      {
        path: "new-call",
        element: <NewCall />,
      },
      {
        path: "call",
        element: <Call />,
      },
    ],
  },

  {
    path: "/initiator-ack",
    element: <InitiatorAcknowledge />,
  },
  {
    path: "/receiver-ack",
    element: <ReceiverAcknowledge />,
  },
  {
    path: "/new-call",
    element: <NewCall />,
  },
  {
    path: "/call",
    element: <Call />,
  },
  {
    path: "thankyou",
    element: <Thankyou />,
  },
]);

export default router;
