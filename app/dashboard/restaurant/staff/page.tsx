'use client'

import React, { useState } from 'react'
import { useRestaurants } from '@/hooks/useRestaurantQueries'
import { useStaff, useCreateStaff, useUpdateStaff, useDeleteStaff } from '@/hooks/useStaffQueries'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export default function StaffPage() {
    const { data: restaurants, isLoading: loadingRestaurants } = useRestaurants()
    const restaurantId = restaurants?.[0]?.id || ''
    const { data: staff, isLoading: loadingStaff, refetch } = useStaff(restaurantId)
    const createStaff = useCreateStaff()
    const updateStaff = useUpdateStaff()
    const deleteStaff = useDeleteStaff()
    const [showAdd, setShowAdd] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)
    const [form, setForm] = useState({ user_id: '', role: 'manager', permissions: '' })
    const [newEmail, setNewEmail] = useState('')
    const [newPhone, setNewPhone] = useState('')
    const [newFirstName, setNewFirstName] = useState('')
    const [newLastName, setNewLastName] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [permOrders, setPermOrders] = useState(true)
    const [permMenu, setPermMenu] = useState(false)
    const [permZones, setPermZones] = useState(false)

    const isLoading = loadingRestaurants || loadingStaff

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (editId) {
            await updateStaff.mutateAsync({ restaurantId, staffId: editId, data: { role: form.role, permissions: form.permissions || undefined, is_active: true } })
            setEditId(null)
        } else {
            if (form.user_id) {
                const permsJson = JSON.stringify({ orders: permOrders, menu: permMenu, zones: permZones })
                await createStaff.mutateAsync({ restaurantId, data: { user_id: form.user_id, role: form.role, permissions: permsJson } as any })
            } else {
                const permissions = [] as string[]
                if (permOrders) permissions.push('orders')
                if (permMenu) permissions.push('menu')
                if (permZones) permissions.push('zones')
                const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/restaurants/${restaurantId}/staff/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token') || ''}` },
                    body: JSON.stringify({ email: newEmail, phone: newPhone, password: newPassword || undefined, first_name: newFirstName, last_name: newLastName, role: form.role, permissions }),
                })
                if (!resp.ok) {
                    throw new Error(await resp.text())
                }
            }
            setShowAdd(false)
        }
        setForm({ user_id: '', role: 'manager', permissions: '' })
        setNewEmail(''); setNewPhone(''); setNewFirstName(''); setNewLastName(''); setNewPassword('')
        setPermOrders(true); setPermMenu(false); setPermZones(false)
        refetch()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Staff Management</h1>
                    <p className="text-gray-400">Create, update, and remove your restaurant staff</p>
                </div>
                <button onClick={() => { setShowAdd(true); setEditId(null) }} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded text-white">Add Staff</button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center min-h-[200px]"><LoadingSpinner size="lg" /></div>
            ) : !staff?.length ? (
                <div className="p-8 bg-[#1A1A1A] border border-white/5 rounded-2xl text-center">
                    <p className="text-gray-400">No staff yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="text-gray-400">
                                <th className="py-2">User ID</th>
                                <th className="py-2">Role</th>
                                <th className="py-2">Active</th>
                                <th className="py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.map((s: any) => (
                                <tr key={s.id} className="border-t border-white/10">
                                    <td className="py-2 text-gray-300">{s.user_id}</td>
                                    <td className="py-2 text-white">{s.role}</td>
                                    <td className="py-2">{s.is_active ? <span className="text-green-400">Active</span> : <span className="text-red-400">Inactive</span>}</td>
                                    <td className="py-2">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => { setEditId(s.id); setForm({ user_id: s.user_id, role: s.role, permissions: s.permissions || '' }) }} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-white">Edit</button>
                                            <button onClick={async () => { await deleteStaff.mutateAsync({ restaurantId, staffId: s.id }); refetch() }} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded text-red-400">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {(showAdd || editId) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <form onSubmit={onSubmit} className="w-full max-w-md bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">{editId ? 'Edit Staff' : 'Add Staff'}</h3>
                            <button type="button" onClick={() => { setShowAdd(false); setEditId(null) }} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-white">Close</button>
                        </div>
                        {!editId && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Link Existing User (UUID)</label>
                                    <input value={form.user_id} onChange={(e)=> setForm({ ...form, user_id: e.target.value })} placeholder="Paste existing user UUID (optional)" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white" />
                                    <p className="text-xs text-gray-500 mt-1">Leave empty to create a new staff user.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-2">Email *</label>
                                        <input value={newEmail} onChange={(e)=> setNewEmail(e.target.value)} placeholder="staff@example.com" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-2">Phone *</label>
                                        <input value={newPhone} onChange={(e)=> setNewPhone(e.target.value)} placeholder="233XXXXXXXXX" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-2">First Name *</label>
                                        <input value={newFirstName} onChange={(e)=> setNewFirstName(e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-2">Last Name *</label>
                                        <input value={newLastName} onChange={(e)=> setNewLastName(e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-gray-300 mb-2">Password (optional)</label>
                                        <input type="password" value={newPassword} onChange={(e)=> setNewPassword(e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white" />
                                        <p className="text-xs text-gray-500 mt-1">If omitted, staff can use OTP login to access and set a password later.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Role *</label>
                            <select value={form.role} onChange={(e)=> setForm({ ...form, role: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white">
                                <option value="manager" className="bg-[#1A1A1A]">Manager</option>
                                <option value="staff" className="bg-[#1A1A1A]">Staff</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm text-gray-300">Permissions</label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-gray-300"><input type="checkbox" checked={permOrders} onChange={(e)=> setPermOrders(e.target.checked)} /> Orders</label>
                                <label className="flex items-center gap-2 text-gray-300"><input type="checkbox" checked={permMenu} onChange={(e)=> setPermMenu(e.target.checked)} /> Menu</label>
                                <label className="flex items-center gap-2 text-gray-300"><input type="checkbox" checked={permZones} onChange={(e)=> setPermZones(e.target.checked)} /> Zones</label>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button type="button" onClick={() => { setShowAdd(false); setEditId(null) }} className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded text-white">Cancel</button>
                            <button type="submit" className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded text-white">{editId ? 'Save' : 'Create'}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
