#  Toki - Real-time Chat Platform

A modern, responsive real-time chat application built with React, TypeScript, and Socket.io. Create public or private chat rooms and enjoy seamless communication with beautiful UI/UX.

![Toki Chat Platform](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.0.4-purple?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-010101?style=for-the-badge&logo=socket.io)

##  Features

###  Core Features
- **Real-time Messaging**: Instant message delivery with Socket.io
- **Public & Private Rooms**: Create or join public rooms or password-protected private rooms
- **User Management**: See who's online and typing indicators
- **Message History**: View previous messages when joining a room
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

###  UI/UX Features
- **Dark/Light Mode**: Toggle between themes with system preference detection
- **Modern Design**: Beautiful gradient backgrounds and smooth animations
- **Real-time Typing Indicators**: See when someone is typing
- **Toast Notifications**: Success and error notifications
- **Custom Scrollbars**: Styled scrollbars for better UX
- **Responsive Layout**: Adaptive design for all screen sizes

###  Security Features
- **Password Protection**: Secure private rooms with passwords
- **Input Validation**: Comprehensive form validation
- **Error Handling**: Graceful error handling

##  Tech Stack

### Frontend
- **React 19.1.0** - Modern UI library
- **TypeScript 5.8.3** - Type-safe development
- **Vite 7.0.4** - Fast build tool and dev server
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **Socket.io Client 4.8.1** - Real-time communication
- **React Toastify 11.0.5** - Toast notifications
- **Lucide React 0.525.0** - Beautiful icons
- **Radix UI** - Accessible UI primitives

### Development Tools
- **ESLint 9.30.1** - Code linting
- **TypeScript ESLint 8.35.1** - TypeScript linting
- **Class Variance Authority** - Component variant management
- **Tailwind Merge** - Utility class merging

##  Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend server running (see backend repository)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/toki-frontend.git
cd toki-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
VITE_BACKEND_URI=http://localhost:3000
```

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`





##  UI Components

### AppShell
- Responsive header with logo and dark mode toggle
- Gradient backgrounds and smooth animations
- Online status indicator

### ChatRoom
- Real-time message display
- User list with online indicators
- Typing indicators
- Message input with send functionality
- Responsive design for mobile and desktop

### CreateRoom
- Room name validation
- Public/private room toggle
- Password protection for private rooms
- Form validation with error messages

### JoinRoom
- Public room selection
- Private room entry with password
- Username input
- Real-time room listing

##  Dark Mode

The app supports automatic dark mode detection based on system preferences and manual toggle. The theme is persisted in localStorage.

##  Responsive Design

- **Desktop**: Full-featured layout with sidebar
- **Tablet**: Adaptive layout with optimized spacing
- **Mobile**: Mobile-first design with touch-friendly interactions



##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

