#!/usr/bin/env python3
"""
Test Python Script for Text Viewer
This script demonstrates Python syntax highlighting in the text viewer.
"""

import os
import json
from datetime import datetime

class TextViewerTest:
    def __init__(self, filename):
        self.filename = filename
        self.content = ""
    
    def read_file(self):
        """Read the content of the file"""
        try:
            with open(self.filename, 'r', encoding='utf-8') as f:
                self.content = f.read()
            return True
        except Exception as e:
            print(f"Error reading file: {e}")
            return False
    
    def get_stats(self):
        """Get file statistics"""
        lines = self.content.split('\n')
        return {
            'lines': len(lines),
            'characters': len(self.content),
            'words': len(self.content.split())
        }
    
    def search_text(self, query):
        """Search for text in the content"""
        return query.lower() in self.content.lower()

def main():
    """Main function"""
    print("Text Viewer Test Script")
    print("=" * 30)
    
    # Test file operations
    test_file = "test_text.txt"
    viewer = TextViewerTest(test_file)
    
    if viewer.read_file():
        stats = viewer.get_stats()
        print(f"File: {test_file}")
        print(f"Lines: {stats['lines']}")
        print(f"Characters: {stats['characters']}")
        print(f"Words: {stats['words']}")
        
        # Test search
        search_query = "test"
        if viewer.search_text(search_query):
            print(f"Found '{search_query}' in the file")
        else:
            print(f"'{search_query}' not found in the file")
    else:
        print("Failed to read file")

if __name__ == "__main__":
    main()
