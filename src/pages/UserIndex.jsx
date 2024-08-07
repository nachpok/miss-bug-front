import { BugList } from "../cmps/BugList.jsx";
import { bugService } from "../services/bug.service.js";
import { useState, useEffect } from "react";

export function UserIndex({ user }) {
  const [userBugs, setUserBugs] = useState([]);
  useEffect(() => {
    if (user) {
      loadUserBugs();
    }
  }, [user]);

  async function loadUserBugs() {
    const filterBy = { creator: user._id };
    try {
      const data = await bugService.query(filterBy);
      setUserBugs(data.bugs);
    } catch (err) {
      console.log(err);
    }
  }

  if (!user) return <>Missing user</>;
  return (
    <div>
      <h1>{user?.fullname}</h1>
      <BugList bugs={userBugs} user={user} />
    </div>
  );
}
