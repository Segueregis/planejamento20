import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface ServiceOrderPrintLayoutProps {
  orderData: {
    numeroOS: string;
    osCliente: string;
    denominacaoOS: string;
    denominacaoAtivo: string;
    observacoesAvaliacao: string;
    solicitante: string;
    denominacaoUnidadeNegocio: string;
  };
}

const ServiceOrderPrintLayout: React.FC<ServiceOrderPrintLayoutProps> = ({ orderData }) => {
  const currentDate = new Date().toLocaleDateString('pt-BR');

  return (
    <div className="w-full max-w-4xl mx-auto bg-white text-black p-6 print:p-4 print:shadow-none">
      {/* Header */}
      <div className="border-2 border-black mb-4">
        <div className="flex items-center justify-between bg-gray-100 p-2 border-b border-black">
          <div className="flex items-center gap-4">
            <div className="font-bold text-xl text-red-600">
              <span className="italic">M</span> manserv
            </div>
          </div>
          <div className="text-center">
            <h1 className="font-bold text-lg">ORDEM DE SERVIÇO</h1>
          </div>
          <div className="font-bold text-lg">
            {orderData.numeroOS}
          </div>
          <div className="text-sm">
            <div className="font-bold">Johnson&Johnson</div>
            <div className="text-xs">FAMILY OF CONSUMER COMPANIES</div>
          </div>
        </div>

        {/* Service Type Row */}
        <div className="flex border-b border-black">
          <div className="flex-1 p-2 border-r border-black">
            <span className="font-semibold">Tipo Solic. de Serviço:</span>
            <span className="ml-2 bg-gray-200 px-2">OBRAS</span>
          </div>
          <div className="flex-1 p-2 border-r border-black">
            <span className="font-semibold">Oficina:</span>
            <span className="ml-2 bg-gray-200 px-2">PINTURA</span>
          </div>
          <div className="flex-1 p-2">
            <span className="font-semibold">Data Prevista:</span>
            <span className="ml-2">{currentDate}</span>
          </div>
        </div>

        {/* Description */}
        <div className="p-2 border-b border-black">
          <div className="font-semibold mb-2">Descrição da OS:</div>
          <div className="min-h-[60px] p-2 bg-gray-50 border text-sm">
            {orderData.denominacaoOS}
          </div>
        </div>

        {/* Details Row */}
        <div className="flex border-b border-black">
          <div className="w-1/4 p-2 border-r border-black">
            <div><span className="font-semibold">Local:</span> 057-026</div>
            <div className="mt-2"><span className="font-semibold">Solicitante:</span> {orderData.solicitante}</div>
          </div>
          <div className="w-1/4 p-2 border-r border-black">
            <div><span className="font-semibold">Descrição Local:</span> {orderData.denominacaoAtivo}</div>
            <div className="mt-2"><span className="font-semibold">Unidade:</span> {orderData.denominacaoUnidadeNegocio}</div>
          </div>
          <div className="w-1/4 p-2 border-r border-black">
            <div><span className="font-semibold">CC:</span> 8304</div>
          </div>
          <div className="w-1/4 p-2">
            <div><span className="font-semibold">OS Cliente:</span> {orderData.osCliente}</div>
          </div>
        </div>

        {/* Materials Table */}
        <div className="border-b border-black">
          <div className="bg-gray-200 p-2 text-center font-semibold border-b border-black">
            Descrição dos Materiais
          </div>
          <div className="flex">
            <div className="w-8 border-r border-black text-center font-semibold bg-gray-100">It</div>
            <div className="flex-1 border-r border-black p-2 font-semibold bg-gray-100"></div>
            <div className="w-20 border-r border-black text-center font-semibold bg-gray-100">Quantidade</div>
            <div className="w-20 text-center font-semibold bg-gray-100">Unidade</div>
          </div>
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <div key={num} className="flex border-b border-black min-h-[25px]">
              <div className="w-8 border-r border-black text-center text-sm">{num}</div>
              <div className="flex-1 border-r border-black"></div>
              <div className="w-20 border-r border-black"></div>
              <div className="w-20"></div>
            </div>
          ))}
        </div>

        {/* Bottom Section with Execution Details */}
        <div className="flex">
          {/* Left Column - Execution Details */}
          <div className="w-1/2 border-r border-black">
            <div className="grid grid-cols-4 gap-2 p-2 border-b border-black text-xs">
              <div><span className="font-semibold">R.E.</span></div>
              <div><span className="font-semibold">EXECUTANTE</span></div>
              <div><span className="font-semibold">DATA</span></div>
              <div><span className="font-semibold">INÍCIO</span></div>
              <div><span className="font-semibold">FIM</span></div>
              <div><span className="font-semibold">Tipo RH</span></div>
            </div>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <div key={num} className="grid grid-cols-6 border-b border-black min-h-[20px] text-xs">
                <div className="border-r border-black"></div>
                <div className="border-r border-black"></div>
                <div className="border-r border-black"></div>
                <div className="border-r border-black"></div>
                <div className="border-r border-black"></div>
                <div></div>
              </div>
            ))}
          </div>

          {/* Right Column - Equipment and Status */}
          <div className="w-1/2">
            {/* Equipment Section */}
            <div className="p-2 border-b border-black">
              <div className="font-semibold text-sm mb-2">EQUIPAMENTOS / FERRAMENTAS:</div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="flex items-center gap-1">
                  <Checkbox className="w-3 h-3" />
                  <span>TESOURA</span>
                </div>
                <div className="flex items-center gap-1">
                  <Checkbox className="w-3 h-3" />
                  <span>ANDAIMES</span>
                </div>
                <div className="flex items-center gap-1">
                  <Checkbox className="w-3 h-3" />
                  <span>MARTÃO</span>
                </div>
                <div className="flex items-center gap-1">
                  <Checkbox className="w-3 h-3" />
                  <span>LIXADEIRA</span>
                </div>
                <div className="flex items-center gap-1">
                  <Checkbox className="w-3 h-3" />
                  <span>Z-60</span>
                </div>
                <div className="flex items-center gap-1">
                  <Checkbox className="w-3 h-3" />
                  <span>H-15 HAULOTE</span>
                </div>
                <div className="flex items-center gap-1">
                  <Checkbox className="w-3 h-3" />
                  <span>MARTELETE</span>
                </div>
                <div className="flex items-center gap-1">
                  <Checkbox className="w-3 h-3" />
                  <span>FURADEIRA</span>
                </div>
                <div className="flex items-center gap-1 col-span-2">
                  <Checkbox className="w-3 h-3" />
                  <span>Outro: _______________</span>
                </div>
              </div>
            </div>

            {/* Execution Time */}
            <div className="p-2 border-b border-black">
              <div className="font-semibold text-sm mb-2">EXECUÇÃO:</div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="flex items-center gap-1">
                  <Checkbox className="w-3 h-3" />
                  <span>MN - DURANTE A SEMANA</span>
                </div>
                <div className="flex items-center gap-1">
                  <Checkbox className="w-3 h-3" />
                  <span>HE - SÁBADO</span>
                </div>
                <div className="flex items-center gap-1">
                  <Checkbox className="w-3 h-3" />
                  <span>HE - DOMINGO/FERIADO</span>
                </div>
              </div>
            </div>

            {/* Liberation and Status */}
            <div className="p-2 border-b border-black">
              <div className="font-semibold text-sm mb-2">LIBERAÇÕES PT:</div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="flex items-center gap-1">
                  <Checkbox className="w-3 h-3" />
                  <span>ALTURA</span>
                </div>
                <div className="flex items-center gap-1">
                  <Checkbox className="w-3 h-3" />
                  <span>QUENTE</span>
                </div>
                <div className="flex items-center gap-1">
                  <Checkbox className="w-3 h-3" />
                  <span>ESPAÇO CONFINADO</span>
                </div>
                <div className="flex items-center gap-1">
                  <Checkbox className="w-3 h-3" />
                  <span>LOTO</span>
                </div>
                <div className="flex items-center gap-1">
                  <Checkbox className="w-3 h-3" />
                  <span>MOVIMENTAÇÃO CARGA</span>
                </div>
                <div className="flex items-center gap-1">
                  <Checkbox className="w-3 h-3" />
                  <span>ESCAVAÇÃO DE ENTULHOS</span>
                </div>
                <div className="flex items-center gap-1">
                  <Checkbox className="w-3 h-3" />
                  <span>DESENTUPIDORA</span>
                </div>
                <div className="flex items-center gap-1 col-span-2">
                  <span>OUTRO: _______________</span>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="p-2">
              <div className="font-semibold text-sm mb-2">STATUS ORDEM:</div>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Checkbox className="w-3 h-3" />
                  <span>PLANEJADA</span>
                </div>
                <div className="flex items-center gap-1">
                  <Checkbox className="w-3 h-3" />
                  <span>EXECUTADA</span>
                </div>
                <div className="flex items-center gap-1">
                  <Checkbox className="w-3 h-3" />
                  <span>NÃO EXECUTADA</span>
                </div>
                <div className="flex items-center gap-1">
                  <Checkbox className="w-3 h-3" />
                  <span>CANCELADA</span>
                </div>
              </div>
              <div className="mt-2 text-xs">
                <span>Motivo: _______________</span>
              </div>
            </div>
          </div>
        </div>

        {/* Observations */}
        <div className="border-b border-black p-2">
          <div className="font-semibold text-sm mb-2">Observações:</div>
          <div className="min-h-[80px] border-t border-black pt-2 text-sm">
            {orderData.observacoesAvaliacao}
          </div>
        </div>

        {/* Signatures */}
        <div className="flex">
          <div className="w-1/2 p-2 border-r border-black">
            <div className="font-semibold text-sm">Solicitante:</div>
            <div className="mt-4 border-b border-black pb-2"></div>
            <div className="text-xs mt-1">Visto: _______ Data: ___/___/20___</div>
          </div>
          <div className="w-1/2 p-2">
            <div className="font-semibold text-sm">Executante:</div>
            <div className="mt-4 border-b border-black pb-2"></div>
            <div className="text-xs mt-1">Visto: _______ Data: ___/___/20___</div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-right text-xs p-1 bg-gray-100">
          F-063-0384.020 - V2.01
        </div>
      </div>
    </div>
  );
};

export default ServiceOrderPrintLayout;