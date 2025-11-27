# 📄 Documentation Files

This folder contains documentation files for Sakukoro Pomodoro.

## Files

- `privacy-policy.html` - Privacy Policy page (required for Microsoft Store)

## 🌐 Hosting on GitHub Pages

To host the Privacy Policy on GitHub Pages:

### Method 1: Enable GitHub Pages (Recommended)

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **Deploy from a branch**
4. Select branch: **main** (or **master**)
5. Select folder: **/docs**
6. Click **Save**
7. Wait a few minutes for deployment

Your Privacy Policy will be available at:
```
https://[your-username].github.io/sakukoro-pomodoro/privacy-policy.html
```

### Method 2: Using GitHub Actions (Advanced)

Create `.github/workflows/deploy-docs.yml`:

```yaml
name: Deploy Docs

on:
  push:
    branches: [ main ]
    paths:
      - 'docs/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

## 📝 Update Privacy Policy URL

After hosting, update the Privacy Policy URL in:

1. **Microsoft Partner Center**
   - Store listings → Privacy policy
   - Enter: `https://[your-username].github.io/sakukoro-pomodoro/privacy-policy.html`

2. **package.json** (optional)
   ```json
   {
     "homepage": "https://[your-username].github.io/sakukoro-pomodoro"
   }
   ```

3. **README.md**
   - Add link to Privacy Policy

## 🔗 Custom Domain (Optional)

If you have a custom domain:

1. Add a `CNAME` file in the `docs/` folder:
   ```
   yourdomain.com
   ```

2. Configure DNS settings:
   - Add CNAME record pointing to `[your-username].github.io`

3. Privacy Policy URL becomes:
   ```
   https://yourdomain.com/privacy-policy.html
   ```

## ✅ Verify Deployment

After deployment, test the URL:
- Open in browser
- Check that page loads correctly
- Verify all links work
- Test on mobile devices

## 🛠️ Troubleshooting

### Page not found (404)
- Wait 5-10 minutes after enabling GitHub Pages
- Check that `docs/` folder is selected in Settings
- Verify file name is exactly `privacy-policy.html`

### Changes not showing
- Clear browser cache
- Wait a few minutes for GitHub Pages to rebuild
- Check GitHub Actions for deployment status

### Custom domain not working
- Verify DNS settings (can take 24-48 hours)
- Check CNAME file exists in docs/
- Enable "Enforce HTTPS" in GitHub Pages settings

## 📞 Need Help?

- GitHub Pages Docs: https://docs.github.com/pages
- GitHub Community: https://github.community/
