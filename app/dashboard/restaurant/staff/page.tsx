'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
    Plus, 
    Search, 
    Users, 
    Crown, 
    User, 
    ChefHat, 
    MoreHorizontal,
    Edit,
    Trash2,
    UserCheck,
    UserX,
    Loader2,
    Mail,
    Phone,
    Shield,
    Eye,
    EyeOff,
    X
} from 'lucide-react'
import { useRestaurants } from '@/hooks/useRestaurantQueries'
import { useStaff, useRegisterStaff, useUpdateStaff, useDeleteStaff } from '@/hooks/useStaffQueries'
import { RestaurantStaff, RegisterStaffRequest, STAFF_PERMISSIONS, STAFF_ROLES } from '@/types/restaurant.types'
import { format } from 'date-fns'

const roleConfig = {
    manager: { icon: Crown, color: 'text-purple-400', bg: 'bg-purple-500/20', label: 'Manager' },
    staff: { icon: User, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Staff' },
    kitchen_staff: { icon: ChefHat, color: 'text-orange-400', bg: 'bg-orange-500/20', label: 'Kitchen Staff' },
}

interface AddStaffModalProps {
    restaurantId: string
    onClose: () => void
}

function AddStaffModal({ restaurantId, onClose }: AddStaffModalProps) {
    const [formData, setFormData] = useState<RegisterStaffRequest>({
        email: '',
        phone: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'staff',
        permissions: []
    })
    const [showPassword, setShowPassword] = useState(false)
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

    const registerStaff = useRegisterStaff()

    // Update permissions when role changes
    React.useEffect(() => {
        const defaultPermissions = STAFF_PERMISSIONS
            .filter(perm => perm.defaultForRoles.includes(formData.role))
            .map(perm => perm.key)
        setSelectedPermissions(defaultPermissions)
        setFormData(prev => ({ ...prev, permissions: defaultPermissions }))
    }, [formData.role])

    const handlePermissionToggle = (permissionKey: string) => {
        const newPermissions = selectedPermissions.includes(permissionKey)
            ? selectedPermissions.filter(p => p !== permissionKey)
            : [...selectedPermissions, permissionKey]
        
        setSelectedPermissions(newPermissions)
        setFormData(prev => ({ ...prev, permissions: newPermissions }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Basic validation
        if (!formData.first_name.trim() || !formData.last_name.trim() || 
            !formData.email.trim() || !formData.phone.trim()) {
            alert('Please fill in all required fields')
            return
        }

        try {
            await registerStaff.mutateAsync({
                restaurantId,
                data: formData
            })
            onClose()
            // You might want to show a success toast here
        } catch (error: any) {
            console.error('Failed to register staff:', error)
            alert(error?.response?.data?.error || 'Failed to add staff member. Please try again.')
        }
    }

    const selectedRole = STAFF_ROLES.find(role => role.value === formData.role)

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Add New Staff Member</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Personal Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                                    placeholder="Enter first name"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                                    placeholder="Enter last name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <Mail className="w-4 h-4 inline mr-1" />
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-grayline-none focus:border-orange-500/50"
                                    placeholder="staff@example.com"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <Phone className="w-4 h-4 inline mr-1" />
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                                    placeholder="0241234567"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password (Optional)
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-3 py-2 pr-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                                    placeholder="Leave empty for system-generated password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                If no password is provided, a temporary password will be generated and sent via email
                            </p>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Role & Permissions
                        </h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Select Role *
                            </label>
                            <div className="grid grid-cols-1 gap-3">
                                {STAFF_ROLES.map((role) => {
                                    const RoleIcon = role.value === 'manager' ? Crown : 
                                                   role.value === 'kitchen_staff' ? ChefHat : User
                                    return (
                                        <label
                                            key={role.value}
                                            className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                                                formData.role === role.value
                                                    ? 'border-orange-500 bg-orange-500/10'
                                                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="role"
                                                value={role.value}
                                                checked={formData.role === role.value}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                                className="sr-only"
                                            />
                                            <RoleIcon className={`w-5 h-5 mr-3 ${
                                                formData.role === role.value ? 'text-orange-400' : 'text-gray-400'
                                            }`} />
                                            <div className="flex-1">
                                                <p className={`font-medium ${
                                                    formData.role === role.value ? 'text-white' : 'text-gray-300'
                                                }`}>
                                                    {role.label}
                                                </p>
                                                <p className="text-sm text-gray-400">{role.description}</p>
                                            </div>
                                        </label>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Permissions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Permissions
                            </label>
                            <div className="space-y-2">
                                {STAFF_PERMISSIONS.map((permission) => (
                                    <label
                                        key={permission.key}
                                        className="flex items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedPermissions.includes(permission.key)}
                                            onChange={() => handlePermissionToggle(permission.key)}
                                            className="w-4 h-4 text-orange-500 bg-white/5 border-white/10 rounded focus:ring-orange-500"
                                        />
                                        <div className="ml-3 flex-1">
                                            <p className="text-sm font-medium text-white">{permission.label}</p>
                                            <p className="text-xs text-gray-400">{permission.description}</p>
                                        </div>
                                        {permission.defaultForRoles.includes(formData.role) && (
                                            <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                                                Default
                                            </span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                        <button
                            type="submit"
                            disabled={registerStaff.isPending}
                            className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {registerStaff.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            <Plus className="w-4 h-4" />
                            Add Staff Member
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default function StaffPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)
    const [selectedStaff, setSelectedStaff] = useState<string | null>(null)

    // Fetch restaurants and get the first one
    const { data: restaurants, isLoading: loadingRestaurants } = useRestaurants()
    const restaurantId = restaurants?.[0]?.id

    // Fetch staff
    const { data: staff, isLoading: loadingStaff } = useStaff(restaurantId || '')
    const updateStaff = useUpdateStaff()
    const deleteStaff = useDeleteStaff()

    const isLoading = loadingRestaurants || loadingStaff

    // Filter staff by search query
    const filteredStaff = staff?.filter(member =>
        member.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

    const handleToggleActive = async (staffId: string, currentStatus: boolean) => {
        if (!restaurantId) return
        
        try {
            await updateStaff.mutateAsync({
                restaurantId,
                staffId,
                data: { is_active: !currentStatus }
            })
        } catch (error) {
            console.error('Failed to update staff status:', error)
        }
    }

    const handleDeleteStaff = async (staffId: string) => {
        if (!restaurantId) return
        
        if (confirm('Are you sure you want to remove this staff member? This action cannot be undone.')) {
            try {
                await deleteStaff.mutateAsync({
                    restaurantId,
                    staffId
                })
            } catch (error) {
                console.error('Failed to delete staff:', error)
            }
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        )
    }

    if (!restaurantId) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400">No restaurant found. Please create a restaurant first.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Staff Management</h1>
                    <p className="text-gray-400">Manage your restaurant staff and their permissions</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Staff
                </button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search staff members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                    />
                </div>
                <div className="text-sm text-gray-400">
                    {filteredStaff.length} staff members
                </div>
            </div>

            {/* Staff List */}
            {filteredStaff.length === 0 ? (
                <div className="text-center py-12 bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No staff members found</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                    >
                        Add First Staff Member
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStaff.map((member) => {
                        const roleInfo = roleConfig[member.role as keyof typeof roleConfig] || roleConfig.staff
                        const RoleIcon = roleInfo.icon

                        return (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-lg ${roleInfo.bg} flex items-center justify-center`}>
                                        <RoleIcon className={`w-6 h-6 ${roleInfo.color}`} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleActive(member.id, member.is_active)}
                                            disabled={updateStaff.isPending}
                                            className={`p-2 rounded-lg transition-colors ${
                                                member.is_active 
                                                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                                                    : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                            }`}
                                            title={member.is_active ? 'Deactivate staff' : 'Activate staff'}
                                        >
                                            {updateStaff.isPending ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : member.is_active ? (
                                                <UserCheck className="w-4 h-4" />
                                            ) : (
                                                <UserX className="w-4 h-4" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteStaff(member.id)}
                                            disabled={deleteStaff.isPending}
                                            className="p-2 rounded-lg transition-colors bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                            title="Remove staff member"
                                        >
                                            {deleteStaff.isPending ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Staff ID</p>
                                        <p className="text-sm font-mono text-white">{member.id.slice(0, 8)}...</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Role</p>
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${roleInfo.bg} ${roleInfo.color}`}>
                                            <RoleIcon className="w-3 h-3" />
                                            {roleInfo.label}
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Status</p>
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                                            member.is_active 
                                                ? 'bg-green-500/20 text-green-400' 
                                                : 'bg-red-500/20 text-red-400'
                                        }`}>
                                            {member.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Hired</p>
                                        <p className="text-sm text-white">
                                            {format(new Date(member.hired_at), 'MMM d, yyyy')}
                                        </p>
                                    </div>

                                    {member.permissions && member.permissions !== '{}' && (
                                        <div>
                                            <p className="text-xs text-gray-400 mb-1">Permissions</p>
                                            <div className="bg-white/5 rounded-lg p-2">
                                                <code className="text-xs text-gray-300 break-all">
                                                    {member.permissions}
                                                </code>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}

            {/* Add Staff Modal */}
            {showAddModal && (
                <AddStaffModal
                    restaurantId={restaurantId}
                    onClose={() => setShowAddModal(false)}
                />
            )}
        </div>
    )
}
