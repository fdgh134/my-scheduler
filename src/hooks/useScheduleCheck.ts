import { useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { showLocalNotification } from "../utils/notifications";

export function useScheduleCheck() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = Date.now();
      const fiveMinLater = now + 5 * 60 * 1000;

      const q = query(
        collection(db, "tasks"),
        where("timestamp", ">=", now),
        where("timestamp", "<=", fiveMinLater)
      );

      const snapshot = await getDocs(q);
      snapshot.forEach((doc) => {
        const task = doc.data();
        showLocalNotification(`곧 일정: ${task.title}`, {
          body: `${task.date} ${task.time} 예정입니다.`,
        });
      });
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);
}
