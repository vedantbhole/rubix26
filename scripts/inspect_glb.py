import struct
import json
import os

def parse_glb(file_path):
    with open(file_path, 'rb') as f:
        # Read header
        magic, version, length = struct.unpack('<3I', f.read(12))
        if magic != 0x46546C67: # 'glTF'
            print("Not a valid GLB file")
            return

        # Read JSON chunk header
        chunk_length, chunk_type = struct.unpack('<2I', f.read(8))
        if chunk_type != 0x4E4F534A: # 'JSON'
            print("First chunk is not JSON")
            return

        # Read JSON data
        json_data = f.read(chunk_length)
        data = json.loads(json_data)

        # Print nodes
        if 'nodes' in data:
            print(f"Found {len(data['nodes'])} nodes:")
            for i, node in enumerate(data['nodes']):
                name = node.get('name', 'N/A')
                print(f"Node {i}: {name}")
                if 'extras' in node:
                    print(f"  Extras: {node['extras']}")
        else:
            print("No 'nodes' property found in JSON.")

        # Print meshes
        if 'meshes' in data:
            print(f"\nFound {len(data['meshes'])} meshes:")
            for i, mesh in enumerate(data['meshes']):
                name = mesh.get('name', 'N/A')
                print(f"Mesh {i}: {name}")

parse_glb('public/models/varun_ka_garden.glb')
