import os

# Mode inclusion ou exclusion
# True = ne garder que certains fichiers/dossiers, False = ignorer certains
is_include = False

# Mode exclusion
ignored_files = ['tree.py', 'output.txt']
ignored_dirs = ['github', 'front', 'api']
ignored_extensions = ['.meta', '.png', '.exe', '.jpg',
                      '.jpeg', '.png', '.gif', '.dll', '.zip', '.rar']

# Mode inclusion
# Seuls ces dossiers seront parcourus
included_dirs = ['src', 'Assets', 'Scripts', 'Camera',
                 'Collectibles', 'Game', 'Hazards', 'Player', 'Utility']
included_extensions = ['.cs']  # Fichiers C# uniquement


def list_files_recursively(directory, output_file):
    with open(output_file, 'w', encoding='utf-8') as f_out:
        for root, dirs, files in os.walk(directory):
            rel_root = os.path.relpath(root, directory)

            # Gestion des dossiers
            if is_include:
                # On garde seulement les sous-dossiers présents dans included_dirs
                dirs[:] = [d for d in dirs if d in included_dirs]
                # Si le dossier actuel n'est pas dans included_dirs (à n'importe quel niveau), on skip
                if rel_root != '.' and not any(part in included_dirs for part in rel_root.split(os.sep)):
                    continue
            else:
                dirs[:] = [d for d in dirs if d not in ignored_dirs]

            for file in files:
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, directory)
                _, ext = os.path.splitext(file)

                if is_include:
                    if ext not in included_extensions:
                        continue
                else:
                    if file in ignored_files or ext in ignored_extensions:
                        continue

                f_out.write(f"{relative_path}\n")

                try:
                    with open(file_path, 'r', encoding='utf-8') as f_in:
                        content = f_in.read()
                        f_out.write(f"{content}\n\n")
                except Exception as e:
                    f_out.write(f"Erreur de lecture du fichier: {e}\n\n")


# Exécution du script
if __name__ == "__main__":
    current_dir = os.getcwd()  # Récupère le dossier courant
    output_filename = "output.txt"
    list_files_recursively(current_dir, output_filename)
