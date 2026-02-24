# Guardians of Tidefall - Backend API

A robust Node.js/Express backend for the Guardians of Tidefall Web3 gaming platform.

## Features

- **Wallet Authentication**: Signature-based authentication with MetaMask integration
- **Hero Management**: Create, manage, and upgrade heroes with progression system
- **Battle System**: PvE and PvP battle mechanics with ELO ranking
- **Inventory System**: Manage artifacts and collectibles
- **Marketplace**: Buy/sell items with transaction fees
- **Guild System**: Create guilds and participate in guild wars
- **Leaderboards**: Track player rankings and statistics
- **Blockchain Integration**: ERC1155 token interactions

## Architecture

```
backend/
├── src/
│   ├── config/          # Configuration management
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, error handling
│   ├── models/          # Database models (Prisma)
│   ├── types/           # TypeScript interfaces
│   ├── utils/           # Helper functions
│   ├── lib/             # External integrations (blockchain)
│   ├── constants/       # Application constants
│   └── index.ts         # Entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── package.json
├── tsconfig.json
└── README.md
```

## Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **PostgreSQL** 12+ (or compatible database)
- **MetaMask** or similar Web3 wallet

## Installation

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/tidefall_db
JWT_SECRET=your-secret-key
POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com
FRONTEND_URL=http://localhost:5173
```

4. **Setup database**
```bash
npm run db:migrate
npm run db:seed
```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm run start
```

## API Documentation

### Authentication

#### Sign In
```http
POST /api/auth/signin
Content-Type: application/json

{
  "walletAddress": "0x...",
  "message": "...",
  "signature": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "walletAddress": "0x...",
      "username": "player_xxx"
    },
    "token": "jwt-token"
  }
}
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer {token}
```

### Users

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer {token}
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "new-username",
  "email": "email@example.com",
  "profileImage": "url",
  "bio": "My bio"
}
```

#### Get User Stats
```http
GET /api/users/stats
Authorization: Bearer {token}
```

#### Get Leaderboard
```http
GET /api/users/leaderboard?limit=100
```

#### Get Public User Profile
```http
GET /api/users/{userId}
```

### Heroes

#### Create Hero
```http
POST /api/heroes
Authorization: Bearer {token}
Content-Type: application/json

{
  "heroType": "guardian-knight",
  "name": "My Knight"
}
```

#### Get My Heroes
```http
GET /api/heroes
Authorization: Bearer {token}
```

#### Get Hero Details
```http
GET /api/heroes/{heroId}
```

#### Equip Artifact
```http
POST /api/heroes/equip
Authorization: Bearer {token}
Content-Type: application/json

{
  "heroId": "hero-id",
  "artifactId": "artifact-id"
}
```

#### Unequip Artifact
```http
POST /api/heroes/unequip
Authorization: Bearer {token}
Content-Type: application/json

{
  "heroId": "hero-id",
  "artifactId": "artifact-id"
}
```

### Battles

#### Start Battle
```http
POST /api/battles/start
Authorization: Bearer {token}
Content-Type: application/json

{
  "playerHeroId": "hero-id"
}
```

#### Get Battle History
```http
GET /api/battles/history?limit=50
Authorization: Bearer {token}
```

#### Get Battle Stats
```http
GET /api/battles/stats
Authorization: Bearer {token}
```

#### Get Recent Battles
```http
GET /api/battles/recent?limit=100
```

#### Get Battle Details
```http
GET /api/battles/{battleId}
```

## Database Schema

### Core Models

- **User**: Player accounts with wallet authentication
- **Hero**: Character entities with stats and progression
- **Artifact**: Equipment/items with rarity and bonuses
- **Battle**: Battle records with results and rewards
- **InventoryItem**: Player item ownership
- **Guild**: Guild/clan management
- **GuildMember**: Guild membership tracking
- **Marketplace**: Item trading platform
- **AuditLog**: System action logging

## Services

### UserService
- User authentication and profile management
- Leaderboard generation
- Statistics calculation

### HeroService
- Hero creation and management
- Stat progression and leveling
- Artifact equipping

### BattleService
- PvE battle simulation
- ELO rating calculations
- Reward distribution

### ArtifactService
- Artifact generation and management
- Rarity distribution
- Marketplace listing

## Middleware

### Authentication (`authMiddleware`)
- JWT token validation
- User identification
- Request context enrichment

### Error Handling (`errorHandler`)
- Global error catching
- Standardized error responses
- Logging

## Development

### Run Tests
```bash
npm run test
```

### Run Linting
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

### Generate Prisma Client
```bash
npm run db:generate
```

### Open Prisma Studio
```bash
npm run db:studio
```

## Blockchain Integration

The backend supports ERC1155 token interactions for:
- **Artifacts**: In-game collectible items
- **Heroes**: Character NFTs (future)
- **Tide Shards**: Currency/rewards

### Smart Contract Interaction
Located in `src/lib/blockchain.ts`:
- `initializeBlockchain()`: Initialize Web3 provider
- `mintArtifact()`: Mint ERC1155 tokens
- `getArtifactBalance()`: Check token balance
- `verifyWalletSignature()`: Validate signatures

## Error Handling

Custom error classes in `src/utils/errors.ts`:
- `ValidationError` (400)
- `AuthenticationError` (401)
- `AuthorizationError` (403)
- `NotFoundError` (404)
- `ConflictError` (409)
- `InternalServerError` (500)

## Extensibility

The backend is designed for easy extension:

### Adding New Features

1. **Create Service**: `src/services/YourService.ts`
2. **Create Controller**: `src/controllers/YourController.ts`
3. **Create Routes**: `src/routes/your.routes.ts`
4. **Update Prisma Schema**: `prisma/schema.prisma`
5. **Add to index.ts**: Import and register routes

### Example: Adding Guild Wars
```typescript
// Create GuildWarService
export class GuildWarService {
  async startWar(guildId1: string, guildId2: string) {
    // Implementation
  }
}

// Create GuildWarController
export class GuildWarController {
  async startWar(req: Request, res: Response) {
    // Request handling
  }
}

// Create guildWar.routes.ts
// Register in index.ts: app.use('/api/guild-wars', guildWarRoutes);
```

## Performance Optimization

- Database indexing on frequently queried fields
- Pagination support on large result sets
- Caching strategy (can add Redis)
- Connection pooling with Prisma

## Security Considerations

- **JWT Authentication**: Secure token-based authentication
- **Wallet Signature Verification**: Prevent unauthorized access
- **Input Validation**: Joi schema validation
- **CORS Protection**: Origin-based access control
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **Rate Limiting**: Can be added with express-rate-limit

## Deployment

### To Production
1. Set `NODE_ENV=production`
2. Update database connection string
3. Set strong `JWT_SECRET`
4. Deploy to hosting platform (Heroku, Railway, Render, etc.)

## Troubleshooting

### Database Connection Issues
```bash
# Check DATABASE_URL format
# Ensure PostgreSQL is running
# Verify credentials and permissions
```

### Blockchain Connection Issues
```bash
# Check RPC endpoint URLs
# Verify contract addresses
# Ensure wallet has sufficient balance for gas
```

### JWT Token Issues
```bash
# Verify JWT_SECRET is set
# Check token expiration
# Ensure Bearer prefix in Authorization header
```

## Contributing

1. Create feature branches
2. Follow TypeScript strict mode
3. Add error handling
4. Test all endpoints
5. Update documentation

## License

Proprietary - Guardians of Tidefall

## Support

For issues or questions:
- Check logs in `logs/` directory
- Review API documentation
- Consult technical review document
