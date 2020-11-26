const chai = require ('chai');
const chaiHttp = require('chai-http')
const server = require('../index.js');
const chaiTesterAuthToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmJlNzM3YWEzYTY2YjRlNzBiZjM5NTQiLCJpYXQiOjE2MDYzMTY5NDd9.t0T4vVefYSOfYLQ4t7iSrWpO4em3C8WlAlpbmUAio3s'

//assertion --
chai.should();

chai.use(chaiHttp);


describe('Money API', () => {

  
  describe('GET /api/money with token', () => {
    it('It should return an object with status 200', (done) => {
      chai.request(server)
        .get('/api/money/')
        .set({ 'auth-token': chaiTesterAuthToken })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('income');
          response.body.should.have.property('expenses');
          response.body.income.should.be.a('array');
          response.body.expenses.should.be.a('array');
        done();
        })
    } )
  })

  describe('GET /api/money without token', () => {
    it('It should return nothing with status 401', (done) => {
      chai.request(server)
        .get('/api/money')
        .end((error, response) => {
          response.should.have.status(401);
          response.error.text.should.be.a('string');
          response.error.text.should.be.eq('Access denied!')
        done();
        })
    } )
  })

  describe('GET /api/moneys (faulty url)', () => {
    it('It should status 404', (done) => {
      chai.request(server)
        .get('/api/moneys')
        .end((error, response) => {
          response.should.have.status(404);
        done();
        })
    } )
  })


  //Get specific income-entry
  describe('GET /api/money/income/:id', () => {
    it('It should return a specific income entry by id', (done) => {
      const entryId = 'ircm4iv';
      chai.request(server)
        .get(`/api/money/income/${entryId}`)
        .set({ 'auth-token': chaiTesterAuthToken })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object')
          response.body.should.have.property('id');
          response.body.id.should.eq(entryId);
          response.body.should.have.property('account');
          response.body.account.should.eq('income');
          response.body.should.have.property('title');
          response.body.should.have.property('desc');
          response.body.should.have.property('amount');
          response.body.should.have.property('currency');
          response.body.should.have.property('type');
          response.body.should.have.property('date');
        done();
        })
    } )
  })

  //get specific expense-entry
  describe('GET /api/money/expense/:id', () => {
    it('It should return a specific income entry by id', (done) => {
      const entryId = 'nwe0vlo';
      chai.request(server)
        .get(`/api/money/expense/${entryId}`)
        .set({ 'auth-token': chaiTesterAuthToken })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object')
          response.body.should.have.property('id');
          response.body.id.should.eq(entryId);
          response.body.should.have.property('account');
          response.body.account.should.eq('expense');
          response.body.should.have.property('title');
          response.body.should.have.property('desc');
          response.body.should.have.property('amount');
          response.body.should.have.property('currency');
          response.body.should.have.property('type');
          response.body.should.have.property('date');
        done();
        })
    } )
  })
  //Get specific income-entry without token
  describe('GET /api/money/income without token', () => {
    it('It should return "access denied" with status 401', (done) => {
      const entryId = 'ircm4iv';
      chai.request(server)
        .get(`/api/money/income/${entryId}`)
        .end((error, response) => {
          response.should.have.status(401);
          response.error.text.should.be.a('string');
          response.error.text.should.be.eq('Access denied!')
        done();
        })
    } )
  })
    //Get specific expense-entry without token
  describe('GET /api/money/expense without token', () => {
    it('It should return "access denied" with status 401', (done) => {
      const entryId = 'nwe0vlo';
      chai.request(server)
        .get(`/api/money/expense/${entryId}`)
        .end((error, response) => {
          response.should.have.status(401);
          response.error.text.should.be.a('string');
          response.error.text.should.be.eq('Access denied!')
        done();
        })
    } )
  })

  //Get specific expense-entry with invalid id
  describe('GET /api/money/expense with invalid id', () => {
    it('It should return "no entry found" with status 400', (done) => {
      const entryId = 'incorrectId';
      chai.request(server)
        .get(`/api/money/expense/${entryId}`)
        .set({ 'auth-token': chaiTesterAuthToken })
        .end((error, response) => {
          response.should.have.status(400);
          response.error.text.should.be.a('string');
          response.error.text.should.be.eq('no entry found')
        done();
        })
    } )
  })

  //Get specific income-entry with invalid id
  describe('GET /api/money/income with invalid id', () => {
    it('It should return "no entry found" with status 400', (done) => {
      const entryId = 'incorrectId';
      chai.request(server)
        .get(`/api/money/income/${entryId}`)
        .set({ 'auth-token': chaiTesterAuthToken })
        .end((error, response) => {
          response.should.have.status(400);
          response.error.text.should.be.a('string');
          response.error.text.should.be.eq('no entry found')
        done();
        })
    } )
  })
  //Post new income
  describe('POST /api/money/add', () => {
    it('It should post a new entry to income', (done) => {
      const newEntry = {
        id: 'testId', 
        account: 'income', 
        title: 'testTitle', 
        desc: 'testDesc', 
        amount: '33', 
        currency: 'EUR', 
      }
      chai.request(server)
        .post('/api/money/add/')
        .set({ 'auth-token': chaiTesterAuthToken })
        .send(newEntry)
        .end((error, response) => {
          console.log(response.text)
          response.should.have.status(200);
          response.text.should.be.a('string')
          response.text.should.eq('New post added to user income-account')
        done();
        })
    } )
  })

  //Post new expense
  describe('POST /api/money/add', () => {
    it('It should post a new entry to expenses', (done) => {
      const newEntry = {
        id: 'testId', 
        account: 'expense', 
        title: 'testTitle', 
        desc: 'testDesc', 
        amount: '33', 
        currency: 'EUR', 
      }
      chai.request(server)
        .post('/api/money/add/')
        .set({ 'auth-token': chaiTesterAuthToken })
        .send(newEntry)
        .end((error, response) => {
          console.log(response.text)
          response.should.have.status(200);
          response.text.should.be.a('string')
          response.text.should.eq('New post added to user expense-account')
        done();
        })
    } )
  })

  //Edit income
  describe('POST /api/money/update/:account', () => {
    it('It should post a new entry to expenses', (done) => {
      const account = 'income'
      const newEntry = {
        id: 'testId', 
        account: 'income', 
        title: 'testTitle', 
        desc: 'testDesc', 
        amount: '33', 
        currency: 'EUR', 
      }
      chai.request(server)
        .post(`/api/money/update/${account}`)
        .set({ 'auth-token': chaiTesterAuthToken })
        .send(newEntry)
        .end((error, response) => {
          console.log(response.text)
          response.should.have.status(200);
          response.text.should.be.a('string')
          response.text.should.eq('post updated')
        done();
        })
    } )
  })
  
  //Edit expense
  describe('POST /api/money/update/:account', () => {
    it('It should post a new entry to expenses', (done) => {
      const account = 'expense'
      const newEntry = {
        id: 'testId', 
        account: 'expense', 
        title: 'testTitle', 
        desc: 'testDesc', 
        amount: '33', 
        currency: 'EUR', 
      }
      chai.request(server)
        .post(`/api/money/update/${account}`)
        .set({ 'auth-token': chaiTesterAuthToken })
        .send(newEntry)
        .end((error, response) => {
          console.log(response.text)
          response.should.have.status(200);
          response.text.should.be.a('string')
          response.text.should.eq('post updated')
        done();
        })
    } )
  })
  // delete expense
  describe('POST /api/money/delete', () => {
    it('It should post a new entry to expenses', (done) => {
      const entryToDelete = {
        id: 'testId', 
        account: 'expense', 
      }
      chai.request(server)
        .post('/api/money/delete/')
        .set({ 'auth-token': chaiTesterAuthToken })
        .send(entryToDelete)
        .end((error, response) => {
          console.log(response.text)
          response.should.have.status(200);
          response.text.should.be.a('string')
          response.text.should.eq('Post with ID testId deleted')
        done();
        })
    } )
  })
  //delete income entry
  describe('POST /api/money/delete', () => {
    it('It should post a new entry to expenses', (done) => {
      const entryToDelete = {
        id: 'testId', 
        account: 'income', 
      }
      chai.request(server)
        .post('/api/money/delete/')
        .set({ 'auth-token': chaiTesterAuthToken })
        .send(entryToDelete)
        .end((error, response) => {
          console.log(response.text)
          response.should.have.status(200);
          response.text.should.be.a('string')
          response.text.should.eq('Post with ID testId deleted')
        done();
        })
    } )
  })



});

