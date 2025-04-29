import { useState, useEffect } from "react";
import LoginButton from "../auth/LoginButton"
import { User } from "firebase/auth"
import { auth } from "../../lib/firebase";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(currentUser => {
        setUser(currentUser);
      });
  
      return () => unsubscribe();
    }, []);

  return (
    <div className="flex flex-col w-full h-[100vh] items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-10">일정관리 서비스 깜빡</h1>
      {!user && <LoginButton />}
    </div>
  )
}