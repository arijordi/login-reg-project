import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import './App.css'
import LoginLayout from './component/LoginLayout';
import RegisterLayout from './component/RegisterLayout';
import ContentLayout from './component/ContentLayout';
import EditLayout from './component/EditLayout';
import DeleteLayout from './component/DeleteLayout';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login"/>} />
          <Route path="/login" element={<LoginLayout />} />
          <Route path="/register" element={<RegisterLayout />} />
          <Route path="/edit" element={<EditLayout />} />
          <Route path="/content" element={<ContentLayout />} />
          <Route path="/delete" element={<DeleteLayout />} />
       </Routes>
    </BrowserRouter>
  )
}

export default App
