# Authenticated Archive Protocol API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Data Models

### User
```typescript
interface IUser {
  userId: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  archiveSignature: string;
  createdAt: Date;
}
```

### NFT
```typescript
interface INFT {
  nftId: number;
  name: string;
  price: string;
  image: string;
  description: string;
  category: string;
}
```

### CartItem
```typescript
interface ICartItem {
  userId: number;
  nftId: number;
  quantity: number;
}
```

### Order
```typescript
interface IOrder {
  orderId: number;
  buyerId: number;
  nftId: number;
  nftName: string;
  price: string;
  status: string;
  flag?: string;
  createdAt: Date;
}
```

---

## Endpoints

### Health Check

#### GET /api/health
**Description**: Check server status and database connection
**Authentication**: None
**Response**:
```json
{
  "status": "Authenticated_Archive_Protocol v1.0",
  "db": "connected|disconnected",
  "setup_required": boolean,
  "message": "System operational.|Critical: Database connection required."
}
```

#### GET /api
**Description**: Basic server status
**Authentication**: None
**Response**:
```json
{
  "status": "Authenticated_Archive_Protocol v1.0"
}
```

---

### Authentication Routes (/api/auth)

#### POST /api/auth/register
**Description**: Register a new user
**Authentication**: None
**Request Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "archiveSignature": "string"
}
```
**Success Response** (201):
```json
{
  "token": "jwt_token",
  "userId": 100,
  "username": "username",
  "role": "user"
}
```
**Error Responses**:
- 400: Username or email already exists
- 500: Server error during registration

#### POST /api/auth/login
**Description**: Login with existing credentials
**Authentication**: None
**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```
**Success Response** (200):
```json
{
  "token": "jwt_token",
  "userId": 100,
  "username": "username",
  "role": "user",
  "hint": "Access your orders at /api/orders/{id}. Try looking for high-value transactions."
}
```
**Error Responses**:
- 401: Invalid credentials
- 500: Server error during login

---

### NFT Routes (/api/nfts)

#### GET /api/nfts
**Description**: Get all available NFTs
**Authentication**: None
**Success Response** (200):
```json
[
  {
    "nftId": 1,
    "name": "string",
    "price": "string",
    "image": "string",
    "description": "string",
    "category": "string"
  }
]
```
**Error Response**:
- 500: Error fetching NFTs

#### GET /api/nfts/:id
**Description**: Get a specific NFT by ID
**Authentication**: None
**Parameters**:
- `id` (path): NFT ID (number)
**Success Response** (200):
```json
{
  "nftId": 1,
  "name": "string",
  "price": "string",
  "image": "string",
  "description": "string",
  "category": "string"
}
```
**Error Responses**:
- 404: NFT not found
- 500: Error fetching NFT

---

### Cart Routes (/api/cart)

#### GET /api/cart
**Description**: Get current user's cart with enriched NFT data
**Authentication**: Required (Bearer token)
**Success Response** (200):
```json
[
  {
    "userId": 100,
    "nftId": 1,
    "quantity": 1,
    "nft": {
      "nftId": 1,
      "name": "string",
      "price": "string",
      "image": "string",
      "description": "string",
      "category": "string"
    }
  }
]
```
**Error Response**:
- 500: Error fetching cart

#### POST /api/cart
**Description**: Add an NFT to cart or increase quantity
**Authentication**: Required (Bearer token)
**Request Body**:
```json
{
  "nftId": "number"
}
```
**Success Response** (201):
```json
{
  "userId": 100,
  "nftId": 1,
  "quantity": 1
}
```
**Error Response**:
- 500: Error adding to cart

#### DELETE /api/cart/:nftId
**Description**: Remove an NFT from cart
**Authentication**: Required (Bearer token)
**Parameters**:
- `nftId` (path): NFT ID (number)
**Success Response** (200):
```json
{
  "message": "Item removed from cart"
}
```
**Error Response**:
- 500: Error removing from cart

---

### Order Routes (/api/orders)

#### POST /api/orders
**Description**: Create orders from cart items (rate limited)
**Authentication**: Required (Bearer token)
**Rate Limit**: 100 requests per 15 minutes
**Success Response** (201):
```json
{
  "message": "Order(s) placed successfully",
  "orders": [
    {
      "orderId": 2000,
      "buyerId": 100,
      "nftId": 1,
      "nftName": "string",
      "price": "string",
      "status": "completed",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```
**Error Responses**:
- 400: Cart is empty
- 429: Too many requests
- 500: Error processing order

#### GET /api/orders/:id
**Description**: Get order by ID ⚠️ **IDOR VULNERABLE**
**Authentication**: Required (Bearer token)
**Parameters**:
- `id` (path): Order ID (number)
**Security Note**: This endpoint has an IDOR vulnerability - it doesn't verify if the authenticated user owns the order.
**Success Response** (200):
```json
{
  "orderId": 2000,
  "buyerId": 100,
  "nftId": 1,
  "nftName": "string",
  "price": "string",
  "status": "completed",
  "flag": "flag_here_if_present",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```
**Error Responses**:
- 404: Order not found
- 500: Error fetching order

---

### User Routes (/api/users)

#### GET /api/users/:id
**Description**: Get user profile by ID ⚠️ **IDOR VULNERABLE**
**Authentication**: Required (Bearer token)
**Parameters**:
- `id` (path): User ID (number)
**Security Note**: This endpoint has an IDOR vulnerability - it doesn't verify if the authenticated user is requesting their own profile.
**Success Response** (200):
```json
{
  "userId": 100,
  "username": "string",
  "email": "string",
  "role": "user",
  "archiveSignature": "string",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```
**Error Responses**:
- 404: User not found
- 500: Error fetching user profile

#### GET /api/users/me
**Description**: Get current user's profile
**Authentication**: Required (Bearer token)
**Success Response** (200):
```json
{
  "userId": 100,
  "username": "string",
  "email": "string",
  "role": "user",
  "archiveSignature": "string",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```
**Error Response**:
- 500: Error fetching profile

---

## Security Considerations

### IDOR Vulnerabilities
The following endpoints have Insecure Direct Object Reference (IDOR) vulnerabilities:
- `GET /api/orders/:id` - Can access any user's orders
- `GET /api/users/:id` - Can access any user's profile

### Rate Limiting
Order creation is rate limited to 100 requests per 15 minutes per IP address.

### Authentication
- JWT tokens expire after 1 hour
- Default JWT secret: `super_secret_ctf_key` (should be changed in production)

## Error Response Format
All error responses follow this format:
```json
{
  "message": "Error description"
}
```

## CORS Configuration
The API accepts requests from:
- `http://localhost:3000`
- `http://localhost:5173`

Allowed methods: GET, POST, DELETE
Allowed headers: Authorization, Content-Type
