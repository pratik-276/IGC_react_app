import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCvamTRdsiD-7sPom4K-pJIjMqmdmZ2UvA",
  authDomain: "igaming-react.firebaseapp.com",
  projectId: "igaming-react",
  storageBucket: "igaming-react.appspot.com",
  messagingSenderId: "534050331419",
  appId: "1:534050331419:web:e3db279b06a485250a91be",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
