"use client"

import { useAuth } from '@/src/hooks/useAuth';
import React from 'react';
import { useStats } from '../providers/admin/StatsProvider';
import { StatsResponse } from '@/src/domain/entities/stats';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

// Composants locaux pour éviter les erreurs d'import
const StatsFilters = () => {
  const { filters, updateFilters, availableMonths, availableYears } = useStats();

  const handleFilterTypeChange = (filterType: 'month' | 'year') => {
    const newFilters = { filterType };
    
    // if (filterType === 'year' && availableYears.length > 0 && !filters.year) {
    //   newFilters.year = availableYears[0];
    // }
    
    // if (filterType === 'month' && availableMonths.length > 0 && !filters.month) {
    //   newFilters.month = availableMonths[0];
    // }
    
    updateFilters(newFilters);
  };

  const handleMonthChange = (month: string) => {
    updateFilters({ ...filters, month });
  };

  const handleYearChange = (year: string) => {
    updateFilters({ ...filters, year });
  };

  return (
    <div className="flex flex-wrap gap-4 items-center p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <label className="font-medium">Période:</label>
        <select 
          value={filters.filterType}
          onChange={(e) => handleFilterTypeChange(e.target.value as 'month' | 'year')}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="month">Mensuel</option>
          <option value="year">Annuel</option>
        </select>
      </div>

      {filters.filterType === 'month' && (
        <div className="flex items-center gap-2">
          <label className="font-medium">Mois:</label>
          <select 
            value={filters.month || availableMonths[0] || ''}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableMonths.map(month => (
              <option key={month} value={month}>
                {new Date(`${month}-01`).toLocaleDateString('fr-FR', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </option>
            ))}
          </select>
        </div>
      )}

      {filters.filterType === 'year' && (
        <div className="flex items-center gap-2">
          <label className="font-medium">Année:</label>
          <select 
            value={filters.year || availableYears[0] || ''}
            onChange={(e) => handleYearChange(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

const StatsLoading = () => (
  <div className="flex flex-col items-center justify-center p-8 space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    <p className="text-gray-600">Chargement des statistiques...</p>
  </div>
);

const StatsError = () => {
  const { error, refreshStats } = useStats();

  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-red-800 font-medium">Erreur de chargement</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
        <button
          onClick={refreshStats}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
};

const DashboardScreen = () => {
  const { user } = useAuth();
  const { stats, isLoading, error, refreshStats } = useStats();
  const locale = useLocale();
  const router = useRouter();

  // Données de secours avec la structure complète de StatsResponse
  const fallbackStats: StatsResponse = {
    filtre: {
      type: 'month',
      periode: {
        debut: new Date().toISOString(),
        fin: new Date().toISOString()
      },
      moisDisponibles: [],
      anneesDisponibles: []
    },
    totalCircuitsActif: 0,
    totalVehiclesActif: 0,
    totalParticipants: 0,
    totalReservations: 0,
    circuitsPlusReserve: [],
    tripsPlusReserve: [],
    reservationsDeLaPeriode: [],
    circuitsPopulaires: [],
    tripsPopulaires: [],
    statsMensuelles: [],
    totalRevenus: 0,
    detailParticipants: {
      total: 0,
      adultes: 0,
      enfants: 0
    }
  };

  const currentStats: StatsResponse = stats || fallbackStats;

  const getStatusColor = (statut: string) => {
    switch(statut) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (statut: string) => {
    switch(statut) {
      case 'confirmed': return 'Confirmé';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      default: return statut;
    }
  };

  // Calculer le pourcentage pour les barres de progression
  const calculatePercentage = (current: number, max: number) => {
    if (max === 0) return 0;
    return Math.min((current / max) * 100, 100);
  };

  // Trouver le nombre maximum de réservations pour les pourcentages
  const maxReservations = currentStats.circuitsPopulaires.length > 0 
    ? Math.max(...currentStats.circuitsPopulaires.map(c => c.nombreReservations))
    : 1;

  if (isLoading) {
    return <StatsLoading />;
  }

  if (error) {
    return <StatsError />;
  }

  

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Bonjour, {user?.username} ! 👋</h2>
            <p className="text-gray-600 mt-1">Voici un aperçu de votre activité aujourd'hui.</p>
          </div>

          {/* Filtres */}
          {/* <div className="mb-6">
            <StatsFilters />
          </div> */}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Circuits Actifs */}
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
                  <p className="text-sm font-medium text-gray-600">Circuits Actifs</p>
                  <p className="text-3xl font-bold text-gray-900">{currentStats.totalCircuitsActif}</p>
                  <p className="text-sm text-green-600">
                    {currentStats.circuitsPopulaires.length} populaires
                  </p>
                </div>
              </div>
            </div>

            {/* Participants */}
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
                  <p className="text-sm font-medium text-gray-600">Participants Total</p>
                  <p className="text-3xl font-bold text-gray-900">{currentStats.totalParticipants.toLocaleString()}</p>
                  <p className="text-sm text-green-600">
                    {currentStats.detailParticipants.adultes} adultes, {currentStats.detailParticipants.enfants} enfants
                  </p>
                </div>
              </div>
            </div>

            {/* Réservations */}
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
                  <p className="text-3xl font-bold text-gray-900">{currentStats.totalReservations}</p>
                  <p className="text-sm text-green-600">
                    {currentStats.statsMensuelles[0]?.reservations || 0} ce mois
                  </p>
                </div>
              </div>
            </div>

            {/* Revenus */}
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
                  <p className="text-3xl font-bold text-gray-900">{currentStats.totalRevenus.toLocaleString()}</p>
                  <p className="text-sm text-green-600">
                    {currentStats.statsMensuelles[0]?.participants || 0} participants ce mois
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Réservations Récentes */}
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
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Service</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentStats.reservationsDeLaPeriode.slice(0, 5).map((reservation) => {
                      const circuitTitle = reservation.circuit ? JSON.parse(reservation.circuit as any) : null;
                      const tripTitle = reservation.trip ? JSON.parse(reservation.trip as any) : null;
                      const vehicleTitle = reservation.vehicle ? JSON.parse(reservation.vehicle as any) : null;
                      return(
                        <tr key={reservation.id} className="hover:bg-gray-50">
                        <td className="py-3 text-sm font-medium text-gray-900">
                          {reservation.prenom} {reservation.nom}
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {locale === "fr" ? circuitTitle?.fr : circuitTitle?.en}
                          {locale === "fr" ? tripTitle?.fr : tripTitle?.en}
                          {locale === "fr" ? vehicleTitle?.fr : vehicleTitle?.en}
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(reservation.status)}`}>
                            {getStatusText(reservation.status)}
                          </span>
                        </td>
                      </tr>
                      )
                    })}
                    {currentStats.reservationsDeLaPeriode.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-4 text-center text-gray-500">
                          Aucune réservation pour cette période
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Circuits Populaires */}
            <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Circuits Populaires</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Voir tout
                </button>
              </div>
              <div className="space-y-4">
                {currentStats.circuitsPopulaires.map((circuit, index) => {
                  const title = JSON.parse(circuit.title as any);
                  return(
                    <div key={circuit.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          {locale === "fr" ? title?.fr : title?.en}
                        </p>
                        <span className="text-sm text-gray-600">
                          {circuit.nombreReservations} réservations
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${calculatePercentage(circuit.nombreReservations, maxReservations)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {circuit.nombreParticipants} participants
                      </p>
                    </div>
                  </div>
                  )
                })}
                {currentStats.circuitsPopulaires.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    Aucun circuit populaire pour cette période
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions Rapides</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button onClick={()=>router.push('/admin/circuits/add?update=false')} className="flex items-center justify-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Nouveau Circuit</span>
              </button>
              <button onClick={()=>router.push('/admin/vehicles/add?edit=false')} className="flex items-center justify-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Ajouter une voiture</span>
              </button>
              <button onClick={()=>router.push('/admin/trip/add?edit=false')} className="flex items-center justify-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Gérer une voyage organisée</span>
              </button>
              <button 
                onClick={refreshStats}
                className="flex items-center justify-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Actualiser</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardScreen;