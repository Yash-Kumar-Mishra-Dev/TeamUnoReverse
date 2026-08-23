from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="AI/Anomaly Service", version="1.0.0")

class AnomalyRequest(BaseModel):
    zone: str
    reports_per_hour: int
    sensor_value: float

class AnomalyResponse(BaseModel):
    is_anomaly: bool
    confidence_score: float

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/v1/anomaly/detect", response_model=AnomalyResponse)
def detect_anomaly(req: AnomalyRequest):
    # Dummy logic for anomaly detection
    is_anomaly = req.reports_per_hour > 50 or req.sensor_value > 90.0
    return {"is_anomaly": is_anomaly, "confidence_score": 0.85 if is_anomaly else 0.1}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
