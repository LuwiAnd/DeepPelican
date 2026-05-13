import { Injectable, signal } from '@angular/core';

export interface DialogConfig {
  title: string;
  message: string;
  okButtonText?: string;
  cancelButtonText?: string;
  onOk?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogs = signal<DialogConfig[]>([]);

  readonly activeDialogs = this.dialogs.asReadonly();

  show(config: DialogConfig): void {
    this.dialogs.update(dialogs => [...dialogs, config]);
  }

  close(dialog: DialogConfig): void {
    this.dialogs.update(dialogs => dialogs.filter(d => d !== dialog));
  }

  showMessage(title: string, message: string): Promise<void> {
    return new Promise(resolve => {
      this.show({
        title,
        message,
        okButtonText: 'OK',
        onOk: () => resolve()
      });
    });
  }

  showConfirm(title: string, message: string): Promise<boolean> {
    return new Promise(resolve => {
      this.show({
        title,
        message,
        okButtonText: 'Ja',
        cancelButtonText: 'Nej',
        onOk: () => resolve(true),
        onCancel: () => resolve(false)
      });
    });
  }
}
