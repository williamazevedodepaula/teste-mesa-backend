FROM node:12-stretch


#------------------------------------------------------------------------------
#instalacoes e configurações

#insere o entrypoint na imagem
ADD ./docker/entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

#insere o wait-for-it na imagem
ADD ./docker/wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

#insere o código fonte
RUN mkdir /api 
WORKDIR /api
COPY ./package.json .
RUN npm install 
COPY . .

EXPOSE 3000
#------------------------------------------------------------------------------




#------------------------------------------------------------------------------
#executa o entrypoint
ENTRYPOINT ["entrypoint.sh"]
#------------------------------------------------------------------------------