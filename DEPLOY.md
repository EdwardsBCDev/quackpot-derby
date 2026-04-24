# Deploy Quackpot Derby

This app needs a live Node server because it uses Socket.IO for the host and player screens.

## Recommended Setup

- Put the code in GitHub: `EdwardsBCDev/quackpot-derby`
- Run the app on the VPS with PM2
- Put Nginx or Caddy in front of it for HTTPS
- Set `PUBLIC_BASE_URL` to the final public URL so QR codes work on phones

Example final URLs:

- Host TV screen: `https://ducks.yourdomain.com/host`
- Player join screen: `https://ducks.yourdomain.com/play`

## 1. Push To GitHub

```bash
git init
git add .
git commit -m "Launch Quackpot Derby"
git branch -M main
git remote add origin git@github.com:EdwardsBCDev/quackpot-derby.git
git push -u origin main
```

## 2. Install On VPS

```bash
ssh user@your-vps-ip
git clone git@github.com:EdwardsBCDev/quackpot-derby.git
cd quackpot-derby
npm ci --omit=dev
npm install -g pm2
PUBLIC_BASE_URL=https://ducks.yourdomain.com pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Check it locally on the VPS:

```bash
curl http://127.0.0.1:3000/health
```

## 3. Reverse Proxy With Nginx

```nginx
server {
  server_name ducks.yourdomain.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

Then add HTTPS:

```bash
sudo certbot --nginx -d ducks.yourdomain.com
```

## Alternative: Reverse Proxy With Caddy

```caddyfile
ducks.yourdomain.com {
  reverse_proxy 127.0.0.1:3000
}
```

Caddy handles HTTPS automatically once the DNS points at the VPS.

## 4. Update Deployment

```bash
ssh user@your-vps-ip
cd quackpot-derby
git pull
npm ci --omit=dev
PUBLIC_BASE_URL=https://ducks.yourdomain.com pm2 restart quackpot-derby --update-env
```

## Key Notes

- Do not use GitHub Pages for this app; it is not static.
- QR codes must use a public URL, not `localhost`.
- If using the VPS IP directly for early testing, set `PUBLIC_BASE_URL=http://your-vps-ip:3000` and open firewall port `3000`.
- For proper family testing, use a domain with HTTPS so phones can join cleanly.
