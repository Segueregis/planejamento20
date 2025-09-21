import React from 'react';

interface SimpleServiceOrderPrintLayoutProps {
  serviceOrders: any[]; // Using any[] to support Supabase data structure
}

const SimpleServiceOrderPrintLayout: React.FC<SimpleServiceOrderPrintLayoutProps> = ({ serviceOrders }) => {
  return (
    <div className="print-layout">
      <style>{`
        @media print {
          .print-layout {
            font-family: Arial, sans-serif;
            font-size: 10px;
            color: black;
            background: white;
          }
          
          .print-header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
          }
          
          .print-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          
          .print-table th,
          .print-table td {
            border: 1px solid #000;
            padding: 4px;
            text-align: left;
            font-size: 8px;
            word-wrap: break-word;
          }
          
          .print-table th {
            background-color: #f0f0f0;
            font-weight: bold;
            text-align: center;
          }
          
          .print-table tr:nth-child(even) {
            background-color: #f9f9f9;
          }
        }
      `}</style>
      
      <div className="print-header">
        <h1 style={{ margin: 0, fontSize: '16px' }}>Relatório de Ordens de Serviço</h1>
        <p style={{ margin: '5px 0', fontSize: '10px' }}>
          Gerado em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
        </p>
        <p style={{ margin: '5px 0', fontSize: '10px' }}>
          Total de registros: {serviceOrders.length}
        </p>
      </div>

      <table className="print-table">
        <thead>
          <tr>
            <th style={{ width: '8%' }}>Número OS</th>
            <th style={{ width: '8%' }}>OS Cliente</th>
            <th style={{ width: '12%' }}>Denominação OS</th>
            <th style={{ width: '10%' }}>Tipo Solicitação</th>
            <th style={{ width: '10%' }}>Oficina</th>
            <th style={{ width: '8%' }}>Ativo</th>
            <th style={{ width: '12%' }}>Denominação Ativo</th>
            <th style={{ width: '10%' }}>Solicitante</th>
            <th style={{ width: '10%' }}>Unidade Negócio</th>
            <th style={{ width: '8%' }}>Status</th>
            <th style={{ width: '8%' }}>Data Criação</th>
          </tr>
        </thead>
        <tbody>
          {serviceOrders.map((order, index) => (
            <tr key={order.id || index}>
              <td>{order.numero_os || '-'}</td>
              <td>{order.numero_os_cliente || order.os_cliente || '-'}</td>
              <td>{order.denominacao_os || '-'}</td>
              <td>{order.tipo_solicitacao_servico || '-'}</td>
              <td>{order.denominacao_oficina || '-'}</td>
              <td>{order.ativo || '-'}</td>
              <td>{order.denominacao_ativo || '-'}</td>
              <td>{order.denominacao_solicitante || order.solicitante || '-'}</td>
              <td>{order.denominacao_unidade_negocio || order.unidade_negocio || '-'}</td>
              <td>{order.status || 'Aguardando Programação'}</td>
              <td>{order.created_at ? new Date(order.created_at).toLocaleDateString('pt-BR') : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {serviceOrders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '12px' }}>
          <p>Nenhuma ordem de serviço encontrada para impressão.</p>
        </div>
      )}

      <div style={{ 
        marginTop: '20px', 
        fontSize: '8px', 
        borderTop: '1px solid #ccc', 
        paddingTop: '10px',
        textAlign: 'center'
      }}>
        <p>Sistema de Gestão de Ordens de Serviço</p>
      </div>
    </div>
  );
};

export default SimpleServiceOrderPrintLayout;