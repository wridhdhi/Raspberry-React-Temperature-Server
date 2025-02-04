# RPi Temperature App

This project is a React application designed to monitor and display temperature data from a Raspberry Pi. The app includes various components to visualize real-time temperature data, historical temperature trends, and switch positions.

## Features

- **Live Temperature Monitoring**: Displays the current temperature from the Raspberry Pi.
- **Temperature History**: Shows a line chart of temperature data over the last 60 minutes.
- **Switch Control**: Allows users to view and change switch positions with passcode protection.
- **Configurable API Endpoint**: Users can configure the API endpoint for the Raspberry Pi.

## Components

- **TemperatureCard**: Displays the current temperature and the average temperature over the last minute.
- **TemperatureChart**: Shows a line chart of temperature data over the last 60 minutes.
- **NumberProtectedCarousel**: Displays and allows changing switch positions with passcode protection.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Configuration

The app allows users to configure the API endpoint for the Raspberry Pi. This can be done through the settings in the UI.

## Dependencies

- **React**: A JavaScript library for building user interfaces.
- **axios**: Promise-based HTTP client for the browser and Node.js.
- **react-circular-progressbar**: Circular progress bar component for React.
- **recharts**: A composable charting library built on React components.

## Folder Structure

- **src**: Contains the source code of the application.
  - **components**: Contains the React components used in the app.
    - **TemperatureCard.js**: Component for displaying the current temperature.
    - **TemperatureChart.js**: Component for displaying the temperature history.
    - **SwitchProtectedCarousel.js**: Component for displaying and changing switch positions.
  - **contexts**: Contains context providers for managing global state.
    - **IpContext.js**: Context for managing the API endpoint IP address.
  - **App.js**: The main app component.
  - **index.js**: The entry point of the application.

## Getting Started

To get started with the project, clone the repository and install the dependencies:

```bash
git clone https://github.com/yourusername/rpi_temperature_app.git
cd rpi_temperature_app
npm install
