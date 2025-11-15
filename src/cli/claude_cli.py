#!/usr/bin/env python3
import os
import argparse
from anthropic import Anthropic
from dotenv import load_dotenv

def main():
    # Load environment variables from .env file
    load_dotenv()
    
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Claude CLI - Chat with Claude from the command line')
    parser.add_argument('prompt', help='Your message to Claude')
    parser.add_argument('-m', '--model', default='claude-3-haiku-20240307', 
                        help='Claude model to use (default: claude-3-haiku-20240307)')
    parser.add_argument('-t', '--max-tokens', type=int, default=1024,
                        help='Maximum tokens in response (default: 1024)')
    
    args = parser.parse_args()
    
    # Get API key from environment
    api_key = os.getenv('ANTHROPIC_API_KEY')
    if not api_key:
        print("Error: ANTHROPIC_API_KEY not found in environment variables or .env file")
        return 1
    
    # Initialize Anthropic client
    client = Anthropic(api_key=api_key)
    
    try:
        # Create message
        message = client.messages.create(
            model=args.model,
            max_tokens=args.max_tokens,
            messages=[
                {"role": "user", "content": args.prompt}
            ]
        )
        
        # Print response
        print(message.content[0].text)
        
    except Exception as e:
        print(f"\nAvailable models include:")
        print("  - claude-3-haiku-20240307 (fastest)")
        print("  - claude-3-sonnet-20240229")
        print("  - claude-3-opus-20240229 (most capable)")
        print("  - claude-3-5-sonnet-20241022")
        print(f"\nError: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())