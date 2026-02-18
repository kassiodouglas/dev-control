import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { ModalService } from './Services/modal.service';
import { ThemeService } from '../../../Core/Services/theme.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() id: string ='';
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full' = 'md';
  isOpen = false;
  private modal: any;

  themeService = inject(ThemeService);

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }

    this.modal = this;
    this.modalService.add(this);
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
  }

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }
}
