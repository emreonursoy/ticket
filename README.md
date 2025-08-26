# Party Ticket - Holographic Next.js App

A beautiful, interactive holographic party ticket built with Next.js 14, featuring a double-sided card design with stunning visual effects.

## ✨ Features

- **Holographic Effects**: Advanced CSS animations with shifting gradients and overlays
- **Double-Sided Design**: Click to flip between front and back of the ticket
- **Responsive Design**: Optimized for all device sizes
- **Dark Mode**: Beautiful dark theme with gradient backgrounds
- **TypeScript**: Full type safety and IntelliSense support
- **SCSS Modules**: Organized and maintainable styling
- **Server-Side Rendering**: Built with Next.js App Router

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd party-ticket
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with dark mode
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles and animations
├── components/
│   └── HolographicTicket/
│       ├── HolographicTicket.tsx    # Main component
│       ├── HolographicTicket.module.scss  # Component styles
│       ├── types.ts                 # TypeScript interfaces
│       └── index.ts                 # Export file
```

## 🎨 Customization

### Ticket Data

The ticket content can be customized by passing a `ticketData` prop:

```tsx
import HolographicTicket from '@/components/HolographicTicket'

const customTicketData = {
  eventName: 'My Custom Event',
  date: 'January 15, 2025',
  time: '7:00 PM',
  location: 'Custom Venue',
  ticketNumber: 'CUSTOM-001',
  holderName: 'John Doe',
  eventDescription: 'Your custom event description...',
  terms: ['Custom term 1', 'Custom term 2']
}

<HolographicTicket ticketData={customTicketData} />
```

### Styling

The holographic effects can be customized in the SCSS module:

- **Colors**: Modify the gradient arrays in `.holographicBorder`
- **Animation Speed**: Adjust the `animation` duration values
- **Effects**: Customize the `holographicOverlay` and background patterns

## 🎭 Holographic Effects

The app implements several advanced CSS techniques:

- **CSS Gradients**: Multi-color shifting gradients
- **CSS Animations**: Smooth transitions and keyframe animations
- **CSS Transforms**: 3D card flipping with `preserve-3d`
- **CSS Blend Modes**: Overlay effects for enhanced visuals
- **CSS Masks**: Complex border effects with mask composition

## 🛠️ Built With

- [Next.js 14](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [SCSS](https://sass-lang.com/) - Advanced CSS preprocessing
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Wes Bos's holographic CSS ticket effect](https://wesbos.com/tip/holographic-css-ticket-effect)
- Holographic techniques from [Pokemon Cards CSS](https://github.com/simeydotme/pokemon-cards-css)
- Demo inspiration from [Poke Holo](https://poke-holo.simey.me/)

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.
