# Painel de Despesas Públicas — Rio de Janeiro/RJ

## Dashboard de despesas empenhadas do município do Rio de Janeiro/RJ.

Baseado no mesmo modelo do painel de Ouro Preto/MG, adaptado para a cidade do Rio de Janeiro.

## Estrutura
- `index.html`: dashboard interativo com três painéis (despesas por função, comparativo anual, série histórica).
- `script.js`: lógica de renderização dos gráficos SVG.
- `dados_rj.csv`: dados brutos do SICONFI (substitua pelos valores reais).
- `assets/`: logomarca da Colectai e outras imagens.

## Como usar
1. Abra o `index.html` no navegador para testar localmente.
2. Preencha os dados reais no objeto `yearly` e `funcs` dentro de `script.js`.
3. Substitua o `dados_rj.csv` pelos dados oficiais da Prefeitura do Rio de Janeiro.

## Deploy no GitHub Pages
1. Crie um repositório público no GitHub.
2. Envie os arquivos para a branch `main`.
3. Ative o GitHub Pages em Settings → Pages.
4. O painel ficará disponível em `https://SEU_USUARIO.github.io/NOME_DO_REPO/`.

## Créditos
- Logomarca: Colectai (sócios: Naiti Weslei e Adriana)
- Dados: SICONFI/Tesouro Nacional
- Modelo visual: baseado no painel de Ouro Preto/MG