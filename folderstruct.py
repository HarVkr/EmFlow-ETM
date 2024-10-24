import os

def generate_folder_structure(path, indent=""):
    folder_structure = ""
    for item in os.listdir(path):
        item_path = os.path.join(path, item)
        if os.path.isdir(item_path):
            folder_structure += f"{indent}├── {item}\n"
            folder_structure += generate_folder_structure(item_path, indent + "│   ")
        else:
            folder_structure += f"{indent}└── {item}\n"
    return folder_structure

project_path = r"D:\Web Development\College Projects\EmpFlow-ETM\Server"
def ignore_node_modules(path):
        if "node_modules" in os.listdir(path):
            os.listdir(path).remove("node_modules")

ignore_node_modules(project_path)

# Replace the path with the actual path to your project folder

folder_structure = generate_folder_structure(project_path)
print(folder_structure)

