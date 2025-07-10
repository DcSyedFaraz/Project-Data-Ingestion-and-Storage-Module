// pages/_app.js
import { SessionProvider } from 'next-auth/react'
// filepath: d:\projects\Project Data Ingestion and Storage Module\frontend\pages\_app.js
import '../styles/globals.css'
// ...existing code...
export default function App({
    Component,
    pageProps: { session, ...pageProps },
}) {
    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
    )
}