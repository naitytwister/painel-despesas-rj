# Painel de Despesas Públicas — Rio de Janeiro/RJ

Dashboard da Prefeitura Municipal do Rio de Janeiro/RJ com dados da Declaração de Contas Anuais (DCA), Anexo I-E, exercícios de 2020 a 2025. O pacote segue o padrão visual e os campos de dados do projeto de Ouro Preto, mas ajusta as escalas e unidades do gráfico ao porte financeiro do Rio.

## O que foi preparado

- `index.html` e `script.js`: dashboard local com distribuição por função, comparação 2024–2025 e série histórica 2020–2025. O seletor anual troca o top 8 em todos os seis exercícios.
- `siconfi_rio_de_janeiro.csv`: serialização CSV dos registros recebidos da API pública do SICONFI, preservando seus campos e valores originais.
- `dados_rj.csv`: CSV normalizado com o campo adicional `nivel` (`Total`, `Função`, `Subfunção` ou `Outro`) para manter compatibilidade com o modelo Ouro Preto.
- `dados_rj_totais.csv`: totais anuais, distinguindo despesas exceto intraorçamentárias, intraorçamentárias e o total combinado.
- `dados_rj_funcoes_2020_2025.csv`: todas as funções de cada ano, com valor em reais, valor em milhões, posição e participação.
- `dados_rj_top8_2025.csv`: ranking de 2025 pedido na especificação.
- `dados_rj_top8_2024_2025.csv`: top 8 dos dois anos usados no comparativo.
- `build_dashboard_rj.py`: ETL reproduzível que baixa os dados oficiais, valida a consistência e regenera os CSVs e o bloco de dados do `script.js`.
- `posts_linkedin_rio_de_janeiro.md`: três textos com números atualizados e ressalvas metodológicas.
- `dashboard_preview.png`: captura de conferência do painel renderizado.

## Fonte e escopo

Fonte primária: [API SICONFI/Tesouro Nacional — DCA](https://apidatalake.tesouro.gov.br/ords/cdwhprd/siconfi/tt/dca), consultada em 27/10/2026, com `id_ente=3304557`, `no_anexo=DCA-Anexo I-E` e exercícios de 2020 a 2025. A documentação da [API](https://apidatalake.tesouro.gov.br/docs/siconfi/) indica o recurso DCA e seus parâmetros. O serviço retorna JSON; o arquivo `siconfi_rio_de_janeiro.csv` é a exportação tabular desses registros, sem criar métricas novas.

O endpoint retorna, para cada exercício, linhas com diferentes colunas contábeis e níveis de agregação. Por isso, **não se deve somar todas as linhas**. O dashboard filtra `coluna = Despesas Empenhadas` e, para totais e funções, usa a base `Despesas Exceto Intraorçamentárias`. A soma das linhas de função coincide com esse total em todos os seis exercícios, sem diferença de centavos. As despesas intraorçamentárias são preservadas em coluna separada no CSV de totais; o total combinado também é fornecido, mas não é o denominador das participações por função.

Essa escolha mantém o mesmo critério funcional usado no projeto Ouro Preto e evita misturar transferências intraorçamentárias no denominador do gráfico por função. No painel, funções são exibidas em R$ milhões e totais anuais em R$ bilhões. Todos os números são nominais, sem correção pelo IPCA.
O bloco `yearly`/`funcs` em `script.js` guarda números em R$ milhões porque essa é a unidade esperada pela lógica do front-end; os CSVs preservam os valores originais em reais e também oferecem colunas em milhões. A marca Colectai segue embutida como SVG no HTML; não havia pasta `assets/` no repositório auditado.

A DCA é a declaração anual da Prefeitura Municipal identificada pelo código IBGE informado. A abrangência de órgãos e entidades consolidados pode variar; antes de interpretar tendências como mudanças reais na prestação de serviços ou comparar com outro ente, consulte a [cobertura da DCA no SICONFI](https://www.tesourotransparente.gov.br/consultas/consultas-siconfi/siconfi-coberturas-da-dca). As funções são categorias orçamentárias; não são medidas diretas de qualidade, resultado ou investimento.

## Resultado e checagens principais

- A função e o total `exceto intraorçamentárias` reconciliam exatamente (diferença inferior a R$ 0,02) em cada ano.
- O top 8 de 2025 representa **89,93%** do total funcional de 2025. Não foi imposto o intervalo de 75% a 85% do briefing, porque isso é uma expectativa arbitrária, não uma regra contábil.
- Entre 2024 e 2025, o total `exceto intraorçamentárias` variou **−1,28% nominal** (de aproximadamente R$ 39,63 bilhões para R$ 39,13 bilhões), redução de cerca de R$ 506,37 milhões.
- Entre 2020 e 2025, houve crescimento acumulado de **55,20% nominal** (de aproximadamente R$ 25,21 bilhões para R$ 39,13 bilhões).

A queda de 2025 foi mantida como observada; não foi substituída por uma faixa de crescimento “esperada”. Ela também não prova, por si só, uma redução real: a série não foi ajustada pela inflação e deve ser lida considerando a cobertura informada para a DCA.

## Como reproduzir o ETL

Requisitos: Python 3.10 ou superior e os pacotes `pandas` e `requests`.

```bash
python -m pip install -r requirements.txt
python build_dashboard_rj.py
```

O script respeita a taxa de consulta documentada da API, pagina respostas quando necessário, verifica exercício, ente e anexo, e interrompe se a soma das funções não conciliar com o total exceto intra. O script atualiza somente o bloco entre os marcadores `BEGIN/END GENERATED DATA` do `script.js`; a lógica e os estilos do dashboard permanecem fora do bloco gerado.

Não se aplicam como testes de aprovação os limites de 5%–15% de variação anual ou 75%–85% para o top 8 que apareciam no rascunho inicial. A validação adequada é a consistência da resposta oficial, a reconciliação das funções com seu total e a investigação de valores atípicos sem pressupor um resultado.

## Teste local e publicação

Abra `index.html` em um navegador para uma conferência rápida. Para executar por HTTP local, use, na pasta do projeto:

```bash
python -m http.server 8000
```

A cópia de trabalho foi preparada localmente. Nenhuma alteração foi enviada ao repositório público nem publicada no GitHub Pages. Antes de publicar, valide o conteúdo e a disponibilidade da configuração de Pages. No momento da verificação, o endereço citado no briefing `https://naitytwister.github.io/painel-despesas-rj/` retornou 404; o repositório existente, por sua vez, continha dados zerados e um erro de sintaxe no JavaScript, corrigidos nesta cópia local.
Repositório auditado: [github.com/naitytwister/painel-despesas-rj](https://github.com/naitytwister/painel-despesas-rj).

## Referências oficiais

- [API SICONFI — DCA](https://apidatalake.tesouro.gov.br/docs/siconfi/)
- [Exemplo de consulta DCA 2025, Rio de Janeiro, Anexo I-E](https://apidatalake.tesouro.gov.br/ords/cdwhprd/siconfi/tt/dca?an_exercicio=2025&no_anexo=DCA-Anexo%20I-E&id_ente=3304557)
- [Instruções de preenchimento da DCA e validações do Anexo I-E](https://siconfi.tesouro.gov.br/siconfi/pages/public/arquivo/conteudo/2023_Regras_Gerais_e_Instrucoes_de_preenchimento_DCA.pdf)
- [Consulta de coberturas da DCA](https://www.tesourotransparente.gov.br/consultas/consultas-siconfi/siconfi-coberturas-da-dca)
