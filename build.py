import os

FILELIST = 'build.txt'
SOURCE = 'src/'
BUILD = 'build/code.js'

def append_text_files(filelist, output_file):
    output_dir = os.path.dirname(output_file)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    with open(filelist, 'r') as file_list:
        with open(output_file, 'w') as output:
            for line in file_list:
                filename = SOURCE + line.strip()
                with open(filename, 'r') as filelist:
                    output.write(filelist.read())
                    output.write('\n\n\n')

if __name__ == '__main__':
    append_text_files(FILELIST, BUILD)