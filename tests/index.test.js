import test from 'ava';
const request = require('supertest');
const app = require('./../app.js');


test('check status', async t => {
  const response = await request(app)
    .get('/');
  t.is(response.status, 200);
  t.deepEqual(response.body, {
    status: 'Ok'
  });
})

test("Don't send email in sign", async t => {
  const password = 'some-hase'
  const response = await request(app)
    .post('/signin')
    .send({ password });

  t.is(response.status, 400);
  t.is(response.body.message, 'Parameters are missing.!!!');
})

test("Don't send password", async t => {
  const email = 'ahmedsaboorkhan@gmail.com'
  const response = await request(app)
    .post('/signin')
    .send({ email });

  t.is(response.status, 400);
  t.is(response.body.message, 'Parameters are missing.!!!');
})

test("sign in", async t => {
  const emailPassword  = { password:'saboor123',
    email:'ahmedsaboor+5@gmail.com' };
  const response = await request(app)
    .post('/signin')
    .send(emailPassword);

  t.is(response.status, 200);
  t.is(response.body.message, 'User sign in sucessfully.');
})

test("sign up", async t => {
  const emailPassword  = { username:'ahmedsaboorkhan', password:'saboor123',
    email:'ahmedsaboor+5@gmail.com' };
  const response = await request(app)
    .post('/signup')
    .send(emailPassword);

  t.is(response.status, 400);
  t.is(response.body.message, 'The email address is already in use by another account.');
})