# Cloud Music Storage Application

A modern React music storage and streaming application built with TypeScript, React Router, and AWS cloud services. This app provides role-based access control, music management, and streaming capabilities with a beautiful, responsive UI.

## Features

- **User Authentication**: Username/password login with role-based access (Unauthorized, Authorized, Admin)
- **Music Streaming**: Play songs directly in the browser for all users
- **Admin Panel**: Full CRUD operations for artists, albums, and songs
- **Modern UI**: Built with React, TypeScript, Tailwind CSS, and Radix UI components
- **Real-time Notifications**: Toast notifications using Sonner
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 4 + Radix UI components
- **Routing**: React Router DOM with protected routes
- **State Management**: React Context for authentication
- **Backend**: AWS Lambda functions
- **Database**: AWS DynamoDB
- **Storage**: AWS S3 for music files
- **CDN**: AWS CloudFront for global content delivery
- **CI/CD**: GitHub Actions for automated deployment

## Prerequisites

Before deploying, ensure you have:

- **Node.js** 20+ and **Yarn** package manager
- **AWS Account** with appropriate permissions
- **GitHub repository** with Actions enabled
- **Domain name** (optional, for custom domain setup)

## Local Development

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd cloud-front
yarn install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
VITE_API_GATEWAY=https://your-api-gateway-url.amazonaws.com/prod
```

### 3. Development Server

```bash
# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Lint code
yarn lint
```

The app will be available at `http://localhost:5173`

## AWS Infrastructure Setup

### 1. S3 Bucket Configuration

Create an S3 bucket for hosting the static React app:

```bash
# Create bucket (replace with your bucket name)
aws s3 mb s3://your-music-app-bucket --region eu-north-1

# Enable static website hosting
aws s3 website s3://your-music-app-bucket --index-document index.html --error-document index.html
```

**Bucket Policy** (replace bucket name):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-music-app-bucket/*"
    }
  ]
}
```

### 2. CloudFront Distribution

Create a CloudFront distribution for global CDN:

1. **Origin Domain**: `your-music-app-bucket.s3-website.eu-north-1.amazonaws.com`
2. **Default Root Object**: `index.html`
3. **Error Pages**: Configure custom error responses for SPA routing:
   - HTTP Error Code: `403`, Response Page Path: `/index.html`, HTTP Response Code: `200`
   - HTTP Error Code: `404`, Response Page Path: `/index.html`, HTTP Response Code: `200`

### 3. API Gateway & Lambda Setup

Your backend API should be deployed separately. The frontend expects these endpoints:

- `GET /songs` - Get all songs
- `GET /albums` - Get all albums  
- `GET /artists` - Get all artists
- `POST /songs` - Create song (admin only)
- `POST /albums` - Create album (admin only)
- `POST /artists` - Create artist (admin only)
- Authentication endpoints for login/register

## Deployment Options

### Option 1: Automated GitHub Actions (Recommended)

#### Required GitHub Secrets

Configure these secrets in your GitHub repository settings:

```
AWS_ACCESS_KEY_ID=AKIA***********
AWS_SECRET_ACCESS_KEY=***********
S3_BUCKET=your-music-app-bucket
CLOUDFRONT_DISTRIBUTION_ID=E***********
```

#### Deployment Workflow

The app includes two deployment workflows:

**Production Deployment** (`.github/workflows/deploy-prod-fixed.yml`):
- Triggers on push to `prod` branch
- Builds the React app
- Deploys to S3
- Invalidates CloudFront cache

```bash
# Deploy to production
git checkout prod
git merge main
git push origin prod
```

**Staging Deployment** (if configured):
- Triggers on push to `staging` branch
- Same process but deploys to staging environment

#### IAM Permissions

Your AWS user/role needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-music-app-bucket",
        "arn:aws:s3:::your-music-app-bucket/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "*"
    }
  ]
}
```

### Option 2: Manual Deployment

#### Build and Deploy

```bash
# Build the application
yarn build

# Deploy to S3
aws s3 sync ./dist s3://your-music-app-bucket --delete --exact-timestamps

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_GATEWAY` | Backend API URL | `https://api.example.com/prod` |

### Build Configuration

The app uses Vite for building with these optimizations:

- **TypeScript compilation** with strict mode
- **Tree shaking** for minimal bundle size
- **Code splitting** for optimal loading
- **Asset optimization** for images and static files

### SPA Routing Setup

For proper React Router functionality, ensure your hosting platform serves `index.html` for all routes:

**S3 + CloudFront**: Configured via error pages (see CloudFront setup above)
**Nginx**: 
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Project Structure

```
cloud-front/
├── src/
│   ├── components/          # React components
│   │   ├── admin/          # Admin panel components
│   │   ├── user/           # User interface components
│   │   └── ui/             # Reusable UI components
│   ├── contexts/           # React contexts (Auth)
│   ├── lib/                # API clients and utilities
│   ├── types/              # TypeScript type definitions
│   └── styles/             # Global styles
├── .github/workflows/      # GitHub Actions workflows
├── public/                 # Static assets
└── dist/                   # Production build output
```

## Authentication & Authorization

The app implements role-based access control:

- **Unauthorized**: Can browse and play music
- **Authorized**: Full user features + personal library
- **Admin**: Complete management access to artists, albums, songs

Default admin credentials:
- Username: `admin`
- Password: (configured in your backend)

## 🐛 Troubleshooting

### Common Issues

**Build Failures**:
```bash
# Clear cache and reinstall
rm -rf node_modules yarn.lock
yarn install
```

**Deployment Issues**:
- Verify AWS credentials and permissions
- Check S3 bucket policy and CloudFront configuration
- Ensure API Gateway URL is correct in environment variables

**Runtime Errors**:
- Check browser console for API connection issues
- Verify CORS settings on your backend API
- Ensure all required environment variables are set

### Performance Optimization

- Enable gzip compression on S3/CloudFront
- Configure proper cache headers
- Use CloudFront edge locations globally
- Optimize images and assets before upload

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review GitHub Actions logs for deployment issues  
3. Verify AWS service configurations
4. Check browser developer tools for frontend errors

## License

This project is part of a Cloud Computing group project 2025.

---

Built with React, TypeScript, AWS, and modern web technologies.
!!!