"use client"

import React, { useEffect, useState } from "react";
import { useComment } from "../providers/admin/CommentProvider";
import { Trash2, Check, X, MessageSquare, AlertTriangle, Loader2 } from "lucide-react";
import { useTheme } from "@/src/hooks/useTheme";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type: 'approve' | 'reject' | 'delete';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message, type }) => {
  const { isDark } = useTheme();
  
  if (!isOpen) return null;

  const getColorClasses = () => {
    switch (type) {
      case 'approve':
        return 'bg-green-600 hover:bg-green-700';
      case 'reject':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'delete':
        return 'bg-red-600 hover:bg-red-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-700 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-md w-full`}>
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-full ${
              type === 'approve' ? (isDark ? 'bg-green-900/30' : 'bg-green-100') : 
              type === 'reject' ? (isDark ? 'bg-yellow-900/30' : 'bg-yellow-100') : 
              (isDark ? 'bg-red-900/30' : 'bg-red-100')
            }`}>
              <AlertTriangle className={`w-5 h-5 sm:w-6 sm:h-6 ${
                type === 'approve' ? 'text-green-600' : 
                type === 'reject' ? 'text-yellow-600' : 
                'text-red-600'
              }`} />
            </div>
            <h3 className={`text-base sm:text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              {title}
            </h3>
          </div>
          <p className={`text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            {message}
          </p>
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
            <button
              onClick={onClose}
              className={`px-4 py-2 text-sm sm:text-base rounded-lg transition-colors ${
                isDark 
                  ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Annuler
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 text-sm sm:text-base text-white rounded-lg transition-colors ${getColorClasses()}`}
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CommentScreen = () => {
  const { comments, approveComment, rejectComment, deleteComment, isLoading, getAllComments } = useComment();
  const { isDark } = useTheme();
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject' | 'delete';
    commentId: string;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'approve',
    commentId: '',
    title: '',
    message: ''
  });

  useEffect(() => {
    getAllComments();
  }, []);

  const toggleExpand = (commentId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleApprove = (commentId: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'approve',
      commentId,
      title: 'Approuver le commentaire',
      message: 'Êtes-vous sûr de vouloir approuver ce commentaire ? Il sera visible publiquement.'
    });
  };

  const handleReject = (commentId: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'reject',
      commentId,
      title: 'Rejeter le commentaire',
      message: 'Êtes-vous sûr de vouloir rejeter ce commentaire ? Il ne sera pas visible publiquement.'
    });
  };

  const handleDelete = (commentId: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'delete',
      commentId,
      title: 'Supprimer le commentaire',
      message: 'Êtes-vous sûr de vouloir supprimer définitivement ce commentaire ? Cette action est irréversible.'
    });
  };

  const executeAction = async () => {
    const { type, commentId } = confirmModal;
    
    try {
      switch (type) {
        case 'approve':
          await approveComment(commentId);
          break;
        case 'reject':
          await rejectComment(commentId);
          break;
        case 'delete':
          await deleteComment(commentId);
          break;
      }
      await getAllComments();
    } catch (error) {
      console.error(`Erreur lors de l'action ${type}:`, error);
    }
  };

  const countReplies = (comment: any): number => {
    if (!comment.replies || comment.replies.length === 0) return 0;
    return comment.replies.reduce((total: number, reply: any) => {
      return total + 1 + countReplies(reply);
    }, 0);
  };

  const renderComment = (comment: any, level: number = 0) => {
    const isExpanded = expandedComments.has(comment.id);
    const replyCount = countReplies(comment);

    return (
      <React.Fragment key={comment.id}>
        {/* Vue Desktop (tableau) */}
        <tr className={`border-b hidden lg:table-row ${
          isDark 
            ? `hover:bg-gray-700 ${level > 0 ? 'bg-gray-800' : 'bg-gray-900'}` 
            : `hover:bg-gray-50 ${level > 0 ? 'bg-gray-50' : ''}`
        }`}>
          <td className="px-6 py-4">
            <div style={{ marginLeft: `${level * 24}px` }} className="flex items-start gap-2">
              {replyCount > 0 && (
                <button
                  onClick={() => toggleExpand(comment.id)}
                  className={`mt-1 ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {isExpanded ? '▼' : '▶'}
                </button>
              )}
              <div className="flex-1">
                <p className={`text-sm ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {comment.content}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {comment.user?.username || "Anonyme"}
                  </span>
                  {replyCount > 0 && (
                    <span className={`text-xs flex items-center gap-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      <MessageSquare size={12} />
                      {replyCount} réponse{replyCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </td>
          <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {comment.blog?.title || comment.article?.title || "N/A"}
          </td>
          <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {new Date(comment.createdAt).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </td>
          <td className="px-6 py-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              comment.isApproved 
                ? (isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800')
                : (isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800')
            }`}>
              {comment.isApproved ? 'Approuvé' : 'En attente'}
            </span>
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-2">
              {!comment.isApproved ? (
                <button
                  onClick={() => handleApprove(comment.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark 
                      ? 'text-green-400 hover:bg-green-900/30' 
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                  title="Approuver"
                >
                  <Check size={18} />
                </button>
              ) : (
                <button
                  onClick={() => handleReject(comment.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark 
                      ? 'text-yellow-400 hover:bg-yellow-900/30' 
                      : 'text-yellow-600 hover:bg-yellow-50'
                  }`}
                  title="Rejeter"
                >
                  <X size={18} />
                </button>
              )}
              <button
                onClick={() => handleDelete(comment.id)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-red-400 hover:bg-red-900/30' 
                    : 'text-red-600 hover:bg-red-50'
                }`}
                title="Supprimer"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </td>
        </tr>

        {/* Vue Mobile (cartes) */}
        <div className={`lg:hidden p-4 border-b ${
          isDark 
            ? `${level > 0 ? 'bg-gray-800 border-gray-700' : 'bg-gray-900 border-gray-700'}` 
            : `${level > 0 ? 'bg-gray-50 border-gray-200' : 'border-gray-200'}`
        }`} style={{ marginLeft: `${level * 16}px` }}>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              {replyCount > 0 && (
                <button
                  onClick={() => toggleExpand(comment.id)}
                  className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  {isExpanded ? '▼' : '▶'}
                </button>
              )}
              <div className="flex-1">
                <p className={`text-sm ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {comment.content}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {comment.user?.username || "Anonyme"}
                  </span>
                  {replyCount > 0 && (
                    <span className={`text-xs flex items-center gap-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      <MessageSquare size={12} />
                      {replyCount}
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    comment.isApproved 
                      ? (isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800')
                      : (isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800')
                  }`}>
                    {comment.isApproved ? 'Approuvé' : 'En attente'}
                  </span>
                </div>
              </div>
            </div>

            <div className={`text-xs space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <div>
                <span className="font-medium">Article: </span>
                {comment.blog?.title || comment.article?.title || "N/A"}
              </div>
              <div>
                {new Date(comment.createdAt).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              {!comment.isApproved ? (
                <button
                  onClick={() => handleApprove(comment.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    isDark 
                      ? 'text-green-400 bg-green-900/30 hover:bg-green-900/50' 
                      : 'text-green-600 bg-green-50 hover:bg-green-100'
                  }`}
                >
                  <Check size={16} />
                  Approuver
                </button>
              ) : (
                <button
                  onClick={() => handleReject(comment.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    isDark 
                      ? 'text-yellow-400 bg-yellow-900/30 hover:bg-yellow-900/50' 
                      : 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                  }`}
                >
                  <X size={16} />
                  Rejeter
                </button>
              )}
              <button
                onClick={() => handleDelete(comment.id)}
                className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  isDark 
                    ? 'text-red-400 bg-red-900/30 hover:bg-red-900/50' 
                    : 'text-red-600 bg-red-50 hover:bg-red-100'
                }`}
              >
                <Trash2 size={16} />
                Supprimer
              </button>
            </div>
          </div>
        </div>

        {isExpanded && comment.replies && comment.replies.map((reply: any) => 
          renderComment(reply, level + 1)
        )}
      </React.Fragment>
    );
  };

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-gray-900" : "bg-slate-50"
        }`}
      >
        <Loader2
          className={`w-8 h-8 animate-spin ${
            isDark ? "text-indigo-400" : "text-indigo-600"
          }`}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 p-8 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-slate-50 to-indigo-50"
      }`}>
      <div className="mb-4 sm:mb-6">
        <h1 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          Gestion des commentaires
        </h1>
        <p className={`text-sm sm:text-base mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {comments?.length || 0} commentaire{(comments?.length || 0) > 1 ? 's' : ''} principal{(comments?.length || 0) > 1 ? 'aux' : ''}
        </p>
      </div>

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
        {/* Vue Desktop - Tableau */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={isDark ? 'bg-gray-900' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Commentaire
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Article/Blog
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Date
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Statut
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {comments && comments.length > 0 ? (
                comments.map(comment => renderComment(comment))
              ) : (
                <tr>
                  <td colSpan={5} className={`px-6 py-12 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Aucun commentaire à afficher
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Vue Mobile - Cartes */}
        <div className="lg:hidden">
          {comments && comments.length > 0 ? (
            comments.map(comment => renderComment(comment))
          ) : (
            <div className={`px-6 py-12 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Aucun commentaire à afficher
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={executeAction}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />
    </div>
  );
};

export default CommentScreen;