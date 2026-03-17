from fastapi import APIRouter
from pydantic import BaseModel
from core.prediction_service import predict_exam_questions

router = APIRouter()

class PredictionRequest(BaseModel):
    doc_id: str

@router.post("/predictions/generate")
async def get_predictions(req: PredictionRequest):
    try:
        data = predict_exam_questions(req.doc_id)
        return {
            "status": "success",
            "predictions": data.get("predictions", [])
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
