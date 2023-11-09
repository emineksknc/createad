from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse, JSONResponse

app = FastAPI()
import base64


#origins = ["http://localhost:3000", "http://127.0.0.1:3000" ]


#CORS politikalarını ayarlamak için middleware kullanın (Güvenlik nedeniyle geliştirme sırasında kullanabilirsiniz).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000", "http://0.0.0.0:8000/generate", "http://35.219.168.26:1780"],  # Daha güvenli bir ayar yapmalısınız.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)





@app.get("/", tags=["root"])
async def root() -> dict:
    return {"message": "Welcome to generating...."}



from PIL import Image
from fastapi import FastAPI, UploadFile, File, Request, Form, Response


from .generate import generate_image
import io

app = FastAPI()


@app.get("/")
def home():
    return {"message": "Welcome to generating...."}


@app.post("/generate")
async def predict(image: UploadFile = File(...), prompt:str = Form(...), color: str= Form(...)):
    # file_bytes = image.file.read()
    # image = Image.open(io.BytesIO(file_bytes))
    # new_image = generate_image(image=image, prompt=prompt, color=color)
    # result = predict(image)
    #
    # bytes_image = io.BytesIO()
    # new_image.save(bytes_image, format='PNG')
    # #return Response(content=bytes_image.getvalue(), media_type="image/png")
    # return Response(content=bytes_image.getvalue(), media_type="image/png")
    # original_image = Image.open(image.file)
    # new_image = generate_image(image=original_image, prompt=prompt, color=color)
    # #
    # return StreamingResponse(new_image, media_type="image/png")

    original_image = Image.open(image.file)
    original_image = generate_image(image=original_image, prompt=prompt, color=color)

    filtered_image = io.BytesIO()
    original_image.save(filtered_image, "PNG")
    filtered_image.seek(0)

    return StreamingResponse(content=filtered_image, media_type="image/png")




