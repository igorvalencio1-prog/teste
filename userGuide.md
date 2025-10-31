# Dashboard de Suporte Técnico - Guia do Usuário

## Sobre o Dashboard

**Propósito:** Análise completa e visual do desempenho de chamados de suporte técnico da sua empresa.

**Acesso:** O dashboard é público e pode ser acessado por qualquer pessoa com o link.

---

## Powered by Manus

Este dashboard foi construído com tecnologia de ponta:

**Frontend:** React 19 + TypeScript + Tailwind CSS + shadcn/ui para uma interface moderna e responsiva.

**Visualizações:** Recharts para gráficos interativos e dinâmicos que se adaptam a diferentes tamanhos de tela.

**Infraestrutura:** Deployment em auto-scaling com CDN global para máxima performance e disponibilidade.

---

## Usando o Dashboard

### Métricas Principais

Na parte superior do dashboard, você encontrará quatro cartões com as principais métricas:

- **Total de Chamados:** Número total de registros de suporte carregados.
- **TMA (Minutos):** Tempo Médio de Atendimento em minutos.
- **FRT Médio (Minutos):** Tempo Médio de Primeira Resposta em minutos.
- **Resolvidos:** Quantidade de chamados que foram fechados com sucesso.

### Gráficos Interativos

O dashboard apresenta seis gráficos principais:

1. **Distribuição por Status** (Gráfico de Pizza)
   - Mostra a proporção de chamados em cada status: Aberto, Pendente, Em Andamento e Resolvido/Fechado.
   - Passe o mouse sobre as fatias para ver valores exatos.

2. **Distribuição por Prioridade** (Gráfico de Pizza)
   - Exibe a proporção de chamados por nível de prioridade: Urgente, Alta, Média e Baixa.
   - Ajuda a identificar o volume de demanda crítica.

3. **Motivos Mais Frequentes** (Gráfico de Barras Horizontal)
   - Top 10 categorias de chamados ordenadas por frequência.
   - Identifica quais problemas ocorrem com maior frequência.

4. **Chamados por Técnico** (Gráfico de Barras)
   - Distribuição de carga de trabalho entre os técnicos de suporte.
   - Útil para avaliar equilíbrio de demanda.

5. **Chamados por Departamento** (Gráfico de Barras)
   - Mostra qual departamento gera mais chamados de suporte.
   - Identifica áreas que podem precisar de treinamento ou recursos adicionais.

6. **Evolução Temporal** (Gráfico de Linha)
   - Tendência de chamados por mês ao longo do tempo.
   - Revela padrões sazonais e picos de demanda.

### Insights Automáticos

Abaixo de cada gráfico, você encontrará um texto descritivo que explica o insight principal visualizado. Esses textos são gerados automaticamente e destacam:

- Percentuais e números absolutos.
- Comparações entre categorias.
- Identificação de outliers e tendências.

### Tabela de Status e Satisfação

Na parte inferior, a tabela "Resumo por Status e Satisfação" oferece uma análise detalhada:

- **Status:** Cada status de chamado.
- **Quantidade:** Número de chamados naquele status.
- **Percentual:** Proporção em relação ao total.
- **Satisfação (Bom/Médio/Regular):** Distribuição de avaliações para chamados fechados.

---

## Gerenciando o Dashboard

### Atualizar Dados

Para atualizar os dados do dashboard com novos registros de chamados:

1. Acesse o painel **Settings** (Configurações) na interface de gerenciamento.
2. Navegue até **Database** para gerenciar dados diretamente.
3. Ou substitua o arquivo CSV (`chamados_suporte_tecnico.csv`) na pasta `public/` do projeto.

### Personalizar Cores e Tema

O dashboard usa Tailwind CSS com tema claro padrão. Para alterar:

1. Acesse a pasta `client/src/` do projeto.
2. Edite `index.css` para ajustar variáveis de cores.
3. Use o painel **Settings → General** para alterar nome e logo do site.

### Exportar Dados

Você pode extrair dados da tabela copiando e colando em um editor de planilhas, ou usar ferramentas de browser para exportar como CSV.

---

## Próximos Passos

Converse com Manus AI a qualquer momento para:

- Adicionar novos gráficos ou métricas.
- Integrar dados de fontes externas (APIs, bancos de dados).
- Implementar filtros interativos (por período, departamento, técnico).
- Adicionar funcionalidades de autenticação e controle de acesso.
- Criar relatórios automáticos por email.

Seu dashboard está pronto para ajudar na tomada de decisões baseada em dados! Comece analisando os padrões de demanda e identifique oportunidades de melhoria no suporte técnico.
