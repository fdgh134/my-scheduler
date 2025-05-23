import { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import CalendarView from "./CalendarView";
import { Divider } from "@mui/material";
import { db } from "../../lib/firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { List, Calendar } from "lucide-react"

export interface Task {
  id: string;
  title: string;
  content: string; 
  date: string;
  time: string;
  tag: string;
  datetime: number;
  createdAt?: number;
  isDone: boolean;
}

export default function ScheduleList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [sortOption, setSortOption] = useState<"created" | "asc" | "desc">("created");
  const [filterTag, setFilterTag] = useState("");
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

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
          isDone: raw.isDone ?? false,
        } satisfies Task;
      });
      setTasks(data);
    };
    fetchTasks();
  }, []);

  const addTasks = async (newTasks: Omit<Task, "id">[]) => {
    const createdAt = Date.now();
  
    const promises = newTasks.map(async (task) => {
      const withTimestamp = { ...task, createdAt };
      const docRef = await addDoc(collection(db, "tasks"), withTimestamp);
      return { ...withTimestamp, id: docRef.id };
    });
  
    const inserted = await Promise.all(promises);
    setTasks((prev) => [...prev, ...inserted]);
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

    const handleEdit = (task: Task | null) => {
      setEditTaskId(task ? task.id : null);
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

    const toggleDone = async (id: string) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, isDone: !task.isDone } : task
        )
      );

      const target = tasks.find((task) => task.id === id);
      if (target) {
        const ref = doc(db, "tasks", id);
        await updateDoc(ref, {
          isDone: !target.isDone,
        });
      }
    };

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const weeklyCount = tasks.filter(task =>
      new Date(task.date) >= startOfWeek
    ).length;

    const monthlyCount = tasks.filter(task =>
      new Date(task.date) >= startOfMonth
    ).length;

  return (
    <div className="mt-2 w-full max-w-2xl md:max-w-3xl">
      <TaskForm onAdd={addTasks} />
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
          aria-label="정렬 옵션"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as "created" | "asc" | "desc")}
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-slate-800 dark:text-neutral-100 dark:border-slate-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="created">등록순</option>
          <option value="asc">오름차순</option>
          <option value="desc">내림차순</option>
        </select>
        <select
          aria-label="태그 필터"
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
      <div className="mb-4 flex justify-end gap-2">
        <button
          onClick={() => {
            setSearchKeyword("");
            setFilterTag("");
            setSortOption("created");
          }}
          className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-md transition"
        >
          필터 초기화
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-white"
          }`}
        >
          <List size={18} />
          리스트
        </button>

        <button
          onClick={() => setViewMode("calendar")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            viewMode === "calendar" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-white transition"
          }`}
        >
          <Calendar size={18} />
          캘린더
        </button>
      </div>
      <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
        이번 주 일정: <strong>{weeklyCount}</strong>개 / 이번 달 일정: <strong>{monthlyCount}</strong>개
      </p>
      {viewMode === "calendar" ? (
        <CalendarView tasks={filteredTasks} />
      ) : (
        <TaskList 
          tasks={filteredTasks} 
          onDelete={deleteTask} 
          onEdit={handleEdit}
          editTaskId={editTaskId}
          onUpdate={handleUpdate}
          onToggleDone={toggleDone}
        />
      )}
      
    </div>
  );
}