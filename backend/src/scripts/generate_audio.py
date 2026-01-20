import sys
import asyncio
import edge_tts
import os
import time

async def generate_audio(text):
    # Use a high-quality neural voice
    # Voices like 'en-US-AriaNeural', 'en-GB-SoniaNeural', 'en-US-GuyNeural' are very natural
    VOICE = "en-US-AriaNeural"
    
    # Generate unique filename based on timestamp
    filename = f"audio_{int(time.time())}.mp3"
    output_path = os.path.join(os.path.dirname(__file__), filename)
    
    try:
        communicate = edge_tts.Communicate(text, VOICE)
        await communicate.save(output_path)
        
        # Print only the output path so Node.js can capture it
        print(output_path)
        sys.stdout.flush()
        
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: No text provided", file=sys.stderr)
        sys.exit(1)
        
    text_to_speak = sys.argv[1]
    
    # Run the async function
    try:
        asyncio.run(generate_audio(text_to_speak))
    except Exception as e:
        print(f"Critical Error: {str(e)}", file=sys.stderr)
        sys.exit(1)
