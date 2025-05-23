import { useLocation } from "react-router-dom";
import WhatsAppButton from "./components/WhatsAppButton";
import { AppRouter } from "./router/AppRouter";

function App() {
  const location = useLocation();

  const whatsappRoutes = ["/sortear2025"];

  const showWhatsAppButton = whatsappRoutes.includes(location.pathname);

  return (
    <>
      {/* <AppLayout > */}
      {!showWhatsAppButton && <WhatsAppButton />}
      <AppRouter />
      {/* </AppLayout> */}
    </>
  );
}

export default App;
