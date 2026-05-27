declare module "@prisma/client" {
  export class PrismaClient {
    constructor(options?: {
      log?: ("query" | "error" | "warn")[];
    });
    
    users: any;
    workspaces: any;
    notes: any;
    chatSessions: any;
    messages: any;
    analyticsSnapshots: any;
  }
}
