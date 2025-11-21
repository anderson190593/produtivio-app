// src/hooks/useNotes.ts

import { useCallback } from 'react';
import { 
  collection, addDoc, query, where, getDocs, doc, deleteDoc, updateDoc // 1. Trazemos o updateDoc de volta
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuthStore } from '../store/useAuthStore';
import { useNotesStore } from '../store/useNotesStore';
import type { Note } from '../types';

const notesCollectionRef = collection(db, 'notes');

export const useNotes = () => {
  const user = useAuthStore((state) => state.user);
  
  const notes = useNotesStore((state) => state.notes);
  const isLoadingNotes = useNotesStore((state) => state.isLoadingNotes);
  
  // 2. Trazemos o updateNoteInStore de volta
  const { 
    setNotes, setIsLoadingNotes, addNoteToStore, removeNoteFromStore, updateNoteInStore 
  } = useNotesStore();

  // FETCH (Buscar) - Sem alterações
  const fetchNotes = useCallback(async () => {
    if (!user) return;
    setIsLoadingNotes(true);
    try {
      const q = query(notesCollectionRef, where("userId", "==", user.uid));
      const data = await getDocs(q);
      
      const formattedNotes = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Note[];

      formattedNotes.sort((a, b) => {
        if (a.isPinned === b.isPinned) return b.createdAt - a.createdAt;
        return a.isPinned ? -1 : 1;
      });

      setNotes(formattedNotes);
    } catch (error) {
      console.error("Erro ao buscar notas:", error);
    } finally {
      setIsLoadingNotes(false);
    }
  }, [user, setNotes, setIsLoadingNotes]);

  // ADD (Adicionar) - Sem alterações
  const addNote = async (title: string, content: string) => {
    if (!user || (!title.trim() && !content.trim())) return;

    const tempId = Date.now().toString();
    const newNote: Note = {
      id: tempId,
      title,
      content,
      isPinned: false,
      userId: user.uid,
      createdAt: Date.now(),
    };

    addNoteToStore(newNote);

    try {
      const docData = {
        title: newNote.title,
        content: newNote.content,
        isPinned: newNote.isPinned,
        userId: newNote.userId,
        createdAt: newNote.createdAt
      };
      
      await addDoc(notesCollectionRef, docData);
      fetchNotes(); 
    } catch (error) {
      console.error("Erro ao criar nota:", error);
      fetchNotes(); 
    }
  };

  // 3. UPDATE (Editar) - NOVA FUNÇÃO
  const updateNote = async (id: string, newTitle: string, newContent: string) => {
    // Encontra a nota antiga para manter os outros dados (como createdAt e isPinned)
    const oldNote = notes.find((n) => n.id === id);
    if (!oldNote) return;

    const updatedNote = { ...oldNote, title: newTitle, content: newContent };
    
    // UI Otimista
    updateNoteInStore(updatedNote);

    try {
      const noteDoc = doc(db, "notes", id);
      await updateDoc(noteDoc, { title: newTitle, content: newContent });
    } catch (error) {
      console.error("Erro ao atualizar nota:", error);
      fetchNotes(); // Reverte em caso de erro
    }
  };

  // DELETE (Remover) - Sem alterações
  const deleteNote = async (id: string) => {
    removeNoteFromStore(id);
    try {
      await deleteDoc(doc(db, "notes", id));
    } catch (error) {
      console.error("Erro ao deletar nota:", error);
      fetchNotes();
    }
  };

  return { notes, isLoadingNotes, fetchNotes, addNote, deleteNote, updateNote }; // Exportamos updateNote
};