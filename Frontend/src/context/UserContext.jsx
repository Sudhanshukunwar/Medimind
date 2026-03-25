import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  // --- THIS IS THE CRITICAL FIX ---
  // We initialize userInfo to `null`. An empty object {} is considered "true"
  // in JavaScript, which was causing the bug. `null` is "false".
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This runs once when the app starts to check if you are already logged in.
    console.log("CONTEXT: Checking for logged-in user...");
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/users/profile",
          { credentials: "include" }
        );
        if (response.ok) {
          const userData = await response.json();
          if (userData && userData.data) {
            console.log("CONTEXT: User found!", userData);
            setUserInfo(userData);
          } else {
            setUserInfo(null);
          }
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, loading }}>
      {children}
    </UserContext.Provider>
  );
}

