import { User } from "firebase/auth";

interface UserGreetingProps {
  user: User;
}

export default function UserGreeting({ user }: UserGreetingProps) {
  return (
    <p className="mb-4 text-lg text-gray-700">
      {user.displayName}님 안녕하세요
    </p>
  );
}