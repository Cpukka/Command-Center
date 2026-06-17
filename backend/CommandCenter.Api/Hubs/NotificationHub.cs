using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace CommandCenter.Api.Hubs;

public class NotificationHub : Hub
{
    public async Task SendNotification(string userId, string title, string message)
    {
        await Clients.User(userId).SendAsync("ReceiveNotification", new
        {
            Id = Guid.NewGuid().ToString(),
            Title = title,
            Message = message,
            Timestamp = DateTime.UtcNow,
            Type = "info"
        });
    }

    public async Task JoinUserGroup(string userId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"user-{userId}");
    }

    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
    }
}
