'use client'

import { useEffect, useState } from 'react'
import { PrismaClient } from '@prisma/client'

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
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<number | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [filter])

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Lead Management Dashboard</h1>

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

        {/* Filters */}
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
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Company</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Use Case</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{lead.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.company || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.useCase || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[lead.status] || 'bg-gray-100 text-gray-800'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(lead.createdAt).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        disabled={updating === lead.id}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="demo_sent">Demo Sent</option>
                        <option value="customer">Customer</option>
                        <option value="rejected">Rejected</option>
                      </select>
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
