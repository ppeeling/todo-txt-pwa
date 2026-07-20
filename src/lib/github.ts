import { Octokit } from "octokit";

export interface SyncConfig {
  token: string;
  owner: string;
  repo: string;
  branch?: string;
}

export interface FileState {
  content: string[];
  sha: string | null;
}

export class GitHubSync {
  private octokit: Octokit | null = null;
  private config: SyncConfig | null = null;

  setConfig(config: SyncConfig) {
    this.config = config;
    this.octokit = new Octokit({ auth: config.token });
  }

  async fetchFile(path: string): Promise<FileState> {
    if (!this.octokit || !this.config) throw new Error("Not configured");
    
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: this.config.owner,
        repo: this.config.repo,
        path: path,
        ref: this.config.branch || 'main'
      });

      if (!Array.isArray(response.data) && response.data.type === 'file' && response.data.content) {
        // Content is base64 encoded
        const contentStr = decodeURIComponent(escape(atob(response.data.content)));
        return {
          content: contentStr.split('\n').filter(line => line.trim() !== ''),
          sha: response.data.sha
        };
      }
      throw new Error("Not a valid file");
    } catch (e: any) {
      if (e.status === 404) {
        return { content: [], sha: null };
      }
      throw e;
    }
  }

  async saveFile(path: string, content: string[], sha: string | null, message: string = "Update via todo.txt PWA"): Promise<string> {
    if (!this.octokit || !this.config) throw new Error("Not configured");
    
    const contentStr = content.join('\n');
    const contentBase64 = btoa(unescape(encodeURIComponent(contentStr)));

    const params: any = {
      owner: this.config.owner,
      repo: this.config.repo,
      path: path,
      message: message,
      content: contentBase64,
      branch: this.config.branch || 'main'
    };

    if (sha) {
      params.sha = sha;
    }

    const response = await this.octokit.rest.repos.createOrUpdateFileContents(params);
    return response.data.content!.sha!;
  }
}
