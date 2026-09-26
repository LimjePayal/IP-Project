import webbrowser
import os

# Get path to index.html and open in default browser
index_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "index.html"))
print(f"Opening Image Processing Lab Portal: {index_path}")
webbrowser.open(f"file:///{index_path.replace(os.sep, '/')}")
