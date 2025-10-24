"use client";

import { usePrivacy } from '@/components/providers/admin/PrivacyProvider';
import React, { useState, useMemo, useEffect } from 'react';
import { Save, Globe, FileText, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { useCgu } from '@/components/providers/admin/CguProvider';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const AddCgu = () => {
  const router = useRouter();
  const { 
    createCGU, 
    loading, 
    formData, 
    handleMultilingualChange,
    getCGU,
    updateCGU
  } = useCgu();


  const searchParams = useSearchParams();
  const isEdit = searchParams.get("isEdit") === "true";
  const id = searchParams.get("id");

  const [activeTab, setActiveTab] = useState<'FR' | 'EN'>('FR');
  const [isDark, setIsDark] = useState(false);

  useEffect(()=>{
    if(id){
        getCGU(id)
    }
  },[id])

  // Detect dark mode
  React.useEffect(() => {
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Quill modules configuration
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }, { size: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['link', 'blockquote', 'code-block'],
      ['clean'],
    ],
  }), []);

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'list',
    'bullet',
    'indent',
    'align',
    'link',
    'blockquote',
    'code-block',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(isEdit && id){
        await updateCGU(id)
    }else{
        await createCGU();
    }
  };

  const handleCancel = () => {
    router.push('/admin/privacy-policy');
  };

  const handleEditorChangeFR = (value: string) => {
    handleMultilingualChange('content', 'FR', value);
  };

  const handleEditorChangeEN = (value: string) => {
    handleMultilingualChange('content', 'EN', value);
  };

  const getTextLength = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent?.length || 0;
  };

  return (
    <div className={`min-h-screen py-8 px-4 ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className={`flex items-center gap-2 mb-4 transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retour</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Nouveau CGU
              </h1>
              <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                Créez un CGU multilingue avec un éditeur riche
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className={`rounded-2xl shadow-xl overflow-hidden ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
          {/* Language Tabs */}
          <div className={`px-6 py-4 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-r from-slate-800 to-slate-900'}`}>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-slate-300" />
              <span className="text-sm font-medium text-slate-300 mr-4">Langue</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('FR')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === 'FR'
                      ? 'bg-white text-slate-900 shadow-lg'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  🇫🇷 Français
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('EN')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === 'EN'
                      ? 'bg-white text-slate-900 shadow-lg'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {/* French Content */}
            {activeTab === 'FR' && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>
                    Contenu en Français
                  </label>
                  <div className={`relative privacy-editor-wrapper ${isDark ? 'dark-mode' : ''}`}>
                    <ReactQuill
                      value={formData.content.FR || ''}
                      onChange={handleEditorChangeFR}
                      modules={modules}
                      formats={formats}
                      className={`rounded-xl border-2 transition-colors ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-slate-200'}`}
                      placeholder="Rédigez votre CGU en français..."
                      theme="snow"
                    />
                    <div className={`mt-2 text-xs text-right ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                      {getTextLength(formData.content.FR || '')} caractères
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* English Content */}
            {activeTab === 'EN' && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>
                    Content in English
                  </label>
                  <div className={`relative privacy-editor-wrapper ${isDark ? 'dark-mode' : ''}`}>
                    <ReactQuill
                      value={formData.content.EN || ''}
                      onChange={handleEditorChangeEN}
                      modules={modules}
                      formats={formats}
                      className={`rounded-xl border-2 transition-colors ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-slate-200'}`}
                      placeholder="Write your CGU in English..."
                      theme="snow"
                    />
                    <div className={`mt-2 text-xs text-right ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                      {getTextLength(formData.content.EN || '')} characters
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Help Text */}
            <div className={`mt-6 p-4 border rounded-xl ${isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
              <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                <strong>💡 Conseil :</strong> Utilisez l'éditeur riche pour formater votre contenu avec des titres, listes, liens et mise en forme. Assurez-vous de remplir le contenu dans les deux langues.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`px-8 py-6 flex items-center justify-between border-t ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-slate-50 border-slate-200'}`}>
            <button
              type="button"
              onClick={handleCancel}
              className={`px-6 py-3 font-semibold rounded-xl transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-slate-700 hover:bg-slate-200'}`}
              disabled={loading}
            >
              Annuler
            </button>
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !formData.content.FR || !formData.content.EN}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Création en cours...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{isEdit ? "Mise a jour" : "Créer un CGU" }</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview Card */}
        <div className={`mt-6 rounded-2xl shadow-lg p-6 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
          <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <FileText className="w-5 h-5 text-blue-600" />
            Aperçu rapide
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className={`text-xs font-semibold uppercase mb-2 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Français</p>
              <div className={`h-40 overflow-y-auto rounded-lg p-3 text-sm border ${isDark ? 'bg-gray-900 text-gray-300 border-gray-700' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                <div dangerouslySetInnerHTML={{ __html: formData.content.FR || `<span class="${isDark ? 'text-gray-500' : 'text-slate-400'} italic">Aucun contenu</span>` }} />
              </div>
            </div>
            <div>
              <p className={`text-xs font-semibold uppercase mb-2 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>English</p>
              <div className={`h-40 overflow-y-auto rounded-lg p-3 text-sm border ${isDark ? 'bg-gray-900 text-gray-300 border-gray-700' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                <div dangerouslySetInnerHTML={{ __html: formData.content.EN || `<span class="${isDark ? 'text-gray-500' : 'text-slate-400'} italic">No content</span>` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        /* Light Mode Styles */
        .privacy-editor-wrapper .quill {
          border-radius: 0.75rem;
        }

        .privacy-editor-wrapper .ql-toolbar {
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
          background: #f8fafc;
          border: none;
          border-bottom: 2px solid #e2e8f0;
        }

        .privacy-editor-wrapper .ql-container {
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          border: none;
          font-size: 15px;
          min-height: 400px;
          background: white;
        }

        .privacy-editor-wrapper .ql-editor {
          min-height: 400px;
          padding: 20px;
          color: #1e293b;
        }

        .privacy-editor-wrapper .ql-editor.ql-blank::before {
          color: #94a3b8;
          font-style: italic;
        }

        .privacy-editor-wrapper .ql-stroke {
          stroke: #475569;
        }

        .privacy-editor-wrapper .ql-fill {
          fill: #475569;
        }

        .privacy-editor-wrapper .ql-picker-label {
          color: #475569;
        }

        /* Dark Mode Styles */
        .privacy-editor-wrapper.dark-mode .ql-toolbar {
          background: #1f2937;
          border-bottom: 2px solid #374151;
        }

        .privacy-editor-wrapper.dark-mode .ql-container {
          background: #374151;
        }

        .privacy-editor-wrapper.dark-mode .ql-editor {
          color: #e5e7eb;
        }

        .privacy-editor-wrapper.dark-mode .ql-editor.ql-blank::before {
          color: #6b7280;
        }

        .privacy-editor-wrapper.dark-mode .ql-stroke {
          stroke: #d1d5db;
        }

        .privacy-editor-wrapper.dark-mode .ql-fill {
          fill: #d1d5db;
        }

        .privacy-editor-wrapper.dark-mode .ql-picker-label {
          color: #d1d5db;
        }

        .privacy-editor-wrapper.dark-mode .ql-picker-options {
          background: #1f2937;
          border-color: #374151;
        }

        .privacy-editor-wrapper.dark-mode .ql-picker-item {
          color: #d1d5db;
        }

        .privacy-editor-wrapper.dark-mode .ql-picker-item:hover {
          background: #374151;
        }

        .privacy-editor-wrapper.dark-mode button:hover,
        .privacy-editor-wrapper.dark-mode button:focus {
          background: #374151;
        }

        .privacy-editor-wrapper.dark-mode .ql-active {
          color: #60a5fa !important;
        }

        .privacy-editor-wrapper.dark-mode .ql-active .ql-stroke {
          stroke: #60a5fa !important;
        }

        .privacy-editor-wrapper.dark-mode .ql-active .ql-fill {
          fill: #60a5fa !important;
        }
      `}</style>
    </div>
  );
};

export default AddCgu;