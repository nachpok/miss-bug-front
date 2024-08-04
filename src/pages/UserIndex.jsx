import { BugList } from "../cmps/BugList.jsx"
import { bugService } from "../services/bug.service.js"
import { useState, useEffect } from "react"

export function UserIndex({ user }) {
    const [userBugs, setUserBugs] = useState([])
    async function loadUserBugs() {
        if (!user) return
        const filterBy = { creator: user._id }
        const data = await bugService.query(filterBy)
        console.log("user bugs", data)
        setUserBugs(data.bugs)
    }
    useEffect(() => {
        loadUserBugs()
    }, [user])

    return (
        <div>
            <h1>{user?.fullname}</h1>
            <BugList bugs={userBugs} user={user} />
        </div>
    )
}