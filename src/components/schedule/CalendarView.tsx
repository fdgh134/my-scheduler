import Calendar from "react-calendar";
import { Task } from "./ScheduleList";
import "react-calendar/dist/Calendar.css";
import "./calendar-override.css"

interface CalendarViewProps {
  tasks: Task[];
}

export default function CalendarView({ tasks }: CalendarViewProps) {
  const datesWithTasks = tasks.map(task => new Date(task.date).toDateString());

  return (
    <div className="w-full p-4 rounded-md bg-white dark:bg-slate-800">
      <Calendar
        className="w-full"
        tileContent={({ date }: { date: Date }) => {
          const hasTask = datesWithTasks.includes(date.toDateString());
          return hasTask ? <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full mx-auto" /> : null;
        }}
      />
    </div>
  );
}