#!/usr/bin/env python
import os
import sys
from django.core.management.commands.runserver import Command as runserver

runserver
runserver.default_port = "8080"

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "landingPage2.settings.dev")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
