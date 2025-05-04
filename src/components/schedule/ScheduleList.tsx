import { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import { Divider } from "@mui/material";
import { db } from "../../lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

export interface Task {
  id: string;
  title: string;
  date: string;
  description: string;
  tag: string;
  datetime: number;
}

export default function ScheduleList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const snapshot = await getDocs(collection(db, "tasks"));
      const data = snapshot.docs.map((doc) => {
        const raw = doc.data();
        return {
          id: doc.id,
          title: raw.title,
          date: raw.date,
          description: raw.description,
          tag: raw.tag,
          datetime:
            typeof raw.datetime === "number"
              ? raw.datetime
              : raw.datetime?.toDate?.()
              ? raw.datetime.toDate().getTime()
              : new Date(raw.datetime).getTime(), // fallback
        } satisfies Task;
      });
      setTasks(data);
    };
    fetchTasks();
  }, []);

  const addTask = async (task: Omit<Task, "id">) => {
    const docRef = await addDoc(collection(db, "tasks"), task);
    setTasks([...tasks, { ...task, id: docRef.id }]);
  };

  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
    setTasks(tasks.filter(task => task.id !== id));
  };

  const editTask = (task: Task) => {
    alert(`수정: ${task.title}`);
  };

  return (
    <div className="mt-2 w-full max-w-2xl md:max-w-3xl">
      <TaskForm onAdd={addTask} />
      <Divider sx={{ my: 4 }} />
      <TaskList tasks={tasks} onDelete={deleteTask} onEdit={editTask} />
    </div>
  );
}