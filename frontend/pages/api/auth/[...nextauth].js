import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Usernames', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                // console.log('Credentials received:', credentials)

                const res = await fetch('http://localhost:5000/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials)
                })

                const data = await res.json()
                console.log('Response from auth endpoint:', res.status, res.statusText, data);
                if (data.token) {
                    return { token: data.token }
                }
                return null
            }
        })
    ],
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
    },
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user?.token) token.accessToken = user.token
            return token
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken
            return session
        }
    }
})