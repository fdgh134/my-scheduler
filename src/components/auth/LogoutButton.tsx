import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import { useAuth } from "../../hooks/useAuth";
import { User } from "firebase/auth";

export default function AuthButton() {
  const { googleLogout } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (!user) return null;

  return (
    <div className="absolute top-[5%] right-[5%]">
      <button
        onClick={googleLogout}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg"
      >
        로그아웃
      </button>
    </div>
  );
}
