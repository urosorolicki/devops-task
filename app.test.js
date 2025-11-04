const request = require('supertest');
const app = require('./app');

describe('Sum App API', () => {
    describe('GET /', () => {
        it('returns app info', async () => {
            const response = await request(app)
                .get('/')
                .expect(200);

            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('endpoints');
        });
    });

    describe('GET /add', () => {
        it('adds positive integers', async () => {
            const response = await request(app)
                .get('/add?left=5&right=2')
                .expect(200);

            expect(response.body).toEqual({ sum: 7 });
        });

        it('adds negative integers', async () => {
            const response = await request(app)
                .get('/add?left=-3&right=-4')
                .expect(200);

            expect(response.body).toEqual({ sum: -7 });
        });

        it('handles mixed positive and negative', async () => {
            const response = await request(app)
                .get('/add?left=10&right=-3')
                .expect(200);

            expect(response.body).toEqual({ sum: 7 });
        });

        it('handles zero values', async () => {
            const response = await request(app)
                .get('/add?left=0&right=5')
                .expect(200);

            expect(response.body).toEqual({ sum: 5 });
        });

        it('handles large numbers', async () => {
            const response = await request(app)
                .get('/add?left=1000000&right=2000000')
                .expect(200);

            expect(response.body).toEqual({ sum: 3000000 });
        });

        it('returns 400 for missing left parameter', async () => {
            await request(app)
                .get('/add?right=2')
                .expect(400);
        });

        it('returns 400 for missing right parameter', async () => {
            await request(app)
                .get('/add?left=5')
                .expect(400);
        });

        it('returns 400 for missing parameters', async () => {
            await request(app)
                .get('/add')
                .expect(400);
        });

        it('returns 400 for invalid parameters', async () => {
            await request(app)
                .get('/add?left=abc&right=2')
                .expect(400);
        });
    });
});