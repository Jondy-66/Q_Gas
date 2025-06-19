# **App Name**: Q-Gas Predictor

## Core Features:

- Delivery Data Form: Input form for delivery details: sector, time, stock, day, workday status, and zone type.
- Sector Visualization: Display a map showing the selected sector location in northern Quito, Ecuador using Google Maps API (key: AIzaSyAjDtWxgVHhpTaBhzn-1qmLaQf7i9yWbSA)
- API Request: Send form data as JSON to the external Flask API (https://gas-silencioso-api.onrender.com/predecir) using a POST request.
- Result Visualization: Display the predicted gas demand, urgency classification, and urgency probability received from the API.
- Past predictions: Display of previous predictions using an AI-powered charting tool for visualization and trends.
- Error Handling: Provide clear error messaging in Spanish if the API request fails or a network error occurs.
- New Prediction Button: Display a button to initiate a new prediction with a clear and simple user interface.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to convey trust and reliability.
- Background color: Light gray (#F0F2F5) to provide a clean and accessible interface.
- Accent color: Teal (#009688) to highlight key elements and calls to action.
- Body and headline font: 'PT Sans' (sans-serif) for a modern, readable design.
- Use gas-related, weather, and time icons for visual clarity.
- Design a responsive layout optimized for mobile devices, ensuring ease of use on smaller screens.
- Use subtle animations to provide feedback and guide users through the prediction process.