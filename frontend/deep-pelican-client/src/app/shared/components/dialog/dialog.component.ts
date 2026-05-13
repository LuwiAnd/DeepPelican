import { Component, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService, type DialogConfig } from '../../services/dialog.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  activeDialogs : Signal<DialogConfig[]>;
  
  constructor(private dialogService: DialogService) {
    this.activeDialogs = this.dialogService.activeDialogs;
  }

  handleOk(dialog: DialogConfig): void {
    dialog.onOk?.();
    this.dialogService.close(dialog);
  }

  handleCancel(dialog: DialogConfig): void {
    dialog.onCancel?.();
    this.dialogService.close(dialog);
  }
}
