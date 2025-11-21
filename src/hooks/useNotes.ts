// src/hooks/useNotes.ts

import { useCallback } from 'react';
import { 
  collection, addDoc, query, where, getDocs, doc, deleteDoc 
} from 'firebase/firestore'; // 1. Removi updateDoc
import { db } from '../firebase/config';
import { useAuthStore } from '../store/useAuthStore';
import { useNotesStore } from '../store/useNotesStore';
import type { Note } from '../types';

const notesCollectionRef = collection(db, 'notes');

export const useNotes = () => {
  const user = useAuthStore((state) => state.user);
  
  const notes = useNotesStore((state) => state.notes);
  const isLoadingNotes = useNotesStore((state) => state.isLoadingNotes);
  
  // 2. Removi updateNoteInStore pois não vamos editar notas agora
  const { 
    setNotes, setIsLoadingNotes, addNoteToStore, removeNoteFromStore 
  } = useNotesStore();

  // 1. FETCH (Buscar)
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

  // 2. ADD (Adicionar)
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

    addNoteToStore(newNote); // UI Otimista

    try {
      // 3. CORREÇÃO: Criamos o objeto limpo sem destructuring para evitar erro do ESLint
      const docData = {
        title: newNote.title,
        content: newNote.content,
        isPinned: newNote.isPinned,
        userId: newNote.userId,
        createdAt: newNote.createdAt
      };
      
      await addDoc(notesCollectionRef, docData);
      fetchNotes(); // Sincroniza ID real
    } catch (error) {
      console.error("Erro ao criar nota:", error);
      fetchNotes(); // Reverte
    }
  };

  // 3. DELETE (Remover)
  const deleteNote = async (id: string) => {
    removeNoteFromStore(id);
    try {
      await deleteDoc(doc(db, "notes", id));
    } catch (error) {
      console.error("Erro ao deletar nota:", error);
      fetchNotes();
    }
  };

  return { notes, isLoadingNotes, fetchNotes, addNote, deleteNote };
};