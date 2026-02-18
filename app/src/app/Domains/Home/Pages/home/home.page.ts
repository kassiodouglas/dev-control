import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LogoutAction } from "../../../Auth/Actions/logout.action";
import { ThemeService } from "../../../../Core/Services/theme.service";

@Component({
  selector: "page-home",
  imports:[CommonModule],
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage {
  private logoutAction = inject(LogoutAction);
  private themeService = inject(ThemeService);

  logout() {
    this.logoutAction.execute();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
