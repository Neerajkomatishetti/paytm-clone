import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Signup from './pages/Signup.jsx';
import Signin from './pages/Signin.jsx';
import SendMoney from './pages/SendMoney.jsx';
import Dashboard from './pages/Dashboard.jsx';
import History from './pages/History.jsx';

function App() {

  return (
    <>
       <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendMoney />} />
          <Route path="/history" element={<History/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App