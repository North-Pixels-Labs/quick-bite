'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, CheckCircle, XCircle, Clock, Loader2, Camera, X } from 'lucide-react'
import { useRiderDocuments, useUploadRiderDocument } from '@/hooks/useRiderQueries'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'

const documentTypes = [
    { id: 'id_card', label: 'National ID Card', required: true },
    { id: 'drivers_license', label: 'Driver\'s License', required: true },
    { id: 'vehicle_registration', label: 'Vehicle Registration', required: true },
    { id: 'vehicle_insurance', label: 'Vehicle Insurance', required: true },
    { id: 'background_check', label: 'Background Check', required: false },
    { id: 'medical_certificate', label: 'Medical Certificate', required: false },
]

const getDocumentStatus = (document: any) => {
    if (document.status === 'approved') return { status: 'approved', color: 'text-green-400', bg: 'bg-green-500/20', icon: CheckCircle }
    if (document.status === 'rejected') return { status: 'rejected', color: 'text-red-400', bg: 'bg-red-500/20', icon: XCircle }
    return { status: 'pending', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: Clock }
}

const getDocumentTypeLabel = (type: string) => {
    const docType = documentTypes.find(dt => dt.id === type)
    return docType ? docType.label : type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
}

export default function RiderDocumentsPage() {
    const { data: documents, isLoading, error } = useRiderDocuments()
    const uploadDocument = useUploadRiderDocument()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [uploadModal, setUploadModal] = useState<{
        isOpen: boolean
        documentType: string
        file: File | null
        preview: string | null
    }>({ isOpen: false, documentType: '', file: null, preview: null })

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setUploadModal(prev => ({
                    ...prev,
                    file,
                    preview: e.target?.result as string
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleUpload = async () => {
        if (!uploadModal.file || !uploadModal.documentType) return

        const formData = new FormData()
        formData.append('document_type', uploadModal.documentType)
        formData.append('file', uploadModal.file)

        try {
            await uploadDocument.mutateAsync(formData)
            setUploadModal({ isOpen: false, documentType: '', file: null, preview: null })
        } catch (error) {
            console.error('Failed to upload document:', error)
        }
    }

    const getUploadedDocument = (type: string) => {
        return documents?.find((doc: any) => doc.document_type === type)
    }

    const getRequiredDocumentsCount = () => {
        const required = documentTypes.filter(dt => dt.required).length
        const uploaded = documentTypes.filter(dt => dt.required && getUploadedDocument(dt.id)).length
        return { uploaded, required }
    }

    // Create skeleton loading layout
    const DocumentSkeleton = () => (
        <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-lg" />
            </div>
        </div>
    )

    if (isLoading) {
        return (
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Verification Documents</h1>
                        <p className="text-gray-400">Upload and manage your verification documents</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-gray-400">Required Documents</p>
                            <Skeleton className="h-6 w-12" />
                        </div>
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                </div>

                {/* Document Types Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <DocumentSkeleton />
                        </motion.div>
                    ))}
                </div>
            </div>
        )
    }

    // Improved error handling with user-friendly messages
    if (error) {
        let errorMessage = 'Failed to load documents'
        let errorDescription = 'Please try again later'

        // Try to parse the error response
        try {
            const errorData = JSON.parse(error.message || error.toString())
            if (errorData?.error) {
                const backendError = errorData.error.toLowerCase()
                if (backendError.includes('record not found') || backendError.includes('no documents')) {
                    errorMessage = 'No documents found'
                    errorDescription = 'You haven\'t uploaded any verification documents yet'
                } else if (backendError.includes('unauthorized') || backendError.includes('forbidden')) {
                    errorMessage = 'Access denied'
                    errorDescription = 'You don\'t have permission to view documents'
                } else if (backendError.includes('network') || backendError.includes('connection')) {
                    errorMessage = 'Connection error'
                    errorDescription = 'Please check your internet connection'
                }
            }
        } catch (e) {
            // If parsing fails, use default messages
        }

        return (
            <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">{errorMessage}</h3>
                <p className="text-gray-400">{errorDescription}</p>
            </div>
        )
    }

    const { uploaded, required } = getRequiredDocumentsCount()

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Verification Documents</h1>
                    <p className="text-gray-400">Upload and manage your verification documents</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm text-gray-400">Required Documents</p>
                        <p className="text-lg font-bold text-white">{uploaded}/{required} uploaded</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        uploaded === required
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                        {uploaded === required ? 'Complete' : 'Incomplete'}
                    </div>
                </div>
            </div>

            {/* Document Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documentTypes.map((docType, index) => {
                    const uploadedDoc = getUploadedDocument(docType.id)
                    const status = uploadedDoc ? getDocumentStatus(uploadedDoc) : null

                    return (
                        <motion.div
                            key={docType.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium">{docType.label}</h3>
                                        {docType.required && (
                                            <span className="text-xs text-red-400">Required</span>
                                        )}
                                    </div>
                                </div>
                                {status && (
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${status.bg}`}>
                                        <status.icon className={`w-3 h-3 ${status.color}`} />
                                        <span className={status.color}>{status.status}</span>
                                    </div>
                                )}
                            </div>

                            {uploadedDoc ? (
                                <div className="space-y-3">
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <p className="text-sm text-gray-300 truncate">
                                            {uploadedDoc.filename || 'Document uploaded'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Uploaded {format(new Date(uploadedDoc.created_at), 'MMM d, yyyy')}
                                        </p>
                                    </div>
                                    {uploadedDoc.status === 'rejected' && uploadedDoc.rejection_reason && (
                                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                            <p className="text-sm text-red-400">
                                                <strong>Rejection Reason:</strong> {uploadedDoc.rejection_reason}
                                            </p>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => setUploadModal({
                                            isOpen: true,
                                            documentType: docType.id,
                                            file: null,
                                            preview: null
                                        })}
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                                    >
                                        Replace Document
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setUploadModal({
                                        isOpen: true,
                                        documentType: docType.id,
                                        file: null,
                                        preview: null
                                    })}
                                    className="w-full bg-white/5 hover:bg-white/10 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Upload className="w-4 h-4" />
                                    Upload Document
                                </button>
                            )}
                        </motion.div>
                    )
                })}
            </div>

            {/* Upload Modal */}
            {uploadModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white">
                                Upload {getDocumentTypeLabel(uploadModal.documentType)}
                            </h3>
                            <button
                                onClick={() => setUploadModal({ isOpen: false, documentType: '', file: null, preview: null })}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="text-center">
                                {uploadModal.preview ? (
                                    <div className="relative">
                                        <img
                                            src={uploadModal.preview}
                                            alt="Document preview"
                                            className="w-full h-48 object-cover rounded-lg border border-white/10"
                                        />
                                        <button
                                            onClick={() => setUploadModal(prev => ({ ...prev, file: null, preview: null }))}
                                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full h-48 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-white/40 transition-colors"
                                    >
                                        <Camera className="w-12 h-12 text-gray-400 mb-2" />
                                        <p className="text-gray-400 text-sm">Click to select or take photo</p>
                                        <p className="text-gray-500 text-xs mt-1">JPG, PNG, PDF up to 10MB</p>
                                    </div>
                                )}
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setUploadModal({ isOpen: false, documentType: '', file: null, preview: null })}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={!uploadModal.file || uploadDocument.isPending}
                                    className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    {uploadDocument.isPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Upload className="w-4 h-4" />
                                    )}
                                    Upload
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
