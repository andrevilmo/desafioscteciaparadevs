import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">
            <Link to="/">Desafio SC Tecia para Devs</Link>
          </h1>
          <nav className="header-nav">
            <Link to="/" className="nav-link">
              📋 Lista de Empreendimentos
            </Link>
            <Link to="/novo" className="nav-link button-primary">
              ➕ Novo Empreendimento
            </Link>
          </nav>
        </div>
      </header>
      <main className="main-content">
        <div className="app-container">{children}</div>
      </main>
    </div>
  );
};
