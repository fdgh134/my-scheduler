import { useEffect, useState } from "react";
import LogoutButton from "../components/auth/LogoutButton";
import UserGreeting from "../components/user/UserGreeting";
import ScheduleList from "../components/schedule/ScheduleList";
import { auth } from "../lib/firebase";
import { User } from "firebase/auth";
import { useScheduleCheck } from "../hooks/useScheduleCheck";
import { requestNotificationPermission } from "../utils/notifications";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useScheduleCheck();

  return (
    <div className="relative w-full min-h-screen bg-stone-50 pt-6 md:pt-10">
      <div className="flex align-center pl-4 md:justify-center mb-10">
        <h1 className="text-4xl font-bold">깜빡</h1>
      </div>
      {user && <LogoutButton />}

      <div className="flex flex-col items-center px-4 md:px-0">
        {user && <UserGreeting user={user} />}
        <div className="mt-8 w-full max-w-2xl md:max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">일정 관리</h2>
          <p className="text-gray-500 mb-4">일정을 추가하고 관리하세요.</p>
        </div>
        {user && <ScheduleList />}
      </div>
    </div>
  );
}