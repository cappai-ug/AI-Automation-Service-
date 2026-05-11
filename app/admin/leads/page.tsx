'use client'

import { useEffect, useState } from 'react'

interface Waitlist {
  id: number
  email: string
  company: string | null
  useCase: string | null
  status: string
  createdAt: Date
  notes: string | null
  source: string
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Waitlist[]>([])
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<number | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [bulkStatus, setBulkStatus] = useState('')
  const [editingNotes, setEditingNotes] = useState<number | null>(null)
  const [editingNotesText, setEditingNotesText] = useState('')

  useEffect(() => {
    const auth = localStorage.getItem('admin_authenticated') === 'true'
    if (auth) {
      setAuthenticated(true)
      fetchLeads()
    } else {
      setLoading(false)
    }
  }, [filter])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    if (password === adminPassword) {
      localStorage.setItem('admin_authenticated', 'true')
      setAuthenticated(true)
      setPassword('')
      fetchLeads()
    } else {
      alert('Falsches Passwort')
    }
  }

  async function fetchLeads() {
    setLoading(true)
    try {
      const query = new URLSearchParams()
      if (filter !== 'all') query.append('status', filter)

      const response = await fetch(`/api/admin/leads?${query}`)
      const data = await response.json()
      setLeads(data)
    } catch (error) {
      console.error('Error fetching leads:', error)
    }
    setLoading(false)
  }

  async function updateStatus(id: number, newStatus: string) {
    setUpdating(id)
    try {
      const response = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setLeads(leads.map(lead =>
          lead.id === id ? { ...lead, status: newStatus } : lead
        ))
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
    setUpdating(null)
  }

  async function updateNotes(id: number, notes: string) {
    try {
      const response = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      })

      if (response.ok) {
        setLeads(leads.map(lead =>
          lead.id === id ? { ...lead, notes } : lead
        ))
        setEditingNotes(null)
      }
    } catch (error) {
      console.error('Error updating notes:', error)
    }
  }

  async function bulkUpdateStatus() {
    if (selectedIds.size === 0 || !bulkStatus) return

    setUpdating(-1)
    try {
      const response = await fetch('/api/admin/leads/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: Array.from(selectedIds),
          status: bulkStatus
        })
      })

      if (response.ok) {
        setLeads(leads.map(lead =>
          selectedIds.has(lead.id) ? { ...lead, status: bulkStatus } : lead
        ))
        setSelectedIds(new Set())
        setBulkStatus('')
      }
    } catch (error) {
      console.error('Error updating leads:', error)
    }
    setUpdating(null)
  }

  function downloadCSV() {
    const headers = ['Email', 'Company', 'Use Case', 'Status', 'Date', 'Notes']
    const rows = leads.map(lead => [
      lead.email,
      lead.company || '',
      lead.useCase || '',
      lead.status,
      new Date(lead.createdAt).toLocaleDateString('de-DE'),
      lead.notes || ''
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === leads.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(leads.map(l => l.id)))
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Admin Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-4 text-center">
            (Standard: admin123)
          </p>
        </div>
      </div>
    )
  }

  const filteredLeads = leads.filter(lead =>
    lead.email.toLowerCase().includes(search.toLowerCase()) ||
    lead.company?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    demo_sent: leads.filter(l => l.status === 'demo_sent').length,
    customer: leads.filter(l => l.status === 'customer').length,
  }

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    demo_sent: 'bg-purple-100 text-purple-800',
    customer: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lead Management Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem('admin_authenticated')
              setAuthenticated(false)
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-600 text-sm">Total Leads</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-blue-600 text-sm">New</div>
            <div className="text-3xl font-bold text-blue-600">{stats.new}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-yellow-600 text-sm">Contacted</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.contacted}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-purple-600 text-sm">Demo Sent</div>
            <div className="text-3xl font-bold text-purple-600">{stats.demo_sent}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-green-600 text-sm">Customer</div>
            <div className="text-3xl font-bold text-green-600">{stats.customer}</div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <span className="text-blue-900 font-semibold">{selectedIds.size} Einträge ausgewählt</span>
              <div className="flex gap-3">
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  className="px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Status wählen...</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="demo_sent">Demo Sent</option>
                  <option value="customer">Customer</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button
                  onClick={bulkUpdateStatus}
                  disabled={!bulkStatus || updating === -1}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  Aktualisieren
                </button>
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters & Export */}
        <div className="bg-white p-4 rounded-lg shadow mb-8">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by email or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="demo_sent">Demo Sent</option>
              <option value="customer">Customer</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={downloadCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              CSV Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No leads found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === leads.length && leads.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Company</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Use Case</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Notes</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(lead.id)}
                        onChange={() => toggleSelect(lead.id)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{lead.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.company || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.useCase || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        disabled={updating === lead.id}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[lead.status] || 'bg-gray-100 text-gray-800'} cursor-pointer disabled:opacity-50`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="demo_sent">Demo Sent</option>
                        <option value="customer">Customer</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {editingNotes === lead.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingNotesText}
                            onChange={(e) => setEditingNotesText(e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <button
                            onClick={() => updateNotes(lead.id, editingNotesText)}
                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingNotes(lead.id)
                            setEditingNotesText(lead.notes || '')
                          }}
                          className="text-gray-600 cursor-pointer hover:text-blue-600 text-sm max-w-xs truncate"
                        >
                          {lead.notes || 'Click to add notes...'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(lead.createdAt).toLocaleDateString('de-DE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
