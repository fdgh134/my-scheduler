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
    <div>
      <div className="flex align-center">
        <h2 className="text-2xl font-bold">깜빡</h2>
      </div>
      {user && <LogoutButton />}

      <div className="flex flex-col items-center">
        {user && <UserGreeting user={user} />}

        {user && <ScheduleList />}
      </div>
    </div>
  );
}