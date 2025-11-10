# ChatVault Web - Self-hosted WhatsApp Chat Viewer

A production-ready, self-hosted web application that reproduces WhatsApp Web's chat view 100% for exported WhatsApp chats. Upload ZIP exports with media, and view them exactly as they appear in WhatsApp.

## Features

- ✅ **Exact WhatsApp Web UI** - Pixel-perfect replication of WhatsApp's interface
- 📦 **ZIP Upload** - Upload full WhatsApp exports with media
- 🔒 **Self-hosted** - All data stays on your VPS
- 👥 **Multi-user** - Secure authentication and private chats
- 📱 **Responsive** - Works on desktop and mobile
- 🌓 **Dark/Light Mode** - Full theme support
- 🔍 **Search** - Find messages across your chats
- 🖼️ **Media Support** - Images, videos, audio, documents
- ⚡ **Fast Processing** - Background job queue for large uploads

## Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Queue**: Bull + Redis
- **File Processing**: Yauzl, Sharp

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- 2GB+ RAM
- 10GB+ storage

## Installation

### 1. Clone and Install

```bash
git clone <repository>
cd chatvault-web
npm install
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb chatvault

# Create user
psql -c "CREATE USER chatvault_user WITH PASSWORD 'your_password';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE chatvault TO chatvault_user;"
```

### 3. Environment Configuration

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Run Migrations

```bash
npm run migrate
```

### 5. Start Services

```bash
# Terminal 1: API Server
npm run server

# Terminal 2: Worker (background jobs)
npm run worker

# Terminal 3: Frontend Dev Server
npm run dev
```

## Production Deployment

### Docker Compose (Recommended)

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: chatvault
      POSTGRES_USER: chatvault_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    volumes:
      - redis_data:/data

  api:
    build: .
    command: npm run server
    environment:
      - NODE_ENV=production
    volumes:
      - ./uploads:/var/www/chatvault/uploads
      - ./media:/var/www/chatvault/media
    depends_on:
      - postgres
      - redis

  worker:
    build: .
    command: npm run worker
    volumes:
      - ./uploads:/var/www/chatvault/uploads
      - ./media:/var/www/chatvault/media
    depends_on:
      - postgres
      - redis

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./dist:/usr/share/nginx/html
    depends_on:
      - api

volumes:
  postgres_data:
  redis_data:
```

## How to Use

### 1. Export WhatsApp Chat

1. Open WhatsApp on your phone
2. Go to the chat you want to export
3. Tap ⋮ (three dots) → More → Export chat
4. Select **Include Media**
5. Save the ZIP file

### 2. Upload to ChatVault

1. Log in to ChatVault
2. Click "Upload Chat"
3. Select your ZIP file
4. Wait for processing (progress shown)
5. Open and view your chat!

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Chats
- `GET /api/chats` - List user's chats
- `GET /api/chats/:id` - Get chat details
- `GET /api/chats/:id/messages` - Get messages (paginated)
- `GET /api/chats/:id/search?q=query` - Search messages
- `DELETE /api/chats/:id` - Delete chat

### Upload
- `POST /api/upload` - Upload ZIP file

### Media
- `GET /media/:userId/:chatId/:filename` - Serve media file

## Security

- Bcrypt password hashing
- JWT authentication
- Rate limiting
- CORS protection
- Helmet security headers
- User-isolated file storage
- SQL injection protection (Sequelize ORM)

## Performance

- Streaming ZIP extraction
- Background job processing
- Image thumbnail generation
- Paginated message loading
- Indexed database queries
- Redis caching for jobs

## Troubleshooting

### Upload fails
- Check file size limits in `.env`
- Ensure sufficient disk space
- Verify Redis is running

### Processing stuck
- Check worker logs: `npm run worker`
- Restart worker service
- Check Redis connection

### Media not loading
- Verify file permissions
- Check media directory paths
- Ensure authentication token is valid

## License

MIT

## Support

For issues and questions, please open a GitHub issue.
```
