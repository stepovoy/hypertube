#!/usr/bin/env python
import shutil
import os


try:
    shutil.rmtree('./app/static/users')
except:
    pass

try:
    os.remove('./data.sqlite')
except:
    pass
