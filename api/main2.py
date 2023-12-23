from fastapi import FastAPI, File, UploadFile
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()


MODEL = tf.keras.models.load_model("../models/1")
CLASS_NAMES = ["daisy","dandelion"]

@app.get("/ping")
async def ping():
 return "Hello! "

def read_file_as_image(data) -> np.ndarray:
    try:
        image = np.array(Image.open(BytesIO(data)))
        return image
    except Exception as e:
        print(f"Error reading image: {e}")
        raise ValueError("Invalid image file")


@app.post("/predict")
async def predict(
        file: UploadFile = File(...)
):
 image = read_file_as_image(await file.read()) #await- if many calls are made
 img_batch = np.expand_dims(image, 0)

 predictions = MODEL.predict(img_batch)

 predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
 confidence = np.max(predictions[0])
 return {
  'class': predicted_class,
  'confidence': float(confidence)
 }



if __name__=="__main__":
 uvicorn.run(app, host='localhost',port=8000)
