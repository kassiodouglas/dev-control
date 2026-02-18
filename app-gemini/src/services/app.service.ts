import { Injectable, signal, computed, effect } from '@angular/core';
import { GoogleGenAI, Type } from "@google/genai";

export interface SavedCommand {
  id: string;
  name: string;
  command: string;
}

export interface AppLog {
  timestamp: Date;
  message: string;
  type: 'info' | 'error' | 'success' | 'command';
}

export interface LocalApp {
  id: string;
  name: string;
  path: string;
  host: string;
  port: number;
  startCommand: string;
  branch: string;
  availableBranches: string[];
  status: 'running' | 'stopped' | 'error';
  notes: string;
  savedCommands: SavedCommand[];
  logs: AppLog[];
}

export interface GlobalNote {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
  email: string;
}

export interface SecurityConfig {
  isEnabled: boolean;
  password?: string;
  isLocked: boolean;
}

export interface IntegrationConfig {
  geminiApiKey: string;
  azureToken: string;
  azureOrg: string;
  azureProject: string;
}

export interface AzureWorkItem {
  id: number;
  title: string;
  description: string;
  state: string;
  assignedTo: string;
  avatarUrl?: string;
  type: string;
  url: string;
  completedWork?: number; // Added field for hours worked
}

export interface AISuggestion {
  title: string;
  type: 'Task' | 'Bug';
}

export interface AICacheEntry {
  summary: string | null;
  suggestions: AISuggestion[] | null;
}

