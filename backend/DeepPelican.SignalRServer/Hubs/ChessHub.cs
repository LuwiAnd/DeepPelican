using Microsoft.AspNetCore.SignalR;

namespace DeepPelican.SignalRServer.Hubs;

public class ChessHub : Hub
{
    public async Task JoinGame(string gameId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
    }

    public async Task LeaveGame(string gameId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId);
    }

    public async Task SendMove(string gameId, ChessMove move)
    {
        await Clients.OthersInGroup(gameId).SendAsync("ReceiveMove", move);
    }
}

public record ChessCoords(int X, int Y);

public record ChessMove(ChessCoords From, ChessCoords To);
