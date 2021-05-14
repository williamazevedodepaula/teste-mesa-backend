# teste-mesa
Prova de desenvolvimento: API de locais.

A API foi desenvolvida utilizando as ferramentas Node, Loopback 3 e a linguagem TypeScript (através do módulo ts-node).

A execução do projeto ocorre através do *docker-compose*, que contém a descrição de 2 serviços executados através de containers do docker:

* database: Uma instância de banco de dados MySql
* api: A API desenvolvida



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
npm run unit-test
```

Os Testes de integração, por sua vez, dependem do Framework e do banco de dados, e por isso precisam ser executados DENTRO DO CONTAINER DO DOCKER. Alem disso, por segurança, é necessário que esteja executando em ambiente de **TESTE**. Se executar o comando para teste de integração em ambiente de **DESENVOLVIMENTO**, os testes irão falhar com uma mensagem de alerta no console.
Para executar o teste de integração, dentro do container:

```
docker exec -it api npm run integration-test
```

Para executar todos os testes (dentro do container):

```
docker exec -it api npm test
```
