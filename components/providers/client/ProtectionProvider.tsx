// components/providers/ProtectionProvider.tsx
'use client'

import { useEffect } from 'react'

export function ProtectionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // === COMBINAISONS DÉTECTABLES ===
    
    const handleKeyDown = (e: any) => {
      // ✅ IMPRESSION - Ctrl+P (FONCTIONNE)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault()
        showTemporaryMessage('L\'impression est désactivée pour ce contenu')
        return false
      }

      // ✅ ENREGISTREMENT - Ctrl+S (FONCTIONNE)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        showTemporaryMessage('La sauvegarde est désactivée')
        return false
      }

      // ✅ DEVTOOLS - F12, Ctrl+Shift+I (FONCTIONNE)
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault()
        showTemporaryMessage('Les outils de développement sont désactivés')
        return false
      }

      // ✅ PRINTSCREEN - Seule ou combinée (DÉTECTION SEULEMENT)
      if (e.key === 'PrintScreen') {
        // On ne peut pas bloquer, mais on peut informer
        showTemporaryMessage('Les captures d\'écran sont surveillées')
        // Le screenshot sera pris quand même !
      }

      // ✅ COMBINAISONS COMPLEXES (DÉTECTION SEULEMENT)
      if (e.shiftKey && e.ctrlKey && !e.altKey && !e.metaKey) {
        // Détection générique de combinaisons Shift+Ctrl
        console.log('Combinaison Shift+Ctrl détectée')
      }
    }

    // === PROTECTIONS EFFICACES ===
    const handleContextMenu = (e: any) => e.preventDefault()
    const handleCopy = (e: any) => e.preventDefault()
    const handleSelectStart = (e: any) => e.preventDefault()
    const handleDragStart = (e: any) => e.preventDefault()

    const showTemporaryMessage = (message: string) => {
      const existingMsg = document.querySelector('.protection-message')
      if (existingMsg) existingMsg.remove()

      const msg = document.createElement('div')
      msg.className = 'protection-message'
      msg.textContent = message
      msg.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #ff6b6b;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
      `
      document.body.appendChild(msg)
      setTimeout(() => msg.remove(), 3000)
    }

    // APPLICATION
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('copy', handleCopy)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('dragstart', handleDragStart)
    document.addEventListener('keydown', handleKeyDown)

    // Styles
    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none'

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('keydown', handleKeyDown)
      
      document.body.style.userSelect = ''
      document.body.style.webkitUserSelect = ''
    }
  }, [])

  return <>{children}</>
}