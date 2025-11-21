// src/store/useNotesStore.ts
import { create } from 'zustand';
import type { Note } from '../types';

interface NotesState {
  notes: Note[];
  isLoadingNotes: boolean;
  setNotes: (notes: Note[]) => void;
  setIsLoadingNotes: (loading: boolean) => void;
  
  // Ações Otimistas (atualizam a tela na hora)
  addNoteToStore: (note: Note) => void;
  removeNoteFromStore: (id: string) => void;
  updateNoteInStore: (updatedNote: Note) => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  isLoadingNotes: false,

  setNotes: (notes) => set({ notes }),
  setIsLoadingNotes: (loading) => set({ isLoadingNotes: loading }),

  addNoteToStore: (note) => set((state) => ({ notes: [note, ...state.notes] })),
  
  removeNoteFromStore: (id) => set((state) => ({ 
    notes: state.notes.filter((n) => n.id !== id) 
  })),
  
  updateNoteInStore: (updatedNote) => set((state) => ({
    notes: state.notes.map((n) => n.id === updatedNote.id ? updatedNote : n)
  })),
}));