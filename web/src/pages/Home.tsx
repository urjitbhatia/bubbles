import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to Supaflare
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        A full-stack application built with React, FastAPI, Cloudflare Workers,
        and Supabase.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Frontend</h3>
          <p className="text-gray-600 text-sm">
            React + Vite + TailwindCSS on Cloudflare Pages
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Backend</h3>
          <p className="text-gray-600 text-sm">
            FastAPI + Python on Cloudflare Workers
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Database</h3>
          <p className="text-gray-600 text-sm">
            Supabase PostgreSQL with Auth & RLS
          </p>
        </div>
      </div>

      {!user && (
        <div className="mt-12">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      )}
    </div>
  )
}
