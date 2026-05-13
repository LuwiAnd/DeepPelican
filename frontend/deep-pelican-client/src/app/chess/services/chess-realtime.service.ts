import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ChessMove } from '../logic/models';

@Injectable({ providedIn: 'root' })
export class ChessRealtimeService {
  private readonly hubUrl = 'http://localhost:5252/hubs/chess';
  private hubConnection: signalR.HubConnection | null = null;
  private currentGameId: string | null = null;

  public async connect(gameId: string): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      if (this.currentGameId !== gameId) {
        await this.hubConnection.invoke('JoinGame', gameId);
        this.currentGameId = gameId;
      }
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .withAutomaticReconnect()
      .build();

    await this.hubConnection.start();
    await this.hubConnection.invoke('JoinGame', gameId);
    this.currentGameId = gameId;
  }

  public onMoveReceived(handler: (move: ChessMove) => void): void {
    this.hubConnection?.on('ReceiveMove', handler);
  }

  public offMoveReceived(handler: (move: ChessMove) => void): void {
    this.hubConnection?.off('ReceiveMove', handler);
  }

  public async sendMove(move: ChessMove): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('SignalR connection is not active');
    }

    if (!this.currentGameId) {
      throw new Error('No game id has been joined');
    }

    await this.hubConnection.invoke('SendMove', this.currentGameId, move);
  }

  public async disconnect(): Promise<void> {
    if (this.hubConnection) {
      await this.hubConnection.stop();
      this.hubConnection = null;
      this.currentGameId = null;
    }
  }
}
