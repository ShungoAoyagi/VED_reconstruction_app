import { Routes, Route } from 'react-router-dom'
import { Start } from './pages/Start'
import { Playing } from './pages/Playing'
import { Result } from './pages/Result'
import { Physics } from './pages/Physics'

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path="/playing" element={<Playing />} />
      <Route path="/result" element={<Result />} />
      <Route path="/physics" element={<Physics />} />
    </Routes>
  )
}
