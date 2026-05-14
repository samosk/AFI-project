import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GuestView from './pages/GuestView.tsx'
import KitchenView from './pages/KitchenView.tsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/order/:tableId" element={<GuestView />} />
        <Route path="/kitchen" element={<KitchenView />} />
        <Route path="*" element={
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Restaurang Ordersystem</h1>
            <p>Scanna en QR-kod för att beställa, eller gå till <a href="/kitchen">/kitchen</a> för köksvyn.</p>
            <p style={{ marginTop: '1rem', opacity: 0.6 }}>Testa gästvyn: <a href="/order/bord-1">/order/bord-1</a></p>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}