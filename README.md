# Citadels.js

An implementation of the game of citadels in Node.js and JavaScript

## TL;DR

##### Install:
```bash
npm install
cd srv && npm install
```

##### Dev:

```bash
npm run dev 
```
```bash
cd srv && npm run dev:debug 
```

##### Prod:
```bash
cd srv && npm run prod 
```

## Installation

### 1. Install client dependencies:

```bash
npm install
```

### 2. Install server dependencies:

```bash
cd srv/
npm install
```

## Dev client

### Build every page in development mode:

```bash
npm run dev
```

### Build lobby page in development mode:

```bash
npm run dev:lobby
```

### Analyse lobby page's size:

```bash
npm run analyse:lobby
```

### Build game page in development mode:

```bash
npm run dev:game
```

### Analyse game page's size:

```bash
npm run analyse:game
```

## Prod client

### Build every page in production mode:

```bash
npm run dev
```


### Build lobby page in production mode:

```bash
npm run prod:lobby
```

### Build game page in production mode:

```bash
npm run prod:game
```

## Prod server

### Launch the server:

```bash
cd srv
npm run serve
```

## Dev server

### Dev server in watch mode with no logs:

```bash
cd srv
npm run dev
```

### Dev server in watch mode with citadels related logs (recommended):

```bash
cd srv
npm run dev:debug
```

### Dev server in watch mode with a bunch of logs from third parties: 

```bash
cd srv
npm run dev:debugall
```

### Simply test game logic: 

```bash
cd srv
npm run test:game
```




