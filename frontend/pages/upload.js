import { useState } from 'react'
import { getSession } from 'next-auth/react'

export default function UploadPage() {
    const [file, setFile] = useState(null)

    const handleSubmit = async e => {
        e.preventDefault()
        const session = await getSession()
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/upload', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            },
            body: formData
        })

        // handle response…
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={e => setFile(e.target.files[0])} />
            <button type="submit">Upload</button>
        </form>
    )
}
