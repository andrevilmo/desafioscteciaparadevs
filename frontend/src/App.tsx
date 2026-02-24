import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EmpreendimentoList } from './pages/EmpreendimentoList';
import { EmpreendimentoForm } from './pages/EmpreendimentoForm';
import { Layout } from './components/Layout';
import { ToastProvider } from './context/ToastContext';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<EmpreendimentoList />} />
            <Route path="/novo" element={<EmpreendimentoForm />} />
            <Route path="/editar/:id" element={<EmpreendimentoForm />} />
          </Routes>
        </Layout>
      </Router>
    </ToastProvider>
  );
}

export default App;
