import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Define types for state and actions
type UserState = {
  username: string;
  isAdmin: boolean;
  token: string | undefined;
};

type Action =
  | { type: "LOGIN"; payload: { username: string; isAdmin: boolean; token: string | undefined } }
  | { type: "LOGOUT" };

// Define context type
type ContextType = {
  user: UserState;
  dispatch: React.Dispatch<Action>;
};

// Create context
const UserContext = createContext<ContextType | undefined>(undefined);
const port = process.env.PORT || 8000;

// Define provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialState: UserState = {
    username: "",
    isAdmin: false,
    token: "",
  };

  const reducer = (state: UserState, action: Action): UserState => {
    switch (action.type) {
      case "LOGIN":
        return {
          username: action.payload.username,
          isAdmin: action.payload.isAdmin,
          token: action.payload.token,
        };
      case "LOGOUT":
        return initialState; // Clear the user state on logout
      default:
        return state;
    }
  };

  const [user, dispatch] = useReducer(reducer, initialState);

  return React.createElement(UserContext.Provider, { value: { user, dispatch } }, children);
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
