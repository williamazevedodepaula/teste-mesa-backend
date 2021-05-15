# teste-mesa
Prova de desenvolvimento: API de locais.

A API foi desenvolvida utilizando as ferramentas Node, Loopback 3 e a linguagem TypeScript (através do módulo ts-node).

A execução do projeto ocorre através do *docker-compose*, que contém a descrição de 2 serviços executados através de containers do docker:

* database: Uma instância de banco de dados MySql
* api: A API desenvolvida


O deploy da versão de produção foi realizado em um EC2 da Amazon, disponível no endereço:

```
http://teste-mesa-api.williamazevedodepaula.com.br:3000/explorer/
```

## Instalação/Execução

### Pré-Requisitos: 

Os seguintes softwares são necessários para a correta execução:

* Docker
* Docker-compose

### Procedimento de execução

1. Clonar o repositorio
2. Executar o projeto usando um dos ambientes: **TESTE** ou **DESENVOLVIMENTO**. O ambiente de **TESTE** deve ser utilizado para execução dos testes de integração, e possui um banco de dados que será modificado a cada execução de teste. **Não é possível** executar testes de integração no ambiente de **DESENVOLVIMENTO**, para evitar exclusão e recriação indesejada do banco de dados.

Para executar a aplicação em ambiente de **TESTE**, na raiz do projeto, executar:

```
  docker-compose -f docker-compose.yml -f docker-compose.test.override.yml up -d
```
Para executar a aplicação em ambiente de **DESENVOLVIMENTO**, na raiz do projeto, executar:

```
  docker-compose -f docker-compose.yml -f docker-compose.development.override.yml up -d
```

Para parar a aplicação:

```
  docker-compose down
```

**IMPORTANTE**: Para executar a aplicação em outro ambiente, primeiro parar a aplicação e depois reexecutar no ambiente desejado

3. Para consultar os logs:

Log do banco da API:

```
  docker-compose logs -f api
```

Log do banco de dados:

```
  docker-compose logs -f database
```

4. Após inicializada (a primeira vez demora um pouco, devido ao **build** das imagens e instalação das dependências), a api estará disponível em:

http://localhost:3000/api

e a **DOCUMENTAÇÂO** completa da API, utilizando a interface *swagger*, bem como interface gráfica para interação com a API estarão disponíveis em:

http://localhost:3000/explorer/

## Testes Automatizados

Os testes automatizados foram divididos em dois grupos: **Testes Unitários** e **Testes de Integração**.

Os testes unitários são independentes de banco de dados e do framework, e podem ser executados sem que a aplicação esteja executando:

```
npm run test:unit
```

Os Testes de integração, por sua vez, dependem do Framework e do banco de dados, e por isso precisam ser executados DENTRO DO CONTAINER DO DOCKER. Alem disso, por segurança, é necessário que esteja executando em ambiente de **TESTE**. Se executar o comando para teste de integração em ambiente de **DESENVOLVIMENTO**, os testes irão falhar com uma mensagem de alerta no console.
Para executar o teste de integração, dentro do container:

```
docker exec -it api npm run test:integration
```

Para executar todos os testes (dentro do container):

```
docker exec -it api npm test
```

## Organização do código-fonte

A seguir está a descrição dos principais diretórios e arquivos da aplicação

### Raiz

Dentre os vários arquivos de configuração na raiz do projeto, podemos destacar:

* Dockerfile: Arquivo com diretrizes para construcao da imagem do docker à partir do codigo fonte
* docker-compose.yml: Arquivo docker-compose base, contendo a descrição dos serviços
* docker-compose.test.override.yml: Arquivo docker-compose override para ambiente de teste
* docker-compose.test.development.yml: Arquivo docker-compose override para ambiente de desenvolvimento
* docker-compose.production.override.yml: Arquivo docker-compose override para ambiente de produção (Atualmente, um EC2 na AWS)
* heroku.yml: O projeto foi configurado para funcionar com o Heroku (vide arquivo **heroku.yml**), mas ocorreram erros ao realizar o deploy com Docker e, por esse motivo, optei por transferir o deploy para a um EC2 na AWS.
### docker

Diretório que contém arquivos utilizados durante o build da imagem do docker. Dentro deste diretório é montado o **volume** com os dados do banco de dados durante a execução da aplicação, em **docker/volumes**.

* Entrypont: entrypoint da imagem do docker
* wait-for-it: script utilizado para que a api espere a correta inicializacao do banco de dados antes de iniciar o loopback


### Entity

Neste diretório estão as classes que definem as entidades utilizadas na aplicação

* BaseEntity: Entidade base, da qual todas herdam
* Usuario: Usuário do sistema
* Local: Local cadastrado pelo usuário
* Avaliacao: Avaliacao de um usuário sobre um local

### Server

Neste diretório estão os arquivos necessários à execução do loopback, e os modelos do mesmo, que refletem a estrutura das tambelas do banco de dados em um modelo ORM. Além disso, os modelos do loopback fornecem uma camada de "repositório" para a aplicação. Na definicação dos modelos, os endpoints da API são vinclulados a métodos dessa camada. Cada modelo possui um arquivo .json, com a definição do modelo, e um arquivo .ts, com implementação de métodos e definições de endpoints.

Possui um Model para cada uma das 3 entidades citadas na seção anterior.

Para melhor compreensão, o Models do loopback foram referidos no código como **Services**.

### Test

Contém dois subdiretórios: **integration** e **unit**, contendo os testes de integração e unitários, respectivamente. Todos os testes foram escritos utilizando **mocha**, **chai** e **sinon**.
