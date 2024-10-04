using Microsoft.AspNetCore.SignalR;

namespace razorSignalR.Hubs
{
	public class ChatHub : Hub
	{
		public async Task SendMessage(string message)
		{
			await Clients.All.SendAsync("ReceiveMessage", message);
		}

		public async Task AddToGroup(string groupName)
		{
			await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
		}

		// Method to remove a connection from a group
		public async Task RemoveFromGroup(string groupName)
		{
			await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
		}

		// Method to send a message to a specific group
		public async Task SendMessageToGroup(string groupName, string target, string message)
		{
			await Clients.Group(groupName).SendAsync("ReceiveGroupMessage", target, message);
		}
	}
}
