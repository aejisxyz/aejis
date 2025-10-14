#!/usr/bin/env python3
import os
import sys
import json
import tempfile
import docker

def test_docker_processing():
    """Test Docker processing for ZIP files"""
    try:
        # Initialize Docker client
        client = docker.from_env()
        
        # Test file path
        test_file = "temp_uploads/97a3abfc_shopify_recovery_codes.txt"
        if not os.path.exists(test_file):
            print(f"Test file {test_file} not found")
            return
        
        # Create temporary directory
        with tempfile.TemporaryDirectory() as temp_dir:
            # Copy file to temp directory
            import shutil
            temp_file = os.path.join(temp_dir, "test_file.txt")
            shutil.copy2(test_file, temp_file)
            
            # Create simple processing script
            script_content = '''
import os
import json
import zipfile

file_path = "/tmp/test_file.txt"
result = {
    "success": True,
    "file_size": os.path.getsize(file_path),
    "file_ext": ".txt",
    "preview_type": "text",
    "preview_content": "Test content",
    "metadata": {}
}

print(json.dumps(result))
'''
            
            script_path = os.path.join(temp_dir, "process.py")
            with open(script_path, 'w') as f:
                f.write(script_content)
            
            # Run Docker container
            print("Running Docker container...")
            container = client.containers.run(
                'python:3.11-slim',
                command=['python', '/tmp/process.py'],
                volumes={
                    temp_dir: {'bind': '/tmp', 'mode': 'ro'},
                    script_path: {'bind': '/tmp/process.py', 'mode': 'ro'}
                },
                network_mode='none',
                mem_limit='128m',
                cpu_quota=50000,
                security_opt=['no-new-privileges:true'],
                read_only=True,
                remove=True,
                detach=False
            )
            
            print("Docker output:")
            print(container.decode('utf-8'))
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_docker_processing()
