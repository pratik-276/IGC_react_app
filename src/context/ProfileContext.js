import React, { createContext, useReducer } from "react";

export const ProfileSystem = createContext();

const initialState = {
  email: false,
  profilename: false,
};

const Profile = (state, action) => {
  switch (action.type) {
    case "SET_EMAIL":
      return {
        ...state,
        email: action?.payload?.email,
      };

    case "SET_NAME":
      return {
        ...state,
        profilename: action?.payload?.profilename,
      };

    default:
      return state;
  }
};

const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Profile, initialState);

  return (
    <ProfileSystem.Provider value={{ state, dispatch }}>
      {children}
    </ProfileSystem.Provider>
  );
};
export default ProfileProvider;
