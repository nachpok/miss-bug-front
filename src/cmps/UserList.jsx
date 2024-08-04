import { useState, useEffect } from "react"
import { userService } from "../services/user.service.js"
import { Avatar, List } from 'antd';
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

export function UserList({ user }) {
    const [users, setUsers] = useState([])

    useEffect(() => {
        const loadUsers = async () => {
            const res = await userService.query()
            setUsers(res.data)
        }
        loadUsers()
    }, [])

    async function removeUser(userId) {
        if (userId === user._id) return

        try {
            const res = await userService.remove(userId)
            if (res.status === 200) {
                setUsers(users.filter(user => user._id !== userId))
            }
        } catch (err) {
            console.log(err)
            console.log(err.response.data)
            showErrorMsg(`Cannot remove user, ${err.response.data}`)
        }
    }

    return (
        <section>
            <h1>Users</h1>
            <List
                itemLayout="horizontal"
                dataSource={users}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                            title={<a href="https://ant.design">{item.fullname}</a>}
                        />
                        <button onClick={() => removeUser(item._id)} data-user-id={item._id} disabled={item._id === user._id}>Remove</button>
                    </List.Item>
                )}
            />
        </section>
    )
}