export type ViewMode = 'dashboard' | 'app-detail' | 'notes' | 'settings' | 'azure-devops';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private STORAGE_KEY = 'dev_control_hub_data_v1';

  // System State
  isConfigured = signal<boolean>(false); // Determines if Setup Wizard should run

  // UI State
  sidebarCollapsed = signal<boolean>(false);

  // Theme Management
  darkMode = signal<boolean>(false);

  // User Profile
  userProfile = signal<UserProfile>({
    name: 'Dev User',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    email: 'dev@local.host'
  });

  // Security
  security = signal<SecurityConfig>({
    isEnabled: false,
    password: '',
    isLocked: false
  });

  // Integrations
  integrations = signal<IntegrationConfig>({
    geminiApiKey: '',
    azureToken: '',
    azureOrg: '',
    azureProject: ''
  });

  // Azure Data
  azureWorkItems = signal<AzureWorkItem[]>([]);
  azureChildrenItems = signal<AzureWorkItem[]>([]);
  isLoadingAzure = signal<boolean>(false);
  isLoadingChildren = signal<boolean>(false);
  azureError = signal<string | null>(null);

  // Mappings: Work Item ID (number) -> App ID (string)
  linkedWorkItems = signal<Record<number, string>>({});

  // AI Cache
  aiCache = signal<Record<number, AICacheEntry>>({});

  // Initial Mock Data for Apps
  private initialApps: LocalApp[] = [
    {
      id: '1',
      name: 'E-commerce Frontend',
      path: 'C:\\Users\\Dev\\Projects\\ecommerce-web',
      host: 'localhost',
      port: 4200,
      startCommand: 'npm run start',
      branch: 'main',
      availableBranches: ['main', 'develop', 'feature/cart-update', 'fix/login-bug'],
      status: 'running',
      notes: '# To-Do\n- Fix header alignment\n- Update dependencies',
      savedCommands: [
        { id: 'c1', name: 'Start Dev Server', command: 'npm run start' },
        { id: 'c2', name: 'Build Prod', command: 'npm run build:prod' },
        { id: 'c3', name: 'Lint', command: 'npm run lint' }
      ],
      logs: []
    },
    {
      id: '2',
      name: 'Backend API Service',
      path: 'C:\\Users\\Dev\\Projects\\api-service',
      host: 'localhost',
      port: 3000,
      startCommand: 'docker-compose up -d',
      branch: 'develop',
      availableBranches: ['main', 'develop', 'feature/auth-v2'],
      status: 'stopped',
      notes: 'Remember to set ENV variables before starting.',
      savedCommands: [
        { id: 'c1', name: 'Docker Up', command: 'docker-compose up -d' },
        { id: 'c2', name: 'Migrate DB', command: 'npm run typeorm migration:run' }
      ],
      logs: []
    }
  ];

  // Initial Mock Data for Notes
  private initialNotes: GlobalNote[] = [
    {
      id: 'n1',
      title: 'Ideas for next release',
      content: '- Dark mode support\n- Better mobile responsiveness\n- Add user avatars',
      updatedAt: new Date()
    },
    {
      id: 'n2',
      title: 'Meeting Minutes',
      content: '# Weekly Sync\n\n- Discussed Q3 goals\n- **Action item**: Update documentation',
      updatedAt: new Date(Date.now() - 86400000)
    }
  ];

  // Signals
  apps = signal<LocalApp[]>(this.initialApps);
  globalNotes = signal<GlobalNote[]>(this.initialNotes);
  
  selectedAppId = signal<string | null>(null);
  activeView = signal<ViewMode>('dashboard');

  // Computed
  selectedApp = computed(() => 
    this.apps().find(app => app.id === this.selectedAppId()) || null
  );

  runningAppsCount = computed(() => 
    this.apps().filter(a => a.status === 'running').length
  );

  constructor() {
    this.loadFromStorage();
    
    // Theme effect
    effect(() => {
      const isDark = this.darkMode();
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      this.saveToStorage();
    });

    // Auto-save effect
    effect(() => {
       // Just accessing signals to track dependencies for effect
       this.userProfile();
       this.security();
       this.integrations();
       this.apps();
       this.globalNotes();
       this.linkedWorkItems(); 
       this.sidebarCollapsed();
       this.isConfigured(); 
       
       this.saveToStorage();
    });
  }

  toggleTheme() {
    this.darkMode.update(val => !val);
  }

  toggleSidebar() {
    this.sidebarCollapsed.update(val => !val);
  }

  completeSetup() {
    this.isConfigured.set(true);
  }

  // Storage Management
  private saveToStorage() {
    const data = {
      isConfigured: this.isConfigured(),
      darkMode: this.darkMode(),
      sidebarCollapsed: this.sidebarCollapsed(),
      userProfile: this.userProfile(),
      security: this.security(),
      integrations: this.integrations(),
      apps: this.apps(),
      globalNotes: this.globalNotes(),
      linkedWorkItems: this.linkedWorkItems()
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  private loadFromStorage() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.isConfigured.set(data.isConfigured ?? false);
        this.darkMode.set(data.darkMode ?? false);
        this.sidebarCollapsed.set(data.sidebarCollapsed ?? false);
        this.userProfile.set(data.userProfile ?? this.userProfile());
        this.integrations.set(data.integrations ?? this.integrations());
        
        const savedSecurity = data.security ?? this.security();
        if (savedSecurity.isEnabled) {
          savedSecurity.isLocked = true;
        }
        this.security.set(savedSecurity);

        if (data.apps && data.apps.length > 0) this.apps.set(data.apps);
        if (data.globalNotes) this.globalNotes.set(data.globalNotes);
        if (data.linkedWorkItems) this.linkedWorkItems.set(data.linkedWorkItems);
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    }
  }

  // Navigation
  setView(view: ViewMode) {
    this.activeView.set(view);
    if (view !== 'app-detail') {
      this.selectedAppId.set(null);
    }
  }

  selectApp(id: string) {
    this.selectedAppId.set(id);
    this.setView('app-detail');
  }

  // User Profile
  updateProfile(name: string, avatarUrl: string, email: string) {
    this.userProfile.set({ name, avatarUrl, email });
  }

  // Integrations
  updateIntegrations(config: IntegrationConfig) {
    this.integrations.set(config);
  }

  // --- GEMINI AI INTEGRATION ---

  clearAICache(id: number) {
    this.aiCache.update(cache => {
      const newCache = { ...cache };
      delete newCache[id];
      return newCache;
    });
  }

  async generateSummary(item: AzureWorkItem): Promise<string> {
    const cached = this.aiCache()[item.id]?.summary;
    if (cached) return cached;

    // Use environment variable if available, otherwise fall back to user settings
    const apiKey = process.env['API_KEY'] || this.integrations().geminiApiKey;
    if (!apiKey) throw new Error('Gemini API Key missing');

    const ai = new GoogleGenAI({ apiKey });
    
    // Clean description (remove HTML tags roughly)
    const cleanDesc = item.description.replace(/<[^>]*>/g, ' ');

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Summarize this User Story for a developer. Keep it under 50 words. Focus on technical requirements.\n\nTitle: ${item.title}\nDescription: ${cleanDesc}`,
      });

      const summary = response.text || 'Could not generate summary.';
      
      this.aiCache.update(c => ({
        ...c,
        [item.id]: { ...c[item.id], summary }
      }));

      return summary;
    } catch (e) {
      console.error('AI Summary Error', e);
      throw new Error('Failed to generate summary.');
    }
  }

  async generateSuggestions(item: AzureWorkItem): Promise<AISuggestion[]> {
    const cached = this.aiCache()[item.id]?.suggestions;
    if (cached) return cached;

    const apiKey = process.env['API_KEY'] || this.integrations().geminiApiKey;
    if (!apiKey) throw new Error('Gemini API Key missing');

    const ai = new GoogleGenAI({ apiKey });
    
    // Clean description
    const cleanDesc = item.description.replace(/<[^>]*>/g, ' ');

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze this User Story. List 3 to 5 technical Tasks and potential edge-case Bugs that should be created to complete this story.\n\nTitle: ${item.title}\nDescription: ${cleanDesc}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["Task", "Bug"] }
              },
              required: ["title", "type"]
            }
          }
        }
      });

      const json = JSON.parse(response.text.trim());
      
      this.aiCache.update(c => ({
        ...c,
        [item.id]: { ...c[item.id], suggestions: json }
      }));

      return json;
    } catch (e) {
      console.error('AI Suggestions Error', e);
      throw new Error('Failed to generate suggestions.');
    }
  }

  // --- AZURE DEVOPS LOGIC ---

  linkWorkItemToApp(workItemId: number, appId: string | null) {
      this.linkedWorkItems.update(links => {
          const newLinks = { ...links };
          if (appId) {
              newLinks[workItemId] = appId;
          } else {
              delete newLinks[workItemId];
          }
          return newLinks;
      });
  }

  async fetchAzureUserStories() {
    const config = this.integrations();
    
    // DEMO MODE: If no token, load Mock Data immediately
    if (!config.azureToken) {
      this.loadMockAzureData();
      return;
    }

    if (!config.azureOrg || !config.azureProject) {
      this.azureError.set('Configuration missing. Please check Settings.');
      return;
    }

    this.isLoadingAzure.set(true);
    this.azureError.set(null);

    try {
      // 1. WIQL Query to get IDs
      const query = `
        SELECT [System.Id]
        FROM WorkItems
        WHERE [System.WorkItemType] = 'User Story'
        AND [System.State] <> 'Closed'
        AND [System.State] <> 'Removed'
        AND [System.State] <> 'Canceled'
        ORDER BY [System.CreatedDate] DESC
      `;

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(':' + config.azureToken)
      };

      const wiqlUrl = `https://dev.azure.com/${config.azureOrg}/${config.azureProject}/_apis/wit/wiql?api-version=6.0`;
      
      const wiqlResponse = await fetch(wiqlUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ query: query })
      });

      if (!wiqlResponse.ok) throw new Error(`Azure API Error: ${wiqlResponse.statusText}`);

      const wiqlData = await wiqlResponse.json();
      const workItems = wiqlData.workItems || [];
      const ids = workItems.map((wi: any) => wi.id).slice(0, 20); // Limit to 20 for perf

      if (ids.length === 0) {
        this.azureWorkItems.set([]);
        this.isLoadingAzure.set(false);
        return;
      }

      // 2. Batch Get Details
      const batchUrl = `https://dev.azure.com/${config.azureOrg}/${config.azureProject}/_apis/wit/workitems?ids=${ids.join(',')}&fields=System.Id,System.Title,System.State,System.AssignedTo,System.WorkItemType,System.Description&api-version=6.0`;
      
      const batchResponse = await fetch(batchUrl, { headers: headers });
      if (!batchResponse.ok) throw new Error('Failed to fetch work item details');

      const batchData = await batchResponse.json();
      
      const items: AzureWorkItem[] = batchData.value.map((item: any) => ({
        id: item.id,
        title: item.fields['System.Title'],
        description: item.fields['System.Description'] || 'No description provided.',
        state: item.fields['System.State'],
        assignedTo: item.fields['System.AssignedTo']?.displayName || 'Unassigned',
        avatarUrl: item.fields['System.AssignedTo']?.imageUrl || '',
        type: item.fields['System.WorkItemType'],
        url: item._links?.html?.href || '#'
      }));

      this.azureWorkItems.set(items);

    } catch (error: any) {
      console.error('Azure Fetch Error', error);
      this.azureError.set(error.message || 'Failed to connect to Azure DevOps.');
      
      // Fallback for Demo if connection fails
      if (error.message.includes('Failed to fetch') || error.message.includes('401')) {
         this.azureError.set('Connection failed. Showing DEMO data.');
         this.loadMockAzureData();
      }
    } finally {
      this.isLoadingAzure.set(false);
    }
  }

  // Fetch single work item (Task/Bug) full details
  async fetchWorkItemDetails(id: number): Promise<AzureWorkItem | null> {
    
    // Check Mock Data First
    const mockItem = this.getMockItemById(id);
    if (mockItem) return mockItem;

    const config = this.integrations();
    if (!config.azureToken) return null;

    try {
       const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(':' + config.azureToken)
      };
      
      const url = `https://dev.azure.com/${config.azureOrg}/${config.azureProject}/_apis/wit/workitems/${id}?fields=System.Id,System.Title,System.State,System.AssignedTo,System.WorkItemType,System.Description,Microsoft.VSTS.Scheduling.CompletedWork&api-version=6.0`;
      const response = await fetch(url, { headers });
      
      if (!response.ok) throw new Error('Failed to fetch item details');
      const item = await response.json();

      return {
        id: item.id,
        title: item.fields['System.Title'],
        description: item.fields['System.Description'] || 'No description provided.',
        state: item.fields['System.State'],
        assignedTo: item.fields['System.AssignedTo']?.displayName || 'Unassigned',
        avatarUrl: item.fields['System.AssignedTo']?.imageUrl || '',
        type: item.fields['System.WorkItemType'],
        url: item._links?.html?.href || '#',
        completedWork: item.fields['Microsoft.VSTS.Scheduling.CompletedWork']
      };
    } catch (e) {
      console.error('Error fetching detail', e);
      return null;
    }
  }

  async fetchWorkItemChildren(parentId: number) {
    const config = this.integrations();
    
    // Use Mock Children if no token or if parent is a mock ID (1000-9999 range used for mocks)
    if (!config.azureToken || (parentId >= 1000 && parentId < 10000)) {
        this.loadMockChildren(parentId);
        return;
    }

    this.isLoadingChildren.set(true);
    this.azureChildrenItems.set([]);

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(':' + config.azureToken)
      };

      // 1. Get Relations
      const relationsUrl = `https://dev.azure.com/${config.azureOrg}/${config.azureProject}/_apis/wit/workitems/${parentId}?$expand=relations&api-version=6.0`;
      
      const response = await fetch(relationsUrl, { headers });
      if(!response.ok) throw new Error('Failed to fetch relations');
      
      const data = await response.json();
      
      // Filter for children links (Hierarchy-Forward)
      const childrenLinks = data.relations?.filter((r: any) => r.rel === 'System.LinkTypes.Hierarchy-Forward') || [];
      
      if (childrenLinks.length === 0) {
        this.isLoadingChildren.set(false);
        return;
      }

      const childIds = childrenLinks.map((r: any) => {
          const urlParts = r.url.split('/');
          return urlParts[urlParts.length - 1];
      });

      // 2. Batch Get Child Details
       const batchUrl = `https://dev.azure.com/${config.azureOrg}/${config.azureProject}/_apis/wit/workitems?ids=${childIds.join(',')}&fields=System.Id,System.Title,System.State,System.AssignedTo,System.WorkItemType,System.Description,Microsoft.VSTS.Scheduling.CompletedWork&api-version=6.0`;
      
      const batchResponse = await fetch(batchUrl, { headers });
      if (!batchResponse.ok) throw new Error('Failed to fetch child details');

      const batchData = await batchResponse.json();
      
      const items: AzureWorkItem[] = batchData.value.map((item: any) => ({
        id: item.id,
        title: item.fields['System.Title'],
        description: item.fields['System.Description'] || '',
        state: item.fields['System.State'],
        assignedTo: item.fields['System.AssignedTo']?.displayName || 'Unassigned',
        avatarUrl: item.fields['System.AssignedTo']?.imageUrl || '',
        type: item.fields['System.WorkItemType'],
        url: item._links?.html?.href || '#',
        completedWork: item.fields['Microsoft.VSTS.Scheduling.CompletedWork']
      }));

      this.azureChildrenItems.set(items);

    } catch (e) {
      console.error('Error fetching children', e);
    } finally {
      this.isLoadingChildren.set(false);
    }
  }

  // --- MOCK DATA GENERATORS ---

  private loadMockAzureData() {
    const mockStories: AzureWorkItem[] = [
      {
        id: 1001,
        title: 'Implement Dark Mode for Dashboard',
        description: 'User should be able to toggle dark mode from the sidebar.',
        state: 'Active',
        assignedTo: 'Jane Dev',
        type: 'User Story',
        url: '#',
        avatarUrl: 'https://i.pravatar.cc/150?img=5'
      },
      {
        id: 1002,
        title: 'Optimize API Response Time',
        description: 'The product list API is taking too long (>2s). Needs optimization.',
        state: 'New',
        assignedTo: 'Unassigned',
        type: 'User Story',
        url: '#'
      },
      {
        id: 1003,
        title: 'Fix Login Page Layout on Mobile',
        description: 'Login button overlaps with footer on iPhone SE.',
        state: 'Resolved',
        assignedTo: 'John Doe',
        type: 'User Story',
        url: '#',
        avatarUrl: 'https://i.pravatar.cc/150?img=3'
      }
    ];
    this.azureWorkItems.set(mockStories);
  }

  private getMockItemById(id: number): AzureWorkItem | null {
    const found = this.azureWorkItems().find(i => i.id === id);
    if (found) return found;
    
    // Also search in children if already loaded
    const child = this.azureChildrenItems().find(i => i.id === id);
    if (child) return child;

    return null;
  }

  private loadMockChildren(parentId: number) {
     this.isLoadingChildren.set(true);
     setTimeout(() => {
        const children: AzureWorkItem[] = [
            {
                id: parentId * 10 + 1,
                title: 'Update CSS variables for colors',
                description: '',
                state: 'Done',
                assignedTo: 'Jane Dev',
                type: 'Task',
                url: '#',
                completedWork: 4
            },
            {
                id: parentId * 10 + 2,
                title: 'Create theme toggle component',
                description: '',
                state: 'Doing',
                assignedTo: 'Jane Dev',
                type: 'Task',
                url: '#'
            },
             {
                id: parentId * 10 + 3,
                title: 'Fix flickering on load',
                description: '',
                state: 'New',
                assignedTo: 'John Doe',
                type: 'Bug',
                url: '#'
            }
        ];
        this.azureChildrenItems.set(children);
        this.isLoadingChildren.set(false);
     }, 500);
  }

  // --- APP ACTIONS ---
  
  addApp(app: Partial<LocalApp>) {
    const newApp: LocalApp = {
      id: Date.now().toString(),
      name: app.name || 'New App',
      path: app.path || '',
      host: app.host || 'localhost',
      port: app.port || 3000,
      startCommand: app.startCommand || 'npm start',
      branch: 'main',
      availableBranches: ['main'],
      status: 'stopped',
      notes: '',
      savedCommands: [],
      logs: []
    };
    this.apps.update(list => [...list, newApp]);
  }

  updateAppStatus(id: string, status: 'running' | 'stopped' | 'error') {
    this.apps.update(list => list.map(a => a.id === id ? { ...a, status } : a));
  }
  
  changeBranch(id: string, branch: string) {
      this.apps.update(list => list.map(a => a.id === id ? { ...a, branch } : a));
      this.addLog(id, `Switched to branch: ${branch}`, 'info');
  }
  
  updateAppNotes(id: string, notes: string) {
      this.apps.update(list => list.map(a => a.id === id ? { ...a, notes } : a));
  }

  addSavedCommand(appId: string, name: string, command: string) {
      this.apps.update(list => list.map(a => {
          if (a.id === appId) {
              return { 
                  ...a, 
                  savedCommands: [...a.savedCommands, { id: Date.now().toString(), name, command }] 
              };
          }
          return a;
      }));
  }

  addLog(appId: string, message: string, type: 'info' | 'error' | 'success' | 'command') {
      this.apps.update(list => list.map(a => {
          if (a.id === appId) {
              const newLogs = [...a.logs, { timestamp: new Date(), message, type }];
              if (newLogs.length > 100) newLogs.shift(); // Keep last 100
              return { ...a, logs: newLogs };
          }
          return a;
      }));
  }

  clearLogs(appId: string) {
      this.apps.update(list => list.map(a => a.id === appId ? { ...a, logs: [] } : a));
  }

  // --- SECURITY ACTIONS ---

  lockApp() {
    this.security.update(s => ({ ...s, isLocked: true }));
  }

  unlockApp() {
    this.security.update(s => ({ ...s, isLocked: false }));
  }

  enableSecurity(password: string) {
      this.security.set({ isEnabled: true, password, isLocked: false });
  }

  disableSecurity() {
      this.security.set({ isEnabled: false, password: '', isLocked: false });
  }

  // --- NOTES ACTIONS ---

  createGlobalNote(): string {
      const id = Date.now().toString();
      const newNote: GlobalNote = {
          id,
          title: 'New Note',
          content: '',
          updatedAt: new Date()
      };
      this.globalNotes.update(list => [newNote, ...list]);
      return id;
  }

  updateGlobalNote(id: string, changes: Partial<GlobalNote>) {
      this.globalNotes.update(list => list.map(n => n.id === id ? { ...n, ...changes, updatedAt: new Date() } : n));
  }

  deleteGlobalNote(id: string) {
      this.globalNotes.update(list => list.filter(n => n.id !== id));
  }

  // --- DATA MANAGEMENT ---

  exportData(): string {
      const data = {
          apps: this.apps(),
          globalNotes: this.globalNotes(),
          userProfile: this.userProfile(),
          integrations: this.integrations(),
          security: this.security(),
          linkedWorkItems: this.linkedWorkItems()
      };
      return JSON.stringify(data, null, 2);
  }

  importData(jsonString: string): boolean {
      try {
          const data = JSON.parse(jsonString);
          if (data.apps) this.apps.set(data.apps);
          if (data.globalNotes) this.globalNotes.set(data.globalNotes);
          if (data.userProfile) this.userProfile.set(data.userProfile);
          if (data.integrations) this.integrations.set(data.integrations);
          if (data.security) this.security.set(data.security);
          if (data.linkedWorkItems) this.linkedWorkItems.set(data.linkedWorkItems);
          
          this.saveToStorage();
          return true;
      } catch (e) {
          console.error('Import failed', e);
          return false;
      }
  }

  // --- AZURE WRITE ACTIONS (Mock/Real) ---
  
  async updateWorkItemDetails(id: number, title: string, description: string): Promise<boolean> {
      // If mock
      if (id >= 1000 && id < 10000) {
          this.azureWorkItems.update(list => list.map(i => i.id === id ? { ...i, title, description } : i));
          return true;
      }
      
      // Real API implementation would go here (omitted for local applet scope)
      return true;
  }

  async updateWorkItemStatus(id: number, state: string): Promise<boolean> {
      // If mock
      if (id >= 1000 && id < 10000) {
          this.azureWorkItems.update(list => list.map(i => i.id === id ? { ...i, state } : i));
          // Also update children if any
          this.azureChildrenItems.update(list => list.map(i => i.id === id ? { ...i, state } : i));
          return true;
      }
       // Real API implementation would go here
      return true;
  }

  async createChildWorkItem(parentId: number, title: string, type: 'Task' | 'Bug'): Promise<boolean> {
       // Mock
       const newId = Math.floor(Math.random() * 1000) + 10000;
       const newItem: AzureWorkItem = {
           id: newId,
           title,
           type,
           state: 'New',
           description: '',
           assignedTo: 'Unassigned',
           url: '#'
       };
       this.azureChildrenItems.update(list => [...list, newItem]);
       return true;
  }

  async deleteWorkItem(id: number): Promise<boolean> {
      // Mock deletion
      this.azureChildrenItems.update(list => list.filter(i => i.id !== id));
      return true;
  }
}
