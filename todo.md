# Dashboard de Suporte Técnico - TODO

## Funcionalidades Planejadas

- [x] Carregar dados CSV de chamados simulados
- [x] Exibir Total de Chamados
- [x] Calcular e exibir Tempo Médio de Atendimento (TMA)
- [x] Gráfico de Barras: Chamados por Técnico
- [x] Gráfico de Pizza: Categorias de Chamados (Motivos)
- [x] Tabela com Status e Satisfação
- [x] Gráfico de Evolução Temporal (por mês/ano)
- [x] Gráfico de Distribuição de Prioridades
- [x] Gráfico de Distribuição de Departamentos
- [x] Implementar Insights com IA (descrições automáticas dos gráficos)
- [x] Responsividade e Design Visual
- [ ] Publicar Dashboard Online

## Progresso

Todas as funcionalidades principais foram implementadas com sucesso! O dashboard está funcional e pronto para publicação.

## Tecnologias Utilizadas

- React 19 com TypeScript
- Recharts para visualizações de dados
- Tailwind CSS para estilização
- shadcn/ui para componentes UI
- Vite como bundler

## Dados

O dashboard utiliza 2000 registros de chamados simulados com as seguintes características:
- Distribuição de status: Aberto (5%), Pendente (35%), Em Andamento (35%), Resolvido/Fechado (25%)
- Distribuição de prioridades: Urgente (20%), Alta (20%), Média (35%), Baixa (25%)
- 10 motivos principais de chamados
- 5 técnicos de suporte
- 6 departamentos
- Dados de evolução temporal de 2023 a 2025
