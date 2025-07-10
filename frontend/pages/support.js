// pages/support.js
import { useState } from 'react'
import Layout from '../components/Layout'
import { getSession } from 'next-auth/react'

export async function getServerSideProps(context) {
    const session = await getSession(context)
    if (!session) {
        return { redirect: { destination: '/api/auth/signin', permanent: false } }
    }
    return { props: { session } }
}

export default function Support() {
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, email, subject })
      })

      if (res.ok) {
        setStatus('success')
        setMessage('')
        setEmail('')
        setSubject('')
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error('Support submission error:', error)
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const faqItems = [
    {
      question: "How accurate are the temperature predictions?",
      answer: "Our AI models are trained on decades of historical climate data and achieve high accuracy rates. However, predictions are estimates and actual temperatures may vary due to various environmental factors."
    },
    {
      question: "What data sources do you use?",
      answer: "We use global land and ocean temperature data from reputable meteorological organizations and climate research institutions worldwide."
    },
    {
      question: "Can I access historical data?",
      answer: "Yes, you can view historical temperature trends and anomalies through our dashboard. The data spans multiple decades of climate observations."
    },
    {
      question: "How often are predictions updated?",
      answer: "Our models are continuously updated with new data, and predictions are generated in real-time when you make a request."
    }
  ]

  return (
    <Layout title="Support - TempPredict">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Support Center</h1>
          <p className="text-xl text-gray-600">
            Get help with TempPredict or send us your feedback
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white">Contact Us</h2>
              <p className="text-blue-100 mt-2">Send us a message and we'll get back to you</p>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="technical">Technical Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    '📧 Send Message'
                  )}
                </button>
              </form>

              {/* Status Messages */}
              {status === 'success' && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✅</span>
                    <span className="text-green-800 font-medium">Message sent successfully!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">We'll get back to you within 24 hours.</p>
                </div>
              )}

              {status === 'error' && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-red-600 mr-2">❌</span>
                    <span className="text-red-800 font-medium">Failed to send message</span>
                  </div>
                  <p className="text-red-700 text-sm mt-1">Please try again or contact us directly.</p>
                </div>
              )}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">❓</span>
                Frequently Asked Questions
              </h3>

              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="font-medium text-gray-900 mb-2">{item.question}</h4>
                    <p className="text-sm text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🔗</span>
                Quick Links
              </h3>

              <div className="space-y-3">
                <a href="/dashboard" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <span className="mr-3">📊</span>
                    <div>
                      <p className="font-medium text-gray-900">View Dashboard</p>
                      <p className="text-sm text-gray-600">Access climate data and visualizations</p>
                    </div>
                  </div>
                </a>

                <a href="/models" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <span className="mr-3">🤖</span>
                    <div>
                      <p className="font-medium text-gray-900">AI Models</p>
                      <p className="text-sm text-gray-600">Explore our machine learning models</p>
                    </div>
                  </div>
                </a>

                <a href="/" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <span className="mr-3">🏠</span>
                    <div>
                      <p className="font-medium text-gray-900">Make Predictions</p>
                      <p className="text-sm text-gray-600">Get temperature forecasts</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}