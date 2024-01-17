import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export const UserContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        const response = await fetch("http://localhost:4000/profile", {
          credentials: "include",
          method: "GET",
        });

        const data = await response.json();
        setUser(data);
        setReady(true);
      }
    };

    fetchData();
  }, []);

  /* useEffect(() => {
    if (!user) {
      fetch("http://localhost:4000/profile", {
        credentials: "include",
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setReady(true);
        });
    }
  }, []); */

  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {props.children}
    </UserContext.Provider>
  );
};
