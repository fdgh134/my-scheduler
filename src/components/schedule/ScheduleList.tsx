import { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import { Divider } from "@mui/material";
import { db } from "../../lib/firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

export interface Task {
  id: string;
  title: string;
  content: string; 
  date: string;
  time: string;
  tag: string;
  datetime: number;
  createdAt?: number;
}

export default function ScheduleList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [sortOption, setSortOption] = useState<"created" | "asc" | "desc">("created");
  const [filterTag, setFilterTag] = useState("");
  const [editTaskId, setEditTaskId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const snapshot = await getDocs(collection(db, "tasks"));
      const data = snapshot.docs.map((doc) => {
        const raw = doc.data();
        return {
          id: doc.id,
          title: raw.title,
          content: raw.content ?? "",      
          time: raw.time ?? "",  
          date: raw.date,
          tag: raw.tag,
          datetime:
            typeof raw.datetime === "number"
              ? raw.datetime
              : raw.datetime?.toDate
              ? raw.datetime.toDate().getTime()
              : typeof raw.datetime === "string"
              ? new Date(raw.datetime).getTime()
              : Date.now(), 
        } satisfies Task;
      });
      setTasks(data);
    };
    fetchTasks();
  }, []);

  const addTask = async (task: Omit<Task, "id">) => {
    const withTimestamp = { ...task, createdAt: Date.now() };
    const docRef = await addDoc(collection(db, "tasks"), withTimestamp);
    setTasks([...tasks, { ...withTimestamp, id: docRef.id }]);
  };

  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = [...tasks]
    .filter((task) => 
      task.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      task.content.toLowerCase().includes(searchKeyword)
    )
    .filter((task) => (filterTag && filterTag !== "전체" ? task.tag === filterTag : true))
    .sort((a, b) => {
      if (sortOption === "asc") return a.datetime - b.datetime;
      if (sortOption === "desc") return b.datetime - a.datetime;
      if (sortOption === "created") return a.createdAt! - b.createdAt!;
      return 0;
    });

    const handleEdit = (task: Task) => {
      setEditTaskId(task.id);
    };

    const handleUpdate = async (updatedTask: Task) => {
      const ref = doc(db, "tasks", updatedTask.id);

      await updateDoc(ref, {
        title: updatedTask.title,
        content: updatedTask.content,
        tag: updatedTask.tag,
        date: updatedTask.date,
        time: updatedTask.time,
        datetime: updatedTask.datetime,
      });
      
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      setEditTaskId(null);
    }

  return (
    <div className="mt-2 w-full max-w-2xl md:max-w-3xl">
      <TaskForm onAdd={addTask} />
      <Divider sx={{ my: 4 }} />
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="검색어 입력"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md bg-white dark:bg-slate-800 dark:text-neutral-100 dark:border-slate-700 transition-colors duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as "created" | "asc" | "desc")}
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-slate-800 dark:text-neutral-100 dark:border-slate-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="created">등록순</option>
          <option value="asc">오름차순</option>
          <option value="desc">내림차순</option>
        </select>
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-slate-800 dark:text-neutral-100 dark:border-slate-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        >
          <option value="전체">전체</option>
          <option value="업무">업무</option>
          <option value="회의">회의</option>
          <option value="개인">개인</option>
          <option value="기타">기타</option>
        </select>
      </div>
      <TaskList 
        tasks={filteredTasks} 
        onDelete={deleteTask} 
        onEdit={handleEdit}
        editTaskId={editTaskId}
        onUpdate={handleUpdate}
      />
    </div>
  );
}