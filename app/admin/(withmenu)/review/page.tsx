"use client";

import { useAdminReview } from '@/components/providers/admin/AdminReviewProvider';
import React, { useState } from 'react';
import { ReviewStatus } from '@/src/domain/entities/review';

// Composant pour la popup de confirmation
const ConfirmationPopup = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  type = "warning" 
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'success';
}) => {
  if (!isOpen) return null;

  const getButtonColor = () => {
    switch (type) {
      case 'danger': return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'success': return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
      default: return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 transform transition-all">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 mt-2">{message}</p>
        </div>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonColor()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const ReviewPage = () => {
  const { state, actions } = useAdminReview();
  const [filterStatus, setFilterStatus] = useState<ReviewStatus | 'ALL'>('ALL');
  
  // États pour la popup de confirmation
  const [confirmationPopup, setConfirmationPopup] = useState<{
    isOpen: boolean;
    action: 'approve' | 'reject' | 'delete' | null;
    reviewId: string | null;
    reviewTitle?: string;
  }>({
    isOpen: false,
    action: null,
    reviewId: null,
  });

  // Ouvrir la popup de confirmation
  const openConfirmation = (action: 'approve' | 'reject' | 'delete', reviewId: string, reviewTitle?: string) => {
    setConfirmationPopup({
      isOpen: true,
      action,
      reviewId,
      reviewTitle,
    });
  };

  // Fermer la popup
  const closeConfirmation = () => {
    setConfirmationPopup({
      isOpen: false,
      action: null,
      reviewId: null,
    });
  };

  // Confirmer l'action
  const confirmAction = async () => {
    if (!confirmationPopup.reviewId || !confirmationPopup.action) return;

    try {
      switch (confirmationPopup.action) {
        case 'approve':
          await actions.updateReviewStatus(confirmationPopup.reviewId, 'approved');
          break;
        case 'reject':
          await actions.updateReviewStatus(confirmationPopup.reviewId, 'rejected');
          break;
        case 'delete':
          await actions.deleteReview(confirmationPopup.reviewId);
          break;
      }
    } catch (error) {
      console.error('Erreur lors de l\'action:', error);
    } finally {
      closeConfirmation();
    }
  };

  // Configuration des messages de confirmation
  const getConfirmationConfig = () => {
    const { action, reviewTitle } = confirmationPopup;
    
    const configs = {
      approve: {
        title: "Approuver la review",
        message: `Êtes-vous sûr de vouloir approuver la review "${reviewTitle || 'cet avis'}" ?`,
        confirmText: "Approuver",
        type: "success" as const
      },
      reject: {
        title: "Rejeter la review",
        message: `Êtes-vous sûr de vouloir rejeter la review "${reviewTitle || 'cet avis'}" ?`,
        confirmText: "Rejeter",
        type: "warning" as const
      },
      delete: {
        title: "Supprimer la review",
        message: `Êtes-vous sûr de vouloir supprimer définitivement la review "${reviewTitle || 'cet avis'}" ? Cette action est irréversible.`,
        confirmText: "Supprimer",
        type: "danger" as const
      }
    };

    return configs[action!] || configs.delete;
  };

  const filteredReviews = filterStatus === 'ALL' 
    ? state.reviews 
    : state.reviews.filter(review => review.status === filterStatus);

  const getStatusBadge = (status: ReviewStatus) => {
    const statusConfig = {
      'pending': { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
      'approved': { label: 'Approuvé', className: 'bg-green-100 text-green-800' },
      'rejected': { label: 'Rejeté', className: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const renderStars = (note: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= note ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement des reviews...</p>
        </div>
      </div>
    );
  }

  const confirmationConfig = confirmationPopup.action ? getConfirmationConfig() : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Popup de confirmation */}
      {confirmationConfig && (
        <ConfirmationPopup
          isOpen={confirmationPopup.isOpen}
          onClose={closeConfirmation}
          onConfirm={confirmAction}
          title={confirmationConfig.title}
          message={confirmationConfig.message}
          confirmText={confirmationConfig.confirmText}
          type={confirmationConfig.type}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Reviews</h1>
          <p className="text-gray-600">Approuvez ou rejetez les avis clients</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{state.reviews.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">En attente</p>
            <p className="text-2xl font-bold text-yellow-600">
              {state.reviews.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Approuvés</p>
            <p className="text-2xl font-bold text-green-600">
              {state.reviews.filter(r => r.status === 'approved').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Rejetés</p>
            <p className="text-2xl font-bold text-red-600">
              {state.reviews.filter(r => r.status === 'rejected').length}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par statut</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ReviewStatus | 'ALL')}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvés</option>
            <option value="rejected">Rejetés</option>
          </select>
        </div>

        {/* Error Message */}
        {state.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {state.error}
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500">Aucune review à afficher</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {renderStars(review.note)}
                          {getStatusBadge(review.status)}
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">{review.titre}</h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {review.user?.username || 'Utilisateur inconnu'} • {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-gray-700 whitespace-pre-wrap" dangerouslySetInnerHTML={{
                      __html: review.description,
                    }}/>
                    <div className="mt-3 flex gap-4 text-xs text-gray-500">
                      {review.updatedAt && new Date(review.updatedAt).getTime() !== new Date(review.createdAt).getTime() && (
                        <span>Mis à jour le {new Date(review.updatedAt).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex md:flex-col gap-2">
                    {review.status !== 'approved' && (
                      <button
                        onClick={() => openConfirmation('approve', review.id, review.titre)}
                        disabled={state.loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 whitespace-nowrap"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Approuver
                      </button>
                    )}
                    {review.status !== 'rejected' && (
                      <button
                        onClick={() => openConfirmation('reject', review.id, review.titre)}
                        disabled={state.loading}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 whitespace-nowrap"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Rejeter
                      </button>
                    )}
                    {/* <button
                      onClick={() => openConfirmation('delete', review.id, review.titre)}
                      disabled={state.loading}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Supprimer
                    </button> */}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;