'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Client } from '@/types';
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from '@/services/clients';
import { useToast } from '@/contexts/ToastContext';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Skeleton } from '@/components/Skeleton';

export default function ClientsPage() {
  const { showToast } = useToast();

  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
    name: string;
  }>({
    isOpen: false,
    id: null,
    name: '',
  });

  async function loadClients() {
    try {
      setIsLoading(true);

      const data = await getClients();
      setClients(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao carregar a lista de clientes.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  function handleOpenCreateModal() {
    setEditingClient(null);
    setName('');
    setEmail('');
    setPhone('');
    setError('');
    setShowModal(true);
  }

  function handleOpenEditModal(client: Client) {
    setEditingClient(client);
    setName(client.name);
    setEmail(client.email);
    setPhone(client.phone || '');
    setError('');
    setShowModal(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (editingClient) {
        await updateClient(editingClient.id, {
          name,
          email,
          phone: phone.trim() ? phone : null,
        });

        showToast('Cliente atualizado com sucesso!', 'success');
      } else {
        await createClient({
          name,
          email,
          phone: phone.trim() ? phone : null,
        });

        showToast('Cliente cadastrado com sucesso!', 'success');
      }

      setShowModal(false);
      await loadClients();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao salvar cliente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDeleteClick(id: string, name: string) {
    setDeleteModal({ isOpen: true, id, name });
  }

  async function confirmDelete() {
    if (!deleteModal.id) return;

    try {
      setDeletingId(deleteModal.id);
      setError('');

      await deleteClient(deleteModal.id);

      showToast('Cliente excluído com sucesso.', 'info');
      await loadClients();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao excluir cliente.');
      }
    } finally {
      setDeletingId(null);
      setDeleteModal({ isOpen: false, id: null, name: '' });
    }
  }

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleExportCSV() {
    if (filteredClients.length === 0) {
      showToast('Nenhum cliente disponível para exportar.', 'info');
      return;
    }

    const headers = ['Nome', 'E-mail', 'Telefone', 'Data de Cadastro'];

    const rows = filteredClients.map((client) => {
      // Forçar o Excel a interpretar o telefone estritamente como texto
      const phoneFormated = client.phone ? `="${client.phone}"` : '""';
      
      return [
        `"${client.name.replace(/"/g, '""')}"`,
        `"${client.email.replace(/"/g, '""')}"`,
        phoneFormated,
        `"${new Date(client.created_at).toLocaleDateString('pt-BR')}"`,
      ];
    });

    const csvContent =
      '\uFEFF' +
      [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `clientes_flowcrm_${new Date().toISOString().slice(0, 10)}.csv`
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    showToast('Relatório de clientes exportado com sucesso!', 'success');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestão de Clientes
          </h1>

          <p className="text-gray-600 text-sm mt-1">
            Visualize e gerencie sua carteira de clientes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={isLoading || filteredClients.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-2">↓</span>
            Exportar CSV
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors"
          >
            + Novo Cliente
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
          placeholder="Buscar por nome ou e-mail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-80 border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Tabela de Clientes */}
      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                E-mail
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefone
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de Cadastro
              </th>

              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-32" />
                  </td>

                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-40" />
                  </td>

                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>

                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-20" />
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </td>
                </tr>
              ))
            ) : filteredClients.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  {searchTerm
                    ? 'Nenhum cliente encontrado com esse termo.'
                    : 'Nenhum cliente cadastrado ainda.'}
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {client.name}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {client.email}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {client.phone || '-'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(client.created_at).toLocaleDateString('pt-BR')}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button
                      onClick={() => handleOpenEditModal(client)}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteClick(client.id, client.name)
                      }
                      disabled={deletingId === client.id}
                      className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
                    >
                      {deletingId === client.id ? 'Excluindo...' : 'Excluir'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Criação / Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              {editingClient ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome *
                </label>

                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 bg-white placeholder-gray-400 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  E-mail *
                </label>

                <input
                  type="email"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 bg-white placeholder-gray-400 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telefone (Opcional)
                </label>

                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 bg-white placeholder-gray-400 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(71) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
        title="Excluir Cliente"
        message={`Tem certeza de que deseja excluir o cliente "${deleteModal.name}"? Esta ação não pode ser desfeita.`}
        isLoading={deletingId === deleteModal.id}
        onConfirm={confirmDelete}
        onClose={() =>
          setDeleteModal({ isOpen: false, id: null, name: '' })
        }
      />
    </div>
  );
}