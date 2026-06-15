Nexture — Order pipeline (Backend)
=================================

This folder contains the Node.js backend for the Nexture project. It includes an order processing pipeline that saves orders to MongoDB, publishes order messages to RabbitMQ, and consumes them with an email worker that sends confirmation emails using Nodemailer.

Quick run (Docker Compose)
---------------------------
This will start MongoDB and RabbitMQ, build the API and worker images, and run them.

1. Create or update `.env` from `.env.example` if you need real SMTP credentials.

2. Build and start all services:

```bash
cd "Admin Panel/Sem 49 - Copy/Sem 4/Node js"
docker compose up -d --build
```

3. API will be available on host port `6501` (container listens on `6500`).

Test with curl (example):

```bash
curl -X POST http://localhost:6501/api/orders \
  -H "Content-Type: application/json" \
  -d @test_payload.json
```

Postman / Testing
------------------
- POST `http://localhost:6501/api/orders` with the JSON in `test_payload.json`.
- Expected response: `201 Created` and `{ order: ..., queuePublished: true }`.

Verify pipeline
---------------
- MongoDB: connect to `mongodb://localhost:27017` and check `NextureDB.orders`.
- RabbitMQ management UI: `http://localhost:15672` (guest/guest) — check `order_email_queue`.
- Email: if SMTP not configured, worker uses Ethereal and prints a preview URL in logs.

Admin endpoints (inspect failed emails)
--------------------------------------
- GET `/api/emails/failed` — list persisted failed email jobs.
- POST `/api/emails/retry/:id` — retry a failed email (removes record on success).

Notes
-----
- The Docker Compose file exposes the API on `6501` to avoid local dev port conflicts — change the mapping if you prefer `6500` and stop any local `npm run dev` server first.
- Failed email attempts are persisted into `FailedEmail` collection for manual inspection and retry.
