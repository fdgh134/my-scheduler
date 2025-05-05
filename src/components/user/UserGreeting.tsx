import { User } from "firebase/auth";

interface UserGreetingProps {
  user: User;
}

export default function UserGreeting({ user }: UserGreetingProps) {
  return (
    <p className="mb-4 text-lg md:text-2xl text-gray-700 dark:text-neutral-100 transition-colors duration-300">
      {user.displayName}님 안녕하세요
    </p>
  );
}