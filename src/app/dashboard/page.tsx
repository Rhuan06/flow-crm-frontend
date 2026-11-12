'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardData {
  total_clients: number;
  total_leads: number;
  won_value: number;
  pipeline_value: number;
  conversion_rate: number;
  opportunities_by_stage: {
    stage: string;
    count: number;
  }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Carregando...'); // Estado inicial

  useEffect(() => {
    const token = localStorage.getItem('flowcrm_token');

    if (!token) {
      router.push('/login');
      return;
    }

    async function fetchData() {
      try {
        // Dispara as duas chamadas em simultâneo
        const [summaryResponse, userResponse] = await Promise.all([
          fetch('http://localhost:8000/api/v1/dashboard/summary', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:8000/api/v1/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        // Trata a resposta do Dashboard
        if (summaryResponse.ok) {
          const result = await summaryResponse.json();
          setData(result);
        } else {
          console.error('Erro ao buscar dados do dashboard');
        }

        // Trata a resposta do Utilizador (para pegar o nome real)
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserName(userData.name || 'Utilizador');
        } else {
          setUserName('Utilizador');
        }

      } catch (error) {
        console.error('Erro na requisição:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

  if (loading) {
    return <div className="p-8 text-gray-600 font-medium">A carregar dashboard...</div>;
  }

  const maxCount = Math.max(...(data?.opportunities_by_stage?.map(item => item.count) || [1]));
  const safeMax = maxCount > 0 ? maxCount : 1; 

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Bloco de Boas-vindas */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">
          Bem-vindo ao FlowCRM,{' '}
          <span className="font-semibold text-blue-600">{userName}</span>
        </p>
      </div>

      {/* Cartões de Indicadores Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total de Clientes</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {data?.total_clients || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total de Leads</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {data?.total_leads || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Funil (Em Negociação)</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(data?.pipeline_value || 0)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-green-600">Valor Ganho</p>
          <p className="text-2xl font-bold text-green-700 mt-2">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(data?.won_value || 0)}
          </p>
        </div>

        {/* Indicador de Conversão / Taxa de Sucesso */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 bg-linear-to-br from-blue-50 to-white">
          <p className="text-sm font-medium text-blue-600">Taxa de Conversão</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">
            {data?.conversion_rate || 0}%
          </p>
          <p className="text-xs text-gray-400 mt-1">Negócios ganhos vs total</p>
        </div>
      </div>

      {/* Seção de Gráficos / Distribuição por Etapas do Funil */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Distribuição do Funil de Vendas
        </h2>

        <div className="space-y-4">
          {data?.opportunities_by_stage?.map((item) => {
            const percentage = (item.count / safeMax) * 100;

            return (
              <div key={item.stage}>
                <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                  <span className="uppercase text-xs font-semibold">{item.stage}</span>
                  <span className="font-bold text-gray-800">{item.count}</span>
                </div>

                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.stage === 'GANHO' ? 'bg-green-500' : 
                      item.stage === 'PERDIDO' ? 'bg-red-400' : 'bg-blue-600'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
          
          {data?.opportunities_by_stage?.length === 0 && (
             <p className="text-sm text-gray-500 text-center py-4">Nenhuma oportunidade registada ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
}