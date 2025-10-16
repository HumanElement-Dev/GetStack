import { type User, type InsertUser, type DetectionRequest, type InsertDetectionRequest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createDetectionRequest(request: InsertDetectionRequest): Promise<DetectionRequest>;
  getDetectionRequest(id: string): Promise<DetectionRequest | undefined>;
  getDetectionRequestsByDomain(domain: string): Promise<DetectionRequest[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private detectionRequests: Map<string, DetectionRequest>;

  constructor() {
    this.users = new Map();
    this.detectionRequests = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createDetectionRequest(insertRequest: InsertDetectionRequest): Promise<DetectionRequest> {
    const id = randomUUID();
    const request: DetectionRequest = {
      domain: insertRequest.domain,
      cmsType: insertRequest.cmsType ?? null,
      isWordPress: insertRequest.isWordPress ?? null,
      wordPressVersion: insertRequest.wordPressVersion ?? null,
      theme: insertRequest.theme ?? null,
      pluginCount: insertRequest.pluginCount ?? null,
      plugins: insertRequest.plugins ?? null,
      technologies: insertRequest.technologies ?? null,
      error: insertRequest.error ?? null,
      id,
      createdAt: new Date(),
    };
    this.detectionRequests.set(id, request);
    return request;
  }

  async getDetectionRequest(id: string): Promise<DetectionRequest | undefined> {
    return this.detectionRequests.get(id);
  }

  async getDetectionRequestsByDomain(domain: string): Promise<DetectionRequest[]> {
    return Array.from(this.detectionRequests.values()).filter(
      (request) => request.domain.toLowerCase().includes(domain.toLowerCase())
    );
  }
}

export const storage = new MemStorage();
