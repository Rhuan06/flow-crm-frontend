'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Opportunity, Client, OpportunityStatus } from '@/types';
import {
  getOpportunities,
  createOpportunity,
  updateOpportunity,
  updateOpportunityStatus,
  deleteOpportunity,
} from '@/services/opportunities';
import { getClients } from '@/services/clients';
import { useToast } from '@/contexts/ToastContext';
import { ConfirmModal } from '@/components/ConfirmModal';

const STATUS_LABELS: Record<OpportunityStatus, string> = {
  prospeccao: 'Prospecção',
  qualificacao: 'Qualificação',
  proposta: 'Proposta',
  ganho: 'Ganho',
  perdido: 'Perdido',
};

const COLUMNS: OpportunityStatus[] = [
  'prospeccao',
  'qualificacao',
  'proposta',
  'ganho',
  'perdido',
];

export default function OpportunitiesPage() {
  const { showToast } = useToast();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingOpportunity, setEditingOpportunity] =
    useState<Opportunity | null>(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Modal de confirmação
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
    title: string;
  }>({
    isOpen: false,
    id: null,
    title: '',
  });

  // Estados do formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [clientId, setClientId] = useState('');
  const [status, setStatus] =
    useState<OpportunityStatus>('prospeccao');

  async function loadData() {
    try {
      setIsLoading(true);

      const [oppsData, clientsData] = await Promise.all([
        getOpportunities(),
        getClients(),
      ]);

      setOpportunities(oppsData);
      setClients(clientsData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao carregar dados de oportunidades.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleOpenCreateModal() {
    setEditingOpportunity(null);
    setTitle('');
    setDescription('');
    setValue('');
    setClientId('');
    setStatus('prospeccao');
    setError('');
    setShowModal(true);
  }

  function handleOpenEditModal(opp: Opportunity) {
    setEditingOpportunity(opp);
    setTitle(opp.title);
    setDescription(opp.description || '');
    setValue(String(opp.value));
    setClientId(opp.client_id);
    setStatus(opp.status);
    setError('');
    setShowModal(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const numValue = parseFloat(value);

    if (isNaN(numValue) || numValue <= 0) {
      setError('O valor da oportunidade deve ser maior que zero.');
      return;
    }

    if (!clientId) {
      setError('Selecione um cliente para a oportunidade.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingOpportunity) {
        await updateOpportunity(editingOpportunity.id, {
          title,
          description: description.trim() ? description : null,
          value: numValue,
          status,
          client_id: clientId,
        });

        showToast('Oportunidade atualizada com sucesso!', 'success');
      } else {
        await createOpportunity({
          title,
          description: description.trim() ? description : null,
          value: numValue,
          status,
          client_id: clientId,
        });

        showToast('Oportunidade criada com sucesso!', 'success');
      }

      setShowModal(false);
      await loadData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao salvar oportunidade.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusChange(
    id: string,
    newStatus: OpportunityStatus
  ) {
    try {
      await updateOpportunityStatus(id, newStatus);
      showToast('Status atualizado!', 'success');
      await loadData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao atualizar status.');
      }
    }
  }

  function handleDeleteClick(id: string, title: string) {
    setDeleteModal({ isOpen: true, id, title });
  }

  async function confirmDelete() {
    if (!deleteModal.id) return;

    try {
      setDeletingId(deleteModal.id);
      setError('');

      await deleteOpportunity(deleteModal.id);
      showToast('Oportunidade excluída.', 'info');
      await loadData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao excluir oportunidade.');
      }
    } finally {
      setDeletingId(null);
      setDeleteModal({ isOpen: false, id: null, title: '' });
    }
  }

  const filteredOpportunities = opportunities.filter((opp) => {
    const clientName =
      clients.find((c) => c.id === opp.client_id)?.name || '';

    const term = searchTerm.toLowerCase();

    return (
      opp.title.toLowerCase().includes(term) ||
      clientName.toLowerCase().includes(term)
    );
  });

  function handleExportCSV() {
    if (opportunities.length === 0) {
      showToast(
        'Nenhuma oportunidade disponível para exportar.',
        'info'
      );
      return;
    }

    const headers = [
      'Título',
      'Cliente',
      'Valor (R$)',
      'Status',
      'Descrição',
    ];

    const rows = filteredOpportunities.map((o) => {
      const clientName =
        clients.find((c) => c.id === o.client_id)?.name ||
        'Cliente Desconhecido';

      return [
        `"${o.title.replace(/"/g, '""')}"`,
        `"${clientName.replace(/"/g, '""')}"`,
        `"${Number(o.value || 0).toFixed(2)}"`,
        `"${STATUS_LABELS[o.status] || o.status}"`,
        `"${(o.description || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent =
      '\uFEFF' +
      [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `oportunidades_flowcrm_${new Date().toISOString().slice(0, 10)}.csv`
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    showToast(
      'Relatório de oportunidades baixado com sucesso!',
      'success'
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pipeline de Vendas
          </h1>

          <p className="text-gray-600 text-sm mt-1">
            Gerencie suas oportunidades em cada etapa do funil.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            disabled={isLoading || filteredOpportunities.length === 0}
            className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Exportar CSV
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm"
          >
            + Nova Oportunidade
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-md">
          {error}
        </div>
      )}

      {/* Barra de Pesquisa */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <input
          type="text"
          placeholder="Buscar por título ou cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-80 border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Board Kanban */}
      {isLoading ? (
        <div className="p-8 text-center text-gray-500">
          Carregando oportunidades...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((colStatus) => {
            const colOpps = filteredOpportunities.filter(
              (o) => o.status === colStatus
            );

            const totalValue = colOpps.reduce(
              (acc, curr) => acc + Number(curr.value || 0),
              0
            );

            return (
              <div
                key={colStatus}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col min-w-56"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-700 text-sm">
                    {STATUS_LABELS[colStatus]}
                  </h3>

                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    {colOpps.length}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mb-4 font-medium">
                  R${' '}
                  {totalValue.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </p>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh]">
                  {colOpps.map((opp) => {
                    const clientName =
                      clients.find((c) => c.id === opp.client_id)?.name ||
                      'Cliente';

                    const isClosed =
                      opp.status === 'ganho' || opp.status === 'perdido';

                    return (
                      <div
                        key={opp.id}
                        className="bg-white p-3 rounded shadow-sm border border-gray-200 space-y-2 relative group"
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-900 text-sm pr-2">
                            {opp.title}
                          </h4>

                          <div className="flex items-center space-x-1">
                            {!isClosed && (
                              <button
                                onClick={() => handleOpenEditModal(opp)}
                                title="Editar Oportunidade"
                                className="text-gray-400 hover:text-blue-600 text-xs font-bold p-1 rounded transition-colors"
                              >
                                ✎
                              </button>
                            )}

                            <button
                              onClick={() =>
                                handleDeleteClick(opp.id, opp.title)
                              }
                              disabled={deletingId === opp.id}
                              title="Excluir Oportunidade"
                              className="text-gray-400 hover:text-red-600 text-xs font-bold p-1 rounded transition-colors disabled:opacity-50"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-gray-500">
                          {clientName}
                        </p>

                        {opp.description && (
                          <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 italic line-clamp-2">
                            {opp.description}
                          </p>
                        )}

                        <p className="text-sm font-bold text-gray-900">
                          R${' '}
                          {(Number(opp.value) || 0).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </p>

                        {!isClosed && (
                          <select
                            value={opp.status}
                            onChange={(e) =>
                              handleStatusChange(
                                opp.id,
                                e.target.value as OpportunityStatus
                              )
                            }
                            className="mt-2 block w-full text-xs border border-gray-300 rounded px-2 py-1 text-gray-900 bg-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            {COLUMNS.map((st) => (
                              <option
                                key={st}
                                value={st}
                                className="text-gray-900 bg-white"
                              >
                                {STATUS_LABELS[st]}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Criação / Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              {editingOpportunity
                ? 'Editar Oportunidade'
                : 'Nova Oportunidade'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Título *
                </label>

                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 bg-white placeholder-gray-400 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cliente *
                </label>

                <select
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 bg-white sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                >
                  <option value="">Selecione um cliente</option>

                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Valor (R$) *
                </label>

                <input
                  type="number"
                  step="0.01"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 bg-white placeholder-gray-400 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 bg-white sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as OpportunityStatus)
                  }
                >
                  {COLUMNS.map((st) => (
                    <option key={st} value={st}>
                      {STATUS_LABELS[st]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descrição (Opcional)
                </label>

                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 bg-white placeholder-gray-400 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Excluir Oportunidade"
        message={`Tem certeza que deseja excluir a oportunidade "${deleteModal.title}"? Esta ação não pode ser desfeita.`}
        isLoading={deletingId === deleteModal.id}
        onConfirm={confirmDelete}
        onClose={() =>
          setDeleteModal({ isOpen: false, id: null, title: '' })
        }
      />
    </div>
  );
}