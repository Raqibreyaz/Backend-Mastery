import { useState } from "react";
import {
  GoogleLogin,
  useGoogleLogin,
  useGoogleOneTapLogin,
} from "@react-oauth/google";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  // useGoogleOneTapLogin({
  //   onSuccess: (credentialResponse) => {
  //     console.log(credentialResponse);
  //   },
  //   onError: () => {
  //     console.log("Login Failed");
  //   },
  // });

  // implicit-> gives access token
  // auth-code-> gives code
  // const login = useGoogleLogin({
  //   onSuccess: (codeResponse) => console.log(codeResponse),
  //   flow: "auth-code",

  // });

  return (
    <>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
        useOneTap={true}
        shape="pill"
        type="standard"
        theme="filled_blue"
        text="continue_with"
      />
      {/* <button onClick={login}>Login with Google</button> */}
    </>
  );
}

export default App;
