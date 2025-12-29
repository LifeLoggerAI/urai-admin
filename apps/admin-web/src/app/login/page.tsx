import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

const Login = () => {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
