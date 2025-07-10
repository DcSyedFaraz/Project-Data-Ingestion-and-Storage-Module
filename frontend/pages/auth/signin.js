import { getProviders, signIn, getSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function SignIn({ providers }) {
    const [username, setUsername] = useState('admin')
    const [password, setPassword] = useState('password')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { error } = router.query

    const handleCredentialsSignIn = async (e) => {
        e.preventDefault()
        setLoading(true)

        // signIn returns a Promise<{ error?, ok? }>
        const result = await signIn('credentials', {
            redirect: false,
            username,
            password,
        })
        console.log('Sign-in result:', result);

        if (!result.ok) {
            console.error('Credentials sign-in error:', result.error)
        } else {
            router.push('/')
        }
        setLoading(false)
    }

    const handleProviderSignIn = async (providerId) => {
        setLoading(true)
        try {
            await signIn(providerId, { callbackUrl: '/' })
        } catch (err) {
            console.error(err)
            setLoading(false)
        }
    }

    return (
        <>
            <Head>
                <title>Sign In - TempPredict</title>
                <meta name="description" content="Sign in to your TempPredict account" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl text-white">🌡️</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-600">Sign in to TempPredict Dashboard</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">
                                {error === 'CredentialsSignin' && 'Invalid credentials. Please try again.'}
                                {error === 'OAuthAccountNotLinked' && 'This account is linked to another provider.'}
                                {error === 'SessionRequired' && 'Please sign in to access this page.'}
                                {!['CredentialsSignin', 'OAuthAccountNotLinked', 'SessionRequired'].includes(error) && 'An error occurred. Please try again.'}
                            </p>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        <form onSubmit={handleCredentialsSignIn} className="p-8 space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !username || !password}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {loading ? 'Signing in…' : 'Sign in'}
                            </button>

                            {providers && Object.values(providers).length > 1 && (
                                <>
                                    <div className="relative my-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-300"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {Object.values(providers)
                                            .filter(p => p.id !== 'credentials')
                                            .map(provider => (
                                                <button
                                                    key={provider.id}
                                                    type="button"
                                                    onClick={() => handleProviderSignIn(provider.id)}
                                                    disabled={loading}
                                                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                                >
                                                    {provider.name === 'Google' && (
                                                        <img src="/icons/google.svg" alt="" className="w-5 h-5 mr-3" />
                                                    )}
                                                    {provider.name === 'GitHub' && (
                                                        <img src="/icons/github.svg" alt="" className="w-5 h-5 mr-3" />
                                                    )}
                                                    <span className="text-gray-700 font-medium">Continue with {provider.name}</span>
                                                </button>
                                            ))}
                                    </div>
                                </>
                            )}
                        </form>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">
                            By signing in, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    if (session) {
        return { redirect: { destination: '/', permanent: false } }
    }
    const providers = await getProviders()
    return { props: { providers: providers ?? {} } }
}
