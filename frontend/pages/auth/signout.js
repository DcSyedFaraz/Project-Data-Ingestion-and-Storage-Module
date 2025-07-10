import { signOut, getSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function SignOut({ session }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSignOut = async () => {
        setLoading(true)
        try {
            await signOut({ callbackUrl: '/auth/signin' })
        } catch (error) {
            console.error('Sign out error:', error)
            setLoading(false)
        }
    }

    const handleCancel = () => {
        router.push('/')
    }

    return (
        <>
            <Head>
                <title>Sign Out - TempPredict</title>
                <meta name="description" content="Sign out of your TempPredict account" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl text-white">👋</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Out</h1>
                        <p className="text-gray-600">Thanks for using TempPredict!</p>
                    </div>

                    {/* Sign Out Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="p-8 text-center">
                            {/* User Info */}
                            <div className="mb-6">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    {session?.user?.image ? (
                                        <img
                                            src={session.user.image}
                                            alt="Profile"
                                            className="w-16 h-16 rounded-full"
                                        />
                                    ) : (
                                        <span className="text-2xl text-white">👤</span>
                                    )}
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                    {session?.user?.name || 'User'}
                                </h2>
                                <p className="text-gray-600">
                                    {session?.user?.email || 'No email available'}
                                </p>
                            </div>

                            {/* Sign Out Message */}
                            <div className="mb-8">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Are you sure you want to sign out?</h3>
                                <p className="text-gray-600">You'll need to sign in again to access your temperature predictions and analytics.</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleSignOut}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-orange-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing out...
                                        </span>
                                    ) : (
                                        '🚪 Sign Out'
                                    )}
                                </button>

                                <button
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Before you go...</h3>
                        <div className="space-y-3">
                            <div className="flex items-center p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-lg">📊</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">View your recent predictions</p>
                                    <p className="text-xs text-gray-600">Check your temperature forecast history</p>
                                </div>
                            </div>

                            <div className="flex items-center p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-lg">💾</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Export your data</p>
                                    <p className="text-xs text-gray-600">Download your analytics and reports</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)

    // Redirect if not signed in
    if (!session) {
        return { redirect: { destination: '/auth/signin', permanent: false } }
    }

    return {
        props: { session },
    }
}