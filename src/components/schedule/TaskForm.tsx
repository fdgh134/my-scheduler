import { useState } from "react";
import { Task } from "./ScheduleList";

interface Props {
  onAdd: (task: Omit<Task, "id">) => void;
}

export default function TaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [tag, setTag] = useState("업무");

  const tags = [
    { label: "업무", value: "업무" },
    { label: "회의", value: "회의" },
    { label: "개인", value: "개인" },
    { label: "기타", value: "기타" },
  ];

  const handleSubmit = () => {
    if (!title || !date || !time) return;

    const datetime = new Date(`${date}T${time}`).getTime();

    onAdd({
      title,
      date,
      time,
      content: description,
      tag,
      datetime,
    });
    
    setTitle("");
    setDate("");
    setTime("");
    setDescription("");
    setTag("업무");
  };

  const inputBase =
    "w-full px-3 py-2 border rounded-md shadow-sm outline-none transition-colors duration-300";
  const input = `${inputBase} bg-white text-gray-800 border-gray-300 dark:bg-slate-800 dark:text-neutral-100 dark:border-slate-700`;

  return (
    <div className="flex flex-col gap-4 mb-6">
      <input
        type="text"
        placeholder="일정 제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={input}
      />
      <div className="flex gap-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={input}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className={input}
        />
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className={input}
        >
          {tags.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <textarea
        placeholder="설명"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={input}
        rows={3}
      />
      <button
        onClick={handleSubmit}
        className="self-end px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
      >
        추가
      </button>
    </div>
  );
}
