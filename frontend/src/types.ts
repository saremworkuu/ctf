// ─── Frontend-only types (static data) ───────────────────────────────────────
export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  owner: string;
  collection: string;
  metadata: {
    dna: string;
    edition: number;
    date: number;
    attributes: { trait_type: string; value: string | number }[];
  };
}

export type Theme = "dark" | "light";

// ─── Backend API types (matching api.md models) ───────────────────────────────

export interface ApiNFT {
  nftId: number;
  name: string;
  price: string;
  image: string;
  description: string;
  category: string;
}

export interface ApiCartItem {
  userId: number;
  nftId: number;
  quantity: number;
  nft?: ApiNFT;
}

export interface ApiOrder {
  orderId: number;
  buyerId: number;
  nftId: number;
  nftName: string;
  price: string;
  status: string;
  flag?: string;
  createdAt: string;
}

export interface ApiUser {
  userId: number;
  username: string;
  email: string;
  role: "admin" | "user";
  archiveSignature: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  username: string;
  role: "admin" | "user";
  hint?: string;
}
