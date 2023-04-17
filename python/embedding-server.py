import torch
from sentence_transformers import SentenceTransformer
import json
import pyjson5
import cgi
from http.server import BaseHTTPRequestHandler, HTTPServer
from dotenv import load_dotenv
import os

load_dotenv()

models = {}

with open('../configuration.json5', 'r') as input_file:
  configuration = pyjson5.load(input_file)

print("Loading models:")

for modelName in configuration['models']:
  if (modelName == "" or modelName == "openai"):
    continue

  print("\t" + modelName)
  models[modelName] = SentenceTransformer(modelName)

print("Loaded all models")

device = "cpu"

if (torch.backends.mps.is_available()):
  device = "mps"

print(f"Using device {device}")

class EmbeddingServer(BaseHTTPRequestHandler):
  def do_GET(self):
    self.send_error(404)

  def do_POST(self):
    if (not self.path.startswith('/calc')):
      self.send_error(404)
      return

    contentType, pdict = cgi.parse_header(self.headers.get('content-type'))

    if contentType != 'application/json':
      self.send_response(400, "Only json")
      self.end_headers()
      return

    # read the message and convert it into a python dictionary
    length = int(self.headers.get('content-length'))
    body = json.loads(self.rfile.read(length))

    modelName = body.get('model')
    text = body.get('text')

    if (len(text) == 0):
      self.send_error(400, "Empty text")
      return

    if (modelName not in models):
      self.send_error(400, "Model not found")
      return

    show_progress_bar=len(text) > 2

    embeddings = models[modelName].encode(
      sentences=list(text),
      device=device,
      show_progress_bar=show_progress_bar
    ).tolist()

    jsonData = json.dumps(embeddings, ensure_ascii=False)
    jsonDataEncoded = jsonData.encode()

    self.send_response(200)
    self.send_header('Content-Type', 'application/json')
    self.send_header('Content-Length', len(jsonDataEncoded))
    self.end_headers()
    self.wfile.write(jsonDataEncoded)

serverAddress = (os.getenv("EMBEDDING_SERVER_LISTEN_HOST"), int(os.getenv("EMBEDDING_SERVER_LISTEN_PORT")))
httpd = HTTPServer(serverAddress, EmbeddingServer)
print('Server running at ' + os.getenv("EMBEDDING_SERVER_LISTEN_HOST") + ':' + os.getenv("EMBEDDING_SERVER_LISTEN_PORT"))
httpd.serve_forever()
