import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './shared/GameProvider';
import Landing from './pages/Landing';
import Seminar1 from './pages/Seminar1';
import Seminar2 from './pages/Seminar2';
import Seminar3 from './pages/Seminar3';
import Seminar4 from './pages/Seminar4';
import Seminar5 from './pages/Seminar5';

export default function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/seminar/1" element={<Seminar1 />} />
          <Route path="/seminar/2" element={<Seminar2 />} />
          <Route path="/seminar/3" element={<Seminar3 />} />
          <Route path="/seminar/4" element={<Seminar4 />} />
          <Route path="/seminar/5" element={<Seminar5 />} />
          {/* <Route path="/seminar/6" element={<Seminar6 />} /> */}
        </Routes>
      </GameProvider>
    </BrowserRouter>
  );
}
