import { useEffect, useState } from "react";
import LogoutButton from "./components/auth/LogoutButton";
import LoginButton from "./components/auth/LoginButton";
import UserGreeting from "./components/user/UserGreeting";
import ScheduleList from "./components/schedule/ScheduleList";
import { auth } from "./lib/firebase";
import { User } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="relative w-screen h-screen bg-gray-100 p-8">
      {user && <LogoutButton />}

      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">일정관리 서비스</h1>

        {!user && <LoginButton />}
        {user && <UserGreeting user={user} />}

        <ScheduleList />
      </div>
    </div>
  );
}