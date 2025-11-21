// src/pages/NotesPage/NotesPage.tsx

import { useState } from 'react'; // useEffect removido pois AppLayout já carrega
import { useNotes } from '../../hooks/useNotes';
import type { Note } from '../../types'; // Importar o tipo para tipar o estado
import './NotesPage.css';

const NotesPage = () => {
  // Pegamos o updateNote agora
  const { notes, isLoadingNotes, addNote, deleteNote, updateNote } = useNotes();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Novo estado para saber se estamos editando
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const handleSaveNote = async () => {
    if (!title.trim() && !content.trim()) return;

    if (editingNoteId) {
      // MODO EDIÇÃO
      await updateNote(editingNoteId, title, content);
      setEditingNoteId(null); // Sai do modo edição
    } else {
      // MODO CRIAÇÃO
      await addNote(title, content);
    }

    // Limpa o form
    setTitle('');
    setContent('');
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setTitle('');
    setContent('');
    setEditingNoteId(null); // Cancela edição também
  };

  // Função para carregar a nota no formulário ao clicar nela
  const handleEditClick = (note: Note) => {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setIsExpanded(true); // Abre o formulário
    
    // Rola a página suavemente para o topo (onde está o formulário)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="notes-page-wrapper">
      <header className="mb-4">
        <h1 className="h2 fw-bold text-white">Notas Rápidas</h1>
        <p className="text-secondary">Ideias, lembretes e fragmentos de código.</p>
      </header>

      {/* Área de Criação / Edição */}
      <div className="create-note-container">
        <div className={`note-input-card ${editingNoteId ? 'editing-mode' : ''}`}>
          {/* Indicador visual de que está editando */}
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

      {/* Grid de Notas */}
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
            <div 
              key={note.id} 
              // Adicionamos onClick no card para editar
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
                        e.stopPropagation(); // Impede de abrir a edição ao deletar
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