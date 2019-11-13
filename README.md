# PowerVIS: A Novel Way of Seeing On-Chip Power Delivery Networks

## Project Description: 
Visualize on-chip power delivery networks to detect early stage design violations

#### Team Members:
Luis Arredondo, Saisuma Dodda, and Farid Kenarangi 

#### Client:
Inna Partin-Vaisband

#### Link to data:
https://drive.google.com/file/d/1uDEPS6M6Pztt7iibR9m0RA1Dju6TvZFD/view

## Installation

This project requires NodeJS. Install the **LTS** version here: 

https://nodejs.org/ 

Clone the repository:

```
git clone https://github.com/arre1908/cs529-viz-project.git
```

Install the dependecies:

```
npm install
```

## Build for Production

Run webpack to bundle our source files (output to ```dist``` folder):

```
npm run build
```

## Run Development Server

Webpack development server automatically rebuilds and hot reloads on change. Run the server:

```
npm run start
```

The application will be running on http://localhost:8000 