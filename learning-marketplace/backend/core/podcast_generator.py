import json
from typing import List, Dict, Any
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage
from prompter import Prompter

import os

def get_llm():
    return ChatGroq(model="llama-3.3-70b-versatile", api_key=os.getenv("GROQ_API_KEY"), temperature=0.7)

def generate_podcast_outline(context: str, num_segments: int = 3) -> dict:
    llm = get_llm()
    prompter = Prompter("podcast/outline")
    
    speakers = [
        {
            "name": "Sarah",
            "backstory": "An experienced researcher and host who loves diving into new topics.",
            "personality": "Curious, articulate, and engaging."
        },
        {
            "name": "Alex",
            "backstory": "An analyst who excels at breaking down complex information.",
            "personality": "Analytical, clear, and thoughtful."
        }
    ]
    
    prompt_text = prompter.render(
        briefing="Create an engaging deep-dive podcast based on the provided material.",
        context=context,
        speakers=speakers,
        num_segments=num_segments,
        format_instructions="Return JSON with a 'segments' array containing 'name', 'description', and 'size'."
    )
    
    response = llm.invoke([SystemMessage(content=prompt_text)])
    
    try:
        content = response.content
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].strip()
            
        data = json.loads(content)
        return data
    except Exception as e:
        return {"segments": [{"name": "Overview", "description": "General overview of the topic.", "size": "medium"}], "error": str(e)}

def generate_podcast_transcript(context: str, outline: dict) -> dict:
    llm = get_llm()
    prompter = Prompter("podcast/transcript")
    
    speakers = [
        {
            "name": "Sarah",
            "backstory": "An experienced researcher and host.",
            "personality": "Curious, articulate, and engaging."
        },
        {
            "name": "Alex",
            "backstory": "An analyst extracting key insights.",
            "personality": "Analytical, clear, and thoughtful."
        }
    ]
    
    speaker_names = [s["name"] for s in speakers]
    full_transcript = []
    current_transcript_text = ""
    
    segments = outline.get("segments", [])
    
    for i, segment in enumerate(segments):
        is_final = (i == len(segments) - 1)
        
        prompt_text = prompter.render(
            briefing="Create an engaging deep-dive podcast based on the provided material.",
            context=context,
            speakers=speakers,
            speaker_names=speaker_names,
            outline=json.dumps(outline),
            segment=json.dumps(segment),
            transcript=current_transcript_text,
            is_final=is_final,
            turns=4,
            format_instructions="Return JSON with a 'transcript' array containing 'speaker' and 'dialogue'."
        )
        
        response = llm.invoke([SystemMessage(content=prompt_text)])
        
        try:
            content = response.content
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].strip()
                
            segment_data = json.loads(content)
            segment_transcript = segment_data.get("transcript", [])
            
            # Append to full transcript list
            full_transcript.extend(segment_transcript)
            
            # Update running text context for next segment
            for line in segment_transcript:
                current_transcript_text += f"{line['speaker']}: {line['dialogue']}\n"
                
        except Exception as e:
            print(f"Error parsing segment {i}: {e}")
            
    return {"transcript": full_transcript}

def create_podcast_script_from_document(context: str) -> dict:
    """
    End-to-end function to take document context, form an outline, and generate a multi-speaker transcript.
    """
    outline = generate_podcast_outline(context, num_segments=3)
    transcript = generate_podcast_transcript(context, outline)
    
    return {
        "outline": outline,
        "transcript": transcript.get("transcript", [])
    }
