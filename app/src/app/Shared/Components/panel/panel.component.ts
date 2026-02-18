import { Component, Input, OnDestroy, OnInit, inject } from "@angular/core";
import { ThemeService } from "../../../Core/Services/theme.service";
import { PanelService } from "../../Services/panel.service";

@Component({
  selector: "app-panel",
  templateUrl: "./panel.component.html",
  styleUrls: ["./panel.component.scss"]
})
export class PanelComponent implements OnInit, OnDestroy {
  @Input() id: string ="";
  @Input() size: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "full" = "md";
  @Input() position: "left" | "right"  = "left";
  isOpen = false;
  private panel: any;

  themeService = inject(ThemeService);

  constructor(private panelService: PanelService) {}

  ngOnInit(): void {
    if (!this.id) {
      console.error("panel must have an id");
      return;
    }

    this.panel = this;
    this.panelService.add(this);
  }

  ngOnDestroy(): void {
    this.panelService.remove(this.id);
  }

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }
}
