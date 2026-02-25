# Apresentação do Projeto - 3 Minutos

Boa tarde. Hoje vou apresentar a solução desenvolvida para o Desafio SCTEC IA para Devs: uma aplicação web full-stack para gerenciamento de empreendimentos do estado de Santa Catarina.

A aplicação foi construída seguindo as melhores práticas de engenharia de software, com arquitetura em camadas, código limpo e padrões de design modernos. O sistema permite o cadastro, consulta, atualização e exclusão de informações sobre negócios locais, oferecendo uma interface moderna e intuitiva.

A aplicação oferece um CRUD completo de empreendimentos com validação em tempo real. Possui um sistema avançado de busca e filtros que permite localizar empreendimentos por nome, empreendedor, município, segmento de atuação ou status. A interface é totalmente responsiva, adaptando-se perfeitamente a dispositivos móveis, tablets e desktops.

Implementamos um sistema de notificações toast para feedback visual ao usuário, modais customizados para confirmações importantes, e estados visuais bem definidos para loading, erro e listas vazias. Além disso, criamos scripts automatizados para backup e restore do banco de dados MongoDB, garantindo proteção e recuperação de dados.

A primeira decisão técnica fundamental foi adotar uma arquitetura em camadas, separando claramente rotas, controladores, serviços, repositórios e modelos. Isso facilita manutenção, testes e evolução do sistema.

Implementamos o Repository Pattern para abstrair o acesso a dados, permitindo que a aplicação seja independente do banco de dados escolhido. Isso facilita futuras migrações e testes isolados. A camada de serviços centraliza toda a lógica de negócio, tornando-a reutilizável e testável sem dependências de HTTP ou banco de dados.

Escolhemos TypeScript em todo o projeto para garantir tipagem estática, detecção precoce de erros e melhor experiência de desenvolvimento. No backend, utilizamos Node.js com Express, MongoDB com Mongoose, e Jest para testes. No frontend, optamos por React com TypeScript, Vite como build tool, React Query para gerenciamento inteligente de estado do servidor, e React Hook Form para formulários performáticos.

Uma decisão importante foi implementar validação em múltiplas camadas: no frontend para melhor experiência do usuário, e no backend por questões de segurança. Isso garante integridade dos dados e feedback imediato. Utilizamos Docker para executar MongoDB localmente durante desenvolvimento, garantindo ambiente consistente para todos os desenvolvedores e facilitando o onboarding.

Implementamos um sistema abrangente de testes, com testes unitários, de integração e de componentes.

A solução resultou em código limpo e bem organizado, fácil de entender e manter. A interface é intuitiva e responsiva.

Esta solução demonstra conhecimento profundo de arquitetura de software.
As decisões técnicas priorizam qualidade, manutenibilidade, escalabilidade e experiência do usuário.
Resultando em uma aplicação profissional de nível enterprise.

Obrigado pela atenção.
