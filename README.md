# zLeaks - Ransomware Intelligence Platform

A professional web application for tracking and analyzing ransomware incidents and data breaches. Built with Vue.js and designed with modern UI/UX principles.

## 🚀 Features

### Core Functionality
- **Real-time Data**: Fetches latest ransomware incidents from multiple APIs
- **Advanced Search**: Intelligent search across all incident fields
- **Smart Filtering**: Filter by ransomware groups, date ranges, and more
- **Sorting Options**: Sort by date, title, or group name
- **Responsive Pagination**: Efficient data browsing with customizable page sizes
- **Data Export**: Export filtered results to CSV format

### User Experience
- **Modern Design**: Clean, professional interface with dark/light themes
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Loading States**: Smooth loading animations and progress indicators
- **Error Handling**: Graceful fallbacks when data sources are unavailable
- **Keyboard Shortcuts**: Quick actions with keyboard commands (Ctrl+K for search)
- **Share Functionality**: Easy sharing of individual incidents

### Technical Features
- **Progressive Enhancement**: Works without JavaScript, enhanced with it
- **SEO Optimized**: Proper meta tags and semantic HTML structure
- **Security Headers**: Built-in security measures and content policies
- **Performance**: Optimized for fast loading and smooth interactions
- **Accessibility**: WCAG compliant with screen reader support

## 🛠 Technology Stack

- **Frontend**: Vue.js 2.x
- **Styling**: Modern CSS with CSS Custom Properties (CSS Variables)
- **Icons**: Font Awesome 6
- **Typography**: Inter font family
- **Build**: No build process required - runs directly in browser

## 📱 Screenshots

### Desktop View
- Professional header with statistics
- Advanced filtering and search capabilities
- Card-based incident display
- Comprehensive pagination

### Mobile View
- Responsive design that works on all devices
- Touch-friendly interface
- Optimized layouts for small screens

## 🚀 Getting Started

### Prerequisites
- Web server (Apache, Nginx, or simple Python/Node.js server)
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd inficted
   ```

2. **Serve the files**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   Navigate to `http://localhost:8000`

### Configuration

The application automatically fetches data from multiple sources:
1. Primary API: `https://data.ransomware.live/posts.json`
2. Fallback API: GitHub repository raw files
3. Local files: Local JSON files as last resort

## 🎨 Customization

### Theming
The application uses CSS Custom Properties for easy theming. Modify the `:root` variables in `resources/css/styles.css`:

```css
:root {
    --primary-color: #2563eb;
    --accent-color: #f59e0b;
    --text-primary: #0f172a;
    /* ... more variables */
}
```

### Data Sources
Update the API endpoints in `resources/js/app.js`:

```javascript
// Primary data source
const response = await fetch('your-api-endpoint');

// Fallback sources
const fallbackResponse = await fetch('your-fallback-endpoint');
```

## 📊 Data Structure

The application expects JSON data in the following format:

```json
[
    {
        "post_title": "Incident Title",
        "group_name": "RansomwareGroup",
        "published": "2024-01-15T10:30:00Z",
        "description": "Detailed description of the incident",
        "post_url": "https://original-source-url.com"
    }
]
```

## 🔧 Development

### File Structure
```
inficted/
├── index.html              # Main application file
├── favicon.ico             # Application favicon
├── resources/
│   ├── css/
│   │   └── styles.css      # Application styles
│   ├── js/
│   │   ├── app.js          # Vue.js application logic
│   │   └── db/             # Local data files
│   │       ├── posts.json  # Incident data
│   │       ├── groups.json # Ransomware group data
│   │       └── data.json   # Additional data
│   └── vue/                # Vue.js libraries
│       ├── vue.min.js
│       └── vuejs-paginate.js
└── README.md              # This file
```

### Key Components

#### Vue.js Application (`app.js`)
- **Data Management**: Handles API calls and data transformation
- **Filtering Logic**: Advanced search and filter functionality
- **UI State**: Manages loading states, pagination, and user interactions
- **Error Handling**: Graceful degradation when APIs are unavailable

#### Styling (`styles.css`)
- **CSS Variables**: Centralized theme management
- **Responsive Design**: Mobile-first approach with breakpoints
- **Component System**: Modular, reusable CSS components
- **Animations**: Smooth transitions and micro-interactions

## 🚀 Performance Optimizations

- **Efficient Rendering**: Virtual scrolling for large datasets
- **Smart Caching**: Local storage for frequently accessed data
- **Lazy Loading**: Progressive image and content loading
- **Minification**: Optimized CSS and JavaScript delivery
- **CDN Integration**: Fast font and icon delivery

## 🔒 Security Features

- **Content Security Policy**: Prevents XSS attacks
- **HTTPS Enforcement**: Secure data transmission
- **Input Sanitization**: Safe handling of user input
- **External Link Safety**: `noopener noreferrer` for external links

## 📈 Analytics & Monitoring

The application includes:
- **Performance Monitoring**: Page load and interaction metrics
- **Error Tracking**: Automatic error reporting and logging
- **Usage Analytics**: User behavior and feature adoption
- **Data Quality Metrics**: API response times and success rates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex functionality
- Test on multiple browsers and devices
- Ensure accessibility compliance
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Data Sources**: Thanks to the security research community
- **Libraries**: Vue.js, Font Awesome, and other open-source projects
- **Design Inspiration**: Modern security dashboards and threat intelligence platforms
- **Community**: Security researchers and developers who contribute to cybersecurity awareness

## 📞 Support

For support, issues, or feature requests:
- Open an issue on GitHub
- Contact the development team
- Check the documentation wiki

---

**⚠️ Disclaimer**: This platform is for security research and awareness purposes only. The information provided should be used responsibly and in accordance with applicable laws and ethical guidelines.

---

Made with ❤️ for the cybersecurity community