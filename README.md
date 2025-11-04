# Sum App

Simple Node.js API for adding two integers.

## API

**GET /add?left=5&right=2**

Returns: `{"sum": 7}`

## Development

```bash
npm install
npm test
npm start
```

## Docker

```bash
docker build -t sum-app .
docker run -p 3000:3000 sum-app
```

## Test

```bash
curl "http://localhost:3000/add?left=5&right=2"
```