"use client"

import React, { useState } from 'react';

const DashboardScreen = () => {
  
  

  // Données simulées
  const stats = {
    circuits: 45,
    visiteurs: 1247,
    reservations: 89,
    revenus: 45680
  };

  const recentReservations = [
    { id: 1, client: 'Jean Dupont', circuit: 'Avenue des Baobabs', date: '2024-09-18', statut: 'confirmé' },
    { id: 2, client: 'Marie Martin', circuit: 'Parc National Andasibe', date: '2024-09-19', statut: 'en attente' },
    { id: 3, client: 'Pierre Durand', circuit: 'Tsingy de Bemaraha', date: '2024-09-20', statut: 'confirmé' },
    { id: 4, client: 'Sophie Laurent', circuit: 'Nosy Be Paradise', date: '2024-09-21', statut: 'annulé' }
  ];

  const topCircuits = [
    { nom: 'Avenue des Baobabs', reservations: 28, pourcentage: 85 },
    { nom: 'Parc National Andasibe', reservations: 22, pourcentage: 67 },
    { nom: 'Tsingy de Bemaraha', reservations: 18, pourcentage: 55 },
    { nom: 'Nosy Be Paradise', reservations: 15, pourcentage: 45 }
  ];

  
  const getStatusColor = (statut: string) => {
    switch(statut) {
      case 'confirmé': return 'bg-green-100 text-green-800';
      case 'en attente': return 'bg-yellow-100 text-yellow-800';
      case 'annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Bonjour, Admin ! 👋</h2>
            <p className="text-gray-600 mt-1">Voici un aperçu de votre activité aujourd'hui.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow-sm rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7l6-3 5.447 2.724A1 1 0 0121 7.618v10.764a1 1 0 01-.553.894L15 17l-6 3z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Circuits Total</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.circuits}</p>
                  <p className="text-sm text-green-600">+3 ce mois</p>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Visiteurs</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.visiteurs.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+12% ce mois</p>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4l6 6H6a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Réservations</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.reservations}</p>
                  <p className="text-sm text-green-600">+8 cette semaine</p>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenus (€)</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.revenus.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+18% ce mois</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Reservations */}
            <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Réservations Récentes</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Voir tout
                </button>
              </div>
              <div className="overflow-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Client</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Circuit</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentReservations.map((reservation) => (
                      <tr key={reservation.id} className="hover:bg-gray-50">
                        <td className="py-3 text-sm font-medium text-gray-900">{reservation.client}</td>
                        <td className="py-3 text-sm text-gray-600">{reservation.circuit}</td>
                        <td className="py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(reservation.statut)}`}>
                            {reservation.statut}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Circuits */}
            <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Circuits Populaires</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Voir tout
                </button>
              </div>
              <div className="space-y-4">
                {topCircuits.map((circuit, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">{circuit.nom}</p>
                        <span className="text-sm text-gray-600">{circuit.reservations}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${circuit.pourcentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions Rapides</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex items-center justify-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Nouveau Circuit</span>
              </button>
              <button className="flex items-center justify-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Rapport Mensuel</span>
              </button>
              <button className="flex items-center justify-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Gérer Clients</span>
              </button>
              <button className="flex items-center justify-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <svg className="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Paramètres</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {/* {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )} */}
    </div>
  );
};

export default DashboardScreen;