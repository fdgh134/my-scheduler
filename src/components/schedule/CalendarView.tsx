import { useState } from "react";
import Calendar from "react-calendar";
import { Task } from "./ScheduleList";
import "react-calendar/dist/Calendar.css";
import "./calendar-override.css"

interface CalendarViewProps {
  tasks: Task[];
}

export default function CalendarView({ tasks }: CalendarViewProps) {
  const datesWithTasks = tasks.map(task => new Date(task.date).toDateString());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const selectedTasks = selectedDate
    ? tasks.filter(task => new Date(task.date).toDateString() === selectedDate.toDateString())
    : [];

  return (
    <div className="w-full p-4 rounded-md bg-white dark:bg-slate-800">
      <Calendar
        className="w-full"
        onClickDay={(value) => setSelectedDate(value)}
        tileContent={({ date }: { date: Date }) => {
          const hasTask = datesWithTasks.includes(date.toDateString());
          return hasTask ? <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full mx-auto" /> : null;
        }}
      />

      {selectedDate && (
        <div className="mt-4 p-4 border rounded-md bg-gray-50 dark:bg-slate-700">
          <h3 className="font-semibold text-gray-700 dark:text-white mb-2">
            {selectedDate.toLocaleDateString("ko-KR")}의 일정
          </h3>
          {selectedTasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-300">일정 없음</p>
          ) : (
            <ul className="space-y-2">
              {selectedTasks.map(task => (
                <li key={task.id} className="text-sm text-gray-800 dark:text-gray-200">
                  <strong>{task.time}</strong> - {task.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}