import { useState } from 'react'
import { Button } from "@/components/ui/button"
import Header from './components/header'
import Footer from './components/footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='wrapper'>
       <Header/>
      
      <h1>Vite + React</h1>
      <div className="card">
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div>
       <Footer/>
      </div>
       </div>
    </>
  )
}

export default App
