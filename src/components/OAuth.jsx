import { db } from "../db";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const url = db.auth.createAuthorizationURL({
  clientName: "google",
  redirectURL: window.location.href,
});

function OAuth() {
  const { dispatch, actionTypes } = useAuth();
  const { isLoading, user: authUser, error } = db.useAuth();
  console.log(authUser);

  useEffect(() => {
    if (authUser) {
      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        payload: {
          email: authUser.email,
          userId: authUser.id,
          refreshToken: authUser.refresh_token,
        },
      });
    }
  }, [authUser, dispatch, actionTypes]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Uh oh! {error.message}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-10 w-full h-full">
      <h2 className="font-semibold text-4xl">Welcome to ChatApp-v2</h2>
      <a href={url}>
        <button className="border-none bg-stone-700 text-stone-200 p-3 rounded-lg hover:bg-stone-600">
          Sign in with Google
        </button>
      </a>
      <p>We will be soon adding other authentications</p>
    </div>
  );
}

export default OAuth;
