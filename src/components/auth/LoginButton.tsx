import { useAuth } from "../../hooks/useAuth";

export default function LoginButton() {
  const { googleLogin } = useAuth();

  return (
    <div className="flex justify-center">
      <button
        onClick={googleLogin}
        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
      >
        Google 로그인
      </button>
    </div>
  );
}