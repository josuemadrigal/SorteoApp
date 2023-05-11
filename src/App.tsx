import { useState } from 'react'

import { store } from './store';

//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import { AppRouter } from './router/AppRouter'
import { AppLayout } from './shared/layouts/template'


function App() {
  //const [count, setCount] = useState(0)

  return (
 
    <AppLayout >
      <AppRouter/>
    </AppLayout>
 
  )
}

export default App
