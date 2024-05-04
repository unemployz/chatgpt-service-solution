
# ChatGPT Service Solution

A robust solution providing self-hosted ChatGPT service using OpenAI APIs, along with API endpoints, frontend application, and session storage capabilities.

This project employs the 'gpt-3.5-turbo' model API from OpenAI.

## Tech Stack
- Next.js (APIs and Frontend)
- OpenAI JS Lib (API calls to OpenAI)
- Mongo DB (FootballMatch History Storage)

## Getting Started
Update docker-compose.yml/.env file with OPEN AI API Key.
Start the Frontend + API server and run Mongo DB Docker containers -
```bash
docker compose up -d
```
Open http://localhost:3000 with your browser to view the result.

## Screenshots
![image](https://user-images.githubusercontent.com/8670239/216851178-c3c56d2a-a565-4899-af41-ae7caac2739a.png)
![image](https://user-images.githubusercontent.com/8670239/216851163-013271b0-2aae-4d17-89ec-f4b678f9d867.png)

## Login System
A simplified login system to segregate the conversation history by username.
![image](https://user-images.githubusercontent.com/8670239/217333449-2b25702d-2491-482f-aa1e-9bedd42a2bba.png)