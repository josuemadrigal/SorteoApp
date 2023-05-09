import { useState } from 'react'
import { Provider } from 'react-redux';
import { store } from './store';

//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import { AppRouter } from './router/AppRouter'
import { AppLayout } from './shared/layouts/template'


function App() {
  //const [count, setCount] = useState(0)

  return (
    <Provider store={ store }>
    <AppLayout >
      <AppRouter/>
    </AppLayout>
    </Provider>
  )
}

export default App
