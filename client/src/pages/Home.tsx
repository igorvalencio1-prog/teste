import { useEffect, useState } from 'react';
import { APP_TITLE } from "@/const";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

interface Chamado {
  ID_Chamado: number;
  Data_Abertura: string;
  Data_Fechamento: string | null;
  Status: string;
  Prioridade: string;
  Motivo: string;
  Departamento: string;
  Tecnico: string;
  Tempo_Resolucao_Minutos: number;
  FRT_Minutos: number;
  Satisfacao: string | null;
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'];

export default function Home() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [priorityData, setPriorityData] = useState<any[]>([]);
  const [motivosData, setMotivosData] = useState<any[]>([]);
  const [tecnicosData, setTecnicosData] = useState<any[]>([]);
  const [departamentosData, setDepartamentosData] = useState<any[]>([]);
  const [temporalData, setTemporalData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [insights, setInsights] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/chamados_suporte_tecnico.csv');
        const text = await response.text();
        const lines = text.trim().split('\n');
        
        const data: Chamado[] = lines.slice(1).map(line => {
          const values = line.split(',');
          return {
            ID_Chamado: parseInt(values[0]),
            Data_Abertura: values[1],
            Data_Fechamento: values[2] === '' || values[2] === 'None' ? null : values[2],
            Status: values[3],
            Prioridade: values[4],
            Motivo: values[5],
            Departamento: values[6],
            Tecnico: values[7],
            Tempo_Resolucao_Minutos: parseFloat(values[8]),
            FRT_Minutos: parseInt(values[9]),
            Satisfacao: values[10] === '' || values[10] === 'None' ? null : values[10]
          };
        });
        
        setChamados(data);
        processData(data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar dados: ' + (err instanceof Error ? err.message : 'Desconhecido'));
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const processData = (data: Chamado[]) => {
    // Status
    const statusCounts = data.reduce((acc, c) => {
      acc[c.Status] = (acc[c.Status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    setStatusData(Object.entries(statusCounts).map(([name, value]) => ({ name, value })));

    // Prioridade
    const priorityCounts = data.reduce((acc, c) => {
      acc[c.Prioridade] = (acc[c.Prioridade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    setPriorityData(Object.entries(priorityCounts).map(([name, value]) => ({ name, value })));

    // Motivos (Top 10)
    const motivoCounts = data.reduce((acc, c) => {
      acc[c.Motivo] = (acc[c.Motivo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topMotivos = Object.entries(motivoCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));
    setMotivosData(topMotivos);

    // Técnicos
    const tecnicoCounts = data.reduce((acc, c) => {
      acc[c.Tecnico] = (acc[c.Tecnico] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    setTecnicosData(Object.entries(tecnicoCounts).map(([name, value]) => ({ name, value })));

    // Departamentos
    const departamentoCounts = data.reduce((acc, c) => {
      acc[c.Departamento] = (acc[c.Departamento] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    setDepartamentosData(Object.entries(departamentoCounts).map(([name, value]) => ({ name, value })));

    // Evolução Temporal
    const monthCounts: Record<string, number> = {};
    data.forEach(c => {
      const date = new Date(c.Data_Abertura);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
    });
    const sortedMonths = Object.keys(monthCounts).sort();
    setTemporalData(sortedMonths.map(month => ({ month, chamados: monthCounts[month] })));

    // Tabela de Status e Satisfação
    const tableRows = Object.entries(statusCounts).map(([status, count]) => {
      const statusChamados = data.filter(c => c.Status === status);
      return {
        status,
        quantidade: count,
        percentual: ((count / data.length) * 100).toFixed(1),
        bom: statusChamados.filter(c => c.Satisfacao === 'Bom').length,
        medio: statusChamados.filter(c => c.Satisfacao === 'Médio').length,
        regular: statusChamados.filter(c => c.Satisfacao === 'Regular').length
      };
    });
    setTableData(tableRows);

    // Insights
    const newInsights: Record<string, string> = {};
    const resolvidos = statusCounts['Resolvido/Fechado'] || 0;
    const pendentes = statusCounts['Pendente'] || 0;
    newInsights.status = `${((resolvidos / data.length) * 100).toFixed(1)}% dos chamados foram resolvidos. ${pendentes} chamados ainda estão pendentes.`;

    const urgentes = priorityCounts['Urgente'] || 0;
    const altas = priorityCounts['Alta'] || 0;
    const criticos = urgentes + altas;
    newInsights.priority = `${((criticos / data.length) * 100).toFixed(1)}% dos chamados são de prioridade Urgente ou Alta, indicando alta demanda crítica.`;

    if (topMotivos.length > 0) {
      newInsights.motivos = `"${topMotivos[0].name}" é o motivo mais frequente com ${topMotivos[0].value} chamados, representando ${((topMotivos[0].value / data.length) * 100).toFixed(1)}% do total.`;
    }

    const maxTecnico = Object.entries(tecnicoCounts).sort((a, b) => b[1] - a[1])[0];
    if (maxTecnico) {
      newInsights.tecnicos = `${maxTecnico[0]} é o técnico mais produtivo com ${maxTecnico[1]} chamados atendidos.`;
    }

    const maxDept = Object.entries(departamentoCounts).sort((a, b) => b[1] - a[1])[0];
    if (maxDept) {
      newInsights.departamentos = `O departamento de ${maxDept[0]} tem a maior demanda com ${maxDept[1]} chamados.`;
    }

    if (sortedMonths.length > 0) {
      const maxMonth = sortedMonths.reduce((max, month) => monthCounts[month] > monthCounts[max] ? month : max);
      newInsights.temporal = `O pico de chamados ocorreu em ${maxMonth} com ${monthCounts[maxMonth]} registros, indicando alta demanda nesse período.`;
    }

    setInsights(newInsights);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">{APP_TITLE}</h1>
          <p className="text-muted-foreground mt-1">Análise Completa de Chamados de Suporte Técnico</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Chamados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{chamados.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">TMA (Minutos)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(chamados.reduce((sum, c) => sum + c.Tempo_Resolucao_Minutos, 0) / chamados.length)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">FRT Médio (Minutos)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(chamados.reduce((sum, c) => sum + c.FRT_Minutos, 0) / chamados.length)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Resolvidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {chamados.filter(c => c.Status === 'Resolvido/Fechado').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Distribuição por Status */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Status</CardTitle>
              <CardDescription>Proporção de chamados em cada status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-sm text-muted-foreground mt-4">{insights.status}</p>
            </CardContent>
          </Card>

          {/* Distribuição por Prioridade */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Prioridade</CardTitle>
              <CardDescription>Proporção de chamados por nível de prioridade</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={priorityData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-sm text-muted-foreground mt-4">{insights.priority}</p>
            </CardContent>
          </Card>

          {/* Motivos Mais Frequentes */}
          <Card>
            <CardHeader>
              <CardTitle>Motivos Mais Frequentes</CardTitle>
              <CardDescription>Top 10 categorias de chamados</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={motivosData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-muted-foreground mt-4">{insights.motivos}</p>
            </CardContent>
          </Card>

          {/* Chamados por Técnico */}
          <Card>
            <CardHeader>
              <CardTitle>Chamados por Técnico</CardTitle>
              <CardDescription>Distribuição de carga entre técnicos</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tecnicosData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-muted-foreground mt-4">{insights.tecnicos}</p>
            </CardContent>
          </Card>

          {/* Chamados por Departamento */}
          <Card>
            <CardHeader>
              <CardTitle>Chamados por Departamento</CardTitle>
              <CardDescription>Distribuição por departamento</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departamentosData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-muted-foreground mt-4">{insights.departamentos}</p>
            </CardContent>
          </Card>

          {/* Evolução Temporal */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução Temporal</CardTitle>
              <CardDescription>Chamados por mês ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={temporalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="chamados" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-sm text-muted-foreground mt-4">{insights.temporal}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Status e Satisfação */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo por Status e Satisfação</CardTitle>
            <CardDescription>Análise detalhada de status e satisfação dos chamados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-2 px-2">Status</th>
                    <th className="text-left py-2 px-2">Quantidade</th>
                    <th className="text-left py-2 px-2">Percentual</th>
                    <th className="text-left py-2 px-2">Satisfação (Bom)</th>
                    <th className="text-left py-2 px-2">Satisfação (Médio)</th>
                    <th className="text-left py-2 px-2">Satisfação (Regular)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tableData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-2">{row.status}</td>
                      <td className="py-2 px-2 font-semibold">{row.quantidade}</td>
                      <td className="py-2 px-2">{row.percentual}%</td>
                      <td className="py-2 px-2">{row.bom}</td>
                      <td className="py-2 px-2">{row.medio}</td>
                      <td className="py-2 px-2">{row.regular}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
