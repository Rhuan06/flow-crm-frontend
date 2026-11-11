'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getClients } from '@/services/clients';
import { getOpportunities } from '@/services/opportunities';
import { Skeleton } from '@/components/Skeleton';

export default function DashboardPage() {
  const { user } = useAuth();
  const [totalClients, setTotalClients] = useState<number | null>(null);
  const [openOpportunities, setOpenOpportunities] = useState<number | null>(null);
  const [totalValue, setTotalValue] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardMetrics() {
      try {
        setIsLoading(true);
        const [clients, opportunities] = await Promise.all([
          getClients(),
          getOpportunities(),
        ]);

        setTotalClients(clients.length);

        const openOpps = opportunities.filter(
          (o) => o.status !== 'ganho' && o.status !== 'perdido'
        );
        setOpenOpportunities(openOpps.length);

        const sumValue = openOpps.reduce((acc, curr) => acc + Number(curr.value || 0), 0);
        setTotalValue(sumValue);
      } catch (error) {
        console.error('Erro ao carregar métricas do dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardMetrics();
  }, []);

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Bem-vindo ao FlowCRM,{' '}
          {user ? (
            <span className="font-semibold text-blue-600">{user.name}</span>
          ) : (
            <Skeleton className="h-4 w-24 inline-block align-middle" />
          )}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Total de Clientes</h3>
          {isLoading ? (
            <Skeleton className="h-9 w-16 mt-2" />
          ) : (
            <p className="mt-2 text-3xl font-bold text-gray-900">{totalClients}</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Oportunidades Abertas</h3>
          {isLoading ? (
            <Skeleton className="h-9 w-16 mt-2" />
          ) : (
            <p className="mt-2 text-3xl font-bold text-gray-900">{openOpportunities}</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Valor em Negociação</h3>
          {isLoading ? (
            <Skeleton className="h-9 w-32 mt-2" />
          ) : (
            <p className="mt-2 text-3xl font-bold text-gray-900">
              R${' '}
              {(totalValue || 0).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}