import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

export function useAuth() {
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("구글 로그인 에러:", error);
    }
  };

  const googleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("로그아웃 에러:", error);
    }
  };

  return { googleLogin, googleLogout };
}