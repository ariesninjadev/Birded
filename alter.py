


############################
fstr = '''function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}'''
############################








import os

def standardize(path):
    directories = path.split('/')
    remaining_directories = directories[5:]
    new_path = '/' + '/'.join(remaining_directories)
    return new_path

def find_files_with_string(directory, search_string):
    files_with_string = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if 'IGNORE' in file:
                continue
            file_path = os.path.join(root, file)
            if not os.path.isfile(file_path):
                continue
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                if search_string in content:
                    files_with_string.append(file_path)
    return files_with_string

def remove_lines_from_file(file_path, lines):
    with open(file_path, 'r') as f:
        content = f.read()
    
    lines_str = '\n'.join(lines)
    updated_content = content.replace(lines_str, '')
    
    with open(file_path, 'w') as f:
        f.write(updated_content)

def main(fstr):
    print("\u001b[36m-------------------------------------\u001b[0m")
    directory = os.getcwd() + '/public'
    search_string = fstr
    lines = search_string.strip().split('\n')
    
    files_with_string = find_files_with_string(directory, search_string)
    if not files_with_string:
        print("\u001b[34mNo files found with the specified string.\u001b[0m")
        print("\u001b[36m-------------------------------------\u001b[0m")
        return
    
    print("\u001b[1m\u001b[33mFiles containing the specified code:\u001b[0m")
    for file_path in files_with_string:
        print(standardize(file_path))
    
    confirmation = input("\u001b[31mDo you want to remove the specified lines from these files? (y/N): \u001b[0m")
    if confirmation.lower() == 'y':
        for file_path in files_with_string:
            remove_lines_from_file(file_path, lines)
        print("\u001b[41m\u001b[30m\u001b[1mLines removed successfully.\u001b[0m")
        print("\u001b[36m-------------------------------------\u001b[0m")
    else:
        print("\u001b[1m\u001b[32mNo changes were made.\u001b[0m")
        print("\u001b[36m-------------------------------------\u001b[0m")

if __name__ == '__main__':
    main(fstr)