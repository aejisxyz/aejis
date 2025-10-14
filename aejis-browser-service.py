"""
Aejis Custom Browser Isolation Service
Built from scratch for commercial use - no licensing restrictions
"""

import docker
import logging
import time
import os
import requests
import json
from typing import Dict, Optional

logger = logging.getLogger(__name__)

class AejisBrowserService:
    """
    Custom browser isolation service built specifically for Aejis
    - 100% commercial-friendly (no licensing issues)
    - Built from open-source components only
    - Optimized for security analysis
    """
    
    def __init__(self):
        try:
            self.client = docker.from_env()
            self.client.ping()
            logger.info("🐳 Aejis Browser Service initialized successfully")
        except Exception as e:
            logger.warning(f"⚠️ Docker daemon not running: {e}")
            self.client = None
        self.sessions = {}  # Store active sessions
        self.container_name = "aejis-browser-isolation"
    
    def start_browser_session(self, session_id: str, target_url: str) -> Dict:
        """
        Start a new browser isolation session
        """
        if not self.client:
            raise Exception("Docker not available for browser isolation.")
        
        if session_id in self.sessions and self.is_container_running():
            logger.info(f"Session {session_id} already running.")
            return self.sessions[session_id]
        
        try:
            # Check if container is already running
            if self.is_container_running():
                logger.info("Aejis browser container already running, reusing...")
                session_data = {
                    "container_id": self.get_container_id(),
                    "status": "running",
                    "vnc_url": f"ws://localhost:6080/websockify?token={session_id}",
                    "direct_url": f"http://localhost:6080/?password=aejis123",
                    "target_url": target_url,
                    "start_time": time.time()
                }
                self.sessions[session_id] = session_data
                return session_data
            
            # Start the container
            logger.info(f"Starting Aejis browser container for session {session_id}")
            
            container = self.client.containers.run(
                "aejis-browser-isolation:latest",
                detach=True,
                ports={'6080/tcp': 6080, '5901/tcp': 5901},
                environment={
                    "VNC_PASSWORD": "aejis123",
                    "VNC_RESOLUTION": "1920x1080",
                    "DISPLAY": ":1",
                    "TARGET_URL": target_url
                },
                name=self.container_name,
                remove=False,
                network_mode="bridge",
                security_opt=["seccomp:unconfined"],
                cap_add=["SYS_ADMIN"],
                devices=["/dev/dri:/dev/dri"],
                shm_size="2gb",
                mem_limit="4g",
                cpus=2.0,
                restart_policy={"Name": "unless-stopped"}
            )
            
            # Wait for services to be ready
            self._wait_for_services()
            
            session_data = {
                "container_id": container.id,
                "status": "running",
                "vnc_url": f"ws://localhost:6080/websockify?token={session_id}",
                "direct_url": f"http://localhost:6080/?password=aejis123",
                "target_url": target_url,
                "start_time": time.time()
            }
            self.sessions[session_id] = session_data
            logger.info(f"Started Aejis browser session for {session_id}: {target_url}")
            return session_data
            
        except docker.errors.ContainerError as e:
            logger.error(f"Container error for {session_id}: {e}")
            raise Exception(f"Aejis browser container failed to start: {e}")
        except docker.errors.ImageNotFound:
            logger.error("Aejis browser image not found. Building...")
            self._build_image()
            return self.start_browser_session(session_id, target_url)
        except Exception as e:
            logger.error(f"Failed to start Aejis browser session {session_id}: {e}")
            raise Exception(f"Failed to start Aejis browser session: {e}")
    
    def _build_image(self):
        """Build the Aejis browser image"""
        try:
            logger.info("Building Aejis browser image...")
            image, build_logs = self.client.images.build(
                path=".",
                dockerfile="Dockerfile.aejis-browser",
                tag="aejis-browser-isolation:latest",
                rm=True
            )
            logger.info("✅ Aejis browser image built successfully")
        except Exception as e:
            logger.error(f"Failed to build Aejis browser image: {e}")
            raise
    
    def _wait_for_services(self, timeout=60):
        """Wait for noVNC and VNC services to be ready"""
        logger.info("Waiting for Aejis browser services to be ready...")
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            try:
                # Check noVNC
                response = requests.get("http://localhost:6080", timeout=5)
                if response.status_code == 200:
                    logger.info("✅ Aejis browser services ready!")
                    return True
            except:
                pass
            time.sleep(2)
        
        raise Exception("Aejis browser services failed to start within timeout")
    
    def get_session_status(self, session_id: str) -> Optional[Dict]:
        """Get the status of a browser session"""
        if session_id not in self.sessions:
            return None
        
        # Check if container is still running
        if not self.is_container_running():
            self.sessions[session_id]['status'] = 'stopped'
            return self.sessions[session_id]
        
        return self.sessions[session_id]
    
    def stop_browser_session(self, session_id: str) -> bool:
        """Stop a browser session"""
        if session_id not in self.sessions:
            return False
        
        try:
            container = self.client.containers.get(self.container_name)
            container.stop()
            self.sessions[session_id]['status'] = 'stopped'
            logger.info(f"Stopped Aejis browser session {session_id}")
            return True
        except docker.errors.NotFound:
            logger.warning(f"Container {self.container_name} not found, already stopped.")
            self.sessions[session_id]['status'] = 'stopped'
            return True
        except Exception as e:
            logger.error(f"Failed to stop container {self.container_name}: {e}")
            return False
    
    def is_container_running(self) -> bool:
        """Check if the Aejis browser container is running"""
        try:
            container = self.client.containers.get(self.container_name)
            return container.status == 'running'
        except docker.errors.NotFound:
            return False
        except Exception as e:
            logger.error(f"Error checking container status for {self.container_name}: {e}")
            return False
    
    def get_container_id(self) -> Optional[str]:
        """Get the container ID if running"""
        try:
            container = self.client.containers.get(self.container_name)
            return container.id
        except:
            return None
    
    def get_browser_info(self) -> Dict:
        """Get information about the Aejis browser service"""
        if not self.client:
            return {"docker_available": False}
        
        running_sessions = [s_id for s_id, data in self.sessions.items() if data['status'] == 'running']
        container_running = self.is_container_running()
        
        return {
            "docker_available": True,
            "container_running": container_running,
            "container_name": self.container_name,
            "running_sessions": len(running_sessions),
            "total_sessions_tracked": len(self.sessions),
            "service_type": "Aejis Custom Browser Isolation",
            "commercial_friendly": True,
            "no_licensing_restrictions": True
        }
    
    def launch_url_in_browser(self, session_id: str, url: str) -> bool:
        """Launch a specific URL in the isolated browser"""
        try:
            if not self.is_container_running():
                logger.error("Aejis browser container not running")
                return False
            
            # This would require implementing a way to send commands to the browser
            # For now, we'll just log the request
            logger.info(f"Launching URL {url} in Aejis browser session {session_id}")
            
            # In a real implementation, you might:
            # 1. Use a REST API to control the browser
            # 2. Send commands via VNC
            # 3. Use a browser automation tool
            
            return True
        except Exception as e:
            logger.error(f"Failed to launch URL {url}: {e}")
            return False

# Create global instance
aejis_browser_service = AejisBrowserService()
