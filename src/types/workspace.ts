export type WorkspaceTheme = "purple" | "blue" | "amber";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  theme: WorkspaceTheme;
}
