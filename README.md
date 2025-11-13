# SafeSats - Bitcoin Purchase Platform

![SafeSats](https://img.shields.io/badge/SafeSats-Bitcoin%20Platform-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-blue?style=for-the-badge&logo=tailwindcss)
![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)

## 🚀 Project Overview

SafeSats is a modern, secure Bitcoin purchasing platform that provides users with a seamless experience for buying Bitcoin using local payment methods. Built with React and featuring a sophisticated design system, SafeSats offers a professional-grade Bitcoin purchase interface with emphasis on security, user experience, and accessibility.

The platform serves as a comprehensive solution for Bitcoin purchases, featuring real-time market data, secure payment processing, and an intuitive user interface designed for both beginners and experienced Bitcoin buyers.

## ✨ Features

### 🎨 Hero Section
- **Smooth Color Transitions**: Dynamic gradient backgrounds with ambient glow effects
- **Interactive Phone Mockup**: 3D-styled mobile app preview with realistic shadows
- **Animated Statistics**: Live counters showing platform metrics (50K+ users, MK100M+ volume)
- **Payment Method Integration**: Visual showcase of supported payment methods (Mukuru, Mpamba, etc.)
- **Responsive Design**: Adaptive layout that hides complex elements on mobile devices

### 💰 Bitcoin Purchase System
- **Airtel Money Integration**: Full integration with Airtel Money API for seamless mobile payments
- **Real-time Bitcoin Pricing**: Live Bitcoin price feeds with automatic updates and fallback mechanisms
- **Multi-step Purchase Flow**: Intuitive 4-step process from amount selection to transaction completion
- **Payment Method Selection**: Support for multiple payment methods with extensible architecture
- **Transaction Management**: Complete transaction tracking, status updates, and history management
- **Form Validation**: Real-time validation with user-friendly error messages
- **Responsive Design**: Optimized for both desktop and mobile Bitcoin purchasing

### 🔄 Payment Processing
- **Secure API Integration**: Bank-level security with encrypted payment processing via Airtel Money API
- **Real-time Status Updates**: Live transaction status monitoring with automatic polling
- **Error Handling**: Comprehensive error handling with retry mechanisms and user feedback
- **Transaction History**: Complete audit trail with export functionality (JSON/CSV)
- **Loading States**: Smooth loading animations and progress indicators
- **Toast Notifications**: Real-time user feedback for all payment operations

### 💰 Purchase Section (Legacy)
- **Intersection Observer Animations**: Smooth fade-in effects triggered by scroll position
- **Step-by-Step Guide**: Visual walkthrough of the Bitcoin purchasing process
- **Interactive Phone Displays**: Animated mobile interfaces showing Bitcoin purchase actions
- **Progressive Enhancement**: Enhanced animations and transitions for better UX

### 🏆 Premier Platform Showcase
- **Feature Highlights**: Security, convenience, and trustworthiness emphasis
- **Icon Integration**: Custom SVG icons with hover effects
- **Glass Morphism Effects**: Modern backdrop blur and transparency effects
- **Gradient Overlays**: Seamless section transitions with custom gradient systems

### 💬 Customer Testimonials
- **Updated Customer Names**: Features real testimonials from:
  - Praise Bokosi
  - Chiyembekezi Chabuka
  - Limbani Banda
- **Star Rating System**: Visual 5-star rating displays
- **Avatar System**: Custom initial-based avatars with consistent styling
- **Responsive Grid**: Adaptive layout for different screen sizes

### 📝 Blog Section
- **CMS Integration**: Dynamic content management system
- **Category System**: Color-coded blog categories with custom styling
- **Featured Images**: Gradient-based placeholder system for blog posts
- **Reading Time Calculation**: Automatic reading time estimation
- **SEO Optimization**: Structured data and meta tag generation

### 📧 Newsletter Signup
- **Interactive Form**: Real-time validation and submission feedback
- **Status Indicators**: Success/error state management with visual feedback
- **Privacy Integration**: Built-in privacy policy links and compliance
- **Responsive Design**: Mobile-optimized form layout

### 🔗 Footer with Social Media
- **Custom X Logo SVG**: Hand-crafted X (Twitter) logo implementation for brand consistency
- **Phosphor Icons**: Instagram, Facebook, and LinkedIn icons from Phosphor Icons library
- **Partner Showcase**: Trusted partner logos with hover effects
- **Comprehensive Links**: Complete site navigation and legal pages

## 🛠 Technology Stack

### Core Technologies
- **React 19.1.0**: Latest React with concurrent features and improved performance
- **React Router DOM 7.7.0**: Advanced routing with data loading and error boundaries
- **Tailwind CSS 3.4.17**: Utility-first CSS framework with custom configuration

### UI & Icons
- **Phosphor React 1.4.1**: Comprehensive icon library for consistent iconography
- **Custom SVG Implementation**: Hand-crafted X logo for social media integration

### Development Tools
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer
- **React Scripts 5.0.1**: Build tooling and development server
- **React Helmet Async**: SEO and meta tag management

### Content Management
- **@uiw/react-md-editor 4.0.7**: Rich text editing capabilities
- **React Quill 2.0.0-beta.4**: Advanced WYSIWYG editor integration
- **Quill 2.0.3**: Core rich text editing engine

### Testing & Quality
- **Testing Library Suite**: Comprehensive testing utilities
  - @testing-library/react 16.3.0
  - @testing-library/jest-dom 6.6.3
  - @testing-library/user-event 13.5.0
- **Web Vitals 2.1.4**: Performance monitoring and optimization

## 📦 Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Git for version control

### Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Bernardo265/sats-website.git
   cd sats-website
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start Development Server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application

### Environment Setup
The application runs in development mode by default. For production builds:

```bash
npm run build
# or
yarn build
```

## 📁 Project Structure

```
sats-website/
├── public/                     # Static assets and HTML template
│   ├── images/                # Image assets (logos, partners, etc.)
│   ├── index.html             # Main HTML template
│   └── manifest.json          # PWA configuration
├── src/
│   ├── components/            # Reusable React components
│   │   ├── admin/            # Admin panel components
│   │   ├── common/           # Shared components (SEO, ErrorBoundary, etc.)
│   │   ├── layout/           # Layout components (Header, Footer)
│   │   ├── payment/          # Payment system components
│   │   └── sections/         # Page section components
│   ├── contexts/             # React Context providers (Payment, CMS)
│   ├── hooks/                # Custom React hooks (useToast, etc.)
│   ├── pages/                # Page components (BuyBitcoin, etc.)
│   ├── services/             # API services (Airtel Money, Bitcoin, Transaction)
│   ├── styles/               # CSS and styling files
│   ├── utils/                # Utility functions (config, error handling)
│   ├── __tests__/            # Test files (unit, integration)
│   ├── App.js                # Main application component
│   ├── App.css               # Global styles and animations
│   ├── index.js              # Application entry point
│   └── index.css             # Base Tailwind CSS imports
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
└── postcss.config.js         # PostCSS configuration
```

### Key Components

#### Layout Components
- **Header**: Navigation with mobile-responsive menu
- **Footer**: Social media links, partner showcase, and site navigation
- **Layout**: Main layout wrapper with background animations

#### Section Components
- **HeroSection**: Landing page hero with phone mockup and statistics
- **PurchaseSection**: Bitcoin purchase process walkthrough
- **PremierPlatformSection**: Platform features and benefits
- **TestimonialsSection**: Customer reviews and ratings
- **BlogSection**: Latest blog posts with CMS integration
- **NewsletterSection**: Email subscription with form validation

#### Payment Components
- **PaymentMethodSelector**: Interactive payment method selection with real-time validation
- **AirtelMoneyForm**: Secure Airtel Money payment form with phone number validation
- **TransactionStatus**: Real-time transaction status tracking with progress indicators
- **TransactionHistory**: Complete transaction history with filtering and export capabilities

#### Utility Components
- **SEOHead**: Meta tags and structured data management
- **RichTextEditor**: Content creation and editing interface
- **ErrorBoundary**: Application-wide error handling and recovery
- **LoadingSpinner**: Customizable loading states and animations
- **Toast**: User feedback notifications system

## 💳 Payment System Architecture

### Airtel Money Integration (Malawi)
The SafeSats platform features a complete Airtel Money payment integration specifically configured for the Malawian market, enabling users to purchase Bitcoin using their mobile money wallets:

#### Key Features
- **OAuth2 Authentication**: Secure API authentication with automatic token refresh
- **Phone Number Validation**: Real-time validation for Malawian Airtel Money numbers (+265 country code)
- **Transaction Tracking**: Complete transaction lifecycle management from initiation to completion
- **Status Polling**: Automatic status updates with exponential backoff retry logic
- **Error Handling**: Comprehensive error mapping and user-friendly messaging
- **Malawi Market Configuration**: Optimized for Malawian Kwacha (MWK) currency and local payment limits

#### Payment Flow
1. **Amount Selection**: Users enter the desired Bitcoin amount or fiat equivalent
2. **Payment Method Selection**: Choose from available payment methods (Airtel Money active)
3. **Payment Form**: Secure form with phone number validation and confirmation
4. **Transaction Processing**: Real-time status updates with USSD confirmation prompts
5. **Completion**: Bitcoin delivery confirmation with transaction receipt

#### Technical Implementation
- **Service Layer**: Modular service architecture with `airtelMoneyService`, `bitcoinService`, and `transactionService`
- **State Management**: React Context API for payment state with reducer pattern
- **Local Storage**: Transaction history persistence with export capabilities
- **Error Boundaries**: Application-level error handling with graceful degradation
- **Testing**: Comprehensive unit and integration tests for payment flows

### Malawi Market Configuration
- **Currency**: Malawian Kwacha (MWK) as the primary currency
- **Phone Numbers**: Support for Malawian phone number formats (+265 country code)
- **Payment Limits**: MWK 5,000 minimum to MWK 2,000,000 maximum purchase amounts
- **Timezone**: Africa/Blantyre timezone configuration
- **Locale**: English language with Malawian number formatting
- **API Endpoints**: Configured for Malawi-specific Airtel Money services

### Security Features
- **API Encryption**: All API communications use HTTPS with proper authentication
- **Input Validation**: Client-side and server-side validation for all payment data
- **Error Logging**: Comprehensive error tracking without exposing sensitive data
- **Token Management**: Secure token storage with automatic expiration handling

## 🎨 Styling System

### Gradient Transition System
The SafeSats website features a sophisticated gradient transition system that creates seamless visual flow between sections:

#### Color Palette
- **Primary Gradients**: Gray-900 → Gray-800 → Gray-700
- **Accent Colors**: Green-400 (primary), Blue-400 (secondary)
- **Background Effects**: Ambient glows with green and blue tints

#### Transition Classes
```css
.section-visible {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.section-hidden {
  opacity: 0;
  transform: translateY(50px);
}
```

#### Animation Features
- **Intersection Observer**: Scroll-triggered animations for performance
- **Float Animations**: Subtle floating effects for background elements
- **Button Hover Effects**: Enhanced interactions with transform and shadow
- **Glass Morphism**: Modern backdrop blur effects for cards and overlays

### Custom CSS Classes
- **btn-enhanced-hover**: Advanced button hover effects with transform and shadows
- **glow-green/glow-blue**: Subtle glow effects for interactive elements
- **phone-shadow**: Realistic 3D shadows for mobile mockups
- **gradient-text**: Gradient text effects for headings
- **glass-morphism**: Backdrop blur effects for modern UI elements

## 📚 Dependencies

### Production Dependencies
```json
{
  "@testing-library/dom": "^10.4.0",
  "@testing-library/jest-dom": "^6.6.3",
  "@testing-library/react": "^16.3.0",
  "@testing-library/user-event": "^13.5.0",
  "@uiw/react-md-editor": "^4.0.7",
  "phosphor-react": "^1.4.1",
  "quill": "^2.0.3",
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "react-helmet-async": "^2.0.5",
  "react-quill": "^2.0.0-beta.4",
  "react-router-dom": "^7.7.0",
  "react-scripts": "5.0.1",
  "web-vitals": "^2.1.4"
}
```

### Development Dependencies
```json
{
  "autoprefixer": "^10.4.21",
  "postcss": "^8.5.6",
  "tailwindcss": "^3.4.17"
}
```

### Key Package Purposes
- **phosphor-react**: Provides consistent iconography throughout the application
- **react-helmet-async**: Manages SEO meta tags and structured data
- **@uiw/react-md-editor**: Powers the blog content management system
- **react-quill**: Enables rich text editing capabilities
- **web-vitals**: Monitors and optimizes Core Web Vitals performance metrics

## 🔧 Development

### Available Scripts

#### Development
```bash
npm start          # Start development server on http://localhost:3000
npm test           # Run test suite in watch mode
npm run build      # Create production build in ./build directory
npm run eject      # Eject from Create React App (irreversible)
```

#### Development Workflow
1. **Local Development**: Use `npm start` for hot-reload development
2. **Testing**: Run `npm test` for continuous testing during development
3. **Building**: Use `npm run build` for production-ready builds
4. **Code Quality**: ESLint configuration ensures code consistency

### Custom Hooks
- **useIntersectionObserver**: Manages scroll-triggered animations
- **useAnalytics**: Tracks user interactions and reading progress
- **useCMS**: Handles content management system operations

### Performance Optimizations
- **Intersection Observer API**: Efficient scroll-based animations
- **Lazy Loading**: Components load only when needed
- **Image Optimization**: Optimized asset delivery
- **Code Splitting**: Automatic bundle optimization via React Router

## 🚀 Deployment

### Build Process
The application uses Create React App's build system for production deployment:

```bash
npm run build
```

This creates an optimized production build with:
- Minified JavaScript and CSS
- Asset optimization and compression
- Service worker for offline functionality
- Optimized bundle splitting

### Deployment Options

#### Static Hosting
- **Netlify**: Drag-and-drop deployment from build folder
- **Vercel**: Git-based deployment with automatic builds
- **GitHub Pages**: Direct deployment from repository

#### Traditional Hosting
- **Apache/Nginx**: Serve static files from build directory
- **CDN Integration**: CloudFlare, AWS CloudFront for global distribution

### Environment Configuration
- **Development**: Automatic hot-reload and debugging tools
- **Production**: Optimized builds with performance monitoring
- **Testing**: Isolated environment for quality assurance

### SEO & Performance
- **Meta Tags**: Comprehensive SEO optimization
- **Structured Data**: JSON-LD implementation for search engines
- **Core Web Vitals**: Performance monitoring and optimization
- **Accessibility**: WCAG compliance and screen reader support

---

## 📄 License

This project is proprietary software developed for SafeSats. All rights reserved.

## 🤝 Contributing

This is a private project. For internal development guidelines and contribution processes, please contact the development team.

## 📞 Support

For technical support or questions about the SafeSats platform:
- **Website**: [SafeSats Official](https://safesats.com)
- **Email**: support@safesats.com
- **Documentation**: Internal development wiki

---

**Built with ❤️ by the SafeSats Development Team**
