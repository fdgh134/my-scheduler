// src/hooks/useSchedule.ts
import { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  onSnapshot
} from 'firebase/firestore';

interface Task {
  id?: string;
  title: string;
  date: string;
  completed: boolean;
}

export function useSchedule() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;

    const tasksRef = collection(db, 'schedules', userId, 'tasks');
    const unsubscribe = onSnapshot(query(tasksRef), snapshot => {
      const data: Task[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      setTasks(data);
    });

    return unsubscribe;
  }, [userId]);

  const addTask = async (task: Task) => {
    if (!userId) return;
    const tasksRef = collection(db, 'schedules', userId, 'tasks');
    await addDoc(tasksRef, task);
  };

  const updateTask = async (taskId: string, data: Partial<Task>) => {
    if (!userId) return;
    const taskDoc = doc(db, 'schedules', userId, 'tasks', taskId);
    await updateDoc(taskDoc, data);
  };

  const deleteTask = async (taskId: string) => {
    if (!userId) return;
    const taskDoc = doc(db, 'schedules', userId, 'tasks', taskId);
    await deleteDoc(taskDoc);
  };

  return { tasks, addTask, updateTask, deleteTask };
}
