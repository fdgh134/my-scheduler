import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import { useAuth } from "../../hooks/useAuth";
import { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export default function AuthButton() {
  const { googleLogout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await googleLogout();
    navigate("/"); // 로그아웃 후 홈(로그인 페이지)로 이동
  };

  if (!user) return null;

  return (
    <div className="absolute top-7 md:top-[30px] right-4 ">
      <Button variant="outlined" color="error" onClick={handleLogout} sx={{ backgroundColor: "white"}}>
        로그아웃
      </Button>
    </div>
  );
}
