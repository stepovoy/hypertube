#!/usr/bin/env python3

import os, shutil

def dell_all(folder):
    for the_file in os.listdir(folder):
        file_path = os.path.join(folder, the_file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path): shutil.rmtree(file_path)
        except Exception as e:
            print(e)


if __name__ == '__main__':
    dell_all('/Volumes/external/hypertube/films-torrent-parser/public/videos')
    dell_all('/Volumes/external/hypertube/films-torrent-parser/public/captions')
    dell_all('/Volumes/external/hypertube/films-torrent-parser/tmp/videos')