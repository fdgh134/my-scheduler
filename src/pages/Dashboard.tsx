import { useEffect, useState } from "react";
import LogoutButton from "../components/auth/LogoutButton";
import UserGreeting from "../components/user/UserGreeting";
import ScheduleList from "../components/schedule/ScheduleList";
import { auth } from "../lib/firebase";
import { User } from "firebase/auth";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);
  return (
    <div className="relative w-full h-screen bg-stone-50 pt-6 md:pt-10">
      <div className="flex align-center justify-center mb-10">
        <h2 className="text-4xl font-bold">깜빡</h2>
      </div>
      {user && <LogoutButton />}

      <div className="flex flex-col items-center px-4 md:px-0">
        {user && <UserGreeting user={user} />}

        {user && <ScheduleList />}
      </div>
    </div>
  );
}