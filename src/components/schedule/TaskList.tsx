import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { Task } from "./ScheduleList";

interface Props {
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task | null) => void;
  editTaskId: string | null;
  onUpdate: (task: Task) => void;
}

function getTimeBasedBgColor(datetime: number): string {
  const now = Date.now();
  const diffMin = (datetime - now) / (60 * 1000);

  if (!datetime || isNaN(datetime)) return "#ffffff";
  if (diffMin < 0) return "#777777";        // 지난 일정
  if (diffMin > 1440) return "#ffffff";     // 1일 이상 남은 일정
  if (diffMin > 360) return "#bfdbfe";      // 6~12시간
  if (diffMin > 60) return "#93c5fd";       // 1~6시간
  return "#7faffc";                         // 1시간 이하
}

export default function TaskList({
  tasks,
  onDelete,
  onEdit,
  editTaskId,
  onUpdate,
}: Props) {
  const [editValues, setEditValues] = useState<Record<string, Partial<Task>>>({});

  const handleChange = (id: string, field: keyof Task, value: string | number) => {
    setEditValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = (task: Task) => {
    const updated = editValues[task.id];
    if (!updated) return;

    const newDate  = updated.date ?? new Date(task.datetime).toISOString().slice(0, 10);
    const newTime  = updated.time ?? new Date(task.datetime).toTimeString().slice(0, 5);
    const newDatetime = new Date(`${newDate}T${newTime }`).getTime();

    const isChanged =
    updated.title !== task.title ||
    updated.tag !== task.tag ||
    updated.content !== task.content ||
    newDatetime !== task.datetime;

    if (!isChanged) {
      alert("변경된 내용이 없습니다.");
      return;
    }
    
    onUpdate({
      ...task,
      ...updated,
      datetime: newDatetime,
    });

    setEditValues((prev) => {
      const copy = { ...prev };
      delete copy[task.id];
      return copy;
    });
  };

  const handleCancel = (id: string) => {
    onEdit(null); 
    setEditValues((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  if (tasks.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-4">
        등록된 일정이 없습니다.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const isEditing = task.id === editTaskId;
        const values = editValues[task.id] || {};
        const inputBase =
          "w-full px-3 py-2 border rounded-md shadow-sm outline-none transition-colors duration-300";
        const input = `${inputBase} bg-white text-gray-800 border-gray-300 dark:bg-slate-700 dark:text-neutral-100 dark:border-slate-600`;
        return (
          <div
            key={task.id}
            className={`rounded-lg p-4 shadow-lg bg-white transition-colors duration-300 
              ${getTimeBasedBgColor(task.datetime)} 
              dark:border-slate-700 dark:bg-slate-800`}
          >
            {isEditing ? (
              <div className="space-y-2 dark:bg-slate-800 dark:text-white transition-colors duration-300">
                <div className="flex gap-4">
                  <DatePicker
                    selected={
                      values.datetime
                        ? new Date(values.datetime)
                        : new Date(task.datetime)
                    }
                    onChange={(date) => {
                      if (date) {
                        handleChange(task.id, "datetime", date.getTime());
                        handleChange(task.id, "date", date.toISOString().split("T")[0]);
                        handleChange(task.id, "time", date.toTimeString().slice(0, 5));
                      }
                    }}
                    showTimeSelect
                    dateFormat="yyyy-MM-dd h:mm aa"
                    timeFormat="HH:mm"
                    className={input + " w-full"}
                  />
                  <select
                    value={values.tag ?? task.tag}
                    onChange={(e) => handleChange(task.id, "tag", e.target.value)}
                    className={input}
                  >
                    <option value="업무">업무</option>
                    <option value="개인">개인</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
                <textarea
                  value={values.content ?? task.content}
                  onChange={(e) => handleChange(task.id, "content", e.target.value)}
                  className={input}
                  placeholder=""
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleSave(task)}
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => handleCancel(task.id)}
                    className="bg-gray-400 text-white px-4 py-1 rounded"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between gap-4">
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-lg font-bold dark:text-white transition-colors duration-300">{task.title}</h3>
                    <p className="mt-1 text-sm dark:text-gray-300 transition-colors duration-300">{task.content}</p>
                  </div>
                  <span className="mt-2 inline-block px-2 py-1 text-xs bg-blue-500 text-white rounded w-fit">
                    {task.tag}
                  </span>
                </div>
                
                <div className="flex flex-col justify-end items-end space-y-2 self-end">
                  <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    {new Date(task.datetime).toLocaleString("ko-KR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </div>
                  <div className="flex gap-2 mt-8">
                    <button
                      onClick={() => onEdit(task)}
                      className="bg-blue-500 text-white px-4 py-1 rounded"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="bg-red-600 text-white px-4 py-1 rounded"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

