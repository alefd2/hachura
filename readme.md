# Projeto de Hachura

Este projeto é uma aplicação web para criar, editar e gerenciar hachuras em imagens. Ele permite aos usuários desenhar hachuras, navegar entre diferentes páginas de imagens e salvar as hachuras no armazenamento local.

## Funcionalidades

- **Desenho de Hachuras**: Permite ao usuário desenhar hachuras sobre a imagem com um simples clique e arraste.
- **Navegação entre Páginas**: Os usuários podem navegar entre diferentes páginas de imagens, permitindo uma visualização mais organizada.
- **Edição e Salvar**: O usuário pode editar hachuras existentes e salvar as alterações no localstorage.
- **Remoção de Hachuras**: Permite que o usuário remova a hachura mais recente desenhada com um clique do botão do meio do mouse.
- **Feedback Visual**: As hachuras são apresentadas com cores e bordas definidas, permitindo fácil identificação.

## Estrutura do Projeto

O projeto é organizado em uma arquitetura Model-View-Controller (MVC), onde:

- **Model**: Gerencia a lógica de negócios e os dados, incluindo a recuperação e armazenamento de hachuras.
- **View**: Responsável pela apresentação dos dados na interface do usuário.
- **Controller**: Interage com o modelo e a visualização, manipulando eventos e coordenando a lógica da aplicação.

## Como Usar

1. **Clone o Repositório**:
   ```bash
   git clone https://github.com/alefd2/hachura
   cd hachura

2. Abra o Arquivo HTML: Abra o index.html em um navegador da web.

3. Desenhar Hachuras: Clique no botão "Editar Hachura" para iniciar a edição. Clique e arraste sobre a imagem para desenhar hachuras.

4. Navegar entre Páginas: Use os botões de navegação para mudar entre as páginas de imagens.

5. Salvar e Remover Hachuras: Clique no botão do meio do mouse para remover a hachura mais recente. As hachuras serão salvas automaticamente no armazenamento local ao sair do modo de edição.


## Tecnologias Utilizadas
- HTML5
- CSS3
- JavaScript (sem dependências externas)