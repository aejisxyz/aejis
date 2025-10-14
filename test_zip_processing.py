#!/usr/bin/env python3
import os
import sys
import json
import tempfile
import docker
import zipfile

def test_zip_processing():
    """Test Docker processing for ZIP files"""
    try:
        # Initialize Docker client
        client = docker.from_env()
        
        # Create a test ZIP file
        test_zip_path = "test_archive.zip"
        with zipfile.ZipFile(test_zip_path, 'w') as zf:
            zf.writestr("test1.txt", "This is test file 1")
            zf.writestr("test2.txt", "This is test file 2")
            zf.writestr("folder/test3.txt", "This is test file 3 in folder")
        
        print(f"Created test ZIP: {test_zip_path}")
        
        # Create temporary directory
        with tempfile.TemporaryDirectory() as temp_dir:
            # Copy ZIP to temp directory
            import shutil
            temp_zip = os.path.join(temp_dir, "test_archive.zip")
            shutil.copy2(test_zip_path, temp_zip)
            
            # Create ZIP processing script
            script_content = '''
import os
import json
import zipfile

file_path = "/tmp/test_archive.zip"
result = {
    "success": False,
    "error": "Unknown error"
}

try:
    if os.path.exists(file_path):
        with zipfile.ZipFile(file_path, 'r') as zf:
            file_list = zf.namelist()
            total_size = sum(info.file_size for info in zf.infolist())
            compressed_size = sum(info.compress_size for info in zf.infolist())
            compression_ratio = (1 - compressed_size / total_size) * 100 if total_size > 0 else 0
            
            result = {
                "success": True,
                "file_size": os.path.getsize(file_path),
                "file_ext": ".zip",
                "preview_type": "archive",
                "preview_content": f"ZIP Archive\\nFiles: {len(file_list)}\\nTotal Size: {total_size} bytes\\nCompressed: {compressed_size} bytes\\nCompression: {compression_ratio:.1f}%\\n\\nFiles: {file_list[:10]}",
                "metadata": {
                    "file_count": len(file_list),
                    "total_size": total_size,
                    "compressed_size": compressed_size,
                    "compression_ratio": compression_ratio,
                    "files": file_list
                }
            }
    else:
        result["error"] = "File not found"
except Exception as e:
    result["error"] = str(e)

print(json.dumps(result))
'''
            
            script_path = os.path.join(temp_dir, "process.py")
            with open(script_path, 'w') as f:
                f.write(script_content)
            
            # Run Docker container
            print("Running Docker container for ZIP processing...")
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
    finally:
        # Clean up test file
        if os.path.exists(test_zip_path):
            os.remove(test_zip_path)

if __name__ == "__main__":
    test_zip_processing()
