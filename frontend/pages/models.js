// pages/models.js
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { getSession } from 'next-auth/react'

export async function getServerSideProps(context) {
  const session = await getSession(context)
  if (!session) {
    return { redirect: { destination: '/api/auth/signin', permanent: false } }
  }
  return { props: { session } }
}

export default function Models() {
  const [models, setModels] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadModels = async () => {
      try {
        const res = await fetch('/api/models')
        const data = await res.json()
        if (res.ok) {
          setModels(data.models)
        } else {
          setError(data.error || 'Failed to load models')
        }
      } catch (err) {
        console.error('Error loading models:', err)
        setError('Failed to connect to models API')
      } finally {
        setLoading(false)
      }
    }

    loadModels()
  }, [])

  const ModelCard = ({ model }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-200">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{model.name}</h3>
            <p className="text-blue-100 text-sm">AI Model</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Model Files:</p>
          <div className="space-y-2">
            {model.files.map((file, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm">📄</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{file}</p>
                  <p className="text-xs text-gray-500">Model component</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm text-gray-600">Active</span>
          </div>
          <div className="text-sm text-gray-500">
            {model.files.length} file{model.files.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <Layout title="Models - TempPredict">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading models...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout title="Models - TempPredict">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-xl">❌</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800">Error Loading Models</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Models - TempPredict">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Models</h1>
          <p className="text-gray-600">Manage and monitor your trained machine learning models</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Models</p>
                <p className="text-2xl font-bold text-blue-600">{models?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Models</p>
                <p className="text-2xl font-bold text-green-600">{models?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Model Files</p>
                <p className="text-2xl font-bold text-purple-600">
                  {models?.reduce((acc, model) => acc + model.files.length, 0) || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
            </div>
          </div>
        </div>

        {/* Models Grid */}
        {models && models.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {models.map((model, index) => (
              <ModelCard key={index} model={model} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Models Found</h3>
            <p className="text-gray-600 mb-6">There are no trained models available at the moment.</p>
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
              Train New Model
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}