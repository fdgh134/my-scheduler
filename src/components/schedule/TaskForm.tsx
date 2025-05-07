import { useState } from "react";
import { Task } from "./ScheduleList";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { format } from "date-fns";

interface Props {
  onAdd: (tasks: Omit<Task, "id">[]) => void;
}

type RepeatType = "none" | "daily" | "weekly" | "monthly";

export default function TaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("업무");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [repeat, setRepeat] = useState<RepeatType>("none");
  const [repeatUntill, setRepeatUntill] = useState<string>("");

  const tags = [
    { label: "업무", value: "업무" },
    { label: "회의", value: "회의" },
    { label: "개인", value: "개인" },
    { label: "기타", value: "기타" },
  ];

  const handleSubmit = () => {
    if (!title || !selectedDate) return;

    const baseTask = {
      title,
      content: description,
      tag,
      isDone: false,
    };

    const tasksToAdd: Omit<Task, "id">[] = [];

    if (repeat === "none" || !repeatUntill) {
     
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const formattedTime = format(selectedDate, "HH:mm");
      const datetime = selectedDate.getTime();

      tasksToAdd.push({
        ...baseTask,
        date: formattedDate,
        time: formattedTime,
        datetime,
      });
    } else {
      const endDate = new Date(repeatUntill);
      let current = new Date(selectedDate);

      while (current <= endDate) {
        const formattedDate = format(current, "yyyy-MM-dd");
        const formattedTime = format(current, "HH:mm");
        const datetime = current.getTime();

        tasksToAdd.push({
          ...baseTask,
          date: formattedDate,
          time: formattedTime,
          datetime,
        });

        // 날짜 증가
        current = new Date(current);
        if (repeat === "daily") {
          current.setDate(current.getDate() + 1);
        } else if (repeat === "weekly") {
          current.setDate(current.getDate() + 7);
        } else if (repeat === "monthly") {
          current.setMonth(current.getMonth() + 1);
        }
      }
    }
    
    onAdd(tasksToAdd);

    setTitle("");
    setSelectedDate(new Date());
    setDescription("");
    setTag("업무");
    setRepeat("none");
    setRepeatUntill("");
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
        <div className="w-full">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            locale={ko}
            className={input}
            placeholderText="날짜 및 시간 선택"
          />
        </div>
        <select
          value={repeat}
          onChange={(e) => setRepeat(e.target.value as RepeatType)}
          className={input}
        >
          <option value="none">반복 없음</option>
          <option value="daily">매일</option>
          <option value="weekly">매주</option>
          <option value="monthly">매월</option>
        </select>
        {repeat !== "none" && (
          <input
            type="date"
            value={repeatUntill}
            onChange={(e) => setRepeatUntill(e.target.value)}
            className={input}
          />
        )}
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
