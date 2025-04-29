import { Button } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoginButton() {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    await googleLogin();
    navigate("/dashboard");
  };
  return (
    <div className="flex justify-center">
      <Button variant="contained" onClick={handleLogin}>
        Google 로그인
      </Button>
    </div>
  );
}