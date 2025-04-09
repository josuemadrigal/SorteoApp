import WhatsAppButton from "./components/WhatsAppButton";
import { AppRouter } from "./router/AppRouter";

function App() {
  //const [count, setCount] = useState(0)

  return (
    <>
      {/* <AppLayout > */}
      <WhatsAppButton />
      <AppRouter />
      {/* </AppLayout> */}
    </>
  );
}

export default App;
