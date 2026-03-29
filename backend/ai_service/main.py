from fastapi import FastAPI, UploadFile, File, HTTPException
import uvicorn
import shutil
import os
from processor import AudioAIProcessor

app = FastAPI()
processor = AudioAIProcessor()

UPLOAD_DIR = "temp_audio"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@app.get("/health")
async def health():
    return {"status": "AI Service is Healthy"}

@app.post("/filter")
async def filter_audio(file: UploadFile = File(...), filter_type: str = "heart"):
    """Applies high-quality DSP filtering and returns the WAV file."""
    temp_path = os.path.join(UPLOAD_DIR, f"filter_{file.filename}")
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        audio_bytes = processor.process_and_filter(temp_path, filter_type)
        from fastapi.responses import Response
        return Response(content=audio_bytes, media_type="audio/wav")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/analyze")
async def analyze_audio(file: UploadFile = File(...)):
    """Receives a WAV file and returns AI insights."""
    temp_path = os.path.join(UPLOAD_DIR, file.filename)
    
    # Save temp file
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        results = processor.analyze(temp_path)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
