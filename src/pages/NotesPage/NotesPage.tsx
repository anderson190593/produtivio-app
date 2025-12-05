// src/pages/NotesPage/NotesPage.tsx

import { useState, useMemo } from 'react'; 
import { useNotes } from '../../hooks/useNotes';
import type { Note } from '../../types';
import './NotesPage.css';

const NotesPage = () => {
  const { notes, isLoadingNotes, addNote, deleteNote, updateNote } = useNotes();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  
  // --- NOVO: Estado da Busca ---
  const [searchQuery, setSearchQuery] = useState('');

  // --- NOVO: Lógica de Filtragem ---
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    
    const query = searchQuery.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(query) || 
      note.content.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

  const handleSaveNote = async () => {
    if (!title.trim() && !content.trim()) return;

    if (editingNoteId) {
      await updateNote(editingNoteId, title, content);
      setEditingNoteId(null);
    } else {
      await addNote(title, content);
    }

    setTitle('');
    setContent('');
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setTitle('');
    setContent('');
    setEditingNoteId(null);
  };

  const handleEditClick = (note: Note) => {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setIsExpanded(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="notes-page-wrapper">
      
      {/* Cabeçalho com Busca Integrada */}
      <header className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h1 className="h2 fw-bold text-white mb-1">Notas Rápidas</h1>
          <p className="text-secondary mb-0">Seu banco de conhecimento pessoal.</p>
        </div>

        {/* --- BARRA DE BUSCA --- */}
        <div className="search-input-wrapper" style={{ maxWidth: '300px', width: '100%' }}>
          <div className="position-relative">
            <i className="bi bi-search position-absolute text-secondary" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)' }}></i>
            <input 
              type="text" 
              className="form-control bg-dark border-secondary text-white ps-5" 
              placeholder="Buscar notas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderRadius: '0.5rem', backgroundColor: 'var(--bg-card)' }}
            />
          </div>
        </div>
      </header>

      {/* Área de Criação (Input Expandível) */}
      <div className="create-note-container">
        <div className={`note-input-card ${editingNoteId ? 'editing-mode' : ''}`}>
          {editingNoteId && (
            <div className="text-accent small mb-2 fw-bold">
              <i className="bi bi-pencil-fill me-2"></i> Editando nota
            </div>
          )}

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
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-sm btn-primary"
                onClick={handleSaveNote}
              >
                {editingNoteId ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid de Notas Filtradas */}
      {isLoadingNotes ? (
         <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
         </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-5 opacity-50">
            <i className={`bi ${searchQuery ? 'bi-search' : 'bi-journal-bookmark'} display-1 text-secondary`}></i>
            <p className="mt-3 text-secondary">
              {searchQuery ? `Nenhuma nota encontrada para "${searchQuery}"` : "Nenhuma nota criada."}
            </p>
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <div 
              key={note.id} 
              className={`note-card ${note.isPinned ? 'pinned' : ''} ${editingNoteId === note.id ? 'being-edited' : ''}`}
              onClick={() => handleEditClick(note)}
              style={{ cursor: 'pointer' }}
            >
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