# Ótica Lima — landing page

Landing page estática para apresentar a marca e levar visitantes ao atendimento da Ótica Lima. A captura do Instagram e o PDF enviados foram usados como referências de identidade visual e comunicação.

## Executar localmente

Abra `index.html` diretamente no navegador ou sirva esta pasta com qualquer servidor de arquivos estáticos. Por exemplo, com Python:

```powershell
python -m http.server 8000
```

Depois abra `http://localhost:8000`. Não há etapa de build, instalação de dependências ou banco de dados.

## Configuração pública

Edite `site-config.js` para atualizar o número de WhatsApp, o telefone exibido e o link do Instagram. O número aparece em um único ponto de configuração e as mensagens por produto são montadas pela interface como links públicos `wa.me`.

## Arquitetura

A entrega é um site institucional estático em HTML, CSS e JavaScript. As ilustrações e dados reutilizáveis das armações ficam em `js/frame-data.js`; o personalizador 3D é criado em `js/frame-3d-viewer.js` com Three.js r159, mantido localmente em `js/vendor/three-r159.min.js`; o guia de formatos de rosto tem seu controlador em `js/face-guide.js`, com estilos em `styles-interactive.css`. A armação 3D é construída por código, responde às escolhas e pode ser girada com mouse ou toque. O desenho SVG continua como alternativa se WebGL não estiver disponível. As seleções existem apenas na página e não são armazenadas.

O botão do personalizador monta uma conversa `wa.me` com as escolhas atuais usando o número público em `site-config.js`; ele abre o WhatsApp sem enviar a mensagem. As opções de lente e as recomendações são demonstrações de estilo, não especificações ou disponibilidade comercial.

Não existe back-end, API, acesso a banco de dados, autenticação ou credencial privada. Nenhuma operação que exija privilégios ou segredo acontece no navegador.

## Imagens e informações

As fotografias foram fornecidas para este projeto e estão armazenadas localmente em `assets/images` em formato WebP otimizado. A última imagem anexada é a foto principal; ela também apareceu duplicada entre os anexos e foi usada uma única vez. As imagens são referências visuais e não confirmam estoque, preços, marcas, clientes ou disponibilidade. O wordmark é um recorte em PNG da marca no material enviado. Os horários foram transcritos do destaque compartilhado e aparecem identificados como informação a confirmar. O material descreve atendimento por mensagem e delivery em Campo Grande, além de entrega após laboratório com prazo conforme a lente.

O perfil e materiais fornecidos não informaram endereço de rua. Verifique horários, condições de pagamento e promoções antes de publicar.
## SEO e privacidade

Os metadados de compartilhamento e o schema local usam apenas os dados confirmados (nome, telefone, Instagram e Campo Grande/MS). A página não possui formulário, analytics ou armazenamento de dados pessoais. As imagens são carregadas do próprio site. O clique em WhatsApp/Instagram transfere a conversa para o serviço correspondente.




