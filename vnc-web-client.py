#!/usr/bin/env python3
"""
Aejis VNC Web Client - Custom VNC Web Interface
Built from scratch for commercial use - no licensing restrictions
"""

import asyncio
import websockets
import json
import base64
import struct
import logging
from typing import Dict, Any

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AejisVNCWebClient:
    """Custom VNC Web Client for Aejis Browser Isolation"""
    
    def __init__(self):
        self.clients = set()
        self.vnc_connections = {}
        
    async def register_client(self, websocket, path):
        """Register new web client"""
        self.clients.add(websocket)
        logger.info(f"Client connected: {websocket.remote_address}")
        
        try:
            async for message in websocket:
                await self.handle_message(websocket, message)
        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            self.clients.remove(websocket)
            logger.info(f"Client disconnected: {websocket.remote_address}")
    
    async def handle_message(self, websocket, message):
        """Handle incoming messages from web clients"""
        try:
            data = json.loads(message)
            message_type = data.get('type')
            
            if message_type == 'connect_vnc':
                await self.connect_vnc(websocket, data)
            elif message_type == 'vnc_data':
                await self.forward_vnc_data(websocket, data)
            elif message_type == 'mouse_event':
                await self.handle_mouse_event(websocket, data)
            elif message_type == 'key_event':
                await self.handle_key_event(websocket, data)
                
        except Exception as e:
            logger.error(f"Error handling message: {e}")
            await websocket.send(json.dumps({
                'type': 'error',
                'message': str(e)
            }))
    
    async def connect_vnc(self, websocket, data):
        """Connect to VNC server"""
        try:
            # Connect to VNC server
            vnc_uri = f"ws://localhost:5901"
            vnc_websocket = await websockets.connect(vnc_uri)
            
            self.vnc_connections[websocket] = vnc_websocket
            
            # Start forwarding VNC data
            asyncio.create_task(self.forward_vnc_to_client(websocket, vnc_websocket))
            
            await websocket.send(json.dumps({
                'type': 'vnc_connected',
                'status': 'success'
            }))
            
        except Exception as e:
            logger.error(f"VNC connection failed: {e}")
            await websocket.send(json.dumps({
                'type': 'vnc_connected',
                'status': 'error',
                'message': str(e)
            }))
    
    async def forward_vnc_to_client(self, client_ws, vnc_ws):
        """Forward VNC data to web client"""
        try:
            async for message in vnc_ws:
                await client_ws.send(json.dumps({
                    'type': 'vnc_frame',
                    'data': base64.b64encode(message).decode('utf-8')
                }))
        except websockets.exceptions.ConnectionClosed:
            pass
        except Exception as e:
            logger.error(f"Error forwarding VNC data: {e}")
    
    async def forward_vnc_data(self, websocket, data):
        """Forward data to VNC server"""
        if websocket in self.vnc_connections:
            vnc_ws = self.vnc_connections[websocket]
            try:
                await vnc_ws.send(data.get('data', ''))
            except Exception as e:
                logger.error(f"Error sending to VNC: {e}")
    
    async def handle_mouse_event(self, websocket, data):
        """Handle mouse events"""
        if websocket in self.vnc_connections:
            vnc_ws = self.vnc_connections[websocket]
            try:
                # Convert mouse event to VNC protocol
                x = data.get('x', 0)
                y = data.get('y', 0)
                button = data.get('button', 0)
                
                # Send mouse event to VNC
                mouse_data = struct.pack('!BBHH', 5, button, x, y)
                await vnc_ws.send(mouse_data)
            except Exception as e:
                logger.error(f"Error handling mouse event: {e}")
    
    async def handle_key_event(self, websocket, data):
        """Handle keyboard events"""
        if websocket in self.vnc_connections:
            vnc_ws = self.vnc_connections[websocket]
            try:
                # Convert key event to VNC protocol
                key = data.get('key', 0)
                down = data.get('down', True)
                
                # Send key event to VNC
                key_data = struct.pack('!BBHI', 4, down, 0, key)
                await vnc_ws.send(key_data)
            except Exception as e:
                logger.error(f"Error handling key event: {e}")

async def main():
    """Start the VNC web client server"""
    logger.info("🚀 Starting Aejis VNC Web Client...")
    
    client = AejisVNCWebClient()
    
    # Start WebSocket server
    start_server = websockets.serve(
        client.register_client,
        "localhost",
        8080,
        ping_interval=20,
        ping_timeout=10
    )
    
    logger.info("✅ Aejis VNC Web Client running on ws://localhost:8080")
    await start_server

if __name__ == "__main__":
    asyncio.run(main())
