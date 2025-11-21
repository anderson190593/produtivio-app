// src/pages/ProfilePage/ProfilePage.tsx

import React, { useState, useEffect } from 'react';
import { updateProfile, updatePassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useAuthStore } from '../../store/useAuthStore';
import './ProfilePage.css';

const ProfilePage = () => {
  // 1. Recuperamos o usuário do Store Global (Isso corrige o erro 'user not found')
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  // Estados do Formulário
  const [displayName, setDisplayName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Feedback visual
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  // Carrega o nome atual ao abrir a página
  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user]);

  // Verifica se é conta Google
  const isGoogleUser = user?.providerData.some(
    (provider) => provider.providerId === 'google.com'
  );

  // AÇÃO 1: Atualizar Perfil
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setIsSaving(true);
    setMessage(null);

    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName
      });
      
      // Atualiza o estado global imediatamente
      setUser({ ...auth.currentUser });
      
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil.' });
    } finally {
      setIsSaving(false);
    }
  };

  // AÇÃO 2: Trocar Senha
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não conferem.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      await updatePassword(auth.currentUser, newPassword);
      setMessage({ type: 'success', text: 'Senha alterada! Use a nova senha no próximo login.' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: unknown) {
      console.error(error);
      
      // Correção do erro de tipagem (unknown vs any)
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const firebaseError = error as { code: string };
        
        if (firebaseError.code === 'auth/requires-recent-login') {
          setMessage({ type: 'error', text: 'Por segurança, faça logout e login novamente para trocar a senha.' });
        } else {
          setMessage({ type: 'error', text: 'Erro ao alterar senha.' });
        }
      } else {
        setMessage({ type: 'error', text: 'Ocorreu um erro inesperado.' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-page-wrapper">
      
      {/* Cabeçalho do Perfil */}
      <div className="profile-header">
        <div className="profile-avatar-large">
          {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h2>{user?.displayName || 'Usuário sem nome'}</h2>
          <p>{user?.email}</p>
          
          <div className="provider-badge">
            {isGoogleUser ? <i className="bi bi-google"></i> : <i className="bi bi-envelope"></i>}
            {isGoogleUser ? ' Conta Google' : ' Conta Email/Senha'}
          </div>
        </div>
      </div>

      {/* Mensagens de Feedback */}
      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} mb-4`}>
          {message.text}
        </div>
      )}

      {/* Seção 1: Informações Pessoais */}
      <section className="profile-section">
        <h3><i className="bi bi-person-bounding-box"></i> Informações Pessoais</h3>
        
        <form onSubmit={handleUpdateProfile}>
          <div className="mb-3">
            <label className="form-label">Nome de Exibição</label>
            <input 
              type="text" 
              className="form-control" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Como você quer ser chamado?"
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Email (Não editável)</label>
            <input 
              type="email" 
              className="form-control" 
              value={user?.email || ''} 
              disabled 
            />
          </div>

          <div className="mb-3">
            <label className="form-label">ID do Usuário (UID)</label>
            <input 
              type="text" 
              className="form-control" 
              value={user?.uid || ''} 
              disabled 
              style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </section>

      {/* Seção 2: Segurança (Escondida se for Google) */}
      {!isGoogleUser && (
        <section className="profile-section">
          <h3><i className="bi bi-shield-lock"></i> Segurança</h3>
          
          <form onSubmit={handleChangePassword}>
            <div className="mb-3">
              <label className="form-label">Nova Senha</label>
              <input 
                type="password" 
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Confirmar Nova Senha</label>
              <input 
                type="password" 
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
              />
            </div>

            <button type="submit" className="btn btn-outline-light" disabled={isSaving}>
              Atualizar Senha
            </button>
          </form>
        </section>
      )}
    </div>
  );
};

export default ProfilePage;