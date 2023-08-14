/// <reference types="cypress" />
import { faker } from '@faker-js/faker'
import contrato from '../contracts/usuarios.contracts'

describe('Testes da Funcionalidade Usuarios', () => {
let token
     before(() => {
                cy.token('lu.lima@qa.com.br', 'teste10').then(tkn => { token = tkn })
     });

    it.only('Deve validar contrato de usuarios', () => {
     cy.request('usuarios').then(response => {
          return contrato.validateAsync(response.body)
     })

    });

    it('Deve listar usuários cadastrados', () => {
     cy.request({
          method: 'GET',
          url: 'usuarios'
         }).then((response =>{
          expect(response.status).to.equal(200)
          expect(response.body).to.have.property('usuarios')
          expect(response.duration).to.be.lessThan(50)
         }))
    });

    it('Deve cadastrar um usuário com sucesso', () => {
     const useremail = faker.internet.email()

         cy.request({
          method:'POST',
          url:'usuarios',
          body:{
               "nome": "Sergio da Silva",
               "email": useremail,
               "password": "teste20",
               "administrador": "true"
             },
         }).then((response) =>{
          expect(response.body.message).to.equal( 'Cadastro realizado com sucesso')
          expect(response.status).to.equal(201)
         })
    });

    it('Deve validar um usuário com email inválido', () => {
         cy.request({
          method: 'POST',
          url:'usuarios',
          body: {
                    "nome": "Luciene Lima",
                    "email": "limalima@qa.com.br",
                    "password": "teste2",
                    "administrador": "true",
               
                  }, failOnStatusCode: false
          
         }).then((response) => {
          expect(response.status).to.equal(400)
          expect(response.body.message).to.equal('Este email já está sendo usado')
         })
    });

    it('Deve editar um usuário previamente cadastrado', () => {
         cy.request('usuarios').then(response => {
          let id = response.body.usuarios[1]._id
          cy.request({
               method: 'PUT',
               url:`usuarios/${id}`,
               body:   {
                    "nome": "Luciene Lima",
                    "email": "lu-lima@qa.com.br",
                    "password": "teste",
                    "administrador": "true",
                  }
          }).then(response => {
               expect(response.body.message).to.equal("Registro alterado com sucesso")
               expect(response.status).to.equal(200)
          })
         })
    });

    it('Deve deletar um usuário previamente cadastrado', () => {
     const useremail = faker.internet.email()
          cy.NewUser('ApiTesting', useremail, 'teste', 'true').then(response => {
               let id = response.body._id
               cy.request({
                   method: 'DELETE',
                   url: `usuarios/${id}`
               }).then((response) => {
                   expect(response.status).to.equal(200),
                   expect(response.body.message).to.equal('Registro excluído com sucesso')

     })
    })
    });
});
