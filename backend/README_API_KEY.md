# Setting Up OpenAI API Key

The application uses OpenAI API for AI-powered features. You need to set up your API key to use these features.

## Option 1: Using a .env file (Recommended)

1. Create a file named `.env` in the `backend` directory
2. Add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```
3. Make sure `.env` is in your `.gitignore` file (it should be by default)

## Option 2: Using Environment Variable

### Windows (PowerShell):
```powershell
$env:OPENAI_API_KEY="sk-your-actual-api-key-here"
```

### Windows (Command Prompt):
```cmd
set OPENAI_API_KEY=sk-your-actual-api-key-here
```

### Linux/Mac:
```bash
export OPENAI_API_KEY=sk-your-actual-api-key-here
```

## Getting Your API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (it starts with `sk-`)
5. Paste it in your `.env` file or set it as an environment variable

## Important Notes

- Never commit your API key to version control
- The `.env` file should be in `.gitignore`
- If you don't set the API key, the app will still run but OpenAI features will return errors
- The API key is used for AI-generated replies, suggestions, and other AI features

