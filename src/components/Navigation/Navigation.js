import React from "react";

const Navigation = ({ routeChangeHandler, isSignedIn }) => {
  if (isSignedIn) {
    return (
      <nav style={{ display: "flex", justifyContent: "flex-end" }}>
        <p
          onClick={() => routeChangeHandler("signout")}
          className='f3 link dim black  pa3 pointer'
        >
          Sign Out
        </p>
      </nav>
    );
  } else {
    return (
      <nav style={{ display: "flex", justifyContent: "flex-end" }}>
        <p
          onClick={() => routeChangeHandler("signin")}
          className='f3 link dim black  pa3 pointer'
        >
          Sign In
        </p>
        <p
          onClick={() => routeChangeHandler("register")}
          className='f3 link dim black  pa3 pointer'
        >
          Register
        </p>
      </nav>
    );
  }
};

export default Navigation;
