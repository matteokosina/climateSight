import http.server
import socketserver
import os

PORT = 8000  # Der Port, auf dem der Server läuft
DIRECTORY = "./"  # Pfad zu dem Verzeichnis, das gehostet wird

class CustomRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

# Überprüfen, ob das Verzeichnis existiert
if not os.path.isdir(DIRECTORY):
    print(f"Error: The directory '{DIRECTORY}' does not exist.")
    exit(1)

try:
    # Stelle sicher, dass das aktuelle Verzeichnis auf das angegebene Verzeichnis gesetzt wird
    os.chdir(DIRECTORY)
except Exception as e:
    print(f"Error: Unable to change directory to '{DIRECTORY}'. {e}")
    exit(1)

# Ausgaben für die Konsole
print(f"################################")
print(f"ClimateSight wurde gestartet...")
print(f"Die Website ist jetzt erreichbar unter http://localhost:{PORT}/")
print(f"CONTROL + C druecken um den Server zu stoppen...")
print(f"################################")

with socketserver.TCPServer(("", PORT), CustomRequestHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nDer Webserver wurde von Ihnen gestoppt.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        httpd.server_close()
