// components/Layout.js
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Layout({ children, title = 'TempPredict' }) {
    const { data: session } = useSession()
    const router = useRouter()

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        { name: 'Home', href: '/', icon: '🏠' },
        { name: 'Models', href: '/models', icon: '🤖' },
        { name: 'Upload', href: '/upload', icon: '📁' },
        { name: 'Support', href: '/support', icon: '💬' },
    ]

    const isActive = (href) => router.pathname === href

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content="AI-powered climate intelligence platform" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                {/* Header */}
                <header className="bg-white shadow-lg border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            {/* Logo */}
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">🌡️</span>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        TempPredict
                                    </h1>
                                    <p className="text-sm text-gray-500">Climate Intelligence Platform</p>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="hidden md:flex space-x-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${isActive(item.href)
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                            }`}
                                    >
                                        <span>{item.icon}</span>
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                            </nav>

                            {/* User Menu */}
                            {session && (
                                <div className="flex items-center space-x-4">
                                    <div className="hidden sm:block">
                                        <span className="text-sm text-gray-600">Welcome back!</span>
                                    </div>
                                    <button
                                        onClick={() => signOut()}
                                        className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden border-t border-gray-200">
                        <div className="px-4 py-2 flex space-x-1 overflow-x-auto">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-1 ${isActive(item.href)
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                        }`}
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 mt-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center text-gray-500 text-sm">
                            <p>© 2024 TempPredict. Powered by advanced climate modeling.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    )
}