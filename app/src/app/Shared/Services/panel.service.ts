import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class PanelService {
  private panels: any[] = [];

  add(panel: any) {
    this.panels.push(panel);
  }

  remove(id: string) {
    this.panels = this.panels.filter(x => x.id !== id);
  }

  open(id: string) {
    const panel = this.panels.find(x => x.id === id);
    panel.open();
  }

  close(id: string) {
    const panel = this.panels.find(x => x.id === id);
    panel.close();
  }
}
