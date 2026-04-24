# Quackpot Derby

`Quackpot Derby` is a two-screen family game night app:

- The host runs the race show on a laptop or TV at `/host`
- Players join from phones through a QR code or room code at `/play`

Each player gets `£10`, picks one of `20` funky ducks, places a bet, then watches the host screen for the lineup, race, and results.

## Game Flow

1. Host opens `/host`
2. A room code and QR code are generated
3. Players join on `/play`, enter a name, and receive `£10`
4. Host opens betting
5. Players pick a duck and place a stake
6. Host closes betting
7. Ducks go to the line, then the race runs automatically
8. Results show, balances update, and the host opens the next race

## Local Run

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000/host`
- `http://localhost:3000/play`

## VPS Run

```bash
npm install
npm start
```

Set `PORT` if you do not want `3000`.

Set `PUBLIC_BASE_URL` to the URL or LAN address that player phones should open from the QR code.

Example on your local network:

```bash
PUBLIC_BASE_URL=http://192.168.1.42:3000 npm run dev
```

Example on your VPS:

```bash
PUBLIC_BASE_URL=https://your-domain.example npm start
```

## PM2

```bash
npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
```

## Docker

```bash
docker build -t quackpot-derby .
docker run -p 3000:3000 quackpot-derby
```

## GitHub

This app needs a Node server, so GitHub should be used for the repository, not static hosting. The live runtime should stay on your VPS.

Suggested repo:

- `EdwardsBCDev/quackpot-derby`

Push flow:

```bash
git init
git add .
git commit -m "Rebuild Quackpot Derby as host and player experience"
git branch -M main
git remote add origin git@github.com:EdwardsBCDev/quackpot-derby.git
git push -u origin main
```

## Notes

- State is currently in memory, so restarting the server resets rooms and balances
- The host can reset the game while keeping the same room and connected players
- If you run the host on `localhost`, the QR code will also point to `localhost`, which will not work on another device unless `PUBLIC_BASE_URL` is set
