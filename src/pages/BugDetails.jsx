
import { useState } from 'react'
import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { useParams } from 'react-router'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'


export function BugDetails() {

    const [bug, setBug] = useState(null)
    const [error, setError] = useState(null)

    console.log(bug)
    const { bugId } = useParams()

    useEffect(() => {
        loadBug()
    }, [])

    async function loadBug() {
        try {
            const bug = await bugService.getById(bugId)
            console.log('bug', bug)
            setBug(bug)
        } catch (err) {
            setError(err.message)

            showErrorMsg('Cannot load bug')

        }
    }


    if (error) return <div className="error">{error}</div>
    if (!bug) return <div>Loading...</div>
    return (
        <div className="bug-details container">
            <h3>Bug Details 🐛</h3>
            <h4>{bug.title}</h4>
            <p>Severity: <span>{bug.severity}</span></p>
            {bug.description && <p>{bug.description}</p>}
            {bug.labels && <p>Labels: {bug.labels.map((label) => label.title).join(', ')}</p>}
            <Link to="/bug">Back to List</Link>
        </div>
    )
}

