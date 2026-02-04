/**
 * Projects API Client
 */

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  fullDescription?: string;
  type: string;
  status: string;
  targetAmount?: string;
  currentAmount: string;
  irr?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  metadata?: string | Record<string, any>; // Can be JSON string or parsed object
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const response = await fetch('/api/projects');
    if (!response.ok) throw new Error('Failed to fetch projects');
    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function fetchProject(slug: string): Promise<Project | null> {
  try {
    const response = await fetch(`/api/projects/${slug}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch project');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}
