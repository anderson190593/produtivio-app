// src/pages/NotesPage/NotesPage.tsx

import { useEffect, useState } from 'react';
import { useNotes } from '../../hooks/useNotes';
import './NotesPage.css';

const NotesPage = () => {
  const { notes, isLoadingNotes, fetchNotes, addNote, deleteNote } = useNotes();
  
  // Estados para o formulário de criação
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleAddNote = async () => {
    if (!title.trim() && !content.trim()) return;
    await addNote(title, content);
    setTitle('');
    setContent('');
    setIsExpanded(false); // Fecha após criar
  };

  return (
    <div className="notes-page-wrapper">
      <header className="mb-4">
        <h1 className="h2 fw-bold text-white">Notas Rápidas</h1>
        <p className="text-secondary">Ideias, lembretes e fragmentos de código.</p>
      </header>

      {/* 1. Área de Criação (Expandível) */}
      <div className="create-note-container">
        <div className="note-input-card">
          {isExpanded && (
            <input
              type="text"
              className="note-input-title"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          )}
          
          <textarea
            className="note-input-content"
            placeholder="Criar uma nota..."
            rows={isExpanded ? 3 : 1}
            value={content}
            onClick={() => setIsExpanded(true)}
            onChange={(e) => setContent(e.target.value)}
          />

          {isExpanded && (
            <div className="note-actions">
              <button 
                className="btn btn-sm text-secondary me-2"
                onClick={() => {
                    setIsExpanded(false);
                    setTitle('');
                    setContent('');
                }}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-sm btn-primary"
                onClick={handleAddNote}
              >
                Salvar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Grid de Notas */}
      {isLoadingNotes ? (
         <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
         </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-5 opacity-50">
            <i className="bi bi-journal-bookmark display-1 text-secondary"></i>
            <p className="mt-3 text-secondary">Nenhuma nota criada.</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <div key={note.id} className={`note-card ${note.isPinned ? 'pinned' : ''}`}>
              {note.isPinned && <i className="bi bi-pin-angle-fill pin-icon"></i>}
              
              {note.title && <h3>{note.title}</h3>}
              <p>{note.content}</p>
              
              <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top border-dark-subtle">
                  <small className="text-secondary" style={{fontSize: '0.7rem'}}>
                    {new Date(note.createdAt).toLocaleDateString()}
                  </small>
                  
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                    }}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesPage;