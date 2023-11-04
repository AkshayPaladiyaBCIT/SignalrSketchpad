using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace SignalrSketchpad.Hubs
{
    public class DrawDotHub : Hub
    {
        // Store user colors
        private static readonly Dictionary<string, string> UserColors = new Dictionary<string, string>();

        public void SetUserColor(string color)
        {
            // Assign the color to the user
            UserColors[Context.ConnectionId] = color;
        }

        public async Task UpdateCanvas(int x, int y)
        {
            // Get the user's color based on their connection ID
            if (UserColors.TryGetValue(Context.ConnectionId, out string userColor))
            {
                // Send the user's color along with the drawing coordinates
                await Clients.All.SendAsync("updateDot", x, y, userColor);
            }
        }

        public async Task ClearCanvas()
        {
            await Clients.All.SendAsync("clearCanvas");
        }
    }
}
